---
description: |
  Este workflow genera un reporte diario de las nuevas alertas de seguridad
  del repositorio (Dependabot y code scanning). El resultado se publica como
  un issue en GitHub solo cuando existen alertas nuevas.

on:
  schedule: daily
  workflow_dispatch:

permissions:
  contents: read
  issues: read
  security-events: read

network: defaults

tools:
  github:
    toolsets: [context, repos, issues, code_security]

safe-outputs:
  create-issue:
    title-prefix: "[Security Alerts] "
    labels: [report, security]
---

# Reporte de Nuevas Alertas de Seguridad

Genera un reporte de las nuevas alertas de seguridad abiertas en el repositorio
y lo publica como un issue en GitHub.

## Qué incluir

- Nuevas alertas de Dependabot abiertas en las últimas 24 horas
- Nuevas alertas de code scanning abiertas en las últimas 24 horas
- Severidad de cada alerta (critical, high, medium, low)
- Paquete o archivo afectado con descripción breve del problema
- Enlace directo a la alerta en GitHub

## Proceso

1. Consulta las alertas de Dependabot abiertas recientemente
2. Consulta las alertas de code scanning abiertas recientemente
3. Filtra únicamente las alertas creadas en las últimas 24 horas
4. Si no hay alertas nuevas, usa `noop` indicando que no hay novedades
5. Si hay alertas nuevas, crea un issue con el reporte completo

## Formato del Issue

El issue debe incluir:

- Fecha y hora del reporte
- Resumen con el total de alertas nuevas por tipo y severidad
- Sección de alertas de Dependabot (si las hay)
- Sección de alertas de code scanning (si las hay)
- Tabla markdown con columnas: Severidad | Alerta | Paquete/Archivo | Enlace

## Notas

- Si no hay alertas nuevas en las últimas 24 horas, no crear issue (usar `noop`).
- Incluir únicamente alertas con estado `open`.
- Usar íconos de severidad: 🔴 Critical, 🟠 High, 🟡 Medium, 🔵 Low, ⚪ Unknown.
