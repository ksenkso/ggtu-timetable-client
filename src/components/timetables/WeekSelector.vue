<template>
  <div class="week-selector">
    <Button @click.native="$emit('change', -1)">&lt;</Button>
    <h3>Неделя {{ weekNumber }}</h3>
    <Button @click.native="$emit('change', 1)">&gt;</Button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'WeekSelector'
})
export default class WeekSelector extends Vue {
  @Prop({ required: true }) startWeek!: number;
  weekNumber = 0;

  moveWeek(move: number) {
    this.weekNumber += move;
    this.$emit('change', move);
  }

  mounted() {
    this.weekNumber = this.startWeek;
  }
}
</script>

<style scoped lang="sass">
.week-selector
  display: flex
  justify-content: space-around
  align-items: center
  h3
    text-align: center
  @media (max-width: 960px)
    position: fixed
    bottom: 51px
    left: 0
    width: 100%
    background-color: #fff
</style>
