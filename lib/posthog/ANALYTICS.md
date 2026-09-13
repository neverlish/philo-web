# Practice and explorer analytics

## Application events

Uses the existing PostHog client. Custom events are enabled only in production
with `NEXT_PUBLIC_POSTHOG_KEY` and respect capture opt-out. Existing page views
and authentication identification are unchanged.

| Area | Events |
| --- | --- |
| Control practice | `control_practice_started`, `control_practice_completed`, `control_practice_reset` |
| Dialogue lifecycle | `dialogue_started`, `dialogue_message_submitted`, `dialogue_reply_received`, `dialogue_request_failed`, `dialogue_ended`, `dialogue_resumed` |
| Reflection tools | `dialogue_rewrite_used`, `dialogue_experiment_opened`, `dialogue_experiment_used`, `dialogue_reflection_compared` |
| Optional prescription | `dialogue_prescription_requested`, `dialogue_prescription_received`, `dialogue_prescription_failed` |
| API outcome | `preview_generation_succeeded`, `preview_generation_failed` |

Client properties are allowlisted in `practice-events.ts`: entry mode, intent,
turn count, fixed failure/end reason, interruption flag, and schema version.
No concern, answer, reflection, selected answer, or raw error is included.
Completion means the user submitted the practice, not that learning was proven.

API outcomes are scheduled after the response using the initialized client's
distinct/session IDs. Requests without valid correlation headers are skipped.
Server properties contain mode, HTTP status, session ID and schema version only.
An API success does not prove that the browser received/rendered the answer;
use `dialogue_reply_received` for that. Infrastructure/WAF rejections that do not
reach the handler cannot generate a server outcome.

Suggested funnels: start → message submitted → reply received → reflection
compared; control practice started → completed. Filter by `entry` to distinguish
direct dialogue from a prescription follow-up. Client and server success events
are separate measurements, not additive conversion counts.

## Public explorer pages

Six public routes under `/explore` use the existing initialized PostHog client
through `explorer-events.ts`. They emit production action events, including
`explorer_entry_clicked`, `explorer_started`, `explorer_scene_changed`,
`explorer_sequence_traversed`, philosopher/relation selection, reading and
experiment interactions. Loading failures use `explorer_load_failed` with a
fixed category, never a raw exception. Development and opt-out skip capture.

All properties are allowlisted public IDs, scene indices or booleans. The scene
container is masked and excluded from autocapture; selected answer values and
text are never manually captured. Existing page-view and login behavior is reused.
There is no new server mutation: scenes are local interactions. The existing
preview API outcome events described above cover the instrumented server work.

Suggested funnel: entry clicked → started → scene changed → sequence traversed.
Filter by `feature` (index, map, plato, aristotle, descartes, compare). A full
traversal means each scene has been visited, not understanding or learning.
Server-rendered metadata, descriptions and links are defined in
`lib/explorer/pages.ts`; the same registry supplies the sitemap.

## Local explorer prototypes

The seven `docs/philosophy-explorer-*.html` prototypes load
`../lib/posthog/explorer-prototype-events.js`. They remain ignored local files,
not production routes. Their events are **not sent to PostHog**.

The instrumentation records first interaction, philosopher/relation selection,
navigation destination, scene changes, full sequence traversal, experiment
interaction, reading, motion preference and resets. Only fixed public IDs,
indices and booleans are recorded, never answers or URL query strings.

Inspect in browser console:

```js
window.PhiloExplorerAnalytics.getEvents()
window.addEventListener('philo:analytics', event => console.log(event.detail))
window.PhiloExplorerAnalytics.clear()
```

The buffer holds at most 200 events, clears on navigation/reload, and uses no
SDK, network, cookies or persistent storage. All events have
`environment: 'prototype'`. A traversal requires visiting all scenes and is not
a learning/completion claim. `clear()` clears the buffer, not once-per-visit flags.
These original local files stay separate from the production routes above.

## Verification

```sh
npx vitest run lib/posthog components/practice app/api/prescription/preview/route.test.ts app/preview/dialogue
npx tsc --noEmit
```

Unit tests do not send real events. Deployment and production ingestion checks
are separate steps; no live events are implied by local test success.
