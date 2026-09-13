# Notas de investigación — Movilidad y tráfico (consulta 2026-09-13)

## Fuentes usadas (material en scratchpad de sesión)
- TomTom Traffic Index Lima: página 2025 (tomtom_lima.html) y capturas de ediciones 2019–2024 (tt_2020..2025*.html). Tres metodologías: 2019–2021 (% congestión clásico), 2022–2024 (tiempo por 10 km + % con nuevo baseline) y 2025 (nuevo baseline, 69,3 %). Cada edición reexpresa el año previo.
- Ositran, informes de desempeño Línea 1 (2019–2025) y Línea 2 (2025). URL verificada: .../2018/04/informe-desempeno-linea-1-2025.pdf y ...-linea-2-2025.pdf (HTTP 200). El informe 2024 no responde con el mismo patrón (404).
- Lima Cómo Vamos: informes 2019, 2021, 2022, 2023, 2024, 2025 (PDF). URLs verificadas solo para 2023 y 2025. No publican minutos promedio de viaje; el % >1 h solo aparece en 2019.
- ONSV: microdatos de siniestros fatales 2021–2025 (UPIAT-PNP) y compilación histórica de anuarios PNP por región. El archivo 2025 solo llega hasta abril 2025.
- Wikipedia (secundaria): Línea 2 (5 estaciones desde 21-dic-2023) y tarifa del Metropolitano (S/ 3,20 desde 16-jul-2022, citando El Comercio).

## Qué NO se obtuvo (null en el JSON)
- Pasajeros anuales de Metropolitano y corredores (ATU): las páginas de noticias gob.pe no exponen cifras anuales y Andina devolvió 404. Pendiente: boletín estadístico ATU / solicitud de acceso a la información.
- INRIX: sin cifra para Lima (Gestión sin resultados; portal INRIX sin listado accesible).
- Km de ciclovías: solo anuncios de la MML (147 km proyectados 2019; 114 km con KfW 2021; mantenimiento de 25 km 2020). Falta el inventario total.
- Parque automotor Lima: la página del MTC capturada llega a 2018.
- Tarifa Línea 1: no se extrajo de una fuente en esta consulta (se cree S/ 1,50 constante).

## Limitaciones de la sesión
- Presupuesto de WebSearch agotado (200/200) antes de esta consulta; Bing y DuckDuckGo vía curl devolvieron páginas anti-bot; búsquedas internas de La República y El Comercio no fueron útiles.

## Decisiones
- Fallecidos: dos series. `fallecidos_siniestros` (provincia de Lima, microdatos ONSV 2021–2024) es la más pertinente; `fallecidos_siniestros_region_lima_pnp` (región policial Lima, anuarios PNP 2019–2024) sirve para ver 2019–2020 con ámbito más amplio.
- `lcv_pct_transporte_publico` 2022–2025 es suma propia de filas de la tabla de modo de viaje al trabajo (puede omitir corredores).
