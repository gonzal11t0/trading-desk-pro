// api/test.mjs - Para verificar que la API funciona
export default function handler(req, res) {
  res.status(200).json({
    success: true,
    message: "✅ API funcionando correctamente",
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  });
}