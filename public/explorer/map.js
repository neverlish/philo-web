/* Curated experience; listeners live only for the supplied AbortSignal. */
window.PhiloExplorerMounts ??= {};
window.PhiloExplorerMounts['map'] = (root, signal) => {
    const $ = s => root.querySelector(s), space = $('.space'), reading = $('#reading');
    const descriptions = {
        plato: { kind: '플라톤', title: '동굴 이야기에서 만난 사람이에요.', body: '옆의 아리스토텔레스를 누르면 두 사람의 관계를 볼 수 있어요.' },
        aristotle: { kind: '아리스토텔레스 · 플라톤에게 배운 사람', title: '같은 학교에서 배웠어요.', body: '아리스토텔레스는 플라톤의 학교인 아카데미아에서 공부했어요. 하지만 배웠다고 해서 모든 생각이 같았다는 뜻은 아니에요.' },
        descartes: { kind: '데카르트 · 다른 시대의 철학자', title: '플라톤과 직접 만난 사이는 아니에요.', body: '“무엇을 안다고 할 수 있을까?”라는 질문으로 두 사람을 비교해보려 해요. 먼저 데카르트의 방에서 확실하다고 여겼던 것을 살펴보세요.' },
        learning: { kind: '플라톤 → 아리스토텔레스', title: '가르친 사람에서 배운 사람으로.', body: '화살표는 아리스토텔레스가 플라톤에게 배웠다는 뜻이에요. 두 사람의 모든 사상이 같다는 뜻은 아닙니다.' },
        comparison: { kind: '플라톤 ··· 데카르트', title: '같은 질문으로 비교해보는 거예요.', body: '점선은 직접 만났거나 영향을 주었다는 표시가 아니에요. “무엇을 안다고 할 수 있을까?”라는 질문을 통해 우리가 두 사람을 나란히 놓아본 거예요.' }
    };
    function select(key, focus = true) { space.dataset.selected = key; const d = descriptions[key]; $('#kind').textContent = d.kind; $('#story-title').textContent = d.title; $('#story-body').textContent = d.body; const aristotle = key === 'aristotle' || key === 'learning', descartes = key === 'descartes', comparison = key === 'comparison'; $('#story-link').hidden = false; $('#story-link').href = comparison ? '/explore/compare' : aristotle ? '/explore/aristotle' : descartes ? '/explore/descartes' : '/explore/plato'; $('#story-link').textContent = comparison ? '두 생각의 차이 나란히 보기 ⟶' : aristotle ? '아리스토텔레스의 생각 체험하기 ⟶' : descartes ? '데카르트의 방 들어가기 ⟶' : '동굴 이야기 다시 보기 ⟶'; $('#story-source').hidden = key === 'plato'; root.querySelectorAll('[data-select]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.select === key))); if (focus)
        $('#story-title').focus({ preventScroll: true }); }
    root.querySelectorAll('[data-select]').forEach(b => b.addEventListener('click', () => select(b.dataset.select), { signal }));
    $('#comparisons').addEventListener('click', () => { const enabled = $('#comparisons').getAttribute('aria-pressed') !== 'true'; $('#comparisons').setAttribute('aria-pressed', String(enabled)); $('#comparisons').textContent = enabled ? '배운 관계만 보기 −' : '다른 시대의 철학자도 비교해볼까요? +'; $('#legend').hidden = !enabled; space.classList.toggle('no-comparisons', !enabled); space.setAttribute('aria-label', enabled ? '실선: 플라톤에게 배운 아리스토텔레스. 점선: 플라톤과 직접 만난 것이 아니라 질문으로 비교하는 데카르트.' : '플라톤은 가르친 사람, 아리스토텔레스는 배운 사람입니다.'); if (enabled)
        select('comparison', false);
    else
        select('plato', false); }, { signal });
    ['#open-reading', '#story-source'].forEach(id => $(id).addEventListener('click', () => reading.showModal(), { signal }));
    $('#close-reading').addEventListener('click', () => reading.close(), { signal });
    $('#motion').setAttribute('aria-pressed', String(matchMedia('(prefers-reduced-motion: reduce)').matches));
    root.classList.toggle('motion-off', $('#motion').getAttribute('aria-pressed') === 'true');
    $('#motion').addEventListener('click', () => { const active = $('#motion').getAttribute('aria-pressed') !== 'true'; $('#motion').setAttribute('aria-pressed', String(active)); root.classList.toggle('motion-off', active); }, { signal });
    // Connect to the actual star centers, including responsive typography and wrapping.
    function positionPaths() { const bounds = space.getBoundingClientRect(); const point = id => { const r = $(`[data-select="${id}"] .light`).getBoundingClientRect(); return { x: (r.left + r.width / 2 - bounds.left) / bounds.width * 1000, y: (r.top + r.height / 2 - bounds.top) / bounds.height * 600 }; }; const p = point('plato'), a = point('aristotle'), d = point('descartes'); $('#learning-path').setAttribute('d', space.classList.contains('no-comparisons') ? `M${p.x + 25} ${p.y} L${a.x - 30} ${a.y}` : `M${p.x} ${p.y} Q${(p.x + a.x) / 2} ${Math.min(p.y, a.y) - 70} ${a.x - 15} ${a.y}`); if (!space.classList.contains('no-comparisons'))
        $('#comparison-path').setAttribute('d', `M${p.x} ${p.y} Q${p.x + 80} ${d.y + 65} ${d.x} ${d.y}`); }
    const observer = new ResizeObserver(positionPaths);
    observer.observe(space);
    signal.addEventListener("abort", () => observer.disconnect(), { once: true });
    $('#comparisons').addEventListener('click', positionPaths, { signal });
    positionPaths();
};
