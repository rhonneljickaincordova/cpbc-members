import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    RouterModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';

  async onEmailLogin(): Promise<void> {
    try {
      this.errorMessage = '';
      await this.authService.emailSignIn(this.email, this.password);
      this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Login failed';
    }
  }

  async onGoogleLogin(): Promise<void> {
    try {
      this.errorMessage = '';
      await this.authService.googleSignIn();
      this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Google login failed';
    }
  }
}
