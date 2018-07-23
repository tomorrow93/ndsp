<!-- 左侧导航 -->
<template>
    <nav class="navbar-default navbar-static-side" role="navigation">
        <div class="sidebar-collapse">
            <ul class="nav metismenu" id="side-menu">
                <li class="nav-header">
                    <div class="dropdown profile-element" id="showMenu">
                        <!-- 头像 -->
                        <span>
                            <img alt="image" class="img-circle" src="../../static/images/logo.png" />
                        </span>
                        <a data-toggle="dropdown" class="dropdown-toggle" href="#">
                            <span class="clear">
                                <span class="block m-t-xs">
                                    <strong class="font-bold">HIVE  DSP</strong>
                                </span>
                            </span>
                        </a>
                    </div>
                    <div class="logo-element">HIVE</div>
                </li> 
                <li v-for="navigation in navData">
                    <router-link :to="{path:navigation.path}">
                        <i class="fa" :class="navigation.icon"></i> 
                        <span class="nav-label">{{navigation.name}}</span>
                        <span class="fa arrow" v-if="navigation.children"></span>
                    </router-link>
                    <ul class="nav nav-second-level collapse">
                        <li v-for="navChildren in navigation.children" v-if="navigation.children"><router-link :to="{path:navChildren.path}">{{navChildren.name}}</router-link></li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
</template>
<script>
//bootstrap
import '@/assets/js/jquery.min.js' 
import '@/assets/js/bootstrap.min.js' 
//菜单缩进 + 多级导航
import '@/assets/js/jquery.metisMenu.js'
import '@/assets/js/jquery.slimscroll.min.js'
import '@/assets/js/inspinia.js'
import '@/assets/js/pace.min.js'
    
export default {
    name: 'left',
    data () {
        return {
            navData:[
                {
                    name:"权限管理",
                    icon:"fa-sitemap",
                    path:"/permissions"
                },               
                {
                    name:"菜单管理",
                    icon:"fa-th-large",
                    path:"/menu"
                },
                {
                    name:"角色管理",
                    icon:"fa-address-card-o",
                    path:"/roles"
                },                
                {
                    name:"账号管理",
                    icon:"fa-laptop",
                    path:"/account"
                },      
                {
                    name:"代理管理",
                    icon:"fa-user",
                    path:"/agent"
                },
                {
                    name:"广告主管理",
                    icon:"fa-pie-chart",
                    path:"/advertiser"
                },                
                {
                    name:"Ad管理",
                    icon:"fa-edit",
                    path:"/ad"
                },                
                {
                    name:"素材审核",
                    icon:"fa-diamond",
                    path:"/mediaCheck"
                },                
                {
                    name:"mediabuy",
                    icon:"fa-diamond",
                    path:"/mediabuy"
                },                
                {
                    name:"测试",
                    icon:"fa-edit",
                    children:[
                        {
                            name:"测试1",
                            path:"/"
                        },
                        {
                            name:"测试2",
                            path:"/"
                        }
                    ]
                }
            ]
        }
    },
    mounted:function(){
        //读取localStorage
        var storage = window.localStorage;
        var dd = storage.getItem("menu");
        this.navData = JSON.parse(dd);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .nav-header {
        padding: 33px 25px;
        background-image: url("../../static/images/header-profile.png");
        text-align: center;
    }
    .font-bold{
        color: #333;
        font-size: 14px;
    }
</style>
