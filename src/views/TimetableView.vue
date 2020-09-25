<template>
  <Page>
    some content here
  </Page>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import Page from '@/components/Page';

@Component({
  name: 'TimetableView',
  components: { Page }
})
export default class TimetableView extends Vue {}
</script>

<style scoped></style>
