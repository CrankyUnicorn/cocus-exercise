import React, { useState } from "react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import type { EvaluateResponse } from "../api/flags";
import { evaluateFlag } from "../api/flags";

interface EvaluatePlaygroundProps {
  onClose?: () => void;
}

const EvaluatePlayground: React.FC<EvaluatePlaygroundProps> = ({ onClose }) => {
  const [key, setKey] = useState("");
  const [userId, setUserId] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const mutation: UseMutationResult<EvaluateResponse, Error, void> = useMutation({
    mutationFn: () => evaluateFlag(key, userId),
    onSuccess: (data) => setResult(data.active ? "Active" : "Inactive"),
    onError: () => setResult("Error evaluating flag"),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={fieldStyle}>
        <label htmlFor="key">Flag Key</label>
        <input id="key" value={key} onChange={(e) => setKey(e.target.value)} style={inputStyle} />
      </div>

      <div style={fieldStyle}>
        <label htmlFor="userId">User ID</label>
        <input
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={inputStyle}
        />
      </div>

      <button type="submit" disabled={mutation.status === "pending"} style={buttonStyle}>
        Evaluate
      </button>

      {result && <p style={{ marginTop: "1rem" }}>Result: {result}</p>}
    </form>
  );
};

export default EvaluatePlayground;

// ---------------- Styles ----------------
const formStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "1rem" };
const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column" };
const inputStyle: React.CSSProperties = {
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
};
const buttonStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#1976d2",
  color: "white",
  cursor: "pointer",
};
