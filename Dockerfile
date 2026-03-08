FROM node:18

WORKDIR /app

# Copie les fichiers de configuration
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le code
COPY . .

# Commande de démarrage
CMD ["node", "bot.js"]
