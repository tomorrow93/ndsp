<template>
  <div>
    <current :current="'Ad'"></current>
    <div class="ibox float-e-margins animated fadeInRight">
      <div class="ibox-title">
        <h5>{{$t("m.Ad.Title")}}</h5>
        <div class="ibox-tools">
          <button class="btn btn-primary btn-sm" v-if="ifshow('ad:add')" @click="toCreate()">{{$t("m.Ad.Create")}}</button>
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
          <div class="form-group m-mgright">
            <el-select v-model="campaignID" filterable placeholder="Campaign" style="width:150px">
              <el-option
                v-for="item in list_campaign"
                :key="item.value"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="form-group m-mgright" v-if="ifshow('ad:mediabuy')">
            <el-select v-model="mediabuyID" filterable placeholder="Mediabuyer" @change="loadAdvertiser()" style="width:150px">
              <el-option
                v-for="item in list_mediaBuy"
                :key="item.value"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="form-group m-mgright">
            <el-select v-model="advertiserID" filterable :placeholder="$t('m.Form.Advertiser')" style="width:150px">
              <el-option
                v-for="item in list_advertiser"
                :key="item.value"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="form-group m-mgright">
            <el-select v-model="adSquadID" filterable remote :remote-method="loadAdSquad" :placeholder="$t('m.Form.AdSquad')"
                       style="width: 150px">
              <el-option
                width="100%"
                v-for="item in list_adSquad"
                :key="item.value"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="form-group m-mgright10" v-if="ifshow('ad:approval')">
            <el-select v-model="verificationID" filterable :placeholder="$t('m.Form.Status')" style="width:150px">
              <el-option value="">All</el-option>
              <el-option value="0" label="Pending"></el-option>
              <el-option value="1" label="Approved"></el-option>
              <el-option value="2" label="Rejected"></el-option>
            </el-select>
          </div>          
          <div class="form-group m-mgright10">
            <el-select v-model="targetID" placeholder="Target" style="width:150px">
              <el-option value="">All</el-option>
              <el-option
                width="100%"
                v-for="item in list_target"
                :key="item.value"
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
        <el-checkbox v-model="ifshow_adType" :label="$t('m.Form.Type')"></el-checkbox>
        <el-checkbox v-model="ifshow_spend" :label="$t('m.Form.Spend')"></el-checkbox>
        <el-checkbox v-model="ifshow_adSquad" :label="$t('m.Form.AdSquad')"></el-checkbox>
        <el-checkbox v-model="ifshow_revenue" :label="$t('m.Form.Revenue')"></el-checkbox>
        <el-checkbox v-model="ifshow_clickCount" :label="$t('m.Form.Clicks')"></el-checkbox>
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
          <el-table-column prop="createdTime" :label="$t('m.Form.CreateTime')" sortable v-if="ifshow_createTime" width="150">
            <template slot-scope="scope">
              {{ scope.row.createdTime|formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="adType" :label="$t('m.Form.Type')" sortable v-if="ifshow_adType">></el-table-column>
          <el-table-column prop="spend" :label="$t('m.Form.Spend')" sortable v-if="ifshow_spend"></el-table-column>
          <el-table-column prop="campaignName" label="Campaign" sortable></el-table-column>
          <el-table-column prop="mediaBuyName" label="Mediabuyer" sortable v-if="ifshow('ad:mediabuy')"></el-table-column>
          <el-table-column prop="adSquadName" :label="$t('m.Form.AdSquad')" sortable v-if="ifshow_adSquad"></el-table-column>
          <el-table-column prop="cost" :label="$t('m.Form.Cost')" sortable v-if="ifshow('ad:cost')" width="80"></el-table-column>
          <el-table-column prop="revenue" :label="$t('m.Form.Revenue')" sortable v-if="ifshow_revenue" width="110"></el-table-column>
          <el-table-column prop="clickCount" :label="$t('m.Form.Clicks')" sortable v-if="ifshow_clickCount" width="90"></el-table-column>
          <el-table-column prop="impressionCount" :label="$t('m.Form.Impressions')" sortable
                           v-if="ifshow_impressionCount"></el-table-column>
          <el-table-column prop="roi" label="ROI" sortable v-if="ifshow_roi"></el-table-column>
          <el-table-column prop="ecpm" label="eCPM" sortable v-if="ifshow_ecpm"></el-table-column>
          <el-table-column prop="verification" :label="$t('m.Form.Status')" sortable v-if="ifshow('ad:approval')">
            <template slot-scope="scope">
              <a href="#" data-toggle="modal" data-target="#myModal"
                 @click="verification=scope.row.verification,current_id=scope.row.id,denyReason=scope.row.denyReason">{{
                scope.row.verification|formVerification }} </a>
            </template>
          </el-table-column>
          <el-table-column label="Enabled" v-if="ifshow('ad:status')" width="80">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                @change=change_switch(scope.row.id,scope.row.status)>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="Action" v-if="ifshow('ad:edit')" width="70">
            <template slot-scope="scope">
              <router-link :to="{path:'/newAd',query:{ id:scope.row.id }}"><i class="fa fa-edit"
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

        <!-- 拒绝理由 -->
        <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                </button>
                <h4 class="modal-title" id="myModalLabel">Modification</h4>
              </div>
              <!-- 弹窗内容 -->
              <div class="modal-body">
                <form class="form-horizontal">
                  <!-- 修改状态 -->
                  <div class="form-group">
                    <label class="col-sm-2 control-label">Status</label>
                    <div class="col-sm-10">
                      <el-radio-group v-model="verification" size="medium">
                        <el-radio-button label=0>Pending</el-radio-button>
                        <el-radio-button label=1>Approved</el-radio-button>
                        <el-radio-button label=2>Rejected</el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>

                  <!-- 拒绝理由 -->
                  <div v-if="verification == 2">
                    <div class="hr-line-dashed"></div>
                    <div class="form-group">
                      <label class="col-sm-2 control-label">{{$t("m.Form.Reason")}}</label>
                      <div class="col-sm-10">
                        <input type="text" class="form-control" v-model="denyReason" autocomplete="off">
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">{{$t("m.Btn.Cancel")}}</button>
                <button type="button" class="btn btn-primary" @click="modif_verification()">{{$t("m.Btn.Confirm")}}</button>
              </div>
            </div>
          </div>
        </div>
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
        ifshow_BidPrice: true,
        ifshow_spend: false,
        ifshow_adType: false,
        ifshow_cost: true,
        ifshow_revenue: true,
        ifshow_advertiserName: true,
        ifshow_mediaBuyName: true,
        ifshow_clickCount: true,
        ifshow_budgetDaily: false,
        ifshow_budgetOverall: false,
        ifshow_impressionCount: true,
        ifshow_roi: false,
        ifshow_ecpm: false,
        ifshow_apps: false,
        ifshow_adSquad: false,
        infoData: [],

        //过滤条件
        select_date: "", //日期
        keyword: "", //关键字
        list_mediaBuy: [], //加载mediaBuy
        mediabuyID: "", //mediaBuy选中
        list_advertiser: [], //加载广告主
        advertiserID: "", //广告主选中
        list_campaign: [], //加载campaign
        campaignID: "", //campaign选中
        list_adSquad: [],
        adSquadID: "",
        verificationID: "",
        targetID:"",list_target:[], //目标平台

        //分页
        orderBy: 'id',
        orderType: 'desc',
        pageNumber: 25, //默认每页数量
        pageNumbers: [25, 50, 75, 100], //每页显示多少条
        currentPage: 1, //当前页
        dataTotal: 1, //数据总数
        permission: [], //权限
        statusID: "", //状态id

        //拒绝理由
        current_id: "",
        verification: 1,
        denyReason: "",
      }
    },
    mounted: function () {
      this.search();
      //mediaBuy下拉列表
      axios.get('/mediaBuy/select2')
        .then(res => {
          if (res.data.status == 1) {
            this.list_mediaBuy = res.data.data;
          }
        })

      //campaign下拉列表
      axios.get('/campaign/select2')
        .then(res => {
          if (res.data.status == 1) {
            this.list_campaign = res.data.data;
          }
        });

      if(!this.ifshow('ad:mediabuy')){
        this.loadAdvertiser();
      }

      //平台下拉
      this.load_target();
        
      //读取localStorage
      var storage = window.localStorage;
      this.permission = storage.getItem("ifshow");
    },
    methods: {
      //加载AdSquad
      loadAdSquad: function (query) {
        axios.get('/adSquad/select2', {
          params: {
            keyword: query
          }
        })
          .then(res => {
            if (res.data.status == 1) {
              this.list_adSquad = res.data.data;
            }
          })
      },
        
    //加载target
    load_target:function(){
        axios.get('/option/select2Platform')
        .then(res => {
            this.list_target = res.data.data;
        })
    },
        
      //加载广告主
      loadAdvertiser: function () {
        this.advertiserID = "";
        axios.get('/advertiser/select2')
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
        //判断日期是否为空
        var current_date = "";
        if (this.select_date) {
          current_date = (this.select_date) / 1000;
        }
        else {
          current_date = "";
        }

        axios.get('/ad/list', {
          params: {
            rows: this.pageNumber, //每页数量
            orderBy: this.orderBy,  //字段
            page: this.currentPage,  //页
            orderType: this.orderType, //排序类型
            keyword: this.keyword,
            createTime: current_date,
            tbMediaBuyId: this.mediabuyID,
            tbAdvertiserId: this.advertiserID,
            tbCampaignId: this.campaignID,
            tbAdSquadId: this.adSquadID,
            verification: this.verificationID,
            targetPlatform:this.targetID, //投放平台
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

      //修改审核状态
      modif_verification: function () {
        $('#myModal').modal('toggle');
        axios.get('/ad/updateVer', {
          params: {
            id: this.current_id,
            verification: this.verification,
            denyReason: this.denyReason
          }
        })
          .then(res => {
            if (res.data.status == 1) {
              this.$message({
                message: 'success',
                type: 'success',
                duration: 1800
              });
              //重新加载列表
              axios.get('/ad/list', {
                params: {
                  rows: this.pageNumbers,  //每页数量
                  page: 1,  //当前页
                }
              })
                .then(res => {
                  this.infoData = res.data.data.list;
                })
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

      //开关
      change_switch: function (id, status) {
        axios.get('/ad/updateStatus', {
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
        this.$router.push({path: "/newAd"});
      }
    },
    filters: {
      //时间戳
      formatDate(time) {
        var date = new Date(time * 1000);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      },
      formVerification: function (val) {
        if (val == 0) {
          return 'Pending'
        }
        else if (val == 1) {
          return 'Approved'
        }
        else if (val == 2) {
          return 'Rejected'
        }
      }
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
</style>
