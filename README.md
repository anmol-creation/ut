# UT.ac - Ultimate Tools

A collection of high-quality, free, privacy-focused online tools designed for developers, writers, and digital creators.

## 🚀 Features

*   **Privacy First:** All data processing happens client-side in your browser. No data is sent to our servers.
*   **Offline Capable:** Tools are optimized for weak networks and can work without an internet connection once loaded.
*   **Fast & Lightweight:** Minimal dependencies and efficient code ensure instant load times.
*   **Dark Mode:** Built-in dark theme for comfortable usage.
*   **Mobile Friendly:** Fully responsive design that works perfectly on all devices.

## 🛠 Available Tools

### Text Tools
*   **[Grammar Checker](tools/grammar-checker/)**: Correct grammar, spelling, and style errors instantly using a client-side rule-based engine.
*   **[Text Summarizer](tools/text-summarizer/)**: Summarize long text, extract keywords, and check readability metrics.
*   **[Text Formatter](tools/text-formatter/)**: Clean, format, and transform text (remove duplicates, fix spacing, etc.).
*   **[Text Case Converter](tools/text-case-converter/)**: Convert text between Uppercase, Lowercase, Title Case, CamelCase, and more.
*   **[Word & Character Counter](tools/word-character-counter/)**: Real-time analysis of words, characters, sentences, and paragraphs.

### Image Tools
*   **[Image Format Converter](tools/image-format-converter/)**: Convert images between PNG, JPG, WEBP, BMP, and TIFF formats entirely in the browser.

### Security Tools
*   **[Password Generator](tools/password-generator/)**: Generate strong, secure, and random passwords with customizable options.

### Web Utilities
*   **[QR Code Generator](tools/qr-code-generator/)**: Create custom QR codes for URLs, text, Wi-Fi, and more.
*   **[URL Encoder/Decoder](tools/url-encoder-decoder/)**: Safely encode or decode URLs for web usage.

## 💻 Tech Stack

*   **Core:** HTML5, Vanilla JavaScript (ES6+)
*   **Styling:** Tailwind CSS
*   **Icons:** Heroicons / SVG
*   **Architecture:** Static site, zero backend logic for tools.

## 🏃 Local Development

To run the project locally:

1.  Clone the repository.
2.  Navigate to the project root.
3.  Start a local server:

```bash
# Python 3
python3 -m http.server 8000
```

4.  Open your browser and visit `http://localhost:8000`.

## 📄 License

All tools are free to use.

## 🤝 Contributing

This project follows a strict structure where each tool is isolated in its own directory.
See the `AGENTS.md` file for coding guidelines if you wish to contribute.
