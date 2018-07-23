<template>
  <div>
    <current :current="'Account'"></current>
    <div class="ibox float-e-margins animated fadeInRight">
      <div class="ibox-title">
        <h5>{{$t("m.Account.Title")}}</h5>
        <div class="ibox-tools">
          <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#myModal">{{$t("m.Account.Create")}}</button>
        </div>
      </div>
      <div class="ibox-content">
        <!-- search -->
        <form class="form-inline" style="margin-bottom:20px" @submit.prevent="search()">
          <div class="form-group m-mgright">
            <input type="text" class="form-control" placeholder="ID or Name" v-model="keyword" style="width:150px">
          </div>
          <div class="form-group m-mgright">
            <el-select v-model="roleID" :placeholder="$t('m.Form.Role')" style="width:150px">
              <el-option value="">All</el-option>
              <el-option
                v-for="roleList in roles"
                :key="roleList.value"
                :label="roleList.name"
                :value="roleList.id">
              </el-option>
            </el-select>
          </div>
          <div class="form-group m-mgright10">
            <el-select v-model="statusID" :placeholder="$t('m.Form.Status')" style="width:150px">
              <el-option value="">All</el-option>
              <el-option
                v-for="statusList in status"
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
          <el-table-column prop="id" label="ID" sortable width="120"></el-table-column>
          <el-table-column prop="name" :label="$t('m.Form.Name')" sortable></el-table-column>
          <el-table-column prop="email" :label="$t('m.Form.Email')" sortable></el-table-column>
          <el-table-column prop="roleName" :label="$t('m.Form.Role')"></el-table-column>
          <el-table-column prop="status" :label="$t('m.Form.Status')" sortable>
            <template slot-scope="scope">{{ scope.row.status|statusFormat }}</template>
          </el-table-column>
          <el-table-column :label="$t('m.Form.Action')">
            <template slot-scope="scope">
              <a href="#" @click="current_id=scope.row.id" data-toggle="modal" data-target="#myModal_delete"><i
                class="fa fa-trash" title="Delete"></i></a>
              <a href="#" @click="current_id=scope.row.id,edit_before()" data-toggle="modal"
                 data-target="#myModal_edit"><i class="fa fa-edit" title="Edit" style="margin-left:10px"></i></a>
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

      <!-- 新建账号 -->
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
                  <label class="col-sm-2 control-label"><i class="star">*</i>{{$t("m.Form.Name")}}</label>
                  <div class="col-sm-10">
                    <input
                        type="text"
                        class="form-control"
                        v-validate="'required|min:2|max:16'"
                        name="vee-empty"
                        v-model="name"
                        autocomplete="off">
                    <div class="tip" v-if="errors.first('vee-empty')">{{ errors.first('vee-empty') }}</div>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- email -->
                <div class="form-group">
                  <label class="col-sm-2 control-label"><i class="star">*</i>{{$t("m.Form.Email")}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-validate="'required|email'" name="vee-email"
                           v-model="email" @blur="check_new_email()" autocomplete="off">
                    <div class="tip" v-if="errors.first('vee-email')">{{ errors.first('vee-email') }}</div>
                    <div class="tip" v-if="new_hint">{{new_hint}}</div>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- password -->
                <div class="form-group">
                  <label class="col-sm-2 control-label"><i class="star">*</i>{{$t("m.Form.Password")}}</label>
                  <div class="col-sm-10">
                    <input type="password" class="form-control" v-validate="'required|min:6|max:16'" name="vee-password"
                           v-model="password" autocomplete="off">
                    <div class="tip" v-if="errors.first('vee-password')">{{ errors.first('vee-password') }}</div>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- Role -->
                <div class="form-group">
                  <label class="col-sm-2 control-label"><i class="star">*</i>{{$t("m.Form.Role")}}</label>
                  <div class="col-sm-10">
                    <select class="form-control" name="role" v-model="role">
                      <option v-for="roleList in roles" :value="roleList.id" v-if="roleList.id != 5 & roleList.id !=6">
                        {{roleList.name}}
                      </option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">{{$t("m.Btn.Cancel")}}</button>
              <button type="button" class="btn btn-primary" @click="addAccount()">{{$t("m.Btn.Confirm")}}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 删除 -->
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
              <button type="button" class="btn btn-primary" data-dismiss="modal" @click="del(current_id)">{{$t("m.Btn.Confirm")}}</button>
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
              <h4 class="modal-title" id="myModalLabel">{{$t("m.Account.Edit_title")}}</h4>
            </div>
            <!-- 弹窗内容 -->
            <div class="modal-body">
              <form class="form-horizontal">
                <!-- name -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.Name")}}</label>
                  <div class="col-sm-10">
                    <input
                        type="text"
                        class="form-control"
                        v-model="editName">
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- email -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.Email")}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="editEmail" disabled>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- password -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.Password")}}</label>
                  <div class="col-sm-10">
                    <input type="password" class="form-control" v-model="newPsw">
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- status -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.Status")}}</label>
                  <div class="col-sm-10">
                    <select class="form-control" v-model="selected_status">
                      <option value=1>Normal</option>
                      <option value=2>Blocked</option>
                      <option value=3>Pending</option>
                    </select>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- role -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.Role")}}</label>
                  <div class="col-sm-10">
                    <select class="form-control" v-model="selectRoleId">
                      <option v-for="roleList in roles" :value="roleList.id" v-if="roleList.id != 5 & roleList.id !=6">
                        {{roleList.name}}
                      </option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" @click="editOK(current_id)">Confirm</button>
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
        infoData: [],  //后台获取的数据
        state: "",  //状态码
        //新建账号
        name: "",
        email: "",
        password: "",
        new_hint: "", //新建，邮箱已存在
        role: 1, //选中了哪个角色
        roles: [], //角色列表
        roleID: "", //搜素时选中的id
        statusID: "", //状态ID
        keyword: "", //搜索关键字
        current_id: 0, //删除编辑ID
        editName: "", //编辑名字
        editEmail: "", //编辑邮箱
        newPsw: "", //编辑新密码
        selected_status: 1, //编辑状态
        selectRoleId: 1, //编辑角色id
        orderBy: 'id',
        orderType: 'desc',
        pageNumber: 25, //默认每页数量
        pageNumbers: [25, 50, 75, 100], //每页显示多少条
        currentPage: 1, //当前页
        dataTotal: 1, //数据总数
        status: [
          {
            id: 1,
            name: "Normal"
          },
          {
            id: 2,
            name: "Blocked"
          },
          {
            id: 3,
            name: "Pending"
          }
        ],
        permission: [], //权限
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

      //验证邮箱是否存在
      check_new_email: function () {
        axios.get('/account/findByEmail', {
          params: {
            email: this.email,
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

      //新建账号
      addAccount: function () {
        this.$validator.validateAll().then((result) => {
          if (result) {
            if (this.new_hint == "") {
              let userEntity = {
                name: this.name,
                email: this.email,
                password: this.password,
                status: 1,
                roleId: this.role
              }
              axios.post('/account/add', userEntity)
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

      //编辑前查询
      edit_before: function () {
        axios.get('/account/findById', {
          params: {
            id: this.current_id
          }
        })
          .then(res => {
            this.editName = res.data.data.name;
            this.editEmail = res.data.data.email;
            this.newPsw = res.data.data.password;
            this.selected_status = res.data.data.status;
            this.selectRoleId = res.data.data.roleId;
          })
      },

      //编辑账号
      editOK: function (id) {
        let newUsername = {
          name: this.editName,
          email: this.editEmail,
          password: this.newPsw,
          status: this.selected_status,
          id: id,
          roleId: this.selectRoleId
        }
        axios.put('/account/update', newUsername)
          .then(res => {
            if (res.data.status == 1) {
              $('#myModal_edit').modal('toggle');
              this.$message({
                message: this.$t("m.Msg.Edit_success"),
                type: 'success',
                duration: 1800
              });
              //重新刷新列表
              axios.get('/account/list')
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

      //搜索
      search: function () {
        axios.get('/account/list', {

          params: {
            rows: this.pageNumber, //每页数量
            orderBy: this.orderBy,  //字段
            page: this.currentPage,  //页
            orderType: this.orderType, //排序类型
            keyword: this.keyword, //关键字
            roleId: this.roleID, //角色id
            status: this.statusID, //状态

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
      del: function (current_id) {
        axios.delete('/account/delete', {
          params: {
            id: current_id
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
              axios.get('/account/list')
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
      }
    },
    mounted: function () {
      //账号列表
      this.search();

      //角色列表（新建账号用到）
      axios.get('/role/list')
        .then(res => {
          if (res.data.status == 1) {
            this.roles = res.data.data.list;
          }
        })
    },
    //过滤器
    filters: {
      statusFormat: value=> {
        if (value == 1) {
          return 'Normal'
          //return this.$t("m.Account.title");
        }
        else if (value == 2) {
          return 'Blocked';
        }
        else if (value == 3) {
          return 'Pending';
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* 弹出框按钮对齐 */
  .float-e-margins .btn {
    margin-bottom: 5px;
  }
</style>
