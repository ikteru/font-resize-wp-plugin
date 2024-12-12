document.addEventListener("DOMContentLoaded", () => {
    // Define themes with their respective styles
    const themes = {
        none: { background: null, color: null, font: null },
        quiet: { background: "#4A4A4D", color: "#EBEBF4", font: "'Publico', serif" },
        paper: { background: "#EEEDED", color: "#303030", font: "'Charter', serif" },
        bold: { background: "#ffffff", color: "#1C1C1E", font: "'San Francisco Bold', sans-serif" },
        calm: { background: "#EEE2CB", color: "#302D28", font: "'Canela', serif" },
        focus: { background: "#FFFCF5", color: "#333231", font: "'Proxima Nova', sans-serif" },
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

    // Default values
    const defaultFontSize = "16px";
    const defaultTheme = "none";

    // Persist theme and font size in localStorage
    const savedTheme = localStorage.getItem("theme") || defaultTheme;
    const savedFontSize = localStorage.getItem("fontSize") || defaultFontSize;

    // Apply the theme
    const applyTheme = (theme) => {
        const body = document.body;

        if (body && themes[theme]) {
            const { background, color, font } = themes[theme];

            body.style.background = background || "";
            postContent.style.color = postHeader.style.color = color || "";
            postContent.style.fontFamily = postHeader.style.fontFamily = font || "inherit";
        }

        // Highlight the active theme button
        document.querySelectorAll(".themes button").forEach((button) => {
            button.classList.remove("active");
        });
        const activeButton = document.querySelector(
            `.themes button[data-theme="${theme}"]`
        );
        if (activeButton) activeButton.classList.add("active");

        // Save the theme to localStorage
        localStorage.setItem("theme", theme);
    };

    // Apply the font size
    const applyFontSize = (fontSize) => {
        postContent.style.fontSize = fontSize;
        localStorage.setItem("fontSize", fontSize); // Save font size to localStorage
    };

    // Reset everything to defaults
    const resetToDefault = () => {
        localStorage.removeItem("theme");
        localStorage.removeItem("fontSize");

        applyTheme(defaultTheme);
        applyFontSize(defaultFontSize);
    };

    // Render the theme buttons dynamically
    const renderThemeButtons = () => {
        const themeContainer = document.querySelector(".themes");

        Object.keys(themes).forEach((theme) => {
            const { background, color, font } = themes[theme];

            const button = document.createElement("button");
            button.dataset.theme = theme;

            // Add the "None" icon and label
            if (theme === "none") {
                button.innerHTML = `<span style="font-size: 20px; color: gray;">🚫</span>`;
                button.disabled = true; // Disable "None" by default
                button.style.opacity = 0.5; // Style to indicate it's disabled
            } else {
                button.innerHTML = `
                    <div style="font-size: 20px;">Aa</div>
                    <div class="theme-name">${theme.charAt(0).toUpperCase() + theme.slice(1)}</div>
                `;
                button.style.background = background;
                button.style.color = color;
                button.style.fontFamily = font;
            }

            button.addEventListener("click", () => {
                applyTheme(theme);

                // Enable the "None" button once a theme is applied
                const noneButton = document.querySelector(`button[data-theme="none"]`);
                if (theme !== "none" && noneButton) {
                    noneButton.disabled = false;
                    noneButton.style.opacity = 1;
                }
            });

            themeContainer.appendChild(button);
        });

        // Add the "Reset to Default" button
        const resetButton = document.createElement("button");
        resetButton.id = "reset-default";
        resetButton.textContent = "Reset to Default";

        resetButton.addEventListener("click", resetToDefault);

        const resetToDefaultsDiv = document.querySelector("#reset-defaults");
        resetToDefaultsDiv.appendChild(resetButton);
    };

    // Initialize the font size and theme buttons
    const initFontControls = () => {
        document.getElementById("increase-font").addEventListener("click", () => {
            const currentSize = parseInt(window.getComputedStyle(postContent).fontSize);
            const newSize = `${currentSize + 2}px`;
            applyFontSize(newSize);
        });

        document.getElementById("decrease-font").addEventListener("click", () => {
            const currentSize = parseInt(window.getComputedStyle(postContent).fontSize);
            const newSize = `${currentSize - 2}px`;
            applyFontSize(newSize);
        });

        // Apply the saved font size on load
        applyFontSize(savedFontSize);
    };

    // Add the modal and controls
    const modal = document.createElement("div");
    modal.id = "font-size-modal";
    modal.innerHTML = `
        <button id="theme-btn">Aa</button>
        <div id="theme-settings">
            <h3>Themes & Settings</h3>

            <hr style="margin-bottom: 15px; opacity: 0.5">
            
            <div class="themes"></div>
            <div class="font-size">
                <button id="decrease-font">A-</button>
                <button id="increase-font">A+</button>
            </div>
            <hr style="margin-top: 15px; opacity:0.5;">
            <div id="reset-defaults">
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Toggle the theme settings modal
    const themeToggleBtn = document.getElementById("theme-btn");
    const themeSettings = document.getElementById("theme-settings");
    themeToggleBtn.addEventListener("click", () => {
        themeSettings.style.display =
            themeSettings.style.display === "block" ? "none" : "block";
    });

    // Render buttons and apply saved settings
    renderThemeButtons();
    initFontControls();
    applyTheme(savedTheme);
});