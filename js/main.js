/**
 * 约会邀请主交互逻辑（包含移动端防消失与逃跑按钮适配）
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

  // 3. 调皮逃跑的【狠心拒绝】按钮交互（移动端专属适配，杜绝消失）
  const rejectBtn = document.getElementById('btn-reject');
  let dodgeCount = 0;
  const dodgePhrases = [
    "再想想嘛🥺",
    "航哥会难过的💔",
    "点不中吧~😜",
    "按钮溜走啦！",
    "真忍心拒绝呀🥺",
    "系统故障：只能同意哦❤️"
  ];

  function showCuteToast(msg) {
    let toast = document.querySelector('.cute-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'cute-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 1800);
  }

  function dodgeRejectButton(e) {
    if (e && e.cancelable) e.preventDefault();
    dodgeCount++;
    
    // 更新拒绝按钮文案增加趣味性
    rejectBtn.textContent = dodgePhrases[dodgeCount % dodgePhrases.length];

    // 获取移动端真实可视区域，适配 Safari / 微信顶部和底部导航栏
    const vpWidth = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    const vpHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    
    const btnWidth = Math.min(rejectBtn.offsetWidth || 150, 180);
    const btnHeight = rejectBtn.offsetHeight || 46;

    // 安全边界：严格限制在屏幕可视中心区，顶部避开80px，底部避开120px，左右各留20px
    const minX = 20;
    const maxX = Math.max(minX, vpWidth - btnWidth - 20);
    const minY = 90;
    const maxY = Math.max(minY, vpHeight - btnHeight - 120);

    const randomX = Math.floor(minX + Math.random() * (maxX - minX));
    const randomY = Math.floor(minY + Math.random() * (maxY - minY));

    // 保持固定定位并在屏幕中心区域流畅跳动，确保绝不消失
    rejectBtn.style.position = 'fixed';
    rejectBtn.style.width = `${btnWidth}px`;
    rejectBtn.style.left = `${randomX}px`;
    rejectBtn.style.top = `${randomY}px`;
    rejectBtn.style.zIndex = '9999';
    rejectBtn.style.margin = '0';
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('mouseenter', dodgeRejectButton);
    rejectBtn.addEventListener('touchstart', (e) => {
      dodgeRejectButton(e);
    }, { passive: false });
    
    rejectBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showCuteToast("小杰宝宝，系统提示：拒绝无效，只能批准哦~ 💖");
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
        ticketDateEl.textContent = config.approvalDate || "9月4日(晚) - 9月6日";
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

    const title = `💌 小杰宝宝已批准你的约会申请！🎉`;
    const selectedText = choices.length > 0 ? choices.join(' | ') : '听小杰宝宝随时钦点';
    const content = `
      <h3>💖 约会申请审批通过！</h3>
      <p><b>同行人员：</b> ${config.senderName || '航哥'}</p>
      <p><b>特邀嘉宾：</b> ${config.receiverName || '小杰宝宝'}</p>
      <p><b>批复日期：</b> ${config.approvalDate || '9月4日(晚) - 9月6日'}</p>
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
