// include.js
document.addEventListener("DOMContentLoaded", () => {
    fetch("components/nav.html")
      .then(res => res.text())
      .then(data => {
        document.getElementById("nav-placeholder").innerHTML = data;
      });
  
    fetch("components/footer.html")
      .then(res => res.text())
      .then(data => {
        document.getElementById("footer-placeholder").innerHTML = data;
  
        const yearSpan = document.getElementById("year");
        if (yearSpan) {
          yearSpan.textContent = new Date().getFullYear();
        }
      });
  });
  