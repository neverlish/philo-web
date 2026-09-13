/* Curated experience; listeners live only for the supplied AbortSignal. */
window.PhiloExplorerMounts ??= {};
window.PhiloExplorerMounts['descartes'] = (root, signal) => {
    const $ = s => root.querySelector(s), reading = $('#reading');
    const held = [false, false, false];
    let conclusion = false;
    const items = [
        { kind: '창밖의 풍경 · 꿈의 가능성', title: '꿈에서도 이런 장면을 볼 수 있지 않을까요?', body: '여기서는 꿈일 가능성을 가정하며 판단을 보류해요. 실제로 지금 꿈을 꾸고 있다고 판정하는 것은 아닙니다.' },
        { kind: '눈앞의 컵 · 감각의 오류 가능성', title: '보이는 모습만으로 확신해도 될까요?', body: '감각이 때로 틀릴 수 있다는 점에서 시작해봐요. 이 컵이 없다는 결론을 내리는 것은 아니에요.' },
        { kind: '내가 쓴 풀이 · 추론 오류의 가능성', title: '맞다고 믿은 풀이에도 실수가 있을까요?', body: '결론을 확신했더라도 추론을 잘못했을 가능성을 검토해요. 모든 계산이 틀리다는 뜻은 아닙니다.' }
    ];
    function show(kind, title, body) { $('#kind').textContent = kind; $('#thought-title').textContent = title; $('#thought-body').textContent = body; }
    function render() { root.querySelectorAll('[data-object]').forEach(b => { const active = held[Number(b.dataset.object)]; b.setAttribute('aria-pressed', String(active)); b.querySelector('.state').textContent = active ? '판단 보류 · 다시 눌러 복원' : '눌러서 의심해보기'; }); $('#halo').hidden = !conclusion; $('#remaining').textContent = conclusion ? '데카르트의 설명 읽기 ↗' : '의심해도 남는 것 살펴보기 ⟶'; }
    root.querySelectorAll('[data-object]').forEach(b => b.addEventListener('click', () => { const i = Number(b.dataset.object); held[i] = !held[i]; conclusion = false; const d = items[i]; if (held[i])
        show(d.kind, d.title, d.body);
    else
        show('판단 보류를 되돌렸어요.', '원래 모습으로 다시 살펴봐요.', '이 조작은 생각을 잠시 보류했다 되돌리는 표현이에요. 사물의 존재를 증명하거나 없앤 것은 아닙니다.'); render(); $('#thought-title').focus({ preventScroll: true }); }, { signal }));
    $('#remaining').addEventListener('click', () => { if (conclusion) {
        reading.showModal();
        return;
    } conclusion = true; show('데카르트가 주목한 출발점', '지금, 의심하고 있는 나는요?', '다른 것들을 의심하더라도, 바로 그 의심을 하고 있다는 데 주목해보세요. 데카르트는 생각하는 자신의 존재에서 출발합니다.'); render(); $('#thought-title').focus({ preventScroll: true }); }, { signal });
    $('#reset').addEventListener('click', () => { held.fill(false); conclusion = false; render(); show('먼저, 하나를 살펴봐요.', '확실하다고 생각한 이유가 있나요?', '사물을 누르면, 그 판단을 다시 살펴볼 이유가 나타나요.'); }, { signal });
    $('#open-reading').addEventListener('click', () => reading.showModal(), { signal });
    $('#close-reading').addEventListener('click', () => reading.close(), { signal });
    $('#motion').setAttribute('aria-pressed', String(matchMedia('(prefers-reduced-motion: reduce)').matches));
    root.classList.toggle('motion-off', $('#motion').getAttribute('aria-pressed') === 'true');
    $('#motion').addEventListener('click', () => { const active = $('#motion').getAttribute('aria-pressed') !== 'true'; $('#motion').setAttribute('aria-pressed', String(active)); root.classList.toggle('motion-off', active); }, { signal });
    render();
};
