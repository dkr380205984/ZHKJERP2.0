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
    <div class="popup"
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
            <!-- <div class="btnCtn">
              <i class="el-icon el-icon-delete"
                @click="deleteImg(index)"></i>
            </div> -->
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
      video: this.$refs.video
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
    getCompetence (ev) {
      if (!ev) {
        return
      } else {
        this.$message.success('请按照浏览器提示信息打开本地摄像头')
        this.showCamera = true
      }
      var _this = this
      _this.thisCancas = document.getElementById('canvasCamera')
      _this.thisContext = _this.thisCancas.getContext('2d')
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
          // width: { min: 800, ideal: 1600, max: 3264 },
          // height: { min: 600, ideal: 800, max: 2448 }
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
    },
    /*
     *@function  绘制图片
     *****************************************/
    setImage () {
      let _this = this
      if (_this.imgSrc.length === 8) {
        this.$message.error('最多上传8张照片')
        return
      }
      // 点击，canvas画图
      _this.thisContext.drawImage(_this.thisVideo, 0, 0, _this.videoWidth, _this.videoHeight)
      // 获取图片base64链接
      var image = _this.thisCancas.toDataURL('image/png')

      var url = 'https://upload.qiniup.com/'
      var xhr = new XMLHttpRequest()
      let formData = new FormData()
      formData.append('token', this.postData.token)
      let filename = Date.parse(new Date()) + '.jpg'
      formData.append('key', filename)
      formData.append('file', this.dataURLtoFile(image, filename))
      xhr.open('POST', url, true)
      xhr.send(formData)
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          _this.imgSrc.forEach((item) => {
            item.choose = false
          })
          _this.imgSrc.push({
            'image': image,
            'choose': true,
            'src': 'https://zhihui.tlkrzf.com/' + JSON.parse(xhr.responseText).key
          })
        }
      }
    },
    resetImage () {
      let _this = this
      // 点击，canvas画图
      _this.thisContext.drawImage(_this.thisVideo, 0, 0, _this.videoWidth, _this.videoHeight)
      // 获取图片base64链接
      var image = _this.thisCancas.toDataURL('image/png')

      var url = 'https://upload.qiniup.com/'
      var xhr = new XMLHttpRequest()
      let formData = new FormData()
      formData.append('token', _this.postData.token)
      let filename = Date.parse(new Date()) + '.jpg'
      formData.append('key', filename)
      formData.append('file', _this.dataURLtoFile(image, filename))
      xhr.open('POST', url, true)
      xhr.send(formData)
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          _this.imgSrc.find((item) => item.choose).image = image
          _this.imgSrc.find((item) => item.choose).src = 'https://zhihui.tlkrzf.com/' + JSON.parse(xhr.responseText).key
        }
      }
    },
    stopCemara () {
      this.mediaStreamTrack.stop()
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
    /*
     *@function  base64转文件
     *****************************************/
    dataURLtoFile (dataurl, filename) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
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
