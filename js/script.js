document.addEventListener("DOMContentLoaded", () => {
    // Check if we're on a single post page
    if (!document.body.classList.contains("single-post")) {
        return; // Exit if not on a single post
    }

    // Target the specific elements
    const postContent = document.querySelector(".entry-content"); // Post content
    const postHeader = document.querySelector(".wp-block-post-title"); // Post header

    // Function to capture original styles recursively
    const captureOriginalStyles = (element) => {
        const styles = {};
        styles.element = element;
        styles.originalStyle = {
            fontSize: window.getComputedStyle(element).fontSize,
            color: window.getComputedStyle(element).color,
            fontFamily: window.getComputedStyle(element).fontFamily,
            backgroundColor: window.getComputedStyle(element).backgroundColor,
        };

        // If the element has children, capture their styles as well
        styles.children = Array.from(element.children).map(captureOriginalStyles);
        return styles;
    };

    const originalStyles = captureOriginalStyles(postContent);

    // Function to restore original styles recursively
    const restoreOriginalStyles = (styles) => {
        const { element, originalStyle, children } = styles;
        element.style.fontSize = originalStyle.fontSize;
        element.style.color = originalStyle.color;
        element.style.fontFamily = originalStyle.fontFamily;
        element.style.backgroundColor = originalStyle.backgroundColor;

        // Restore styles for children
        children.forEach(restoreOriginalStyles);
    };

    // Define themes with their respective styles
    const themes = {
        none: { background: null, color: null, font: null },
        quiet: { background: "#4A4A4D", color: "#EBEBF4", font: "'Publico', serif" },
        paper: { background: "#EEEDED", color: "#303030", font: "'Charter', serif" },
        bold: { background: "#ffffff", color: "#1C1C1E", font: "'San Francisco Bold', sans-serif" },
        calm: { background: "#EEE2CB", color: "#302D28", font: "'Canela', serif" },
        focus: { background: "#FFFCF5", color: "#333231", font: "'Proxima Nova', sans-serif" },
    };

    // Apply the theme only when explicitly activated by the user
    const applyTheme = (theme) => {
        const body = document.body;

        if (body && themes[theme]) {
            const { background, color, font } = themes[theme];

            body.style.background = background || "";
            postContent.style.color = color || "";
            postContent.style.fontFamily = font || "inherit";

            // Apply styles to children of post content
            Array.from(postContent.children).forEach((child) => {
                child.style.color = color || "";
                child.style.fontFamily = font || "";
            });

            // Apply styles to the header
            postHeader.style.color = color || "";
            postHeader.style.fontFamily = font || "inherit";
        }

        // Highlight the active theme button
        document.querySelectorAll(".themes button").forEach((button) => {
            button.classList.remove("active");
        });

        const activeButton = document.querySelector(
            `.themes button[data-theme="${theme}"]`
        );
        if (activeButton) {
            activeButton.classList.add("active");
        }

        // Save the theme to localStorage
        localStorage.setItem("theme", theme);
    };

    // Apply font size changes only when explicitly modified by the user
    const applyFontSize = (fontSize) => {
        postContent.style.fontSize = fontSize;

        // Apply font size to children
        Array.from(postContent.children).forEach((child) => {
            child.style.fontSize = fontSize;
        });

        localStorage.setItem("fontSize", fontSize); // Save font size to localStorage
    };

    // Reset everything to the original state
    const resetToDefault = () => {
        localStorage.removeItem("theme");
        localStorage.removeItem("fontSize");

        // Restore original styles recursively
        restoreOriginalStyles(originalStyles);

        // Explicitly set the theme to "none" to reset the state
        const noneButton = document.querySelector(`button[data-theme="none"]`);
        if (noneButton) {
            noneButton.disabled = true; // Re-disable the "none" button
            noneButton.style.opacity = 0.3;
            noneButton.classList.add("active"); // Mark it as active
        }

        // Clear active state on other theme buttons
        document.querySelectorAll(".themes button").forEach((button) => {
            if (button.dataset.theme !== "none") {
                button.classList.remove("active");
            }
        });

        // Clear applied styles on the body
        document.body.style.background = originalStyles.originalStyle.backgroundColor;
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
                button.style.opacity = 0.3; // Style to indicate it's disabled
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

        // Do not apply saved font size on load, only when changed
        const savedFontSize = localStorage.getItem("fontSize");
        if (savedFontSize) {
            applyFontSize(savedFontSize);
        }
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


            <hr style="margin-top: 15px; opacity:0.5;">

            <div class="font-size">
                <button id="decrease-font">A-</button>
                <button id="increase-font">A+</button>
            </div>
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
});