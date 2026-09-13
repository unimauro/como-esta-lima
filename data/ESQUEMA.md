# Esquema de datos — "¿Cómo está Lima?" 2019–2026

Regla dura: NO inventar cifras. Cada valor lleva fuente + URL + fecha de consulta.
Si un dato no existe o no es comparable: `valor: null` y explicar en `nota`.
Fecha de corte del proyecto: 2026-09-12. Idioma: español.

## indicadores  (data/research/<dimension>.json)
```json
{
  "dimension": "movilidad",
  "fecha_corte": "2026-09-12",
  "resumen_hallazgos": "texto breve: qué se encontró, qué no, discrepancias",
  "indicadores": [
    {
      "id": "tomtom_nivel_congestion",
      "nombre": "Nivel de congestión TomTom (Lima)",
      "descripcion": "qué mide exactamente",
      "unidad": "%",
      "mejor_si": "baja",                 // "baja" | "sube"
      "competencia": "compartida",        // "mml" | "compartida" | "otra_entidad" | "externo"
      "responsable_principal": "MML / ATU / municipios distritales",
      "confiabilidad": "alta",            // "alta" | "media" | "baja"
      "ambito": "Lima Metropolitana",     // o "Lima y Callao", "Provincia de Lima", "Perú"
      "serie": [
        {"anio": 2019, "valor": 42, "parcial": false, "nota": null},
        {"anio": 2026, "valor": null, "parcial": true, "nota": "solo hasta junio 2026"}
      ],
      "fuentes": [
        {"nombre": "TomTom Traffic Index 2019", "url": "https://...", "fecha_consulta": "2026-09-12",
         "metodologia": "…", "observaciones": "…", "tipo": "primaria"}   // "primaria" | "secundaria"
      ],
      "discrepancias": "si dos fuentes dan cifras distintas: ambas cifras y por qué",
      "nota": "limitaciones, cambios metodológicos, comparabilidad entre años"
    }
  ]
}
```

## proyectos  (data/research/proyectos.json)
```json
{ "fecha_corte": "2026-09-12", "proyectos": [
  {
    "id": "via-expresa-sur", "nombre": "Vía Expresa Sur", "cui_invierte": "2XXXXXX o null",
    "tipo": "vias|puentes|transporte|intercambios|ciclovias|parques|infra_social|salud|seguridad|espacio_publico",
    "distritos": ["Surco","San Juan de Miraflores"], "lat": -12.16, "lon": -76.98,
    "monto_soles": 0, "monto_fuente": "…",
    "concebido_por": "gestion_anterior|munoz|romero|lopez_aliaga|otra_entidad|null",
    "iniciado_por": "…", "ejecutado_por": ["…"], "terminado_por": "…|null", "inaugurado_por": "…|null",
    "financiado_por": "MML|MEF|APP|otra", "fecha_inicio": "AAAA-MM|null", "fecha_termino": "AAAA-MM|null",
    "estado": "terminado|en_ejecucion|planificacion|paralizado|cancelado|anunciado",
    "atribucion": "propio_completo|heredado_terminado|propio_en_curso|anunciado|paralizado",
    "beneficiarios": null, "fuentes": [ {…} ], "observaciones": "…"
  } ] }
```

## promesas (data/research/promesas.json)
```json
{ "promesas": [ { "gestion": "munoz|lopez_aliaga", "promesa": "…", "fecha": "AAAA-MM", "presupuesto_anunciado": null,
  "estado": "cumplido|en_ejecucion|parcial|no_cumplido|no_verificable", "evidencia": "…", "fuentes": [ {…} ] } ] }
```

## timeline (data/research/timeline.json)
```json
{ "eventos": [ { "fecha": "AAAA-MM-DD", "titulo": "…", "descripcion": "…", "gestion": "munoz|romero|lopez_aliaga",
  "categoria": "obra|presupuesto|institucional|transporte|seguridad|politico", "fuentes": [ {…} ] } ] }
```

## Gestiones
- munoz: Jorge Muñoz, 2019-01-01 → 2022-04 (vacancia; precisar fecha exacta con fuente JNE/El Peruano)
- romero: Miguel Romero Sotelo, 2022-04/05 → 2022-12-31 (transitoria)
- lopez_aliaga: Rafael López Aliaga, 2023-01-01 → en curso (verificar si renunció para candidatura presidencial 2026 y quién asumió: precisar con fuente)
