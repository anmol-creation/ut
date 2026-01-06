// Main Entry Point

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Theme
    window.toolTheme.initTheme();

    // Initialize Events
    window.toolEvents.initEvents();

    // Initial Render
    window.toolRender.render(window.toolState.state);

    console.log("Word & Character Counter initialized.");
});
