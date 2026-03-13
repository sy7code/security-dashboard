"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useScanners } from "../../hooks/usePluginConfig";
import { createScanner, updateScanner, deleteScanner } from "../../api/configApi";
import { ScannerConfig, ScannerConfigInput } from "../../types/config";
import { AxiosError } from "axios";
import { Shield, Plus, Edit2, Trash2, Activity, Clock, CheckCircle2, XCircle, Trash, Info, Send } from "lucide-react";
import { testConnection } from "../../api/configApi";

export default function ScannerForm() {
  const { scanners, loading, error, refreshScanners } = useScanners();
  const [editingScanner, setEditingScanner] = useState<ScannerConfig | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [customParams, setCustomParams] = useState<{ key: string; value: string }[]>([]);
  const [formData, setFormData] = useState<ScannerConfigInput>({
    name: "",
    type: "VULNERABILITY",
    enabled: true,
    scanFrequencyDays: 1,
    apiUrl: "",
    apiKey: "",
    customParams: {},
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenModal = (scanner?: ScannerConfig) => {
    setTestResult(null);
    if (scanner) {
      setEditingScanner(scanner);
      const paramsArray = Object.entries(scanner.customParams || {}).map(([key, value]) => ({ key, value: String(value) }));
      setCustomParams(paramsArray.length > 0 ? paramsArray : [{ key: "", value: "" }]);
      setFormData({
        name: scanner.name,
        type: scanner.type,
        enabled: scanner.enabled,
        apiKey: "****", // Updated to 4 stars as per requirements
        apiUrl: scanner.apiUrl || "",
        scanFrequencyDays: scanner.scanFrequencyDays || 1,
        customParams: scanner.customParams || {},
      });
    } else {
      setEditingScanner(null);
      setCustomParams([{ key: "", value: "" }]);
      setFormData({
        name: "",
        type: "VULNERABILITY",
        enabled: true,
        apiKey: "",
        apiUrl: "",
        scanFrequencyDays: 1,
        customParams: {},
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingScanner(null);
    setTesting(false);
    setTestResult(null);
  };

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        handleCloseModal();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isModalOpen]);

  const addParam = () => setCustomParams([...customParams, { key: "", value: "" }]);
  const removeParam = (index: number) => {
    const newParams = customParams.filter((_, i: number) => i !== index);
    setCustomParams(newParams.length > 0 ? newParams : [{ key: "", value: "" }]);
  };
  const updateParam = (index: number, field: 'key' | 'value', val: string) => {
    const newParams = [...customParams];
    newParams[index][field] = val;
    setCustomParams(newParams);
  };

  const getCleanPayload = () => {
    const params: Record<string, string> = {};
    customParams.forEach(p => {
      if (p.key.trim()) params[p.key.trim()] = p.value;
    });

    const payload: any = { ...formData, customParams: params, pluginType: "SCANNER" };
    if (payload.apiKey === "****" || !payload.apiKey) {
      delete payload.apiKey;
    }
    return payload;
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await testConnection(getCleanPayload());
      setTestResult(result);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setTestResult({
        success: false,
        message: axiosError.response?.data?.message || axiosError.message || "연동 테스트 실패"
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = getCleanPayload();
      if (editingScanner) {
        await updateScanner(editingScanner.id, payload);
      } else {
        await createScanner(payload);
      }
      await refreshScanners();
      handleCloseModal();
    } catch (err) {
      console.error("스캐너 저장 실패", err);
    }
  };

  const handleToggleEnable = async (scanner: ScannerConfig) => {
    try {
      await updateScanner(scanner.id, { enabled: !scanner.enabled });
      await refreshScanners();
    } catch (err) {
      console.error("스캐너 활성화 변경 실패", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("정말로 이 스캐너를 삭제하시겠습니까?")) {
      try {
        await deleteScanner(id);
        await refreshScanners();
      } catch (err) {
        console.error("스캐너 삭제 실패", err);
      }
    }
  };

  if (loading) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-2 bg-slate-700/50 rounded"></div><div className="space-y-3"><div className="grid grid-cols-3 gap-4"><div className="h-2 bg-slate-700/50 rounded col-span-2"></div><div className="h-2 bg-slate-700/50 rounded col-span-1"></div></div><div className="h-2 bg-slate-700/50 rounded"></div></div></div></div>;
  if (error) return <div className="text-red-400 p-4 bg-red-900/20 rounded-xl border border-red-500/20">에러 발생: {error}</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            보안 스캐너
          </h2>
          <p className="text-slate-400 text-sm mt-1">외부 취약점 스캐너 및 구성을 관리합니다.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]"
        >
          <Plus className="w-4 h-4" /> 스캐너 추가
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {scanners.map((scanner) => (
          <div key={scanner.id} className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl relative group hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${scanner.enabled ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700/50 text-slate-400'}`}>
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">{scanner.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{scanner.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleEnable(scanner)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${scanner.enabled ? 'bg-indigo-600' : 'bg-slate-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${scanner.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">상태</span>
                <span className={`flex items-center gap-1 ${scanner.enabled ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {scanner.enabled ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {scanner.enabled ? '활동적' : '비활성'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-1"><Clock className="w-4 h-4" /> 빈도</span>
                <span className="text-slate-200">{scanner.scanFrequencyDays}일 마다</span>
              </div>
              <div className="flex justify-between text-sm border-t border-slate-700/50 pt-3 mt-3">
                <span className="text-slate-400">API 키</span>
                <span className="text-slate-200 font-mono bg-slate-900/50 px-2 py-0.5 rounded text-xs select-all text-right">{scanner.apiKey}</span>
              </div>
              {scanner.customParams && Object.keys(scanner.customParams).length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Custom Parameters</span>
                  <div className="flex flex-wrap gap-1">
                    {Object.keys(scanner.customParams).map(k => (
                      <span key={k} className="text-[10px] bg-slate-700/50 text-slate-300 px-1.5 py-0.5 rounded border border-slate-600/30">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleOpenModal(scanner)} className="flex-1 bg-slate-700/50 hover:bg-slate-700 text-white py-2 rounded-lg text-sm flex justify-center items-center gap-2 transition-colors">
                <Edit2 className="w-4 h-4" /> 편집
              </button>
              <button onClick={() => handleDelete(scanner.id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition-colors border border-red-500/20">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {isModalOpen && mounted && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={handleCloseModal}>
          <div className="bg-slate-900 border border-slate-700/50 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden slide-in-from-bottom-8 animate-in mt-10 max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">
                {editingScanner ? "스캐너 편집" : "스캐너 추가"}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-white">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
              {/* Guidance Tooltip */}
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex gap-3 text-sm text-indigo-200">
                <Info className="w-5 h-5 flex-shrink-0 text-indigo-400" />
                <div>
                  <p className="font-semibold mb-1">Snyk API 가이드</p>
                  <p className="text-xs opacity-80">URL: <code className="text-indigo-300">https://api.snyk.io/rest/orgs/{"${org_id}"}/issues?version=2024-10-15</code></p>
                  <p className="text-xs opacity-80 mt-1">커스텀 파라미터에 <code className="text-indigo-300">org_id</code>와 조직 ID 값을 입력하세요.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-300 mb-1">스캐너 이름</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
                    placeholder="예: Snyk REST API"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-300 mb-1">유형</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                  >
                    <option value="VULNERABILITY">취약성</option>
                    <option value="CODE_QUALITY">코드 품질</option>
                    <option value="SAST">SAST</option>
                    <option value="DAST">DAST</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">API URL</label>
                <input
                  type="url"
                  required
                  value={formData.apiUrl}
                  onChange={(e) => setFormData({ ...formData, apiUrl: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-xs"
                  placeholder="https://api.example.com/orgs/${org_id}/issues"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <div className="flex justify-between items-bottom">
                    <label className="block text-sm font-medium text-slate-300 mb-1">API 키</label>
                  </div>
                  <input
                    type="password"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    placeholder={editingScanner ? "기존 키 유지" : "API Key 입력"}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-300 mb-1">스캔 빈도 (일)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.scanFrequencyDays}
                    onChange={(e) => setFormData({ ...formData, scanFrequencyDays: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Custom Parameters Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-300">커스텀 파라미터 (Placeholder)</label>
                  <button type="button" onClick={addParam} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold">
                    <Plus className="w-3 h-3" /> 추가
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {customParams.map((p, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        placeholder="Key (예: org_id)"
                        value={p.key}
                        onChange={(e) => updateParam(index, 'key', e.target.value)}
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <input
                        placeholder="Value"
                        value={p.value}
                        onChange={(e) => updateParam(index, 'value', e.target.value)}
                        className="flex-[1.5] bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button type="button" onClick={() => removeParam(index)} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Connection Result */}
              {testResult && (
                <div className={`p-3 rounded-lg flex items-center gap-2 text-sm animate-in fade-in slide-in-from-top-2 duration-300 ${testResult.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {testResult.success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
                  <span className="break-all">{testResult.success ? "연동 테스트 성공!" : `연동 실패: ${testResult.message}`}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-medium text-slate-300">스캐너 활성화</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, enabled: !formData.enabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.enabled ? 'bg-indigo-600' : 'bg-slate-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-800 sticky bottom-0 bg-slate-900 pb-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700 font-medium"
                >
                  취소
                </button>
                <div className="flex-1 flex gap-2">
                  <button
                    type="button"
                    disabled={testing}
                    onClick={handleTestConnection}
                    className="flex-1 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl transition-all border border-slate-600 flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                  >
                    {testing ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                    테스트
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] font-bold"
                  >
                    {editingScanner ? "변경 사항 저장" : "스캐너 등록"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
