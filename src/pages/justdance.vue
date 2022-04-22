<template>
  <div class="justdance_wrap fc">
    <div class="fr"><div class="button" @click="saveSongInfo">导出歌曲数据</div></div>
    <div class="pick_area fc">
      <div class="pick_info">
        <div class="song_name">{{ pickResult.songName }}</div>
        <a :href="hrefBase + pickResult.href">
          <img :src="pickResult.imgSrc" alt="" crossorigin="anonymous">
        </a>
      </div>
      <div class="pick_operation fr">
        <div v-if="!isShuffling || pickMode == 'auto'" class="fr">
          <div class="button shuffle" @click="shuffle">手动选取</div>
          <div class="button auto" @click="autoShuffleAndPick">
            自动选取
            <span @click.stop="">
              <input type="number" class="input_number" v-model="autoPickNum">
            </span>
            首歌曲
          </div>
        </div>

        <div v-else class="fr">
          <div class="button pick" @click="pickSong">选择</div>
          <div class="button stop" @click="pickSong('stop')">选择并结束</div>
        </div>
      </div>
    </div>

    <div class="pick_result">
      <!-- <div class="box_shadow"></div> -->
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
// import xlsx from 'node-xlsx'

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
      pickMode: 'manual', // 选曲模式：manual-手动 auto-自动
      autoPickNum: 3,
    }
  },
  created() {
    this.getJustdanceInfo()
    document.onkeydown = (e) => {
      if(e.code == 'Space') {
        if(!this.isShuffling) {
          this.shuffle()
        }
        else {
          this.pickSong()
        }
      } else if(e.code == 'Enter') {
        if(this.isShuffling) {
          this.pickSong('stop')
        }
      }
    }
  },
  computed: {
    isShuffling() {
      return this.shuffleTimer? true: false
    }
  },
  methods: {
    getJustdanceInfo() {
      axios.get(this.webUrl).then(resp => {
        console.log("resp:", resp)
        let $ = cheerio.load(resp.data)
        console.log("$:", $)
        let list = $(".wikia-gallery-item")
        console.log("list:", list)
        // let list = $("#user-repositories-list li")
        for(let i = 0; i < list.length; i++) {
          let item = list.eq(i)
          let dataSrc = item.find(".thumbimage").attr("data-src")
          let posSubfix = dataSrc.indexOf('png')
          if(posSubfix == -1) {
            posSubfix = dataSrc.indexOf('jpg')
            if(posSubfix == -1) {
              console.warn("unmatch image format:", dataSrc)
              continue
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
        // this.saveSongInfo('all')
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
      if(this.pickList.indexOf(this.pickResult) == -1) {
        this.pickList.push(this.pickResult)
        // console.log("this.$toast:", this.$toast)
        // this.$toast({
        //   message: '已加入已选歌单',
        //   duration: 2000,
        //   position: 'top'
        // })
      } else {
        this.$toast({
          message: '已选过该歌曲',
          duration: 2000,
        })
      }
      if(op == 'stop') {
        clearInterval(this.shuffleTimer)
        this.shuffleTimer = null
        console.log(this.shuffleTimer)
      }
    },
    autoShuffleAndPick() {
      this.pickMode = 'auto'
      this.shuffle()
      this.pickList = []
      let autoPicker = setInterval(() => {
        this.pickList.push(this.pickResult)
        if(this.pickList.length == this.autoPickNum) {
          clearInterval(autoPicker)
          clearInterval(this.shuffleTimer)
          this.shuffleTimer = null
          this.pickMode = 'manual'
        }
      }, 150)
    },
    formatDate(_date) {
      let date = _date || new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      return `${year}_${month<10?'0'+month: month}_${day<10?'0'+day: day}`
    },
    saveSongInfo() {
      // const savedFile = xlsx.parse('../../server/files/justdance.xlsx')
      // console.log("read saved file:", JSON.stringify(savedFile, null, 2))
      // let toBeSaveList = mode == 'all'? this.resultList: this.pickList
      // console.log("toBeSaveList:", toBeSaveList)
      if(!this.resultList.length) {
        alert("empty!")
        return
      }
      let allData = []
      let pickData = []
      allData.push(Object.keys(this.resultList[0]))
      pickData.push(Object.keys(this.resultList[0]))
      for(let item of this.resultList) {
        allData.push(Object.values(item))
      }
      for(let item of this.pickList) {
        pickData.push(Object.values(item))
      }
      let xlsxData = [{
        name: `justdance_all_data`,
        data: allData
      }, {
        name: `justdance_pick_data`,
        data: pickData
      }]
      console.log("xlsxData:", xlsxData)
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8085/saveFile',
        data: {
          filePath: `./files/justdance${this.formatDate()}_${Math.floor(Math.random()*100)}.xlsx`,
          data: xlsxData
        }
      }).then(res => {
        console.log("saveFile res:", res)
      }).catch(err => {
        console.log("saveFile err:", err)
      })
      // fs.writeFile('./justdance.xlsx', buffer, err => {
      //   err && (console.error("err:", err))
      // })
    }
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
.button {
  cursor: pointer;
  padding: 8px 10px;
  color: #ffffff;
  border-radius: 6px;
  background: rgb(102, 177, 255);
  &:hover {
    background: #409EFF;
  }
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
        &.auto {
          .input_number {
            border: none;
            background-color: rgb(217, 236, 255);
            color: #606266;
            text-align: center;
            width: 2.5em;
          }
        }
      }
    }
  }
  .box_shadow {
    margin-top: 20px;
    z-index: 9;
    // position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 25px;
    border-radius: 25px 25px 0px 0px;
    box-shadow: 0 -8px 10px rgba(113, 203, 238, 0.6);
  }
  .pick_result {
    position: relative;
    z-index: 10;
    margin-top: 20px;
    // width: 90%;
    background-color: #fff;
    border-radius: 35px 35px 0px 0px;
    box-shadow: 0 -8px 10px rgba(113, 203, 238, 0.4);
    // transform: translateY(-25px);
    .title {
      margin-top: 10px;
    }
    .pick_list {
      padding: 8px;
      flex-wrap: wrap;
      justify-content: center;
      .pick_item {
        img {
          width: 150px;
          height: 150px;
        }
      }
    }
  }
}
</style>