# ¿Cómo está Lima? 2019–2026

Dashboard ciudadano de calidad de vida y gestión urbana de Lima Metropolitana (2019–2026).
Compara las gestiones municipales de Jorge Muñoz (2019–2022) y Rafael López Aliaga (2023–2026)
separando lo que depende de la Municipalidad Metropolitana de Lima de lo que depende de otras entidades.

**Regla dura:** ninguna cifra sin fuente, URL y fecha de consulta. Sin datos → "sin datos", nunca estimaciones ocultas.

- `data/research/` — indicadores por dimensión con fuentes (JSON)
- `data/raw/` — filtros del MEF Datos Abiertos (no versionados, se regeneran con `scripts/mef_descarga.py`)
- `scripts/` — descarga y procesamiento
- `src/` — dashboard (React + TypeScript + Vite + Tailwind + Recharts)

Publicado en GitHub Pages.

## Cómo actualizar los datos

```bash
# 1. Presupuesto MEF (CSV anuales ~2,8 GB, se procesan en streaming; la MML = ubigeo ejecutora 150101)
python3 scripts/mef_descarga.py 2019 2020 2021 2022 2023 2024 2025 2026   # revisa data/raw/mef_log.json
python3 scripts/mef_procesar.py                                             # → app/src/data/mef.json

# 2. Indicadores investigados (data/research/*.json según data/ESQUEMA.md) → app/src/data/
python3 scripts/build_data.py

# 3. Dashboard
cd app && npm install && npm run build   # o npm run dev
```

Cada push a `main` redespliega en https://unimauro.github.io/como-esta-lima/ mediante GitHub Actions.
