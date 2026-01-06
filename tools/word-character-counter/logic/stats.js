// Time Estimation Logic

const WPM_READING = 200; // Average reading speed
const WPM_SPEAKING = 130; // Average speaking speed

function calculateTimeStats(wordCount) {
    const readingSeconds = (wordCount / WPM_READING) * 60;
    const speakingSeconds = (wordCount / WPM_SPEAKING) * 60;

    return {
        readingTime: readingSeconds,
        speakingTime: speakingSeconds
    };
}

let previousWordCount = null;

window.toolState.subscribe((state) => {
    if (state.counts.words !== previousWordCount) {
        previousWordCount = state.counts.words;

        const timeStats = calculateTimeStats(state.counts.words);
        window.toolState.updateStats(timeStats);
    }
});
