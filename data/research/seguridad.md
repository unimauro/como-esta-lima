# Seguridad — notas de investigación (corte 2026-09-12, consulta 2026-09-13)

## Método
- Seguridad **objetiva**: ENAPRES-INEI (victimización, denuncia, arma de fuego), registros PNP-SIDPOL (extorsión), INEI-CEIC (homicidios).
- Seguridad **percibida**: ENAPRES (percepción de inseguridad a 12 meses) y Lima Cómo Vamos (principal problema, se siente inseguro).
- Para ENAPRES se toma el **semestre julio–diciembre** que cierra cada año (2019: ago-2019/ene-2020, único disponible; 2026: feb–jul 2026, preliminar). Los semestres móviles del mismo año difieren en varios puntos (p. ej. nov19-abr20 = 31,6% vs ago19-ene20 = 32,6%).
- **Ruptura de comparabilidad**: hasta 2022 INEI publica "Lima Metropolitana" (43 distritos); desde 2023 publica "Lima Metropolitana y Provincia Constitucional del Callao" y el indicador de victimización incluye tentativas de extorsión. 2020–2021 están afectados por la pandemia.

## Series clave (fuente: boletines INEI locales)
| Año | Víctimas % | Percepción % | Denuncia % | Ámbito |
|---|---|---|---|---|
| 2019 | 32,6 | 90,3 | n.d. | LM (ago19-ene20) |
| 2020 | 26,8 | 89,7 | n.d. (oct20-mar21: 16,1) | LM |
| 2021 | 22,5 | 93,0 | 14,2 | LM |
| 2022 | 25,9 | 89,4 | 17,6 | LM |
| 2023 | 32,5 | 86,6 | 16,6 | LM + Callao |
| 2024 | 29,3 | 88,1 | 15,8 | LM + Callao |
| 2025 | 25,5 | 84,9 | 21,2 | LM + Callao |
| 2026 (feb-jul) | 26,0 | 87,0 | 18,5 | LM + Callao |

Lima Cómo Vamos (Lima; desde 2022 total Lima+Callao para "se siente inseguro"): principal problema 72,8 (2021), 76,5 (2022), 70,9 (2023), 80,2 (2024), 75,2 (2025); se siente inseguro 63,2 (2019), 76,0 (2022), 79,6 (2023), 77,4 (2024), 78,3 (2025). Sin encuesta comparable 2020.

## Lo que NO se pudo obtener (null en el JSON)
- **Homicidios Lima Metropolitana** (tasa y número): la fuente es INEI "Homicidios en el Perú, contándolos uno a uno" / CEIC; no se pudo descargar. Solo tasa nacional INEI: 8,6 (2021), 9,3 (2023), 10,1 (2024), 10,7 (2025 preliminar).
- **Extorsión anual LM**: solo IV Trim 2024 = 2 555 denuncias (INEI/SIDPOL) y 2025 = 12 701 denuncias policiales (RPP, secundaria). PNP y Ministerio Público difieren (IV Trim 2025: -12,5% vs +2%).
- **Serenos RENAMU 2019–2025**: solo línea base 12 181 (jun-2016) y 11 607 (mar-2018); cámaras: LM concentraba 53% de 7 547 cámaras operativas del país (2018).
- **MML Cercado (serenos, cámaras, vehículos)**: el archivo `cercado2023.txt` era el informe de residuos sólidos, no el plan de seguridad; HTML de gob.pe vacíos (JS). Hito: 200 pistolas eléctricas para serenos MML desde 29-mar-2026.
- **Estados de emergencia**: 2026 documentado (prórrogas abr y 28-jun-2026; nueva declaratoria D.S. 123-2026-PCM, 28-ago-2026, 60 días). Cadena 2023–2025 pendiente de verificar con El Peruano.

## Limitaciones de la sesión
Presupuesto de WebSearch agotado (200/200) antes de esta tarea; Bing web y DuckDuckGo devolvieron resultados degradados/bloqueados; m.inei.gob.pe respondió vacío; varias URLs de prensa dieron 403/404. Se usaron ~35 llamadas de red (Bing News RSS + WebFetch).

## Pendientes prioritarios
1. Homicidios LM 2019–2024 (INEI datacrim / publicación CEIC).
2. RENAMU serenos y cámaras provincia de Lima 2019–2025 ("Indicadores de Gestión Municipal").
3. Extorsión LM anual desde boletines trimestrales INEI 2019–2025.
4. Plan de Acción de Seguridad Ciudadana del Cercado (CODISEC-MML) para recursos MML.
5. Decretos supremos de estado de emergencia 2023–2025.
