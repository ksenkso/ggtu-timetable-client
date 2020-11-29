<template>
  <div class="button-group">
    <Button
      v-for="(value, index) in values"
      :theme="selectedIndex === index ? 'primary' : 'default'"
      class="button-group__button button_block"
      :key="index"
      @click.native="select(index)"
      >{{ value }}
    </Button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Button from '@/components/common/Button.vue';
import { ButtonGroupValue } from '@/types/common';

@Component({
  name: 'ButtonGroup',
  components: { Button }
})
export default class ButtonGroup extends Vue {
  @Prop({ required: false }) defaultIndex?: number;
  @Prop({ required: true }) values!: string[];
  selectedIndex: number | null = null;

  mounted() {
    this.selectedIndex = this.defaultIndex ?? 0;
  }

  select(index: number) {
    this.selectedIndex = index;
    this.$emit('change', {
      index,
      value: this.values[index]
    } as ButtonGroupValue);
  }
}
</script>

<style scoped lang="sass">
@import "../../assets/functions"
.button-group
  border-radius: 3px
  overflow: hidden
  display: flex
  border: 1px solid #aaa
  margin-top: .5rem
  margin-bottom: .5rem
  z-index: 10

  &__button
    display: inline-block
    border: none
    border-left: 1px solid #aaa
    border-radius: 0

    &_selected
      background-color: theme-color("primary")
</style>
