<template>
  <div class="product_page">

        <Header :loading="loading_toggle" :idleToggle="true" :footer="true" :footerColor="'pldt_footer'" :homeButton="true"  :backButton="true" :errorToggle="errorToggle" />

        <img class="product_logo" src="img/pldt.png" alt="" />
        <transition name="fade" v-if="show">
            <div class="simulator_main">
                <div class="simulator_header">
                    <h1>SPEED SIMULATOR</h1>
                    <h2>{{ PlanDetails.pl_name }}</h2>
                    <p>Note: This simulation is based on test results with network efficiency at 80%</p>
                </div>
                
                <div class="simulator_body">
                    <div class="simulator_body_inside">
                        <div class="simulator_body_header">
                            Streaming of a 1-minute video
                        </div>
                        <div class="simulator_blackbox">
                            <video id="video1" width="100%">
                                <source :src="'video/' + PlanDetails.pl_speed + '.mp4'" type="video/mp4">
                            </video>
                        </div>
                        <button type="button" @click="playVideo('video1')">VIEW</button>
                    </div>
                </div>
                
                <div class="simulator_body">
                    <div class="simulator_body_inside">
                        <div class="simulator_body_header">
                            Downloading of a 300 Mb file
                        </div>
                        <div class="simulator_downloading">
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
                                    {{ this.progress }}%
                                </div>
                                <div class="progressbar_main">
                                    <div class="progress_bar" :style="'width:'+this.progress+'%'">
                                    </div>
                                </div>
                                
                                <div class="progress_time">
                                    {{ this.downloadTimer }}
                                </div>
                            </div>

                        </div>
                        
                        <button type="button" @click="simulateDownload" :disabled="downloading">VIEW</button>
                    </div>
                </div>
                
                <div class="calculator_link">
                    <nuxt-link :to="'/pldt/plan/compare-options/'+this.PlanID">
                        <button type="button">COMPARE TO</button>
                    </nuxt-link>
                    <nuxt-link :to="'/pldt/plan/solo-calculator/'+this.PlanID">
                        <button type="button">DATA CALCULATOR</button>
                    </nuxt-link>
                </div>

            </div>
        </transition>
        
    </div>
</template>

<style scoped >
    .calculator_link button{
        width: 45%;
        height: 75px;
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
        downloadTimer: '0h:0m:0s',
        progress: 0,
        downloading: false
    }
  },
  mounted() {
      
      // Plan Details
      this.$axios.$get('getPldtPlanById?pl_id='+this.PlanID).then( res => {
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
    simulateDownload() {
        this.downloading = true;
        const startTime = new Date().getTime();
        this.downloadInterval = setInterval(() => {
            // update progress
            let timeElapsed = Math.round((new Date().getTime() - startTime) / 1000);

            this.progress = (timeElapsed / this.PlanDetails.pl_download * 100).toFixed(1);

            let remaining = Math.round(this.PlanDetails.pl_download - timeElapsed);
            this.downloadTimer = this.timeToString(remaining);

            if (this.progress >= 100) {
                this.progress = 100;
                this.downloadTimer = 'Finished';
                clearInterval(this.downloadInterval);
                this.downloading = false;
            }
        }, 100);
    },
    playVideo(videoID) {
        const videos = document.getElementById(videoID); 
        if (videos.paused) {
            videos.play(); 
        }else {
            videos.pause();
        }
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