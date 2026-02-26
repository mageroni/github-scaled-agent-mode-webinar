---
description: |
  Este workflow genera una tabla con los contribuidores del repositorio y asigna
  el rol de ganador al contribuidor que más líneas de código agregó en Noviembre de 2025.

on:
  schedule: weekly
  workflow_dispatch:

permissions:
  contents: read
  issues: read
  pull-requests: read

network: defaults

tools:
  github:
    toolsets: [default]

safe-outputs:
  create-issue:
    title-prefix: "[Contributor Winner] "
    labels: [report, contributors, winner]
---

# Ganador de Contribuidores - Noviembre 2025

Genera un reporte con todos los contribuidores del repositorio y determina al ganador: el contribuidor que más líneas de código agregó durante Noviembre de 2025.

## Proceso

1. Usa bash para ejecutar `git log --shortstat --no-merges --after="2025-10-31" --before="2025-12-01"` y recopilar estadísticas de inserción de líneas por autor exclusivamente para Noviembre de 2025.
2. Agrega los datos: suma las líneas añadidas por cada contribuidor usando `git log --format='%aN' --shortstat --no-merges --after="2025-10-31" --before="2025-12-01"`.
3. También recopila las estadísticas generales de todos los tiempos con `git log --shortstat --no-merges` para incluir a todos los contribuidores en la tabla.
4. Ordena la lista de mayor a menor número de líneas añadidas en Noviembre 2025.
5. Identifica al contribuidor con más líneas añadidas en Noviembre 2025 y asígnale el rol de **Ganador 🏆**.
6. Crea un issue de GitHub con los resultados.

## Formato del Issue

El issue debe incluir:

- Título claro que indique "Ganador de Contribuidores - Noviembre 2025"
- Tabla markdown con columnas: Posición | Contribuidor | Líneas Añadidas (Nov 2025) | Commits (Nov 2025) | Rol
- El contribuidor con más líneas añadidas debe tener el rol de **🏆 Ganador**
- Breve resumen del repositorio (nombre, total de commits analizados en Noviembre 2025)
- Mensaje de felicitación al ganador

## Ejemplo de tabla esperada

| Posición | Contribuidor | Líneas Añadidas (Nov 2025) | Commits (Nov 2025) | Rol |
|---|---|---|---|---|
| 1 | Alice | 5,320 | 42 | 🏆 Ganador |
| 2 | Bob | 2,100 | 18 | Contribuidor |
| 3 | Charlie | 800 | 10 | Contribuidor |

## Notas

- Analiza exclusivamente los commits de Noviembre de 2025 (del 1 al 30 de noviembre).
- Excluye commits de merge para evitar duplicados.
- Usa los nombres reales de los autores (no emails).
- Si un contribuidor no tiene líneas añadidas en Noviembre 2025, inclúyelo con 0 líneas y rol "Contribuidor".
- El ganador es quien tiene el mayor número de líneas añadidas en el periodo de Noviembre 2025.
