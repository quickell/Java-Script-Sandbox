# JavaScript Sandbox

# A modern VS Code–style JavaScript playground for writing, running and experimenting with JS code in real time all inside your browser.

<img width="1912" height="939" alt="image" src="https://github.com/user-attachments/assets/8595369f-5760-49e7-8918-c16a0b0535da" />
<img width="1914" height="941" alt="image" src="https://github.com/user-attachments/assets/ddf323a5-90bd-48a6-b85c-00b5e7bdaa31" />
<img width="1911" height="946" alt="image" src="https://github.com/user-attachments/assets/de437df7-ece3-4687-890c-75d4a1f4173d" />
<img width="1910" height="931" alt="image" src="https://github.com/user-attachments/assets/a6ec77ee-f7e3-44ef-b703-e56c9af18ccc" />

# Features:
Instant Execution – Run JavaScript instantly in a secure VM2 sandbox.

Multiple Themes -> Dark · Light · Black · Cyberpunk.

VS Code–Like UI -> Familiar editing experience powered by Monaco Editor.

Responsive Design -> Works seamlessly on all devices.

Custom Console -> Move, resize, lock, or clear the console.

Hotkeys -> Press Ctrl + Enter to run code instantly

Modern Aesthetic –> Clean, fluid, and professional UI.

Installation:
[Clone the repository]
-- git clone https://github.com/yourusername/javascript-sandbox.git
-- cd javascript-sandbox

[Install dependencies]
-- npm install
-- cd client
-- npm install
-- cd ..

[Start development]
-- npm run dev

# Console Controls
<img width="220" height="59" alt="image" src="https://github.com/user-attachments/assets/e0379d69-fe2c-420a-b633-26d0ccb06a68" />
Action	Description:
🔄 Position	Move console to top, bottom, left or right.
🔒 Lock	Prevent accidental repositioning.
🧹 Clear	Clear console output.
⬇️ Minimize	Hide or show console.


# 📁 Project Structure
javascript-sandbox/
├── client/                 # React frontend
│   ├── public/             # Static files
│   ├── src/                # Source code
│   │   ├── App.js          # Main component
│   │   ├── App.css         # Styles and themes
│   │   └── index.js        # Entry point
│   └── package.json        # Frontend dependencies
├── server.js               # Express backend
├── package.json            # Backend dependencies
└── README.md               # Documentation

# Tech Stack:
[Frontend:]
React
 – UI framework
Monaco Editor
 – Code editing
React Resizable Panels
 – Layout system
React Icons
 – Icon set
Axios
 – API communication
[Backend:]
Express.js
 – Web framework
VM2
 – Secure code sandbox
Helmet
 – Security middleware
CORS
 – Cross-origin access
Rate Limiting – Prevents abuse

# Security Highlights
Code Validation – Blocks unsafe operations.
Timeout Limit – 10s per execution.
Memory Limit – Prevents exhaustion.
Sandbox Isolation – Fully separated runtime.
Rate Limiting – Throttles excessive requests.


# License:
This project is licensed under the MIT License.


Made with <3 by quickell.


