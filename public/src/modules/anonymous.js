'use strict';

define('anonymous', [], function () {
	const Anonymous = {};

	Anonymous.init = function () {
		// Wait for DOM to be ready and then set up anonymous posting
		$(document).ready(function () {
			setupAnonymousPosting();
			interceptAjaxCalls();
		});
	};

	function setupAnonymousPosting() {
		// Try to add the toggle when composer is loaded
		const checkForComposer = setInterval(function () {
			const composer = $('.composer');
			if (composer.length && !composer.find('#anonymous-post-toggle').length) {
				addAnonymousToggle(composer);
			}
		}, 1000);

		// Stop checking after 30 seconds
		setTimeout(function () {
			clearInterval(checkForComposer);
		}, 30000);

		// Also listen for dynamic composer loading
		$(document).on('click', '[component="category/post"], #new_topic, [component="topic/reply"]', function () {
			setTimeout(function () {
				const composer = $('.composer');
				if (composer.length && !composer.find('#anonymous-post-toggle').length) {
					addAnonymousToggle(composer);
				}
			}, 500);
		});
	}

	function addAnonymousToggle(container) {
		// Find the formatting bar
		const formattingBar = container.find('.formatting-bar .d-flex.align-items-center.gap-1').first();

		if (formattingBar.length) {
			// Create the anonymous toggle HTML
			const anonymousToggleHtml = `
				<div class="form-check d-none d-sm-flex align-items-center me-2" id="anonymous-toggle-container">
					<input type="checkbox" class="form-check-input" id="anonymous-post-toggle" />
					<label for="anonymous-post-toggle" class="form-check-label small text-muted ms-1">
						Post anonymously
					</label>
				</div>
			`;

			// Insert before the draft icon or at the beginning
			const draftIcon = formattingBar.find('.draft-icon').parent();
			if (draftIcon.length) {
				draftIcon.before(anonymousToggleHtml);
			} else {
				formattingBar.prepend(anonymousToggleHtml);
			}

			console.log('Anonymous posting toggle added to composer');
		}
	}

	function interceptAjaxCalls() {
		// Store the original $.ajax function
		const originalAjax = $.ajax;

		// Override $.ajax to intercept API calls
		$.ajax = function (options) {
			// Check if this is a topic creation or reply API call
			if (options.url && options.type === 'POST') {
				if (options.url === '/api/v3/topics' || options.url.match(/^\/api\/v3\/topics\/\d+$/)) {
					// Check if anonymous toggle is checked
					const anonymousCheckbox = $('#anonymous-post-toggle');
					if (anonymousCheckbox.length && anonymousCheckbox.prop('checked')) {
						// Add anonymous flag to the data
						if (typeof options.data === 'string') {
							try {
								const parsedData = JSON.parse(options.data);
								parsedData.anonymous = 1;
								options.data = JSON.stringify(parsedData);
							} catch (e) {
								// If parsing fails, try to append as URL params
								options.data += '&anonymous=1';
							}
						} else if (typeof options.data === 'object') {
							options.data = options.data || {};
							options.data.anonymous = 1;
						} else {
							options.data = { anonymous: 1 };
						}
						console.log('Added anonymous flag to API call:', options.url);
					}
				}
			}

			// Call the original $.ajax function
			return originalAjax.call(this, options);
		};
	}

	return Anonymous;
});