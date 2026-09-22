# Servicios y ambiente — notas de investigación

Fecha de corte del proyecto: 2026-09-12. Verificación web complementaria: 2026-09-22 (curl + pdftotext/regex, sin WebSearch).

## Estado de los indicadores

- **Con datos**: PM2.5 2025 (AAP/IQAir), áreas verdes RENAMU 2022-2023, residuos generados y dispuestos 2019-2023 (INEI/SIGERSOL), cobertura agua/alcantarillado INEI-ENAPRES 2019-2023 y SUNASS/SEDAPAL 2019-2023, percepción LCV (áreas verdes 2019/2022-2025, aire 2019/2021-2025, alumbrado 2021, ciudad para vivir 2019 y 2025).
- **Sin serie oficial comparable (null + nota)**:
  - `serpar_parques_arboles`: SERPAR administra **10 clubes metropolitanos y 9 parques metropolitanos** (antes "parques zonales"), según el portal oficial serpar.gob.pe/parques-y-clubes (consulta 2026-09-22). No publica serie anual de hectáreas ni de árboles plantados. Wikipedia menciona una reserva histórica de +21 000 ha de los años 1960, no equiparable. Serie numérica en null.
  - `espacios_publicos_recuperados_mml`: no se localizó serie anual homogénea. Responsable institucional = PROLIMA/EMILIMA (MML); las cifras aparecen dispersas en notas de prensa por intervención, no como conteo comparable. En null; requiere memorias de gestión MML.
  - `lcv_satisfaccion_limpieza`: sin serie de satisfacción total con el recojo de basura en las ediciones extraídas; se documenta como proxy el % que menciona la limpieza pública/acumulación de basura entre los principales problemas de la ciudad (2019 4.º problema; 2021 34,3%; 2022 31,0%; 2023 34,9%; 2024 29,3%; 2025 20,3%). Valores de satisfacción quedan en null.

## Técnica y limitaciones web (2026-09-22)

- `curl -A "Mozilla/..."` funcionó en serpar.gob.pe y en Bing (resultados HTML). DuckDuckGo HTML devolvió challenge anti-bot. gob.pe/busquedas con el formato probado dio 404.
- Bing entregó buen resultado estructurado para la consulta genérica de SERPAR, pero degradó a resultados no relacionados (Khan Academy, Microsoft) en consultas con codificación especial repetidas.
- No fue posible obtener por web las cifras faltantes de IQAir 2019-2024 ni de cobertura SEDAPAL 2024 (bloqueo/checkpoint).
- Regla dura respetada: no se inventó ninguna cifra; los huecos sin fuente oficial quedan en `valor: null` con nota explicativa.
