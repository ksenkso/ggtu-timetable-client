<template>
  <div :class="className">
    <h2 class="card__header" v-if="!noHeader">
      <slot name="header"></slot>
    </h2>
    <div class="card__content">
      <slot></slot>
    </div>
    <div class="card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Prop } from 'vue-property-decorator';

@Component({
  name: 'Card'
})
export default class Card extends Vue {
  @Prop() theme?: string;
  @Prop() noHeader?: boolean;

  get className() {
    const classes = ['card'];
    if (this.theme) {
      classes.push(`card_theme-${this.theme}`);
    }
    return classes;
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/variables'
@import '../../assets/functions'
.card
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .17)
  overflow: hidden
  border-radius: .3125rem
  background-color: #fff

  &_theme
    @each $mod, $color in $colors
      &-#{$mod}
        background-color: rgba($color, .3)
        color: #222

        .card__header
          border-color: $color

  &_striped
    background-image: repeating-linear-gradient(45deg, rgba(theme-color("warning"), .1) 0px, rgba(theme-color("warning"), .1) 15px, rgba(theme-color("warning"), .4) 15px, rgba(theme-color("warning"), .4) 30px)

    .card__content
      height: 100%
      display: flex
      align-items: center
      justify-content: center
      font-size: 2rem
      font-weight: bold
      color: #333333
      @media (max-width: 430px)
        font-size: 1.4rem

  &__header
    border-bottom: 1px solid #ddd

  &__header, &__footer
    padding: .5rem 1rem

    &:empty
      display: none

  &__content
    padding: 1em

  &__row
    margin-bottom: 1rem

    &:last-child
      margin-bottom: 0

  &_hover
    transition: box-shadow .3s ease-in-out

    &:hover
      box-shadow: 0 2px 7px 0 rgba(0, 0, 0, .21)

  h1, h2, h3
    margin: 0

  p
    margin-top: .5rem

    &:last-child
      margin-bottom: 0
</style>
