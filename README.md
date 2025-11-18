# Proyecto CRUD de Rutas de Buses

Aplicación completa **Full Stack** para gestionar rutas de buses, incluyendo salida, conductor, ruta, monto de dinero y otros datos relevantes. El proyecto está compuesto por:

* **Backend:** Node.js + Express + MongoDB Atlas + Mongoose
* **Frontend:** React + Vite
* **Despliegue:** Configurado para funcionar en entorno local o nube

---

## 🚀 Características principales

* CRUD completo de rutas de buses
* API REST desarrollada en Express
* Conexión a base de datos MongoDB Atlas
* Frontend moderno con React + Vite
* CORS configurado para despliegue seguro
* Health Check para ver estado del servidor y DB
* Manejo global de errores

---

## 📂 Estructura del proyecto

```
bus-control/
├── .gitignore
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   └── services/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── services/
│   ├── public/
│   └── package.json
└── README.md
```

---

## ⚙️ Instalación del backend

### 1️⃣ Clonar el repositorio

```
git clone https://github.com/Neydercm/tu-repo.git
cd backend
```

### 2️⃣ Instalar dependencias

```
npm install
```

### 3️⃣ Configurar variables de entorno

Crear archivo **.env** dentro de `/backend` con:

```
MONGODB_URI=tu_url_mongodb
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
PORT=5000
```

### 4️⃣ Ejecutar servidor

```
npm start
```

---

## 🖥 Instalación del frontend

### 1️⃣ Ir al directorio

```
cd frontend
```

### 2️⃣ Instalar dependencias

```
npm install
```

### 3️⃣ Ejecutar proyecto

```
npm run dev
```

El frontend iniciará en:

```
http://localhost:3000
```

---

## 🔗 Conexión backend → frontend

Asegúrate de que en `api.js` esté configurado el endpoint:

```
const API_URL = 'http://localhost:5000/api/rutas';
```

O el dominio donde despliegues la API.

---

## 🧪 Endpoint Health Check

Puedes verificar si la API está activa:

```
GET /health
```

Respuesta:

```json
{
  "status": "OK",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "db": "connected"
}
```

---

## 📦 Scripts útiles

### Backend

```
npm start     # Inicia el servidor
npm run dev   # Usa nodemon (si lo tienes instalado)
```

### Frontend

```
npm run dev
npm run build
```

---

## ☁️ Despliegue en la nube

Puedes desplegar utilizando:

* **Render** (recomendado para backend)
* **Vercel / Netlify** (recomendado para frontend)
* **Railway**

Actualiza CORS en `server.js` según tu dominio:

```js
origin: process.env.FRONTEND_URL
```

---

## ✨ Autor

**Neyder Correa Magaña**

GitHub: [https://github.com/Neydercm](https://github.com/Neydercm)

---

## 📜 Licencia

Este proyecto es de uso libre para fines educativos o personales.
