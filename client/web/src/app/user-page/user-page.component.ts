import { Component } from '@angular/core';
import {UserService} from "../shared/services/user.service";
import {AuthService} from "../shared/services/auth.service";
import {Router} from "@angular/router";
import {User} from "../shared/model/User";
import {MatFormField} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [
    MatFormField,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent {
  user!: User;
  groupReview: string = '';
  trainerReview: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    const userid = this.authService.getUserId();
    this.userService.getUser(userid).subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Failed to fetch user:', err);
      }
    });
  }

  submitGroupReview() {
    this.groupReview = '';
    alert("Your group review has successfully submitted!");
  }

  submitTrainerReview() {
    this.trainerReview = '';
    alert("Your trainer review has successfully submitted!");
  }

  backToMyBooking() {
    this.router.navigateByUrl('/user-management');
  }

}
