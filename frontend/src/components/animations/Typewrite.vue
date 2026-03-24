<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  text: String,
  speed: {
    type: Number,
    default: 50
  }
});

const emit = defineEmits(["done"]);

const displayedText = ref("");

onMounted(() => {
  let i = 0;

  function type() {
    if (i < props.text.length) {
      displayedText.value += props.text[i];
      i++;
      setTimeout(type, props.speed);
    } else {
      emit("done");
    }
  }

  type();
});
</script>

<template>
  <span class="written">{{ displayedText }}</span>
</template>
