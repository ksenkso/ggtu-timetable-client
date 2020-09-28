<template>
  <div :class="['lesson', { lesson_empty: isEmpty }]">
    <h3>Пара {{ entry.index + 1 }}</h3>
    <template v-if="isEmpty">
      <div class="lesson__empty">Пары нет</div>
    </template>
    <template v-else>
      <div class="lesson__name">{{ entry.lesson.name }}</div>
      <div class="lesson__type">{{ entry.type | lessonType }}</div>
      <div class="lesson__place">{{ entry.cabinet | lessonCabinet }}</div>
      <div class="lesson__teachers">
        {{ entry.teachers | joinNamedEntities }}
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Prop } from 'vue-property-decorator';
import { TimetableEntry } from 'ggtu-timetable-api-client';
import { TimetableEntryType } from 'ggtu-timetable-api-client';
import { Cabinet } from 'ggtu-timetable-api-client';
import { NamedEntity } from '@/store/types';

@Component({
  name: 'TimetableCard',
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
        return cabinet.building?.name + '\n' + cabinet.name;
      }
      return cabinet.name;
    }
  }
})
export default class TimetableCard extends Vue {
  @Prop({ required: true }) entry!: TimetableEntry;

  get isEmpty() {
    return this.entry.type === TimetableEntryType.Empty;
  }
}
</script>

<style scoped lang="sass">
@import "../../assets/functions"

.lesson
  display: grid
  grid-template-columns: 1fr 100px
  grid-template-rows: repeat(auto-fit, 1fr)
  grid-template-areas: "title title" "name place" "type place" "teachers place"
  grid-row-gap: .5rem
  padding: 1.5rem 1rem
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .13)
  &_empty
    background-color: rgba(theme-color("warning"), .3)
    color: darken(theme-color("warning"), 30%)
    display: block
  h3
    margin-top: 0
  &__place
    white-space: pre-wrap
    text-align: right
    grid-area: place
    line-height: 1.6
  &__teachers
    grid-area: teachers
  &__name
    grid-area: name
  &__type
    grid-area: type
</style>
