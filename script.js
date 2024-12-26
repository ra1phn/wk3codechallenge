const baseURL = "http://localhost:3000/films";

// Fetch and display the first movie details
fetch(`${baseURL}/1`)
  .then((response) => response.json())
  .then((data) => displayMovieDetails(data));

// Fetch and display all movies in the menu
fetch(baseURL)
  .then((response) => response.json())
  .then((movies) => populateMovieMenu(movies));

// Display movie details
function displayMovieDetails(movie) {
  document.getElementById("movie-poster").src = movie.poster;
  document.getElementById("movie-title").textContent = movie.title;
  document.getElementById("movie-runtime").textContent = `Runtime: ${movie.runtime} mins`;
  document.getElementById("movie-showtime").textContent = `Showtime: ${movie.showtime}`;
  const availableTickets = movie.capacity - movie.tickets_sold;
  document.getElementById("movie-tickets").textContent = `Available Tickets: ${availableTickets}`;
  const buyButton = document.getElementById("buy-ticket");
  buyButton.textContent = availableTickets > 0 ? "Buy Ticket" : "Sold Out";
  buyButton.disabled = availableTickets === 0;
  buyButton.onclick = () => purchaseTicket(movie);
}

// Populate movie menu
function populateMovieMenu(movies) {
  const menu = document.getElementById("films");
  menu.innerHTML = "";
  movies.forEach((movie) => {
    const li = document.createElement("li");
    li.textContent = movie.title;
    li.classList.add("film");
    if (movie.capacity - movie.tickets_sold === 0) {
      li.classList.add("sold-out");
    }
    li.onclick = () => displayMovieDetails(movie);
    menu.appendChild(li);
  });
}

// Purchase a ticket
function purchaseTicket(movie) {
  if (movie.capacity - movie.tickets_sold > 0) {
    movie.tickets_sold++;
    displayMovieDetails(movie);
    persistTicketsSold(movie);
  }
}

// Persist ticket purchases
function persistTicketsSold(movie) {
  fetch(`${baseURL}/${movie.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tickets_sold: movie.tickets_sold }),
  });
}
