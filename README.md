# AI Prompt Optimizer

[![MIT License](https://img.shields.io/github/license/Kedhareswer/platform-prompt-alchemy-lab?color=brightgreen)](LICENSE)
[![Stars](https://img.shields.io/github/stars/Kedhareswer/platform-prompt-alchemy-lab?style=social)](https://github.com/Kedhareswer/platform-prompt-alchemy-lab/stargazers)
[![Issues](https://img.shields.io/github/issues/Kedhareswer/platform-prompt-alchemy-lab)](https://github.com/Kedhareswer/platform-prompt-alchemy-lab/issues)
[![Last Commit](https://img.shields.io/github/last-commit/Kedhareswer/platform-prompt-alchemy-lab)](https://github.com/Kedhareswer/platform-prompt-alchemy-lab/commits/main)
[![TypeScript](https://img.shields.io/badge/TypeScript-96.3%25-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-UI-blue?logo=react)](https://reactjs.org/)

> **⭐️ If you like this project, please consider [starring the repository](https://github.com/Kedhareswer/platform-prompt-alchemy-lab/stargazers) to support development! ⭐️**

---

This project is a web application designed to help users optimize their AI prompts. It leverages various prompt engineering techniques to enhance clarity, efficiency, and effectiveness of prompts for different AI models.

## Features

- **Comprehensive Prompt Analysis:** Understands prompt intent, complexity, and domain.
- **Platform & Model Selection:** Supports various AI platforms (e.g., GPT-4o, Claude) and models.
- **Domain Specialization:** Tailor prompts for specific domains like technology, creative writing, or business.
- **Provider Flexibility:** Choose between different API providers (e.g., Groq).
- **Secure API Key Management:** Store and use your API keys securely.
- **Advanced Optimization Techniques:** Apply a suite of techniques including:
    - Chain of Thought
    - Few-Shot Learning
    - ReAct (Reasoning and Acting)
    - Persona Injection
    - Role-Playing Scenarios
    - Constraint Integration
    - Token Optimization
    - Tree of Thoughts
    - Self-Consistency
- **Optimization Results:** View the original prompt alongside the optimized version.
- **Performance Metrics:** Includes token count comparison (original vs. optimized) and an estimated improvement score.
- **User-Friendly Interface:** Built with React, shadcn-ui, and Tailwind CSS for a modern and responsive experience.

## How It Works

This application streamlines the AI prompt optimization process through the following workflow:

1.  **Input:** The user provides their initial prompt, selects the target AI platform, relevant domain, and preferred API provider. API keys can also be managed within the app.
2.  **Analysis & Configuration:** The system analyzes the input prompt for intent, complexity, and domain. The user can then configure advanced optimization options based on this analysis or their preferences.
3.  **Optimization:** Core logic in `src/utils/promptEngineering.ts` and `src/utils/promptOptimizer.ts` applies selected techniques (like Chain of Thought, Persona Injection, etc.) to the prompt.
4.  **Results:** The application displays the original prompt alongside the newly optimized version, including a comparison of token counts and an estimated improvement score.

This process helps in crafting more effective and efficient prompts tailored to specific needs.

## 🚀 Getting Started

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/Kedhareswer/platform-prompt-alchemy-lab.git

# Step 2: Navigate to the project directory.
cd platform-prompt-alchemy-lab

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## 🛠️ Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- TanStack Query (for data fetching and server state management)

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or want to add new features, please follow these steps:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix (e.g., `git checkout -b feature/awesome-prompt-technique` or `git checkout -b fix/input-validation`).
3.  **Make your changes** and commit them with clear messages.
4.  **Push your changes** to your fork.
5.  **Submit a pull request** to the main repository for review.

Please ensure your code adheres to the existing style and that any new features are well-documented.

## 📄 License

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

This project is licensed under the [MIT License](LICENSE).

---

> **⭐️ Don’t forget to [star the repo](https://github.com/Kedhareswer/platform-prompt-alchemy-lab/stargazers) if you find it useful!**
