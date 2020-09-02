# vue-md-loader

Webpack loader for converting Markdown files to ALIVE Vue components.

github repo: [https://github.com/wxsms/vue-md-loader](https://github.com/wxsms/vue-md-loader)

source of this page: [https://github.com/wxsms/vue-md-loader/blob/master/example/src/markdown.md](https://github.com/wxsms/vue-md-loader/blob/master/example/src/markdown.md)

# Hello World!

Just testing...

## Simple Code Block

```html
<template>
  <div>Nothing happends</div>
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
<style scoped>
  div {
    color: green;
  }
</style>
<!-- live-1-01111.vue -->
```

## Live 0

#### Live blocks without scripts & styles.

```vue
<template>
  <div>This <template>is</template> a Live block!111</div>
</template>
<!-- live-0-0.vue -->
```

#### Another

```html
<div>An other! This one got no template tag.</div>
<!-- live-0-1.vue -->
```

## Live 1

#### A Vue live block with template & script & style

```html
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
<!-- live-1-0.vue -->
```

#### Another with same data as `live-1-0.vue`.

```html
<template>
  <div class="cls1">{{msg}}</div>
</template>
<script>
  let a = 0
  export default {
    data () {
      return {
        msg: 'test test test'
      }
    }
  }
</script>
<style>
  .cls1 {
    color: red;
    background: green;
  }
</style>
<!-- live-1-1.vue -->
```

## Live 2

#### Live block with methods

```vue-compnent
import demo1 from "./demo1.vue"
<!-- live-2.vue -->
```

## Table Test

#### Table 1

| Tables         | Are           | Cool  |
| -------------- | ------------- | ----- |
| `col 3 is`     | right-aligned | $1600 |
| col 2 is       | centered      |   $12 |
| zebra stripes  | are neat      |    $1 |

#### Table 2

| Tables         | Are           | Cool  |
| -------------- | ------------- | ----- |
| `col 3 is`     | right-aligned | $1600 |
| col 2 is       | centered      |   $12 |
| zebra stripes  | are neat      |    $1 |
