import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MemberService } from '../../services/member';
import { AttendanceService } from '../../services/attendance';
import { Member } from '../../models/member.model';
import { Attendance } from '../../models/attendance.model';

@Component({
  selector: 'app-record-attendance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './record-attendance.html',
  styleUrl: './record-attendance.scss',
})
export class RecordAttendance implements OnInit {
  private memberService = inject(MemberService);
  private attendanceService = inject(AttendanceService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  searchQuery = '';
  allMembers: Member[] = [];
  filteredMembers: Member[] = [];
  allAttendance: Attendance[] = [];

  selectedMember: Member | null = null;
  todayEvents: Attendance[] = [];
  presentEventIds: string[] = [];
  allMarked = false;
  marking = false;

  loading = true;
  eventsReady = false;
  private todayEnsured = false;

  // Default schedule: day of week -> event type
  private readonly schedule: Record<number, 'Practice' | 'Game'> = {
    1: 'Practice',  // Monday
    4: 'Practice',  // Thursday
    5: 'Practice',  // Friday (testing)
    6: 'Practice',  // Saturday
    0: 'Game',      // Sunday
  };

  ngOnInit(): void {
    this.memberService.getAll().subscribe((members) => {
      this.allMembers = members;
      this.loading = false;
    });

    this.attendanceService.getAll().subscribe(async (records) => {
      this.allAttendance = records;
      await this.ensureTodayEvent();
      this.eventsReady = true;
      if (this.selectedMember) {
        this.buildTodayEvents(this.selectedMember.id!);
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
    this.buildTodayEvents(member.id!);
  }

  clearSelection(): void {
    this.selectedMember = null;
    this.todayEvents = [];
    this.presentEventIds = [];
    this.allMarked = false;
  }

  isPresent(eventId: string): boolean {
    return this.presentEventIds.includes(eventId);
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }

  async markAllPresent(): Promise<void> {
    if (!this.selectedMember) return;

    const memberId = this.selectedMember.id!;
    this.marking = true;

    try {
      const unmarked = this.todayEvents.filter(
        (e) => !e.attendees.includes(memberId),
      );

      for (const event of unmarked) {
        const updatedAttendees = [...event.attendees, memberId];
        await this.attendanceService.update(event.id!, { attendees: updatedAttendees });
        event.attendees = updatedAttendees;
      }

      this.presentEventIds = this.todayEvents.map((e) => e.id!);
      this.allMarked = true;
      this.snackBar.open('Attendance recorded!', 'OK', { duration: 3000 });
    } finally {
      this.marking = false;
    }
  }

  private async ensureTodayEvent(): Promise<void> {
    if (this.todayEnsured) return;
    this.todayEnsured = true;

    const today = this.formatToday();
    const dayOfWeek = new Date().getDay();
    const eventType = this.schedule[dayOfWeek];

    if (!eventType) return; // Not a scheduled day

    const exists = this.allAttendance.some(
      (a) => a.date === today && a.eventType === eventType,
    );

    if (!exists) {
      const id = await this.attendanceService.save({
        date: today,
        eventType,
        attendees: [],
      });
      // Add locally so it's available immediately
      this.allAttendance = [
        ...this.allAttendance,
        { id, date: today, eventType, attendees: [] },
      ];
    }
  }

  private buildTodayEvents(memberId: string): void {
    const today = this.formatToday();
    this.todayEvents = this.allAttendance.filter((a) => a.date === today);
    this.presentEventIds = this.todayEvents
      .filter((a) => a.attendees.includes(memberId))
      .map((a) => a.id!);
    this.allMarked = this.todayEvents.length > 0 &&
      this.presentEventIds.length === this.todayEvents.length;
  }

  private formatToday(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
