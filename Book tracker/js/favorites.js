const favoritesContainer = document.getElementById("favoritesContainer");

function displayFavorites() {

    const favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    favoritesContainer.innerHTML = "";

    if (favorites.length === 0) {

        favoritesContainer.innerHTML = `
            <div class="text-center mt-5">
                <h3>❤️ No favorite books yet.</h3>
                <p>Go back to Home and discover some books!</p>
            </div>
        `;

        return;
    }

    favorites.forEach((book, index) => {

        favoritesContainer.innerHTML += `
            <div class="col-md-4 col-lg-3 mb-4">

                <div class="card h-100 shadow-sm">

                    <img
                        src="${book.cover}"
                        class="card-img-top"
                        alt="${book.title}"
                        style="height:320px; object-fit:cover;"
                    >

                    <div class="card-body">

                        <h5 class="card-title">
                            ${book.title}
                        </h5>

                        <p class="text-muted">
                            ${book.author}
                        </p>

                        <p class="text-secondary">
                            Published: ${book.year}
                        </p>

                        <button
                            class="btn btn-danger w-100"
                            onclick="removeFavorite(${index})"
                        >
                            🗑️ Remove Favorite
                        </button>

                    </div>

                </div>

            </div>
        `;
    });
}


function removeFavorite(index) {

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    favorites.splice(index, 1);

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    displayFavorites();
}


// Display favorites when page loads
displayFavorites();