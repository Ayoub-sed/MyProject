import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserService, AuthenticationService } from '@app/_services';
import { student } from '@app/_models/student';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.less']
})
export class StudentComponent implements OnInit {
  students: student[];
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getStudents().pipe(first()).subscribe(students => {
      this.students = students;
  });
  }

}
