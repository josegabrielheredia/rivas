import express from "express";
import pkg from "pg";
import cors from "cors";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";

const { Pool } = pkg;
const app = express();

/* ======================
   CONFIG
====================== */
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

/* ======================
   DB
====================== */
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres", // usa postgres como acordamos
  password: "admin",
  port: 5432
});

/* ======================
   COOKIE UUID MIDDLEWARE
====================== */
app.use((req, res, next) => {
  if (!req.cookies.autor_id) {
    const uuid = uuidv4();
    res.cookie("autor_id", uuid, {
      httpOnly: true,
      sameSite: "lax"
    });
    req.autor_id = uuid;
  } else {
    req.autor_id = req.cookies.autor_id;
  }
  next();
});

/* ======================
   HEALTH
====================== */
app.get("/health", async (_, res) => {
  await pool.query("SELECT 1");
  res.json({ ok: true });
});

/* ======================
   GET COMENTARIOS
====================== */
app.get("/comentarios", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM comentarios ORDER BY created_at DESC"
  );

  const data = rows.map(c => ({
    id: c.id,
    nombre: c.nombre,
    mensaje: c.mensaje,
    rating: c.rating,
    esAutor: c.autor_id === req.autor_id
  }));

  res.json(data);
});

/* ======================
   POST COMENTARIO
====================== */
app.post("/comentarios", async (req, res) => {
  const { nombre, mensaje, rating } = req.body;

  if (!nombre || !mensaje || !rating) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  await pool.query(
    `INSERT INTO comentarios (nombre, mensaje, rating, autor_id)
     VALUES ($1, $2, $3, $4)`,
    [nombre, mensaje, rating, req.autor_id]
  );

  res.json({ ok: true });
});

/* ======================
   DELETE COMENTARIO (SOLO AUTOR)
====================== */
app.delete("/comentarios/:id", async (req, res) => {
  const { id } = req.params;

  const { rowCount } = await pool.query(
    "DELETE FROM comentarios WHERE id = $1 AND autor_id = $2",
    [id, req.autor_id]
  );

  if (!rowCount) {
    return res.status(403).json({ error: "No autorizado" });
  }

  res.json({ ok: true });
});

/* ======================
   START
====================== */
app.listen(3000, () => {
  console.log("🚀 Backend corriendo en http://localhost:3000");
});
