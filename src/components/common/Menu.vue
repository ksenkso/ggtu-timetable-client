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
  padding: 2rem 0
  display: flex
  flex-direction: column

  &__item
    text-decoration: none
    color: #000
    padding: .5rem 1rem

    &_active, &:active
      color: theme-color("primary")
      font-weight: bolder
    &:hover
      text-decoration: underline
    &_active:hover
      text-decoration: none

  @media (max-width: 960px)
    flex-direction: row
    padding: 0
    box-shadow: 0 -2px 5px 0 rgba(0, 0, 0, .13)
    justify-content: space-evenly
    position: fixed
    width: 100%
    bottom: 0
    z-index: 9999
    &__item
      flex: 1 1 100%
      margin-bottom: 0
      padding: 1rem
      border-right: 1px solid #dddddd
      text-align: center
      &:last-child
        border-right: none
</style>
