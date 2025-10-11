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
	$(document).ready(function () {
		// Listen for composer enhancement to add anonymous toggle
		$(window).on('action:composer.enhanced', function (ev, data) {
			addAnonymousToggle(data.postContainer);
		});

		$(window).on('action:composer.loaded', function (ev, data) {
			addAnonymousToggle(data.postContainer);
		});

		// Hook into composer submit to include anonymous flag
		$(window).on('filter:composer.submit', function (ev, data) {
			const postContainer = data.postContainer || $('.composer[data-uuid="' + data.composerData.uuid + '"]') || $('.composer');
			const anonymousCheckbox = postContainer.find('[data-anonymous-toggle] input[type="checkbox"]');
			if (anonymousCheckbox.length && anonymousCheckbox.prop('checked')) {
				data.composerData = data.composerData || {};
				data.composerData.anonymous = 1;
			}
		});

		// Also handle via action hook as backup
		$(window).on('action:composer.submit', function (ev, data) {
			const postContainer = data.postContainer || $('.composer[data-uuid="' + data.composerData.uuid + '"]') || $('.composer');
			const anonymousCheckbox = postContainer.find('[data-anonymous-toggle] input[type="checkbox"]');
			if (anonymousCheckbox.length && anonymousCheckbox.prop('checked')) {
				data.composerData = data.composerData || {};
				data.composerData.anonymous = 1;
			}
		});
	});

	function addAnonymousToggle(container) {
		// Find the formatting bar - updated selector based on actual composer template
		const formattingBar = container.find('.formatting-bar .d-flex.align-items-center.gap-1').last();

		if (formattingBar.length && !container.find('[data-anonymous-toggle]').length) {
			// Create unique ID for this composer instance
			const uuid = container.data('uuid') || Date.now();
			const toggleId = 'anonymous-post-toggle-' + uuid;

			// Create the anonymous toggle HTML
			const anonymousToggleHtml = `
				<div class="form-check d-flex align-items-center me-2" data-anonymous-toggle="true">
					<input type="checkbox" class="form-check-input" id="${toggleId}" />
					<label for="${toggleId}" class="form-check-label small text-muted ms-1">
						[[topic:composer.anonymous]]
					</label>
				</div>
			`;

			// Insert before the draft icon
			const draftIcon = formattingBar.find('.draft-icon');
			if (draftIcon.length) {
				draftIcon.before(anonymousToggleHtml);
			} else {
				formattingBar.prepend(anonymousToggleHtml);
			}

			console.log('Anonymous toggle added to composer:', toggleId);
		}
	}

	return Compose;
});
