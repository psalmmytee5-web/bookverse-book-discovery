const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const bookContainer = document.getElementById("bookContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
const resultsMessage = document.getElementById("resultsMessage");


// ================= SEARCH BUTTON =================

searchBtn.addEventListener("click", () => {

    const searchTerm = searchInput.value.trim();

    if (searchTerm === "") {

        resultsMessage.textContent =
            "Please enter a book title, author or subject.";

        searchInput.focus();

        return;
    }

    searchBooks(searchTerm);
});


// ================= ENTER KEY SEARCH =================

searchInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {
        searchBtn.click();
    }

});


// ================= CATEGORY SEARCH =================

const categoryButtons = document.querySelectorAll(".category-btn");

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        const category = button.textContent
            .replace(/[^\w\s]/gi, "")
            .trim();

        searchInput.value = category;

        searchBooks(category);

    });

});


// ================= SEARCH BOOKS =================

async function searchBooks(query) {

    bookContainer.innerHTML = "";

    loadingSpinner.style.display = "block";

    resultsMessage.textContent =
        `Searching for "${query}"...`;

    searchBtn.disabled = true;

    try {

        const response = await fetch(
            `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch books");
        }

        const data = await response.json();

        loadingSpinner.style.display = "none";

        if (!data.docs || data.docs.length === 0) {

            resultsMessage.textContent =
                `No books found for "${query}".`;

            bookContainer.innerHTML = `
                <div class="col-12 text-center py-5">

                    <div style="font-size: 50px;">
                        📚
                    </div>

                    <h3 class="mt-3">
                        No books found
                    </h3>

                    <p class="text-muted">
                        Try another title, author or subject.
                    </p>

                </div>
            `;

            return;
        }

        const resultCount =
            data.numFound || data.docs.length;

        resultsMessage.textContent =
            `Showing ${Math.min(resultCount, 12)} of ${resultCount.toLocaleString()} results for "${query}".`;

        displayBooks(data.docs);

    } catch (error) {

        console.error("Search error:", error);

        loadingSpinner.style.display = "none";

        resultsMessage.textContent =
            "Something went wrong while searching.";

        bookContainer.innerHTML = `
            <div class="col-12 text-center py-5">

                <div style="font-size: 50px;">
                    ⚠️
                </div>

                <h3 class="mt-3">
                    Unable to load books
                </h3>

                <p class="text-muted">
                    Please check your internet connection and try again.
                </p>

                <button
                    class="btn btn-primary mt-2"
                    onclick="searchBooks('${query.replace(/'/g, "\\'")}')">
                    🔄 Try Again
                </button>

            </div>
        `;

    } finally {

        searchBtn.disabled = false;

    }

}


// ================= DISPLAY BOOKS =================

function displayBooks(books) {

    bookContainer.innerHTML = "";

    books.slice(0, 12).forEach(book => {

        const cover = book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : "https://via.placeholder.com/180x250?text=No+Cover";

        const author = book.author_name
            ? book.author_name[0]
            : "Unknown Author";

        const year = book.first_publish_year || "N/A";


        // Open Library book key
        const bookKey = book.key || "";


        // Create Open Library page URL
        const openLibraryUrl = bookKey
            ? `https://openlibrary.org${bookKey}`
            : "";


        // ================= CHECK FAVORITES =================

        const favorites =
            JSON.parse(localStorage.getItem("favorites")) || [];

        const isFavorite = favorites.some(item =>
            item.title === book.title &&
            item.author === author
        );


        // ================= BOOK CARD =================

        const card = `
        <div class="col-md-6 col-lg-4 col-xl-3 mb-4">

            <div class="card book-card h-100 shadow-sm border-0">

                <img
                    src="${cover}"
                    class="card-img-top"
                    alt="${book.title}"
                    style="height:320px; object-fit:cover;"
                >

                <div class="card-body d-flex flex-column">

                    <h5 class="card-title">
                        ${book.title}
                    </h5>

                    <p class="text-muted mb-1">
                        ${author}
                    </p>

                    <small class="text-secondary mb-3">
                        Published: ${year}
                    </small>


                    <div class="mt-auto">

                        <!-- VIEW DETAILS -->

                        <button
                            class="btn btn-primary btn-sm details-btn w-100 mb-2"

                            data-title="${book.title}"

                            data-author="${author}"

                            data-year="${year}"

                            data-cover="${cover}"

                            data-library-url="${openLibraryUrl}"
                        >

                            <i class="bi bi-info-circle me-1"></i>

                            View Details

                        </button>


                        <!-- FAVORITE -->

                        <button
                            class="btn ${isFavorite ? "btn-success" : "btn-danger"} w-100 favorite-btn"

                            ${isFavorite ? "disabled" : ""}

                            onclick='addToFavorites(
                                ${JSON.stringify({
                                    title: book.title,
                                    author: author,
                                    year: year,
                                    cover: cover
                                }).replace(/'/g, "&apos;")},
                                this
                            )'
                        >

                            ${isFavorite
                                ? "✔ Added to Favorites"
                                : "❤️ Add to Favorites"
                            }

                        </button>

                    </div>

                </div>

            </div>

        </div>
        `;

        bookContainer.innerHTML += card;

    });


    // ================= DETAILS BUTTONS =================

    const detailsButtons =
        document.querySelectorAll(".details-btn");


    detailsButtons.forEach(button => {

        button.addEventListener("click", () => {

            const selectedBook = {

                title: button.dataset.title,

                author: button.dataset.author,

                year: button.dataset.year,

                cover: button.dataset.cover,

                libraryUrl: button.dataset.libraryUrl

            };


            localStorage.setItem(
                "selectedBook",
                JSON.stringify(selectedBook)
            );


            window.location.href = "details.html";

        });

    });

}


// ================= ADD TO FAVORITES =================

function addToFavorites(book, button) {

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];


    const exists = favorites.some(item =>
        item.title === book.title &&
        item.author === book.author
    );


    if (exists) {

        button.innerHTML =
            "✔ Added to Favorites";

        button.classList.remove("btn-danger");

        button.classList.add("btn-success");

        button.disabled = true;

        showToast();

        return;
    }


    favorites.push(book);


    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );


    button.innerHTML =
        "✔ Added to Favorites";

    button.classList.remove("btn-danger");

    button.classList.add("btn-success");

    button.disabled = true;


    showToast();

}


// ================= FAVORITE TOAST =================

function showToast() {

    const toastElement =
        document.getElementById("favoriteToast");


    if (!toastElement) {
        return;
    }


    const toast =
        new bootstrap.Toast(toastElement);


    toast.show();

}