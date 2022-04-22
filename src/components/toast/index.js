import Toast from './toast.vue'
const toast = {}
toast.install = Vue => {
  const ToastCon = Vue.extend(Toast)
  const ins = new ToastCon()
  ins.$mount(document.createElement('div'))
  document.body.appendChild(ins.$el)
  Vue.prototype.$toast = ({message, duration, position='center'}) => {
    ins.message = message
    ins.visible = true
    ins.position = position
    console.log(ins.position)
    setTimeout(() => {
      ins.visible = false
    }, duration)
  }
}
export default toast