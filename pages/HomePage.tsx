import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { FormField } from '../components/FormField';
import { ImageUploader } from '../components/ImageUploader';
import { ChevronDownIcon, TrashIcon } from '../components/icons';
import type { DynamicQrisFormData, SavedQrisItem } from '../types';

const MAX_SAVED_QRIS = 5;

interface HomePageProps {
  onGenerate: (
    staticQris: string,
    amount: string,
    feeType: 'Persentase' | 'Rupiah',
    feeValue: string
  ) => void;
  parseMerchantName: (qrisData: string) => string;
}

export const HomePage: React.FC<HomePageProps> = ({ onGenerate, parseMerchantName }) => {
  const [formData, setFormData] = useState<DynamicQrisFormData>({
    paymentAmount: '',
    transactionFeeType: 'Persentase',
    transactionFeeValue: '',
  });
  const [staticQrisData, setStaticQrisData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedQris, setSavedQris] = useState<SavedQrisItem[]>([]);

  useEffect(() => {
    try {
        const storedQris = localStorage.getItem('qrisHistory');
        if (storedQris) {
            setSavedQris(JSON.parse(storedQris));
        }
    } catch (e) {
        console.error("Failed to load QRIS history from localStorage", e);
        localStorage.removeItem('qrisHistory');
    }
  }, []);

  const updateSavedQris = (newHistory: SavedQrisItem[]) => {
      setSavedQris(newHistory);
      localStorage.setItem('qrisHistory', JSON.stringify(newHistory));
  };
  
  const handleQrDecode = (data: string | null, errorMessage?: string) => {
    setStaticQrisData(data);
    if (errorMessage && !data) {
        setError(errorMessage);
    } else {
        setError(null);
    }
    
    if (data) {
        const isDuplicate = savedQris.some(item => item.qrisString === data);
        if (!isDuplicate) {
            const merchantName = parseMerchantName(data);
            const newItem: SavedQrisItem = { merchantName, qrisString: data };
            
            let newHistory = [newItem, ...savedQris];
            if (newHistory.length > MAX_SAVED_QRIS) {
                newHistory = newHistory.slice(0, MAX_SAVED_QRIS);
            }
            updateSavedQris(newHistory);
        }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUseQris = (qrisString: string) => {
    setStaticQrisData(qrisString);
    setError(null);
  };

  const handleDeleteQris = (qrisStringToDelete: string) => {
    const newHistory = savedQris.filter(item => item.qrisString !== qrisStringToDelete);
    updateSavedQris(newHistory);
    if (staticQrisData === qrisStringToDelete) {
        setStaticQrisData(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!staticQrisData) {
      setError("Please upload or select a valid static QRIS code first.");
      return;
    }
    if (!formData.paymentAmount || parseFloat(formData.paymentAmount) <= 0) {
      setError("Please enter a valid payment amount.");
      return;
    }

    try {
      onGenerate(
        staticQrisData,
        formData.paymentAmount,
        formData.transactionFeeType,
        formData.transactionFeeValue
      );
    } catch (err: any) {
      setError(err.message || 'Failed to generate QRIS code. Please check the inputs.');
    }
  };

  return (
    <>
        <Header title="QRIS Dynamic Generator" />
        
        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
          <ImageUploader onQrDecode={handleQrDecode} />
          
          {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
          {staticQrisData && !error && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm truncate">QRIS Scanned: {staticQrisData}</div>}

          {savedQris.length > 0 && (
            <div className="space-y-3 pt-2">
                <h3 className="text-md font-semibold text-zinc-800">Saved QRIS</h3>
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {savedQris.map((item) => (
                        <li 
                            key={item.qrisString} 
                            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                                staticQrisData === item.qrisString
                                ? 'bg-blue-200'
                                : 'bg-zinc-100 hover:bg-zinc-200'
                            }`}
                        >
                            <span className="text-sm font-medium text-zinc-700 truncate pr-2 flex-1">{item.merchantName}</span>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => handleUseQris(item.qrisString)}
                                    className="px-3 py-1 text-xs font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                >
                                    Use
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQris(item.qrisString)}
                                    className="p-2 text-zinc-500 hover:text-red-500 rounded-full hover:bg-zinc-300 transition-colors"
                                    aria-label={`Delete ${item.merchantName}`}
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
          )}

          <FormField label="Jumlah Bayar" htmlFor="paymentAmount">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500">Rp</span>
              <input
                type="number"
                id="paymentAmount"
                name="paymentAmount"
                value={formData.paymentAmount}
                onChange={handleChange}
                placeholder="0"
                required
                className="w-full p-4 pl-10 bg-zinc-100 rounded-xl placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
          </FormField>

          <FormField label="Fee transaksi" htmlFor="transactionFeeType">
            <div className="flex items-center space-x-2">
              <div className="relative w-1/2">
                <select
                  id="transactionFeeType"
                  name="transactionFeeType"
                  value={formData.transactionFeeType}
                  onChange={handleChange}
                  className="w-full p-4 bg-zinc-100 rounded-xl placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10"
                >
                  <option value="Persentase">Persentase</option>
                  <option value="Rupiah">Rupiah</option>
                </select>
                <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              </div>
              <div className="relative w-1/2">
                <input
                  type="number"
                  id="transactionFeeValue"
                  name="transactionFeeValue"
                  value={formData.transactionFeeValue}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full p-4 bg-zinc-100 rounded-xl placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                  min="0"
                  step="any"
                />
                 <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-500">
                  {formData.transactionFeeType === 'Persentase' ? '%' : 'Rp'}
                 </span>
              </div>
            </div>
          </FormField>
          
          <div className="pt-4">
             <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300">
               Generate & Pay
             </button>
          </div>
        </form>
    </>
  );
};