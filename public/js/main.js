/* ── Punchline reveal ─────────────────────────────────────────────────────── */
const revealBtn   = document.getElementById("revealBtn");
const punchline   = document.getElementById("punchline");

if (revealBtn && punchline) {
  revealBtn.addEventListener("click", () => {
    punchline.style.display = "block";
    punchline.animate(
      [{ opacity: 0, transform: "translateY(8px)" },
       { opacity: 1, transform: "translateY(0)" }],
      { duration: 350, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" }
    );
    revealBtn.remove();
  });
}

/* ── Loading state on form submit ────────────────────────────────────────── */
const form      = document.getElementById("jokeForm");
const submitBtn = document.getElementById("submitBtn");

if (form && submitBtn) {
  form.addEventListener("submit", () => {
    submitBtn.classList.add("loading");
    submitBtn.querySelector(".btn-label").textContent = "Fetching…";
    submitBtn.querySelector(".btn-icon").textContent  = "⏳";
    submitBtn.disabled = true;
  });
}

/* ── Share joke ──────────────────────────────────────────────────────────── */
function shareJoke() {
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({ title: "JokeMeUp", text: "Check out this joke I got!", url });
  } else {
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.querySelector(".share-btn");
      if (btn) {
        btn.textContent = "Copied ✅";
        setTimeout(() => { btn.textContent = "Share 🔗"; }, 2000);
      }
    });
  }
}