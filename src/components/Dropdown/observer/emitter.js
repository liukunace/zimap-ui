/**
 * 父元素组件广播事件
 * @param {string} componentName 子组件名
 * @param {string} eventName 事件名
 * @param {...any} params 事件参数
 */
function _broadcast(componentName, eventName, ...params) {
  this.$children.forEach(child => {
    if (child.$options.name === componentName) {
      child.$emit(eventName, ...params)
    }
    _broadcast.call(child, componentName, eventName, ...params)
  })
}

/**
 * 子元素组件发送事件
 * @param {string} componentName 父组件名
 * @param {string} eventName 事件名
 * @param {...any} params 事件参数
 */
function _dispatch(componentName, eventName, ...params) {
  if (this.$parent) {
    if (this.$parent.$options.name === componentName) {
      this.$parent.$emit(eventName, ...params)
    }
    _dispatch.call(this.$parent, componentName, eventName, ...params)
  }
}

export default {
  methods: {
    broadcast(componentName, eventName, ...params) {
      _broadcast.call(this, componentName, eventName, ...params)
    },
    dispatch(componentName, eventName, ...params) {
      _dispatch.call(this, componentName, eventName, ...params)
    }
  }
}
