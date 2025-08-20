# Reglas del Proyecto ChatHub (AGENTS.md)

Este archivo define las reglas arquitectónicas, de diseño y de desarrollo que **todos los agentes** deben seguir al interactuar con el código de este proyecto.

## 1. Arquitectura y Estructura: Feature-Based
El proyecto utiliza una arquitectura **Feature-Based** (orientada a características).
- Todo el código (componentes, hooks, estado, API, estilos) relacionado con una característica específica debe estar agrupado en su propio directorio dentro de `src/features/`.
- No agrupar por tipo de archivo (evitar directorios globales masivos como `src/components`, `src/hooks`, etc., a menos que sean compartidos/genéricos).

## 2. Principios de Diseño: SOLID
Es mandatorio aplicar los principios SOLID en todo el diseño de componentes y lógica:
- **S - Single Responsibility Principle (SRP):** Cada componente, hook o función debe tener una única responsabilidad. Si un componente maneja UI, no debe manejar lógica compleja de estado o peticiones de red.
- **O - Open/Closed Principle (OCP):** El código debe estar abierto para extensión pero cerrado para modificación (ej. usar `children` o props para extender componentes de UI sin modificarlos).
- **L - Liskov Substitution Principle (LSP):** Aplicable en TypeScript o patrones de herencia/interfaces si se usan.
- **I - Interface Segregation Principle (ISP):** Los componentes no deben recibir props que no necesitan. Mantener las interfaces pequeñas y enfocadas.
- **D - Dependency Inversion Principle (DIP):** Depender de abstracciones (ej. pasar la lógica de fetch por props o a través de hooks) en lugar de implementaciones concretas.

## 3. Patrones Clave en Feature-Based
Al desarrollar nuevas características o modificar existentes, se deben aplicar estrictamente los siguientes patrones:

### A. Lógica en Custom Hooks
- **Separación de responsabilidades:** La lógica de negocio y el manejo de estado no deben estar directamente dentro de los componentes de UI.
- Extraer toda la lógica compleja a **Custom Hooks** (ej. `useChat.ts`, `useAuth.ts`) para mantener los componentes limpios y enfocados únicamente en la presentación.

### B. Encapsulamiento vía `index.ts` (Barreling)
- Cada feature o módulo debe exportar su API pública a través de un archivo `index.ts` (o `index.js`/`index.jsx`).
- Los otros módulos de la aplicación **solo** pueden importar desde este `index.ts`, nunca acceder a archivos internos de la feature (ej. no importar `features/Auth/components/LoginForm`, importar de `features/Auth`).

### C. Separación del Cliente de API
- Las llamadas a la red y el fetching de datos deben estar encapsulados en un cliente de API dedicado o en servicios específicos dentro de cada feature.
- No hacer llamadas `fetch` o `axios` directamente dentro de los componentes.

## 3. Manejo de Estado (Recomendado)
El estado de la aplicación debe estar claramente dividido:
- **Estado de Servidor (Server State):** Utilizar herramientas como TanStack Query (React Query) o SWR para gestionar caché, fetching, sincronización y mutación de datos remotos.
- **Estado de Cliente (Client State):** Utilizar el estado local (`useState`, `useReducer`) o manejadores globales ligeros (Zustand, Context API) solo para estado puramente de la UI (modales abiertos, inputs, temas).

## 4. Estilos y UI
### Herramienta de Estilos
- Utilizar exclusivamente **Tailwind CSS** para la estilización.
- Evitar archivos `.css` tradicionales a menos que sea estrictamente necesario para animaciones complejas o configuraciones globales.

### Estilo Visual: Neo Brutalism
El diseño de la aplicación debe adherirse al **Neo Brutalismo**:
- **Colores:** Uso predominante de Blanco, Gris y Negro. Colores de acento muy saturados o primarios solo para destacar.
- **Bordes y Sombras:** Uso de bordes gruesos, duros y negros (`border-2 border-black` o superior). Sombras sólidas sin desenfoque (ej. `box-shadow: 4px 4px 0px black;` o las utilidades de Tailwind personalizadas para ello).
- **Tipografía:** Fuentes legibles y contundentes, a menudo sin remates (sans-serif), en alto contraste.
- **Formas:** Geometría rígida, tarjetas bien definidas, ausencia de degradados suaves o bordes demasiado redondeados (a menos que se combinen con bordes duros).
