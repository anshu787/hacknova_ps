# HACKNOVA Hackathon — CyberGuard
## AI-Assisted Cybersecurity Hub

The AI-Powered Vulnerability Scanner is an intelligent cybersecurity platform designed to detect, analyze, and prioritize security vulnerabilities across web applications, APIs, mobile apps, and network systems. The system integrates multiple scanning tools such as Nmap, Nikto, and OpenVAS, along with a custom-built scanner, to provide comprehensive vulnerability detection across different layers of a system.

What sets this platform apart is its AI-driven analysis layer powered by LangChain and large language models. Instead of generating complex technical reports, the system interprets scan results, explains vulnerabilities in simple terms, prioritizes risks, and provides actionable remediation suggestions through an interactive dashboard and chatbot interface.

Additionally, the platform integrates threat intelligence sources such as the National Vulnerability Database and MITRE ATT&CK to enrich vulnerabilities with real-world context and attack patterns. By combining automated scanning, AI-powered insights, and user-friendly visualization, the system helps developers and organizations improve their security posture efficiently and proactively.

---

## 🚀 Key Features

### 1. 📊 Centralized Security Dashboard
A high-level command center providing a real-time snapshot of the organization's security posture, tracking active scans, critical vulnerabilities, and global threat levels.
> ![Dashboard Screenshot](https://via.placeholder.com/800x400?text=CyberGuard+Dashboard+Preview)

### 2. 🧠 LLM Scanner (AI-Security)
Securing the intelligence itself. Uses Garak and specialized probes to test Large Language Models for jailbreaks, prompt injections, and data leakage.
> ![LLM Scanner Screenshot](https://via.placeholder.com/800x400?text=LLM+Scanner+Preview)

### 3. 🌎 Global Threat Intelligence
Continuous monitoring of NVD, MITRE, and Rapid7 feeds. Automatically correlates global CVE data with your specific assets to provide actionable alerts.

### 4. 🌍 Attack Surface Management (Recon)
Deep reconnaissance mapping of subdomains, open ports, and running services. Provides a "hacker’s eye view" of the entire infrastructure.

### 5. 🕵️‍♂️ Credential Leak Monitoring
Proactive monitoring of dark web and public data dumps to identify exposed corporate credentials before they are exploited.

### 6. 📱 Mobile Security Analysis
Deep static and dynamic analysis (SAST/DAST) of APK/IPA files using MobSF integration, looking for hardcoded secrets and insecure coding patterns.

### 7. 🕸️ Attack Graph Visualization
Goes beyond flat lists. Visualizes potential attack paths from an external attacker to your most sensitive assets, helping prioritize remediation where it matters most.
> ![Attack Graph Screenshot](https://via.placeholder.com/800x400?text=Attack+Graph+Visualization)

### 8. 💬 AI Chat & RAG Assistant
A context-aware security expert assistant powered by Retrieval-Augmented Generation (RAG). It has access to your specific report data and technical documentation to provide step-by-step remediation guidance.

---

## 🛠 Tech Stack

### Frontend
- **React (Vite)**: High-performance modern web framework.
- **Vanilla CSS**: Premium "Glassmorphism" UI design for a professional, dark-themed experience.
- **D3.js**: Interactive force-directed graphs for attack path visualization.
- **React Router**: Seamless client-side navigation.

### Backend
- **FastAPI**: High-performance, asynchronous Python web framework.
- **Motor / MongoDB**: Flexible, async document storage for scan results and user data.
- **Celery / Redis**: Distributed task queue for long-running security scans (Nmap, MobSF, etc.).
- **Neo4j**: Graph database for storing and querying complex attack relationships.

### AI Engine
- **Ollama / OpenAI**: Inference engines for Large Language Models.
- **ChromaDB**: Vector database for RAG (Retrieval-Augmented Generation).
- **Sentence-Transformers**: Text embeddings for matching threats to documentation.

---

## 🏗 System Architecture

```mermaid
graph TD
    subgraph Client
        UI[React Frontend]
        D3[D3.js Visualization]
    end

    subgraph API_Gateway
        APP[FastAPI Server]
        WSS[WebSocket Manager]
    end

    subgraph Data_Layer
        DB[(MongoDB)]
        GDB[(Neo4j)]
        VDB[(ChromaDB)]
    end

    subgraph Task_Processing
        REDIS[Redis Broker]
        CELERY[Celery Workers]
    end

    subgraph Security_Tools
        NMAP[Nmap Scanner]
        MOBSF[MobSF Analyzer]
        GARAK[Garak LLM Probe]
        ACUNETIX[Acunetix DAST]
    end

    subgraph AI_Core
        LLM[Ollama / OpenAI]
        EMB[Embedding Engine]
    end

    UI <--> APP
    APP <--> DB
    APP <--> GDB
    APP <--> REDIS
    REDIS <--> CELERY
    CELERY <--> NMAP
    CELERY <--> MOBSF
    APP <--> VDB
    VDB <--> EMB
    EMB <--> LLM
    APP <--> WSS
```

---

## 🔧 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/anshu787/hacknova_ps.git
   cd hacknova_ps
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Environment Variables**:
   Copy `.env.example` to `.env` and configure your MongoDB, Redis, and LLM endpoints.

---

## 🏆 HACKNOVA Hackathon Submission
Created with ❤️ for the HACKNOVA Hackathon. CyberGuard represents the future of AI-driven cybersecurity orchestration.
