<template>
  <div>
    <current :current="'Mediabuyer'"></current>
    <div class="ibox float-e-margins animated fadeInRight">
      <div class="ibox-title">
        <h5>{{$t("m.Mediabuyer.Title")}}</h5>
        <div class="ibox-tools">
          <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#myModal" @click="load_select()"
                  v-if="ifshow('mediabuy:add')">{{$t("m.Mediabuyer.Create")}}
          </button>
        </div>
      </div>
      <div class="ibox-content">
        <!-- search -->
        <form class="form-inline" style="margin-bottom:20px" @submit.prevent="search()">
          <div class="form-group m-mgright">
            <input type="text" class="form-control" placeholder="ID or Name" v-model="keyword" style="width:150px">
          </div>
          <div class="form-group m-mgright10">
            <el-select v-model="statusID" placeholder="Status" style="width:150px">
              <el-option value="">All</el-option>
              <el-option value=1 label="Normal"></el-option>
              <el-option value=2 label="Blocked"></el-option>
              <el-option value=3 label="Pending"></el-option>
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
          <el-table-column prop="id" label="ID" sortable width="80"></el-table-column>
          <el-table-column prop="name" :label="$t('m.Form.Name')" sortable></el-table-column>
          <el-table-column prop="email" :label="$t('m.Form.Email')" sortable></el-table-column>
          <el-table-column prop="createTime" :label="$t('m.Form.CreateTime')" sortable>
            <template slot-scope="scope">
              {{ scope.row.createTime|formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="proxyName" :label="$t('m.Form.Agent')" sortable v-if="ifshow('mediabuy:proxy')"></el-table-column>
          <el-table-column prop="bdName" label="BD" sortable v-if="ifshow('mediabuy:BD')"></el-table-column>
          <el-table-column prop="amName" label="AM" sortable v-if="ifshow('mediabuy:AM')"></el-table-column>
          <el-table-column prop="status" :label="$t('m.Form.Status')" sortable>
            <template slot-scope="scope">
              {{ scope.row.status|formatStatus }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('m.Form.Action')" v-if="ifshow('mediabuy:edit')" width="80">
            <template slot-scope="scope">
              <!--                            <a href="#" @click="current_id=scope.row.tbUserId" data-toggle="modal" data-target="#myModal_delete"><i class="fa fa-trash"></i></a>-->
              <a href="#" @click="current_id=scope.row.id,current_userID=scope.row.tbUserId,edit_before(),load_select()"
                 data-toggle="modal" data-target="#myModal_edit"><i class="fa fa-edit" style="margin-left:10px" title="Edit"></i></a>
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
              <h4 class="modal-title" id="myModalLabel">{{$t("m.Mediabuyer.New_title")}}</h4>
            </div>
            <!-- 弹窗内容 -->
            <div class="modal-body height600">
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
                           v-model="new_email" @blur="check_new_email()" autocomplete="off">
                    <div v-if="errors.first('vee-email')" class="tip">{{ errors.first('vee-email') }}</div>
                    <div class="tip" v-if="new_hint">{{new_hint}}</div>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- amId -->
                <div v-if="ifshow('mediabuy:AM')">
                  <div class="form-group">
                    <label class="col-sm-2 control-label"><i class="star">*</i>AM</label>
                    <div class="col-sm-10">
                      <select class="form-control" v-model="new_amID" v-validate="'required'" name="vee-amId">
                        <option value="" disabled>Please Choose</option>
                        <option v-for="item in new_amIDSelect" :value=item.id>{{item.name}}</option>
                      </select>
                      <div v-if="errors.first('vee-amId')" class="tip">{{ errors.first('vee-amId') }}</div>
                    </div>
                  </div>
                  <div class="hr-line-dashed"></div>
                </div>

                <!-- bdId -->
                <div v-if="ifshow('mediabuy:BD')">
                  <div class="form-group">
                    <label class="col-sm-2 control-label"><i class="star">*</i>BD</label>
                    <div class="col-sm-10">
                      <select class="form-control" v-model="new_bdID" v-validate="'required'" name="vee-bdId">
                        <option value="" disabled>Please Choose</option>
                        <option v-for="item in new_bdIDSelect" :value=item.id>{{item.name}}</option>
                      </select>
                      <div v-if="errors.first('vee-bdId')" class="tip">{{ errors.first('vee-bdId') }}</div>
                    </div>
                  </div>
                  <div class="hr-line-dashed"></div>
                </div>

                <!-- proxyId -->
                <div v-if="ifshow('mediabuy:proxy')">
                  <div class="form-group">
                    <label class="col-sm-2 control-label"><i class="star">*</i>Agent</label>
                    <div class="col-sm-10">
                      <select class="form-control" v-model="new_proxyID" v-validate="'required'" name="vee-proxyId">
                        <option value="" disabled>Please Choose</option>
                        <option v-for="item in new_proxyIDSelect" :value=item.id>{{item.name}}</option>
                      </select>
                      <div v-if="errors.first('vee-proxyId')" class="tip">{{ errors.first('vee-proxyId') }}</div>
                    </div>
                  </div>
                  <div class="hr-line-dashed"></div>
                </div>

                <!-- skype -->
                <div class="form-group">
                  <label class="col-sm-2 control-label"><i class="star">*</i>Skype</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-validate="'required'" name="vee-skype" v-model="new_skype"
                           autocomplete="off">
                    <div v-if="errors.first('vee-skype')" class="tip">{{ errors.first('vee-skype') }}</div>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- jobTitle -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.JobTitle")}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="new_jobTitle" autocomplete="off">
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- phone -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.Phone")}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="new_phone" autocomplete="off">
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- QQ -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">QQ</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="new_qq" autocomplete="off">
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- password -->
                <div class="form-group">
                  <label class="col-sm-2 control-label"><i class="star">*</i>{{$t("m.Form.Password")}}</label>
                  <div class="col-sm-10">
                    <input type="password" class="form-control" v-validate="'required|min:6|max:16'" name="vee-password"
                           v-model="new_password" autocomplete="off">
                    <div v-if="errors.first('vee-password')" class="tip">{{ errors.first('vee-password') }}</div>
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
              {{$t("m.Msg.Hint")}}
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
              <h4 class="modal-title" id="myModalLabel">{{$t("m.Mediabuyer.Edit_title")}}</h4>
            </div>
            <!-- 弹窗内容 -->
            <div class="modal-body height600">
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
                    <input type="text" class="form-control" v-model="edit_email" disabled>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- amId -->
                <div v-if="ifshow('mediabuy:AM')">
                  <div class="form-group">
                    <label class="col-sm-2 control-label">AM</label>
                    <div class="col-sm-10">
                      <select class="form-control" v-model="edit_amID">
                        <option v-for="item in new_amIDSelect" :value=item.id>{{item.name}}</option>
                      </select>
                    </div>
                  </div>
                  <div class="hr-line-dashed"></div>
                </div>

                <!-- bdId -->
                <div v-if="ifshow('mediabuy:BD')">
                  <div class="form-group">
                    <label class="col-sm-2 control-label">BD</label>
                    <div class="col-sm-10">
                      <select class="form-control" v-model="edit_bdID">
                        <option v-for="item in new_bdIDSelect" :value=item.id>{{item.name}}</option>
                      </select>
                    </div>
                  </div>
                  <div class="hr-line-dashed"></div>
                </div>

                <!-- proxy -->
                <div v-if="ifshow('mediabuy:proxy')">
                  <div class="form-group">
                    <label class="col-sm-2 control-label">{{$t("m.Form.Agent")}}</label>
                    <div class="col-sm-10">
                      <select class="form-control" v-model="edit_proxyID">
                        <option v-for="item in new_proxyIDSelect" :value=item.id>{{item.name}}</option>
                      </select>
                    </div>
                  </div>
                  <div class="hr-line-dashed"></div>
                </div>

                <!-- jobTitle -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.JobTitle")}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="edit_jobTitle">
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- phone -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.Phone")}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="edit_phone">
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- qq -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">QQ</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="edit_qq">
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- skype -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">Skype</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="edit_skype">
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- password -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.Password")}}</label>
                  <div class="col-sm-10">
                    <input type="password" class="form-control" v-model="edit_password">
                  </div>
                </div>

                <div v-if="ifshow('mediabuy:status')">
                  <div class="hr-line-dashed"></div>

                  <!-- Status -->
                  <div class="form-group">
                    <label class="col-sm-2 control-label">{{$t("m.Form.Status")}}</label>
                    <div class="col-sm-10">
                      <select class="form-control" v-model="edit_status">
                        <option value=1>Normal</option>
                        <option value=2>Blocked</option>
                        <option value=3>Pending</option>
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
  import {delCookie, getCookie, setCookie} from '@/assets/js/cookie.js'
  import {formatDate} from '@/assets/js/date.js'
  import axios from 'axios'

  export default {
    inject: ['reload'], //注入依赖
    components: {
      "current": current
    },
    data() {
      return {
        infoData: [],
        keyword: "", //搜索关键字
        current_id: 0, //点击编辑，获取当前ID
        statusID: "", //状态id
        current_userID: "", //当前userID

        new_hint: "", //新建，邮箱已存在
        new_name: "", //新建，名字
        new_email: "", //新建，邮箱
        new_amID: "", //新建，amID
        new_bdID: "", //新建，bdID
        new_proxyID: "", //新建，代理ID
        new_skype: "", //新建，skype
        new_jobTitle: "", //新建，jobTitle
        new_phone: "", //新建，phone
        new_qq: "", //新建，qq
        new_password: "", //新建，密码
        new_status: 1, //新建，状态

        //新建时获取下拉列表
        new_amIDSelect: [], //新建，amID下拉列表
        new_bdIDSelect: [], //新建，bdID下拉列表
        new_proxyIDSelect: [], //新建，代理ID下拉列表

        edit_name: "", //编辑，名字
        edit_email: "", //编辑，邮箱
        edit_amID: "", //编辑，amID
        edit_bdID: "", //编辑，bdID
        edit_proxyID: "", //编辑，代理ID
        edit_skype: "", //编辑，skype
        edit_jobTitle: "", //编辑，职称
        edit_qq: "", //编辑，qq
        edit_phone: "", //编辑，手机号
        edit_status: 1, //编辑，状态
        edit_password: "", //编辑，密码

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

      //读取localStorage
      var storage = window.localStorage;
      this.permission = storage.getItem("ifshow");

      //判断角色，默认审核状态还是正常状态
      if (this.permission.indexOf("mediabuy:normal") > 0) {
        this.new_status = 1;
      }
      else if (this.permission.indexOf("mediabuy:approval") > 0) {
        this.new_status = 3;
      }
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
        axios.get('/mediaBuy/list', {
          params: {
            rows: this.pageNumber, //每页数量
            orderBy: this.orderBy,  //字段
            page: this.currentPage,  //页
            orderType: this.orderType, //排序类型
            keyword: this.keyword,
            status: this.statusID,
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
        axios.delete('/mediaBuy/delete', {
          params: {
            id: this.current_id
          }
        })
          .then(res => {
            if (res.data.status == 1) {
              this.$message({
                message: this.$t("m.Msg.Delete_success"),
                type: 'success',
                duration: 1800
              });
              //重新刷新列表
              axios.get('/mediaBuy/list', {
                params: {
                  rows: this.pageNumber,  //每页数量
                  page: this.currentPage,  //当前页
                }
              })
                .then(res => {
                  if (res.data.status == 1) {
                    this.infoData = res.data.data.list;
                    this.dataTotal = res.data.data.total;
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

      //验证邮箱是否存在
      check_new_email: function () {
        axios.get('/account/findByEmail', {
          params: {
            email: this.new_email,
          }
        })
          .then(res => {
            if (res.data.status == 1) {
              this.new_hint = "";
            } else {
              this.new_hint = this.$t("m.Msg.exists");
            }
          })
      },

      //新建前，加载下拉列表
      load_select: function () {
        axios.get('/mediaBuy/create')
          .then(res => {
            this.new_amIDSelect = res.data.data.amlist;
            this.new_bdIDSelect = res.data.data.bdlist;
            this.new_proxyIDSelect = res.data.data.proxylist;
          })
      },

      //新建
      new_submit: function () {
        this.$validator.validateAll().then((result) => {
          if (result) {
            if (this.new_hint == "") {
              let userEntity = {
                name: this.new_name,
                email: this.new_email,
                amId: this.new_amID,
                bdId: this.new_bdID,
                tbProxyId: this.new_proxyID,
                skype: this.new_skype,
                phone: this.new_phone,
                jobTitle: this.new_jobTitle,
                qq: this.new_qq,
                password: this.new_password,
                status: this.new_status,
              }
              axios.post('/mediaBuy/add', userEntity, {
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
          }
        })
      },

      //编辑前的查询
      edit_before: function () {
        axios.get('/mediaBuy/findById', {
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
            this.edit_amID = res.data.data.amId;
            this.edit_bdID = res.data.data.bdId;
            this.edit_proxyID = res.data.data.tbProxyId;
            this.edit_jobTitle = res.data.data.jobTitle;
            this.edit_phone = res.data.data.phone;
            this.edit_qq = res.data.data.qq;
            this.edit_skype = res.data.data.skype;
            this.edit_password = res.data.data.password;
            this.edit_status = res.data.data.status;
          })
      },

      //编辑
      editOK: function () {
        let editobj = {
          id: this.current_id,
          name: this.edit_name,
          email: this.edit_email,
          amId: this.edit_amID,
          bdId: this.edit_bdID,
          tbProxyId: this.edit_proxyID,
          jobTitle: this.edit_jobTitle,
          tbUserId: this.current_userID,
          phone: this.edit_phone,
          qq: this.edit_qq,
          skype: this.edit_skype,
          password: this.edit_password,
          status: this.edit_status
        }
        axios.put('/mediaBuy/update', editobj, {
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
              axios.get('/mediaBuy/list', {
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
      //时间戳
      formatDate(time) {
        var date = new Date(time * 1000);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      },
      //状态
      formatStatus: function (val) {
        if (val == 1) {
          return 'Normal';
        }
        else if (val == 2) {
          return 'Blocked';
        }
        else if (val == 3) {
          return 'Pending';
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
</style>
