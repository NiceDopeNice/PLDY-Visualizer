<template>
  <div class="container_service">

    <Header :loading="loading_toggle" :idleToggle="true" :footer="true" :footerColor="'default'" :homeButton="true"  :backButton="false" :errorToggle="errorToggle" />

    <h1 class="inside_title">SELECT A SERVICE</h1>

    <transition name="fade">
      <div class="service_container" v-if="show">
        <div class="service_box" v-for="list in Group" :key="list.g_id">
            <nuxt-link :to="list.g_name.toLowerCase().trim()">
                <img :src="list.g_name.toLowerCase().trim() == 'pldt' ? 'img/pldt.png' : 'img/smart.png'" alt="">
            </nuxt-link>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
import axios from 'axios';
import Header from "~/components/Nuxt_header";


export default {
  components: {
    Header
  },
  data(){
    return {
      show: false,
      loading_toggle: true,
      errorToggle: false,
      Group: [],
      CMS_URL_IMAGE: process.env.CMSUrl_image
    }
  },
  mounted() {
      this.$axios.$get('getGroup').then( res => {
        if(res){
          this.show = true;
          this.loading_toggle = false;
          this.Group = res;
        }
      }).catch( err => {
          console.log(err);
          this.errorToggle = true;
      });
  }
}


</script>