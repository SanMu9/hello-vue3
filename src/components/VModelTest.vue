<template>
    
    <label for="lastNmaeInput">姓</label>
    <input type="text" id="lastNmaeInput" :value="lastName" @input="$emit('update:lastName',$event.target.value)">
    <br>
    <label for="firstNameInput">名</label>
    <input type="text" id="firstNameInput" :value="firstName" @input="$emit('update:firstName',$event.target.value)">
    <br>
    <label for="ageInput">年龄</label>
    <input type="number" id="ageInput" :value="age" @input="$emit('update:age',parseInt($event.target.value))">
    <br>
    <label for="gameInput">游戏</label>
    <input type="text" id="gameInput" :value="game" @input="updateGame">
    <br>
    <button type="submit" @click="submitHandler">Submit</button>
</template>

<script>
export default {
    props:{
        detail:{
            type:Object,
            default:()=>{return {height:0}}
        },
        firstName:{
            type:String,
        },
        lastName:String,
        game:String,
        age:Number,
      
    },
    emits:{
        'update:firstName':null,
        'update:lastName':null,
        'update:age':null,
        'update:game':null,

        'custom-submit':(age)=>{
            if(age<=0){
                console.error("age should be above zero")
                return false
            }
            return true;
        }
    },
    data(){
        return {
            details:this.detail
        }
    },
    methods:{
        updateGame(ev){
            this.$emit('update:game',ev.target.value)
        },
        // updateHeight(){
        //     console.log(this.detail)
        // },
        submitHandler(){
            this.details.height = 165;
            this.$emit('custom-submit',this.age)
        }
        // errorHandler(){
        //     alert("age error")
        // }
    }
};
</script>

<style>
</style>