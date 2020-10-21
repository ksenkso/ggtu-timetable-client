<template>
  <header class="header">
    <button class="menu-toggle" @click="toggle">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 0 24 24"
        width="24"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="#fff" />
      </svg>
    </button>
    <h1 v-if="title">{{ title }}</h1>
  </header>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const menu = namespace('menu');
@Component({
  name: 'Header'
})
export default class Header extends Vue {
  @Prop() title?: string;
  @menu.Action('TOGGLE') toggle!: () => void;
}
</script>

<style scoped lang="sass">
@import "../../assets/functions"
.header
  color: #ffffff
  background-color: theme-color("primary")
  padding: 0 1rem
  display: flex
  align-items: center

  h1
    margin: 0
    font-size: 1.4rem

  .menu-toggle
    display: none
    background: transparent
    border: none
    cursor: pointer
    height: 2rem
    width: 2rem
    text-align: center
    padding: 0
    margin-right: 1rem
    border-radius: 50%
    align-items: center
    justify-content: center
    transition: background-color .3s ease-in-out
    clip-path: circle(1rem)
    @media (max-width: 960px)
      display: flex

    &:active, &:focus
      outline: none
</style>
