# CareerTwin AI
> **Simulate Your Future. Build Your Career.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript-61DAFB.svg?logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com)
[![UN SDG 4](https://img.shields.io/badge/UN%20SDG-4%20Quality%20Education-C5192D.svg)](https://sdgs.un.org/goals/goal4)
[![UN SDG 8](https://img.shields.io/badge/UN%20SDG-8%20Decent%20Work-A21942.svg)](https://sdgs.un.org/goals/goal8)

---

## 🌟 Executive Summary

**CareerTwin AI** is an advanced Agentic AI-powered digital career twin and career simulation platform designed for engineering students, fresh graduates, and career changers. Traditional career platforms provide generic, static job listings or static curriculum roadmaps. They never answer the critical question: *"What happens if I pivot my learning decisions today?"*

CareerTwin AI models each individual as an evolving **Digital Career Twin** (technical proficiencies on a 0–5 scale, soft skills, completed projects, and career goals). Using a **transparent, deterministic career simulation engine** paired with a **tool-calling Python AI agent**, users can simulate alternative career trajectories, compare learning scenarios side-by-side, uncover high-priority competency gaps, and execute adaptive week-by-week roadmaps.

---

## 🎯 United Nations SDG Alignment
- **SDG 4 (Quality Education - Target 4.4):** Substantially increase the number of youth and adults who have relevant skills, including technical and vocational skills, for employment and decent jobs.
- **SDG 8 (Decent Work & Economic Growth - Target 8.6):** Substantially reduce the proportion of youth not in employment, education, or training through data-driven career guidance.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    User["Student / Job Seeker"] -->|Web UI| Frontend["React 18 + Vite + Tailwind + Recharts"]
    Frontend -->|REST API / JWT| Backend["FastAPI Core Engine"]
    
    subgraph "Backend Engine"
        API["FastAPI Endpoints"]
        SimEngine["Deterministic Simulation Engine"]
        AgentOrch["Agent Orchestrator"]
        Tools["8 Agentic Tools"]
        DBLayer["Unified DB Layer (MongoDB Atlas / Resilient In-Memory Store)"]
    end

    API --> SimEngine
    API --> AgentOrch
    AgentOrch --> Tools
    Tools --> SimEngine
    API --> DBLayer

    subgraph "AI Layer"
        Provider["LLM Provider Abstraction"]
        Gemini["Google Gemini API"]
        OpenAI["OpenAI API"]
        RuleEngine["Intelligent Deterministic Fallback"]
    end

    AgentOrch --> Provider
    Provider --> Gemini
    Provider --> OpenAI
    Provider --> RuleEngine
```

---

## 🧠 The 8 Agentic AI Tools

The AI assistant is not a generic conversational chatbot. It is a Python tool-calling agent with 8 specialized tools:

1. `analyze_user_profile()`: Deeply inspects the digital career twin, education, strengths, and multi-track career compatibility.
2. `calculate_skill_gaps()`: Evaluates current vs target proficiencies, assigning High, Medium, or Low priorities.
3. `calculate_career_readiness()`: Computes the exact weighted readiness score (0–100%) using transparent importance weights.
4. `simulate_career_path()`: Runs hypothetical What-If learning experiments and projects readiness uplifts.
5. `compare_career_scenarios()`: Evaluates alternative learning decisions side-by-side (e.g. AI vs Cybersecurity).
6. `generate_learning_roadmap()`: Constructs an adaptive, week-by-week milestone schedule targeting skill gaps.
7. `update_digital_twin()`: Updates verified proficiencies only when supported by verifiable milestone proof.
8. `recommend_projects()`: Recommends high-impact capstone portfolio projects targeting missing competencies.

---

## 📐 Deterministic Simulation Engine Formula

To maintain strict scientific and ethical integrity, CareerTwin AI avoids opaque black-box predictions. Career readiness is calculated deterministically:

$$\text{Readiness Score} = \frac{\sum (\text{User Skill Proficiency} \times \text{Skill Importance})}{\sum (\text{Required Skill Importance})} \times 20$$

- **Proficiency Scale:** $0.0$ to $5.0$
- **Skill Importance:** $1$ (Foundational) to $5$ (Critical Core)
- **Output:** Normalized $0\%$ to $100\%$ scale

---

## 🚀 Supported Industry Career Tracks

1. **AI/ML Engineer** (High Growth, +38% demand)
2. **Cybersecurity Engineer** (Critical Demand, +32% demand)
3. **Data Scientist** (High Demand, +35% demand)
4. **Software Developer** (Stable High, +25% demand)
5. **Cloud Engineer** (High Demand, +30% demand)
6. **Data Engineer** (High Demand, +31% demand)

---

## 🔄 Platform Workflow & Core Capabilities

- **1. Account Creation & Onboarding:** Secure user registration with email and password. A 4-step wizard calibrates your education, initial skill ratings, and primary career goal.
- **2. Live Digital Twin Dashboard:** View calculated readiness across all 6 tracks, multi-axis competency radar overlays, and prioritized skill gaps.
- **3. Career Explorer & Benchmarking:** Benchmark your twin against industry role expectations and run side-by-side career comparisons.
- **4. Diagnostic Gap Analysis:** Uncover priority bottlenecks (e.g., gap ≥ 2.0 with critical weighting) and suggested remediation actions.
- **5. What-If Simulation Lab:** Add hypothetical learning actions (e.g., +2.0 Machine Learning, +2.0 SQL) and compute exact readiness score changes and estimated learning hours.
- **6. Scenario Comparison:** Compare alternative learning decisions side-by-side (e.g., Systems vs AI Specialization) before dedicating hours.
- **7. Agentic AI Career Mentor:** Conversational advisor grounded in your live twin metrics, capable of invoking Python tools dynamically.
- **8. Adaptive Learning Roadmap:** Generate structured 4, 8, or 12-week milestones with verified micro-tasks.
- **9. Verifiable Twin Evolution:** Submit proof of task completion to boost competency ratings and record timestamped audit entries.

---

## 🛠️ Quick Start & Installation

### Option 1: Run Locally

#### Backend
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
Backend API docs available at: `http://localhost:8000/docs`

#### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend accessible at: `http://localhost:5173`

---

### Option 2: Docker Compose

```bash
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`

---

## 🧪 Testing

Run backend test suite:
```bash
cd backend
python -m pytest tests -v
```
Integration verification script:
```bash
cd backend
python -u run_tests.py
```
Frontend TypeScript check:
```bash
cd frontend
npm run build
```

---

## 🔒 Security & Reliability
- Zero hardcoded secrets in client-side code
- PBKDF2-HMAC-SHA256 password hashing
- Signed JWT Bearer token authentication
- Resilient In-Memory database store fallback when MongoDB Atlas is offline
- Pydantic v2 input validation on all API endpoints
- CORS whitelist protection
