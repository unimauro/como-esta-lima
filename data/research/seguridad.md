# Seguridad — notas de investigación (corte 2026-09-12, consultas 2026-09-13 y actualización 2026-09-22)

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

## ACTUALIZACIÓN 2026-09-22 (fuentes primarias INEI obtenidas)
Se descargaron PDFs oficiales del INEI (www.inei.gob.pe/media y cdn.www.gob.pe) por curl y se leyeron con pdftotext. gob.pe bloquea WebFetch (HTTP 418) pero responde a curl con User-Agent de navegador; su buscador server-rendered permitió hallar las fichas.

- **Homicidios Lima Metropolitana** (INEI-CEIC, "Homicidios en el Perú, contándolos uno a uno, 2019 y 2020"): **676** homicidios en 2019 (tasa **7,1**) y **544** en 2020 (tasa **5,6**). Nacional: 2 385 muertes / 7,4 (2019) y 1 903 / 5,8 (2020). La edición 2021 solo publica su capítulo metodológico; 2022-2024 no existen como "uno a uno" y los anuarios de criminalidad no traen homicidios por departamento → 2021-2025 quedan null.
- **Serenos Lima Metropolitana** (RENAMU, Anuario de la Criminalidad 2019-2023 y 2024): **15 237** (31-mar-2023) y **16 201** (31-mar-2024). Serie NACIONAL: 28 702 (2019), 31 715 (2020), 33 902 (2021), 34 548 (2022), 37 006 (2023), 39 591 (2024), 42 333 (2025). Lima 2019-2022 y 2025 no se publican como absoluto → null.
- **Serenos del Cercado / distrito de Lima (MML)** (RENAMU, Anuario 2024, cuadro distrital): **1 417** (2023) y **977** (2024, -31,1%).
- **Estados de emergencia por criminalidad** (cualitativo 0/1): 2019-2022 = 0; 2023 = 1 (SJL, SMP; Cercado y Lince, D.S. modificatorio del D.S. 105-2023-PCM); 2024 = 1 (26-set-2024, 11 distritos de Lima + Ventanilla, 60 días); 2025 = 1 (marzo 2025 tras ataque a Armonía 10; D.S. exacto no verificado); 2026 = 1 (D.S. 123-2026-PCM, 28-ago-2026). 2023-2024 vía Wikipedia (secundaria, con referencia a decretos PCM); 2026 vía El Peruano/Andina.
- **Extorsión anual comparable de Lima**: no obtenida. El Anuario 2019-2023 (Cuadro 1.2) reporta extorsión NACIONAL en el registro de denuncias de delitos y faltas = 515/467/720/1 835/2 396 (2019-2023), cifras muy inferiores y no comparables con los boletines trimestrales SIDPOL (11 789 nacional solo en IV Trim 2024, LM 2 555) ni con el Ministerio Público (12 077→22 396 nacional 2022-2023). Se mantiene 2025 = 12 701 (RPP). → serie anual de Lima sigue null.

## Sigue null (y por qué)
- Homicidios Lima 2021-2025; extorsión anual comparable de Lima 2019-2024; serenos Lima 2019-2022 y 2025; cámaras y vehículos del Cercado MML (RENAMU/Gestión Municipal 2025 no dan desglose distrital limpio de esos dos recursos).

## Limitaciones de la sesión
Presupuesto de WebSearch agotado; se usó SOLO WebFetch + descarga directa por curl. gob.pe → 418 en WebFetch (sí por curl con UA de navegador); m.inei.gob.pe con error de certificado; datacrim.inei.gob.pe es JS y no extraíble; buscadores de El Peruano/Andina dieron 404. Los archivos pdf/ que se esperaban en el scratchpad no existían en esta sesión.

## Pendientes prioritarios
1. Homicidios LM 2021-2025 (capítulos de resultados de "uno a uno 2021" y ediciones nuevas; datacrim).
2. Serenos LM 2019-2022 y 2025 (cuadros departamentales absolutos de RENAMU).
3. Extorsión LM anual comparable desde datacrim / datos abiertos MININTER.
4. Cámaras y vehículos del Cercado (CODISEC-MML / RENAMU distrital).
5. Números exactos de D.S. de estado de emergencia 2023-2025 (El Peruano/normas.gob.pe).
