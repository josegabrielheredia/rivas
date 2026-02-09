/* ================================
   FIX SCROLL
================================ */

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.addEventListener("load", () => window.scrollTo(0, 0));
document.body.style.overflowX = "hidden";
document.documentElement.style.scrollBehavior = "smooth";


/* ================================
   ANIMACIONES
================================ */

const sections = document.querySelectorAll("section");

if (sections.length) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  sections.forEach(section => sectionObserver.observe(section));
}


/* ================================
   VIDEO OBSERVER
================================ */

document.querySelectorAll("video").forEach(video => {
  video.muted = true;
  video.playsInline = true;

  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.isIntersecting
        ? video.play().catch(() => {})
        : video.pause();
    });
  }, { threshold: 0.4 }).observe(video);
});


/* ================================
   HERO TEXTO ROTATIVO
================================ */

const textos = [
  "Realza tu belleza natural",
  "Donde nace tu mejor versión",
  "Belleza, elegancia y cuidado",
  "Tu espacio de bienestar"
];

let textoIndex = 0;
const heroTitle = document.querySelector(".hero-content h2");

if (heroTitle) {
  setInterval(() => {
    heroTitle.classList.remove("text-show");
    setTimeout(() => {
      heroTitle.textContent = textos[textoIndex];
      heroTitle.classList.add("text-show");
      textoIndex = (textoIndex + 1) % textos.length;
    }, 250);
  }, 3500);
}


/* ================================
   COMENTARIOS – POSTGRESQL API
================================ */

const API = "http://localhost:3000"; // cambia en producción
let selectedRating = 0;

const stars = document.querySelectorAll(".rating span");
const form = document.getElementById("commentForm");
const list = document.getElementById("commentsList");
const nombreInput = document.getElementById("nombre");
const mensajeInput = document.getElementById("mensaje");


/* ⭐ Selección de estrellas */
stars.forEach((star, index) => {
  star.addEventListener("click", () => {
    selectedRating = index + 1;
    stars.forEach(s => s.classList.remove("active"));
    for (let i = 0; i < selectedRating; i++) {
      stars[i].classList.add("active");
    }
  });
});


/* 📤 Enviar comentario */
if (form) {
  form.addEventListener("submit", async e => {
    e.preventDefault();

    if (!selectedRating) return alert("Selecciona estrellas ⭐");
    if (!nombreInput.value.trim() || !mensajeInput.value.trim()) {
      return alert("Completa los campos");
    }

    try {
      const res = await fetch(`${API}/comentarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nombre: nombreInput.value.trim(),
          mensaje: mensajeInput.value.trim(),
          rating: selectedRating
        })
      });

      if (!res.ok) throw new Error("Error al enviar");

      form.reset();
      stars.forEach(s => s.classList.remove("active"));
      selectedRating = 0;
      cargarComentarios();

    } catch (err) {
      console.error(err);
      alert("No se pudo enviar el comentario");
    }
  });
}


/* 📥 Cargar comentarios */
async function cargarComentarios() {
  if (!list) return;

  try {
    const res = await fetch(`${API}/comentarios`, {
      credentials: "include"
    });

    const comentarios = await res.json();
    list.innerHTML = "";

    comentarios.forEach(c => {
      const div = document.createElement("div");
      div.className = "comment";

      div.innerHTML = `
        <strong>${c.nombre}</strong>
        <div class="stars">${"★".repeat(c.rating)}</div>
        <p>${c.mensaje}</p>
        ${c.esAutor ? `<button class="delete-btn" data-id="${c.id}">Eliminar</button>` : ""}
      `;

      list.appendChild(div);
    });

  } catch (err) {
    console.error("Error cargando comentarios:", err);
  }
}


/* 🗑️ Eliminar comentario (solo autor) */
if (list) {
  list.addEventListener("click", async e => {
    if (!e.target.classList.contains("delete-btn")) return;

    const id = e.target.dataset.id;

    try {
      await fetch(`${API}/comentarios/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      cargarComentarios();

    } catch (err) {
      console.error("Error eliminando comentario:", err);
    }
  });
}


/* 🚀 INIT */
cargarComentarios();
