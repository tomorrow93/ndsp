<template>
  <div>
    <current :current="'Overall Report'"></current>
    <div class="ibox float-e-margins animated fadeInRight">
      <div class="ibox-title">
        <h5>Overall Report</h5>
      </div>
      <div class="ibox-content">
        <!-- search -->
        <form class="form-inline" style="margin-bottom:20px" @submit.prevent="search()">

          <el-date-picker
            v-model="select_date"
            value-format="timestamp"
            type="daterange"
            align="center"
            unlink-panels
            range-separator="-"
            start-placeholder="start"
            end-placeholder="end"
            :picker-options="pickerOptions">
          </el-date-picker>

          <div class="form-group">
            <button class="btn btn-primary m-mgleft10" type="submit">Search</button>
          </div>

          <!--<label class="control-label">Dimension</label>-->
          <el-tooltip class="item" effect="light" content="Dimension" placement="top" open-delay=300>
            <el-select v-model="value_dimension" clearable multiple filterable placeholder="Dimension"
                       style="width: 100%;margin-top: 6px">
              <el-option
                v-for="item in list_dimension"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-tooltip>


          <!--<label class="col-sm-2 control-label">Aggregation</label>-->
          <el-select v-model="value_aggregation" clearable multiple filterable placeholder="Aggregation"
                     style="width: 100%;margin-top: 6px">
            <el-option
              v-for="item in list_aggregation"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

          <!--<label class="col-sm-2 control-label">Filter</label>-->
          <el-select v-model="value_filter" clearable multiple filterable placeholder="Filter"
                     style="width: 100%;margin-top: 6px">
            <el-option
              v-for="item in list_filter"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

          <el-select class="select" v-if="isContain('proxy_id',value_filter)" v-model="value_proxyList" multiple
                     filterable
                     placeholder="Agent">
            <el-option
              v-for="item in list_proxyList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

          <el-select class="select" v-if="isContain('media_buyer_id',value_filter)"
                     v-model="value_mediabuys"
                     multiple
                     filterable
                     reserve-keyword
                     :loading="loading"
                     placeholder="MediaBuy">
            <el-option
              v-for="item in list_mediabuys"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

          <el-select class="select" v-if="isContain('advertiser_id',value_filter)"
                     v-model="value_advertisers"
                     multiple
                     filterable
                     remote
                     reserve-keyword
                     placeholder="advertiser"
                     :remote-method="loadAdvertisers"
                     :loading="loading">
            <el-option
              v-for="item in list_advertisers"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

          <el-select class="select" v-if="isContain('campaign_id',value_filter)"
                     v-model="value_campaigns"
                     multiple
                     filterable
                     remote
                     reserve-keyword
                     placeholder="campaigns"
                     :remote-method="loadCampaigns"
                     :loading="loading">
            <el-option
              v-for="item in list_campaigns"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

          <el-select class="select" v-if="isContain('squad_id',value_filter)"
                     v-model="value_adSquads"
                     multiple
                     filterable
                     remote
                     reserve-keyword
                     placeholder="AdSquads"
                     :remote-method="loadAdSquads"
                     :loading="loading">
            <el-option
              v-for="item in list_adSquads"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

          <el-select class="select" v-if="isContain('ad_id',value_filter)"
                     v-model="value_ads"
                     multiple
                     filterable
                     remote
                     reserve-keyword
                     placeholder="Ad"
                     :remote-method="loadAds"
                     :loading="loading">
            <el-option
              v-for="item in list_ads"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select class="select" v-if="isContain('media_id',value_filter)"
                     v-model="value_media"
                     multiple
                     filterable
                     remote
                     reserve-keyword
                     placeholder="Media"
                     :remote-method="loadMedias"
                     :loading="loading">
            <el-option
              v-for="item in list_media"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

          <el-select class="select" v-if="isContain('am_id',value_filter)" v-model="value_amlist" multiple filterable
                     placeholder="AM">
            <el-option
              v-for="item in list_amlist"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

          <el-select class="select" v-if="isContain('bd_id',value_filter)" v-model="value_bdlist" multiple filterable
                     placeholder="BD">
            <el-option
              v-for="item in list_bdlist"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

          <el-select class="select" v-if="isContain('publisher_id',value_filter)" v-model="value_publishers"
                     multiple
                     filterable
                     placeholder="Publisher">
            <el-option
              v-for="item in list_publishers"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>

          <el-select class="select" v-if="isContain('app_id',value_filter)"
                     v-model="value_apps"
                     multiple
                     filterable
                     remote
                     reserve-keyword
                     :remote-method="loadApps"
                     :loading="loading"
                     placeholder="App">
            <el-option
              v-for="item in list_apps"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>

          <el-select class="select" v-if="isContain('country',value_filter)" v-model="value_countrys" multiple
                     filterable placeholder="Country"
                     @change="loadRegion()">
            <el-option
              v-for="item in list_countrys"
              :key="item.id"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>

          <el-select class="select" v-if="isContain('region',value_filter)" v-model="value_regions" multiple filterable
                     placeholder="Region"
                     @change="loadCity()">
            <el-option
              v-for="item in list_regions"
              :key="item.id"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>

          <el-select class="select" v-if="isContain('city',value_filter)" v-model="value_citys" multiple filterable
                     placeholder="City">
            <el-option
              v-for="item in list_citys"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>

          <el-select class="select" v-if="isContain('carrier',value_filter)"
                     v-model="value_carriers"
                     multiple
                     filterable
                     remote
                     reserve-keyword
                     placeholder="Carrier"
                     :remote-method="loadCarriers"
                     :loading="loading">
            <el-option
              v-for="item in list_carriers"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>

          <el-select class="select" v-if="isContain('browser',value_filter)" v-model="value_browsers" multiple
                     filterable
                     placeholder="Browser">
            <el-option
              v-for="item in list_browsers"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
          <el-select class="select" v-if="isContain('language',value_filter)" v-model="value_languages" multiple
                     placeholder="Languages">
            <el-option
              v-for="item in list_languages"
              :key="item.id"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select class="select" v-if="isContain('platform',value_filter)" v-model="value_platform" multiple
                     filterable
                     placeholder="Platform">
            <el-option
              v-for="item in list_platform"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select class="select" v-if="isContain('device_type',value_filter)" v-model="value_devices" multiple
                     filterable
                     placeholder="Device">
            <el-option
              v-for="item in list_devices"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select class="select" v-if="isContain('os',value_filter)" @change="loadVersion()" v-model="value_os"
                     placeholder="OS">
            <el-option
              v-for="item in list_os"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
          <el-select class="select" v-if="isContain('os_version',value_filter)" v-model="value_osversions" multiple
                     filterable
                     placeholder="OsVersion">
            <el-option
              v-for="item in list_osversions"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>

          <el-select class="select" v-if="isContain('device_brand',value_filter)" v-model="value_device_brand" multiple
                     filterable
                     placeholder="Device Brand">
            <el-option
              v-for="item in list_device_brand"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>

          <el-select class="select" v-if="isContain('age',value_filter)" v-model="value_age" multiple
                     filterable
                     placeholder="Age">
            <el-option
              v-for="item in list_age"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

          <el-select class="select" v-if="isContain('gender',value_filter)" v-model="value_gender" multiple
                     filterable
                     placeholder="Gender">
            <el-option
              v-for="item in list_gender"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

        </form>
        <el-table
          class="table"
          :data="reportData"
          style="width: 100%"
          stripe=""
          sortable='custom'
          @sort-change="changeSort">
          <!--请求数、响应数、中签数、中签率、展示、点击、eCPM、CTR、CVR（转化率,转化数/点击数*100）、总花费、总成本（仅DSP方）、总收益（postback收益）、ROI(总收益-总花费/总花费)-->

          <el-table-column prop="day" label="Day" sortable v-if="isContain('day',value_dimension)"></el-table-column>
          <el-table-column prop="year_month" label="Month" sortable
                           v-if="isContain('year_month',value_dimension)"></el-table-column>
          <el-table-column prop="year_week" label="Week" sortable
                           v-if="isContain('year_week',value_dimension)"></el-table-column>
          <el-table-column prop="hour" label="Hour" sortable v-if="isContain('hour',value_dimension)"></el-table-column>
          <el-table-column prop="publisher_id" label="Publisher"
                           v-if="isContain('publisher_id',value_dimension)"></el-table-column>
          <el-table-column prop="app_id" label="App"
                           v-if="isContain('app_id',value_dimension)"></el-table-column>
          <el-table-column prop="country" label="Country" sortable
                           v-if="isContain('country',value_dimension)"></el-table-column>
          <el-table-column prop="region" label="Region" sortable
                           v-if="isContain('region',value_dimension)"></el-table-column>
          <el-table-column prop="city" label="City" sortable v-if="isContain('city',value_dimension)"></el-table-column>
          <el-table-column prop="carrier" label="Carrier" sortable
                           v-if="isContain('carrier',value_dimension)"></el-table-column>
          <el-table-column prop="browser" label="Browser" sortable
                           v-if="isContain('browser',value_dimension)"></el-table-column>
          <el-table-column prop="language" label="Language" sortable
                           v-if="isContain('language',value_dimension)"></el-table-column>
          <el-table-column prop="os" label="Os" sortable v-if="isContain('os',value_dimension)"></el-table-column>
          <el-table-column prop="os_version" label="OsVersion" sortable
                           v-if="isContain('os_version',value_dimension)"></el-table-column>
          <el-table-column prop="device_name" label="DeviceType" sortable
                           v-if="isContain('device_type',value_dimension)"></el-table-column>
          <el-table-column prop="device_brand" label="Device Brand" sortable
                           v-if="isContain('device_brand',value_dimension)"></el-table-column>
          <el-table-column prop="age_name" label="Age" sortable
                           v-if="isContain('age',value_dimension)"></el-table-column>
          <el-table-column prop="gender_name" label="Gender" sortable
                           v-if="isContain('gender',value_dimension)"></el-table-column>

          <el-table-column prop="advertiser_name" label="Advertiser"
                           v-if="isContain('advertiser_id',value_dimension)"></el-table-column>
          <el-table-column prop="campaign_name" label="Campaign"
                           v-if="isContain('campaign_id',value_dimension)"></el-table-column>
          <el-table-column prop="squad_name" label="AdSquad"
                           v-if="isContain('squad_id',value_dimension)"></el-table-column>
          <el-table-column prop="ad_name" label="Ad"
                           v-if="isContain('ad_id',value_dimension)"></el-table-column>
          <el-table-column prop="media_id" label="Media"
                           v-if="isContain('media_id',value_dimension)">

            <template slot-scope="scope">
              <el-popover v-if="scope.row.media_url!=''"
                placement="top"
                trigger="hover">
                <img style="width: 320px" v-bind:src="scope.row.media_url">
              </el-popover>
              <p slot="reference">{{scope.row.media_id}}</p>
            </template>


          </el-table-column>
          <el-table-column prop="platform_name" label="Platform"
                           v-if="isContain('platform',value_dimension)"></el-table-column>
          <el-table-column prop="proxy_name" label="Agent"
                           v-if="isContain('proxy_id',value_dimension)"></el-table-column>
          <el-table-column prop="am_name" label="AM"
                           v-if="isContain('am_id',value_dimension)"></el-table-column>
          <el-table-column prop="bd_name" label="BD"
                           v-if="isContain('bd_id',value_dimension)"></el-table-column>
          <el-table-column prop="media_buyer_name" label="MeidaBuy"
                           v-if="isContain('media_buyer_id',value_dimension)"></el-table-column>

          <el-table-column prop="bid_request_count" label="Request" sortable
                           v-if="isContain('bid_request_count',value_aggregation)"></el-table-column>
          <el-table-column prop="bid_response_count" label="Response" sortable
                           v-if="isContain('bid_response_count',value_aggregation)"></el-table-column>
          <el-table-column prop="bid_win_count" label="WinsVolume" sortable
                           v-if="isContain('bid_win_count',value_aggregation)"></el-table-column>
          <el-table-column prop="win_rate" label="WinsRate" sortable
                           v-if="isContain('win_rate',value_aggregation)">
            <template slot-scope="scope">{{ scope.row.win_rate|percentFormat }}</template>
          </el-table-column>
          <el-table-column prop="impression_count" label="Impressions" sortable
                           v-if="isContain('impression_count',value_aggregation)"></el-table-column>
          <el-table-column prop="click_count" label="Clicks" sortable
                           v-if="isContain('click_count',value_aggregation)"></el-table-column>
          <el-table-column prop="conversion_count" label="Conversions" sortable
                           v-if="isContain('conversion_count',value_aggregation)"></el-table-column>
          <el-table-column prop="ecpm" label="eCPM" sortable
                           v-if="isContain('ecpm',value_aggregation)">
            <template slot-scope="scope">{{ scope.row.ecpm|percentFormat }}</template>
          </el-table-column>
          <el-table-column prop="ctr" label="CTR" sortable v-if="isContain('ctr',value_aggregation)">
            <template slot-scope="scope">{{ scope.row.ctr|percentFormat }}</template>
          </el-table-column>
          <el-table-column prop="cvr" label="CVR" sortable v-if="isContain('cvr',value_aggregation)">
            <template slot-scope="scope">{{ scope.row.cvr|percentFormat }}</template>
          </el-table-column>
          <el-table-column prop="bid_payout" label="Spent" sortable
                           v-if="isContain('bid_payout',value_aggregation)"></el-table-column>
          <el-table-column prop="bid_revenue" label="Cost" sortable
                           v-if="isContain('bid_revenue',value_aggregation)"></el-table-column>
          <el-table-column prop="conversion_revenue" label="Revenue" sortable
                           v-if="isContain('conversion_revenue',value_aggregation)"></el-table-column>
          <el-table-column prop="roi" label="ROI" sortable v-if="isContain('roi',value_aggregation)">
            <template slot-scope="scope">{{ scope.row.roi|roiFormat }}</template>
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
    </div>
  </div>
