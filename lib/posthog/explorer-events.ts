import posthog from 'posthog-js'
import { EXPLORER_PAGES, type ExplorerSlug } from '@/lib/explorer/pages'

const EVENTS = ['explorer_entry_clicked', 'explorer_started', 'explorer_navigation_clicked', 'explorer_reading_opened', 'explorer_reading_closed', 'explorer_reading_toggled', 'explorer_source_clicked', 'explorer_motion_toggled', 'explorer_philosopher_selected', 'explorer_relation_selected', 'explorer_comparison_toggled', 'explorer_scene_changed', 'explorer_sequence_traversed', 'explorer_experiment_interacted', 'explorer_answer_selected', 'explorer_object_toggled', 'explorer_all_objects_inspected', 'explorer_conclusion_opened', 'explorer_reset', 'explorer_load_failed'] as const
type ExplorerEvent = typeof EVENTS[number]

export function trackExplorer(event: ExplorerEvent, feature: ExplorerSlug, properties: Record<string, unknown> = {}) {
  if (process.env.NODE_ENV !== 'production' || !process.env.NEXT_PUBLIC_POSTHOG_KEY) return
  if (!EVENTS.includes(event) || !Object.hasOwn(EXPLORER_PAGES, feature)) return
  try {
    if (posthog.has_opted_out_capturing()) return
    const safe: Record<string, string | number | boolean> = {}
    for (const name of ['enabled', 'opened']) if (typeof properties[name] === 'boolean') safe[name] = properties[name]
    if (Number.isInteger(properties.scene_index) && Number(properties.scene_index) >= 0 && Number(properties.scene_index) <= 4) safe.scene_index = Number(properties.scene_index)
    for (const [name, values] of Object.entries({ philosopher: ['plato', 'aristotle', 'descartes'], destination: Object.keys(EXPLORER_PAGES), relation_type: ['learning', 'comparison'], object: ['window', 'cup', 'notebook'], reason: ['script_load', 'initialization'] })) {
      if (typeof properties[name] === 'string' && values.includes(properties[name])) safe[name] = properties[name]
    }
    posthog.capture(event, { ...safe, feature, environment: 'production', analytics_schema_version: 1 })
  } catch { /* Analytics cannot interrupt the experience. */ }
}

// Run after the scene controller so bubbling sees the rendered state.
// No DOM text, answer index, query string or raw exception enters the payload.
export function installExplorerTracking(root: HTMLElement, feature: ExplorerSlug, signal: AbortSignal, capture = trackExplorer) {
  let started = false
  const visited = new Set([0]), inspected = new Set<string>(), milestones = new Set<string>(), departures = new WeakSet<Event>()
  const emit = (event: ExplorerEvent, properties = {}) => capture(event, feature, properties)
  const milestone = (event: ExplorerEvent) => { if (!milestones.has(event)) { milestones.add(event); emit(event) } }
  const scene = (value: string | undefined, total: number) => {
    if (!/^[0-4]$/.test(value ?? '') || Number(value) >= total) return
    const scene_index = Number(value)
    emit('explorer_scene_changed', { scene_index }); visited.add(scene_index)
    if (visited.size === total) milestone('explorer_sequence_traversed')
  }
  root.addEventListener('click', event => {
    if (feature === 'plato' && event.target instanceof Element && event.target.closest('#forward') && root.querySelector<HTMLElement>('.world')?.dataset.scene === '4') departures.add(event)
  }, { capture: true, signal })
  root.addEventListener('click', event => {
    const el = event.target instanceof Element ? event.target.closest<HTMLElement>('button,a,summary') : null
    if (!el || el.matches(':disabled')) return
    if (!started) { started = true; emit('explorer_started') }
    if (el.matches('a')) {
      const url = new URL(el.getAttribute('href') ?? '', location.href)
      const destination = url.origin === location.origin ? Object.entries(EXPLORER_PAGES).find(([, p]) => p.path === url.pathname)?.[0] : undefined
      if (destination) emit('explorer_navigation_clicked', { destination })
      else if (url.origin === location.origin && url.pathname === location.pathname && url.hash === '#reading') emit('explorer_reading_opened')
      else if (url.protocol === 'https:' && url.origin !== location.origin) emit('explorer_source_clicked')
      return
    }
    if (el.matches('summary')) { emit('explorer_reading_toggled', { opened: !(el.parentElement as HTMLDetailsElement).open }); return }
    if (el.id === 'motion') { emit('explorer_motion_toggled', { enabled: el.getAttribute('aria-pressed') === 'true' }); return }
    if (['open-reading', 'open-notes', 'story-source', 'learn'].includes(el.id)) emit('explorer_reading_opened')
    if (['close-reading', 'close-notes'].includes(el.id)) emit('explorer_reading_closed')
    const selected = el.dataset.philosopher ?? el.dataset.select
    if (['plato', 'aristotle', 'descartes'].includes(selected ?? '')) emit('explorer_philosopher_selected', { philosopher: selected })
    if (['learning', 'comparison'].includes(selected ?? '')) emit('explorer_relation_selected', { relation_type: selected })
    if (el.id === 'comparisons') emit('explorer_comparison_toggled', { enabled: el.getAttribute('aria-pressed') === 'true' })
    if (feature === 'plato') {
      if (el.matches('[data-step],#forward,#back')) {
        if (departures.has(event)) emit('explorer_navigation_clicked', { destination: 'map' })
        else scene(root.querySelector<HTMLElement>('.world')?.dataset.scene, 5)
      }
      if (el.id === 'touch') emit('explorer_experiment_interacted', { enabled: el.getAttribute('aria-pressed') === 'true' })
    }
    if (feature === 'aristotle') {
      if (el.matches('[data-reply]')) emit('explorer_answer_selected')
      if (el.matches('button[data-context],#change-context')) scene(root.querySelector<HTMLElement>('.stage')?.dataset.context, 3)
    }
    if (feature === 'descartes') {
      if (el.matches('[data-object]') && ['0', '1', '2'].includes(el.dataset.object ?? '')) {
        const enabled = el.getAttribute('aria-pressed') === 'true'
        emit('explorer_object_toggled', { object: ['window', 'cup', 'notebook'][Number(el.dataset.object)], enabled })
        if (enabled) inspected.add(el.dataset.object!)
        if (inspected.size === 3) milestone('explorer_all_objects_inspected')
      }
      if (el.id === 'remaining') emit(root.querySelector<HTMLDialogElement>('#reading')?.open ? 'explorer_reading_opened' : 'explorer_conclusion_opened')
    }
    if (feature === 'compare' && el.matches('button[data-phase],#next')) scene(root.querySelector<HTMLElement>('.pair')?.dataset.phase, 3)
    if (el.id === 'reset') emit('explorer_reset')
  }, { signal })
}
