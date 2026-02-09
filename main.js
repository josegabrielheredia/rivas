/* ================================
   FIREBASE CONFIG
================================ */

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "XXXXXXXX",
  appId: "XXXXXXXX"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

// Persistencia offline
firebase.firestore().enablePersistence().catch(err => {
  console.warn("Persistencia no disponible:", err.code);
});


/* ================================
   AUTH ANÓNIMO (CLAVE)
================================ */

let currentUID = null;

auth.signInAnonymously().catch(err => {
  console.error("Error auth:", err);
});

auth.onAuthStateChanged(user => {
  if (user) {
    currentUID = user.uid;
  }
});


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

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

sections.forEach(section => sectionObserver.observe(section));


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

let i = 0;
const heroTitle = document.querySelector(".hero-content h2");

if (heroTitle) {
  setInterval(() => {
    heroTitle.classList.remove("text-show");
    setTimeout(() => {
      heroTitle.textContent = textos[i];
      heroTitle.classList.add("text-show");
      i = (i + 1) % textos.length;
    }, 250);
  }, 3500);
}


/* ================================
   COMENTARIOS – FIRESTORE
================================ */

let selectedRating = 0;

const stars = document.querySelectorAll(".rating span");
const form = document.getElementById("commentForm");
const list = document.getElementById("commentsList");
const nombreInput = document.getElementById("nombre");
const mensajeInput = document.getElementById("mensaje");

// ⭐ Selección de estrellas
stars.forEach((star, index) => {
  star.addEventListener("click", () => {
    selectedRating = index + 1;
    stars.forEach(s => s.classList.remove("active"));
    for (let i = 0; i < selectedRating; i++) {
      stars[i].classList.add("active");
    }
  });
});

// 📤 Enviar comentario
form.addEventListener("submit", async e => {
  e.preventDefault();

  if (!currentUID) return alert("Espera un momento…");
  if (!selectedRating) return alert("Selecciona estrellas ⭐");
  if (!nombreInput.value.trim() || !mensajeInput.value.trim())
    return alert("Completa los campos");

  await db.collection("comentarios").add({
    nombre: nombreInput.value.trim(),
    mensaje: mensajeInput.value.trim(),
    rating: selectedRating,
    uid: currentUID,
    fecha: firebase.firestore.FieldValue.serverTimestamp()
  });

  form.reset();
  stars.forEach(s => s.classList.remove("active"));
  selectedRating = 0;
});

// 📥 Cargar comentarios (PÚBLICO)
db.collection("comentarios")
  .orderBy("fecha", "desc")
  .onSnapshot(snapshot => {
    list.innerHTML = "";

    snapshot.forEach(doc => {
      const c = doc.data();
      const div = document.createElement("div");
      div.className = "comment";

      div.innerHTML = `
        <strong>${c.nombre}</strong>
        <div class="stars">${"★".repeat(c.rating)}</div>
        <p>${c.mensaje}</p>
        ${
          c.uid === currentUID
            ? `<button class="delete-btn" data-id="${doc.id}">Eliminar</button>`
            : ""
        }
      `;

      list.appendChild(div);
    });
  });

// 🗑️ Eliminar comentario (solo dueño)
list.addEventListener("click", async e => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id;
    await db.collection("comentarios").doc(id).delete();
  }
});
