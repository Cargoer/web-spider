<template>
  <div class="spider_wrap">
    <div class="input_area">
      <label for="web_url_input">请输入爬取网站：</label>
      <input type="text" id="web_url_input" v-model="webUrl">
      <label for="web_tag_input">请输入爬取元素标签：</label>
      <input type="text" id="web_tag_input" v-model="webTag">
      <div @click="getWebInfo">开始爬取</div>
    </div>
    <div class="result_area">
      <div class="result_list fr">
        <div 
          v-for="(item, index) in resultList" 
          :key="index"
          class="result_item"
          :v-html="item"
        >
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
      webUrl: 'https://justdance.fandom.com/wiki/Home',
      webTag: '.wikia-gallery-item',
      resultList: []
    }
  },
  created() {
    let testHtml = `
      <ul id="fruits">
        <li class="apple">Apple</li>
        <li class="apple">Apple2</li>
        <li class="orange">Orange</li>
        <li class="pear">Pear</li>
      </ul>
    `
    let c = cheerio.load(testHtml)
    console.log(c(".apple"))
    console.log(c(".apple").html())
  },
  methods: {
    getWebInfo() {
      let that = this
      axios.get(this.webUrl).then(resp => {
        console.log("resp:", resp)
        let $ = cheerio.load(resp.data)
        console.log("$:", $)
        let list = $(this.webTag)
        list.each((i, elem) => {
          console.log(i, elem)
          console.log("this:", this)
          that.resultList.push($(elem.html()))
        })
        // console.log(list[0].html())
        // let list = $("#user-repositories-list li")
        // this.resultList = list
        console.log("list:", list)
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