<template>
    <div class="product_page" :class="ToggleFooterZindex ? 'footer_zindex':''">

        <Header :loading="loading_toggle" :idleToggle="true" :footer="true" :footerColor="'pldt_footer'" :homeButton="true"  :backButton="true" :errorToggle="errorToggle" />

        <img class="product_logo" src="img/pldt.png" alt="" />
        <transition name="fade" v-if="show">
            <section class="calculator_main">

                <h1>DATA CALCULATOR</h1>
                <h2>PLDT DATA PLAN COMPARISON</h2>

                <div class="comp_leftside">
                    <div class="calculator_slider_main">
                        <div class="calculator_slider_indi">
                            <div class="calculator_num_device">
                                <div class="slider_holder_icon">
                                    <img src="img/icons/devices.png" alt="">
                                </div>   

                                <div class="slider_holder" style="margin-bottom: 0px;">
                                    <label>Number of Devices</label>
                                    <range-slider class="slider" :min="NumDevice.min" :max="NumDevice.max" step="1" @change="updateMeters" v-model="NumDevice.value">
                                    </range-slider>
                                    <div class="value">
                                        {{ NumDevice.value }}
                                        <span v-if="NumDevice.value < 2">User</span>
                                        <span v-else>Users</span> 
                                    </div>
                                </div>
                            </div>       
                        </div>
                    </div>

                    <div class="calculator_slider_main">
                        <div class="calculator_slider_indi">
                            <div class="calculator_left">
                                <div class="calculator_loop" v-for="list in EstimatedList" :key="list.id">
                                    <div class="slider_holder_icon">
                                        <img :src="'img/icons/'+list.Image" alt="">
                                    </div>   
                                    <div class="slider_holder">
                                        <label>{{ list.title }}</label>
                                        <range-slider class="slider" :min="list.min" :max="list.max" step="1" @change="updateMeters" v-model="list.value">
                                        </range-slider>
                                        <div class="value">
                                            {{ list.value }}
                                            <span v-if="list.value <= 1 || list.SubtitleWs == '' ">{{ list.Subtitle }}</span>
                                            <span v-else>{{ list.SubtitleWs }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="comp_rightside">
                    <div class="calculator_holder">
                        <div class="calculator_box datausage">
                            <div class="header">
                                Estimated Data Usage
                            </div>

                            <div class="calculator_data">
                                <img src="img/gauge.png" alt="" style="width: 100%;">
                                <div class="calculator_count">{{ this.data }}GB</div>
                                <div class="bar" :style="'height: '+BarHeight" :class="{'limit' : PlanDetails_1[0].pl_allowance != 'unlimited' && this.data > PlanDetails_1[0].pl_allowance}"></div>
                            </div>
                        </div>
                    </div> 

                    <div class="calculator_holder">
                        <div class="calculator_box downloadtime">
                            <div class="header">
                                Estimated Download Time
                            </div>

                            <div class="calculator_meter">
                                 <h3>{{ this.PlanDetails_1[0].pl_name }} </h3>
                                <img src="img/meter.png" alt="">
                                <div class="pointer" :style="'transform: '+PointerTransform_1"></div>
                                <!-- <img src="img/pointer.png" class="pointer" :style="'transform: '+PointerTransform_1" alt=""> -->
                            </div>

                            <div class="calculator_hours">{{ this.hours_1 }} HOURS</div>
                            <button class="calculator_breakdown" @click="OpenBreakdown(1)" type="button">Breakdown Online Activities</button>
                        </div>
                    </div>

                    <div class="calculator_holder">
                        <div class="calculator_box downloadtime">
                            <div class="header">
                                Estimated Download Time
                            </div>

                            <div class="calculator_meter">
                                 <h3>{{ this.PlanDetails_2[0].pl_name }}</h3>
                                <img src="img/meter.png" alt="">
                                <div class="pointer" :style="'transform: '+PointerTransform_2"></div>
                                <!-- <img src="img/pointer.png" class="pointer" :style="'transform: '+PointerTransform_1" alt=""> -->
                            </div>

                            <div class="calculator_hours">{{ this.hours_2 }} HOURS</div>
                            <button class="calculator_breakdown" @click="OpenBreakdown(2)" type="button">Breakdown Online Activities</button>
                        </div>
                    </div>
                </div>

                <div class="clear_both"></div>

                <div class="calculator_link">
                    <button type="button" @click="OpenLegend">VIEW DATA LEGEND</button>
                    <nuxt-link :to="'/pldt/plan/compare-options/'+this.PlanDetails_1[0].pl_id">
                        <button type="button">COMPARE TO</button>
                    </nuxt-link>
                    <nuxt-link :to="'/pldt/plan/compare-simulator/'+this.PlanDetails_1[0].pl_id+'-'+this.PlanDetails_2[0].pl_id">
                        <button type="button">SPEED SIMULATOR</button>
                    </nuxt-link>
                </div>

            </section>
        </transition>
        
        <div class="plan_overlay" v-if="showOverlay"></div>
        
        <!-- LEGEND -->
        <section class="plan_view" v-if="ShowLegend" :class="ToggleLegend ? 'close_plan':'show_plan'">            
            <div class="header">
                <h1>DATA LEGEND</h1>
            </div>
            <div class="info legend">
                <table class="legend_table">
                    <thead>
                        <tr>
                            <th>ITEM/DATA</th>
                            <th>QUANTITY</th>
                            <th>SIZE</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="list in EstimatedList" :key="list.id">
                            <td>{{ list.title }}</td>
                            <td>1</td>
                            <td>{{ list.size_txt }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="info legend">
                <h1>DISCLAIMER</h1>
                <p class="info_details disclaimer">
                    Actual file sizes will vary. File sizes for videos will also depend on encoding types and settings used.
                    These are approximate file sizes which have been averaged out.
                </p>
            </div>
            <div class="button_info">
                <button class="plan_close" @click="CloseLegend">CLOSE</button>
            </div>
        </section>

        <!-- BREAKDOWN -->
        <section class="plan_view" v-if="ShowBreakdown" :class="ToggleBreakdown ? 'close_plan':'show_plan'">            
            <div class="header">
                <h1>Breakdown of Online Activities per user</h1>
                <h2 v-if="breakDownActive == 1">{{ this.PlanDetails_1[0].pl_name }}</h2>
                <h2 v-else >{{ this.PlanDetails_2[0].pl_name }}</h2>
            </div>
            <div class="info legend">
                <table class="legend_table">
                    <thead>
                        <tr>
                            <th>ITEM/DATA</th>
                            <th>QUANTITY</th>
                            <th>DOWNLOAD TIME</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(list, index) in EstimatedList" :key="list.id">
                            <td>{{ list.title }}</td>
                            <td>{{ list.value }}</td>
                            <td v-if="breakDownActive == 1">{{ ConvertDownloadTime(list.value * PlanDL_1[index].d_time) }}</td>
                            <td v-else >{{ ConvertDownloadTime(list.value * PlanDL_2[index].d_time) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="info legend">
                <h1>DISCLAIMER</h1>
                <p class="info_details disclaimer">
                    Assuming that the network efficiency is always at 80%.
                </p>
            </div>
            <div class="button_info">
                <button class="plan_close" @click="CloseBreakdown">CLOSE</button>
            </div>
        </section>
    </div>
</template>

<style scoped >
.calculator_link button{
    width: 30%;
    height: 75px;
}
.calculator_main h2{
    margin-bottom: 5px;
}
.calculator_breakdown {
    margin-top: 10px;
    width: 80%;
}
.calculator_meter .pointer {
    width: 35px;
    height: 130px;
    transform: rotate(-112deg);
    transform-origin: 18px 106px;
    bottom: 27%;
    left: 43%;
}
.calculator_box.datausage {
    margin-bottom: 5px;
}
.calculator_meter h3{
    font-size: 22px;
    height: 55px;
}
.calculator_hours {
    padding: 1px;
    margin-top: -45px;
}
.calculator_box .calculator_meter {
    padding: 20px 0px 10px 0px;
    width: 255px;
}
.calculator_data {
    padding: 15px 10px 0px 10px;
}
.calculator_data .calculator_count{
    left: 145px;
    bottom: 144px;
}
.calculator_box.downloadtime {
    margin-bottom: 15px;
    padding-bottom: 10px;
}
.calculator_box .header {
    font-size: 1.5em;
    padding: 15px 10px 15px 4px;
}
.calculator_slider_indi{
    padding: 15px;
}
.comp_leftside{
    float: left;
    width: 60%; 
}
.comp_rightside{
    float: right;
    width: 40%; 
}
.calculator_holder{
    width: 90%;
}
.comp_leftside .calculator_slider_main{
    width: 88%;
}
.calculator_num_device{
    width: 100%;
    padding: 5px 0px 0px 0px;
}
.calculator_left{
    float: none;
    width: 100%;
}
.slidecontainer{
    padding:10px;
}
.range-slider-inner {
    overflow: unset;
}
.range-slider {
    width: 100%;
    height: 32px;
    padding: 0 20px 0px 19px;
    margin: 5px;
}
.slider_holder label, .slider_holder .value{
    padding-left: 13px;
    font-size: 15px;
}
.slider_holder label{
    font-weight: 100;
    font-size: 1em;
}
.range-slider-knob {
    width: 30px;
    height: 30px;
    border: 1px solid #AAA;
    background: #DDD;
    background: linear-gradient(to bottom, rgba(255,255,255,1) 0%,rgba(220,220,220,1) 20%,rgba(255,255,255,1) 100%);
}
.range-slider-rail, .range-slider-fill{
    height: 10px;
}
.range-slider-rail {
    background: #EEE;
    background: linear-gradient(to bottom, #DDD -50%, #FFF 150%);
    border: 1px solid #CCC;
    border-radius: 16px;
    -moz-border-radius: 16px;
}
.range-slider-fill{
    background-color: #fa2e32;
    border-radius: 16px;
}
.plan_overlay{
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background-color: rgba(134, 135, 134, 0.8);
}
.calculator_data .bar{
    left: 120px;
}
</style>

<script>
import axios from 'axios';
import Header from "~/components/Nuxt_header";
import RangeSlider from "vue-range-slider";
import "vue-range-slider/dist/vue-range-slider.css";

export default {
  layout:'pldt',
  components: {
    Header,
    RangeSlider
  },
  data(){
    return {
        show: false,
        loading_toggle: true,
        showOverlay: false,
        ToggleFooterZindex: false,
        errorToggle: false,
        ShowLegend: false,
        ToggleLegend: true,
        ShowBreakdown: false,
        ToggleBreakdown: true,
        PlanDetails_1: [],
        PlanDetails_2: [],
        PlanList: [],
        PlanDL_1: [],
        PlanDL_2: [],
        PlanID: this.$route.params.slug,
        data: 0,
        hours_1: 0,
        hours_2: 0,
        breakDownActive: 0,
        BarHeight: '0px;',
        PointerTransform_1: 'rotate(-112deg)',
        PointerTransform_2: 'rotate(-112deg)',
        NumDevice: {min: 1,max: 20,value: 1},
        EstimatedList: [
            { container: 'left', id: 1,min: 0,max: 1000,value: 0,size: 20, size_txt: '20KB', title: 'Emails',Image: 'email.png',Subtitle: 'Email',SubtitleWs: 'Emails'},
            { container: 'left', id: 2,min: 0,max: 500,value: 0,size: 300, size_txt: '300KB', title: 'Emails with attachment',Image: 'email-attachment.png',Subtitle: 'Email w/ attachment',SubtitleWs: ''},
            { container: 'left', id: 3,min: 0,max: 50,value: 0,size: 4000, size_txt: '4MB', title: 'Songs/MP3',Image: 'song.png',Subtitle: 'Song/MP3',SubtitleWs: 'Songs/MP3'},
            { container: 'left', id: 4,min: 0,max: 20,value: 0,size: 300000, size_txt: '300MB', title: 'Standard Definition TV Shows',Image: 'tv.png',Subtitle: 'TV show episode (Standard Definition)',SubtitleWs: 'TV show episodes (Standard Definition)'},
            { container: 'left', id: 5,min: 0,max: 20,value: 0,size: 1000000, size_txt: '1GB', title: 'High Definition TV Shows',Image: 'tv.png',Subtitle: 'TV show episode (High Definition)',SubtitleWs: 'TV show episodes (High Definition)'},
            { container: 'left', id: 6,min: 0,max: 20,value: 0,size: 800000, size_txt: '800MB', title: 'Standard Definition Movies',Image: 'movie.png',Subtitle: 'Movie (Standard Definition)',SubtitleWs: 'Movies (Standard Definition)'},
            { container: 'right', id: 7,min: 0,max: 20,value: 0,size: 2000000, size_txt: '2GB', title: 'High Definition Movies',Image: 'movie.png',Subtitle: 'Movie (High Definition)',SubtitleWs: 'Movies (High Definition)'},
            { container: 'right', id: 8,min: 0,max: 20,value: 0,size: 12000, size_txt: '12MB', title: '1-minute Standard Definition Videos',Image: 'stream.png',Subtitle: '1-minute Stream Standard Definition Video',SubtitleWs: '1-minute Standard Definition Videos Streamed'},
            { container: 'right', id: 9,min: 0,max: 20,value: 0,size: 45000, size_txt: '45MB', title: '1-minute High Definition Videos',Image: 'stream.png',Subtitle: '1-minute Stream Standard Definition Video',SubtitleWs: '1-minute High Definition Videos Streamed'},
            { container: 'right', id: 10,min: 0,max: 500,value: 0,size: 5000, size_txt: '5MB', title: 'Photos',Image: 'photo.png',Subtitle: 'Photo uploaded',SubtitleWs: 'Photos uploaded'},
            { container: 'right', id: 11,min: 0,max: 50,value: 0,size: 300, size_txt: '300KB', title: '1-minute online gaming',Image: 'game.png',Subtitle: '1-minute online gaming',SubtitleWs: ''},
            { container: 'right', id: 12,min: 0,max: 100,value: 0,size: 5000, size_txt: '5MB', title: 'Apps/Games',Image: 'app.png',Subtitle: 'App/Game downloaded for mobile',SubtitleWs: 'Apps/Games downloaded for mobile'}
        ]
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
                    this.PlanDetails_1.push({ pl_id: element.pl_id, pl_name: element.pl_name, pl_info: element.pl_info, pl_allowance: element.pl_allowance });
                }
                if(element.pl_id == PlanIDList[1]){
                    this.PlanDetails_2.push({ pl_id: element.pl_id, pl_name: element.pl_name, pl_info: element.pl_info, pl_allowance: element.pl_allowance });
                }
            });
            this.show = true;
            this.loading_toggle = false; 

        }
      }).catch( err => {
        console.log(err);
        this.errorToggle = true;
      });

      // Plan Download Times
      this.$axios.$get('getDlByPlanId?d_plan='+PlanIDList[0]).then( res => {
        if(res){
          this.PlanDL_1 = res;
        }
      }).catch( err => {
        console.log(err);
        this.errorToggle = true;
      });

      // Plan Download Times
      this.$axios.$get('getDlByPlanId?d_plan='+PlanIDList[1]).then( res => {
        if(res){
          this.PlanDL_2 = res;
        }
      }).catch( err => {
        console.log(err);
        this.errorToggle = true;
      });
  },
  methods: {
      updateMeters: function(){
        let totalData = 0;
        let totalDownloadTime_1 = 0;
        let totalDownloadTime_2 = 0;

        this.EstimatedList.forEach((element, index) => {
            totalData += element.value * element.size;
            totalDownloadTime_1 += element.value * this.PlanDL_1[index].d_time;
            totalDownloadTime_2 += element.value * this.PlanDL_2[index].d_time;
        });

        this.data = Math.round(totalData / 1000000) * this.NumDevice.value;
        this.hours_1 = Math.round(totalDownloadTime_1 / 3600) * this.NumDevice.value;
        this.hours_2 = Math.round(totalDownloadTime_2 / 3600) * this.NumDevice.value;

        let pointerHours_1 = this.hours_1 > 110 ? 108 : this.hours_1;
        let pointerHours_2 = this.hours_2 > 110 ? 108 : this.hours_2;
        let barHeight = this.data > 110 ? 110 : this.data;
        
        this.PointerTransform_1 = 'rotate(' + ((pointerHours_1 * 2.23) - 112) + 'deg)';
        this.PointerTransform_2 = 'rotate(' + ((pointerHours_2 * 2.23) - 112) + 'deg)';

        this.BarHeight = (barHeight * 2.3) + 'px';
      },
      OpenLegend(){ 
          this.showOverlay = true; 
          this.ShowLegend = true;
          this.ToggleLegend = false; 
          this.ToggleFooterZindex = true;
      },
      CloseLegend(){
          this.ToggleLegend = true; 
          this.showOverlay = false; 
          this.ToggleFooterZindex = false;
      },
      OpenBreakdown(breakdown){
          this.breakDownActive = breakdown
          this.showOverlay = true; 
          this.ShowBreakdown = true;
          this.ToggleBreakdown = false; 
          this.ToggleFooterZindex = true;
      },
      CloseBreakdown(){
          this.ToggleBreakdown = true; 
          this.showOverlay = false; 
          this.ToggleFooterZindex = false;
      },
      ConvertDownloadTime(seconds) {
        let time = [];
        let hours = Math.floor(seconds / 3600);
        seconds = seconds - (hours * 3600);
        let minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds - (minutes * 60));

        if (hours > 0) {
            time.push(hours + ' hour' + (hours > 1 ? 's' : ''));
        }

        if (minutes > 0) {
            time.push(minutes + ' minute' + (minutes > 1 ? 's' : ''));
        }

        if (seconds > 0) {
            time.push(seconds + ' second' + (seconds > 1 ? 's' : ''))
        }


        return time.length ? time.join(', ') : '0 second';
    }
  }
}


</script>