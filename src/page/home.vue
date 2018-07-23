<template>
    <div id="wrapper">
        <!-- 左侧导航 -->
        <left></left>
        
        <!-- right -->
        <div id="page-wrapper" class="gray-bg">
            <div class="row border-bottom">
                <nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0">
                    <div class="navbar-header">
                        <dd class="navbar-minimalize minimalize-styl-2 btn btn-primary" id="navbar-minimalize"><i class="fa fa-bars"></i> </dd>
                    </div>
                    <ul class="nav navbar-top-links navbar-right">
                        <!-- 用户名 -->
                        <li class="dropdown profile-element" id="showMenu" style="float:right">
                            <a data-toggle="dropdown" class="dropdown-toggle dropdown-middle" href="#" style="background-color:#f3f3f4">
                                <span class="clear">
                                    <span class="text-muted text-xs block none-bold">{{username}}<b class="caret"></b></span>
                                </span>
                            </a>
                            <ul class="dropdown-menu animated fadeInRight m-t-xs">
                                <li><a href="#" @click.prevent="exit()">Log out</a></li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
            <!-- 路由容器 -->
            <div class="wrapper wrapper-content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import left from '@/common/left' 
//bootstrap
import '@/assets/js/jquery.min.js' 
import '@/assets/js/bootstrap.min.js' 
//菜单缩进 + 多级导航
import '@/assets/js/jquery.metisMenu.js'
import '@/assets/js/jquery.slimscroll.min.js'
import '@/assets/js/inspinia.js'
import '@/assets/js/pace.min.js'
import {setCookie,getCookie,delCookie} from '@/assets/js/cookie.js'
export default {
    name: 'Home',
    data () {
        return {
            username:getCookie('username'),
            parent:"不能为空",
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
    components:{
        "left":left
    },
    mounted:function(){
        $('#side-menu').metisMenu();
        $('.navbar-minimalize').on('click', function (event) {
            event.preventDefault();
            $("body").toggleClass("mini-navbar");
            //SmoothlyMenu();
        });
    },
    methods:{
        //退出登录
        exit:function(){
            var storage = window.localStorage;
            storage.clear();
            delCookie('username');
            delCookie('token');
            this.$router.push('/login');
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #wrapper{
        background-color: #fff;
    }
    /* 去除加粗 */
    .none-bold{
        font-weight: normal;
    }
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
