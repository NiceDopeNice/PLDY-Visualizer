<template>
    <div class="product_page" :class="ToggleFooterZindex ? 'footer_zindex':''">

        <Header :loading="loading_toggle" :idleToggle="true" :footer="true" :footerColor="'pldt_footer'" :homeButton="true"  :backButton="true" :errorToggle="errorToggle" />

        <img class="product_logo" src="img/pldt.png" alt="" />
        <transition name="fade" v-if="show">
            <section class="calculator_main">

                <h1>DATA CALCULATOR</h1>
                <h2>{{ PlanDetails.pl_name }}</h2>

                <div class="calculator_holder">
                    <div class="calculator_box downloadtime">
                        <div class="header">
                            Estimated Download Time
                        </div>

                        <div class="calculator_meter">
                            <img src="img/meter.png" alt="">
                            <div class="pointer" :style="'transform: '+PointerTransform"></div>
                            <!-- <img src="img/pointer.png" class="pointer" :style="'transform: '+PointerTransform" alt=""> -->
                        </div>

                        <div class="calculator_hours">{{ this.hours }} HOURS</div>
                        <button class="calculator_breakdown" @click="OpenBreakdown" type="button">Breakdown Online Activities</button>
                    </div>
                </div>

                <div class="calculator_holder">
                    <div class="calculator_box datausage">
                        <div class="header">
                            Estimated Data Usage
                        </div>

                        <div class="calculator_data">
                            <img src="img/gauge.png" alt="">
                            <div class="calculator_count">{{ this.data }}GB</div>
                            <div class="bar" :style="'height: '+BarHeight" :class="{'limit' : PlanDetails.pl_allowance != 'unlimited' && this.data > PlanDetails.pl_allowance}"></div>
                        </div>
                    </div>
                </div>

                <div class="clear_both"></div>

                <div class="calculator_slider_main">
                    <div class="calculator_slider_indi">
                        <p>Please press and adjust slider indicator based on your estimated usage </p>
                        
                        <div class="calculator_num_device">
                            <div class="slider_holder_icon">
                                <img src="img/icons/devices.png" alt="">
                            </div>   

                            <div class="slider_holder">
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

                    <div class="calculator_left">
                        <div class="calculator_loop" v-for="list in EstimatedList.slice(0, 6)" :key="list.id">
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

                    <div class="calculator_right">
                        <div class="calculator_loop" v-for="list in EstimatedList.slice(6, 12)" :key="list.id">
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
                    <div class="clear_both"></div>

                    </div>
                </div>

                <div class="calculator_link">
                    <button type="button" @click="OpenLegend">VIEW DATA LEGEND</button>

                    <nuxt-link :to="'/pldt/plan/compare-options/'+PlanDetails.pl_id">
                        <button type="button">COMPARE TO</button>
                    </nuxt-link>

                    <nuxt-link :to="'/pldt/plan/solo-simulator/'+PlanDetails.pl_id">
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
                <h2>{{ PlanDetails.pl_name }}</h2>
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
                <h2>{{ PlanDetails.pl_name }}</h2>
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
                            <td>{{ ConvertDownloadTime(list.value * PlanDL[index].d_time) }}</td>
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

<style>
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
    font-size: 1.2em;
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
        errorToggle: false,
        ToggleFooterZindex: false,
        ShowLegend: false,
        ToggleLegend: true,
        ShowBreakdown: false,
        ToggleBreakdown: true,
        PlanDetails: [],
        PlanDL: [],
        PlanID: this.$route.params.slug,
        data: 0,
        hours: 0,
        BarHeight: '0px;',
        PointerTransform: 'rotate(-112deg)',
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

      // Plan Download Times
      this.$axios.$get('getDlByPlanId?d_plan='+this.PlanID).then( res => {
        if(res){
          this.show = true;
          this.loading_toggle = false;
          this.PlanDL = res;
        }
      }).catch( err => {
          console.log(err);
          this.errorToggle = true;
      });
  },
  methods: {
      updateMeters: function(){
        let totalData = 0;
        let totalDownloadTime = 0;

        this.EstimatedList.forEach((element, index) => {
            totalData += element.value * element.size;
            totalDownloadTime += element.value * this.PlanDL[index].d_time;
        });

        this.data = Math.round(totalData / 1000000) * this.NumDevice.value;
        this.hours = Math.round(totalDownloadTime / 3600) * this.NumDevice.value;

        let pointerHours = this.hours > 110 ? 108 : this.hours;
        let barHeight = this.data > 110 ? 110 : this.data;
        
        this.PointerTransform = 'rotate(' + ((pointerHours * 2.23) - 112) + 'deg)';

        this.BarHeight = (barHeight * 2.6) + 'px';
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
      OpenBreakdown(){
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