<template>
  <ButtonGroup
    @change="$emit('change', $event)"
    :default-index="0"
    :values="['Верхняя', 'Нижняя']"
  ></ButtonGroup>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ButtonGroup from '@/components/common/ButtonGroup.vue';

@Component({
  name: 'TimetableWeek',
  components: { ButtonGroup }
})
export default class TimetableWeek extends Vue {}
</script>

<style scoped lang="sass">
@import "../../assets/variables"

.button-group
  margin-left: auto
  max-width: 180px
  margin-bottom: 1rem
  position: fixed
  right: 2rem
  top: calc(#{$header-height} + 8px)
  z-index: 1
  @media (max-width: 799px)
    height: 60px
    position: fixed
    bottom: 0
    left: 0
    right: auto
    top: auto
    margin-left: 0
    max-width: 100%
    order: 1
    margin-bottom: 0
    width: 100%
    border-radius: 0
    border: none
    border-top: 1px solid #ddd
</style>
