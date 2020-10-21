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
    <button class="menu__close" @click="close"></button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const menu = namespace('menu');

@Component({
  name: 'Menu'
})
export default class Menu extends Vue {
  @menu.State('isOpen') isOpen!: boolean;
  @menu.Action('CLOSE') close!: () => void;

  items = [
    { name: 'Моё расписание', to: '/' },
    { name: 'Текущее расписание', to: '/current' }
  ];
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
  max-width: 80%

  &__close
    display: none
    cursor: pointer
    background-color: transparent
    background-image: url(../../assets/close.svg)
    background-repeat: no-repeat
    background-position: 50%
    border: none
    padding: 2rem
    margin-top: auto
    @media (max-width: 960px)
      display: block
    &:active
      outline-color: theme-color("primary")

  &__item
    text-decoration: none
    color: #000
    padding: .5rem 1rem

    &_active, &:active
      color: theme-color("primary")

    &:hover
      text-decoration: underline

    &_active:hover
      text-decoration: none

  @media (max-width: 960px)
    //flex-direction: row
    padding: 0
    box-shadow: 0 -2px 5px 0 rgba(0, 0, 0, .13)
    position: fixed
    width: 100%
    bottom: 0
    left: 0
    transform: translateX(-105%)
    transition: transform .3s ease-in-out
    height: 100%
    z-index: 100
    &_open
      transform: translateX(0)
    &__item
      margin-bottom: 0
      padding: 1rem
</style>
