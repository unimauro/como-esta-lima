# Actualización de datos — agosto/setiembre 2026

- **Fecha de consulta:** 2026-09-30
- **Alcance:** búsqueda de publicaciones oficiales posteriores a la fecha de corte del proyecto (2026-09-12).
- **Regla aplicada:** actualización estrictamente aditiva. No se borró ni se alteró ningún dato previo, ninguna fuente ni ningún año de serie. Las verificaciones comparativas confirman 13 indicadores en `costo_vida.json`, 9 en `institucional.json`, 13 en `seguridad.json` y los 24 eventos originales de `timeline.json` intactos.
- **Técnica:** `curl` con User-Agent de navegador más `pdftotext` sobre los PDF originales, y Google News RSS para ubicar noticias. No se usó WebSearch.

---

## 1. Lo que sí se actualizó

### `costo_vida.json` — empleo e ingreso de Lima Metropolitana

Se encontró el **Informe de Empleo N° 9 del INEI (Informe Técnico N°9, setiembre 2026)**, correspondiente al **trimestre móvil junio-julio-agosto 2026**. Reemplaza al trimestre mayo-junio-julio 2026 que estaba registrado.

| Indicador | Valor anterior (may-jun-jul 2026) | Valor nuevo (jun-jul-ago 2026) | Mismo trimestre 2025 |
|---|---|---|---|
| `ingreso_promedio_mensual` | S/ 2 312,6 | **S/ 2 308,4** | S/ 2 249,6 (+2,6%) |
| `tasa_desempleo` | 4,7% | **4,8%** | 6,0% (-1,2 p.p.) |
| `empleo_adecuado_pct` | 62,2% | **62,1%** | 61,6% (+0,5 p.p.) |

Detalle adicional incorporado a las notas: 301 mil desocupados; tasa de ocupación 95,2%; subempleo 33,1% (6,1% por horas y 27,0% por ingresos); población con empleo adecuado de 3 millones 891 mil 100 personas; ingreso de hombres S/ 2 585,4 y de mujeres S/ 1 976,3 (las mujeres ganan el 76,4% del ingreso masculino); el ingreso cayó 1,4% entre los de 45 y más años.

Fuente: <https://cdn.www.gob.pe/uploads/document/file/10621578/8596299-informe-de-empleo-n-9-trimestre-jun-jul-ago-2026.pdf> (EPEN, muestra de 4 800 viviendas del trimestre en Lima y Callao; cuadros N° 10, N° 11 y N° 25).

### `institucional.json` — deuda y bonos de la MML

Se encontró el **Informe N° 03-2026-CF del Consejo Fiscal** (publicado el 23-jul-2026 con la Nota de Prensa N° 02-2026-CF), que evalúa las finanzas subnacionales de 2025 e incluye una sección dedicada a la Municipalidad Metropolitana de Lima. Es fuente primaria y cierra dos huecos de la serie.

| Indicador | Año | Antes | Ahora |
|---|---|---|---|
| `deuda_mml_saldo` | 2025 | `null` | **S/ 5 045 millones** |
| `bonos_mml_emitidos` | 2025 | S/ 1 300 millones | **S/ 1 545 millones** |
| `bonos_mml_emitidos` | 2026 | `null` | **0** |

