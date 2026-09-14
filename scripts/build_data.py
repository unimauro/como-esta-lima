"""Consolida data/research/*.json en app/src/data/ (indicadores.json, proyectos.json,
promesas.json, timeline.json, gestiones.json) y copia el GeoJSON a app/public/geo/.
Valida esquema mínimo y reporta indicadores sin serie. No modifica los archivos fuente.
Uso: python3 scripts/build_data.py
"""
import json, shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RES = ROOT / "data" / "research"
OUT = ROOT / "app" / "src" / "data"
PUB = ROOT / "app" / "public" / "geo"
OUT.mkdir(parents=True, exist_ok=True); PUB.mkdir(parents=True, exist_ok=True)

DIMENSIONES = ["movilidad", "seguridad", "costo_vida", "servicios_ambiente", "institucional", "demografia"]


def load(name):
    p = RES / f"{name}.json"
    if not p.exists():
        print(f"  [falta] {p.name}"); return None
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        print(f"  [JSON inválido] {p.name}: {e}"); return None


def norm_serie(serie):
    out = []
    for p in serie or []:
        try:
            anio = int(p.get("anio"))
        except (TypeError, ValueError):
            continue
        v = p.get("valor")
        if isinstance(v, str):
            try: v = float(v.replace(",", ""))
            except ValueError: v = None
        out.append(dict(anio=anio, valor=v, parcial=bool(p.get("parcial")), nota=p.get("nota")))
    return sorted(out, key=lambda x: x["anio"])


indicadores, resumenes, advertencias, gestiones = [], {}, {}, None
for d in DIMENSIONES:
    j = load(d)
    if not j: continue
    resumenes[d] = j.get("resumen_hallazgos")
    if j.get("advertencia"): advertencias[d] = j["advertencia"]
    if j.get("gestiones"): gestiones = j["gestiones"]
    for ind in j.get("indicadores", []):
        ind = dict(ind); ind["dimension"] = d
        ind["serie"] = norm_serie(ind.get("serie"))
        ind.setdefault("fuentes", []); ind.setdefault("mejor_si", "sube")
        ind.setdefault("competencia", "compartida"); ind.setdefault("confiabilidad", "media")
        ind.setdefault("unidad", "")
        n = sum(1 for p in ind["serie"] if p["valor"] is not None)
        if n == 0: print(f"  [sin datos] {d}/{ind.get('id')}")
        indicadores.append(ind)

(OUT / "indicadores.json").write_text(json.dumps(dict(indicadores=indicadores, resumenes=resumenes, advertencias=advertencias), ensure_ascii=False))
print(f"indicadores: {len(indicadores)}")

for name, key in (("proyectos", "proyectos"), ("promesas", "promesas"), ("timeline", "eventos")):
    j = load(name)
    items = (j or {}).get(key, [])
    (OUT / f"{name}.json").write_text(json.dumps(items, ensure_ascii=False))
    print(f"{name}: {len(items)}")

(OUT / "gestiones.json").write_text(json.dumps(gestiones or [], ensure_ascii=False))

geo = ROOT / "data" / "geo" / "lima_distritos.geojson"
if geo.exists():
    shutil.copy(geo, PUB / "lima_distritos.geojson"); print("geojson copiado", geo.stat().st_size // 1024, "KB")
else:
    print("  [falta] geojson")
