import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from "rxjs";
import { Store, select } from "@ngrx/store";
import { AppState } from "../reducers";
import { tap, first, finalize, filter } from "rxjs/operators";
import { CourseActions } from './action-types';
import { areCoursesLoaded } from "./courses.selectors";

@Injectable()
export class CoursesResolver implements Resolve<any> {

    // Avoid dispatch duplication due to the RouterStoreModule
    // which integrates the router with the Devtools
    loading = false;

    constructor(private store: Store<AppState>) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.store.pipe(
            select(areCoursesLoaded),
            tap(coursesLoaded => {

                if(!this.loading && !coursesLoaded) {
                    this.loading = true;
                    this.store.dispatch(CourseActions.loadAllCourses())
                }
            }),
            // Since the coursesLoaded boolean flag would emit a value
            // that would terminate the Observable and trigger the
            // route transition before the data fetch took place
            // Filter will emit av alue only if the courses
            // have been loaded
            // This Observable will be terminated by the first() operator
            // only when the coursesLoaded flag is set to true,
            // meaning taht the data has already been loaded in the store
            filter(coursesLoaded => coursesLoaded),
            // Need to ensure Observable completion so
            // the route transition wont hang
            first(),
            // When the Observable either completes of errors out
            // reset the flag to false
            finalize(() => this.loading = false)
        )
    }

}