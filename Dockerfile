# ******************************************
# @auth: Med.MANSOUR
# ******************************************

# Utiliser une image de base Node.js
FROM node:16.13.0

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de package
COPY package*.json ./

# Installer les dépendances
RUN npm install --force

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application pour la production
RUN npm run build

# Exposer le port de l'application (modifiez le port selon vos besoins)
EXPOSE 4200

# Commande pour démarrer l'application
CMD ["npm", "start"]