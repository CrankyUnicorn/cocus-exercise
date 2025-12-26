import axios from "axios";

// Base backend URL (can be overridden by REACT_APP_BACKEND_URL env var)
const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

// Shape of a FeatureFlag returned by the backend
export interface FeatureFlag {
  id: string;                 // UUID / unique identifier
  key: string;                // human-readable unique key for the flag
  description: string;        // optional description of the flag
  enabled: boolean;           // whether the flag is enabled
  rolloutPercentage: number;  // 0-100 percentage of users targeted
  createdAt: string;          // ISO timestamp when created
  updatedAt: string;          // ISO timestamp when last updated
}

// Get all flags
// Returns: Promise resolving to an array of FeatureFlag
// May throw an AxiosError if the HTTP request fails.
export const getFlags = async (): Promise<FeatureFlag[]> => {
  const response = await axios.get(`${API_URL}/flags`);

  return response.data;
};

// Toggle/update a flag partially by id
// `data` is a partial object containing the fields to change (e.g., { enabled: true })
// Returns the updated flag payload from the server.
export const updateFlag = async (id: string, data: Partial<FeatureFlag>) => {
  const response = await axios.patch(`${API_URL}/flags/${id}`, data);

  return response.data;
};

// Get a single flag by id
// Returns: Promise resolving to the FeatureFlag with the given id.
export const getFlagById = async (id: string): Promise<FeatureFlag> => {
  const response = await axios.get(`${API_URL}/flags/${id}`);

  return response.data;
};

// Update a flag by id with partial fields and return the updated flag
// This function is similar to updateFlag but returns a typed FeatureFlag.
export const updateFlagById = async (id: string, data: Partial<FeatureFlag>): Promise<FeatureFlag> => {
  const response = await axios.patch(`${API_URL}/flags/${id}`, data);

  return response.data;
};

export const createFlag = async (data: {
  key: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
}): Promise<FeatureFlag> => {
  const response = await axios.post(`${API_URL}/flags`, data);
  return response.data;
};

export type EvaluateResponse = {
  key: string;
  userId: string;
  active: boolean;
  reason: string;
};

export const evaluateFlag = async (key: string, userId: string): Promise<EvaluateResponse> => {
  const response = await axios.get(`${API_URL}/evaluate`, {
    params: { key, userId },
  });
  return response.data;
};



