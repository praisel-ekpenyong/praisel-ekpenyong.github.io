// Matrix background effect
function initMatrix() {
  const canvas = document.getElementById("matrixCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();

  const characters =
    "01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,.<>?";
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = new Array(columns).fill(0);

  function draw() {
    ctx.fillStyle = "rgba(10, 10, 10, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00FF41";
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillText(text, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 50);
  window.addEventListener("resize", resizeCanvas);
}

// Common Loader function
function showCommonLoader() {
  return new Promise((resolve) => {
    const loader = document.getElementById("commonLoader");
    const progress = document.getElementById("commonLoaderProgress");

    // Show loader
    loader.classList.add("active");
    progress.style.width = "0%";

    // Simulate loading progress - shorter duration
    const progressSteps = [
      { width: "30%", delay: 200 },
      { width: "60%", delay: 300 },
      { width: "90%", delay: 600 },
      { width: "100%", delay: 200 }
    ];

    let totalDelay = 0;
    progressSteps.forEach((step, index) => {
      totalDelay += step.delay;
      setTimeout(() => {
        progress.style.width = step.width;
      }, totalDelay);
    });

    // Hide loader after completion
    setTimeout(() => {
      loader.classList.remove("active");
      setTimeout(resolve, 0); // Shorter fade out
    }, totalDelay + 600);
  });
}

// Terminal Class
class TerminalPortfolio {
  constructor() {
    this.commandHistory = [];
    this.historyIndex = -1;
    this.currentInput = document.getElementById("terminalInput");
    this.terminalContent = document.getElementById("terminalContent");
    this.currentInputContainer = document.getElementById("currentInput");
    this.isLoading = false;

    this.commands = {
      "pf -help": () => this.showHelp(),
      "portfolio -help": () => this.showHelp(),
      "pf -about": () => this.showAbout(),
      "portfolio -about": () => this.showAbout(),
      "pf -skills": () => this.showSkills(),
      "portfolio -skills": () => this.showSkills(),
      "pf -projects": () => this.showProjects(),
      "portfolio -projects": () => this.showProjects(),
      "pf -contact": () => this.showContact(),
      "portfolio -contact": () => this.showContact(),
      "pf -gui": () => this.switchToGUI(),
      "portfolio -gui": () => this.switchToGUI(),
      "ls": () => this.listDirectory(),
      "cd": () => this.changeDirectory(),
      "clear": () => this.clearTerminal(),
      "exit": () => this.showViewSelector(),
    };

    this.initEventListeners();
    this.focusInput();
  }

  initEventListeners() {
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".terminal-window-controls")) {
        this.focusInput();
      }
    });

    if (this.currentInput) {
      this.currentInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.executeCommand();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          this.navigateHistory(-1);
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          this.navigateHistory(1);
        } else if (e.key === "Tab") {
          e.preventDefault();
          this.autoComplete();
        }
      });
    }

    // Terminal window controls
    const closeBtn = document.getElementById("closeTerminal");
    const minimizeBtn = document.getElementById("minimizeTerminal");
    const maximizeBtn = document.getElementById("maximizeTerminal");

    if (closeBtn) {
      closeBtn.addEventListener("click", async () => {
        await showCommonLoader();
        this.showViewSelector();
      });
    }

    if (minimizeBtn) {
      minimizeBtn.addEventListener("click", () => {
        this.addOutput(
          '[INFO] Terminal minimized. Type "exit" to return to selection screen.'
        );
      });
    }

    if (maximizeBtn) {
      maximizeBtn.addEventListener("click", () => {
        this.addOutput("[INFO] Terminal maximized.");
      });
    }
  }

  executeCommand() {
    if (this.isLoading || !this.currentInput) return;

    const command = this.currentInput.value.trim();

    if (command) {
      this.commandHistory.push(command);
      this.historyIndex = this.commandHistory.length;
      this.addOutput(`praisel@soc-analyst:~$ ${command}`, "command-line");

      if (this.commands[command]) {
        this.commands[command]();
      } else if (command === "cd" || command.startsWith("cd ")) {
        this.changeDirectory(command);
      } else {
        this.addOutput(
          `bash: ${command}: command not found\nType 'pf -help' for available commands.`,
          "error"
        );
      }
    }

    this.clearInput();
    this.createNewPrompt();
  }

  autoComplete() {
    if (!this.currentInput) return;

    const input = this.currentInput.value;
    const commands = Object.keys(this.commands);
    const matches = commands.filter((cmd) =>
      cmd.startsWith(input.toLowerCase())
    );

    if (matches.length === 1) {
      this.currentInput.value = matches[0];
    } else if (matches.length > 1) {
      this.addOutput(matches.join("    "));
    }
  }

  navigateHistory(direction) {
    if (this.commandHistory.length === 0 || !this.currentInput) return;

    this.historyIndex = Math.max(
      0,
      Math.min(this.commandHistory.length, this.historyIndex + direction)
    );

    if (
      this.historyIndex >= 0 &&
      this.historyIndex < this.commandHistory.length
    ) {
      this.currentInput.value = this.commandHistory[this.historyIndex];
    } else {
      this.currentInput.value = "";
    }
  }

  showHelp() {
    const helpContent = `Available Commands:

You can use pf as a shorthand for the portfolio command
Examples:

pf -help     - Show this help menu
pf -about    - Learn about me
pf -skills   - View my technical arsenal
pf -projects - See case studies
pf -contact  - Get my contact information
pf -gui      - Switch to GUI mode
ls           - List directory contents
cd           - Change directory
clear        - Clear terminal
exit         - Return to mode selection`;
    this.addOutput(helpContent);
  }

  showAbout() {
    const aboutAscii = `
 ____  ____      _    ___ ____  _____ _     
|  _ \|  _ \    / \  |_ _/ ___|| ____| |    
| |_) | |_) |  / _ \  | |\___ \|  _| | |    
|  __/|  _ <  / ___ \ | | ___) | |___| |___ 
|_|   |_| \_\/_/   \_\___|____/|_____|_____|`;

    const aboutContent = `${aboutAscii}

Praisel Ekpenyong - SOC Analyst Tier 1 | Blue Team Defender

I am an entry-level SOC Analyst with hands-on experience in security monitoring, alert triage, and incident investigation through structured SOC labs and simulations.

Experienced in analyzing SIEM alerts, Windows Event Logs, and suspicious activity to determine true positives and escalation paths within SOC environments. My approach combines technical analysis with established frameworks like MITRE ATT&CK.

Stats:
- 03+ Case Studies Completed
- 05+ Security Tools Mastered
- B.Sc. Cybersecurity (In Progress)`;
    this.addOutput(aboutContent);
  }

  showSkills() {
    const skillsAscii = `
 ____  _  _____ _     _     ____  
/ ___|| |/ /_ _| |   | |   / ___| 
\___ \| ' / | || |   | |   \___ \ 
 ___) | . \ | || |___| |___ ___) |
|____/|_|\_\___|_____|_____|____/ `;

    const skillsContent = `${skillsAscii}

Technical Arsenal:

Security Operations:
██████████████████      85% Splunk (SIEM)
████████████████        80% Incident Response
███████████████         75% ServiceNow
██████████████          75% MITRE ATT&CK

Analysis & Forensics:
████████████████        80% Windows Event Logs
██████████████          70% Wireshark (PCAP)
████████████            60% Digital Forensics

Tools & Environment:
████████████████        80% Kali Linux
██████████████          70% Azure (AZ-900)
████████████            60% Qualys`;
    this.addOutput(skillsContent);
  }

  showProjects() {
    const projectsAscii = `
  ____    _    ____  _____ ____  
 / ___|  / \  / ___|| ____/ ___| 
| |     / _ \ \___ \|  _| \___ \ 
| |___ / ___ \ ___) | |___ ___) |
 \____/_/   \_\____/|_____|____/ `;

    const projectsContent = `${projectsAscii}

SOC Investigations & Case Studies:

1. Brute Force Attack Investigation
- Analyzed Windows authentication logs (Event ID 4625)
- Correlated SIEM data in Splunk
- Mapped attack vector to MITRE ATT&CK T1110
➤ Technologies: Splunk, Event Logs, Incident Response
➤ View Report: https://github.com/praisel-ekpenyong/case-studies

2. Malware Execution Investigation
- Investigated suspicious process execution chains
- Analyzed Windows Event Logs (ID 4688) to track parent-child processes
- Isolated infected host indicators
➤ Technologies: Process Tracking, Sysmon, Forensics
➤ View Report: https://github.com/praisel-ekpenyong/case-studies

3. Windows Event Log Forensics
- Deep dive into Windows Security Event Logs
- Identified suspicious activity timelines
- Correlated logon types and timestamps
➤ Technologies: Event Viewer, Timeline Analysis
➤ View Report: https://github.com/praisel-ekpenyong/case-studies`;
    this.addOutput(projectsContent);
  }

  showContact() {
    const contactAscii = `
  ____ ___  _   _ _____  _    ____ _____ 
 / ___/ _ \| \ | |_   _|/ \  / ___|_   _|
| |  | | | |  \| | | | / _ \| |     | |  
| |__| |_| | |\  | | |/ ___ \ |___  | |  
 \____\___/|_| \_| |_/_/   \_\____| |_|  `;

    const contactContent = `${contactAscii}

Contact Information:

Email:        ekpenyongpraisel@gmail.com
Location:     Nigeria (Open to Remote/Relocation)
Availability: Open for Tier 1 SOC Analyst roles

Social:
- GitHub:     github.com/praisel-ekpenyong
- LinkedIn:   linkedin.com/in/praiselekpenyong

Ready to defend your network.`;
    this.addOutput(contactContent);
  }

  listDirectory() {
    const listDirectory = `Case_Studies  Certifications  Resume.pdf  Logs  Tools`;
    this.addOutput(listDirectory);
  }

  changeDirectory(command) {
    this.addOutput(
      `bash: ${command}: Permission denied (Restricted Environment)\nType 'pf -help' for available commands.`,
      "error"
    );
  }

  async switchToGUI() {
    this.isLoading = true;
    this.addOutput("[INFO] Switching to GUI mode...");

    // Remove setTimeout and directly switch after loader
    await showCommonLoader();
    document.getElementById("terminalInterface").style.display = "none";
    document.getElementById("guiInterface").style.display = "block";
    initGUI();
    this.isLoading = false;
  }

  async showViewSelector() {
    this.isLoading = true;
    this.addOutput("[INFO] Returning to mode selection...");

    // Remove setTimeout and directly switch after loader
    await showCommonLoader();
    document.getElementById("terminalInterface").style.display = "none";
    document.getElementById("viewSelector").style.display = "flex";
    this.isLoading = false;
  }

  clearTerminal() {
    const outputs = this.terminalContent.querySelectorAll(".terminal-output");
    outputs.forEach((output, index) => {
      if (index > 0) output.remove();
    });
  }

  addOutput(content, type = "") {
    const output = document.createElement("div");
    output.className = `terminal-output ${type}`;
    output.style.whiteSpace = "pre-wrap";

    if (
      content.includes("██") ||
      content.includes("➤") ||
      content.includes("____") // Check for ASCII art underscores
    ) {
      output.innerHTML = `<div class="ascii-art">${content}</div>`;
    } else {
      output.textContent = content;
    }

    this.terminalContent.insertBefore(output, this.currentInputContainer);
    this.scrollToBottom();
  }

  clearInput() {
    if (this.currentInput) {
      this.currentInput.value = "";
    }
  }

  createNewPrompt() {
    const newInputContainer = document.createElement("div");
    newInputContainer.className = "terminal-input-container";
    newInputContainer.id = "currentInput";
    newInputContainer.innerHTML = `
              <span class="terminal-prompt">praisel@soc-analyst:~$</span>
              <input type="text" class="terminal-input" autocomplete="off" spellcheck="false">
              <span class="terminal-cursor"></span>
            `;

    this.terminalContent.replaceChild(
      newInputContainer,
      this.currentInputContainer
    );
    this.currentInputContainer = newInputContainer;
    this.currentInput = newInputContainer.querySelector(".terminal-input");

    // Reattach event listeners
    if (this.currentInput) {
      this.currentInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.executeCommand();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          this.navigateHistory(-1);
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          this.navigateHistory(1);
        } else if (e.key === "Tab") {
          e.preventDefault();
          this.autoComplete();
        }
      });
    }

    this.focusInput();
    this.scrollToBottom();
  }

  focusInput() {
    if (this.currentInput) {
      this.currentInput.focus();
    }
  }

  scrollToBottom() {
    this.terminalContent.scrollTop = this.terminalContent.scrollHeight;
  }
}

