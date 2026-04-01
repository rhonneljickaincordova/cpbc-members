import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MemberService } from '../../services/member';
import { AttendanceService } from '../../services/attendance';
import { PaymentService } from '../../services/payment';
import { Member } from '../../models/member.model';
import { Attendance } from '../../models/attendance.model';
import { Payment } from '../../models/payment.model';
import { environment } from '../../../environment/environment';

interface AttendanceRecord {
  date: string;
  eventType: string;
}

@Component({
  selector: 'app-member-lookup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  templateUrl: './member-lookup.html',
  styleUrl: './member-lookup.scss',
})
export class MemberLookup implements OnInit {
  private memberService = inject(MemberService);
  private attendanceService = inject(AttendanceService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  embedded = this.route.snapshot.data['embedded'] === true;
  searchQuery = '';
  allMembers: Member[] = [];
  filteredMembers: Member[] = [];
  allAttendance: Attendance[] = [];
  allPayments: Payment[] = [];

  selectedMember: Member | null = null;
  memberAttendance: AttendanceRecord[] = [];

  loading = true;

  practiceCount = 0;
  gameCount = 0;
  meetingCount = 0;

  // Dues
  yearlyDues = environment.yearlyDues;
  monthlyDues = environment.yearlyDues / 12;
  totalPaid = 0;
  remainingBalance = 0;
  paidPercentage = 0;

  ngOnInit(): void {
    this.memberService.getAll().subscribe((members) => {
      this.allMembers = members;
      this.loading = false;
    });

    this.attendanceService.getAll().subscribe((records) => {
      this.allAttendance = records;
      if (this.selectedMember) {
        this.buildAttendanceHistory(this.selectedMember.id!);
      }
    });

    this.paymentService.getAll().subscribe((payments) => {
      this.allPayments = payments;
      if (this.selectedMember) {
        this.buildPaymentSummary(this.selectedMember.id!);
      }
    });
  }

  onSearch(): void {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.filteredMembers = [];
      return;
    }
    this.filteredMembers = this.allMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.nickname.toLowerCase().includes(q),
    );
  }

  selectMember(member: Member): void {
    this.selectedMember = member;
    this.searchQuery = '';
    this.filteredMembers = [];
    this.buildAttendanceHistory(member.id!);
    this.buildPaymentSummary(member.id!);
  }

  clearSelection(): void {
    this.selectedMember = null;
    this.memberAttendance = [];
    this.practiceCount = 0;
    this.gameCount = 0;
    this.meetingCount = 0;
    this.totalPaid = 0;
    this.remainingBalance = 0;
    this.paidPercentage = 0;
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }

  private buildAttendanceHistory(memberId: string): void {
    this.memberAttendance = this.allAttendance
      .filter((a) => a.attendees.includes(memberId))
      .map((a) => ({ date: a.date, eventType: a.eventType }))
      .sort((a, b) => b.date.localeCompare(a.date));

    this.practiceCount = this.memberAttendance.filter((a) => a.eventType === 'Practice').length;
    this.gameCount = this.memberAttendance.filter((a) => a.eventType === 'Game').length;
    this.meetingCount = this.memberAttendance.filter((a) => a.eventType === 'Meeting').length;
  }

  private buildPaymentSummary(memberId: string): void {
    const currentYear = new Date().getFullYear();
    const memberPayments = this.allPayments.filter(
      (p) => p.memberId === memberId && p.status === 'Paid' && p.date.startsWith(String(currentYear)),
    );
    this.totalPaid = memberPayments.reduce((sum, p) => sum + p.amount, 0);
    this.remainingBalance = Math.max(0, this.yearlyDues - this.totalPaid);
    this.paidPercentage = Math.min(100, Math.round((this.totalPaid / this.yearlyDues) * 100));
  }
}
