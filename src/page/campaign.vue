<template>
  <div>
    <current :current="'Campaign'"></current>
    <div class="ibox float-e-margins animated fadeInRight">
      <div class="ibox-title">
        <h5>{{$t("m.Campaign.Title")}}</h5>
        <div class="ibox-tools">
          <button class="btn btn-primary btn-sm" v-if="ifshow('campaign:add')" @click="toCreate()">{{$t("m.Campaign.Create")}}</button>
        </div>
      </div>
      <div class="ibox-content">
        <!-- search -->
        <form class="form-inline" style="margin-bottom:20px" @submit.prevent="search()">
          <div class="form-group m-mgright">
            <input type="text" class="form-control" placeholder="ID or Name" v-model="keyword" style="width:150px">
          </div>
          <div class="form-group m-mgright">
            <el-date-picker
              style="width:150px"
              v-model="select_date"
              type="date"
              format="yyyy-MM-dd"
              value-format="timestamp"
              :placeholder="$t('m.Filter.Date')">
            </el-date-picker>
          </div>
          <div class="form-group m-mgright" v-if="ifshow('campaign:mediabuy')" @change="loadAdvertiser()">
            <el-select v-model="mediabuyID" filterable placeholder="Mediabuyer" v-if="ifshow('campaign:mediabuy')" @change="loadAdvertiser()" style="width:150px">
              <el-option
                v-for="item in list_mediaBuy"
                :key="item.value"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="form-group m-mgright" v-if="ifshow('campaign:advertiser')">
            <el-select v-model="advertiserID" filterable :placeholder="$t('m.Filter.Advertiser')" v-if="ifshow('campaign:advertiser')"
                       style="width:150px">
              <el-option
                v-for="item in list_advertiser"
                :key="item.value"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="form-group m-mgright10">
            <el-select v-model="statusID" placeholder="Enabled" style="width:150px">
              <el-option value="">All</el-option>
              <el-option value="1" label="Enable"></el-option>
              <el-option value="0" label="Disable"></el-option>
            </el-select>
          </div>
          <div class="form-group">
            <button class="btn btn-primary" type="submit">{{$t("m.Btn.Search")}}</button>
          </div>
        </form>
        <el-checkbox v-model="ifshow_createTime" :label="$t('m.Form.CreateTime')"></el-checkbox>
        <el-checkbox v-model="ifshow_spend" :label="$t('m.Form.Spend')"></el-checkbox>
        <el-checkbox v-model="ifshow_revenue" :label="$t('m.Form.Revenue')"></el-checkbox>
        <el-checkbox v-model="ifshow_clickCount" :label="$t('m.Form.Clicks')"></el-checkbox>
        <el-checkbox v-model="ifshow_budgetDaily" :label="$t('m.Form.DailyBudget')"></el-checkbox>
        <el-checkbox v-model="ifshow_budgetOverall" :label="$t('m.Form.TotalBudget')"></el-checkbox>
        <el-checkbox v-model="ifshow_impressionCount" :label="$t('m.Form.Impressions')"></el-checkbox>
        <el-checkbox v-model="ifshow_roi" label="ROI"></el-checkbox>
        <el-checkbox v-model="ifshow_ecpm" label="eCPM"></el-checkbox>
        <!-- table -->
        <el-table
          class="table"
          :data="infoData"
          style="width: 100%"
          stripe=""
          sortable='custom'
          @sort-change="changeSort">
          <el-table-column prop="id" label="ID" sortable width="80"></el-table-column>
          <el-table-column prop="name" :label="$t('m.Form.Name')" sortable></el-table-column>
          <el-table-column prop="createdTime" :label="$t('m.Form.CreateTime')" sortable v-if="ifshow_createTime">
            <template slot-scope="scope">
               {{ scope.row.createdTime|formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="spend" :label="$t('m.Form.Spend')" sortable v-if="ifshow_spend"></el-table-column>
          <el-table-column prop="cost" :label="$t('m.Form.Cost')" sortable v-if="ifshow('campaign:cost')"></el-table-column>
          <el-table-column prop="revenue" :label="$t('m.Form.Revenue')" sortable v-if="ifshow_revenue"></el-table-column>
          <el-table-column prop="advertiserName" :label="$t('m.Form.Advertiser')" sortable
                           v-if="ifshow('campaign:advertiser')"></el-table-column>
          <el-table-column prop="mediaBuyName" label="Mediabuyer" sortable
                           v-if="ifshow('campaign:mediabuy')"></el-table-column>
          <el-table-column prop="clickCount" :label="$t('m.Form.Clicks')" sortable v-if="ifshow_clickCount"></el-table-column>
          <el-table-column prop="budgetDaily" :label="$t('m.Form.DailyBudget')" sortable v-if="ifshow_budgetDaily"></el-table-column>
          <el-table-column prop="budgetOverall" :label="$t('m.Form.TotalBudget')" sortable
                           v-if="ifshow_budgetOverall"></el-table-column>
          <el-table-column prop="impressionCount" :label="$t('m.Form.Impressions')" sortable
                           v-if="ifshow_impressionCount"></el-table-column>
          <el-table-column prop="roi" label="ROI" sortable v-if="ifshow_roi"></el-table-column>
          <el-table-column prop="ecpm" label="eCPM" sortable v-if="ifshow_ecpm"></el-table-column>
          <el-table-column label="Enabled" v-if="ifshow('campaign:status')" width="100">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                @change=change_switch(scope.row.id,scope.row.status)>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column :label="$t('m.Form.Action')" v-if="ifshow('campaign:edit')" width="80">
            <template slot-scope="scope">
              <!--                            <a href="#" @click="delete_id=scope.row.userId" data-toggle="modal" data-target="#myModal_delete"><i class="fa fa-trash"></i></a>-->
              <router-link :to="{path:'/editCampaign',query:{ id:scope.row.id }}"><i class="fa fa-edit"
                                                                                     style="margin-left:10px" title="Edit"></i>
              </router-link>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          layout="total,sizes,prev, pager, next, jumper"
          @current-change="changePage"
          @size-change="everyPage"
          :current-page="currentPage"
          :page-size="pageNumber"
          :page-sizes="pageNumbers"
          :total="dataTotal">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import current from '../common/current'
  import {formatDate} from '@/assets/js/date.js'
  import {delCookie, getCookie, setCookie} from '@/assets/js/cookie.js'
  import axios from 'axios'

  export default {
    components: {
      "current": current
    },
    data() {
      return {
        //复选框
        ifshow_createTime: false,
        ifshow_spend: true,
        ifshow_cost: true,
        ifshow_revenue: true,
        ifshow_advertiserName: true,
        ifshow_mediaBuyName: true,
        ifshow_clickCount: true,
        ifshow_budgetDaily: false,
        ifshow_budgetOverall: false,
        ifshow_impressionCount: false,
        ifshow_roi: false,
        ifshow_ecpm: false,
        ifshow_apps: false,
        infoData: [],

        //过滤条件
        select_date: "", //日期
        keyword: "", //关键字
        list_mediaBuy: [], //加载mediaBuy
        mediabuyID: "", //mediaBuy选中
        list_advertiser: [], //加载广告主
        advertiserID: "", //广告主选中
        statusID: "", //状态
        delete_id: 0, //点击删除，获取当前userID
        pageNumber: 25, //默认每页数量
        orderBy: 'id',
        orderType: 'desc',
        pageNumbers: [25, 50, 75, 100], //每页显示多少条
        currentPage: 1, //当前页
        dataTotal: 1, //数据总数
        permission: [], //权限
      }
    },
    mounted: function () {
      //列表
      this.search();

      //mediaBuy下拉列表
      axios.get('/mediaBuy/select2')
        .then(res => {
          if (res.data.status == 1) {
            this.list_mediaBuy = res.data.data;
          }
        })

      //当角色是midiaBuy时自动加载广告主下拉框
      if (!this.ifshow('campaign:mediabuy')) {
        this.loadAdvertiser();
      }

      //读取localStorage
      var storage = window.localStorage;
      this.permission = storage.getItem("ifshow");
    },
    methods: {
      //分页
      changePage: function (currentPage) {
        this.currentPage = currentPage;
        this.search()
      },

      //每页多少条
      everyPage: function (pageNumbers) {
        this.pageNumber = pageNumbers;
        this.search()
      },

      //排序
      changeSort: function (param) {
        //筛选排序类型
        if (param.order == "descending") {
          this.orderType = "desc";
        }
        else if (param.order == "ascending") {
          this.orderType = "asc";
        }
        this.orderBy = param.prop;
        this.search();
      },

      //加载广告主
      loadAdvertiser: function () {
        this.advertiserID = "";
        axios.get('/advertiser/select2', {
          headers: { //token
            Authorization: getCookie('token')
          },
          params: {
            tbMediaBuyId: this.mediabuyID
          }
        })
          .then(res => {
            if (res.data.status == 1) {
              this.list_advertiser = res.data.data;
            }
          })
      },

      //搜索
      search: function () {
        axios.get('/campaign/list', {
          headers: {
            Authorization: getCookie('token')
          },
          params: {
            keyword: this.keyword,
            tbMediaBuyId: this.mediabuyID,
            tbAdvertiserId: this.advertiserID,
            rows: this.pageNumber, //每页数量
            orderBy: this.orderBy,  //字段
            page: this.currentPage,  //页
            orderType: this.orderType, //排序类型
            createTime: this.select_date / 1000,
            status: this.statusID
          }
        })
          .then(res => {
            if (res.data.status == 1 && res.data.data != null) {
              this.infoData = res.data.data.list;
              this.dataTotal = res.data.data.total;
            } else {
              this.infoData = [];
              this.dataTotal = 0;
            }
            //reset
            this.orderBy = 'id';
            this.orderType = 'desc';
          })
      },

      //删除
      del: function () {
        axios.delete('/advertiser/delete', {
          headers: {
            Authorization: getCookie('token')
          },
          params: {
            id: this.delete_id
          }
        })
          .then(res => {
            console.log(res)
            if (res.data.status == 1) {
              this.$message({
                message: this.$t("m.Msg.Delete_success"),
                type: 'success',
                duration: 1800
              });
              //重新刷新列表
              axios.get('/agent/list', {
                headers: { //token
                  Authorization: getCookie('token')
                }
              })
                .then(res => {
                  if (res.data.status == 1) {
                    this.infoData = res.data.data.list;
                  }
                })
            }
            else {
              this.$message({
                message: this.$t("m.Msg.Failed"),
                type: 'error',
                duration: 1800
              });
            }
          })
      },

      //开关
      change_switch: function (id, status) {
        axios.get('/campaign/updateStatus', {
          headers: {
            Authorization: getCookie('token'),
          },
          params: {
            id: id,
            status: status
          }
        })
          .then(res => {
            if (res.data.status == 1) {
              this.$message({
                message: this.$t("m.Msg.Edit_success"),
                type: 'success',
                duration: 1800
              });
            }
            else {
              this.$message({
                message: this.$t("m.Msg.Failed"),
                type: 'error',
                duration: 1800
              });
            }
          })
      },

      //判断是否有权限
      ifshow: function (per) {
        if (this.permission.indexOf(per) > 0) {
          return true;
        } else {
          return false;
        }
      },

      //跳创建页
      toCreate: function () {
        this.$router.push({path: "/newCampaign"});
      }
    },
    filters: {
      //状态
      formatStatus: function (val) {
        if (val == 1) {
          return '正常';
        }
        else if (val == 0) {
          return '锁定';
        }
        else if (val == 2) {
          return '审核中';
        }
      },
      //时间戳
      formatDate(time) {
        var date = new Date(time * 1000);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .ibox-title h5 {
    line-height: 25px;
  }

  .float-e-margins .btn {
    margin-bottom: 0;
  }

  /* 弹出框按钮对齐 */
  .float-e-margins .btn {
    margin-bottom: 5px ;
  }

  .el-picker-panel {
    z-index: 3000 !important;
  }
</style>
