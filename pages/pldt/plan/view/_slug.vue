<template>
    <div class="product_page">

        <Header :loading="loading_toggle" :idleToggle="true" :footer="true" :footerColor="'pldt_footer'" :homeButton="true"  :backButton="true" :errorToggle="errorToggle" />

        <img class="product_logo" src="img/pldt.png" alt="" />
        <div class="plan_overlay"></div>
        <transition name="fade">
            <section class="plan_view" v-if="show" :class="PlanClose ? 'close_plan':'show_plan'">
                <div class="header">
                    <h1>{{ PlanDetails.pl_name }}</h1>
                    <h2>calculate or compare selected plan’s data usage</h2>
                </div>
                <div class="info">
                    <h1>INFORMATION</h1>
                    <ul>
                        <li><label>SPEED</label><p class="info_content">Up to {{ PlanDetails.pl_speed }}</p></li>
                        <li><label>OTHER INFO</label><p class="info_content">{{ PlanDetails.pl_info }}</p></li>
                    </ul>
                </div>
                <div class="info">
                    <h1>DATA CALCULATOR</h1>
                    <p class="info_details">See if your data usage fits the chosen plan. You can also check the estimated download/upload times based on your online activities.</p>
                    <div class="button_info">
                        <nuxt-link :to="'/pldt/plan/solo-calculator/'+PlanDetails.pl_id">
                            <button type="button">DATA CALCULATOR</button>
                        </nuxt-link>
                    </div>
                </div>
                <div class="info">
                    <h1>SPEED SIMULATOR</h1>
                    <p class="info_details">Experience how fast you can stream videos or download files with the PLDT HOME broadband service of your choice.</p>
                    <div class="button_info">
                        <button type="button" @click="SpeedSimulator">SPEED SIMULATOR</button>
                    </div>
                </div>
                <div class="button_info">
                    <nuxt-link :to="to">
                        <button class="plan_close">CLOSE</button>
                    </nuxt-link>
                </div>
            </section>
        </transition>
        
    </div>
</template>

<script>
import axios from 'axios';
import Header from "~/components/Nuxt_header";

export default {
  layout:'pldt',
  components: {
    Header
  },
  data(){
    return {
      testing: false,
      PlanClose: false,
      errorToggle: false,
      show: false,
      loading_toggle: true,
      PlanDetails: [],
      CMS_URL_IMAGE: process.env.CMSUrl_image,
      SLug: this.$route.params.slug
    }
  },
  computed: {
      to () {
          if (this.client || !this.$routerHistory || !this.$routerHistory.hasPrevious()) {
              // probably ssr, or hasn't navigated yet.
              return { path: '/' };
          }
          return { path: this.$routerHistory.previous().path };
      }
   },
  mounted() {
      this.$axios.$get('getPldtPlanById?pl_id='+this.SLug).then( res => {
        if(res){
          this.show = true;
          this.loading_toggle = false;
          this.PlanDetails = res;
        }
      }).catch( err => {
          console.log(err);
          this.errorToggle = true;
      });
  },
  methods: {
      SpeedSimulator: function(){
          this.PlanClose = true; 
          setTimeout(() => {
               $nuxt.$router.push({ path: '/pldt/plan/solo-simulator/'+this.PlanDetails.pl_id });
          }, 500);
      }
  }
}


</script>