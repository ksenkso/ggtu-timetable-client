<template>
  <Page>
    <div class="timetable" v-if="hasLoaded">
      <div
        class="timetable__lesson"
        v-for="lesson in currentDay"
        :key="lesson.id"
      >
        <TimetableCard :entry="lesson"></TimetableCard>
      </div>
    </div>
  </Page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { TimetableEntry } from 'ggtu-timetable-api-client';
import { State } from 'vuex-class';
import Page from '@/components/Page.vue';
import { LOAD_DEFAULT_TIMETABLE } from '@/store/action-types';
import { EmptyTimetableEntry } from '@/utils/timetable';
import TimetableCard from '@/components/TimetableCard.vue';

@Component({
  name: 'TimetableView',
  components: { Page, TimetableCard }
})
export default class TimetableView extends Vue {
  @State(state => state.timetable.default) timetable!: (
    | TimetableEntry
    | EmptyTimetableEntry
  )[][][];
  @State(state => state.timetable.hasLoaded) hasLoaded!: boolean;

  get currentDay() {
    return this.timetable[0][0];
  }

  mounted() {
    if (!this.hasLoaded) {
      this.$store.dispatch(LOAD_DEFAULT_TIMETABLE);
    }
  }
}
</script>

<style scoped lang="sass">
.timetable
  padding: 1rem
  display: grid
  grid-template-rows: repeat(auto-fit, 1fr)
  grid-row-gap: 1rem
</style>
