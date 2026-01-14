/* ================================
   FIX SCROLL INICIAL
================================ */

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

document.body.style.overflowX = "hidden";
document.documentElement.style.scrollBehavior = "smooth";


/* ================================
   ANIMACIÓN DE SECCIONES
================================ */

const sections = document.querySelectorAll("section");

const sectionObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

sections.forEach(section => sectionObserver.observe(section));


/* ================================
   VIDEO OBSERVER (OPTIMIZADO)
================================ */

const videos = document.querySelectorAll("video");

const videoObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const video = entry.target;

    if (entry.isIntersecting) {
      video.play().catch(()=>{});
    } else {
      video.pause();
    }
  });
}, { threshold: 0.4 });

videos.forEach(video => {
  video.muted = true;
  video.playsInline = true;
  video.preload = "none";
  videoObserver.observe(video);
});


/* ================================
   HERO LOAD
================================ */

window.addEventListener("load", () => {
  document.querySelector(".hero")?.classList.add("show");
});


/* ================================
   HOVER 3D SOLO EN DESKTOP
================================ */

if (window.matchMedia("(min-width: 992px)").matches) {
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    let rect;

    card.addEventListener("mouseenter", () => {
      rect = card.getBoundingClientRect();
    });

    card.addEventListener("mousemove", (e) => {
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      card.style.transform = `
        translateY(-10px)
        rotateX(${(-y / 30)}deg)
        rotateY(${(x / 30)}deg)
        scale(1.03)
      `;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) rotateX(0) rotateY(0) scale(1)";
    });
  });
}


/* ================================
   SCROLL NAV
================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href"))
      ?.scrollIntoView({ behavior: "smooth" });
  });
});


/* ================================
   TEXTO HERO
================================ */

const textos = [
  "Realza tu belleza natural",
  "Donde nace tu mejor versión",
  "Belleza, elegancia y cuidado",
  "Tu espacio de bienestar"
];

let indexTexto = 0;
const heroTitle = document.querySelector(".hero-content h2");

if (heroTitle) {
  setInterval(() => {
    heroTitle.classList.remove("text-show");

    setTimeout(() => {
      heroTitle.textContent = textos[indexTexto];
      heroTitle.classList.add("text-show");
      indexTexto = (indexTexto + 1) % textos.length;
    }, 250);

  }, 3500);
}
