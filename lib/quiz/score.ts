import { QUESTIONS, type PhilosopherKey } from './data'

export function calculateResult(answers: number[]): PhilosopherKey {
  const scores: Record<PhilosopherKey, number> = {
    socrates: 0,
    nietzsche: 0,
    epictetus: 0,
    epicurus: 0,
    confucius: 0,
    kant: 0,
    zhuangzi: 0,
    kierkegaard: 0,
  }

  answers.forEach((choiceIndex, questionIndex) => {
    const question = QUESTIONS[questionIndex]
    if (!question) return
    const choice = question.choices[choiceIndex]
    if (!choice) return
    for (const [key, pts] of Object.entries(choice.scores)) {
      scores[key as PhilosopherKey] += pts
    }
  })

  const sorted = (Object.entries(scores) as [PhilosopherKey, number][]).sort(
    (a, b) => b[1] - a[1]
  )

  return sorted[0][0]
}
