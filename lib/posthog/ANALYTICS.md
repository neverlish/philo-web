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
Entry clicks now include the allowlisted `source` (`home` or `philosopher`).
On philosopher pages, `feature` is the destination experience and `philosopher`
identifies the public guide. On home it remains `index`. Older entry events have
no source; do not interpret missing values as a particular entry point. Source
is a click property, not a persisted user/session property; compare funnels by
the entry event's source rather than expecting it on all later events.
Filter by `feature` (index, map, plato, aristotle, descartes, compare). A full
traversal means each scene has been visited, not understanding or learning.
Server-rendered metadata, descriptions and links are defined in
`lib/explorer/pages.ts`; the same registry supplies the sitemap.

### Continuation tracking on public pages

Aristotle's painting keeps a fixed editorial utterance while the user switches
three situations. `explorer_table_context_changed` records only `scene_index`
(0–2). Re-selecting the active situation does not emit. The initial situation
counts as presented; once all three have been presented,
`explorer_table_contexts_explored` fires once per mount, not proof of reading or
learning. No response selection, free text, extra pageview or API is introduced.
The interactive area is excluded from autocapture. Existing API outcomes and
login identification remain unchanged.

Plato's painting includes a local horizontal inspection control. Its distinct
`explorer_looking_started` and `explorer_looking_revealed` events fire once per
mount (first value change and crossing position 75). `explorer_looking_reset`
records an explicit reset; reset does not clear the once-per-mount milestones.
The reveal event means reaching a viewport position, not image loading or learning.
No slider values, pointer coordinates, or answers are captured. It does not emit
the existing five-scene `explorer_started`, avoiding duplicate funnel starts.
No new API is used; existing server outcomes and authentication tracking stay intact.

`explorer_artwork_opened` records an explicit click on the large-image link,
with current `feature` and allowlisted `visual_id` (plato, aristotle, descartes,
academy). It means intent to open, not proof the new tab loaded or learning occurred.
No image URL, alt text, user answer or new pageview event is added. Artwork loading
and passive scrolling are not counted as actions. Images remain ordinary crawlable
links with a new-tab notice. No server mutation is introduced.

`explorer_navigation_clicked` includes `feature` (the current experience),
`destination` (the next experience) and `placement` (`scene`, `recommendation`,
or `footer`). A destination of `map` identifies relationship-map entry.
`explorer_guide_clicked` captures the public philosopher ID; `explorer_home_clicked`
captures an explicit home click. Neither means the destination finished loading
or the user abandoned the service. Existing page views can confirm arrival.
Older navigation events lack placement; treat them as unknown, not as scene clicks.

Dialog `explorer_reading_closed` is emitted by native `close`, covering Escape
and buttons without double counting. A close does not imply the text was read.
Recommendations are static editorial suggestions, not inferred user profiles.
No new API or server-side action is introduced; existing API outcome tracking
and login identification remain unchanged.

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
