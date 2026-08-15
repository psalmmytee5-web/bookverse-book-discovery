const trackerContainer = document.getElementById("trackerContainer");

// Get books saved as favorites
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Get existing tracker
let readingTracker = JSON.parse(localStorage.getItem("readingTracker")) || [];

// Make sure old tracker books have a status
readingTracker = readingTracker.map(book => ({
    ...book,
    status: book.status || "Want to Read"
}));

// Add favorite books that are NOT already in the tracker
favorites.forEach(book => {

    const alreadyInTracker = readingTracker.some(
        item => item.title === book.title
    );

    if (!alreadyInTracker) {
        readingTracker.push({
            ...book,
            status: "Want to Read"
        });
    }
});

// Save tracker
localStorage.setItem(
    "readingTracker",
    JSON.stringify(readingTracker)
);
function updateStatistics() {

    const wantCount = readingTracker.filter(
        book => book.status === "Want to Read"
    ).length;

    const readingCount = readingTracker.filter(
        book => book.status === "Currently Reading"
    ).length;

    const completedCount = readingTracker.filter(
        book => book.status === "Completed"
    ).length;

    document.getElementById("wantCount").textContent = wantCount;
    document.getElementById("readingCount").textContent = readingCount;
    document.getElementById("completedCount").textContent = completedCount;
}

// Display the books in the tracker
function displayTracker() {

    trackerContainer.innerHTML = "";

    if (readingTracker.length === 0) {
        trackerContainer.innerHTML = `
            <div class="text-center mt-5">
                <h4>📚 No books in your tracker yet.</h4>
                <p>Add books to your favorites first.</p>
            </div>
        `;
        return;
    }

    readingTracker.forEach((book, index) => {

        trackerContainer.innerHTML += `
            <div class="col-md-4 col-lg-3">
                <div class="card h-100 shadow-sm">

                    <img src="${book.cover}"
                         class="card-img-top"
                         style="height: 300px; object-fit: cover;">

                    <div class="card-body d-flex flex-column">

                        <h5 class="card-title">${book.title}</h5>

                        <p class="text-muted">${book.author}</p>

                        <select class="form-select mb-3"
    onchange="updateStatus(${index}, this.value)">
    
    <option value="Want to Read" ${book.status === "Want to Read" ? "selected" : ""}>
        📚 Want to Read
    </option>

    <option value="Currently Reading" ${book.status === "Currently Reading" ? "selected" : ""}>
        📖 Currently Reading
    </option>

    <option value="Completed" ${book.status === "Completed" ? "selected" : ""}>
        ✅ Completed
    </option>

</select>
<p>
    Reading Progress:
    <span id="progress-${index}">${book.progress || 0}%</span>
</p>

<div class="progress mb-3" style="height: 10px;">
    <div
        id="progress-bar-${index}"
        class="progress-bar"
        role="progressbar"
        style="width: ${book.progress || 0}%;">
    </div>
</div>

<input
    type="range"
    min="0"
    max="100"
    value="${book.progress || 0}"
    oninput="updateProgress(${index}, this.value)"
    style="width: 100%;"
>

                        <button class="btn btn-danger mt-auto"
                                onclick="removeFromTracker(${index})">
                            🗑️ Remove
                        </button>

                    </div>
                </div>
            </div>
        `;
    
    });

    updateTrackerCounts();
    updateStatistics();
}
function updateTrackerCounts() {

    const wantCount = readingTracker.filter(
        book => book.status === "Want to Read"
    ).length;

    const readingCount = readingTracker.filter(
        book => book.status === "Currently Reading"
    ).length;

    const completedCount = readingTracker.filter(
        book => book.status === "Completed"
    ).length;

    document.getElementById("wantCount").textContent = wantCount;
    document.getElementById("readingCount").textContent = readingCount;
    document.getElementById("completedCount").textContent = completedCount;
}
// Update reading status
function updateStatus(index, status) {

    readingTracker[index].status = status;

    if (status === "Want to Read") {
        readingTracker[index].progress = 0;
    }

    if (status === "Completed") {
        readingTracker[index].progress = 100;
    }

    if (status === "Currently Reading") {
        if (readingTracker[index].progress === undefined) {
            readingTracker[index].progress = 0;
        }
    }

    localStorage.setItem(
        "readingTracker",
        JSON.stringify(readingTracker)
    );

    displayTracker();
}
function updateProgress(index, progress) {

    readingTracker[index].progress = Number(progress);

    localStorage.setItem(
        "readingTracker",
        JSON.stringify(readingTracker)
    );

    displayTracker();
}
function updateProgress(index, progress) {

    progress = Number(progress);

    readingTracker[index].progress = progress;

    localStorage.setItem(
        "readingTracker",
        JSON.stringify(readingTracker)
    );

    // Update percentage text
    const progressText = document.getElementById(`progress-${index}`);

    if (progressText) {
        progressText.textContent = `${progress}%`;
    }

    // Update visual progress bar
    const progressBar = document.getElementById(`progress-bar-${index}`);

    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}
// Remove book from tracker
function removeFromTracker(index) {

    readingTracker.splice(index, 1);

    localStorage.setItem(
        "readingTracker",
        JSON.stringify(readingTracker)
    );

    displayTracker();
}

// Load tracker
displayTracker();