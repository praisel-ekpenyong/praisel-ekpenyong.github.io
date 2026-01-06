// --- 1. MATRIX BACKGROUND ---
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const chars = "01SOCDEFENDERSECURITYLOGS";
const fontSize = 14;
const columns = Math.floor(canvas.width / fontSize);
const drops = new Array(columns).fill(0);

function drawMatrix() {
    ctx.fillStyle = "rgba(13, 2, 8, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00FF41";
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 50);

// --- 2. LOADER & VIEW SWITCHING ---
const loader = document.getElementById('commonLoader');
const progressBar = document.getElementById('commonLoaderProgress');
const viewSelector = document.getElementById('viewSelector');
const terminalInterface = document.getElementById('terminalInterface');
const guiInterface = document.getElementById('guiInterface');

async function showLoader() {
    loader.classList.add('active');
    progressBar.style.width = '0%';
    await new Promise(r => setTimeout(r, 100));
    progressBar.style.width = '50%';
    await new Promise(r => setTimeout(r, 500));
    progressBar.style.width = '100%';
    await new Promise(r => setTimeout(r, 300));
    loader.classList.remove('active');
}

// Event Listeners for Mode Selection
document.getElementById('terminalOption').addEventListener('click', async () => {
    viewSelector.style.display = 'none';
    await showLoader();
    terminalInterface.style.display = 'flex';
    document.getElementById('terminalInput').focus();
});

document.getElementById('guiOption').addEventListener('click', async () => {
    viewSelector.style.display = 'none';
    await showLoader();
    guiInterface.style.display = 'block';
    initAOS();
    typeText();
});

// Switch from Terminal to GUI (Close button or command)
document.getElementById('closeTerminal').addEventListener('click', async () => {
    terminalInterface.style.display = 'none';
    await showLoader();
    guiInterface.style.display = 'block';
    initAOS();
    typeText();
});

// Switch from GUI to Terminal
document.getElementById('switchToTerminal').addEventListener('click', async () => {
    guiInterface.style.display = 'none';
    await showLoader();
    terminalInterface.style.display = 'flex';
    document.getElementById('terminalInput').focus();
});

// --- 3. TERMINAL LOGIC ---
const termInput = document.getElementById('terminalInput');
const termContent = document.getElementById('terminalContent');
const currentInputDiv = document.getElementById('currentInput');

const commands = {
    help: "Available Commands:\n- about\n- skills\n- projects\n- contact\n- gui (Switch to Graphic Mode)\n- clear",
    about: "Praisel Ekpenyong | SOC Analyst Tier 1.\nFocus: Threat Detection, DFIR, and Blue Team Operations.",
    skills: "CORE ARSENAL:\n> Splunk (SIEM)\n> Wireshark\n> Windows Event Logs\n> Azure Sentinel\n> Kali Linux",
    projects: "CASE STUDIES:\n1. Brute Force Investigation (Event ID 4625)\n2. Malware Execution Analysis (Event ID 4688)\n3. Event Log Forensics",
    contact: "Email: ekpenyongpraisel@gmail.com\nGitHub: github.com/praisel-ekpenyong",
    gui: "Switching to GUI...",
    clear: ""
};

termInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const cmd = this.value.trim().toLowerCase();
        
        // Add previous line to history
        const historyLine = document.createElement('div');
        historyLine.innerHTML = `<span class="prompt">praisel@soc-analyst:~$</span> ${this.value}`;
        historyLine.style.marginTop = "5px";
        termContent.insertBefore(historyLine, currentInputDiv);

        // Process output
        if (cmd === 'gui') {
            document.getElementById('closeTerminal').click();
            this.value = '';
            return;
        }
        
        if (cmd === 'clear') {
            const outputs = termContent.querySelectorAll('div:not(#currentInput)');
            outputs.forEach(el => el.remove());
            // Re-add ASCII header if you want, or leave blank
        } else if (commands[cmd]) {
            const output = document.createElement('div');
            output.innerText = commands[cmd];
            output.style.color = "#ccc";
            output.style.whiteSpace = "pre-wrap";
            output.style.marginTop = "5px";
            output.style.marginBottom = "10px";
            termContent.insertBefore(output, currentInputDiv);
        } else if (cmd !== "") {
            const error = document.createElement('div');
            error.innerText = `Command not found: ${cmd}`;
            error.style.color = "#ff5f56";
            termContent.insertBefore(error, currentInputDiv);
        }

        this.value = '';
        termContent.scrollTop = termContent.scrollHeight;
    }
});

// --- 4. GUI TYPING ANIMATION ---
function typeText() {
    const textElement = document.getElementById('typed-text');
    if(!textElement) return;
    
    const phrases = ["SOC Analyst", "Threat Hunter", "Blue Teamer"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function loop() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            textElement.innerText = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textElement.innerText = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(loop, typeSpeed);
    }
    loop();
}

// --- 5. MOBILE MENU ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if(hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Init Animations
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init();
    }
}
