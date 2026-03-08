import { useState, useEffect, useCallback } from "react";
import { AiEngineConfig, ScannerConfig } from "../types/config";
import { fetchScanners, fetchAiEngines } from "../api/configApi";
import { AxiosError } from "axios";

export function useScanners() {
  const [scanners, setScanners] = useState<ScannerConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchScanners();
      setScanners(data);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof AxiosError && (err.response?.status === 401 || err.response?.status === 403)) {
        return;
      }

      // Fallback for dev/mocking if backend is not available
      if (err instanceof AxiosError && err.message.includes('Network Error')) {
        setScanners([
          { id: 1, name: "Nexus Scanner", type: "VULNERABILITY", enabled: true, apiKey: "sk-nex***123", scanFrequencyDays: 7, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 2, name: "SonarQube API", type: "CODE_QUALITY", enabled: false, apiKey: "sqa_***abc", scanFrequencyDays: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        ]);
        setError(null);
      } else if (err instanceof AxiosError) {
        setError(err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { scanners, loading, error, refreshScanners: loadData };
}

export function useAiEngines() {
  const [aiEngines, setAiEngines] = useState<AiEngineConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAiEngines();
      setAiEngines(data);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof AxiosError && (err.response?.status === 401 || err.response?.status === 403)) {
        return;
      }

      if (err instanceof AxiosError && err.message.includes('Network Error')) {
        setAiEngines([
          { id: 1, name: "OpenAI GPT-4", type: "LLM", enabled: true, apiKey: "sk-oa***456", modelName: "gpt-4-turbo", temperature: 0.2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 2, name: "Google Gemini", type: "LLM", enabled: true, apiKey: "AIza***789", modelName: "gemini-1.5-pro", temperature: 0.1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        ]);
        setError(null);
      } else if (err instanceof AxiosError) {
        setError(err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { aiEngines, loading, error, refreshAiEngines: loadData };
}
