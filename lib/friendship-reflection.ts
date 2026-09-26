export const REFLECTION_KEY = 'philo.friendship-reflection.v1'
export const EXPERIMENTS = ['상대의 뜻을 단정하기 전에 확인 질문 하나 하기', '일어난 사실과 내 해석을 따로 적어보기', '지금은 질문만 가지고 있기'] as const
export type ReflectionRecord = { version: 1; savedAt: number; before: string; after: string; experiment: number; review: string }

export function parseReflection(raw: string, now = Date.now()): ReflectionRecord | null {
  try {
    const value = JSON.parse(raw)
    if (!value || value.version !== 1 || !Number.isFinite(value.savedAt) || value.savedAt > now || now - value.savedAt > 30 * 86400000) return null
    if (!['before', 'after', 'review'].every(key => typeof value[key] === 'string' && value[key].length <= 600)) return null
    if (!Number.isInteger(value.experiment) || value.experiment < 0 || value.experiment >= EXPERIMENTS.length) return null
    return { version: 1, savedAt: value.savedAt, before: value.before, after: value.after, experiment: value.experiment, review: value.review }
  } catch { return null }
}
