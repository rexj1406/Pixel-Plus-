const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count");

function showMessage(message) {
  results.innerHTML = "";
  const paragraph = document.createElement("p");
  paragraph.className = "message";
  paragraph.textContent = message;
  results.appendChild(paragraph);
}

function render(items, query) {
  results.innerHTML = "";

  resultCount.textContent = `Showing ${items.length} results for "${query}"`;

  if (items.length === 0) {
    showMessage(`No images found for "${query}". Try another search.`);
    return;
  }

  items.forEach((item) => {
    const thumbnail = item.imageinfo?.[0]?.thumburl;

    // Skip any API result that doesn't have a usable thumbnail URL.
    if (!thumbnail) return;

    const card = document.createElement("article");
    card.className = "card";

    const img = document.createElement("img");
    img.src = thumbnail;
    img.alt = item.title || "Wikimedia Commons image";
    img.loading = "lazy";

    const caption = document.createElement("p");
    caption.textContent = item.title || "Untitled image";

    card.appendChild(img);
    card.appendChild(caption);
    results.appendChild(card);
  });

  if (!results.children.length) {
    showMessage("No displayable images were returned. Try another search.");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = input.value.trim();

  // Ignore empty searches.
  if (!query) return;

  const url =
    "https://commons.wikimedia.org/w/api.php?action=query" +
    "&generator=search" +
    "&gsrsearch=" + encodeURIComponent(query) +
    "&gsrnamespace=6" +
    "&gsrlimit=12" +
    "&prop=imageinfo" +
    "&iiprop=url" +
    "&iiurlwidth=300" +
    "&format=json" +
    "&origin=*";

  resultCount.textContent = "";
  showMessage("Searching for images...");

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    const items = Object.values(data.query?.pages || {});

    render(items, query);
  } catch (error) {
    console.error("Image search failed:", error);
    resultCount.textContent = "";
    showMessage("Unable to load images. Check your internet connection and try again.");
  }
});
