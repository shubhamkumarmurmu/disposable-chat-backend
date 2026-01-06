const express = require("express");
const router = express.Router();
const qr = require("qrcode");

router.post("/generate", (req, res) => {
  const { data } = req.body;
  const qrCode = qr
    .toDataURL(data)
    .then((url) => {
      res.status(200).json({ qrCodeUrl: url });
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to generate QR code" });
    });
});

module.exports = router;
