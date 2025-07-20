# QRIS Dynamic Generator

This is a web-based tool to convert a static QRIS (Quick Response Code Indonesian Standard) into a dynamic one. Users can upload a static QRIS image, specify a payment amount and an optional transaction fee, and the application will generate a new, dynamic QRIS code ready for payment. The app also conveniently saves your previously used QRIS codes for quick access.

## ✨ Features

* **Static to Dynamic QRIS Conversion**: The core feature is to generate a dynamic QRIS from a static one by embedding the payment amount.
* **QR Code Scanning**: Upload a QRIS code image (PNG, JPG, GIF) to automatically scan its data.
* **Custom Amount & Fee**: Set a specific payment amount for the dynamic QRIS.
* **Flexible Transaction Fees**: Add a transaction fee, calculated either as a fixed amount (Rupiah) or a percentage.
* **QRIS History**: The app saves up to 5 of your most recently used QRIS codes in your browser's local storage for easy reuse.
* **Payment-Ready Display**: Shows the generated dynamic QRIS on a clean payment screen, complete with the merchant's name and the total amount.
* **Responsive Design**: A mobile-first design that works smoothly on both desktop and mobile browsers.

## 🚀 How It Works

1.  **Upload & Scan**: The user uploads an image of a static QRIS code. The `jsQR` library is used to read the QR code from the image and extract the static QRIS string data.
2.  **Input Data**: The user enters the desired payment amount and, optionally, a transaction fee on the main form.
3.  **Generate Dynamic QRIS**: The application takes the static QRIS data and injects new tags for the payment amount (`54`) and transaction fee (`55`, `56`, or `57`). It then replaces the static QRIS indicator (`010211`) with the dynamic one (`010212`).
4.  **Recalculate CRC**: A new CRC-16 checksum is calculated for the modified QRIS string to ensure its validity.
5.  **Render QR Code**: The final dynamic QRIS string is rendered as a new QR code image on the payment page using the `qrcode-generator` library.

## 🛠️ Technologies Used

* **Frontend**: React 19, TypeScript
* **Build Tool**: Vite
* **Styling**: Tailwind CSS
* **QR Code Reading**: `jsQR`
* **QR Code Generation**: `qrcode-generator`
* **Icons**: Font Awesome

## ⚙️ Setup and Run Locally

**Prerequisites:** [Node.js](https://nodejs.org/)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/qris-dinamis-generator.git
    cd qris-dinamis-generator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```


3.  **Run the development server:**
    ```bash
    npm run dev
    ```

    The application will be running at `http://localhost:5173` (or another port if 5173 is busy).
