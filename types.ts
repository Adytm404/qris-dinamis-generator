export interface DynamicQrisFormData {
  paymentAmount: string;
  transactionFeeType: 'Persentase' | 'Rupiah';
  transactionFeeValue: string;
}

export interface PaymentData {
    qrString: string;
    amount: string;
    merchantName: string;
}

export interface SavedQrisItem {
  merchantName: string;
  qrisString: string;
}
