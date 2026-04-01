import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PaymentService } from '../../services/payment';
import { MemberService } from '../../services/member';
import { Payment } from '../../models/payment.model';
import { Member } from '../../models/member.model';
import { PaymentDialog } from '../payment-dialog/payment-dialog';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './payments.html',
  styleUrl: './payments.scss',
})
export class Payments implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private paymentService = inject(PaymentService);
  private memberService = inject(MemberService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['memberName', 'amount', 'paymentType', 'status', 'date'];
  dataSource = new MatTableDataSource<Payment & { memberName: string }>();

  members: Member[] = [];
  allPayments: Payment[] = [];

  // Search filter
  filterQuery = '';
  selectedMember: Member | null = null;
  filterResults: Member[] = [];

  totalCollected = 0;
  unpaidCount = 0;

  ngOnInit(): void {
    this.memberService.getAll().subscribe((members) => {
      this.members = members;
      this.loadPayments();
    });
  }

  private loadPayments(): void {
    this.paymentService.getAll().subscribe((payments) => {
      this.allPayments = payments;
      this.applyFilter();
    });
  }

  onFilterSearch(): void {
    const q = this.filterQuery.trim().toLowerCase();
    if (!q) {
      this.filterResults = [];
      return;
    }
    this.filterResults = this.members
      .filter((m) => m.name.toLowerCase().includes(q) || m.nickname.toLowerCase().includes(q))
      .slice(0, 15);
  }

  selectFilterMember(member: Member): void {
    this.selectedMember = member;
    this.filterQuery = '';
    this.filterResults = [];
    this.applyFilter();
  }

  clearFilter(): void {
    this.selectedMember = null;
    this.filterQuery = '';
    this.filterResults = [];
    this.applyFilter();
  }

  applyFilter(): void {
    const memberMap = new Map(this.members.map((m) => [m.id, m.name]));
    let filtered = this.allPayments;

    if (this.selectedMember) {
      filtered = filtered.filter((p) => p.memberId === this.selectedMember!.id);
    }

    this.dataSource.data = filtered.map((p) => ({
      ...p,
      memberName: memberMap.get(p.memberId) || 'Unknown',
    }));
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.totalCollected = filtered.filter((p) => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
    this.unpaidCount = filtered.filter((p) => p.status === 'Unpaid').length;
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(PaymentDialog, {
      width: '480px',
      data: { members: this.members },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.paymentService.add(result).then(() => {
          this.snackBar.open('Payment added successfully', 'Close', { duration: 3000 });
        }).catch((err) => {
          this.snackBar.open('Error: ' + err.message, 'Close', { duration: 5000 });
        });
      }
    });
  }
}
