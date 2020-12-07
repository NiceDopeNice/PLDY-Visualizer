<template>
  <div class="container_home">

    <Header :loading="loading_toggle" :idleToggle="false" :footer="false" :footerColor="'default'" :homeButton="false"  :backButton="false" :errorToggle="errorToggle"  />
    <transition name="fade" v-if="show">
      <section>
        <img src="img/ps_logo.png" alt="" class="ps_logo">
        <div class="start_container" v-if="!setup">
          <div class="fits_me">WHAT PLAN FITS ME?</div>
          <div class="play_cont">
            <nuxt-link to="service">
              <img src="img/play.svg" alt="">
            </nuxt-link>
          </div>
          <p class="touch_beg">Touch to begin</p>
          <div class="choose_plan">Choose a plan and know if it fits your data consumption, plus simulate and compare different data speeds.</div>
        </div>

        <div class="setup_container" v-else>
          <div class="setup_title">
            <h1>Step 1: Set the location of this Visualizer</h1>
          </div>

          <div class="setup_ip">
            <p>Your Static IP Address:</p>
            <p><b>{{ ip }}</b></p>
          </div>

          <div class="setup_forms">
            <div class="form-group">
              <label class="control-label">District:</label>
              <div class="select">
                <select class="district" tyle="text-align:center;" @change="SelectDistrict($event)" required="">
                  <option value="">-- Select District --</option>
                  <option :value="d_list.district_id" v-for="d_list in district" :key="d_list.district_id">{{ d_list.district_name }}</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="control-label">Sales and Service Center:</label>
              <div class="select">
                <select class="ssc" tyle="text-align:center;" required="">
                  <option value="">-- Select SSC --</option>
                  <option :value="list.ssc_id" v-for="list in ssc_filter" :key="list.ssc_id">{{ list.ssc_name }}</option>
                </select>
              </div>
            </div>
          </div> 

          <div class="setup_button">
            <button type="button" @click="Proceed">Proceed</button>
          </div>

        </div>

        <div class="error_popup" v-if="setup_error">
          <img src="img/error_icon.png" alt="">
            <p v-if="errormessage_toggle">
              Please choose District and SSC.
            </p>
            <p v-else>
              Please disable local ips with mdns and relaunch the browser.
            </p>
            <div class="error_button_holder"  v-if="errormessage_toggle">
              <button type="button" @click="closeError">Okay</button>
            </div>
        </div>

      </section>
    </transition>

  </div>
</template>

<style scoped >
.setup_button button{
  color: #fff;
  background-color: #d9534f;
  border-color: #d43f3a;
  font-size: 1.5em;
  padding: 10px 20px;
  border-radius: 10px;
  outline: none;
}
.setup_container{
  width: 80%;
  margin: 0 auto;
  margin-top: 35%;
}
.setup_title{
  margin: 30px 0px;
  font-size: 2em;
}
.setup_ip{
  margin-bottom: 30px;
}
.setup_ip p{
  margin-bottom: 10px;
  font-size: 1.5em;
}
.form-group{
  width: 90%;
  margin:0 auto;
  margin-bottom: 40px;
}
.control-label{
  font-size: 1.6em;
}
.select {
    width: 80%;
    margin: 0 auto;
    background: #f3f2f2;
    border-top: 10px solid #ccc;
    position: relative;
    height: 70px;
}
::-webkit-scrollbar-thumb {
    background: #969696;
    border-radius: 0;
}
.select>select {
    background: 0 0;
    border: none;
    font-size: 2em;
    height: 60px;
    width: 100%;
    outline: 0;
    z-index: 2;
    box-shadow: none!important;
    color:#000000;
    padding-left: 20px;
}
</style>

<script>
import axios from 'axios';
import Header from "~/components/Nuxt_header";
import $ from 'jquery';

