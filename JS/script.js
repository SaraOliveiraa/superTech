document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Configuração do WhatsApp
  const phoneNumber = "5511999999999"; // Substitua pelo número real
  const defaultMessage = "Olá! Gostaria de solicitar um orçamento.";
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  // Aplicar link em todos os botões WhatsApp
  const whatsappButtons = ["#whatsapp-hero", "#whatsapp-footer", "#whatsapp-social", ".fab-whatsapp"];

  whatsappButtons.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      if (el) el.href = whatsappURL;
    });
  });

  // Menu Hamburger
  const hamburger = document.getElementById("hamburger-menu");
  const navList = document.getElementById("nav-list");

  if (hamburger && navList) {
    const toggleMenu = () => {
      const isActive = navList.classList.toggle("active");
      hamburger.classList.toggle("active", isActive);
      hamburger.setAttribute("aria-expanded", String(isActive));

      // Previne scroll quando menu aberto
      document.body.style.overflow = isActive ? "hidden" : "";
    };

    hamburger.addEventListener("click", toggleMenu);

    // Fecha ao clicar em link
    navList.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (navList.classList.contains("active")) {
          toggleMenu();
        }
      });
    });

    // Fecha ao clicar fora
    document.addEventListener("click", (e) => {
      if (navList.classList.contains("active") && !navList.contains(e.target) && !hamburger.contains(e.target)) {
        toggleMenu();
      }
    });
  }

  // Reveal on Scroll - Otimizado
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset && entry.target.dataset.delay;
            if (delay) entry.target.style.transitionDelay = delay;
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback para navegadores antigos
    revealElements.forEach((el) => el.classList.add("in"));
  }

  // Botões de orçamento nos cards
  const cardButtons = document.querySelectorAll(".card-btn");
  cardButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = btn.closest(".card");
      const service = card.querySelector("h3").textContent;
      const message = `Olá! Gostaria de um orçamento para: ${service}`;
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
    });
  });

  // Header transparente ao scroll
  const header = document.querySelector("header");
  let lastScroll = 0;

  window.addEventListener(
    "scroll",
    () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        header.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
      } else {
        header.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
      }

      lastScroll = currentScroll;
    },
    { passive: true }
  );

  // Barra de progresso do scroll
  const progressBar = document.getElementById("scroll-progress");
  const updateProgress = () => {
    if (!progressBar) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    progressBar.style.width = `${pct}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  // Scrollspy: destaca o link ativo no menu
  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
  const sections = navLinks
    .map((a) => {
      const id = a.getAttribute("href");
      try {
        const s = document.querySelector(id);
        return s ? { link: a, section: s } : null;
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const setActiveLink = () => {
    const scrollPos = window.scrollY + 120; // compensação do header
    let current = null;
    sections.forEach(({ section, link }) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) current = link;
    });
    navLinks.forEach((l) => l.classList.toggle("active", l === current));
  };
  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  // Parallax leve nas formas do hero
  const hero = document.querySelector(".hero");
  const shapes = hero ? hero.querySelectorAll(".shape") : [];
  if (hero && shapes.length && !prefersReducedMotion) {
    let rafId = 0;
    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        shapes.forEach((el, i) => {
          const dx = (i + 1) * 6 * x;
          const dy = (i + 1) * 4 * y;
          el.style.transform = `translate(${dx}px, ${dy}px)`;
        });
      });
    };
    hero.addEventListener("mousemove", onMove);
  }

  // ==========================
  // Toggle de Tema (dark/light)
  // ==========================
  const root = document.documentElement;
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const themeToggle = document.getElementById("theme-toggle");
  const paletteToggle = document.getElementById("palette-toggle");

  const applyTheme = (t) => {
    root.setAttribute("data-theme", t);
    if (metaTheme) metaTheme.setAttribute("content", t === "dark" ? "#0b0f14" : "#ffffff");
    if (themeToggle) themeToggle.setAttribute("aria-pressed", String(t === "dark"));
  };

  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(stored || (prefersDark ? "dark" : "light"));

  // Paleta (cores de marca)
  const palettes = ["cyan", "violet", "indigo", "emerald"];
  const applyPalette = (p) => {
    root.setAttribute("data-palette", p);
    localStorage.setItem("palette", p);
  };
  applyPalette(localStorage.getItem("palette") || "cyan");

  if (paletteToggle) {
    paletteToggle.addEventListener("click", () => {
      const current = root.getAttribute("data-palette") || palettes[0];
      const idx = palettes.indexOf(current);
      const next = palettes[(idx + 1) % palettes.length];
      applyPalette(next);
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("theme", next);
    });
  }

  // ==========================
  // Depoimentos - navegação
  // ==========================
  const track = document.getElementById("testimonial-track");
  const btnPrev = document.querySelector(".testimonial-nav.prev");
  const btnNext = document.querySelector(".testimonial-nav.next");
  const scrollAmount = () => track ? track.clientWidth * 0.9 : 0;

  if (track && btnPrev && btnNext) {
    btnPrev.addEventListener("click", () => track.scrollBy({ left: -scrollAmount(), behavior: "smooth" }));
    btnNext.addEventListener("click", () => track.scrollBy({ left: scrollAmount(), behavior: "smooth" }));

    if (!prefersReducedMotion) {
      let auto = setInterval(() => {
        track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
        // Reinicia quando chega no fim
        if (Math.abs(track.scrollWidth - track.clientWidth - track.scrollLeft) < 2) {
          track.scrollTo({ left: 0, behavior: "smooth" });
        }
      }, 5000);

      track.addEventListener("mouseenter", () => clearInterval(auto));
      track.addEventListener("mouseleave", () => {
        auto = setInterval(() => {
          track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
          if (Math.abs(track.scrollWidth - track.clientWidth - track.scrollLeft) < 2) {
            track.scrollTo({ left: 0, behavior: "smooth" });
          }
        }, 5000);
      });
    }
  }

  // ==========================
  // Tilt nos cards (hover)
  // ==========================
  const cards = document.querySelectorAll(".card");
  const coarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  if (cards.length && !coarsePointer && !prefersReducedMotion) {
    document.body.classList.add("enable-tilt");
    cards.forEach((card) => {
      const damp = 12; // menor = mais inclinação
      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -damp;
        const ry = ((e.clientX - rect.left) / rect.width - 0.5) * damp;
        card.style.transform = `perspective(700px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.02)`;
        const glow = getComputedStyle(document.documentElement).getPropertyValue('--brand-glow').trim() || 'rgba(0,0,0,0.3)';
        card.style.boxShadow = `0 30px 40px -20px ${glow}`;
      };
      const onLeave = () => {
        card.style.transform = "";
        card.style.boxShadow = "";
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
    });
  }

  // ==========================
  // Simulador de Orçamento
  // ==========================
  const qDevice = document.getElementById('q-device');
  const qProblem = document.getElementById('q-problem');
  const qBrand = document.getElementById('q-brand');
  const qPhotos = document.getElementById('q-photos');
  const qBrandSelect = document.getElementById('q-brand-select');
  const qModelSelect = document.getElementById('q-model-select');
  const qPartWrap = document.getElementById('q-part-wrap');
  const qPart = document.getElementById('q-part');
  const qUrgency = document.getElementById('q-urgency');
  const qNotes = document.getElementById('q-notes');
  const qCalc = document.getElementById('q-calc');
  const qWA = document.getElementById('q-whatsapp');
  const outPrice = document.getElementById('q-price');
  const outTime = document.getElementById('q-time');
  const outSummary = document.getElementById('q-summary');

  const problemsByDevice = {
    mobile: [
      { value: 'tela', label: 'Tela quebrada', price: [180, 800], time: '3–24h' },
      { value: 'bateria', label: 'Bateria', price: [120, 350], time: '3–24h' },
      { value: 'conector', label: 'Conector de carga', price: [120, 250], time: '3–24h' },
      { value: 'camera', label: 'Câmera/alto-falante', price: [120, 400], time: '6–48h' },
      { value: 'software', label: 'Software/Otimização', price: [100, 250], time: '3–24h' },
      { value: 'placa', label: 'Placa/curto', price: [350, 1200], time: '2–7 dias' }
    ],
    notebook: [
      { value: 'teclado', label: 'Teclado/Touchpad', price: [180, 450], time: '1–3 dias' },
      { value: 'tela', label: 'Tela', price: [300, 1200], time: '1–5 dias' },
      { value: 'dobradica', label: 'Dobradiça/Carcaça', price: [200, 600], time: '1–4 dias' },
      { value: 'bateria', label: 'Bateria', price: [180, 450], time: '1–3 dias' },
      { value: 'limpeza', label: 'Limpeza + Pasta térmica', price: [150, 300], time: '24–48h' },
      { value: 'placa', label: 'Placa/Reballing', price: [450, 1500], time: '3–10 dias' }
    ],
    pc: [
      { value: 'formatacao', label: 'Formatação + Windows', price: [150, 300], time: '6–24h' },
      { value: 'ssd', label: 'Upgrade SSD/RAM', price: [150, 400], time: '6–24h' },
      { value: 'limpeza', label: 'Limpeza + Pasta térmica', price: [120, 250], time: '24–48h' },
      { value: 'fonte', label: 'Fonte/Armazenamento', price: [180, 450], time: '24–72h' },
      { value: 'drivers', label: 'Drivers/Softwares', price: [120, 200], time: '3–24h' },
      { value: 'backup', label: 'Backup/Recuperação', price: [150, 400], time: '24–72h' }
    ]
  };

  const brandRules = {
    mobile: [
      { re: /(iphone|ios|apple)/i, mul: 1.35 },
      { re: /(galaxy\s?s\d+|ultra|fold|flip|samsung)/i, mul: 1.25 },
      { re: /(motorola|moto\s?g|xiaomi|redmi|poco)/i, mul: 1.1 }
    ],
    notebook: [
      { re: /(mac|macbook|apple)/i, mul: 1.4 },
      { re: /(gamer|gaming|rtx|gtx)/i, mul: 1.2 },
      { re: /(dell|lenovo|acer|asus|hp|samsung)/i, mul: 1.1 }
    ],
    pc: [
      { re: /(gamer|gaming|rtx|gtx)/i, mul: 1.15 },
      { re: /(workstation|xeon|threadripper)/i, mul: 1.25 }
    ]
  };

  const brandModelOptions = {
    mobile: {
      Apple: ['iPhone 11', 'iPhone 12', 'iPhone 12 Pro', 'iPhone 13', 'iPhone 13 Pro', 'iPhone 14', 'iPhone 15'],
      Samsung: ['Galaxy A52', 'Galaxy A54', 'Galaxy S21', 'Galaxy S22', 'Galaxy S23', 'Galaxy Fold', 'Galaxy Flip'],
      Xiaomi: ['Redmi Note 10', 'Redmi Note 11', 'POCO X3'],
      Motorola: ['Moto G60', 'Moto G Power'],
      Outra: []
    },
    notebook: {
      Apple: ['MacBook Air', 'MacBook Pro 13', 'MacBook Pro 16'],
      Dell: ['Inspiron', 'Vostro', 'XPS'],
      Lenovo: ['Ideapad', 'ThinkPad'],
      Asus: ['VivoBook', 'ROG'],
      Acer: ['Aspire', 'Nitro'],
      HP: ['Pavilion', 'ProBook'],
      Outra: []
    },
    pc: {
      Gamer: ['RTX 3060', 'RTX 3070', 'RTX 3080'],
      Workstation: ['Xeon', 'Threadripper'],
      Outra: []
    }
  };

  const brandMultipliers = {
    mobile: { Apple: 1.35, Samsung: 1.2, Xiaomi: 1.1, Motorola: 1.1 },
    notebook: { Apple: 1.4, Dell: 1.1, Lenovo: 1.1, Asus: 1.1, Acer: 1.1, HP: 1.1 },
    pc: { Gamer: 1.15, Workstation: 1.25 }
  };

  const modelBumps = [
    { re: /(pro\s?max|ultra)/i, mul: 1.12 },
    { re: /(pro|plus)/i, mul: 1.06 },
    { re: /(fold|flip)/i, mul: 1.2 }
  ];

  const fillProblems = () => {
    if (!qDevice || !qProblem) return;
    const list = problemsByDevice[qDevice.value] || [];
    qProblem.innerHTML = '';
    list.forEach((p) => {
      const opt = document.createElement('option');
      opt.value = p.value; opt.textContent = p.label; qProblem.appendChild(opt);
    });
    updatePartVisibility();
  };
  fillProblems();
  qDevice && qDevice.addEventListener('change', () => { fillProblems(); fillBrands(); calc(); });

  const fillBrands = () => {
    if (!qBrandSelect || !qModelSelect) return;
    const options = brandModelOptions[qDevice?.value || 'mobile'] || {};
    const brandNames = Object.keys(options);
    qBrandSelect.innerHTML = '';
    const first = document.createElement('option'); first.value = ''; first.textContent = 'Selecione…'; qBrandSelect.appendChild(first);
    brandNames.forEach((b) => { const o = document.createElement('option'); o.value = b; o.textContent = b; qBrandSelect.appendChild(o); });
    const outra = document.createElement('option'); outra.value = 'Outra'; outra.textContent = 'Outra'; qBrandSelect.appendChild(outra);
    fillModels();
  };

  const fillModels = () => {
    if (!qBrandSelect || !qModelSelect) return;
    const device = qDevice?.value || 'mobile';
    const brand = qBrandSelect.value || '';
    const models = (brandModelOptions[device] && brandModelOptions[device][brand]) || [];
    qModelSelect.innerHTML = '';
    const first = document.createElement('option'); first.value=''; first.textContent='Selecione…'; qModelSelect.appendChild(first);
    models.forEach((m) => { const o = document.createElement('option'); o.value = m; o.textContent = m; qModelSelect.appendChild(o); });
    syncBrandText();
  };

  const syncBrandText = () => {
    if (!qBrand) return;
    const b = qBrandSelect?.value || '';
    const m = qModelSelect?.value || '';
    if (b && b !== 'Outra') {
      qBrand.value = [b, m].filter(Boolean).join(' ');
    }
  };

  const updatePartVisibility = () => {
    if (!qPartWrap) return;
    const show = qDevice?.value === 'mobile' && qProblem?.value === 'tela';
    if (show) qPartWrap.removeAttribute('hidden'); else qPartWrap.setAttribute('hidden','');
  };

  if (qBrandSelect) {
    fillBrands();
    qBrandSelect.addEventListener('change', () => { fillModels(); calc(); });
  }
  if (qModelSelect) {
    qModelSelect.addEventListener('change', () => { syncBrandText(); calc(); });
  }
  if (qProblem) {
    qProblem.addEventListener('change', () => { updatePartVisibility(); calc(); });
  }

  const parsePrice = (p) => Array.isArray(p) ? p : [0,0];
  const formatBRL = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const calc = () => {
    if (!(qDevice && qProblem && outPrice && outTime && outSummary)) return;
    const list = problemsByDevice[qDevice.value] || [];
    const item = list.find((p) => p.value === qProblem.value) || list[0];
    if (!item) return;
    const [min, max] = parsePrice(item.price);
    const urg = parseFloat(qUrgency?.value || '0') || 0;
    const brandTxt = (qBrand?.value || '').trim();
    let mul = 1;
    const device = qDevice.value;
    const brandSel = qBrandSelect?.value || '';
    if (brandMultipliers[device] && brandMultipliers[device][brandSel]) {
      mul = Math.max(mul, brandMultipliers[device][brandSel]);
    }
    (brandRules[device] || []).forEach((r) => { if (r.re.test(brandTxt)) mul = Math.max(mul, r.mul); });
    const modelTxt = qModelSelect?.value || '';
    modelBumps.forEach((r) => { if (r.re.test(modelTxt)) mul = mul * r.mul; });
    const part = qPart?.value || 'indefinido';
    const partMul = part === 'original_oled' ? 1.4 : part === 'premium' ? 1.2 : 1.0;
    mul = mul * partMul;
    const minU = Math.round(min * mul * (1 + urg));
    const maxU = Math.round(max * mul * (1 + urg));
    outPrice.textContent = `${formatBRL(minU)} – ${formatBRL(maxU)}`;
    const premiumNote = mul > 1.3 ? ' (peça premium)' : '';
    outTime.textContent = item.time + (urg > 0 ? ' (prioridade)' : '') + premiumNote;
    const assembledBrand = [brandSel && brandSel !== 'Outra' ? brandSel : '', modelTxt].filter(Boolean).join(' ') || brandTxt;
    outSummary.textContent = `${item.label} • ${assembledBrand || '—'} • ${qDevice.options[qDevice.selectedIndex].text}`;
  };
  [qProblem, qUrgency, qBrand].forEach((el) => el && el.addEventListener('input', calc));
  qCalc && qCalc.addEventListener('click', calc);
  // inicia com cálculo pronto
  calc();

  // CTA WhatsApp com mensagem preenchida
  if (qWA) {
    qWA.addEventListener('click', () => {
      const deviceLabel = qDevice ? qDevice.options[qDevice.selectedIndex].text : '';
      const probLabel = qProblem ? qProblem.options[qProblem.selectedIndex].text : '';
      const brand = (qBrand?.value || '').trim();
      const price = outPrice?.textContent || '';
      const time = outTime?.textContent || '';
      const notes = (qNotes?.value || '').trim();
      const photos = (qPhotos?.value || '')
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter((s) => s.length > 5)
        .slice(0, 5);
      const photosBlock = photos.length ? `\n\nFotos:\n${photos.join('\n')}` : '';
      const partLabel = qPart?.options?.[qPart.selectedIndex]?.text || '';
      const message = `Olá! Gostaria de um orçamento.\n\nDispositivo: ${deviceLabel}\nServiço: ${probLabel}\nMarca/Modelo: ${brand || '-'}${partLabel ? `\nPeça: ${partLabel}` : ''}\n\nEstimativa: ${price}\nPrazo: ${time}${notes ? `\n\nObs.: ${notes}` : ''}${photosBlock}`;
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    });
  }

  // ==========================
  // Lightbox simples da galeria
  // ==========================
  const galleryLinks = document.querySelectorAll('.gallery-grid .gallery-item');
  if (galleryLinks.length) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('tabindex', '-1');
    const img = document.createElement('img');
    overlay.appendChild(img);
    document.body.appendChild(overlay);

    const open = (src) => {
      img.src = src;
      overlay.classList.add('open');
      overlay.focus();
    };
    const close = () => overlay.classList.remove('open');

    galleryLinks.forEach((a) => {
      a.addEventListener('click', (e) => {
        // Mantém o link abrindo em nova aba com Ctrl/Cmd
        if (e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        const el = a.querySelector('img');
        open(a.getAttribute('href') || el?.src);
      });
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }

  // ==========================
  // Substitui placeholders por fotos reais se existirem
  // Nome esperado: mesmo nome do SVG, com .webp/.jpg/.jpeg/.png
  // Ex.: IMAGE/gallery-1.webp ou IMAGE/gallery-1.jpg
  // ==========================
  const tryReplaceWithReal = (imgEl, linkEl) => {
    if (!imgEl || !imgEl.src) return;
    try {
      const url = new URL(imgEl.src, window.location.href);
      const base = url.pathname.replace(/\.svg$/i, "");
      const exts = ["webp", "jpg", "jpeg", "png"];
      const testNext = (i) => {
        if (i >= exts.length) return; // sem real
        const candidate = base + "." + exts[i];
        const probe = new Image();
        probe.onload = () => {
          imgEl.src = candidate;
          if (linkEl) linkEl.href = candidate;
        };
        probe.onerror = () => testNext(i + 1);
        probe.src = candidate;
      };
      testNext(0);
    } catch {}
  };

  // Galeria
  document.querySelectorAll('.gallery-grid .gallery-item').forEach((a) => {
    const img = a.querySelector('img');
    tryReplaceWithReal(img, a);
  });

  // Compare (antes/depois)
  document.querySelectorAll('.compare-wrapper').forEach((wrap) => {
    const afterImg = wrap.querySelector('.compare-inner > .compare-img');
    const beforeImg = wrap.querySelector('.compare-overlay .compare-img');
    tryReplaceWithReal(afterImg);
    tryReplaceWithReal(beforeImg);
  });

  // ==========================
  // Compare Slider (Antes/Depois)
  // ==========================
  document.querySelectorAll('.compare-wrapper').forEach((wrap) => {
    const range = wrap.querySelector('.compare-range');
    const inner = wrap.querySelector('.compare-inner');
    const overlay = wrap.querySelector('.compare-overlay');
    const handle = wrap.querySelector('.compare-handle');
    if (!range || !inner || !overlay || !handle) return;

    const setPct = (pct) => {
      const p = Math.min(100, Math.max(0, pct));
      overlay.style.width = p + '%';
      handle.style.left = p + '%';
      range.value = p;
    };
    const posToPct = (clientX) => {
      const rect = inner.getBoundingClientRect();
      const x = clientX - rect.left;
      return (x / rect.width) * 100;
    };

    range.addEventListener('input', () => setPct(parseFloat(range.value)));

    let dragging = false;
    const start = (e) => { dragging = true; e.preventDefault(); };
    const move = (e) => {
      if (!dragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setPct(posToPct(clientX));
    };
    const end = () => { dragging = false; };

    handle.addEventListener('mousedown', start);
    handle.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('mouseup', end, { passive: true });
    window.addEventListener('touchend', end, { passive: true });

    inner.addEventListener('click', (e) => setPct(posToPct(e.clientX)));
  });

  // Smooth scroll para navegação
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href === "#" || href.startsWith("#whatsapp")) {
        return; // Permite links WhatsApp e vazios
      }

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // Analytics de eventos (opcional - adicione seu tracking)
  const trackEvent = (category, action, label) => {
    if (typeof gtag !== "undefined") {
      gtag("event", action, {
        event_category: category,
        event_label: label,
      });
    }
  };

  // Track cliques no WhatsApp
  document.querySelectorAll('[href*="wa.me"]').forEach((link) => {
    link.addEventListener("click", () => {
      trackEvent("Contact", "WhatsApp Click", link.id || "unknown");
    });
  });

  console.log("✅ SUPER TECCH - Site carregado com sucesso!");
});
