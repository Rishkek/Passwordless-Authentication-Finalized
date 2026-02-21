import { useState, useEffect } from "react";

function ConsentModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("consent");
    if (!consent) setShow(true);
  }, []);

  const handleOk = () => {
    localStorage.setItem("consent", "true");
    setShow(false);
  };

  const handleExit = () => {
    window.location.href = "https://google.com";
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>This site may monitor typing for dataset training.</p>
        <div className="modal-buttons">
          <button onClick={handleOk}>Okay</button>
          <button onClick={handleExit} className="secondary">
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConsentModal;