import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  QueryConstraint,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private firestore = inject(Firestore);

  getAll<T>(path: string): Observable<T[]> {
    const ref = collection(this.firestore, path);
    return collectionData(ref, { idField: 'id' }) as Observable<T[]>;
  }

  getById<T>(path: string, id: string): Observable<T> {
    const ref = doc(this.firestore, path, id);
    return docData(ref, { idField: 'id' }) as Observable<T>;
  }

  query<T>(path: string, ...constraints: QueryConstraint[]): Observable<T[]> {
    const ref = collection(this.firestore, path);
    const q = query(ref, ...constraints);
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  async add<T>(path: string, data: T): Promise<string> {
    const ref = collection(this.firestore, path);
    const docRef = await addDoc(ref, data as any);
    return docRef.id;
  }

  async update(path: string, id: string, data: Partial<any>): Promise<void> {
    const ref = doc(this.firestore, path, id);
    await updateDoc(ref, data);
  }

  async delete(path: string, id: string): Promise<void> {
    const ref = doc(this.firestore, path, id);
    await deleteDoc(ref);
  }
}
