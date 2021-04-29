<template>
  <div class='indexMain'>
    <button class="playsound"
      @click="audioCtx.resume()"
      ref="playsound">play</button>
    <audio :src="audioUrl"
      autoplay
      ref="audioElement"></audio>
    <!-- :muted='true' -->
  </div>
</template>

<script>
// import Axios from 'axios'

export default {
  data () {
    return {
      tokenSymbol: Symbol('token'),
      tokenInfo: {},
      audioCtx: null,
      loading: true,
      audioUrl: '',
      ismuted: true
    }
  },
  methods: {
    loadeddata () {
      console.log(222)
      console.log(window.audioEle = this.$refs.audioElement)
      // this.$refs.au
      // this.$refs.audioElement.muted = true
      // this.$refs.audioElement.play()
    },
    returnQuery (params) {
      return Object.keys(params).map(itemM => `${itemM}=${params[itemM]}`).join('&')
    },
    getToken (params = {
      grant_type: 'client_credentials',
      client_id: 'd912b11f09404506bf0e3662ad54aeaa',
      client_secret: '820b9156c5544a7e934bd9f55206a368'
    }) {
      return new Promise((resolve, reject) => {
        fetch(`https://openapi.data-baker.com/oauth/2.0/token?${this.returnQuery(params)}`).then(res => {
          resolve(res.json())
        }).catch(res => {
          reject(res)
        })
      })
    },
    getVoice (msg, { speed, volume, pitch, audiotype, rate, voiceName } = { speed: 5, volume: 5, pitch: 5, audiotype: 3, rate: 2, voiceName: 'Lingyi' }) {
      console.log(this)
      const config = {
        text: msg,
        access_token: this.tokenInfo.access_token,
        domain: 1,
        language: 'ZH',
        speed, // 语音速度
        volume, // 语音音量
        pitch, // 语音音调
        audiotype, // 音频种类
        rate, // 码率
        voice_name: voiceName // 发音人
        // spectrum_8k, // 低频部分频谱
      }
      return new Promise((resolve, reject) => {
        fetch(`https://openapi.data-baker.com/tts?${this.returnQuery(config)}`).then(res => {
          resolve(res.blob())
        }).catch(res => {
          reject(res)
        })
      })
    },
    triggerPlaySound (blob) {
      // ******调用AudioContext api自动播放 绕过谷歌等浏览器不可自动播放的限制
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext)()
      let readerFile = new FileReader()
      readerFile.readAsArrayBuffer(blob)
      readerFile.onload = (e) => {
        this.audioCtx.decodeAudioData(e.target.result).then((decodedData) => {
          let audioBufferSourceNode = this.audioCtx.createBufferSource()
          audioBufferSourceNode.buffer = decodedData
          audioBufferSourceNode.connect(this.audioCtx.destination)
          audioBufferSourceNode && audioBufferSourceNode.start(0)
          // this.audioCtx.resume()
          // const getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
          //   navigator.mozGetUserMedia || navigator.msGetUserMedia)
          // getUserMedia({ audio: true }).then(() => {
          // this.audioCtx.resume()
          // setTimeout(() => {
          //   if (typeof MouseEvent === 'function') {
          //     var event = new MouseEvent('click', {
          //       view: window,
          //       bubbles: true,
          //       cancelable: false
          //     })
          //     this.$refs.playsound.dispatchEvent(event)
          //   }
          // }, 2000)
          // })
          // navigator.MediaDevices.getUserMedia({ audio: true }).then(stream => {
          //   this.audioCtx.resume().then(() => {
          //     // do your job with microphone input
          //   })
          // })
        })
      }
    },
    autoplay () {
      this.$refs.audioElement.play()
    },
    getVoice2 (msg) {
      this.getVoice(msg).then(res => {
        // console.log(res)
        // this.triggerPlaySound(res)
        const url = window.URL.createObjectURL(res)
        console.log(url)
        this.audioUrl = url

        // this.autoplay()
        // ****** 下载
        // const linkElement = document.createElement('a')
        // linkElement.setAttribute('href', url)
        // linkElement.setAttribute('download', `${+new Date()}.mp3`)
        // if (typeof MouseEvent === 'function') {  // 模拟点击a标签
        //   var event = new MouseEvent('click', {
        //     view: window,
        //     bubbles: true,
        //     cancelable: false
        //   })
        //   linkElement.dispatchEvent(event)
        // }
        // ****** 元素添加至body
        // const linkElement = document.createElement('audio')
        // linkElement.setAttribute('src', url)
        // linkElement.setAttribute('autoplay', 'autoplay')
        // linkElement.setAttribute('muted', 'muted')
        // linkElement.setAttribute('controls', `controls`)
        // document.body.appendChild(linkElement)
        // setTimeout(() => {
        // linkElement.muted = false
        // })
      })
    }
  },
  mounted () {
    this.getToken().then(res => {
      console.log(res)
      this.tokenInfo = res
      this.getVoice2('您好，我们是中国电信的，请问是张三先生吗？是这样的，因为您的电信账单欠费了，所以特地来电提醒您抽空去网上营业厅或电信网点交下费用。那不好意思打扰了，再见！')
      window.onload = this.autoplay
    })
    window.addEventListener('mousedown', this.autoplay, false)
    window.getVoice = this.getVoice2
  },
  beforeDestroy () {
    window.removeEventListener('mousedown', this.autoplay, false)
  }
}
</script>

<style scoped lang='less'>
</style>
