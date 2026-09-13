# Plan de diseño — ¿Cómo está Lima?

**Sujeto:** tablero cívico de calidad de vida y gestión urbana de Lima 2019–2026.
**Audiencia:** limeños, periodistas, analistas de políticas públicas, candidatos.
**Trabajo principal:** responder con datos rastreables "¿Está Lima mejor que en 2019 y hacia dónde va?"
sin propaganda.

## Tokens

Color (base): inspirado en la ciudad real — cielo gris "panza de burro", arena de los cerros, mar de la Costa Verde.
- `--garua`   #EDEFF1  superficie clara (cielo de invierno)
- `--tinta`   #172029  texto principal (asfalto húmedo)
- `--arena`   #C9B79A  acento cálido secundario (cerros / adobe)
- `--mar`     #0F5F6B  acento principal (Costa Verde)
- `--noche`   #11161B  superficie oscura
- `--piedra`  #5A6570  texto secundario

Series (dataviz, validadas): gestión Muñoz = azul `#2a78d6`, gestión López Aliaga = naranja `#eb6834`,
Romero (transitoria) = gris `#8a949e`. Los colores no son partidarios: son las ranuras 1 y 2 de la paleta
categórica validada para daltonismo. Estado: bueno `#0ca30c`, alerta `#fab219`, serio `#ec835a`, crítico `#d03b3b`.

Tipografía: **Bricolage Grotesque** (titulares, ancho, de carácter; figuras tabulares para cifras grandes) +
**Source Sans 3** (cuerpo, tablas). Escala: 13 / 15 / 18 / 24 / 34 / 52.

## Layout

Alineado a la izquierda, ancho máximo 1180 px, gutter 20 px. Navegación superior pegajosa con las 11 secciones.

```
┌──────────────────────────────────────────────────────────────┐
│ ¿Cómo está Lima?   Inicio Finanzas Movilidad Seguridad …     │
├──────────────────────────────────────────────────────────────┤
│ ¿Está Lima mejor que en 2019?                                │
│ [frase-diagnóstico generada de los datos]                    │
│ ┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐             │
│ │spk ││spk ││spk ││spk ││spk ││spk ││spk ││spk │  ← "skyline"│
│ │▲/▼ ││    ││    ││    ││    ││    ││    ││    │  de tendencias│
│ └────┘└────┘└────┘└────┘└────┘└────┘└────┘└────┘             │
│ 2019 ─── Muñoz ─── 2022 ─ Romero ─ 2023 ─── López Aliaga ─── 2026│
├──────────────────────────────────────────────────────────────┤
│ Sección: gráfico de serie con bandas de gestión + tabla + fuentes │
└──────────────────────────────────────────────────────────────┘
```

**Lo memorable:** el "skyline de tendencias" — una fila de sparklines por dimensión con las bandas de gestión
compartidas debajo, que se lee como el perfil de la ciudad. Todo lo demás es sobrio: gráficos de una sola escala,
grilla recesiva, fuentes al pie de cada cifra.

## Principios
1. Ninguna cifra sin chip de fuente (entidad · fecha) y etiqueta de competencia.
2. Bandas de gestión en el eje X en lugar de colorear la serie por alcalde: la ciudad es la serie, la gestión es el contexto.
3. Vocabulario neutro: subió / bajó / se mantuvo / sin datos. Nunca "éxito"/"fracaso".
4. 2026 siempre marcado como parcial (trama rayada).
5. Modo oscuro seleccionado (no invertido).

## Revisión contra defaults
- Se descartó el fondo crema + serif + terracota (default genérico) por el gris de garúa + grotesca ancha.
- Se descartó el "hero de número gigante" por la fila de sparklines, que es el contenido real.
- Sin eyebrows en mayúsculas ni tarjetas idénticas: las tarjetas de dimensión tienen jerarquía (la de la
  dimensión con mayor cambio se ensancha).
