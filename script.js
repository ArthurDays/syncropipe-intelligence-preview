const menuButton = document.querySelector('.menu-button');
const desktopNav = document.querySelector('.desktop-nav');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const matrixCanvas = document.getElementById('matrixCanvas');
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
let matrixCyan = 'rgba(0, 170, 181, .32)';
let matrixPurple = 'rgba(118, 31, 224, .38)';

const readPreference = (key, fallback) => {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
};

const savePreference = (key, value) => {
  try { localStorage.setItem(key, value); } catch { /* storage may be unavailable */ }
};

const refreshMatrixColors = () => {
  const styles = getComputedStyle(root);
  matrixCyan = styles.getPropertyValue('--matrix-cyan').trim() || matrixCyan;
  matrixPurple = styles.getPropertyValue('--matrix-purple').trim() || matrixPurple;
};

const applyTheme = (theme) => {
  const dark = theme === 'dark';
  root.dataset.theme = dark ? 'dark' : 'light';
  themeToggle.setAttribute('aria-pressed', String(dark));
  themeToggle.setAttribute('aria-label', dark ? 'Ativar modo claro' : 'Ativar modo escuro');
  themeToggle.querySelector('.theme-label').textContent = dark ? 'Modo claro' : 'Modo escuro';
  document.querySelector('meta[name="theme-color"]').setAttribute('content', dark ? '#07131f' : '#dbe6ee');
  refreshMatrixColors();
  savePreference('syncropipe-theme', root.dataset.theme);
};

applyTheme(readPreference('syncropipe-theme', 'light'));
themeToggle.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

const scrollMotion = document.getElementById('scrollMotion');
if (scrollMotion && !reduceMotion) {
  let motionFrame = 0;

  const updateScrollMotion = () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    scrollMotion.style.setProperty('--motion-a-y', `${-70 + progress * 240}px`);
    scrollMotion.style.setProperty('--motion-a-x', `${-20 + progress * 75}px`);
    scrollMotion.style.setProperty('--motion-b-y', `${90 - progress * 290}px`);
    scrollMotion.style.setProperty('--motion-b-x', `${40 - progress * 105}px`);
    scrollMotion.style.setProperty('--motion-rotate', `${progress * 32}deg`);
    scrollMotion.style.setProperty('--node-shift', `${progress * 150}px`);
    scrollMotion.style.setProperty('--node-shift-reverse', `${progress * -105}px`);
    scrollMotion.style.setProperty('--node-shift-soft', `${progress * 82}px`);
    scrollMotion.style.setProperty('--stream-offset', `${progress * 640}px`);
    motionFrame = 0;
  };

  const requestMotionUpdate = () => {
    if (!motionFrame) motionFrame = requestAnimationFrame(updateScrollMotion);
  };

  updateScrollMotion();
  window.addEventListener('scroll', requestMotionUpdate, { passive: true });
  window.addEventListener('resize', requestMotionUpdate, { passive: true });
}

document.querySelectorAll('.integration-track').forEach((track) => {
  const group = track.querySelector('.integration-group');
  if (!group) return;
  const duplicate = group.cloneNode(true);
  duplicate.setAttribute('aria-hidden', 'true');
  duplicate.querySelectorAll('article').forEach((tile) => tile.setAttribute('aria-hidden', 'true'));
  track.appendChild(duplicate);
});

