const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");

async function startBot() {
    console.log("🚀 Démarrage du bot WhatsApp...");
    
    // Crée un dossier session pour stocker l'authentification
    const { state, saveCreds } = await useMultiFileAuthState("session");

    const sock = makeWASocket({ auth: state });

    // Sauvegarde les credentials à chaque mise à jour
    sock.ev.on("creds.update", saveCreds);

    // Écoute la connexion
    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === "open") {
            console.log("✅ Bot connecté à WhatsApp avec succès !");
        }
        
        if (connection === "close") {
            console.log("⚠️ Connexion fermée");
        }
    });

    // Écoute et répond aux messages
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        
        // Ignore les messages vides ou sans contenu
        if (!msg.message) return;
        
        // Ignore les messages qu'on a envoyé soi-même
        if (msg.key.fromMe) return;

        const sender = msg.key.remoteJid;
        const messageText = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

        console.log(`📨 Message reçu de ${sender}: ${messageText}`);

        try {
            // Répond "C'est ok" à tous les messages
            await sock.sendMessage(sender, { text: "C'est ok" });
            console.log(`✉️ Réponse envoyée à ${sender}`);
        } catch (error) {
            console.error(`❌ Erreur lors de l'envoi du message: ${error.message}`);
        }
    });

    console.log("👀 Bot en écoute... Attends le QR code pour scanner avec ton téléphone !");
}

startBot().catch(error => {
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
});
