<template>
  <div>
    <current :current="'Menu'"></current>
    <div class="ibox float-e-margins animated fadeInRight">
      <div class="ibox-title">
        <h5>{{$t("m.Menu.Title")}}</h5>
        <div class="ibox-tools">
          <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#myModal">{{$t("m.Menu.Create")}}</button>
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
          <el-table-column prop="name" :label="$t('m.Form.Name')" sortable></el-table-column>
          <el-table-column prop="parentId" label="ParentID" sortable></el-table-column>
          <el-table-column prop="orderId" label="OrderID" sortable></el-table-column>
          <el-table-column prop="path" :label="$t('m.Form.Path')" sortable></el-table-column>
          <el-table-column prop="icon" :label="$t('m.Form.Icon')" sortable></el-table-column>
          <el-table-column label="Enabled">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                @change=change_switch(scope.row.id,scope.row.name,scope.row.path,scope.row.icon,scope.row.parentId,scope.row.orderId,scope.row.status)>
              </el-switch>
            </template>
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
          :page-size="5"
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
              <h4 class="modal-title" id="myModalLabel">{{$t("m.Menu.New_title")}}</h4>
            </div>
            <!-- 弹窗内容 -->
            <div class="modal-body">
              <form class="form-horizontal">
                <!-- name -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.Name")}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-validate="'required|max:16|min:2'" name="vee-name"
                           v-model="new_name">
                    <div v-if="errors.first('vee-name')" class="tip">{{ errors.first('vee-name') }}</div>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- parentID -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">ParentID</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-validate="'required|max:16|min:1|numeric'"
                           name="vee-parentID" v-model="new_parentID">
                    <div v-if="errors.first('vee-parentID')" class="tip">{{ errors.first('vee-parentID') }}</div>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- OrderID -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">OrderID</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-validate="'required|max:16|min:1|numeric'"
                           name="vee-orderID" v-model="new_orderID">
                    <div v-if="errors.first('vee-orderID')" class="tip">{{ errors.first('vee-orderID') }}</div>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- path -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.Path")}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-validate="'required|max:20|min:2'" name="vee-path"
                           v-model="new_path">
                    <div v-if="errors.first('vee-path')" class="tip">{{ errors.first('vee-path') }}</div>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- icon -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.Icon")}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-validate="'max:20'" name="vee-icon" v-model="new_icon">
                    <div v-if="errors.first('vee-icon')" class="tip">{{ errors.first('vee-icon') }}</div>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- status -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.Status")}}</label>
                  <div class="col-sm-10">
                    <select class="form-control" v-model="new_status">
                      <option value=1>normal</option>
                      <option value=0>blocked</option>
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
              <h4 class="modal-title" id="myModalLabel">{{$t("m.Menu.Edit_title")}}</h4>
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

                <!-- ParentID -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">ParentID</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="edit_parentID">
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- OrderID -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">OrderID</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="edit_orderID">
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- Path -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.Path")}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="edit_path">
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- Icon -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.Icon")}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="edit_icon">
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- status -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.Status")}}</label>
                  <div class="col-sm-10">
                    <select class="form-control" v-model="edit_status">
                      <option value="true">正常</option>
                      <option value="false">禁用</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">{{$t("m.Btn.Cancel")}}</button>
              <button type="button" class="btn btn-primary" @click="edit_submit()">{{$t("m.Btn.Confirm")}}</button>
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
        current_id: 0, //点击删除编辑时，获取当前ID
        new_path: "", //新建，路径
        new_icon: "", //新建，图标
        new_name: "", //新建，名字
        new_parentID: "", //新建，父级id
        new_orderID: "", //新建，排序id
        new_status: 1, //新建，状态
        edit_name: "", //编辑，名字
        edit_parentID: "", //编辑，父级id
        edit_orderID: "", //编辑，排序id
        edit_path: "", //编辑，路径
        edit_icon: "", //编辑，图标
        edit_status: "", //编辑，状态
        orderBy: 'id',
        orderType: 'desc',
        pageNumber: 25, //默认每页显示数量
        pageNumbers: [25, 50, 75, 100], //每页显示数量选择器
        currentPage: 1, //当前页
        dataTotal: 1, //数据总数
      }
    },
    mounted: function () {
      //列表
      this.search();
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
        axios.get('/menu/list', {
          headers: {
            Authorization: getCookie('token')
          },
          params: {
            keyword: this.keyword,
            rows: this.pageNumber, //每页数量
            orderBy: this.orderBy,  //字段
            page: this.currentPage,  //页
            orderType: this.orderType, //排序类型
            page: 1,  //当前页
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
        axios.delete('/menu/delete', {
          headers: {
            Authorization: getCookie('token')
          },
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
              axios.get('/menu/list', {
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
      change_switch: function (id, name, path, icon, parentId, orderId, status) {
        let ediStatus = {
          id: id,
          name: name,
          path: path,
          icon: icon,
          parentId: parentId,
          orderId: orderId,
          status: status
        }
        axios.put('/menu/update', ediStatus, {
          headers: {
            Authorization: getCookie('token'),
          },
        })
          .then(res => {
            if (res.data.status == 1) {
              this.$message({
                message: this.$t("m.Msg.Edit_success"),
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
      },

      //新建
      new_submit: function () {
        this.$validator.validateAll().then((result) => {
          if (result) {
            let userEntity = {
              name: this.new_name,
              parentId: this.new_parentID,
              orderId: this.new_orderID,
              path: this.new_path,
              icon: this.new_icon,
              status: this.new_status,
            }
            axios.post('/menu/add', userEntity, {
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
                  //重新刷新列表
                  axios.get('/menu/list', {
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
        axios.get('/menu/findById', {
          headers: { //token
            Authorization: getCookie('token')
          },
          params: {
            id: this.current_id
          }
        })
          .then(res => {
            this.edit_name = res.data.data.name;
            this.edit_parentID = res.data.data.parentId;
            this.edit_orderID = res.data.data.orderId;
            this.edit_path = res.data.data.path;
            this.edit_icon = res.data.data.icon;
            this.edit_status = res.data.data.status;
          })
      },

      //编辑
      edit_submit: function () {
        let editobj = {
          id: this.current_id,
          name: this.edit_name,
          parentId: this.edit_parentID,
          orderId: this.edit_orderID,
          path: this.edit_path,
          icon: this.edit_icon,
          status: this.edit_status
        }
        axios.put('/menu/update', editobj, {
          headers: {
            Authorization: getCookie('token'),
          },
        })
          .then(res => {
            console.log(res)
            if (res.data.status == 1) {
              $('#myModal_edit').modal('toggle');
              this.$message({
                message: this.$t("m.Msg.Edit_success"),
                type: 'success',
                duration: 1800
              });
              //重新刷新列表
              axios.get('/menu/list', {
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
        if (val == true) {
          return 'normal';
        }
        else if (val == false) {
          return 'blocked';
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
