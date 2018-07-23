<template>
  <div>
    <current :current="'Label'"></current>
    <div class="ibox float-e-margins animated fadeInRight">
      <div class="ibox-title">
        <h5>{{$t("m.Label.Title")}}</h5>
        <div class="ibox-tools">
          <button 
              class="btn btn-primary btn-sm" 
              data-toggle="modal" 
              data-target="#myModal"
              @click="name=''"
              v-if="ifshow('label:create')">{{$t("m.Label.Create")}}
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
          sortable='custom'
          @sort-change="changeSort">
          <el-table-column prop="id" label="ID" sortable></el-table-column>
          <el-table-column prop="name" :label="$t('m.Form.Name')" sortable></el-table-column>
          <el-table-column prop="mediaBuyName" label="Mediabuyer" sortable></el-table-column>
          <el-table-column :label="$t('m.Form.Action')" v-if="ifshow('label:action')">
              <template slot-scope="scope">
                  <a href="#" 
                      @click="currend_id=scope.row.id" 
                      data-toggle="modal" 
                      data-target="#myModal_delete"
                      v-if="ifshow('label:delete')">
                      <i class="fa fa-trash"></i>
                  </a>
                  <a href="#" 
                      @click="currend_id=scope.row.id,edit_before()" 
                      data-toggle="modal"
                     data-target="#myModal_edit"
                     v-if="ifshow('label:edit')">
                     <i class="fa fa-edit" title="Edit" style="margin-left:10px"></i>
                  </a>
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
                  <button type="button" class="btn btn-primary" data-dismiss="modal" @click="del()">{{$t("m.Btn.Confirm")}}</button>
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
              <h4 class="modal-title" id="myModalLabel">{{$t("m.Label.New_title")}}</h4>
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
                        v-validate="'required|max:8'"
                        name="vee-empty"
                        v-model="name"
                        autocomplete="off"
                        @blur="check_new_email()">
                    <div class="tip" v-if="errors.first('vee-empty')">{{ errors.first('vee-empty') }}</div>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">{{$t("m.Btn.Cancel")}}</button>
              <button type="button" class="btn btn-primary" @click="add()">{{$t("m.Btn.Confirm")}}</button>
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
              <h4 class="modal-title" id="myModalLabel">{{$t("m.Label.Edit_title")}}</h4>
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
                        v-model="name">
                    <div class="tip" v-if="new_hint">{{$t("m.Msg.exist")}}</div>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" @click="editOK()">Confirm</button>
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
    inject: ['reload'], //注入依赖
    components: {
      "current": current
    },
    data() {
      return {
        //过滤条件
        keyword: "", //关键字
        typeID: "", //类型

        //列表
        infoData: [],

        name:"",
        descript:"",
        new_hint:"",
          
        //分页
        orderBy: 'id',
        orderType: 'desc',
        pageNumber: 25, //默认每页数量
        pageNumbers: [25, 50, 75, 100], //每页显示多少条
        currentPage: 1, //当前页
        dataTotal: 1, //数据总数

        //其他
        currend_id: "",
        permission: [], //权限
      }
    },
    mounted: function () {
      //列表
      this.search();

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
        axios.get('/label/list', {
          headers: {
            Authorization: getCookie('token')
          },
          params: {
            rows: this.pageNumber, //每页数量
            orderBy: this.orderBy,  //字段
            page: this.currentPage,  //页
            orderType: this.orderType, //排序类型
            keyword: this.keyword,
          }
        })
          .then(res => {
            this.infoData = res.data.data.list;
            this.dataTotal = res.data.data.total;
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
        
      //验证标签是否存在
      check_new_email: function () {
          axios.get('/label/findByName', {
              params: {
                name: this.name,
              }
          })
          .then(res => {
            if (res.data.status == 1) {
              this.new_hint = "";
            } else {
              this.new_hint = "already exist";
            }
          })
      },
        
      //创建
      add:function(){
        this.$validator.validateAll().then((result) => {
          if (result) {
            axios.post('/label/add',{
              name:this.name,
              status:1,
              description:""
            })
            .then(res => {
              if (res.data.status == 1) {
                $('#myModal').modal('toggle');
                this.$message({
                  message: this.$t("m.Msg.New_success"),
                  type: 'success',
                  duration: 1000
                });
                setTimeout(() => {
                  this.reload(); //刷新
                }, 1020)
              }
              else {
                this.$message({
                  message: this.$t("m.Msg.Failed"),
                  type: 'error',
                  duration: 1800
                });
              }
            })
            .catch(error=>{
                $('#myModal').modal('toggle');
                this.$message({
                  message: this.$t("m.Msg.exist"),
                  type: 'error',
                  duration: 1800
                });
            })
         }
        })
      },
        
      //查询
      edit_before: function () {
        axios.get('/label/findById', {
          params: {
            id: this.currend_id
          }
        })
          .then(res => {
            this.name = res.data.data.name;
          })
      },
        
        //编辑
        editOK:function(){
            axios.post('/label/update', {
                id:this.currend_id,
                name:this.name,
                status:1,
                description:this.descript
            })
            .then(res => {
                if (res.data.status == 1) {
                  $('#myModal_edit').modal('toggle');
                  this.$message({
                    message: this.$t("m.Msg.Delete_success"),
                    type: 'success',
                    duration: 1800
                  });
                  //重新刷新列表
                  axios.get('/label/list')
                    .then(res => {
                      if (res.data.status == 1) {
                        this.infoData = res.data.data.list;
                      }
                    })
                }else{
                    $('#myModal_edit').modal('toggle');
                      this.$message({
                        message: "already exist",
                        type: 'error',
                        duration: 1800
                      });
                }
            })
            .catch(error=>{
                $('#myModal_edit').modal('toggle');
                this.$message({
                  message: "already exist",
                  type: 'error',
                  duration: 1800
                });
            })
        },
        
        //删除
      del: function () {
        axios.delete('/label/delete', {
          params: {
            id: this.currend_id
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
              axios.get('/label/list')
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
    filters: {
      //状态
      formatStatus: function (val) {
        if (val == 1) {
          return 'normal';
        }
        else if (val == 2) {
          return 'blocked';
        }
        else if (val == 3) {
          return 'pending';
        }
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

  /* 图片 */
  .pic {
    width: 50px;
    height: 50px;
    background-color: #eee;
    overflow: hidden;
  }

  .pic img {
    width: 100%;
    height: 100%;
  }
</style>
