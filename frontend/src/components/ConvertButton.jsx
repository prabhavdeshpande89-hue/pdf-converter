import "../styles/button.css";

function ConvertButton({ handleConvert }) {
  return (
    <div className="button-container">
      <button className="convert-btn" onClick={handleConvert}>
        Convert to PDF
      </button>
    </div>
  );
}

export default ConvertButton;