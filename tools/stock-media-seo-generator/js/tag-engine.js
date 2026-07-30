// Expands base AI keywords into comprehensive stock media tags, title, and description
class TagEngine {
    constructor() {
        // Broad category expansion dictionary
        // These map common MobileNet predictions or general concepts to stock-friendly tags
        this.dictionary = {
            'nature': ['outdoors', 'environment', 'scenic', 'landscape', 'natural', 'beautiful', 'wild', 'background', 'scenery', 'tranquil', 'peaceful'],
            'animal': ['wildlife', 'creature', 'fauna', 'mammal', 'pet', 'cute', 'natural', 'portrait', 'species', 'living'],
            'food': ['delicious', 'meal', 'tasty', 'nutrition', 'healthy', 'diet', 'fresh', 'cuisine', 'gourmet', 'snack', 'restaurant', 'dining'],
            'technology': ['digital', 'electronics', 'device', 'modern', 'innovation', 'smart', 'future', 'connection', 'network', 'computing'],
            'people': ['person', 'human', 'lifestyle', 'casual', 'adult', 'portrait', 'emotion', 'expression', 'concept', 'real'],
            'business': ['corporate', 'office', 'work', 'professional', 'success', 'job', 'finance', 'career', 'team', 'management'],
            'city': ['urban', 'architecture', 'building', 'street', 'metropolis', 'town', 'structure', 'exterior', 'modern', 'skyline'],
            'vehicle': ['transportation', 'travel', 'drive', 'auto', 'moving', 'speed', 'journey', 'machine', 'road', 'commute'],
            'object': ['item', 'isolated', 'design', 'still life', 'element', 'detail', 'studio', 'close-up'],
            'generic': ['stock', 'photo', 'image', 'background', 'concept', 'view', 'color', 'bright', 'lifestyle', 'day']
        };

        // Common structural words to remove from AI predictions
        this.stopWords = ['the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with'];
    }

    // Main generation function
    generateSEO(predictions) {
        // 1. Clean and extract base keywords from predictions
        const baseKeywords = this.extractBaseKeywords(predictions);

        // 2. Expand tags
        const tags = this.generateTags(baseKeywords);

        // 3. Generate Title
        const title = this.generateTitle(baseKeywords);

        // 4. Generate Description
        const description = this.generateDescription(baseKeywords, tags);

        return {
            title,
            description,
            tags: tags.join(', ')
        };
    }

    extractBaseKeywords(predictions) {
        let keywords = new Set();

        predictions.forEach(p => {
            // MobileNet classes are often comma-separated (e.g., "coffee mug, cup")
            const parts = p.className.split(',').map(s => s.trim().toLowerCase());
            parts.forEach(part => {
                // Split multi-word classes
                const words = part.split(' ');
                words.forEach(w => {
                    if (w.length > 2 && !this.stopWords.includes(w)) {
                        keywords.add(w);
                    }
                });
                keywords.add(part); // Also add the full phrase
            });
        });

        return Array.from(keywords);
    }

    generateTags(baseKeywords) {
        let tagsSet = new Set([...baseKeywords, ...this.dictionary.generic]);

        // Add related words based on basic keyword matching
        baseKeywords.forEach(kw => {
            // Simple keyword mapping (can be expanded significantly)
            if (kw.includes('cat') || kw.includes('dog') || kw.includes('bird')) {
                this.dictionary.animal.forEach(t => tagsSet.add(t));
            }
            if (kw.includes('tree') || kw.includes('water') || kw.includes('sky')) {
                this.dictionary.nature.forEach(t => tagsSet.add(t));
            }
            if (kw.includes('computer') || kw.includes('phone') || kw.includes('screen')) {
                this.dictionary.technology.forEach(t => tagsSet.add(t));
            }
            if (kw.includes('car') || kw.includes('bus') || kw.includes('train')) {
                this.dictionary.vehicle.forEach(t => tagsSet.add(t));
            }
            if (kw.includes('food') || kw.includes('plate') || kw.includes('drink')) {
                this.dictionary.food.forEach(t => tagsSet.add(t));
            }
        });

        let tagsArray = Array.from(tagsSet);

        // Stock agencies usually want max 50 tags
        // Shuffle to get a good mix, then slice
        tagsArray = this.shuffleArray(tagsArray);
        return tagsArray.slice(0, 50);
    }

    generateTitle(baseKeywords) {
        // Take top 3-4 keywords to form a simple descriptive title
        const topWords = baseKeywords.filter(w => !w.includes(' ')).slice(0, 4);
        if (topWords.length === 0) return "High quality stock media";

        // Capitalize first letters
        const formattedWords = topWords.map(w => w.charAt(0).toUpperCase() + w.slice(1));

        return `${formattedWords.join(' ')} - Concept Background Image`;
    }

    generateDescription(baseKeywords, tags) {
        // Take the main prediction (usually the first base keyword)
        const mainSubject = baseKeywords.length > 0 ? baseKeywords[0] : 'subject';
        const secondary = baseKeywords.length > 1 ? baseKeywords[1] : 'elements';

        return `High quality shot of ${mainSubject} featuring ${secondary}. Perfect for design projects, marketing, and editorial use. Concepts include ${tags.slice(0, 5).join(', ')}.`;
    }

    // Utility: Fisher-Yates shuffle
    shuffleArray(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }
}