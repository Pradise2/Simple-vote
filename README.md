# Decentralized Voting DApp

A decentralized voting application built with **Vite**, **React**, **TypeScript**, and **Wagmi** for secure, transparent, and immutable blockchain-based voting and proposal management.

## 🚀 Features

-   **Wallet Connectivity**: Simple and secure wallet connection using Wagmi and Reown.
-   **Proposal Dashboard**: View a list of all active and past voting proposals.
-   **Detailed Proposal View**: Inspect proposal details, descriptions, and real-time results.
-   **On-Chain Voting**: Cast votes directly on the blockchain, ensuring transparency and security.
-   **Admin-Only Area**: A secure panel for the contract owner to create new proposals.
-   **Responsive Design**: A clean, mobile-friendly interface built with Tailwind CSS.
-   **Type Safety**: Fully typed codebase with TypeScript for better developer experience.

## 🛠️ Tech Stack

### Frontend
-   **Vite**: High-performance build tool and development server.
-   **React 18**: A JavaScript library for building user interfaces.
-   **TypeScript**: Strongly typed programming language that builds on JavaScript.
-   **React Router**: For declarative routing in the application.
-   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
-   **Zustand**: Minimalistic state management.

### Blockchain Integration
-   **Wagmi**: React Hooks for Ethereum, simplifying wallet connection and contract interaction.
-   **Viem**: A lightweight, composable, and type-safe Ethereum library.
-   **Reown**: UI components and utilities for building Web3 apps.

### Smart Contracts
-   **Solidity**: The programming language for writing smart contracts.
-   **AccessControl**: A simple ownership model for administrative functions.

## 📋 Prerequisites

-   Node.js (v18 or higher)
-   Yarn or npm
-   A Web3 wallet like MetaMask

## 🔧 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <your-repo-url>
    cd pradise2-simple-vote
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    You need a WalletConnect Project ID to enable the WalletConnect modal.

    -   Go to [WalletConnect Cloud](https://cloud.walletconnect.com/) and create a project to get your ID.
    -   Create a new file named `.env` in the root of the project.
    -   Add your project ID to the `.env` file:
    ```env
    VITE_WALLETCONNECT_PROJECT_ID="YOUR_WALLETCONNECT_PROJECT_ID"
    ```

4.  **Start the development server**
    ```bash
    npm run dev
    ```
    The application will be running at `http://localhost:5173`.

## 📁 Project Structure
