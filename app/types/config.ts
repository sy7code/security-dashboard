export interface PluginConfig {
  id: number;
  name: string;
  type: string;
  enabled: boolean;
  apiKey: string; // Will come masked from backend
  apiUrl?: string;
  customParams?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface ScannerConfig extends PluginConfig {
  scanFrequencyDays?: number;
}

export interface AiEngineConfig extends PluginConfig {
  modelName?: string;
  temperature?: number;
}

export type PluginConfigInput = Partial<Omit<PluginConfig, 'id' | 'createdAt' | 'updatedAt'>>;
export type ScannerConfigInput = Partial<Omit<ScannerConfig, 'id' | 'createdAt' | 'updatedAt'>>;
export type AiEngineConfigInput = Partial<Omit<AiEngineConfig, 'id' | 'createdAt' | 'updatedAt'>>;
