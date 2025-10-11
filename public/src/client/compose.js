'use strict';


define('forum/compose', ['hooks', 'forum/composer/text-color'], function (hooks) {
	const Compose = {};

	Compose.init = function () {
		const container = $('.composer');

		if (container.length) {
			hooks.fire('action:composer.enhance', {
				container: container,
			});
		}
	};

	// Add anonymous posting functionality
	$(document).ready(function() {
		// Listen for composer enhancement to add anonymous toggle
		$(window).on('action:composer.enhance', function(ev, data) {
			addAnonymousToggle(data.container);
		});

		// Hook into composer submit to include anonymous flag
		$(window).on('action:composer.submit', function(ev, data) {
			const container = data.container || $('.composer');
			const anonymousCheckbox = container.find('#anonymous-post-toggle');
			if (anonymousCheckbox.length) {
				data.composerData = data.composerData || {};
				data.composerData.anonymous = anonymousCheckbox.prop('checked') ? 1 : 0;
			}
		});
	});

	function addAnonymousToggle(container) {
		// Find the formatting bar
		const formattingBar = container.find('.formatting-bar .d-flex.align-items-center.gap-1').first();

		if (formattingBar.length && !container.find('#anonymous-post-toggle').length) {
			// Create the anonymous toggle HTML
			const anonymousToggleHtml = `
				<div class="form-check d-none d-sm-flex align-items-center me-2">
					<input type="checkbox" class="form-check-input" id="anonymous-post-toggle" />
					<label for="anonymous-post-toggle" class="form-check-label small text-muted ms-1">
						[[topic:composer.anonymous]]
					</label>
				</div>
			`;

			// Insert before the draft icon
			const draftIcon = formattingBar.find('.draft-icon').parent();
			if (draftIcon.length) {
				draftIcon.before(anonymousToggleHtml);
			} else {
				formattingBar.prepend(anonymousToggleHtml);
			}
		}
	}

	return Compose;
});
