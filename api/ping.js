// api/ping.js
export default function handler(req, res) {
  res.status(200).json({
    success: true,
    message: '✅ API funcionando correctamente!',
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.url
  });
}