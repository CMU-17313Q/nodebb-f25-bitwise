'use strict';

define('anonymous', ['translator', 'hooks'], function (translator, hooks) {
	const anonymous = {};

	anonymous.init = function () {
		console.log('Anonymous: init() called');

		// Setup composer detection
		$(document).ready(function () {
			// Try to find existing composers
			setTimeout(function () {
				const composers = $('.composer, [component="composer"]');
				console.log('Anonymous: Found composers:', composers.length);

				if (composers.length > 0) {
					addAnonymousToggle(composers.first());
				}
			}, 2000);

			// Listen for composer events using hooks
			hooks.on('action:composer.loaded', function (data) {
				console.log('Anonymous: composer loaded event', data);
				if (data && data.postContainer) {
					addAnonymousToggle(data.postContainer);
				}
			});

			hooks.on('action:composer.enhanced', function (data) {
				console.log('Anonymous: composer enhanced event', data);
				if (data && data.postContainer) {
					addAnonymousToggle(data.postContainer);
				}
			});

			// Hook into form submission to add anonymous flag
			hooks.on('filter:composer.submit', function (data) {
				console.log('Anonymous: composer submit event', data);
				const anonymousToggle = $('#anonymous-toggle');
				if (anonymousToggle.length && anonymousToggle.is(':checked')) {
					console.log('Anonymous: Adding anonymous flag to submission');
					data.anonymous = 1;
				}
				return data;
			});
		});
	};

	function addAnonymousToggle(container) {
		console.log('Anonymous: Adding toggle to container');

		// Find the formatting bar
		const formattingBar = container.find('.formatting-bar, .btn-toolbar').last();

		if (formattingBar.length && !container.find('[data-anonymous-toggle]').length) {
			const toggleHtml = `
				<div class="form-check d-flex align-items-center me-2" data-anonymous-toggle="true">
					<input type="checkbox" class="form-check-input" id="anonymous-toggle" />
					<label for="anonymous-toggle" class="form-check-label small text-muted ms-1">
						Post anonymously
					</label>
				</div>
			`;

			formattingBar.prepend(toggleHtml);
			console.log('Anonymous: Toggle added successfully');
		}
	}

	return anonymous;
});