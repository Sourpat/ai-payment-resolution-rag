import random
import re
from pathlib import Path

import pandas as pd

def _regex_to_hint_text(regex: str) -> str:
    if not regex:
        return ""
    # make regex human-ish (good enough for weak supervision)
    txt = re.sub(r"[\\\|\(\)\[\]\^\$\+\?\*\.]", " ", regex)
    txt = re.sub(r"\s+", " ", txt).strip()
    return txt

def load_training_examples(csv_path: str):
    """Build simple text/label examples from mappings.csv rows.

    We use provider_code / user_message / regex_hint to synthesize training text,
    with label = category.
    """
    df = pd.read_csv(csv_path, engine="python").fillna("")

    required = {"provider_code", "category", "user_message", "regex_hint"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"mappings.csv is missing columns: {missing}")

    examples = []
    for _, row in df.iterrows():
        code = str(row["provider_code"]).strip()
        category = str(row["category"]).strip()
        user_msg = str(row["user_message"]).strip()
        regex = str(row["regex_hint"]).strip()

        seed_texts = []
        if user_msg:
            seed_texts.append(user_msg)
        if regex:
            seed_texts.append(_regex_to_hint_text(regex))

        # simple templates
        seed_texts.extend([
            f"Gateway returned code {code}",
            f"Error {code}: {user_msg or _regex_to_hint_text(regex)}",
            f"Payment failed: {user_msg or _regex_to_hint_text(regex)}",
        ])

        for t in seed_texts:
            t = " ".join(t.split())
            if not t:
                continue

            # base
            examples.append({"text": t, "label": category})

            # UPPER variant
            examples.append({"text": t.upper(), "label": category})

            # tiny typo variant
            if len(t) > 8:
                i = random.randint(1, min(6, len(t) - 2))
                typo = t[:i] + t[i+1:i+2] + t[i+2:]
                examples.append({"text": typo, "label": category})

    return examples
