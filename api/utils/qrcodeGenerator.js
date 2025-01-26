import QRCode from 'qrcode'
import path from 'path';
import fs from 'fs'
const qrCodeGenerator = {
  async generate(data) {
    try {
      // Create uploads directory if it doesn't exist
      const uploadDir = path.join(__dirname, '../uploads/qrcodes');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Generate unique filename
      const filename = `qr_${Date.now()}.png`;
      const filepath = path.join(uploadDir, filename);

      // Generate QR Code
      await QRCode.toFile(filepath, JSON.stringify(data), {
        errorCorrectionLevel: 'H'
      });

      // Return relative path
      return `/uploads/qrcodes/${filename}`;
    } catch (error) {
      console.error('QR Code Generation Error:', error);
      throw new Error('Failed to generate QR code');
    }
  }
};

export default qrCodeGenerator