<template>
  <div class="timetable__order-column order" ref="lessonNumbers">
    <div
      class="order__item timetable__lesson-number"
      v-for="index in lessonsCount"
      :key="index"
      :style="getStyle(index - 1)"
      ref="lessonIndices"
    >
      <div class="order__number">{{ index }}</div>
      <div class="order__shadow"></div>
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
  @Ref('lessonIndices') lessonIndices!: HTMLElement[];

  static calculateHeight(height: number) {
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
    .order
      top: 59px

  &_regular
    .order
      top: 40px

.order
  position: absolute
  left: 0
  display: flex
  flex-direction: column
  row-gap: 6px
  width: $lessons-order-width
  @media (max-width: 400px)
    width: 1.5rem

  &__item
    user-select: none
    pointer-events: none
    display: flex
    align-items: center
    width: 100%
    justify-content: center
    border-radius: 3px
    font-weight: bold
    z-index: 2
    position: relative

  &__number
    background-color: theme-color("light")
    border: 1px solid #dddddd
    width: 100%
    height: 100%
    display: flex
    justify-content: center
    align-items: center
    position: relative
    z-index: 2

  &__shadow
    z-index: 0
    position: absolute
    top: -5px
    right: -5px
    width: 10px
    height: calc(100% + 10px)

    background: radial-gradient(farthest-side, rgba(0, 0, 0, 0.13), transparent)
</style>
