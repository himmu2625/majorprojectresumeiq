# 🚀 How to Run ResumeIQ Local Environment

To run the ResumeIQ system locally for presentations, you must start **BOTH** the Backend (Python) and the Frontend (Next.js) servers in two separate terminal windows.

---

### 🟢 Terminal 1: Starting the AI Backend
This runs the Python AI engine that scores the resumes.

1. Open your first terminal (Powershell/Command Prompt/VS Code Terminal).
2. Navigate into the backend directory:
   ```powershell
   cd "c:\Users\himmu\OneDrive\Desktop\Major project new\resumeiq\backend"
   ```
3. Start the FastAPI server using the virtual environment:
   ```powershell
   .\venv\Scripts\uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
*(Leave this terminal running in the background. It will show a message when it's ready on port 8000).*

---

### 🔵 Terminal 2: Starting the Frontend UI
This runs the Next.js website that you interact with.

1. Open a **second** entirely new terminal tab/window.
2. Navigate into the main project folder:
   ```powershell
   cd "c:\Users\himmu\OneDrive\Desktop\Major project new\resumeiq"
   ```
3. Start the Next.js development server:
   ```powershell
   npm run dev
   ```
*(Leave this terminal running too. It will say "Ready in x seconds" and give you a localhost link).*

---

### 🌐 Browser: Presenting the App
1. Open your web browser (Google Chrome, Edge, etc.)
2. Go to: **[http://localhost:3000](http://localhost:3000)** (or http://localhost:3001 if port 3000 is occupied).
3. The app is live!

### 💡 Presentation Tip:
When demonstrating the core functionality during your presentation:
1. Navigate to the `New Screening` page.
2. Go into the `test_data_indian` folder on your computer.
3. Copy a job description from a text file (e.g. `jd_1_react_frontend.txt`) and paste it into the UI.
4. Drag and drop the matching resume (e.g. `res_1_amit_react.pdf`) to demonstrate a **High Confidence Match**.
5. Do a second test where you upload a complete mismatch (e.g. `res_7_vikas_java.pdf`) against the same JD to highlight how the Artificial Intelligence effectively detects **Missing Skills** and generates an Explainable AI (XAI) breakdown!
