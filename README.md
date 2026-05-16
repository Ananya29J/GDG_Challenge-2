# 🌌 FanVerse: The Ultimate IPL Fan Engagement Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r184-white?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-green?style=for-the-badge&logo=greensock)](https://greensock.com/gsap/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8-blue?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-black?style=for-the-badge&logo=socket.io)](https://socket.io/)

FanVerse is a high-fidelity, interactive IPL fan engagement platform designed to bring the stadium experience to your screen. Built with cutting-edge web technologies, it offers immersive 3D environments, real-time engagement, and gamified experiences for cricket enthusiasts.

## ✨ Key Features

### 🏟️ The Fan Arena
An immersive 3D environment built with **React Three Fiber** and **Three.js**. Fans can explore virtual spaces, interact with elements, and feel the energy of the IPL.

### 🕹️ Fan Arcade
A collection of high-performance mini-games optimized for engagement. From skill-based challenges to prediction games, the Arcade is where fans compete for glory.

### 📊 Real-Time Dashboard
Stay updated with live stats, match data, and personal progress. Integrated with **Socket.io** for real-time updates and **Prisma** for robust data management.

### 🏆 Fan League & Standings
Compete in global leaderboards and track your ranking against fans worldwide. The Fan League brings a competitive edge to the IPL experience.

### 🎨 Premium Design System
- **Onyx Premium**: A sleek, dark-themed UI/UX designed for a futuristic feel.
- **Glassmorphism**: Modern aesthetic with subtle blurs and gradients.
- **Micro-interactions**: Smooth animations powered by **GSAP** and **Framer Motion**.

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Animations**: GSAP, Framer Motion
- **Backend/DB**: Prisma ORM, PostgreSQL/MySQL
- **Real-time**: Socket.io
- **State Management**: Zustand

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm / yarn / pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ananya29J/GDG_Challenge-2.git
   cd GDG_Challenge-2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the magic.

## 📁 Project Structure

```text
src/
├── app/            # Next.js App Router (Pages & Routes)
├── components/     # Reusable UI components
│   ├── arena/      # 3D Arena components
│   ├── games/      # Arcade game components
│   ├── ui/         # Base UI elements
│   └── layout/     # Navigation & Shell
├── lib/            # Utilities, Hooks & Store
└── prisma/         # Database Schema & Client
```

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ for the **GDG Challenge**.
