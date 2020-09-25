<template>
  <div class="page">
    <Header :title="title"></Header>
    <main class="page__content">
      <slot></slot>
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'Page'
})
export default class Page extends Vue {
  @Prop({ default: 'Расписание ГГТУ' }) title!: string;
}
</script>

<style scoped></style>
