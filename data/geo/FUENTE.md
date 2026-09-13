# Fuente de `lima_distritos.geojson`

- **Archivo:** `data/geo/lima_distritos.geojson` — 43 features (Polygon/MultiPolygon), uno por distrito de la provincia de Lima (ubigeo 150101–150143). No incluye Callao.
- **Properties por feature:** `{"ubigeo": "150101", "nombre": "Lima"}`. Nombres en español con tildes; 150121 figura como "Pueblo Libre" (nombre oficial INEI: Magdalena Vieja).
- **CRS:** WGS84 (EPSG:4326), lon/lat. Bounding box: -77.1988, -12.5199, -76.6208, -11.5724.
- **Peso:** ~397 KB (coordenadas con 4 decimales ≈ 11 m; sin simplificación de vértices).

## Origen
- **Dataset:** Peru - Subnational Administrative Boundaries (COD-AB), nivel ADM3 (distritos).
- **Publicador:** OCHA / HDX, a partir de límites del Instituto Geográfico Nacional (IGN) del Perú y códigos ubigeo INEI (campo `adm3_pcode` = "PE" + ubigeo; `valid_on` 2020-07-14).
- **URL dataset:** https://data.humdata.org/dataset/cod-ab-per
- **Recurso descargado:** `per_admin_boundaries.geojson.zip` (archivo `per_admin3.geojson`)
  https://data.humdata.org/dataset/54fc7f4d-f4c0-4892-91f6-2fe7c1ecf363/resource/63647792-0951-40d2-a30e-4a0e60f7a176/download/per_admin_boundaries.geojson.zip
- **Licencia:** Creative Commons Attribution for Intergovernmental Organisations (CC BY-IGO).
- **Última modificación del dataset en HDX:** 2026-08-14 (archivos fechados 2026-01-26).
- **Fecha de descarga:** 2026-09-13.

## Procesamiento (2026-09-13)
1. Filtro `adm3_pcode` que empieza con `PE1501` → 43 distritos.
2. Renombrado de properties a `ubigeo` (sin prefijo PE) y `nombre` (grafía oficial con tildes).
3. `npx mapshaper -i per_admin3_lima.geojson -o precision=0.0001 format=geojson` (reducción de precisión a 4 decimales; no se aplicó `-simplify` porque el archivo ya quedó < 600 KB).
4. Validación con `python3 json.load`: 43 features, 43 ubigeos únicos.

## Alternativa descartada
- `juaneladio/peru-geojson` (`peru_distrital_simple.geojson`, MPL-2.0, 2016): Santa Anita (150137) sin geometría y polígonos muy simplificados. No se usó.
