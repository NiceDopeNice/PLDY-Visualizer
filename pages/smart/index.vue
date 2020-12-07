<template>
    <div class="product_page">

        <Header :loading="loading_toggle" :idleToggle="true" :footer="true" :footerColor="'smart_footer'" :homeButton="true"  :backButton="true" :errorToggle="errorToggle" />

        <img class="product_logo" src="img/smart.png" alt="" />

          <h1 class="inside_title">SELECT A PRODUCT</h1>


        <transition name="fade">
          <section class="product_container" v-if="show">
            <div v-for="list in Product" :key="list.p_id">
              <div class="prodpldt" v-if="list.p_status == 1">
                <nuxt-link :to="'/smart/type/'+list.p_name">
                  <img :src="CMS_URL_IMAGE+list.p_logo" alt="">
                </nuxt-link>
              </div>
            </div>
          </section>
        </transition>
    </div>
</template>

<style scoped>
.inside_title{
    font-size: 3.6em;
    color:#ffffff;
}
.prodpldt{
    background-color: #000;
    border: 2px solid #eead38;
    margin-top: 30%;
    outline: none;
}
</style>


<script>
import axios from 'axios';
import Header from "~/components/Nuxt_header";


export default {
  layout: 'smart',
  components: {
    Header
  },
  data(){
    return {
      show: false,
      loading_toggle: true,
      errorToggle: false,
      Product: [],
      CMS_URL_IMAGE: process.env.CMSUrl_image
    }
  },
  mounted() {
      this.$axios.$get('getProductByGroup?p_group=smart').then( res => {
        if(res){
          this.show = true;
          this.loading_toggle = false;
          this.Product = res;
        }
      }).catch( err => {
          this.errorToggle = true;
      });
  }
}


</script>