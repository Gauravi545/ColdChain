'use client';
import { QRCodeSVG } from 'qrcode.react';
import { generateShipmentQRUrl } from '@/lib/utils';
import { Download, QrCode } from 'lucide-react';

interface QRGeneratorProps {
  shipmentId: string;
  productName?: string;
  size?: number;
}

export function QRGenerator({ shipmentId, productName, size = 180 }: QRGeneratorProps) {
  const url = generateShipmentQRUrl(shipmentId);

  const handleDownload = () => {
    const svg = document.getElementById(`qr-${shipmentId}`) as unknown as SVGElement;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `coldchain-qr-${shipmentId}.svg`;
    link.click();
  };

  return (
    <div className="glass-card border border-white/07 p-5">
      <div className="flex items-center gap-2 mb-4">
        <QrCode size={16} className="text-cyan-400" />
        <span className="text-sm font-semibold text-slate-200">Shipment QR Code</span>
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center gap-4">
        <div className="bg-white p-4 rounded-xl">
          <QRCodeSVG
            id={`qr-${shipmentId}`}
            value={url}
            size={size}
            bgColor="#ffffff"
            fgColor="#0b1120"
            level="M"
            includeMargin={false}
          />
        </div>

        {/* Print label */}
        <div className="text-center">
          <p className="text-xs font-mono text-cyan-400 font-semibold">{shipmentId}</p>
          {productName && <p className="text-xs text-slate-500 mt-0.5">{productName}</p>}
          <p className="text-xs text-slate-600 mt-0.5 break-all max-w-[200px]">{url}</p>
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <Download size={12} />
          Download QR Code
        </button>
      </div>
    </div>
  );
}
