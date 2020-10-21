<template>
  <div class="week-selector__wrapper">
    <div class="week-selector">
      <Button
        class="arrow arrow_left"
        theme="primary"
        @click.native="moveWeek(-1)"
        >&lt;
      </Button>
      <h3>Неделя {{ weekNumber }}</h3>
      <Button
        class="arrow arrow_right"
        theme="primary"
        @click.native="moveWeek(1)"
        >&gt;
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'WeekSelector'
})
export default class WeekSelector extends Vue {
  @Prop({ required: true }) startWeek!: number;
  weekNumber = 0;

  moveWeek(move: number) {
    this.weekNumber += move;
    this.$emit('change', move);
  }

  mounted() {
    this.weekNumber = this.startWeek;
  }
}
</script>

<style scoped lang="sass">
@import "../../assets/variables"
@import "../../assets/functions"

.week-selector
  max-width: 400px
  width: 100%
  margin: 0 auto
  display: flex
  justify-content: space-around
  align-items: center

  &__wrapper
    padding-left: 3rem
    @media (max-width: 960px)
      margin-left: 0

  h3
    text-align: center

  .arrow
    background-size: contain
    background-position: 50% 50%
    background-repeat: no-repeat
    background-image: url(../../assets/arrow_right.svg)
    color: transparent

    &:focus
      outline: none

    &_left
      transform: rotate(180deg)


  @media (max-width: 960px)
    color: #ffffff
    max-height: 60px
    background-color: theme-color("primary")
    //background-image: linear-gradient(to right, nth($gradient-colors, 1) -40%, nth($gradient-colors, 2) 120%)
    position: fixed
    bottom: 0
    z-index: 10
    left: 0
    max-width: 100%
    width: 100%
</style>
