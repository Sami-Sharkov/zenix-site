document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
  
    // Toggle mobile navigation menu
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("nav-active");
    });
  
    // Smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
        // Close mobile nav after clicking a link
        if (navLinks.classList.contains("nav-active")) {
          navLinks.classList.remove("nav-active");
        }
      });
    });
  
    // Dummy contact form submission handling
    const contactForm = document.getElementById("contact-form");
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Message sent!");
      contactForm.reset();
    });
  });
  