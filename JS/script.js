document.addEventListener("DOMContentLoaded", () => {
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
