# 🚀 SplitMate

**SplitMate** is an AI-powered bill-splitting agent that seamlessly calculates and facilitates equal expense sharing in group chats — complete with instant **crypto payments** via the **Base blockchain**. Integrated with **XMTP messaging**, **Coinbase Wallet**, and built on **Next.js**, SplitMate automates the end-to-end process of fair payment distribution.

---

## ✨ Features

- 🤖 **AI Agent** for automatic split calculations
- 👥 Group chat-aware context using **XMTP**
- ⚡ Instant crypto payments on **Base Blockchain**
- 🔐 Secure authentication via **Coinbase Wallet**
- 🧮 Equally divides shared expenses
- 💬 Friendly UI for message-based interaction
- 🌐 Fully client-side rendered with **Next.js**

---

## 🛠 Tech Stack

| Tech/Tool         | Usage                         |
|------------------|-------------------------------|
| **Next.js**       | Frontend & Routing            |
| **XMTP**          | Messaging & Group Context     |
| **Base Blockchain** | Transaction layer (L2)     |
| **Coinbase Wallet** | Wallet connection (onchain) |
| **Ethers.js**     | Blockchain interactions       |
| **Tailwind CSS**  | Styling & responsive design   |

---

## 🔧 How It Works

1. **Connect Wallet:** Users connect using their Coinbase Wallet.
2. **Join/Initiate Group Chat:** Messaging is handled via XMTP.
3. **Enter Total Amount:** The user inputs the total bill amount.
4. **Auto Split:** The app evenly divides the amount among participants.
5. **Instant Pay:** Each participant pays their share via Base crypto transaction.
6. **Confirmation:** Receipts are sent back via the chat.

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/splitmate.git
cd splitmate
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create .env.local
Create a .env.local file at the root:
```bash
NODE_ENV=development
NEXT_RUNTIME="nodejs"

NEXT_EXPERIMENTAL_COMPILE_TIME_RS=true
NEXT_EXPERIMENTAL_AMP_METRICS=true
NEXT_SKIP_REWRITE_PREFETCH=false

NEXT_PUBLIC_DEV_MODE=true
NEXT_DEV_HTTPS=true
NEXT_TELEMETRY_DISABLED=1

NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_BASE_GOERLI_RPC_URL=https://goerli.base.org

NEXT_PUBLIC_XMTP_ENV=production
NEXT_PUBLIC_XMTP_API_KEY=your_xmtp_api_key

NEXT_WEBPACK_DISABLE_CACHE=true
NEXT_SHARP_PATH=./node_modules/sharp
NEXT_DISABLE_SENTRY=true
```

### 4. Run the development server
```bash
npm run dev
```

### 🧾 Example Use Case
**A group of 4 friends go out to dinner. One of them enters the bill total on SplitMate. The app calculates everyone's share, and with a single message and click, it requests and confirms crypto payments from each member instantly.**

### 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue to discuss the proposed changes first.

1. **Fork the repository**

2. **Create your feature branch: git checkout -b feature/feature-name**

3. **Commit your changes: git commit -m 'Add feature'**

4. **Push to the branch: git push origin feature/feature-name**

5. **Open a Pull Request**
