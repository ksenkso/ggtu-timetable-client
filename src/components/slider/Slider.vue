<template>
  <div class="slider">
    <div class="slider__content" :style="contentStyle">
      <slot></slot>
    </div>
    <div class="slider__dots">
      <div
        :class="[
          'slider__dot',
          { slider__dot_current: screenIndex === currentScreen }
        ]"
        v-for="screenIndex in screensCount"
        :key="screenIndex"
        @click="setScreen(screenIndex)"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'Slider'
})
export default class Slider extends Vue {
  currentScreen = 0;
  width = 0;

  constructor() {
    super();
    this.updateWidth = this.updateWidth.bind(this);
  }

  get screensCount(): number {
    return this.$slots.default?.length || 0;
  }

  get contentStyle() {
    return {
      width: this.screensCount * this.width + 'px',
      left: -(this.currentScreen * this.width) + 'px'
    };
  }

  prev() {
    if (this.currentScreen !== 0) {
      this.currentScreen--;
    }
  }

  next() {
    if (this.currentScreen !== this.screensCount - 1) {
      this.currentScreen++;
    }
  }

  updateWidth() {
    this.width = this.$el.clientWidth;
  }

  setScreen(index: number) {
    this.currentScreen = index;
  }

  mounted() {
    this.updateWidth();
    window.addEventListener('resize', this.updateWidth);
  }

  beforeUnmount() {
    document.removeEventListener('resize', this.updateWidth);
  }
}
</script>

<style scoped lang="sass">
.slider
  width: 100%
  height: 100%

  position: relative
  overflow: hidden

  &__content
    position: absolute
    height: 100%
    display: flex
    justify-content: space-between
    transition: left .3s ease-in-out
    > *
      flex-basis: 100%

  &__dots
    position: absolute
    bottom: 1rem
    left: 50%
    transform: translateX(-50%)

  &__dot
    margin-right: .5rem
    display: inline-block
    background-color: rgba(0, 0, 0, .2)
    transition: background-color .1s ease-in-out

    &_selected
      background-color: #ffffff

    &:last-child
      margin-right: 0
</style>
