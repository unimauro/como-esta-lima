"""Descarga en streaming los CSV anuales de MEF Datos Abiertos (Gasto Devengado) y
filtra: (a) todas las filas del pliego Municipalidad Metropolitana de Lima (todas sus
unidades ejecutoras) -> data/raw/mef_mml_AAAA.csv ; (b) agregado por municipalidad
distrital de Lima Metropolitana (dpto 15, prov 01) -> data/raw/mef_distritos_AAAA.csv.
No inventa nada: si un año falla lo registra en data/raw/mef_log.json.
Uso: python3 scripts/mef_descarga.py 2019 2020 ...
"""
import csv, io, json, sys, urllib.request, time
from collections import defaultdict
from datetime import date
from pathlib import Path

RAW = Path(__file__).resolve().parent.parent / "data" / "raw"
RAW.mkdir(parents=True, exist_ok=True)
BASE = "https://fs.datosabiertos.mef.gob.pe/datastorefiles"
def url(a): return f"{BASE}/{a}-Gasto-Devengado-Mensual.csv" if a >= 2025 else f"{BASE}/{a}-Gasto-Devengado.csv"

I_NIVEL, I_PLIEGO, I_PLIEGO_N, I_SEC_EJEC, I_EJEC_N = 1, 5, 6, 7, 9
I_DPTO, I_PROV, I_DIST, I_DIST_N = 10, 12, 14, 15
I_FUNCION, I_FUNCION_N = 23, 24
I_CAT_N, I_GEN_N = 42, 46
I_PIA, I_PIM, I_DEV = 55, 56, 71
I_DEV_MESES = list(range(59, 71))

def f(x):
    try: return float((x or "0").replace(",", ""))
    except ValueError: return 0.0

def run(anio, intento=1):
    u = url(anio); out_mml = RAW / f"mef_mml_{anio}.csv"; out_dist = RAW / f"mef_distritos_{anio}.csv"
    req = urllib.request.Request(u, headers={"User-Agent": "como-esta-lima/1.0"})
    n = n_mml = 0; pliegos = set(); ejecutoras = set()
    dist = defaultdict(lambda: defaultdict(lambda: [0.0]*15))  # (ubigeo,nombre) -> funcion -> [pia,pim,dev, dev_m1..m12]
    t0 = time.time()
    local = RAW / f"tmp_{anio}.csv"  # si scripts/mef_bajar.sh ya descargó el CSV completo, se lee local
    try:
        with (open(local, "rb") if local.exists() else urllib.request.urlopen(req, timeout=600)) as resp:
            rd = csv.reader(io.TextIOWrapper(resp, encoding="utf-8-sig", newline=""))
            head = next(rd)
            with open(out_mml, "w", newline="", encoding="utf-8") as fo:
                w = csv.writer(fo); w.writerow(head)
                for r in rd:
                    n += 1
                    if len(r) < 73 or r[I_NIVEL].strip() != "M": continue
                    # En gobiernos locales PLIEGO_NOMBRE viene en blanco: la MML se identifica por
                    # ubigeo de la ejecutora 15-01-01 (Lima Cercado). Verificado 2026-09-13.
                    if r[I_DPTO].strip() == "15" and r[I_PROV].strip() == "01" and r[I_DIST].strip() == "01":
                        w.writerow(r); n_mml += 1
                        pliegos.add(r[I_PLIEGO] + " " + r[I_PLIEGO_N]); ejecutoras.add(r[I_SEC_EJEC] + " " + r[I_EJEC_N])
                    if r[I_DPTO].strip() == "15" and r[I_PROV].strip() == "01":
                        key = (r[I_DPTO]+r[I_PROV]+r[I_DIST], r[I_DIST_N], r[I_PLIEGO_N])
                        acc = dist[key][r[I_FUNCION] + " " + r[I_FUNCION_N]]
                        acc[0] += f(r[I_PIA]); acc[1] += f(r[I_PIM]); acc[2] += f(r[I_DEV])
                        for i, m in enumerate(I_DEV_MESES): acc[3+i] += f(r[m])
        with open(out_dist, "w", newline="", encoding="utf-8") as fo:
            w = csv.writer(fo); w.writerow(["anio","ubigeo","distrito","pliego","funcion","pia","pim","devengado"]+[f"dev_m{i+1}" for i in range(12)])
            for (ub, dn, pl), fun in dist.items():
                for fn, acc in fun.items(): w.writerow([anio, ub, dn, pl, fn] + [round(x, 2) for x in acc])
        res = dict(anio=anio, url=u, ok=True, filas_total=n, filas_mml=n_mml, pliegos=sorted(pliegos), ejecutoras=sorted(ejecutoras), fecha_descarga=date.today().isoformat(), segundos=round(time.time()-t0))
    except Exception as e:
        if intento < 3:
            print(f"[{anio}] error {e}; reintento {intento+1}/3", flush=True); time.sleep(30)
            return run(anio, intento + 1)
        res = dict(anio=anio, url=u, ok=False, error=str(e), fecha_descarga=date.today().isoformat())
    log = RAW / "mef_log.json"
    data = json.loads(log.read_text()) if log.exists() else {}
    data[str(anio)] = res; log.write_text(json.dumps(data, indent=1, ensure_ascii=False))
    print(json.dumps(res, ensure_ascii=False), flush=True)

for a in sys.argv[1:]: run(int(a))
