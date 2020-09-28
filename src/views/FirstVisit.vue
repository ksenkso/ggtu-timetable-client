<template>
  <div class="first-visit">
    <Slider ref="slider">
      <Screen>
        <div class="first-visit__container">
          <div class="first-visit__hero">
            <h1>
              Добро пожаловать в Расписание ГГТУ!
            </h1>
            <h2>Выберите, каким расписанием вы хотите пользоваться</h2>
          </div>
          <div class="first-visit__choice">
            <Button size="big" theme="primary" @click.native="choose('group')"
              >Для студентов
            </Button>
            <Button size="big" theme="primary" @click.native="choose('teacher')"
              >Для преподавателей
            </Button>
          </div>
        </div>
      </Screen>
      <Screen>
        <Button
          theme="light"
          round
          @click.native="slider.prev()"
          class="button_back"
        >
          Назад
        </Button>
        <div class="first-visit__container">
          <div class="first-visit__selector" v-if="type && !isLoading">
            <Form @submit="submitForm">
              <Field name="entityId" :label="listLabel">
                <template v-slot:input="{ updateValue }">
                  <ListBox @select="updateValue" :options="options"></ListBox>
                </template>
              </Field>
            </Form>
          </div>
        </div>
      </Screen>
      <Screen>
        <div class="first-visit__container">
          <h1>Загрузка...</h1>
        </div>
      </Screen>
    </Slider>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { SET_USER_TYPE } from '@/store/mutation-types';
import api from '@/api';
import ListBox from '@/components/ListBox.vue';
import Field from '@/components/Field.vue';
import { defaultEntityAdapter } from '@/utils/lists';
import { SelectOption } from '@/utils/lists';
import { NamedEntity } from '@/store/types';
import Form from '@/components/Form.vue';
import { SET_USER_PREFERRED_ENTITY } from '@/store/mutation-types';
import Slider from '@/components/Slider.vue';
import Screen from '@/components/Screen.vue';
import { Ref } from 'vue-property-decorator';
import { LOAD_DEFAULT_TIMETABLE } from '@/store/action-types';

@Component({
  name: 'FirstVisit',
  components: { ListBox, Field, Form, Slider, Screen }
})
export default class FirstVisit extends Vue {
  options: SelectOption[] = [];
  type = '';
  isLoading = false;
  @Ref('slider') slider!: Slider;

  get listLabel() {
    return this.type === 'group'
      ? 'Начните вводить название группы'
      : 'Начните вводить ФИО преподавателя';
  }

  choose(type: 'group' | 'teacher') {
    this.$store.commit(SET_USER_TYPE, type);
    this.type = type;
    let request: Promise<NamedEntity[]>;
    if (type === 'group') {
      request = api.groups.getAll();
    } else {
      request = api.teachers.getAll();
    }
    this.isLoading = true;
    request.then(defaultEntityAdapter).then(options => {
      this.options = options;
      this.isLoading = false;
      this.slider.next();
    });
  }

  submitForm(data: { entityId: number }) {
    this.$store.commit(SET_USER_PREFERRED_ENTITY, data.entityId);
    this.slider.next();
    this.$store
      .dispatch(LOAD_DEFAULT_TIMETABLE)
      .then(() => this.$router.push('/'));
  }
}
</script>

<style lang="sass">
@import "../assets/functions"
.first-visit
  margin: 0 auto
  width: 100%
  height: 100%

  h1, h2, label
    color: #ffffff
    text-align: center

  &__selector
    label
      font-size: 2rem
      margin-bottom: 1rem !important
    height: 50%
    margin-top: auto

  &__container
    width: 100%
    max-width: 800px
    margin: 0 auto
    display: flex
    flex-direction: column
    justify-content: center
    height: 100%


  &__hero
    margin-top: auto

  &__choice
    margin-top: auto
    margin-bottom: 2rem
    width: 100%
    display: flex
    flex-direction: column

    .button + .button
      margin-top: 1rem

  .form
    height: 100%
    display: flex
    flex-direction: column
    justify-content: space-between

  .form__buttons
    text-align: center

  .button_look-round
    width: 2.5rem
    height: 2.5rem

    svg
      fill: theme-color("primary")

  .screen
    background: radial-gradient(circle at bottom, #{lighten(theme-color("primary"), 30%)}, theme-color("primary"))

.button_back
  background-image: url("../assets/arrow_left.svg")
  background-repeat: no-repeat
  background-position: 50% 50%
  background-size: cover
  border: none
  font-size: 0
</style>
