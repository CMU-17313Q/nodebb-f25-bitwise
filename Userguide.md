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
