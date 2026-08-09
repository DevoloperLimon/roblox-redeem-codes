import { adminDb } from '../firebase/admin';
import { Category } from '../types';

const COLLECTION = 'categories';

export async function getCategories(): Promise<Category[]> {
  const snapshot = await adminDb.collection(COLLECTION).orderBy('order', 'asc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
}

export async function getPublishedCategories(): Promise<Category[]> {
  const snapshot = await adminDb.collection(COLLECTION).where('published', '==', true).orderBy('order', 'asc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const snapshot = await adminDb.collection(COLLECTION).where('slug', '==', slug).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Category;
}

export async function createCategory(data: Omit<Category, 'id'>): Promise<string> {
  const docRef = await adminDb.collection(COLLECTION).add(data);
  return docRef.id;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).update(data);
}

export async function deleteCategory(id: string): Promise<void> {
  await adminDb.collection(COLLECTION).doc(id).delete();
}
