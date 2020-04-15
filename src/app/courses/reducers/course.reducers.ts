import { Course, compareCourses } from "../model/course";
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from "@ngrx/store";
import { CourseActions } from "../action-types";

export interface CoursesState extends EntityState<Course> {
    // Check if the Courses were already loaded
    allCoursesLoaded: boolean
}

export const adapter = createEntityAdapter<Course>({
    sortComparer: compareCourses
});

export const initialCoursesState = adapter.getInitialState({
    allCoursesLoaded: false
});

export const coursesReducer = createReducer(
    
    initialCoursesState,

    // CourseActions.loadAllCourses does not need a reducer logic
    // it will simply trigger a side effect that is going to
    // load data from the backend

    
    on(CourseActions.allCoursesLoaded,
        (state, action) => adapter.addAll(
            action.courses, { ...state, allCoursesLoaded: true }
        )),

    on(CourseActions.courseUpdated,
        (state, action) => adapter.updateOne(action.update, state))
)

export const {
    selectAll
} = adapter.getSelectors();