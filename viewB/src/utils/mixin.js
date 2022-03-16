import Mock from 'Mock';

const topOrgin = ['http://192.168.1.104:8127', 'http://192.168.1.104:8128'];

export default {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          Mock,
          topOrgin,
        };
      },
    });
  },
};

export const sendSuccessTip = {
  methods: {
    sendSuccessTip() {
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
