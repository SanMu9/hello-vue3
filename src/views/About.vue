<template>
  <div class="about">
    <h1>{{name}}</h1>
    <p>{{hobby}}</p>
    <p>{{msg}}</p>
  </div>
</template>
<script>
import PublicValues,{MsgTest} from "@/assets/js/publicValues.js";

export default {
    data(){
      return {
        name:PublicValues.name,
        hobby:PublicValues.hobby.join(','),
        msg:MsgTest
      }
    }
}
</script>

