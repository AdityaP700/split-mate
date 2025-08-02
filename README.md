#  SplitMate

**SplitMate** is a modern, blockchain-powered bill-splitting application that simplifies shared expenses through real-time group chat integration, AI-powered context awareness, and seamless crypto transactions — all built with a user-centric design.

---

##  Overview

SplitMate enables **equal splitting of bills** in a chat-based interface, with direct **crypto payments on Base blockchain**. Users connect via **Coinbase Wallet** and collaborate over **XMTP messaging**, while the system fetches real-time group data and intelligently manages the split.

> 🎯 Perfect for friends, roommates, or event attendees who want to simplify expense sharing in a transparent, secure, and futuristic way.

---

## ✨ Key Features

| Feature | Description |
|--------|-------------|
| **Group-aware Messaging** | Integrated with XMTP to fetch and display real-time participants in the chat. |
|  **Crypto Payments on Base** | Participants pay directly using Base L2 blockchain. |
|  **Coinbase Wallet Auth** | Fully secure wallet-based login & transaction handling. |
|  **AI Grant Analyzer** | Smart AI interprets the message context and proposes suggested grant amounts. |
|  **Equal Bill Splitting** | Automatically splits the total bill among all participants. |
|  **Live DB Sync** | Pulls and displays data directly from the live backend database. |
|  **QR Code Generation** | For unique claim cases, QR codes are generated for seamless scan-and-pay functionality. |
|  **Coming Soon: Custom Split** | Planned support for non-equal, user-defined splits. |
|  **Demo Portals** | Planned addition of public demo instances (landing page + interactive preview). |

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js** | Frontend, routing, SSR/CSR hybrid |
| **XMTP** | Decentralized chat/messaging |
| **Base Blockchain (L2)** | Crypto payment rail |
| **Coinbase Wallet SDK** | Authentication and payment |
| **Tailwind CSS** | UI styling and responsiveness |
| **Ethers.js** | Blockchain interaction layer |
| **TypeScript** | Type-safe development |

---

##  How It Works

1. **Connect your Wallet** – Login securely via Coinbase Wallet.
2. **Join Chat via XMTP** – App fetches participant details dynamically.
3. **Enter Amount** – The total bill is input manually or fetched automatically.
4. **AI Analysis (Optional)** – The system suggests splits based on chat context.
5. **Auto Split & Request** – The amount is evenly divided and requested.
6. **Instant Pay** – Each member pays their share directly using crypto.
7. **Confirmation** – Status and receipt are updated live in the group chat.

---

##  Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/splitmate.git
cd splitmate
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

Create a `.env.local` file in the root directory:

```env
NODE_ENV=development
NEXT_RUNTIME="nodejs"

NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_BASE_GOERLI_RPC_URL=https://goerli.base.org

NEXT_PUBLIC_XMTP_ENV=production
NEXT_PUBLIC_XMTP_API_KEY=your_xmtp_api_key

NEXT_PUBLIC_DEV_MODE=true
NEXT_DEV_HTTPS=true
NEXT_TELEMETRY_DISABLED=1
NEXT_DISABLE_SENTRY=true
```

### 4. Start the Development Server

```bash
npm run dev
```

---

## 📦 Demo Portal (Coming Soon)

We’re working on:

* A public-facing **landing page**
* Hosted **demo instance** for quick testing
* QR-based **claim preview** for public wallets

Stay tuned!

---

##  Example Use Case

> A group of 4 friends go out to dinner. One of them opens SplitMate, connects their wallet, and enters ₹4000. The app detects the group, splits it evenly (₹1000 each), and sends each member a request via the chat interface. Members pay in crypto via the Base chain — all within seconds.

---

##  Contributing

We welcome contributors to improve SplitMate!

### Steps to Contribute:

```bash
# 1. Fork the repo
# 2. Create a feature branch
git checkout -b feature/custom-split

# 3. Commit your changes
git commit -m "Add custom split logic"

# 4. Push to your branch
git push origin feature/custom-split

# 5. Open a Pull Request
```

Before opening a PR, please check for breaking changes and test your implementation.

---

## 👨‍💻 Contributors

| Name                                                               | Role                 | Description                                                                                              |
| ------------------------------------------------------------------ | -------------------- | -------------------------------------------------------------------------------------------------------- |
| [Aditya Pattanayak](https://www.linkedin.com/in/adityapattanayak/) | Full Stack Developer | Implemented XMTP Messaging, equal split logic, database interaction, and overall system integration.     |
| [Vidip Ghosh](https://www.linkedin.com/in/vidip-ghosh/)            | Full Stack Developer | Developed the frontend UI/UX and implemented Coinbase Wallet integration with seamless blockchain logic. |

---

## 📬 Connect With Us

Feel free to reach out or follow us for updates and support:

* **Aditya Pattanayak**
  [LinkedIn](https://www.linkedin.com/in/aditya-pattanayak-6b303b267/) | [X](https://x.com/AdityaPat_)

* **Vidip Ghosh**
  [LinkedIn](https://www.linkedin.com/in/ghoshvidip26/) | [X](https://x.com/ghoshvidip26)

---
## 📄 License

[MIT License](LICENSE)

---

> *Building the future of expense sharing — fast, secure, and intelligent.*

```

