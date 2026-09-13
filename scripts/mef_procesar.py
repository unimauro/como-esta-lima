"""Procesa los CSV filtrados del MEF (data/raw/mef_mml_AAAA.csv, mef_distritos_AAAA.csv)
y genera app/src/data/mef.json con la serie 2019–2026 del pliego Municipalidad
Metropolitana de Lima y el agregado por municipalidad distrital.

Esquema MEF de 73 columnas (verificado 2026-09-12). Cada fila = una combinación única de
clasificadores con PIA/PIM anuales y devengado mensual; sumar filas = totales del pliego.
Uso: python3 scripts/mef_procesar.py
"""
import csv, glob, json, sys
from collections import defaultdict
from pathlib import Path

csv.field_size_limit(sys.maxsize)
ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw"
OUT = ROOT / "app" / "src" / "data"
OUT.mkdir(parents=True, exist_ok=True)

I_EJEC_N, I_TIPO_ACT = 9, 18
I_FUNCION_N = 24
I_FF_N = 36
I_CAT_N = 42
I_GEN, I_GEN_N = 45, 46
I_PIA, I_PIM, I_CERT, I_COMP = 55, 56, 57, 58
I_DEV_MESES = list(range(59, 71))
I_DEV, I_GIR = 71, 72
MES_CORTE_2026 = None  # se detecta: último mes con devengado > 0


def f(x):
    try:
        return float((x or "0").replace(",", ""))
    except ValueError:
        return 0.0


def acc():
    return {"pim": 0.0, "dev": 0.0}


def procesar_anio(path: Path):
    anio = int(path.stem.split("_")[-1])
    tot = dict(pia=0.0, pim=0.0, cert=0.0, comp=0.0, dev=0.0, gir=0.0)
    meses = [0.0] * 12
    grupos = {k: defaultdict(acc) for k in ("funcion", "generica", "ejecutora", "fuente", "categoria")}
    inversiones = acc(); personal = acc()
    with open(path, newline="", encoding="utf-8") as fh:
        rd = csv.reader(fh); next(rd)
        for r in rd:
            pia, pim, dev = f(r[I_PIA]), f(r[I_PIM]), f(r[I_DEV])
            tot["pia"] += pia; tot["pim"] += pim; tot["dev"] += dev
            tot["cert"] += f(r[I_CERT]); tot["comp"] += f(r[I_COMP]); tot["gir"] += f(r[I_GIR])
            for i, m in enumerate(I_DEV_MESES):
                meses[i] += f(r[m])
            for k, idx in (("funcion", I_FUNCION_N), ("generica", I_GEN_N), ("ejecutora", I_EJEC_N),
                           ("fuente", I_FF_N), ("categoria", I_CAT_N)):
                g = grupos[k][r[idx].strip().title()]
                g["pim"] += pim; g["dev"] += dev
            if r[I_TIPO_ACT].strip().upper() == "PROYECTO":  # inversión (proyectos Invierte.pe)
                inversiones["pim"] += pim; inversiones["dev"] += dev
            gen = r[I_GEN].strip()
            if gen in ("1", "5-21", "21") or "PERSONAL Y OBLIGACIONES" in r[I_GEN_N].upper():
                personal["pim"] += pim; personal["dev"] += dev
    # mes de corte: último mes con devengado significativo
    mes_corte = max((i + 1 for i, v in enumerate(meses) if v > 0), default=0)
    parcial = anio >= 2026 or mes_corte < 12
    cat = grupos["categoria"]
    def pick(d, *keys):
        out = acc()
        for k, v in d.items():
            if any(kk in k.upper() for kk in keys):
                out["pim"] += v["pim"]; out["dev"] += v["dev"]
        return out
    return dict(
        anio=anio, parcial=parcial, mes_corte=mes_corte,
        pia=round(tot["pia"], 2), pim=round(tot["pim"], 2), certificado=round(tot["cert"], 2),
        devengado=round(tot["dev"], 2), girado=round(tot["gir"], 2),
        ejecucion_pct=round(tot["dev"] / tot["pim"] * 100, 2) if tot["pim"] else None,
        dev_mensual=[round(m, 2) for m in meses],
        dev_hasta_mes_corte=None,  # se rellena después con el mes de corte de 2026
        corriente=pick(cat, "CORRIENTE"), capital=pick(cat, "CAPITAL"),
        servicio_deuda=pick(cat, "DEUDA"),
        personal={k: round(v, 2) for k, v in personal.items()},
        inversiones={k: round(v, 2) for k, v in inversiones.items()},
        por_funcion=sorted([dict(nombre=k, **{kk: round(vv, 2) for kk, vv in v.items()}) for k, v in grupos["funcion"].items()], key=lambda x: -x["pim"]),
        por_generica=sorted([dict(nombre=k, **{kk: round(vv, 2) for kk, vv in v.items()}) for k, v in grupos["generica"].items()], key=lambda x: -x["pim"]),
        por_ejecutora=sorted([dict(nombre=k, **{kk: round(vv, 2) for kk, vv in v.items()}) for k, v in grupos["ejecutora"].items()], key=lambda x: -x["pim"]),
        por_fuente=sorted([dict(nombre=k, **{kk: round(vv, 2) for kk, vv in v.items()}) for k, v in grupos["fuente"].items()], key=lambda x: -x["pim"]),
    )


