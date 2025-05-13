// DOM Elements
const searchInput = document.getElementById("searchInput");
const quotesContainer = document.getElementById("quotesContainer");

// Store all quotes
let allQuotes = [];

// Display error message
function showError(message) {
  quotesContainer.innerHTML = `
    <div class="error-message">
      <p>${message}</p>
      <button class="retry-button" onclick="fetchQuotes()">Retry</button>
    </div>
  `;
}

// Fetch quotes from the API
async function fetchQuotes() {
  try {
    // Show loading state
    quotesContainer.innerHTML = "<p>Loading quotes...</p>";

    const response = await fetch("https://dummyjson.com/quotes");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.quotes || !Array.isArray(data.quotes)) {
      throw new Error("Invalid data format received from API");
    }

    allQuotes = data.quotes;
    displayQuotes(allQuotes);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    let errorMessage = "Failed to load quotes. ";

    if (error.message.includes("Failed to fetch")) {
      errorMessage += "Please check your internet connection.";
    } else if (error.message.includes("HTTP error")) {
      errorMessage += "The server returned an error.";
    } else {
      errorMessage += "An unexpected error occurred.";
    }

    showError(errorMessage);
  }
}

// Display quotes in the container
function displayQuotes(quotes) {
  quotesContainer.innerHTML = "";

  if (quotes.length === 0) {
    quotesContainer.innerHTML = "<p>No quotes found matching your search.</p>";
    return;
  }

  quotes.forEach((quote) => {
    const quoteCard = document.createElement("div");
    quoteCard.className = "quote-card";
    quoteCard.innerHTML = `
      <div class="quote-text">"${quote.quote}"</div>
      <div class="quote-author">- ${quote.author}</div>
    `;
    quotesContainer.appendChild(quoteCard);
  });
}

// Filter quotes based on search input
function filterQuotes(searchTerm) {
  const filteredQuotes = allQuotes.filter(
    (quote) =>
      quote.quote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.author.toLowerCase().includes(searchTerm.toLowerCase())
  );
  displayQuotes(filteredQuotes);
}

// Add event listener for search input
searchInput.addEventListener("input", (e) => {
  filterQuotes(e.target.value);
});

// Initial fetch of quotes
fetchQuotes();
