// api/ping.js
module.exports = (req, res) => {
  res.status(200).json({
    message: "✅ API working!",
    timestamp: new Date().toISOString(),
    method: req.method
  });
};