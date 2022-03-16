import Mock from 'Mock';
import Cookies from 'Cookies';

const topOrgin = 'http://192.168.1.104:8127';

export default {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          Mock,
          Cookies,
          topOrgin,
        };
      },
    });
  },
};

export const sendSuccessTip = {
  methods: {
    sendSuccessTip() {
      console.log(this);
      top.postMessage(
        {
          source: 'content',
          action: 'methodRun',
          funName: 'showMessage',
          params: {
            message: '信息录入成功',
            type: 'success',
          },
        },
        topOrgin,
      );
    },
  },
};
