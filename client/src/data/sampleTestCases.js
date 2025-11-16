export const sampleTestCases = [
  {
    id: "payment-avs",
    title: "Payment error – AVS mismatch",
    error_code: "PAYMENT_METHOD_ERROR",
    message: "Card declined: AVS mismatch from issuing bank.",
    trace:
      "psp:stripe\ncharge_id: ch_12x\navs_result: N\nnotes: retry with correct billing address or fallback to PayPal",
    category: "Payment errors",
  },
  {
    id: "ach-hold",
    title: "ACH return – micro-deposit mismatch",
    error_code: "ACH_RETURNED_PAYMENT",
    message: "ACH verification failed: micro-deposit values rejected by customer bank.",
    trace:
      "event: ach_return\ncode: R01\namounts: 0.12/0.08\nreason: account holder disputed values",
    category: "Payment errors",
  },
  {
    id: "jde-timeout",
    title: "JDE timeout while authorizing",
    error_code: "GATEWAY_TIMEOUT",
    message: "JDE auth service timed out after 30s waiting for response.",
    trace:
      "service: jde-payments\nendpoint: /v2/auth\ntimeout: 30s\ncorrelation_id: jde-9812",
    category: "JDE timeouts",
  },
  {
    id: "budget-cap",
    title: "Budget restriction at checkout",
    error_code: "BUDGET_LIMIT_EXCEEDED",
    message: "Department budget cap reached for this billing period.",
    trace:
      "policy: Q2-marketing\nlimit: 25000\nspent: 24975\nrequest: 1200",
    category: "Budget restrictions",
  },
  {
    id: "checkout-rule",
    title: "Checkout rule violation",
    error_code: "CHECKOUT_RULE_BLOCK",
    message: "Transaction blocked: checkout rule requires 3DS for international cards.",
    trace:
      "rule: INTL_3DS_REQUIRED\ncountry: BR\nissuer: Itau\n3ds: not_attempted",
    category: "Checkout rules",
  },
  {
    id: "license-expired",
    title: "License / DEA validation failed",
    error_code: "LICENSE_VERIFICATION_FAILED",
    message: "DEA license expired; renewal required before shipment.",
    trace:
      "dea_number: AB1234567\nstatus: expired\nexpired_on: 2024-12-31\nstate: TX",
    category: "License/DEA issues",
  },
  {
    id: "psp-webhook",
    title: "PSP webhook signature invalid",
    error_code: "WEBHOOK_SIGNATURE_MISMATCH",
    message: "Webhook rejected: signature does not match known secret for PSP.",
    trace:
      "psp: adyen\nendpoint: /webhooks/payments\nsignature: invalid\nsecret: rotated-2025-01",
    category: "Checkout rules",
  },
  {
    id: "retry-soft",
    title: "Soft decline – retry guidance",
    error_code: "PROCESSOR_SOFT_DECLINE",
    message: "Processor soft-decline: issuer unavailable, please retry with delay.",
    trace:
      "processor: visa\ndetail: 91 issuer or switch is inoperative\nretry_after: 3000ms",
    category: "Payment errors",
  },
];

export function findSampleCase(id) {
  return sampleTestCases.find((item) => item.id === id);
}
