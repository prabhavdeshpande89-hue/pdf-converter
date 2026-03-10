const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const libre = require("libreoffice-convert");

// Fix for Render: set LibreOffice path
process.env.LIBREOFFICE_PATH = "/usr/bin/soffice";

const app = express();

// Enable CORS for all devices
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Create folders if not present
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

if (!fs.existsSync("converted")) {
  fs.mkdirSync("converted");
}

// Multer for file upload
const upload = multer({ dest: "uploads/" });

// Test route
app.get("/", (req, res) => {
  res.send("PDF Converter API running 🚀");
});

// Convert route
app.post("/convert", upload.single("file"), (req, res) => {

  console.log("📥 Conversion request received");

  if (!req.file) {
    console.log("❌ No file uploaded");
    return res.status(400).send("No file uploaded");
  }

  const filePath = req.file.path;
  const outputPath = `converted/${req.file.filename}.pdf`;

  console.log("📄 File uploaded:", filePath);

  try {
    const file = fs.readFileSync(filePath);

    libre.convert(file, ".pdf", undefined, (err, done) => {

      if (err) {
        console.error("❌ Conversion error:", err);
        return res.status(500).send("Conversion failed");
      }

      console.log("✅ Conversion successful");

      fs.writeFileSync(outputPath, done);

      res.download(outputPath, () => {
        console.log("⬇️ File sent to user");

        try {
          fs.unlinkSync(filePath);
          fs.unlinkSync(outputPath);
          console.log("🧹 Temporary files deleted");
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError);
        }
      });

    });

  } catch (readError) {
    console.error("❌ File read error:", readError);
    return res.status(500).send("File processing failed");
  }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});