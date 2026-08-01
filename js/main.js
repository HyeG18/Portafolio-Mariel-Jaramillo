/* main.js — nav, animaciones, embeds de reels */
document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Nav: sombra al hacer scroll ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  const burger = document.getElementById("navBurger");
  const links = document.getElementById("navLinks");
  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    links.classList.toggle("open");
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      burger.classList.remove("open");
      links.classList.remove("open");
    })
  );

  /* ---------- Animaciones reveal ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Barras de métricas ---------- */
  const metrics = document.querySelector(".metrics");
  if (metrics) {
    const metricsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            metrics.classList.add("in-view");
            metricsObserver.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    metricsObserver.observe(metrics);
  }

  /* ---------- Reels: click para cargar embed de Instagram ---------- */
  document.querySelectorAll(".reel").forEach((reel) => {
    reel.addEventListener("click", () => {
      if (reel.classList.contains("reel--loaded")) return;
      const url = reel.dataset.reel;
      if (!url) return;
      const iframe = document.createElement("iframe");
      iframe.src = `${url}embed/captioned/`;
      iframe.allow = "encrypted-media; clipboard-write";
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute("loading", "lazy");
      reel.innerHTML = "";
      reel.appendChild(iframe);
      reel.classList.add("reel--loaded");
    });
  });
});
