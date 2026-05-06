const API_KEY = "f4a01021";

const searchInputRaw = document.getElementById("search-box");
const searchResult = document.getElementById("movie-result");
const searchBtn = document.getElementById("search-btn");

// keep the last search on page reload
window.onload = function () {
    const lastSearch = localStorage.getItem("lastMovieSearch");
    if (lastSearch) {
        searchInputRaw.value = lastSearch;
        searchMovie(lastSearch);
    }
};

searchBtn.addEventListener('click', function () {
    const searchInput = searchInputRaw.value.trim();
    if (searchInput) {
        localStorage.setItem("lastMovieSearch", searchInput);
        searchMovie(searchInput);
    }
});

// general search
async function searchMovie(movieName) {
    try {
        const result = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${movieName}`);
        const data = await result.json();

        if (data.Response === "True") {
            displayList(data.Search);
        } else {
            searchResult.innerHTML = `<p class="error">Movie not found! Try again.</p>`;
        }
    } catch (err) {
        searchResult.innerHTML = `<p class="error">Connection error. Please try again later.</p>`;
    }
}

function displayList(movies) {
    searchResult.innerHTML = "";
    movies.forEach(movie => {
        const card = document.createElement("div");
        card.id = "movie-card";
        card.style.cursor = "pointer";
        card.onclick = () => getDetails(movie.Title);

        // broken poster link replacement
        let posterSrc = (movie.Poster !== "N/A") ? movie.Poster : "NoPoster_V1.jpg";

        card.innerHTML = `
            <img src="${posterSrc}" 
                 alt="poster" 
                 onerror="this.src='NoPoster_V1.jpg'; this.onerror=null;">
            <div id="movie-info">
                <p><b>${movie.Title}</b></p>
                <p>${movie.Year}</p>
            </div>`;
        searchResult.appendChild(card);
    });
}

// detailed search by title
async function getDetails(title) {
    const result = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(title)}&plot=full`);
    const details = await result.json();

    let posterSrc = (details.Poster !== "N/A") ? details.Poster : "NoPoster_V1.jpg";

    document.getElementById("welcome-txt").style.display = "none";
    searchResult.innerHTML = `
        <div id="movie-card" style="flex-direction: column; height: auto;">
            <button onclick="location.reload()" style="align-self: flex-start;">Back</button>
            <img src="${posterSrc}" 
                 alt="poster" 
                 onerror="this.src='NoPoster_V1.jpg'; this.onerror=null;" 
                 style="width: 200px; margin: 10px auto;">
            <div id="movie-info">
                <h2>${details.Title}</h2>
                <p><b>Year:</b> ${details.Year}</p>
                <p><b>Genre:</b> ${details.Genre}</p>
                <p><b>Director:</b> ${details.Director}</p>
                <p><b>Plot:</b> ${details.Plot}</p>
            </div>
        </div>`;
}