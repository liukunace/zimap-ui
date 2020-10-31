<template>
  <div class="my-select">
    <div
      :class="['box', { focus: focus }]"
      @click="handleClick"
      v-clickoutside="handleClose"
    >
      <span v-show="!value.length">请选择</span>
      <span v-if="!multiple">{{ label }}</span>
      <span v-else>
<!--        <my-tag-->
<!--          v-if="value.length > 0"-->
<!--          closeable-->
<!--          :closeHandler="handleCancel"-->
<!--          >{{ label[0] }}</my-tag-->
<!--        >-->
<!--        <my-tag v-if="value.length > 1">{{ `+${value.length - 1}` }}</my-tag>-->
        <my-tag v-for="(item,i)  in value" v-bind:key="i">{{ item }}</my-tag>
      </span>
      <i class="fa fa-angle-down fa-lg pull-right">&nbsp;</i>
    </div>
    <div class="dropdown" v-show="show">
      <ul>
        <slot></slot>
      </ul>
    </div>
  </div>
</template>

<script>
import emitter from './observer/emitter'
import clickoutside from './directives/clickoutside'
import myTag from './myTag'

export default {
  name: 'mySelect',
  mixins: [emitter],
  directives: {
    clickoutside
  },
  components: {
    myTag
  },
  props: {
    value: {
      type: [String, Array]
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      focus: false,
      label: undefined,
      show: false
    }
  },
  methods: {
    init() {
      if (this.multiple) {
        const tmpLabel = []
        this.$children.forEach(child => {
          if (child.$options.name === 'myOption') {
            const index = this.value.indexOf(child.value)
            if (index !== -1) {
              tmpLabel[index] = child.myLabel
              child.selected = true
            }
          }
        })
        this.label = tmpLabel
      } else {
        this.$children.forEach(child => {
          if (
            child.$options.name === 'myOption' && child.value === this.value
          ) {
            this.label = child.myLabel
            child.selected = true
          }
        })
      }
    },
    handleCancel() {
      this.broadcast('myOption', 'cancel', this.value[0])
      this.$emit('change', this.value.slice(1))
      this.label.shift()
    },
    handleClick() {
      this.focus = true
      this.show = !this.show
    },
    handleClose() {
      this.focus = false
      this.show = false
    }
  },
  created() {
    if (this.multiple) {
      this.label = []
    } else {
      this.label = ''
    }
    this.$on('option-click', (selected, label, value) => {
      if (this.multiple) {
        if (selected) {
          this.broadcast('myOption', 'cancel', value)
          const index = this.value.indexOf(value)
          if (index !== -1) {
            const tmpValue = this.value
            tmpValue.splice(index, 1)
            this.$emit('change', tmpValue)
            this.label.splice(index, 1)
          }
        } else {
          this.broadcast('myOption', 'select', value)
          this.$emit('change', [...this.value, value])
          this.label.push(label)
          // this.$emit('change', [value])
          // this.label = label
        }
      } else if (!selected) {
        if (this.value) {
          this.broadcast('myOption', 'cancel', this.value)
        }
        this.broadcast('myOption', 'select', value)
        this.$emit('change', value)
        this.label = label
        this.show = false
      }
    })
  },
  mounted() {
    this.init()
  }
}
</script>


