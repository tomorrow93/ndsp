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
                <h5>New Ad</h5>
            </div>
            <div class="ibox-content">
                <div class="form-horizontal">
                    <!-- Name -->
                    <div class="form-group">
                        <label class="col-sm-2 control-label"><i class="star">*</i>Name</label>
                        <div class="col-sm-9">
                            <input
                                type="text"
                                class="form-control"
                                v-model="name"
                                v-validate="'required|min:2|max:16'"
                                name="vee-name"
                                autocomplete="off">
                            <div v-if="errors.first('vee-name')" class="tip">{{ errors.first('vee-name') }}</div>
                        </div>
                    </div>
                    <div class="hr-line-dashed"></div>

                    <!-- Status -->
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Status</label>
                        <div class="col-sm-9">
                            <el-switch
                                class="switch"
                                v-model="status"
                                :active-value="1"
                                :inactive-value="0">
                            </el-switch>
                        </div>
                    </div>
                    <div class="hr-line-dashed"></div>

                    <!-- Ad Squad -->
                    <div class="form-group">
                        <label class="col-sm-2 control-label"><i class="star">*</i>Ad Squad</label>
                        <div class="col-sm-9">
                            <el-select v-model="adSquad" filterable remote :remote-method="loadAdSquad" placeholder="Search.." style="width: 100%" v-validate="'required'" name="vee-adSquad">
                                <el-option
                                    width="100%"
                                    v-for="item in list_adSquad"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                            <div v-if="errors.first('vee-adSquad')" class="tip">{{ errors.first('vee-adSquad') }}</div>
                        </div>
                    </div>
                    <div class="hr-line-dashed"></div>

                    <!-- Tracking Link -->
                    <div class="form-group">
                        <label class="col-sm-2 control-label"><i class="star">*</i>Tracking Link</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" v-model="trackUrl" v-validate="'required|url'" name="vee-trackUrl" autocomplete="off">
                            <div v-if="errors.first('vee-trackUrl')" class="tip">{{ errors.first('vee-trackUrl') }}</div>
                        </div>
                    </div>
                    <div class="hr-line-dashed"></div>

                    <!-- thirdUrl -->
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Third Link</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" v-model="thirdUrl" v-validate="'url'" name="vee-thirdUrl" autocomplete="off">
                            <div v-if="errors.first('vee-thirdUrl')" class="tip">{{ errors.first('vee-thirdUrl') }}</div>
                        </div>
                    </div>
                    <div class="hr-line-dashed"></div>

                    <!-- Ad Type -->
                    <div class="form-group">
                        <label class="col-sm-2 control-label"><i class="star">*</i>Ad Type</label>
                        <div class="col-sm-9">
                            <!-- 选项卡 -->
                            <el-radio-group v-model="tab" size="medium" style="margin-bottom:15px">
                              <el-radio-button
                                  v-for="item in list_adType"
                                  :key="item.name"
                                  :label="item.name"
                                  :value="item.name">
                              </el-radio-button>
                            </el-radio-group>
                            <!-- Native -->
                            <div v-if="this.tab == 'native'">
                                <!-- Name -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label left"><i class="star">*</i>Title</label>
                                    <div class="col-sm-5">
                                        <input
                                            type="text"
                                            class="form-control"
                                            v-model="Native_title"
                                            v-validate="'required|min:2|max:16'"
                                            name="vee-title"
                                            autocomplete="off"
                                            onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ ]/g,'')">
                                        <div v-if="errors.first('vee-title')" class="tip">{{ errors.first('vee-title') }}</div>
                                    </div>
                                </div>
                                <!-- Description -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label left"><i class="star">*</i>Description</label>
                                    <div class="col-sm-5">
                                        <input type="text" class="form-control" v-model="Native_descript" v-validate="'required|min:2|max:16'" name="vee-descript" autocomplete="off">
                                        <div v-if="errors.first('vee-descript')" class="tip">{{ errors.first('vee-descript') }}</div>
                                    </div>
                                </div>
                                <!-- cta -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label left"><i class="star">*</i>CTA</label>
                                    <div class="col-sm-5">
                                        <input type="text" class="form-control" v-model="cta" v-validate="'required|min:2|max:16'" name="vee-Tracking" autocomplete="off">
                                        <div v-if="errors.first('vee-Tracking')" class="tip">{{ errors.first('vee-Tracking') }}</div>
                                    </div>
                                </div>
                                <!-- Size -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label left"><i class="star">*</i>Size</label>
                                    <div class="col-sm-5">
                                        <el-select v-model="size" style="width: 100%">
                                            <el-option
                                                width="100%"
                                                v-for="item in list_size"
                                                :key="item.value"
                                                :label="item.name"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </div>
                                <!-- Icon -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label left"><i class="star">*</i>Icon</label>
                                    <div class="col-sm-5 Native">
                                        <div class="icon" data-toggle="modal" data-target="#myModal_icon" @click="loadCreative('icon')">
                                            <img :src="icon_url" v-if="this.icon_url">
                                            <img src="../../static/images/upload.jpg" v-if="this.icon_url == ''">
                                        </div>
                                    </div>
                                </div>
                                <!-- Image -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label left"><i class="star">*</i>Image</label>
                                    <div class="col-sm-5 Native">
                                        <div class="image" data-toggle="modal" data-target="#myModal_icon" @click="loadCreative('image')">
                                            <img :src="icon_image" v-if="this.icon_image">
                                            <img src="../../static/images/upload.jpg" v-if="this.icon_image == ''">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="hr-line-dashed"></div>

                    <!-- 提交 -->
                    <div class="form-group">
                        <div class="col-sm-4 col-sm-offset-2">
                            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">Submit</button>
                            <button type="button" class="btn btn-default" style="margin-left:10px" @click="toCampaign()">Back</button>
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
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="myModalLabel">Hint</h4>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to submit it?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" data-dismiss="modal" @click="new_submit($event)">Confirm</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 弹出icon选择框 -->
        <div class="modal fade" id="myModal_icon" tabindex="-1" role="dialog" style="width:90%">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="myModalLabel">Please Select...</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal">
                            <el-table
                                class="table"
                                :data="infoData"
                                style="width: 100%"
                                height="250"
                                highlight-current-row
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
                            <el-pagination
                                layout="prev, pager, next"
                                @current-change="changePage"
                                :page-size="pageNumber"
                                :current-page="currentPage"
                                :total="dataTotal">
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
</template>

