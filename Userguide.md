# User Guide – Profanity Filtering and Post Approval System

## Overview
This feature introduces an automated profanity filtering system that scans user-submitted posts and flags or rejects them based on a predefined list of inappropriate words.  
Administrators can then review, approve, or reject flagged posts.

The system aims to maintain a respectful and safe environment by automatically detecting offensive content before it appears publicly.

## How to Use the Profanity Filter

### 1. Creating or Submitting a Post
When a user submits a post through the platform:
- The post content is automatically passed through the profanity detection module.
- The module scans for banned words using a maintained list of known profanities located in `src/posts/Profanity.js`.
- If profanity is detected:
  - The post is flagged for review.
  - The system prevents immediate publication until admin approval.
- If no profanity is detected:
  - The post is automatically approved and made public.

Example:
```js
import { containsProfanity } from './Profanity.js';

const content = "This is a damn test";
if (containsProfanity(content)) {
  console.log("Post flagged for review");
} else {
  console.log("Post approved");
}
```

# User Guide – Username Validation Feature
## Overview
The **Username Validation Feature** ensures that users create valid and consistent usernames when registering or updating their profiles.  
This enhancement improves readability, prevents invalid or non-standard names, and ensures compatibility across systems.  
Usernames are restricted to **English letters (A-Z, a-z)** and **numbers** only.  
Special symbols, spaces, accented characters (like `ä`, `â`, `é`), emojis, or non-English characters (like `محمد`) are **not allowed**.
## How to Use
### 1. Create or Change a Username
When registering a new account or editing a profile:
1. Open the **Register** page or **Profile Settings**.
2. Enter your desired username in the **Username** input field.
3. The system automatically validates your input using `utils.isUserNameValid(input)`.
If the username contains invalid characters, an error message appears:
> **Invalid Username**
### 2. Validation Rules
- Usernames must contain only English letters and digits.  
- Spaces, punctuation, and special characters are not allowed.  
- Accented or Unicode characters (e.g., `ä`, `â`, `محمد`) are rejected.  
- Empty usernames are not accepted.
### File Location
The validation logic is located in:
```
public/src/utils.js
```
### Test Location
Automated tests are located in:
```
test/utils.js
```
Can be run using
```
npm run test/utils.js
```
### Why These Tests Are Sufficient
- Ensures usernames only contain ASCII letters and digits.
- Confirms invalid characters (symbols, accented, Unicode) are correctly rejected.
- Prevents empty or whitespace-only usernames.
- Covers main edge cases including hidden characters and non-English input.

# User Guide – Text Color Feature
## Overview
The **Text Color Feature** allows users to change the color of their text in posts and replies, similar to Microsoft Word’s text-color tool.  This enhancement improves message readability and helps emphasize important content, for example, **red** for urgent announcements.
## How to Use
### 1. Access the Color Picker
When composing a new post or reply:
1. Open the **Composer** (message input area).
2. Click the **paintbrush icon** in the formatting toolbar.
3. A dropdown list of colors (red, orange, yellow, green, etc.) will appear.
### 2. Apply a Text Color
- Select any part of your message.
- Click your preferred color from the dropdown.
- Your text will appear wrapped in a color tag such as: ```[color=#d92b2b] Important! [/color]```
- When previewed or posted, the text appears in that color.
### 3. Clear Text Color
To remove a color:
- Click the **paintbrush icon** again.
- Select **Clear color (eraser icon)**.
- This removes all `[color]` tags and resets text to default color.
### Test Location
Automated tests are located in: ```test/sanitizer/color-spec.js```.
Make sure **Mocha v11.7.4** is installed.  
Run the tests in the terminal using:
```npx mocha test/sanitizer/color-spec.js```
### Why These Tests Are Sufficient
- No unsafe inline styles or HTML bypass the message post.
- Test that valid colors are rendered correctly, while invalid ones are stripped.
- Main edge cases are tested.

# User Guide – TLDR (Too Long; Didn't Read) Feature

## Overview
The **TLDR Feature** provides AI-powered automatic summarization of long posts using the Hugging Face BART model. Users can click a button on any post to generate a concise summary, making it easier to quickly understand the main points without reading the entire content. This is particularly useful for lengthy discussions, detailed explanations, or technical posts.

## How to Use

