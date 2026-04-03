import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LeagueService } from '../../services/league';
import { TeamService } from '../../services/team';
import { MemberService } from '../../services/member';
import { League } from '../../models/league.model';
import { Team } from '../../models/team.model';
import { Member } from '../../models/member.model';
import { TeamDialog } from '../team-dialog/team-dialog';
import { TeamViewDialog } from '../team-view-dialog/team-view-dialog';
import { LeagueDialog } from '../league-dialog/league-dialog';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './teams.html',
  styleUrl: './teams.scss',
})
export class Teams implements OnInit {
  private leagueService = inject(LeagueService);
  private teamService = inject(TeamService);
  private memberService = inject(MemberService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  leagues: League[] = [];
  teams: Team[] = [];
  members: Member[] = [];
  memberMap = new Map<string, Member>();

  ngOnInit(): void {
    this.memberService.getActive().subscribe((members) => {
      this.members = members;
      this.memberMap = new Map(members.map((m) => [m.id!, m]));
    });
    this.leagueService.getAll().subscribe((leagues) => {
      this.leagues = leagues;
    });
    this.teamService.getAll().subscribe((teams) => {
      this.teams = teams;
    });
  }

  getTeamsForLeague(leagueId: string): Team[] {
    return this.teams.filter((t) => t.leagueId === leagueId);
  }

  getMemberName(id: string): string {
    return this.memberMap.get(id)?.name || 'Unknown';
  }

  getMemberInitial(id: string): string {
    const name = this.memberMap.get(id)?.name;
    return name ? name.charAt(0) : '?';
  }

  addLeague(): void {
    const dialogRef = this.dialog.open(LeagueDialog, {
      width: '400px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.leagueService.add({ name: result.name.trim() }).then(() => {
          this.snackBar.open('League created', 'Close', { duration: 3000 });
        });
      }
    });
  }

  editLeague(league: League): void {
    const dialogRef = this.dialog.open(LeagueDialog, {
      width: '400px',
      data: league,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.name.trim() !== league.name) {
        this.leagueService.update(league.id!, { name: result.name.trim() }).then(() => {
          this.snackBar.open('League updated', 'Close', { duration: 3000 });
        });
      }
    });
  }

  deleteLeague(league: League): void {
    const leagueTeams = this.getTeamsForLeague(league.id!);
    if (leagueTeams.length > 0) {
      alert('Cannot delete a league that has teams. Remove all teams first.');
      return;
    }
    if (confirm(`Delete league "${league.name}"?`)) {
      this.leagueService.delete(league.id!).then(() => {
        this.snackBar.open('League deleted', 'Close', { duration: 3000 });
      });
    }
  }

  openAddTeamDialog(league: League): void {
    const dialogRef = this.dialog.open(TeamDialog, {
      width: '480px',
      data: { members: this.members, leagueId: league.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.teamService.add(result).then(() => {
          this.snackBar.open('Team created successfully', 'Close', { duration: 3000 });
        });
      }
    });
  }

  openEditTeamDialog(team: Team): void {
    const dialogRef = this.dialog.open(TeamDialog, {
      width: '480px',
      data: { members: this.members, leagueId: team.leagueId, team },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.teamService.update(team.id!, result).then(() => {
          this.snackBar.open('Team updated successfully', 'Close', { duration: 3000 });
        });
      }
    });
  }

  viewTeam(team: Team): void {
    this.dialog.open(TeamViewDialog, {
      width: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      maxHeight: '100vh',
      panelClass: 'fullscreen-dialog',
      data: { team, memberMap: this.memberMap },
    });
  }

  deleteTeam(team: Team): void {
    if (confirm(`Delete team "${team.name}"?`)) {
      this.teamService.delete(team.id!).then(() => {
        this.snackBar.open('Team deleted', 'Close', { duration: 3000 });
      });
    }
  }
}
