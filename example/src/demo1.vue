<template>
  <section>
    <h1>Test title</h1>
    <p>count: {{count}}</p>
    <button type="button" @click="add">+1</button>
    <button type="button" @click="minus">-1</button>
  </section>
</template>
<script>
  let b = 'testing...'
  export default {
    data () {
      return {
        count: 0
      }
    },
    methods: {
      add () {
        this.count++ 
      },
      minus () {
        this.count--
      }
    }
  }
</script>

<style>
body{
    background: #ccc;
}
</style>