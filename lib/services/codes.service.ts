import { adminDb } from '../firebase/admin';
import { Code } from '../types';

const COLLECTION = 'codes';

export async function getCodesByGameId(gameId: string): Promise<Code[]> {
  const snapshot = await adminDb.collection(COLLECTION).where('gameId', '==', gameId).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Code));
}

export async function getWorkingCodes(gameId: string): Promise<Code[]> {
  const snapshot = await adminDb.collection(COLLECTION)
    .where('gameId', '==', gameId)
    .where('status', '==', 'Working')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Code));
}

export async function createCode(data: Omit<Code, 'id'>): Promise<string> {
  const docRef = await adminDb.collection(COLLECTION).add(data);
  return docRef.id;
}

export async function updateCode(id: string, data: Partial<Code>): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).update(data);
}

export async function deleteCode(id: string): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).delete();
}
