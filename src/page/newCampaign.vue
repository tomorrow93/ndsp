<template>
   <div>
        <!-- 面包屑 -->
        <div class="row wrapper border-bottom white-bg page-heading">
            <div class="col-lg-10">
                <h2>Campaign</h2>
                <ol class="breadcrumb">
                    <li>
                        <router-link to="/">Home</router-link>
                    </li>
                    <li>
                        <router-link to="/campaign">Campaign</router-link>
                    </li>
                    <li class="active">
                        <strong>New Campaign</strong>
                    </li>
                </ol>
            </div>
        </div>

        <!-- body -->
        <div class="ibox float-e-margins animated fadeInRight">
            <div class="ibox-title">
                <h5>Budget</h5>
            </div>
            <div class="ibox-content">
                <div class="form-horizontal">
                    <!-- Name -->
                    <div class="form-group">
                        <label class="col-sm-2 control-label"><i class="star">*</i>Campaign Name</label>
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
                        <label class="col-sm-2 control-label">{{$t("m.Form.Status")}}</label>
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
                    
                    <!-- 总预算 -->
                    <div class="form-group">
                        <label class="col-sm-2 control-label"><i class="star">*</i>{{$t("m.Form.TotalBudget")}}</label>
                        <div class="col-sm-2">
                            <input
                                type="text"
                                class="form-control"
                                v-model="BudgetOverall"
                                v-validate="'required|number'"
                                name="vee-total"
                                autocomplete="off">
                            <div v-if="errors.first('vee-total')" class="tip">{{ errors.first('vee-total') }}</div>
                        </div>
                        <span style="line-height:34px">$USD</span>
                    </div>
                    <div class="hr-line-dashed"></div>

                    <!-- 日预算 -->
                    <div class="form-group">
                        <label class="col-sm-2 control-label"><i class="star">*</i>{{$t("m.Form.DailyBudget")}}</label>
                        <div class="col-sm-2">
                            <input
                                type="text"
                                class="form-control"
                                v-model="BudgetDaily"
                                v-validate="'required|number'"
                                name="vee-daliy"
                                autocomplete="off">
                            <div v-if="errors.first('vee-daliy')" class="tip">{{ errors.first('vee-daliy') }}</div>
                        </div>
                        <span style="line-height:34px">$USD</span>
                    </div>
                    <div class="hr-line-dashed"></div>
                   
                    <!-- mediabuy -->
                    <div v-if="ifshow('campaign:mediabuy')">
                        <div class="form-group">
                            <label class="col-sm-2 control-label"><i class="star">*</i>MediaBuyer</label>
                            <div class="col-sm-9">
                                <el-select 
                                    v-model="mediabuy" 
                                    filterable 
                                    placeholder="Select" 
                                    @focus.once="loadMediabuyer()" 
                                    @change="chanMediabuyer()"
                                    style="width: 100%" 
                                    v-validate="'required'" 
                                    name="vee-mediabuy">
                                    <el-option width="100%" v-for="item in list_mediabuy" :key="item.value" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                                <div v-if="errors.first('vee-mediabuy')" class="tip">{{ errors.first('vee-mediabuy') }}</div>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                    </div>

                    <!-- advertiser -->
                    <div v-if="ifshow('campaign:advertiser')">
                        <div class="form-group">
                            <label class="col-sm-2 control-label"><i class="star">*</i>{{$t("m.Form.Advertiser")}}</label>
                            <div class="col-sm-9">
                                <el-select 
                                    v-model="advertiser" 
                                    filterable 
                                    placeholder="Select" 
                                    style="width: 100%" 
                                    name="vee-advertiser"
                                    v-validate="'required'" 
                                    @click="loadAdvertiser()">
                                    <el-option
                                        width="100%"
                                        v-for="item in list_advertiser"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                                <div v-if="errors.first('vee-advertiser')" class="tip">{{ errors.first('vee-advertiser') }}</div>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                    </div>
                    

                    <!-- 提交 -->
                    <div class="form-group">
                        <div class="col-sm-4 col-sm-offset-2">
                            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">{{$t("m.Btn.Save")}}</button>
                            <button type="button" class="btn btn-default" style="margin-left:10px" @click="toCampaign()">{{$t("m.Btn.Back")}}</button>
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
                        <button type="button" class="btn btn-default" data-dismiss="modal">{{$t("m.Btn.Cancel")}}</button>
                        <button type="button" class="btn btn-primary" data-dismiss="modal" @click="new_submit()">{{$t("m.Btn.Confirm")}}</button>
                    </div>
                </div>
            </div>
        </div>
   </div>
</template>

<script>
import {formatDate} from '@/assets/js/date.js'
import {convert} from '@/assets/js/common.js'
import {setCookie,getCookie,delCookie} from '@/assets/js/cookie.js'
import axios from 'axios'
export default {
    data () {
        return {
            //表单
            name:"", 
            status:1, 
            BudgetOverall:"", //总预算
            BudgetDaily:"", //日预算
            list_advertiser:[], 
            list_mediabuy:[], 
            advertiser:"", 
            mediabuy:"", 
            
            //其他
            permission:[],
        }
    },
    mounted:function(){
        //读取localStorage
        var storage = window.localStorage;
        this.permission = storage.getItem("ifshow");
        
        //当角色是midiaBuy时自动加载广告主下拉框
        if (!this.ifshow('campaign:mediabuy')) {
            this.loadAdvertiser();
        }
    },
    methods:{
        //加载mediabuyer
        loadMediabuyer:function(){
            axios.get('/mediaBuy/select2')
            .then( res =>{
                if( res.data.status == 1){
                    this.list_mediabuy = res.data.data;
                }
            })         
        },
        
        //mediabuyer改变加载广告主
        chanMediabuyer:function(){
            this.loadAdvertiser();
        },
        
        //加载广告主
        loadAdvertiser: function () {
            this.advertiser = "";
            axios.get('/advertiser/select2', {
                params: {
                    tbMediaBuyId: this.mediabuy
                }
            })
            .then(res => {
                if (res.data.status == 1) {
                    this.list_advertiser = res.data.data;
                }
            })
        },

        //返回
        toCampaign:function(){
            this.$router.go(-1);
        },

        //提交
        new_submit:function(){
            this.$validator.validateAll().then((result) => {
                if (result){
                    axios.post('/campaign/add',{
                        name:this.name,
                        status:this.status,
                        budgetOverall:this.BudgetOverall,
                        budgetDaily:this.BudgetDaily,
                        tbMediaBuyId:this.mediabuy,
                        tbAdvertiserId:this.advertiser
                    })
                    .then(res=>{
                        if(res.data.status == 1){
                            this.$message({
                                message: this.$t("m.Msg.New_success"),
                                type: 'success',
                                duration:1800
                            });
                            setTimeout(()=>{
                                this.$router.push({path:"/campaign"});
                            },1850)
                        }
                        else
                        {
                            this.$message({
                                message: this.$t("m.Msg.Failed"),
                                type: 'error',
                                duration:1800
                            });
                        }
                    })
                }
             })
        },

        //判断是否有权限
        ifshow:function(per){
            if(this.permission.indexOf(per)>0){
                return true;
            }else{
                return false;
            }
        },
    },
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
</style>
