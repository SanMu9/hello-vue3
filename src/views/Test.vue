<template>
  <div></div>
</template>

<script>
export default {
    data() {
        return {
            DataItem:[
                {
                    key: 1,
                    name: 'John Brown sr.',
                    age: 60,
                    address: 'New York No. 1 Lake Park',
                    children: [
                    {
                        key: 11,
                        name: 'John Brown',
                        age: 42,
                        address: 'New York No. 2 Lake Park',
                    },
                    {
                        key: 12,
                        name: 'John Brown jr.',
                        age: 30,
                        address: 'New York No. 3 Lake Park',
                        children: [
                        {
                            key: 121,
                            name: 'Jimmy Brown',
                            age: 16,
                            address: 'New York No. 3 Lake Park',
                        },
                        ],
                    },
                    {
                        key: 13,
                        name: 'Jim Green sr.',
                        age: 72,
                        address: 'London No. 1 Lake Park',
                        children: [
                        {
                            key: 131,
                            name: 'Jim Green',
                            age: 42,
                            address: 'London No. 2 Lake Park',
                            children: [
                            {
                                key: 1311,
                                name: 'Jim Green jr.',
                                age: 25,
                                address: 'London No. 3 Lake Park',
                            },
                            {
                                key: 1312,
                                name: 'Jimmy Green sr.',
                                age: 18,
                                address: 'London No. 4 Lake Park',
                            },
                            ],
                        },
                        ],
                    },
                    ],
                },
                {
                    key: 2,
                    name: 'Joe Black',
                    age: 32,
                    address: 'Sidney No. 1 Lake Park',
                },
            ]
        }
    },
    methods:{
        addIndex(data){
            for(let i=0;i<data.length;i++){
                data[i].isFirst = false;
                data[i].isLast = false;
                if(i===0){
                    data[i].isFirst = true
                }
                if(i === data.length-1){
                    data[i].isLast = true
                }
                if(data[i].children&&data[i].children.length>0){
                    addIndex(data[i].children)
                }
            }
        }
    },
    mounted(){
        this.addIndex(this.DataItem);
        console.log(this.DataItem)
    }
}
</script>

<style>

</style>