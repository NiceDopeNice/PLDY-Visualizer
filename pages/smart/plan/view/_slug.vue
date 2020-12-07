<template>
    <div class="product_page">

        <Header :loading="loading_toggle" :idleToggle="true" :footer="true" :footerColor="'smart_footer'" :homeButton="true"  :backButton="true" :errorToggle="errorToggle" />

        <img class="product_logo" src="img/smartsignature.png" alt="" />
        <div class="plan_overlay"></div>
        <transition name="fade">
            <section class="plan_view smart" v-if="show" :class="PlanClose ? 'close_plan':'show_plan'">
                <div class="plan_smart_view">
                    <div class="header">
                        <h1>{{ PlanType }} {{ PlanDetails.pl_name }}</h1>
                        <h2>calculate or compare selected plan’s data usage</h2>
                    </div>
                    <div class="info">
                        <h1>INFORMATION</h1>
                        <ul>
                            <li><label>MSF</label><p class="info_content">{{ PlanDetails.pl_msf }}</p></li>
                            <li><label>Device/Gadget</label><p class="info_content">{{ PlanDetails.pl_device }}</p></li>
                            <li><label>Amortization</label><p class="info_content">{{ PlanDetails.pl_amortization ? PlanDetails.pl_amortization : 'N/A'  }}</p></li>
                            <li><label>Cash out</label><p class="info_content">{{ PlanDetails.pl_cashout ? PlanDetails.pl_cashout : 'N/A'  }}</p></li>
                            <li><label>Lock in</label><p class="info_content">{{ PlanDetails.pl_lockin }}</p></li>
                            <li><label>Inclusions</label><p class="info_content">{{ PlanDetails.pl_inclusions }}</p></li>
                        </ul>
                    </div>
                    <div class="info">
                        <h1>DATA CALCULATOR</h1>
                        <p class="info_details">See if your data usage fits the chosen plan. You can also check the estimated download/upload times based on your online activities.</p>
                        <div class="button_info">
                            <button type="button" @click="Calculator('/smart/plan/solo-calculator/'+PlanDetails.pl_id)">DATA CALCULATOR</button>
                        </div>
                    </div>
                    <div class="info" style="margin-bottom: 25%;">
                        <h1>DATA COMPARISON</h1>
                        <p class="info_details">Compare the estimated download/upload times of your data plan’s usage based on your online activities with other plans</p>
                        <div class="button_info">
                            <button type="button" @click="CompareTo">COMPARE TO</button>
                        </div>
                    </div>
                    <div class="button_info button_close">
                        <nuxt-link :to="to">
                            <button type="button"  class="plan_close">CLOSE</button>
                        </nuxt-link>
                    </div>
                </div>
            </section>
        </transition> 
        
    </div>
</template>

<style scoped >
    .button_info.button_close{
        bottom: -1px;
        position: absolute;
        left: 0px;
        right: 0px;
        background: #000000;
        width: 100%;
        padding: 15px 0px 5px 0px;
    }
    .plan_view.smart .info p.info_content{
        font-size: 1.8em;
    }
    .button_info.button_close .plan_close{
        width: 30%;
        background-image: linear-gradient(90deg, rgba(204,157,70,1) 0%, rgba(204,157,70,1) 35%, rgba(183,114,43,1) 100%);
    }
    .plan_smart_view{
        height: 1500px;
        overflow: scroll;
    }
    .plan_view.smart .header{
        background-image: linear-gradient(90deg, rgba(204,157,70,1) 0%, rgba(204,157,70,1) 35%, rgba(183,114,43,1) 100%);
    }
    .plan_view.smart .header h1{
        font-size: 2.6em;
    }
    .plan_view.smart .info p.info_details{
        border-top:1px solid #fff;
    }
    .plan_view.smart .info label{
        font-size: 1.7em;
    }
    .plan_view.smart .info ul > li{
        border: 1px solid transparent;
        border-top: 1px solid #fff;
        padding:6px;
    }
    .plan_view.smart{
        background: #000000;
        max-height: 1500px;
        border-bottom: 1px solid transparent;
    }
    .plan_view.smart .info h1{
        color:#ffffff;
        font-size: 1.8em;
    }
    .plan_view.smart .info{
        opacity: 1;
        background: #000000;
        color: #ffffff;
        padding: 5%;
        padding-bottom: 0%;
    }
    .plan_view.smart .info button{
        width: 250px;
    }
    .plan_overlay {
        position: fixed;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        background-color: rgba(134, 135, 134, 0.8);
    }
</style>

<script>
import axios from 'axios';
import Header from "~/components/Nuxt_header";

export default {
  layout:'smart',
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
      SLug: this.$route.params.slug,
      PlanType: ''
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
      this.$axios.$get('getSmartPlanID?pl_id='+this.SLug).then( res => {
        if(res){
            this.show = true;
            this.loading_toggle = false;
            this.PlanDetails = res;
            
            const name = this.PlanDetails.pt_type;
            const split = name.lastIndexOf(" ");
            this.PlanType = name.substring(0, split);
        }
      }).catch( err => {
          console.log(err);
          this.errorToggle = true;
      });
  },
  methods: {
      CompareTo: function(){
          this.PlanClose = true; 
          setTimeout(() => {
               $nuxt.$router.push({ path: '/smart/plan/compare-options/'+this.PlanDetails.pl_id });
          }, 500);
      },
      Calculator: function(URL){
          this.PlanClose = true; 
          setTimeout(() => {
               $nuxt.$router.push({ path: URL });
          }, 500);
      }
  }
}


</script>
