import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "1rem",
          maxWidth: "800px",
          minWidth: "400px",
          width: "80vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2>{title}</h2>}
        {children}
        <div style={{ textAlign: "right", marginTop: "1rem" }}>
          <button onClick={onClose} style={{ ...buttonStyle, backgroundColor: "#888" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

const buttonStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  border: "none",
  color: "white",
  cursor: "pointer",
  borderRadius: "4px",
};
