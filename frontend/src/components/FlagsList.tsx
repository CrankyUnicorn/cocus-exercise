import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { FeatureFlag } from "../api/flags";
import { getFlags, updateFlag } from "../api/flags";

// Components
import Modal from "./Modal";
import FlagDetail from "./FlagDetail";
import EvaluatePlayground from "./EvaluatePlayground";
import CreateFlag from "./CreateFlag";

const FlagsList: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  // component state for modals
  const [openFlagId, setOpenFlagId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showEvaluate, setShowEvaluate] = useState(false);

  /* ----------------------------------- API ---------------------------------- */
  const { data, isLoading, isError } = useQuery<FeatureFlag[], Error>({
    queryKey: ["flags"],
    queryFn: getFlags,
  });

  const flags = data ?? [];

  const filteredFlags = flags.filter(
    (flag) =>
      flag.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flag.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleEnabled = useMutation<
    FeatureFlag,
    Error,
    FeatureFlag,
    { previous: FeatureFlag[] | undefined }
  >({
    mutationFn: (flag: FeatureFlag) => updateFlag(flag.id, { enabled: !flag.enabled }),
    onMutate: async (flag) => {
      await queryClient.cancelQueries({ queryKey: ["flags"] });
      const previous = queryClient.getQueryData<FeatureFlag[]>(["flags"]);
      if (previous) {
        queryClient.setQueryData<FeatureFlag[]>(["flags"],
          previous.map((f) => (f.id === flag.id ? { ...f, enabled: !f.enabled } : f))
        );
      }
      return { previous };
    },
    onError: (_err, _flag, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["flags"], context.previous);
      }
      alert("Failed to toggle flag");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["flags"] });
    },
  });

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading flags</div>;

  /* ----------------------------------- JSX ---------------------------------- */
   return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f0f0",
        display: "flex",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          minWidth: "400px",
          backgroundColor: "white",
          padding: "1.5rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Top Buttons + Search */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1rem",
            alignItems: "center",
          }}
        >
          <button onClick={() => setShowCreate(true)} style={buttonStyle}>
            Create New Flag
          </button>
          <button onClick={() => setShowEvaluate(true)} style={buttonStyle}>
            Evaluate Flag
          </button>
          <input
            type="text"
            placeholder="Search by key or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Flags Table */}
        <table style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              <th style={thStyle}>Key</th>
              <th style={thStyle}>Enabled</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFlags.map((flag) => (
              <tr
                key={flag.id}
                style={trStyle}
                onClick={() => setOpenFlagId(flag.id)}
                className="flag-row"
              >
                <td style={tdStyle}>{flag.key}</td>
                <td style={tdStyle}>{flag.enabled ? "Yes" : "No"}</td>
                <td style={tdStyle}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleEnabled.mutate(flag);
                    }}
                    disabled={toggleEnabled.status === "pending"}
                    style={buttonStyle}
                  >
                    Toggle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <style>{`
          .flag-row:hover {
            background-color: #f5f5f5;
          }
        `}</style>
      </div>

      {/* Modals */}
      <Modal isOpen={!!openFlagId} onClose={() => setOpenFlagId(null)} title="Flag Details">
        {openFlagId && <FlagDetail id={openFlagId} onClose={() => setOpenFlagId(null)} />}
      </Modal>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Flag">
        <CreateFlag onClose={() => setShowCreate(false)} />
      </Modal>

      <Modal isOpen={showEvaluate} onClose={() => setShowEvaluate(false)} title="Evaluate Flag">
        <EvaluatePlayground onClose={() => setShowEvaluate(false)} />
      </Modal>
    </div>
  );
};

export default FlagsList;

// ----- Inline styles -----
const buttonStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  border: "none",
  backgroundColor: "#1976d2",
  color: "white",
  cursor: "pointer",
  borderRadius: "4px",
  fontSize: "0.9rem",
};

const inputStyle: React.CSSProperties = {
  padding: "0.5rem",
  fontSize: "0.9rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
  flex: 1,
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const theadStyle: React.CSSProperties = {
  backgroundColor: "#1976d2",
  color: "white",
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "0.5rem",
  borderBottom: "2px solid #1976d2",
};

const tdStyle: React.CSSProperties = {
  padding: "0.5rem",
  borderBottom: "1px solid #ddd",
};

const trStyle: React.CSSProperties = {
  cursor: "pointer",
  transition: "background 0.2s",
};