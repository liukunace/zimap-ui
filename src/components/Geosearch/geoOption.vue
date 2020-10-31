<template>
  <li :class="['geo-option', { selected: selected }]" @click.stop="handleClick">
    <span v-if="!$slots.default">{{ geoLabel }}</span>
    <slot></slot>
    <i class="fa fa-check pull-right"></i>
  </li>
</template>

<script>
import emitter from './observer/emitter'

export default {
  name: 'geoOption',
  mixins: [emitter],
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      required: true
    },
    using: {
      // type: Boolean,
      type: String,
      default: 'true'
    }
  },
  data() {
    return {
      selected: false,
      geoLabel: this.label || this.value
    }
  },
  methods: {
    handleClick() {
      this.dispatch(
        'geoSelect',
        'option-click',
        this.selected,
        this.geoLabel,
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

