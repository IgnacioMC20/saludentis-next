# Progress

## 2026-04-28
- Creada rama `codex/fixes-paciente-cita-buscadores`.
- Revisadas instrucciones de `planning-with-files` y acuerdos de trabajo.
- Inspeccionados formularios, hooks, APIs y tablas relevantes.
- Hallados dos problemas base:
  - actualización de paciente acoplada a `nationalId`
  - odontograma siempre muestra tabs de adulto y niño
- Corregido flujo de paciente para editar por `_id`, hacer `nationalId` opcional y reflejar mejor valores persistidos al recargar.
- Corregida la inicialización del odontograma para incluir dientes de adulto y niño, con render condicional según edad.
- Agregado campo `annotations` en diagnósticos y guardado dentro de `Patient`.
- Integrado buscador reutilizable en tablas de pacientes, tratamientos y enfermedades.
- Ajustados los selects de tratamiento/enfermedad en nueva cita y cotización para mantener opciones y etiqueta visible.
- `npm run lint` ejecutado con éxito.
- Tests puntuales relanzados con `--watchman=false`; bloqueados por un problema preexistente de Jest (`TextEncoder is not defined` al cargar `jspdf`).
