<template>
  <Card
    :no-header="true"
    :theme="!lesson && 'warning'"
    :class="[
      'day__lesson',
      { day__lesson_patch: this.lesson && !this.lesson.isRegular },
      { card_striped: !lesson }
    ]"
  >
    <template v-if="lesson">
      <div class="flex" v-if="lesson && !lesson.isRegular">
        <Badge theme="primary">изменение</Badge>
      </div>
      <div class="card__row">
        <p>{{ lesson.subject.name }}</p>
        <p :style="{ fontStyle: 'italic' }">{{ lesson.type | lessonType }}</p>
        <p>{{ lesson.cabinet | cabinetName }}</p>
      </div>
      <div class="card__row">
        <ul class="teachers">
          <li
            class="teacher"
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
@import "../../assets/common/utils"
@import "../../assets/functions"
.day__lesson
  margin-bottom: 1rem
  &_empty
    .card__content
      height: 100%
      display: flex
      align-items: center
      justify-content: center
      font-size: 2rem
      font-weight: bold
      color: #333333
.card
  .badge
    margin-left: auto

.card__row p
  margin: 0 0 .2rem 0

.card__footer
  display: flex
  justify-content: flex-end
  column-gap: 1rem

.teachers
  list-style: none
  padding-left: 0
  margin-bottom: 0
</style>
