# Usa una imagen base de Node.js
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia package.json y package-lock.json
COPY package.json package-lock* ./

# Instala las dependencias
RUN npm install 

# Copia el resto del código de la aplicación
COPY . .

# La variable NEXT_PUBLIC_API_URL debe estar disponible en BUILD TIME
# porque Next.js la compila dentro del bundle JavaScript
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Construye la aplicación Next.js
RUN npm run build 

# Expone el puerto que usará Next.js
EXPOSE 3000

# Comando para correr la aplicación
CMD ["npm", "start"]