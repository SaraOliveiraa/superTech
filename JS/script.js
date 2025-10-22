document.addEventListener("DOMContentLoaded", () => {
  // Configuração do WhatsApp
  const phoneNumber = "5511999999999"; // Substitua pelo número real
  const defaultMessage = "Olá! Gostaria de solicitar um orçamento.";
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  // Aplicar link em todos os botões WhatsApp
  const whatsappButtons = ["#whatsapp-hero", "#whatsapp-footer", "#whatsapp-social", ".fab-whatsapp", "#cta-whatsapp"];

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

  // Depoimentos - Slider simples
  const testimonials = Array.from(document.querySelectorAll(".testimonial"));
  const testimonialIndicators = Array.from(document.querySelectorAll(".testimonial-indicators button"));
  const prevTestimonial = document.getElementById("testimonial-prev");
  const nextTestimonial = document.getElementById("testimonial-next");
  const testimonialSlider = document.querySelector(".testimonial-slider");
  let testimonialIndex = testimonials.findIndex((testimonial) => testimonial.classList.contains("active"));
  let testimonialInterval;

  if (testimonials.length) {
    if (testimonialIndex < 0) {
      testimonialIndex = 0;
    }

    const setActiveTestimonial = (index) => {
      if (!testimonials.length) return;
      testimonialIndex = (index + testimonials.length) % testimonials.length;

      testimonials.forEach((testimonial, idx) => {
        const isActive = idx === testimonialIndex;
        testimonial.classList.toggle("active", isActive);
        testimonial.setAttribute("aria-hidden", String(!isActive));
      });

      testimonialIndicators.forEach((indicator, idx) => {
        const isActive = idx === testimonialIndex;
        indicator.classList.toggle("active", isActive);
        indicator.setAttribute("aria-current", isActive ? "true" : "false");
      });
    };

    const stopAutoplay = () => {
      if (testimonialInterval) {
        clearInterval(testimonialInterval);
        testimonialInterval = undefined;
      }
    };

    const startAutoplay = () => {
      if (testimonials.length <= 1) return;
      stopAutoplay();
      testimonialInterval = window.setInterval(() => {
        setActiveTestimonial(testimonialIndex + 1);
      }, 7000);
    };

    const resetAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    if (prevTestimonial) {
      prevTestimonial.addEventListener("click", () => {
        setActiveTestimonial(testimonialIndex - 1);
        resetAutoplay();
      });
    }

    if (nextTestimonial) {
      nextTestimonial.addEventListener("click", () => {
        setActiveTestimonial(testimonialIndex + 1);
        resetAutoplay();
      });
    }

    testimonialIndicators.forEach((indicator, idx) => {
      indicator.addEventListener("click", () => {
        setActiveTestimonial(idx);
        resetAutoplay();
      });
    });

    if (testimonialSlider) {
      ["mouseenter", "focusin"].forEach((eventName) => {
        testimonialSlider.addEventListener(eventName, stopAutoplay);
      });

      ["mouseleave", "focusout"].forEach((eventName) => {
        testimonialSlider.addEventListener(eventName, startAutoplay);
      });
    }

    setActiveTestimonial(testimonialIndex);
    startAutoplay();
  }

  // FAQ - Acordeão acessível
  const faqItems = document.querySelectorAll(".faq-item");

  if (faqItems.length) {
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");

      if (!question || !answer) return;

      const closeItem = () => {
        item.classList.remove("open");
        question.setAttribute("aria-expanded", "false");
        answer.style.maxHeight = "";
      };

      const openItem = () => {
        item.classList.add("open");
        question.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      };

      question.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");

        faqItems.forEach((otherItem) => {
          if (otherItem === item) return;
          const otherQuestion = otherItem.querySelector(".faq-question");
          const otherAnswer = otherItem.querySelector(".faq-answer");
          if (!otherQuestion || !otherAnswer) return;
          otherItem.classList.remove("open");
          otherQuestion.setAttribute("aria-expanded", "false");
          otherAnswer.style.maxHeight = "";
        });

        if (isOpen) {
          closeItem();
        } else {
          openItem();
        }
      });
    });

    const firstItem = faqItems[0];
    const firstQuestion = firstItem.querySelector(".faq-question");
    const firstAnswer = firstItem.querySelector(".faq-answer");

    if (firstQuestion && firstAnswer) {
      firstItem.classList.add("open");
      firstQuestion.setAttribute("aria-expanded", "true");
      firstAnswer.style.maxHeight = `${firstAnswer.scrollHeight}px`;
    }

    window.addEventListener("resize", () => {
      faqItems.forEach((item) => {
        if (item.classList.contains("open")) {
          const answer = item.querySelector(".faq-answer");
          if (answer) {
            answer.style.maxHeight = `${answer.scrollHeight}px`;
          }
        }
      });
    });
  }

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
