---
description: |
  Este workflow muestra los contribuidores del repositorio y cuántas líneas de código
  ha agregado cada uno. Genera un reporte semanal como un issue en GitHub.

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
    title-prefix: "[Contributor Stats] "
    labels: [report, contributors]
---

# Estadísticas de Contribuidores

Genera un reporte con los contribuidores del repositorio y cuántas líneas de código ha agregado cada uno.

## Proceso

1. Usa bash para ejecutar `git log --shortstat --no-merges` y recopilar estadísticas de inserción de líneas por autor.
2. Agrega los datos: suma las líneas añadidas por cada contribuidor usando `git log --format='%aN' --shortstat`.
3. Ordena la lista de mayor a menor número de líneas añadidas.
4. Crea un issue de GitHub con los resultados.

## Formato del Issue

El issue debe incluir:

- Título claro que indique la fecha del reporte
- Tabla markdown con columnas: Contribuidor | Líneas Añadidas | Commits
- Breve resumen del repositorio (nombre, total de commits analizados)
- Mensaje de agradecimiento a los contribuidores

## Ejemplo de tabla esperada

| Contribuidor | Líneas Añadidas | Commits |
|---|---|---|
| Alice | 5,320 | 42 |
| Bob | 2,100 | 18 |

## Notas

- Analiza todo el historial del repositorio (sin límite de fecha).
- Excluye commits de merge para evitar duplicados.
- Usa los nombres reales de los autores (no emails).
