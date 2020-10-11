<template>
  <div class="timetable" v-if="hasLoaded">
    <ButtonGroup
      @change="changeWeek"
      :default-index="0"
      :values="weeks"
    ></ButtonGroup>
    <div :class="['timetable__week', { timetable__week_dragging: isDragging }]">
      <carousel
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
          <div class="timetable__lessons" v-if="day.length">
            <div
              class="timetable__lesson"
              v-for="lesson in day"
              :key="lesson.id"
            >
              <TimetableCard :entry="lesson"></TimetableCard>
            </div>
          </div>
          <Alert class="timetable__empty-day" v-else theme="warning">
            <h3>Самоподготовка</h3>
          </Alert>
        </slide>
      </carousel>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import Page from '@/components/common/Page.vue';
import { LOAD_DEFAULT_TIMETABLE } from '@/store/action-types';
import TimetableCard from '@/components/timetables/TimetableCard.vue';
import ButtonGroup from '@/components/common/ButtonGroup.vue';
import { ButtonGroupValue } from '@/components/common/ButtonGroup.vue';
import {
  Day,
  RegularTimetable as Timetable,
  Week
} from 'ggtu-timetable-api-client';

const dayNames: Record<string, string> = {
  [Day.Monday]: 'Пн',
  [Day.Tuesday]: 'Вт',
  [Day.Wednesday]: 'Ср',
  [Day.Thursday]: 'Чт',
  [Day.Friday]: 'Пт',
  [Day.Saturday]: 'Сб'
};

@Component({
  name: 'RegularTimetable',
  components: { Page, TimetableCard, ButtonGroup },
  filters: {
    dayName(index: string) {
      return dayNames[index];
    }
  }
})
export default class RegularTimetable extends Vue {
  @State(state => state.timetable.default) timetable!: Timetable;
  @State(state => state.timetable.hasLoaded) hasLoaded!: boolean;
  week = Week.Top;
  isDragging = false;

  get weeks() {
    return ['Верхняя', 'Нижняя'];
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
  }

  mounted() {
    if (!this.hasLoaded) {
      this.$store.dispatch(LOAD_DEFAULT_TIMETABLE);
    }
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

    h3
      color: darken(theme-color("warning"), 30%)

  &__lesson
    margin-bottom: 1rem
</style>
