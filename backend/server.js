const mammoth = require("mammoth");
const PDFDocument = require("pdfkit");

app.post("/convert", upload.single("file"), async (req, res) => {

  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  try {
    const filePath = req.file.path;

    const result = await mammoth.extractRawText({ path: filePath });

    const pdfPath = `converted/${req.file.filename}.pdf`;

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);

    doc.pipe(stream);
    doc.text(result.value);
    doc.end();

    stream.on("finish", () => {
      res.download(pdfPath, () => {
        fs.unlinkSync(filePath);
        fs.unlinkSync(pdfPath);
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Conversion failed");
  }
});