/* Curated experience; listeners live only for the supplied AbortSignal. */
window.PhiloExplorerMounts ??= {};
window.PhiloExplorerMounts['index'] = (root, signal) => {
    const $ = s => root.querySelector(s);
    const people = { plato: { name: '플라톤', era: '고대 그리스 · 동굴의 비유', question: '보이는 것이\n세상의 전부일까요?', description: '익숙한 그림자에서 고개를 돌려보세요.\n하나의 장면에서, 하나의 생각으로 들어갑니다.', link: '/explore/plato', action: '동굴 이야기 들어가기' }, aristotle: { name: '아리스토텔레스', era: '고대 그리스 · 중용', question: '같은 말이,\n언제나 적절할까요?', description: '같은 행동도 상황이 바뀌면 다르게 보일 수 있어요.\n한마디를 고르고, 상황을 바꿔봅니다.', link: '/explore/aristotle', action: '같은 말, 다른 상황 살펴보기' }, descartes: { name: '데카르트', era: '17세기 유럽 · 방법적 회의', question: '모든 것을 의심해도,\n남는 것이 있을까요?', description: '확실하다고 여긴 판단을 잠시 보류해보세요.\n그리고 의심하는 나에게 돌아옵니다.', link: '/explore/descartes', action: '의심하는 방 들어가기' } };
    $('#question').style.whiteSpace = 'pre-line';
    $('#description').style.whiteSpace = 'pre-line';
    root.querySelectorAll('[data-philosopher]').forEach(b => b.addEventListener('click', () => { const key = b.dataset.philosopher, p = people[key]; root.querySelectorAll('[data-philosopher]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); root.querySelectorAll('[data-painting]').forEach(img => { const active = img.dataset.painting === key; img.classList.toggle('current', active); img.setAttribute('aria-hidden', String(!active)); }); $('#name').textContent = p.name; $('#era').textContent = p.era; $('#question').textContent = p.question; $('#description').textContent = p.description; $('#enter').href = p.link; $('#enter').textContent = p.action + ' ⟶'; $('#announcement').textContent = p.name + '. ' + p.era + '. ' + p.question.replace('\n', ' '); }, { signal }));
    $('#motion').setAttribute('aria-pressed', String(matchMedia('(prefers-reduced-motion: reduce)').matches));
    root.classList.toggle('motion-off', $('#motion').getAttribute('aria-pressed') === 'true');
    $('#motion').addEventListener('click', () => { const on = $('#motion').getAttribute('aria-pressed') !== 'true'; $('#motion').setAttribute('aria-pressed', String(on)); root.classList.toggle('motion-off', on); }, { signal });
};