def procesar_distritos():
    out = []
    for path in sorted(RAW.glob("mef_distritos_*.csv")):
        agg = {}
        with open(path, newline="", encoding="utf-8") as fh:
            for r in csv.DictReader(fh):
                key = (int(r["anio"]), r["ubigeo"], r["distrito"].title())
                a = agg.setdefault(key, dict(pia=0.0, pim=0.0, dev=0.0, dev_seguridad=0.0, dev_transporte=0.0, dev_ambiente=0.0))
                a["pia"] += f(r["pia"]); a["pim"] += f(r["pim"]); a["dev"] += f(r["devengado"])
                fn = r["funcion"].upper()
                if "ORDEN PUBLICO" in fn or "SEGURIDAD" in fn: a["dev_seguridad"] += f(r["devengado"])
                if "TRANSPORTE" in fn: a["dev_transporte"] += f(r["devengado"])
                if "AMBIENTE" in fn: a["dev_ambiente"] += f(r["devengado"])
        for (anio, ub, dn), a in agg.items():
            out.append(dict(anio=anio, ubigeo=ub, distrito=dn, **{k: round(v, 2) for k, v in a.items()}))
    return sorted(out, key=lambda x: (x["anio"], x["ubigeo"]))


def main():
    files = sorted(RAW.glob("mef_mml_*.csv"))
    anios = [procesar_anio(p) for p in files if p.stat().st_size > 1000]
    anios.sort(key=lambda a: a["anio"])
    corte = next((a["mes_corte"] for a in anios if a["anio"] == 2026), 12) or 12
    for a in anios:
        a["dev_hasta_mes_corte"] = round(sum(a["dev_mensual"][:corte]), 2)
    log = json.loads((RAW / "mef_log.json").read_text()) if (RAW / "mef_log.json").exists() else {}
    fecha = next((v.get("fecha_descarga") for v in log.values() if v.get("ok")), None)
    data = dict(
        fuente="MEF – Datos Abiertos: Presupuesto y Ejecución de Gasto (Devengado), pliego Municipalidad Metropolitana de Lima (todas sus unidades ejecutoras)",
        url_base="https://fs.datosabiertos.mef.gob.pe/datastorefiles/",
        fecha_descarga=fecha, mes_corte_2026=corte, anios=anios, distritos=procesar_distritos(), log=log,
    )
    (OUT / "mef.json").write_text(json.dumps(data, ensure_ascii=False))
    for a in anios:
        print(f"{a['anio']}: PIA {a['pia']/1e6:,.1f} M | PIM {a['pim']/1e6:,.1f} M | Dev {a['devengado']/1e6:,.1f} M | {a['ejecucion_pct']}% | corte mes {a['mes_corte']} | ejecutoras {len(a['por_ejecutora'])}")
    print("distritos filas:", len(data["distritos"]))


if __name__ == "__main__":
    main()
