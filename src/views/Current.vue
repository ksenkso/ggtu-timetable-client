<template>
  <Page>
    <div class="container">
      <CurrentTimetable></CurrentTimetable>
    </div>
  </Page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Page from '@/components/common/Page.vue';
import CurrentTimetable from './CurrentTimetable.vue';

@Component({
  name: 'Home',
  components: { Page, CurrentTimetable }
})
export default class Home extends Vue {}
</script>
<style lang="sass">
.container
  padding: 1rem
  @media (max-width: 960px)
    padding: 1rem .5rem
</style>
