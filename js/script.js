// Define themes with their respective styles
const themes = {
    none: { background: null, color: null, font: null, fontSize: null, fontWeight: null },
    quiet: { background: "#4A4A4D", color: "#EBEBF4", font: "'Publico', serif", fontSize: "17px" },
    paper: { background: "#EEEDED", color: "#303030", font: "'Charter', serif", fontSize: "16px" },
    bold: { background: "#ffffff", color: "#1C1C1E", font: "'San Francisco Bold', sans-serif", fontSize: "18px", fontWeight: "bold" },
    calm: { background: "#EEE2CB", color: "#302D28", font: "'Canela', serif", fontSize: "17px" },
    focus: { background: "#FFFCF5", color: "#333231", font: "'Proxima Nova', sans-serif", fontSize: "18px" },
};

// Load fonts dynamically (Google Fonts or custom sources)
const loadFont = (fontName, url) => {
    if (!document.getElementById(`font-${fontName}`)) {
        const link = document.createElement("link");
        link.id = `font-${fontName}`;
        link.rel = "stylesheet";
        link.href = url;
        document.head.appendChild(link);
    }
};

// Load specified fonts
loadFont("Proxima Nova", "https://fonts.googleapis.com/css2?family=Proxima+Nova:wght@400;700&display=swap");
loadFont("Publico", "https://fonts.googleapis.com/css2?family=Publico:wght@400;700&display=swap");
loadFont("Charter", "https://fonts.googleapis.com/css2?family=Charter:wght@400;700&display=swap");
loadFont("Canela", "https://fonts.googleapis.com/css2?family=Canela:wght@400;700&display=swap");


// Target the specific elements
const postContent = document.querySelector(".entry-content"); // Post content
const postHeader = document.querySelector(".wp-block-post-title"); // Post header

// Apply the selected theme globally
const applyTheme = (theme) => {
    const body = document.body;
    if (body && themes[theme]) {
        const { background, color, font, fontWeight, fontSize } = themes[theme];

        body.style.background = background || "";

        postContent.style.color = postHeader.style.color = color || "";
        postContent.style.fontFamily = postHeader.style.fontFamily = font || "inherit";

        postContent.style.fontFamily = postHeader.style.fontFamily = font || "inherit";

        postContent.style.fontWeight = fontWeight || "normal";
        postContent.style.fontSize = fontSize || "inherit";
    }

    // Highlight the active theme button
    document.querySelectorAll(".themes button").forEach((button) => {
        button.classList.remove("active");
    });
    const activeButton = document.querySelector(
        `.themes button[data-theme="${theme}"]`
    );
    if (activeButton) activeButton.classList.add("active");
};

// Render the theme buttons dynamically
const renderThemeButtons = () => {
    const themeContainer = document.querySelector(".themes");
    Object.keys(themes).forEach((theme) => {
        const { background, color, font } = themes[theme];
        loadFont(font);

        const button = document.createElement("button");
        button.dataset.theme = theme;
        
        // Add the "None" icon and label
        if (theme === "none") {
            button.innerHTML = `<span style="font-size: 20px; color: gray;">🚫</span>`;
        } else {
            button.innerHTML = `
                <div style="font-size: 20px;">Aa</div>
                <div class="theme-name">${theme.charAt(0).toUpperCase() + theme.slice(1)}</div>
            `;
            button.style.background = background;
            button.style.color = color;
            button.style.fontFamily = font;
        }

        button.addEventListener("click", () => applyTheme(theme));
        themeContainer.appendChild(button);
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.createElement("div");
    modal.id = "font-size-modal";
    modal.innerHTML = `
        <button id="theme-btn">Aa</button>
        <div id="theme-settings">
            <h3>Themes & Settings</h3>
            <div class="themes"></div>
            <div class="font-size">
                <button id="decrease-font">A-</button>
                <button id="increase-font">A+</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const themeToggleBtn = document.getElementById("theme-btn");
    const themeSettings = document.getElementById("theme-settings");

    themeToggleBtn.addEventListener("click", () => {
        themeSettings.style.display =
            themeSettings.style.display === "block" ? "none" : "block";
    });

    document.getElementById("increase-font").addEventListener("click", () => {

        const currentSize = parseInt(window.getComputedStyle(postContent).fontSize);
        postContent.style.fontSize = `${currentSize + 2}px`;

    });

    document.getElementById("decrease-font").addEventListener("click", () => {
        const currentSize = parseInt(window.getComputedStyle(postContent).fontSize);
        postContent.style.fontSize = `${currentSize - 2}px`;
    });

    renderThemeButtons();
    applyTheme("original");
});