<template>
  <div class="vido">
    <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions">
    </video-player>
  </div>
</template>

<script>
  export default {
    name: "vido",
    props: {
      vidoUrl: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        playerOptions: {
          sources: [
            {
              type: "",
              src: "" //url地址
            }

          ],
          playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: false, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: "zh-CN",
          aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。

          poster: require("../assets/img/vido-bgc.gif"),
          // width: document.documentElement.clientWidth,
          notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true //全屏按钮
          }
        }
      };
    },

    components: {},

    computed: {},

    beforeMount() { },

    mounted() {
      this.playerOptions.sources[0].src = this.vidoUrl;
      // this.playerOptions['sources'][0].push(this.vidoUrl)
      console.log(this.vidoUrl);
    },

    methods: {},

    watch: {}
  };
</script>

<style lang="scss" scoped>
  .video-player {
    /* max-width: 68.5rem; */
    width: 60rem;

    @media screen and(max-width: 375px) {
      margin-bottom: 0.9375rem;
      max-width: 27rem;
    }

    @media screen and(min-width: 375px) and(max-width: 392px) {
      margin-bottom: 0.9375rem;
      max-width: 30rem;
    }

    @media screen and(min-width: 401px) and(max-width: 500px) {
      margin-bottom: 0.9375rem;
      /* width: 330px; */
      max-width: 35rem;
    }

    @media screen and (min-width: 500px) and (max-width: 768px) {
      margin-bottom: 0.9375rem;
      /* width: 40rem; */
      max-width: 50rem;
    }
  }
</style>