- **Deuda 2025:** el Saldo de Deuda Total llegó a un máximo histórico de S/ 5 045 millones, equivalente al **347,6%** de los ingresos corrientes promedio, cerca de 3,5 veces el límite prudencial de 100%. Esto confirma la estimación previa del propio Consejo Fiscal de que el SDT se acercaría a S/ 5 000 millones.
- **Corrección de bonos 2025:** el valor anterior de S/ 1 300 millones solo recogía la tercera emisión (15-jun-2025). El informe documenta una **cuarta y última emisión de S/ 245 millones el 30-set-2025**, con lo que el total del año es S/ 1 545 millones y el programa completo suma exactamente S/ 4 000 millones: S/ 1 205 M (27-dic-2023), S/ 1 250 M (19-set-2024), S/ 1 300 M (15-jun-2025) y S/ 245 M (30-set-2025). El valor anterior queda registrado en la nota de la serie.
- **Bonos 2026 = 0:** el programa culminó en 2025, por lo que no hay nuevas emisiones. No es una estimación, es la constatación del informe.
- Contexto añadido a las notas: en 2025 la MML pagó S/ 276 millones de intereses y recibió S/ 124 millones por intereses de depósitos no ejecutados, con un **costo financiero neto de S/ 152 millones**; la DEM-STCF proyecta flujos netos negativos acumulados de **S/ 2 609 millones entre 2027 y 2035** aun incluyendo el 3% del IGV del Cercado y el mayor FONCOMUN; la MML sigue exceptuada de las reglas fiscales por sus calificaciones AA-(pe) de Apoyo y Asociados y PEAA de Pacific Credit Rating (Oficio N° D000141-2026-MML-OGPF del 1-abr-2026). También se incorporó a la nota del indicador la serie completa de ratios SDT 2017-2025 publicada por el CF: 124,6%; 125,0%; 140,9%; 162,8%; 160,3%; 120,7%; 212,6%; 275,5% y 347,6%.

Fuente: <https://cf.gob.pe/wp-content/uploads/2026/07/Informe-003-2026-CF.pdf>

### `timeline.json` — dos eventos nuevos (24 → 26)

1. **2025-09-30** — La MML coloca la cuarta y última emisión de bonos (S/ 245 millones) y cierra el programa de S/ 4 000 millones. Categoría `presupuesto`.
2. **2026-07-23** — El Consejo Fiscal advierte que la deuda de la MML llegó a S/ 5 045 millones. Categoría `presupuesto`.

Ambos con el Informe N° 03-2026-CF como fuente primaria.

---

## 2. Lo que se buscó y no cambió

### Seguridad ciudadana (INEI/ENAPRES) — sin boletín nuevo

