import React, { useState } from "react";
import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import type { FeatureFlag } from "../api/flags";
import { createFlag } from "../api/flags";

interface CreateFlagProps {
  onClose?: () => void;
}

const CreateFlag: React.FC<CreateFlagProps> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");

  const mutation: UseMutationResult<
    FeatureFlag,
    Error,
    { key: string; description: string; enabled: boolean; rolloutPercentage: number }
  > = useMutation({
    mutationFn: createFlag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flags"] });
      alert("Flag created successfully");
      onClose?.();
    },
    onError: () => alert("Failed to create flag"),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({ key, description, enabled: false, rolloutPercentage: 0 });
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={fieldStyle}>
        <label htmlFor="key">Key</label>
        <input id="key" value={key} onChange={(e) => setKey(e.target.value)} style={inputStyle} />
      </div>

      <div style={fieldStyle}>
        <label htmlFor="description">Description</label>
        <input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={inputStyle}
        />
      </div>

      <button type="submit" disabled={mutation.status === "pending"} style={buttonStyle}>
        Create
      </button>
    </form>
  );
};

export default CreateFlag;

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
