<template>
  <div id="app">
    <!-- <firstPage id="firstPage">
    </firstPage> -->
    <one></one>
  </div>
</template>

<script>
import firstPage from '@/components/firstPage'
import one from '@/components/one'

export default {
  name: 'wafer-project',
  components: {
    firstPage,
    one
  }
}

</script>

<style>
/* CSS */
#firstPage {
    height: 100%;
}
</style>
