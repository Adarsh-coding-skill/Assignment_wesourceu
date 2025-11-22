✨ Features

📄 Upload any PDF document

🧠 AI checks the PDF against user-defined rules

📊 Returns structured JSON (status, evidence, reasoning, confidence)

🎨 Fully built frontend using React + Material UI

⚙️ Backend using Node.js + Express

🤖 Groq LLM API integration

🧼 Clean UI with rule inputs and result table

📂 Project Structure
/frontend
   ├── src
   ├── public
   └── package.json

/backend
   ├── index.js
   ├── package.json
   └── .env   (NOT included in GitHub)

🖥️ Frontend Setup
cd frontend
npm install

🚀 Start React App
npm run dev


Runs on:
👉 http://localhost:5173

⚙️ Backend Setup
cd backend
npm install

▶ Start Backend Server
node index.js


Runs on:
👉 http://localhost:5000

🔌 API Endpoint
POST /check-pdf
📤 FormData Fields
Field	Type	Description
pdf	File	Uploaded PDF file
rules	JSON array	Three or more rules to validate
📥 Sample Response
[
  {
    "rule": "Rule text...",
    "status": "pass",
    "evidence": "Found matching content...",
    "reasoning": "Rule satisfied.",
    "confidence": 92
  }
]

🛠️ Tech Stack
Frontend

React.js

Material UI

Fetch API

Drag-drop file upload

Backend

Node.js

Express

Multer

pdf-parse-fixed

Axios

Groq Llama 3.1 API
