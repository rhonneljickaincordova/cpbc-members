import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Member } from '../../models/member.model';

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './payment-dialog.html',
  styleUrl: './payment-dialog.scss',
})
export class PaymentDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<PaymentDialog>);
  data: { members: Member[] } = inject(MAT_DIALOG_DATA);

  paymentTypes = ['Monthly Dues', 'Registration', 'Jersey', 'Other'];
  statuses = ['Paid', 'Unpaid'];

  // Member search
  memberSearch = '';
  searchResults: Member[] = [];
  selectedMember: Member | null = null;

  form: FormGroup = this.fb.group({
    memberId: ['', Validators.required],
    amount: [null, [Validators.required, Validators.min(1)]],
    paymentType: ['', Validators.required],
    status: ['Paid', Validators.required],
  });

  onMemberSearch(): void {
    const q = this.memberSearch.trim().toLowerCase();
    if (!q) {
      this.searchResults = [];
      return;
    }
    this.searchResults = this.data.members
      .filter((m) => m.name.toLowerCase().includes(q) || m.nickname.toLowerCase().includes(q))
      .slice(0, 10);
  }

  selectMember(member: Member): void {
    this.selectedMember = member;
    this.form.patchValue({ memberId: member.id });
    this.memberSearch = '';
    this.searchResults = [];
  }

  clearMember(): void {
    this.selectedMember = null;
    this.form.patchValue({ memberId: '' });
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
