<template>
  <div class="spider_wrap">
    <div class="input_area">
      <label for="web_url_input">请输入爬取网站：</label>
      <input type="text" id="web_url_input" v-model="webUrl">
      <div @click="getWebInfo">开始爬取</div>
    </div>
    <div class="result_area">
      <div class="result_list fr">
        <div 
          v-for="(item, index) in resultList" 
          :key="index"
          class="result_item"
        >
          <a :href="hrefBase + item.href">
            <img :src="item.imgSrc" alt="" crossorigin="anonymous">
          </a>
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
      // webUrl: 'https://github.com/weiyinfu?tab=repositories',
      resultList: []
    }
  },
  created() {
    // test cheerio
    let c = cheerio.load('<div class="3 5">333<div class="2">22</div></div>\n<h1 class="5">555</h1>')
    let l = c('.3')
    console.log("l:", l)
  },
  methods: {
    getWebInfo() {
      axios.get(this.webUrl).then(resp => {
        console.log("resp:", resp)
        let $ = cheerio.load(resp.data)
        console.log("$:", $)
        let list = $("#gallery-0 .wikia-gallery-item")
        // let list = $("#user-repositories-list li")
        console.log("list:", list)
        for(let i = 0; i < list.length; i++) {
          let item = list.eq(i)
          console.log("item:", item)
          let dataSrc = item.find(".thumbimage").attr("data-src")
          console.log("data-src:", dataSrc)
          console.log("data-src cut png:", dataSrc.slice(0, dataSrc.indexOf('png')+3))
          let result = {
            href: item.find(".link-internal").attr("href"),
            imgSrc: dataSrc.slice(0, dataSrc.indexOf('png')+3),
          }
          // http://localhost:8080/revision/latest/scale-to-width-down/88?cb=20211103231441
          // https://static.wikia.nocookie.net/justdance/images/d/d5/Girllikeme_cover_generic.png/revision/latest/scale-to-width-down/88?cb=20211103231058
          this.resultList.push(result)
        }
        console.log(this.resultList)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.fr {
  display: flex;
  gap: 10px;
}
.result_area {
  .result_list {
    .result_item {
      img {
        width: 88px;
      }
    }
  }
}
</style>