import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { where } from '@angular/fire/firestore';
import { FirestoreService } from './firestore';
import { Attendance } from '../models/attendance.model';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private fs = inject(FirestoreService);
  private readonly path = 'attendance';

  getAll(): Observable<Attendance[]> {
    return this.fs.getAll<Attendance>(this.path);
  }

  getByDate(date: string): Observable<Attendance[]> {
    return this.fs.query<Attendance>(this.path, where('date', '==', date));
  }

  getByDateAndType(date: string, eventType: string): Observable<Attendance[]> {
    return this.fs.query<Attendance>(
      this.path,
      where('date', '==', date),
      where('eventType', '==', eventType),
    );
  }

  async save(attendance: Omit<Attendance, 'id'>): Promise<string> {
    return this.fs.add(this.path, attendance);
  }

  async update(id: string, data: Partial<Attendance>): Promise<void> {
    return this.fs.update(this.path, id, data);
  }
}
