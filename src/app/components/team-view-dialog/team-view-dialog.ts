import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AttendanceService } from '../../services/attendance';
import { Team } from '../../models/team.model';
import { Member } from '../../models/member.model';
import { Attendance } from '../../models/attendance.model';

interface MemberAttendance {
  member: Member;
  records: { date: string; eventType: string }[];
}

@Component({
  selector: 'app-team-view-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './team-view-dialog.html',
  styleUrl: './team-view-dialog.scss',
})
export class TeamViewDialog implements OnInit {
  private attendanceService = inject(AttendanceService);
  private dialogRef = inject(MatDialogRef<TeamViewDialog>);
  data: { team: Team; memberMap: Map<string, Member> } = inject(MAT_DIALOG_DATA);

  memberAttendances: MemberAttendance[] = [];
  loading = true;

  ngOnInit(): void {
    this.attendanceService.getAll().subscribe((records) => {
      this.memberAttendances = this.buildMemberAttendances(records);
      this.loading = false;
    });
  }

  private buildMemberAttendances(records: Attendance[]): MemberAttendance[] {
    const team = this.data.team;
    const memberMap = this.data.memberMap;

    return team.memberIds
      .map((memberId) => {
        const member = memberMap.get(memberId);
        if (!member) return null;

        const memberRecords = records
          .filter((r) => r.attendees.includes(memberId))
          .map((r) => ({ date: r.date, eventType: r.eventType }))
          .sort((a, b) => b.date.localeCompare(a.date));

        return { member, records: memberRecords } as MemberAttendance;
      })
      .filter((entry): entry is MemberAttendance => entry !== null)
      .sort((a, b) => b.records.length - a.records.length);
  }

  getMemberInitial(name: string): string {
    return name ? name.charAt(0) : '?';
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
