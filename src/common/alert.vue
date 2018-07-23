<!-- 弹出层 -->
<template>
    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">提示</h4>
                </div>
                <!-- 弹窗内容 -->
                <div class="modal-body">
                    <h4 class="m-alert">{{msg}}</h4>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-dismiss="modal">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'alert',
    props:['msg'],
    data () {
        return {

        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .m-alert{
        font-weight: normal;
    }
</style>
