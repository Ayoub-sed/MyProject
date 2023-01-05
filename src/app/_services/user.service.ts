import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { departement } from '@app/_models/departement';
import { classes } from '@app/_models/classes';
import { student } from '@app/_models/student';

@Injectable({ providedIn: 'root' })
export class UserService {
    
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }
    getDepartements() {
        return this.http.get<departement[]>(`${environment.apiUrl}/departements`);
    }
    getClasses() {
        return this.http.get<classes[]>(`${environment.apiUrl}/classes`);
    }
    getStudents() {
        return this.http.get<student[]>(`${environment.apiUrl}/students`);
    }
}