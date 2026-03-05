import { useState } from "react";
import Navbar from "../components/Navbar";
import FileUpload from "../components/FileUpload";
import ConvertButton from "../components/ConvertButton";
import axios from "axios";
import "../styles/home.css";
import "../styles/progress.css";

function Home() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!file) {
      alert("Please upload a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setProgress(10);

    try {
      const response = await axios.post(
        "http://localhost:5000/convert",
        formData,
        {
          responseType: "blob",
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "converted.pdf");
      document.body.appendChild(link);
      link.click();

      setProgress(100);
      setLoading(false);
    } catch (error) {
      alert("Conversion failed");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="home-container">
        <div className="card">
          <h1>Convert Any File to PDF</h1>
          <p>Upload your document and convert instantly</p>

          <FileUpload setFile={setFile} />

          {loading && (
            <div className="progress-wrapper">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
          )}

          <ConvertButton handleConvert={handleConvert} />
        </div>
      </div>
    </>
  );
}

export default Home;