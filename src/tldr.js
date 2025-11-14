'use strict';

const fetch = global.fetch || require('node-fetch');
const nconf = require('nconf');

const TLDR = module.exports;

TLDR.generateSummary = async function (text) {
	// In generic API schema tests, use mock response to avoid external API timeouts
	// This flag is set by test/api.js but not by test/tldr.js
	if (TLDR._useMockForTests) {
		const cleanText = text.replace(/<[^>]*>/g, '').trim();
		return cleanText.length > 100 ? cleanText.substring(0, 97) + '...' : cleanText;
	}

	// Try environment variable first, then config.json
	const apiKey = process.env.HUGGING_FACE_API_KEY || nconf.get('huggingface_api_key');

	if (!apiKey) {
		throw new Error('Hugging Face API key not configured');
	}

	// Clean up HTML and format text for better summarization
	const cleanText = text
		.replace(/<[^>]*>/g, '') // Remove HTML tags
		.replace(/&nbsp;/g, ' ') // Replace nbsp
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&')
		.replace(/\s+/g, ' ') // Normalize whitespace
		.trim();

	// For very short posts, just return the text with ellipsis
	if (cleanText.length < 50) {
		return cleanText.length > 40 ? cleanText.substring(0, 40) + '...' : cleanText;
	}

	// Truncate if text is too long (model has limits)
	const maxLength = 1024;
	const truncatedText = cleanText.length > maxLength ? cleanText.substring(0, maxLength) : cleanText;

	try {
		// Create abort controller for timeout
		const AbortController = global.AbortController || require('abort-controller');
		const controller = new AbortController();
		const timeout = setTimeout(() => {
			controller.abort();
		}, 60000); // 60 second timeout

		const response = await fetch(
			'https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn',
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					inputs: truncatedText,
					parameters: {
						max_length: 100,
						min_length: 20,
						do_sample: false,
						length_penalty: 2.0, // Encourages longer summaries
						num_beams: 4, // Better quality
						early_stopping: true,
					},
					options: {
						wait_for_model: true, // Wait for model to load if needed
					},
				}),
				signal: controller.signal,
			}
		);

		clearTimeout(timeout);

		const responseText = await response.text();
		console.log('Hugging Face API Response:', responseText);

		if (!response.ok) {
			let errorMessage = 'Failed to generate summary';
			try {
				const error = JSON.parse(responseText);
				errorMessage = error.error || error.message || errorMessage;
				
				// Check if model is loading
				if (error.error && error.error.includes('loading')) {
					errorMessage = 'AI model is loading. Please try again in 20-30 seconds.';
				}
			} catch (e) {
				errorMessage = responseText || errorMessage;
			}
			throw new Error(errorMessage);
		}

		let result;
		try {
			result = JSON.parse(responseText);
		} catch (e) {
			console.error('Failed to parse response:', responseText);
			throw new Error('Invalid response from AI service');
		}

		let summary = result[0]?.summary_text || result[0]?.generated_text || 'Unable to generate summary';

		// Quality check: detect repetitive or poor summaries
		const words = summary.toLowerCase().split(/\s+/);
		const uniqueWords = new Set(words);
		
		// If more than 50% of words are repeated, it's a bad summary
		if (uniqueWords.size < words.length * 0.5 && words.length > 3) {
			console.log('Detected repetitive summary, using fallback');
			// Return first sentence or truncated original text instead
			const firstSentence = cleanText.split(/[.!?]/)[0].trim();
			summary = firstSentence.length > 100 ? firstSentence.substring(0, 100) + '...' : firstSentence + '.';
		}

		return summary;
	} catch (err) {
		console.error('TLDR generation error:', err);
		
		// Handle timeout specifically
		if (err.name === 'AbortError') {
			throw new Error('Request timeout - the AI model is taking too long. Please try again in a moment.');
		}
		
		throw err;
	}
};
