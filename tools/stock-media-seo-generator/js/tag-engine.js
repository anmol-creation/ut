// Expands base AI keywords into comprehensive stock media tags, title, and description
class TagEngine {
    constructor() {
        // Broad category expansion dictionary
        // These map common MobileNet predictions or general concepts to stock-friendly tags
        this.dictionary = {
            'nature': ['outdoors', 'environment', 'scenic', 'landscape', 'natural', 'beautiful', 'wild', 'background', 'scenery', 'tranquil', 'peaceful'],
            'floral': ['flower', 'plant', 'blossom', 'petal', 'flora', 'botanical', 'bloom', 'garden', 'spring', 'summer', 'fresh', 'nature', 'floral'],
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

        // Filter out very low probability predictions (e.g. less than 1% confidence)
        const confidentPredictions = predictions.filter(p => p.probability > 0.01);

        confidentPredictions.forEach(p => {
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
            if (kw.includes('tree') || kw.includes('water') || kw.includes('sky') || kw.includes('leaf') || kw.includes('forest')) {
                this.dictionary.nature.forEach(t => tagsSet.add(t));
            }
            if (kw.includes('flower') || kw.includes('daisy') || kw.includes('rose') || kw.includes('plant') || kw.includes('pot')) {
                this.dictionary.floral.forEach(t => tagsSet.add(t));
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
        // Filter out short words and multi-word phrases for the title core
        const coreWords = baseKeywords.filter(w => w.length > 3 && !w.includes(' '));

        if (coreWords.length === 0) return "High Quality Stock Media Background";

        // Capitalize first letters
        const formattedWords = coreWords.map(w => w.charAt(0).toUpperCase() + w.slice(1));

        // Construct a more natural title
        if (formattedWords.length === 1) {
            return `Beautiful ${formattedWords[0]} - Concept Background`;
        } else if (formattedWords.length === 2) {
            return `${formattedWords[0]} And ${formattedWords[1]} - High Resolution Concept`;
        } else {
            return `${formattedWords[0]}, ${formattedWords[1]} And ${formattedWords[2]} - Conceptual Image`;
        }
    }

    generateDescription(baseKeywords, tags) {
        const coreWords = baseKeywords.filter(w => w.length > 3 && !w.includes(' '));
        const mainSubject = coreWords.length > 0 ? coreWords[0] : 'this subject';
        const secondary = coreWords.length > 1 ? coreWords[1] : 'various elements';

        return `A beautiful, high-resolution shot featuring ${mainSubject} and ${secondary}. This image is perfect for creative design projects, marketing materials, and editorial use. Visual concepts include: ${tags.slice(0, 6).join(', ')}.`;
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