// Manual, paid-model smoke check using synthetic cases. Never run from the unit suite.
// Start the app locally, then: node evals/run-dialogue-quality.mjs --live
import { readFile } from 'node:fs/promises'

if (!process.argv.includes('--live')) {
  console.log('Start the app on localhost:3000, then pass --live to make 5 AI requests. Results need human rubric review; question counts alone are not quality scores.')
  process.exit(0)
}
const cases = JSON.parse(await readFile(new URL('./dialogue-quality.json', import.meta.url), 'utf8'))
for (const test of cases) {
  const { id, rubric, expectNoQuestion, ...payload } = test
  const response = await fetch('http://localhost:3000/api/prescription/preview', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'dialogue', ...payload }), signal: AbortSignal.timeout(35000),
  })
  const data = await response.json()
  if (!response.ok || typeof data.reply !== 'string') throw new Error(`${id}: HTTP ${response.status}`)
  const noQuestion = !/[?？]/.test(data.reply)
  if (expectNoQuestion && !noQuestion) process.exitCode = 1
  console.log(JSON.stringify({ id, rubric, noQuestionExpected: !!expectNoQuestion, noQuestion, reply: data.reply }))
}
