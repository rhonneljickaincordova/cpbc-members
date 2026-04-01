import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { where } from '@angular/fire/firestore';
import { FirestoreService } from './firestore';
import { Payment } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private fs = inject(FirestoreService);
  private readonly path = 'payments';

  getAll(): Observable<Payment[]> {
    return this.fs.getAll<Payment>(this.path);
  }

  getByMember(memberId: string): Observable<Payment[]> {
    return this.fs.query<Payment>(this.path, where('memberId', '==', memberId));
  }

  async add(payment: Omit<Payment, 'id' | 'date'>): Promise<string> {
    const now = new Date().toISOString().split('T')[0];
    return this.fs.add(this.path, {
      ...payment,
      date: now,
    });
  }

  async update(id: string, data: Partial<Payment>): Promise<void> {
    return this.fs.update(this.path, id, data);
  }
}
