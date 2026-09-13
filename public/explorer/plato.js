/* Curated experience; listeners live only for the supplied AbortSignal. */
window.PhiloExplorerMounts ??= {};
window.PhiloExplorerMounts['plato'] = (root, signal) => {
    const scenes = [
        { place: '플라톤의 동굴에서', line: '평생 이 벽만<br>보아왔다면.', sub: '당신에게는 이 그림자가 세상의 전부였을지도 몰라요.', next: '천천히, 뒤돌아보기', touch: '그림자에 가까이', response: '윤곽은 달라지지만, 아직 무엇의 그림자인지는 보이지 않아요.', description: '어두운 동굴 벽에 사람 같은 윤곽의 그림자가 비칩니다. 버튼을 누르면 윤곽이 기울어집니다.' },
        { place: '익숙한 장면의 뒤편', line: '그림자에는<br>이유가 있었네요.', sub: '보이지 않았던 빛과 물체가 드러납니다.', next: '저 빛을 따라가 보기', touch: '빛의 길 살펴보기', response: '물체와 빛, 그리고 벽이 이어져 있었어요.', description: '동굴 안의 불빛과 물체가 보입니다. 버튼을 누르면 벽을 향하는 빛의 경로가 나타납니다.' },
        { place: '동굴의 문턱에서', line: '처음 보는 세상은<br>조금 낯설겠지요.', sub: '익숙한 설명을 바꾸는 일도 그럴 수 있어요.', next: '잠깐, 뒤를 돌아볼까요', touch: '문턱 살펴보기', response: '이 빛은 비유예요. 밝은 곳 자체가 진리라는 뜻은 아니에요.', description: '동굴의 큰 출구 너머에 산과 물이 보입니다. 버튼을 누르면 출구의 윤곽이 강조됩니다.' },
        { place: '아직 동굴 안에 있는 사람들', line: '혼자 알게 된 것으로<br>충분할까요?', sub: '당신이 본 것을, 어떻게 함께 나눌 수 있을까요?', next: '질문 하나를 가지고 나가기', touch: '안쪽 살펴보기', response: '함께 산다는 것은, 무엇을 배웠는지와도 연결될까요?', description: '동굴 밖에서 안을 바라봅니다. 입구 안에 두 사람이 있고, 버튼을 누르면 주변 빛이 조금 드러납니다.' },
        { place: '동굴 밖, 아직 끝나지 않은 이야기', line: '당신이 다시 보고 싶은<br>것은 무엇인가요?', sub: '지금 답하지 않아도 괜찮아요. 질문만 가져가도 돼요.', next: '다른 생각으로 걸어가기', touch: '잠시 머무르기', response: '이 장면은 잠시 그대로 있어요. 다음 행동은 당신이 골라도 돼요.', description: '멀리 산과 물이 보이고 열린 길이 이어집니다. 버튼을 누르면 길 위에 작은 빛 세 개가 나타납니다.' }
    ];
    const $ = s => root.querySelector(s), world = $('.world'), notes = $('#notes');
    const narrow = matchMedia('(max-width: 650px)');
    const frame = () => $('.land').setAttribute('viewBox', narrow.matches ? '150 0 1440 960' : '0 0 1440 960');
    narrow.addEventListener('change', frame, { signal });
    frame();
    let current = 0;
    const touched = scenes.map(() => false);
    function show(index, focus = true) {
        current = index;
        const s = scenes[index];
        world.dataset.scene = String(index);
        world.classList.toggle('touched', touched[index]);
        $('#place').textContent = s.place;
        $('#line').innerHTML = s.line;
        $('#subline').textContent = s.sub;
        $('#forward-label').textContent = s.next;
        $('#touch-label').textContent = s.touch;
        $('#stage-description').textContent = s.description;
        $('#touch').setAttribute('aria-pressed', String(touched[index]));
        $('#response').textContent = touched[index] ? s.response : '';
        $('#back').disabled = index === 0;
        root.querySelectorAll('[data-step]').forEach(b => { if (Number(b.dataset.step) === index)
            b.setAttribute('aria-current', 'step');
        else
            b.removeAttribute('aria-current'); });
        if (focus)
            $('#line').focus({ preventScroll: true });
    }
    $('#touch').addEventListener('click', () => { touched[current] = !touched[current]; show(current, false); }, { signal });
    $('#forward').addEventListener('click', () => { if (current < 4)
        show(current + 1);
    else
        location.href = '/explore/map'; }, { signal });
    $('#back').addEventListener('click', () => show(Math.max(0, current - 1)), { signal });
    root.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => show(Number(b.dataset.step)), { signal }));
    $('#open-notes').addEventListener('click', () => notes.showModal(), { signal });
    $('#close-notes').addEventListener('click', () => notes.close(), { signal });
    $('#motion').setAttribute('aria-pressed', String(matchMedia('(prefers-reduced-motion: reduce)').matches));
    root.classList.toggle('motion-off', $('#motion').getAttribute('aria-pressed') === 'true');
    $('#motion').addEventListener('click', () => { const active = $('#motion').getAttribute('aria-pressed') !== 'true'; $('#motion').setAttribute('aria-pressed', String(active)); root.classList.toggle('motion-off', active); }, { signal });
    show(0, false);
};
