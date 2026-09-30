# Deuda de la Municipalidad Metropolitana de Lima — notas de investigación

Fecha de corte del proyecto: 2026-09-12. Esta ronda: 2026-09-30.
Encargo: verificar y actualizar `deuda_mml_saldo`, que solo llegaba a 2024 (S/ 3 454 millones), frente a las cifras muy superiores que la prensa de 2026 atribuye al Consejo Fiscal.

## Resultado en una línea

La cifra de prensa se confirmó contra la fuente primaria: el **Saldo de Deuda Total (SDT) de la MML cerró 2025 en S/ 5 045 millones**, según el **Informe N° 03-2026-CF del Consejo Fiscal**, publicado el 23-jul-2026. No es una estimación periodística ni una proyección: es el saldo al cierre del ejercicio 2025 reportado por el MEF.

## Fuente primaria localizada

El reporte que contiene la cifra **no es un "Reporte Técnico"** (la serie de reportes técnicos de cf.gob.pe no incluye un análisis subnacional de 2026), sino un **Informe** del colegiado:

| Documento | Fecha | URL |
|---|---|---|
| Informe N° 03-2026-CF — Opinión del Consejo Fiscal sobre la situación de las finanzas públicas subnacionales en 2025 | 23-jul-2026 | https://cf.gob.pe/wp-content/uploads/2026/07/Informe-003-2026-CF.pdf |
| Nota de Prensa N° 02-2026-CF | 23-jul-2026 | https://cf.gob.pe/wp-content/uploads/2026/07/nortadeprensa02.pdf |
| Página del informe en cf.gob.pe | — | https://cf.gob.pe/documentos/informes/informe-n-03-2026-cf-opinion-del-consejo-fiscal-sobre-la-situacion-de-las-finanzas-publicas-subnacionales-en-2025/ |

Es el equivalente 2026 del Reporte Técnico N° 03-2025-CF/ST que ya citaba el proyecto para el cierre 2024. La sección relevante se titula "Sobre la Municipalidad Metropolitana de Lima" y el detalle numérico está en las notas al pie 23, 26, 28, 29 y 30.

## Qué comprende la cifra de S/ 5 045 millones

El SDT se define en el Decreto Legislativo 1275 (Marco de la Responsabilidad y Transparencia Fiscal de los Gobiernos Regionales y Locales) y comprende deuda financiera y por endeudamiento, sentencias judiciales ya registradas, deuda exigible y real, y cuentas por pagar. Al cierre de 2025 equivale al **347,6% de los ingresos corrientes promedio** de los últimos cuatro años, es decir cerca de 3,5 veces el límite prudencial de 100%.

Serie completa de ratios que publica el Consejo Fiscal (nota al pie 23), coherente con la que ya tenía el proyecto:

| Año | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 |
|---|---|---|---|---|---|---|---|---|---|
| Ratio SDT | 124,6% | 125,0% | 140,9% | 162,8% | 160,3% | 120,7% | 212,6% | 275,5% | **347,6%** |

El salto de 2023 a 2025 se explica por el **Programa de Emisión de Bonos de Titulización por S/ 4 000 millones**, ejecutado en cuatro emisiones (nota al pie 26):

| Emisión | Fecha | Monto |
|---|---|---|
| 1ra | 27-dic-2023 | S/ 1 205 millones |
| 2da | 19-set-2024 | S/ 1 250 millones |
| 3ra | 15-jun-2025 | S/ 1 300 millones |
| 4ta | 30-set-2025 | S/ 245 millones |

**Corrección derivada:** el proyecto registraba tres emisiones por S/ 3 755 millones. La cuarta emisión (S/ 245 millones, 30-set-2025) estaba ausente y el programa está completo. El indicador `bonos_mml_emitidos` ya recogía esta corrección al momento de esta ronda.

## Indicador nuevo: pasivos por sentencias y laudos

La cifra de **S/ 5 900 millones** que circuló en prensa a inicios de agosto de 2026 también se verificó, y resulta ser la **suma de dos componentes que el Consejo Fiscal reporta por separado** (nota al pie 29), con información remitida por el MEF al cierre de 2025:

