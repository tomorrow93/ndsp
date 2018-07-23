<template>
    <div class="gray-bg">
        <div class="middle-box text-center loginscreen animated fadeInDown">
            <div>
                <div>
                    <h1 class="logo-name">DSP</h1>
                </div>
                <h3>Login to DSP</h3>
                <form class="m-t" @submit.prevent="onSubmit">
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="Username" v-model="username">
                    </div>
                    <div class="form-group">
                        <input type="password" class="form-control" placeholder="Password" v-model="password">
                    </div>
                    <p class="red">{{hint}}</p>
                    <button type="submit" class="btn btn-primary block full-width m-b">Login</button>
                </form>
                <p class="m-t m-white"> <small>Inspinia we app framework base on DSP &copy; 2018</small> </p>
            </div>
        </div>
    </div>
</template>

<script>
import '@/assets/js/jquery.min.js'
import '@/assets/js/bootstrap.min.js'
//菜单缩进 + 多级导航
import '@/assets/js/jquery.metisMenu.js'
import '@/assets/js/jquery.slimscroll.min.js'
import '@/assets/js/inspinia.js'
import '@/assets/js/pace.min.js'
import axios from 'axios'
import {setCookie,getCookie,delCookie} from '@/assets/js/cookie.js'
export default {
    name: 'Login',
    data () {
        return {
            username:"",
            password:"",
            hint:"",
            token:""
        }
    },
    methods:{
        onSubmit:function(){
            if(this.username == "" || this.password == ""){
                this.hint = "不能为空";
            }
            else{
                var userData = new FormData();
                userData.append("email", this.username); //账号
                userData.append("password", this.password); //密码
                axios.post('/user/login',userData,{
                    headers: {
                        'Content-type': 'multipart/form-data'
                    }
                })
                .then( res => {
                    console.log(res)
                    if( res.data.status == 0 ){
                        this.hint = "请求参数异常";
                    }
                    //登录成功
                    else if( res.data.status == 1 ){
                        //账号、token存于cookie
                        this.token = res.data.data.token;
                        setCookie('username',this.username);
                        setCookie('token',this.token);

                        //菜单存于localStorage
                        var storage = window.localStorage;
                        storage.clear();
                        storage.setItem("menu",JSON.stringify(res.data.data.menus));

                        //权限存于localStorage
                        storage.setItem("ifshow",JSON.stringify(res.data.data.permissions));

                        //跳至首页
                        this.$router.push('/');
                    }
                    else if( res.data.status == 2 ){
                        this.hint = "用户已被锁定";
                    }
                    else if( res.data.status == 3 ){
                        this.hint = "用户审核中";
                    }
                    else if( res.data.status == 4 ){
                        this.hint = "用户不存在或密码错误";
                    }
                })
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    body{
        background-color: #f3f3f4!important;
    }
    .gray-bg, .bg-muted{
        background-color: #f3f3f4;
    }
    .red{
        color: red;
        text-align: left;
    }
</style>
