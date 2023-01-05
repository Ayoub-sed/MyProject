import { Component } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';


@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    loading = false;
    users: User[];
    mode: String;
    constructor(private userService: UserService) { }

    ngOnInit() {
        this.loading = true;
        this.mode="departement";
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.loading = false;
            this.users = users;
        });
    }

    selectMode(mode:String){
        this.mode=mode;
    }
    
}