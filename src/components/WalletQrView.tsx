import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Wallet, QrCode, Shield, CheckCircle2, ArrowRight, ExternalLink, RefreshCw, Copy, Check } from 'lucide-react';

interface WalletQrViewProps {
  connected: boolean;
  address: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const WalletQrView: React.FC<WalletQrViewProps> = ({
  connected,
  address,
  onConnect,
  onDisconnect
}) => {
  const [recipient, setRecipient] = useState<string>('0x1234567890123456789012345678901234567890');
  const [amountEth, setAmountEth] = useState<number>(0.05);
  const [selectedToken, setSelectedToken] = useState<'ETH' | 'ARB' | 'QMOOSA'>('QMOOSA');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [paymentUri, setPaymentUri] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Generate EIP-681 standard Arbitrum payment URI
  useEffect(() => {
    const wei = BigInt(Math.floor(amountEth * 1e18)).toString();
    const uri = `ethereum:${recipient}@42161?value=${wei}`;
    setPaymentUri(uri);

    QRCode.toDataURL(uri, {
      width: 260,
      margin: 2,
      color: {
        dark: '#0f172a', // slate-900
        light: '#ffffff'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR code generation error:', err));
  }, [recipient, amountEth, selectedToken]);

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" /> Multiwallet Connection
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800">
                EIP-681 QR Standard
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Multiwallet & QR Code Payment Terminal
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Seamlessly connect MetaMask, Coinbase, and WalletConnect providers on Arbitrum. Generate and scan standardized EIP-681 payment QR codes with automatic chain ID enforcement.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {connected ? (
              <button
                onClick={onDisconnect}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
              >
                <span>Disconnect {address.slice(0, 6)}...</span>
              </button>
            ) : (
              <button
                onClick={onConnect}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Multiwallet</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Wallet State & QR Payment Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Wallet Balances & Network Status */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wallet className="w-4 h-4 text-cyan-400" />
                <span>Wallet Account & Balances</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">
                Chain ID: 42161
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-500">Connected Address:</div>
                <div className="text-cyan-300 font-bold truncate">
                  {connected ? address : '0x71C...a891 (Simulated Arbitrum Wallet)'}
                </div>
              </div>

              {/* Token Balances */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">ETH (L2)</div>
                  <div className="text-base font-bold text-white mt-0.5">1.452</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">~$3,630</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">ARB</div>
                  <div className="text-base font-bold text-cyan-300 mt-0.5">2,500</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">~$2,125</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">QMOOSA</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">150,000</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Governed Token</div>
                </div>
              </div>
            </div>

            {/* Zero-Seed Warning Box */}
            <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-900/60 text-xs text-indigo-300 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-[11px]">Zero-Seed Security Guarantee:</div>
                <p className="text-[10px] text-slate-300 leading-normal">
                  The application strictly uses standardized JSON-RPC window.ethereum connectors. It will never request or accept private keys or 12/24-word recovery phrases.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic EIP-681 QR Payment Generator */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>EIP-681 Dynamic Arbitrum QR Generator</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">
              Live Rendering
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            {/* Input Form */}
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Recipient Address (Arbitrum):</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-xs text-white truncate focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Amount:</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={amountEth}
                    onChange={(e) => setAmountEth(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
                  />
                  <select
                    value={selectedToken}
                    onChange={(e) => setSelectedToken(e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-xs text-slate-200"
                  >
                    <option value="ETH">ETH</option>
                    <option value="ARB">ARB</option>
                    <option value="QMOOSA">QMOOSA</option>
                  </select>
                </div>
              </div>

              {/* Copy URI */}
              <div className="space-y-1 pt-1">
                <div className="text-[10px] text-slate-500 font-mono">Standardized Payment URI:</div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={paymentUri}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-[10px] text-slate-400 truncate"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            {/* QR Code Canvas Card */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950 border border-slate-800 shadow-inner space-y-2.5">
              {qrDataUrl ? (
                <div className="p-3 bg-white rounded-xl shadow-lg ring-4 ring-cyan-500/30">
                  <img src={qrDataUrl} alt="EIP-681 Arbitrum Payment QR Code" className="w-48 h-48 rounded" />
                </div>
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-slate-600 font-mono text-xs">
                  Generating QR...
                </div>
              )}
              <div className="text-[11px] font-mono text-slate-400 text-center">
                Scan with MetaMask or any EIP-681 compatible mobile wallet
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
