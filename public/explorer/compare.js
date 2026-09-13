/* Curated experience; listeners live only for the supplied AbortSignal. */
window.PhiloExplorerMounts ??= {};
window.PhiloExplorerMounts['compare'] = (root, signal) => {
    const $ = s => root.querySelector(s);
    let phase = 0;
    const phases = [
        { pTitle: '익숙한 세계만 알고 있다면?', pBody: '그림자만 보아온 사람들의 장면에서 시작해요.', dTitle: '확실하다고 믿은 것이 틀릴 수 있다면?', dBody: '감각이나 추론에 오류가 있을 가능성을 검토해요.', title: '출발하는 장면이 달라요.', body: '한쪽은 제한된 시야의 비유로, 다른 쪽은 확실하다고 여긴 판단에 대한 의심으로 들어가요.' },
        { pTitle: '시선을 돌리고, 새롭게 배워요.', pBody: '동굴의 바깥을 향하는 길은 인식과 교육의 전환을 비유해요. 익숙함에서 벗어나는 어려움도 담겨 있어요.', dTitle: '의심 가능한 판단을 보류해요.', dBody: '확실하다고 여겼던 것을 검토해요. 사물이 없다는 증명이 아니라 확실한 출발점을 찾는 과정이에요.', title: '살펴보는 방식도 달라요.', body: '동굴의 비유와 방법적 회의를 똑같은 “의심하기 기술”로 묶지 않아요.' },
        { pTitle: '배움은 공동체의 질문으로 이어져요.', pBody: '선의 이데아와 교육, 동굴로 돌아갈 철학자의 역할까지 이야기가 이어져요.', dTitle: '생각하는 나에서 출발해요.', dBody: '의심하는 동안에도 생각하는 자신의 존재에 주목해요. 데카르트의 이후 논의는 이 체험의 범위 밖이에요.', title: '이번에 따라간 길은 서로 달라요.', body: '동굴에서는 교육과 귀환을, 방에서는 의심하는 나의 확실성을 살펴봤어요. 이것이 두 철학자 사상의 전부는 아니에요.' }
    ];
    function render(focus = true) { const s = phases[phase]; $('.pair').dataset.phase = String(phase); $('#plato-title').textContent = s.pTitle; $('#plato-body').textContent = s.pBody; $('#descartes-title').textContent = s.dTitle; $('#descartes-body').textContent = s.dBody; $('#difference').textContent = s.title; $('#difference-body').textContent = s.body; $('#next').textContent = phase === 2 ? '처음 질문 다시 보기 ↺' : '다음 질문으로 ⟶'; root.querySelectorAll('button[data-phase]').forEach(b => { if (Number(b.dataset.phase) === phase)
        b.setAttribute('aria-current', 'step');
    else
        b.removeAttribute('aria-current'); }); if (focus)
        $('#announcement').textContent = `${phase + 1}번째 비교. 플라톤: ${s.pTitle} ${s.pBody} 데카르트: ${s.dTitle} ${s.dBody}`; }
    root.querySelectorAll('button[data-phase]').forEach(b => b.addEventListener('click', () => { phase = Number(b.dataset.phase); render(); }, { signal }));
    $('#next').addEventListener('click', () => { phase = (phase + 1) % 3; render(); const active = $(`button[data-phase="${phase}"]`); active.focus({ preventScroll: true }); active.scrollIntoView({ block: 'start', behavior: 'instant' }); }, { signal });
    root.querySelector('a[href="#reading"]').addEventListener('click', () => { $('#reading').open = true; }, { signal });
    $('#motion').setAttribute('aria-pressed', String(matchMedia('(prefers-reduced-motion: reduce)').matches));
    root.classList.toggle('motion-off', $('#motion').getAttribute('aria-pressed') === 'true');
    $('#motion').addEventListener('click', () => { const on = $('#motion').getAttribute('aria-pressed') !== 'true'; $('#motion').setAttribute('aria-pressed', String(on)); root.classList.toggle('motion-off', on); }, { signal });
    render(false);
};
