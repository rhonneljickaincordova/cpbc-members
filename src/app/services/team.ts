import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { where } from '@angular/fire/firestore';
import { FirestoreService } from './firestore';
import { Team } from '../models/team.model';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private fs = inject(FirestoreService);
  private readonly path = 'teams';

  getAll(): Observable<Team[]> {
    return this.fs.getAll<Team>(this.path);
  }

  getByLeague(leagueId: string): Observable<Team[]> {
    return this.fs.query<Team>(this.path, where('leagueId', '==', leagueId));
  }

  async add(team: Omit<Team, 'id'>): Promise<string> {
    return this.fs.add(this.path, team);
  }

  async update(id: string, data: Partial<Team>): Promise<void> {
    return this.fs.update(this.path, id, data);
  }

  async delete(id: string): Promise<void> {
    return this.fs.delete(this.path, id);
  }
}
