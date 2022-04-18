<template>
  <div class="justdance_wrap">
    <div class="pick_area fc">
      <div class="pick_info">
        <div class="song_name">{{ pickResult.songName }}</div>
        <a :href="hrefBase + pickResult.href">
          <img :src="pickResult.imgSrc" alt="" crossorigin="anonymous">
        </a>
      </div>
      <div class="pick_operation fr">
        <div v-if="!isShuffling" class="button shuffle" @click="shuffle">开始选取</div>
        <div v-else class="fr">
          <div class="button pick" @click="pickSong">选择</div>
          <div class="button stop" @click="pickSong('stop')">选择并结束</div>
        </div>
      </div>
    </div>

    <div class="pick_result">
      <div class="title">已选歌曲</div>
      <div class="pick_list fr">
        <div 
          v-for="(item, index) in pickList" 
          :key="index"
          class="pick_item"
        >
          <a :href="hrefBase + item.href">
            <img :src="item.imgSrc" alt="" crossorigin="anonymous">
          </a>
          <div class="song_name">{{ item.songName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import cheerio from 'cheerio'

export default {
  data() {
    return {
      hrefBase: 'https://justdance.fandom.com',
      webUrl: 'https://justdance.fandom.com/wiki/Home',
      resultList: [],
      pickResult: {
        songName: '',
        href: '',
        imgSrc: '',
      },
      pickList: [],
      shuffleTimer: null,
      // isShuffling: false,
      pickNum: 1,
    }
  },
  created() {
    this.getWebInfo()
  },
  computed: {
    isShuffling() {
      return this.shuffleTimer? true: false
    }
  },
  methods: {
    getWebInfo() {
      axios.get(this.webUrl).then(resp => {
        console.log("resp:", resp)
        let $ = cheerio.load(resp.data)
        console.log("$:", $)
        let list = $("#gallery-0 .wikia-gallery-item")
        // let list = $("#user-repositories-list li")
        for(let i = 0; i < list.length; i++) {
          let item = list.eq(i)
          let dataSrc = item.find(".thumbimage").attr("data-src")
          let posSubfix = dataSrc.indexOf('png')
          if(posSubfix == -1) {
            posSubfix = dataSrc.indexOf('jpg')
            if(posSubfix == -1) {
              console.warn("unmatch image format:", dataSrc)
            }
          }
          let title = item.find(".link-internal").attr("title")
          let result = {
            songName: title.slice(0, title.indexOf(' (')),
            href: item.find(".link-internal").attr("href"),
            imgSrc: dataSrc.slice(0, posSubfix+3),
          }
          this.resultList.push(result)
        }
        console.log("result list:", this.resultList)
        this.pickResult = this.resultList[0]
      })
    },
    shuffle() {
      this.shuffleTimer = setInterval(() => {
        let randomIndex = Math.floor(Math.random() * this.resultList.length)
        if(randomIndex == this.resultList.length) {
          console.log("randomIndex:", randomIndex)
        }
        this.pickResult = this.resultList[randomIndex]
        // 图片无法显示情况排查
        if(!this.pickResult.imgSrc.startsWith("https://static.wikia.nocookie.net")) {
          console.error("invalid imgSrc:", this.pickResult.imgSrc)
          console.log("related pickResult:", this.pickResult)
        }
      }, 100)
    },
    pickSong(op) {
      this.pickList.push(this.pickResult)
      if(op == 'stop') {
        clearInterval(this.shuffleTimer)
        this.shuffleTimer = null
        console.log(this.shuffleTimer)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.fr {
  display: flex;
  gap: 10px;
}
.fc {
  display: flex;
  flex-direction: column;
}
.justdance_wrap {
  .pick_area {
    .pick_info {
      img {
        width: 200px;
        height: 200px;
      }
    }
    .pick_operation {
      justify-content: center;
      .button {
        padding: 8px 10px;
        color: #ffffff;
        border-radius: 6px;
        background: rgb(102, 177, 255);
        &:hover {
          background: #409EFF;
        }
      }
    }
  }
  
}
</style>