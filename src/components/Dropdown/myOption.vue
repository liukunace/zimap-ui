<template>
  <li :class="['my-option', { selected: selected }]" @click.stop="handleClick">
    <span v-if="!$slots.default">{{ myLabel }}</span>
    <slot></slot>
    <i class="fa fa-check pull-right"></i>
  </li>
</template>

<script>
import emitter from './observer/emitter'

export default {
  name: 'myOption',
  mixins: [emitter],
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selected: false,
      myLabel: this.label || this.value
    }
  },
  methods: {
    handleClick() {
      this.dispatch(
        'mySelect',
        'option-click',
        this.selected,
        this.myLabel,
        this.value
      )
    }
  },
  created() {
    this.$on('select', value => {
      if (this.value === value) {
        this.selected = true
      }
    })
    this.$on('cancel', value => {
      if (this.value === value) {
        this.selected = false
      }
    })
  }
}
</script>

