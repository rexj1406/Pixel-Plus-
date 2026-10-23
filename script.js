const form = document.querySelector("#search-form");
const input = document.querySelector("#search-input");
const button = document.querySelector("#search-button");
const statusBox = document.querySelector("#status");
const resultsGrid = document.querySelector("#results");
const resultsTitle = document.querySelector("#results-title");
const resultsCount = document.querySelector("#results-count");
const resultsSection = document.querySelector(".results-section");

const API = "https://commons.wikimedia.org/w/api.php";

function showStatus(type, message) {
  statusBox.className = `status ${type}`;
  const symbol = type === "loading"
    ? '<div class="spinner" aria-hidden="true"></div>'
    : `<div class="status-symbol" aria-hidden="true">${type === "error" ? "!" : type === "empty" ? "⌕" : "✦"}</div>`;
  statusBox.innerHTML = `${symbol}<p>${message}</p>`;
  statusBox.hidden = false;
}

function setLoading(isLoading) {
  button.disabled = isLoading;
  button.innerHTML = isLoading ? "Searching…" : 'Search <span aria-hidden="true">↗</span>';
  resultsSection.setAttribute("aria-busy", String(isLoading));
}

function clearResults() {
  resultsGrid.innerHTML = "";
}

function renderResults(items) {
  clearResults();
  statusBox.hidden = true;

  items.forEach((item, index) => {
    const title = item.title || "Untitled image";
    const imageUrl = item.imageinfo?.[0]?.thumburl || item.imageinfo?.[0]?.url;
    if (!imageUrl) return;

    const card = document.createElement("article");
    card.className = "image-card";
    card.style.animationDelay = `${Math.min(index * 55, 400)}ms`;

    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = title.replace(/^File:/, "").replace(/\.[^/.]+$/, "");
    image.loading = "lazy";

    const info = document.createElement("div");
    info.className = "card-info";

    const heading = document.createElement("h3");
    heading.textContent = title.replace(/^File:/, "");

    const link = document.createElement("a");
    link.href = item.imageinfo?.[0]?.descriptionurl || imageUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View source ↗";

    info.append(heading, link);
    card.append(image, info);
    resultsGrid.append(card);
  });

  const shown = resultsGrid.children.length;
  if (shown === 0) {
    showStatus("empty", "No usable images found. Try another search.");
    resultsCount.textContent = "Try a different topic.";
  } else {
    statusBox.hidden = true;
    resultsCount.textContent = `Showing ${shown} result${shown === 1 ? "" : "s"} for “${input.value.trim()}”.`;
  }
}

async function searchImages(query) {
  const cleanedQuery = query.trim();
  if (!cleanedQuery) return;

  clearResults();
  resultsTitle.textContent = "Searching the world…";
  resultsCount.textContent = "Please wait while we find images.";
  showStatus("loading", "Searching…");
  setLoading(true);

  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    generator: "search",
    gsrsearch: cleanedQuery,
    gsrnamespace: "6",
    gsrlimit: "18",
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: "640"
  });

  try {
    const response = await fetch(`${API}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const pages = data.query?.pages || {};
    const items = Object.values(pages);

    resultsTitle.textContent = `Explore “${cleanedQuery}”`;
    if (items.length === 0) {
      showStatus("empty", `No results for “${cleanedQuery}”. Try another search.`);
      resultsCount.textContent = "No images found.";
      return;
    }

    renderResults(items);
  } catch (error) {
    console.error("Image search failed:", error);
    clearResults();
    resultsTitle.textContent = "Search interrupted";
    resultsCount.textContent = "We couldn't load images this time.";
    showStatus("error", "Something went wrong. Please check your connection and try again.");
  } finally {
    setLoading(false);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchImages(input.value);
});

document.querySelectorAll("[data-query]").forEach((chip) => {
  chip.addEventListener("click", () => {
    input.value = chip.dataset.query;
    searchImages(chip.dataset.query);
  });
});
