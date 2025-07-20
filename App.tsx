import React, { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { PaymentPage } from './pages/PaymentPage';
import type { PaymentData } from './types';

// Make qrcode available from the global scope (window)
declare var qrcode: any;

// Utility function to calculate CRC16 checksum, ported from the PHP example
const crc16 = (str: string): string => {
  let crc = 0xFFFF;
  const strlen = str.length;
  for (let c = 0; c < strlen; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  const hex = (crc & 0xFFFF).toString(16).toUpperCase();
  return hex.padStart(4, '0');
};

// Extracts the merchant name (Tag 59) from the static QRIS string.
const parseMerchantName = (qrisData: string): string => {
    const tag = '59';
    const tagIndex = qrisData.indexOf(tag);
    if (tagIndex === -1) {
      return 'Merchant'; // Default name if tag not found
    }
    
    try {
        const lengthIndex = tagIndex + tag.length;
        const lengthStr = qrisData.substring(lengthIndex, lengthIndex + 2);
        const length = parseInt(lengthStr, 10);
    
        if (isNaN(length) || length <= 0) {
          return 'Merchant';
        }

        const valueIndex = lengthIndex + 2;
        const merchantName = qrisData.substring(valueIndex, valueIndex + length);
        return merchantName.trim() || 'Merchant';
    } catch (e) {
        console.error("Failed to parse merchant name:", e);
        return 'Merchant';
    }
};

// Main logic to generate dynamic QRIS string, ported from PHP
const generateDynamicQris = (
  staticQris: string,
  amount: string,
  feeType: 'Persentase' | 'Rupiah',
  feeValue: string
): string => {
  if (staticQris.length < 4) {
    throw new Error('Invalid static QRIS data.');
  }

  const qrisWithoutCrc = staticQris.substring(0, staticQris.length - 4);
  const step1 = qrisWithoutCrc.replace("010211", "010212");
  
  const parts = step1.split("5802ID");
  if (parts.length !== 2) {
    throw new Error("QRIS data is not in the expected format (missing '5802ID').");
  }

  const amountStr = String(parseInt(amount, 10)); // Remove leading zeros and decimals
  const amountTag = "54" + String(amountStr.length).padStart(2, '0') + amountStr;

  let feeTag = "";
  if (feeValue && parseFloat(feeValue) > 0) {
    if (feeType === 'Rupiah') {
      const feeValueStr = String(parseInt(feeValue, 10));
      feeTag = "55020256" + String(feeValueStr.length).padStart(2, '0') + feeValueStr;
    } else { // Persentase
      const feeValueStr = feeValue;
      feeTag = "55020357" + String(feeValueStr.length).padStart(2, '0') + feeValueStr;
    }
  }

  const payload = [parts[0], amountTag, feeTag, "5802ID", parts[1]].join('');
  
  const finalCrc = crc16(payload);
  return payload + finalCrc;
};


const App: React.FC = () => {
  const [route, setRoute] = useState<'home' | 'payment'>('home');
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const handleGenerate = (
      staticQris: string, 
      amount: string, 
      feeType: 'Persentase' | 'Rupiah', 
      feeValue: string
    ) => {
        const qrString = generateDynamicQris(staticQris, amount, feeType, feeValue);
        const merchantName = parseMerchantName(staticQris);
        setPaymentData({ qrString, amount, merchantName });
        setRoute('payment');
  };

  const handleBackToHome = () => {
    setPaymentData(null);
    setRoute('home');
  };

  return (
    <div className="min-h-screen font-sans bg-zinc-50 sm:flex sm:items-center sm:justify-center sm:p-4">
      <div className="w-full h-screen bg-white sm:h-auto sm:max-w-sm sm:rounded-3xl sm:shadow-lg sm:overflow-hidden flex flex-col">
        <main className="flex-grow overflow-y-auto">
            {route === 'home' && <HomePage onGenerate={handleGenerate} parseMerchantName={parseMerchantName} />}
            {route === 'payment' && paymentData && <PaymentPage paymentData={paymentData} onBack={handleBackToHome} />}
        </main>
        <footer className="text-center text-xs text-zinc-400 py-3 border-t border-zinc-100 flex-shrink-0">
          Code by Ogya Adyatma Putra & cetass cetass
        </footer>
      </div>
    </div>
  );
};

export default App;