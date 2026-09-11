# Guest AI rate limit

Vercel WAF enforces this before the function executes: POST `/api/prescription/preview`, 5 requests per IP per 600-second fixed window. Other routes are excluded. Shared IPs share the allowance; this is a burst limit, not a global spending cap or a per-person quota.

Initial prescriptions and `mode: "dialogue"` follow-ups share this allowance. Starting or ending the conversation locally does not call the API. Follow-up history is bounded to 16 alternating messages per request and is not stored in the account.

Applied on 2026-09-11 to project `prj_e20vTuLAGjzGrM0aMwKZROGFc8tg`, active version 1, rule `rule_guest_ai_preview_5_requests_per_10_minutes_wNt5rz`.

`preview-rate-limit.json` records the insertion payload, not an automatically deployed setting. Do not reinsert it on every deployment. Read the active configuration and update the existing rule by ID when changing limits. To roll back this rule, use `rules.remove` for that exact ID; do not disable the entire firewall.

Reference: https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting
