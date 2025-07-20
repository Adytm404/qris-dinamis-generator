import React, { useState, useRef, useCallback } from 'react';
import { ImagePlusIcon } from './icons';

// Make jsQR and qrcode available from the global scope (window)
declare var jsQR: any;

interface ImageUploaderProps {
  onQrDecode: (data: string | null, error?: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onQrDecode }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setImagePreview(null);
      setScanStatus('idle');
      onQrDecode(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      
      const image = new Image();
      image.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const context = canvas.getContext('2d', { willReadFrequently: true });
          if (context) {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0, image.width, image.height);
            const imageData = context.getImageData(0, 0, image.width, image.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            if (code) {
              setScanStatus('success');
              onQrDecode(code.data);
            } else {
              setScanStatus('error');
              onQrDecode(null, 'Could not find a QR code in the image.');
            }
          }
        }
      };
      image.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const statusClasses = {
      idle: 'border-zinc-300 hover:border-blue-500',
      success: 'border-green-500',
      error: 'border-red-500',
  }

  return (
    <>
      <div
        onClick={handleClick}
        className={`w-32 h-32 mx-auto flex items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer hover:bg-zinc-50 transition-colors ${statusClasses[scanStatus]}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/gif"
        />
        {imagePreview ? (
          <img src={imagePreview} alt="QRIS preview" className="w-full h-full object-cover rounded-2xl" />
        ) : (
          <div className="flex flex-col items-center text-zinc-400">
            <ImagePlusIcon className="text-4xl" />
            <span className="text-sm mt-2">Upload QRIS</span>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden"></canvas>
    </>
  );
};