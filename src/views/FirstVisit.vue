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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { SET_USER_TYPE } from '@/store/action-types';

@Component({
  name: 'FirstVisit'
})
export default class FirstVisit extends Vue {
  choose(type: 'group' | 'teacher') {
    this.$store.commit(SET_USER_TYPE, type);
    this.$router.push('/');
  }
}
</script>

<style scoped></style>
