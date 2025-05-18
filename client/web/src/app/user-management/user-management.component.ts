import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { User } from '../shared/model/User';
import { UserService } from '../shared/services/user.service';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {BookingsService} from "../shared/services/bookings.service";
import {Booking} from "../shared/model/Booking";
import {Groups} from "../shared/model/Groups";
import {Trainers} from "../shared/model/Trainers";
import {GroupsService} from "../shared/services/groups.service";
import {TrainersService} from "../shared/services/trainers.service";

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule,  MatDialogModule, MatSnackBarModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  users!: User[];
  user!: User;
  bookings!: Booking[];
  groups!: Groups[];
  trainers!: Trainers[];
  columnsBooking = ['userId', 'groupId', 'status', 'createdAt', 'delete'];
  columnsGroup = ['name', 'description', 'trainer', 'spotsLeft', 'schedule', 'book'];
  columnsTrainer = ['name', 'bio', 'specialties'];

  constructor(
    private userService: UserService,
    private bookingService: BookingsService,
    private groupService: GroupsService,
    private trainerService: TrainersService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
    this.groupService.getAllGroups().subscribe({
        next: (response) => {
          this.groups = response;},
        error: (err) => {
          console.error(err);
        }
      });
    this.trainerService.getAllTrainers().subscribe({
        next: (response) => {
          this.trainers = response;},
        error: (err) => {
          console.error(err);
        }
      });
    const userid = this.authService.getUserId();
    this.userService.getUser(userid).subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Failed to fetch user:', err);
      }
    })
  }

  logout() {
    this.authService.logout().subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigateByUrl('/login');
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  goToAdminMode() {
    if (this.user.admin) {
      this.router.navigateByUrl('/admin-mode');
    } else {
      alert("You are not an admin.");
    }
  }

  isvalid() {
    console.log(this.user.admin);
    return this.user.admin;
  }
  goToMyProfile() {
    this.router.navigateByUrl('/user-page');
  }

  deleteBooking(id: string, n: number) {
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          // booking deletion
          this.bookingService.delete(id).subscribe({
            next: (data) => {
              this.bookings?.splice(n, 1);
              this.bookings = [...this.bookings];
              this.openSnackBar('Booking deleted successfully.', 3000);
              window.location.reload();
            }, error: (err) => {
              console.log(err);
            }
          });
        }
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, undefined, { duration: duration });
  }

  bookGroup(groupId: string) {
    this.bookingService.createBooking(groupId).subscribe({
      next: (response) => {
        console.log("Booking successful", response);
        window.location.reload();
      },
      error: (err) => {
        console.error("Booking failed", err);
      }
    });
  }
}
