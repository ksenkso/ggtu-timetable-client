<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="sass">
#app
  height: 100%

html, body
  margin: 0
  padding: 0
  height: 100%
  font-family: Tahoma, Arial, sans-serif
  color: #222222

body.menu-open
  overflow: hidden

*
  box-sizing: border-box
</style>
