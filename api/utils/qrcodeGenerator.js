import QRCode from'qrcode';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

// QR Code Generator Utility
const qrCodeGenerator = {
  async generate(data) {
    try {
      // Create directory if not exists
      const qrDir = path.join(__dirname, '../uploads/qrcodes');
      await fs.mkdir(qrDir, { recursive: true });

      // Generate unique filename
      const filename = `qr_${Date.now()}.png`;
      const filepath = path.join(qrDir, filename);

      // Generate QR Code
      await QRCode.toFile(filepath, JSON.stringify(data), {
        errorCorrectionLevel: 'H',
        type: 'png',
        quality: 0.92,
        margin: 1
      });

      // Return relative path
      return `/uploads/qrcodes/${filename}`;
    } catch (error) {
      console.error('QR Code Generation Error:', error);
      throw new Error('Failed to generate QR code');
    }
  }
};

module.exports = {
    qrCodeGenerator
  };