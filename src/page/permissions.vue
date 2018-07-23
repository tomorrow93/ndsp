<template>
  <div>
    <current :current="'Permissions'"></current>
    <div class="ibox float-e-margins animated fadeInRight">
      <div class="ibox-title">
        <h5>{{$t("m.Permissions.Title")}}</h5>
        <div class="ibox-tools">
          <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#myModal">{{$t("m.Permissions.Create")}}</button>
        </div>
      </div>
      <div class="ibox-content">
        <!-- search -->
        <form class="form-inline" style="margin-bottom:20px" @submit.prevent="search()">
          <div class="form-group m-mgright">
            <input type="text" class="form-control" placeholder="ID or Name" v-model="keyword" style="width:150px">
          </div>
          <div class="form-group m-mgright10">
            <el-select v-model="typeID" placeholder="Type" style="width:150px">
              <el-option value="">All</el-option>
              <el-option value=1 label="接口权限"></el-option>
              <el-option value=2 label="报表权限"></el-option>
              <el-option value=3 label="粒度权限"></el-option>
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
          stripe
          sortable='custom'
          @sort-change="changeSort">
          <el-table-column prop="id" label="ID" sortable width="80"></el-table-column>
          <el-table-column prop="name" :label="$t('m.Form.Name')" sortable></el-table-column>
          <el-table-column prop="path" :label="$t('m.Form.Path')" sortable></el-table-column>
          <el-table-column prop="description" :label="$t('m.Form.Description')" sortable></el-table-column>
          <el-table-column prop="type" :label="$t('m.Form.Type')" sortable>
            <template slot-scope="scope">{{ scope.row.type|typeFormat}}</template>
          </el-table-column>
          <el-table-column prop="status" :label="$t('m.Form.Status')" sortable>
            <template slot-scope="scope">{{ scope.row.status|statusFormat}}</template>
          </el-table-column>
          <el-table-column label="Action">
            <template slot-scope="scope">
              <a href="#" @click="del_id=scope.row.id" data-toggle="modal" data-target="#myModal_delete"><i
                class="fa fa-trash" title="Delete"></i></a>
              <a href="#" @click="edit_id=scope.row.id,edit_path=scope.row.path,loadData(),edit_before()"
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
          :page-size="5"
          :page-sizes="pageNumbers"
          :total="dataTotal">
        </el-pagination>
      </div>

      <!-- 删除 -->
      <div class="modal fade" id="myModal_delete" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
              </button>
              <h4 class="modal-title" id="myModalLabel">{{$t('m.Msg.Hint')}}</h4>
            </div>
            <!-- 弹窗内容 -->
            <div class="modal-body">
              {{$t('m.Msg.Delete')}}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">{{$t('m.Btn.Cancel')}}</button>
              <button type="button" class="btn btn-primary" data-dismiss="modal" @click="del()">{{$t('m.Btn.Confirm')}}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 新建 -->
      <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
              </button>
              <h4 class="modal-title" id="myModalLabel">{{$t('m.Permissions.New_title')}}</h4>
            </div>
            <!-- 弹窗内容 -->
            <div class="modal-body">
              <form class="form-horizontal">
                <!-- name -->
                <div class="form-group">
                  <label class="col-sm-2 control-label"><i class="star">*</i>{{$t('m.Form.Name')}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-validate="'required|min:2|max:25'" name="vee-empty"
                           v-model="new_name">
                    <div class="tip" v-if="errors.first('vee-empty')">{{ errors.first('vee-empty') }}</div>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- Description -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t('m.Form.Description')}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-validate="'max:20'" name="vee-description"
                           v-model="new_description">
                    <div class="tip" v-if="errors.first('vee-description')">{{ errors.first('vee-description') }}</div>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- path -->
                <div class="form-group">
                  <label class="col-sm-2 control-label"><i class="star">*</i>{{$t('m.Form.Path')}}</label>
                  <div class="col-sm-10 form-inline">
                    <div class="form-group m-group">
                      <input type="text" class="form-control" v-validate="'required|min:2|max:16'" name="vee-one"
                             onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ ]/g,'')"
                             onpaste="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ ]/g,'')"
                             oncontextmenu="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ ]/g,'')"
                             v-model="new_path1">
                    </div>
                    <div class="form-group m-group">
                      <input type="text" class="form-control" v-validate="'required|min:2|max:16'" name="vee-two"
                             onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ ]/g,'')"
                             onpaste="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ ]/g,'')"
                             oncontextmenu="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ ]/g,'')"
                             v-model="new_path2">
                    </div>
                    <div class="tip" v-if="errors.first('vee-one')">{{ errors.first('vee-one') }}</div>
                    <div class="tip" v-if="errors.first('vee-two')">{{ errors.first('vee-two') }}</div>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- type -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t('m.Form.Type')}}</label>
                  <div class="col-sm-10">
                    <select class="form-control" v-model="new_type">
                      <option value=1>接口权限</option>
                      <option value=2>报表权限</option>
                      <option value=3>粒度权限</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">{{$t('m.Btn.Cancel')}}</button>
              <button type="button" class="btn btn-primary" @click="addPermission()">{{$t('m.Btn.Confirm')}}</button>
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
              <h4 class="modal-title" id="myModalLabel">{{$t('m.Permissions.Edit_title')}}</h4>
            </div>
            <!-- 弹窗内容 -->
            <div class="modal-body">
              <form class="form-horizontal">
                <!-- name -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t('m.Form.Name')}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="edit_name">
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- description -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t('m.Form.Description')}}</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="edit_description">
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- path -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">Path</label>
                  <div class="col-sm-10 form-inline">
                    <div class="form-group m-group">
                      <input type="text" class="form-control"
                             onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ ]/g,'')"
                             onpaste="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ ]/g,'')"
                             oncontextmenu="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ ]/g,'')"
                             v-model="edit_path1">
                    </div>
                    <div class="form-group m-group">
                      <input type="text" class="form-control"
                             onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ ]/g,'')"
                             onpaste="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ ]/g,'')"
                             oncontextmenu="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ ]/g,'')"
                             v-model="edit_path2">
                    </div>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- type -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t('m.Form.Type')}}</label>
                  <div class="col-sm-10">
                    <select class="form-control" v-model="edit_type">
                      <option value=1>接口权限</option>
                      <option value=2>权限接口</option>
                      <option value=3>粒度接口</option>
                    </select>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>

                <!-- status -->
                <div class="form-group">
                  <label class="col-sm-2 control-label">{{$t('m.Form.Status')}}</label>
                  <div class="col-sm-10">
                    <select class="form-control" v-model="edit_status">
                      <option value=1>normal</option>
                      <option value=0>blocked</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">{{$t('m.Btn.Cancel')}}</button>
              <button type="button" class="btn btn-primary" @click="editOK()">{{$t('m.Btn.Confirm')}}</button>
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

  export default {
    inject: ['reload'], //注入依赖，刷新当前页用
    components: {
      "current": current
    },
    data() {
      return {
        infoData: [],  //后台获取的数据
        keyword: "", //搜索关键字
        orderBy: 'id',
        orderType: 'desc',
        pageNumber: 25, //默认每页25条信息
        pageNumbers: [25, 50, 75, 100], //每页显示多少条
        currentPage: 1, //当前页
        dataTotal: 1, //数据总数
        new_name: "", //创建权限，名字
        new_description: "", //创建权限，路径
        new_path1: "",
        new_path2: "",
        new_type: 1, //权限类型
        del_id: "", //删除id
        edit_id: "", //编辑id
        edit_name: "", //编辑名字
        edit_description: "", //编辑描述
        edit_path: "",
        edit_path1: "",
        edit_path2: "",
        edit_status: "", //编辑状态
        edit_type: 1,//编辑，类型ID
        typeID: "", //过滤类型
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
        axios.get('/permission/list', {
          headers: {
            Authorization: getCookie('token')
          },
          params: {
            rows: this.pageNumber, //每页数量
            orderBy: this.orderBy,  //字段
            page: this.currentPage,  //页
            orderType: this.orderType, //排序类型
            keyword: this.keyword,
            type: this.typeID,
          }
        })
          .then(res => {
            if (res.data.status == 1) {
              this.infoData = res.data.data.list;
              this.dataTotal = res.data.data.total;
            }
            //reset
            this.orderBy = 'id';
            this.orderType = 'desc';
          })
      },

      //新建
      addPermission: function () {
        this.$validator.validateAll().then((result) => {
          if (result) {
            var finalPath = this.new_path1 + ":" + this.new_path2;
            let permissionEntity = {
              name: this.new_name,
              path: finalPath,
              description: this.new_description,
              type: this.new_type,
              status: 1
            }
            axios.post('/permission/add', permissionEntity, {
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

      //删除
      del: function () {
        axios.delete('/permission/delete', {
          headers: {
            Authorization: getCookie('token')
          },
          params: {
            id: this.del_id
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
              axios.get('/permission/list', {
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

      //打开编辑时，加载path数据
      loadData: function () {
        //拆分path
        var str = this.edit_path;
        var arr = str.split(":");
        this.edit_path1 = arr[0];
        this.edit_path2 = arr[1];
      },

      //编辑前加载信息
      edit_before: function () {
        axios.get('/permission/findById', {
          headers: { //token
            Authorization: getCookie('token')
          },
          params: {
            id: this.edit_id
          }
        })
          .then(res => {
            this.edit_name = res.data.data.name;
            this.edit_type = res.data.data.type;
            this.edit_status = res.data.data.status;
            this.edit_description = res.data.data.description;
          })
      },

      //编辑
      editOK: function () {
        let editEntity = {
          id: this.edit_id,
          name: this.edit_name,
          path: this.edit_path1 + ":" + this.edit_path2,
          description: this.edit_description,
          type: this.edit_type,
          status: this.edit_status,
        }
        axios.put('/permission/update', editEntity, {
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
              axios.get('/permission/list', {
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
    mounted: function () {
      //权限列表
      this.search();
    },
    //过滤器
    filters: {
      statusFormat: function (value) {
        if (value == 1) {
          return 'Normal';
        }
        else if (value == 0) {
          return 'Blocked';
        }
      },
      typeFormat: function (value) {
        if (value == 1) {
          return '接口权限';
        }
        else if (value == 2) {
          return '报表权限';
        }
        else if (value == 3) {
          return '粒度权限';
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

  /* 新建权限表格对其 */
  .m-group {
    margin-left: 0;
  }

  .m-group input {
    width: 150px;
  }
</style>
