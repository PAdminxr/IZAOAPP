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
.base-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.base-button--primary { background-color: #007AFF; color: white; }
.base-button--secondary { background-color: #E5E5E5; color: #333; }
.base-button--success { background-color: #07C160; color: white; }
.base-button--warning { background-color: #FF9500; color: white; }
.base-button--danger { background-color: #FF3B30; color: white; }

.base-button--small { padding: 4px 8px; font-size: 12px; }
.base-button--large { padding: 12px 24px; font-size: 16px; }

.base-button--loading::after {
  content: '';
  width: 16px;
  height: 16px;
  margin-left: 8px;
  border: 2px solid white;
  border-radius: 50%;
  border-right-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>