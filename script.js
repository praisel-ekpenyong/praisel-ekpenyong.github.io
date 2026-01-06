// --- MATRIX RAIN EFFECT ---
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = '01SOCDEFENDERSECURITYLOGS';
const fontSize = 16;
const columns = canvas.width / fontSize;
const rainDrops = Array.from({ length: columns }).fill(1);

const draw = () => {
    ctx.fillStyle = 'rgba(13, 2, 8, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';

    for(let i = 0; i < rainDrops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if(rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            rainDrops[i] = 0;
        }
        rainDrops[i]++;
    }
};

let interval = setInterval(draw, 30);

// --- TERMINAL LOGIC ---
const input = document.getElementById('cmd-input');
const terminalBody = document.getElementById('terminal-body');
const terminalView = document.getElementById('terminal-view');
const guiView = document.getElementById('gui-view');

const commands = {
    help: "Available commands: about, skills, education, projects, contact, gui, clear",
    
    about: "PROFILE:\nEntry-level SOC Analyst with hands-on experience in security monitoring, alert triage, and incident investigation.\nLocation: Nigeria (Open to Remote/Relocation)",
    
    skills: "CORE SOC SKILLS:\n> SIEM (Splunk)\n> Windows Event Log Analysis\n> Network Traffic Analysis (PCAP)\n> MITRE ATT&CK Mapping\n> ServiceNow Incident Workflows\n> Vulnerability Management (Qualys)",
    
    education: "EDUCATION:\n> B.Sc. Cybersecurity - Miva University (Exp. 2027)\n\nCERTIFICATIONS (In Progress/Planned):\n> Google Cybersecurity Professional\n> ServiceNow System Administrator\n> CompTIA Security+",
    
    projects: "CASE STUDIES:\n1. Brute Force Attack Investigation (Authentication Logs & SIEM)\n2. Malware Execution Investigation (Suspicious Process Analysis)\n3. Windows Event Logs Investigation (Timeline Correlation)",
    
    contact: "Email: ekpenyongpraisel@gmail.com\nLinkedIn: linkedin.com/in/praiselekpenyong\nGitHub: github.com/praisel-ekpenyong",
    
    gui: "Initializing GUI Interface...",
    clear: ""
};

input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const cmd = this.value.trim().toLowerCase();
        
        // Add Input Line to History
        const oldLine = document.createElement('div');
        oldLine.innerHTML = `<span class="prompt">guest@praisel-soc:~$</span> ${this.value}`;
        terminalBody.insertBefore(oldLine, this.parentElement);

        // Process Command
        if (cmd === 'clear') {
            terminalBody.innerHTML = '<div class="input-line"><span class="prompt">guest@praisel-soc:~$</span><input type="text" id="cmd-input" autocomplete="off" autofocus></div>';
            document.getElementById('cmd-input').addEventListener('keydown', arguments.callee);
            document.getElementById('cmd-input').focus();
            return;
        }

        if (cmd === 'gui') {
            switchMode('gui');
            this.value = '';
            return;
        }

        if (commands[cmd]) {
            const output = document.createElement('div');
            output.className = 'output';
            output.innerText = commands[cmd];
            terminalBody.insertBefore(output, this.parentElement);
        } else if (cmd !== '') {
            const error = document.createElement('div');
            error.className = 'output';
            error.style.color = '#ff5f56';
            error.innerText = `Command not found: ${cmd}. Type 'help' for list.`;
            terminalBody.insertBefore(error, this.parentElement);
        }

        this.value = '';
        // Scroll to bottom
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
});

function switchMode(mode) {
    if (mode === 'gui') {
        terminalView.classList.add('hidden');
        guiView.classList.remove('hidden');
        document.body.style.overflow = 'auto'; // Enable scroll for GUI
        // Optional: Pause matrix rain to save performance
        // clearInterval(interval);
        // canvas.style.display = 'none';
    } else {
        guiView.classList.add('hidden');
        terminalView.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Disable scroll for Terminal
        // Restart matrix rain if paused
        // canvas.style.display = 'block';
        // interval = setInterval(draw, 30);
        setTimeout(() => document.getElementById('cmd-input').focus(), 100);
    }
}
