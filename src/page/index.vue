<template>
    <div>
       <h3>Welcome to DSP.</h3>
    </div>
</template>

<script>
export default {
    data () {
        return{
            
        }
    },
    updated:function(){
        if(window.location.href=window.location.href){
            console.log(1111)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
