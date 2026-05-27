const $profileAvatar = document.getElementById("profileAvatar");
const $profileName = document.getElementById("profileName");
const $profileUsername = document.getElementById("profileUsername");
const $totalClicks = document.getElementById("totalClicks");
const $totalLinks = document.getElementById("totalLinks");
const $shortenForm = document.getElementById("shortenForm");
const $urlInput = document.getElementById("urlInput");
const $resultContainer = document.getElementById("resultContainer");
const $shortenedUrl = document.getElementById("shortenedUrl");
const $btnCopy = document.getElementById("btnCopy");
const $linksTableBody = document.getElementById("linksTableBody");
const $emptyState = document.getElementById("emptyState");

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
};

const getUserData = () => {
    const userCookie = getCookie("user");
    if (userCookie) {
        try {
            return JSON.parse(decodeURIComponent(userCookie));
        } catch { }
    }
    return null;
};

const loadUserProfile = () => {
    const user = getUserData();
    if (!user) {
        window.location.href = "/";
        return;
    }

    const displayName = user.name || user.login;
    $profileName.textContent = displayName;
    $profileUsername.textContent = `@${user.login}`;
    $profileAvatar.src = user.avatar_url;
};

const loadStats = async () => {
    try {
        const response = await fetch("/profile/api/stats");
        if (response.ok) {
            const data = await response.json();
            $totalClicks.textContent = formatNumber(data.total_clicks || 0);
            $totalLinks.textContent = formatNumber(data.total_links || 0);
        }
    } catch (error) {
        console.error("Failed to load stats:", error);
    }
};

const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
};

const loadLinks = async () => {
    try {
        const response = await fetch("/profile/api/links");
        if (response.ok) {
            const links = await response.json();
            renderLinks(links);
        }
    } catch (error) {
        console.error("Failed to load links:", error);
    }
};

const renderLinks = (links) => {
    if (!links || links.length === 0) {
        $linksTableBody.innerHTML = "";
        $emptyState.style.display = "block";
        return;
    }

    $emptyState.style.display = "none";
    $linksTableBody.innerHTML = links.map((link) => `
        <tr>
            <td>
                <a href="/${link.code}" class="short-link-cell" target="_blank">
                    LinkFlow.io/${link.code}
                </a>
            </td>
            <td class="original-url-cell" title="${link.redirect}">
                ${link.redirect}
            </td>
            <td class="clicks-cell">${link.clicks || 0}</td>
            <td>
                <div class="actions-cell">
                    <button class="btn-action" onclick="window.open('/${link.code}', '_blank')" title="View">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                    </button>
                    <button class="btn-action delete" onclick="deleteLink('${link.id}')" title="Delete">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
};

window.deleteLink = async (id) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
        const response = await fetch(`/profile/api/links/${id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            loadLinks();
            loadStats();
        }
    } catch (error) {
        console.error("Failed to delete link:", error);
    }
};



const onSubmit = async (event) => {
    event.preventDefault();
    const url = $urlInput.value.trim();

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
    loadLinks();
    loadStats();
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
    } catch { }
};

const init = () => {
    loadUserProfile();
    loadStats();
    loadLinks();

    if ($shortenForm) {
        $shortenForm.addEventListener("submit", onSubmit);
    }

    if ($btnCopy) {
        $btnCopy.addEventListener("click", () => {
            const url = $shortenedUrl?.textContent;
            if (url) copyToClipboard(url);
        });
    }
};

document.addEventListener("DOMContentLoaded", init);
