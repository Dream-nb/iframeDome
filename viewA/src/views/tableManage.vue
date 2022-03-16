<template>
  <div class="page">
    <searchRow :create="openDialog" />
    <div class="table-manage" ref="tableManage">
      <el-table
        :data="tableData"
        size="mini"
        :row-class-name="tableRowClassName"
        :height="height"
      >
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column
          label="订单编号"
          prop="orderNo"
          width="180"
        ></el-table-column>
        <el-table-column label="收货人" prop="name"></el-table-column>
        <el-table-column label="总金额" prop="total"></el-table-column>
        <el-table-column
          label="应付金额"
          prop="amounts_payable"
        ></el-table-column>
        <el-table-column label="订单状态" prop="orderStatus"></el-table-column>
        <el-table-column label="支付状态" prop="payStatus"></el-table-column>
        <el-table-column label="发货状态" prop="shipStatus"></el-table-column>
        <el-table-column label="支付方式" prop="payMethod"></el-table-column>
        <el-table-column
          label="配送方式"
          prop="deliveryMethod"
        ></el-table-column>
        <el-table-column
          label="下单时间"
          prop="createTime"
          width="150"
        ></el-table-column>
      </el-table>
    </div>
    <pagination :getTableData="getTableData"></pagination>
    <el-dialog
      title="数据录入"
      :visible.sync="dialogVisible"
      :center="true"
      :destroy-on-close="true"
      @close="handleClose"
    >
      <!-- <createForm :pushFormData="pushFormData" /> -->
      <iframe
        :src="src"
        frameborder="0"
        name="modul"
        id="modul"
        ref="modul"
        seamless
        style="width: 100%; height: 100%"
      ></iframe>
    </el-dialog>
  </div>
</template>

<script>
import searchRow from '@/components/searchRow';
import pagination from '@/components/pagination';
import { sendSuccessTip } from '@/utils/mixin';
export default {
  name: 'Table',
  mixins: [sendSuccessTip],
  components: {
    searchRow,
    pagination,
  },
  data() {
    return {
      tableData: [],
      height: undefined,
      dialogVisible: false,
      src: 'http://192.168.1.104:8129/itemB/createForm',
    };
  },
  created() {
    console.log(this.Cookies.get('auth'), '子组件');
    this.getTableData();
    console.log('子应用', this);
  },
  mounted() {
    window.addEventListener('message', this.receiveMsg);
    this.height = this.$refs.tableManage.clientHeight;
  },
  methods: {
    tableRowClassName({ row }) {
      if (row.orderStatus === '已完成') {
        return 'finish-row';
      }
      if (row.orderStatus === '未付款') {
        return 'pending-row';
      }
      return 'doing-row';
    },
    getTableData() {
      const { tableData } = this.Mock.mock({
        'tableData|20': [
          {
            orderNo: '@id',
            name: '@cname',
            total: '￥ @float(3, 8000, 2, 2)',
            amounts_payable: '￥ @float(3, 8000, 2, 2)',
            'orderStatus|1': ['未付款', '待发货', '待收货', '待评价', '已完成'],
            'payStatus|1': ['未支付', '已支付'],
            'shipStatus|1': ['已发货', '未发货'],
            'payMethod|1': [
              '微信',
              '支付宝',
              '货到付款',
              '银行卡',
              '蚂蚁花呗',
              '京东白条',
            ],
            'deliveryMethod|1': [
              '圆通',
              '中通',
              '申通',
              '百世快递',
              '韵达',
              '顺丰',
              '邮政',
              'EMS',
              '天天快递',
            ],
            createTime: '@datetime("yyyy-MM-dd HH:mm")',
          },
        ],
      });
      this.tableData = tableData;
    },
    handleClose() {
      console.log('弹窗出');
      top.postMessage(
        {
          source: 'content',
          action: 'methodRun',
          funName: 'cancelIframeCover',
        },
        this.topOrgin,
      );
      this.dialogVisible = false;
    },
    openDialog() {
      console.log('弹窗进');
      this.dialogVisible = true;
      top.postMessage(
        {
          source: 'content',         //对应iframe的Id
          action: 'methodRun',       //对应要做的逻辑
          funName: 'setIframeCover', //对应父应用函数
        },
        this.topOrgin,  //需要接受消息的window域名
      );
    },
    pushFormData(data) {
      this.handleClose();
      this.tableData.unshift(data);
      this.sendSuccessTip();
    },
    receiveMsg({ data = {} }) {
      console.log('弹窗', data);
      const { source, funName, action } = data;
      if (source === 'modul') {
        switch (action) {
          case 'createForm':
            if (data.data) this[funName](data.data);
            break;
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.table-manage {
  margin-top: 3px;
  margin-bottom: 3px;
  flex: 1;
  overflow-y: hidden;
}
/deep/.el-dialog {
  height: 550px;
}
/deep/.el-dialog__body {
  height: 450px;
}
/deep/.el-table__body-wrapper {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
/deep/.el-table__body-wrapper::-webkit-scrollbar {
  display: none;
}
</style>
