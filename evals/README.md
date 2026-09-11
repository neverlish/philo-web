# Dialogue quality smoke checks

Use synthetic scenarios only. Never copy real user conversations into fixtures or logs.

1. Start the app locally with `npm run dev` (port 3000).
2. Run `node evals/run-dialogue-quality.mjs --live`.
3. Read every reply against its rubric. This makes five billable AI requests through the local API using its configured provider key. It is intentionally separate from unit tests and CI.

The script checks HTTP success and the absence of question marks in two cases. That does **not** prove an answer contains no implicit question, is factual, or is helpful. Rubrics require qualitative review. Model outputs vary between runs; a passing sample is not a guarantee.

## 2026-09-11 review

The first run of general prompt rules still repeated a question after two questions and introduced an unsupported claim about freelance income. After adding turn-specific guidance and an explicit warning against inventing external conditions, all five samples were reviewed again:

- Two values: acknowledged income and control of time without forcing a choice or guaranteeing income.
- Correction: dropped the recognition interpretation and addressed the rent concern; did not frame the correction as a new realization.
- Question loop: gave an observation without another question.
- User-owned change: compared the user's own earlier and later expressions, rather than attributing the AI's interpretation to the user.
- Rest: ended without another question or a task.

Question cadence currently detects question marks in the two latest assistant messages. It is a lightweight cue, not semantic question detection; question-like sentences without punctuation can be missed. Safety checks may appropriately override the cadence rule.
