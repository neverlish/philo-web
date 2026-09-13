/* Local prototype instrumentation only. No SDK, network, cookies or storage. */
(() => {
  if (window.PhiloExplorerAnalytics) return;
  const script = document.querySelector('script[data-explorer]');
  const page = script?.dataset.explorer;
  const pages = ['heritage', 'thought-map', 'plato-immersive', 'plato-mockup', 'aristotle', 'descartes', 'compare'];
  if (!pages.includes(page)) return;
  const events = [];
  let started = false;
  const visited = new Set(['0']);
  const inspected = new Set();
  const milestones = new Set();
  const departures = new WeakSet();
  document.addEventListener('click', event => {
    if (page === 'plato-immersive' && event.target instanceof Element && event.target.closest('#forward') && document.querySelector('.world')?.dataset.scene === '4') departures.add(event);
  }, true);
  function capture(event, properties = {}) {
    const detail = { event, properties: { ...properties, feature: page, environment: 'prototype', analytics_schema_version: 1 } };
    events.push(detail);
    if (events.length > 200) events.shift();
    window.dispatchEvent(new CustomEvent('philo:analytics', { detail: structuredClone(detail) }));
  }
  window.PhiloExplorerAnalytics = Object.freeze({
    getEvents: () => structuredClone(events),
    clear: () => { events.length = 0; },
  });
  function milestone(event) {
    if (milestones.has(event)) return;
    milestones.add(event); capture(event);
  }
  function step(index, total) {
    if (!/^[0-4]$/.test(index ?? '') || Number(index) >= total) return;
    capture('explorer_scene_changed', { scene_index: Number(index) });
    visited.add(index);
    // Traversal, not proof of understanding or completion of an exercise.
    if (visited.size === total) milestone('explorer_sequence_traversed');
  }
  const names = { 'philosophy-explorer-heritage.html': 'heritage', 'philosophy-explorer-thought-map.html': 'thought-map', 'philosophy-explorer-plato-immersive.html': 'plato-immersive', 'philosophy-explorer-plato-mockup.html': 'plato-mockup', 'philosophy-explorer-aristotle.html': 'aristotle', 'philosophy-explorer-descartes.html': 'descartes', 'philosophy-explorer-compare.html': 'compare' };
  document.addEventListener('click', event => {
    const element = event.target instanceof Element ? event.target.closest('button,a,summary') : null;
    if (!element || element.disabled) return;
    if (!started) { started = true; capture('explorer_started'); }
    if (element.matches('a')) {
      const url = new URL(element.getAttribute('href'), location.href);
      const destination = names[url.pathname.split('/').pop()];
      if (destination) capture('explorer_navigation_clicked', { destination });
      else if (url.hash === '#reading') capture('explorer_reading_opened');
      else if (url.protocol === 'https:') capture('explorer_source_clicked');
      return;
    }
    if (element.matches('summary')) { capture('explorer_reading_toggled', { opened: !element.parentElement.open }); return; }
    if (element.id === 'motion') { capture('explorer_motion_toggled', { enabled: element.getAttribute('aria-pressed') === 'true' }); return; }
    if (['open-reading', 'open-notes', 'story-source', 'learn'].includes(element.id)) capture('explorer_reading_opened');
    if (['close-reading', 'close-notes'].includes(element.id)) capture('explorer_reading_closed');
    const philosopher = element.dataset.philosopher;
    if (['plato', 'aristotle', 'descartes'].includes(philosopher)) capture('explorer_philosopher_selected', { philosopher });
    const selection = element.dataset.select;
    if (['plato', 'aristotle', 'descartes'].includes(selection)) capture('explorer_philosopher_selected', { philosopher: selection });
    if (['learning', 'comparison'].includes(selection)) capture('explorer_relation_selected', { relation_type: selection });
    if (element.id === 'comparisons') capture('explorer_comparison_toggled', { enabled: element.getAttribute('aria-pressed') === 'true' });
    if (page === 'plato-immersive') {
      if (element.matches('[data-step],#forward,#back')) {
        const index = document.querySelector('.world').dataset.scene;
        if (departures.has(event)) { capture('explorer_navigation_clicked', { destination: 'thought-map' }); return; }
        step(index, 5);
      }
      if (element.id === 'touch') capture('explorer_experiment_interacted', { enabled: element.getAttribute('aria-pressed') === 'true' });
    }
    if (page === 'plato-mockup') {
      if (element.matches('[data-step],#next,#previous,[data-restart]')) step(document.querySelector('[data-step][aria-current="step"]')?.dataset.step, 5);
      if (element.closest('[data-choice-group]')) capture('explorer_answer_selected');
      if (element.id === 'reading') capture('explorer_reading_toggled', { opened: element.getAttribute('aria-pressed') === 'true' });
      if (['shadow-toggle', 'ray-toggle', 'outside-next'].includes(element.id)) capture('explorer_experiment_interacted');
      if (element.id === 'map-toggle') capture('explorer_map_toggled', { opened: element.getAttribute('aria-expanded') === 'true' });
    }
    if (page === 'aristotle') {
      if (element.matches('[data-reply]')) capture('explorer_answer_selected'); // Never send the selected answer or its index.
      if (element.matches('button[data-context],#change-context')) step(document.querySelector('.stage').dataset.context, 3);
    }
    if (page === 'descartes') {
      if (element.matches('[data-object]') && ['0', '1', '2'].includes(element.dataset.object)) {
        const enabled = element.getAttribute('aria-pressed') === 'true';
        capture('explorer_object_toggled', { object: ['window', 'cup', 'notebook'][Number(element.dataset.object)], enabled });
        if (enabled) inspected.add(element.dataset.object);
        if (inspected.size === 3) milestone('explorer_all_objects_inspected');
      }
      if (element.id === 'remaining') capture(document.querySelector('#reading').open ? 'explorer_reading_opened' : 'explorer_conclusion_opened');
    }
    if (page === 'compare' && element.matches('button[data-phase],#next')) step(document.querySelector('.pair').dataset.phase, 3);
    if (['reset', 'outside-reset'].includes(element.id)) capture('explorer_reset');
  });
})();
