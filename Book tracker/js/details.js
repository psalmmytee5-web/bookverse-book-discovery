// ================= GET SELECTED BOOK =================

const book =
    JSON.parse(localStorage.getItem("selectedBook"));

const detailsContainer =
    document.getElementById("detailsContainer");


// ================= CHECK BOOK =================

if (book) {

    detailsContainer.innerHTML = `

        <div class="col-lg-8">

            <div class="card shadow-lg border-0 overflow-hidden">

                <div class="row g-0">

                    <!-- BOOK COVER -->

                    <div class="col-md-5">

                        <img
                            src="${book.cover}"
                            alt="${book.title}"
                            class="img-fluid w-100 h-100"
                            style="object-fit: cover; min-height: 500px;"
                        >

                    </div>


                    <!-- BOOK INFORMATION -->

                    <div class="col-md-7">

                        <div class="card-body p-4 p-lg-5">

                            <span class="badge bg-primary mb-3">
                                📚 Book Details
                            </span>


                            <h1 class="fw-bold mb-3">
                                ${book.title}
                            </h1>


                            <p class="fs-5 text-muted">

                                <i class="bi bi-person"></i>

                                <strong>Author:</strong>
                                ${book.author}

                            </p>


                            <p class="text-muted">

                                <i class="bi bi-calendar3"></i>

                                <strong>First Published:</strong>
                                ${book.year}

                            </p>


                            <hr class="my-4">


                            <h5 class="fw-bold">
                                📖 Want to read this book?
                            </h5>


                            <p class="text-muted">

                                Open the book's Open Library page
                                to check whether a full reading,
                                borrowing, or preview option is available.

                            </p>


                            <!-- OPEN LIBRARY -->

                            ${
                                book.libraryUrl

                                ?

                                `

                                <a
                                    href="${book.libraryUrl}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="btn btn-primary btn-lg w-100 mb-3"
                                >

                                    <i class="bi bi-book me-2"></i>

                                    Read / Preview Book

                                </a>

                                `

                                :

                                `

                                <button
                                    class="btn btn-secondary btn-lg w-100 mb-3"
                                    disabled
                                >

                                    📕 Reading Preview Unavailable

                                </button>

                                `

                            }


                            <!-- BACK BUTTON -->

                            <button
                                onclick="window.location.href='index.html'"
                                class="btn btn-outline-primary w-100"
                            >

                                <i class="bi bi-arrow-left me-2"></i>

                                Back to Search

                            </button>


                        </div>

                    </div>

                </div>

            </div>

        </div>

    `;

}


// ================= NO BOOK SELECTED =================

else {

    detailsContainer.innerHTML = `

        <div class="col-md-7">

            <div class="card shadow border-0 text-center p-5">

                <div style="font-size: 60px;">
                    📚
                </div>


                <h3 class="fw-bold mt-3">
                    No Book Selected
                </h3>


                <p class="text-muted">
                    Please return to the Home page and
                    select a book first.
                </p>


                <button
                    onclick="window.location.href='index.html'"
                    class="btn btn-primary"
                >

                    <i class="bi bi-search me-2"></i>

                    Discover Books

                </button>

            </div>

        </div>

    `;

}