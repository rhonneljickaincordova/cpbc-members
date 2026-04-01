import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MemberService } from '../../services/member';
import { AttendanceService } from '../../services/attendance';
import { PaymentService } from '../../services/payment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private memberService = inject(MemberService);
  private attendanceService = inject(AttendanceService);
  private paymentService = inject(PaymentService);

  activeMembersCount = 0;
  todayAttendanceCount = 0;
  totalCollected = 0;

  ngOnInit(): void {
    this.memberService.getActive().subscribe((members) => {
      this.activeMembersCount = members.length;
    });

    const today = this.formatDate(new Date());
    this.attendanceService.getByDate(today).subscribe((records) => {
      const allAttendees = new Set<string>();
      records.forEach((r) => r.attendees.forEach((id) => allAttendees.add(id)));
      this.todayAttendanceCount = allAttendees.size;
    });

    this.paymentService.getAll().subscribe((payments) => {
      this.totalCollected = payments.filter((p) => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
    });
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