if (matrixCanvas && !reduceMotion) {
  const context = matrixCanvas.getContext('2d');
  let pixelRatio = 1;
  let matrixFrame = 0;
  let matrixTimer = 0;
  let matrixReady = false;
  let lastMatrixPaint = 0;
  const lowPowerMatrix = () => window.innerWidth < 680 || navigator.connection?.saveData;

  const scheduleMatrix = (immediate = false) => {
    if (!matrixReady || document.hidden || matrixFrame || matrixTimer) return;
    // Em telas pequenas ou no modo de economia de dados, o desenho só muda
    // durante o scroll/resize: a grade continua viva sem gastar CPU em repouso.
    if (!immediate && lowPowerMatrix()) return;
    const delay = immediate
      ? (lowPowerMatrix() && lastMatrixPaint ? Math.max(0, 100 - (performance.now() - lastMatrixPaint)) : 0)
      : 55;
    if (delay === 0) {
      matrixFrame = requestAnimationFrame(drawMatrix);
      return;
    }
    matrixTimer = window.setTimeout(() => {
      matrixTimer = 0;
      if (!document.hidden) matrixFrame = requestAnimationFrame(drawMatrix);
    }, delay);
  };

  const resizeMatrix = () => {
    pixelRatio = Math.min(window.devicePixelRatio || 1, window.innerWidth < 680 ? 1 : 1.25);
    matrixCanvas.width = Math.floor(window.innerWidth * pixelRatio);
    matrixCanvas.height = Math.floor(window.innerHeight * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    if (matrixTimer) clearTimeout(matrixTimer);
    if (matrixFrame) cancelAnimationFrame(matrixFrame);
    matrixTimer = matrixFrame = 0;
    lastMatrixPaint = 0;
    matrixReady = true;
    scheduleMatrix(true);
  };

  const drawMatrix = (timestamp) => {
    matrixFrame = 0;
    lastMatrixPaint = timestamp;
    if (!document.hidden) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const compact = width < 680;
      const tile = compact ? 54 : 74;
      const gap = compact ? 5 : 7;
      const step = tile + gap;
      const scrollRange = Math.max(1, document.documentElement.scrollHeight - height);
      const scrollProgress = Math.min(1, window.scrollY / scrollRange);
      const offsetY = (window.scrollY * .045) % step;
      const offsetX = (window.scrollY * .018) % step;
      const rows = Math.ceil(height / step) + 3;
      const columns = Math.ceil(width / step) + 3;

      context.clearRect(0, 0, width, height);
      context.lineWidth = compact ? .8 : 1;

      for (let row = -2; row < rows; row += 1) {
        for (let column = -2; column < columns; column += 1) {
          const phase = timestamp * .00125 + row * .62 + column * .47 + scrollProgress * 9;
          const wave = (Math.sin(phase) + 1) / 2;
          const lift = Math.max(0, wave - .46) / .54;
          const depth = lift * (compact ? 5 : 9);
          const x = column * step - offsetX + (row % 2 ? step * .12 : 0);
          const y = row * step - offsetY;
          const accent = (row + column) % 4 === 0;

          context.fillStyle = `rgba(6, 28, 48, ${.028 + lift * .085})`;
          context.fillRect(x + 2, y + 2 - depth, tile - 4, tile - 4);

          if (depth > 1) {
            context.beginPath();
            context.moveTo(x + tile - 2, y + 2 - depth);
            context.lineTo(x + tile + depth, y + 6);
            context.lineTo(x + tile + depth, y + tile - 3);
            context.lineTo(x + tile - 2, y + tile - 2 - depth);
            context.closePath();
            context.fillStyle = `rgba(6, 28, 48, ${.035 + lift * .065})`;
            context.fill();
          }

          context.globalAlpha = .16 + lift * (compact ? .28 : .42);
          context.strokeStyle = accent ? matrixPurple : matrixCyan;
          context.shadowColor = accent ? matrixPurple : matrixCyan;
          context.shadowBlur = compact ? 0 : 4 + lift * 16;
          context.strokeRect(x + 2, y + 2 - depth, tile - 4, tile - 4);
          context.globalAlpha = 1;
          context.shadowBlur = 0;
        }
      }
    }
    scheduleMatrix();
  };

  // O canvas é decorativo: não disputa a primeira pintura com o título e a logo.
  if (document.readyState === 'complete') resizeMatrix();
  else window.addEventListener('load', resizeMatrix, { once: true });
  window.addEventListener('resize', resizeMatrix, { passive: true });
  window.addEventListener('scroll', () => {
    if (lowPowerMatrix()) scheduleMatrix(true);
  }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (matrixTimer) clearTimeout(matrixTimer);
      if (matrixFrame) cancelAnimationFrame(matrixFrame);
      matrixTimer = matrixFrame = 0;
    } else {
      scheduleMatrix(true);
    }
  });
}

