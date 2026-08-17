import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  if (!process.env.FIREBASE_PRIVATE_KEY) {
    console.error('⚠️ FIREBASE_PRIVATE_KEY is not set! Admin SDK will fail.');
  }

  let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';

  if (privateKey.startsWith('ey') || !privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    // Try decoding Base64 if it's encoded
    try {
      privateKey = Buffer.from(privateKey, 'base64').toString('utf8');
    } catch (e) {
      console.error('Base64 decode failed', e);
    }
  }

  // Fallback for standard escaped newlines
  privateKey = privateKey.replace(/\\n/g, '\n');

  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
    console.log('✅ Firebase Admin Initialized Successfully!');
  } catch (error) {
    console.error('❌ Firebase Admin Initialization Error:', error);
  }
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();