# Project UT - Ultimate Tools

A collection of high-quality, free, privacy-focused online tools designed for developers, writers, and digital creators.

## 🚀 Features

*   **Privacy First:** All data processing happens client-side in your browser. No data is sent to our servers.
*   **Offline Capable:** Tools are optimized for weak networks (India-first mindset) and can work without an internet connection once loaded via Progressive Web App (PWA) architecture.
*   **Fast & Lightweight:** Minimal dependencies, no external frameworks (like React/Vue), and efficient code ensure instant load times.
*   **Dark Mode:** Built-in dark theme (Navy/Slate/Indigo) for comfortable usage.
*   **Mobile Friendly:** Fully responsive, beginner-friendly design that works perfectly on all devices.

## 🛠 Available Tools

### Text Tools
*   **[Grammar Checker](tools/grammar-checker/)**: Correct grammar, spelling, and style errors instantly using a client-side rule-based engine.
*   **[Text Summarizer](tools/text-summarizer/)**: Summarize long text, extract keywords, and check readability metrics.
*   **[Text Formatter](tools/text-formatter/)**: Clean, format, and transform text (remove duplicates, fix spacing, etc.).
*   **[Text Case Converter](tools/text-case-converter/)**: Convert text between Uppercase, Lowercase, Title Case, CamelCase, and more.
*   **[Word & Character Counter](tools/word-character-counter/)**: Real-time analysis of words, characters, sentences, and paragraphs.

### Image Tools
*   **[Image Format Converter](tools/image-format-converter/)**: Convert images between PNG, JPG, WEBP, BMP, and TIFF formats entirely in the browser.
*   **[Image Background Remover](tools/image-background-remover/)**: Remove image backgrounds using client-side AI (WASM).
*   **[Image Compressor](tools/image-compressor/)**: Compress images to save space.
*   **[Compress Image to KB](tools/compress-image-to-kb/)**: Compress images to an exact target file size (e.g., 10KB, 50KB).
*   **[Image Upscaler](tools/image-upscaler/)**: Enlarge images (2x, 4x, 8x) with optional sharpening.
*   **[Image to Text Converter (OCR)](tools/image-to-text-converter/)**: Extract text from images using Tesseract.js.

### SEO & Web Utilities
*   **[Meta Tag Generator](tools/meta-tag-generator/)**: Generate SEO-friendly meta tags.
*   **[Robots.txt Generator](tools/robots-txt-generator/)**: Easily create robots.txt files.
*   **[Schema Markup Generator](tools/schema-markup-generator/)**: Generate structured data for your website.
*   **[XML Sitemap Generator](tools/xml-sitemap-generator/)**: Generate sitemaps.
*   **[Slug Generator](tools/slug-generator/)**: Create URL-friendly slugs.
*   **[Keyword Density Checker](tools/keyword-density-checker/)**: Check keyword density in your content.
*   **[Heading Extractor](tools/heading-extractor/)**: Extract headings from a webpage.
*   **[Image Alt Checker](tools/image-alt-checker/)**: Check for missing alt tags.
*   **[URL Encoder/Decoder](tools/url-encoder-decoder/)**: Safely encode or decode URLs for web usage.
*   **[UTM Link Builder](tools/utm-link-builder/)**: Build tracking links.
*   **[QR Code Generator](tools/qr-code-generator/)**: Create custom QR codes for URLs, text, Wi-Fi, and more.

### Social Media & Content Generators
*   **[Social Media SEO Generator](tools/social-media-seo-generator/)**: Optimize content for social platforms.
*   **[Hashtag Generator](tools/hashtag-generator/)**: Generate relevant hashtags.
*   **[LinkedIn Headline Generator](tools/linkedin-headline-generator/)**: Create catchy LinkedIn headlines.
*   **[Product Description Optimizer](tools/product-description-optimizer/)**: Improve product descriptions for sales.
*   **[GitHub README Generator](tools/github-readme-generator/)**: Generate professional README files for your repos.

### Calculators
*   **[Age Calculator](tools/age-calculator/)**: Calculate age precisely.
*   **[BMI Calculator](tools/bmi-calculator/)**: Calculate Body Mass Index.

### Security Tools
*   **[Password Generator](tools/password-generator/)**: Generate strong, secure, and random passwords with customizable options.

## 💻 Tech Stack

*   **Core:** HTML5, Vanilla JavaScript (ES6+)
*   **Styling:** Custom CSS (Modular structure per tool, without external frameworks)
*   **Architecture:** Static site, zero backend logic for tools (purely client-side processing, Canvas API, WASM).
*   **PWA:** Dual PWA architecture (Root and micro-PWAs per tool).

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

This project follows a strict structure where each tool is isolated in its own directory with dedicated HTML, CSS, and JS.
All processing must be strictly client-side to ensure user privacy and fast loading.
