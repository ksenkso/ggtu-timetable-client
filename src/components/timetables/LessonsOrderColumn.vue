<template>
  <div class="timetable__order-column" ref="lessonNumbers">
    <div
      class="timetable__lesson-number"
      v-for="index in lessonsCount"
      :key="index"
      :style="getStyle(index - 1)"
      ref="lessonIndices"
    >
      {{ index }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator';

@Component({
  name: 'LessonsOrderColumn'
})
export default class LessonsOrderColumn extends Vue {
  @Prop({ required: true }) lessonsCount!: number;
  @Prop({ required: true }) itemHeights!: number[];
  @Ref('lessonIndices') lessonIndices: HTMLElement[];

  static calculateHeight(height) {
    return `${height + 10}px`;
  }

  getStyle(index: number) {
    return {
      height: !isNaN(this.itemHeights[index])
        ? LessonsOrderColumn.calculateHeight(this.itemHeights[index])
        : 'auto'
    };
  }
}
</script>

<style lang="sass">
@import "../../assets/functions"
@import "../../assets/variables"
.timetable
  &_current
    .timetable__order-column
      top: 59px

  &_regular
    .timetable__order-column
      top: 40px

  &__order-column
    position: absolute
    left: 0
    display: flex
    flex-direction: column
    row-gap: 6px
    width: $lessons-order-width
    @media (max-width: 400px)
      width: 1.5rem

  &__lesson-number
    user-select: none
    pointer-events: none
    display: flex
    align-items: center
    width: 100%
    justify-content: center
    border: 1px solid #dddddd
    border-radius: 3px
    font-weight: bold
    background-color: theme-color("light")
    z-index: 2
</style>
