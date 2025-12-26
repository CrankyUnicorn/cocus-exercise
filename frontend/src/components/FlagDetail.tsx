import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { FeatureFlag } from "../api/flags";
import { getFlagById, updateFlagById } from "../api/flags";

interface FlagDetailProps {
  id: string;
  onClose?: () => void;
}

const FlagDetail: React.FC<FlagDetailProps> = ({ id, onClose }) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<FeatureFlag, Error, FeatureFlag>({
    queryKey: ["flag", id],
    queryFn: () => getFlagById(id),
    enabled: Boolean(id),
  });

  const mutation = useMutation<FeatureFlag, Error, Partial<FeatureFlag>>({
    mutationFn: (updatedData: Partial<FeatureFlag>) => updateFlagById(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flags"] });
      alert("Flag updated successfully");
    },
    onError: () => alert("Failed to update flag"),
  });

  const handleToggle = () => {
    if (!data) return;
    mutation.mutate({ enabled: !data.enabled });
  };

  if (isLoading) return <div>Loading flag...</div>;
  if (isError || !data) return <div>Flag not found or error</div>;

  return (
    <div>
      <p>
        <strong>Key:</strong> {data.key}
      </p>
      <p>
        <strong>Description:</strong> {data.description}
      </p>
      <p>
        <strong>Enabled:</strong> {data.enabled ? "Yes" : "No"}{" "}
        <button onClick={handleToggle} disabled={mutation.status === "pending"} style={buttonStyle}>
          Toggle
        </button>
      </p>
      <p>
        <strong>Rollout Percentage:</strong> {data.rolloutPercentage}%
      </p>
      
    </div>
  );
};

export default FlagDetail;

// ---------------- Styles ----------------
const containerStyle: React.CSSProperties = {
  maxWidth: "600px",
  margin: "2rem auto",
  padding: "1rem",
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const buttonStyle: React.CSSProperties = {
  marginLeft: "0.5rem",
  padding: "0.3rem 0.8rem",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#1976d2",
  color: "white",
  cursor: "pointer",
};
