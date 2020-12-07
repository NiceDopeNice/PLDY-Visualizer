<template>
    <div class="product_page">

        <Header :loading="loading_toggle" :idleToggle="true" :footer="true" :footerColor="'pldt_footer'" :homeButton="true"  :backButton="true" :errorToggle="errorToggle" />

        <img class="product_logo" src="img/pldt.png" alt="" />
        <div class="plan_overlay"></div>
        <transition name="fade" v-if="show">
            <section class="plan_view" v-if="ShowDataCompa" :class="ToggleDataCompa ? 'close_plan':'show_plan'">            
                <div class="header">
                    <h1>DATA COMPARISON</h1>
                    <h2>Select a plan to compare with your current option</h2>
                </div>

                <div class="plan_wrapper">
                    <div class="info comparison" v-for="(PlanName, GroupIndex) in PldtPlansGroup" :key="GroupIndex">
                        <div class="option_main" @click="ClickPlanName">{{ PlanName }}</div>
                        <ul class="plan_list_ul">
                            <li :id="list.pl_id" v-for="(list, index) in PldtPlansFunc(PlanName,PlanID)" :key="index">
                                <div class="plan_name">
                                    <input type="radio" :id="'radio'+GroupIndex+''+index" name="radio_data" :value="list.pl_id">
                                    <i></i>
                                    <label @click="AddSelected(list.pl_id)" :for="'radio'+GroupIndex+''+index">{{ list.pl_name }}</label>
                                </div>
                                <div class="plan_info">{{ list.pl_info }}</div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="button_info">
                    <button class="plan_close data_compa disable" disabled @click="ClickCompare">COMPARE &amp; CALCULATE</button>
                </div>
            </section>
        </transition>
        
    </div>
</template>

<style scoped>
.plan_name input[type='radio']{
    position: absolute;
    visibility: hidden;
}
.plan_view .info label {
    float: none;
    padding-left: 20px;
    line-height: 40px;
    margin-top: 10px;
    font-size: 1.7em;
    margin-bottom: 5px;
    font-weight: bold;
    color: #222;
}
.plan_name input[type='radio'] ~ i {
    display: inline-block;
    width: 20px;
    height: 20px;
    position: absolute;
    left: 4px;
    top: 19px;
    border: 2px solid #919191;
    color: #919191;
    border-radius: 50%;
    line-height: 14px;
    text-align: center;
    font-style: normal;
}
.plan_name input[type='radio']:checked ~ i { 
    background: #ed1b58;
    border-color: #ed1b58;
    color: #ed1b58;
}
.button_info{
    margin-top: 0px;
    margin-bottom: 20px;
}
</style>

<script>
import axios from 'axios';
import Header from "~/components/Nuxt_header";
import $ from 'jquery';

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
      ShowDataCompa: true,
      showOverlay: false,
      ToggleDataCompa: false,
      PldtPlans: [],
      PldtPlansGroup: [],
      PldtOtherPlan: 0,
      PlanID: this.$route.params.slug
    }
  },
  mounted() {
      this.$axios.$get('getPldtPlan').then( res => {
        if(res){
          this.show = true;
          this.loading_toggle = false;
          this.PldtPlans = res;

          this.PldtPlans.forEach((element, index) => {
            this.PldtPlansGroup.push(element.pl_product);
          });

          this.PldtPlansGroup = [ ...new Set(this.PldtPlansGroup) ];
        }
      }).catch( err => {
          console.log(err);
          this.errorToggle = true;
      });
      
  },
  methods:{
    PldtPlansFunc(PlanGroupName, PlanListId){
        // alert(PlanGroupName);
        const list_plan = [];
        this.PldtPlans.forEach((element, index) => {
            if(element.pl_product  == PlanGroupName && element.pl_id != PlanListId){
                list_plan.push({ pl_id: element.pl_id, pl_name: element.pl_name, pl_info: element.pl_info });
            }
        });

        return list_plan;
    },
    AddSelected(event){
        const thisVal = $(event.target);
        const button = $(".button_info button");
        const button_a = $(".button_info a");
        button.removeClass("disable");
        button.removeAttr("disabled");
        $(".plan_list_ul").find("li").removeClass('plan_selected');
        $("#"+event).addClass('plan_selected');
        // Other Plan ID
        this.PldtOtherPlan = event;
    },
    ClickPlanName(event){
        const thisVal = $(event.target);
        // $(".plan_list_ul").hide();
        thisVal.toggleClass("active");
        thisVal.closest(".comparison").find("ul").fadeToggle()
    },
    ClickCompare(){
        this.loading_toggle = true;
        this.show = false;
        const list_plan = [];
        this.PldtPlans.forEach((element, index) => {
            if(element.pl_id == this.PlanID){
                list_plan.push(element);
            }
            if(element.pl_id == this.PldtOtherPlan){
                list_plan.push(element);
            }
        });
        const me = this;
        const formdata = new FormData();
        formdata.append("pc_category", 'PLDT');
        formdata.append("pc_district", '');
        formdata.append("pc_store", '');
        formdata.append("pc_ipaddress", localStorage.getItem("ip_address"));
        formdata.append("pc_product1", list_plan[0].pl_product);
        formdata.append("pc_plantype1", '');
        formdata.append("pc_plan1", list_plan[0].pl_name);
        formdata.append("pc_product2", list_plan[1].pl_product);
        formdata.append("pc_plantype2", '');
        formdata.append("pc_plan2", list_plan[1].pl_name);
        this.$axios.post('insertPlanCompare', formdata)
        .then(function (res) {
            if(res.status == 200){
                $nuxt.$router.push({ path: '/pldt/plan/compare/'+me.PlanID+'-'+me.PldtOtherPlan });
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