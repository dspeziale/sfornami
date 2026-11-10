import { CartItem, CustomCakeRequest, Order, StoreSettings } from './types';

/**
 * Clean phone number to standard international format (digits only)
 */
export function formatPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('39') || digits.length >= 11) return digits;
  // If Italian number without prefix (e.g. 3401234567), prepend 39
  if (digits.startsWith('3')) return `39${digits}`;
  return digits;
}

/**
 * Generate direct WhatsApp order link from current Cart & Checkout details
 */
export function generateWhatsAppOrderMessage({
  items,
  customerName,
  customerPhone,
  deliveryType,
  deliveryAddress,
  deliveryCity,
  deliveryCap,
  requestedDate,
  requestedTimeSlot,
  notes,
  subtotal,
  deliveryFee,
  total,
  orderNumber,
  settings,
}: {
  items: CartItem[] | { name: string; quantity: number; price: number; variant?: string }[];
  customerName: string;
  customerPhone?: string;
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryCap?: string;
  requestedDate: string;
  requestedTimeSlot: string;
  notes?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderNumber?: string;
  settings: StoreSettings;
}): string {
  const lines: string[] = [];

  lines.push('🥖 *NUOVO ORDINE SFORNAMÌ* 🥐');
  lines.push('--------------------------------');
  if (orderNumber) {
    lines.push(`📋 *Codice Ordine:* ${orderNumber}`);
  }
  lines.push(`👤 *Cliente:* ${customerName}`);
  if (customerPhone) {
    lines.push(`📞 *Telefono:* ${customerPhone}`);
  }
  lines.push('');
  lines.push('📦 *PRODOTTI ORDINATI:*');

  items.forEach((item, index) => {
    const isCartItem = 'product' in item;
    const name = isCartItem ? item.product.name : item.name;
    const qty = item.quantity;
    const variant = isCartItem ? item.selectedVariant?.name : item.variant;
    const singlePrice = isCartItem
      ? item.product.price + (item.selectedVariant?.priceModifier || 0)
      : item.price;
    const itemTotal = singlePrice * qty;

    let itemLine = `${index + 1}. *${qty}x* ${name}`;
    if (variant) itemLine += ` _(${variant})_`;
    itemLine += ` - €${itemTotal.toFixed(2)}`;
    lines.push(itemLine);
  });

  lines.push('--------------------------------');
  lines.push(`Subtotale: €${subtotal.toFixed(2)}`);
  if (deliveryType === 'delivery') {
    lines.push(`Costo Consegna: €${deliveryFee.toFixed(2)}`);
  }
  lines.push(`*TOTALE: €${total.toFixed(2)}*`);
  lines.push('--------------------------------');

  lines.push('');
  if (deliveryType === 'pickup') {
    lines.push('🏪 *MODALITÀ: RITIRO IN LABORATORIO*');
    lines.push(`📍 *Luogo:* ${settings.address}, ${settings.city}`);
  } else {
    lines.push('🛵 *MODALITÀ: CONSEGNA A DOMICILIO*');
    lines.push(`📍 *Indirizzo:* ${deliveryAddress || ''}, ${deliveryCap || ''} ${deliveryCity || 'Roma'}`);
  }

  lines.push(`📅 *Data richiesta:* ${requestedDate}`);
  lines.push(`⏰ *Fascia oraria:* ${requestedTimeSlot}`);

  if (notes && notes.trim().length > 0) {
    lines.push(`📝 *Note cliente:* ${notes.trim()}`);
  }

  lines.push('');
  lines.push('Grazie mille dal laboratorio artigianale SFORNAMÌ! ✨');

  const text = lines.join('\n');
  const targetPhone = formatPhoneForWhatsApp(settings.whatsappNumber);
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Generate direct WhatsApp message for Custom Cake inquiry
 */
export function generateWhatsAppCustomCakeMessage({
  cakeRequest,
  settings,
}: {
  cakeRequest: CustomCakeRequest;
  settings: StoreSettings;
}): string {
  const lines: string[] = [];

  lines.push('🎂 *RICHIESTA TORTA PERSONALIZZATA - SFORNAMÌ*');
  lines.push('--------------------------------');
  lines.push(`👤 *Nome:* ${cakeRequest.customerName}`);
  lines.push(`📞 *Telefono:* ${cakeRequest.customerPhone}`);
  lines.push(`📧 *Email:* ${cakeRequest.customerEmail}`);
  lines.push('');
  lines.push(`🍰 *Tipologia Torta:* ${cakeRequest.cakeType}`);
  lines.push(`👥 *Numero Porzioni / Persone:* ${cakeRequest.servings}`);
  lines.push(`🌾 *Base e Pan di Spagna:* ${cakeRequest.flavorBase}`);
  lines.push(`🍓 *Farcitura:* ${cakeRequest.filling}`);
  lines.push(`🎨 *Decorazione desiderata:* ${cakeRequest.decoration}`);
  if (cakeRequest.customText) {
    lines.push(`✍️ *Scritta sulla torta:* "${cakeRequest.customText}"`);
  }
  lines.push(`📅 *Data richiesta:* ${cakeRequest.requestedDate}`);
  lines.push(`⏰ *Orario:* ${cakeRequest.requestedTime}`);

  if (cakeRequest.notes) {
    lines.push(`📝 *Note / Allergeni:* ${cakeRequest.notes}`);
  }

  lines.push('--------------------------------');
  lines.push('Vorrei richiedere un preventivo o conferma disponibilità. Grazie!');

  const text = lines.join('\n');
  const targetPhone = formatPhoneForWhatsApp(settings.whatsappNumber);
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Ready-to-use template for future WhatsApp Business Cloud API dispatch
 */
export interface WhatsAppCloudApiPayload {
  messaging_product: 'whatsapp';
  to: string;
  type: 'template' | 'text';
  text?: { body: string };
  template?: {
    name: string;
    language: { code: string };
    components: unknown[];
  };
}
