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
import { directive as onClickAway } from 'vue-clickaway';

@Component({
  name: 'Menu',
  directives: { onClickAway }
})
export default class Menu extends Vue {
  items = [{ name: 'Моё расписание', to: '/' }];
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
    &:visited
      //color: inherit
    &_active, &:hover, &:active
      text-decoration: underline
      color: theme-color("primary")
  @media (max-width: 960px)
    flex-direction: row
    padding: 1rem
    box-shadow: 0 -2px 5px 0 rgba(0, 0, 0, .13)
    align-items: center
    justify-content: space-evenly
    &__item
      margin-bottom: 0
</style>
