<template>
    <div id="app">
        <router-view v-if="isRouterAlive"></router-view>
    </div>
</template>

<script>
import {setCookie,getCookie,delCookie} from '@/assets/js/cookie.js'
export default {
    name: 'App',
    provide() {
        return{
            reload:this.reload 
        }  
    },
    data(){
        return {
            isRouterAlive:true
        }  
    },
    methods:{
        reload:function(){
            this.isRouterAlive = false;
            this.$nextTick(function(){ 
                this.isRouterAlive = true
            })
        }
    },
    mounted(){
        //不存在跳到登录页
        let uname = getCookie('username');
        let utoken = getCookie('token');
        if( uname == "" || utoken == ""){
            this.$router.push('/login');
        }
    }
}   
</script>

<style>
    .el-range-editor.is-active, .el-range-editor.is-active:hover{
        border-color: #f5d030;
    }
    
    /* 选项卡 */
    .el-radio-button__orig-radio:checked+.el-radio-button__inner{
        background-color:#f5d030;
        border-color: #f5d030;
        box-shadow:-1px 0 0 0 #f5d030;
        -webkit-box-shadow:-1px 0 0 0 #f5d030;
    }
    .el-radio-button__inner:hover{
        color:#f5d030;
    }
    
    /* textarea */
    .el-textarea__inner:focus{
        border-color:#F5D030;
    }
    .el-textarea__inner{
        border-radius:0;
    }
    
    /* 解决弹窗和下拉框冲突 */
    .el-select-dropdown{
        z-index: 10000;
    }
    .el-select-dropdown{
        z-index: 10030!important;
    } 
        
    /* 隐藏弹窗头部 */
    .el-dialog--center .el-dialog__body{
        padding: 15px;
    }
    .el-dialog__header{
        display: none!important;
    }
</style>
