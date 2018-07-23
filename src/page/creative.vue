<template>
  <div>
    <current :current="'Creative Report'"></current>
    <div class="ibox float-e-margins animated fadeInRight">
      <div class="ibox-title">
        <h5>Creative Report</h5>
        <div class="ibox-tools">
         
        </div>
      </div>
      <div class="ibox-content">
        <!-- search -->
        <form class="form-inline" style="margin-bottom:20px" @submit.prevent="search()">
          <div class="form-group m-mgright10">
            <input type="text" class="form-control" placeholder="ID" v-model="keyword" style="width:150px">
          </div>          
        <div class="form-group m-mgright10">
            <el-select 
                v-model="label" 
                filterable
                multiple 
                collapse-tags
                placeholder="Label">
                <el-option
                    v-for="item in list_label"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </div>
            <div class="form-group m-mgright10" v-if="ifshow('creativeReport:status')">
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
            <div class="form-group m-mgright10">
                <el-date-picker
                    v-model="startTime"
                    value-format="timestamp"
                    type="daterange"
                    align="center"
                    unlink-panels
                    range-separator="-"
                    start-placeholder="start"
                    end-placeholder="end">
                </el-date-picker>
            </div>
          <div class="form-group">
            <button class="btn btn-primary" type="submit">{{$t("m.Btn.Search")}}</button>
          </div>
        </form>
        
        <!-- 复选框 -->
        <el-checkbox v-model="ifshow_roi" label="ROI"></el-checkbox>
        <el-checkbox v-model="ifshow_cvr" label="CVR"></el-checkbox>
        <el-checkbox v-model="ifshow_ctr" label="CTR"></el-checkbox>
        
        <!-- table -->
        <el-table
          class="table"
          :data="infoData"
          style="width: 100%"
          stripe=""
          sortable='custom'
          @sort-change="changeSort">
          <el-table-column prop="id" label="ID" sortable width="70"></el-table-column>
          <el-table-column prop="url" :label="$t('m.Form.Images')" sortable>
            <template slot-scope="scope">
              <div class="pic">
                <img :src=scope.row.url>
              </div>
            </template>
          </el-table-column>     
          <el-table-column prop="createTime" :label="$t('m.Form.CreateTime')" sortable>
            <template slot-scope="scope">
              {{ scope.row.createTime|formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="mediaBuyName" label="Mediabuyer" sortable v-if="ifshow('creativeReport:mediabuyer')"></el-table-column>
          <el-table-column prop="spend" :label="$t('m.Form.Spend')" sortable></el-table-column>
          <el-table-column prop="revenue" :label="$t('m.Form.Revenue')" sortable></el-table-column>
          <el-table-column prop="impressionCount" :label="$t('m.Form.Impressions')" sortable></el-table-column>
          <el-table-column prop="clickCount" :label="$t('m.Form.Clicks')" sortable></el-table-column>
          <el-table-column prop="roi" label="ROI" sortable v-if="ifshow_roi"></el-table-column>
          <el-table-column prop="cvr" label="CVR" sortable v-if="ifshow_cvr"></el-table-column>
          <el-table-column prop="ctr" label="CTR" sortable v-if="ifshow_ctr"></el-table-column>
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
        //过滤条件
        keyword: "", //关键字
        label:"", //标签名
        list_label:[],
        startTime:[], //时间
        statusID:1,
        status:[
            {
                id:1,
                name:"Normal"
            },
            {
                id:0,
                name:"Disabled"
            }
        ],

        //列表
        infoData: [],

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
          
        //复选框
        ifshow_roi:false,
        ifshow_cvr:false,
        ifshow_ctr:false,
      }
    },
    mounted: function () {
      //列表
      this.search();
        
        //加载标签
        axios.get('/label/list')
        .then(res => {
            this.list_label = res.data.data.list;
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
        var startTime = "";
        var endTime = "";
        if(this.startTime.length == 0){
            startTime = "";
            endTime = "";
        }
        else{
            startTime = this.startTime[0]/1000;
            endTime = this.startTime[1]/1000;
        }
        axios.get('/media/list', {
          headers: {
            Authorization: getCookie('token')
          },
          params: {
            rows: this.pageNumber, //每页数量
            orderBy: this.orderBy,  //字段
            page: this.currentPage,  //页
            orderType: this.orderType, //排序类型
            keyword: this.keyword,
            labelIds: this.label.join(','),
            startTime:startTime, //开始时间
            endTime:endTime, //结束时间
            status:this.statusID
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
      //时间戳
      formatDate(time) {
        var date = new Date(time * 1000);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .ibox-title h5 {
    line-height: 20px;
  }

  .float-e-margins .btn {
    margin-bottom: 0;
  }

  /* 图片 */
  .pic {
    width: 76px;
    height: 40px;
    background-color: #eee;
    overflow: hidden;
  }

  .pic img {
    width: 100%;
    height: 100%;
  }
</style>
