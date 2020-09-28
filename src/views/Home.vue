<template>
  <Page>
    <div class="container">
      <TimetableView></TimetableView>
    </div>
  </Page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Page from '@/components/common/Page.vue';
import TimetableView from '@/views/TimetableView.vue';

@Component({
  name: 'Home',
  components: { Page, TimetableView }
})
export default class Home extends Vue {}
</script>
<style lang="sass">
.container
  padding: 1rem
  height: 100%
  @media (max-width: 960px)
    padding: 1rem .5rem
.timetable
  height: 100%
</style>
