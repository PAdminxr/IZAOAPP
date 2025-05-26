<!-- components/base/BaseButton.vue -->
<template>
    <button class="base-button" :class="classes" :disabled="disabled" @click="handleClick">
        <slot></slot>
    </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    type: {
        type: String,
        default: 'primary',
        validator: val => ['primary', 'secondary', 'success', 'warning', 'danger'].includes(val)
    },
    size: {
        type: String,
        default: 'normal',
        validator: val => ['small', 'normal', 'large'].includes(val)
    },
    disabled: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['click']);

const classes = computed(() => [
    `base-button--${props.type}`,
    `base-button--${props.size}`,
    { 'base-button--loading': props.loading }
]);

const handleClick = (event) => {
    if (!props.disabled && !props.loading) {
        emit('click', event);
    }
};
</script>

<style scoped>
/* 样式保持不变 */
</style>