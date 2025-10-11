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

# User Guide – Anonymous Posting Feature




## Feature Description


The anonymous posting feature adds a checkbox to the post composer that allows users to submit posts without revealing their identity. When enabled, the post will show "Anonymous" instead of the user's name, while administrators and users with special privileges can still view the original author.


## How to Use the Anonymous Posting Feature


### Creating an Anonymous Post


1. **Navigate to Post Creation**
   - Click "New Topic" to create a new discussion thread, OR
   - Click "Reply" on an existing topic to respond to a discussion


2. **Access the Anonymous Toggle**
   - Look for the post composer that appears
   - In the formatting toolbar at the bottom, locate the "Post anonymously" checkbox
   - **Note**: This checkbox is only visible on desktop/tablet devices (hidden on mobile for space constraints)


3. **Enable Anonymous Posting**
   - Check the "Post anonymously" checkbox before writing your content
   - The checkbox will remain checked while you compose your message


4. **Compose Your Message**
   - Write your question, answer, or response as normal
   - Use all the regular formatting options (bold, italic, links, etc.)
   - Add images or files if needed


5. **Submit the Post**
   - Click "Submit" or "Post Reply" as usual
   - Your post will be submitted with anonymous flag enabled


### Viewing Anonymous Posts


**As a Regular User:**
- Anonymous posts will display "Anonymous" as the author name
- You cannot see who actually wrote the post
- The post content and formatting remain unchanged


**As an Administrator or Privileged User:**
- You can see both "Anonymous" and the real author information
- This allows for moderation while preserving user privacy
- The privilege system controls who has this access


## Manual Testing Guide


### Test Environment Setup


1. **Prerequisites**
   - NodeBB forum instance running locally or on test server
   - At least two user accounts: one regular user, one administrator
   - Redis/MongoDB database running (required for NodeBB)


### Test Case 1: Anonymous Post Creation


1. **Login as Regular User**
   - Navigate to any category
   - Click "New Topic"


2. **Verify Checkbox Presence**
   - Confirm the "Post anonymously" checkbox appears in the composer
   - Verify it's visible on desktop but hidden on mobile (resize browser window to test)


3. **Create Anonymous Topic**
   - Check the "Post anonymously" checkbox
   - Enter title: "Test Anonymous Question"
   - Enter content: "This is a test of anonymous posting functionality"
   - Click "Submit"


4. **Verify Post Display**
   - Confirm the new topic appears in the category
   - Verify the author shows as "Anonymous" instead of your username
   - Check that the post content is displayed normally


### Test Case 2: Anonymous Reply Creation


1. **Navigate to Existing Topic**
   - Open any existing discussion topic
   - Click "Reply"


2. **Create Anonymous Reply**
   - Check the "Post anonymously" checkbox
   - Enter reply content: "This is an anonymous response"
   - Click "Post Reply"


3. **Verify Reply Display**
   - Confirm the reply appears in the topic
   - Verify the author shows as "Anonymous"
   - Check that other users' non-anonymous posts still show their real usernames


### Test Case 3: Administrator View


1. **Login as Administrator**
   - Access the same topics created in previous tests


2. **Verify Privileged Access**
   - View the anonymous posts created earlier
   - Confirm you can see both "Anonymous" label AND the real author information
   - This demonstrates the privilege system working correctly


### Test Case 4: Mobile Responsiveness


1. **Test Mobile Interface**
   - Access the forum on mobile device or resize browser window to mobile size
   - Navigate to post composer
   - Verify the anonymous checkbox is hidden (should not appear)
   - This ensures the UI remains clean on smaller screens


### Test Case 5: Data Persistence


1. **Database Verification**
   - Create several anonymous and non-anonymous posts
   - Check that posts are properly stored with anonymous flag
   - Verify that subsequent page loads maintain the anonymous display


### Test Case 6: Edge Cases


1. **JavaScript Disabled**
   - Disable JavaScript in browser
   - Attempt to create posts (graceful degradation testing)


