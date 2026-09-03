/**
 * 约会邀请主交互逻辑
 */
document.addEventListener('DOMContentLoaded', () => {
  const config = window.APP_CONFIG || {};

  // 1. 动态渲染基础信息
  const receiverElements = document.querySelectorAll('.receiver-name-text');
  receiverElements.forEach(el => el.textContent = config.receiverName || "小杰宝宝");

  const senderElements = document.querySelectorAll('.sender-name-text');
  senderElements.forEach(el => el.textContent = config.senderName || "航哥");

  // 渲染开场白
  const greetingEl = document.getElementById('letter-greeting');
  if (greetingEl && config.letterGreeting) greetingEl.textContent = config.letterGreeting;

  const letterContentEl = document.getElementById('letter-paragraphs');
  if (letterContentEl && config.letterBody) {
    letterContentEl.innerHTML = config.letterBody.map(p => `<p>${p}</p>`).join('');
  }

  // 渲染日程流程与选项
  const agendaListEl = document.getElementById('agenda-list');
  if (agendaListEl && config.agendaSchedule) {
    agendaListEl.innerHTML = config.agendaSchedule.map((item, index) => {
      let optionsHtml = '';
      if (item.options && item.options.length > 0) {
        optionsHtml = `
          <div class="options-container" data-agenda-index="${index}">
            <div class="options-label">✨ 请小杰宝宝点击选择心仪项：</div>
            <div class="options-pills">
              ${item.options.map((opt, i) => `
                <button type="button" class="option-pill ${i === 0 ? 'active' : ''}" data-value="${opt}">
                  ${opt}
                </button>
              `).join('')}
            </div>
          </div>
        `;
      }

      return `
        <div class="agenda-item">
          <div class="agenda-time-badge">${item.time}</div>
          <div class="agenda-content">
            <h4 class="agenda-title">${item.title}</h4>
            <p class="agenda-desc">${item.desc}</p>
            ${optionsHtml}
          </div>
        </div>
      `;
    }).join('');

    // 选项点击高亮逻辑
    document.querySelectorAll('.options-pills').forEach(container => {
      container.addEventListener('click', (e) => {
        const pill = e.target.closest('.option-pill');
        if (!pill) return;
        container.querySelectorAll('.option-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });
  }

  // 渲染男嘉宾承诺
  const promiseListEl = document.getElementById('promise-list');
  if (promiseListEl && config.promises) {
    promiseListEl.innerHTML = config.promises.map(p => `
      <li class="promise-item">
        <span class="promise-icon">📌</span>
        <span class="promise-text">${p}</span>
      </li>
    `).join('');
  }

  // 2. 步骤页面切换管理
  const steps = [
    'step-envelope',
    'step-letter',
    'step-agenda',
    'step-promises',
    'step-decision',
    'step-ticket'
  ];
  let currentStepIdx = 0;

  function goToStep(index) {
    steps.forEach((stepId, i) => {
      const stepEl = document.getElementById(stepId);
      if (stepEl) {
        if (i === index) {
          stepEl.classList.add('active');
          stepEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          stepEl.classList.remove('active');
        }
      }
    });
    currentStepIdx = index;
  }

  // 步骤按钮绑定
  document.getElementById('btn-open-envelope')?.addEventListener('click', () => goToStep(1));
  document.getElementById('btn-letter-next')?.addEventListener('click', () => goToStep(2));
  document.getElementById('btn-agenda-next')?.addEventListener('click', () => goToStep(3));
  document.getElementById('btn-promise-next')?.addEventListener('click', () => goToStep(4));

  // 3. 调皮逃跑的【狠心拒绝】按钮交互
  const rejectBtn = document.getElementById('btn-reject');
  let dodgeCount = 0;
  const dodgePhrases = [
    "再想想嘛🥺",
    "航哥会难过的💔",
    "点不中吧~😜",
    "按钮溜走啦！",
    "真的忍心拒绝吗🥺",
    "系统故障：只能同意哦❤️"
  ];

  function dodgeRejectButton(e) {
    if (e) e.preventDefault();
    dodgeCount++;
    
    // 更新拒绝按钮文案增加趣味性
    rejectBtn.textContent = dodgePhrases[dodgeCount % dodgePhrases.length];

    // 随机计算屏幕内的跳跃位置
    const padding = 20;
    const btnRect = rejectBtn.getBoundingClientRect();
    const maxX = window.innerWidth - btnRect.width - padding;
    const maxY = window.innerHeight - btnRect.height - padding;

    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));

    rejectBtn.style.position = 'fixed';
    rejectBtn.style.left = `${randomX}px`;
    rejectBtn.style.top = `${randomY}px`;
    rejectBtn.style.zIndex = '9999';
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('mouseenter', dodgeRejectButton);
    rejectBtn.addEventListener('touchstart', dodgeRejectButton, { passive: false });
    rejectBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dodgeRejectButton();
    });
  }

  // 4. 【同意约会】决策处理
  const acceptBtn = document.getElementById('btn-accept');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      // 收集对方选择的各项偏好
      const selections = [];
      document.querySelectorAll('.option-pill.active').forEach(pill => {
        selections.push(pill.dataset.value || pill.textContent.trim());
      });

      // 填充通票信息
      const ticketChoiceEl = document.getElementById('ticket-user-choice');
      if (ticketChoiceEl) {
        ticketChoiceEl.innerHTML = selections.length > 0 
          ? selections.map(s => `<span class="choice-tag">✨ ${s}</span>`).join('<br>')
          : "听小杰宝宝的心情安排";
      }

      const ticketDateEl = document.getElementById('ticket-date');
      if (ticketDateEl) {
        ticketDateEl.textContent = config.approvalDate || "9月5日";
      }

      // 跳转到通票页面
      goToStep(5);

      // 放烟花和爱心
      if (typeof window.launchCelebration === 'function') {
        window.launchCelebration();
      }

      // 静默发送微信提醒
      sendPushNotification(selections);
    });
  }

  // 5. 微信免服自动推送 (Pushplus)
  function sendPushNotification(choices) {
    const token = config.pushToken;
    if (!token || token.trim() === "") {
      console.log("未配置 pushToken，跳过微信消息推送。");
      return;
    }

    const title = `💌 小杰宝宝已批准你的周六约会申请！🎉`;
    const selectedText = choices.length > 0 ? choices.join(' | ') : '听小杰宝宝随时钦点';
    const content = `
      <h3>💖 周六约会申请审批通过！</h3>
      <p><b>同行人员：</b> ${config.senderName || '航哥'}</p>
      <p><b>特邀嘉宾：</b> ${config.receiverName || '小杰宝宝'}</p>
      <p><b>批复日期：</b> ${config.approvalDate || '9月5日'}</p>
      <p><b>宝宝心选项目：</b> ${selectedText}</p>
      <p>快快提前准备好，周五晚上接驾咯！✨</p>
    `;

    fetch('https://www.pushplus.plus/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: token.trim(),
        title: title,
        content: content,
        template: 'html'
      })
    })
    .then(res => res.json())
    .then(data => console.log("微信推送反馈：", data))
    .catch(err => console.warn("微信推送请求异常：", err));
  }
});
