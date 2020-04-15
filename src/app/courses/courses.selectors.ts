import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CoursesState } from './reducers/course.reducers';
import * as fromCourses from './reducers/course.reducers';

// Feature Selector
export const selectCourseState = 
    createFeatureSelector<CoursesState>('courses');

export const selectAllCourses = createSelector(
    selectCourseState,
    fromCourses.selectAll
)

export const selectBeginnerCourses = createSelector(
    selectAllCourses,
    courses => courses.filter(course => course.category === 'BEGINNER')
)

export const selectAdvancedCourses = createSelector(
    selectAllCourses,
    courses => courses.filter(course => course.category === 'ADVANCED')
)

export const selectPromoTotal = createSelector(
    selectAllCourses,
    courses => courses.filter(course => course.promo).length
)

export const areCoursesLoaded = createSelector(
    selectCourseState,
    state => state.allCoursesLoaded
)

