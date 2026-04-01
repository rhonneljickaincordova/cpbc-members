import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MemberService } from '../../services/member';
import { Member } from '../../models/member.model';
import { MemberDialog } from '../member-dialog/member-dialog';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './members.html',
  styleUrl: './members.scss',
})
export class Members implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private memberService = inject(MemberService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['name', 'nickname', 'contactNumber', 'dateJoined', 'status', 'actions'];
  dataSource = new MatTableDataSource<Member>();

  ngOnInit(): void {
    this.memberService.getAll().subscribe((members) => {
      this.dataSource.data = members;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(MemberDialog, {
      width: '480px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && Array.isArray(result) && result.length > 0) {
        this.memberService.addMany(result).then(() => {
          const count = result.length;
          this.snackBar.open(`${count} member(s) added successfully`, 'Close', { duration: 3000 });
        }).catch((err) => {
          console.error('Failed to add members:', err);
          this.snackBar.open('Error: ' + err.message, 'Close', { duration: 5000 });
        });
      }
    });
  }

  openEditDialog(member: Member): void {
    const dialogRef = this.dialog.open(MemberDialog, {
      width: '480px',
      data: member,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && member.id) {
        this.memberService.update(member.id, result).then(() => {
          this.snackBar.open('Member updated successfully', 'Close', { duration: 3000 });
        });
      }
    });
  }

  toggleStatus(member: Member): void {
    if (!member.id) return;
    const newStatus = member.status === 'Active' ? 'Inactive' : 'Active';
    this.memberService.update(member.id, { status: newStatus }).then(() => {
      this.snackBar.open(`Member marked as ${newStatus}`, 'Close', { duration: 3000 });
    });
  }

  deleteMember(member: Member): void {
    if (!member.id) return;
    if (confirm(`Are you sure you want to delete ${member.name}?`)) {
      this.memberService.delete(member.id).then(() => {
        this.snackBar.open('Member deleted', 'Close', { duration: 3000 });
      });
    }
  }
}
