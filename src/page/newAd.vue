<template>
  <div>
    <!-- 面包屑 -->
    <div class="row wrapper border-bottom white-bg page-heading">
      <div class="col-lg-10">
        <h2>New Ad</h2>
        <ol class="breadcrumb">
          <li>
            <router-link to="/">Home</router-link>
          </li>
          <li>
            <router-link to="/ad">Ad</router-link>
          </li>
          <li class="active">
            <strong>New Ad</strong>
          </li>
        </ol>
      </div>
    </div>

    <!-- body -->
    <div class="ibox float-e-margins animated fadeInRight">
      <div class="ibox-title">
        <h5>Target</h5>
      </div>
      <div class="ibox-content">
        <div class="form-horizontal">
          <!--AD squad-->
          <div class="form-group">
            <label class="col-sm-2 control-label"><i class="star">*</i>Ad Squad&nbsp;<i
              title="Give your ad Squad a name . If you're using an existing ad Squad, you can keep the same name."
              class="el-icon-warning"></i>
            </label>
            <div class="col-sm-9" style="width: 70%">
              <el-select v-model="adSquad" :disabled='this.$route.query.id>0' name="vee-adSquad" style="width: 100%"
                         @change="showOneIbox()">
                <el-option width="100%" v-for="(item,index) in list_adSquad" :key="index" :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
              <div v-if="errors.first('vee-adSquad')" class="tip">{{ errors.first('vee-adSquad') }}</div>
            </div>
            <button type="button" class="btn btn-primary">
              <router-link to="/newSquad"> New Ad Squad</router-link>
            </button>
          </div>
          <div class="hr-line-dashed"></div>
          <!-- Name -->
          <div class="form-group">
            <label class="col-sm-2 control-label"><i class="star">*</i>AD Name&nbsp;<i title="Enter your ad name here."
                                                                                       class="el-icon-warning"></i></label>
            <div class="col-sm-9">
              <input type="text" class="form-control form-control1" v-model="name" v-validate="'required|min:2|max:50'"
                     name="vee-name" autocomplete="off">
              <div v-if="errors.first('vee-name')" class="tip">{{ errors.first('vee-name') }}</div>
            </div>
          </div>
          <div class="hr-line-dashed"></div>
          <!-- Status -->
          <div class="form-group">
            <label class="col-sm-2 control-label">Status&nbsp;<i class="el-icon-warning"></i></label>
            <div class="col-sm-9 col-sm-90" :class="{'disabled':adSquad==''}">
              <el-switch class="switch form-control1" v-model="status" :active-value="1" :inactive-value="0">
              </el-switch>
            </div>
          </div>
          <div class="hr-line-dashed"></div>
        </div>
      </div>
    </div>
    <div class="ibox float-e-margins float-e-margins01 animated fadeInRight" :class="{'m-hide':adSquad==''}"
         style="height:50rem"
         v-if="targetPlatform==1">
      <div class="ibox-title">
        <h5>Creative</h5>
      </div>
      <div class="ibox-content" style="display: inline-block;width: 50%;height: 50rem">
        <div class="form-horizontal">
          <div class="form-group" v-if="value_appShowType!=50001">
            <label class="col-sm-2 control-label left" style="width: 190.5px;text-align: right"><i class="star">*</i>Image&nbsp;<i
              title="Please choose image type，in JPG or PNG format. File size must be lower than 300KB."
              class="el-icon-warning"></i></label>
            <div class="col-sm-5 Native">
              <div class="uploadMax">
                <label>
                  <input style="display: none;" type="file"
                         @change="getFile($event,'#dd1')" id="doc">
                  <div id="dd1" style="width:150px;height: 86px;margin-left:0.5rem">
                    <img src="../../static/images/upload.jpg" v-if="!ImageUrl"
                         style="height: 86px;width: 150px;border: 1px solid #e6eaed">
                    <img :src="ImageUrl" alt="" style="width:150px;height: 86px;">
                  </div>
                </label>
              </div>
              <button type="button" class="btn btn-default" data-toggle="modal" data-target="#myModal_icon"
                      @click="loadCreative('image')" style="margin-left:0.5rem">Browse Library
              </button>
            </div>
          </div>
          <!-- logo -->
          <div class="form-group">
            <label class="col-sm-2 control-label left" style="width: 190.5px;text-align: right"><i class="star">*</i>Logo&nbsp;<i
              title="Logo must be larger than 84*84 px and have an aspect ratio of 1:1, in JPG or PNG format. File size must be lower than 50KB."
              class="el-icon-warning"></i></label>
            <div class="col-sm-5 Native">
              <label>
                <input style="display: none;" type="file"
                       @change="getFileLogo($event,'#dd2')">
                <div class="icon" id="dd2" style="width:49px;height:49px;margin-left:0.5rem;margin-bottom: 1rem">
                  <img src="../../static/images/upload.jpg" v-if="!LogoUrl"
                       style="width: 49px;height: 49px;border: 1px solid #e6eaed">
                  <img :src="LogoUrl" alt="" style="width:49px;height:49px;">
                </div>
                <button type="button" class="btn btn-default" data-toggle="modal" data-target="#myModal_icon"
                        @click="loadCreative('icon')" style="margin-left:0.5rem">Browse Library
                </button>
              </label>
            </div>
          </div>
          <!--Headline-->
          <div class="form-group">
            <label class="col-sm-2 control-label left" style="width: 190.5px;text-align: right"><i class="star">*</i>Headline&nbsp;<i
              title="Less than 26 characters.Add a headline that grabs people's attention and tells them what your ad is about."
              class="el-icon-warning"></i></label>
            <div class="col-sm-5">
              <input type="text" class="form-control" v-model="Native_title" v-validate="'required|min:2|max:26'"
                     name="vee-title" autocomplete="off"
                     style="width: 25rem;">
              <div v-if="errors.first('vee-title')" class="tip">{{ errors.first('vee-title') }}</div>
            </div>
          </div>
          <!-- Description -->
          <div class="form-group">
            <label class="col-sm-2 control-label left" style="width: 190.5px;text-align: right">Description&nbsp;<i
              title="Less than 80 characters.Tell people a bit more about your Application. Make sure to clearly explain what you are promoting."
              class="el-icon-warning"></i></label>
            <div class="col-sm-5">
              <el-input type="textarea" v-model="Native_descript" v-validate="'min:2|max:80'"
                        name="vee-descript" autocomplete="off" style="width: 25rem"></el-input>
              <div v-if="errors.first('vee-descript')" class="tip">{{ errors.first('vee-descript') }}</div>
            </div>
          </div>
          <!-- button -->
          <div class="form-group">
            <label class="col-sm-2 control-label left" style="width: 190.5px;text-align: right">Button<i
              title="Choose the call to action text that will appear as a button on your ad."
              class="el-icon-warning"></i></label>
            <div class="col-sm-5">
              <el-select v-model="value">
                <el-option
                  v-for="item in options"
                  :key="item"
                  :value="item">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="form-group">
            <div style="margin-left: 17rem">
              <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">Submit</button>
              <button type="button" class="btn btn-default" @click="toCampaign()">Back</button>
            </div>

          </div>

          <!-- 你确定要提交吗 -->
          <div class="modal fade" id="myModal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                  </button>
                  <h4 class="modal-title" id="myModalLabel">Hint</h4>
                </div>
                <div class="modal-body">
                  Are you sure you want to submit it?
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                  <button type="button" class="btn btn-primary" data-dismiss="modal" @click="new_submit($event)">
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- 弹出icon选择框 -->
          <div class="modal fade" id="myModal_icon" tabindex="-1" role="dialog" style="width:90%">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                  </button>
                  <h4 class="modal-title" id="myModalLabel">Please Select...</h4>
                </div>
                <div class="modal-body">
                  <form class="form-horizontal">
                    <el-table class="table" :data="infoData" style="width: 100%" height="250" highlight-current-row
                              @current-change="handleCurrentChange">
                      <el-table-column prop="id" label="ID" width="80"></el-table-column>
                      <el-table-column prop="name" label="Name"></el-table-column>
                      <el-table-column prop="url" label="Preview">
                        <template slot-scope="scope">
                          <div class="pic">
                            <img :src=scope.row.url>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column label="Size">
                        <template slot-scope="scope">
                          {{ scope.row.width}}*{{scope.row.height}}
                        </template>
                      </el-table-column>
                    </el-table>
                    <!-- 分页 -->
                    <el-pagination layout="prev, pager, next" @current-change="changePage" :page-size="pageNumber"
                                   :current-page="currentPage" :total="dataTotal">
                    </el-pagination>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                  <button type="button" class="btn btn-primary" @click="icon_ok()">Confirm</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 右边的的内容 -->
      <div class="ibox-content" style="float: right;width: 50%;border-left:1px solid #e7eaec;height: 50rem">
        <div class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-2 control-label" style="width: 27.6666%;margin-left:-2.5rem">Preview&nbsp;<i
              class="el-icon-warning"></i></label>
            <div class="col-sm-9" style="float:none;margin-top:2.5rem">
              <div style="border: 1px solid #e7eaec;width: 90%;margin: auto;">
                <div style="height:26rem;width: 100%;">
                  <div style="height:64px;width: 100%; border-bottom: 1px solid #e7eaec;">
									<span
                    style="display: inline-block;width:45px;height:45px;line-height:3rem;border: 1px solid #e7eaec ;margin:0.5rem;text-align:center;">
										<img :src="LogoUrl" alt="" style="width:3.5rem;height:2.8rem;">
									</span>
                    <span>
										<input type="text" v-model="Native_title"
                           style="outline:none;border:none;width:5rem;background:#fff" placeholder=" Headline"
                           disabled="disabled">
									</span>
                    <el-button v-if="value!=''" size="mini"
                               style="background:#00CC33;color:#fff;float:right;margin:1rem;font-size:0.8rem">{{value}}
                    </el-button>
                  </div>
                  <!-- <img  :src="Native_title"  /> -->
                  <div style="width:100%;height:19rem">
                    <img :src="ImageUrl" v-if="ImageUrl" style="width:100%;height:100%"/>
                  </div>

                </div>
                <div
                  style="border-top: 1px solid #e7eaec; line-height:2.8rem;font-size:0.9rem;text-indent: 1.5rem;height: 36px">
                  <span>
										<input type="text" v-model="Native_descript"
                           style="outline:none;border:none;background:#fff;width: 100%"
                           placeholder="Here is a description of your ad"
                           disabled="disabled">
									</span>
                </div>
              </div>
              <a style="margin-left: 2rem" target="_blank" href="http://ori.cmcm.com/help/show/id/93">Design Guidelines
                ></a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--NDSP AD-->
    <div class="ibox float-e-margins float-e-margins01 animated fadeInRight" :class="{'m-hide':adSquad==''}"
         v-if="targetPlatform==0">
      <div class="ibox-title">
        <h5>Creative</h5>
      </div>
      <div class="ibox-content">
        <div class="form-horizontal" style="margin-left: 1rem">
          <!-- Tracking Link -->
          <div class="form-group">
            <label class="col-sm-2 control-label" style="width: 190.5px;text-align: right"><i class="star">*</i>Tracking
              Link&nbsp;<i class="el-icon-warning"></i></label>
            <div class="col-sm-9">
              <input type="text" class="form-control" v-model="trackUrl" v-validate="'required|url'" name="vee-trackUrl"
                     autocomplete="off">
              <div v-if="errors.first('vee-trackUrl')" class="tip">{{ errors.first('vee-trackUrl') }}</div>
            </div>
          </div>
          <div class="hr-line-dashed"></div>
          <!-- thirdUrl -->
          <div class="form-group">
            <label class="col-sm-2 control-label" style="width: 190.5px;text-align: right">Third Link&nbsp;<i
              class="el-icon-warning"></i></label>
            <div class="col-sm-9">
              <input type="text" class="form-control" v-model="thirdUrl" v-validate="'url'" name="vee-thirdUrl"
                     autocomplete="off">
              <div v-if="errors.first('vee-thirdUrl')" class="tip">{{ errors.first('vee-thirdUrl') }}</div>
            </div>
          </div>
          <div class="hr-line-dashed"></div>
          <!-- Ad Type -->
          <div class="form-group">
            <label class="col-sm-2 control-label" style="width: 190.5px;text-align: right">Ad Type&nbsp;<i
              class="el-icon-warning"></i></label>
            <div class="col-sm-9">
              <!-- 选项卡 -->
              <el-radio-group v-model="tab" size="medium" style="margin-bottom:15px">
                <!--<el-radio-button label="Native"></el-radio-button>-->
                <el-radio-button v-for="item in list_adType" :key="item.name" :label="item.name" :value="item.name">
                </el-radio-button>
              </el-radio-group>
              <!-- Native -->
              <div v-if="this.tab == 'native'" style="margin-left: -16rem">
                <!-- Size -->
                <div class="form-group">
                  <label class="col-sm-2 control-label left" style="width: 190.5px;text-align: right">Size&nbsp;<i
                    class="el-icon-warning"></i></label>
                  <div class="col-sm-5">
                    <el-select v-model="size" style="width: 100%;">
                      <el-option width="100%" v-for="item in list_size" :key="item.value" :label="item.name"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <!-- Image -->
                <div class="form-group">
                  <label class="col-sm-2 control-label left" style="width: 190.5px;text-align: right"><i
                    class="star">*</i>Image&nbsp;<i
                    title="Please choose image type，in JPG or PNG format. File size must be lower than 300KB.s"
                    class="el-icon-warning"></i></label>
                  <div class="col-sm-5 Native" style="margin-bottom:2.5rem">
                    <label>
                      <input style="display: none;" type="file"
                             @change="getfile($event,'#dd1')" id="doc">
                      <div id="dd1" style="width:150px;height: 86px">
                        <img src="../../static/images/upload.jpg" v-if="!ImageUrl"
                             style="height: 86px;width: 150px;border: 1px solid #e6eaed">
                        <img :src="ImageUrl" alt="" style="width:150px;height: 86px;">
                      </div>
                      <!--<div id="dd1" style="width:150px;height:86px;background:url('../../static/images/upload.jpg');margin-left:1.8rem" >-->
                      <!--&lt;!&ndash; <img src="../../static/images/upload.jpg" v-if="!ImageUrl" > &ndash;&gt;-->
                      <!--<img :src="ImageUrl" alt="" style="width:150px;height:86px" >-->
                      <!--</div>-->
                    </label>
                    <button type="button" class="btn btn-default" data-toggle="modal" data-target="#myModal_icon"
                            @click="loadCreative('image')" style="margin:8rem 1.8rem 0 -150px;position: fixed;">Browse
                      Library
                    </button>
                  </div>
                </div>
                <!-- Loge -->
                <div class="form-group">
                  <label class="col-sm-2 control-label left" style="width: 190.5px;text-align: right"><i
                    class="star">*</i>Logo&nbsp;<i
                    title="Logo must be larger than 84*84 px and have an aspect ratio of 1:1, in JPG or PNG format. File size must be lower than 50KB."
                    class="el-icon-warning"></i></label>
                  <div class="col-sm-5 Native">
                    <label>
                      <input style="display: none;" type="file"
                             @change="getfileLogo($event,'#dd2')">
                      <div class="icon" id="dd2"
                           style="width:49px;height:49px;margin-bottom: 1rem;border: 1px solid #e6eaed">
                        <img src="../../static/images/upload.jpg" v-if="!LogoUrl" style="width:49px;height:49px">
                        <img :src="LogoUrl" alt="" style="width:49px;height:49px">
                      </div>
                      <button type="button" class="btn btn-default" data-toggle="modal" data-target="#myModal_icon"
                              @click="loadCreative('icon')">Browse Library
                      </button>
                    </label>
                  </div>
                </div>
                <!-- Headline -->
                <div class="form-group">
                  <label class="col-sm-2 control-label left" style="width: 190.5px;text-align: right"><i
                    class="star">*</i>Headline&nbsp;<i
                    title="Less than 26 characters.Add a headline that grabs people's attention and tells them what your ad is about."
                    class="el-icon-warning"></i></label>
                  <div class="col-sm-5">
                    <input type="text" class="form-control" v-model="Native_title" v-validate="'required|min:2|max:26'"
                           name="vee-title" autocomplete="off">
                    <div v-if="errors.first('vee-title')" class="tip">{{ errors.first('vee-title') }}</div>
                  </div>
                </div>
                <!-- Description -->
                <div class="form-group">
                  <label class="col-sm-2 control-label left" style="width: 190.5px;text-align: right"><i
                    class="star">*</i>Description&nbsp;<i
                    title="Less than 80 characters.Tell people a bit more about your Application. Make sure to clearly explain what you are promoting."
                    class="el-icon-warning"></i></label>
                  <div class="col-sm-5">
                    <el-input type="textarea" v-model="Native_descript"
                              v-validate="'required|min:2|max:80'" name="vee-descript" autocomplete="off"></el-input>
                    <div v-if="errors.first('vee-descript')" class="tip">{{ errors.first('vee-descript') }}</div>
                  </div>
                </div>
                <!-- button -->
                <div class="form-group">
                  <label class="col-sm-2 control-label left" style="width: 190.5px;text-align: right">Button&nbsp;<i
                    title="Choose the call to action text that will appear as a button on your ad."
                    class="el-icon-warning"></i></label>
                  <div class="col-sm-5">
                    <input type="text" class="form-control" v-model="value" v-validate="'required|min:2|max:26'"
                           name="vee-title" autocomplete="off">
                  </div>
                </div>
                <!-- 提交 -->
                <div class="form-group">
                  <div class="col-sm-4 col-sm-offset-2">
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">Submit
                    </button>
                    <button type="button" class="btn btn-default" style="margin-left:10px" @click="toCampaign()">Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 你确定要提交吗 -->
          <div class="modal fade" id="myModal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                  </button>
                  <h4 class="modal-title" id="myModalLabel">Hint</h4>
                </div>
                <div class="modal-body">
                  Are you sure you want to submit it?
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                  <button type="button" class="btn btn-primary" data-dismiss="modal" @click="new_submit($event)">
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 弹出icon选择框 -->
          <div class="modal fade" id="myModal_icon" tabindex="-1" role="dialog" style="width:90%">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                  </button>
                  <h4 class="modal-title" id="myModalLabel">Please Select...</h4>
                </div>
                <div class="modal-body">
                  <form class="form-horizontal">
                    <el-table class="table" :data="infoData" style="width: 100%" height="250" highlight-current-row
                              @current-change="handleCurrentChange">
                      <el-table-column prop="id" label="ID" width="80"></el-table-column>
                      <el-table-column prop="name" label="Name"></el-table-column>
                      <el-table-column prop="url" label="Preview">
                        <template slot-scope="scope">
                          <div class="pic">
                            <img :src="scope.row.url">
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column label="Size">
                        <template slot-scope="scope">
                          {{ scope.row.width}}*{{scope.row.height}}
                        </template>
                      </el-table-column>
                    </el-table>
                    <!-- 分页 -->
                    <el-pagination layout="prev, pager, next" @current-change="changePage" :page-size="pageNumber"
                                   :current-page="currentPage" :total="dataTotal">
                    </el-pagination>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                  <button type="button" class="btn btn-primary" @click="icon_ok()">Confirm</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="hr-line-dashed"></div>
  </div>
