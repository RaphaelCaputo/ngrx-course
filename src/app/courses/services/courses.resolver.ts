import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { CourseEntityService } from "./course-entity.service";
import { map, tap, filter, first } from "rxjs/operators";

@Injectable()
export class CoursesResolver implements Resolve<boolean> {

    constructor(private coursesService: CourseEntityService) {}

    resolve(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {
            
            // To not trigger a get request with eacth 
            // route transition
            return this.coursesService.loaded$
                .pipe(
                    tap(loaded => {
                        if(!loaded) {
                            this.coursesService.getAll();
                        }
                    }),
                    // Making sure that we wait for the data
                    // to be loaded in the store
                    filter(loaded => !!loaded),
                    // Is completing the Observable and ensuring
                    // the transition goes through
                    first()
                )

            // NgRx Data tries to guess the url "/api/:entityName"
            // for the custom implementation go to CoursesDataService
            // return this.coursesService.getAll()
            // .pipe(
            //     // Since the Resolver expects a boolean
            //     map(courses => !!courses)
            // )
        }
}