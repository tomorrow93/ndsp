<template>
  <div>
    <current :current="'Account'"></current>
    <div class="ibox float-e-margins animated fadeInRight">
      <div class="ibox-title">
        <h5>{{$t("m.Account.Title")}}</h5>
        <div class="ibox-tools">
          <button class="btn btn-primary btn-sm" v-if="ifshow('cheetahAccount:create')" data-toggle="modal"
                  @click="initData()" data-target="#myModal">{{$t("m.Account.Create")}}
          </button>
        </div>
      </div>
      <div class="ibox-content">
        <!-- search -->
        <form class="form-inline" style="margin-bottom:20px" @submit.prevent="search()">
          <div class="form-group m-mgright">
            <input type="text" class="form-control" placeholder="Email" v-model="keyword" style="width:150px">
          </div>
          <div class="form-group m-mgright" v-if="ifshow('cheetahAccount:mediabuy')">
            <el-select v-model="value_mediaBuy" :placeholder="$t('m.Form.MediaBuy')" style="width:150px">
              <el-option value="">All</el-option>
              <el-option
                v-for="roleList in list_mediaBuy"
                :key="roleList.value"
                :label="roleList.name"
                :value="roleList.id">
              </el-option>
            </el-select>
          </div>
          <div class="form-group m-mgright10">
            <el-select v-model="value_status" :placeholder="$t('m.Form.Status')" style="width:150px">
              <el-option value="">All</el-option>
              <el-option
                v-for="statusList in list_status"
                :key="statusList.value"
                :label="statusList.name"
                :value="statusList.id">
              </el-option>
            </el-select>
          </div>
          <div class="form-group">
            <button class="btn btn-primary" type="submit">{{$t("m.Btn.Search")}}</button>
          </div>
        </form>

        <!-- table -->
        <el-table
          class="table"
          :data="infoData"
          style="width: 100%"
          stripe=""
          sortable='custom'
          @sort-change="changeSort">
          <el-table-column prop="clientId" label="Client ID" sortable width="120"/>
          <el-table-column prop="email" :label="$t('m.Form.Email')" sortable/>
          <el-table-column prop="mediaBuyName" :label="$t('m.Form.MediaBuy')" v-if="ifshow('cheetahAccount:mediabuy')"
                           sortable/>
          <el-table-column prop="balance" :label="$t('m.Form.Balance')" sortable/>
          <el-table-column prop="name" :label="$t('m.Form.Name')"/>
          <el-table-column prop="timezone" :label="$t('m.Form.Timezone')" sortable/>
          <!--<el-table-column prop="status" :label="$t('m.Form.Status')" sortable>-->
          <!--<template slot-scope="scope">{{ scope.row.status|statusFormat }}</template>-->
          <!--</el-table-column>-->
          <el-table-column :label="$t('m.Form.Status')">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                @change=change_switch(scope.row.id,scope.row.status)>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column :label="$t('m.Form.Action')" v-if="ifshow('cheetahAccount:edit')">
            <template slot-scope="scope">
              <a href="#" @click="current_id=scope.row.id,edit_before()" data-toggle="modal"
                 data-target="#myModal"><i class="fa fa-edit" title="Edit" style="margin-left:10px"></i></a>
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

      <!-- 新建/编辑账号 -->
      <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
              </button>
              <h4 class="modal-title" id="myModalLabel">{{$t("m.Account.New_title")}}</h4>
            </div>
            <!-- 弹窗内容 -->
            <div class="modal-body">
              <form class="form-horizontal">
                <!-- name -->
                <div class="form-group">
                  <label class="col-sm-2 control-label"><i class="star">*</i>client id</label>
                  <div class="col-sm-10">
                    <input
                      type="text"
                      class="form-control"
                      v-validate="'required'"
                      name="vee-empty"
                      v-model="value_clientId"
                      autocomplete="off">
                    <div class="tip" v-if="errors.first('vee-empty')">{{ errors.first('vee-empty') }}</div>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <div class="form-group">
                  <label class="col-sm-2 control-label"><i class="star">*</i>client credential</label>
                  <div class="col-sm-10">
                    <input
                      type="text"
                      class="form-control"
                      v-validate="'required'"
                      name="vee-empty"
                      v-model="value_clientSecret"
                      autocomplete="off">
                    <div class="tip" v-if="errors.first('vee-empty')">{{ errors.first('vee-empty') }}</div>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <div class="form-group">
                  <label class="col-sm-2 control-label"><i class="star">*</i>{{$t("m.Form.Email")}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-validate="'required|email'" name="vee-email"
                           v-model="value_email" autocomplete="off">
                    <div class="tip" v-if="errors.first('vee-email')">{{ errors.first('vee-email') }}</div>
                    <div class="tip" v-if="new_hint">{{new_hint}}</div>
                  </div>
                </div>

                <!-- mediabuy -->
                <div v-if="ifshow('cheetahAccount:mediabuy')">
                  <div class="hr-line-dashed"></div>
                  <div class="form-group">
                    <label class="col-sm-2 control-label"><i class="star">*</i>{{$t("m.Form.MediaBuy")}}</label>
                    <div class="col-sm-10">
                      <el-select
                        v-model="value_mediaBuy"
                        filterable
                        placeholder="Select"
                        style="width: 100%"
                        v-validate="'required'"
                        :disabled="current_id>0"
                        name="vee-mediabuy">
                        <el-option width="100%"
                                   v-for="item in list_mediaBuy"
                                   :key="item.value"
                                   :label="item.name"
                                   :value="item.id">
                        </el-option>
                      </el-select>
                      <!--<div v-if="errors.first('vee-mediabuy')" class="tip">{{ errors.first('vee-mediabuy') }}</div>-->
                    </div>
                  </div>
                  <div class="hr-line-dashed"></div>
                </div>

                <div id="box">
                  <span  style="margin-left: 8rem">How to get client id and client credential ?</span>
                  <i value="toggle" @click="toggle()" class="el-icon-arrow-down" style="background: yellow;margin-left: 4rem;cursor: pointer;"></i><br />
                  <div style="display: none" v-show="isShow">
                  <p style="width: 443px;margin-left: 4rem">
                    User need to apply for the client id and client credential of API by E-mail.
                    The email template as following:
                    Addressee: k_ori_api@cmcm.com
                  </p>
                  <p style="width: 443px;margin-left: 4rem">
                    Title: Apply for the client id and client credential of Orion Advertiser API
                    Account: XXX (User account in Orion)
                    Reason: In order to integrate with Orion API，XXX need to apply for client id and client credential of API
                  </p>
                  </div>
                </div>


              </form>

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">{{$t("m.Btn.Cancel")}}</button>
              <button type="button" class="btn btn-primary" @click="editAccount()">{{$t("m.Btn.Confirm")}}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import current from '../common/current'
  import axios from 'axios'
  import {delCookie, getCookie, setCookie} from '@/assets/js/cookie.js'
  import {$t} from 'vue-i18n'

  export default {
    inject: ['reload'], //注入依赖
    components: {
      "current": current
    },
    data() {
      return {
        keyword: "", //搜索关键字
        value_mediaBuy: "",
        value_status: "",
        value_clientId: "",
        value_clientSecret: "",
        value_email: "",

        permission: [], //权限
        list_mediaBuy: [],
        list_status: [
          {
            id: 1,
            name: "Bind"
          },
          {
            id: 0,
            name: "UnBind"
          }
        ],
        new_hint: "",//创建/编辑校验参数的提升字段
        current_id: 0, //删除编辑ID
        infoData: [],
        orderBy: 'clientId',
        orderType: 'asc',
        pageNumber: 25, //默认每页数量
        pageNumbers: [25, 50, 75, 100], //每页显示多少条
        currentPage: 1, //当前页
        dataTotal: 0, //数据总数
        isShow:false,

      }
    },
    methods: {
      toggle:function(){
        this.isShow = !this.isShow;
        if (this.isShow ==false) {
        $(".el-icon-arrow-down").addClass('img1')
        }else{
          $(".el-icon-arrow-down").removeClass('img1')
        }

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

      //判断是否有权限
      ifshow: function (per) {
        if (this.permission.indexOf(per) > 0) {
          return true;
        } else {
          return false;
        }
      },

      //开关
      change_switch: function (id, status) {
        axios.get('/targetAccount/updateStatus', {
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

      //新建/编辑账号
      editAccount: function () {
        var url;
        if (this.current_id == 0) {
          url = "/targetAccount/add";
        } else {
          url = "/targetAccount/update";
        }
        this.$validator.validateAll().then((result) => {
          if (result) {
            if (this.new_hint == "") {
              let userEntity = {
                id: this.current_id,
                clientId: this.value_clientId,
                clientSecret: this.value_clientSecret,
                email: this.value_email,
                //下面两个参数创建时 传默认值
                status: this.current_id == 0 ? 1 : null,
                tbMediaBuyId: this.value_mediaBuy,
                targetPlatform: this.current_id == 0 ? 1 : null,
              }
              if (this.current_id == 0) {
                axios.post(url, userEntity)
                  .then(res => {
                    this.editAccountComplete(res);
                  })
              } else {
                axios.put(url, userEntity)
                  .then(res => {
                    this.editAccountComplete(res);
                  })
              }

            }
          }
        })
      },

      editAccountComplete: function (res) {
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
          this.$message({
            message: this.$t("m.Msg.Failed"),
            type: 'error',
            duration: 1800
          });
        }
      },


      initData: function () {
        this.value_clientId = "";
        this.value_clientSecret = "";
        this.value_email = "";
        this.value_mediaBuy = "";
        this.current_id = 0;
      },

      //编辑前查询
      edit_before: function () {
        axios.get('/targetAccount/findById', {
          params: {
            id: this.current_id
          }
        })
          .then(res => {
            this.value_email = res.data.data.email;
            this.value_clientId = res.data.data.clientId;
            this.value_clientSecret = res.data.data.clientSecret;
            this.value_mediaBuy = res.data.data.tbMediaBuyId;
          })
      },

      //搜索
      search: function () {
        axios.get('/targetAccount/list', {
          params: {
            rows: this.pageNumber, //每页数量
            orderBy: this.orderBy,  //字段
            page: this.currentPage,  //页
            orderType: this.orderType, //排序类型
            email: this.keyword, //关键字
            tbMediaBuyId: this.value_mediaBuy,
            status: this.value_status, //状态

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
      }
    },
    mounted: function () {
      //账号列表
      this.search();

      //加载mediaBuy
      axios.get('/mediaBuy/select2')
        .then(res => {
          if (res.data.status == 1) {
            this.list_mediaBuy = res.data.data;
          }
        })

      //读取localStorage
      var storage = window.localStorage;
      this.permission = storage.getItem("ifshow");
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* 弹出框按钮对齐 */
  .float-e-margins .btn {
    margin-bottom: 5px;
  }
  .img1 {
    transform:rotate(180deg);
    -ms-transform:rotate(180deg); 	/* IE 9 */
    -moz-transform:rotate(180deg); 	/* Firefox */
    -webkit-transform:rotate(180deg); /* Safari 和 Chrome */
    -o-transform:rotate(180deg); 	/* Opera */
  }
</style>
