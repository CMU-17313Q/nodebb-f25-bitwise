'use strict';

const db = require('../../database');
const batch = require('../../batch');

module.exports = {
	name: 'Add official field to posts and topics',
	timestamp: Date.UTC(2025, 0, 1),
	method: async function () {
		const { progress } = this;

		await batch.processSortedSet('posts:pid', async (pids) => {
			progress.incr(pids.length);
			const bulkSet = pids.map(pid => [`post:${pid}`, { official: 0 }]);
			await db.setObjectBulk(bulkSet);
		}, {
			batch: 500,
			progress: progress,
		});

		await batch.processSortedSet('topics:tid', async (tids) => {
			progress.incr(tids.length);
			const bulkSet = tids.map(tid => [`topic:${tid}`, { official: 0 }]);
			await db.setObjectBulk(bulkSet);
		}, {
			batch: 500,
			progress: progress,
		});

		// Add privileges to existing categories
		const cids = await db.getSortedSetRange('categories:cid', 0, -1);
		const privileges = ['posts:mark_official', 'topics:mark_official'];

		// Process privileges in parallel to avoid await in loop
		await Promise.all(privileges.map(async (privilege) => {
			// Grant to administrators by default
			return Promise.all(cids.map(cid =>
				db.setAdd(`cid:${cid}:privileges:${privilege}`, 'administrators')));
		}));
	},
};