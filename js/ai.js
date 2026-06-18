class AITutor {
  constructor() {
    this.chatHistory = [];
    this.isOpen = false;
    this.initUI();
  }

  initUI() {
    // Inject floating button
    const btn = document.createElement('button');
    btn.innerHTML = '🤖 AI Tutor';
    btn.className = 'ai-fab';
    btn.onclick = () => this.toggleChat();
    document.body.appendChild(btn);

    // Inject chat modal
    const modal = document.createElement('div');
    modal.className = 'ai-modal';
    modal.id = 'ai-modal';
    modal.style.display = 'none';
    
    modal.innerHTML = `
      <div class="ai-header">
        <h3 style="margin: 0; color: white; display: flex; align-items: center; gap: 8px;">🤖 Virtual AI Tutor</h3>
        <button onclick="window.aiTutor.toggleChat()" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">✕</button>
      </div>
      <div class="ai-body" id="ai-body">
        ${this.getChatHTML()}
      </div>
      ${this.getInputHTML()}
    `;
    
    document.body.appendChild(modal);

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
      .ai-fab {
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: linear-gradient(135deg, var(--imperial-blue), var(--french-blue));
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 30px;
        font-weight: bold;
        font-size: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        cursor: pointer;
        z-index: 9999;
        transition: transform 0.2s;
      }
      .ai-fab:hover { transform: scale(1.05); }
      
      .ai-modal {
        position: fixed;
        bottom: 80px;
        right: 24px;
        width: 350px;
        height: 500px;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .ai-header {
        background: var(--primary);
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .ai-body {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .ai-input-area {
        padding: 12px;
        border-top: 1px solid var(--border);
        display: flex;
        gap: 8px;
        background: var(--bg);
      }
      .ai-input-area input {
        flex: 1;
        padding: 10px;
        border: 1px solid var(--border);
        border-radius: 20px;
        outline: none;
        background: var(--card);
        color: var(--text);
      }
      .ai-input-area button {
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 20px;
        padding: 0 16px;
        cursor: pointer;
        font-weight: bold;
      }
      .chat-msg { padding: 10px 14px; border-radius: 12px; max-width: 85%; line-height: 1.4; font-size: 14px; color: var(--text); }
      .msg-user { background: var(--yellow-light); align-self: flex-end; border-bottom-right-radius: 4px; }
      .msg-ai { background: var(--bg); border: 1px solid var(--border); align-self: flex-start; border-bottom-left-radius: 4px; }
      
      body.dark-theme .msg-user { background: var(--accent); color: white; }
    `;
    document.head.appendChild(style);
  }

  getChatHTML() {
    if (this.chatHistory.length === 0) {
      return `<div class="chat-msg msg-ai">Hello! I am your Database Systems tutor. Feel free to ask me any doubts about the current experiment!</div>`;
    }
    return this.chatHistory.map(m => `<div class="chat-msg ${m.role === 'user' ? 'msg-user' : 'msg-ai'}">${m.text}</div>`).join('');
  }

  getInputHTML() {
    return `
      <div class="ai-input-area">
        <input type="text" id="ai-chat-input" placeholder="Ask a question..." onkeypress="if(event.key === 'Enter') window.aiTutor.sendMessage()">
        <button onclick="window.aiTutor.sendMessage()">Send</button>
      </div>
    `;
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    document.getElementById('ai-modal').style.display = this.isOpen ? 'flex' : 'none';
  }

  rebuildModal() {
    const modal = document.getElementById('ai-modal');
    modal.innerHTML = `
      <div class="ai-header">
        <h3 style="margin: 0; color: white; display: flex; align-items: center; gap: 8px;">🤖 Virtual AI Tutor</h3>
        <button onclick="window.aiTutor.toggleChat()" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">✕</button>
      </div>
      <div class="ai-body" id="ai-body">
        ${this.getChatHTML()}
      </div>
      ${this.getInputHTML()}
    `;
    this.scrollToBottom();
  }

  scrollToBottom() {
    const body = document.getElementById('ai-body');
    if (body) body.scrollTop = body.scrollHeight;
  }

  async sendMessage() {
    const input = document.getElementById('ai-chat-input');
    const text = input.value.trim();
    if (!text) return;
    
    input.value = '';
    this.chatHistory.push({ role: 'user', text });
    this.rebuildModal();
    
    // Add loading indicator
    const body = document.getElementById('ai-body');
    body.innerHTML += `<div class="chat-msg msg-ai" id="ai-typing"><em>Typing...</em></div>`;
    this.scrollToBottom();

    // Determine current experiment context
    const currentPath = window.location.hash || '#/experiment/1/introduction';
    const match = currentPath.match(/experiment\\/(\\d+)/);
    const expNum = match ? match[1] : 'Unknown';

    const systemPrompt = \`You are a helpful Database Management Systems (DBMS) tutor assisting a student. 
The student is currently working on Experiment \${expNum}. 
Provide concise, educational answers. If they ask for a direct SQL answer, explain the concept instead and guide them to the solution.\`;

    // Construct the payload for our Vercel backend
    const payload = {
      messages: [
        { role: "user", parts: [{ text: systemPrompt + "\\n\\nStudent: " + text }] }
      ]
    };

    try {
      // Call our secure Vercel Serverless Function instead of Google directly
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      this.chatHistory.push({ role: 'model', text: this.formatMarkdown(data.text) });
    } catch (err) {
      this.chatHistory.push({ role: 'model', text: \`<span style="color: #ef4444;">Error: \${err.message}. Could not connect to AI Backend.</span>\` });
    }
    
    this.rebuildModal();
  }

  formatMarkdown(text) {
    // Simple bold and code formatting
    return text
      .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
      .replace(/\`(.*?)\`/g, '<code style="background: rgba(0,0,0,0.1); padding: 2px 4px; border-radius: 4px;">$1</code>')
      .replace(/\\n/g, '<br>');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.aiTutor = new AITutor();
});
