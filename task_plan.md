# Task Plan

## Goal
Corregir los bugs reportados en datos personales, odontograma, diagnósticos, buscadores y nueva cita, manteniendo cambios acotados y consistentes con la arquitectura actual.

## Phases
- [completed] Investigar flujo actual y documentar archivos impactados.
- [completed] Corregir persistencia y recarga de datos personales, incluyendo `nationalId` opcional.
- [completed] Ajustar reglas de render del odontograma según edad del paciente.
- [completed] Agregar campo `anotaciones` en diagnósticos y persistirlo.
- [completed] Integrar buscador reutilizable en pacientes, tratamientos y enfermedades.
- [completed] Corregir dropdowns de tratamiento/enfermedad en nueva cita.
- [completed] Validar con lint y pruebas puntuales, y resumir limitaciones.

## Impacted Files
- `src/components/PatientComponents/PacientInfo.tsx`
- `src/components/PatientComponents/Diagnostic.tsx`
- `src/components/PatientComponents/Odontogram.tsx`
- `src/components/Odontogram/App.tsx`
- `src/components/ui/Table.tsx`
- `src/components/ModalComponents/NewConsultationForm.tsx`
- `src/hooks/usePatient.ts`
- `src/interfaces/patient.ts`
- `src/models/Patient.ts`
- `src/pages/api/patient/index.ts`
- `src/pages/pacientes.tsx`
- `src/pages/tratamientos/index.tsx`
- `src/pages/enfermedades/index.tsx`

## Validation
- `npm run lint`
- `npm test -- --runInBand --watchman=false src/__tests__/PatientComponents/PacientInfo.test.tsx src/__tests__/PatientComponents/Diagnostic.test.tsx src/__tests__/PatientComponents/Diet.test.tsx`

## Risks
- El backend actual de pacientes actualiza por `nationalId`; volverlo opcional requiere mover las actualizaciones a `_id`.
- El odontograma no tiene lógica explícita de mayoría/minoría de edad, así que la decisión debe salir de `birthDate`.

## Validation Notes
- `npm run lint` pasa.
- Los tests puntuales de componentes no ejecutan por un problema existente del entorno de Jest: `TextEncoder is not defined` al importar `jspdf` desde `src/utils/generateQuotationPDF.ts`.
