# FitMaster AI — Complete Technical Architecture & System Documentation

## 1. Project Overview & Motivation
**FitMaster AI** is an enterprise-grade kinetic fitness coaching and telemetry platform built with **Python 3.12, Django 6.0, Google MediaPipe Pose, Web Speech API, and Google Gemini 1.5 Flash**.

The primary motivation is democratizing high-performance athletic coaching: providing athletes with real-time computer-vision skeletal tracking, repetition counting, and biomechanical posture guidance directly in the browser with zero hardware or wearable costs.

---

## 2. High-Level System Architecture

```mermaid
graph TD
    subgraph Client_Browser ["Client Web Application (Frontend)"]
        UI["Dual-Theme UI (Vanilla HTML5/CSS3)"]
        CV["MediaPipe Pose Neural Engine (WASM/WebGL)"]
        Audio["Web Speech & Web Audio Synthesizer"]
        I18n["DOM Tree-Walker Bilingual Engine"]
        Cur["Multi-Currency Converter (INR, USD, EUR, etc.)"]
        ChatbotUI["FitMaster Kinetic Chatbot Widget"]
    end

    subgraph Backend_Server ["Django Backend Application (Server)"]
        Router["URL Dispatcher & Middleware"]
        Auth["Authentication & RBAC (Admin, Trainer, Customer)"]
        Views["Service Layer (Views & Business Logic)"]
        ChatbotAPI["Chatbot Router (Gemini REST + Regex Engine)"]
        NotifyEngine["Real-time Notification Bell Service"]
    end

    subgraph External_Services ["External Clouds & APIs"]
        GeminiAPI["Google Gemini 1.5 Flash API"]
        EmailGateway["SMTP / Console Email Service"]
        MediaPipeCDN["Google MediaPipe Edge CDN"]
    end

    subgraph Data_Storage ["Relational Storage"]
        DB[("SQLite Database Models")]
    end

    UI --> Router
    ChatbotUI -->|Async POST JSON| ChatbotAPI
    ChatbotAPI -->|Fallback / Primary| GeminiAPI
    Views --> DB
    Views --> NotifyEngine
    Router --> Views
    CV --> Audio
    MediaPipeCDN -.->|Script Load| CV
```

---

## 3. Live AI Vision & Biomechanical Pose Algorithms

### A. 3-Point Joint Vector Angle Formula
For any joint $B$ connected to adjacent joints $A$ and $C$:
$$\vec{u} = A - B = (A_x - B_x, A_y - B_y)$$
$$\vec{v} = C - B = (C_x - B_x, C_y - B_y)$$
$$\theta = \arccos\left(\frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\| \|\vec{v}\|}\right) \times \left(\frac{180^\circ}{\pi}\right)$$

### B. Finite State Machine (Hysteresis Repetition Counter)
```mermaid
stateDiagram-v2
    [*] --> STATE_UP: Athlete Standing Tall
    STATE_UP --> TRANSITION_DESCENDING: Angle < 135°
    TRANSITION_DESCENDING --> STATE_DOWN: Knee Angle <= 95° (Target Depth Reached)
    STATE_DOWN --> TRANSITION_ASCENDING: Angle > 110°
    TRANSITION_ASCENDING --> STATE_UP: Knee Angle >= 155° (Full Lockout)
```

| Exercise | Tracked Landmarks | Down Threshold | Up Threshold | Calorie Burn Rate |
| :--- | :--- | :--- | :--- | :--- |
| **Squats** | Hip (23), Knee (25), Ankle (27) | $\le 95^\circ$ | $\ge 155^\circ$ | 0.32 kcal/rep |
| **Bicep Curls** | Shoulder (12), Elbow (14), Wrist (16) | $\le 45^\circ$ | $\ge 145^\circ$ | 0.22 kcal/rep |
| **Push-Ups** | Shoulder (12), Elbow (14), Wrist (16) | $\le 85^\circ$ | $\ge 150^\circ$ | 0.28 kcal/rep |
| **Jumping Jacks** | Hip (24), Shoulder (12), Wrist (16) | $\ge 140^\circ$ | $\le 50^\circ$ | 0.20 kcal/rep |

---

## 4. Entity Relationship (ER) Conceptual Schema

```mermaid
erDiagram
    USER ||--|| PROFILE : "has profile"
    USER ||--o| TRAINER_DETAIL : "has specialization"
    USER ||--o{ MEMBERSHIP : "subscribes"
    USER ||--o{ PAYMENT : "executes"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ CLIENT : "trainer assigns athlete"
    USER ||--o{ WORKOUT_PLAN : "creates/receives"
    USER ||--o{ DIET_PLAN : "creates/receives"
    USER ||--o{ MEASUREMENT : "logs metrics"

    PACKAGE ||--o{ MEMBERSHIP : "governs duration"
```

---

## 5. Data Flow Diagrams (DFD)

### DFD Level 0 (Context Diagram)
```mermaid
graph LR
    User([Customer / Athlete]) -->|Credentials / Camera Video / Chat Queries| System((FitMaster AI Platform))
    Trainer([Certified Trainer]) -->|Workout Plans / Diet Plans / Schedules| System
    Admin([System Admin]) -->|Package Rates / Product Catalog / User Access| System

    System -->|Biomechanical Rep Feedback / Voice Audio| User
    System -->|Client Roster / Telemetry Charts| Trainer
    System -->|Revenue Invoices / Platform Analytics| Admin
    System -->|Prompt Request| Gemini([Google Gemini 1.5 Flash])
    Gemini -->|AI Response Text| System
```

---

## 6. Mathematical Nutrition & Calorie Formulas

### A. Mifflin-St Jeor Formula (BMR)
- **Male**: $\text{BMR} = (10 \times \text{weight}_{\text{kg}}) + (6.25 \times \text{height}_{\text{cm}}) - (5 \times \text{age}) + 5$
- **Female**: $\text{BMR} = (10 \times \text{weight}_{\text{kg}}) + (6.25 \times \text{height}_{\text{cm}}) - (5 \times \text{age}) - 161$
- **Total Daily Energy Expenditure (TDEE)**: $\text{TDEE} = \text{BMR} \times \text{Activity Factor}$

---

## 7. Viva & Interview Questions Cheatsheet

1. **Why MediaPipe in the browser instead of server-side OpenCV?**
   * *Answer:* Running computer vision on the client side eliminates video streaming bandwidth, avoids expensive GPU servers, ensures zero network latency (60 FPS inference), and protects user camera privacy.
2. **How does the system prevent false repetition counts?**
   * *Answer:* It uses a dual-threshold hysteresis finite state machine (FSM). Repetitions are only credited after crossing both the contraction threshold and the extension lockout threshold.
3. **How does the safe bilingual translation engine preserve icons?**
   * *Answer:* Instead of setting `element.innerHTML` or `element.textContent`, it uses a recursive `document.createTreeWalker(root, NodeFilter.SHOW_TEXT)` to modify text nodes directly while caching `node._origVal`.
