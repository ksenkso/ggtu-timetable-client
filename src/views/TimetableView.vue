<template>
  <Page>
    {{ JSON.stringify(timetable) }}
  </Page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Page from '@/components/Page';
import { TimetableEntry } from 'ggtu-timetable-api-client';
import { State } from 'vuex-class';

@Component({
  name: 'TimetableView',
  components: { Page }
})
export default class TimetableView extends Vue {
  @State(state => state.timetable.default) timetable: TimetableEntry[][][];
}
</script>

<style scoped></style>
