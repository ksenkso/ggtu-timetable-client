<template>
  <div class="timetable" v-if="hasLoaded">
    <TimetableWeek @change="changeWeek"></TimetableWeek>
    <div :class="['timetable__week', { timetable__week_dragging: isDragging }]">
      <div class="timetable__order" ref="lessonNumbers">
        <div
          class="timetable__lesson-number"
          v-for="index in maxIndex + 1"
          :key="index"
          ref="lessonNumber"
        >
          {{ index }}
        </div>
      </div>
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
          class="day"
          :key="dayNumber"
        >
          <div class="day__label">{{ dayNumber | dayName }}</div>
          <div class="day__lessons" v-if="day.length">
            <LessonView
              ref="lessons"
              v-for="(lesson, index) in day"
              :key="lesson.id"
              :lesson="lesson.lesson"
              :index="index"
            ></LessonView>
          </div>
          <div class="timetable__empty-day" v-else>
            <Card class="day__lesson card_striped" theme="warning"
              >Самоподготовка
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
import { LOAD_DEFAULT_TIMETABLE } from '@/store/action-types';
import { Day, Week } from 'ggtu-timetable-api-client';
import { KeyedTimetable } from '@/store';
// @ts-ignore
import { Carousel, Slide } from 'vue-carousel';
import { ButtonGroupValue } from '@/types/common';
import LessonView from '@/components/timetables/LessonView.vue';
import Card from '@/components/common/Card.vue';

const dayNames: Record<string, string> = {
  [Day.Monday]: 'Пн',
  [Day.Tuesday]: 'Вт',
  [Day.Wednesday]: 'Ср',
  [Day.Thursday]: 'Чт',
  [Day.Friday]: 'Пт',
  [Day.Saturday]: 'Сб'
};

@Component({
  name: 'TimetableView',
  components: {
    LessonView,
    Page: () => import('@/components/common/Page.vue'),
    TimetableWeek: () => import('@/components/timetables/TimetableWeek.vue'),
    Card, //: () => import('@/components/common/Card.vue'),
    Carousel,
    Slide
  },
  filters: {
    dayName(index: string) {
      return dayNames[index];
    }
  }
})
export default class TimetableView extends Vue {
  @State(state => state.timetable.default) timetable!: KeyedTimetable;
  @State(state => state.timetable.hasLoaded) hasLoaded!: boolean;
  @Action(LOAD_DEFAULT_TIMETABLE) loadTimetable!: () => Promise<void>;
  @Ref('carousel') carousel!: Vue;
  @Ref('lessonNumber') lessonNumber!: HTMLElement[];
  @Ref('lessons') lessons!: LessonView[];
  week = Week.Top;
  isDragging = false;

  get weeks() {
    return ['Верхняя', 'Нижняя'];
  }

  get maxIndex() {
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

  get currentWeek() {
    return this.timetable[this.week];
  }

  get swiperOptions() {
    return {};
  }

  startDragging() {
    this.isDragging = true;
  }

  stopDragging() {
    this.isDragging = false;
  }

  changeWeek(value: ButtonGroupValue) {
    this.week = value.index;
    this.$nextTick(() => {
      this.setHeights();
      console.log(this.lessons);
    });
  }

  mounted() {
    window.addEventListener('resize', this.setHeights);
    (this.hasLoaded ? Promise.resolve() : this.loadTimetable()).then(() => {
      console.log(this.carousel.$children.map(vm => vm.$children));
      this.$nextTick(() => {
        console.log(this.lessons);
        this.setHeights();
      });
    });
  }

  destroyed() {
    window.removeEventListener('resize', this.setHeights);
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
        this.lessonNumber[row].style.height = `${heights[row]}px`;
      });
    });
  }
}
</script>

<style lang="sass" scoped>
@import "../assets/common/timetable"

.timetable
  padding-top: 3rem
  @media (max-width: 768px)
    padding-top: 0
</style>
