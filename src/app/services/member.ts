import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { where } from '@angular/fire/firestore';
import { FirestoreService } from './firestore';
import { Member } from '../models/member.model';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private fs = inject(FirestoreService);
  private readonly path = 'members';

  getAll(): Observable<Member[]> {
    return this.fs.getAll<Member>(this.path);
  }

  getActive(): Observable<Member[]> {
    return this.fs.query<Member>(this.path, where('status', '==', 'Active'));
  }

  getById(id: string): Observable<Member> {
    return this.fs.getById<Member>(this.path, id);
  }

  async add(member: Omit<Member, 'id' | 'dateJoined' | 'status'>): Promise<string> {
    const now = new Date().toISOString().split('T')[0];
    return this.fs.add(this.path, {
      ...member,
      dateJoined: now,
      status: 'Active',
    });
  }

  async addMany(members: Omit<Member, 'id' | 'dateJoined' | 'status'>[]): Promise<string[]> {
    return Promise.all(members.map((m) => this.add(m)));
  }

  async update(id: string, data: Partial<Member>): Promise<void> {
    return this.fs.update(this.path, id, data);
  }

  async delete(id: string): Promise<void> {
    return this.fs.delete(this.path, id);
  }
}
