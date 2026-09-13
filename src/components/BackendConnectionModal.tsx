import React, { useState, useEffect } from 'react';
import {
  Server,
  Wifi,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  ExternalLink,
  Laptop,
  Smartphone,
  Copy,
  Check,
} from 'lucide-react';
import {
  getApiBaseUrl,
  getStoredBackendUrl,
  setStoredBackendUrl,
  testBackendConnection,
  isNativeApkRuntime,
} from '../services/complianceEngine';

interface BackendConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectionSuccess?: () => void;
}

export const BackendConnectionModal: React.FC<BackendConnectionModalProps> = ({
  isOpen,
  onClose,
  onConnectionSuccess,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    ok: boolean;
    message: string;
    hasGeminiKey?: boolean;
  }>({
    tested: false,
    ok: false,
    message: '',
  });
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const current = getStoredBackendUrl() || getApiBaseUrl();
      setUrlInput(current);
      // Automatically test connection on open
      runTest(current);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const runTest = async (targetUrl: string) => {
    setIsTesting(true);
    setTestResult({ tested: false, ok: false, message: '' });
    try {
      const res = await testBackendConnection(targetUrl.trim());
      setTestResult({
        tested: true,
        ok: res.ok,
        message: res.message,
        hasGeminiKey: res.hasGeminiKey,
      });
      if (res.ok && onConnectionSuccess) {
        onConnectionSuccess();
      }
    } catch (err: any) {
      setTestResult({
        tested: true,
        ok: false,
        message: err?.message || 'Connection failed',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    setStoredBackendUrl(urlInput.trim());
    runTest(urlInput.trim());
  };

  const handleResetToDefault = () => {
    setStoredBackendUrl('');
    const def = isNativeApkRuntime() ? 'http://localhost:3000' : '';
    setUrlInput(def);
    runTest(def);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(id);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const isApk = isNativeApkRuntime();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Backend Server Connection</h3>
              <p className="text-[11px] text-slate-500">
                {isApk ? 'Configuring Android APK Server Endpoint' : 'LMPC AI Analysis Server'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Status Banner */}
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
              !testResult.tested
                ? 'bg-slate-50 border-slate-200 text-slate-700'
                : testResult.ok
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isTesting ? (
                <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
              ) : testResult.tested && testResult.ok ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : testResult.tested && !testResult.ok ? (
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              ) : (
                <Wifi className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div className="space-y-0.5 flex-1">
              <div className="font-bold">
                {isTesting
                  ? 'Testing server connection...'
                  : testResult.tested && testResult.ok
                  ? 'Server Online & Ready'
                  : testResult.tested && !testResult.ok
                  ? 'Connection Issue Detected'
                  : 'Connection Status'}
              </div>
              <p className="text-[11px] opacity-90">
                {isTesting
                  ? 'Sending ping to /api/health endpoint...'
                  : testResult.message || 'Configure your backend endpoint below.'}
              </p>
            </div>
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Analysis Server Base URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={isApk ? 'http://192.168.1.x:3000 or http://localhost:3000' : 'e.g. http://localhost:3000'}
                className="flex-1 px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => runTest(urlInput)}
                disabled={isTesting}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>Test</span>
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick Presets
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setUrlInput('http://localhost:3000');
                  setStoredBackendUrl('http://localhost:3000');
                  runTest('http://localhost:3000');
                }}
                className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Smartphone className="w-3 h-3 text-slate-500" />
                <span>Localhost (USB / ADB)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUrlInput('http://10.0.2.2:3000');
                  setStoredBackendUrl('http://10.0.2.2:3000');
                  runTest('http://10.0.2.2:3000');
                }}
                className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Android Emulator (10.0.2.2)</span>
              </button>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg cursor-pointer transition-colors"
              >
                Reset Default
              </button>
            </div>
          </div>

          {/* Clear Setup Guide for Mobile APK */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Laptop className="w-3.5 h-3.5 text-emerald-600" />
              <span>How to connect your Android Phone</span>
            </div>

            <div className="space-y-2 text-[11px] text-slate-600 leading-relaxed">
              {/* Option A: USB + adb reverse */}
              <div className="p-2 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800 text-[11px] flex items-center justify-between">
                  <span>Method 1: USB Cable (Fastest &amp; Easiest)</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">
                    Recommended
                  </span>
                </div>
                <p className="text-slate-500 text-[10px]">
                  1. In terminal on your PC, run:
                </p>
                <div className="flex items-center justify-between bg-slate-900 text-slate-100 px-2 py-1 rounded text-[10px] font-mono">
                  <span>adb reverse tcp:3000 tcp:3000</span>
                  <button
                    onClick={() => copyToClipboard('adb reverse tcp:3000 tcp:3000', 'adb')}
                    className="p-1 hover:text-emerald-400 text-slate-400 cursor-pointer"
                    title="Copy command"
                  >
                    {copiedCommand === 'adb' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <p className="text-slate-500 text-[10px]">
                  2. Set URL to <strong className="text-slate-700">http://localhost:3000</strong> and tap Save.
                </p>
              </div>

              {/* Option B: Local Wi-Fi */}
              <div className="p-2 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800 text-[11px]">
                  Method 2: Same Wi-Fi Network
                </div>
                <p className="text-slate-500 text-[10px]">
                  Connect your phone and PC to the same Wi-Fi. Run <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">ipconfig</code> on your PC to find your IPv4 (e.g. 192.168.1.35), then enter <strong className="text-slate-700">http://192.168.1.35:3000</strong>.
                </p>
              </div>

              {/* Server start command reminder */}
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200 flex items-center justify-between">
                <span>Start server on PC:</span>
                <div className="flex items-center gap-1.5">
                  <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-800">
                    npm run dev
                  </code>
                  <button
                    onClick={() => copyToClipboard('npm run dev', 'npm')}
                    className="p-0.5 text-slate-500 hover:text-slate-900 cursor-pointer"
                  >
                    {copiedCommand === 'npm' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Save &amp; Connect
          </button>
        </div>
      </div>
    </div>
  );
};
