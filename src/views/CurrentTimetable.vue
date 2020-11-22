<template>
  <div class="timetable timetable_current" v-if="hasLoaded">
    <WeekSelector :start-week="weekNumber" @change="moveWeek"></WeekSelector>
    <div :class="['timetable__week', { timetable__week_dragging: isDragging }]">
      <LessonsOrderColumn
        :item-heights="lessonHeights"
        :lessons-count="maxLessonsCount"
      ></LessonsOrderColumn>
      <carousel
        ref="carousel"
        @mousedown.native="startDragging"
        @mouseup.native="stopDragging"
        :min-swipe-distance="100"
        :per-page="1"
        :per-page-custom="[
          [480, 1],
          [800, 2],
          [1400, 3]
        ]"
        :navigation-enabled="false"
        :pagination-enabled="false"
      >
        <slide
          v-for="(day, dayNumber) in currentTimetable"
          class="timetable__day day"
          :key="dayNumber"
        >
          <div class="day__label">{{ dayNumber | dayName }}</div>
          <div class="day__date">{{ lessonDate(+dayNumber) }}</div>
          <div class="day__lessons" v-if="day.some(l => l.lesson)">
            <LessonView
              v-for="(lesson, index) in day"
              :key="lesson.id"
              :lesson="lesson.lesson"
              :index="index"
            ></LessonView>
          </div>
          <div class="timetable__empty-day" v-else>
            <Card class="day__lesson card_striped" theme="warning">
              Самоподготовка
            </Card>
          </div>
        </slide>
      </carousel>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import { LOAD_DEFAULT_TIMETABLE, LOAD_PATCHES } from '@/store/action-types';
import {
  Day,
  EntityType,
  Lesson,
  Patch,
  Week
} from 'ggtu-timetable-api-client';
import LessonView from '@/components/timetables/LessonView.vue';
import { v4 } from 'uuid';
import { KeyedTimetable } from '@/store';
// @ts-ignore
import { Carousel, Slide } from 'vue-carousel';
import Card from '@/components/common/Card.vue';

export type MergedTimetable = Record<
  string,
  { id: string; lesson: Lesson | Patch | null }[]
>;

const dayNames: Record<string, string> = {
  [Day.Monday]: 'Пн',
  [Day.Tuesday]: 'Вт',
  [Day.Wednesday]: 'Ср',
  [Day.Thursday]: 'Чт',
  [Day.Friday]: 'Пт',
  [Day.Saturday]: 'Сб'
};

function getCurrentWeek(weekStart: Date): number {
  const start = new Date(weekStart.getFullYear(), 0, 1);
  const startDay = start.getDay();
  start.setDate(start.getDate() + startDay === 0 ? 0 : 8 - startDay);
  const week = 7 * 24 * 60 * 60 * 1000;
  return ((+weekStart - +start) / week) | 0;
}

@Component({
  name: 'CurrentTimetable',
  components: {
    LessonView,
    Page: () => import('@/components/common/Page.vue'),
    WeekSelector: () => import('@/components/timetables/WeekSelector.vue'),
    LessonsOrderColumn: () =>
      import('@/components/timetables/LessonsOrderColumn.vue'),
    Card,
    Carousel,
    Slide
  },
  filters: {
    dayName(index: string) {
      return dayNames[index];
    }
  }
})
export default class CurrentTimetable extends Vue {
  @State(state => state.user) user!: { type: EntityType; entityId: number };
  @State(state => state.timetable.default) timetable!: KeyedTimetable;
  @State(state => state.timetable.patches) patches!: Patch[];
  @State(state => state.timetable.hasLoaded) hasLoaded!: boolean;
  @Action(LOAD_DEFAULT_TIMETABLE) loadTimetable!: () => Promise<void>;
  @Action(LOAD_PATCHES) loadPatches!: ({
    type,
    id
  }: {
    type: EntityType;
    id: number;
  }) => Promise<void>;
  @Ref('lessonNumber') lessonNumber!: HTMLElement[];
  // @Ref('lessonNumbers') lessonNumbers!: HTMLElement;
  @Ref('carousel') carousel!: Vue;
  // week = Week.Top;
  isDragging = false;
  appliedPatches: Record<string, Patch> = {};
  start = new Date();
  currentTimetable: MergedTimetable = {};
  lessonHeights = [];

  get maxLessonIndex() {
    return Math.max(
      ...Object.keys(this.currentWeek).map(key => {
        return Math.max(
          ...this.currentWeek[key].map(entry =>
            entry.lesson ? entry.lesson.index : -1
          )
        );
      })
    );
  }

