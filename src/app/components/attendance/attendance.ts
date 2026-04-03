import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MemberService } from '../../services/member';
import { AttendanceService } from '../../services/attendance';
import { Member } from '../../models/member.model';
import { Attendance as AttendanceModel } from '../../models/attendance.model';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatChipsModule,
  ],
  templateUrl: './attendance.html',
  styleUrl: './attendance.scss',
})
export class Attendance implements OnInit {
  private memberService = inject(MemberService);
  private attendanceService = inject(AttendanceService);
  private snackBar = inject(MatSnackBar);

  selectedDate: Date = new Date();
  eventType: string = 'Practice';
  eventTypes = ['Practice', 'Game', 'Meeting'];

  allMembers: Member[] = [];
  allAttendance: AttendanceModel[] = [];
  presentMembers: Member[] = [];
  existingRecord: AttendanceModel | null = null;

  searchQuery = '';
  searchResults: Member[] = [];
  presentFilter = '';

  dateClass = (date: Date): string => {
    const dateStr = this.formatDate(date);
    const types = this.allAttendance
      .filter((a) => a.date === dateStr)
      .map((a) => a.eventType);
    if (types.length === 0) return '';
    if (types.includes('Practice') && types.includes('Game')) return 'has-multiple';
    if (types.includes('Practice')) return 'has-practice';
    if (types.includes('Game')) return 'has-game';
    if (types.includes('Meeting')) return 'has-meeting';
    return 'has-data';
  };

  get filteredPresentMembers(): Member[] {
    const q = this.presentFilter.trim().toLowerCase();
    if (!q) return this.presentMembers;
    return this.presentMembers.filter(
      (m) => m.name.toLowerCase().includes(q) || m.nickname.toLowerCase().includes(q),
    );
  }

  ngOnInit(): void {
    this.memberService.getAll().subscribe((members) => {
      this.allMembers = members;
      this.loadAttendance();
    });

    this.attendanceService.getAll().subscribe((records) => {
      this.allAttendance = records;
    });
  }

  onDateOrTypeChange(): void {
    this.loadAttendance();
  }

  loadAttendance(): void {
    const dateStr = this.formatDate(this.selectedDate);
    this.attendanceService.getByDateAndType(dateStr, this.eventType).subscribe((records) => {
      this.existingRecord = records.length > 0 ? records[0] : null;
      const presentIds = this.existingRecord?.attendees || [];
      this.presentMembers = this.allMembers.filter((m) => presentIds.includes(m.id!));
      this.clearSearch();
    });
  }

  onSearch(): void {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.searchResults = [];
      return;
    }
    const presentIds = new Set(this.presentMembers.map((m) => m.id));
    this.searchResults = this.allMembers
      .filter(
        (m) =>
          !presentIds.has(m.id) &&
          (m.name.toLowerCase().includes(q) || m.nickname.toLowerCase().includes(q)),
      )
      .slice(0, 20);
  }

  addMember(member: Member): void {
    if (!this.presentMembers.find((m) => m.id === member.id)) {
      this.presentMembers = [...this.presentMembers, member];
    }
    this.clearSearch();
  }

  removeMember(member: Member): void {
    this.presentMembers = this.presentMembers.filter((m) => m.id !== member.id);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
  }

  async saveAttendance(): Promise<void> {
    const dateStr = this.formatDate(this.selectedDate);
    const presentIds = this.presentMembers.map((m) => m.id!);

    if (this.existingRecord?.id) {
      await this.attendanceService.update(this.existingRecord.id, { attendees: presentIds });
      this.snackBar.open('Attendance updated', 'Close', { duration: 3000 });
    } else {
      await this.attendanceService.save({
        date: dateStr,
        eventType: this.eventType as any,
        attendees: presentIds,
      });
      this.snackBar.open('Attendance saved', 'Close', { duration: 3000 });
    }
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
