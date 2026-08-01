/* i18n — toggle ES/EN con lang/*.json */
(() => {
  const STORAGE_KEY = "mariel-lang";
  const DEFAULT = "es";
  let dicts = {};

  async function loadDict(lang) {
    if (dicts[lang]) return dicts[lang];
    const res = await fetch(`lang/${lang}.json`);
    if (!res.ok) throw new Error(`No se pudo cargar lang/${lang}.json`);
    dicts[lang] = await res.json();
    return dicts[lang];
  }

  function apply(dict, lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    if (dict["meta.title"]) document.title = dict["meta.title"];
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && dict["meta.description"]) {
      metaDesc.setAttribute("content", dict["meta.description"]);
    }
    document.querySelectorAll(".lang-toggle span").forEach((s) => {
      s.classList.toggle("active", s.dataset.lang === lang);
    });
    localStorage.setItem(STORAGE_KEY, lang);
  }

  async function setLang(lang) {
    try {
      const dict = await loadDict(lang);
      apply(dict, lang);
    } catch (err) {
      console.warn("i18n:", err.message);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("langToggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const next = document.documentElement.lang === "es" ? "en" : "es";
        setLang(next);
      });
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved !== DEFAULT) setLang(saved);
    else {
      document
        .querySelectorAll('.lang-toggle span[data-lang="es"]')
        .forEach((s) => s.classList.add("active"));
    }
  });
})();
