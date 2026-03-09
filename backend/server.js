const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const libre = require("libreoffice-convert");

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

  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const filePath = req.file.path;
  const outputPath = `converted/${req.file.filename}.pdf`;

  const file = fs.readFileSync(filePath);

  libre.convert(file, ".pdf", undefined, (err, done) => {

    if (err) {
      console.error(err);
      return res.status(500).send("Conversion failed");
    }

    fs.writeFileSync(outputPath, done);

    res.download(outputPath, () => {
      fs.unlinkSync(filePath);
      fs.unlinkSync(outputPath);
    });

  });

});

// Render uses dynamic port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});