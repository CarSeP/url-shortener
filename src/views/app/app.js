const $form = document.querySelector("form");
const $resultContainer = document.getElementById("resultContainer");
const $shortenedUrl = document.getElementById("shortenedUrl");
const $btnCopy = document.getElementById("btnCopy");

const onSubmit = async (event) => {
    event.preventDefault();
    const url = event.target.urlInput.value.trim();

    const response = await fetch("/api", {
        method: "POST",
        body: JSON.stringify({ url }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        alert("An error has occurred");
        return;
    }

    const data = await response.json();
    printResponse(data);
};

const printResponse = (data) => {
    if (!$resultContainer || !$shortenedUrl) return;

    $shortenedUrl.textContent = data.newURL;
    $shortenedUrl.href = data.newURL;

    $resultContainer.style.display = "block";
    $resultContainer.classList.add("show");

    $btnCopy.classList.remove("copied");
    $btnCopy.innerHTML = `
        <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Copy
    `;
};

const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        $btnCopy.classList.add("copied");
        $btnCopy.innerHTML = `
            <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
        `;
        setTimeout(() => {
            $btnCopy.classList.remove("copied");
            $btnCopy.innerHTML = `
                <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy
            `;
        }, 2000);
    } catch (err) {
        console.error("Failed to copy:", err);
    }
};

if ($form) {
    $form.addEventListener("submit", onSubmit);
}

if ($btnCopy) {
    $btnCopy.addEventListener("click", () => {
        const url = $shortenedUrl?.textContent;
        if (url) copyToClipboard(url);
    });
}
