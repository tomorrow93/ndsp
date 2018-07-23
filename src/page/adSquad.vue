<template>
  <div>
    <current :current="'Ad Squad'"></current>
    <div class="ibox float-e-margins animated fadeInRight">
      <div class="ibox-title">
        <h5>{{$t("m.AdSquad.Title")}}</h5>
        <div class="ibox-tools">
          <button class="btn btn-primary btn-sm" v-if="ifshow('adSquad:add')" @click="toCreate()">{{$t("m.AdSquad.Create")}}</button>
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
          <div class="form-group m-mgright" v-if="ifshow('adSquad:campaign')">
            <el-select v-model="campaignID" filterable placeholder="Campaign" style="width:150px">
              <el-option
                v-for="item in list_campaign"
                :key="item.value"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="form-group m-mgright" v-if="ifshow('adSquad:mediabuy')">
            <el-select
              v-model="mediabuyID"
              filterable
              placeholder="Mediabuyer"
              style="width:150px"
              @change="change_mediabuyer()">
              <el-option
                v-for="item in list_mediaBuy"
                :key="item.value"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="form-group m-mgright" v-if="ifshow('adSquad:advertiser')">
            <el-select
              v-model="advertiserID"
              filterable
              :placeholder="$t('m.Filter.Advertiser')"
              style="width:150px"
              @focus.once="load_advertiser()">
              <el-option
                v-for="item in list_advertiser"
                :key="item.value"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="form-group m-mgright10" v-if="ifshow('adSquad:country')">
            <el-select v-model="countryID" filterable :placeholder="$t('m.Filter.Location')" style="width:150px">
              <el-option
                v-for="item in list_country"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <!--/option/select2Platform-->
          <div class="form-group m-mgright10">
            <el-select v-model="target" filterable :placeholder="$t('m.Filter.Target')" style="width:150px">
              <el-option value="">All</el-option>
              <el-option
                v-for="item in list_platform"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
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
        <el-checkbox v-model="ifshow_countryAlpha3Codes" :label="$t('m.Form.Country')"></el-checkbox>
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
          <el-table-column prop="id" label="ID" sortable width="60"></el-table-column>
          <el-table-column prop="name" :label="$t('m.Form.Name')" sortable></el-table-column>
          <el-table-column prop="createdTime" :label="$t('m.Form.CreateTime')" sortable v-if="ifshow_createTime">
            <template slot-scope="scope">
              {{ scope.row.createdTime|formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="bidPrice" label="Bid Price" sortable v-if="ifshow('adSquad:bid')" width="120">
            <template slot-scope="scope">
                <div class="modif" @mouseover="showIcon(scope.row.id)" @mouseout="showUpdate = -1">
                    <i class="el-icon-edit icon_edit" v-if="showUpdate == scope.row.id" @click="showDialog(scope.row.id,scope.row.bidPrice)"></i>
                    <span>$</span>
                    {{ scope.row.bidPrice }}
                </div>
<!--
              <span>$</span>
              <input
                    type="number"
                    v-model="scope.row.bidPrice"
                    class="bidPrice"
                    @change="changeBidPrice(scope.row.id,scope.row.bidPrice)">
-->
            </template>
          </el-table-column>
          <el-table-column prop="spend" :label="$t('m.Form.Spend')" sortable v-if="ifshow_spend"></el-table-column>
          <el-table-column prop="bidPercent" label="Bid Percent" sortable
                           v-if="ifshow('adSquad:BidPercent')"></el-table-column>
          <el-table-column prop="cost" :label="$t('m.Form.Cost')" sortable v-if="ifshow('adSquad:cost')" width="80"></el-table-column>
          <el-table-column prop="revenue" :label="$t('m.Form.Revenue')" sortable v-if="ifshow_revenue"></el-table-column>
          <el-table-column prop="mediaBuyName" label="Mediabuyer" sortable
                           v-if="ifshow('adSquad:mediabuy')"></el-table-column>
          <el-table-column prop="campaignName" label="Campaign" sortable
                           v-if="ifshow('adSquad:campaign')"></el-table-column>
          <el-table-column prop="clickCount" :label="$t('m.Form.Clicks')" sortable v-if="ifshow_clickCount"></el-table-column>
          <el-table-column prop="budgetDaily" :label="$t('m.Form.DailyBudget')" sortable v-if="ifshow_budgetDaily"></el-table-column>
          <el-table-column prop="budgetOverall" :label="$t('m.Form.TotalBudget')" sortable
                           v-if="ifshow_budgetOverall"></el-table-column>
          <el-table-column prop="impressionCount" :label="$t('m.Form.Impressions')" sortable
                           v-if="ifshow_impressionCount"></el-table-column>
          <el-table-column prop="countryAlpha2Codes" :label="$t('m.Form.Country')" sortable
                           v-if="ifshow_countryAlpha3Codes"></el-table-column>
          <el-table-column prop="roi" label="ROI" sortable v-if="ifshow_roi"></el-table-column>
          <el-table-column prop="ecpm" label="eCPM" sortable v-if="ifshow_ecpm"></el-table-column>
          <el-table-column label="Enabled" v-if="ifshow('adSquad:status')" width="100">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                @change=change_switch(scope.row.id,scope.row.status)>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="Action" v-if="ifshow('adSquad:edit')" width="70">
            <template slot-scope="scope">
              <!--                            <a href="#" @click="delete_id=scope.row.userId" data-toggle="modal" data-target="#myModal_delete"><i class="fa fa-trash"></i></a>-->
              <router-link :to="{path:'/editSquad',query:{ id:scope.row.id }}"><i class="fa fa-edit"
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
    <!-- 修改价格弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="300px"
      center
      top="350px"
      :modal="false">
      <div class="modif">
        <input 
            type="text"
            v-model="modif_bid" 
            class="form-control">
        <button class="btn" @click="changeBidPrice()">Save</button>
        <div class="clearfix"></div>
      </div>
    </el-dialog>
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
        showUpdate:-1,
        //复选框
        ifshow_createTime: false,
        ifshow_BidPrice: true,
        ifshow_spend: false,
        ifshow_cost: true,
        ifshow_revenue: true,
        ifshow_advertiserName: true,
        ifshow_mediaBuyName: true,
        ifshow_clickCount: true,
        ifshow_budgetDaily: false,
        ifshow_budgetOverall: false,
        ifshow_impressionCount: false,
        ifshow_countryAlpha3Codes:false,
        ifshow_roi: false,
        ifshow_ecpm: false,
        ifshow_apps: false,
        infoData: [],
        sjc: 1527229575,

        //过滤条件
        select_date: "", //日期
        keyword: "", //关键字
        list_mediaBuy: [], //加载mediaBuy
        mediabuyID: "", //mediaBuy选中
        list_advertiser: [], //加载广告主
        advertiserID: "", //广告主选中
        list_campaign: [], //加载campaign
        campaignID: "", //campaign选中
        list_country: [], //加载国家
        list_platform: [], //平台列表
        target: "", //平台
        countryID: "", //国家选中
        delete_id: 0, //点击删除，获取当前userID
        orderBy: 'id',
        orderType: 'desc',
        pageNumber: 25, //默认每页数量
        pageNumbers: [25, 50, 75, 100], //每页显示多少条
        currentPage: 1, //当前页
        dataTotal: 1, //数据总数
        permission: [], //权限
        statusID: 1, //状态id
          
          //其他
          centerDialogVisible:false,  //修改价格的弹窗
          modif_id:"",
          modif_bid:"",
      }
    },
    mounted: function () {
      //列表
      this.search();

      //campaign下拉列表
      axios.get('/campaign/select2')
        .then(res => {
          if (res.data.status == 1) {
            this.list_campaign = res.data.data;
          }
        })

      //国家下拉列表
      axios.get('/option/select2Country')
        .then(res => {
          if (res.data.status == 1) {
            this.list_country = res.data.data;
          }
        })
      //国家下拉列表
      axios.get('/option/select2Platform')
        .then(res => {
          if (res.data.status == 1) {
            this.list_platform = res.data.data;
          }
        })

      //读取localStorage
      var storage = window.localStorage;
      this.permission = storage.getItem("ifshow");

      //mediabuyer角色就加载mediabuyer
      if(this.ifshow('adSquad:mediabuy')){
          this.load_mediabuyer();
      }
    },
    methods: {
      //鼠标经过显示图标
        showIcon:function(id){
            this.showUpdate = id;
        },
        //点击bidprice显示对话框
        showDialog:function(id,bid){
            this.centerDialogVisible = true;
            this.modif_id = id;
            this.modif_bid = bid;
        },
      //改变BidPrice
      changeBidPrice: function () {
        if(this.modif_bid>0.0001){
            axios.get('/adSquad/updatePrice', {
              params: {
                id: this.modif_id,
                bidPrice: this.modif_bid
              }
            })
              .then(res => {
                if (res.data.status == 1) {
                  this.centerDialogVisible = false;
                  this.search(); //加载列表
                  this.$message({
                    message: 'success',
                    type: 'success',
                    duration: 1800
                  });
                }
                else {
                  this.$message({
                    message: 'failed',
                    type: 'error',
                    duration: 1800
                  });
                }
              })
        }
        else{
          this.$message({
            message: 'Must be more than 0.0001',
            type: 'error',
            duration: 1800
          });
        }
      },

    //mediabuyer
    change_mediabuyer:function(){
        this.load_advertiser();
    },

    //加载mediabuyer
    load_mediabuyer:function(){
      axios.get('/mediaBuy/select2')
        .then(res => {
          if (res.data.status == 1) {
            this.list_mediaBuy = res.data.data;
          }
      })
    },

    //加载广告主
    load_advertiser: function () {
        this.advertiserID = "";
        axios.get('/advertiser/select2', {
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

      //分页
      changePage: function (currentPage) {
        this.currentPage = currentPage;
        this.search();
      },

      //每页多少条
      everyPage: function (pageNumbers) {
        this.pageNumber = pageNumbers;
        this.search();
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

      //搜索
      search: function () {
        axios.get('/adSquad/list', {
          params: {
            rows: this.pageNumber, //每页数量
            orderBy: this.orderBy,  //字段
            page: this.currentPage,  //页
            orderType: this.orderType, //排序类型
            keyword: this.keyword,
            targetPlatform: this.target,
            createdTime: this.select_date / 1000,
            tbMediaBuyId: this.mediabuyID,
            tbAdvertiserId: this.advertiserID,
            tbCampaignId: this.campaignID,
            countryAlpha2Code: this.countryID
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

      //开关
      change_switch: function (id, status) {
        axios.get('/adSquad/updateStatus', {
          params: {
            id: id,
            status: status
          }
        })
          .then(res => {
            if (res.data.status == 1) {
              this.$message({
                message: 'success',
                type: 'success',
                duration: 1800
              });
            }
            else {
              this.$message({
                message: 'failed',
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
        this.$router.push({path: "/newSquad"});
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
    margin-bottom: 5px;
  }

  /* bidPrice */
  .bidPrice {
    width: 40px;
    padding-left: 5px;
    border: 1px solid #ccc;
    font-size: 13px;
    color: #666;
  }
    
    /* 修改价格 */
    .modif input{
        float: left;
        width: 174px;
    }
    .modif button{
        float: right;
        border-radius: 30px;
        border: 1px dashed #888;
        width: 80px;
        margin-top: 2px;
    }
</style>