</template>
<script src="//unpkg.com/vue/dist/vue.js"></script>
<script src="//unpkg.com/element-ui@2.4.0/lib/index.js"></script>
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
        //各下拉框数据
        list_mediabuys: [],
        list_advertisers: [],
        list_campaigns: [],
        list_adSquads: [],
        list_ads: [],
        list_publishers: [],
        list_apps: [],
        list_amlist: [],
        list_proxyList: [],
        list_bdlist: [],
        list_countrys: [],
        list_regions: [],
        list_citys: [],
        list_carriers: [],
        list_browsers: [],
        list_languages: [],
        list_devices: [],
        list_os: [],
        list_osversions: [],
        list_media:[],
        list_platform:[],
        list_device_brand:[],
        list_age:[],
        list_gender:[],

        //各下拉框选中的值
        value_mediabuys: [],
        value_advertisers: [],
        value_campaigns: [],
        value_adSquads: [],
        value_ads: [],
        value_publishers: [],
        value_apps: [],
        value_amlist: [],
        value_proxyList: [],
        value_bdlist: [],
        value_countrys: [],
        value_regions: [],
        value_citys: [],
        value_carriers: [],
        value_browsers: [],
        value_languages: [],
        value_devices: [],
        value_os: "",
        value_osversions: [],
        value_media:[],
        value_platform:[],
        value_device_brand:[],
        value_age:[],
        value_gender:[],

        value_filter: [],
        value_dimension: ['hour'],
        value_aggregation: ['impression_count', 'ctr', 'cvr', 'bid_payout', 'conversion_revenue', 'roi'],


        //过滤条件
        loading: false,
        select_date: [], //日期
        group: "", //分组(维度)
        orderBy: "", //排序
        orderType: "asc", //排序方式(asc/desc)
        pageNumber: 25, //默认每页数量
        pageNumbers: [25, 50, 75, 100], //每页显示多少条
        currentPage: 1, //当前页
        dataTotal: 0, //数据总数

        //请求接口返回的报表数据
        reportData: [],

        //拥有的粒度权限
        list_permission: [],
        //维度
        list_dimension: [],
        //指标
        list_aggregation: [],
        //过滤条件
        list_filter: [],

        pickerOptions: {
          shortcuts: [{
            text: 'latest week',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'latest month',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Last 3months',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    mounted: function () {

      //初始化,加载可选的纬度及过滤条件
      this.loadFilter();

      //读取localStorage
      var storage = window.localStorage;
      this.list_permission = storage.getItem("ifshow");
    },
    methods: {
      //获取所有过滤条件,维度及指标
      loadFilter: function () {
        axios.get('/data/overallQuery')
          .then(res => {
            if (res.data.status == 1) {
              this.list_publishers = res.data.data.publishers;
              this.list_proxyList = res.data.data.proxys;
              this.list_mediabuys = res.data.data.mediabuys;
              this.list_amlist = res.data.data.amlist;
              this.list_bdlist = res.data.data.bdlist;
              this.list_countrys = res.data.data.countrys;
              this.list_browsers = res.data.data.browsers;
              this.list_languages = res.data.data.languages;
              this.list_devices = res.data.data.devices;
              this.list_os = res.data.data.os;
              this.list_platform = res.data.data.platforms;
              this.list_device_brand = res.data.data.deviceBrands;
              this.list_age = res.data.data.ages;
              this.list_gender = res.data.data.genders;
              this.list_dimension = res.data.data.dimensions;
              this.list_filter = res.data.data.options;
              this.list_aggregation = res.data.data.aggregations;
              this.select_date = [new Date(res.data.data.from * 1000), new Date(res.data.data.to * 1000)];
            }
          })
      },

      //加载广告主
      loadAdvertisers(query) {
        if (query !== '') {
          this.loading = true;
          console.log(query)
          setTimeout(() => {
            this.loading = false;
            axios.get('/advertiser/select2', {
              params: {
                keyword: query
              }
            })
              .then(res => {
                this.loading = false;
                if (res.data.status == 1) {
                  this.list_advertisers = res.data.data;
                  console.log(this.list_advertisers)
                }
              })
          }, 2000);
        } else {
          this.list_advertisers = [];
        }
      },

      //加载campaign
      loadCampaigns(query) {
        if (query !== '') {
          this.loading = true;
          console.log(query)
          setTimeout(() => {
            this.loading = false;
            axios.get('/campaign/select2', {
              params: {
                keyword: query
              }
            })
              .then(res => {
                this.loading = false;
                if (res.data.status == 1) {
                  this.list_campaigns = res.data.data;
                }
              })
          }, 2000);
        } else {
          this.list_campaigns = [];
        }
      },
      //加载adSquad
      loadAdSquads(query) {
        if (query !== '') {
          this.loading = true;
          console.log(query)
          setTimeout(() => {
            this.loading = false;
            axios.get('/adSquad/select2', {
              params: {
                keyword: query
              }
            })
              .then(res => {
                this.loading = false;
                if (res.data.status == 1) {
                  this.list_adSquads = res.data.data;
                }
              })
          }, 2000);
        } else {
          this.list_adSquads = [];
        }
      },
      //加载ads
      loadAds(query) {
        if (query !== '') {
          this.loading = true;
          console.log(query)
          setTimeout(() => {
            this.loading = false;
            axios.get('/ad/select2', {
              params: {
                keyword: query
              }
            })
              .then(res => {
                this.loading = false;
                if (res.data.status == 1) {
                  this.list_ads = res.data.data;
                }
              })
          }, 2000);
        } else {
          this.list_ads = [];
        }
      },
      //加载ads
      loadMedias(query) {
        if (query !== '') {
          this.loading = true;
          console.log(query)
          setTimeout(() => {
            this.loading = false;
            axios.get('/media/select2', {
              params: {
                keyword: query
              }
            })
              .then(res => {
                this.loading = false;
                if (res.data.status == 1) {
                  this.list_media = res.data.data;
                }
              })
          }, 2000);
        } else {
          this.list_media = [];
        }
      },
      //加载app
      loadApps(query) {
        if (query !== '') {
          this.loading = true;
          console.log(query)
          setTimeout(() => {
            this.loading = false;
            axios.get('/option/select2App', {
              params: {
                keyword: query
              }
            })
              .then(res => {
                this.loading = false;
                if (res.data.status == 1) {
                  this.list_apps = res.data.data;
                }
              })
          }, 2000);
        } else {
          this.list_apps = [];
        }
      },

      //加载Carriers
      loadCarriers(query) {
        if (query !== '') {
          this.loading = true;
          console.log(query)
          setTimeout(() => {
            this.loading = false;
            axios.get('/option/select2Carriers', {
              params: {
                keyword: query
              }
            })
              .then(res => {
                this.loading = false;
                if (res.data.status == 1) {
                  this.list_carriers = res.data.data;
                }
              })
          }, 2000);
        } else {
          this.list_carriers = [];
        }
      },

      //国家改变时，加载州
      loadRegion: function () {
        if (this.value_countrys == "") {
          this.list_regions = [];
          this.value_regions = [];
          this.list_citys = [];
          this.value_citys = [];
        }
        else {
          //search是取value_countrys数组中对象中里的value
          var countries = [];
          for (var i = 0; i < this.value_countrys.length; i++) {
            countries.push(this.value_countrys[i].value);
          }
          //州
          var toString = countries.join(',');
          axios.get('/option/select2Region', {
            params: {
              countryCodes: toString
            }
          })
            .then(res => {
              if (res.data.status == 1) {
                this.list_regions = res.data.data;
              }
            })
        }
      },


      //州改变时，加载城市
      loadCity: function () {
        if (this.value_regions == "") {
          this.list_regions = [];
          this.value_regions = [];
          this.list_citys = [];
          this.value_citys = [];
        } else {
          //search是取value_regions数组中对象中里的value
          var regions = [];
          for (var i = 0; i < this.value_regions.length; i++) {
            regions.push(this.value_regions[i].value);
          }
          var toString = regions.join(',');
          axios.get('/option/select2City', {
            params: {
              regionCodes: toString
            }
          })
            .then(res => {
              if (res.data.status == 1) {
                this.list_citys = res.data.data;
              }
            })
        }
      },

      //加载版本号
      loadVersion:function(){
        var osId;
        for (var i=0;i<this.list_os.length;i++){
          if (this.value_os===this.list_os[i].name){
            osId=this.list_os[i].id
            break;
          }
        }
        axios.get('/option/select2OsVersion',{
          params:{
            os:osId
          }
        })
          .then( res =>{
            if( res.data.status == 1){
              this.list_osversions = res.data.data;
            }
          })
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
        console.log(param)
        if (param.order == "descending") {
          this.orderType = "desc";
        } else if (param.order == "ascending") {
          this.orderType = "asc"
        }
        //筛选排序字段
        this.orderBy = param.prop
        if (this.orderBy != null && this.orderBy != '') {
          this.search();
        }
      },

      //搜索
      search: function () {

        //search是取value_countrys数组中对象中里的name
        var countries = [];
        for (var i = 0; i < this.value_countrys.length; i++) {
          countries.push(this.value_countrys[i].name);
        }
        var countries = countries.join(',');

        //search是取value_regions数组中对象中里的name
        var regions = [];
        for (var i = 0; i < this.value_regions.length; i++) {
          regions.push(this.value_regions[i].name);
        }
        var regions = regions.join(',');

        // day,year_month,year_week,hour
        //设置默认排序
        if (this.orderBy == '' && this.isContain('day', this.value_dimension)) {
          this.orderBy = 'day';
        } else if (this.orderBy == '' && this.isContain('year_week', this.value_dimension)) {
          this.orderBy = 'year_week';
        } else if (this.orderBy == '' && this.isContain('year_month', this.value_dimension)) {
          this.orderBy = 'year_month';
        } else if (this.orderBy == '' && this.isContain('hour', this.value_dimension)) {
          this.orderBy = 'hour';
        } else if (this.orderBy == null) {
          this.orderBy = '';
        }
        if (this.orderBy == '') {
          this.orderType = '';
        }
        axios.get('/data/overall', {
          params: {
            from: this.select_date[0] / 1000,
            to: this.select_date[1] / 1000,
            rows: this.pageNumber, //每页数量
            page: this.currentPage,  //页
            orderBy: this.orderBy,  //排序
            orderType: this.orderType, //排序类型
            options: this.value_dimension.join(','),
            aggregations: this.value_aggregation.join(','),
            media_buyer_id: this.isContain('media_buyer_id', this.value_filter) ? this.value_mediabuys.join(',') : "",
            proxy_id: this.isContain('proxy_id', this.value_filter) ? this.value_proxyList.join(',') : "",
            advertiser_id: this.isContain('advertiser_id', this.value_filter) ? this.value_advertisers.join(',') : "",
            campaign_id: this.isContain('campaign_id', this.value_filter) ? this.value_campaigns.join(',') : "",
            squad_id: this.isContain('squad_id', this.value_filter) ? this.value_adSquads.join(',') : "",
            ad_id: this.isContain('ad_id', this.value_filter) ? this.value_ads.join(',') : "",
            publisher_id: this.isContain('publisher_id', this.value_filter) ? this.value_publishers.join(',') : "",
            app_id: this.isContain('app_id', this.value_filter) ? this.value_apps.join(',') : "",
            am_id: this.isContain('am_id', this.value_filter) ? this.value_amlist.join(',') : "",
            bd_id: this.isContain('bd_id', this.value_filter) ? this.value_bdlist.join(',') : "",
            country: this.isContain('country', this.value_filter) ? countries : "",
            region: this.isContain('region', this.value_filter) ? regions : "",
            city: this.isContain('city', this.value_filter) ? this.value_citys.join(',') : "",
            carrier: this.isContain('carrier', this.value_filter) ? this.value_carriers.join(',') : "",
            browser: this.isContain('browser', this.value_filter) ? this.value_browsers.join(',') : "",
            language: this.isContain('language', this.value_filter) ? this.value_languages.join(',') : "",
            device_type: this.isContain('device_type', this.value_filter) ? this.value_devices.join(',') : "",
            os: this.isContain('os', this.value_filter) ? this.value_os : "",
            os_version: this.isContain('os_version', this.value_filter) ? this.value_osversions.join(',') : "",
            media_id: this.isContain('media_id', this.value_filter) ? this.value_media.join(',') : "",
            platform: this.isContain('platform', this.value_filter) ? this.value_platform.join(',') : "",
            device_brand: this.isContain('device_brand', this.value_filter) ? this.value_device_brand.join(',') : "",
            age: this.isContain('age', this.value_filter) ? this.value_age.join(',') : "",
            gender: this.isContain('gender', this.value_filter) ? this.value_gender.join(',') : "",
          }
        })
          .then(res => {
            if (res.data.status == 1 && res.data.data != null) {
              this.reportData = res.data.data.list;
              this.dataTotal = res.data.data.total;
            } else {
              this.reportData = [];
              this.dataTotal = 0;
            }
            //reset
            this.orderBy = '';
            this.orderType = 'asc';
          })
      },

      //判断是否有权限
      ifshow: function (per) {
        if (this.list_permission.indexOf(per) > 0) {
          return true;
        } else {
          return false;
        }
      },
      //判断数组是否包含某个元素
      isContain: function (value, arr) {
        var i = arr.length;
        while (i--) {
          if (arr[i] === value) {
            return true;
          }
        }
        return false;
      },

    },
    filters: {
      //时间戳
      formatDate(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      },
      percentFormat(i) {
        return (Math.round(i * 10000) / 100).toFixed(2) + '%';
      },
      roiFormat(i) {
        return (i - 1).toFixed(4);
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

  /* 搜索按钮对其 */
  .form-group .btn-primary {
    margin-left: 10px;
  }

  .select {
    margin-top: 5px;
    margin-inside: 5px;
    width: 24.7%;
  }

</style>
