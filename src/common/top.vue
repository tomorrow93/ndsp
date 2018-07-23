<!-- 左侧导航 -->
<template>
    <div>
        <!-- 退出登录 -->
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
    </div>
</template>

<script>
import {setCookie,getCookie,delCookie} from '@/assets/js/cookie.js'
export default {
    name: 'top',
    data () {
        return {
            username:getCookie('username'),
        }
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
    },
    mounted:function(){
//        $("#navbar-minimalize").on("click",function(){
//            if($("#bodys").hasClass("mini-navbar")){
//                $("#bodys").removeClass("mini-navbar");
//            }else{
//                $("#bodys").addClass("mini-navbar");
//            }
//            
//        })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    /* 去除加粗 */
    .none-bold{
        font-weight: normal;
    }
</style>
