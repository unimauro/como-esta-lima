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