// GUI initialization
function initGUI() {
  // Mobile menu toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      hamburger.innerHTML = navLinks.classList.contains("active")
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });
  }

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks) {
        navLinks.classList.remove("active");
        if (hamburger) {
          hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
      }
    });
  });

  // Switch to terminal from GUI
  const switchToTerminalBtn = document.getElementById("switchToTerminal");
  if (switchToTerminalBtn) {
    switchToTerminalBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      await showCommonLoader();

      document.getElementById("guiInterface").style.display = "none";
      document.getElementById("terminalInterface").style.display = "flex";

      if (!window.terminal) {
        window.terminal = new TerminalPortfolio();
      }
      window.terminal.focusInput();
    });
  }

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });

        if (navLinks && navLinks.classList.contains("active")) {
          navLinks.classList.remove("active");
          if (hamburger) {
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
          }
        }
      }
    });
  });

  // Animate skill bars
  function animateSkillBars() {
    const skillLevels = document.querySelectorAll(".skill-level");
    skillLevels.forEach((skill) => {
      const level = skill.getAttribute("data-level");
      skill.style.width = level + "%";
    });
  }

  // Typing animation
  function initTypingAnimation() {
    const textElement = document.getElementById("typed-text");
    if (!textElement) return;

    const texts = [
      "SOC Analyst Tier 1",
      "Blue Team Defender",
      "Threat Hunter",
      "Incident Responder"
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
      const currentText = texts[textIndex];

      if (isDeleting) {
        textElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        textElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = 1000;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingSpeed = 500;
      }

      setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
  }

  // Initialize animations
  function initAnimations() {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
      });
    }

    animateSkillBars();
    initTypingAnimation();
    window.addEventListener("scroll", highlightNavSection);
    highlightNavSection();
  }

  // Highlight current section in navigation
  function highlightNavSection() {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links a");

    let currentSection = "";
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  // Initialize EmailJS
  // NOTE: You must sign up for EmailJS to get your own Public Key, otherwise this form won't work.
  // Visit https://www.emailjs.com/ to create an account.
  (function () {
    // emailjs.init("YOUR_PUBLIC_KEY_HERE"); 
  })();

  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      
      // If you haven't set up EmailJS yet, this alert will show.
      alert("Note: To make this form functional, you need to sign up for EmailJS and add your Public Key in script.js");
      
      /* // UNCOMMENT THIS BLOCK ONCE YOU HAVE YOUR EMAILJS KEY
      const submitBtn = this.querySelector(".submit-btn");
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      emailjs.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", this)
        .then(() => {
          alert("✅ Message sent successfully!");
          contactForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        })
        .catch((error) => {
          alert("❌ Failed to send message.");
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        });
      */
    });
  }

  initAnimations();
}

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  initMatrix();

  // View selection event listeners
  const terminalOption = document.getElementById("terminalOption");
  const guiOption = document.getElementById("guiOption");

  if (terminalOption) {
    terminalOption.addEventListener("click", async function () {
      document.getElementById("viewSelector").style.display = "none";

      await showCommonLoader();

      document.getElementById("terminalInterface").style.display = "flex";
      if (!window.terminal) {
        window.terminal = new TerminalPortfolio();
      }
      window.terminal.focusInput();
    });
  }

  if (guiOption) {
    guiOption.addEventListener("click", async function () {
      document.getElementById("viewSelector").style.display = "none";

      await showCommonLoader();

      document.getElementById("guiInterface").style.display = "block";
      initGUI();
    });
  }
});