2. **Network Interruption**
   - Start creating an anonymous post
   - Interrupt network connection before submission
   - Verify proper error handling


## Automated Tests


### Test File Location
**File**: `test/posts.js` (lines added to existing test suite)


### Test Coverage Description


The automated test suite includes 8 comprehensive test cases that cover all aspects of the anonymous posting feature:


#### 1. **Basic Anonymous Post Creation** (`it('should create a post with anonymous flag')`)
- **What it tests**: Core functionality of creating anonymous posts
- **Why it's important**: Ensures the anonymous flag is properly processed and stored


#### 2. **Anonymous Flag in Post Data** (`it('should include anonymous flag in post data when requested')`)
- **What it tests**: Verifies the anonymous flag appears in the post object
- **Why it's important**: Confirms data integrity throughout the system


#### 3. **User Identity Hiding** (`it('should hide user identity for anonymous posts')`)
- **What it tests**: Anonymous posts show uid=0 instead of real user ID
- **Why it's important**: Core privacy protection mechanism


#### 4. **Privilege System Testing** (`it('should show real author to users with view_anonymous privilege')`)
- **What it tests**: Administrators can see real authors of anonymous posts
- **Why it's important**: Enables moderation while maintaining user privacy


#### 5. **Non-Anonymous Post Handling** (`it('should not affect normal posts')`)
- **What it tests**: Regular posts work exactly as before
- **Why it's important**: Ensures backward compatibility and no regression


#### 6. **Anonymous Flag Inheritance** (`it('should handle anonymous flag correctly in post updates')`)
- **What it tests**: Anonymous status persists through post modifications
- **Why it's important**: Maintains privacy even when posts are edited


#### 7. **Bulk Operations** (`it('should handle multiple anonymous posts correctly')`)
- **What it tests**: System performance with multiple anonymous posts
- **Why it's important**: Scalability and performance verification


#### 8. **Admin Access Verification** (`it('should allow admins to view anonymous post authors')`)
- **What it tests**: Administrator privilege override functionality
- **Why it's important**: Ensures proper moderation capabilities


### Why These Tests Are Sufficient


The test suite covers:


- **Core Functionality**: Post creation, data storage, and retrieval
- **Security**: User identity protection and privilege enforcement
- **Edge Cases**: Multiple posts, updates, and admin access
- **Integration**: How the feature works within the existing NodeBB architecture
- **Regression Prevention**: Ensures existing functionality remains unaffected


The tests verify both positive cases (feature working correctly) and negative cases (proper access control), ensuring the feature is robust and secure.


## Technical Implementation Notes


### Frontend Components
- **Anonymous Toggle**: Checkbox dynamically added to composer
- **AJAX Interception**: Automatic inclusion of anonymous flag in API calls
- **Responsive Design**: Mobile-friendly interface adaptations


### Backend Components
- **Database Schema**: Anonymous flag added to post data structure
- **Privilege System**: New `posts:view_anonymous` privilege for access control
- **API Integration**: Support for anonymous flag in post creation endpoints


### Security Considerations
- **Privacy Protection**: Real user identity hidden from non-privileged users
- **Moderation Support**: Administrators retain ability to identify anonymous post authors
- **Data Integrity**: Anonymous flag properly validated and stored


## Troubleshooting


### Common Issues


1. **Checkbox Not Appearing**
   - Verify JavaScript is enabled
   - Check browser console for errors
   - Ensure you're viewing on desktop (hidden on mobile)


2. **Anonymous Posts Showing Real Names**
   - Check user privileges in admin panel
   - Verify the anonymous flag was properly submitted
   - Clear browser cache and reload


3. **Posts Not Submitting**
   - Check browser network tab for API errors
   - Verify database connectivity
   - Check server logs for backend errors


### Development Testing


For developers wanting to test the implementation:


1. **Run the Test Suite**
   ```bash
   npm test
   ```


2. **Check Code Coverage**
   ```bash
   npm run coverage
   ```


3. **Manual Database Inspection**
   - Check the posts collection/table for anonymous flag values
   - Verify privilege assignments in the database




