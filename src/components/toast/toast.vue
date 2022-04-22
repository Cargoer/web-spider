<template>
  <transition name="toast">
    <div v-show="visible" class="toast" :style="toastPostion">
      {{ message }}
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      message: '',
      position: 'center'
    }
  },
  computed: {
    toastPostion() {
      switch(this.position) {
        case 'center':
          return 'top: 50%;'
        case 'top':
          return 'top: 20%;'
        case 'bottom':
          return 'top: 80%;'
        default: 
          return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s;
}
.toast-enter,
.toast-leave-to {
  opacity: 0;
}
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;

  padding: 5px 10px;
  border-radius: 8px;

  background-color: rgba(0,0,0,0.7);
  color: #fff;
}
</style>
