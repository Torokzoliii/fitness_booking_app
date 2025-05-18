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
  selector: 'app-admin-mode',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule,  MatDialogModule, MatSnackBarModule],
  templateUrl: './admin-mode.component.html',
  styleUrl: './admin-mode.component.scss'
})
export class AdminModeComponent {
  users!: User[];
  bookings!: Booking[];
  groups!: Groups[];
  trainers!: Trainers[];
  columnsUser = ['email', 'name', 'delete'];
  columnsBooking = ['userId', 'groupId', 'status', 'createdAt', 'confirm', 'delete'];
  columnsGroup = ['name', 'description', 'trainer', 'spotsLeft', 'schedule', 'book', 'delete'];
  columnsTrainer = ['name', 'bio', 'specialties', 'delete'];

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
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      }, error: (err) => {
        console.log(err);
      }
    });
    this.bookingService.getAllBookings().subscribe({
      next: (response) => {
        this.bookings = response;
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

  exitAdminMode() {
    this.router.navigateByUrl('/user-management');
  }

  deleteUser(id: string, n: number) {
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          // user deletion
          console.log(data);
          this.userService.delete(id).subscribe({
            next: (data) => {
              console.log(data);
              this.users?.splice(n, 1);
              this.users = [...this.users];
              this.openSnackBar('User deleted successfully.', 3000);
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

  deleteBooking(id: string, n: number) {
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          // booking deletion
          console.log(data);
          this.bookingService.delete(id).subscribe({
            next: (data) => {
              console.log(data);
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

  deleteTrainer(id: string, n: number) {
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          // booking deletion
          console.log(data);
          this.trainerService.delete(id).subscribe({
            next: (data) => {
              console.log(data);
              this.trainers?.splice(n, 1);
              this.trainers = [...this.trainers];
              this.openSnackBar('Trainer deleted successfully.', 3000);
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

  deleteGroup(id: string, n: number) {
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          // booking deletion
          console.log(data);
          this.groupService.delete(id).subscribe({
            next: (data) => {
              console.log(data);
              this.groups?.splice(n, 1);
              this.groups = [...this.groups];
              this.openSnackBar('Group deleted successfully.', 3000);
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

  updateBooking(bookingId: string) {
    this.bookingService.updateBooking(bookingId).subscribe({
      next: (response) => {
        console.log("Booking successful", response);
        window.location.reload();
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

}
