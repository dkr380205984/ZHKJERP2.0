<template>
  <div id="craftCreateForCloth"
    class="indexMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">{{$route.params.type==='1'?'产':'样'}}品信息</span>
        <zh-message :msgSwitch="msgSwitch"
          :url="msgUrl"
          :content="msgContent"></zh-message>
        <!-- <div class="selectCtn"
          style="width:460px;margin:10px 0">
          <el-select v-model="selectSearchWhich"
            style="width:170px;float:left">
            <el-option label="搜产品编号"
              value="搜产品编号"></el-option>
            <el-option label="搜样品编号"
              value="搜样品编号"></el-option>
            <el-option label="搜工艺单编号"
              value="搜工艺单编号"></el-option>
          </el-select>
          <el-select filterable
            style="width:270px;float:right"
            remote
            reserve-keyword
            v-model="gyd"
            :remote-method="remoteMethod"
            :loading="loadingS"
            @change="getCraft"
            placeholder="输入编号导入工艺单">
            <el-option v-for="item in gydArr"
              :key="item.id"
              :label="selectSearchWhich!=='搜工艺单编号'?item.product_code:item.craft_code"
              :value="item.id">
              <span v-if="selectSearchWhich!=='搜工艺单编号'">{{ item.product_code }}</span>
              <span v-if="selectSearchWhich==='搜工艺单编号'">{{ item.craft_code }}</span>
              <span style="margin-left:10px;color: #8492a6; font-size: 13px">({{item.category_info.product_category}}/{{item.type_name}}/{{item.style_name}}/{{item.flower_id}})</span>
            </el-option>
          </el-select>
        </div> -->
      </div>
      <div class="detailCtn">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品编号：</span>
            <span class="text">{{$route.params.type==='1'?productInfo.product_code:productInfo.sample_product_code}}</span>
          </div>
          <div class="colCtn">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品名称：</span>
            <span class="text"
              :class="{'blue':productInfo.name}">{{productInfo.name?productInfo.name:'无'}}</span>
          </div>
          <div class="colCtn">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品品类：</span>
            <span class="text">{{$route.params.type==='1'?productInfo.category_info.product_category+'/'+productInfo.type_name+'/'+productInfo.style_name:productInfo.category_name+'/'+productInfo.type_name+'/'+productInfo.style_name}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品成分：</span>
            <span class="text">{{productInfo.component|filterMaterials}}</span>
          </div>
          <div class="colCtn">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品配色：</span>
            <span class="text">
              <span v-for="(item,index) in productInfo.color"
                :key="index">{{(index+1) + '. ' +item.color_name + ' '}}
              </span>
            </span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">{{$route.params.type==='1'?'产':'样'}}品规格：</span>
            <div class="tableCtn">
              <div class="line">
                <div class="once">
                  <div class="biaotou rightTop">规格</div>
                  <div class="xiexian"></div>
                  <div class="biaotou leftBottom">部位</div>
                </div>
                <div class="once"
                  v-for="(item,index) in productInfo.size"
                  :key="index">
                  {{item.size_name}}
                </div>
              </div>
              <div class="line"
                v-for="(item,index) in productInfo.sizePart"
                :key="index">
                <div class="once">
                  {{item.part}}
                </div>
                <div class="once"
                  v-for="(itemNum,indexNum) in item.size"
                  :key="indexNum">
                  {{itemNum}}
                </div>
              </div>
              <div class="line">
                <div class="once">
                  克重
                </div>
                <div class="once"
                  v-for="(item,index) in productInfo.size"
                  :key="index">
                  {{item.weight}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text"
              :class="{'blue':productInfo.description}">{{productInfo.description?productInfo.description:'无'}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">照片拍摄上传</span>
        <el-switch class="atTitle"
          style="margin-bottom:3px"
          v-model="openCamera"
          active-text="打开摄像头"
          @change="getCompetence">
        </el-switch>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="addTableCtn"
          v-show="imgSrc.length>0">
          <div class="imgCtns"
            v-for="(item,index) in imgSrc"
            :key="index">
            <img :src="item.image"
              class="avatar">
            <div class="btnCtn">
              <i class="el-icon el-icon-delete"
                @click="deleteImg(index)"></i>
              <i class="el-icon el-icon-zoom-in"
                @click="handlePictureCardPreview(item)"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">本地照片上传</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="addTableCtn">
          <el-upload action="https://upload.qiniup.com/"
            accept="image/jpeg,image/gif,image/png,image/bmp"
            list-type="picture-card"
            :data="postData"
            :file-list="fileArr"
            ref="uploada"
            :on-preview="handlePictureCardPreview"
            :before-upload="beforeAvatarUpload"
            :before-remove="beforeRemove">
            <span style="font-size:14px;color:rgba(0, 0, 0, 0.65)">点击上传图片</span>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%"
              :src="dialogImageUrl"
              alt="">
          </el-dialog>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">添加工艺</span>
      </div>
      <div class="editCtn hasBorderTop">
        <div class="addTableCtn">
          <div class="line">
            <div class="once flex3 bgGray">规格</div>
            <div class="once bgGray"
              v-for="item in size"
              :key="item.id">{{item.size_name}}</div>
          </div>
          <div class="line">
            <div class="once flex3 bgGray">针型</div>
            <div class="once"
              v-for="(item,index) in craftInfo.machine_code"
              :key="index">
              <el-input class="inputs"
                v-model="item.value"
                placeholder="输入机号">
              </el-input>
            </div>
          </div>
          <div class="line">
            <div class="once flex2 bgGray middle">
              <div>工序耗时</div>
              <div style="color:#1595ff;cursor:pointer;"
                @click="addPart(craftInfo.machine_time)">添加工序</div>
              <div style="position:absolute;color:#F5222D;cursor:pointer;right:8px;padding:6px;line-height:38px;font-size:12px"
                v-for="(item,index) in craftInfo.machine_time"
                :key="index"
                :style="{'top':index*51+'px'}"
                @click="deletePart(craftInfo.machine_time,index)">删除
                <i class="el-icon-right"></i>
              </div>
            </div>
            <div class="lineChildCtn">
              <div class="lineChild"
                v-for="(item,index) in craftInfo.machine_time"
                :key="index">
                <div class="once">
                  <el-autocomplete class="inline-input inputs"
                    v-model="item.name"
                    :fetch-suggestions="searchGX"
                    placeholder="输入工序"></el-autocomplete>
                </div>
                <div class="once"
                  v-for="(itemSize,indexSize) in item.size"
                  :key="indexSize">
                  <el-input class="inputs"
                    v-model="itemSize.value"
                    placeholder="输入时间">
                  </el-input>
                </div>
              </div>
            </div>
          </div>
          <div class="line">
            <div class="once flex2 bgGray middle">
              <div>组织结构</div>
              <div style="color:#1595ff;cursor:pointer;"
                @click="addPart(craftInfo.organization)">添加部位</div>
              <div style="position:absolute;color:#F5222D;cursor:pointer;right:8px;padding:6px;line-height:38px;font-size:12px"
                v-for="(item,index) in craftInfo.organization"
                :key="index"
                :style="{'top':index*51+'px'}"
                @click="deletePart(craftInfo.organization,index)">删除
                <i class="el-icon-right"></i>
              </div>
            </div>
            <div class="lineChildCtn">
              <div class="lineChild"
                v-for="(item,index) in craftInfo.organization"
                :key="index">
                <div class="once">
                  <el-input class="inputs"
                    v-model="item.name"
                    placeholder="输入部位">
                  </el-input>
                </div>
                <div class="once"
                  v-for="(itemSize,indexSize) in item.size"
                  :key="indexSize">
                  <el-autocomplete class="inline-input inputs"
                    v-model="itemSize.value"
                    :fetch-suggestions="querySearch"
                    placeholder="组织结构"></el-autocomplete>
                </div>
              </div>
            </div>
          </div>
          <div class="line">
            <div class="once bgGray middle">成品密度</div>
            <div class="lineChildCtn">
              <div class="lineChild">
                <div class="once bgGray middle">
                  <div>横密</div>
                  <div style="color:#1595ff;cursor:pointer;;font-size:12px"
                    @click="addPart(craftInfo.density.crosswise_density)">添加部位</div>
                  <div style="position:absolute;color:#F5222D;cursor:pointer;right:8px;padding:6px;line-height:38px;font-size:12px"
                    v-for="(item,index) in craftInfo.density.crosswise_density"
                    :key="index"
                    :style="{'top':index*51+'px'}"
                    @click="deletePart(craftInfo.density.crosswise_density,index)">删除
                    <i class="el-icon-right"></i>
                  </div>
                </div>
                <div class="lineChildCtn">
                  <div class="lineChild"
                    v-for="(item,index) in craftInfo.density.crosswise_density"
                    :key="index">
                    <div class="once">
                      <el-input class="inputs"
                        v-model="item.name"
                        placeholder="输入部位">
                      </el-input>
                    </div>
                    <div class="once"
                      v-for="(itemSize,indexSize) in item.size"
                      :key="indexSize">
                      <el-input class="inputs"
                        v-model="itemSize.value"
                        placeholder="输入横密">
                      </el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="lineChild">
                <div class="once bgGray middle">
                  <div>纵密</div>
                  <div style="color:#1595ff;cursor:pointer;;font-size:12px"
                    @click="addPart(craftInfo.density.lengthwise_density)">添加部位</div>
                  <div style="position:absolute;color:#F5222D;cursor:pointer;right:8px;padding:6px;line-height:38px;font-size:12px"
                    v-for="(item,index) in craftInfo.density.lengthwise_density"
                    :key="index"
                    :style="{'top':index*51+'px'}"
                    @click="deletePart(craftInfo.density.lengthwise_density,index)">删除
                    <i class="el-icon-right"></i>
                  </div>
                </div>
                <div class="lineChildCtn">
                  <div class="lineChild"
                    v-for="(item,index) in craftInfo.density.lengthwise_density"
                    :key="index">
                    <div class="once">
                      <el-input class="inputs"
                        v-model="item.name"
                        placeholder="输入部位">
                      </el-input>
                    </div>
                    <div class="once"
                      v-for="(itemSize,indexSize) in item.size"
                      :key="indexSize">
                      <el-input class="inputs"
                        v-model="itemSize.value"
                        placeholder="输入纵密">
                      </el-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="line">
            <div class="once flex3 bgGray middle">
              <div>克重</div>
            </div>
            <div class="once"
              v-for="(item,index) in craftInfo.weight"
              :key="index">
              <el-input class="inputs"
                v-model="item.value"
                placeholder="输入克重">
              </el-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">特殊织法</span>
            </div>
            <div class="content">
              <el-input style="width:360px"
                v-model="craftInfo.special_way"
                placeholder="请输入特殊织法"></el-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <div class="label">
              <span class="text">成衣所含工序</span>
            </div>
            <div class="content">
              <el-select style="width:360px"
                v-model="craftInfo.process"
                multiple
                placeholder="请选择成衣所含工序">
                <el-option v-for="item in processArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue"
            @click="submit">提交</div>
        </div>
      </div>
    </div>
    <!-- video代码注释，分辨率太低-->
    <!-- <div class="popup"
      v-show="showCamera">
      <div class="mainCtn">
        <div class="videoCtn">
          <div class="fileCtn">
            <video id="videoCamera"
              :width="videoWidth"
              :height="videoHeight"
              autoplay></video>
            <canvas style="display:none;"
              id="canvasCamera"
              :width="videoWidth"
              :height="videoHeight"></canvas>
            <div class="btnCtn">
              <div class="btn1"
                @click="setImage">
                <i class="el-icon el-icon-camera-solid"></i>
                <span class="title">点击拍摄</span>
              </div>
              <div class="btn1"
                @click="resetImage">
                <i class="el-icon el-icon-refresh"></i>
                <span class="title">重拍该张</span>
              </div>
              <div class="btn1"
                @click="stopCemara">
                <i class="el-icon el-icon-folder-checked"></i>
                <span class="title">完成拍摄</span>
              </div>
            </div>
          </div>
        </div>
        <div class="imgCtn">
          <div class="imgChild"
            v-for="(item,index) in imgSrc"
            :key="index"
            @click="chooseImg(index)"
            :class="{'choose':item.choose}">
            <img :src="item.image"
              class="img">
          </div>
        </div>
      </div>
    </div> -->
    <!-- 新版sdk+canvas拍照功能 -->
    <div class="popup"
      v-show="showCamera">
      <div class="mainCtn">
        <div class="videoCtn">
          <div class="fileCtn">
            <!--  这些功能都不需要
              @mousedown="canvasClick"
              @mouseup="stopDragging"
              @mouseout="stopDragging"
              @mousemove="canvasMove"
            -->
            <canvas id="canvasCamera"
              :width="videoWidth"
              :height="videoHeight"></canvas>
            <div class="btnCtn">
              <div class="btn1"
                @click="setImage">
                <i class="el-icon el-icon-camera-solid"></i>
                <span class="title">点击拍摄</span>
              </div>
              <div class="btn1"
                @click="resetImage">
                <i class="el-icon el-icon-refresh"></i>
                <span class="title">重拍该张</span>
              </div>
              <div class="btn1"
                @click="stopCemara">
                <i class="el-icon el-icon-folder-checked"></i>
                <span class="title">完成拍摄</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 这里的dom选择代码不需要显示，默认就可以 -->
        <div class="chooseCtn"
          v-show="false">
          <select id="Resolution"
            name="D2"
            @change="ChangeResolution()">
          </select>
          <select id="DeviceName"
            name="D1"
            @change="ChangeDevice()">
          </select>
        </div>
        <div class="imgCtn">
          <div class="imgChild"
            v-for="(item,index) in imgSrc"
            :key="index"
            @click="chooseImg(index)"
            :class="{'choose':item.choose}">
            <img v-loading="true"
              :src="item.image"
              class="img">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { product, sample, craft, productPart, flower, process, deleteFile, getToken } from '@/assets/js/api.js'
export default {
  data () {
    return {
      uploadLock: false,
      showCamera: false,
      openCamera: false,
      dialogVisible: false,
      dialogImageUrl: '',
      videoWidth: 800,
      videoHeight: 600,
      imgSrc: [],
      thisCancas: null,
      thisContext: null,
      thisVideo: null,
      postData: { token: '' },
      fileArr: [],
      loading: true,
      msgSwitch: false,
      msgUrl: '',
      msgContent: '',
      productInfo: {
        product_code: '',
        type_name: '',
        flower_id: '',
        style_name: '',
        category_info: {
          product_category: '',
          name: ''
        },
        color: [],
        component: [],
        create_time: '',
        user_name: '',
        size: [],
        name: '',
        sizePart: []
      },
      size: [],
      craftInfo: {
        machine_code: [],
        machine_time: [],
        organization: [],
        density: {
          crosswise_density: [],
          lengthwise_density: []
        },
        weight: [],
        special_way: '',
        process: []
      },
      part: '',
      partArr: [],
      processArr: [],
      ZZJGArr: [],
      mediaStreamTrack: '',
      video: this.$refs.video,
      canvasX: 0,
      canvasY: 0,
      canvasLastX: 0,
      canvasLastY: 0,
      faceZuobiao: [],
      resetFlag: false, // 重拍标志
      base64DecodeChars: [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
        -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
        -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1]
    }
  },
  filters: {
    filterMaterials (arr) {
      let str = ''
      if (arr[0] && arr[0].component_name) {
        arr.forEach((item) => {
          str += item.component_name + ' / '
        })
        return str.substring(0, str.length - 2)
      } else {
        return '无'
      }
    }
  },
  methods: {
    // 加载控件
    getCompetence (ev) {
      if (!ev) {
        return
      } else {
        this.showCamera = true
      }
      var _this = this
      _this.thisCancas = document.getElementById('canvasCamera')
      _this.thisContext = _this.thisCancas.getContext('2d')
      // 监听滚轮不需要
      // if (document.addEventListener) {
      //   document.addEventListener('DOMMouseScroll', this.scrollFunc, false)
      // }// W3C
      // window.onmousewheel = document.onmousewheel = this.scrollFunc
      this.ws = new WebSocket('ws://localhost:9002')
      this.ws.binaryType = 'arraybuffer'
      this.ws.onmessage = (event) => {
        var aDataArray = new Uint8Array(event.data)
        if (aDataArray.length > 0) {
          if (aDataArray[0] === 0xef && aDataArray[1] === 0x01) {
            // getDeviceName(aDataArray[3]);
            // getResolution(aDataArray,5);
            _this.getUsbCamareMessage(aDataArray, 5)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x17) {
            var camNum = aDataArray[3]
            // GetDevCount(camNum);
            _this.InfoTextCallback(26, camNum)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x19) {
            _this.getResolution(aDataArray, 5)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x23) {
            var type = aDataArray[3]
            var len = aDataArray[4]
            var data = new Uint8Array(len)
            for (var i = 0; i < len; i++) {
              data[i] = aDataArray[5 + i]
            }
            var str = _this.byteToString(data)
            var text = decodeURIComponent(str)
            _this.InfoTextCallback(type, text)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x05) {
            var ww = aDataArray[3] * 256 + aDataArray[4]
            var hh = aDataArray[5] * 256 + aDataArray[6]
            _this.thisContext.clearRect(0, 0, 800, 600)
            var imgData = _this.thisContext.createImageData(ww, hh)
            var dataNum = 0
            for (let i = 0; i < imgData.data.length; i += 4) {
              imgData.data[i + 0] = aDataArray[dataNum]
              imgData.data[i + 1] = aDataArray[dataNum + 1]
              imgData.data[i + 2] = aDataArray[dataNum + 2]
              imgData.data[i + 3] = 255
              dataNum = dataNum + 3
            }
            _this.sendMsgRefreshCam()

            if (_this.CutType === 2) {
              _this.rec_ww = ww
              _this.rec_hh = hh
              _this.thisContext.putImageData(imgData, 800 / 2 - ww / 2, 600 / 2 - hh / 2)
              _this.refreshRect()
            } else _this.thisContext.putImageData(imgData, 800 / 2 - ww / 2 + _this.canvasX, 600 / 2 - hh / 2 + _this.canvasY)

            _this.thisContext.beginPath()
            _this.thisContext.strokeStyle = 'rgb(0,255,0)'
            _this.thisContext.lineWidth = 2
            _this.GetFaceZuobiao(800 / 2 - ww / 2 + _this.canvasX, 600 / 2 - hh / 2 + _this.canvasY)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x0c) {
            let ww = aDataArray[3] * 256 + aDataArray[4]
            let hh = aDataArray[5] * 256 + aDataArray[6]
            _this.thisContext.clearRect(0, 0, 800, 600)
            // sendMsgRefreshCam();
            let imgData = _this.thisContext.createImageData(ww, hh)
            let dataNum = 0
            for (let i = 0; i < imgData.data.length; i += 4) {
              imgData.data[i + 0] = aDataArray[dataNum]
              imgData.data[i + 1] = aDataArray[dataNum + 1]
              imgData.data[i + 2] = aDataArray[dataNum + 2]
              imgData.data[i + 3] = 255
              dataNum = dataNum + 3
            }
            _this.sendMsgRefreshCam()
            var Xdis = 800 / 2 - ww / 2 + _this.canvasX
            var Ydis = 600 / 2 - hh / 2 + _this.canvasY
            _this.thisContext.putImageData(imgData, Xdis, Ydis)

            var lenJiubian = aDataArray[7]

            _this.thisContext.beginPath()
            _this.thisContext.strokeStyle = 'rgb(0,255,0)'
            _this.thisContext.lineWidth = 2

            for (var j = 0; j < lenJiubian; j++) {
              for (let i = 0; i < 3; i++) {
                var aa = 1
                if (aDataArray[8 + i * 6 + j * 24] === 1) {
                  aa = -1
                }
                var bb = 1
                if (aDataArray[11 + i * 6 + j * 24] === 1) {
                  bb = -1
                }
                var cc = 1
                if (aDataArray[14 + i * 6 + j * 24] === 1) {
                  cc = -1
                }
                var dd = 1
                if (aDataArray[17 + i * 6 + j * 24] === 1) {
                  dd = -1
                }
                _this.thisContext.moveTo(aDataArray[9 + i * 6 + j * 24] * 256 * aa + aDataArray[10 + i * 6 + j * 24] * aa + Xdis, aDataArray[12 + i * 6 + j * 24] * 256 * bb + aDataArray[13 + i * 6 + j * 24] * bb + Ydis)
                _this.thisContext.lineTo(aDataArray[15 + i * 6 + j * 24] * 256 * cc + aDataArray[16 + i * 6 + j * 24] * cc + Xdis, aDataArray[18 + i * 6 + j * 24] * 256 * dd + aDataArray[19 + i * 6 + j * 24] * dd + Ydis)
                _this.thisContext.stroke()
              }
              let ee = 1
              if (aDataArray[26 + j * 24] === 1) {
                ee = -1
              }
              let ff = 1
              if (aDataArray[8 + j * 24] === 1) {
                ff = -1
              }
              console.log(ee, ff)
              _this.thisContext.moveTo(aDataArray[27 + j * 24] * 256 + aDataArray[28 + j * 24] + Xdis, aDataArray[30 + j * 24] * 256 + aDataArray[31 + j * 24] + Ydis)
              _this.thisContext.lineTo(aDataArray[9 + j * 24] * 256 + aDataArray[10 + j * 24] + Xdis, aDataArray[12 + j * 24] * 256 + aDataArray[13 + j * 24] + Ydis)
              _this.thisContext.stroke()
            }
            _this.GetFaceZuobiao(800 / 2 - ww / 2 + _this.canvasX, 600 / 2 - hh / 2 + _this.canvasY)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x14) {
            var tmp = aDataArray[3]
            if (tmp === 0x46) {
              _this.isFaceOpen = true
            } else if (tmp === 0x48) {
              _this.isFaceOpenSecond = true
            } else if (tmp === 0x5e) {
              _this.isFaceOpen = true
              _this.isFaceOpenSecond = true
            } else if (tmp === 0x5f) {
              _this.isFaceOpen = true
            } else if (tmp === 0x61) {
              _this.isFaceOpenSecond = true
            }

            _this.InfoCallback(tmp)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x26) {

          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x30) {
            var type1 = aDataArray[3]
            var ret = 1
            if (type1 === 0) {
              ret = -1
            }
            var min = aDataArray[4] * ret

            var type2 = aDataArray[5]
            ret = 1
            if (type2 === 0) {
              ret = -1
            }
            var max = aDataArray[6] * ret
            let text = '' + min + '*' + max
            _this.InfoTextCallback(23, text)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x32) {
            let type1 = aDataArray[3]
            let ret = 1
            if (type1 === 0) {
              ret = -1
            }
            let min = aDataArray[4] * ret

            let type2 = aDataArray[5]
            ret = 1
            if (type2 === 0) {
              ret = -1
            }
            let max = aDataArray[6] * ret
            let text = '' + min + '*' + max
            _this.InfoTextCallback(22, text)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x36) {
            let len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5]
            var baseDataArray = new Uint8Array(len)
            for (let i = 0; i < len; i++) {
              baseDataArray[i] = aDataArray[6 + i]
            }
            let str = _this.byteToString(baseDataArray)
            let text = decodeURIComponent(str)

            var last = text.substr(str.length - 2, 1)
            var lastSecond = text.substr(str.length - 3, 1)
            if (last === '=' && lastSecond !== '=') {
              text = text.substring(0, text.length - 1)
              text = text + '='
            }

            _this.InfoTextCallback(5, text)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x3b) {
            _this.camidMain = aDataArray[3]
            // if(isSecondDev){
            _this.camidSub = aDataArray[4]
            // }
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x3e) {
            let len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5]
            let baseDataArray = new Uint8Array(len)
            for (let i = 0; i < len; i++) {
              baseDataArray[i] = aDataArray[6 + i]
            }
            let str = _this.byteToString(baseDataArray)
            let text = decodeURIComponent(str)

            _this.InfoTextCallback(19, text)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x43) {
            let len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5]
            let baseDataArray = new Uint8Array(len)
            for (let i = 0; i < len; i++) {
              baseDataArray[i] = aDataArray[6 + i]
            }
            let str = _this.byteToString(baseDataArray)
            let text = decodeURIComponent(str)

            let last = text.substr(str.length - 2, 1)
            let lastSecond = text.substr(str.length - 3, 1)
            if (last === '=' && lastSecond !== '=') {
              text = text.substring(0, text.length - 1)
              text = text + '='
            }

            _this.InfoTextCallback(21, text)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x4a) {
            _this.rorateAngleType = aDataArray[3]
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x4c) {
            let len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5]
            let baseDataArray = new Uint8Array(len)
            for (let i = 0; i < len; i++) {
              baseDataArray[i] = aDataArray[6 + i]
            }
            let str = _this.byteToString(baseDataArray)
            let text = decodeURIComponent(str)

            let last = text.substr(str.length - 2, 1)
            let lastSecond = text.substr(str.length - 3, 1)
            if (last === '=' && lastSecond !== '=') {
              text = text.substring(0, text.length - 1)
              text = text + '='
            }

            _this.InfoTextCallback(25, text)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x5f) {
            let len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5]
            let baseDataArray = new Uint8Array(len)
            for (let i = 0; i < len; i++) {
              baseDataArray[i] = aDataArray[6 + i]
            }
            let str = _this.byteToString(baseDataArray)
            let text = decodeURIComponent(str)

            let last = text.substr(str.length - 2, 1)
            let lastSecond = text.substr(str.length - 3, 1)
            if (last === '=' && lastSecond !== '=') {
              text = text.substring(0, text.length - 1)
              text = text + '='
            }

            _this.InfoTextCallback(28, text)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x60) {
            _this.faceNum = aDataArray[3]
            for (let j = 0; j < _this.faceNum * 4; j++) {
              let aa = 1
              if (aDataArray[4 + j * 6] === 1) {
                aa = -1
              }

              _this.faceZuobiao[j * 2] = aDataArray[5 + j * 6] * 256 * aa + aDataArray[6 + j * 6] * aa

              let bb = 1
              if (aDataArray[7 + j * 6] === 1) {
                bb = -1
              }
              _this.faceZuobiao[j * 2 + 1] = aDataArray[8 + j * 6] * 256 * bb + aDataArray[9 + j * 6] * bb
            }
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x62) {
            _this.faceNumSecond = aDataArray[3]
            for (let j = 0; j < _this.faceNumSecond * 4; j++) {
              let aa = 1
              if (aDataArray[4 + j * 6] === 1) {
                aa = -1
              }

              _this.faceZuobiaoSecond[j * 2] = aDataArray[5 + j * 6] * 256 * aa + aDataArray[6 + j * 6] * aa

              let bb = 1
              if (aDataArray[7 + j * 6] === 1) {
                bb = -1
              }
              _this.faceZuobiaoSecond[j * 2 + 1] = aDataArray[8 + j * 6] * 256 * bb + aDataArray[9 + j * 6] * bb
            }
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x67) {
            let tmp = aDataArray[3]
            if (tmp === 0x00) {
              _this.faceNum = 0
            } else if (tmp === 0x01) {
              _this.faceNumSecond = 0
            }
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x71) {
            // getResolution(aDataArray,4);
            let type = aDataArray[3]
            let len = aDataArray[4] * 256 + aDataArray[5]
            let data = new Uint8Array(len)
            for (let i = 0; i < len; i++) {
              data[i] = aDataArray[6 + i]
            }
            let str = _this.byteToString(data)
            let text = decodeURIComponent(str)
            _this.InfoTextCallback(type, text)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x73) {
            let len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5]
            let baseDataArray = new Uint8Array(len)
            for (let i = 0; i < len; i++) {
              baseDataArray[i] = aDataArray[6 + i]
            }
            let str = _this.byteToString(baseDataArray)
            let text = decodeURIComponent(str)

            let last = text.substr(str.length - 2, 1)
            let lastSecond = text.substr(str.length - 3, 1)
            if (last === '=' && lastSecond !== '=') {
              text = text.substring(0, text.length - 1)
              text = text + '='
            }

            _this.InfoTextCallback(30, text)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x7e) {
            let len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5]
            let baseDataArray = new Uint8Array(len)
            for (let i = 0; i < len; i++) {
              baseDataArray[i] = aDataArray[6 + i]
            }
            let str = _this.byteToString(baseDataArray)
            let text = decodeURIComponent(str)

            let last = text.substr(str.length - 2, 1)
            let lastSecond = text.substr(str.length - 3, 1)
            if (last === '=' && lastSecond !== '=') {
              text = text.substring(0, text.length - 1)
              text = text + '='
            }

            _this.InfoTextCallback(33, text)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x84) {
            let len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5]
            let baseDataArray = new Uint8Array(len)
            for (let i = 0; i < len; i++) {
              baseDataArray[i] = aDataArray[6 + i]
            }
            let str = _this.byteToString(baseDataArray)
            let text = decodeURIComponent(str)

            let last = text.substr(str.length - 2, 1)
            let lastSecond = text.substr(str.length - 3, 1)
            if (last === '=' && lastSecond !== '=') {
              text = text.substring(0, text.length - 1)
              text = text + '='
            }

            _this.InfoTextCallback(36, text)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x80) {
            // getResolution(aDataArray,4);
            let len = aDataArray[3] * 256 + aDataArray[4]
            _this.InfoTextCallback(34, len)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x92) {
            let len = aDataArray[3] * 256 + aDataArray[4]
            _this.InfoTextCallback(37, len)
          }
        }
      }
      this.ws.onclose = (event) => {
        console.log('websocket关闭')
      }
      this.ws.onopen = (event) => {
        this.sendMsgGetMainCameraID()
        this.sendMsgRefreshDev()
        this.initParameter()
        // 执行下面这段代码告诉摄像机我只要base64
        // var aDataArray = new Uint8Array(4)
        // aDataArray[0] = 0xef
        // aDataArray[1] = 0x42
        // aDataArray[2] = 0x01
        // aDataArray[3] = 1
        // this.ws.send(aDataArray.buffer)
      }
      this.ws.onerror = (event) => {
        console.log('websocket出现问题')
      }
      /*
      使用video的代码 暂时弃用
        _this.thisVideo = document.getElementById('videoCamera')
        // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
        if (navigator.mediaDevices === undefined) {
          navigator.mediaDevices = {}
        }
        // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
        // 使用getUserMedia，因为它会覆盖现有的属性。
        // 这里，如果缺少getUserMedia属性，就添加它。
        if (navigator.mediaDevices.getUserMedia === undefined) {
          navigator.mediaDevices.getUserMedia = function (constraints) {
            // 首先获取现存的getUserMedia(如果存在)
            var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia
            // 有些浏览器不支持，会返回错误信息
            // 保持接口一致
            if (!getUserMedia) {
              return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
            }
            // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
            return new Promise(function (resolve, reject) {
              getUserMedia.call(navigator, constraints, resolve, reject)
            })
          }
        }
        var constraints = {
          audio: false,
          video: {
            width: 3264,
            height: 2448
          }
        }
        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
          _this.mediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[0]
          // 旧的浏览器可能没有srcObject
          if ('srcObject' in _this.thisVideo) {
            _this.thisVideo.srcObject = stream
          } else {
            // 避免在新的浏览器中使用它，因为它正在被弃用。
            _this.thisVideo.src = window.URL.createObjectURL(stream)
          }
          _this.thisVideo.onloadedmetadata = function (e) {
            _this.thisVideo.play()
          }
        }).catch(err => {
          console.log(err)
        })
      使用video的代码到此结束
      *****************/
    },
    initParameter () {
      this.sendMsgBestSize()
      this.sendMsgSetCutType(0)
      this.sendMsgSetFileType(0)
      this.sendMsgSetImageColorMode(0)
      this.sendMsgSetConntinousShotModel(0)
      this.sendMsgChangeOrientation(0)
      this.sendMsgSetCanvasOriginalSize(this.videoWidth, this.videoHeight)
    },
    sendMsgRefreshCam () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x04
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },
    sendMsgGetMainCameraID () {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x3a
      aDataArray[2] = 0x01
      aDataArray[3] = 0x01
      this.ws.send(aDataArray.buffer)
    },
    sendMsgChangeOrientation (type) {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x06
      aDataArray[2] = 0x01
      aDataArray[3] = type
      this.ws.send(aDataArray.buffer)
    },
    sendMsgSetCutType (type) {
      this.canvasX = 0
      this.canvasY = 0
      this.CutType = type
      var aDataArray = new Uint8Array(4)

      aDataArray[0] = 0xef
      aDataArray[1] = 0x0e
      aDataArray[2] = 0x01
      aDataArray[3] = type
      this.ws.send(aDataArray.buffer)
    },
    sendMsgSetConntinousShotModel (type) {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x21
      aDataArray[2] = 0x01
      aDataArray[3] = type
      this.ws.send(aDataArray.buffer)
    },

    sendMsgSetImageColorMode (type) {
      var aDataArray2 = new Uint8Array(4)
      aDataArray2[0] = 0xef
      aDataArray2[1] = 0x07
      aDataArray2[2] = 0x01
      aDataArray2[3] = type
      this.ws.send(aDataArray2.buffer)
    },

    sendMsgSetFileType (type) {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x20
      aDataArray[2] = 0x01
      aDataArray[3] = type
      this.ws.send(aDataArray.buffer)
    },
    sendMsgRefreshDev () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x00
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },
    sendMsgBestSize () {
      this.canvasX = 0
      this.canvasY = 0
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x0d
      aDataArray[2] = 0x01
      aDataArray[3] = 2
      this.ws.send(aDataArray.buffer)
    },
    sendMsgSetCanvasOriginalSize (ww, hh) {
      var aDataArray = new Uint8Array(7)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x15
      aDataArray[2] = 0x04
      aDataArray[3] = ww / 256
      aDataArray[4] = ww % 256
      aDataArray[5] = hh / 256
      aDataArray[6] = hh % 256
      this.ws.send(aDataArray.buffer)
    },
    getUsbCamareMessage (arrayData, tmpNum) {
      var numCam = arrayData[3]
      var len = arrayData[4]
      var data = new Int32Array(len * 2)
      var num = 0
      for (var i = 0; i < len; i++) {
        data[num] = arrayData[tmpNum] * 256 + arrayData[tmpNum + 1]
        num++
        data[num] = arrayData[tmpNum + 2] * 256 + arrayData[tmpNum + 3]
        num++
        tmpNum += 4
      }
      this.GetDeviceResolution(data)
      this.LoadOver()

      var strUsbNamr = []
      for (let i = 0; i < numCam; i++) {
        var tmpLen = arrayData[tmpNum]
        var tmpData = new Uint8Array(tmpLen)
        tmpNum++
        for (var j = 0; j < tmpLen; j++) {
          tmpData[j] = arrayData[tmpNum]
          tmpNum++
        }
        var str = this.byteToString(tmpData)
        var text = decodeURIComponent(str)
        strUsbNamr[i] = text
      }
      this.GetDevName(numCam, strUsbNamr)
    },
    GetFaceZuobiao (Xdis, Ydis) {
      for (var j = 0; j < this.faceNum; j++) {
        for (var i = 0; i < 3; i++) {
          this.thisContext.moveTo(this.faceZuobiao[2 * i + j * 8] + Xdis, this.faceZuobiao[2 * i + j * 8 + 1] + Ydis)
          this.thisContext.lineTo(this.faceZuobiao[2 * i + j * 8 + 2] + Xdis, this.faceZuobiao[2 * i + j * 8 + 3] + Ydis)
          this.thisContext.stroke()
        }

        this.thisContext.moveTo(this.faceZuobiao[6 * i + j * 8] + Xdis, this.faceZuobiao[6 * i + j * 8 + 1] + Ydis)
        this.thisContext.lineTo(this.faceZuobiao[0 + j * 8] + Xdis, this.faceZuobiao[1 + j * 8] + Ydis)
        this.thisContext.stroke()
      }
    },
    // 关闭摄像头
    sendMsgCloseVideo () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x08
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
      this.thisContext.clearRect(0, 0, this.videoWidth, this.videoHeight)
    },
    // 必需重写---获取分辨率(data为分辨率数组,每2个为一组,宽高)
    GetDeviceResolution (data) {
      var obj = document.getElementById('Resolution')
      var max = 0
      var maxIndex = 0
      obj.options.length = 0
      if (data.length > 0) {
        for (var i = 0; i < data.length / 2; i++) {
          var objOption = document.createElement('option')
          var ww = data[i * 2]
          var hh = data[i * 2 + 1]
          objOption.text = '' + ww + '*' + hh
          objOption.value = i
          obj.options.add(objOption)
          if (max < ww) {
            max = ww
            maxIndex = i
          }
        }
        obj.options[maxIndex].selected = true
      }
    },
    // 必需重写---获取设备名称(num为当前摄像头数量,strUsbNamr为摄像头名字数组)
    GetDevName (num, strUsbNamr) {
      var obj = document.getElementById('DeviceName')
      obj.options.length = 0
      for (var i = 0; i < num; i++) {
        var objOption = document.createElement('option')
        objOption.text = strUsbNamr[i]
        objOption.value = i
        obj.options.add(objOption)
      }
      if (num > 0) {
        if (this.isSecondDev) {
          obj.options[this.camidMain].selected = true
          var obj2 = document.getElementById('DeviceName2')
          obj2.options.length = 0
          if (num > 1) {
            for (let i = 0; i < num; i++) {
              let objOption = document.createElement('option')
              objOption.text = strUsbNamr[i]
              objOption.value = i
              obj2.options.add(objOption)
            }
            obj2.options[this.camidSub].selected = true
            this.OcxGetDeviceResolutionSecond()
          }
        }
      }
    },
    // 切换分辨率
    ChangeResolution () {
      this.CloseCam()
      var obj = document.getElementById('Resolution')
      var restr = obj[obj.selectedIndex].text
      var pos = restr.lastIndexOf('*')
      var width = parseInt(restr.substring(0, pos))
      var height = parseInt(restr.substring(pos + 1, restr.length))
      this.StartCam(this.camidMain, width, height)
    },
    // 切换摄像头
    ChangeDevice () {
      this.CloseCam()
      var devObj = document.getElementById('DeviceName')
      this.camidMain = devObj.selectedIndex
      this.ChangeCamDevice(this.camidMain)
    },
    // 设备初始化完成,可以进行相关操作
    LoadOver () {
      this.StartVideo()
    },
    // 开启摄像头
    StartVideo () {
      var obj = document.getElementById('Resolution')
      var restr = obj[obj.selectedIndex].text
      var pos = restr.lastIndexOf('*')
      var width = parseInt(restr.substring(0, pos))
      var height = parseInt(restr.substring(pos + 1, restr.length))
      this.StartCam(this.camidMain, width, height)
    },
    StartCam (CamID, width, height) {
      this.sendMsgStartVideo(CamID, width, height)
    },
    sendMsgStartVideo (camId, width, height) {
      if (width === 3672) {
        this.imgOrignalW = 3264
        this.imgOrignalH = 2448
      } else {
        this.imgOrignalW = width
        this.imgOrignalH = height
      }
      var aDataArray = new Uint8Array(8)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x02
      aDataArray[2] = 0x05
      aDataArray[3] = camId
      aDataArray[4] = width / 256
      aDataArray[5] = width % 256
      aDataArray[6] = height / 256
      aDataArray[7] = height % 256
      this.ws.send(aDataArray.buffer)
    },
    // 监听滚轮
    scrollFunc (e) {
      //   e = e || window.event
      //   var ret = this.getCanvasPos(this.thisCancas, e)
      //   if (ret) {
      //     if (e.wheelDelta) { // IE/Opera/Chrome
      //       if (e.wheelDelta > 100) {
      //         this.ZoomOut()
      //       } else if (e.wheelDelta < -100) {
      //         this.ZoomIn()
      //         if (!this.isIE) {
      //           this.canvasX = 0
      //           this.canvasY = 0
      //         }
      //       }
      //     } else if (e.detail) { // Firefox
      //       if (e.detail >= 3) {
      //         this.ZoomIn()
      //         if (!this.isIE) {
      //           this.canvasX = 0
      //           this.canvasY = 0
      //         }
      //       } else if (e.detail <= -3) {
      //         this.ZoomOut()
      //       }
      //     }
      //     if (e.stopPropagation) e.stopPropagation()
      //     else e.cancelBubble = true
      //     if (e.preventDefault) e.preventDefault()
      //     else e.returnValue = false
      //     return false
      //   } else return true
    },
    // 拖拽操作
    canvasClick (e) {
      this.isDragging = true
      if (!this.isDrawMove) {
        this.thisCancasLastX = 0
        this.thisCancasLastY = 0
        this.canvasX_manual = 0
        this.canvasY_manual = 0
        this.recX_manual = 0
        this.recY_manual = 0
        this.recW_manual = 0
        this.recH_manual = 0
      }
    },
    stopDragging () {
      this.isDragging = false
      this.thisCancasLastX = 0
      this.thisCancasLastY = 0
      this.canvasX_manual = 0
      this.canvasY_manual = 0
      if (this.CutType === 2) {
        this.bpp = this.rec_ww / this.imgOrignalW
        if (this.rorateAngleType === 1 || this.rorateAngleType === 3) {
          this.bpp = this.rec_ww / this.imgOrignalH
        }
        this.cutXCaibian = Math.abs(this.recW_manual) / this.bpp
        this.cutYCaibian = Math.abs(this.recH_manual) / this.bpp
      }
    },
    canvasMove (e) {
      var mx = e.pageX - this.thisCancas.offsetLeft
      var my = e.pageY - this.thisCancas.offsetTop
      if (this.CutType === 2) {
        var x1 = this.recX_manual
        var x2 = this.recX_manual + this.recW_manual
        if (x1 > x2) {
          x1 = x2
          x2 = this.recX_manual
        }
        var y1 = this.recY_manual
        var y2 = this.recY_manual + this.recH_manual
        if (y1 > y2) {
          y1 = y2
          y2 = this.recY_manual
        }
        if (x1 <= mx && mx <= x2 && y1 <= my && my <= y2) {
          this.isDrawMove = true
          if (this.isDragging) {
            if (this.thisCancasLastX === 0 && this.thisCancasLastY === 0) {
              this.thisCancasLastX = mx
              this.thisCancasLastY = my
            } else {
              this.recX_manual = this.recX_manual + (mx - this.thisCancasLastX)
              this.recY_manual = this.recY_manual + (my - this.thisCancasLastY)
              this.thisCancasLastX = mx
              this.thisCancasLastY = my
            }
          }
          return
        } else if (x1 - 30 <= mx && mx <= x2 + 30 && y1 - 30 <= my && my <= y2 + 30) {
          this.isDrawMove = true
          if (this.isDragging) {
            if (this.thisCancasLastX === 0 && this.thisCancasLastY === 0) {
              this.thisCancasLastX = mx
              this.thisCancasLastY = my
            } else {
              var tmpX2 = this.recX_manual + this.recW_manual
              if (Math.abs(this.recX_manual - mx) < Math.abs(tmpX2 - mx)) {
                this.recX_manual = this.recX_manual + (mx - this.thisCancasLastX)
                this.recW_manual = this.recW_manual - (mx - this.thisCancasLastX)
              } else this.recW_manual = this.recW_manual + (mx - this.thisCancasLastX)

              var tmpY2 = this.recY_manual + this.recH_manual
              if (Math.abs(this.recY_manual - my) < Math.abs(tmpY2 - my)) {
                this.recY_manual = this.recY_manual + (my - this.thisCancasLastY)
                this.recH_manual = this.recH_manual - (my - this.thisCancasLastY)
              } else this.recH_manual = this.recH_manual + (my - this.thisCancasLastY)
              this.thisCancasLastX = mx
              this.thisCancasLastY = my
            }
            return
          }
        } else this.isDrawMove = false
      }
      if (this.isDragging === true) {
        if (this.CutType !== 2) {
          if (this.thisCancasLastX === 0 && this.thisCancasLastY === 0) {
            this.thisCancasLastX = e.pageX - this.thisCancas.offsetLeft
            this.thisCancasLastY = e.pageY - this.thisCancas.offsetTop
          } else {
            this.canvasX = this.canvasX + (mx - this.thisCancasLastX)
            this.canvasY = this.canvasY + (my - this.thisCancasLastY)
            this.thisCancasLastX = mx
            this.thisCancasLastY = my
          }
        } else {
          if (this.thisCancasLastX === 0 && this.thisCancasLastY === 0) {
            this.thisCancasLastX = mx
            this.thisCancasLastY = my
            this.recX_manual = mx
            this.recY_manual = my
          } else {
            this.canvasX_manual = this.canvasX_manual + (mx - this.thisCancasLastX)
            this.canvasY_manual = this.canvasY_manual + (my - this.thisCancasLastY)
            this.thisCancasLastX = mx
            this.thisCancasLastY = my
            this.recW_manual = this.canvasX_manual
            this.recH_manual = this.canvasY_manual
          }
        }
      }
    },
    InfoTextCallback (type, str) {
      var text = ''
      if (type === 0) {
        text = '图片路径:' + str + '\r\n'
      } else if (type === 1) {
        text = '默认路径:    ' + str + '\r\n'
      } else if (type === 2) {
        text = '条码:    ' + str + '\r\n'
      } else if (type === 3) {
        text = '文件上传服务器成功:' + str + '\r\n'
      } else if (type === 4) {
        text = '文件上传服务器失败:' + str + '\r\n'
      } else if (type === 5) {
        text = 'base64编码成功,请自行处理str\r\n'
        // text ="data:;base64," +str+"\r\n";
        var image = 'data:;base64,' + str
        this.uploadImg(image)
      } else if (type === 6) {
        text = '删除文件成功:' + str + '\r\n'
      } else if (type === 7) {
        text = '二维码:' + str + '\r\n'
      } else if (type === 8) {
        text = '拍照失败:' + str + '\r\n'
      } else if (type === 9) {
        text = '身份证名字:' + str + '\r\n'
      } else if (type === 10) {
        text = '身份证号码:' + str + '\r\n'
      } else if (type === 11) {
        text = '身份证性别:' + str + '\r\n'
      } else if (type === 12) {
        text = '身份证民族:' + str + '\r\n'
      } else if (type === 13) {
        text = '身份证生日:' + str + '\r\n'
      } else if (type === 14) {
        text = '身份证地址:' + str + '\r\n'
      } else if (type === 15) {
        text = '身份证签发机关:' + str + '\r\n'
      } else if (type === 16) {
        text = '身份证有效开始日期:' + str + '\r\n'
      } else if (type === 17) {
        text = '身份证有效截至日期:' + str + '\r\n'
      } else if (type === 18) {
        text = '安全模块号:' + str + '\r\n'
      } else if (type === 19) {
        // 身份证头像
        text = '身份证头像base64\r\n'
        let imgobj1 = document.getElementById('img1')
        imgobj1.src = 'data:;base64,' + str
      } else if (type === 21) {
        text = 'base64编码成功,请自行处理str(副头)\r\n'
        // text ="data:;base64," +str+"\r\n";
        let imgobj1 = document.getElementById('img2')
        imgobj1.src = 'data:;base64,' + str
      } else if (type === 22) {
        text = '曝光范围:' + str + '\r\n'
      } else if (type === 23) {
        text = '亮度范围:' + str + '\r\n'
      } else if (type === 24) {
        text = '上传服务器返回:' + str + '\r\n'
      } else if (type === 25) {
        let imgobj1 = document.getElementById('img1')
        imgobj1.src = 'data:;base64,' + str
        text = '身份证复印件' + '\r\n'
      } else if (type === 26) {
        text = '当前设备数量:' + str + '\r\n'
      } else if (type === 27) {
        text = '麦克风:' + str + '\r\n'
      } else if (type === 28) {
        text = '人脸抓拍base64编码成功,请自行处理str\r\n'
        // text ="data:;base64," +str+"\r\n";
        let imgobj1 = document.getElementById('img1')
        imgobj1.src = 'data:;base64,' + str
      } else if (type === 29) {
        var strTmp = str.split('D')
        text = '银行卡号:' + strTmp[0] + '---有效日期(年月):' + strTmp[1] + '\r\n'
      } else if (type === 30) {
        text = '人脸抓拍base64编码成功,请自行处理str\r\n'
        // text ="data:;base64," +str+"\r\n";
        let imgobj1 = document.getElementById('img2')
        imgobj1.src = 'data:;base64,' + str
      } else if (type === 33) {
        // fingerBase64 = str
        text = '指纹:' + str + '\r\n'
      } else if (type === 34) {
        // fingerLen = str
        text = '指纹长度:' + str + '\r\n'
      } else if (type === 36) {
        let imgobj1 = document.getElementById('img1')
        imgobj1.src = 'data:;base64,' + str
        text = '指纹图片base64\r\n'
      } else if (type === 37) {
        text = '指纹对比成功 id:' + str + '\r\n'
      }
      console.log(text)
    },
    InfoCallback (op) {
      let text = ''
      if (op === 0) {
        text = '连接成功\r\n'
      } else if (op === 0x01) {
        text = '断开成功\r\n'
      } else if (op === 0x02) {
        text = '设备已经连接\r\n'
      } else if (op === 0x03) {
        text = '设备已经关闭\r\n'
      } else if (op === 0x04) {
        text = '拍照成功\r\n'
      } else if (op === 0x05) {
        text = 'pdf添加文件成功\r\n'
      } else if (op === 0x06) {
        text = 'pdf保存成功\r\n'
      } else if (op === 0x07) {
        text = '图片合并成功\r\n'
      } else if (op === 0x08) {
        text = '智能连拍启动\r\n'
      } else if (op === 0x09) {
        text = '定时连拍启动\r\n'
      } else if (op === 0x10) {
        text = '定时连拍成功\r\n'
      } else if (op === 0x11) {
        text = '定时连拍关闭\r\n'
      } else if (op === 0x12) {
        text = '文件上传服务器成功\r\n'
      } else if (op === 0x13) {
        text = '水印开启\r\n'
      } else if (op === 0x14) {
        text = '水印关闭\r\n'
      } else if (op === 0x15) {
        text = '此设备属于本公司\r\n'
      } else if (op === 0x16) {
        text = '此设备不属于本公司\r\n'
      } else if (op === 0x17) {
        text = '自动曝光启动\r\n'
      } else if (op === 0x18) {
        text = '自动曝光关闭\r\n'
      } else if (op === 0x19) {
        text = '身份证功能启动成功\r\n'
      } else if (op === 0x1a) {
        text = '身份证功能启动失败\r\n'
      } else if (op === 0x1b) {
        text = '身份证读卡成功\r\n'
      } else if (op === 0x1c) {
        text = '身份证读卡失败\r\n'
      } else if (op === 0x1d) {
        text = '重新操作\r\n'
      } else if (op === 0x1e) {
        text = '未发现模块\r\n'
      } else if (op === 0x1f) {
        text = '未启动身份证功能\r\n'
      } else if (op === 0x20) {
        text = '启动身份证自动读卡\r\n'
      } else if (op === 0x21) {
        text = '关闭身份证自动读卡\r\n'
      } else if (op === 0x22) {
        text = '启动拍照只生成base64\r\n'
      } else if (op === 0x23) {
        text = '关闭拍照只生成base64\r\n'
      } else if (op === 0x25) {
        text = '初始化指纹模块成功\r\n'
      } else if (op === 0x26) {
        text = '初始化指纹模块失败\r\n'
      } else if (op === 0x27) {
        text = '未初始化指纹模块\r\n'
      } else if (op === 0x28) {
        text = '身份证没有指纹数据\r\n'
      } else if (op === 0x29) {
        text = '指纹认证成功\r\n'
      } else if (op === 0x30) {
        text = '开始指纹认证\r\n'
      } else if (op === 0x31) {
        text = '正在指纹认证\r\n'
      } else if (op === 0x32) {
        text = '停止指纹认证\r\n'
      } else if (op === 0x33) {
        text = '指纹认证失败\r\n'
      } else if (op === 0x34) {
        text = '开始录像\r\n'
      } else if (op === 0x35) {
        text = '停止录像\r\n'
      } else if (op === 0x36) {
        text = '正在录像中\r\n'
      } else if (op === 0x37) {
        text = '开始录像副头\r\n'
      } else if (op === 0x38) {
        text = '停止录像副头\r\n'
      } else if (op === 0x39) {
        text = '正在录像中副头\r\n'
      } else if (op === 0x44) {
        text = '建立文件成功\r\n'
      } else if (op === 0x45) {
        text = '建立文件失败\r\n'
      } else if (op === 0x46) {
        text = '人脸识别初始化成功\r\n'
      } else if (op === 0x47) {
        text = '启动人脸对比\r\n'
      } else if (op === 0x48) {
        text = '人脸识别初始化成功\r\n'
      } else if (op === 0x4d) {
        text = '初始化银行卡成功\r\n'
      } else if (op === 0x4e) {
        text = '指纹初始化成功\r\n'
      } else if (op === 0x4f) {
        text = '指纹初始化失败\r\n'
      } else if (op === 0x50) {
        text = '指纹录入成功\r\n'
      } else if (op === 0x51) {
        text = '指纹录入失败\r\n'
      } else if (op === 0x52) {
        text = '指纹录入时请用同一个指纹\r\n'
      } else if (op === 0x53) {
        text = '再完整指纹\r\n'
      } else if (op === 0x54) {
        text = '指纹对比成功\r\n'
      } else if (op === 0x55) {
        text = '指纹对比失败\r\n'
      } else if (op === 0x56) {
        text = '启动指纹录入\r\n'
      } else if (op === 0x57) {
        text = '未初始化指纹功能\r\n'
      } else if (op === 0x58) {
        text = '正在处于指纹对比状态,请先停止指纹对比\r\n'
      } else if (op === 0x59) {
        text = '已经启动指纹录入\r\n'
      } else if (op === 0x5a) {
        text = '正在处于指纹录入状态,请先停止指纹录入\r\n'
      } else if (op === 0x5b) {
        text = '已经启动指纹对比\r\n'
      } else if (op === 0x5c) {
        text = '指纹数据不存在\r\n'
      } else if (op === 0x5d) {
        text = '启动指纹对比\r\n'
      } else if (op === 0x5e) {
        text = '人脸识别初始化成功(双头)\r\n'
      } else if (op === 0x5f) {
        text = '人脸捕捉功能初始化成功\r\n'
      } else if (op === 0x60) {
        text = '人脸捕捉功能初始化失败\r\n'
      } else if (op === 0x61) {
        text = '人脸捕捉功能初始化成功(副头)\r\n'
      } else if (op === 0x62) {
        text = '人脸捕捉功能初始化失败(副头)\r\n'
      } else if (op === 0x66) {
        text = '指纹图片base64不存在\r\n'
      } else if (op === 0x67) {
        text = '已接上设备\r\n'
      } else if (op === 0x68) {
        text = '未接设备\r\n'
      } else if (op === 0xa0) {
        text = '没有对应分辨率\r\n'
      } else if (op === 0xa1) {
        text = 'pdf没有添加任何文件\r\n'
      } else if (op === 0xa2) {
        text = '文件不存在\r\n'
      } else if (op === 0xa3) {
        text = '意外断开\r\n'
      } else if (op === 0xa4) {
        text = '连接不上\r\n'
      } else if (op === 0xa5) {
        text = 'pdf添加文件不是jpg格式\r\n'
      } else if (op === 0xa6) {
        text = '没有发现摄像头\r\n'
      } else if (op === 0xa7) {
        text = 'camid无效\r\n'
      } else if (op === 0xa8) {
        text = '图片尺寸太小\r\n'
      } else if (op === 0xa9) {
        text = '文件上传服务器失败\r\n'
      } else if (op === 0xaa) {
        text = '该设备没有副头\r\n'
      } else if (op === 0xab) {
        text = '条码识别失败\r\n'
      } else if (op === 0xac) {
        text = '二维码识别失败\r\n'
      } else if (op === 0xad) {
        text = '图片合并失败\r\n'
      } else if (op === 0xae) {
        text = '设置路径文件不存在\r\n'
      } else if (op === 0xaf) {
        text = '摄像头切换太频繁\r\n'
      } else if (op === 0xb1) {
        text = '未发现指纹模块\r\n'
      } else if (op === 0xb2) {
        text = '录像分辨率不能高于1600*1200\r\n'
      } else if (op === 0xb3) {
        text = '副头录像分辨率不能高于1600*1200\r\n'
      } else if (op === 0xb4) {
        text = '没发现麦克风\r\n'
      } else if (op === 0xb8) {
        text = '人脸识别初始化失败\r\n'
      } else if (op === 0xb9) {
        text = '请读取身份证信息\r\n'
      } else if (op === 0xba) {
        text = '请先初始化人脸识别\r\n'
      } else if (op === 0xbb) {
        text = '没有发现合适的人脸\r\n'
      } else if (op === 0xbc) {
        text = '未发现银行卡模块\r\n'
      } else if (op === 0xbd) {
        text = '先初始化银行卡模块\r\n'
      } else if (op === 0xbe) {
        text = '没有发现银行卡模块\r\n'
      } else if (op === 0xbf) {
        text = '没有检查到银行卡\r\n'
      } else if (op === 0xc0) {
        text = '请检查银行卡是否插入卡座正确\r\n'
      } else if (op === 0xc1) {
        text = '银行卡解析数据有误\r\n'
      }
      this.$message.success(text)
    },
    byteToString (arr) {
      if (typeof arr === 'string') {
        return arr
      }
      var str = ''
      var _arr = arr
      for (var i = 0; i < _arr.length; i++) {
        var one = _arr[i].toString(2)
        var v = one.match(/^1+?(?=0)/)
        if (v && one.length === 8) {
          var bytesLength = v[0].length
          var store = _arr[i].toString(2).slice(7 - bytesLength)
          for (var st = 1; st < bytesLength; st++) {
            store += _arr[st + i].toString(2).slice(2)
          }
          str += String.fromCharCode(parseInt(store, 2))
          i += bytesLength - 1
        } else {
          str += String.fromCharCode(_arr[i])
        }
      }
      return str
    },
    /*
   *@function  绘制图片
   *****************************************/
    setImage () {
      this.resetFlag = false
      if (this.uploadLock) {
        this.$message.warning('图片还在上传中，请耐心等待')
        return
      }
      let _this = this
      if (_this.imgSrc.length === 8) {
        this.$message.error('最多上传8张照片')
        return
      }
      // 点击，canvas画图
      // _this.thisContext.drawImage(_this.thisVideo, 0, 0, _this.videoWidth, _this.videoHeight)
      // 上面代码执行完成后再拍摄照片
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x0a
      aDataArray[2] = 0x01
      aDataArray[3] = 0x00
      this.ws.send(aDataArray.buffer)
    },
    uploadImg (image) {
      let _this = this
      var url = 'https://upload.qiniup.com/'
      var xhr = new XMLHttpRequest()
      let formData = new FormData()
      formData.append('token', _this.postData.token)
      let filename = Date.parse(new Date()) + '.jpeg'
      formData.append('key', filename)
      formData.append('file', _this.dataURLtoFile(image, filename))
      this.uploadLock = true
      xhr.open('POST', url, true)
      xhr.send(formData)
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (_this.resetFlag) {
            _this.imgSrc.find((item) => item.choose).image = image
            _this.imgSrc.find((item) => item.choose).src = 'https://zhihui.tlkrzf.com/' + JSON.parse(xhr.responseText).key
          } else {
            _this.imgSrc.forEach((item) => {
              item.choose = false
            })
            _this.imgSrc.push({
              'image': image,
              'choose': true,
              'src': 'https://zhihui.tlkrzf.com/' + JSON.parse(xhr.responseText).key
            })
          }
          _this.uploadLock = false
        }
      }
    },
    resetImage () {
      if (this.imgSrc.length === 0) {
        this.$message.error('你还没上传任何图片')
        return
      }
      this.resetFlag = true
      if (this.uploadLock) {
        this.$message.warning('图片还在上传中，请耐心等待')
        return
      }
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x0a
      aDataArray[2] = 0x01
      aDataArray[3] = 0x00
      this.ws.send(aDataArray.buffer)
    },
    stopCemara () {
      // this.mediaStreamTrack.stop()
      this.sendMsgCloseVideo()
      this.openCamera = false
      this.showCamera = false
    },
    deleteImg (index) {
      this.imgSrc.splice(index, 1)
    },
    chooseImg (index) {
      this.imgSrc.forEach((item) => {
        item.choose = false
      })
      this.imgSrc[index].choose = true
    },
    base64decode (str) {
      var c1, c2, c3, c4
      var i, len, out

      len = str.length
      i = 0
      out = ''
      while (i < len) {
        /* c1 */
        do {
          c1 = this.base64DecodeChars[str.charCodeAt(i++) & 0xff]
        } while (i < len && c1 === -1)
        if (c1 === -1) { break }

        /* c2 */
        do {
          c2 = this.base64DecodeChars[str.charCodeAt(i++) & 0xff]
        } while (i < len && c2 === -1)
        if (c2 === -1) { break }

        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4))

        /* c3 */
        do {
          c3 = str.charCodeAt(i++) & 0xff
          if (c3 === 61) { return out }
          c3 = this.base64DecodeChars[c3]
        } while (i < len && c3 === -1)
        if (c3 === -1) { break }

        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2))

        /* c4 */
        do {
          c4 = str.charCodeAt(i++) & 0xff
          if (c4 === 61) { return out }
          c4 = this.base64DecodeChars[c4]
        } while (i < len && c4 === -1)
        if (c4 === -1) { break }
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4)
      }
      return out
    },
    getBlobBydataURI (dataURI) {
      // var binary = atob(dataURI.split(',')[1]);
      var binary = this.base64decode(dataURI)
      var array = []
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i))
      }
      return new Blob([new Uint8Array(array)], { type: 'image/jpeg' })
    },
    /*
   *@function  base64转文件
   *****************************************/
    dataURLtoFile (dataurl, filename) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      let u8arr = this.getBlobBydataURI(arr[1])
      return new File([u8arr], filename, { type: mime })
    },
    beforeAvatarUpload (file) {
      let fileName = file.name.lastIndexOf('.')// 取到文件名开始到最后一个点的长度
      let fileNameLength = file.name.length// 取到文件名长度
      let fileFormat = file.name.substring(fileName + 1, fileNameLength)// 截
      this.postData.key = Date.parse(new Date()) + '.' + fileFormat
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 10MB!')
        return false
      }
    },
    beforeRemove (file, fileList) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFile({
          id: file.id ? file.id : null,
          file_name: file.response ? file.response.key : file.url.split('https://zhihui.tlkrzf.com/')[1]
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            let deleteIndex = 0
            fileList.forEach((item, index) => {
              if (file.response) {
                if (item.response && (item.response.key === file.response.key)) {
                  deleteIndex = index
                }
              } else {
                if (item.url === file.url) {
                  deleteIndex = index
                }
              }
            })
            fileList.splice(deleteIndex, 1)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // return false 禁用自带的删除功能
      return false
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url || file.image
      this.dialogVisible = true
    },
    addPart (obj) {
      obj.push({
        name: '',
        size: this.size.map((item) => {
          return {
            size: item.size_name,
            size_id: item.id,
            value: ''
          }
        })
      })
    },
    deletePart (obj, index) {
      if (obj.length === 1) {
        this.$message.error('至少有一个部位')
      } else {
        obj.splice(index, 1)
      }
    },
    getPart (part) {
      this.craftInfo.organization = []
      this.craftInfo.density.crosswise_density = []
      this.craftInfo.density.lengthwise_density = []
      JSON.parse(part).forEach((item) => {
        this.craftInfo.organization.push({
          name: item.value,
          size: this.size.map((item) => {
            return {
              size: item.size_name,
              value: ''
            }
          })
        })
        this.craftInfo.density.crosswise_density.push({
          name: item.value,
          size: this.size.map((item) => {
            return {
              size: item.size_name,
              value: ''
            }
          })
        })
        this.craftInfo.density.lengthwise_density.push({
          name: item.value,
          size: this.size.map((item) => {
            return {
              size: item.size_name,
              value: ''
            }
          })
        })
      })
    },
    querySearch (queryString, cb) {
      var results = queryString ? this.ZZJGArr.filter((item) => item.toLowerCase().indexOf(queryString.toLowerCase()) === 0) : this.ZZJGArr
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    searchGX (queryString, cb) {
      var results = queryString ? this.processArr.filter((item) => item.toLowerCase().indexOf(queryString.toLowerCase()) === 0) : this.processArr
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    submit () {
      const imgArr = this.$refs.uploada.uploadFiles.map((item) => { return (item.response ? 'https://zhihui.tlkrzf.com/' + item.response.key : item.url) })
      let fileUrl = this.imgSrc.map((item) => item.src).concat(imgArr)
      craft.createCloth({
        product_id: this.$route.params.id,
        product_type: this.$route.params.type,
        complete_data: JSON.stringify(this.craftInfo),
        file_url: fileUrl
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
          if (window.localStorage.getItem(this.$route.name) && JSON.parse(window.localStorage.getItem(this.$route.name)).msgFlag) {
            this.msgUrl = '/craft/craftDetail/' + this.$route.params.id + '/' + this.$route.params.type
            this.msgContent = '<span style="color:#1A95FF">添加</span>了一张新工艺单<span style="color:#1A95FF">' + res.data.data.product_info.product_code + '</span>(' + res.data.data.product_info.category_name + '/' + res.data.data.product_info.type_name + '/' + res.data.data.product_info.style_name + '/' + res.data.data.product_info.flower_id + ')'
            this.msgSwitch = true
          } else {
            this.$router.push('/craft/craftDetail/' + this.$route.params.id + '/' + this.$route.params.type)
          }
        }
      })
    }
  },
  mounted () {
    let sampleOrProduct = this.$route.params.type === '1' ? product : sample
    Promise.all([sampleOrProduct.detail({
      id: this.$route.params.id
    }), productPart.list(),
    flower.list({
      type: 2
    }),
    process.list(),
    getToken()
    ]).then((res) => {
      this.productInfo = res[0].data.data
      this.productInfo.sizePart = []
      this.productInfo.size.forEach((itemSize, indexSize) => {
        JSON.parse(itemSize.part_info).forEach((itemPart, indexPart) => {
          if (!this.productInfo.sizePart[indexPart]) {
            this.productInfo.sizePart[indexPart] = {
              part: '',
              size: []
            }
          }
          this.productInfo.sizePart[indexPart].part = itemPart.part
          this.productInfo.sizePart[indexPart].size.push(itemPart.size)
        })
      })
      this.size = this.productInfo.size.map((item) => {
        return {
          size_name: item.size_name,
          id: item.size_id
        }
      })
      this.size.forEach((item) => {
        this.craftInfo.machine_code.push({
          size: item.size_name,
          size_id: item.id,
          value: ''
        })
      })
      this.addPart(this.craftInfo.machine_time)
      this.addPart(this.craftInfo.organization)
      this.addPart(this.craftInfo.density.crosswise_density)
      this.addPart(this.craftInfo.density.lengthwise_density)
      this.craftInfo.weight = this.size.map((item) => {
        return {
          size: item.size_name,
          size_id: item.id,
          value: ''
        }
      })
      this.partArr = res[1].data.data
      this.ZZJGArr = res[2].data.data.map((item) => {
        return {
          name: item.name,
          value: item.name
        }
      })
      this.processArr = res[3].data.data
      this.processArr.forEach((item) => {
        item.value = item.name
      })
      this.postData.token = res[4].data.data
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/craft/craftCreateForCloth.less";
</style>
