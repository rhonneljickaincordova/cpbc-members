import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Member } from '../../models/member.model';

interface QueuedMember {
  name: string;
  nickname: string;
  contactNumber: string;
}

@Component({
  selector: 'app-member-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './member-dialog.html',
  styleUrl: './member-dialog.scss',
})
export class MemberDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<MemberDialog>);
  data: Member | null = inject(MAT_DIALOG_DATA);

  isEdit = !!this.data;
  queue: QueuedMember[] = [];

  form: FormGroup = this.fb.group({
    name: [this.data?.name || '', Validators.required],
    nickname: [this.data?.nickname || '', Validators.required],
    contactNumber: [this.data?.contactNumber || '', Validators.required],
  });

  addAnother(): void {
    if (this.form.valid) {
      this.queue.push(this.form.value);
      this.form.reset();
    }
  }

  removeFromQueue(index: number): void {
    this.queue.splice(index, 1);
  }

  onSave(): void {
    if (this.isEdit) {
      if (this.form.valid) {
        this.dialogRef.close(this.form.value);
      }
    } else {
      if (this.form.valid) {
        this.queue.push(this.form.value);
      }
      if (this.queue.length > 0) {
        this.dialogRef.close(this.queue);
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
