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
