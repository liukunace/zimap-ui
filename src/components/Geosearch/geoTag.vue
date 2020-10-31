<template>
  <span class="geo-tag">
    <slot></slot>
    <i class="fa fa-times-circle" v-show="closeable" @click.stop="closeHandler"></i>
  </span>
</template>

<script>
import emitter from './observer/emitter'

export default {
  name: 'geoTag',
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
.geo-tag {
  font-size: 16px;
  border: 0px solid gray;
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
