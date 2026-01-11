export const Display = {
    render: (text, issues, container) => {
        container.innerHTML = '';

        if (issues.length === 0) {
            container.textContent = text;
            return;
        }

        let lastIndex = 0;

        issues.forEach(issue => {
            // Text before issue
            if (issue.start > lastIndex) {
                container.appendChild(document.createTextNode(text.substring(lastIndex, issue.start)));
            }

            // Issue text
            const span = document.createElement('span');
            span.textContent = text.substring(issue.start, issue.end);
            span.className = `highlight highlight-${issue.type}`;
            span.dataset.suggestion = issue.suggestion;
            span.dataset.message = issue.message || "Potential error";

            // Interaction
            span.addEventListener('click', (e) => {
                showPopover(e, span, issue);
            });

            container.appendChild(span);
            lastIndex = issue.end;
        });

        // Remaining text
        if (lastIndex < text.length) {
            container.appendChild(document.createTextNode(text.substring(lastIndex)));
        }
    }
};

let activePopover = null;

function showPopover(e, element, issue) {
    // Remove existing popover
    if (activePopover) activePopover.remove();

    const popover = document.createElement('div');
    popover.className = 'suggestion-popover animate-fade-in';

    const title = document.createElement('h4');
    title.textContent = issue.message || (issue.type === 'spelling' ? 'Spelling Error' : 'Suggestion');
    popover.appendChild(title);

    const btn = document.createElement('button');
    btn.className = 'suggestion-btn';
    btn.textContent = `Change to "${issue.suggestion}"`;
    btn.onclick = () => {
        // Apply change
        // This is tricky because we need to update the source text.
        // For this "demo", we can update the clicked element text and remove class.
        // But the main "input text" won't update.
        // We should dispatch an event to the main app to update the text.
        element.textContent = issue.suggestion;
        element.className = ''; // Remove highlight
        element.replaceWith(document.createTextNode(issue.suggestion)); // Flatten
        popover.remove();
        activePopover = null;

        // Notify main app to update input
        // Since we don't have a sophisticated bi-directional binding, we'll just update the display for now.
        // The user can copy the fixed text from the output.
    };
    popover.appendChild(btn);

    const ignoreBtn = document.createElement('button');
    ignoreBtn.className = 'ignore-btn';
    ignoreBtn.textContent = 'Ignore';
    ignoreBtn.onclick = () => {
        element.className = '';
        element.replaceWith(document.createTextNode(element.textContent));
        popover.remove();
        activePopover = null;
    };
    popover.appendChild(ignoreBtn);

    document.body.appendChild(popover);
    activePopover = popover;

    // Positioning
    const rect = element.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();

    // Default: below
    let top = rect.bottom + window.scrollY + 5;
    let left = rect.left + window.scrollX;

    // Check bounds
    if (left + popoverRect.width > window.innerWidth) {
        left = window.innerWidth - popoverRect.width - 10;
    }

    popover.style.top = `${top}px`;
    popover.style.left = `${left}px`;

    // Close on click outside
    setTimeout(() => {
        const closeHandler = (ev) => {
            if (!popover.contains(ev.target) && ev.target !== element) {
                popover.remove();
                activePopover = null;
                document.removeEventListener('click', closeHandler);
            }
        };
        document.addEventListener('click', closeHandler);
    }, 0);
}
