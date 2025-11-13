
import requests
import streamlit as st

st.title("AI Payments Error Resolution - Demo")
api_url = st.text_input("API base URL", value="http://127.0.0.1:8000")
raw_code = st.text_input("raw_code (optional)")
raw_message = st.text_area("raw_message (optional)", height=120)

if st.button("Classify"):
    try:
        resp = requests.post(f"{api_url}/classify", json={"raw_code": raw_code, "raw_message": raw_message}, timeout=10)
        st.code(resp.json(), language="json")
    except Exception as e:
        st.error(str(e))
