<template>
  <div :class="['menu', { menu_open: isOpen }]">
    <router-link
      class="menu__item"
      exact
      active-class="menu__item_active"
      v-for="item in items"
      :key="item.name"
      :to="item.to"
      >{{ item.name }}
    </router-link>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'Menu'
})
export default class Menu extends Vue {
  items = [
    { name: 'Моё расписание', to: '/' },
    { name: 'Текущее расписание', to: '/current' }
  ];
  isOpen = false;

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }
}
</script>

<style scoped lang="sass">
@import "../../assets/variables"
@import "../../assets/functions"
.menu
  background-color: #ffffff
  box-shadow: 2px 0 5px 0 rgba(0, 0, 0, .13)
  padding: 2rem 1rem
  display: flex
  flex-direction: column

  &__item
    color: #000
    text-decoration: none
    margin-bottom: 1rem

    &_active, &:hover, &:active
      text-decoration: underline
      color: theme-color("primary")

  @media (max-width: 960px)
    flex-direction: row
    padding: 0
    box-shadow: 0 -2px 5px 0 rgba(0, 0, 0, .13)
    align-items: center
    justify-content: space-evenly
    position: fixed
    width: 100%
    bottom: 0

    z-index: 9999
    &__item
      margin-bottom: 0
      @media (max-width: 960px)
        padding: 1rem
        display: inline-block
        border-right: 1px solid #dddddd
        &:last-child
          border-right: none
</style>
