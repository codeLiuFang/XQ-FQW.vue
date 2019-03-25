<template>
  <div class="wrap">
    <h4>如要备份，请参考以下路径：</h4>
    <div class="wrap1">
      <span class="dataurl">数据路径</span>
      <p class="p1">{{dataPath}}</p>
    </div>
    <div class="wrap2">
      <span class="picurl">图片路径</span>
      <p class="p2">{{picturePath}}</p>
    </div>
  </div>
</template>
<script>
import axios from '@/utils/request'
export default {
  name: 'dashboard-admin',
  data() {
    return {
      dataPath: '',
      picturePath: ''
    }
  },
  created: function() {
    this.loadData()
  },
  methods: {
    // 从服务器读取数据
    loadData: function() {
      axios.get('/backPath').then((response) => {
        if (response.data.msg === 'success') {
          var data = response.data.data
          this.dataPath = data.dataPath
          this.picturePath = data.picturePath
        }
      })
    }
  }
}
</script>
<style>
.wrap {
  padding-left: 20px;
}
.wrap1 {
  height: 100px;
}
.p1,
.p2 {
  color: #f56c6c;
  font-size: 16px;
  font-weight: bold;
  padding-top: 10px;
}
.dataurl,
.picurl {
  color: #409eff;
  font-size: 18px;
}
</style>
