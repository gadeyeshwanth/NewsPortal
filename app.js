const apiKey = "291e7c0bf9434bf88497178a9a69e0ef";

if (window.location.pathname.includes("index.html") || window.location.pathname === "/" || window.location.pathname.endsWith("/")) {
    window.onload = () => {
        bindSearchButton();
        bindCategoryButtons();
        loadRandomArticles();
    };
}

if (window.location.pathname.includes("articles.html")) {
    window.onload = () => {
        bindSearchButton();
        bindCategoryButtons();
        loadArticlesFromQueryParams();
    };
}

function bindSearchButton() {
    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) {
        searchBtn.addEventListener("click", function (event) {
            event.preventDefault();
            const query = document.getElementById("searchInput").value.trim();
            if (query) {
                window.location.href = `articles.html?query=${encodeURIComponent(query)}`;
            }
        });
    }
}

function bindCategoryButtons() {
    const categoryLinks = document.querySelectorAll(".category-bar a");
    categoryLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const category = this.getAttribute("data-category");
            if (category) {
                window.location.href = `articles.html?category=${encodeURIComponent(category)}`;
            }
        });
    });
}

async function loadRandomArticles() {
    const url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=${apiKey}`;
    
    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.status === "ok" && data.articles.length > 0) {
            displayRandomArticles(data.articles);
        } else {
            console.error("No articles found:", data.message);
            document.getElementById("random-articles").innerHTML = "<p>No articles found.</p>";
        }
    } catch (error) {
        console.error("Error fetching articles:", error);
        document.getElementById("random-articles").innerHTML = "<p>Error loading articles.</p>";
    }
}

function displayRandomArticles(articles) {
    const container = document.getElementById("random-articles");
    container.innerHTML = "";

    const selected = articles.sort(() => 0.5 - Math.random()).slice(0, 6);

    selected.forEach((article, index) => {
        const card = document.createElement("div");
        card.className = "article-card";
        card.innerHTML = `
            <img src="${article.urlToImage || 'https://via.placeholder.com/300x180'}" alt="Image" style="width:100%; height:180px; object-fit:cover;">
            <div style="padding: 1rem;">
                <h3 style="font-size:1.1rem;">${article.title}</h3>
                <p style="font-size:0.9rem;">${article.description || "No description available."}</p>
                <a href="${article.url}" target="_blank">Read More</a>
            </div>
        `;

        container.appendChild(card);
    });

    localStorage.setItem("randomArticles", JSON.stringify(selected));
}

async function loadArticlesFromQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("query");
    const category = params.get("category");

    let url = "";

    if (query) {
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=12&apiKey=${apiKey}`;
    } else if (category) {
        url = `https://newsapi.org/v2/top-headlines?country=us&category=${encodeURIComponent(category)}&pageSize=12&apiKey=${apiKey}`;
    } else {
        document.getElementById("articles-list").innerHTML = "<p>No search or category provided.</p>";
        return;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.status === "ok" && data.articles.length > 0) {
            displayArticles(data.articles);
        } else {
            document.getElementById("articles-list").innerHTML = `<p>No articles found: ${data.message}</p>`;
        }
    } catch (error) {
        console.error("Error fetching articles:", error);
        document.getElementById("articles-list").innerHTML = "<p>Error loading articles.</p>";
    }
}

function displayArticles(articles) {
    const container = document.getElementById("articles-list");
    container.innerHTML = "";

    articles.forEach((article) => {
        const card = document.createElement("div");
        card.className = "article-card";
        card.innerHTML = `
            <img src="${article.urlToImage || 'https://via.placeholder.com/300x180'}" alt="Image" style="width:100%; height:180px; object-fit:cover;">
            <div style="padding: 1rem;">
                <h3 style="font-size:1.1rem;">${article.title}</h3>
                <p style="font-size:0.9rem;">${article.description || "No description available."}</p>
                <a href="${article.url}" target="_blank">Read More</a>
            </div>
        `;
        container.appendChild(card);
    });
}
