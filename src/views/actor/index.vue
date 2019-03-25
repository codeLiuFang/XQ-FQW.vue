<template>
  <div>
    <component :is="whichcomp" @toactorpermission="toactorpermission" @toactoruser="toactoruser" @toactor="toactor" :transdata="transdata"></component>
  </div>
</template>
<script>
import actor from './components/actor'
import actoruser from './components/actoruser'
import actorpermission from './components/actorpermission'
export default {
  components: {
    actor,
    actoruser,
    actorpermission
  },
  data() {
    return {
      whichcomp: 'actor',
      transdata: {}
    }
  },
  methods: {
    toactoruser(obj) {
      this.whichcomp = 'actoruser'
      this.transdata = obj
    },
    toactorpermission(obj) {
      this.whichcomp = 'actorpermission'
      this.transdata = obj
    },
    toactor() {
      this.whichcomp = 'actor'
    }
  }
}
</script>
