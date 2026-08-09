import { adminDb } from '../firebase/admin';
import { Game } from '../types';

const COLLECTION = 'games';

export async function getGames(): Promise<Game[]> {
  const snapshot = await adminDb.collection(COLLECTION).orderBy('createdAt', 'desc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game));
}

export async function getPublishedGames(): Promise<Game[]> {
  const snapshot = await adminDb.collection(COLLECTION).where('published', '==', true).orderBy('createdAt', 'desc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game));
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  const snapshot = await adminDb.collection(COLLECTION).where('slug', '==', slug).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Game;
}

export async function getGameById(id: string): Promise<Game | null> {
  const doc = await adminDb.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Game;
}

export async function createGame(data: Omit<Game, 'id'>): Promise<string> {
  const docRef = await adminDb.collection(COLLECTION).add(data);
  return docRef.id;
}

export async function updateGame(id: string, data: Partial<Game>): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).update(data);
}

export async function deleteGame(id: string): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).delete();
}

export async function incrementGameCopyCount(id: string): Promise<void> {
  const docRef = adminDb.collection(COLLECTION).doc(id);
  // @ts-ignore - Ignore generic type error for FieldValue
  await docRef.update({ copyCount: adminDb.constructor.FieldValue.increment(1) });
}

export async function incrementGameViewCount(id: string): Promise<void> {
  const docRef = adminDb.collection(COLLECTION).doc(id);
  // @ts-ignore
  await docRef.update({ viewCount: adminDb.constructor.FieldValue.increment(1) });
}
