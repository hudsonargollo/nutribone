# NutriBone — Tienda en línea (100% digital)

Tienda en línea de **NutriBone**, caldo de huesos artesanal de **Santa Cruz de la
Sierra** (Bolivia), creado en **2023** por Laura Nicole Cuellar. Negocio
**100% digital**: sin local físico ni sucursales. Catálogo compartido con **un
solo stock por producto**, pedidos **solo con entrega a domicilio** (delivery
gratis dentro del 4to anillo) y un panel de administración global.

> **Precios:** el seed carga precios en `0` = *"Precio por confirmar"*. El cliente
> publica los precios reales desde **Admin → Productos**. Nunca se inventan
> precios en el código.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Prisma 6** + **PostgreSQL** (dinero en `Decimal`, moneda **Bs**)
- **Zod** para validación
- Pagos: **contra entrega (COD)** + **QR / transferencia (TRANSFER)** coordinada por WhatsApp

## Puesta en marcha

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar la base de datos**
   Copia `.env.example` a `.env` y ajusta las conexiones:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/nutribone?schema=public"
   DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/nutribone?schema=public"
   ```

3. **Aplicar el esquema y cargar datos**
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   npm run db:create-admin
   ```

4. **Servidor de desarrollo**
   ```bash
   npm run dev
   ```
   Abre http://localhost:3000

## Scripts

| Comando | Qué hace |
| ------- | -------- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run db:migrate` | Crea/aplica migraciones en desarrollo |
| `npm run db:push` | Empuja el esquema sin migración |
| `npm run db:seed` | Catálogo (5 categorías, 12 productos), ajustes y Club NutriBone |
| `npm run db:studio` | Prisma Studio |
| `npm run db:create-admin` | Crea/actualiza el administrador desde `ADMIN_EMAIL` / `ADMIN_PASSWORD` |

## Modelo de datos

`Category · Product · Order · OrderItem · Customer · User · Setting ·
ContactMessage · Subscriber · EmailVerification · Reward · Redemption ·
LoyaltyEntry` (ver `prisma/schema.prisma`). **No hay `Branch` ni `BranchStock`.**

- El **catálogo es compartido**: cada producto existe una sola vez, con un único
  campo `stock` y un flag `active`.
- Cada `Order` es **solo entrega** (`address` + `city` obligatorios) y registra
  `paymentMethod` (`COD` o `TRANSFER`). El número de pedido usa el prefijo
  `NB-` (`NB-XXXXXX-XXXXXXXX`).
- Los `User` (admin/staff) son **globales**; no están ligados a ninguna sucursal.
- El **Club NutriBone** (sellos + puntos) es opcional y viene **desactivado** por
  defecto; se activa en **Admin → Club**.

## Flujo del cliente

| Ruta | Página |
| ---- | ------ |
| `/` | Inicio |
| `/shop`, `/shop/[category]` | Tienda y categorías |
| `/product/[slug]` | Detalle de producto |
| `/search` | Búsqueda |
| `/cart` | Carrito |
| `/checkout` | Entrega a domicilio + método de pago |
| `/checkout/success` | Confirmación |
| `/club` | Club NutriBone — sellos, puntos y recompensas |
| `/about`, `/care`, `/faq`, `/shipping` | Marca, conservación, preguntas y delivery |
| `/contact`, `/custom` | Contacto y pedidos por mayor |
| `/account`, `/account/orders` | Cuenta y estado del pedido |

No hay selector de sucursal ni retiro en tienda: al pagar solo se pide la
dirección de entrega.

## Panel administrativo

| Ruta | Página |
| ---- | ------ |
| `/admin` | Panel — ventas, pedidos y stock bajo |
| `/admin/orders`, `/admin/orders/[id]` | Pedidos |
| `/admin/inventory` | Stock y disponibilidad |
| `/admin/products`, `/admin/products/new` | Productos del catálogo |
| `/admin/categories` | Categorías |
| `/admin/customers` | Clientes |
| `/admin/analytics`, `/insights`, `/performance` | Analíticas de ventas |
| `/admin/messages` | Mensajes de contacto |
| `/admin/loyalty` | Club NutriBone (sellos, puntos, recompensas) |
| `/admin/settings` | Ajustes, equipo y contraseña |
| `/admin/invoice/[id]` | Factura / recibo del pedido |

Los roles `ADMIN` y `STAFF` son globales (sin sucursales). Las sesiones son
cookies httpOnly firmadas con `AUTH_SECRET` (**obligatorio en producción**), con
una sola sesión activa por cuenta. Login y OTP tienen límite de intentos.

## Despliegue

**VPS (systemd + nginx):** el build genera un servidor standalone
(`output: "standalone"`). `scripts/deploy.sh` compila, sincroniza a
`/var/www/nutribone` y reinicia `nutribone.service`. Usa **una sola instancia**
de larga duración (las alertas de pedidos y el rate limit son en memoria).

**Docker:**
```bash
docker build -t nutribone .
docker run -p 3000:3000 --env-file .env -v nutribone-uploads:/app/uploads nutribone
```

En una base nueva:
```bash
npx prisma migrate deploy
npm run db:seed        # catálogo + ajustes (precios en 0)
npm run db:create-admin
```

> Las imágenes subidas desde el panel se guardan en `UPLOAD_DIR` (por defecto
> `./uploads`) y se sirven desde `/uploads/…`; usa un volumen persistente.

## Notas

- Despliegue en producción: [`docs/DEPLOY.md`](docs/DEPLOY.md).
- El seed (`prisma/seed.ts`) y los datos de respaldo sin base de datos
  (`src/lib/sample-data.ts`) reflejan el mismo catálogo: 5 categorías y 12
  productos con fotos en `public/images/`. Volver a correr el seed refresca los
  textos del catálogo pero **no** pisa precios, stock ni ajustes editados en el
  panel.