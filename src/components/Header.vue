<template>
  <header class="header">
    <h1 v-if="title">{{ title }}</h1>
  </header>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'Header'
})
export default class Header extends Vue {
  @Prop() title?: string;
}
</script>

<style scoped lang="sass">
@import "../assets/functions"
.header
  height: 48px
  color: #ffffff
  background-color: theme-color("primary")
  padding: 0 1rem
  display: flex
  align-items: center

  h1
    margin: 0
</style>
