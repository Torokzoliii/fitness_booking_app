import { Component } from '@angular/core';
import {CommonModule, DatePipe, NgForOf, NgIf} from "@angular/common";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableModule
} from "@angular/material/table";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {User} from "../shared/model/User";
import {Booking} from "../shared/model/Booking";
import {Groups} from "../shared/model/Groups";
import {Trainers} from "../shared/model/Trainers";
import {UserService} from "../shared/services/user.service";
import {BookingsService} from "../shared/services/bookings.service";
import {GroupsService} from "../shared/services/groups.service";
import {TrainersService} from "../shared/services/trainers.service";
import {AuthService} from "../shared/services/auth.service";
import {Router} from "@angular/router";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {DialogComponent} from "../shared/components/dialog/dialog.component";
import {LoginComponent} from "../login/login.component";

@Component({
  selector: 'app-start-page',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule,  MatDialogModule, MatSnackBarModule],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.scss'
})
export class StartPageComponent {
  groups!: Groups[];
  trainers!: Trainers[];
  columnsGroup = ['name', 'description', 'trainer', 'spotsLeft', 'schedule'];
  columnsTrainer = ['name', 'bio', 'specialties'];

  constructor(
    private userService: UserService,
    private groupService: GroupsService,
    private trainerService: TrainersService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
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

  loginOrSignup() {
    this.router.navigateByUrl('/login');
  }

}
