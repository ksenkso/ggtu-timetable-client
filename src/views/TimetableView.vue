<template>
  <Page>
    <div class="timetable" v-if="hasLoaded">
      <div
        class="timetable__lesson lesson"
        v-for="(lesson, index) in currentDay"
        :key="lesson.id"
      >
        <h3>Пара {{ index + 1 }}</h3>
        <Alert v-if="isEmptyLesson(lesson)" theme="warning">Пары нет</Alert>
        <div v-else class="lesson__content">
          <div class="lesson__name">{{ lesson.lesson.name }}</div>
          <div class="lesson__type">{{ lesson.type | lessonType }}</div>
          <div class="lesson__cabinet">
            {{ lesson.cabinet | lessonCabinet }}
          </div>
          <div class="lesson__teachers">
            {{ lesson.teachers | joinNamedEntities }}
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { TimetableEntry } from 'ggtu-timetable-api-client';
import { TimetableEntryType } from 'ggtu-timetable-api-client';
import { State } from 'vuex-class';
import Page from '@/components/Page.vue';
import { LOAD_DEFAULT_TIMETABLE } from '@/store/action-types';
import { EmptyTimetableEntry } from '@/utils/timetable';
import { NamedEntity } from '@/store/types';
import { Cabinet } from 'ggtu-timetable-api-client';

@Component({
  name: 'TimetableView',
  components: { Page },
  filters: {
    lessonType(type: TimetableEntryType) {
      switch (type) {
        case TimetableEntryType.Lab:
          return 'Лабораторное занятие';
        case TimetableEntryType.Lecture:
          return 'Лекция';
        case TimetableEntryType.Practice:
          return 'Практическое занятие';
        case TimetableEntryType.Empty:
          return 'Нет занятия';
      }
    },
    joinNamedEntities(teachers: NamedEntity[]) {
      return teachers.map(teacher => teacher.name).join(', ');
    },
    lessonCabinet(cabinet: Cabinet): string {
      if (cabinet.building) {
        return cabinet.building?.name + ', ' + cabinet.name;
      }
      return cabinet.name;
    }
  }
})
export default class TimetableView extends Vue {
  @State(state => state.timetable.default) timetable!: (
    | TimetableEntry
    | EmptyTimetableEntry
  )[][][];
  @State(state => state.timetable.hasLoaded) hasLoaded!: boolean;

  get currentDay() {
    return this.timetable[0][0];
  }

  isEmptyLesson(lesson: TimetableEntry | EmptyTimetableEntry) {
    return lesson.type === TimetableEntryType.Empty;
  }

  mounted() {
    if (!this.hasLoaded) {
      this.$store.dispatch(LOAD_DEFAULT_TIMETABLE);
    }
  }
}
</script>

<style scoped lang="sass">
.timetable
  padding: 1rem
  display: grid
  grid-template-rows: repeat(auto-fit, 1fr)
  grid-row-gap: 1rem
  &__lesson
    padding: .8rem .5rem
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .13)
</style>
