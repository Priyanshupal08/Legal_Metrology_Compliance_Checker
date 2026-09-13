import React, { useState } from 'react';
import {
  Server,
  Wifi,
  Laptop,
  Smartphone,
  Copy,
  Check,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { ToolHeader } from './ToolHeader';
import { AppPage } from '../Sidebar';
import {
  getApiBaseUrl,
  getStoredBackendUrl,
  setStoredBackendUrl,
  testBackendConnection,
  isNativeApkRuntime,
} from '../../services/complianceEngine';

interface ServerSyncToolViewProps {
  onBack: () => void;
  onSelectTool: (tool: AppPage) => void;
}

export const ServerSyncToolView: React.FC<ServerSyncToolViewProps> = ({
  onBack,
  onSelectTool,
}) => {
  const [serverUrl, setServerUrl] = useState(() => getStoredBackendUrl() || getApiBaseUrl());
  const [serverTesting, setServerTesting] = useState(false);
  const [serverTestResult, setServerTestResult] = useState<{
    tested: boolean;
    ok: boolean;
    message: string;
  }>({ tested: false, ok: false, message: '' });
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const testServer = async (url: string) => {
    setServerTesting(true);
    setServerTestResult({ tested: false, ok: false, message: '' });
    try {
      const res = await testBackendConnection(url.trim());
      setServerTestResult({ tested: true, ok: res.ok, message: res.message });
    } catch (err: any) {
      setServerTestResult({ tested: true, ok: false, message: err?.message || 'Connection failed' });
    } finally {
      setServerTesting(false);
    }
  };

  const saveServer = () => {
    setStoredBackendUrl(serverUrl.trim());
    testServer(serverUrl.trim());
  };

  const copyText = (txt: string, key: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedCmd(key);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <ToolHeader
        currentTool="tool-server"
        title="Backend Server & Mobile Device Sync"
        subtitle="Configure and test connectivity between Android mobile APK and the LMPC Gemini vision backend."
        statutoryReference="System Architecture"
        onBack={onBack}
        onSelectTool={onSelectTool}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Server Configuration */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-600" />
              <span>Analysis Server Endpoint</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-500">
              Runtime: {isNativeApkRuntime() ? 'Android Native APK' : 'Web Browser'}
            </span>
          </div>

          {/* Status Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
              !serverTestResult.tested
                ? 'bg-slate-50 border-slate-200 text-slate-700'
                : serverTestResult.ok
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {serverTesting ? (
                <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin" />
              ) : serverTestResult.tested && serverTestResult.ok ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : serverTestResult.tested && !serverTestResult.ok ? (
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              ) : (
                <Wifi className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <div className="space-y-0.5 flex-1">
              <div className="font-bold text-sm">
                {serverTesting
                  ? 'Testing server connection...'
                  : serverTestResult.tested && serverTestResult.ok
                  ? 'Connection Verified'
                  : serverTestResult.tested && !serverTestResult.ok
                  ? 'Connection Error'
                  : 'Current Endpoint Status'}
              </div>
              <p className="text-xs opacity-90">
                {serverTesting
                  ? 'Pinging server /api/health endpoint...'
                  : serverTestResult.message || 'Configure your analysis endpoint below and run a test.'}
              </p>
            </div>
          </div>

          {/* Endpoint Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Analysis Server Base URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="e.g. http://localhost:3000 or http://192.168.1.35:3000"
                className="flex-1 px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => testServer(serverUrl)}
                disabled={serverTesting}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${serverTesting ? 'animate-spin' : ''}`} />
                <span>Ping</span>
              </button>
              <button
                type="button"
                onClick={saveServer}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick Connection Presets
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setServerUrl('http://localhost:3000');
                  setStoredBackendUrl('http://localhost:3000');
                  testServer('http://localhost:3000');
                }}
                className="text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                <span>Localhost (USB ADB Reverse)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setServerUrl('http://10.0.2.2:3000');
                  setStoredBackendUrl('http://10.0.2.2:3000');
                  testServer('http://10.0.2.2:3000');
                }}
                className="text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Android Emulator (10.0.2.2)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setServerUrl('');
                  setStoredBackendUrl('');
                  testServer('');
                }}
                className="text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg cursor-pointer transition-colors"
              >
                Reset Default
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Setup Instructions */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-xl p-6 space-y-4 shadow-md border border-slate-800">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Laptop className="w-4 h-4" />
            <span>Mobile Device Deployment Guide</span>
          </span>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 space-y-2">
              <span className="font-bold text-white text-xs block">Option 1: USB Cable (Easiest)</span>
              <p className="text-[11px] text-slate-300">
                1. Connect phone to PC via USB cable (enable USB debugging in Developer Options).
              </p>
              <p className="text-[11px] text-slate-300">2. In command terminal on your PC, execute:</p>
              <div className="flex items-center justify-between bg-slate-950 px-2.5 py-1.5 rounded text-[11px] font-mono text-emerald-400 border border-slate-800">
                <span>adb reverse tcp:3000 tcp:3000</span>
                <button
                  onClick={() => copyText('adb reverse tcp:3000 tcp:3000', 'adb_cmd')}
                  className="p-1 hover:text-white text-slate-400 cursor-pointer"
                  title="Copy command"
                >
                  {copiedCmd === 'adb_cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-300">
                3. Keep URL set to <strong className="text-white">http://localhost:3000</strong>.
              </p>
            </div>

            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 space-y-1.5">
              <span className="font-bold text-white text-xs block">Option 2: Local Wi-Fi Network</span>
              <p className="text-[11px] text-slate-300">
                Ensure phone and PC are connected to the same Wi-Fi network. Find your PC local IP (<code className="text-emerald-400">ipconfig</code> on Windows or <code className="text-emerald-400">ifconfig</code> on Mac/Linux), then enter:
              </p>
              <div className="bg-slate-950 px-2.5 py-1.5 rounded text-[11px] font-mono text-emerald-400 border border-slate-800">
                http://&lt;your-pc-ip&gt;:3000
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