export default {
  components: {
    Header
  },
  data(){
    return {
      setup: false,
      show: false,
      loading_toggle: true,
      district: [],
      ssclogin: [],
      ssc_filter: [],
      dis: false,
      ssc: false,
      errorToggle: false,
      setup_error: false,
      errormessage_toggle: true,
      ip: ''
    }
  },
  mounted() {
    
      this.$axios.$get('getDistrict').then( res => {
        if(res){
          this.dis = true;
          this.district = res;
        }
      }).catch( err => {
          this.errorToggle = true;
      });
    
      this.$axios.$get('getSSCLogin').then( res => {
        if(res){
          this.ssc = true;
          this.ssclogin = res;
        }
      }).catch( err => {
          this.errorToggle = true;
      });

    function getLocalIP() {
      return new Promise(function(resolve, reject) {
        // NOTE: window.RTCPeerConnection is "not a constructor" in FF22/23
        var RTCPeerConnection = /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

        if (!RTCPeerConnection) {
          reject('Your browser does not support this API');
        }
        
        var rtc = new RTCPeerConnection({iceServers:[]});
        var addrs = {};
        addrs["0.0.0.0"] = false;
        
        function grepSDP(sdp) {
            var hosts = [];
            var finalIP = '';
            sdp.split('\r\n').forEach(function (line) { // c.f. http://tools.ietf.org/html/rfc4566#page-39
                if (~line.indexOf("a=candidate")) {     // http://tools.ietf.org/html/rfc4566#section-5.13
                    var parts = line.split(' '),        // http://tools.ietf.org/html/rfc5245#section-15.1
                        addr = parts[4],
                        type = parts[7];
                    if (type === 'host') {
                        finalIP = addr;
                    }
                } else if (~line.indexOf("c=")) {       // http://tools.ietf.org/html/rfc4566#section-5.7
                    var parts = line.split(' '),
                        addr = parts[2];
                    finalIP = addr;
                }
            });
            return finalIP;
        }
        
        if (1 || window.mozRTCPeerConnection) {      // FF [and now Chrome!] needs a channel/stream to proceed
            rtc.createDataChannel('', {reliable:false});
        };
        
        rtc.onicecandidate = function (evt) {
            // convert the candidate to SDP so we can run it through our general parser
            // see https://twitter.com/lancestout/status/525796175425720320 for details
            if (evt.candidate) {
              var addr = grepSDP("a="+evt.candidate.candidate);
              resolve(addr);
            }
        };
        rtc.createOffer(function (offerDesc) {
            rtc.setLocalDescription(offerDesc);
        }, function (e) { console.warn("offer failed", e); });
      });
    }

  // USAGE
  if(!localStorage.getItem("ip_address")){  
    getLocalIP().then((IpAddress) => {
      
      // if chrome://flags/#enable-webrtc-hide-local-ips-with-mdns is disabled
      if(IpAddress.length < 15){
        this.$axios.$get('checkIP?ip='+IpAddress).then( res => {

          // if district and ssc is loaded
          if(this.dis && this.ssc){
            this.show = true;
            this.loading_toggle = false;
          }
          
          // // Set Local Storage IP
          // localStorage.setItem("ip_address", IpAddress);
          
          if(res.length > 0){ 
            this.setup = false;
            // Set Local Storage IP
            localStorage.setItem("ip_address", IpAddress);

          }else{
            this.ip = IpAddress;
            this.setup = true;
          }
        }).catch( err => {
            this.errorToggle = true;
            console.log(err);
        });
      }else{
        this.show = true;
        this.loading_toggle = true;
        this.setup_error = true;
        this.errormessage_toggle = false;
      }

    });
    
  // if local storage ip is available
  }else{
    this.show = true;
    this.loading_toggle = false;
  }
  },
  methods:{
    SelectDistrict(event){
      const optionVal = event.target.value;
      this.ssc_filter = [];
      this.loading_toggle = true;

      setTimeout(() => {
        if(optionVal != ""){ 
            this.ssclogin.forEach((element, index) => {
                if(element.ssc_district == optionVal){
                    this.ssc_filter.push(element);
                }
            });
        }
        this.loading_toggle = false;
      }, 500);
    }, 
    Proceed(){
      const me = this;
      const district_id = $(".district").find("option:selected").val();
      const ssc_id = $(".ssc").find("option:selected").val();
      this.loading_toggle = true;

        if(district_id != '' && ssc_id != ''){
            const formdata = new FormData();
            formdata.append("location_ip", this.ip);
            formdata.append("location_district", district_id);
            formdata.append("location_ssc", ssc_id);

            this.$axios.post('insertIP', formdata)
            .then(function (res) {
              if(res.status == 200){
                localStorage.setItem("ip_address", me.ip);
                me.loading_toggle = false;
                me.setup = false;
              }
            })
            .catch(function (error) {
              me.errorToggle = true;
              console.log(error);
            });
        }else{
          this.setup_error = true;
          this.errormessage_toggle = true;
        }
    },
    closeError(){
      this.loading_toggle = false;
      this.setup_error = !this.setup_error;
    }
  }
}
</script>