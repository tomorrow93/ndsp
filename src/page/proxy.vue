<template>
  <div>
    <current :current="'Agent'"></current>
    <div class="ibox float-e-margins animated fadeInRight">
      <div class="ibox-title">
        <h5>{{$t("m.Agent.Title")}}</h5>
        <div class="ibox-tools">
          <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#myModal">{{$t("m.Agent.Create")}}</button>
        </div>
      </div>
      <div class="ibox-content">
        <!-- search -->
        <form class="form-inline" style="margin-bottom:20px" @submit.prevent="search()">
          <div class="form-group m-mgright10">
            <input type="text" class="form-control" placeholder="ID or Name" v-model="keyword" style="width:150px">
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
          <el-table-column prop="name" label="Name" sortable></el-table-column>
          <el-table-column prop="createTime" label="Create Time" sortable>
            <template slot-scope="scope">
              {{ scope.row.createTime|formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="Phone" sortable></el-table-column>
          <el-table-column prop="email" label="Email" sortable></el-table-column>
          <el-table-column prop="status" label="Status" sortable>
            <template slot-scope="scope">
              {{ scope.row.status|formatStatus }}
            </template>
          </el-table-column>
          <el-table-column label="Action">
            <template slot-scope="scope">
              <a href="#" @click="current_tbUserId=scope.row.tbUserId" data-toggle="modal"
                 data-target="#myModal_delete"><i class="fa fa-trash" title="Delete"></i></a>
              <a href="#" @click="current_id=scope.row.id,current_tbUserId=scope.row.tbUserId,edit_before()"
                 data-toggle="modal" data-target="#myModal_edit"><i class="fa fa-edit" title="Edit" style="margin-left:10px"></i></a>
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
              <h4 class="modal-title" id="myModalLabel">{{$t("m.Agent.New_title")}}</h4>
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
                           v-model="new_email" @blur="check_new_email()" autocomplete="off">
                    <div v-if="errors.first('vee-email')" class="tip">{{ errors.first('vee-email') }}</div>
                    <div class="tip" v-if="new_hint">{{new_hint}}</div>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- skype -->
                <div class="form-group">
                  <label class="col-sm-2 control-label"><i class="star">*</i>Skype</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-validate="'required'" name="vee-skype"
                           v-model="edit_skype" autocomplete="off">
                    <div v-if="errors.first('vee-jobTitle')" class="tip">{{ errors.first('vee-skype') }}</div>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- jobTitle -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.JobTitle")}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="edit_jobTitle" autocomplete="off">
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- phone -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.Phone")}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-validate="'numeric'" name="vee-numeric"
                           v-model="new_phone" autocomplete="off">
                    <div v-if="errors.first('vee-phone')" class="tip">{{ errors.first('vee-phone') }}</div>
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

                <!-- password -->
                <div class="form-group">
                  <label class="col-sm-2 control-label"><i class="star">*</i>{{$t("m.Form.Password")}}</label>
                  <div class="col-sm-10">
                    <input type="password" class="form-control" v-validate="'required|min:6|max:16'" name="vee-password"
                           v-model="new_password" autocomplete="off">
                    <div v-if="errors.first('vee-password')" class="tip">{{ errors.first('vee-password') }}</div>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- status -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.Status")}}</label>
                  <div class="col-sm-10">
                    <select class="form-control" v-model="new_status">
                      <option value=1>Normal</option>
                      <option value=2>Blocked</option>
                      <option value=3>Pending</option>
                    </select>
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
              <h4 class="modal-title" id="myModalLabel">{{$t("m.Agent.Edit_title")}}</h4>
            </div>
            <!-- 弹窗内容 -->
            <div class="modal-body">
              <form class="form-horizontal">
                <!-- name -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.Name")}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="edit_name" autocomplete="off">
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

                <!-- skype -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">Skype</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="edit_skype" autocomplete="off">
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- jobTitle -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.JobTitle")}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="edit_jobTitle" autocomplete="off">
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- phone -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.Phone")}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="edit_phone" autocomplete="off">
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- qq -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">QQ</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="edit_qq" autocomplete="off">
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- password -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.Password")}}</label>
                  <div class="col-sm-10">
                    <input type="password" class="form-control" v-model="edit_password" autocomplete="off">
                  </div>
                </div>
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
        infoData: [],
        keyword: "", //搜索关键字
        current_id: 0, //点击编辑，获取当前ID
        current_tbUserId: "", //编辑，获取当前UserID
        new_hint: "", //新建，邮箱已存在
        new_jobTitle: "", //新建，职称
        new_qq: "", //新建，QQ
        new_skype: "", //新建，skype
        new_name: "", //新建，名字
        new_email: "", //新建，邮箱
        new_phone: "", //新建，手机号
        new_password: "", //新建，密码
        new_status: 1, //新建，状态
        edit_name: "", //编辑，名字
        edit_phone: "", //编辑，手机号
        edit_jobTitle: "", //编辑，职称
        edit_qq: "", //编辑，QQ
        edit_skype: "", //编辑，skype
        edit_status: 1, //编辑，状态
        edit_email: "", //编辑，邮箱
        edit_password: "", //编辑，密码
        orderBy: 'id',
        orderType: 'desc',
        pageNumber: 25, //默认每页数量
        pageNumbers: [25, 50, 75, 100], //每页显示多少条
        currentPage: 1, //当前页
        dataTotal: 1, //数据总数
      }
    },
    mounted: function () {
      //列表
      this.search()
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
        axios.get('/proxy/list', {
          headers: {
            Authorization: getCookie('token')
          },
          params: {
            rows: this.pageNumber, //每页数量
            orderBy: this.orderBy,  //字段
            page: this.currentPage,  //页
            orderType: this.orderType, //排序类型
            keyword: this.keyword
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
        axios.delete('/proxy/delete', {
          headers: {
            Authorization: getCookie('token')
          },
          params: {
            id: this.current_tbUserId
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
              axios.get('/proxy/list', {
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

      //验证邮箱是否存在
      check_new_email: function () {
        axios.get('/account/findByEmail', {
          headers: {
            Authorization: getCookie('token'),
          },
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

      //新建
      new_submit: function () {
        this.$validator.validateAll().then((result) => {
          if (result) {
            if (this.new_hint == "") {
              let userEntity = {
                name: this.new_name,
                email: this.new_email,
                jobTitle: this.new_jobTitle,
                phone: this.new_phone,
                qq: this.new_qq,
                skype: this.new_qq,
                password: this.new_password,
                status: this.new_status,
                tbUserId: "",
              }
              axios.post('/proxy/add', userEntity, {
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
        axios.get('/proxy/findById', {
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
          jobTitle: this.edit_jobTitle,
          phone: this.edit_phone,
          qq: this.edit_qq,
          skype: this.edit_skype,
          tbUserId: this.current_tbUserId,
          password: this.edit_password,
          status: this.edit_status
        }
        axios.put('/proxy/update', editobj, {
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
              axios.get('/proxy/list', {
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
      }
    },
    filters: {
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
