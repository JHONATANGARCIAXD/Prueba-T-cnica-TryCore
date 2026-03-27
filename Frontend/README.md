# Guía de Instalación - Frontend (Vue 3 + Quasar + Vite)

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

| Componente | Versión Mínima | Versión Recomendada |
|-----------|-----------------|-------------------|
| Node.js   | 18.x            | 20.19.0 o 22.12.0+ |
| npm       | 9.x             | 10.x o superior    |

### Cómo verificar las versiones:

```bash
node --version
npm --version
```

---

## 🚀 Pasos para Levantar el Frontend

### 1. Navegar al directorio del Frontend

```bash
cd Frontend
```

### 2. Instalar dependencias

```bash
npm install
```

Este comando instalará:
- **Vue 3**: Framework JavaScript reactivo
- **Quasar**: Framework de componentes
- **Vite**: Bundler y dev server
- **Vue Router**: Enrutamiento
- **Axios**: Cliente HTTP

### 3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

**Salida esperada:**
```
VITE v7.1.2  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Press h + enter to show help
```

El frontend estará disponible en: **`http://localhost:5173`**

### 4. Compilar para producción

```bash
npm run build
```

Los archivos compilados se guardarán en la carpeta `dist/`

### 5. Previsualizar la compilación

```bash
npm run preview
```

---

## 📋 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo (Vite) |
| `npm run build` | Compila para producción |
| `npm run preview` | Previsualiza la compilación en local |

---

## 📁 Estructura del Proyecto

```
Frontend/
├── src/
│   ├── App.vue                    # Componente principal
│   ├── main.js                    # Punto de entrada
│   ├── style.css                  # Estilos globales
│   ├── quasar-variables.sass      # Variables Quasar
│   ├── assets/                    # Imágenes, fuentes, etc.
│   ├── components/                # Componentes reutilizables
│   │   ├── button.vue
│   │   ├── buttonsTable.vue
│   │   ├── Modal.vue
│   │   ├── Qchip.vue
│   │   └── Table.vue
│   ├── composables/               # Lógica reutilizable (Composition API)
│   │   ├── useFormats.js
│   │   └── useNotifications.js
│   ├── layouts/                   # Layouts de página
│   │   └── layout.vue
│   ├── plugins/                   # Plugins y configuraciones
│   │   └── pluginAxios.js         # Configuración de Axios
│   ├── routes/                    # Enrutamiento
│   │   └── Routes.js
│   ├── services/                  # Servicios (API calls)
│   │   └── apiclient.js
│   └── views/                     # Páginas principales
│       ├── login.vue
│       ├── movements.vue
│       └── products.vue
├── public/                        # Archivos estáticos
├── package.json
├── vite.config.js                # Configuración de Vite
└── index.html                    # HTML principal
```

---

## 🔌 Conexión con el Backend

El frontend se conecta al backend a través de **Axios** (cliente HTTP).

### Configuración de Axios

El archivo [src/plugins/pluginAxios.js](src/plugins/pluginAxios.js) contiene la configuración de conexión.

**URL base del API (por defecto):**
```javascript
http://localhost:3000/api
```

### Cambiar la URL del API

Si el backend corre en un puerto diferente, actualiza:

```javascript
// En src/plugins/pluginAxios.js
const baseURL = 'http://localhost:3000/api' // Cambiar puerto si es necesario
```

---

## ❌ Problemas Comunes y Soluciones

### 1. Error: "Port 5173 is already in use"

**Soluciones:**
- Cierra otras aplicaciones que usan ese puerto
- O ejecuta en un puerto diferente:
  ```bash
  npm run dev -- --port 5174
  ```


### 2. Webpack o Vite no compila

**Soluciones:**
- Verifica que `node_modules/` existe:
  ```bash
  ls node_modules  # macOS/Linux
  dir node_modules # Windows
  ```
- Reinstala dependencias:
  ```bash
  npm install
  ```

### 3. Errores de conexión con el Backend

**Síntomas:**
- Errores de CORS
- "Cannot reach http://localhost:3000"

**Soluciones:**
- [ ] Verifica que el backend está corriendo en puerto 3000
- [ ] Comprueba que el formulario envía a la URL correcta
- [ ] Revisa los headers CORS en el backend
- [ ] En DevTools → Network, chequea los requests y errores



## 🌍 URLs Principales

Una vez que todo está funcionando:

| Ruta | URL | Descripción |
|------|-----|-------------|
| Login | `http://localhost:5173/` | Página de login |
| Productos | `http://localhost:5173/products` | Gestión de productos |
| Movimientos | `http://localhost:5173/movements` | Gestión de movimientos |

---

## 🛠️ Tips de Desarrollo

### Hot Module Replacement (HMR)

Vite tiene reemplazo de módulos en caliente. Los cambios en tu código se reflejarán automáticamente en el navegador sin recargar la página.



## ✅ Verificación Final

Cuando todo esté configurado correctamente:

1. ✅ Terminal muestra "Local: http://localhost:5173/"
2. ✅ Navegas a `http://localhost:5173` sin errores
3. ✅ Puedes ver la interfaz de la aplicación
4. ✅ Las rutas funcionan (login, productos, movimientos)
5. ✅ Los cambios en código se reflejan en tiempo real

---

## 🆘 Soporte Adicional

- [Documentación de Vue 3](https://vuejs.org/)
- [Documentación de Quasar](https://quasar.dev/)
- [Documentación de Vite](https://vitejs.dev/)
- [Documentación de Axios](https://axios-http.com/)
