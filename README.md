# Bimakavach | B2B Commercial Insurance CRM (Autopilot Agent Desktop)

Bimakavach is a premium B2B commercial insurance CRM and deal pipeline management application designed specifically for insurance relationship managers (RMs) and agents. It focuses on automation, proactive AI insights, and ease-of-use across both desktop screens and mobile viewports.

---

## 🚀 Live Demo & Production URL
Access the live application here: **[https://bimakavach-app.vercel.app](https://bimakavach-app.vercel.app)**

---

## 💼 Product Overview & Value Proposition
In commercial insurance, agents spend significant admin hours logging calls, following up on renewal expiries, and identifying expansion coverage leads. Bimakavach solves this by acting as an **Autopilot CRM**:
* **Automated Timeline Tracking**: Automatically ingests inbound WhatsApp queries and outbound emails, auto-advancing deal stages and building timelines.
* **Proactive Risk Intelligence**: Flags underinsured accounts (e.g., when a client opens a new warehouse but hasn't updated their asset/fire insurance coverage).
* **Frictionless Mobile-to-Desktop Layouts**: Features a fully responsive interface, providing desktop sidebar layouts (with multi-column Kanban boards) and adaptive mobile viewports so agents can log and close deals on the go.

---

## 🎯 Key Features & Interactive Flows

### 1. Autopilot Dashboard (`Home`)
* **Live Key Value Metrics**: Shows Pipeline value (₹48L), CRM auto-save accuracy (94%), Admin time saved (1.8h/day), and Nudge click-through rate (78%) with dynamic count-up animations on load.
* **Intelligent Actions & Nudges**: 
  - Dynamic alert cards highlighting urgent tasks (e.g., *Follow-up due for TechPlex Infra*).
  - Auto-logged email approvals: Allows agents to instantly verify auto-detected stages (e.g., auto-confirming *Vertex Solutions* stage transition to *Quote Shared* detected from outbound mail).
* **Upcoming Expiry Timelines**: Highlights upcoming policy renewals with a color-coded warning bar tracking days remaining (e.g., *TechPlex Infra - Fire Policy renewal*).

### 2. Deal Pipeline (Kanban Board)
* **Responsive Visual Boards**:
  - **Desktop**: A 5-column Kanban board showing deals distributed under *New Lead*, *Discovery*, *Quote Shared*, *Negotiation*, and *Closed*.
  - **Mobile**: A clean, single-column vertical stack with quick scroll-anchoring to easily swipe between stages.
* **Dynamic Stage Transitions**: Change a deal's stage via quick action dropdown menus inside card elements. The card transitions smoothly across the column stacks, updates the global pipeline value, and automatically appends a system log event in the client's timeline.

### 3. Client Timeline & Detail Grid
* **Split Details Screen**: On wide screens, displays client metadata, policies, and AI recommendations side-by-side with an interactive chronological timeline log (categorized by Email, WhatsApp, Call, and System events).
* **AI Upsell Recommendations**: Flags opportunities like Nagpur Asset Expansion cover (Premium ₹2.1L + Cyber Liability add-on ₹85k) matching real-world MCA filing data, allowing agents to pre-fill draft pitches.

### 4. Interactive WhatsApp Chat Client
* **Mock Chat Client**: Simulates communication with client representatives (e.g., Rajeev Nair from TechPlex Infra) to coordinate coverages.
* **One-Tap Pitch Templates**: Pre-fills and drafts cyber liability or fire expansion quotes in the chat window, auto-advancing the deal stage upon sending the message.

### 5. Activity Logs & Call Recorder
* **Logger Console**: A double-column utility tracking active logs, confirmations, and pending tasks.
* **Voice Call Logger**: Opens a popup modal allowing agents to choose pre-defined notes (e.g., *“Agreed to Quote”*, *“Negotiating rates”*, *“Busy, Call back”*) or write custom notes to save call summaries directly into the CRM database.

### 6. Reports & Analytics Panel
* **RM Leaderboard**: Tracks active pipelines, deals closed, and accuracy scores per Relationship Manager (e.g., Arjun Kumar, Priya Sharma, Ravi Menon).
* **Pipeline distribution chart**: Custom CSS-based horizontal bar charts showing breakdown percentages across active stages.
* **Deals at Risk**: Highlighted warning pane tracking idle days for stalled deals.

---

## 🛠️ Technology & Design Stack

- **Core Framework**: React with TypeScript.
- **Styling & Theme**: Tailwind CSS (v4) with customized HSL-tailored colors. 
- **Typography**: Inter (Sans-serif) for high data density readability, JetBrains Mono for system metrics and metadata.
- **Animations**: Framer Motion (for spring-based modal popups, toast notifications, slide-in sidebar elements, and smooth column transitions).
- **Icons**: Lucide React.
- **Build Tool**: Vite.

---

## 💻 Local Development Setup

### Prerequisites
* **Node.js** (v18+ recommended)
* **npm** (comes packaged with Node.js)

### Installation Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/dhagamonish/Bimakavach.git
   cd Bimakavach
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Local Development Server**:
   ```bash
   npm run dev
   ```
   *The app will be available locally at `http://localhost:3000` (or the next available port).*

4. **Production Build**:
   ```bash
   npm run build
   ```
   *Compiles static assets into the `/dist` folder.*
