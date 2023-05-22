<template>
    <div class="my-router-nav">
        <div class="cur-router-wrapper">
            
        </div>
    </div>
</template>

<script>
export default {
    props:{
        routes:{
            type:Array,
            default:() => ([
                {}
            ])
        }
    }
}
</script>

<style lang="scss" scoped>
.my-router-nav{
    position: fixed;
    top: 30px;
    left: 30px;
    width: 120px;
    height: 32px;
    background: rgba($color: #000000, $alpha: 0.7);
    border: 1px solid #fff;
    opacity: 0.6;
    color: #fff;
    &:hover{
        opacity: 1;
    }
    .cur-router-wrapper{
        padding: 0 40px 0 15px;
    }
}
</style>