### 1. Generate a TLDR Summary
When viewing a topic with posts:
1. Look for the **"Show TLDR"** button below any post.
2. Click the **"Show TLDR"** button.
3. The system will generate a summary using AI (this may take a few seconds).
4. A blue alert box will appear below the post content displaying: **"TLDR: [summary text]"**

### 2. Toggle TLDR Visibility
- To hide a displayed summary: Click the **"Hide TLDR"** button (same button, text changes after generation).
- To show it again: Click **"Show TLDR"** to display the previously generated summary instantly (no regeneration needed).

### 3. What Happens Behind the Scenes
- When you click "Show TLDR", the post content is sent to the backend API endpoint: `/posts/:pid/tldr`
- The system removes HTML tags and special characters from the post content
- For very short posts (under 50 characters), the original text is returned with minimal modification
- For longer posts, the text is sent to the Hugging Face BART-large-CNN model for summarization
- The AI model generates a concise summary (20-100 words) capturing the key points
- The summary is displayed in an info alert box below the original post

### 4. Requirements
- **API Key**: The system requires a Hugging Face API key to be configured in the environment variable `HUGGING_FACE_API_KEY` or in `config.json` as `huggingface_api_key`
- **Model Loading**: The AI model may take 20-30 seconds to load on first use. If you see a "model loading" message, wait and try again.

## File Locations

### Backend Implementation
- **TLDR Module**: `src/tldr.js` - Core summarization logic using Hugging Face API
- **API Controller**: `src/controllers/write/posts.js` - Contains `getTldr` endpoint handler (lines 68-82)
- **API Route**: Accessible via `POST /api/v3/posts/:pid/tldr`

### Frontend Implementation
- **Client-Side Script**: `public/src/client/topic/tldr.js` - Handles button clicks and UI updates
- **Topic Integration**: `public/src/client/topic.js` - Initializes TLDR module on topic pages (line 58)
- **Template Button**: `vendor/nodebb-theme-harmony-2.1.15/templates/partials/topic/post.tpl` - TLDR button in post footer (line 120)

## Test Location
Automated tests are located in: `test/tldr.js`

Run the tests using:
```
npm test -- --grep "TLDR"
```

Or run all tests with:
```
npm test
```

## What Is Being Tested

### 1. **Core Summarization Functionality**
- Generates valid summaries for normal-length text
- Handles short posts (returns original or truncated text)
- Processes very long posts (truncates to 1024 characters before summarization)

### 2. **Text Cleaning & Processing**
- Removes HTML tags (`<p>`, `<strong>`, `<em>`, etc.) from post content
- Converts HTML entities (`&lt;`, `&gt;`, `&amp;`, `&nbsp;`) to regular characters
- Normalizes multiple whitespaces into single spaces
- Handles empty or whitespace-only text

### 3. **API Integration**
- Validates that Hugging Face API key is required
- Throws appropriate error when API key is missing
- Handles API timeouts gracefully (60-second timeout)
- Detects when model is loading and provides helpful error messages
- Handles API errors and invalid responses

### 4. **Quality Control**
- Detects repetitive or poor-quality summaries (when >50% of words are repeated)
- Falls back to first sentence or truncated original text if AI summary is poor
- Ensures summaries are shorter than original text

### 5. **Controller & Route Testing**
- Verifies `getTldr` controller method exists and is a function
- Tests post data retrieval for summary generation
- Handles non-existent post IDs gracefully (returns 404 error)

### 6. **Edge Cases**
- Empty text input
- Text with only special characters
- Posts with mixed HTML and plain text
- API timeouts and failures
- Missing or invalid API keys

## Why These Tests Are Sufficient

1. **Comprehensive Coverage**: Tests cover the entire flow from frontend button click to backend API call to AI summarization
2. **Error Handling**: All major error scenarios are tested (missing API key, invalid post, API failures, timeouts)
3. **Data Sanitization**: Ensures HTML and special characters are properly cleaned before and after summarization
4. **Quality Assurance**: Validates that summaries meet quality standards and fall back gracefully when AI produces poor results
5. **Integration Testing**: Tests both the TLDR module in isolation and its integration with the posts system
6. **Edge Case Coverage**: Handles empty content, very short posts, very long posts, and malformed HTML
7. **API Resilience**: Gracefully handles API unavailability during testing, ensuring tests don't fail due to external service issues

The test suite ensures that the TLDR feature is robust, secure, and provides a good user experience even when the AI service is temporarily unavailable or returns unexpected results.