- **Pasivos firmes** por sentencias judiciales y laudos arbitrales: **S/ 993 millones**, de los cuales S/ 312 millones aún no se habían incorporado al SDT.
- **Pasivos contingentes** por demandas judiciales y procesos de arbitraje en curso: **S/ 4 907 millones**.
- Total: **S/ 5 900 millones**. Destacan los procesos con Rutas de Lima S.A.C. por S/ 1 431 millones, de los cuales S/ 261 millones corresponden a procesos en calidad de cosa juzgada.

Por eso se creó `pasivos_contingentes_mml` con `contexto: true`. Dos advertencias quedan escritas en la nota del indicador:

1. **No es deuda cierta.** Los pasivos contingentes se desembolsan solo si los procesos se resuelven en contra de la municipalidad.
2. **No son sumables con el SDT.** De los S/ 993 millones firmes, S/ 681 millones ya estaban dentro del SDT de 2025 y solo S/ 312 millones quedaban fuera. Sumar S/ 5 045 y S/ 5 900 millones duplicaría ese componente.

El Consejo Fiscal consideró necesario que la MML, con participación del MEF, transparente la evolución y el tratamiento contable de estos pasivos.

## Otros datos del informe incorporados a las notas

- La MML **sigue exceptuada** de las reglas fiscales subnacionales, de sus medidas correctivas y de las restricciones de endeudamiento del DL 1437, por contar con dos calificaciones crediticias iguales o superiores a "A": AA-(pe) de Apoyo y Asociados y PEAA de Pacific Credit Rating, comunicadas al MEF por Oficio N° D000141-2026-MML-OGPF del 01-abr-2026. El Consejo Fiscal reiteró que no considera adecuado exceptuar del cumplimiento de reglas fiscales en función de calificaciones crediticias.
- Una proporción significativa de los ingresos futuros está comprometida en un **fideicomiso** de pago de deuda: alcabala, impuesto al patrimonio vehicular, FONCOMUN, impuesto predial e impuesto a los juegos de casino y máquinas tragamonedas.
- Cuando el servicio de deuda incluya la amortización del principal, **entre 2028 y 2035 superaría los S/ 500 millones anuales**, por encima del gasto promedio en inversión de la MML (S/ 495 millones entre 2003 y 2025).
- **Costo financiero neto 2025**: la MML pagó S/ 276 millones en intereses de la deuda y recibió S/ 124 millones por intereses de los depósitos no ejecutados, con un neto de S/ 152 millones.
- **Ejecución del programa**: al 13-jul-2026 los 58 proyectos asociados a los bonos registraban 24,6% de avance financiero y 33 de ellos 0% de avance físico.
- Estimación de la Secretaría Técnica del Consejo Fiscal: aun contando la transferencia del 3% del IGV del Centro de Lima (Ley 31980) y el incremento gradual del FONCOMUN (Ley 32387), la MML registraría **flujos netos negativos acumulados de S/ 2 609 millones entre 2027 y 2035**.

## Eventos agregados al timeline

