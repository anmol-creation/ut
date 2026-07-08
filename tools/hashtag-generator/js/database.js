// A mini client-side database mapping broad keywords to sets of hashtags
const HASHTAG_DB = {
    "fitness": [
        "fitness", "gym", "workout", "fit", "fitnessmotivation", "motivation", "bodybuilding", "training", "health",
        "love", "lifestyle", "fitfam", "instagood", "healthylifestyle", "sport", "gymlife", "healthy", "gymmotivation",
        "personaltrainer", "muscle", "crossfit", "fitnessmodel", "instagram", "exercise", "fashion", "follow", "weightloss",
        "like", "model", "fitnessjourney", "wellness"
    ],
    "coding": [
        "coding", "programming", "programmer", "python", "developer", "javascript", "code", "coder", "technology", "html",
        "computerscience", "codinglife", "java", "webdeveloper", "tech", "webdevelopment", "css", "software", "softwaredeveloper",
        "linux", "programmingmemes", "codingbootcamp", "php", "softwareengineer", "machinelearning", "development", "hacker",
        "100daysofcode", "cybersecurity", "engineering"
    ],
    "travel": [
        "travel", "nature", "photography", "travelphotography", "love", "photooftheday", "instagood", "travelgram", "picoftheday",
        "instagram", "beautiful", "photo", "wanderlust", "naturephotography", "adventure", "art", "travelblogger", "instatravel",
        "landscape", "like", "summer", "explore", "trip", "vacation", "follow", "traveling", "ig", "bhfyp", "happy"
    ],
    "food": [
        "food", "foodporn", "foodie", "instafood", "foodphotography", "foodstagram", "yummy", "foodblogger", "foodlover",
        "instagood", "love", "delicious", "follow", "like", "healthyfood", "homemade", "dinner", "foodgasm", "tasty",
        "photooftheday", "foodies", "restaurant", "cooking", "lunch", "picoftheday", "bhfyp", "foodpics", "instagram",
        "healthy", "chef"
    ],
    "fashion": [
        "fashion", "style", "love", "instagood", "like", "photography", "beautiful", "photooftheday", "follow", "instagram",
        "picoftheday", "model", "art", "beauty", "instadaily", "me", "likeforlikes", "smile", "ootd", "followme", "moda",
        "fashionblogger", "happy", "cute", "outfit", "girl", "bhfyp", "fashionista"
    ],
    "business": [
        "business", "entrepreneur", "motivation", "success", "marketing", "love", "money", "mindset", "inspiration",
        "businessowner", "quotes", "instagood", "lifestyle", "entrepreneurship", "smallbusiness", "startup", "bhfyp",
        "instagram", "leadership", "investing", "wealth", "hustle", "goals", "branding", "finance", "life", "design",
        "socialmedia"
    ],
    "art": [
        "art", "artist", "drawing", "artwork", "photography", "painting", "illustration", "design", "sketch", "digitalart",
        "love", "instagood", "nature", "artistsoninstagram", "photooftheday", "draw", "like", "instaart", "fashion",
        "beautiful", "creative", "sketchbook", "picoftheday", "portrait", "architecture", "follow", "watercolor", "fanart"
    ]
};

// Generic fallback tags for unrecognized keywords
const GENERIC_TAGS = [
    "instagood", "photooftheday", "trending", "viral", "explorepage", "explore", "like", "follow", "instadaily", "fyp"
];

// Attach to window so logic.js can access it
window.HASHTAG_DB = HASHTAG_DB;
window.GENERIC_TAGS = GENERIC_TAGS;