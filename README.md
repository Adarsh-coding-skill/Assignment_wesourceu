Features

 Upload any PDF document

AI checks the PDF against user-defined rules

Returns structured JSON (status, evidence, reasoning, confidence)

 Fully built frontend (React + Material UI)

 Backend using Node.js + Express

 Groq LLM API integration

 Clean UI with rule inputs and result handling 


 /frontend
  ├── src
  ├── public
  ├── package.json
      
/backend
  ├── index.js
  ├── package.json
  ├── .env (NOT included in GitHub)



  Frontend Setup
  cd frontend
npm install

Start the React app
npm run dev
👉 http://localhost:5173

Backend Setup
cd backend
npm install

Start the backend server
node index.js
👉 http://localhost:5000

🔌 API Endpoint
POST /check-pdf
FormData fields:

Field	Type	Description
pdf	File	Uploaded PDF file
rules	JSON array	3+ rules to check against

Returns (example):

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

File upload (drag-drop + preview)

Backend

Node.js

Express

Multer (for PDF upload)

pdf-parse-fixed

Axios

Groq Llama 3.1 API
