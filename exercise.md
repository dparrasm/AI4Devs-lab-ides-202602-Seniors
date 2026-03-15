# Ejercicio: Añadir Candidato al Sistema ATS

Resumen de lo realizado para implementar la funcionalidad "Añadir Candidato" en el LTI Talent Tracking System.

---

## 1. Enfoque y contexto

- **Ticket original:** Historia de usuario como reclutador para añadir candidatos al ATS (formulario, validación, carga de CV, confirmación, manejo de errores).
- **Metodología:** Se aplicó el meta-prompt del proyecto (`.cursor/commands/meta-prompt.md`) para convertir el ticket en un **prompt mejorado**: capas afectadas (frontend, backend, base de datos), reglas del repo a revisar, restricciones técnicas y criterios de aceptación explícitos.
- **Reglas del proyecto:** Antes de implementar se tuvieron en cuenta las reglas en `.cursor/rules/` (frontend, backend, database, git) para mantener coherencia con el stack existente (React/CRA, Express, Prisma) y el flujo de trabajo Git.

---

## 2. Desglose en tareas

1. **Base de datos:** Modelo `Candidate` en Prisma y migración.
2. **Backend:** Endpoint `POST /candidates` con validación y subida de CV (PDF/DOCX).
3. **Frontend:** Tipos, servicio API y formulario de alta de candidato con validación.
4. **UI:** Punto de entrada en el dashboard del reclutador (botón "Add candidate") e integración del flujo.
5. **Tests:** Tests backend del API de candidatos y ajuste del test del app frontend.
6. **Commits y push:** Commits atómicos por ámbito y subida al repositorio.

---

## 3. Solución implementada (resumen)

| Ámbito | Qué se hizo |
|--------|-------------|
| **DB** | Modelo `Candidate` (firstName, lastName, email, phone, address, education, workExperience, cvPath, timestamps). Migración en `backend/prisma/migrations/`. |
| **Backend** | Separación app/servidor (`app.ts` / `index.ts`). Ruta `POST /candidates` con multipart, validación de campos y email, subida de CV (PDF/DOCX, máx. 5MB), respuestas JSON 201/400/409/500. |
| **Frontend** | Tipos e `candidatesApi.ts` en `src/types` y `src/services`. Formulario con validación, subida de CV opcional y mensajes de éxito/error. Dashboard con botón "Add candidate" que muestra el formulario. |
| **Tests** | Tests de validación y de creación en `backend/src/tests/candidates.test.ts`. Test del dashboard en frontend. |

---

## 4. Estrategia Git

- Rama: `feature/add-candidate`.
- Commits atómicos con mensajes en inglés:
  - `feat(db): add Candidate model and migration`
  - `feat(backend): add POST /candidates endpoint with validation and file upload`
  - `feat(frontend): add candidate types and API service`
  - `feat(frontend): add candidate form and recruiter dashboard`
  - `test(backend): add candidates API tests and fix app test`
  - `docs: add Cursor prompt system (meta-prompt and project rules)`
- Repositorio remoto: `https://github.com/dparrasm/AI4Devs-lab-ides-202602-Seniors.git` (rama `feature/add-candidate` actualizada).

---

## 5. Sistema de prompts (Cursor)

Incluido en el repo para reutilización y coherencia en futuros tickets:

- **`.cursor/commands/meta-prompt.md`:** Transforma el texto del usuario en un prompt mejorado (capas, reglas, restricciones).
- **`.cursor/rules/`:** Convenciones por capa (frontend, backend, database, git) para que el agente siga el stack y el flujo del proyecto.

---

## 6. Cómo probar

1. **Backend:** `cd backend && npm install && npx prisma generate` (y migrar si la DB está levantada). `npm run dev` — API en `http://localhost:3010`.
2. **Frontend:** `cd frontend && npm install && npm start` — app en `http://localhost:3000`.
3. **Flujo:** Entrar al dashboard → "Add candidate" → rellenar formulario (nombre, apellido, email obligatorios; CV opcional PDF/DOCX) → enviar → mensaje de confirmación o de error.

Tests: `npm test` en `backend` y en `frontend`.
