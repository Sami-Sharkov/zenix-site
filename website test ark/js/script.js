document.addEventListener("DOMContentLoaded", function () {
  
  // --- 1. Mobile Hamburger Menu ---
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("nav-active");
      // Animate hamburger to X
      const bars = hamburger.querySelectorAll(".bar");
      if (navLinks.classList.contains("nav-active")) {
        bars[0].style.transform = "rotate(-45deg) translate(-5px, 6px)";
        bars[1].style.opacity = "0";
        bars[2].style.transform = "rotate(45deg) translate(-5px, -6px)";
      } else {
        bars[0].style.transform = "none";
        bars[1].style.opacity = "1";
        bars[2].style.transform = "none";
      }
    });

    // Close menu when clicking a link
    const links = navLinks.querySelectorAll("a");
    links.forEach(link => {
      link.addEventListener("click", () => {
        if (navLinks.classList.contains("nav-active")) {
          navLinks.classList.remove("nav-active");
          const bars = hamburger.querySelectorAll(".bar");
          bars[0].style.transform = "none";
          bars[1].style.opacity = "1";
          bars[2].style.transform = "none";
        }
      });
    });
  }

  // --- 2. Smooth Scrolling ---
  const smoothLinks = document.querySelectorAll('a[href^="#"]');
  smoothLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      if(this.getAttribute("href") === "#") return;
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);
      if (target) {
        // Offset for fixed header
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // --- 3. Scroll Reveal Animation ---
  const reveals = document.querySelectorAll('.reveal');
  function reveal() {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;
    
    reveals.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        el.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', reveal);
  reveal(); // Trigger on load

  // --- 4. Copy IP Functionality ---
  const toast = document.getElementById("toast");
  
  function bindCopyButtons() {
    const copyBtns = document.querySelectorAll(".copy-ip-btn");
    copyBtns.forEach(btn => {
      // Avoid duplicate binding
      if (btn.dataset.bound) return;
      btn.dataset.bound = true;
      
      btn.addEventListener("click", function () {
        const ipToCopy = this.getAttribute("data-ip");
        navigator.clipboard.writeText(ipToCopy).then(() => {
          // Temporary styling change or text change depending on button type
          const originalHTML = this.innerHTML;
          if (this.querySelector(".btn-text")) {
             this.querySelector(".btn-text").innerText = "IP Copied!";
          } else {
             this.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
          }
          
          // Show Toast
          toast.classList.add("show");
          
          setTimeout(() => {
            this.innerHTML = originalHTML;
            toast.classList.remove("show");
          }, 2500);
        }).catch(err => {
          console.error("Failed to copy IP", err);
          alert("Failed to copy IP. The IP is: " + ipToCopy);
        });
      });
    });
  }
  
  // Initial bind for static buttons
  bindCopyButtons();

  // --- 5. Fetch Server Player Count & Data (Combined for Zenix Ark) ---
  const playerCountDisplay = document.getElementById("player-count");
  const serverGridDisplay = document.getElementById("server-grid"); // New Grid container
  
  if (playerCountDisplay || serverGridDisplay) {
    const TARGET_IP = "65.21.137.238";
    
    // Master List of all 12 Maps with corresponding Connection Ports for matching Battlemetrics
    const ARK_MAPS = [
      { name: "The Island", queryPort: 27015, connPort: 7777 },
      { name: "Ragnarok", queryPort: 27017, connPort: 7779 },
      { name: "The Center", queryPort: 27019, connPort: 7781 },
      { name: "Extinction", queryPort: 27021, connPort: 7783 },
      { name: "Fjordur", queryPort: 27023, connPort: 7785 },
      { name: "Genesis 1", queryPort: 27025, connPort: 7787 },
      { name: "Scorched Earth", queryPort: 27027, connPort: 7789 },
      { name: "Valguero", queryPort: 27029, connPort: 7791 },
      { name: "Lost Island", queryPort: 27031, connPort: 7793 },
      { name: "Crystal Isles", queryPort: 27033, connPort: 7795 },
      { name: "Aberration", queryPort: 27035, connPort: 7797 },
      { name: "Genesis 2", queryPort: 27037, connPort: 7799 }
    ];

    let serverCardsHTML = "";
    
    // Search Battlemetrics for "Zenix" and grab up to 100 results to be safe.
    const BM_API_URL = "https://api.battlemetrics.com/servers?filter[search]=zenix&page[size]=100";

    fetch(BM_API_URL)
      .then(response => response.json())
      .then(data => {
        let totalPlayers = 0;
        let onlineServersCount = 0;

        // Build a quick lookup dictionary by connection port from Battlemetrics data
        const bmData = {};
        if (data && data.data) {
          data.data.forEach(server => {
            if (server.attributes.ip === TARGET_IP) {
               bmData[server.attributes.port] = server.attributes;
            }
          });
        }

        // Loop through our statically defined 12 servers
        ARK_MAPS.forEach(mapDef => {
          const attrs = bmData[mapDef.connPort];
          
          let players = 0;
          let maxPlayers = 100; // Default max players
          let isOnline = false;
          
          if (attrs) {
             players = attrs.players;
             maxPlayers = attrs.maxPlayers;
             isOnline = attrs.status === "online";
             
             if (isOnline) {
                totalPlayers += players;
                onlineServersCount++;
             }
          }
          
          // Generate grid card
          const onlineClass = isOnline ? "live-dot" : "";
          const statusColor = isOnline ? "#2ecc71" : "#e74c3c";
          
          serverCardsHTML += `
            <div class="map-card" style="animation: fadeInUp 0.5s ease-out forwards; animation-delay: ${Math.random() * 0.3}s; opacity:0; transform:translateY(20px);">
              <div class="map-header">
                <div class="map-name"><i class="fa-solid fa-map"></i> ${mapDef.name}</div>
                <div class="live-badge" style="color:${statusColor}">
                  ${isOnline ? `<div class="${onlineClass}" style="background:${statusColor}"></div>` : '<i class="fa-solid fa-xmark"></i>'}
                  ${players} / ${maxPlayers}
                </div>
              </div>
              <div class="map-ip" style="background:#1a1a2e;">${TARGET_IP}:${mapDef.queryPort}</div>
              <button class="map-join-btn copy-ip-btn" data-ip="${TARGET_IP}:${mapDef.queryPort}">
                <i class="fa-solid fa-plug"></i> Copy IP
              </button>
            </div>
          `;
        });

        playerCountDisplay.innerHTML = `<span style="font-weight: 400;">Zenix Ark (<span style="color: #00f2fe;">12</span> Maps):</span> <span style="color: #00f2fe; font-weight: bold;">${totalPlayers}</span> Players Online`;
        if (serverGridDisplay) serverGridDisplay.innerHTML = serverCardsHTML;
        
        // Re-bind copy handlers for new dynamically generated buttons
        bindCopyButtons();


      })
      .catch(error => {
        console.error("Error fetching player count:", error);
         // Graceful fallback
        if(playerCountDisplay) playerCountDisplay.innerText = "Zenix Ark: Servers Active";
        if(serverGridDisplay) serverGridDisplay.innerHTML = "<p style='color:#e74c3c; padding:20px'>Failed to fetch server data from Battlemetrics API</p>";
      });
  }

  // --- 6. Event Countdown Timer ---
  const cdDays = document.getElementById("cd-days");
  if (cdDays) {
    // Arbitrary target date: next Saturday 6 PM
    let targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + (6 - targetDate.getDay())); // next Saturday
    targetDate.setHours(18, 0, 0, 0);
    
    // If it's passed Saturday 6 PM, set to next week
    if (new Date() > targetDate) {
      targetDate.setDate(targetDate.getDate() + 7);
    }
    
    const cdHours = document.getElementById("cd-hours");
    const cdMins = document.getElementById("cd-minutes");
    const cdSecs = document.getElementById("cd-seconds");

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        cdDays.innerText = "00";
        cdHours.innerText = "00";
        cdMins.innerText = "00";
        cdSecs.innerText = "00";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      cdDays.innerText = days < 10 ? "0" + days : days;
      cdHours.innerText = hours < 10 ? "0" + hours : hours;
      cdMins.innerText = minutes < 10 ? "0" + minutes : minutes;
      cdSecs.innerText = seconds < 10 ? "0" + seconds : seconds;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();
  }

  // --- 7. Hero Particles Animation ---
  const canvas = document.getElementById("hero-particles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const colors = ["#00f2fe", "#4facfe", "#7f00ff", "#ffffff"];
    
    // Create 75 particles
    for (let i = 0; i < 75; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            dx: (Math.random() - 0.5) * 0.5,
            dy: (Math.random() - 0.5) * 0.5,
            maxOpacity: Math.random() * 0.5 + 0.1
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            // Move
            p.x += p.dx;
            p.y += p.dy;
            
            // Re-spawn if off-screen
            if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
                p.x = Math.random() * width;
                p.y = Math.random() * height;
            }
            
            // Draw
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.maxOpacity;
            ctx.fill();
            
            // Add subtle glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
  }

});