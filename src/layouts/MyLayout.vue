<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="glossy">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          CalcetThron
        </q-toolbar-title>

        <q-img src="../assets/table-soccer-white.png" style="width: 60px"></q-img>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered content-class="bg-grey-2" >
      <side-menu @navigated="onNavigation"></side-menu>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import SideMenu from '../components/SideMenu.vue'

export default {
  name: 'MyLayout',
  components: {
    'side-menu': SideMenu
  },
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL,
    onNavigation() {
      this.leftDrawerOpen = false
    }
  }
}
</script>

<style>
</style>
