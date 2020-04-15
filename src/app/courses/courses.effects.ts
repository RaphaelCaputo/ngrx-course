import { Injectable } from "@angular/core";
import { Actions, ofType } from "@ngrx/effects";
import { CoursesHttpService } from "./services/courses-http.service";
import { createEffect } from '@ngrx/effects';
import { CourseActions } from "./action-types";
import { concatMap, map } from "rxjs/operators";

@Injectable()
export class CoursesEffects {

    constructor(private actions$: Actions,
        private coursesHttpService: CoursesHttpService) { }

    // This Observable is expected by the compiler to be returning
    // a new NgRx Action, so this is not a {dispatch: false} Observable
    // like before
    loadCourses$ = createEffect(
        () => this.actions$
            .pipe(
                ofType(CourseActions.loadAllCourses),
                // Ensure that only one request at a time to the backend
                concatMap(action => this.coursesHttpService.findAllCourses()),
                // Create a new Action that is going to get
                // dispatched to the store using the map operator
                map(courses => CourseActions.allCoursesLoaded({ courses }))
            )
    )

    saveCourse$ = createEffect(
        () => this.actions$
            .pipe(
                ofType(CourseActions.courseUpdated),
                concatMap(action => this.coursesHttpService.saveCourse(
                    action.update.id,
                    action.update.changes
                ))
            ),
            { dispatch: false }
    )
}