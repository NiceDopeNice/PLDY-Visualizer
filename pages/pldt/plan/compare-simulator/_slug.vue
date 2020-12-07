<template>
  <div class="product_page">

        <Header :loading="loading_toggle" :idleToggle="true" :footer="true" :footerColor="'pldt_footer'" :homeButton="true"  :backButton="true" :errorToggle="errorToggle" />

        <img class="product_logo" src="img/pldt.png" alt="" />
        <transition name="fade" v-if="show">
            <div class="simulator_main">
                <div class="simulator_header">
                    <h1>SPEED SIMULATOR</h1>
                    <p>Note: This simulation is based on test results with network efficiency at 80%</p>
                    <h2 v-if="Streaming">COMPARISON OF STREAMING OF A 1-MINUTE VIDEO</h2>
                    <h2 v-else >COMPARISON OF DOWNLOADING OF A 300MB FILE</h2>
                </div>
                
                <div class="simulator_body">
                    <div class="simulator_body_inside">
                        <div class="simulator_body_header">
                            {{ this.PlanDetails_1[0].pl_name }}
                        </div>
                        <div class="simulator_blackbox" v-if="Streaming">
                            <video id="video1" width="100%" autoplay muted >
                                <source :src="'video/' + this.PlanDetails_1[0].pl_speed + '.mp4'" type="video/mp4">
                            </video>
                        </div>
                        
                        <div class="simulator_downloading" v-else>
                            <div class="header">
                                <div class="text">
                                    300 MB FILE
                                </div>
                                <div class="icon">
                                    <b class="minimize">⚊</b>
                                    <b class="maximize">☐</b>
                                    <b class="terminate">x</b>
                                </div>
                                <div class="clear_both"></div>
                            </div>
 
                            <div class="body">
                                <p>Downloading...</p>
                                <div class="progress_percent">
                                    {{ this.progress_1 }}%
                                </div>
                                <div class="progressbar_main">
                                    <div class="progress_bar" :style="'width:'+this.progress_1+'%'">
                                    </div>
                                </div>
                                
                                <div class="progress_time">
                                    {{ this.downloadTimer_1 }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="simulator_body">
                    <div class="simulator_body_inside">
                        <div class="simulator_body_header">
                            {{ this.PlanDetails_2[0].pl_name }}
                        </div>
                        
                        <div class="simulator_blackbox" v-if="Streaming">
                            <video id="video2" width="100%" autoplay muted >
                                <source :src="'video/' + this.PlanDetails_2[0].pl_speed + '.mp4'" type="video/mp4">
                            </video>
                        </div>

                        <div class="simulator_downloading" v-else>
                            <div class="header">
                                <div class="text">
                                    300 MB FILE
                                </div>
                                <div class="icon">
                                    <b class="minimize">⚊</b>
                                    <b class="maximize">☐</b>
                                    <b class="terminate">x</b>
                                </div>
                                <div class="clear_both"></div>
                            </div>
 
                            <div class="body">
                                <p>Downloading...</p>
                                <div class="progress_percent">
                                    {{ this.progress_2 }}%
                                </div>
                                <div class="progressbar_main">
                                    <div class="progress_bar" :style="'width:'+this.progress_2+'%'">
                                    </div>
                                </div>
                                
                                <div class="progress_time">
                                    {{ this.downloadTimer_2 }}
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>

                <button class="toggleGOTO" type="button" @click="ToggleScreen">{{ this.buttonName }}</button>
                
                <div class="calculator_link">
                    <nuxt-link :to="'/pldt/plan/compare-options/'+this.PlanID">
                        <button type="button">COMPARE TO</button>
                    </nuxt-link>
                    <nuxt-link :to="'/pldt/plan/compare/'+this.PlanDetails_1[0].pl_id+'-'+this.PlanDetails_2[0].pl_id">
                        <button type="button">DATA CALCULATOR</button>
                    </nuxt-link>
                </div>

            </div>
        </transition>
        
    </div>
</template>

<style scoped >
    .toggleGOTO{
        border-radius: 0;
        width: 500px;
        background: #898989;
        color: #FFFFFF;
        font-size: 23px;
        outline: none;
        padding: 25px 0px;
        border: 1px solid transparent;
        margin-bottom: 30px;
    }
    .calculator_link button{
        width: 45%;
        height: 75px;
    }
    .simulator_blackbox{
        margin-bottom: 30px;
    }
    .simulator_body{
        margin-bottom: 50px;
    }
    .simulator_header h2{
        margin-top: 10px;
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
        PlanDetails: [],
        PlanID: this.$route.params.slug,
        downloadTimer_1: '0h:0m:0s',
        downloadTimer_2: '0h:0m:0s',
        progress_1: 0,
        progress_2: 0,
        downloading: false,
        PlanList: [],
        PlanDetails_1: [],
        PlanDetails_2: [],
        Streaming: true,
        buttonName: 'GO TO SIMULATION OF DOWNLOADING'
    }
  },
  mounted() {
      
      const PlanIDList = this.PlanID.split("-");
      
      // Plan Details
      this.$axios.$get('getAllPldtPlans').then( res => {
        if(res){
            this.PlanList = res; 

            this.PlanList.forEach((element, index) => {
                if(element.pl_id == PlanIDList[0]){
                    this.PlanDetails_1.push({ pl_id: element.pl_id, pl_name: element.pl_name, pl_download: element.pl_download, pl_speed: element.pl_speed });
                }
                if(element.pl_id == PlanIDList[1]){
                    this.PlanDetails_2.push({ pl_id: element.pl_id, pl_name: element.pl_name, pl_download: element.pl_download, pl_speed: element.pl_speed });
                }
            });
            this.show = true;
            this.loading_toggle = false; 

        }
      }).catch( err => {
          console.log(err);
          this.errorToggle = true;
      });
  },
  methods: {
    ToggleScreen(){
        this.Streaming = !this.Streaming;
        this.buttonName = this.Streaming ? 'GO TO SIMULATION OF DOWNLOADING' : 'GO TO SIMULATION OF STREAMING';
        this.progress_1 = 0;
        this.progress_2 = 0;
        clearInterval(this.downloadInterval);

        const startTime = new Date().getTime();
        const intervalToggle_1 = false;
        const intervalToggle_2 = false;
        this.downloadInterval = setInterval(() => {
            // update progress
            let timeElapsed = Math.round((new Date().getTime() - startTime) / 1000);

            this.progress_1 = (timeElapsed / this.PlanDetails_1[0].pl_download * 100).toFixed(1);
            this.progress_2 = (timeElapsed / this.PlanDetails_2[0].pl_download * 100).toFixed(1);

            let remaining_1 = Math.round(this.PlanDetails_1[0].pl_download - timeElapsed);
            this.downloadTimer_1 = this.timeToString(remaining_1);
            
            let remaining_2 = Math.round(this.PlanDetails_2[0].pl_download - timeElapsed);
            this.downloadTimer_2 = this.timeToString(remaining_2);

            if (this.progress_1 >= 100) {
                this.progress_1 = 100;
                this.downloadTimer_1 = 'Finished';
            }

            if (this.progress_2 >= 100) {
                this.progress_2 = 100;
                this.downloadTimer_2 = 'Finished';
            }

            if(this.downloadTimer_1 == 'Finished' && this.downloadTimer_2 == 'Finished'){
                clearInterval(this.downloadInterval);
            }
            
        }, 100); 
    },
    timeToString(time) {
        // rates
        let secondsRate   = 1;
        let minutesRate   = 60;
        let hoursRate     = 3600;
        let daysRate      = 24 * 3600;

        let days = Math.floor(time / daysRate);
        time = time - (days * daysRate);

        let hours = Math.floor(time / hoursRate);
        time = time - (hours * hoursRate);

        let minutes = Math.floor(time / minutesRate);
        time = time - (minutes * minutesRate);

        let seconds = time;
        let stringValue = '';
        if (days > 0) {
            stringValue += days + 'd:';
        }
        if (hours > 0) {
            stringValue += hours + 'h:';
        }
        if (minutes > 0) {
            stringValue += minutes + 'm:';
        }
        stringValue += seconds + 's';

        return stringValue;
    }
  }
}


</script>

<style>

</style>