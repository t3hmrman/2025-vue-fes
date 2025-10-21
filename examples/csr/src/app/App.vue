<script setup>
 import { ref } from "vue"
 const count = ref(0);
</script>

<template>
  <UApp>
    <UCard>
      <template #header>
        <h2>Poorly Styled Button Counter Demo (NuxtUI)</h2>
      </template>

      <div class="text-2xl">
        <strong>COUNT</strong> => {{ count }}
      </div>

      <template #footer>
        <div class="flex justify-evenly min-w-lg">
        <UButton size="xl" @click="count++">Increment (+)</UButton>
        <UButton size="xl" color="error" @click="count--">Decrement (-)</UButton>

        <UModal title="NuxtUI Modal">
          <UButton size="xl" label="Open Modal" color="neutral" variant="subtle" />
          <template #body>
            <p>Here's some modal content</p>
          </template>
        </UModal>
        </div>
      </template>

    </UCard>
  </UApp>
</template>
