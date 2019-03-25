<template>
  <div class="fbody">
    <iframe id="bdIframe" src="../../../../../static/query.html" width="98%" style="margin-left:20px; border: 0px; padding-top: 10px">
    </iframe>
  </div>
</template>

<script>

    export default {
        data() {
          return {

          }
        },
        created() {
           
        },
        mounted(){
            /**
             * iframe-宽高自适应显示   
             */
            const oIframe = document.getElementById('bdIframe');
            const deviceWidth = document.documentElement.clientWidth;
            const deviceHeight = document.documentElement.clientHeight;
            console.log(deviceHeight)
            //oIframe.style.width = (Number(deviceWidth)-220) + 'px'; //数字是页面布局宽度差值
            oIframe.style.height = (Number(deviceHeight)-150) + 'px'; //数字是页面布局高度差
        },
        methods: {
          
       }
    }
</script>

