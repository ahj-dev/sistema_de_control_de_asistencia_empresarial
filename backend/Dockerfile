# Usamos Node.js versión 20 liviana como base
FROM node:20-alpine

# Creamos y usamos esta carpeta dentro del contenedor
WORKDIR /app

# Copiamos primero solo los archivos de dependencias
# (esto hace que Docker cachee las librerías y sea más rápido)
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto donde corre NestJS
EXPOSE 3001

# Comando que se ejecuta cuando arranca el contenedor
CMD ["npm", "run", "start:dev"]