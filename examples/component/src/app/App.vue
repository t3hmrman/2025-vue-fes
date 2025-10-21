<script setup vapor>
 import { ref } from "vue"
 const count = ref(0);

 const buttonBaseStyle = {
   'font-weight': 'bold',
   'border-radius': '.5em',
   'font-size': '1.25em',
   padding: '.5em',
   width: 'fit-content',
   cursor: 'pointer',
   margin: '0 1em',
 };

 const styles = ref({
   container: {
     display: 'flex',
     'flex-direction': 'column',
     width: '50vw',
     'border-radius': '1em',
     border: '2px solid gray',
     padding: '1em',
   },
   btnIncrement: {
     ...buttonBaseStyle,
     'background-color': 'green',
     color: 'white',
   },
   btnDecrement: {
     'background-color': 'red',
     color: 'white',
   },
 });

</script>

<template>
  <div :style="styles.container">
    <h2>Poorly Styled Button Counter Demo</h2>
    <strong>COUNT</strong> => {{ count }}
    <div :style="styles.buttonContainer">
      <button :style="styles.incrementButton" size="xl" @click="count++">Increment (+)</button>
      <button :style="styles.decrementButton" size="xl" color="error" @click="count--">Decrement (-)</button>
    </div>
  </div>
</template>
