<template>
  <button :type="type" :disabled="disabled" :class="className">
    <slot>Кнопка</slot>
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'Button'
})
export default class Button extends Vue {
  @Prop() theme?: string;
  @Prop({ default: 'button' }) type!: string;
  @Prop({ type: Boolean }) disabled!: boolean;
  @Prop({ type: Boolean }) round!: boolean;
  @Prop() size?: string;
  get className() {
    const classes = ['button', { 'button_look-round': this.round }];
    if (this.theme) {
      classes.push(`button_theme-${this.theme}`);
    }
    if (this.size) {
      classes.push(`button_size-${this.size}`);
    }
    return classes;
  }
}
</script>

<style lang="sass">
@import "../../assets/functions"
.button
  border: 1px solid theme-color("dark")
  padding: 6px 12px
  border-radius: 3px
  background-color: #fff
  vertical-align: middle
  cursor: pointer
  transition: filter .1s ease-in-out
  text-decoration: none
  line-height: 1.6
  font-size: 1rem

  &[disabled]
    filter: grayscale(70%)
    color: theme-color("light")

  &_block
    display: block
    width: 100%
  &_look
    &-round
      border-radius: 50%
      width: 2rem
      height: 2rem
      text-align: center
      padding: 0
      vertical-align: middle
      line-height: 1
      display: inline-block
      svg
        height: 100%
        width: 100%
  &_size
    &-big
      font-size: 1.5rem
  &_theme
    @each $mod, $color in $colors
      &-#{$mod}
        background: $color
        border: none
        color: map-get($bgToTextMapping, $mod)
        outline-color: scale-color($color, $lightness: 30%)
        @if ($mod == "light")
          border: 1px solid theme-color("gray")
</style>