  get maxLessonsCount() {
    return this.maxLessonIndex + 1;
  }

  get weekNumber() {
    return getCurrentWeek(this.start);
  }

  get week() {
    return this.weekNumber % 2 === 0 ? Week.Top : Week.Bottom;
  }

  get weeks() {
    return ['Верхняя', 'Нижняя'];
  }

  get currentWeek() {
    return this.timetable[this.week];
  }

  get swiperOptions() {
    return {};
  }

  getPatch(dayIndex: string | number, lessonIndex: number, date?: Date) {
    const index = this.getPatchIndex(dayIndex, lessonIndex, date);
    return this.appliedPatches[index];
  }

  private mergeTimetable(): MergedTimetable {
    const maxIndex = Math.max(
      ...this.patches.map(patch => patch.index),
      ...Object.keys(this.currentWeek).map(key =>
        Math.max(
          ...this.currentWeek[key].map(lesson =>
            lesson.lesson ? lesson.lesson.index : -1
          )
        )
      )
    );
    const timetable = {
      [Day.Monday]: [],
      [Day.Tuesday]: [],
      [Day.Wednesday]: [],
      [Day.Thursday]: [],
      [Day.Friday]: [],
      [Day.Saturday]: []
    } as MergedTimetable;
    Object.keys(this.currentWeek).map(day => {
      for (let i = 0; i <= maxIndex; i++) {
        const patch = this.getPatch(day, i);
        if (patch) {
          timetable[day].push({ id: v4(), lesson: patch });
        } else {
          const lesson =
            (this.currentWeek[day][i] && this.currentWeek[day][i].lesson) ||
            null;
          timetable[day].push({ id: v4(), lesson });
        }
      }
      while (
        timetable[day].length &&
        !timetable[day][timetable[day].length - 1].lesson
      ) {
        timetable[day].pop();
      }
    });
    return timetable;
  }

  private getPatchIndex(
    dayIndex: string | number,
    lessonIndex: number,
    date: Date = new Date(this.start)
  ) {
    date.setDate(date.getDate() + +dayIndex);
    return date.toLocaleDateString('ru-RU') + '_' + lessonIndex;
  }

  startDragging() {
    this.isDragging = true;
  }

  stopDragging() {
    this.isDragging = false;
  }

  moveWeek(move: number) {
    const newDate = new Date(this.start);
    newDate.setDate(this.start.getDate() + 7 * move);
    this.start = newDate;
    this.updateCurrentTimetable().then(() => {
      this.setHeights();
    });
  }

  updateCurrentTimetable() {
    return this.loadPatches({
      type: this.user.type,
      id: this.user.entityId
    }).then(() => {
      this.applyPatches();
      this.currentTimetable = this.mergeTimetable();
      this.$nextTick(() => {
        this.setHeights();
      });
    });
  }

  mounted() {
    const date = new Date(this.start);
    date.setDate(
      this.start.getDate() - (this.start.getDay() ? this.start.getDay() - 1 : 6)
    );
    this.start = date;

    (this.hasLoaded ? Promise.resolve() : this.loadTimetable())
      .then(() => {
        return this.updateCurrentTimetable();
      })
      .then(() => {
        document.documentElement.addEventListener('resize', this.setHeights);
      });
  }

  destroyed() {
    document.documentElement.removeEventListener('resize', this.setHeights);
  }

  private setHeights() {
    const heights = Array(this.maxLessonsCount).fill(0);
    this.carousel.$children.forEach(slide => {
      slide.$children.forEach((view, row) => {
        if (view.$el.clientHeight > heights[row]) {
          heights[row] = view.$el.clientHeight;
        }
      });
    });
    this.lessonHeights = heights;
    this.carousel.$children.forEach(slide => {
      slide.$children.forEach((view, row) => {
        (view.$el as HTMLElement).style.height = `${heights[row]}px`;
      });
    });
  }

  lessonDate(day: number) {
    const date = new Date(this.start);
    date.setDate(date.getDate() + +day);
    return date.toLocaleDateString('ru-RU');
  }

  private applyPatches() {
    let date;
    this.patches.forEach(patch => {
      patch.dates.forEach(patchDate => {
        date = new Date(patchDate);
        this.appliedPatches[
          date.toLocaleDateString('ru-RU') + '_' + patch.index
        ] = patch;
      });
    });
  }
}
</script>

<style lang="sass">
@import "../assets/common/timetable"
.timetable
  &__week-selector
    display: flex
    justify-content: space-around
    align-items: center

  &__order
    top: 64px

    h3
      text-align: center

  .day
    &__date
      text-align: center
</style>
