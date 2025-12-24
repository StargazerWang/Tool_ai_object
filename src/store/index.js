import { reactive } from 'vue';
import blocklyStore from './bockly.js';

export default reactive({
  count: 0,
  modal: '',
  header: null,
  setHeader(dom) {
    this.header = dom;
  },
  setModal(modalName) {
    this.modal = modalName;
  },
  ...blocklyStore
})