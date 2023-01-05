import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
import { departement } from '@app/_models/departement';
@Component({
  selector: 'app-departement',
  templateUrl: './departement.component.html',
  styleUrls: ['./departement.component.less']
})
export class DepartementComponent implements OnInit {
  departements: departement[];
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getDepartements().pipe(first()).subscribe(departements => {
      this.departements = departements;
  });
  }

}
