import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from './firestore';
import { League } from '../models/league.model';

@Injectable({ providedIn: 'root' })
export class LeagueService {
  private fs = inject(FirestoreService);
  private readonly path = 'leagues';

  getAll(): Observable<League[]> {
    return this.fs.getAll<League>(this.path);
  }

  async add(league: Omit<League, 'id'>): Promise<string> {
    return this.fs.add(this.path, league);
  }

  async update(id: string, data: Partial<League>): Promise<void> {
    return this.fs.update(this.path, id, data);
  }

  async delete(id: string): Promise<void> {
    return this.fs.delete(this.path, id);
  }
}
