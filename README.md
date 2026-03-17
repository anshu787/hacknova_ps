# HACKNOVA Hackathon — CyberGuard
## AI-Assisted Cybersecurity Hub

CyberGuard is a next-generation, AI-driven cybersecurity platform designed to automate vulnerability assessment, threat intelligence, and attack surface management. Built for the **HACKNOVA Hackathon**, it combines industry-standard security tools with advanced Large Language Models (LLMs) to provide a "graph-first" view of organizational security.

---

## 🚀 Key Features

### 1. 📊 Centralized Security Dashboard
A high-level command center providing a real-time snapshot of the organization's security posture, tracking active scans, critical vulnerabilities, and global threat levels.
> ![Dashboard Screenshot](<img width="1600" height="839" alt="image" src="https://github.com/user-attachments/assets/e4d7311f-c095-40ec-8d58-f281cd7a9178" />

)

### 2. 🧠 LLM Scanner (AI-Security)
Securing the intelligence itself. Uses Garak and specialized probes to test Large Language Models for jailbreaks, prompt injections, and data leakage.
> ![LLM Scanner Screenshot](<img width="1600" height="830" alt="image" src="https://github.com/user-attachments/assets/26e73441-2241-4b3d-bf0e-eba708117e07" />

)

### 3. 🌎 Global Threat Intelligence
Continuous monitoring of NVD, MITRE, and Rapid7 feeds. Automatically correlates global CVE data with your specific assets to provide actionable alerts.
> ![Global Threat Intelligence Screenshot](<img width="1600" height="835" alt="image" src="https://github.com/user-attachments/assets/45bf7ce5-3780-4295-826f-4f829098f28d" />

)

### 4. 🌍 Attack Surface Management (Recon)
Deep reconnaissance mapping of subdomains, open ports, and running services. Provides a "hacker’s eye view" of the entire infrastructure.
> ![Attack Surface Management Screenshot](<img width="1600" height="826" alt="image" src="https://github.com/user-attachments/assets/75e3806e-6a31-4ddc-b412-9bf78f50b6b0" />

### 5. 🕵️‍♂️ Credential Leak Monitoring
Proactive monitoring of dark web and public data dumps to identify exposed corporate credentials before they are exploited.
> ![Crednetial Leak Monitoring Screenshot](<img width="1600" height="835" alt="image" src="https://github.com/user-attachments/assets/8f1832fb-fdbb-41aa-9a57-fbc1c8f9b2f2" />

)
### 6. 📱 Mobile Security Analysis
Deep static and dynamic analysis (SAST/DAST) of APK/IPA files using MobSF integration, looking for hardcoded secrets and insecure coding patterns.
> ![Mobile Security Analysis Screenshot](<img width="1600" height="837" alt="image" src="https://github.com/user-attachments/assets/385ddaef-2352-4cb0-9396-76926c2d8eb7" />

)
### 7. 🕸️ Attack Graph Visualization
Goes beyond flat lists. Visualizes potential attack paths from an external attacker to your most sensitive assets, helping prioritize remediation where it matters most.
> ![Attack Graph Screenshot](<img width="1600" height="835" alt="image" src="https://github.com/user-attachments/assets/03c7411c-95f3-45df-9a08-e2450d156e0e" />


### 8. 💬 AI Chat & RAG Assistant
A context-aware security expert assistant powered by Retrieval-Augmented Generation (RAG). It has access to your specific report data and technical documentation to provide step-by-step remediation guidance.
> ![Attack Graph Screenshot](<img width="1600" height="830" alt="image" src="https://github.com/user-attachments/assets/e4b2aa3c-e5af-459f-9687-94fa1fd1912f" />

)
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
        Network[Nmap Scanner]
        Mobile[MobSF Analyzer]
        GARAK[Garak LLM Probe]
        Web[Webs DAST]
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
