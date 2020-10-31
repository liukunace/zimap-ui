<template>
  <span class="my-tag">
    <slot></slot>
    <i class="fa fa-times-circle" v-show="closeable" @click.stop="closeHandler"></i>
  </span>
</template>

<script>
import emitter from './observer/emitter'

export default {
  name: 'myTag',
  mixins: [emitter],
  props: {
    closeable: {
      type: Boolean,
      default: false
    },
    closeHandler: {
      type: Function,
      default: () => () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
.my-tag {
  font-size: 14px;
  border: 1px solid gray;
  border-radius: 2px;
  padding: 0 2px;
  > .fa-times-circle {
    cursor: pointer;
    &:hover {
      color: red;
    }
  }
}
</style>
