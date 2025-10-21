<script setup>
 import { ref } from "vue"
 import { Button } from "./shadcn/components/ui/button/index.js";
 import { Card, CardHeader, CardFooter, CardTitle, CardContent } from "./shadcn/components/ui/card/index.js";
 import {
   AlertDialog,
   AlertDialogTrigger,
   AlertDialogContent,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogCancel,
   AlertDialogAction,
 } from "./shadcn/components/ui/alert-dialog/index.js";

 const count = ref(0);
</script>

<template>
  <div id="app-container" class="flex justify-center">
    <Card>
      <CardHeader>
        <CardTitle>Poorly Styled Button Counter Demo (shadcn-vue)</CardTitle>
      </CardHeader>

      <CardContent>
        <div class="text-2xl">
          <strong>COUNT</strong> => {{ count }}
        </div>
      </CardContent>

      <CardFooter>
        <div class="button-container min-w-lg flex justify-evenly">
          <Button class="increment" @click="count++">Increment (+)</Button>
          <Button class="decrement" variant="destructive" @click="count--">Decrement (-)</Button>

          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button variant="outline">
                Show Dialog
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Shadcn-vue Modal</AlertDialogTitle>
                <AlertDialogDescription>
                  Here's some modal content
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>
      </CardFooter>

    </Card>
  </div>
</template>

<style >
 @import "./globals.css";

 div#app-container {

 }
</style>
