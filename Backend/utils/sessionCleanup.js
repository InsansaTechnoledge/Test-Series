// utils/sessionCleanup.js
import { sessionStore } from '../config/express.config.js';

/**
 * Destroy all sessions in the store for a given userId EXCEPT excludeSid.
 * Works with connect-mongo v4 (client or clientPromise).
 */
export async function destroyOtherSessionsForUser(userId, excludeSid) {
  const client =
    sessionStore.client ||
    (sessionStore.clientPromise && (await sessionStore.clientPromise));

  if (!client) {
    throw new Error('sessionStore client not available');
  }

  const db = client.db(); // inferred from your mongoUrl in MongoStore.create
  const collectionName = sessionStore.collectionName || 'sessions';
  const col = db.collection(collectionName);

  // Fetch sessions; only need _id (sid) and session json
  const docs = await col
    .find({}, { projection: { _id: 1, session: 1 } })
    .toArray();

  const toDelete = [];
  for (const d of docs) {
    try {
      const s = typeof d.session === 'string' ? JSON.parse(d.session) : d.session;
      const pUser = s?.passport?.user; // you serialize { id, role }

      if (!pUser) continue;

      const sid = d._id;
      const sameUser =
        (pUser.id || '').toString() === (userId || '').toString();
      const isCurrent = sid === excludeSid;

      if (sameUser && !isCurrent) toDelete.push(sid);
    } catch {
      // ignore malformed sessions
    }
  }

  if (toDelete.length) {
    await Promise.all(
      toDelete.map(
        sid =>
          new Promise(resolve => sessionStore.destroy(sid, () => resolve()))
      )
    );
    console.log(`🔒 Destroyed ${toDelete.length} previous session(s) for ${userId}`);
  } else {
    console.log(`🔒 No previous sessions to destroy for ${userId}`);
  }
}
