<template>
  <div class="first-visit">
    <h1 class="first-visit__welcome">
      Добро пожаловать в Расписание ГГТУ!
    </h1>
    <h2>Выберите, каким расписанием вы хотите пользоваться</h2>
    <div class="first-visit__choice">
      <Button @click.native="choose('group')">Для студентов</Button>
      <Button @click.native="choose('teacher')">Для преподавателей</Button>
    </div>
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

@Component({
  name: 'FirstVisit',
  components: { ListBox, Field, Form }
})
export default class FirstVisit extends Vue {
  options: SelectOption[] = [];
  type = '';
  isLoading = false;

  get listLabel() {
    return this.type === 'group' ? 'Выберите группу' : 'Выберите преподавателя';
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
    });
  }

  submitForm(data: { entityId: number }) {
    this.$store.commit(SET_USER_PREFERRED_ENTITY, data.entityId);
    this.$router.push('/');
  }
}
</script>

<style scoped></style>
