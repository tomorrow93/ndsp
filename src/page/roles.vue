<template>
  <div>
    <current :current="'Roles'"></current>
    <div class="ibox float-e-margins animated fadeInRight">
      <div class="ibox-title">
        <h5>{{$t("m.Role.Title")}}</h5>
        <div class="ibox-tools">
          <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#myModal" @click="loadPermission()">
            {{$t("m.Role.Create")}}
          </button>
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
          sortable='custom'>
          <el-table-column prop="id" label="ID" sortable></el-table-column>
          <el-table-column prop="name" :label="$t('m.Form.Name')" sortable></el-table-column>
          <el-table-column prop="createTime" :label="$t('m.Form.CreateTime')" sortable>
            <template slot-scope="scope">
              {{ scope.row.createTime|formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="status" :label="$t('m.Form.Status')" sortable>
            <template slot-scope="scope">
              {{ scope.row.status|formatStatus }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('m.Form.Action')">
            <template slot-scope="scope">
              <a href="#" @click="current_id=scope.row.id" data-toggle="modal" data-target="#myModal_delete"><i
                class="fa fa-trash" title="Delete"></i></a>
              <a href="#" @click="current_id=scope.row.id,loadTree()" data-toggle="modal" data-target="#myModal_edit"><i
                class="fa fa-edit" title="Edit" style="margin-left:10px"></i></a>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 新建 -->
      <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
              </button>
              <h4 class="modal-title" id="myModalLabel">{{$t("m.Role.New_title")}}</h4>
            </div>
            <!-- 弹窗内容 -->
            <div class="modal-body">
              <form class="form-horizontal">
                <!-- name -->
                <div class="form-group">
                  <label class="col-sm-2 control-label"><i class="star">*</i>{{$t("m.Form.Name")}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-validate="'required|max:16|min:2'" name="vee-name"
                           v-model="new_name">
                    <div v-if="errors.first('vee-name')" class="tip">{{ errors.first('vee-name') }}</div>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- status -->
                <div class="form-group">
                  <label class="col-sm-2 control-label"><i class="star">*</i>{{$t("m.Form.Status")}}</label>
                  <div class="col-sm-10">
                    <select class="form-control" v-model="new_status">
                      <option value=1>normal</option>
                      <option value=0>blocked</option>
                    </select>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- 权限-->
                <el-tabs tab-position="left">
                  <el-tab-pane label="接口权限">
                    <el-tree
                      :data="data2"
                      show-checkbox
                      node-key="id"
                      ref="tree"
                      :default-checked-keys="checkedId"
                      :props="defaultProps">
                    </el-tree>
                  </el-tab-pane>
                  <el-tab-pane label="粒度权限">
                    <el-tree
                      :data="new_lidu_data"
                      show-checkbox
                      node-key="id"
                      ref="tree_newLidu"
                      :default-checked-keys="new_lidu_checked"
                      :props="defaultProps">
                    </el-tree>
                  </el-tab-pane>
                  <el-tab-pane label="菜单权限">
                    <el-tree
                      :data="new_data"
                      show-checkbox
                      node-key="id"
                      ref="tree_newMenu"
                      :default-checked-keys="new_checked"
                      :props="defaultProps">
                    </el-tree>
                  </el-tab-pane>
                </el-tabs>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">{{$t("m.Btn.Cancel")}}</button>
              <button type="button" class="btn btn-primary" @click="newRole()">{{$t("m.Btn.Confirm")}}</button>
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
              <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" data-dismiss="modal" @click="del(current_id,delIndex)">Confirm
              </button>
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
              <h4 class="modal-title" id="myModalLabel">{{$t("m.Role.Edit_title")}}</h4>
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

                <!-- Status -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t("m.Form.Status")}}</label>
                  <div class="col-sm-10">
                    <select class="form-control" v-model="edit_status">
                      <option value=1>Normal</option>
                      <option value=0>Blocked</option>
                    </select>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- 权限 -->
                <el-tabs tab-position="left">
                  <el-tab-pane label="接口权限">
                    <el-tree
                      :data="edit_treeData"
                      show-checkbox
                      node-key="id"
                      ref="tree_editJk"
                      :default-checked-keys="edit_checkTree"
                      :props="defaultProps">
                    </el-tree>
                  </el-tab-pane>
                  <el-tab-pane label="粒度权限">
                    <el-tree
                      :data="edit_lidu_treeData"
                      show-checkbox
                      node-key="id"
                      ref="tree_lidu_editJk"
                      :default-checked-keys="edit_lidu_checkTree"
                      :props="defaultProps">
                    </el-tree>
                  </el-tab-pane>
                  <el-tab-pane label="菜单权限">
                    <el-tree
                      :data="edit_data"
                      show-checkbox
                      node-key="id"
                      ref="tree_editMenu"
                      :default-checked-keys="edit_checked"
                      :props="defaultProps">
                    </el-tree>
                  </el-tab-pane>
                </el-tabs>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">{{$t("m.Btn.Cancel")}}</button>
              <button type="button" class="btn btn-primary" data-dismiss="modal" @click="editOK()">{{$t("m.Btn.Confirm")}}</button>
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
        current_id: 0, //删除编辑ID
        delIndex: 0, //删除后刷新
        new_status: 1, //新建角色，状态
        new_name: "", //新建角色，名字
        data2: [], //新建角色，接口权限树
        checkedId: [], //接口权限树，选中的id
        new_data: [], //新建角色，菜单权限树
        new_checked: [], //接口权限树，选中的id
        new_lidu_data: [], //新建角色，粒度权限树
        new_lidu_checked: [], //粒度权限树，选中的id
        defaultProps: { //tree控件配置
          children: 'children',
          label: 'name'
        },
        edit_name: "", //编辑角色，名字
        edit_status: "", //编辑角色，状态
        edit_checkTree: [], //编辑角色，获取接口权限树(选中id)
        edit_treeData: [], //编辑角色，接口权限树信息

        edit_data: [], //编辑角色，菜单接口信息
        edit_checked: [], //编辑角色，菜单接口选中id

        edit_lidu_treeData: [], //编辑，粒度权限信息
        edit_lidu_checkTree: [], //编辑，获取粒度权限树(选中id)
      }
    },
    mounted: function () {
      //角色列表advertiser/list
      this.search();
    },
    methods: {
      //新建前清除数据
      clearData: function () {
        this.new_name = ""
      },

      //搜索
      search: function () {
        axios.get('/role/list', {
          headers: {
            Authorization: getCookie('token')
          },
          params: {
            keyword: this.keyword
          }
        })
          .then(res => {
            this.infoData = res.data.data.list;
            this.dataTotal = res.data.data.total;
          })
      },

      //删除
      del: function (current_id, n) {
        axios.delete('/role/delete', {
          headers: {
            Authorization: getCookie('token')
          },
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
              axios.get('/role/list', {
                headers: { //token
                  Authorization: getCookie('token')
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

      //新建时，加载权限树
      loadPermission: function () {
        //接口权限树
        axios.get('/role/getPermissionsTree', {
          headers: {
            Authorization: getCookie('token')
          },
          params: {
            roleId: 1,
            type: 1
          }
        })
          .then(res => {
            this.data2 = res.data.data.tree;
            this.checkedId = res.data.data.checkedIds;
          })

        //粒度权限树
        axios.get('/role/getPermissionsTree', {
          headers: {
            Authorization: getCookie('token')
          },
          params: {
            roleId: 1,
            type: 3
          }
        })
          .then(res => {
            this.new_lidu_data = res.data.data.tree;
            this.new_lidu_checked = res.data.data.checkedIds;
          })

        //菜单权限树
        axios.get('/role/getMenuTree', {
          headers: {
            Authorization: getCookie('token')
          },
          params: {
            roleId: 1
          }
        })
          .then(res => {
            this.new_data = res.data.data.trees;
            this.new_checked = res.data.data.checkIds;
          })
      },

      //新建
      newRole: function () {
        //表单验证成功
        this.$validator.validateAll().then((result) => {
          if (result) {
            //合并数组
            var arr_jiekou = this.$refs.tree.getCheckedKeys(); //接口权限，选中了哪些
            var arr_lidu = this.$refs.tree_newLidu.getCheckedKeys(); //粒度权限，选中了哪些
            var result = arr_jiekou.concat(arr_lidu);
            let roleEntity = {
              name: this.new_name,
              permissionIds: result,
              menuIds: this.$refs.tree_newMenu.getCheckedKeys(),
              status: this.new_status
            }
            axios.post('/role/add', roleEntity, {
              headers: {
                Authorization: getCookie('token')
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
        });
      },

      //编辑前，加载权限树
      loadTree: function () {
        //接口权限
        axios.get('/role/getPermissionsTree', {
          headers: { //token
            Authorization: getCookie('token')
          },
          params: {
            roleId: this.current_id,
            type: 1
          }
        })
          .then(res => {
            this.edit_treeData = res.data.data.tree;
            this.edit_checkTree = res.data.data.checkedIds;
          })

        //粒度权限
        axios.get('/role/getPermissionsTree', {
          headers: { //token
            Authorization: getCookie('token')
          },
          params: {
            roleId: this.current_id,
            type: 3
          }
        })
          .then(res => {
            this.edit_lidu_treeData = res.data.data.tree;
            this.edit_lidu_checkTree = res.data.data.checkedIds;
          })

        //菜单权限
        axios.get('/role/getMenuTree', {
          headers: {
            Authorization: getCookie('token')
          },
          params: {
            roleId: this.current_id
          }
        })
          .then(res => {
            this.edit_data = res.data.data.trees;
            this.edit_checked = res.data.data.checkIds;
          })

        //查询信息
        axios.get('/role/findById', {
          headers: { //token
            Authorization: getCookie('token')
          },
          params: {
            id: this.current_id
          }
        })
          .then(res => {
            this.edit_name = res.data.data.name;
            this.edit_status = res.data.data.status;
          })
      },

      //编辑
      editOK: function () {
        //合并数组
        var arr_jiekou = this.$refs.tree_editJk.getCheckedKeys(); //接口权限，选中了哪些
        var arr_lidu = this.$refs.tree_lidu_editJk.getCheckedKeys(); //粒度权限，选中了哪些
        var result = arr_jiekou.concat(arr_lidu);
        let oEdit = {
          id: this.current_id,
          name: this.edit_name,
          permissionIds: result,
          menuIds: this.$refs.tree_editMenu.getCheckedKeys(),
          status: this.edit_status
        }
        axios.put('/role/update', oEdit, {
          headers: { //token
            Authorization: getCookie('token')
          },
        })
          .then(res => {
            if (res.data.status == 1) {
              this.$message({
                message: this.$t("m.Msg.Edit_success"),
                type: 'success',
                duration: 1800
              });
              //重新刷新列表
              axios.get('/role/list', {
                headers: { //token
                  Authorization: getCookie('token')
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
      }
    },
    filters: {
      //时间戳
      formatDate(time) {
        var date = new Date(time * 1000);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      },

      //状态
      formatStatus: function (val) {
        if (val == 1) {
          return 'Normal';
        }
        else if (val == 0) {
          return 'Blocked';
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
