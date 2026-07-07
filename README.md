# Eterspire Familiars Checklist

✨ Checklist de familiares para Eterspire, un MMORPG para celulares. Inspirado en el checklist de Tsuki Odyssey.

Incluye las colecciones de Adventure Familiars (gratuitas) de la wiki:

- **Magical Familiars** (20): la serie base, obtenida al derrotar monstruos según rango de nivel. Completarla y hablar con Jackie da el epíteto "Familiar Hunter".
- **Boss Monster Series** (15): familiares raros que dropean los Remnants (jefes) del mundo. Completarla y hablar con Azazel da el epíteto "Conqueror of the Ancients".
- **Treasure Familiars** (15): familiares de Remnants y Trials que no cuentan para el epíteto de Boss Monster Series.
- **Merchant Familiars** (3): familiares comprados a Merchants con puntos u otras monedas especiales.
- **Quest Familiars** (2): familiares obtenidos al completar quests específicas. Página aún "under construction" en la wiki.

Datos extraídos de la [wiki oficial de Eterspire](https://eterspire.wiki/).

### 1. Cloná o descomprimí el proyecto

### 2. Abrí un servidor local con Python:

  ```bash
  python -m http.server
  ```

  Ahora podés abrir 127.0.0.1:8000 o localhost:8000 para ver la página en vivo.

  También podés elegir en qué puerto ejecutarlo con:

  ```bash
  python -m http.server XXXX
  ```

  Acá utilizás el puerto a elección con 127.0.0.1:XXXX o localhost:XXXX en vez del puerto 8000.

### Notas sobre las imágenes

Las imágenes primero se buscan localmente en `assets/img/`, usando el nombre de archivo original de la wiki (por ejemplo `Vexren_-_Source_of_the_Plague_(Familiar).png`). Si no encontrás ese archivo ahí, la página cae automáticamente al hotlink de la wiki oficial (eterspire.wiki), y si tampoco carga (por la protección anti-bots del sitio), se muestra un ícono de reemplazo genérico.

Para tener una imagen 100% local: descargala desde la wiki y guardala en `assets/img/` con el mismo nombre de archivo que tiene en la URL (sin el prefijo "NNpx-" de la miniatura, y sin la codificación %XX).

### Progreso

El estado de los checkboxes se guarda en el navegador (localStorage), así que persiste al recargar la página. Los botones "Download JSON" y "Download Excel" exportan la pestaña activa con tu progreso marcado.
