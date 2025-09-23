'use strict';

const db = require('../../database');
const batch = require('../../batch');

module.exports = {
	name: 'Add official field to posts and topics',
	timestamp: Date.UTC(2025, 0, 1),
	method: async function () {
		const progress = this.progress;

		await batch.processSortedSet('posts:pid', async (pids) => {
			progress.incr(pids.length);
			const posts = pids.map(pid => `post:${pid}`);
			const updates = posts.map(key => ({ key, official: 0 }));
			await db.setObjectBulk(updates);
		}, {
			batch: 500,
			progress: progress,
		});

		await batch.processSortedSet('topics:tid', async (tids) => {
			progress.incr(tids.length);
			const topics = tids.map(tid => `topic:${tid}`);
			const updates = topics.map(key => ({ key, official: 0 }));
			await db.setObjectBulk(updates);
		}, {
			batch: 500,
			progress: progress,
		});

		// Add privileges to existing categories
		const cids = await db.getSortedSetRange('categories:cid', 0, -1);
		const privileges = ['posts:mark_official', 'topics:mark_official'];

		for (const privilege of privileges) {
			// Grant to administrators by default
			await Promise.all(cids.map(cid =>
				db.setAdd(`cid:${cid}:privileges:${privilege}`, 'administrators')
			));
		}
	},
};