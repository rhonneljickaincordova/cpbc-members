import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Member } from '../../models/member.model';
import { Team } from '../../models/team.model';

@Component({
  selector: 'app-team-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './team-dialog.html',
  styleUrl: './team-dialog.scss',
})
export class TeamDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TeamDialog>);
  data: { members: Member[]; leagueId: string; team?: Team } = inject(MAT_DIALOG_DATA);

  isEdit = !!this.data.team;

  // Manager search (single-select)
  managerSearch = '';
  managerResults: Member[] = [];
  selectedManager: Member | null = null;

  // Team members search (multi-select)
  memberSearch = '';
  memberResults: Member[] = [];
  selectedMembers: Member[] = [];

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    managerId: ['', Validators.required],
    memberIds: [[] as string[]],
  });

  constructor() {
    if (this.data.team) {
      const team = this.data.team;
      this.form.patchValue({
        name: team.name,
        managerId: team.managerId,
        memberIds: team.memberIds,
      });
      this.selectedManager = this.data.members.find((m) => m.id === team.managerId) || null;
      this.selectedMembers = this.data.members.filter((m) => team.memberIds.includes(m.id!));
    }
  }

  // Manager search
  onManagerSearch(): void {
    const q = this.managerSearch.trim().toLowerCase();
    if (!q) {
      this.managerResults = [];
      return;
    }
    this.managerResults = this.data.members
      .filter((m) => m.name.toLowerCase().includes(q) || m.nickname.toLowerCase().includes(q))
      .slice(0, 10);
  }

  selectManager(member: Member): void {
    this.selectedManager = member;
    this.form.patchValue({ managerId: member.id });
    this.managerSearch = '';
    this.managerResults = [];
  }

  clearManager(): void {
    this.selectedManager = null;
    this.form.patchValue({ managerId: '' });
  }

  // Team members search
  onMemberSearch(): void {
    const q = this.memberSearch.trim().toLowerCase();
    if (!q) {
      this.memberResults = [];
      return;
    }
    const selectedIds = new Set(this.selectedMembers.map((m) => m.id));
    this.memberResults = this.data.members
      .filter(
        (m) =>
          !selectedIds.has(m.id) &&
          (m.name.toLowerCase().includes(q) || m.nickname.toLowerCase().includes(q)),
      )
      .slice(0, 20);
  }

  addMember(member: Member): void {
    if (!this.selectedMembers.find((m) => m.id === member.id)) {
      this.selectedMembers = [...this.selectedMembers, member];
      this.form.patchValue({ memberIds: this.selectedMembers.map((m) => m.id) });
    }
    this.memberSearch = '';
    this.memberResults = [];
  }

  removeMember(member: Member): void {
    this.selectedMembers = this.selectedMembers.filter((m) => m.id !== member.id);
    this.form.patchValue({ memberIds: this.selectedMembers.map((m) => m.id) });
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close({ ...this.form.value, leagueId: this.data.leagueId });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
