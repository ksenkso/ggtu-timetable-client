<template>
  <div class="page">
    <Header :title="title"></Header>
    <Menu ref="menu"></Menu>
    <main class="page__content">
      <slot></slot>
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Header from '@/components/common/Header.vue';
import Menu from '@/components/common/Menu.vue';
import { Ref } from 'vue-property-decorator';

@Component({
  name: 'Page',
  components: { Header, Menu }
})
export default class Page extends Vue {
  @Prop({ default: 'Расписание ГГТУ' }) title!: string;
  @Ref('menu') menu!: Menu;
}
</script>

<style lang="sass">
@import "../../assets/variables"
.page
  max-width: 100%
  overflow: hidden
  height: 100%
  display: grid
  grid-template-rows: #{$header-height} 1fr
  grid-template-columns: 240px calc(100vw - 240px)
  grid-template-areas: "header header" "menu content"
  position: relative
  &__content
    grid-area: content
    overflow: auto
  .menu
    grid-area: menu
  .header
    grid-area: header
  @media (max-width: 960px)
    height: auto
    overflow: auto
    grid-template-columns: auto
    grid-template-rows: #{$header-height} 1fr #{48 + 64}px
    grid-template-areas: "header" "content" "menu"
</style>
