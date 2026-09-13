#!/bin/bash
# Descarga con reanudación (curl -C -) cada CSV anual del MEF a data/raw/tmp_AAAA.csv,
# lo filtra con mef_descarga.py y borra el temporal. Uso: scripts/mef_bajar.sh 2023 2024 ...
cd "$(dirname "$0")/.." || exit 1
BASE=https://fs.datosabiertos.mef.gob.pe/datastorefiles
for A in "$@"; do
  if [ "$A" -ge 2025 ]; then U="$BASE/$A-Gasto-Devengado-Mensual.csv"; else U="$BASE/$A-Gasto-Devengado.csv"; fi
  T="data/raw/tmp_$A.csv"
  LEN=$(curl -sI "$U" | tr -d '\r' | awk 'tolower($1)=="content-length:"{print $2}')
  for i in $(seq 1 40); do
    SZ=$(stat -f%z "$T" 2>/dev/null || echo 0)
    [ -n "$LEN" ] && [ "$SZ" -ge "$LEN" ] && break
    curl -sS -C - --retry 5 --retry-delay 10 --retry-all-errors --speed-limit 1000 --speed-time 120 -o "$T" "$U" || sleep 15
  done
  SZ=$(stat -f%z "$T" 2>/dev/null || echo 0)
  echo "[$A] descargado $SZ de $LEN bytes"
  if [ -n "$LEN" ] && [ "$SZ" -ge "$LEN" ]; then python3 scripts/mef_descarga.py "$A" && rm -f "$T"; else echo "[$A] INCOMPLETO"; fi
done
