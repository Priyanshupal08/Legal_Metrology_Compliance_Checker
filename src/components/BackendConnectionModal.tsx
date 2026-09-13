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
  const [activeGuideTab, setActiveGuideTab] = useState<'wifi' | 'usb'>('wifi');

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
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Laptop className="w-3.5 h-3.5 text-emerald-600" />
                <span>Step-by-Step Connection Instructions</span>
              </div>
              {/* Tabs */}
              <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-[10px] font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveGuideTab('wifi')}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                    activeGuideTab === 'wifi' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Option 1: Same Wi-Fi
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGuideTab('usb')}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                    activeGuideTab === 'usb' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Option 2: USB Cable (Easiest)
                </button>
              </div>
            </div>

            {activeGuideTab === 'wifi' ? (
              <div className="space-y-2 text-[11px] text-slate-600 leading-relaxed">
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-200">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800 text-[11px]">Connect to the SAME Wi-Fi</p>
                      <p className="text-slate-500 text-[10px]">
                        Connect both your phone and PC to the exact same Wi-Fi router. (Or turn on Mobile Hotspot on your phone and connect your PC to it).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-200">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <div className="space-y-1 flex-1">
                      <p className="font-bold text-slate-800 text-[11px]">Start the Dev Server on your PC</p>
                      <div className="flex items-center justify-between bg-slate-900 text-slate-100 px-2 py-1 rounded text-[10px] font-mono">
                        <span>npm run dev</span>
                        <button
                          onClick={() => copyToClipboard('npm run dev', 'npm')}
                          className="p-0.5 text-slate-400 hover:text-emerald-400 cursor-pointer"
                          title="Copy command"
                        >
                          {copiedCommand === 'npm' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400">Keep this terminal window running.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-200">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <div className="space-y-1 flex-1">
                      <p className="font-bold text-slate-800 text-[11px]">Find your PC's IP Address</p>
                      <p className="text-slate-500 text-[10px]">
                        Open a 2nd terminal on your PC and run <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-slate-700">ipconfig</code>. Look for <strong className="text-slate-800">IPv4 Address</strong> (e.g., <code className="font-mono text-emerald-700 font-bold">192.168.1.35</code>).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-200">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      4
                    </span>
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800 text-[11px]">Enter URL in App &amp; Save</p>
                      <p className="text-slate-500 text-[10px]">
                        In the input box above, type: <strong className="text-slate-800">http://&lt;your-pc-ip&gt;:3000</strong> (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">http://192.168.1.35:3000</code>) and tap <strong>Save &amp; Connect</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-2 text-[10px] text-amber-800 leading-snug">
                  <strong>💡 Windows Firewall Tip:</strong> If the connection times out, Windows Firewall might be blocking port 3000. In Windows Settings &gt; Wi-Fi, ensure your network profile is set to <strong>"Private"</strong> (not Public), or temporarily allow Node.js through firewall.
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-[11px] text-slate-600 leading-relaxed">
                <div className="p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-200 text-[10px] text-emerald-900">
                  <strong>Why USB is the easiest:</strong> USB cable connection avoids all Wi-Fi router isolation, firewall blocks, and IP address changes completely!
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-200">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <p className="text-slate-700 text-[10px] pt-0.5">
                      Connect your phone to PC with a USB cable (enable <strong>USB Debugging</strong> in phone developer options).
                    </p>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-200">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <div className="space-y-1 flex-1">
                      <p className="font-bold text-slate-800 text-[11px]">Run reverse port forwarding in terminal on PC:</p>
                      <div className="flex items-center justify-between bg-slate-900 text-slate-100 px-2 py-1 rounded text-[10px] font-mono">
                        <span>adb reverse tcp:3000 tcp:3000</span>
                        <button
                          onClick={() => copyToClipboard('adb reverse tcp:3000 tcp:3000', 'adb')}
                          className="p-0.5 hover:text-emerald-400 text-slate-400 cursor-pointer"
                          title="Copy command"
                        >
                          {copiedCommand === 'adb' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-200">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <div className="space-y-1 flex-1">
                      <p className="font-bold text-slate-800 text-[11px]">Start the server on PC:</p>
                      <div className="flex items-center justify-between bg-slate-900 text-slate-100 px-2 py-1 rounded text-[10px] font-mono">
                        <span>npm run dev</span>
                        <button
                          onClick={() => copyToClipboard('npm run dev', 'npm2')}
                          className="p-0.5 text-slate-400 hover:text-emerald-400 cursor-pointer"
                          title="Copy command"
                        >
                          {copiedCommand === 'npm2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-200">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      4
                    </span>
                    <p className="text-slate-700 text-[10px] pt-0.5">
                      Click the <strong className="text-slate-900">"Localhost (USB / ADB)"</strong> preset button above and tap <strong>Save &amp; Connect</strong>!
                    </p>
                  </div>
                </div>
              </div>
            )}
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
