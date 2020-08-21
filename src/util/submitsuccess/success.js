import Vue from 'vue'
import submitSuccess from './submitSuccess'
let SubmitSuccess = Vue.extend(submitSuccess)

const Myalent = function (msg) {
  let success = new SubmitSuccess({
    propsData: {
      showSuccess: msg
    }
  })
  success.$mount()
  document.body.appendChild(success.$el)
  setTimeout(() => {
    success.showSuccess = false
    success.$destroy()
    success.$el.parentNode.removeChild(success.$el)
  }, 2000)
}
export default Myalent
