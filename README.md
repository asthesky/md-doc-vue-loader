# md-doc-vue-loader
markdown doc use vue template and component


## can use vue template mode

```vue
<template>
  <div id="test-block">This is a test block! {{msg}}</div>
</template>
<script>
  export default {
    data () {
      return {
        msg: 'Hello world!'
      }
    }
  }
</script>
<style>
  #test-block {
    color: green;
  }
</style>

```

## can use vue component mode

```vue-compnent
import demo1 from "./demo1.vue"
```