# Ferretería - Backend con DB en VPS (sin Docker)

Este repo fue reestructurado para que el backend se conecte a una base de datos MySQL en tu VPS, con soporte para:

- Conexión directa a MySQL (expuesta por red)
- Túnel SSH hacia MySQL (más seguro cuando MySQL no está expuesto)

El código duplicado de conexión se unificó en `backend/config/database.js`. Los archivos antiguos `backend/config/db-ssh.js` y `backend/config/database-ssh.js` quedaron obsoletos y pueden eliminarse.

## Estructura

- `backend/` ÚNICO backend: API Express + MySQL (VPS)
- `html-web-project/` Front estático (sin cambios)
- `archive/html-web-project_mongo_backend/` Código antiguo tipo backend (Mongo/Mongoose) archivado para evitar confusión

## Configuración

Copia el ejemplo de variables y edítalo:

```powershell
Copy-Item backend/.env.example backend/.env
```

Abre `backend/.env` y completa:

- Modo directo (sin SSH):

  - `SSH_ENABLED=false`
  - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

- Modo con túnel SSH:
  - `SSH_ENABLED=true`
  - `SSH_AUTH_METHOD=key` (o `password`)
  - `SSH_HOST`, `SSH_PORT`, `SSH_USER`
  - Si `key`: `SSH_KEY_PATH` (por ejemplo `ssh/id_rsa`)
  - Si `password`: `SSH_PASSWORD`
  - `DB_*` deben apuntar al MySQL del VPS (normalmente `DB_HOST=localhost` si el túnel entra al mismo host)

## Ejecutar

- Local sin Docker:

  ```powershell
  cd backend
  npm install
  npm start
  ```

Backend en http://localhost:3001

## Notas de limpieza

- `backend/config/db-ssh.js`, `backend/config/database-ssh.js` y `backend/test-ssh-connection.js` ya no se usan (puedes borrarlos).
- El `package.json` del raíz no es necesario para el backend. Se puede eliminar para evitar confusiones (el backend tiene el suyo propio). `html-web-project` mantiene su `package.json` aparte.

## Troubleshooting

- Permisos de clave SSH: asegúrate de que la clave privada exista y sea legible por el proceso. En Windows, guarda la clave en `backend/ssh/` y pon su ruta en `SSH_KEY_PATH`.
- Puertos/Firewall: si usas conexión directa, abre el puerto 3306 en el VPS con seguridad (IP permitidas). Con SSH, solo necesitas el puerto 22 accesible.
- Errores típicos:
  - `ECONNREFUSED` -> host/puerto incorrectos o firewall
  - `Access denied` -> credenciales MySQL incorrectas
  - `All configured authentication methods failed` -> usuario/clave SSH o permisos de clave
