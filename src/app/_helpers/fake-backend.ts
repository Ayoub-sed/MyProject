import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { User } from '@app/_models';
import { departement } from '@app/_models/departement';
import { classes } from '@app/_models/classes';
import { student } from '@app/_models/student';

const users: User[] = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' },{ id: 2, username: 'ayoub', password: 'sed', firstName: 'Test', lastName: 'User' }];
const departements: departement[] = [{ id: 1, departementName: 'Electrical Engineering'},{ id: 2, departementName: 'Information Technology'},{ id: 3, departementName: 'Mecanical Engineering'}];
const classe: classes[] = [{ id: 1, departementId: 2,departement:departements.find(x=>x.id ==2), classeName:'Web development'},
{ id: 2, departementId: 2,departement:departements.find(x=>x.id ==2), classeName:'Networking'},
{ id: 3, departementId: 2,departement:departements.find(x=>x.id ==2), classeName:'System Security'},
{id: 4, departementId: 1,departement:departements.find(x=>x.id ==1), classeName:'automation'},
{id: 5, departementId: 1,departement:departements.find(x=>x.id ==1), classeName:'Digital electronics'},
{id: 6, departementId: 1,departement:departements.find(x=>x.id ==1), classeName:'Analysis of circuits'},
{id: 7, departementId: 3,departement:departements.find(x=>x.id ==3), classeName:'Fluid Mechanics'},
{id: 8, departementId: 3,departement:departements.find(x=>x.id ==3), classeName:'Machine Drawing'},
{id: 9, departementId: 3,departement:departements.find(x=>x.id ==3), classeName:'Workshop Practice'}];
const students: student[] = [
{ id: 1, classeId:1,studentName:'Sedghiani Ayoub',birthDate:new Date("12/04/1900"),classe:classe.find(x=>x.id == 1)},
{ id: 2, classeId:2,studentName:'Sedghiani Khalil',birthDate:new Date("12/04/1900"),classe:classe.find(x=>x.id == 2)},
{ id: 3, classeId:3,studentName:'Dali',birthDate:new Date("12/04/1900"),classe:classe.find(x=>x.id == 3)},
{ id: 4, classeId:4,studentName:'Chahbani Bassem',birthDate:new Date("12/04/1900"),classe:classe.find(x=>x.id == 4)},
{ id: 5, classeId:5,studentName:'Ben Ali Ali',birthDate:new Date("12/04/1900"),classe:classe.find(x=>x.id == 5)},
{ id: 6, classeId:6,studentName:'Ben Ahmed  Mohamed',birthDate:new Date("12/04/1900"),classe:classe.find(x=>x.id == 6)},
{ id: 7, classeId:7,studentName:'Marc ',birthDate:new Date("12/04/1900"),classe:classe.find(x=>x.id == 7)},
{ id: 8, classeId:8,studentName:'John ',birthDate:new Date("12/04/1900"),classe:classe.find(x=>x.id == 8)},
{ id: 9, classeId:1,studentName:'Sweaka',birthDate:new Date("01/01/2015"),classe:classe.find(x=>x.id == 1)},
{ id: 10, classeId:1,studentName:'SLASH Agency',birthDate:new Date("12/04/2012"),classe:classe.find(x=>x.id == 1)}
];
    
@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.endsWith('/departements') && method === 'GET':
                    return getDepartements();
                case url.endsWith('/classes') && method === 'GET':
                    return getClasses();
                case url.endsWith('/students') && method === 'GET':
                    return getStudents();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: 'fake-jwt-token'
            })
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }
        function getDepartements() {
            if (!isLoggedIn()) return unauthorized();
            return ok(departements);

        }

        function getClasses() {
            if (!isLoggedIn()) return unauthorized();
            return ok(classe);

        }
        function getStudents() {
            if (!isLoggedIn()) return unauthorized();
            return ok(students);

        }
        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};