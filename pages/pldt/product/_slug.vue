<template>
    <div class="product_page">

        <Header :loading="loading_toggle" :idleToggle="true" :footer="true" :footerColor="'pldt_footer'" :homeButton="true"  :backButton="true" :errorToggle="errorToggle" />

        <img class="product_logo" src="img/pldt.png" alt="" />

          <h1 class="inside_title">SELECT A <b class="product_name">{{ $route.params.slug }}</b> PLAN </h1>

          <transition name="fade">
            <div class="plans_container" v-if="show">
              <div class="planspldt" v-for="list in Plan" :key="list.pl_id">
                <button type="button" v-if="list.pl_status == 1" @click="PlanHits(list.pl_id,list.pl_name)">
                    {{ list.pl_name }}
                </button>
              </div>
            </div>
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
      show: false,
      loading_toggle: true,
      errorToggle: false,
      Plan: [],
      Base_url: process.env.baseUrl,
      CMS_URL_IMAGE: process.env.CMSUrl_image
    }
  }, 
  mounted() {
      const me = this;
      me.$axios.$get('getPlansByProduct?pl_product='+this.$route.params.slug).then( res => {
        if(res){
          this.show = true;
          this.loading_toggle = false;
          this.Plan = res;
        }
      }).catch( err => {
          console.log(err);
          this.errorToggle = true;
      });
  },
  methods:{
    PlanHits(pl_id,pl_name){
      this.loading_toggle = true;
      const me = this;
      const formdata = new FormData();
      formdata.append("category", 'PLDT');
      formdata.append("district", '');
      formdata.append("store", '');
      formdata.append("ipaddress", localStorage.getItem("ip_address"));
      formdata.append("product", this.$route.params.slug);
      formdata.append("plantype", '');
      formdata.append("plan", pl_name);
      this.$axios.post('insertPlanHits', formdata)
      .then(function (res) {
        if(res.status == 200){
          $nuxt.$router.push({ path: '/pldt/plan/view/'+pl_id });
        }else{
          me.errorToggle = true;
          console.log(error);
        }
      })
      .catch(function (error) {
        me.errorToggle = true;
        console.log(error);
      });
    }
  }
}


</script>