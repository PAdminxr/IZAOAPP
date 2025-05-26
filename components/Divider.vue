<template>
  <view
    class="divider"
    :class="[
      vertical ? `${prefix}divider-vertical` : `${prefix}divider-horizontal`,
      dashed && 'divider-dashed',
      inset && 'divider-inset',
    ]"
    :style="{
      height: computedHeight,
      width: computedWidth,
      backgroundColor: color,
      margin: margin,
    }"
  >
    <slot v-if="$slots.default"></slot>
  </view>
</template>
  
  <script setup>
import { ref, onMounted } from "vue";
import { normalizeUnit } from "@/utils/unit";
import { getPlatformPrefix } from "@/utils/platform";

const props = defineProps({
  height: { type: String, default: "1upx" },
  width: { type: String, default: "100%" },
  color: { type: String, default: "#EBEBEB" },
  vertical: { type: Boolean, default: false },
  dashed: { type: Boolean, default: false },
  inset: { type: Boolean, default: false },
  margin: { type: String, default: "" },
});

const prefix = getPlatformPrefix();

const computedHeight = ref("1px");
const computedWidth = ref("auto");

onMounted(() => {
  computedHeight.value = normalizeUnit(props.height);
  computedWidth.value = props.vertical ? "1px" : normalizeUnit(props.width);
});
</script>
  
  <style scoped>
.divider {
  display: block;
  background-color: #ebebeb;
  transition: background-color 0.3s;
}

.divider-dashed {
  border-style: dashed;
  background-color: transparent !important;
  border-width: 1px;
  border-color: currentColor;
}

.divider-inset {
  margin-left: 72px;
}
</style>