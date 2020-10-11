<template>
  <Card>
    <template slot="header"> Пара {{ lesson.index + 1 }} </template>
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
  </Card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Lesson } from 'ggtu-timetable-api-client';
import Card from '@/components/common/Card.vue';

@Component({
  name: 'LessonView',
  components: { Card }
})
export default class LessonView extends Vue {
  @Prop({ required: true }) lesson!: Lesson;
}
</script>

<style lang="sass">
.card__footer
  display: flex
  justify-content: flex-end
  column-gap: 1rem
</style>
