import * as components from './components'
var VuePlugin = {}
VuePlugin.install = function(Vue, options) {
    for(let component in components) {
        Vue.component('zmap'+component, components[component]);
    }
}
export default VuePlugin
