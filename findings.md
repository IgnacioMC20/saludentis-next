# Findings

## Paciente
- El formulario de `PacientInfo` usa `reset(patientData)` con radios MUI simples para `gender` y `maritalStatus`; esto puede dejar desincronizado el valor visual tras recarga.
- `src/pages/api/patient/index.ts` actualiza pacientes con `findOneAndUpdate({ nationalId })`. Eso impide soportar `nationalId` opcional y hace frágil la edición.
- `src/models/Patient.ts` define `nationalId` como `required: true, unique: true`.
- `useUpdatePatient` invalida `['patient', patientId]`, pero el `PUT` no recibe explícitamente `_id`.

## Odontograma
- `src/components/Odontogram/App.tsx` siempre renderiza tabs de `Adulto` y `Niño`.
- La separación de dientes ya existe: adulto `<= 32`, niño `> 32`.
- Falta condicionar la visibilidad del odontograma de niño según la edad del paciente.

## Diagnósticos
- `src/components/PatientComponents/Diagnostic.tsx` solo persiste `diagnosis` y `medications`.
- No existe campo de paciente para `annotations`; el modelo `Annotation` existe, pero no está integrado al flujo actual.

## Buscadores
- Hay dos tablas distintas:
  - `src/components/PatientComponents/Table.tsx` para pacientes.
  - `src/components/ui/Table.tsx` para tratamientos/enfermedades.
- Ninguna tiene filtro de búsqueda.

## Nueva cita
- `src/components/ModalComponents/NewConsultationForm.tsx` pinta listas completas de tratamientos y enfermedades, sin sincronización ni ayuda contextual.
- No existe relación de datos entre `Treatment` y `Disease` en interfaces o modelos actuales, así que el fix debe enfocarse en preservar visualización/selección estable en ambos dropdowns, no en filtrado relacional inexistente.

## Implementado
- El flujo de actualización de paciente quedó desacoplado de `nationalId` y ahora usa `_id`.
- `nationalId` ahora es opcional en formulario, API y esquema, manteniendo unicidad cuando se envía un valor.
- Los radios de sexo y estado civil pasaron a `Controller`, y las fechas del paciente se normalizan al formato del input para que se vean al recargar.
- El odontograma ahora completa dientes faltantes de niño de forma perezosa para registros existentes.
- Se agregó `annotations` al tab de diagnósticos dentro del mismo documento `Patient`.
- Se creó `src/components/ui/TableSearch.tsx` y se integró en las tablas de pacientes, tratamientos y enfermedades.
- Los selects de nueva cita y cotización ahora conservan correctamente el valor mostrado y sus opciones sin depender del orden de selección.
