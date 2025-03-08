// En server.js (backend)
app.get("/api/mensaje", (req, res) => {
    res.json({ mensaje: "Hola desde el backend!" });
  });