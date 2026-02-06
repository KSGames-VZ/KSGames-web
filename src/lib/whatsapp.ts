export const generateWhatsAppLink = (
    cartItems: any[],
    user: { name: string; phone: string },
    images: string[]
) => {
    const phoneNumber = "584242580291"; // Official KSGames Number

    let message = `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🎮 *KSGAMES - SOLICITUD DE VENTA*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    message += `� *Origen:* Caracas/Nacional\n`;
    message += `👤 *Cliente:* ${user.name}\n`;
    message += `📞 *WhatsApp:* ${user.phone}\n\n`;

    message += `�️ *LISTA DE JUEGOS:*\n`;
    message += `------------------------------------\n`;
    cartItems.forEach((item, index) => {
        message += `${index + 1}. *${item.name}* (${item.platform})\n`;
        message += `   ✨ *Estado:* ${item.condition}\n`;
        message += `   💰 *Oferta Web:* $${item.price}\n`;
        message += `------------------------------------\n`;
    });

    const total = cartItems.reduce((acc, item) => acc + item.price, 0);
    message += `\n💵 *TOTAL ESTIMADO:*  *$${total}*\n\n`;

    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📸 *ACCIÓN REQUERIDA:*\n`;
    message += `(Por favor, adjunta fotos de los juegos a continuación para cerrar la venta)\n`;
    message += `━━━━━━━━━━━━━━━━━━━━`;

    return `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
};
