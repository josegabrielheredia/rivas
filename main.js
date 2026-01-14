/* =====================================
   FORZAR INICIO ARRIBA (FIX DEFINITIVO)
===================================== */

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 0);
});

window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
  });
});

document.body.style.overflowX = "hidden";
document.documentElement.style.scrollBehavior = "smooth";


/* =====================================
   ANIMACIONES DURAS POR SECCIONES (FIX)
===================================== */

const sections = document.querySelectorAll("section");

const sectionObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {

      entry.target.classList.add("show");
      observer.unobserve(entry.target);

      // Reproducir videos dentro de la sección
      const videos = entry.target.querySelectorAll("video");
      videos.forEach(video => {
        if(video.paused){
          video.play().catch(()=>{});
        }
      });
    }
  });
}, {
  threshold: 0.15,
  rootMargin: "0px 0px -80px 0px"
});

sections.forEach(section => sectionObserver.observe(section));


/* =====================================
   HERO APARICIÓN SUAVE
===================================== */

window.addEventListener("load", () => {
  document.querySelector(".hero")?.classList.add("show");
});


/* =====================================
   EFECTO LOGO
===================================== */

const logo = document.querySelector(".logo img");
if (logo) {
  setTimeout(() => {
    logo.classList.add("logo-glow");
  }, 1200);
}


/* =====================================
   FIX VIDEO PARA MÓVIL
===================================== */

const allVideos = document.querySelectorAll("video");

allVideos.forEach(video => {
  video.muted = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("muted", "");
  video.setAttribute("loop", "");
});


/* =====================================
   VIDEO OBSERVER (LIVIANO)
===================================== */

const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target;

    if (entry.isIntersecting) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}, {
  threshold: 0.35
});

allVideos.forEach(video => videoObserver.observe(video));


/* =====================================
   HOVER 3D PREMIUM
===================================== */

const cards = document.querySelectorAll(".card");

cards.forEach(card => {
  let rect;

  card.addEventListener("mouseenter", () => {
    rect = card.getBoundingClientRect();
    card.style.transition = "transform 0.1s ease";
  });

  card.addEventListener("mousemove", (e) => {
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    card.style.transform = `
      translateY(-12px)
      rotateX(${(-y / 25)}deg)
      rotateY(${(x / 25)}deg)
      scale(1.04)
    `;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transition = "transform 0.4s ease";
    card.style.transform = "translateY(0) rotateX(0) rotateY(0) scale(1)";
  });
});


/* =====================================
   SCROLL SUAVE NAV
===================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* =====================================
   TEXTO CAMBIANTE HERO
===================================== */

const textos = [
  "Realza tu belleza natural",
  "Donde nace tu mejor versión",
  "Belleza, elegancia y cuidado",
  "Tu espacio de bienestar"
];

let indexTexto = 0;
const heroTitle = document.querySelector(".hero-content h2");

if (heroTitle) {
  heroTitle.classList.add("text-show");

  setInterval(() => {
    heroTitle.classList.remove("text-show");

    setTimeout(() => {
      heroTitle.textContent = textos[indexTexto];
      heroTitle.classList.add("text-show");
      indexTexto = (indexTexto + 1) % textos.length;
    }, 300);

  }, 4000);
}
