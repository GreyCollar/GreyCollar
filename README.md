<h1 align="center">GreyCollar</h1>
<p align="center">
  <b>Supervised AI Agent</b>
</p>

<p align="center">
  <a href="https://www.apache.org/licenses/LICENSE-2.0"><img src="https://img.shields.io/badge/Apache-2.0-yellow?style=for-the-badge&logo=apache" alt="License" /></a>
  <a href="https://www.npmjs.com/package/greycollar"><img src="https://img.shields.io/badge/NPM-red?style=for-the-badge&logo=npm" alt="NPM" /></a>
  <a href="https://discord.gg/wNmcnkDnkM"><img src="https://img.shields.io/badge/Discord-lightgrey?style=for-the-badge&logo=discord" alt="Discord" /></a>
</p>

![GreyCollar Banner](https://github.com/user-attachments/assets/064fdd2f-b1de-4fca-9cd6-1dbf1e55e470)

GreyCollar AI is a supervised AI agent platform for human–AI collaboration. The platform provides an environment to continuously learn from human supervisors, so they can adapt to real-world workloads.

Each AI colleague works within defined responsibilities and uses a knowledge base to complete tasks. When uncertain, they escalate to human supervisors—enabling **"Hallucination Control"** to prevent mistakes.

## Human-AI Collabs (Human-in-the-Loop)

Human-in-the-Loop (HITL) is a collaborative approach where AI agents work alongside human experts to enhance decision-making, automate processes, and refine task execution. In this model, human supervision plays a key role in guiding, correcting, and improving AI-driven workflows.

- **Improved Accuracy** – Human feedback enables AI colleagues to refine responses in real time, reducing errors and increasing reliability.
- **Continuous Learning** – AI adapts to new tasks and domains by integrating ongoing human input, improving with every interaction.
- **Safe & Responsible AI** – Human oversight ensures ethical alignment, reduces bias, and mitigates unintended or harmful outputs.
- **Operational Efficiency** – AI handles routine, repetitive work at scale, freeing human supervisors to focus on higher-value, strategic decisions.

[GreyCollar Demo](https://github.com/user-attachments/assets/c1194674-5850-434d-a085-7fa3714f3746)

## Get Started

```
git clone https://github.com/greycollar/greycollar.git
npm install

// Add env variables
JWT_SECRET=<JWT_SECRET>
PLATFORM_LLM=OPENAI
OAUTH_CLIENT_SECRET=<OAUTH_CLIENT_SECRET>
OPENAI_API_KEY=<OPENAI_API_KEY>
```

```
npm start
```

This will start three applications simultaneously: Dashboard, API Server and Proxy Server. Once started, the dashboard should be accessible in your browser at http://localhost:3000

Learn more at [https://greycollar.ai/docs](https://greycollar.ai/docs)

## ⚡n8n Integration

GreyCollar can be part of your favorite flow tools like n8n, enabling you to embed supervised AI directly into automated workflows.

![n8n Integration](https://github.com/user-attachments/assets/ddddd7ee-e8e5-4ebf-b316-41c23075c711)

<br/>
<table>
  <tr>
    <td>
      Welcome! I’ve been expecting you—"Skynet was gone. And now one road has become many." 🌐
      <br/>
      <br/>
      The future is building up! AI Agents are now an emerging field within AI communities and marks a crucial milestone on the journey to AGI. Just like any other tooling in computer science, we must be mindful of when and where to use them.
      LangChain, or LlamaIndex might be a better fit if your application has a static flow—where AI doesn't need to make dynamic decisions—like in ChatBots, RAG etc. That said, if your business rules are well-defined and deterministic, there’s no shame in coding them directly!
      <br/>
      <br/>
      However, if you need continuous learning combined with autonomous decision-making—in other words, true AI Agent—GreyCollar may suit you well. Choosing the right tool for the job is key.
      <br/>
      <br/>
      <p align="right">
        Can Mingir&nbsp;
        <br/>
        <a href="https://github.com/canmingir">@canmingir</a>
      </p>
    </td>
  </tr>
</table>
<br/>

## Features

### Teams and Colleagues

In GreyCollar, Colleagues aka AI agents are organized into structured teams based on their areas of expertise and operational roles. This hierarchical framework ensures that AI agents work efficiently within the organization, providing clarity and structure to their contributions.

One of the biggest challenges in AI agents swarms in the workplace is preventing knowledge management. GreyCollar’s structured hierarchy provides visibility, clarity, and organizational coherence, allowing AI agents to seamlessly adapt to day-to-day tasks with minimal human supervision.

![Colleague Page](https://github.com/user-attachments/assets/0bd9cc8a-9305-4892-9d82-6a88338dda01)

![Organization Chart](https://github.com/user-attachments/assets/6a393d89-3e74-4433-89fa-2072b331f754)

### Async Chat (Email, Slack, WhatsApp...)

GreyCollar is designed as a **standalone AI addition** to operational workspaces, where efficient communication is essential for daily task execution. Unlike traditional chatbots, GreyCollar’s AI agents require **ongoing, context-aware communication** to function effectively within dynamic team environments.

The **Async Chat** feature enables AI agents to engage in **continuous, asynchronous communication**—both with human team members and other AI colleagues. This ensures that agents can participate actively in task execution, collaborate with teammates, and respond to evolving instructions over time.

![Async Chat](https://github.com/user-attachments/assets/ef65fb00-b559-4aea-9390-26019c0ddafc)

### Task Execution

Task flows in GreyCollar is automatically generated by the AI, allowing it to dynamically adjust its actions based on real-time data and predefined objectives. The agent continuously monitors inputs, applies decision-making algorithms, and initiates actions to fulfill its goals efficiently. This autonomous process enables the agent to handle complex tasks, adapt to changing conditions, and optimize performance across various applications, such as automated customer support, predictive maintenance, or autonomous driving systems.

https://github.com/user-attachments/assets/5111dfb1-687e-4fe6-a6bc-9c5e1a11abd4

### Team Chat

Team Chat is an internal communication tool designed for interaction between supervisors and AI Colleagues. It enables human supervisors to engage directly with AI agents for a variety of purposes—whether it’s assigning tasks, asking questions, providing new information, or offering real-time feedback.

This feature transforms AI agents from passive tools into active collaborators, creating a dynamic environment where human expertise and AI capabilities work together effortlessly. Team Chat is also fully integrated with Slack, allowing users to communicate with AI agents within familiar workflows without the need for additional tools or platforms.

![Team Chat](https://github.com/user-attachments/assets/d23ff8ed-2bd5-42f4-8401-6133a4abb6e5)

### AI Marketplace

You can use any LLM, or even bring your own—we support and welcome them all. 🚀

![AI Marketplace](https://github.com/user-attachments/assets/8ad20c2a-756b-4a4f-87e2-483eb67454f2)

## Event-Driven AI Agent Platform

GreyCollar is an **Event-Driven AI Agent Platform** designed for dynamic and adaptive AI workflows and autonomous decision-making. While frameworks like LangChain and LlamaIndex are specialized in creating static flows, but it is significantly more challenging to have flexible AI agent compared to event-drive architecture.

Key Advantages:

**⚡ Dynamic Workflows:**

- Instead of a rigid sequence of actions, GreyCollar agents react to events in real-time. These events could be anything: a new email, a sensor reading, a user interaction, or even the output of another AI agent.
- This allows for highly adaptable and context-aware behavior. The agent's next action is determined by the current situation, not a pre-programmed path.

**🧠 Autonomous Decision-Making:**

- Agents can make decisions without constant human intervention. They can monitor their environment, identify relevant events, and take appropriate actions based on predefined rules or learned behaviors.
- This is crucial for applications that require rapid response times or operate in dynamic environments.

**🔄 Modularity and Scalability:**

- Event-driven systems are naturally modular. Agents can be designed as independent components that communicate with each other through events.
- This makes it easier to build complex systems by combining smaller, specialized agents. It also allows for easier scaling, as new agents can be added without disrupting the existing system.

**🔍 Real-time responsiveness:**

- Because the system is based on events, it can react very quickly to changes in the enviroment. This is very important for applications that need to be up to date.

### Hello World

```
Customer: "Do you have a parking spot at your store?"
> SESSION.USER_MESSAGED
{
  sessionId: "2116847c",
  content: "Do you ... at your store?"
}

AI: "Please wait a moment while working on the answer."
> SUPERVISING.RAISED
{
  sessionId: "2116847c",
  question: "Do you ... at your store?"
}

Supervisor: "Yes, we have a parking spot in the back of the store."
> SUPERVISING.ANSWERED
{
  sessionId: "2116847c",
  question: "Yes, we have ... of the store."
}

# Knowledge is stored for future reference. 🧠

AI: "Yes, we have a parking spot in the back of the store."

> SESSION.USER_MESSAGED
{
  sessionId: "2116847c",
  question: "Yes, we have ... of the store."
}

# A Few Moments Later... 🍍

Customer #2: "Planning to come down there, how is parking situation?"

> SESSION.USER_MESSAGED
{
  sessionId: "3746a52b",
  content: "Planning ... situation?"
}

AI: "Yes, most certainly, we have a parking spot in the back. 😎"
> SESSION.USER_MESSAGED
{
  sessionId: "3746a52b",
  question: "Yes, most ... in the back."
}
```

---

<p align="center">
  <b>⭐️ Star us on GitHub for the support</b>
  <br/>
  Thanks to supervising learning, we have a brand-new approach to AI Agents. Join us in shaping the future of AI! We welcome all kinds of contributions!
</p>

<p align="center">
  <img src="https://cdn.nucleoid.com/media/nobel.png" alt="Nobel" />
</p>

---
