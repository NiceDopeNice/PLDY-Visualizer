<template>
    <div class="product_page">

        <Header :loading="loading_toggle" :idleToggle="true" :footer="true" :footerColor="'smart_footer'" :homeButton="true"  :backButton="true" :errorToggle="errorToggle" />

        <img class="product_logo" src="img/smartsignature.png" alt="" />
        <div class="plan_overlay"></div>
        <transition name="fade">
            <section class="plan_view smart" v-if="ShowDataCompa" :class="ToggleDataCompa ? 'close_plan':'show_plan'">            
                <div class="header">
                    <h1>DATA COMPARISON</h1>
                    <h2>Select a plan to compare with your current option</h2>
                </div>

                <div class="plan_wrapper">
                    <div class="info comparison" v-for="(PlanName, GroupIndex) in SmartPlanGroup" :key="GroupIndex">
                        <div class="option_main" @click="ClickPlanName">{{ PlanName }}</div>
                        <ul class="plan_list_ul">
                            <li :id="list.pl_id" v-for="(list, index) in PldtPlansFunc(SmartPlanGroupID[GroupIndex],PlanID)" :key="index">
                                <div class="plan_name">
                                    <input type="radio" :id="'radio'+GroupIndex+''+index" name="radio_data" :value="list.pl_id">
                                    <i></i>
                                    <label @click="AddSelected(list.pl_id)" :for="'radio'+GroupIndex+''+index">{{ list.pl_name }} PLAN</label>
                                </div>
                                <div class="plan_info">{{ list.pl_device }}. {{ list.pl_inclusions }}</div>
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
.plan_info{
    width: 52%;
    line-height: 35px;
}
.plan_name{
    width: 48%;
}
.plan_overlay{
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background-color: rgba(134, 135, 134, 0.8);
}
.plan_name input[type='radio']:checked ~ i {
    background: #eead38;
    border-color: #eead38;
    color: #eead38;
}
.plan_view .info ul > li{
    padding: 21px;
}
.plan_view.smart .info ul > li.plan_selected{
    box-shadow: 0px 0px 9px 8px #eead38;
}
.plan_view.smart .info ul > li{
    border:1px solid transparent;
    border-top:1px solid #ffffff;
}
.plan_view.smart .option_main:before{
    border-color: #eead38;
    color: #eead38;
}
.plan_view.smart .header{    
    background-image: linear-gradient(90deg, rgba(204,157,70,1) 0%, rgba(204,157,70,1) 35%, rgba(183,114,43,1) 100%);
}
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
    color: #ffffff;
}
.plan_name input[type='radio'] ~ i {
    display: inline-block;
    width: 20px;
    height: 20px;
    position: absolute;
    left: 4px;
    top: 29px;
    border: 2px solid #919191;
    color: #919191;
    border-radius: 50%;
    line-height: 14px;
    text-align: center;
    font-style: normal;
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
  layout:'smart',
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
      SmartPlanGroup: [],
      SmartPlanGroupID: [],
      PldtOtherPlan: 0,
      PlanID: this.$route.params.slug
    }
  },
  mounted() {
      this.$axios.$get('getAllSmartPlans').then( res => {
        if(res){
          this.show = true;
          this.loading_toggle = false;
          this.PldtPlans = res;

          this.PldtPlans.forEach((element, index) => {
            const name = element.smarttype;
            const split = name.lastIndexOf(" ");
            const PlanType = name.substring(0, split);

            this.SmartPlanGroup.push(PlanType);
            this.SmartPlanGroupID.push(element.pl_plantype);
          });

          this.SmartPlanGroup = [ ...new Set(this.SmartPlanGroup) ];
          this.SmartPlanGroupID = [ ...new Set(this.SmartPlanGroupID) ];
        }
      }).catch( err => {
          console.log(err);
          this.errorToggle = true;
      });
      
  },
  methods:{
    PldtPlansFunc(PlanGroupName, PlanListId){
        const list_plan = [];
        this.PldtPlans.forEach((element, index) => {
            if(element.pl_plantype  == PlanGroupName && element.pl_id != PlanListId){
                list_plan.push({ pl_id: element.pl_id, pl_name: element.pl_name, pl_device: element.pl_device, pl_inclusions: element.pl_inclusions });
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
        const list_plan = [];
        this.PldtPlans.forEach((element, index) => {
            if(element.pl_id == this.PlanID){
                list_plan.push(element);
            }
            if(element.pl_id == this.PldtOtherPlan){
                list_plan.push(element);
            }
        });
        
        this.loading_toggle = true;
        const me = this;
        const formdata = new FormData();

        const split1 = list_plan[0].pt_type.lastIndexOf(" ");
        const plan_type1 = list_plan[0].pt_type.substring(0, split1);

        const split2 = list_plan[1].pt_type.lastIndexOf(" ");
        const plan_type2 = list_plan[1].pt_type.substring(0, split2);

        formdata.append("pc_category", 'SMART');
        formdata.append("pc_district", '');
        formdata.append("pc_store", '');
        formdata.append("pc_ipaddress", localStorage.getItem("ip_address"));
        formdata.append("pc_product1", list_plan[0].pt_product);
        formdata.append("pc_plantype1", plan_type1);
        formdata.append("pc_plan1", list_plan[0].pl_name);
        formdata.append("pc_product2", list_plan[1].pt_product);
        formdata.append("pc_plantype2", plan_type2);
        formdata.append("pc_plan2", list_plan[1].pl_name);
        this.$axios.post('insertPlanCompare', formdata)
        .then(function (res) {
            if(res.status == 200){
                $nuxt.$router.push({ path: '/smart/plan/compare/'+me.PlanID+'-'+me.PldtOtherPlan });
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