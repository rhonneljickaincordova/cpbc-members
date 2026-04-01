import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { League } from '../../models/league.model';

@Component({
  selector: 'app-league-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './league-dialog.html',
  styleUrl: './league-dialog.scss',
})
export class LeagueDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<LeagueDialog>);
  data: League | null = inject(MAT_DIALOG_DATA);

  isEdit = !!this.data;

  form: FormGroup = this.fb.group({
    name: [this.data?.name || '', Validators.required],
  });

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
