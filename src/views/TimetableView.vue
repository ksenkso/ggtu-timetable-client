<template>
  <div class="timetable" v-if="hasLoaded">
    <div class="timetable__week">
      <div
        v-for="(day, dayNumber) in currentWeek"
        class="timetable__day"
        :key="dayNumber"
      >
        <div class="timetable__day-label">{{ dayNumber | dayName }}</div>
        <div class="timetable__lesson" v-for="lesson in day" :key="lesson.id">
          <TimetableCard :entry="lesson"></TimetableCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { TimetableEntry } from 'ggtu-timetable-api-client';
import { State } from 'vuex-class';
import Page from '@/components/common/Page.vue';
import { LOAD_DEFAULT_TIMETABLE } from '@/store/action-types';
import { EmptyTimetableEntry } from '@/utils/timetable';
import TimetableCard from '@/components/timetables/TimetableCard.vue';

@Component({
  name: 'TimetableView',
  components: { Page, TimetableCard },
  filters: {
    dayName(index: number) {
      return ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][index];
    }
  }
})
export default class TimetableView extends Vue {
  @State(state => state.timetable.default) timetable!: (
    | TimetableEntry
    | EmptyTimetableEntry
  )[][][];
  @State(state => state.timetable.hasLoaded) hasLoaded!: boolean;
  week = 0;

  get currentDay() {
    return this.timetable[0][0];
  }

  get currentWeek() {
    return this.timetable[this.week].map((day, i, week) => week[0]);
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
.timetable
  max-width: 100%
  overflow: auto
  &::-webkit-scrollbar
    border-radius: 5px
    height: 10px
    overflow: hidden
  &::-webkit-scrollbar-thumb
    background-color: theme-color("primary")
    border-radius: 5px
  &__day-label
    text-align: center
    margin-bottom: 1rem
    font-weight: bold
    font-size: 24px
  &__week
    display: flex
    column-gap: 2rem

  &__day
    flex: 1 0 450px
    max-width: calc(100vw - 1rem)

  &__lesson
    margin-bottom: 1rem
</style>