Se verificó el listado de boletines de la biblioteca virtual del INEI (<https://www.inei.gob.pe/biblioteca-virtual/boletines/estadisticas-de-seguridad-ciudadana/1/>). El más reciente sigue siendo `boletin-seguridad-ciudadana-feb-jul-2026.pdf`, que ya estaba incorporado. **No existe boletín de un semestre que cierre en agosto o setiembre de 2026.** Se probaron además, sin éxito (HTTP 404), los patrones `mar-ago-2026`, `abr-set-2026`, y los trimestrales `it25`/`iit25`/`ivt25`/`it26`/`iit26`/`iiit26`.

Por tanto **no cambian** `enapres_victimizacion` (26,0%), `enapres_percepcion_inseguridad` (87,0%) ni `enapres_denuncia` (18,5%) para 2026. Se añadió a cada uno una nota de verificación y la fuente del listado consultado.

Se revisó también el Informe Técnico N° 01 de abril 2026 (`boletin-seguidad-registros-jul_dic_2025.pdf`, "Estadísticas de la Criminalidad, Seguridad Ciudadana y Violencia — una visión desde los registros administrativos, julio-diciembre 2025"). No contiene cuadros de homicidios ni de extorsión: se centra en robo de vehículos, violencia familiar, trata de personas y violencia sexual.

### Inflación IPC Lima — sin dato nuevo

Se reconsultó la serie **PN01272PM** del BCRP (variación acumulada del IPC de Lima Metropolitana). El último mes disponible sigue siendo **agosto 2026 con 4,16% acumulado**, que ya estaba registrado. El IPC de setiembre 2026 se publica el 1-oct-2026, por lo que **no existe aún un acumulado a setiembre**. Serie 2026 verificada mes a mes: ene 0,10; feb 0,79; mar 3,19; abr 3,72; may 3,56; jun 3,79; jul 4,09; ago 4,16. Solo se actualizó la fecha de consulta de las fuentes BCRP y la nota de la serie.

### Homicidios — sin cifra oficial nueva

No se halló cifra oficial nueva para 2026. El INEI-CEIC publica el consolidado anual ("Homicidios en el Perú, contándolos uno a uno") en enero del año siguiente; la tasa nacional de 2025 (10,7 por 100 mil) se presentó en enero de 2026 y ya está en la serie. Las cifras difundidas por el Mininter durante 2026 (una reducción de 23% anunciada en mayo y de unos 500 homicidios en agosto) **fueron cuestionadas públicamente por presuntas anomalías en el registro de la PNP** (La República, 19-20 de agosto de 2026; Revista Caretas, 26 de setiembre de 2026), por lo que **no se incorporan a la serie**. Se dejó constancia en la nota del indicador. `homicidios_numero` para Lima Metropolitana sigue sin dato desde 2021.

### Extorsión — se amplió el contexto, el valor sigue nulo

Se confirmó con el artículo ya citado en el dataset que las **13 800 denuncias de enero a julio de 2026 son una cifra nacional**, no de Lima, según el Observatorio de Criminalidad del Ministerio Público, con proyección de cierre superior a **32 600 casos** en el año (1 985 al mes, 66 al día, cerca de 3 por hora). Para Lima solo hay el desglose fiscal del primer semestre: Lima Norte + Lima Centro + Lima Sur = 3 829 denuncias y Lima Este más de 1 800 (el distrito fiscal con mayor concentración del país). La Libertad es la segunda región con 1 625.

Estas denuncias fiscales **no son comparables** con las denuncias policiales (SIDPOL) usadas para el valor de 2025 (12 701), por lo que `extorsion_denuncias` 2026 **se mantiene en `null`** y solo se amplió la nota. Registrar el dato habría mezclado dos registros distintos.

### `proyectos.json` — sin cambios de estado

No se halló evidencia documental de que alguna de las 25 obras haya cambiado de estado entre agosto y setiembre de 2026. El Informe N° 03-2026-CF aporta datos agregados de la cartera de Obras por Impuestos (S/ 1 377 millones en elaboración de expediente técnico, S/ 1 206 millones con convenio suscrito y S/ 1 141 millones en condición de adjudicado) pero **no desagrega por proyecto**, por lo que no permite reasignar el estado de ninguna obra concreta. El archivo queda intacto: 17 `en_ejecucion`, 4 `terminado`, 3 `anunciado`, 1 `planificacion`.

---

## 3. Limitación metodológica de esta ronda

Las noticias de setiembre de 2026 sobre la MML localizadas vía Google News RSS son en su mayoría **declaraciones de campaña** en el marco de las elecciones municipales del 4 de octubre de 2026 (cifras de deuda atribuidas a candidatos, de S/ 4 000 a más de S/ 5 000 millones). No se incorporaron al dataset: los enlaces de Google News no resuelven al artículo original mediante `curl` porque devuelven una página intermedia que requiere JavaScript, y en cualquier caso una declaración electoral no es fuente verificable de una cifra fiscal. En su lugar se usó el Informe N° 03-2026-CF del Consejo Fiscal, que es el documento primario del que derivan esas cifras.

## 4. Archivos modificados

- `data/research/costo_vida.json` — 3 valores de serie 2026 y 1 nota; 1 fuente nueva en 3 indicadores.
- `data/research/institucional.json` — 3 valores de serie; 1 fuente nueva en 2 indicadores.
- `data/research/seguridad.json` — ningún valor cambiado; 4 notas ampliadas y 1 fuente de verificación en 3 indicadores.
- `data/research/timeline.json` — 2 eventos nuevos (24 → 26).

Los cuatro archivos fueron validados con `json.load`. Sin cambios en `proyectos.json`, `promesas.json`, `demografia.json`, `movilidad.json` ni `servicios_ambiente.json`.
