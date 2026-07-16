// ================================
// FIREBASE CONFIG (COMPAT)
// ================================
const firebaseConfig = {
  apiKey: "AIzaSyCAcGZUDIwb5Uq-jAOQ3wl90cx1Z6afdJo",
  authDomain: "rivas-gonzalez-salon.firebaseapp.com",
  projectId: "rivas-gonzalez-salon",
  storageBucket: "rivas-gonzalez-salon.firebasestorage.app",
  messagingSenderId: "196826658505",
  appId: "1:196826658505:web:70b9997cee08d28d00ff18"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/* ================================
   DOM READY
================================ */
document.addEventListener("DOMContentLoaded", () => {

  /* ================================
     FIX SCROLL
  ================================ */
  try {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    document.body.style.overflowX = "hidden";
    document.documentElement.style.scrollBehavior = "smooth";
  } catch (e) {}

  /* ================================
     ANIMACIONES SECCIONES
  ================================ */
  try {
    const sections = document.querySelectorAll("section, footer");

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: "0px 0px 18% 0px",
      threshold: 0.01
    });

    sections.forEach(section => observer.observe(section));
  } catch (e) {}

  /* ================================
     VIDEO OBSERVER
  ================================ */
  try {
    document.querySelectorAll("video").forEach(video => {
      video.muted = true;
      video.playsInline = true;

      const videoObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.4 });

      videoObserver.observe(video);
    });
  } catch (e) {}

  /* ================================
     HERO TEXTO ESTABLE
  ================================ */
  try {
    const heroTitle = document.querySelector(".hero-content h1, .hero-content h2");

    if (heroTitle) {
      heroTitle.classList.add("text-show");
    }
  } catch (e) {}

  /* ================================
     COMENTARIOS (FIRESTORE)
  ================================ */
  const form = document.getElementById("commentForm");
  const commentsList = document.getElementById("commentsList");
  const stars = document.querySelectorAll(".rating span");

  if (!form || !commentsList) return;

  let rating = 0;

  // Selector de estrellas.
  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      rating = index + 1;
      stars.forEach(s => s.classList.remove("active"));
      for (let i = 0; i < rating; i++) {
        stars[i].classList.add("active");
      }
    });
  });

  // Enviar comentario.
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    if (!nombre || !mensaje || rating === 0) {
      alert("Completa todos los campos y selecciona una calificacion.");
      return;
    }

    try {
      await db.collection("comentarios").add({
        nombre,
        mensaje,
        estrellas: rating,
        fecha: firebase.firestore.FieldValue.serverTimestamp()
      });

      form.reset();
      rating = 0;
      stars.forEach(s => s.classList.remove("active"));
    } catch (err) {
      console.error("Error guardando comentario:", err);
    }
  });

  // Mostrar comentarios en tiempo real.
  db.collection("comentarios")
    .orderBy("fecha", "desc")
    .onSnapshot(snapshot => {
      commentsList.replaceChildren();

      snapshot.forEach(doc => {
        const c = doc.data();
        const comment = document.createElement("div");
        const name = document.createElement("strong");
        const starsEl = document.createElement("div");
        const message = document.createElement("p");
        const starsCount = Math.max(0, Math.min(5, Number(c.estrellas) || 0));

        comment.className = "comment";
        starsEl.className = "stars";
        name.textContent = c.nombre || "Cliente";
        starsEl.textContent = "\u2605".repeat(starsCount);
        message.textContent = c.mensaje || "";

        comment.append(name, starsEl, message);
        commentsList.appendChild(comment);
      });
    });

});
