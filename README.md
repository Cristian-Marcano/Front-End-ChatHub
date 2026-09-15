# ChatHub Frontend 💬

ChatHub is a robust, real-time messaging platform originally developed as an academic project for **Artificial Intelligence** and **Software Development II** at Universidad Gran Mariscal de Ayacucho. It has since evolved into a complete, portfolio-ready application.

This repository contains the **Frontend** of ChatHub. It provides a clean, highly responsive user interface with real-time chat capabilities, dynamic avatar generation, and integrated GIF sharing.

## 🌟 Key Features

* **Real-time Messaging:** Lightning-fast message delivery using `Socket.io-client` with instant UI updates.
* **Modern UI/UX:** Responsive, mobile-first design powered by `Tailwind CSS v4`.
* **Dynamic Avatars:** Automatically generates unique, stylish avatars for users and groups using `Dicebear`.
* **GIF Integration:** First-class support for searching and sending GIFs via the `@giphy/react-components` API.
* **Robust Form Handling:** Secure and reliable forms with `react-hook-form` and strict `Zod` validation schemas.
* **Component-driven Architecture:** Highly modular and scalable React folder structure (Feature-Sliced Design principles).

## 🛠️ Tech Stack

* **Framework:** React 19
* **Build Tool:** Vite
* **Styling:** Tailwind CSS v4
* **Real-time Engine:** Socket.io-client
* **Routing:** React Router Dom
* **Icons:** Lucide React
* **Forms & Validation:** React Hook Form + Zod
* **Testing:** Playwright (End-to-End)

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* npm or pnpm
* A running instance of the **ChatHub Backend**

### Installation

1. Clone the repository and navigate to the directory:
   ```bash
   git clone <repo-url>
   cd Front-End-ChatHub
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and configure the following variables to point to your backend:
   ```env
   VITE_API_URL=http://localhost:3001
   VITE_GIPHY_API_KEY=your_giphy_api_key
   ```

4. Run the Development Server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
   The application will be available at `http://localhost:5173`.

## 🧪 Testing

This project uses **Playwright** for End-to-End (E2E) testing.

```bash
# Run tests in UI mode
npx playwright test --ui

# Run tests in headless mode
npx playwright test
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