if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.service-card, .info-card, .example-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const rotateX = ((y / bounds.height) - .5) * -3;
      const rotateY = ((x / bounds.width) - .5) * 3;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
      card.style.transform = `translateY(-8px) perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('transform');
    });
  });
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
  desktopNav.classList.toggle('open', !open);
});

document.querySelectorAll('.desktop-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    desktopNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && desktopNav.classList.contains('open')) {
    desktopNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    menuButton.focus();
  }
});

if ('IntersectionObserver' in window) {
  const clearCurrentAtTop = () => {
    if (window.scrollY > 120) return;
    document.querySelectorAll('.desktop-nav a').forEach((link) => {
      link.classList.remove('is-current');
      link.removeAttribute('aria-current');
    });
  };
  const navObserver = new IntersectionObserver((entries) => {
    if (window.scrollY <= 120) {
      clearCurrentAtTop();
      return;
    }
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('.desktop-nav a').forEach((link) => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('is-current', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-30% 0px -58% 0px' });
  document.querySelectorAll('.desktop-nav a[href^="#"]').forEach((link) => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) navObserver.observe(section);
  });
  window.addEventListener('scroll', clearCurrentAtTop, { passive: true });
  clearCurrentAtTop();
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

// Efeitos fora da tela ficam pausados sem interromper as faixas visíveis.
const ambientMotionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => entry.target.classList.toggle('motion-active', entry.isIntersecting));
}, { rootMargin: '100px 0px' });

document.querySelectorAll('.hero, .trust-strip, .service-card, .info-card, .integration-card, .ai-agent-panel, .example-card, .results-panel, .process-grid article, .faq-list details, .benefit-list article, .ai-agent-benefits article, .cta-card').forEach((element) => {
  element.classList.add('motion-region');
  ambientMotionObserver.observe(element);
});

const dialog = document.getElementById('briefingDialog');
const dialogButton = document.getElementById('briefingButton');
const footerDialogButton = document.getElementById('footerBriefingButton');
const closeButton = document.querySelector('.dialog-close');
const briefingForm = document.getElementById('briefingForm');
const formStatus = document.querySelector('.form-status');
const submitButton = briefingForm.querySelector('button[type="submit"]');
let pendingRequestId = null;
const createRequestId = () => {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  if (window.crypto?.getRandomValues) {
    const bytes = window.crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
  // O identificador serve para evitar linhas duplicadas, não como credencial.
  return `${Date.now().toString(16).padStart(12, '0')}${Math.random().toString(16).slice(2).padEnd(20, '0').slice(0, 20)}`;
};

const solutionField = briefingForm.elements.namedItem('solucao');
const openBriefing = (solution = '') => {
  formStatus.textContent = '';
  formStatus.removeAttribute('data-state');
  if (solution && solutionField) solutionField.value = solution;
  dialog.showModal();
  if (!document.body.classList.contains('preview-site')) briefingForm.elements.namedItem('nome')?.focus();
};

dialogButton.addEventListener('click', () => openBriefing());
footerDialogButton?.addEventListener('click', () => openBriefing());
document.querySelectorAll('a[href="#contato"]').forEach((link) => {
  link.setAttribute('aria-haspopup', 'dialog');
  link.addEventListener('click', (event) => {
    event.preventDefault();
    openBriefing(link.dataset.solucao || '');
  });
});
closeButton.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

briefingForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (document.body.classList.contains('preview-site')) return;
  if (!briefingForm.reportValidity() || submitButton.disabled) return;
  const data = new FormData(briefingForm);
  pendingRequestId ||= createRequestId();
  const payload = {
    request_id: pendingRequestId,
    nome: String(data.get('nome') || '').trim(),
    empresa: String(data.get('empresa') || '').trim(),
    email: String(data.get('email') || '').trim(),
    telefone: String(data.get('telefone') || '').trim(),
    solucao: String(data.get('solucao') || ''),
    desafio: String(data.get('desafio') || '').trim(),
    privacidade: data.get('privacidade') === 'on',
    website: String(data.get('website') || '')
  };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  submitButton.disabled = true;
  formStatus.removeAttribute('data-state');
  formStatus.textContent = 'Enviando seu pedido com segurança…';

  try {
    const response = await fetch(briefingForm.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'same-origin',
      cache: 'no-store',
      signal: controller.signal
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error('Falha no envio');
    formStatus.textContent = `Pedido recebido! Protocolo ${result.protocolo}. Entraremos em contato em breve.`;
    pendingRequestId = null;
    briefingForm.reset();
  } catch {
    formStatus.dataset.state = 'error';
    formStatus.textContent = 'Não foi possível confirmar o envio. Seus dados continuam no formulário; tente novamente em instantes.';
  } finally {
    clearTimeout(timeout);
    submitButton.disabled = false;
  }
});

document.querySelectorAll('[data-legal-target]').forEach((button) => {
  button.addEventListener('click', () => {
    const legalDialog = document.getElementById(button.dataset.legalTarget);
    legalDialog?.showModal();
  });
});

document.querySelectorAll('.legal-dialog').forEach((legalDialog) => {
  legalDialog.querySelector('.dialog-close')?.addEventListener('click', () => legalDialog.close());
  legalDialog.addEventListener('click', (event) => {
    if (event.target === legalDialog) legalDialog.close();
  });
});
