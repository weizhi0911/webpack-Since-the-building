<template>
    <div>
        <input type="text" v-model="name" />
        <input type="text" v-model="pass" />
    </div>
</template>

<script>
export default {
    data(){
        return{
            name:"",
            pass:"",
        }
    },
    watch:{
name(val){
console.log(val)
}
    },
    created() {
        
    },
    methods: {
        
    },
}
</script>