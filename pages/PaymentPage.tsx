import React, { useEffect, useRef } from 'react';
import type { PaymentData } from '../types';
import { Header } from '../components/Header';

// Make qrcode available from the global scope (window)
declare var qrcode: any;

interface PaymentPageProps {
  paymentData: PaymentData;
  onBack: () => void;
}

const formatCurrency = (amount: string) => {
    const number = parseFloat(amount);
    if (isNaN(number)) return "0.00";
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
};

export const PaymentPage: React.FC<PaymentPageProps> = ({ paymentData, onBack }) => {
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paymentData.qrString && qrCodeRef.current) {
      qrCodeRef.current.innerHTML = ''; // Clear previous QR code
      try {
        const qr = qrcode(0, 'M'); // type 0, error correction 'M'
        qr.addData(paymentData.qrString);
        qr.make();
        // Use a larger cell size for a higher-res base image, looks better when scaled.
        qrCodeRef.current.innerHTML = qr.createImgTag(8, 4); // (module size, margin)
        // Make the injected img responsive
        const img = qrCodeRef.current.querySelector('img');
        if (img) {
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.imageRendering = 'pixelated'; // Keep pixels sharp
        }
      } catch (e) {
        console.error("Failed to render QR Code image:", e);
      }
    }
  }, [paymentData.qrString]);

  return (
    <>
      <Header title="Qris Payment" onBack={onBack} />
      <div className="flex flex-col items-center p-4 text-center">
        <h2 className="text-2xl font-bold text-zinc-800 mb-2 truncate max-w-full px-4">{paymentData.merchantName}</h2>
        <p className="text-zinc-800 text-lg font-semibold mb-4">
          Payment of Rp{formatCurrency(paymentData.amount)}
        </p>

        <div className="w-[95%] aspect-square mb-4">
            <div ref={qrCodeRef} className="w-full h-full flex items-center justify-center bg-white p-2 border border-zinc-200 rounded-lg shadow-sm">
                {/* QR Code is injected here */}
            </div>
        </div>
        
        <p className="text-zinc-400 text-xs mt-4">
          E-Wallet transaction cannot be refunded
        </p>
      </div>
    </>
  );
};