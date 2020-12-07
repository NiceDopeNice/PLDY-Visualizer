<template>
  <div id="nuxt_header">
        <div class="idle_timer" v-if="idleToggle"><v-idle @idle="onidle" :duration="180" /></div>
        <div class="loading" v-if="loading">
          <div class="sk-circle">
            <div class="sk-circle1 sk-child"></div>
            <div class="sk-circle2 sk-child"></div>
            <div class="sk-circle3 sk-child"></div>
            <div class="sk-circle4 sk-child"></div>
            <div class="sk-circle5 sk-child"></div>
            <div class="sk-circle6 sk-child"></div>
            <div class="sk-circle7 sk-child"></div>
            <div class="sk-circle8 sk-child"></div>
            <div class="sk-circle9 sk-child"></div>
            <div class="sk-circle10 sk-child"></div>
            <div class="sk-circle11 sk-child"></div>
            <div class="sk-circle12 sk-child"></div>
          </div>
      </div>

      <div :class="'footer '+footerColor" v-if="footer">
          <nuxt-link :to="to" v-if="backButton">
              <div class="a_img_holder">
                  <img src="img/back.svg" alt="">
              </div>
              <span>HOME</span>
          </nuxt-link>
          <nuxt-link to="/" v-if="homeButton">
              <div class="a_img_holder">
                  <img src="img/Home-Icon.png" alt="">
              </div>
              <span>HOME</span>
          </nuxt-link>
      </div>

      <transition name="fade" v-if="errorToggle">
        <div class="error_popup" v-if="mapError">
          <img src="img/error_icon.png" alt="">
            <p>
              We're having technical issues at the moment,<br />
              Please try again later.
            </p>
            <div class="error_button_holder">
              <nuxt-link>
                OKAY
              </nuxt-link>
            </div>
        </div>

        <div class="error_popup" v-else>
          <img src="img/error_icon.png" alt="">
            <p>
              We're having technical issues at the moment,<br />
              Please try again later.
            </p>
            <div class="error_button_holder">
              <nuxt-link to="/">
                GO HOME
              </nuxt-link>
            </div>
        </div>
      </transition>

  </div>
</template>

<style>

</style>

<script>

export default {
  props: ['loading', 'idleToggle', 'footer', 'footerColor', 'homeButton', 'backButton', 'errorToggle', 'mapError'],
  computed: {
      to () {
          if (this.client || !this.$routerHistory || !this.$routerHistory.hasPrevious()) {
              // probably ssr, or hasn't navigated yet.
              return { path: '/' };
          }
          return { path: this.$routerHistory.previous().path };
      }
  },
  methods: {
    onidle() {
      this.$router.push({ name: 'index'})
    }
  }
}
</script>
