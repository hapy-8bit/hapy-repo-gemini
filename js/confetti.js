/**
 * 轻量级撒花与粉红爱心动画粒子引擎
 * 纯原生 Canvas 编写，无需依赖第三方 CDN，加载零延迟
 */
(function() {
  function launchCelebration() {
    const canvas = document.createElement('canvas');
    canvas.id = 'celebration-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const colors = ['#ff4b72', '#ff85a2', '#ffd166', '#06d6a0', '#118ab2', '#ff70a6', '#ff9770'];

    // 生成爱心与彩屑粒子
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: width / 2 + (Math.random() - 0.5) * 60,
        y: height / 2 + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.8) * 18 - 4,
        size: Math.random() * 9 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        isHeart: Math.random() > 0.45,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.1,
        alpha: 1,
        decay: Math.random() * 0.005 + 0.004
      });
    }

    function drawHeart(c, x, y, size, color, alpha, rot) {
      c.save();
      c.translate(x, y);
      c.rotate(rot);
      c.globalAlpha = alpha;
      c.fillStyle = color;
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size * 1.2);
      c.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      c.closePath();
      c.fill();
      c.restore();
    }

    let animationFrame;
    function render() {
      ctx.clearRect(0, 0, width, height);

      let activeCount = 0;
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // 重力
        p.vx *= 0.98; // 阻力
        p.rotation += p.rotSpeed;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          activeCount++;
          if (p.isHeart) {
            drawHeart(ctx, p.x, p.y, p.size, p.color, Math.max(0, p.alpha), p.rotation);
          } else {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            ctx.restore();
          }
        }
      }

      if (activeCount > 0) {
        animationFrame = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrame);
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
    }

    render();
  }

  window.launchCelebration = launchCelebration;
})();
