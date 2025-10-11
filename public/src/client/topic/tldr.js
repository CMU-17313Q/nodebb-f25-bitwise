'use strict';

define('forum/topic/tldr', ['api', 'alerts'], function (api, alerts) {
	const TLDR = {};

	TLDR.init = function () {
		$(document).on('click', '[component="post"] .tldr-button', function () {
			const button = $(this);
			const pid = button.closest('[data-pid]').attr('data-pid');

			if (button.hasClass('loading')) {
				return;
			}

			generateTLDR(pid, button);
		});
	};

	function generateTLDR(pid, button) {
		const postEl = $('[data-pid="' + pid + '"]');
		const existingSummary = postEl.find('.tldr-summary');

		// Toggle if already visible
		if (existingSummary.length && existingSummary.is(':visible')) {
			existingSummary.slideUp();
			button.find('.tldr-text').text('Show TLDR');
			return;
		}

		if (existingSummary.length) {
			existingSummary.slideDown();
			button.find('.tldr-text').text('Hide TLDR');
			return;
		}

		button.addClass('loading').find('.tldr-text').text('Generating...');

		api.post('/posts/' + pid + '/tldr', {})
			.then(function (response) {
				const summaryHtml = '<div class="tldr-summary alert alert-info" style="margin-top: 10px;">' +
					'<strong>TLDR:</strong> ' + response.summary +
					'</div>';

				postEl.find('[component="post/content"]').after(summaryHtml);
				button.find('.tldr-text').text('Hide TLDR');
			})
			.catch(function (err) {
				alerts.error(err.message || 'Failed to generate TLDR');
				button.find('.tldr-text').text('Show TLDR');
			})
			.finally(function () {
				button.removeClass('loading');
			});
	}

	return TLDR;
});
