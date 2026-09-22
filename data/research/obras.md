# Obras y proyectos — "¿Cómo está Lima?" 2019–2026

Fecha de corte: 2026-09-12. Fecha de consulta de las ampliaciones: 2026-09-22.

## Resumen
`proyectos.json` pasó de 7 a **25 proyectos**. Por estado:

| estado | n.º |
|---|---|
| en_ejecucion | 17 |
| terminado | 4 |
| anunciado | 3 |
| planificacion | 1 |

`timeline.json` pasó de 20 a **24 eventos** (se agregaron 4 con fuente fechada).

## Regla dura aplicada
No se inventaron montos, fechas ni CUI. Cuando un dato no se pudo verificar por fuente
primaria se dejó `null` y se explicó en `observaciones`. La existencia, tipo, distritos
y estado aproximado de cada obra se registran como conocimiento público con fuente
`por verificar`, siguiendo la convención de las 7 entradas previas.

## Neutralidad
Se separan `concebido_por`, `iniciado_por`, `ejecutado_por`, `terminado_por` e
`inaugurado_por`. El vocabulario de las notas usa "inició / concluyó / paralizó /
anunció" y evita adjudicar mérito a una sola gestión.

## Proyectos con dato verificado por fuente en esta ronda
- **Tren de cercanías Lima–Chosica**: principal proyecto cuestionado de la gestión
  López Aliaga; donación de vagones por la embajada de EE. UU. y compra de locomotoras
  Caltrain por 24 millones de dólares (cifra periodística en USD, no total). Fuente:
  Wikipedia: Rafael López-Aliaga.
- **Rutas de Lima / peajes**: conflicto abierto en 2023 por el peaje de Puente Piedra;
  un tribunal arbitral falló a favor de la concesionaria. Fuente: Wikipedia (cita
  El Comercio 05-12-2023 y 22-02-2024).
- **Corredores complementarios (SIT)**: administración ATU, operación por concesionarios;
  Corredor Morado cesó operaciones a inicios de marzo de 2024 (paro de 48 h); en 2026 la
  ATU implementó el Corredor Rosado (primero que une el Callao). Fuente: Wikipedia:
  Corredores complementarios.
- **Costa Verde Callao**: primer tramo (viaductos Haya de la Torre y Santa Rosa)
  inaugurado el 04-11-2022. Fuente: Wikipedia: Circuito de playas de la Costa Verde.

## Pendientes de verificación primaria
Montos y CUI de casi todos los proyectos (buscar en ssi.mef.gob.pe / invierte.pe);
fechas de inicio/término de Puente Santa Rosa, Puente Morales Duárez, teleférico
Independencia–SJL, monorriel y Vía Expresa Javier Prado; desagregar los paquetes
agregados (viaductos 2023–2026, ciclovías, losas deportivas, pistas y veredas) en obras
individuales; fecha exacta del laudo arbitral de Rutas de Lima; inventario de sedes
SISOL y parques SERPAR por gestión; fecha de emisión de bonos de la MML.

## Nota sobre fuentes
No se usó WebSearch (agotado). La verificación se hizo con `curl` (User-Agent de
navegador) contra Wikipedia en español. Varias páginas específicas (Rutas de Lima,
tren Lima–Chosica, teleférico) no existen como artículo propio; sus datos provienen del
artículo de Rafael López-Aliaga o quedan `por verificar`.
