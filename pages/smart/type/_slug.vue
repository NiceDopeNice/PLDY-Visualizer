<template>
    <div class="product_page">

        <Header :loading="loading_toggle" :idleToggle="true" :footer="true" :footerColor="'smart_footer'" :homeButton="true"  :backButton="true" :errorToggle="errorToggle" />

        <img class="product_logo" src="img/smartsignature.png" alt="" />

          <h1 class="inside_title">SELECT PLAN TYPE</h1>

        <transition name="fade">
          <section class="smarttype_container" v-if="show">
            <div v-for="list in SmartType" :key="list.pt_id">
              <div class="prodsmart" v-if="list.pt_status == 1">
                <nuxt-link :to="'/smart/plantype/'+list.pt_id">
                  <p class="smarttype_title">{{ list.pt_type }}</p>
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
      SmartType: [],
      CMS_URL_IMAGE: process.env.CMSUrl_image
    }
  },
  mounted() {
      this.$axios.$get('getSmartTypeByProduct?pt_product='+this.$route.params.slug).then( res => {
        if(res){
          this.show = true;
          this.loading_toggle = false;
          this.SmartType = res;
        }
      }).catch( err => {
          console.log(err);
          this.errorToggle = true;
      });
  }
}


</script>