import axios from 'axios';
import {ref,onMounted,watch} from 'vue';


export default function getHobbyInfo(hobbyName,hobbyType){
    const hobbyDetails = ref([]);
    const info = ref("");
    const detailStr = ref("");

    const setInfo = () => {
        info.value = hobbyName.value?"SanMu喜欢的"+hobbyName.value+"有：":"尚未选择"
    }
    const getHobbyDetails = ()=>{
        return axios.get("/json/prefer.json").then(res => {
            res= res.data;
            hobbyDetails.value = hobbyType.value&&res[hobbyType.value]?res[hobbyType.value]:[];
            detailStr.value = hobbyDetails.value.join(',')
            return hobbyDetails
        }).catch(()=>{
            hobbyDetails.value = [];
            detailStr.value  = ""
            return hobbyDetails
        })
    }




    onMounted(()=>{
        setInfo();
    })
    watch(hobbyName,setInfo)
    watch(hobbyType,getHobbyDetails)


    return {
        info,
        hobbyDetails,
        detailStr,
        setInfo,
        getHobbyDetails
    }
}
