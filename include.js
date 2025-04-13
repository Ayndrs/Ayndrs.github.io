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

    fetch("components/videoModal.html")
      .then(res => res.text())
      .then(data => {
        document.getElementById("videoModal-placeholder").innerHTML = data;

        const container = document.querySelector(".video-preview"),
        video = container.querySelector("video"),
        background = container.querySelector("img"),
        modal = document.querySelector(".video-modal"),
        youtubeContainer = modal.querySelector(".video");
    
        container.onmouseover = () => {
            video.classList.add("is-animated");
            video.play();
            setTimeout(() => {
                background.classList.remove("is-animated");
            }, 500)
        }
        
        container.onmouseout = () => {
            background.classList.add("is-animated");
            setTimeout(() => {
                video.classList.remove("is-animated");
                video.pause();
            }, 500)
        }
        
        let iframeCreated = false;
        let videoIframe;
        
        container.onclick = () => {
            modal.classList.replace('none', 'show');
        
            setTimeout(() => {
                const youtubeContainer = modal.querySelector(".video");
                modal.classList.replace("inactive", "active");
        
                if (!iframeCreated) {
                    videoIframe = document.createElement("iframe");
                    videoIframe.src = 'https://www.youtube-nocookie.com/embed/558apeBjatI?si=IZKUqTPrItnINPmp?autoplay=1';
                    videoIframe.title = 'YouTube video player';
                    videoIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
                    videoIframe.allowFullscreen = true;
                    videoIframe.frameBorder = '0';
                    youtubeContainer.appendChild(videoIframe);
        
                    iframeCreated = true;
                }
                else {
                    videoIframe.src = 'https://www.youtube-nocookie.com/embed/558apeBjatI?si=IZKUqTPrItnINPmp?autoplay=1';
                }
            }, 100)
        }

        modal.addEventListener("click", (e) => {
          const youtubeContainer = modal.querySelector(".video");
          if (!youtubeContainer.contains(e.target)) {
              closeModal();
          }
        });

        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
              closeModal();
          }
        });

        function closeModal() {
          modal.classList.replace('active', 'inactive');

          if (videoIframe) {
              videoIframe.src = 'https://www.youtube-nocookie.com/embed/558apeBjatI?si=IZKUqTPrItnINPmp?autoplay=0';
          }

          setTimeout(() => {
              modal.classList.replace('show', 'none');
          }, 500);
        }

    });

    const yearSpan = document.getElementById("year");
      if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
      }
    });
});
  