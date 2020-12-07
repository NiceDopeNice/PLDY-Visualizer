<template>
    <div class="product_page">

        <Header :loading="loading_toggle" :idleToggle="true" :footer="true" :footerColor="'smart_footer'" :homeButton="true"  :backButton="true" :errorToggle="errorToggle" />

        <img class="product_logo" src="img/smartsignature.png" alt="" />
        <h1 class="inside_title">SELECT A {{ UniquePlanType }}</h1>

        <transition name="fade">
          <section class="smarttype_container" v-if="show">
            <div class="planssmart" v-for="list in PlanList" :key="list.pl_id">
              <div v-if="list.pl_status == 1">
                <!-- <nuxt-link :to="'/smart/plan/view/'+list.pl_id">
                  <p class="smarttype_title">{{ list.pl_name }}</p>
                </nuxt-link> -->
                <button type="button" v-if="list.pl_status == 1" @click="PlanHits(list.pl_id,list.pl_name,list.pt_product)">
                   <p class="smarttype_title">{{ list.pl_name }}</p>
                </button>
              </div>
            </div>
          </section>
        </transition>
    </div>
</template>

<style scoped>
.inside_title{
  font-size: 3.3em;
  color:#ffffff;
}
.planssmart{
  padding: 0%;
  background-color: #000;
  border: 3px solid #eead38;
}
.planssmart button{
  font-size: 65px;
  font-weight: bold;
  color: #eead38;
  background: transparent;
  border:1px solid transparent;
  outline: none;
}

.smarttype_title {
    padding: 60px 0px;
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
      PlanList: [],
      CMS_URL_IMAGE: process.env.CMSUrl_image,
      UniquePlanType: ''
    }
  },
  mounted() {
      this.$axios.$get('getSmartPlansType?pl_plantype='+this.$route.params.slug).then( res => {
        if(res){
          this.show = true;
          this.loading_toggle = false;
          this.PlanList = res;
          const uniqueArr = [... new Set(this.PlanList.map(data => data.pt_type))]
          this.UniquePlanType = uniqueArr[0];
        }
      }).catch( err => {
          console.log(err);
          this.errorToggle = true;
      });
  },
  methods:{
    PlanHits(pl_id,pl_name,pt_product){
      this.loading_toggle = true;
      const me = this;
      const formdata = new FormData();
      const split = this.UniquePlanType.lastIndexOf(" ");
      const plan_type = this.UniquePlanType.substring(0, split);
      formdata.append("category", 'SMART');
      formdata.append("district", '');
      formdata.append("store", '');
      formdata.append("ipaddress", localStorage.getItem("ip_address"));
      formdata.append("product", pt_product);
      formdata.append("plantype", plan_type);
      formdata.append("plan", pl_name);
      this.$axios.post('insertPlanHits', formdata)
      .then(function (res) {
        if(res.status == 200){
          $nuxt.$router.push({ path: '/smart/plan/view/'+pl_id });
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