<script>
import {formatDate} from '@/assets/js/date.js'
import {convert,setImagePreviews,objOfPropertyToArr} from '@/assets/js/common.js'
import {setCookie,getCookie,delCookie} from '@/assets/js/cookie.js'
import axios from 'axios'
export default {
    data () {
        return {
            //表单
            name:"",
            status:1,
            cta:"",
            tab:"", //选项卡,默认Native
            adSquad:"",
            list_adSquad:[],
            size:"",
            list_size:[],
            list_adType:[],
            trackUrl:"",
            thirdUrl:"",

            //Native
            Native_title:"",
            Native_descript:"",
            current:"",

            //icon
            current_url:"",
            icon_url:"",
            infoData:[],

            //image
            icon_image:"",
            image_url:"",

            //分页
            pageNumber:25, //默认每页数量
            currentPage:1, //当前页
            dataTotal:1, //数据总数

            //其他
            permission:[],
            currentID:"",
        }
    },
    mounted:function(){
        //读取localStorage
        var storage = window.localStorage;
        this.permission = storage.getItem("ifshow");

        //size
        axios.get('/option/select2AdSize',{
            headers : { //token
                Authorization : getCookie('token')
            },
        })
        .then( res =>{
            if( res.data.status == 1){
                this.list_size = res.data.data;
            }
        })

        //size
        axios.get('/option/select2AdType',{
          headers : { //token
            Authorization : getCookie('token')
          },
        })
          .then( res =>{
            if( res.data.status == 1){
              this.list_adType = res.data.data;
              if (this.list_adType != null && this.list_adType.length > 0) {
                for(var i=0;i<this.list_adType.length;i++){
                  if('native' == this.list_adType[i].name){
                    this.tab="native";
                    break;
                  }
                }
              }
            }
          })


        //查询
        axios.get('/ad/findById',{
            headers : { //token
                Authorization : getCookie('token')
            },
            params:{
                id:this.currentID
            }
        })
        .then(res=>{
            this.name = res.data.data.name;
            this.status = res.data.data.status;
            this.adSquad = res.data.data.tbAdSquadId;
            this.trackUrl = res.data.data.trackUrl;
            this.thirdUrl = res.data.data.thirdUrl;
            this.Native_title = res.data.data.title;
            this.Native_descript = res.data.data.description;
            this.cta = res.data.data.cta;
            this.size = res.data.data.size;
            this.icon_url = res.data.data.iconUrl;
            this.icon_image = res.data.data.imageUrl;
        })
    },
    methods:{
        //判断是否有权限
        ifshow:function(per){
            if(this.permission.indexOf(per)>0){
                return true;
            }else{
                return false;
            }
        },

        //返回
        toCampaign:function(){
            this.$router.push({path:"/ad"});
        },

        //加载AdSquad
        loadAdSquad:function(query){
            axios.get('/adSquad/select2',{
                headers : { //token
                    Authorization : getCookie('token')
                },
                params:{
                    keyword:query
                }
            })
            .then( res =>{
                if( res.data.status == 1){
                    this.list_adSquad = res.data.data;
                }
            })
        },

        //加载icon creative
        loadCreative:function(value){
            this.current = value;
            console.log(this.current);
            axios.get('/media/list',{
                headers : { //token
                    Authorization : getCookie('token')
                },
                params:{
                    rows:25,  //每页数量
                    page:1,  //当前页
                    type:1, //图片
                }
            })
            .then( res =>{
                if( res.data.status == 1){
                    this.infoData = res.data.data.list;
                }
            })
        },

        //分页
        changePage:function(currentPage){
            this.currentPage = currentPage;
            axios.get('/media/list',{
                headers: {
                    Authorization : getCookie('token'),
                },
                params:{
                    page:this.currentPage,  //当前页
                    rows:25, //每页数量
                }
            })
            .then(res=>{
                this.infoData = res.data.data.list;
                this.dataTotal = res.data.data.total;
            })
        },

        //获取用户选了哪个icon
        handleCurrentChange:function(currentRow){
            this.current_url = currentRow.url;
            console.log(this.current_url);
        },

        //点击确定
        icon_ok:function(){
            $('#myModal_icon').modal('toggle');
            if(this.current == "icon"){
                this.icon_url = this.current_url;
            }
            else if(this.current == "image"){
                this.icon_image = this.current_url;
            }
        },

        //提交
        new_submit:function(e){
            this.$validator.validateAll().then((result) => {
                if (result) {
                    if(this.icon_url == ""){
                        this.$message({
                            message: 'Icon cannot be empty',
                            type: 'error',
                            duration:1800
                        });
                    }
                    else if(this.icon_image == ""){
                        this.$message({
                            message: 'Image cannot be empty',
                            type: 'error',
                            duration:1800
                        });
                    }
                    else{
                        let adEntity = {
                            id:this.currentID,
                            name:this.name,
                            adType:this.tab, //第一期只做Native
                            cta:this.cta,
                            description:this.Native_descript,
                            iconUrl:this.icon_url,
                            imageUrl:this.icon_image,
                            size:this.size,
                            status:this.status,
                            tbAdSquadId:this.adSquad,
                            title:this.Native_title,
                            thirdUrl:this.thirdUrl,
                            trackUrl:this.trackUrl,
                        }
                        axios.put('/ad/update',adEntity,{
                            headers: {
                                Authorization : getCookie('token'),
                            },
                        })
                        .then( res =>{
                            if( res.data.status == 1){
                                this.$message({
                                    message: 'success',
                                    type: 'success',
                                    duration:1800
                                });
                                setTimeout(()=>{
                                    this.$router.push({path:"/ad"});
                                },1850)
                            }
                        })
                    }
                }
            })
        },
    },
    created:function(){
        this.currentID = this.$route.query.id;
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .ibox-title h5{
        line-height: 16px;
    }
    .float-e-margins .btn{
        margin-bottom: 0;
    }
    /* 弹出框按钮对齐 */
    .float-e-margins .btn{
        margin-bottom: 5px!important;
    }

    /* 面包屑 */
    .page-heading{
        margin-top: -20px;
        margin-left: -25px;
        margin-right: -25px;
        margin-bottom: 20px;
    }

    /* 开关 */
    .switch{
        margin-top: 6px;
    }

    /* Native */
    .Native .icon{
        width: 100px;
        height: 100px;
        border: 1px solid #eee;
    }
    .Native .icon img{
        width: 100%;
        height: 100%;
    }
    .Native .image{
        width: 200px;
        height: 200px;
        border: 1px solid #eee;
    }
    .Native .image img{
        width: 100%;
        height: 100%;
    }

    /* 左对齐 */
    .left{
        width: 100px;
        text-align: left;
    }

    /* 选择creative的列表图片 */
    .pic{
        width: 50px;
        height: 50px;
        background-color: #eee;
        overflow: hidden;
    }
    .pic img{
        width: 100%;
        height: 100%;
    }
</style>
