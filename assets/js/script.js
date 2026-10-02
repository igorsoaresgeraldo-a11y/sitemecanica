/* ==========================================================================
   AUTOCORE — Interações do site
   Header, menu mobile, animações de scroll, contador de números,
   slider antes/depois, serviços, validação de formulário e WhatsApp.
   ========================================================================== */

/* ---------------------------------------------------------------------------
   CONFIGURAÇÃO FÁCIL DE EDITAR
   --------------------------------------------------------------------------- */
const SITE = {
  // Número do WhatsApp no formato: 55 + DDD + número (sem espaços ou traços)
  whatsapp: '5511999999999',
  // Mensagem padrão ao tocar no botão flutuante
  whatsappDefault:
    'Olá! Gostaria de solicitar um orçamento para meu veículo.',
};

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

/* ---------------------------------------------------------------------------
   Links do WhatsApp (todos leem da configuração acima)
   --------------------------------------------------------------------------- */
function waLink(message) {
  return (
    'https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(message)
  );
}

document.querySelectorAll('[data-wa]').forEach((el) => {
  const custom = el.getAttribute('data-wa');
  el.setAttribute('href', waLink(custom || SITE.whatsappDefault));
  el.setAttribute('target', '_blank');
  el.setAttribute('rel', 'noopener noreferrer');
});

/* ---------------------------------------------------------------------------
   Header: fundo sólido ao rolar
   --------------------------------------------------------------------------- */
const header = document.querySelector('.site-header');

function onScrollHeader() {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 24);
}

onScrollHeader();

/* ---------------------------------------------------------------------------
   Menu mobile
   --------------------------------------------------------------------------- */
const menuBtn = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.getElementById('mobile-menu');

function closeMobileMenu() {
  if (!mobileMenu || !menuBtn) return;
  mobileMenu.classList.remove('is-open');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', closeMobileMenu)
  );

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });
}

/* ---------------------------------------------------------------------------
   Animações de entrada (scroll reveal)
   --------------------------------------------------------------------------- */
const revealEls = document.querySelectorAll('[data-reveal]');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
}

/* ---------------------------------------------------------------------------
   Contador de números (prova social)
   --------------------------------------------------------------------------- */
const stats = document.querySelectorAll('[data-count]');

function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();

  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const value = Math.round(target * eased);
    el.textContent = value.toLocaleString('pt-BR') + suffix;
    if (p < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

if (stats.length) {
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    stats.forEach((el) => {
      el.textContent =
        parseFloat(el.dataset.count).toLocaleString('pt-BR') +
        (el.dataset.suffix || '');
    });
  } else {
    const statsObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    stats.forEach((el) => statsObserver.observe(el));
  }
}

/* ---------------------------------------------------------------------------
   Parallax leve no hero
   --------------------------------------------------------------------------- */
const heroImg = document.querySelector('.hero__media img');
let ticking = false;

function applyParallax() {
  if (heroImg && !prefersReducedMotion) {
    const y = Math.min(window.scrollY, 900) * 0.16;
    heroImg.style.transform = 'translate3d(0,' + y + 'px,0) scale(1.06)';
  }
  ticking = false;
}

window.addEventListener(
  'scroll',
  () => {
    onScrollHeader();
    if (!ticking) {
      requestAnimationFrame(applyParallax);
      ticking = true;
    }
  },
  { passive: true }
);

applyParallax();

/* ---------------------------------------------------------------------------
   Slider Antes / Depois
   --------------------------------------------------------------------------- */
const ba = document.querySelector('[data-ba]');

if (ba) {
  const handle = ba.querySelector('.ba__handle');
  const setPos = (pct) => {
    const p = Math.max(0, Math.min(100, pct));
    ba.style.setProperty('--pos', p + '%');
    if (handle) handle.setAttribute('aria-valuenow', String(Math.round(p)));
  };

  const posFromEvent = (e) => {
    const rect = ba.getBoundingClientRect();
    return ((e.clientX - rect.left) / rect.width) * 100;
  };

  let dragging = false;

  ba.addEventListener('pointerdown', (e) => {
    dragging = true;
    ba.setPointerCapture(e.pointerId);
    setPos(posFromEvent(e));
  });

  ba.addEventListener('pointermove', (e) => {
    if (dragging) setPos(posFromEvent(e));
  });

  ['pointerup', 'pointercancel'].forEach((ev) =>
    ba.addEventListener(ev, () => {
      dragging = false;
    })
  );

  if (handle) {
    handle.addEventListener('keydown', (e) => {
      const current = parseFloat(getComputedStyle(ba).getPropertyValue('--pos')) || 50;
      if (e.key === 'ArrowLeft') {
        setPos(current - 4);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        setPos(current + 4);
        e.preventDefault();
      } else if (e.key === 'Home') {
        setPos(0);
        e.preventDefault();
      } else if (e.key === 'End') {
        setPos(100);
        e.preventDefault();
      }
    });
  }
}

/* ---------------------------------------------------------------------------
   "Ver todos os serviços" (expandir/ocultar painel)
   --------------------------------------------------------------------------- */
const toggleServices = document.querySelector('[data-toggle-services]');
const panelServices = document.getElementById('todos-servicos');

