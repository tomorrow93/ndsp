<template>
    <div>
        <current :current="'Creative'"></current>
        <div class="ibox float-e-margins animated fadeInRight">
            <div class="ibox-title">
                <h5>{{$t("m.Creative.Title")}}</h5>
                <div class="ibox-tools">
                    <button
                    class="btn btn-primary btn-sm"
                    data-toggle="modal"
                    data-target="#myModal"
                    v-if="ifshow('image:create')"
                    @click="iniCreate()">{{$t("m.Creative.Create")}}</button>
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
                            :placeholder="$t('m.Form.Label')">
                            <el-option
                                v-for="item in list_label"
                                :key="item.value"
                                :label="item.name"
                                :value="item.id"
                                height="30px">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="form-group m-mgright10" v-if="ifshow('image:status')">
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
                    <div class="form-group">
                        <button class="btn btn-primary" type="submit">{{$t("m.Btn.Search")}}</button>
                    </div>
                    <div class="form-group" v-if="ifshow('image:delete')">
                        <button
                            style="margin:0 0 10px 10px"
                            :disabled="checked.length == 0"
                            data-toggle="modal"
                            data-target="#myModal_deleteAll"
                            class="btn btn-default"
                            type="submit">{{$t("m.Btn.Delete")}}
                        </button>
                    </div>
                </form>

                <!-- 列表 -->
                <div class="image_list">
                    <div class="image_item" v-for="item in list_data">
                        <div class="posi" @click="editBefore(item.id)"></div>
                        <div class="pic">
                            <img :src=item.url>
                            <el-checkbox
                                :label="item.id"
                                v-model="checked"
                                v-if="ifshow('image:delete')">
                                <span></span>
                            </el-checkbox>
                        </div>
                        <div class="id">
                            <span class="left">No.{{item.id}}</span>
                            <span class="size">{{item.width}}*{{item.height}}</span>
                            <a href="#"
                                class="right"
                                @click.stop="current_id=item.id,openDelete()"
                                v-if="ifshow('image:delete')">
                                <i class="fa fa-trash" title="Delete"></i>
                            </a>
                        </div>
                    </div>
                    <div style="clear:both"></div>
                    <div v-if="list_data.length == 0" style="color:#888">No Data</div>
                </div>

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

                <!-- 新建 -->
                <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button
                                    type="button"
                                    class="close"
                                    data-dismiss="modal"
                                    aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 class="modal-title" id="myModalLabel">{{$t("m.Creative.New_title")}}</h4>
                            </div>
                            <!-- 弹窗内容 -->
                            <div class="modal-body">
                                <div class="form-horizontal">
                                    <!-- upload-->
                                    <div class="form-group">
                                        <label class="col-sm-2 control-label">{{$t("m.Form.Images")}}</label>
                                        <div class="col-sm-10">
                                            <div class="upload">
                                                <button class="btn btn-primary">
                                                    <i class="fa fa-picture-o"></i>
                                                    {{$t("m.Form.Upload")}}
                                                </button>
                                                <input type="file" multiple accept="image/png,image/gif,image/jpeg" @change="getFile($event)">
                                                <span>Select {{file_length}} pictures</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="hint" class="tip">{{hint}}</div>
                                    <div class="hr-line-dashed"></div>

                                    <!-- label -->
                                    <div class="form-group">
                                        <label class="col-sm-2 control-label" style="margin-top:4px">{{$t("m.Form.Label")}}</label>
                                        <div class="col-sm-10">
                                            <!-- 已选标签 -->
                                            <div class="form-control" style="cursor:text;height:auto;min-height:46px" @click="GetFocus()">
                                                <span class="tag" v-for="(item,index) in SelectLabel" @click="RemoveLabel(item.name,index)"><i class="el-icon-close"></i>{{item.name}}</span>
                                                <input
                                                    type="text"
                                                    class="label_input"
                                                    :placeholder="placeholder"
                                                    v-model.trim="label_keyword"
                                                    v-validate="'max:8'"
                                                    name="vee-max"
                                                    @keyup="loadLabel($event)">
                                                <div v-if="errors.first('vee-max')" class="tip">{{ errors.first('vee-max') }}</div>
                                            </div>
                                            <!-- 标签列表 -->
                                            <div v-if="showTab" class="hiddenAuto">
                                                <span
                                                    class="el-tag el-tag--warning tag-margin el-tag--medium"
                                                    v-for="(item,index) in list_label"
                                                    @click="GetLabel(item.name,index,item.id)">{{item.name}}
                                                </span>
                                            </div>
                                            <!-- 创建标签 -->
                                            <button
                                                class="btn btn-sm btn-white btn-margin"
                                                v-if="list_label.length == 0&&label_keyword.length>0"
                                                @click="CreateLabel()">Creation "{{label_keyword}}" Label
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal">{{$t("m.Btn.Cancel")}}</button>
                                <button type="button" class="btn btn-primary" data-dismiss="modal" @click="creation()">{{$t("m.Btn.Confirm")}}</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 编辑 -->
                <div class="modal fade" id="myModal_edit" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                              </button>
                                <h4 class="modal-title" id="myModalLabel">{{$t("m.Creative.Edit_title")}}</h4>
                            </div>
                            <!-- 弹窗内容 -->
                            <img :src="url" style="width:100%">
                            <div class="modal-body">
                                <div class="form-horizontal">
                                    <!-- label -->
                                    <div class="form-group">
                                        <label class="col-sm-2 control-label" style="margin-top:4px">{{$t("m.Form.Label")}}</label>
                                        <div class="col-sm-10">
                                            <!-- 已选标签 -->
                                            <div class="form-control" style="cursor:text;height:auto;min-height:46px" @click="GetFocus()">
                                                <span class="tag" v-for="(item,index) in SelectLabel" @click="RemoveLabel(item.name,index)"><i class="el-icon-close"></i>{{item.name}}</span>
                                                <input
                                                    type="text"
                                                    class="label_input"
                                                    :placeholder="placeholder"
                                                    v-model.trim="label_keyword"
                                                    v-validate="'max:8'"
                                                    name="vee-max"
                                                    @keyup="loadLabel($event)">
                                                <div v-if="errors.first('vee-max')" class="tip">{{ errors.first('vee-max') }}</div>
                                            </div>
                                            <!-- 标签列表 -->
                                            <div class="hiddenAuto" v-if="showTab">
                                                <span
                                                    class="el-tag el-tag--warning tag-margin el-tag--medium"
                                                    v-for="(item,index) in list_label"
                                                    v-if="ifSelect(SelectLabel,item.name)==false"
                                                    @click="GetLabel(item.name,index,item.id)">{{item.name}}
                                                </span>
                                            </div>
                                            <!-- 创建标签 -->
                                            <button
                                                class="btn btn-sm btn-white btn-margin"
                                                v-if="list_label.length == 0&&label_keyword.length>0"
                                                @click="CreateLabel()">Creation "{{label_keyword}}" Label
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal">{{$t("m.Btn.Cancel")}}</button>
                                <button
                                    type="button"
                                    class="btn btn-primary"
                                    data-dismiss="modal"
                                    @click="edit()"
                                    v-if="ifshow('image:edit')">{{$t("m.Btn.Confirm")}}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 删除 -->
                <div class="modal fade" id="myModal_delete" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                              </button>
                                <h4 class="modal-title" id="myModalLabel">{{$t("m.Creative.Delete_title")}}</h4>
                            </div>
                            <!-- 弹窗内容 -->
                            <div class="modal-body">
                                {{$t("m.Creative.Delete_text")}}
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal">{{$t("m.Btn.Cancel")}}</button>
                                <button type="button" class="btn btn-primary" data-dismiss="modal" @click="del()">{{$t("m.Btn.Confirm")}}</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 删除All -->
                <div class="modal fade" id="myModal_deleteAll" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                              </button>
                                <h4 class="modal-title" id="myModalLabel">{{$t("m.Msg.Hint")}}</h4>
                            </div>
                            <!-- 弹窗内容 -->
                            <div class="modal-body">
                                {{$t("m.Msg.Delete")}}
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal">{{$t("m.Btn.Cancel")}}</button>
                                <button type="button" class="btn btn-primary" data-dismiss="modal" @click="delAll()">{{$t("m.Btn.Confirm")}}</button>
                            </div>
                        </div>
                    </div>
                </div>
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
    inject: ['reload'], //注入依赖
    components: {
        "current": current
    },
    data() {
        return {
            label_keyword:"", //新建标签
            SelectLabel:[], //已选标签
            list_label:[], //后台数据,标签
            list_data:[], //后台数据，列表
            current_id:"", //当前id
            checked:[], //批量删除
            file:"", //图片上传
            file_length:"", //上传了多少张图片
            statusID:1,
            date:"", //创建时间
            ctr:"",
            url:"",
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
            pageNumber: 25, //默认每页数量
            pageNumbers: [25, 50, 75, 100], //每页显示多少条
            currentPage: 1, //当前页
            dataTotal: 1, //数据总数
            keyword:"",
            label:"",
            permission: [], //权限
            showTab:"", //控制标签显示隐藏
            placeholder:"Search",
            timeoutid:0,
            hint:"", //图片大于300k出现的提示
            orderType: 'desc',
        }
    },
    mounted:function(){
        //加载标签
        axios.get('/label/list',{
            params:{
                rows:1000, //不传分页排序用不了所以这里写死了
                page:1,
                orderBy:'id',
                orderType:'desc'
            }
        })
        .then(res => {
            this.list_label = res.data.data.list;
        })

        //列表
        this.search();

        //读取localStorage
        var storage = window.localStorage;
        this.permission = storage.getItem("ifshow");
    },
    methods:{
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

        //搜索
        search: function () {
            axios.get('/media/list', {
                params: {
                    rows: this.pageNumber, //每页数量
                    page: this.currentPage,  //页
                    keyword: this.keyword,
                    labelIds: this.label.join(','),
                    status:this.statusID,
                    orderType: this.orderType, //排序类型
                    orderBy:"id",
                }
            })
            .then(res => {
                this.list_data = res.data.data.list;
                this.dataTotal = res.data.data.total;
            })
        },

        //查询
        editBefore:function(id){
            this.SelectLabel = []; //已选标签清0
            this.showTab = ""; //为空则标签栏不显示
            $('#myModal_edit').modal('toggle');
            axios.get('/media/findById',{
                params:{
                    id:id
                }
            })
            .then(res => {
                this.current_id = res.data.data.id;
                this.edit_img = res.data.data.url;
                this.date = res.data.data.createTime;
                this.ctr = res.data.data.ctr;
                this.url = res.data.data.url;
                var selectLabelArray = [];
                for(var i=0;i<res.data.data.mediaLabelList.length;i++) {
                    var selectLabel = {
                        id:res.data.data.mediaLabelList[i].tbLabelId,
                        name:res.data.data.mediaLabelList[i].name
                    }
                    selectLabelArray.push(selectLabel);
                }
                this.SelectLabel = selectLabelArray;
                //控制placeholder显示隐藏
                this.placeholderFunc();
            })
        },

        //初始化创建
        iniCreate:function(){
            this.hint = "";
            this.SelectLabel = []; //已选标签清0
            this.showTab = ""; //标签默认不显示
        },

        //去重
        ifSelect:function(selectLabel,name){
            for(var i=0;i<selectLabel.length;i++) {
                if(selectLabel[i].name==name) {
                    return true;
                }
            }
            return false;
        },

        //键盘按下事件
        loadLabel:function(event){
            if(event.keyCode != 13){
                clearTimeout(this.timeoutid);
                var keyword =this.label_keyword;
                var SelectLabel = this.SelectLabel
                this.timeoutid = setTimeout(()=>{
                   axios.get('/label/select2',{
                        params:{
                            keyword:keyword
                        }
                    })
                    .then(res => {
                        if(res.data.data!=null) {
                            for(var i=res.data.data.length-1;i>=0;i--) {
                                var label = res.data.data[i];
                                if(SelectLabel != null){
                                    for(var j=0;j<SelectLabel.length;j++) {
                                        if(label.id==SelectLabel[j].id) {
                                            res.data.data.splice(i,1);
                                        }
                                    }
                                }
                            }
                        }
                        this.list_label = res.data.data; //有问题
                    })
                },500);
            }
        },

        //移除标签
        RemoveLabel:function(name,n){
            this.list_label.push({name:name});
            this.SelectLabel.splice(n,1);
        },

        //获取焦点
        GetFocus:function(){
            $(".label_input").focus();
            if($(".label_input").focus()){
                this.showTab = "s";
            }
            this.placeholderFunc();
        },

        //控制placeholder显示隐藏
        placeholderFunc:function(){
            if(this.SelectLabel.length == 0){
                this.placeholder = "Search";
            }
            else{
                this.placeholder = "";
            }
        },

        //选中标签
        GetLabel:function(name,n,id){
            this.label_keyword = ""; //输入框清空
            let obj = {
                "id":id,
                "name":name
            }
            this.SelectLabel.push(obj);
            this.list_label.splice(n,1);
            this.placeholderFunc(); //控制placeholder的显示隐藏
        },

        //创建标签
        CreateLabel:function(){
            axios.post('/label/add',{
                name:this.label_keyword,
                status:1,
                description:""
            })
            .then(res => {
                //创建成功
                if(res.data.status == 1){
                    axios.get('/label/list',{
                        params:{
                            rows:1000, //不传分页排序用不了所以这里写死了
                            page:1,
                            orderBy:'id',
                            orderType:'desc'
                        }
                    })
                    .then(res => {
                        this.label_keyword = "";
                        this.list_label = res.data.data.list;
                    })
                }
            })
        },

        //打开删除弹窗
        openDelete:function(){
            $('#myModal_delete').modal('toggle');
        },

        //删除
        del:function(){
            axios.get('/media/updateStatus', {
                params: {
                    ids: this.current_id,
                    status:0
                }
            })
            .then(res => {
                if (res.data.status == 1) {
                    this.$message({
                        message: this.$t("m.Msg.Delete_success"),
                        type: 'success',
                        duration: 1800
                    });
                    //重新刷新列表
                    axios.get('/media/list',{
                        params:{
                            status:1
                        }
                    })
                    .then(res => {
                        if (res.data.status == 1) {
                            this.list_data = res.data.data.list;
                        }
                    })
                }
            })
        },

        //删除All
        delAll:function(){
            axios.get('/media/updateStatus', {
                params: {
                    ids: this.checked.join(','),
                    status:0
                }
            })
            .then(res => {
                if (res.data.status == 1) {
                    this.checked = [];
                    this.$message({
                        message: this.$t("m.Msg.Delete_success"),
                        type: 'success',
                        duration: 1800
                    });
                    //重新刷新列表
                    axios.get('/media/list',{
                        params:{
                            status:1
                        }
                    })
                    .then(res => {
                        if (res.data.status == 1) {
                            this.list_data = res.data.data.list;
                        }
                    })
                }
            })
        },

        //获取input
        getFile:function(e){
            var flag = true; //多图上传有一张大于300k则为false
            for(var i=0;i<e.target.files.length;i++){
                //如果大于300k
                if(e.target.files[i].size>307200){
                    this.hint = "Please keep the file size is less than 300KB";
                    flag = false;
                }
            }
            //如果没有300k图片
            if(flag == true){
                this.file = e.target.files;
                this.file_length = e.target.files.length;
            }
        },

        //创建
        creation:function(){
            let formData = new FormData();
            //已选标签转为逗号分割
            var labelID = [];
            for(var k=0;k<this.SelectLabel.length;k++){
                labelID.push(this.SelectLabel[k].id);
            }
            formData.append('type', '1');
            formData.append('status', '1');
            formData.append('labelIds', labelID.join(','));
            //图片
            for(var i=0;i<this.file.length;i++){
                formData.append('file',this.file[i]);
            }
            //如果图片为空
            if(this.file == ""){
                this.$message({
                    message: this.$t("Please upload the picture"),
                    type: 'error',
                    duration: 1800
                });
            }
            else{
                axios.post('/media/add',formData,{
                    headers : {
                        'Content-type': 'multipart/form-data'
                    }
                })
                .then(res => {
                    //创建成功
                    if(res.data.status == 1){
                        this.$message({
                            message: this.$t("m.Msg.New_success"),
                            type: 'success',
                            duration: 1000
                        });
                        this.search();
                    }
                })
            }
        },

        //判断是否有权限
        ifshow: function (per) {
            if (this.permission.indexOf(per) > 0) {
                return true;
            }
            else {
                return false;
            }
        },

        //编辑
        edit:function(){
            var labelID = [];
            for(var k=0;k<this.SelectLabel.length;k++){
                labelID.push(this.SelectLabel[k].id);
            }
            axios.put('/media/update',{
                id:this.current_id,
                labelIds:labelID.join(',')
            })
            .then(res => {
                if (res.data.status == 1) {
                    this.$message({
                        message: this.$t("m.Msg.Delete_success"),
                        type: 'success',
                        duration: 1000
                    });
                    //重新刷新列表
                    setTimeout(()=>{
                        this.reload(); //刷新
                    },1010)
                }
            })
        }
    },
    //过滤器
    filters: {
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
        line-height: 25px;
    }

    .float-e-margins .btn {
        margin-bottom: 0;
    }
    .el-input .el-input__inner{
        height: 34px!important;
    }
    /* 标签 */
    .image_list{
        margin-bottom: 20px;
    }
    .image_item{
        position: relative;
    }
    .image_item:hover{
        border-color: #ccc;
        cursor: pointer;
    }
    .image_item .el-checkbox{
        position: absolute;
        top: 5px;
        right: -2px;
    }
    .tag{
        display: inline-block;
        padding: 4px;
        font-size: 12px;
        border: 1px solid #eee;
        border-radius: 4px;
        margin-right: 8px;
        margin-bottom: 4px;
        cursor: pointer;
    }
    .el-icon-close{
        color: #999;
        margin-right: 4px;
    }
    .tag-margin{
        margin-top: 10px;
        margin-right: 10px;
    }
    .el-tag:hover{
        background-color:rgba(230,162,60,.2);
        cursor: pointer;
        transition: all 0.3s;
    }
    .label_input{
        width: 45px;
        height: 32px;
        margin: 0;
        border: none;
        outline:none;
    }
    .btn-margin{
        margin-top: 10px;
    }

    /* 上传图片 */
    .upload{
        position: relative;
    }
    .upload button{
        position: absolute;
    }
    .upload input{
        position: absolute;
        height: 34px;
        width: 93px;
        opacity: 0;
        cursor: pointer;
    }
    .upload span{
        margin-left: 106px;
        line-height: 32px;
    }
    /* 尺寸 */
    .size{
        display: block;
        position: absolute;
        left: 50%;
        margin-left: -40px;
        width: 80px;
        text-align: center;
        font-weight: bold;
        color: #999;
    }

    /* 编辑图片 */
    .linh{
        line-height: 33px;
    }

    /* 解决冒泡 */
    .posi{
        position: absolute;
        width: 100%;
        height: 100px;
        opacity: 0;
    }
    /* 溢出隐藏 */
    .hiddenAuto{
        max-height: 200px;
        overflow: auto;
    }
</style>
