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
        none: { background: null, color: null, font: null, pullquoteBg: null },
        quiet: { background: "#4A4A4D", color: "#EBEBF4", font: "'Publico', serif", pullquoteBg: "#5A5A5D" },
        paper: { background: "#EEEDED", color: "#303030", font: "'Charter', serif", pullquoteBg: "#D6D6D6" },
        bold: { background: "#ffffff", color: "#1C1C1E", font: "'San Francisco Bold', sans-serif", pullquoteBg: "#F0F0F0" },
        calm: { background: "#EEE2CB", color: "#302D28", font: "'Canela', serif", pullquoteBg: "#D2C8B5" },
        focus: { background: "#FFFCF5", color: "#333231", font: "'Proxima Nova', sans-serif", pullquoteBg: "#EDE6D6" },
    };


    const applyTheme = (theme) => {
        const body = document.body;
    
        if (theme === "none") {
            // Reset styles for pullquotes
            document.querySelectorAll(".wp-block-pullquote").forEach((pullquote) => {
                pullquote.style.removeProperty("background-color");
                pullquote.style.removeProperty("color");
    
                pullquote.querySelectorAll("blockquote, p").forEach((innerText) => {
                    innerText.style.removeProperty("background-color");
                    innerText.style.removeProperty("color");
                });
            });
    
            // Reset styles for standalone blockquotes
            document.querySelectorAll("blockquote:not(.wp-block-pullquote)").forEach((blockquote) => {
                blockquote.style.removeProperty("background-color");
                blockquote.style.removeProperty("color");
    
                blockquote.querySelectorAll("p").forEach((innerText) => {
                    innerText.style.removeProperty("background-color");
                    innerText.style.removeProperty("color");
                });
            });
    
            // Reset post content styles
            postContent.style.removeProperty("color");
            postContent.style.removeProperty("font-family");
    
            // Reset post header styles
            postHeader.style.removeProperty("color");
            postHeader.style.removeProperty("font-family");
    
            // Reset body background
            body.style.removeProperty("background");
    
            // Save the reset state
            localStorage.setItem("theme", "none");
    
            // Highlight the "none" button
            document.querySelectorAll(".themes button").forEach((button) => {
                button.classList.remove("active");
            });
            const noneButton = document.querySelector(`.themes button[data-theme="none"]`);
            if (noneButton) noneButton.classList.add("active");
    
            return;
        }
    
        // Apply theme-specific styles
        if (body && themes[theme]) {
            const { background, color, font, pullquoteBg } = themes[theme];
    
            // Apply body background
            body.style.setProperty("background", background || "", "important");
    
            // Apply post content styles
            postContent.style.setProperty("color", color || "", "important");
            postContent.style.setProperty("font-family", font || "inherit", "important");
    
            // Apply post header styles
            postHeader.style.setProperty("color", color || "", "important");
            postHeader.style.setProperty("font-family", font || "inherit", "important");
    
            // Update pullquote container and text
            document.querySelectorAll(".wp-block-pullquote").forEach((pullquote) => {
                pullquote.style.setProperty("background-color", pullquoteBg || "", "important");
                pullquote.style.setProperty("color", color || "", "important");
    
                pullquote.querySelectorAll("blockquote, p").forEach((innerText) => {
                    innerText.style.setProperty("background-color", "transparent", "important");
                    innerText.style.setProperty("color", color || "", "important");
                });
            });
    
            // Update standalone blockquote styling
            document.querySelectorAll("blockquote:not(.wp-block-pullquote)").forEach((blockquote) => {
                blockquote.style.setProperty("background-color", pullquoteBg || "", "important");
                blockquote.style.setProperty("color", color || "", "important");
    
                blockquote.querySelectorAll("p").forEach((innerText) => {
                    innerText.style.setProperty("background-color", "transparent", "important");
                    innerText.style.setProperty("color", color || "", "important");
                });
            });
    
            // Save the theme to localStorage
            localStorage.setItem("theme", theme);
    
            // Highlight the active theme button
            document.querySelectorAll(".themes button").forEach((button) => {
                button.classList.remove("active");
            });
            const activeButton = document.querySelector(
                `.themes button[data-theme="${theme}"]`
            );
            if (activeButton) activeButton.classList.add("active");
        }
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

    const resetToDefault = () => {
        // Remove theme and font size from localStorage
        localStorage.removeItem("theme");
        localStorage.removeItem("fontSize");
    
        // Restore original styles recursively
        restoreOriginalStyles(originalStyles);
    
        // Reset pullquote styles to their original state
        document.querySelectorAll(".wp-block-pullquote").forEach((pullquote) => {
            pullquote.style.removeProperty("background-color");
            pullquote.style.removeProperty("color");
    
            pullquote.querySelectorAll("blockquote, p").forEach((innerText) => {
                innerText.style.removeProperty("background-color");
                innerText.style.removeProperty("color");
            });
        });
    
        // Reset standalone blockquote styles to their original state
        document.querySelectorAll("blockquote:not(.wp-block-pullquote)").forEach((blockquote) => {
            blockquote.style.removeProperty("background-color");
            blockquote.style.removeProperty("color");
    
            // Reset text inside standalone blockquote
            blockquote.querySelectorAll("p").forEach((innerText) => {
                innerText.style.removeProperty("background-color");
                innerText.style.removeProperty("color");
            });
        });
    
        // Reset body background color
        document.body.style.removeProperty("background");
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