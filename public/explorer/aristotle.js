/* Curated experience; listeners live only for the supplied AbortSignal. */
window.PhiloExplorerMounts ??= {};
window.PhiloExplorerMounts['aristotle'] = (root, signal) => {
    const $ = s => root.querySelector(s), reading = $('#reading');
    const contexts = [
        { label: '처음 늦은 날', text: '친구는 처음 늦었고, 미리 연락했어요.', description: '나와 친구가 벤치에서 만납니다. 한 개의 시계는 이번 약속을 나타냅니다.', questions: ['미리 연락했다는 사실이, 이번 일을 넘기는 이유가 될까요?', '이미 들은 설명 외에, 더 확인하고 싶은 것이 있나요?', '약속의 중요성을 말하면서도 사정을 고려할 수 있을까요?'] },
        { label: '같은 일이 반복된 날', text: '시간을 지켜달라고 말했지만, 친구는 또 늦었어요.', description: '두 사람 위에 시계 세 개가 보입니다. 약속에 늦는 일이 반복되었다는 도식입니다.', questions: ['또 넘어가면, 친구는 당신이 기다리는 일을 어떻게 받아들일까요?', '이유를 듣는 것과 반복되는 문제를 말하는 일을 함께 할 수 있을까요?', '이미 한 부탁을 다시 전한다면 무엇을 더 분명히 하고 싶나요?'] },
        { label: '서로 다르게 알고 있던 날', text: '나는 2시, 친구는 2시 반이 약속인 줄 알았어요.', description: '두 사람 사이에 2시와 2시 반이 적힌 메모가 보입니다. 약속 시간에 대한 오해입니다.', questions: ['친구의 잘못으로 넘기기 전에, 약속을 어떻게 정했는지 확인할까요?', '서로 무엇을 다르게 이해했는지부터 살펴볼 수 있겠어요.', '시간을 지켜달라는 부탁 전에, 같은 시간을 약속했는지 확인할까요?'] }
    ];
    const replies = ['이번에는 넘어갈게.', '무슨 일이 있었어?', '다음엔 시간을 지켜줘.'];
    let context = 0, reply = null;
    function render(changed = false) { const c = contexts[context]; $('.stage').dataset.context = String(context); $('#context-label').textContent = c.label; $('#context-text').textContent = c.text; $('#scene-description').textContent = c.description; $('#speech').textContent = reply === null ? '어떤 말을 건넬까요?' : replies[reply]; $('#kept').textContent = changed && reply !== null ? '상황은 달라졌지만, 고른 말은 그대로 두었어요.' : ''; $('#reflection').textContent = reply === null ? '말을 고른 뒤 상황을 바꿔보세요. 같은 말을 그대로 건네고 싶은가요?' : c.questions[reply]; root.querySelectorAll('[data-reply]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.reply) === reply))); root.querySelectorAll('button[data-context]').forEach(b => { if (Number(b.dataset.context) === context)
        b.setAttribute('aria-current', 'step');
    else
        b.removeAttribute('aria-current'); }); }
    root.querySelectorAll('[data-reply]').forEach(b => b.addEventListener('click', () => { reply = Number(b.dataset.reply); render(); }, { signal }));
    function change(index) { context = index; render(true); $('#context').focus({ preventScroll: true }); }
    $('#change-context').addEventListener('click', () => change((context + 1) % contexts.length), { signal });
    root.querySelectorAll('button[data-context]').forEach(b => b.addEventListener('click', () => change(Number(b.dataset.context)), { signal }));
    ['#open-reading', '#learn'].forEach(id => $(id).addEventListener('click', () => reading.showModal(), { signal }));
    $('#close-reading').addEventListener('click', () => reading.close(), { signal });
    $('#motion').setAttribute('aria-pressed', String(matchMedia('(prefers-reduced-motion: reduce)').matches));
    root.classList.toggle('motion-off', $('#motion').getAttribute('aria-pressed') === 'true');
    $('#motion').addEventListener('click', () => { const active = $('#motion').getAttribute('aria-pressed') !== 'true'; $('#motion').setAttribute('aria-pressed', String(active)); root.classList.toggle('motion-off', active); }, { signal });
    render();
};
