<template>
  <div id="app">
    <!-- <firstPage id="firstPage">
    </firstPage> -->
    <one></one>
    <!-- <cookerPage></cookerPage> -->
  </div>
</template>

<script>
import firstPage from '@/components/firstPage'
import one from '@/components/one'
import cookerPage from '@/components/cookerPage'

export default {
  name: 'wafer-project',
  components: {
    firstPage,
    one,
    cookerPage
  }
}

</script>

<style>
/* CSS */
#firstPage {
    height: 100%;
}
</style>