| Fecha | Evento | Fuente verificada |
|---|---|---|
| 2026-03-21 | La Fiscalía Superior Anticorrupción dispone investigar a López Aliaga por presunta colusión y negociación incompatible en el endeudamiento por S/ 4 000 millones | Infobae, 21-03-2026 ([URL](https://www.infobae.com/peru/2026/03/21/fiscalia-anticorrupcion-dispone-investigar-a-rafael-lopez-aliaga-por-endeudamiento-de-s-4-mil-millones-en-mml/)) |
| 2026-04-05 | Tras declarar caduco el contrato de Rutas de Lima (dic-2025), se reporta que la MML asumiría S/ 1 500 millones de bonos de 2014 de la concesionaria | Gestión, 05-04-2026 ([URL](https://gestion.pe/economia/caso-rutas-de-lima-despues-que-mml-caduco-contrato-habria-heredado-pago-de-s-1500-millones-noticia/)) |
| 2026-05-19 | El Ministerio Público abre 60 días de diligencias preliminares y cita a declarar el 04-06-2026 | Infobae, 19-05-2026 ([URL](https://www.infobae.com/peru/2026/05/19/fiscalia-ordena-diligencias-por-60-dias-contra-rafael-lopez-aliaga-por-presunta-corrupcion-y-lo-cita-a-declarar-el-4-de-junio/)) |
| 2026-07-23 | El Consejo Fiscal alerta que el SDT alcanzó S/ 5 045 millones al cierre de 2025 | Informe N° 03-2026-CF (primaria) |
| 2026-08-05 | Se difunden los pasivos por sentencias y laudos: S/ 5 900 millones | Informe N° 03-2026-CF (primaria) + Gato Encerrado, 05-08-2026 |

El evento del 2026-03-21 ya existía con fuentes provisionales ("URL exacta pendiente") y se reemplazó con la URL verificada. El evento del 2026-07-23 ya había sido agregado en paralelo durante esta misma ronda; se conservó su detalle sobre el costo financiero neto y se le sumó el resto.

### Redacción neutral aplicada
- La actuación fiscal se describe como **investigación preliminar por presunta colusión y negociación incompatible**, con mención explícita de que no hay acusación ni condena y de que se mantiene la presunción de inocencia. Nunca como delito probado.
- El Consejo Fiscal **"advirtió" / "alertó" / "consideró necesario"**, sin adjetivos valorativos propios.
- La deuda de Rutas de Lima se registra en condicional ("asumiría", "habría trasladado"), tal como la reporta el diario, y se aclara que no está reconocida en las cuentas de la MML.

## Qué no se pudo confirmar

1. **Dato de 2026.** No existe todavía. El SDT se determina al cierre del ejercicio y el Consejo Fiscal lo publica hacia julio del año siguiente. `deuda_mml_saldo` 2026 queda en `null` con `parcial: true`. Las cifras de prensa de 2026 sobre "más de S/ 5 000 millones" corresponden al cierre 2025.
2. **URL exacta de la nota de Gato Encerrado del 05-08-2026.** El buscador del medio no respondió y los enlaces de Google News RSS son redirecciones cifradas que no resuelven. Titular, medio y fecha están verificados vía Google News RSS, y la cifra está confirmada contra la fuente primaria, así que la pérdida es solo del enlace.
3. **URL de la nota de La República del 24-07-2026** ("Consejo Fiscal advierte que deuda de S/5.045 millones de la MML compromete futuras gestiones") y de las coberturas equivalentes de Perú 21, Canal N, El Popular y América TV. No se registraron como fuentes porque la cifra ya está respaldada por la fuente primaria.
4. **Declaración de Carlos Bruce del 21-09-2026** (Infobae) sobre una deuda de más de S/ 5 000 millones. No se localizó el artículo; no se incorporó al timeline ni a las notas. Si se recupera, encaja como cobertura secundaria del mismo saldo de cierre 2025.
5. **Portal de Transparencia de la MML y series del MEF de deuda de gobiernos locales.** No se consultaron directamente: el Informe N° 03-2026-CF ya consolida la información del MEF, que es la fuente que alimenta el SDT, con desglose y metodología explícitos. No se detectó necesidad de un cruce adicional ni discrepancia entre fuentes.

## Nota sobre el campo `gestion` en timeline.json

Los eventos de 2026 se etiquetaron como `lopez_aliaga` por consistencia con los eventos de 2026 ya presentes en el archivo y con el vocabulario del esquema (`munoz|romero|lopez_aliaga`), aunque el alcalde en ejercicio durante 2026 es Renzo Reggiardo. Ampliar ese vocabulario queda fuera del alcance de esta ronda y debería decidirse junto con el frontend que lo consume.

## Método

Sin WebSearch. `curl` con User-Agent de navegador, `pdftotext -layout` para los PDF del Consejo Fiscal, Google News RSS para ubicar titulares y fechas, y la interfaz HTML de DuckDuckGo para recuperar las URL exactas de los medios (los enlaces de Google News no resuelven). El índice de documentos de cf.gob.pe (`/p/documentos/informes/` y `/p/documentos/reportes-tecnicos/`) se lee bien por curl y lista fechas de publicación.
