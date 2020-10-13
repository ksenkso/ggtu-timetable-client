<template>
  <Card
    :theme="!lesson && 'warning'"
    :class="[
      'timetable__lesson',
      { timetable__lesson_patch: this.lesson && !this.lesson.isRegular }
    ]"
  >
    <template slot="header">
      Пара {{ index + 1 }}
      <Badge theme="primary" v-if="lesson && !lesson.isRegular"
        >изменение</Badge
      >
    </template>
    <template v-if="lesson">
      <div class="card__row">
        <p>
          {{ lesson.subject.name }}
          <br />
          {{ lesson.type | lessonType }}
          <br />
          {{ lesson.cabinet | cabinetName }}
        </p>
      </div>
      <div class="card__row">
        <p></p>
      </div>
      <div class="card__row">
        <ul class="list">
          <li
            class="list__item"
            v-for="teacher in lesson.teachers"
            :key="teacher.id"
          >
            {{ teacher.name }}
          </li>
        </ul>
      </div>
    </template>
    <template v-else>
      Нет пары
    </template>
  </Card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Lesson } from 'ggtu-timetable-api-client';
import Card from '@/components/common/Card.vue';
import { Patch } from 'ggtu-timetable-api-client';

@Component({
  name: 'LessonView',
  components: { Card }
})
export default class LessonView extends Vue {
  @Prop({ required: true }) lesson!: Lesson | Patch | null;
  @Prop({ required: true }) index!: number;
}
</script>

<style lang="sass">
@import "../../assets/functions"
.card__header
  display: flex
  align-items: center
  .badge
    margin-left: auto

.card__footer
  display: flex
  justify-content: flex-end
  column-gap: 1rem
</style>
