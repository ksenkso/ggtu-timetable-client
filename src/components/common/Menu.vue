<template>
  <div :class="['menu', { menu_open: isOpen }]">
    <h3 class="timetable-entity">{{ name }}</h3>
    <router-link
      class="menu__item"
      exact
      @click.native="close"
      active-class="menu__item_active"
      v-for="item in items"
      :key="item.name"
      :to="item.to"
      >{{ item.name }}
    </router-link>
    <div v-if="isAuthenticated" class="menu__item" @click="onLogout">
      Выход
    </div>
    <button class="menu__close" @click="close"></button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter, Mutation, namespace, State } from 'vuex-class';
import { LOGOUT } from '@/store/mutation-types';
import { Group, Teacher } from 'ggtu-timetable-api-client';
import api from '@/api';
import Endpoint from 'ggtu-timetable-api-client/dist/endpoints/Endpoint';

const menu = namespace('menu');

@Component({
  name: 'Menu'
})
export default class Menu extends Vue {
  @menu.State('isOpen') isOpen!: boolean;
  @menu.Action('CLOSE') close!: () => void;
  @State('user') user!: { type: string; entityId: number };
  @Getter('isAuthenticated') isAuthenticated!: boolean;
  @Mutation(LOGOUT) logout!: () => void;

  items = [
    { name: 'Моё расписание', to: '/' },
    { name: 'Текущее расписание', to: '/current' }
  ];
  name = '';

  onLogout() {
    this.logout();
    this.$router.push({ name: 'FirstVisit' });
  }

  created() {
    const endpoint = (this.user.type === 'group'
      ? api.groups
      : api.teachers) as Endpoint<Group | Teacher>;
    endpoint.get(this.user.entityId).then((response: Group | Teacher) => {
      this.name = response.name;
    });
  }
}
</script>

<style scoped lang="sass">
@import "../../assets/variables"
@import "../../assets/functions"
.menu
  grid-area: menu
  background-image: radial-gradient(circle at center -80%, nth($gradient-colors, 1), nth($gradient-colors, 2) 120%)
  box-shadow: 2px 0 5px 0 rgba(0, 0, 0, .13)
  padding: 2rem 0
  display: flex
  flex-direction: column

  &__close
    display: none
    width: 100%
    height: 60px
    cursor: pointer
    background-color: rgba(0, 0, 0, .1)
    background-image: url(../../assets/close.svg)
    background-size: contain
    background-repeat: no-repeat
    background-position: 50%
    border: none
    margin-top: auto
    transition: background-color .3s ease-in-out
    @media (max-width: 960px)
      display: block

    &:active, &:focus
      outline: none
      background-color: rgba(0, 0, 0, .25)

  &__item
    text-decoration: none
    color: white
    padding: .5rem 1rem
    margin-bottom: .5rem
    position: relative
    cursor: pointer

    &:not(&_active)
      text-decoration: none

      &::after
        content: ''
        display: block
        position: absolute
        bottom: 0
        left: 0
        width: 100%
        height: 3px

      &:hover::after
        background-image: linear-gradient(to right, nth($gradient-colors, 2), transparent)

    &_active
      background-image: linear-gradient(to right, nth($gradient-colors, 2), transparent)


  @media (max-width: 960px)
    grid-area: initial
    max-width: 80%
    padding: 2rem 0 0 0
    box-shadow: 0 -2px 5px 0 rgba(0, 0, 0, .13)
    position: fixed
    width: 100%
    bottom: 0
    left: 0
    justify-content: center
    align-items: center
    transform: translateX(-105%)
    transition: transform .3s ease-in-out
    height: 100%
    z-index: 100
    &_open
      transform: translateX(0)
    &__item
      padding: 1rem
      font-size: 1.5rem
      text-align: center
      width: 90%
      text-transform: uppercase
      margin-bottom: 1rem

      &_active, &_active:hover, &_active:active
        background-image: linear-gradient(to right, transparent, nth($gradient-colors, 2), transparent)

      &:not(&_active)
        &:hover, &:active
          &:after
            background-image: linear-gradient(to right, transparent, nth($gradient-colors, 2), transparent)

      &:first-child
        margin-top: 50%
  .timetable-entity
    margin: 0 18px 12px
    color: white
</style>
