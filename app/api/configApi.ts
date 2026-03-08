import { apiClient } from "../utils/apiClient";
import { AiEngineConfig, AiEngineConfigInput, ScannerConfig, ScannerConfigInput } from "../types/config";

const SCANNERS_URL = "/api/config/scanners";
const AI_ENGINES_URL = "/api/config/ai-engines";

export async function fetchScanners(): Promise<ScannerConfig[]> {
  const response = await apiClient.get<ScannerConfig[]>(SCANNERS_URL);
  return response.data;
}

export async function createScanner(data: ScannerConfigInput): Promise<ScannerConfig> {
  const response = await apiClient.post<ScannerConfig>(SCANNERS_URL, data);
  return response.data;
}

export async function updateScanner(id: number, data: ScannerConfigInput): Promise<ScannerConfig> {
  const response = await apiClient.put<ScannerConfig>(`${SCANNERS_URL}/${id}`, data);
  return response.data;
}

export async function deleteScanner(id: number): Promise<void> {
  await apiClient.delete(`${SCANNERS_URL}/${id}`);
}

export async function fetchAiEngines(): Promise<AiEngineConfig[]> {
  const response = await apiClient.get<AiEngineConfig[]>(AI_ENGINES_URL);
  return response.data;
}

export async function createAiEngine(data: AiEngineConfigInput): Promise<AiEngineConfig> {
  const response = await apiClient.post<AiEngineConfig>(AI_ENGINES_URL, data);
  return response.data;
}

export async function updateAiEngine(id: number, data: AiEngineConfigInput): Promise<AiEngineConfig> {
  const response = await apiClient.put<AiEngineConfig>(`${AI_ENGINES_URL}/${id}`, data);
  return response.data;
}

export async function deleteAiEngine(id: number): Promise<void> {
  await apiClient.delete(`${AI_ENGINES_URL}/${id}`);
}

export async function testConnection(data: ScannerConfigInput | AiEngineConfigInput): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post<{ success: boolean; message: string }>("/api/config/test", data);
  return response.data;
}
