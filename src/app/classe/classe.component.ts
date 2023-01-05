import { Component, OnInit } from '@angular/core';
import { classes } from '@app/_models/classes';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
@Component({
  selector: 'app-classe',
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.less']
})
export class ClasseComponent implements OnInit {

  classes: classes[];
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getClasses().pipe(first()).subscribe(classes => {
      this.classes = classes;
  });
}

}