</template>

<script>
  import {formatDate} from '@/assets/js/date.js'
  import {convert, objOfPropertyToArr, setImagePreviews, setImagePreviews2} from '@/assets/js/common.js'
  import {delCookie, getCookie, setCookie} from '@/assets/js/cookie.js'
  import axios from 'axios'

  export default {
    data() {
      return {
        //表单
        name: "",
        status: 1,
        cta: "",
        tab: "", //选项卡,默认Native
        adSquad: "",
        list_adSquad: [],
        size: "",
        list_size: [],
        list_adType: [],
        trackUrl: "",
        thirdUrl: "",
        //
        //Native
        Native_title: "",
        Native_descript: "",
        current: "",
        //
        //icon
        current_url: "",
        current_id: "",
        icon_url: "",
        infoData: [],
        //
        // image
        icon_image: "",
        image_url: "",

        //分页
        pageNumber: 25, //默认每页数量
        currentPage: 1, //当前页
        dataTotal: 1, //数据总数

        //其他
        permission: [],
        tip_icon: "",

        //上传图片规定的大小
        number: 300,
        ImageUrl: "",
        LogoUrl: "",
        ImageId: "",
        LogoId: "",
        mediaBuyId: "",

        //选项框的
        options: ['Download', 'lnstall', 'Check', 'Free', 'Play', 'Buy', 'More'],
        value: '',
        targetPlatform: -1,
        value_appShowType: "",

        //判断图片类型
        type: ["image/png", "image/jpeg",],
        isNext: false
      }
    },
    mounted: function () {
      var self = this;
      //读取localStorage
      var storage = window.localStorage;
      this.permission = storage.getItem("ifshow");

      //

      $("body input.form-control1").on('click', function () {
        if (self.adSquad == "") {
          $('.form-control1').blur()
        }

      })
      $("body div.form-control1").on('click', function () {

        if (self.adSquad == "") {
        } else {
          $('#areaSelect').removeAttr("disabled");
        }

      })


      axios.get('/option/select2AdSize', {
        headers: { //token
          Authorization: getCookie('token')
        },
      })
        .then(res => {
          if (res.data.status == 1) {
            this.list_size = res.data.data;
          }
        });


      //size
      axios.get('/option/select2AdType', {
        headers: { //token
          Authorization: getCookie('token')
        },
      })
        .then(res => {
          if (res.data.status == 1) {
            this.list_adType = res.data.data;
            if (this.list_adType != null && this.list_adType.length > 0) {
              for (var i = 0; i < this.list_adType.length; i++) {
                if ('native' == this.list_adType[i].name) {
                  this.tab = "native";
                  break;
                }
              }
            }
          }
        })
    },
    methods: {
      //判断是否有权限
      ifshow: function (per) {
        if (this.permission.indexOf(per) > 0) {
          return true;
        } else {
          return false;
        }
      },

      //返回
      toCampaign: function () {
        this.$router.push({
          path: "/ad"
        });
      },

      //上传
      getFile: function (e, ele) {

        //获取到上传图片的大小,然后转换成KB大小,进行上传验证
        let size = Math.round((e.target.files[0].size) / 1024)
        //将获取到的图片这个对象,以键值对的形式传参数
        let formData = new FormData();
        formData.append('file', e.target.files[0]);
        formData.append('ratio', "1.9");
        formData.append('tbMediaBuyId', this.mediaBuyId);
        console.log(size)
        //本地圖片限制类型
        this.isNext = false;
        for (let i = 0; i < this.type.length; i++) {
          if (this.type[i] == e.target.files[0].type) {
            this.isNext = true;
            break;
          }
        }
        //如果获取到的图片大小小于规定的number,那么就请求数据
        if (size < this.number && this.isNext) {
          // this.file = e.target.files[0];

          axios.post("/media/add", formData, {
            headers: { //token
              Authorization: getCookie('token'),
              'Content-type': 'multipart/form-data'
            }
          })
            .then(res => {
              if (res.data.status == 3) {
                this.$message({
                  message: this.$t("Picture size exceeds 600*314"),
                  type: 'error',
                  duration: 1800
                });
              } else {
                this.setImagePreviews(e.target, $(ele)[0]);
                this.ImageUrl = res.data.data[0].url
                this.ImageId = String(res.data.data[0].id)
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          //否则图片边框变红色
          //否则图片边框变红色
          if (size < this.number) {
            this.$message({
              message: this.$t("Please upload the file less than 50KB"),
              type: 'error',
              duration: 1800
            });
          }
          this.$message({
            message: this.$t("Only upload PNG and JPG"),
            type: 'success',
            duration: 1800
          });
        }
      },
      //上传logo图片的功能
      getFileLogo: function (e, ele) {

        //获取到上传图片的大小,然后转换成KB大小,进行上传验证
        let size = Math.round((e.target.files[0].size) / 1024)
        //将获取到的图片这个对象,以键值对的形式传参数
        let formData = new FormData();
        formData.append('file', e.target.files[0]);
        formData.append('ratio', "1");
        formData.append('tbMediaBuyId', this.mediaBuyId);
        console.log(size)
        //本地圖片限制类型
        this.isNext = false;
        for (let i = 0; i < this.type.length; i++) {
          if (this.type[i] == e.target.files[0].type) {
            this.isNext = true;
            break;
          }
        }
        //如果获取到的图片大小小于规定的number,那么就请求数据
        if (size < 50 && this.isNext) {
          // this.file = e.target.files[0];
          axios.post("/media/add", formData, {
            headers: { //token
              Authorization: getCookie('token'),
              'Content-type': 'multipart/form-data'
            }
          })
            .then(res => {
              if (res.data.status == 3) {
                this.$message({
                  message: this.$t("Picture size exceeds 84*84"),
                  type: 'error',
                  duration: 1800
                });
              } else {
                this.setImagePreviews(e.target, $(ele)[0]);
                this.LogoUrl = res.data.data[0].url
              }

            })
            .catch(err => {
              console.log(err)
            })
        } else {
          //否则图片边框变红色
          if (!this.isNext) {
            this.$message({
              message: this.$t("Only upload PNG and JPG"),
              type: 'success',
              duration: 1800
            });
          }
          this.$message({
            message: this.$t("Please upload the file less than 50KB"),
            type: 'error',
            duration: 1800
          });
        }
      },
      //本地上传
      getfile: function (e, ele) {
        //获取到上传图片的大小,然后转换成KB大小,进行上传验证
        let size = Math.round((e.target.files[0].size) / 1024)
        //将获取到的图片这个对象,以键值对的形式传参数
        let formData = new FormData();
        formData.append('file', e.target.files[0]);
        formData.append('tbMediaBuyId', this.mediaBuyId);
        console.log(size)
        //本地上传验证图片类型
        this.isNext = false;
        for (let i = 0; i < this.type.length; i++) {
          if (this.type[i] == e.target.files[0].type) {
            this.isNext = true;
            break;
          }
        }
        //如果获取到的图片大小小于规定的number,那么就请求数据
        if (size < this.number && this.isNext) {
          // this.file = e.target.files[0];
          this.setImagePreviews(e.target, $(ele)[0]);
          axios.post("/media/add", formData, {
            headers: { //token
              Authorization: getCookie('token'),
              'Content-type': 'multipart/form-data'
            }
          }).then(res => {
            if (res.data.status == 1) {
              // $('#myModal').modal('toggle');
              // this.ImageUrl = res.data.url
              // this.ImageId = res.data.url
              this.ImageUrl = res.data.data[0].url
              this.ImageId = String(res.data.data[0].id)
              this.$message({
                message: this.$t("m.Msg.New_success"),
                type: 'success',
                duration: 1800
              });
            }
            else {
              // $('#myModal').modal('toggle');
              this.$message({
                message: this.$t("m.Msg.Failed"),
                type: 'error',
                duration: 1800
              });
            }
          })
        } else {
          //否则图片边框变红色
          this.$message({
            message: this.$t("Only upload PNG and JPG"),
            type: 'success',
            duration: 1800
          });
        }
      },
      //本地上传logo图片的功能
      getfileLogo: function (e, ele) {

        //获取到上传图片的大小,然后转换成KB大小,进行上传验证
        let size = Math.round((e.target.files[0].size) / 1024)
        //将获取到的图片这个对象,以键值对的形式传参数
        let formData = new FormData();
        formData.append('file', e.target.files[0]);
        formData.append('tbMediaBuyId', this.mediaBuyId);
        console.log(size)
        //本地上传验证图片类型
        this.isNext = false;
        for (let i = 0; i < this.type.length; i++) {
          if (this.type[i] == e.target.files[0].type) {
            this.isNext = true;
            break;
          }
        }
        //如果获取到的图片大小小于规定的number,那么就请求数据
        if (size < 50 && this.isNext) {
          // this.file = e.target.files[0];
          this.setImagePreviews(e.target, $(ele)[0]);
          axios.post("/media/add", formData, {
            headers: { //token
              Authorization: getCookie('token'),
              'Content-type': 'multipart/form-data'
            }
          }).then(res => {
            if (res.data.status == 1) {
              // $('#myModal').modal('toggle');
              this.LogoUrl = res.data.data[0].url
              this.$message({
                message: this.$t("m.Msg.New_success"),
                type: 'success',
                duration: 1800
              });
            }
            else {
              // $('#myModal').modal('toggle');
              this.$message({
                message: this.$t("m.Msg.Failed"),
                type: 'error',
                duration: 1800
              });
            }
          })
        } else {
          //否则图片边框变红色
          this.$message({
            message: this.$t("Only upload PNG and JPG"),
            type: 'success',
            duration: 1800
          });
        }
      },
      setImagePreviews: function (ipt, obj) {
        setImagePreviews2(ipt, obj);
      },

      //加载AdSquad
      loadAdSquad: function (query) {
        axios.get('/adSquad/select2', {
          headers: { //token
            Authorization: getCookie('token')
          },
          params: {
            keyword: query
          }
        })
          .then(res => {

            if (res.data.status == 1) {
              this.list_adSquad = res.data.data;
              console.log(this.list_adSquad)
            }
          })
      },

      //加载icon creative
      loadCreative: function (value) {
        this.current = value;
        var ratio = "";
        if (this.targetPlatform == 1) {
          if (value == 'icon') {
            ratio = "1";
          } else if (value == "image") {
            ratio = "1.9";
          }
        }
        axios.get('/media/list', {
          headers: { //token
            Authorization: getCookie('token')
          },
          params: {
            rows: 25, //每页数量
            page: 1, //当前页
            type: 1, //图片
            ratio: ratio,
          }
        })
          .then(res => {
            if (res.data.status == 1) {
              this.infoData = res.data.data.list;
            }
          })
      },

      //分页
      changePage: function (currentPage) {
        this.currentPage = currentPage;
        axios.get('/media/list', {
          headers: {
            Authorization: getCookie('token'),
          },
          params: {
            page: this.currentPage, //当前页
            rows: 25, //每页数量
          }
        })
          .then(res => {
            this.infoData = res.data.data.list;
            this.dataTotal = res.data.data.total;
          })
      },

      //获取用户选了哪个icon
      handleCurrentChange: function (currentRow) {
        this.current_url = currentRow.url;
        this.current_id = currentRow.id;
        console.log(this.current_url);
        console.log(this.current_id);
      },

      //点击确定
      icon_ok: function () {
        $('#myModal_icon').modal('toggle');
        debugger;
        if (this.current == "icon") {
          this.LogoUrl = this.current_url;
        } else if (this.current == "image") {
          this.ImageUrl = this.current_url;
          this.ImageId = this.current_id;
        }
      },

      //提交
      new_submit: function (e) {

        this.$validator.validateAll().then((result) => {
          if (result) {
            var url;
            if (this.$route.query.id > 0) {
              url = "ad/update";
            } else {
              url = "ad/add";
            }
            if (this.LogoUrl == "") {
              this.$message({
                message: 'logo cannot be empty',
                type: 'error',
                duration: 1800
              });
            } else if (this.imageUrl == "" && this.value_appShowType != 50001) {
              this.$message({
                message: 'Image cannot be empty',
                type: 'error',
                duration: 1800
              });
            } else {
              let adEntity = {
                id: this.$route.query.id > 0 ? this.$route.query.id : "",
                name: this.name,
                adType: this.tab, //第一期只做Native
                cta: this.value,
                description: this.Native_descript,
                iconUrl: this.LogoUrl,
                imageUrl: this.value_appShowType == 50001 ? "" : this.ImageUrl,
                tbMediaId: this.value_appShowType == 50001 ? 0 : this.ImageId,
                size: this.size,
                status: this.status,
                tbAdSquadId: this.adSquad,
                title: this.Native_title,
                thirdUrl: this.thirdUrl,
                trackUrl: this.trackUrl,
              }
              if (this.$route.query.id > 0) {
                axios.put(url, adEntity)
                  .then(res => {
                    this.editAdCamplete(res);
                  })
              } else {
                axios.post(url, adEntity)
                  .then(res => {
                    this.editAdCamplete(res);
                  })
              }

            }
          }
        })
      },

      editAdCamplete: function (res) {
        if (res.data.status == 1) {
          this.$message({
            message: 'success',
            type: 'success',
            duration: 1800
          });
          setTimeout(() => {
            this.$router.push({
              path: "/ad"
            });
          }, 1850)
        }
      },

      //编辑的时候请求的数据
      edit_before: function () {
        axios.get('/ad/findById', {
          params: {
            id: this.$route.query.id
          }
        })
          .then(res => {
            this.name = res.data.data.name;
            this.status = res.data.data.status;
            this.adSquad = res.data.data.tbAdSquadId;
            this.trackUrl = res.data.data.trackUrl;
            this.thirdUrl = res.data.data.thirdUrl;
            this.Native_title = res.data.data.title;
            this.Native_descript = res.data.data.description;
            this.value = res.data.data.cta;
            this.size = res.data.data.size;
            this.ImageUrl = res.data.data.imageUrl;
            this.ImageUrl = res.data.data.imageUrl;
            this.ImageId = res.data.data.tbMediaId;
            this.LogoUrl = res.data.data.iconUrl;
            this.showOneIbox();
          })
      },

      /*判断是否显示第一个模板*/
      showOneIbox: function () {
        axios.get('/adSquad/findConfigById', {
          params: {
            id: parseInt(this.adSquad)
          }
        })
          .then(res => {
            if (res.data.status == 1) {
              if (this.targetPlatform != res.data.data.targetPlatform&&typeof(this.$route.query.id)=="undefined") {
                this.LogoUrl = "";
                this.ImageUrl = "";
              }
              this.value_appShowType = res.data.data.appShowType;
              this.targetPlatform = res.data.data.targetPlatform;
              this.mediaBuyId = res.data.data.tbMediaBuyId;
            }
          })
      }
    },
    // 判断编辑时的id
    created: function () {
      this.loadAdSquad()
      console.log(this.$route.query.id);
      if (this.$route.query.id > 0) {
        this.edit_before();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .m-hide {
    display: none;
  }

  .ibox-title h5 {
    line-height: 16px;
  }

  .float-e-margins .btn {
    margin-bottom: 0;
  }

  /* 弹出框按钮对齐 */

  .float-e-margins .btn {
    margin-bottom: 5px !important;
  }

  /* 面包屑 */

  .page-heading {
    margin-top: -20px;
    margin-left: -25px;
    margin-right: -25px;
    margin-bottom: 20px;
  }

  /* 开关 */

  .switch {
    margin-top: 6px;
  }

  /* Native */

  .Native .icon {
    width: 100px;
    height: 100px;
    border: 1px solid #eee;
  }

  .Native .icon img {
    width: 100%;
    height: 100%;
  }

  .Native .image {
    width: 200px;
    height: 200px;
    border: 1px solid #eee;
  }

  .Native .image img {
    width: 100%;
    height: 100%;
  }

  /* 左对齐 */

  .left {
    width: 100px;
    text-align: left;
  }

  /* 选择creative的列表图片 */

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

  .disabled {
    pointer-events: none;
    cursor: default;

  }

</style>
