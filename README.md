
# Connectly: AI-Powered LinkedIn Cold DM Automation

Automate personalized LinkedIn outreach at scale using browser automation and advanced AI agents.

---

##  Project Overview

Connectly is designed to automate the repetitive process of cold messaging HR professionals on LinkedIn. By combining robust browser automation (Playwright) with state-of-the-art AI agents (from [Shubham Saboo’s awesome-llm-apps repo](https://github.com/Shubhamsaboo/awesome-llm-apps)), we enable batch, context-aware, and human-like outreach—saving time and boosting your response rates.

---

##  Why This Approach?

- **Manual outreach is slow and unscalable.**
- Existing tools are either too generic or get flagged by LinkedIn.
- We want to combine the best of automation (for scale) and AI (for personalization).

**Our intuition:**  
Start with a powerful backend that handles all the heavy lifting (scraping, research, message generation, reply management). Once stable, layer a Chrome extension on top for instant, interactive UX.

---

##  Tech Stack

| Component      | Technology Used                              | Purpose                                 |
|----------------|----------------------------------------------|-----------------------------------------|
| Automation     | Playwright (Node.js/Python)                  | Automate LinkedIn login, navigation, scraping, and messaging |
| AI Agents      | LLM apps from Shubham’s repo (RAG, Lead Gen, Meeting Agent) | Summarize company info, generate personalized messages, classify replies |
| Backend        | Node.js, Express, BullMQ                     | Orchestrate scraping, queue jobs, API endpoints |
| Database       | Supabase / SQLite                            | Store leads, message history, statuses  |
| Extension (future) | Chrome Extension (Manifest V3, JS/TS)    | Human-in-the-loop validation, instant messaging UI |
| DevOps         | Docker, GitHub Actions                       | Easy deployment and CI/CD               |

---

##  Workflow

1. **Login & Profile Fetching**
   - Playwright automates LinkedIn login and navigates to HR profiles.
2. **Company Research**
   - Scrape company overview and profile details.
   - Use RAG/AI agents to summarize key points and tailor outreach.
3. **Personalized Message Generation**
   - AI agent crafts a short, context-aware DM referencing both the company and your background.
4. **Batch Messaging**
   - Backend queues up multiple targets and sends messages with human-like delays.
5. **Reply Handling**
   - AI agent classifies replies (interested, not interested, follow-up needed) and suggests responses.
6. **(Planned) Extension Layer**
   - Chrome extension for instant, on-page message generation and sending.

---

##  Repo Structure

```
/Connectly
├── backend/          # Playwright scripts, AI agent integration, API
├── extension/        # (Planned) Chrome extension UI
├── docs/             # Workflow diagrams, setup guides
└── README.md
```

---

## Key Features

- Batch scraping and messaging for LinkedIn
- AI-powered, personalized message generation (not just templates!)
- Company research and summary using Retrieval Augmented Generation (RAG)
- Smart reply classification and suggested follow-ups
- Modular: backend-first, with extension planned for seamless UX

---

##  Roadmap

- [x] Backend MVP: scraping, AI message gen, batch send
- [ ] Reply classification and analytics
- [ ] Chrome extension for instant messaging
- [ ] Multi-channel support (Twitter, Email)
- [ ] Crypto-native messaging (XMTP, Base)

---

##  Ethical Automation

- Randomized delays and human-like actions to reduce detection risk
- Daily send limits and opt-in data handling
- No credential storage; session cookies only

---

##  Credits

- [Playwright](https://playwright.dev/) for robust browser automation
- [Awesome LLM Apps by Shubham Saboo](https://github.com/Shubhamsaboo/awesome-llm-apps) for modular AI agent inspiration and code
- Community tutorials and open-source best practices

---

> This project is for educational purposes. Always comply with LinkedIn's terms of service.

