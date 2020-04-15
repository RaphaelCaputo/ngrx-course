import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import {concatMap, delay, filter, first, map, shareReplay, tap, withLatestFrom} from 'rxjs/operators';
import { CourseEntityService } from '../services/course-entity.service';
import { LessonEntityService } from '../services/lesson-entity.service';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  course$: Observable<Course>;

  lessons$: Observable<Lesson[]>;

  loading$: Observable<boolean>;

  displayedColumns = ['seqNo', 'description', 'duration'];

  nextPage = 0;

  constructor(
    private coursesService: CourseEntityService,
    private lessonsService: LessonEntityService,
    private route: ActivatedRoute) {

  }

  ngOnInit() {

    const courseUrl = this.route.snapshot.paramMap.get("courseUrl");

    this.course$ = this.coursesService.entities$
      .pipe(
        map(courses => courses.find(course => course.url == courseUrl))
      )

    // In order to find the lessons of a given course, we are going
    // to need the course id and we dont have it available here.
    // So we are going to get it from the course Observable
    this.lessons$ = this.lessonsService.entities$
        .pipe(
          // Combines the source Observable with other Observables
          // to create an Observable whose values are calculated
          // from the latest values of each, only when the source emits.
          withLatestFrom(this.course$),

          // The first value emitted by the Observable is going to be 
          // the lesson entities$ and the second element emitted by
          // withLatestFrom is going to be the course$ so this means
          // we are going to be able to combine those 2 values in order
          // to produce the lessons Observable
          tap(([lessons, course]) => {
            
            // Only if it is 0, we are going to load the first page,
            // since the store will be empty
            if(this.nextPage == 0) {

              this.loadLessonsPage(course)
            }
          }),
          map(([lessons, course]) =>
            lessons.filter(lesson => lesson.courseId == course.id))
        );

    // To ensure the loading indicator will only be affected
    // in the next change detection run, so it wont throw errors
    this.loading$ = this.lessonsService.loading$.pipe(delay(0));
  }


  loadLessonsPage(course: Course) {
    this.lessonsService.getWithQuery({
      'courseId': course.id.toString(),
      'pageNumber': this.nextPage.toString(),
      'pageSize': '3'
    });

    this.nextPage += 1;
  }

}
