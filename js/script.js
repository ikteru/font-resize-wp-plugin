const themes = {
    original: {
        background: "#ffffff",
        color: "#000000",
        font: "'Arial', sans-serif",
    },
    bold: {
        background: "#ffffff",
        color: "#000000",
        fontWeight: "bold",
        font: "'Verdana', sans-serif",
    },
    calm: {
        background: "#faf3e0",
        color: "#5b4636",
        font: "'Georgia', serif",
    },
    quiet: {
        background: "#333333",
        color: "#ffffff",
        font: "'Courier New', monospace",
    },
    paper: {
        background: "#f3f3f3",
        color: "#000000",
        font: "'Times New Roman', serif",
    },
    focus: {
        background: "#ffffff",
        color: "#000000",
        font: "'Roboto', sans-serif",
        fontSize: "18px",
    },
};

// Dynamically load Google Fonts
const loadFont = (font) => {
    const fontName = font.replace(/['"]/g, "").split(",")[0].trim();
    if (!document.getElementById(`font-${fontName}`)) {
        const link = document.createElement("link");
        link.id = `font-${fontName}`;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(
            / /g,
            "+"
        )}:wght@400;700&display=swap`;
        document.head.appendChild(link);
    }
};

// Apply the selected theme globally
const applyTheme = (theme) => {
    const body = document.body;
    if (body && themes[theme]) {
        const { background, color, font, fontWeight, fontSize } = themes[theme];
        body.style.background = background || "";
        body.style.color = color || "";
        body.style.fontFamily = font || "inherit";
        body.style.fontWeight = fontWeight || "normal";
        body.style.fontSize = fontSize || "inherit";
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
        button.style.background = background;
        button.style.color = color;
        button.style.fontFamily = font;
        button.innerHTML = `
            <div style="font-size: 20px;">Aa</div>
            <div class="theme-name">${theme.charAt(0).toUpperCase() + theme.slice(1)}</div>
        `;
        button.addEventListener("click", () => applyTheme(theme));
        themeContainer.appendChild(button);
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.createElement("div");
    modal.id = "font-size-modal";
    modal.innerHTML = `
        <button id="font-size-toggle">aA</button>
        <div id="font-size-settings">
            <h3>Themes & Settings</h3>
            <div class="themes"></div>
            <div class="font-size">
                <button id="increase-font">A+</button>
                <button id="decrease-font">A-</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const toggleButton = document.getElementById("font-size-toggle");
    const settings = document.getElementById("font-size-settings");

    toggleButton.addEventListener("click", () => {
        settings.style.display =
            settings.style.display === "block" ? "none" : "block";
    });

    document.getElementById("increase-font").addEventListener("click", () => {
        const content = document.body;
        const currentSize = parseInt(window.getComputedStyle(content).fontSize);
        content.style.fontSize = `${currentSize + 2}px`;
    });

    document.getElementById("decrease-font").addEventListener("click", () => {
        const content = document.body;
        const currentSize = parseInt(window.getComputedStyle(content).fontSize);
        content.style.fontSize = `${currentSize - 2}px`;
    });

    renderThemeButtons();
    applyTheme("original");
});