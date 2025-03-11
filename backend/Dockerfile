# Usar Node.js 18
FROM node:18

# Directorio de trabajo
WORKDIR /app

# Copiar solo los archivos de dependencias para evitar reinstalar cuando no haya cambios en ellos
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm install

# Copiar el código fuente
COPY . .

# Exponer puerto y ejecutar en modo desarrollo
EXPOSE 5000
CMD ["npm", "run", "dev"]
