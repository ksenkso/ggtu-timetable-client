<template>
  <div :class="className">
    <slot name="label">
      <label :for="id" class="form__label">{{ label }}</label>
    </slot>
    <slot
      name="input"
      :updateValue="updateValue"
      :disabled="disabled"
      :readonly="readonly"
    >
      <input
        class="form__control"
        @input="$emit('input', $event)"
        :type="type"
        :name="name"
        :id="id"
        v-model="value"
        :disabled="disabled"
        :readonly="readonly"
      />
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Prop } from 'vue-property-decorator';

@Component({
  name: 'Field'
})
export default class Field extends Vue {
  @Prop({ required: true }) name!: string;
  @Prop({ required: true }) label!: string;
  @Prop({ default: 'text' }) type!: string;
  @Prop({ type: Boolean }) disabled!: boolean;
  @Prop({ type: Boolean }) readonly!: boolean;
  @Prop({ type: Boolean }) inline!: boolean;
  @Prop({ default: '' }) initialValue!: string;
  value = this.initialValue;

  get id() {
    return `${this.name}_${this.$vnode.tag}`;
  }

  get className() {
    return `form__field${this.inline ? ' form__field_inline' : ''}`;
  }

  updateValue(newValue: never) {
    this.value = newValue;
  }
}
</script>

<style scoped lang="sass">
@import "../../assets/functions"
.form
  &__field
    margin-bottom: .5em
    width: 100%

    &_inline
      display: flex

      .form__label
        margin-left: 0
        margin-right: 8px

  &__label
    display: block
    margin-bottom: .1em
    margin-left: 8px

  &__control
    width: 100%
    padding: 6px 8px 2px 8px
    box-sizing: border-box
    border: 1px solid #aaa
    border-radius: 3px
    vertical-align: baseline
    outline-color: scale-color(theme-color("primary"), $lightness: 30%)
</style>