if (toggleServices && panelServices) {
  toggleServices.addEventListener('click', () => {
    const willOpen = panelServices.hasAttribute('hidden');
    if (willOpen) {
      panelServices.removeAttribute('hidden');
    } else {
      panelServices.setAttribute('hidden', '');
    }
    toggleServices.setAttribute('aria-expanded', String(willOpen));
    const label = toggleServices.querySelector('[data-label]');
    if (label) label.textContent = willOpen ? 'FECHAR lista' : 'VER TODOS OS SERVIÇOS';
  });
}

/* ---------------------------------------------------------------------------
   Cards de serviço → pré-selecionam o serviço no formulário
   --------------------------------------------------------------------------- */
const serviceSelect = document.getElementById('servico');

document.querySelectorAll('[data-service-target]').forEach((link) => {
  link.addEventListener('click', () => {
    if (!serviceSelect) return;
    const wanted = link.getAttribute('data-service-target').toLowerCase();
    const option = Array.from(serviceSelect.options).find(
      (o) => o.value.toLowerCase() === wanted
    );
    if (option) {
      serviceSelect.value = option.value;
      serviceSelect.classList.add('is-preselected');
      setTimeout(() => serviceSelect.classList.remove('is-preselected'), 1600);
    }
  });
});

/* ---------------------------------------------------------------------------
   Navegação ativa (seção visível no viewport)
   --------------------------------------------------------------------------- */
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

if ('IntersectionObserver' in window && navLinks.length) {
  const sections = {};
  navLinks.forEach((link) => {
    const id = link.getAttribute('href').slice(1);
    const sec = document.getElementById(id);
    if (sec) sections[id] = sec;
  });

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((l) =>
            l.classList.toggle(
              'is-active',
              l.getAttribute('href') === '#' + entry.target.id
            )
          );
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  Object.values(sections).forEach((sec) => navObserver.observe(sec));
}

/* ---------------------------------------------------------------------------
   Formulário de agendamento
   --------------------------------------------------------------------------- */
const form = document.getElementById('form-agendamento');
const successPanel = document.getElementById('form-success');
const waSummaryBtn = document.getElementById('wa-resumo');

const SERVICE_OPTIONS = [
  'Troca de óleo',
  'Freios',
  'Suspensão',
  'Diagnóstico',
  'Ar-condicionado',
  'Alinhamento',
  'Balanceamento',
  'Revisão',
  'Outro',
];

if (form) {
  // Máscara simples de telefone/WhatsApp
  const phone = document.getElementById('whatsapp');
  if (phone) {
    phone.addEventListener('input', () => {
      let d = phone.value.replace(/\D/g, '').slice(0, 11);
      if (d.length > 6) {
        d = '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(d.length - 4);
      } else if (d.length > 2) {
        d = '(' + d.slice(0, 2) + ') ' + d.slice(2);
      } else if (d.length) {
        d = '(' + d;
      }
      phone.value = d;
    });
  }

  const setError = (field, show) => {
    const group = field.closest('.field-group');
    if (group) group.classList.toggle('is-error', show);
    field.setAttribute('aria-invalid', String(show));
  };

  const validate = (field) => {
    const value = (field.value || '').trim();
    let ok = true;

    if (field.required && !value) ok = false;

    if (ok && field.type === 'email' && value) {
      ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    }

    if (ok && field.id === 'whatsapp' && value) {
      ok = value.replace(/\D/g, '').length >= 10;
    }

    if (ok && field.id === 'ano' && value) {
      const year = parseInt(value, 10);
      ok = year >= 1950 && year <= new Date().getFullYear() + 1;
    }

    setError(field, !ok);
    return ok;
  };

  const fields = Array.from(
    form.querySelectorAll('.field')
  );

  fields.forEach((f) => {
    f.addEventListener('blur', () => validate(f));
    f.addEventListener('input', () => {
      const group = f.closest('.field-group');
      if (group && group.classList.contains('is-error')) validate(f);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const valid = fields.map(validate).every(Boolean);
    if (!valid) {
      const firstError = form.querySelector('.field-group.is-error .field');
      if (firstError) firstError.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());

    const summary =
      'Olá! Gostaria de solicitar um agendamento:\n' +
      '*Nome:* ' + (data.nome || '-') + '\n' +
      '*WhatsApp:* ' + (data.whatsapp || '-') + '\n' +
      '*E-mail:* ' + (data.email || '-') + '\n' +
      '*Veículo:* ' +
      [data.marca, data.modelo, data.ano].filter(Boolean).join(' ') + '\n' +
      '*Serviço:* ' + (data.servico || '-') + '\n' +
      '*Data:* ' + (data.data || 'a combinar') +
      ' — *Horário:* ' + (data.horario || 'a combinar') + '\n' +
      (data.mensagem ? '*Mensagem:* ' + data.mensagem + '\n' : '');

    if (waSummaryBtn) waSummaryBtn.setAttribute('href', waLink(summary));

    form.setAttribute('hidden', '');
    if (successPanel) {
      successPanel.removeAttribute('hidden');
      successPanel.focus();
    }
  });

  const resetBtn = document.getElementById('form-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      fields.forEach((f) => setError(f, false));
      if (successPanel) successPanel.setAttribute('hidden', '');
      form.removeAttribute('hidden');
      const first = form.querySelector('.field');
      if (first) first.focus();
    });
  }
}

/* ---------------------------------------------------------------------------
   Ano atual no rodapé
   --------------------------------------------------------------------------- */
document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});
