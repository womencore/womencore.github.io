/* womencore — 공통 스크립트
 * ▼ 여기 4줄만 바꾸면 전체 페이지 버튼이 함께 바뀌어요.
 */
var WC_CONFIG = {
  // 카카오톡 채널 주소 (예: https://pf.kakao.com/_xxxxx). 비워 두면 카톡 버튼이 숨겨져요.
  kakao: 'https://pf.kakao.com/_NVxkxcj',
  // 1:1 코어진단세션 신청 구글폼
  diagnosisForm: 'https://docs.google.com/forms/d/e/1FAIpQLSf06JDe6KYYXsHl6hkROe6SylU8EgIZOMVfMouLW8ozJtniYQ/viewform',
  // 산후 방문수업 (래피드)
  visitClass: 'https://www.latpeed.com/products/ZGxY6',
  // 자가진단 연락처를 받을 구글폼 'formResponse' 주소와 항목 ID (README 참고). 비워 두면 카톡 안내로 대신해요.
  leadForm: { action: '', fields: { name: '', contact: '', birth: '', result: '' } }
};

(function () {
  // 링크 채우기
  document.querySelectorAll('[data-link]').forEach(function (a) {
    var key = a.getAttribute('data-link');
    var url = WC_CONFIG[key];
    if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
    else if (key === 'kakao') { a.style.display = 'none'; }
  });

  // 모바일 메뉴
  var btn = document.querySelector('.menu-btn');
  var nav = document.querySelector('.nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); }); });
  }


  // ===== SNS 최근 소식 =====
  document.querySelectorAll('.feed[data-feed]').forEach(function (box) {
    var en = box.getAttribute('data-lang') === 'en';
    var names = { instagram: 'Instagram', youtube: 'YouTube', blog: en ? 'Naver Blog' : '네이버 블로그' };
    function fmt(d) { return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0'); }
    function ago(d) {
      var days = Math.floor((Date.now() - d.getTime()) / 86400000);
      if (days <= 0) return en ? 'today' : '오늘';
      if (days === 1) return en ? 'yesterday' : '어제';
      if (days < 30) return en ? days + ' days ago' : days + '일 전';
      return '';
    }
    function esc(t) { var e = document.createElement('i'); e.textContent = t || ''; return e.innerHTML; }
    fetch(box.getAttribute('data-feed'), { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var items = (data.items || []).slice(0, 8);
        if (!items.length) { box.hidden = true; return; }
        var latest = new Date(items[0].date);
        var up = box.parentNode.querySelector('.sns-updated');
        if (up) up.innerHTML = '<span class="dot"></span>' + up.getAttribute('data-label') + ' <b>' + fmt(latest) + '</b>' + (ago(latest) ? ' · ' + ago(latest) : '');
        box.innerHTML = items.map(function (it) {
          var d = new Date(it.date);
          return '<a class="post" href="' + esc(it.url) + '" target="_blank" rel="noopener">' +
            (it.image ? '<span class="thumb"><img loading="lazy" src="' + esc(it.image) + '" alt=""></span>' : '<span class="thumb thumb-text">' + esc(names[it.source]) + '</span>') +
            '<span class="meta"><em class="src src-' + it.source + '">' + esc(names[it.source] || it.source) + '</em><time datetime="' + esc(it.date) + '">' + fmt(d) + '</time></span>' +
            '<span class="cap">' + esc(it.title) + '</span></a>';
        }).join('');
      })
      .catch(function () { box.hidden = true; });
  });

  // ===== 1분 자가진단 =====
  var quiz = document.getElementById('quiz');
  if (!quiz) return;
  var T = JSON.parse(document.getElementById('quiz-text').textContent);
  var qs = T.questions;
  var i = 0, answers = [];
  var elQ = quiz.querySelector('.quiz-q');
  var elCount = quiz.querySelector('.quiz-count');
  var elBar = quiz.querySelector('.quiz-progress i');
  var elAsk = quiz.querySelector('.quiz-ask');
  var elRes = quiz.querySelector('.quiz-result');

  function render() {
    elCount.textContent = (i + 1) + ' / ' + qs.length;
    elQ.textContent = qs[i].q;
    elBar.style.width = (i / qs.length * 100) + '%';
  }
  quiz.querySelectorAll('.quiz-answers button').forEach(function (b) {
    b.addEventListener('click', function () {
      answers[i] = b.getAttribute('data-v') === '1';
      i++;
      if (i < qs.length) render(); else finish();
    });
  });

  function finish() {
    elBar.style.width = '100%';
    var score = answers.filter(Boolean).length;
    var leak = answers[qs.findIndex(function (q) { return q.safety; })];
    var tier = score >= 4 ? T.tiers[2] : score >= 2 ? T.tiers[1] : T.tiers[0];
    elAsk.hidden = true;
    elRes.hidden = false;
    elRes.querySelector('.score').textContent = T.scoreLabel.replace('{n}', score).replace('{t}', qs.length);
    elRes.querySelector('h3').textContent = tier.title;
    elRes.querySelector('.tier-text').textContent = tier.text;
    elRes.querySelector('.notice').hidden = !leak;
    var hidden = document.getElementById('lead-result');
    if (hidden) hidden.value = score + '/' + qs.length + ' — ' + tier.title + (leak ? ' (+safety)' : '');
  }
  var again = quiz.querySelector('.quiz-again');
  if (again) again.addEventListener('click', function () { i = 0; answers = []; elAsk.hidden = false; elRes.hidden = true; render(); });
  render();

  // ===== 연락처 받기 =====
  var form = document.getElementById('lead-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = form.querySelector('.form-msg');
    var lf = WC_CONFIG.leadForm;
    if (!lf.action) {
      msg.textContent = T.formPending;
      return;
    }
    var data = new FormData();
    data.append(lf.fields.name, form.name.value);
    data.append(lf.fields.contact, form.contact.value);
    data.append(lf.fields.birth, form.birth.value);
    data.append(lf.fields.result, form.result.value);
    fetch(lf.action, { method: 'POST', mode: 'no-cors', body: data })
      .then(function () { msg.textContent = T.formDone; form.reset(); })
      .catch(function () { msg.textContent = T.formError; });
  });
})();
