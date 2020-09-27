<template>
  <div class="screen">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'Screen'
})
export default class Screen extends Vue {}
</script>

<style scoped lang="sass">
.screen
  padding: 2rem
  display: flex
  flex-direction: column
</style>
