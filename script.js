// =====================================================
//  EDIT THIS PART ONLY: your real links live here.
//  Every link on the site that has data-link="..." reads from this.
// =====================================================
const CONFIG = {
  github: "bryan-1981",            // just the username, e.g. "bryanramirez"
  linkedin: "bryan-ramirez-687848324/",          // the part after linkedin.com/in/
  email: "bryan.ramirez.san@gmail.com",
  discord: "66bry"    // your Discord username (not the display name)
};

// ---------- 0. FILL IN LINKS ----------
document.querySelectorAll("[data-link]").forEach((a) => {
  const type = a.dataset.link;                       // reads data-link="github" from the HTML
  if (type === "github")   a.href = "https://github.com/" + CONFIG.github;
  if (type === "linkedin") a.href = "https://www.linkedin.com/in/" + CONFIG.linkedin;
  if (type === "email")  { a.href = "mailto:" + CONFIG.email; a.textContent = CONFIG.email; }
});

// ---------- 1. TYPING EFFECT ----------
const lines = [
  "Computer Science student",
  "Marine Corps Reservist",
  "aspiring Software Engineer",
  "from Phoenix, Arizona"
];
const typedEl = document.getElementById("typed");
let lineIdx = 0, charIdx = 0, deleting = false;

function type() {
  const current = lines[lineIdx];
  typedEl.textContent = current.slice(0, charIdx);   // first n characters = typing look

  if (!deleting && charIdx < current.length) {
    charIdx++; setTimeout(type, 70);
  } else if (!deleting) {
    deleting = true; setTimeout(type, 1200);
  } else if (charIdx > 0) {
    charIdx--; setTimeout(type, 35);
  } else {
    deleting = false;
    lineIdx = (lineIdx + 1) % lines.length;
    setTimeout(type, 300);
  }
}
type();

// ---------- 2. SCROLL REVEAL ----------
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("show"); });
}, { threshold: 0.1 });
document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

// ---------- 3. NAV HIGHLIGHT (scroll-spy) ----------
// rootMargin shrinks the "watch zone" to a thin band in the middle of the screen,
// so a section counts as current when it crosses the middle (works even for tall sections)
const links = document.querySelectorAll(".pills a");
const spyObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    }
  });
}, { rootMargin: "-45% 0px -45% 0px" });
document.querySelectorAll("section[id]").forEach((s) => spyObs.observe(s));

// ---------- 4. MOUSE EFFECTS ----------
const glow = document.getElementById("glow");
const decos = document.querySelectorAll(".deco");
document.addEventListener("mousemove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
  const x = e.clientX / window.innerWidth - 0.5;
  const y = e.clientY / window.innerHeight - 0.5;
  decos.forEach((d) => {
    const speed = Number(d.dataset.speed);
    d.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
  });
});

// ---------- 5. GITHUB PROJECTS (live from GitHub's free API) ----------
// async/await = "go fetch this from the internet, wait for the answer, then continue"
async function loadRepos() {
  if (CONFIG.github === "YOUR-USERNAME") return;     // username not set yet, keep the placeholder cards
  const grid = document.getElementById("repo-grid");
  try {
    const res = await fetch(`https://api.github.com/users/${CONFIG.github}/repos?sort=pushed&per_page=30`);
    if (!res.ok) throw new Error("GitHub said " + res.status);
    const repos = await res.json();                  // turns the response into a JS array
    const mine = repos.filter((r) => !r.fork).slice(0, 6); // skip forks, max 6
    if (mine.length === 0) return;

    grid.innerHTML = "";                             // clear placeholders
    mine.forEach((repo, i) => {
      // build the card with createElement + textContent (safe: it can never run injected HTML)
      const card = document.createElement("article");
      card.className = "card";

      const num = document.createElement("span");
      num.className = "num";
      num.textContent = String(i + 1).padStart(2, "0"); // 1 -> "01"

      const title = document.createElement("h3");
      title.textContent = repo.name;

      const desc = document.createElement("p");
      desc.textContent = repo.description || "No description yet.";

      const meta = document.createElement("p");
      meta.className = "meta";
      meta.textContent = [repo.language, repo.stargazers_count ? "★ " + repo.stargazers_count : ""].filter(Boolean).join("  ·  ");

      const link = document.createElement("a");
      link.href = repo.html_url;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "view code →";

      card.append(num, title, desc, meta, link);
      grid.appendChild(card);
    });
  } catch (err) {
    console.error("Couldn't load repos:", err);      // placeholders stay if it fails
  }
}
loadRepos();

// ---------- 6. PHOTO LIGHTBOX ----------
const lightbox = document.getElementById("lightbox");
const lightImg = lightbox.querySelector("img");
document.querySelectorAll(".gallery figure").forEach((fig) => {
  fig.addEventListener("click", () => {
    const img = fig.querySelector("img");
    if (!img) return;                                // placeholder star, nothing to enlarge
    lightImg.src = img.src;
    lightbox.classList.add("open");
  });
});
lightbox.addEventListener("click", () => lightbox.classList.remove("open"));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") lightbox.classList.remove("open"); });

// ---------- 7. DISCORD: copy username to clipboard ----------
// Discord can't link to a username, so the button copies it for people to paste into Discord
const discordBtn = document.getElementById("discord-btn");
discordBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(CONFIG.discord);        // clipboard API = copy to clipboard
    discordBtn.textContent = "Copied: " + CONFIG.discord;
  } catch (err) {
    discordBtn.textContent = CONFIG.discord;                    // if copy is blocked, just show it
  }
  setTimeout(() => { discordBtn.textContent = "Discord"; }, 3000);
});