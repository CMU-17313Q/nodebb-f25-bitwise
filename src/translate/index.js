/* eslint-disable strict */

const translatorApi = module.exports;

translatorApi.translate = async function (postData) {
	const TRANSLATOR_API = 'http://crs-17313-bitwise-gpu.qatar.cmu.edu/';

	try {
		// URL encode the content
		const encodedContent = encodeURIComponent(postData.content);
		const url = `${TRANSLATOR_API}?content=${encodedContent}`;

		// Make the request to the microservice
		const response = await fetch(url);
		const data = await response.json();

		// Return the values in the expected format: [isEnglish, translatedContent]
		return [data.is_english, data.translated_content];
	} catch (error) {
		// If the service is unavailable or there's an error, assume it's English and return original content
		console.error('Translation service error:', error.message);
		return [true, ''];
	}
};
