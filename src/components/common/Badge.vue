<template>
  <span :class="className">
    <slot></slot>
  </span>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Prop } from 'vue-property-decorator';

@Component({
  name: 'Badge'
})
export default class Badge extends Vue {
  @Prop() theme?: string;
  get className() {
    const classes = ['badge'];
    if (this.theme) {
      classes.push(`badge_theme-${this.theme}`);
    }
    return classes;
  }
}
</script>

<style scoped lang="sass">
@import '../../assets/variables'
@import '../../assets/functions'
.badge
  display: inline-block
  padding: 0 .3em
  font-size: 1rem
  border-radius: .2em
  vertical-align: middle
  &_theme
    @each $mod, $color in $colors
      &-#{$mod}
        background: $color
        color: map-get($bgToTextMapping, $mod)
</style>
