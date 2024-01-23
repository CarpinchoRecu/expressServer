const qrcode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');
const EventEmitter = require('events');

class WhatsAppEmitter extends EventEmitter {}

const whatsappEmitter = new WhatsAppEmitter();

const whatsapp = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
  authStrategy: new LocalAuth(),
});

whatsapp.on('qr', async (qr) => {
  try {
    const qrDataURL = await qrcode.toDataURL(qr, { errorCorrectionLevel: 'L' });
    console.log('Código QR generado:', qrDataURL);
    
    // Emitir el evento con el código QR
    whatsappEmitter.emit('qrCode', qrDataURL);
  } catch (error) {
    console.error('Error generando el código QR:', error);
  }
});

whatsapp.on('ready', () => {
  console.log('El cliente está conectado!');
});

module.exports = { whatsapp, whatsappEmitter };
