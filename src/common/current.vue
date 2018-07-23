<template>
    <!-- link -->
    <div class="row wrapper border-bottom white-bg page-heading lr-25px">
        <div class="col-lg-10">
            <h2>{{current}}</h2>
            <ul class="breadcrumb">
                <li>
                    <router-link to="/">Home</router-link>
                </li>
                <li class="active">
                    <strong>{{current}}</strong>
                </li>
            </ul>
        </div>
        <div class="col-lg-2"></div>
    </div>
</template>

<script>
export default {
    name: 'current',
    props:['current'],
    data () {
        return {

        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .page-heading{
        margin-top: -20px;
        margin-bottom: 20px;
    }
    .lr-25px{
        margin-left: -25px;
        margin-right: -25px;
    }
</style>
