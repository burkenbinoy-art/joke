const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ── View engine ──────────────────────────────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ── Static files ─────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "public")));

// ── Body parser ───────────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── Helper: map a name to a joke category ────────────────────────────────────
// We derive a "personality" from the name so every name feels special.
function getCategoryFromName(name) {
  const categories = ["Programming", "Misc", "Dark", "Pun", "Spooky", "Christmas"];
  // Simple but deterministic: sum of char-codes modulo category count
  const sum = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return categories[sum % categories.length];
}

// ── Helper: personalise the joke text ────────────────────────────────────────
function personalise(text, name) {
  // Replace a handful of generic placeholders (if present) with the user's name.
  return text.replace(/\bsomeone\b/gi, name).replace(/\ba person\b/gi, name);
}

// ── Routes ────────────────────────────────────────────────────────────────────

// GET / — landing page
app.get("/", (req, res) => {
  res.render("index", { joke: null, error: null, name: "" });
});

// POST /joke — fetch a joke for the submitted name
app.post("/joke", async (req, res) => {
  const name = (req.body.name || "").trim();

  if (!name) {
    return res.render("index", {
      joke: null,
      error: "Please enter your name so we can personalise your joke!",
      name: "",
    });
  }

  const category = getCategoryFromName(name);

  try {
    const response = await axios.get(
      `https://v2.jokeapi.dev/joke/${category}`,
      {
        params: {
          blacklistFlags: "nsfw,racist,sexist,explicit",
          type: "twopart,single",
          amount: 1,
        },
        timeout: 8000,
      }
    );

    const data = response.data;

    if (data.error) {
      throw new Error(data.message || "JokeAPI returned an error.");
    }

    // Build a normalised joke object regardless of type
    const joke = {
      category: data.category,
      type: data.type,
      // twopart jokes have setup + delivery; single jokes have a single "joke" field
      setup: data.type === "twopart" ? personalise(data.setup, name) : null,
      delivery: data.type === "twopart" ? personalise(data.delivery, name) : null,
      single: data.type === "single" ? personalise(data.joke, name) : null,
      id: data.id,
    };

    return res.render("index", { joke, error: null, name });
  } catch (err) {
    console.error("[JokeAPI error]", err.message);

    // Friendly fallback message
    const errorMsg =
      err.response?.status === 429
        ? "We've been making too many requests. Please wait a moment and try again!"
        : "Couldn't fetch a joke right now. The API might be busy — try again in a few seconds.";

    return res.render("index", { joke: null, error: errorMsg, name });
  }
});

// GET /joke/json — JSON endpoint (bonus: useful for client-side fetch)
app.get("/joke/json", async (req, res) => {
  const name = (req.query.name || "You").trim();
  const category = getCategoryFromName(name);

  try {
    const response = await axios.get(
      `https://v2.jokeapi.dev/joke/${category}`,
      {
        params: { blacklistFlags: "nsfw,racist,sexist,explicit", amount: 1 },
        timeout: 8000,
      }
    );
    res.json({ success: true, data: response.data, category });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Joke App running at http://localhost:${PORT}`);
});