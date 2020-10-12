<template>
  <div class="timetable" v-if="hasLoaded">
    <h3>Неделя {{ weekNumber }}</h3>
    <Button @click.native="moveWeek(-1)">prev</Button>
    <Button @click.native="moveWeek(1)">next</Button>
    <div :class="['timetable__week', { timetable__week_dragging: isDragging }]">
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
          v-for="(day, dayNumber) in currentWeek"
          class="timetable__day"
          :key="dayNumber"
        >
          <div class="timetable__day-label">{{ dayNumber | dayName }}</div>
          <div>{{ lessonDate(dayNumber) }}</div>
          <div class="timetable__lessons">
            <div
              class="timetable__lesson"
              v-for="(lesson, index) in day"
              :key="lesson.id"
            >
              <div v-if="getPatch(dayNumber, index)">
                {{ getPatch(dayNumber, index).subject.name }}
              </div>
              <LessonView v-if="lesson" :lesson="lesson"></LessonView>
            </div>
          </div>
          <Alert
            class="timetable__empty-day"
            v-if="!day.length"
            theme="warning"
          >
            <h3>Самоподготовка</h3>
          </Alert>
        </slide>
      </carousel>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import Page from '@/components/common/Page.vue';
import { LOAD_DEFAULT_TIMETABLE, LOAD_PATCHES } from '@/store/action-types';
import TimetableCard from '@/components/timetables/TimetableCard.vue';
import ButtonGroup from '@/components/common/ButtonGroup.vue';
import {
  Day,
  EntityType,
  Patch,
  RegularTimetable,
  Week
} from 'ggtu-timetable-api-client';
import LessonView from '@/components/timetables/LessonView.vue';

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
  // return weekNumber % 2 === 0 ? Week.Top : Week.Bottom;
}

@Component({
  name: 'CurrentTimetable',
  components: { LessonView, Page, TimetableCard, ButtonGroup },
  filters: {
    dayName(index: string) {
      return dayNames[index];
    }
  }
})
export default class CurrentTimetable extends Vue {
  @State(state => state.user) user!: { type: EntityType; entityId: number };
  @State(state => state.timetable.default) timetable!: RegularTimetable;
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
  @Ref('carousel') carousel!: Vue;
  // week = Week.Top;
  isDragging = false;
  appliedPatches: Record<string, Patch> = {};
  start = new Date();

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

  getPatch(dayIndex: string, lessonIndex: number) {
    const index = this.getPatchIndex(dayIndex, lessonIndex);
    return this.appliedPatches[index];
  }

  /*private mergeTimetable(
    lessons: Record<string, (Lesson | null)[]>,
    patches: Patch[]
  ) {}*/

  private getPatchIndex(
    dayIndex: string,
    lessonIndex: number,
    date: Date = new Date(this.start)
  ) {
    date.setDate(date.getDate() + +dayIndex - 1);
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
  }

  mounted() {
    const date = new Date(this.start);
    date.setDate(
      this.start.getDate() - (this.start.getDay() ? this.start.getDay() - 1 : 6)
    );
    this.start = date;

    (this.hasLoaded ? Promise.resolve() : this.loadTimetable())
      .then(() => {
        return this.loadPatches({
          type: this.user.type,
          id: this.user.entityId
        });
      })
      .then(() => {
        this.$nextTick(() => {
          this.applyPatches();
        });

        this.setHeights();
        document.documentElement.addEventListener('resize', this.setHeights);
      });
  }

  destroyed() {
    document.documentElement.removeEventListener('resize', this.setHeights);
  }

  private setHeights() {
    const heights = [0, 0, 0, 0, 0, 0];
    this.carousel.$children.forEach(slide => {
      slide.$children.forEach((view, row) => {
        if (view.$el.clientHeight > heights[row]) {
          heights[row] = view.$el.clientHeight;
        }
      });
    });
    this.carousel.$children.forEach(slide => {
      slide.$children.forEach((view, row) => {
        (view.$el as HTMLElement).style.height = `${heights[row]}px`;
      });
    });
  }

  lessonDate(day: string) {
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
@import "../assets/functions"
@import "../assets/variables"
.VueCarousel
  height: 100%

  &-inner
    height: 100% !important

.container
  height: calc(100vh - #{$header-height} - 64px) !important

.timetable
  display: flex
  flex-direction: column


  .button-group
    margin-left: auto
    max-width: 180px
    margin-bottom: 1rem
    @media (max-width: 768px)
      max-width: 100%
      margin-left: 0
      order: 1
      margin-bottom: 0
      position: fixed
      bottom: 64px
      width: calc(100% - 1rem)
      z-index: 9999

  &__day-label
    text-align: center
    margin-bottom: 1rem
    font-weight: bold
    font-size: 24px

  &__week
    overflow: hidden
    cursor: grab

    &_dragging
      cursor: grabbing


  &__day
    max-width: calc(100vw - 1rem)
    padding: 0 .5rem
    height: 100%
    display: flex
    flex-direction: column

  &__lessons
    overflow: auto
    height: 100%
    padding: 0 5px

    &::-webkit-scrollbar
      border-radius: 4px
      width: 8px
      overflow: hidden

    &::-webkit-scrollbar-thumb
      background-color: #ccc

      border-radius: 4px

  &__empty-day
    display: flex
    align-items: center
    justify-content: center
    height: 180px

    &.alert
      margin-top: 0 !important

    h3
      color: darken(theme-color("warning"), 30%)

  &__lesson
    margin-bottom: 1rem
</style>