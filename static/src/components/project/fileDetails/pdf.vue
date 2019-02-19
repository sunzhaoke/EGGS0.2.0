<template>
    <div class="cpdf">
    <div class="Pdf_topNav">
      <span class="checkBu" @click="prev">
          <i class="el-icon-arrow-left cur"></i>
      </span>&nbsp;
      <span class="pageNum">
        <span v-text="page_num"></span> / 
        <span v-text="page_count"></span>
      </span>
       &nbsp;
      <span  class="checkBu" @click="next">
           <i class="el-icon-arrow-right cur"></i>
      </span>
      <span class="zoom">
         <i @click="addscale" class="el-icon-zoom-in"></i>
       {{zoomSize}}
        <i @click="minus" class="el-icon-zoom-out"></i>
      </span>
    </div>
     <div class="center">
       <div class="scale_div">
        <canvas class="canvasstyle" id="the-canvas"></canvas>
        <img v-if="pdfLoadFlag" class="pdf_loading" src="../../../assets/img/load.gif" alt="">
      </div>
     </div>
    </div>
</template>
<script>
import PDFJS from "../../../../static/pdf/pdf.js";
export default {
  name: "c-pdf",
  props: ["pdfurl"],
  data() {
    return {
      pdfLoadFlag: true, // 加载中
      pdfDoc: null, //pdfjs 生成的对象
      pageNum: 1, //
      pageRendering: false,
      pageNumPending: null,
      scale: 1.2, //放大倍数
      page_num: 0, //当前页数
      page_count: 0, //总页数
      maxscale: 2, //最大放大倍数
      minscale: 0.8, //最小放大倍数
      zoomSize: 100
    };
  },
  methods: {
    renderPage(num) {
      //渲染pdf
      let vm = this;
      this.pageRendering = true;
      let canvas = document.getElementById("the-canvas");
      // Using promise to fetch the page
      this.pdfDoc.getPage(num).then(function(page) {
        var viewport = page.getViewport(vm.scale);
        //alert(vm.canvas.height)
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: vm.ctx,
          viewport: viewport
        };
        var renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(function() {
          vm.pdfLoadFlag = false;
          vm.pageRendering = false;
          if (vm.pageNumPending !== null) {
            // New page rendering is pending
            vm.renderPage(vm.pageNumPending);
            vm.pageNumPending = null;
          }
        });
      });
      vm.page_num = vm.pageNum;
    },
    addscale() {
      //放大
      if (this.scale >= this.maxscale) {
        return;
      }
      this.zoomSize += 10;
      this.scale += 0.1;
      this.queueRenderPage(this.pageNum);
    },
    minus() {
      //缩小
      if (this.scale <= this.minscale) {
        return;
      }
      this.zoomSize -= 10;
      this.scale -= 0.1;
      this.queueRenderPage(this.pageNum);
    },
    prev() {
      //上一页
      let vm = this;
      if (vm.pageNum <= 1) {
        return;
      }
      vm.pageNum--;
      vm.queueRenderPage(vm.pageNum);
    },
    next() {
      //下一页
      let vm = this;
      if (vm.pageNum >= vm.page_count) {
        return;
      }
      vm.pageNum++;
      vm.queueRenderPage(vm.pageNum);
    },
    closepdf() {
      //关闭PDF
      this.$emit("closepdf");
    },
    queueRenderPage(num) {
      if (this.pageRendering) {
        this.pageNumPending = num;
      } else {
        this.renderPage(num);
      }
    }
  },
  computed: {
    ctx() {
      let id = document.getElementById("the-canvas");
      return id.getContext("2d");
    }
  },
  mounted() {
    let vm = this;
    PDFJS.getDocument(vm.pdfurl).then(function(pdfDoc_) {
      //初始化pdf
      vm.pdfDoc = pdfDoc_;
      vm.page_count = vm.pdfDoc.numPages;
      vm.renderPage(vm.pageNum);
    });
  }
};
</script>
<style lang="less">
.box_sizing {
  box-sizing: border-box;
  -moz-box-sizing: border-box; /* Firefox */
  -webkit-box-sizing: border-box; /* Safari */
}
.cpdf {
  height: 100%;
  width: 100%;
  .checkBu {
    display: inline-block;
    font-size: 10px;
    width: 21px;
    height: 14px;
    border: 1px solid #fff;
    text-align: center;
  }
  .Pdf_topNav {
    height: 32px;
    width: 100%;
    padding: 4px 100px;
    font-size: 14px;
    .box_sizing;
    background: #4a4a4a;
    box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.3);
    color: #fff;
    .pageNum{
      display: inline-block;
      height: 32px;
    }
    .zoom {
      position: absolute;
      left: 50%;
      margin-left: -15px;
    }
  }
  .center {
    text-align: center;
    height: 100%;
    padding-top: 20px;
    .contor {
      margin-bottom: 10px;
    }
    .scale_div {
      height: 90%;
      overflow: auto;
      position: relative;
      .pdf_loading {
        position: absolute;
        top: 50%;
        left: 50%;
        // width: 100%;
      }
    }
  }
}
</style>
