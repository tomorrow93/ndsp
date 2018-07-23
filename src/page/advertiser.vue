<template>
  <div>
    <current :current="'Advertiser'"></current>
    <div class="ibox float-e-margins animated fadeInRight">
      <div class="ibox-title">
        <h5>{{$t("m.Advertiser.Title")}}</h5>
        <div class="ibox-tools">
          <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#myModal"
                  v-if="ifshow('adveradvertiser:add')">{{$t("m.Advertiser.Create")}}
          </button>
        </div>
      </div>
      <div class="ibox-content">
        <!-- search -->
        <form class="form-inline" style="margin-bottom:20px" @submit.prevent="search()">
          <div class="form-group m-mgright">
            <input type="text" class="form-control" placeholder="ID or Name" v-model="keyword" style="width:150px">
          </div>
          <div class="form-group m-mgright10" v-if="ifshow('adveradvertiser:mediabuy')">
            <el-select v-model="mediabuyID" filterable placeholder="Mediabuyer" style="width:150px">
              <el-option value="">All</el-option>
              <el-option
                v-for="item in list_mediaBuy"
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
        <el-checkbox v-model="ifshow_spend" :label="$t('m.Form.Spend')"></el-checkbox>
        <el-checkbox v-model="ifshow_revenue" :label="$t('m.Form.Revenue')"></el-checkbox>
        <el-checkbox v-model="ifshow_impressions" :label="$t('m.Form.Impressions')"></el-checkbox>
        <el-checkbox v-model="ifshow_conver" :label="$t('m.Form.Conversions')"></el-checkbox>
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
          <el-table-column prop="mediaBuyName" label="Mediabuyer" sortable
                           v-if="ifshow('advertiser:mediabuy')"></el-table-column>
          <el-table-column prop="email" :label="$t('m.Form.Email')" sortable></el-table-column>
          <el-table-column prop="createTime" :label="$t('m.Form.CreateTime')" sortable v-if="ifshow_createTime" width="180">
            <template slot-scope="scope">
              {{ scope.row.createTime|formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="spend" :label="$t('m.Form.Spend')" sortable v-if="ifshow_spend"></el-table-column>
          <el-table-column prop="cost" :label="$t('m.Form.Cost')" sortable sortable
                           v-if="ifshow('advertiser:cost')"></el-table-column>
          <el-table-column prop="revenue" :label="$t('m.Form.Revenue')" sortable v-if="ifshow_revenue"></el-table-column>
          <el-table-column prop="impressionCount" :label="$t('m.Form.Impressions')" sortable
                           v-if="ifshow_impressions"></el-table-column>
          <el-table-column prop="conversionCount" :label="$t('m.Form.Conversions')" sortable
                           v-if="ifshow_conver"></el-table-column>
          <el-table-column prop="roi" label="ROI" sortable v-if="ifshow_roi"></el-table-column>
          <el-table-column prop="ecpm" label="eCPM" sortable v-if="ifshow_ecpm"></el-table-column>
          <el-table-column v-if="ifshow('advertiser:status')" label="Enabled">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                @change=change_switch(scope.row.id,scope.row.status)>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column :label="$t('m.Form.Action')" v-if="ifshow('adveradvertiser:edit')" width="80">
            <template slot-scope="scope">
              <!--                            <a href="#" @click="delete_id=scope.row.userId" data-toggle="modal" data-target="#myModal_delete"><i class="fa fa-trash"></i></a>-->
              <a href="#" @click="current_id=scope.row.id,edit_before()" data-toggle="modal"
                 data-target="#myModal_edit"><i class="fa fa-edit" style="margin-left:10px" title="Edit"></i></a>
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

      <!-- 新建 -->
      <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
              </button>
              <h4 class="modal-title" id="myModalLabel">{{$t("m.Advertiser.New_title")}}</h4>
            </div>
            <!-- 弹窗内容 -->
            <div class="modal-body">
              <form class="form-horizontal">
                <!-- name -->
                <div class="form-group">
                  <label class="col-sm-2 control-label"><i class="star">*</i>{{$t("m.Form.Name")}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-validate="'required|max:16|min:2'" name="vee-name"
                           v-model="new_name" autocomplete="off">
                    <div v-if="errors.first('vee-name')" class="tip">{{ errors.first('vee-name') }}</div>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- email -->
                <div class="form-group">
                  <label class="col-sm-2 control-label"><i class="star">*</i>{{$t("m.Form.Email")}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-validate="'required|email'" name="vee-email"
                           v-model="new_email" autocomplete="off">
                    <div v-if="errors.first('vee-email')" class="tip">{{ errors.first('vee-email') }}</div>
                  </div>
                </div>

                <!-- mediabuy -->
                <div v-if="ifshow('advertiser:mediabuy')">
                  <div class="hr-line-dashed"></div>
                  <div class="form-group">
                    <label class="col-sm-2 control-label">MediaBuyer</label>
                    <div class="col-sm-10">
                      <select class="form-control" v-model="new_mediabuyID">
                        <option value="" disabled>{{$t("m.Status.Select")}}</option>
                        <option v-for="pro in new_listMediabuy" :value="pro.id">{{pro.name}}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">{{$t("m.Btn.Cancel")}}</button>
              <button type="button" class="btn btn-primary" @click="new_submit()">{{$t("m.Btn.Confirm")}}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 你确定要删除吗 -->
      <div class="modal fade" id="myModal_delete" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
              </button>
              <h4 class="modal-title" id="myModalLabel">{{$t("m.Msg.Hint")}}</h4>
            </div>
            <!-- 弹窗内容 -->
            <div class="modal-body">
              {{$t("m.Msg.Delete")}}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">{{$t("m.Btn.Cancel")}}</button>
              <button type="button" class="btn btn-primary" data-dismiss="modal" @click="del()">{{$t("m.Btn.Confirm")}}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 编辑 -->
      <div class="modal fade" id="myModal_edit" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
              </button>
              <h4 class="modal-title" id="myModalLabel">{{$t("m.Advertiser.Edit_title")}}</h4>
            </div>
            <!-- 弹窗内容 -->
            <div class="modal-body">
              <form class="form-horizontal">
                <!-- name -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.Name")}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="edit_name">
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- email -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.Email")}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="edit_email">
                  </div>
                </div>

                <!-- mediabuy -->
                <div v-if="ifshow('advertiser:mediabuy')">
                  <div class="hr-line-dashed"></div>
                  <div class="form-group">
                    <label class="col-sm-2 control-label">MediaBuyer</label>
                    <div class="col-sm-10">
                      <select class="form-control" v-model="edit_mediabuyID">
                        <option value="" disabled>{{$t("m.Status.Select")}}</option>
                        <option v-for="editPro in new_listMediabuy" :value="editPro.id">{{editPro.name}}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">{{$t("m.Btn.Cancel")}}</button>
              <button type="button" class="btn btn-primary" @click="editOK()">{{$t("m.Btn.Confirm")}}</button>
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
    inject: ['reload'], //注入依赖
    components: {
      "current": current
    },
    data() {
      return {
        ifshow_createTime: false,
        ifshow_spend: true,
        ifshow_revenue: true,
        ifshow_impressions: true,
        ifshow_clickCount: false,
        ifshow_conver: false,
        ifshow_roi: false,
        ifshow_ecpm: false,
        infoData: [],
        list_mediaBuy: [], //下拉列表，mediaBuy
        new_listMediabuy: [],
        mediabuyID: "", //下拉列表，mediaBuy选中
        keyword: "", //搜索关键字
        current_id: 0, //点击编辑，获取当前ID
        delete_id: 0, //点击删除，获取当前userID
        new_name: "", //新建，名字
        new_email: "", //新建，邮箱
        new_mediabuyID: "", //mediabuyID
        edit_mediabuyID: "",
        edit_name: "", //编辑，名字
        edit_email: "", //编辑，邮箱
        orderBy: 'id',
        orderType: 'desc',
        pageNumber: 25, //默认每页数量
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
      axios.get('/mediaBuy/select2', {
        headers: { //token
          Authorization: getCookie('token')
        }
      })
        .then(res => {
          if (res.data.status == 1) {
            this.list_mediaBuy = res.data.data;
            this.new_listMediabuy = res.data.data;
          }
        })

      //读取localStorage
      var storage = window.localStorage;
      this.permission = storage.getItem("ifshow");
    },
    methods: {
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
        axios.get('/advertiser/list', {
          params: {
            rows: this.pageNumber, //每页数量
            orderBy: this.orderBy,  //字段
            page: this.currentPage,  //页
            orderType: this.orderType, //排序类型
            keyword: this.keyword,
            tbMediaBuyId: this.mediabuyID
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

      //新建
      new_submit: function () {
        this.$validator.validateAll().then((result) => {
          if (result) {
            let userEntity = {
              name: this.new_name,
              email: this.new_email,
              tbMediaBuyId: this.new_mediabuyID,
              status: 1
            }
            axios.post('/advertiser/add', userEntity, {
              headers: {
                Authorization: getCookie('token'),
              },
            })
              .then(res => {
                if (res.data.status == 1) {
                  $('#myModal').modal('toggle');
                  this.$message({
                    message: this.$t("m.Msg.New_success"),
                    type: 'success',
                    duration: 1800
                  });
                  setTimeout(() => {
                    this.reload(); //刷新
                  }, 1850)
                }
                else {
                  $('#myModal').modal('toggle');
                  this.$message({
                    message: this.$t("m.Msg.Failed"),
                    type: 'error',
                    duration: 1800
                  });
                }
              })
          }
        })
      },

      //编辑前的查询
      edit_before: function () {
        axios.get('/advertiser/findById', {
          headers: { //token
            Authorization: getCookie('token')
          },
          params: {
            id: this.current_id
          }
        })
          .then(res => {
            this.edit_name = res.data.data.name;
            this.edit_email = res.data.data.email;
            this.edit_mediabuyID = res.data.data.tbMediaBuyId;
            this.status = res.data.data.status;
          })
      },

      //编辑
      editOK: function () {
        let editobj = {
          id: this.current_id,
          name: this.edit_name,
          email: this.edit_email,
          tbMediaBuyId: this.edit_mediabuyID,
          status: this.status
        }
        axios.put('/advertiser/update', editobj, {
          headers: {
            Authorization: getCookie('token'),
          },
        })
          .then(res => {
            if (res.data.status == 1) {
              $('#myModal_edit').modal('toggle');
              this.$message({
                message: this.$t("m.Msg.Edit_success"),
                type: 'success',
                duration: 1800
              });
              //重新刷新列表
              axios.get('/advertiser/list', {
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
              $('#myModal_edit').modal('toggle');
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
        axios.get('/advertiser/updateStatus', {
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
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
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
</style>
