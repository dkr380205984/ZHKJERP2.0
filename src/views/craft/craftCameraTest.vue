<template>
  <div>
    <div style="width:500px; height: 550px; border: 1px solid white; background:#C7EDCC;  float:left">
      <div width="100%"
        height="400px"
        id='ActiveXDivOne'>
      </div>
      <p align="center"
        style=" width:100%; height:30px">
        <table style="width:100%;">
          <td class="style5"
            style="font-size: medium">
            设备</td>
          <td class="style1">
            <select id="DeviceName"
              name="D1"
              @change="ChangeDevice()">
            </select></td>

          <td class="style5"
            style="font-size: medium">
            分辨率</td>
          <td class="style3">
            <select id="Resolution"
              name="D2"
              @change="ChangeResolution()">
              <option value="1920*1080">1920*1080</option>
            </select></td>

        </table>
        <input type="button"
          value=" 放大 "
          @click="ZoomOut(1);" />
        <input type="button"
          value=" 缩小 "
          @click="ZoomIn(1);" />
        <input type="button"
          value=" 左旋 "
          @click="RoateL(1);" />
        <input type="button"
          value=" 右旋 "
          @click="RoateR(1);" />
        <input type="button"
          value=" 适合大小 "
          @click="BestSize(1);" />
        <input type="button"
          value=" 实际大小 "
          @click="TrueSize(1);" />
        <input type="button"
          value=" 隐藏/显示 "
          @click="ShowHide(1);" />
        <table>

          <td>
            <input id="Button2"
              type="button"
              value="打开"
              @click="StartVideo();" />
            <input id="Button2"
              type="button"
              value="关闭"
              @click="CloseVideo();" />
            <input id="Button2"
              type="button"
              value="拍照"
              @click="Capture();" />
            <input id="Button2"
              type="button"
              value="参数设置"
              @click="ShowImageSettingWindow();" />
            <input id="Button2"
              type="button"
              value="自动对焦"
              @click="funAutoFoucs();" />
            <input id="Button2"
              type="button"
              value="定焦"
              @click="funSetFoucs();" />
          </td>

        </table>

      </p>
    </div>
    <div style="width:500px; height: 550px; border: 1px solid white; background:#C7EDCC;  float:left">

      <div width="100%"
        height="400px"
        id='ActiveXDivTwo'>
      </div>
      <p align="center"
        style=" width:100%; height:30px">
        <table style="width:100%;">

          <td class="style5"
            style="font-size: medium">
            设备2</td>
          <td class="style1">
            <select id="DeviceName2"
              name="D1"
              @change="ChangeDevice2()">
            </select></td>
          <td class="style5"
            style="font-size: medium">
            分辨率</td>
          <td class="style3">
            <select id="Resolution2"
              name="D2"
              @change="ChangeResolution2()">
            </select></td>

        </table>

        <input id="Button2"
          type="button"
          value="打开"
          @click="StartVideo2();" />
        <input id="Button2"
          type="button"
          value="关闭"
          @click="CloseVideo2();" />
        <input id="Button2"
          type="button"
          value="拍照"
          @click="Capture2();" />
        <input id="Button2"
          type="button"
          value="参数设置"
          @click="sendMsgShowImageSettingWindowB();" />

      </p>
    </div>
    <div style="width:220px; height: 550px; background:#C7EDCC; border: 1px solid black;float:left">
      <div style="width: 100%;height: 30%;">

        <img id="img1"
          style="width: 99%;height: 100%" />

      </div>

      <div style="width: 100%;height: 30%;">

        <img id="img2"
          style="width: 99%;height: 100%" />

      </div>
      <div style="width: 100%;height: 40%;">
      </div>
    </div>
    <div style="width:1200px;height:200px;background:#C7EDCC; border: 1px solid black;clear:both; ">
      <table style="width:100%;">
        <td style="font-size: medium"
          class="style13">
          保存格式</td>
        <td class="style14">
          <select id="FileType"
            @change="SetFileType()">
            <option value="0">jpg</option>
            <option value="1">png</option>
            <option value="2">bmp</option>
            <option value="3">gif</option>
            <option value="4">tif</option>

          </select></td>

        <td style="font-size: medium"
          class="style23">
        </td>

        <td style="font-size: medium"
          class="style13">
          颜色格式</td>
        <td class="style14">
          <select id="ColourMode"
            @change="SetImageColorMode()">
            <option value="0">彩色</option>
            <option value="1">灰度</option>
            <option value="2">黑白</option>
          </select></td>
        <td style="font-size: medium"
          class="style23">
        </td>

        <td style="font-size: medium"
          class="style13">
          裁切模式:</td>
        <td>
          <input id="Radio1"
            checked="checked"
            name="R1"
            type="radio"
            value="V1"
            @click="SetCutType()" />不裁切
        </td>
        <td>
          <input id="Radio2"
            name="R1"
            type="radio"
            value="V2"
            @click="SetCutType()" />自动裁切
        </td>
        <td>
          <input id="Radio3"
            name="R1"
            type="radio"
            value="V3"
            @click="SetCutType()" />手动裁切
        </td>

        <td style="font-size: medium"
          class="style13">
          自动裁切:</td>
        <td>
          <input id="Radio13"
            checked="checked"
            name="R11"
            type="radio"
            value="V1"
            @click="funsetJiubianModel()" />单图
        </td>
        <td>
          <input id="Radio14"
            name="R11"
            type="radio"
            value="V2"
            @click="funsetJiubianModel()" />多图
        </td>
        <td>
          <input id="checkbox2"
            type="checkbox"
            value="黑边补白"
            @click="funsetBuBai();">补白<br>
        </td>

      </table>

      <table style="width: 100%;">
        <td style="font-size: medium"
          class="style13">
          连拍模式:</td>

        <td>
          <input id="Radio10"
            checked="checked"
            name="R10"
            type="radio"
            value="V1"
            @click="SetCaptureModel()" />无
        </td>
        <td>
          <input id="Radio11"
            name="R10"
            type="radio"
            value="V2"
            @click="SetCaptureModel()" />智能连拍
        </td>
        <td>
          <input id="Radio12"
            name="R10"
            type="radio"
            value="V3"
            @click="SetCaptureModel()" />定时连拍
        </td>

        <td style="font-size: medium"
          class="style23">
        </td>

        <td>
          <input type="button"
            value=" 合并PDF "
            @click="funConvertToPDF();"
            style="width: 69px" />
        </td>

        <td>
          <input id="Button7"
            type="button"
            value="上传(本地图片)"
            @click="funUpdataFile();" />
        </td>

        <td>
          <input id="Button7"
            type="button"
            value="上传(base64)"
            @click="funUpdataBase64();" />
        </td>

        <td>
          <input id="ButtonPath"
            type="button"
            value="文件路径"
            @click="SetFilePath();" />
        </td>

        <td>
          <input type="button"
            value=" 图片合并 "
            @click="funCombineTwoImage();" />
        </td>
        <td>
          方向:
          <input id="Radio4"
            checked="checked"
            name="R2"
            type="radio"
            value="V1" />垂直
          <input id="Radio5"
            name="R2"
            type="radio"
            value="V2" />水平
        </td>
        <td>
          <input id="checkbox1"
            type="checkbox"
            value="去底灰"
            @click="funsetQudise();">去底灰</td>
        <td>
          <input id="checkboxBase"
            type="checkbox"
            value="拍照base64"
            @click="funSetImagebase64();">拍照base64
        </td>

      </table>

      <table style="width: 100%;">
        <td style="font-size: medium"
          class="style13">
          文件命名:</td>
        <td>
          <input id="Radio19"
            name="R7"
            type="radio"
            value="V1"
            @click="funSetFileNameModel()" />自定义
          <input id="Radio20"
            checked="checked"
            name="R7"
            type="radio"
            value="V2"
            @click="funSetFileNameModel()" />时间
          <input id="Radio21"
            name="R7"
            type="radio"
            value="V3"
            @click="funSetFileNameModel()" />固定
        </td>
        <td>
        <td style="font-size: medium"
          class="style13">
          水印功能:</td>
        <td>
          <input id="Radio6"
            type="radio"
            checked="checked"
            name="R3"
            value="V1"
            @click="SetWaterType();" />关闭

          <input id="Radio7"
            type="radio"
            name="R3"
            value="V2"
            @click="SetWaterType();" />启动
        </td>

        <td>
          <input type="button"
            value="开始Base64编码"
            @click="fungetBase64();" />
        </td>

        <td>
          <input type="button"
            value="获取曝光与亮度范围"
            @click="funGetCamParameter();" />
          <input type="button"
            value="设置曝光"
            @click="funSetExposure();" />
          <input type="button"
            value="设置亮度"
            @click="funSetBrightness();" />
          自动曝光:
          <input id="RadioExopen"
            checked="checked"
            name="R2"
            type="radio"
            value="V1"
            @click="funSetAutoExposure();" />启动
          <input id="RadioExclose"
            name="R2"
            type="radio"
            value="V2"
            @click="funSetAutoExposure();" />关闭

          <input id="ButtonPath"
            type="button"
            value="检测设备"
            @click="CheckCamDev();" />
        </td>

      </table>

      <table style="width: 100%;">
        <td>

          <input type="button"
            value="获取当期摄像头数量"
            @click="funGetCamNum();" />

          <input type="button"
            value="建立文件夹"
            @click="funMakeDir();" />

          <input type="button"
            value="删除文件"
            @click="funDeleteFile();" />

          <input type="button"
            value="设置JPG图像质量"
            @click="funSetJpgQuanlity();" />

          <input type="button"
            value="设置手动裁边坐标"
            @click="funSetCusCropPlace();" />

          <input type="button"
            value="设置手动裁边坐标2"
            @click="funSetCusCropPlace2();" />

          <input type="button"
            value="条码识别(路径)"
            @click="funReadBarCode(0);" />

          <input type="button"
            value="条码识别(动态)"
            @click="funReadBarCode(1);" />

          <input type="button"
            value="二维码识别(路径)"
            @click="funReadQrCode(0);" />

          <input type="button"
            value="二维码识别(动态)"
            @click="funReadQrCode(1);" />

        </td>

      </table>

      <table style="width: 100%;">
        <td style="font-size: medium"
          class="style33">
          身份证功能:</td>

        <td>
          <input id="ButtonStartID"
            type="button"
            value="启动身份证模块"
            @click="funStartIC();" />

          <input id="ButtonStartID"
            type="button"
            value="自动读卡"
            @click="funStartICWork();" />

          <input id="ButtonStartID"
            type="button"
            value=" 关闭自动读卡"
            @click="funStopICWork();" />

          <input id="ButtonStartID"
            type="button"
            value="手动读卡"
            @click="funGetOneIC();" />

          <input id="ButtonStartID"
            type="button"
            value="获取身份证信息"
            @click="funGetICValues();" />

          <input id="ButtonStartID"
            type="button"
            value="获取身份证复印件"
            @click="funGetICPictureAll();" />

        </td>

      </table>

      <table style="width: 100%;">
        <td style="font-size: medium"
          class="style33">
          指纹功能(身份证):</td>

        <td>
          <input id="ButtonStartID"
            type="button"
            value="初始化指纹功能"
            @click="InitFinger();" />

          <input id="ButtonStartID"
            type="button"
            value="启动指纹功能"
            @click="StartFinger();" />

          <input id="ButtonStartID"
            type="button"
            value="停止指纹功能"
            @click="CloseFinger();" />
        </td>

        <td style="font-size: medium"
          class="style33">
          录像功能:</td>

        <td>
          <input id="ButtonStartID"
            type="button"
            value="启动录像主头"
            @click="funBeginVideo();" />

          <input id="ButtonStartID"
            type="button"
            value="停止录像主头"
            @click="funStopVideo();" />

          <input id="ButtonStartID"
            type="button"
            value="启动录像副头"
            @click="funBeginVideo2();" />

          <input id="ButtonStartID"
            type="button"
            value="停止录像副头"
            @click="funStopVideo2();" />

          <input id="ButtonStartID"
            type="button"
            value="获取声卡名字"
            @click="funGetAudioName();" />
        </td>

      </table>

      <table style="width: 100%;">
        <td style="font-size: medium"
          class="style33">
          人脸识别功能(身份证):</td>

        <td>
          <input id="ButtonStartID"
            type="button"
            value="初始化人脸识别"
            @click="FaceCheckInit();" />

          <input id="ButtonStartID"
            type="button"
            value="启动人脸对比"
            @click="StartFaceCheck();" />

          <input id="ButtonStartID"
            type="button"
            value="停止人脸对比"
            @click="StopFaceCheck();" />

          <input id="ButtonStartID"
            type="button"
            value="关闭人脸识别"
            @click="FaceCheckUninit();" />
        </td>

        <td>
          <input id="ButtonStartID"
            type="button"
            value="初始化人脸识别(副头)"
            @click="FaceCheckInitSecond();" />

          <input id="ButtonStartID"
            type="button"
            value="启动人脸对比(副头)"
            @click="StartFaceCheckSecond();" />

          <input id="ButtonStartID"
            type="button"
            value="停止人脸对比(副头)"
            @click="StopFaceCheckSecond();" />

          <input id="ButtonStartID"
            type="button"
            value="关闭人脸识别(副头)"
            @click="FaceCheckUninitSecond();" />
        </td>

      </table>

      <table style="width: 100%;">
        <td style="font-size: medium"
          class="style33">
          人脸识别功能(主副头比对):</td>

        <td>
          <input id="ButtonStartID"
            type="button"
            value="初始化人脸识别"
            @click="FaceCheckInitCamera();" />

          <input id="ButtonStartID"
            type="button"
            value="启动主副头比对"
            @click="StartFaceCameraCheck();" />

          <input id="ButtonStartID"
            type="button"
            value="关闭主副头比对"
            @click="CloseFaceCameraCheck();" />

          <input id="ButtonStartID"
            type="button"
            value="关闭人脸识别"
            @click="FaceCheckUninitCamera();" />

        </td>

      </table>

      <table style="width: 100%;">
        <td style="font-size: medium"
          class="style33">
          银行卡功能:</td>

        <td>
          <input id="ButtonStartID"
            type="button"
            value="初始化银行卡功能"
            @click="InitBankCard();" />

          <input id="ButtonStartID"
            type="button"
            value="获取银行卡号码"
            @click="GetBankCardNo();" />

          <input id="ButtonStartID"
            type="button"
            value="关闭银行卡功能"
            @click="UninitBankCard();" />

        </td>

        <td style="font-size: medium"
          class="style33">
          指纹功能:</td>

        <td>
          <input id="ButtonStartID"
            type="button"
            value="初始化指纹功能"
            @click="InitFingerFun();" />

          <input id="ButtonStartID"
            type="button"
            value="启动指纹录入"
            @click="funRegisterFinger();" />

          <input id="ButtonStartID"
            type="button"
            value="停止指纹录入"
            @click="StopRegisterFinger();" />

          <input id="ButtonStartID"
            type="button"
            value="获取指纹长度"
            @click="GetFingerDataLen();" />

          <input id="ButtonStartID"
            type="button"
            value="获取指纹base64"
            @click="GetFingerBase64();" />
          <input id="ButtonStartID"
            type="button"
            value="获取指纹图片base64"
            @click="GetFingerImgBase64();" />

          <input id="ButtonStartID"
            type="button"
            value="启动指纹对比"
            @click="funVerifyFinger();" />

          <input id="ButtonStartID"
            type="button"
            value="停止指纹对比"
            @click="StopVerifyFinger();" />

          <input id="ButtonStartID"
            type="button"
            value="关闭指纹功能"
            @click="CloseFingerFun();" />
        </td>

      </table>

      <table style="width: 100%;">
        <td style="font-size: medium"
          class="style33">
          人脸捕捉功能:</td>

        <td>
          <input id="ButtonStartID"
            type="button"
            value="初始化"
            @click="InitFaceCheck();" />

          <input id="ButtonStartID"
            type="button"
            value="拍照人脸"
            @click="CaptureFace();" />

          <input id="ButtonStartID"
            type="button"
            value="停止"
            @click="DeInitFaceCheck();" />
        </td>

        <td style="font-size: medium"
          class="style33">
          人脸捕捉功能(副头):</td>

        <td>
          <input id="ButtonStartID"
            type="button"
            value="初始化"
            @click="InitFaceCheckSecond();" />

          <input id="ButtonStartID"
            type="button"
            value="拍照人脸"
            @click="CaptureFaceSecond();" />

          <input id="ButtonStartID"
            type="button"
            value="停止"
            @click="DeInitFaceCheckSecond();" />
        </td>

      </table>

    </div>
    <div id="image_container"
      style="clear:both;">
      <div class="flex">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      hide_show: 0,
      type: 0,
      isIE: true, // 是否IE
      isSecondDev: true, // 是否有两个canvas显示视频
      camidMain: 0, // 主头ID
      camidSub: 0, // 副头ID
      fingerLen: 0,
      fingerBase64: '',
      ws: '',
      canvas: '',
      context: '',
      canvasSecond: '',
      contextSecond: '',
      canvasX: '',
      canvasY: '',
      canvasLastX: '',
      canvasLastY: '',
      isDragging: false,
      canvasX_manual: 0,
      canvasY_manual: 0,
      recX_manual: 0,
      recY_manual: 0,
      recW_manual: 0,
      recH_manual: 0,
      rec_ww: 0,
      rec_hh: 0,
      CutType: 0,
      imgOrignalW: 0,
      imgOrignalH: 0,
      rorateAngleType: 0,
      cutXCaibian: 0,
      cutYCaibian: 0,
      isDrawMove: false,
      canvasLastX2: '',
      canvasLastY2: '',
      isDragging2: false,
      canvasX_manual2: 0,
      canvasY_manual2: 0,
      recX_manual2: 0,
      recY_manual2: 0,
      recW_manual2: 0,
      recH_manual2: 0,
      rec_ww2: 0,
      rec_hh2: 0,
      imgOrignalW2: 0,
      imgOrignalH2: 0,
      isDrawMove2: false,
      cutXCaibian2: 0,
      cutYCaibian2: 0,
      faceZuobiao: [],
      faceZuobiaoSecond: [],
      faceNum: 0,
      faceNumSecond: 0,
      isFaceOpen: false,
      isFaceOpenSecond: false,
      SupportFormat: '', // 设备支持的视频格式代号：1->MJPG; 2->YUY2
      OpenFormat: '', // 打开格式：0->YUY；1->MJPG
      SupportFormat2: '', // 设备支持的视频格式代号：1->MJPG; 2->YUY2
      OpenFormat2: '', // 打开格式：0->YUY；1->MJPG
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
  methods: {
    WsInit (orignalCanvasW, orignalCanvasH, orignalCanvasW2, orignalCanvasH2, enableCanvas) {
      this.WsInit_ip(orignalCanvasW, orignalCanvasH, orignalCanvasW2, orignalCanvasH2, enableCanvas, 'localhost')
    },

    WsInit_ip (orignalCanvasW, orignalCanvasH, orignalCanvasW2, orignalCanvasH2, enableCanvas, ip) {
      if (enableCanvas) {
        this.canvas = document.getElementById('cameraCanvas')
        this.context = this.canvas.getContext('2d')
        if (this.isSecondDev) {
          this.canvasSecond = document.getElementById('cameraCanvasSecond')
          this.contextSecond = this.canvasSecond.getContext('2d')
          this.canvasSecond.onmousedown = this.canvasClick2
          this.canvasSecond.onmouseup = this.stopDragging2
          this.canvasSecond.onmouseout = this.stopDragging2
          this.canvasSecond.onmousemove = this.canvasMove2
        }
        this.canvas.onmousedown = this.canvasClick
        this.canvas.onmouseup = this.stopDragging
        this.canvas.onmouseout = this.stopDragging
        this.canvas.onmousemove = this.canvasMove
        this.canvasX = 0
        this.canvasY = 0
        this.canvasLastX = 0
        this.canvasLastY = 0
      }

      // this.ws = new WebSocket('ws://localhost:9002')
      this.ws = new WebSocket('ws://' + ip + ':9002')
      console.log(this.ws)
      this.ws.binaryType = 'arraybuffer'
      this.ws.onmessage = (event) => {
        var aDataArray = new Uint8Array(event.data)
        if (aDataArray.length > 0) {
          if (aDataArray[0] === 0xef && aDataArray[1] === 0x01) {
            // getDeviceName(aDataArray[3]);
            // getResolution(aDataArray,5);
            this.getUsbCamareMessage(aDataArray, 5)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x17) {
            var camNum = aDataArray[3]
            // GetDevCount(camNum);
            this.InfoTextCallback(26, camNum)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x19) {
            this.getResolution(aDataArray, 5)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x23) {
            // getResolution(aDataArray,4);
            var type = aDataArray[3]
            var len = aDataArray[4]
            var data = new Uint8Array(len)
            for (var i = 0; i < len; i++) {
              data[i] = aDataArray[5 + i]
            }
            var str = this.byteToString(data)
            var text = decodeURIComponent(str)
            this.InfoTextCallback(type, text)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x05) {
            var ww = aDataArray[3] * 256 + aDataArray[4]
            var hh = aDataArray[5] * 256 + aDataArray[6]
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
            // sendMsgRefreshCam();
            var imgData = this.context.createImageData(ww, hh)
            var dataNum = 0
            for (let i = 0; i < imgData.data.length; i += 4) {
              imgData.data[i + 0] = aDataArray[dataNum]
              imgData.data[i + 1] = aDataArray[dataNum + 1]
              imgData.data[i + 2] = aDataArray[dataNum + 2]
              imgData.data[i + 3] = 255
              dataNum = dataNum + 3
            }
            this.sendMsgRefreshCam()

            if (this.CutType === 2) {
              this.rec_ww = ww
              this.rec_hh = hh
              this.context.putImageData(imgData, this.canvas.width / 2 - ww / 2, this.canvas.height / 2 - hh / 2)
              this.refreshRect()
            } else this.context.putImageData(imgData, this.canvas.width / 2 - ww / 2 + this.canvasX, this.canvas.height / 2 - hh / 2 + this.canvasY)

            this.context.beginPath()
            this.context.strokeStyle = 'rgb(0,255,0)'
            this.context.lineWidth = 2
            this.GetFaceZuobiao(this.canvas.width / 2 - ww / 2 + this.canvasX, this.canvas.height / 2 - hh / 2 + this.canvasY)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x0c) {
            let ww = aDataArray[3] * 256 + aDataArray[4]
            let hh = aDataArray[5] * 256 + aDataArray[6]
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
            // sendMsgRefreshCam();
            let imgData = this.context.createImageData(ww, hh)
            let dataNum = 0
            for (let i = 0; i < imgData.data.length; i += 4) {
              imgData.data[i + 0] = aDataArray[dataNum]
              imgData.data[i + 1] = aDataArray[dataNum + 1]
              imgData.data[i + 2] = aDataArray[dataNum + 2]
              imgData.data[i + 3] = 255
              dataNum = dataNum + 3
            }
            this.sendMsgRefreshCam()
            var Xdis = this.canvas.width / 2 - ww / 2 + this.canvasX
            var Ydis = this.canvas.height / 2 - hh / 2 + this.canvasY
            this.context.putImageData(imgData, Xdis, Ydis)

            var lenJiubian = aDataArray[7]

            this.context.beginPath()
            this.context.strokeStyle = 'rgb(0,255,0)'
            this.context.lineWidth = 2

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
                this.context.moveTo(aDataArray[9 + i * 6 + j * 24] * 256 * aa + aDataArray[10 + i * 6 + j * 24] * aa + Xdis, aDataArray[12 + i * 6 + j * 24] * 256 * bb + aDataArray[13 + i * 6 + j * 24] * bb + Ydis)
                this.context.lineTo(aDataArray[15 + i * 6 + j * 24] * 256 * cc + aDataArray[16 + i * 6 + j * 24] * cc + Xdis, aDataArray[18 + i * 6 + j * 24] * 256 * dd + aDataArray[19 + i * 6 + j * 24] * dd + Ydis)
                this.context.stroke()
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
              this.context.moveTo(aDataArray[27 + j * 24] * 256 + aDataArray[28 + j * 24] + Xdis, aDataArray[30 + j * 24] * 256 + aDataArray[31 + j * 24] + Ydis)
              this.context.lineTo(aDataArray[9 + j * 24] * 256 + aDataArray[10 + j * 24] + Xdis, aDataArray[12 + j * 24] * 256 + aDataArray[13 + j * 24] + Ydis)
              this.context.stroke()
            }
            this.GetFaceZuobiao(this.canvas.width / 2 - ww / 2 + this.canvasX, this.canvas.height / 2 - hh / 2 + this.canvasY)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x14) {
            var tmp = aDataArray[3]
            if (tmp === 0x46) {
              this.isFaceOpen = true
            } else if (tmp === 0x48) {
              this.isFaceOpenSecond = true
            } else if (tmp === 0x5e) {
              this.isFaceOpen = true
              this.isFaceOpenSecond = true
            } else if (tmp === 0x5f) {
              this.isFaceOpen = true
            } else if (tmp === 0x61) {
              this.isFaceOpenSecond = true
            }

            this.InfoCallback(tmp)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x26) {
            if (this.isSecondDev) {
              let ww = aDataArray[3] * 256 + aDataArray[4]
              let hh = aDataArray[5] * 256 + aDataArray[6]
              this.contextSecond.clearRect(0, 0, this.canvasSecond.width, this.canvasSecond.height)

              let imgData = this.contextSecond.createImageData(ww, hh)
              let dataNum = 0
              for (let i = 0; i < imgData.data.length; i += 4) {
                imgData.data[i + 0] = aDataArray[dataNum]
                imgData.data[i + 1] = aDataArray[dataNum + 1]
                imgData.data[i + 2] = aDataArray[dataNum + 2]
                imgData.data[i + 3] = 255
                dataNum = dataNum + 3
              }
              this.sendMsgRefreshCamSecond()

              this.contextSecond.putImageData(imgData, this.canvasSecond.width / 2 - ww / 2, this.canvasSecond.height / 2 - hh / 2)
              if (this.CutType === 2) {
                this.rec_ww2 = ww
                this.rec_hh2 = hh
                this.refreshRect2()
              }

              this.GetFaceZuobiaoSecond(this.canvasSecond.width / 2 - ww / 2, this.canvasSecond.height / 2 - hh / 2)
            }
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
            this.InfoTextCallback(23, text)
            // GetBrightnessRange_ws(min,max);
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
            this.InfoTextCallback(22, text)
            // GetExposureRange_ws(min,max);
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x36) {
            let len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5]
            var baseDataArray = new Uint8Array(len)
            for (let i = 0; i < len; i++) {
              baseDataArray[i] = aDataArray[6 + i]
            }
            let str = this.byteToString(baseDataArray)
            let text = this.decodeURIComponent(str)

            var last = text.substr(str.length - 2, 1)
            var lastSecond = text.substr(str.length - 3, 1)
            if (last === '=' && lastSecond !== '=') {
              text = text.substring(0, text.length - 1)
              text = text + '='
            }

            this.InfoTextCallback(5, text)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x3b) {
            this.camidMain = aDataArray[3]
            // if(isSecondDev){
            this.camidSub = aDataArray[4]
            // }
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x3e) {
            let len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5]
            let baseDataArray = new Uint8Array(len)
            for (let i = 0; i < len; i++) {
              baseDataArray[i] = aDataArray[6 + i]
            }
            let str = this.byteToString(baseDataArray)
            let text = decodeURIComponent(str)

            this.InfoTextCallback(19, text)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x43) {
            let len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5]
            let baseDataArray = new Uint8Array(len)
            for (let i = 0; i < len; i++) {
              baseDataArray[i] = aDataArray[6 + i]
            }
            let str = this.byteToString(baseDataArray)
            let text = decodeURIComponent(str)

            let last = text.substr(str.length - 2, 1)
            let lastSecond = text.substr(str.length - 3, 1)
            if (last === '=' && lastSecond !== '=') {
              text = text.substring(0, text.length - 1)
              text = text + '='
            }

            this.InfoTextCallback(21, text)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x4a) {
            this.rorateAngleType = aDataArray[3]
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x4c) {
            let len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5]
            let baseDataArray = new Uint8Array(len)
            for (let i = 0; i < len; i++) {
              baseDataArray[i] = aDataArray[6 + i]
            }
            let str = this.byteToString(baseDataArray)
            let text = decodeURIComponent(str)

            let last = text.substr(str.length - 2, 1)
            let lastSecond = text.substr(str.length - 3, 1)
            if (last === '=' && lastSecond !== '=') {
              text = text.substring(0, text.length - 1)
              text = text + '='
            }

            this.InfoTextCallback(25, text)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x5f) {
            let len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5]
            let baseDataArray = new Uint8Array(len)
            for (let i = 0; i < len; i++) {
              baseDataArray[i] = aDataArray[6 + i]
            }
            let str = this.byteToString(baseDataArray)
            let text = decodeURIComponent(str)

            let last = text.substr(str.length - 2, 1)
            let lastSecond = text.substr(str.length - 3, 1)
            if (last === '=' && lastSecond !== '=') {
              text = text.substring(0, text.length - 1)
              text = text + '='
            }

            this.InfoTextCallback(28, text)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x60) {
            this.faceNum = aDataArray[3]
            for (let j = 0; j < this.faceNum * 4; j++) {
              let aa = 1
              if (aDataArray[4 + j * 6] === 1) {
                aa = -1
              }

              this.faceZuobiao[j * 2] = aDataArray[5 + j * 6] * 256 * aa + aDataArray[6 + j * 6] * aa

              let bb = 1
              if (aDataArray[7 + j * 6] === 1) {
                bb = -1
              }
              this.faceZuobiao[j * 2 + 1] = aDataArray[8 + j * 6] * 256 * bb + aDataArray[9 + j * 6] * bb
            }
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x62) {
            this.faceNumSecond = aDataArray[3]
            for (let j = 0; j < this.faceNumSecond * 4; j++) {
              let aa = 1
              if (aDataArray[4 + j * 6] === 1) {
                aa = -1
              }

              this.faceZuobiaoSecond[j * 2] = aDataArray[5 + j * 6] * 256 * aa + aDataArray[6 + j * 6] * aa

              let bb = 1
              if (aDataArray[7 + j * 6] === 1) {
                bb = -1
              }
              this.faceZuobiaoSecond[j * 2 + 1] = aDataArray[8 + j * 6] * 256 * bb + aDataArray[9 + j * 6] * bb
            }
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x67) {
            let tmp = aDataArray[3]
            if (tmp === 0x00) {
              this.faceNum = 0
            } else if (tmp === 0x01) {
              this.faceNumSecond = 0
            }
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x71) {
            // getResolution(aDataArray,4);
            let type = aDataArray[3]
            let len = aDataArray[4] * 256 + aDataArray[5]
            let data = new Uint8Array(len)
            for (let i = 0; i < len; i++) {
              data[i] = aDataArray[6 + i]
            }
            let str = this.byteToString(data)
            let text = decodeURIComponent(str)
            this.InfoTextCallback(type, text)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x73) {
            let len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5]
            let baseDataArray = new Uint8Array(len)
            for (let i = 0; i < len; i++) {
              baseDataArray[i] = aDataArray[6 + i]
            }
            let str = this.byteToString(baseDataArray)
            let text = decodeURIComponent(str)

            let last = text.substr(str.length - 2, 1)
            let lastSecond = text.substr(str.length - 3, 1)
            if (last === '=' && lastSecond !== '=') {
              text = text.substring(0, text.length - 1)
              text = text + '='
            }

            this.InfoTextCallback(30, text)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x7e) {
            let len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5]
            let baseDataArray = new Uint8Array(len)
            for (let i = 0; i < len; i++) {
              baseDataArray[i] = aDataArray[6 + i]
            }
            let str = this.byteToString(baseDataArray)
            let text = decodeURIComponent(str)

            let last = text.substr(str.length - 2, 1)
            let lastSecond = text.substr(str.length - 3, 1)
            if (last === '=' && lastSecond !== '=') {
              text = text.substring(0, text.length - 1)
              text = text + '='
            }

            this.InfoTextCallback(33, text)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x84) {
            let len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5]
            let baseDataArray = new Uint8Array(len)
            for (let i = 0; i < len; i++) {
              baseDataArray[i] = aDataArray[6 + i]
            }
            let str = this.byteToString(baseDataArray)
            let text = decodeURIComponent(str)

            let last = text.substr(str.length - 2, 1)
            let lastSecond = text.substr(str.length - 3, 1)
            if (last === '=' && lastSecond !== '=') {
              text = text.substring(0, text.length - 1)
              text = text + '='
            }

            this.InfoTextCallback(36, text)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x80) {
            // getResolution(aDataArray,4);
            let len = aDataArray[3] * 256 + aDataArray[4]
            this.InfoTextCallback(34, len)
          } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x92) {
            let len = aDataArray[3] * 256 + aDataArray[4]
            this.InfoTextCallback(37, len)
          }
        }
      }
      // ´ò¿ªWebSocket
      this.ws.onclose = (event) => {
        // WebSocket Status:: Socket Closed
        this.InfoCallback(0xa3)
        // alert("程序出现异常,请重新启动0x00");
      }
      // ´ò¿ªWebSocket
      this.ws.onopen = (event) => {
        if (enableCanvas) {
          this.sendMsgGetMainCameraID()
          this.sendMsgRefreshDev()
          this.initParameter(orignalCanvasW, orignalCanvasH, orignalCanvasW2, orignalCanvasH2)
        }

        this.InfoCallback(0x24)
      }
      this.ws.onerror = (event) => {
        // WebSocket Status:: Error was reported
        this.InfoCallback(0xa4)
        // alert("程序出现异常,请重新启动0x01");
      }
    },

    initParameter (orignalCanvasW, orignalCanvasH, orignalCanvasW2, orignalCanvasH2) {
      this.sendMsgBestSize()
      this.sendMsgSetCutType(0)
      this.sendMsgSetFileType(0)
      this.sendMsgSetImageColorMode(0)
      this.sendMsgSetConntinousShotModel(0)
      this.sendMsgChangeOrientation(0)
      this.sendMsgSetCanvasOriginalSize(orignalCanvasW, orignalCanvasH)
      this.sendMsgSetCanvasSecondOriginalSize(orignalCanvasW2, orignalCanvasH2)
    },
    canvasClick (e) {
      this.isDragging = true
      if (!this.isDrawMove) {
        this.canvasLastX = 0

        this.canvasLastY = 0
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
      this.canvasLastX = 0
      this.canvasLastY = 0
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
      var mx = e.pageX - this.canvas.offsetLeft
      var my = e.pageY - this.canvas.offsetTop
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
            if (this.canvasLastX === 0 && this.canvasLastY === 0) {
              this.canvasLastX = mx
              this.canvasLastY = my
            } else {
              this.recX_manual = this.recX_manual + (mx - this.canvasLastX)
              this.recY_manual = this.recY_manual + (my - this.canvasLastY)
              this.canvasLastX = mx
              this.canvasLastY = my
            }
          }
          return
        } else if (x1 - 30 <= mx && mx <= x2 + 30 && y1 - 30 <= my && my <= y2 + 30) {
          this.isDrawMove = true
          if (this.isDragging) {
            if (this.canvasLastX === 0 && this.canvasLastY === 0) {
              this.canvasLastX = mx
              this.canvasLastY = my
            } else {
              var tmpX2 = this.recX_manual + this.recW_manual
              if (Math.abs(this.recX_manual - mx) < Math.abs(tmpX2 - mx)) {
                this.recX_manual = this.recX_manual + (mx - this.canvasLastX)
                this.recW_manual = this.recW_manual - (mx - this.canvasLastX)
              } else this.recW_manual = this.recW_manual + (mx - this.canvasLastX)

              var tmpY2 = this.recY_manual + this.recH_manual
              if (Math.abs(this.recY_manual - my) < Math.abs(tmpY2 - my)) {
                this.recY_manual = this.recY_manual + (my - this.canvasLastY)
                this.recH_manual = this.recH_manual - (my - this.canvasLastY)
              } else this.recH_manual = this.recH_manual + (my - this.canvasLastY)
              this.canvasLastX = mx
              this.canvasLastY = my
            }
            return
          }
        } else this.isDrawMove = false
      }

      if (this.isDragging === true) {
        if (this.CutType !== 2) {
          if (this.canvasLastX === 0 && this.canvasLastY === 0) {
            this.canvasLastX = e.pageX - this.canvas.offsetLeft
            this.canvasLastY = e.pageY - this.canvas.offsetTop
          } else {
            this.canvasX = this.canvasX + (mx - this.canvasLastX)
            this.canvasY = this.canvasY + (my - this.canvasLastY)
            this.canvasLastX = mx
            this.canvasLastY = my
          }
        } else {
          if (this.canvasLastX === 0 && this.canvasLastY === 0) {
            this.canvasLastX = mx
            this.canvasLastY = my
            this.recX_manual = mx
            this.recY_manual = my
          } else {
            this.canvasX_manual = this.canvasX_manual + (mx - this.canvasLastX)
            this.canvasY_manual = this.canvasY_manual + (my - this.canvasLastY)
            this.canvasLastX = mx
            this.canvasLastY = my
            this.recW_manual = this.canvasX_manual
            this.recH_manual = this.canvasY_manual
          }
        }
      }
    },

    canvasClick2 (e) {
      this.isDragging2 = true
      if (!this.isDrawMove2) {
        this.canvasLastX2 = 0

        this.canvasLastY2 = 0
        this.canvasX_manual2 = 0
        this.canvasY_manual2 = 0

        this.recX_manual2 = 0
        this.recY_manual2 = 0
        this.recW_manual2 = 0
        this.recH_manual2 = 0
      }
    },

    stopDragging2 () {
      this.isDragging2 = false
      this.canvasLastX2 = 0
      this.canvasLastY2 = 0
      this.canvasX_manual2 = 0
      this.canvasY_manual2 = 0
      if (this.CutType === 2) {
        var bpp2 = this.rec_ww2 / this.imgOrignalW2
        this.cutXCaibian2 = Math.abs(this.recW_manual2) / bpp2
        this.cutYCaibian2 = Math.abs(this.recH_manual2) / bpp2
      }
    },

    canvasMove2 (e) {
      var mx = e.pageX - this.canvasSecond.offsetLeft
      var my = e.pageY - this.canvasSecond.offsetTop
      if (this.CutType === 2) {
        var x1 = this.recX_manual2
        var x2 = this.recX_manual2 + this.recW_manual2
        if (x1 > x2) {
          x1 = x2
          x2 = this.recX_manual2
        }

        var y1 = this.recY_manual2
        var y2 = this.recY_manual2 + this.recH_manual2
        if (y1 > y2) {
          y1 = y2
          y2 = this.recY_manual2
        }

        if (x1 <= mx && mx <= x2 && y1 <= my && my <= y2) {
          this.isDrawMove2 = true
          if (this.isDragging2) {
            if (this.canvasLastX2 === 0 && this.canvasLastY2 === 0) {
              this.canvasLastX2 = mx
              this.canvasLastY2 = my
            } else {
              this.recX_manual2 = this.recX_manual2 + (mx - this.canvasLastX2)
              this.recY_manual2 = this.recY_manual2 + (my - this.canvasLastY2)
              this.canvasLastX2 = mx
              this.canvasLastY2 = my
            }
          }
          return
        } else if (x1 - 30 <= mx && mx <= x2 + 30 && y1 - 30 <= my && my <= y2 + 30) {
          this.isDrawMove2 = true
          if (this.isDragging2) {
            if (this.canvasLastX2 === 0 && this.canvasLastY2 === 0) {
              this.canvasLastX2 = mx
              this.canvasLastY2 = my
            } else {
              var tmpX2 = this.recX_manual2 + this.recW_manual2
              if (Math.abs(this.recX_manual2 - mx) < Math.abs(tmpX2 - mx)) {
                this.recX_manual2 = this.recX_manual2 + (mx - this.canvasLastX2)
                this.recW_manual2 = this.recW_manual2 - (mx - this.canvasLastX2)
              } else this.recW_manual2 = this.recW_manual2 + (mx - this.canvasLastX2)

              var tmpY2 = this.recY_manual2 + this.recH_manual2
              if (Math.abs(this.recY_manual2 - my) < Math.abs(tmpY2 - my)) {
                this.recY_manual2 = this.recY_manual2 + (my - this.canvasLastY2)
                this.recH_manual2 = this.recH_manual2 - (my - this.canvasLastY2)
              } else this.recH_manual2 = this.recH_manual2 + (my - this.canvasLastY2)

              this.canvasLastX2 = mx
              this.canvasLastY2 = my
            }

            return
          }
        } else this.isDrawMove2 = false
      }

      if (this.isDragging2 === true) {
        if (this.CutType !== 2) {

        } else {
          if (this.canvasLastX2 === 0 && this.canvasLastY2 === 0) {
            this.canvasLastX2 = mx
            this.canvasLastY2 = my
            this.recX_manual2 = mx
            this.recY_manual2 = my
          } else {
            this.canvasX_manual2 = this.canvasX_manual2 + (mx - this.canvasLastX2)
            this.canvasY_manual2 = this.canvasY_manual2 + (my - this.canvasLastY2)
            this.canvasLastX2 = mx
            this.canvasLastY2 = my
            this.recW_manual2 = this.canvasX_manual2
            this.recH_manual2 = this.canvasY_manual2
          }
        }
      }
    },

    getResolution (arrayData, tmpNum) {
      var type = arrayData[3]
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
      if (type === 0) {
        this.GetDeviceResolution(data)
      } else {
        if (this.isSecondDev) {
          this.GetDeviceResolutionSecond(data)
          this.LoadOver2()
        }
      }
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
        // var arr =       Utf8ToUnicode(tmpData)
        var str = this.byteToString(tmpData)
        var text = decodeURIComponent(str)
        strUsbNamr[i] = text
      }
      this.GetDevName(numCam, strUsbNamr)
    },

    sendMsgRefreshCam () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x04
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgStartVideo2 (camId, width, height) {
      this.imgOrignalW2 = width
      this.imgOrignalH2 = height
      var aDataArray = new Uint8Array(8)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x25
      aDataArray[2] = 0x05
      aDataArray[3] = camId
      aDataArray[4] = width / 256
      aDataArray[5] = width % 256
      aDataArray[6] = height / 256
      aDataArray[7] = height % 256
      this.ws.send(aDataArray.buffer)
    },

    sendMsgStartVideo2YUV (camId, width, height) {
      this.imgOrignalW2 = width
      this.imgOrignalH2 = height
      var aDataArray = new Uint8Array(8)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x8b
      aDataArray[2] = 0x05
      aDataArray[3] = camId
      aDataArray[4] = width / 256
      aDataArray[5] = width % 256
      aDataArray[6] = height / 256
      aDataArray[7] = height % 256
      this.ws.send(aDataArray.buffer)
    },

    sendMsgRefreshCamSecond () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x27
      aDataArray[2] = 0x00
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
    sendMsgSetCanvasSecondOriginalSize (ww, hh) {
      var aDataArray = new Uint8Array(7)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x37
      aDataArray[2] = 0x04
      aDataArray[3] = ww / 256
      aDataArray[4] = ww % 256
      aDataArray[5] = hh / 256
      aDataArray[6] = hh % 256
      this.ws.send(aDataArray.buffer)
    },
    sendMsgRefreshDev () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x00
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
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

    sendMsgStartVideoYUV (camId, width, height) {
      if (width === 3672) {
        this.imgOrignalW = 3264
        this.imgOrignalH = 2448
      } else {
        this.imgOrignalW = width
        this.imgOrignalH = height
      }
      var aDataArray = new Uint8Array(8)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x8a
      aDataArray[2] = 0x05
      aDataArray[3] = camId
      aDataArray[4] = width / 256
      aDataArray[5] = width % 256
      aDataArray[6] = height / 256
      aDataArray[7] = height % 256
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
    sendMsgSetImageColorMode (type) {
      var aDataArray2 = new Uint8Array(4)
      aDataArray2[0] = 0xef
      aDataArray2[1] = 0x07
      aDataArray2[2] = 0x01
      aDataArray2[3] = type
      this.ws.send(aDataArray2.buffer)
    },

    sendMsgCloseVideo () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x08
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },

    sendMsgCloseVideoSecond () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x28
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
      this.contextSecond.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    sendMsgChangeResolution (camId, width, height) {
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

    sendMsgSetFilePath (pathUnicode) {
      var path = encodeURI(pathUnicode)
      var pathdata = this.stringToByte(path)
      var len = path.length
      var aDataArray = new Uint8Array(3 + len)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x1c
      aDataArray[2] = len
      for (var i = 0; i < len; i++) {
        aDataArray[3 + i] = pathdata[i]
      }
      this.ws.send(aDataArray.buffer)
    },

    sendMsgSetFileNameModelCustom (index, pathUnicode) {
      var path = encodeURI(pathUnicode)
      var pathdata = this.stringToByte(path)
      var len = path.length
      var aDataArray = new Uint8Array(6 + len)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x1d
      aDataArray[2] = len + 3
      aDataArray[3] = index / 256
      aDataArray[4] = index % 256
      aDataArray[5] = len
      for (var i = 0; i < len; i++) {
        aDataArray[6 + i] = pathdata[i]
      }
      this.ws.send(aDataArray.buffer)
    },

    sendMsgSetFileNameModelCustomSecond (index, pathUnicode) {
      var path = encodeURI(pathUnicode)
      var pathdata = this.stringToByte(path)
      var len = path.length
      var aDataArray = new Uint8Array(6 + len)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x46
      aDataArray[2] = len + 3
      aDataArray[3] = index / 256
      aDataArray[4] = index % 256
      aDataArray[5] = len
      for (var i = 0; i < len; i++) {
        aDataArray[6 + i] = pathdata[i]
      }
      this.ws.send(aDataArray.buffer)
    },

    sendMsgSetFileNameModelFixed (pathUnicode) {
      var path = encodeURI(pathUnicode)
      var pathdata = this.stringToByte(path)
      var len = path.length
      var aDataArray = new Uint8Array(3 + len)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x1f
      aDataArray[2] = len
      for (var i = 0; i < len; i++) {
        aDataArray[3 + i] = pathdata[i]
      }
      this.ws.send(aDataArray.buffer)
    },

    sendMsgSetFileNameModelFixedSecond (pathUnicode) {
      var path = encodeURI(pathUnicode)
      var pathdata = this.stringToByte(path)
      var len = path.length
      var aDataArray = new Uint8Array(3 + len)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x48
      aDataArray[2] = len
      for (var i = 0; i < len; i++) {
        aDataArray[3 + i] = pathdata[i]
      }
      this.ws.send(aDataArray.buffer)
    },

    sendMsgSetFileNameModelTime () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x1e
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgSetFileNameModelTimeSecond () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x47
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },
    sendMsgSetFileNameModelBarcode () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x2b
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgSetFileType (type) {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x20
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

    sendMsgSetConntinousShotModelTime (len) {
      var aDataArray = new Uint8Array(5)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x22
      aDataArray[2] = 0x02
      aDataArray[3] = len / 256
      aDataArray[4] = len % 256
      this.ws.send(aDataArray.buffer)
    },

    sendMsgUploadFile (uploadSerHead, uploadSerLast, uploadSerFile) {
      var path = encodeURI(uploadSerHead)
      var pathdata = this.stringToByte(path)
      var len = path.length

      var path2 = encodeURI(uploadSerLast)
      var pathdata2 = this.tringToByte(path2)
      var len2 = path2.length

      var path3 = encodeURI(uploadSerFile)
      var pathdata3 = this.stringToByte(path3)
      var len3 = path3.length

      var aDataArray = new Uint8Array(8 + len + len2 + len3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x24
      aDataArray[2] = 5 + len + len2 + len3
      aDataArray[3] = 0x00
      aDataArray[4] = 80 % 256
      aDataArray[5] = len
      for (var i = 0; i < len; i++) {
        aDataArray[6 + i] = pathdata[i]
      }
      aDataArray[6 + len] = len2
      for (let i = 0; i < len2; i++) {
        aDataArray[7 + len + i] = pathdata2[i]
      }
      aDataArray[7 + len + len2] = len3
      for (let i = 0; i < len3; i++) {
        aDataArray[8 + len + len2 + i] = pathdata3[i]
      }
      this.ws.send(aDataArray.buffer)
    },

    sendMsgUploadFilePort (port, uploadSerHead, uploadSerLast, uploadSerFile) {
      var path = encodeURI(uploadSerHead)
      var pathdata = this.stringToByte(path)
      var len = path.length

      var path2 = encodeURI(uploadSerLast)
      var pathdata2 = this.stringToByte(path2)
      var len2 = path2.length

      var path3 = encodeURI(uploadSerFile)
      var pathdata3 = this.stringToByte(path3)
      var len3 = path3.length

      var aDataArray = new Uint8Array(8 + len + len2 + len3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x24
      aDataArray[2] = 5 + len + len2 + len3
      aDataArray[3] = port / 256
      aDataArray[4] = port % 256
      aDataArray[5] = len
      for (var i = 0; i < len; i++) {
        aDataArray[6 + i] = pathdata[i]
      }
      aDataArray[6 + len] = len2
      for (let i = 0; i < len2; i++) {
        aDataArray[7 + len + i] = pathdata2[i]
      }
      aDataArray[7 + len + len2] = len3
      for (let i = 0; i < len3; i++) {
        aDataArray[8 + len + len2 + i] = pathdata3[i]
      }
      this.ws.send(aDataArray.buffer)
    },

    sendMsgCapture (type) {
      if (type !== 2) {
        var aDataArray = new Uint8Array(4)
        aDataArray[0] = 0xef
        aDataArray[1] = 0x0a
        aDataArray[2] = 0x01
        aDataArray[3] = 0x00
        this.ws.send(aDataArray.buffer)
      } else {
        var x1 = this.recX_manual
        if (this.recX_manual > this.recX_manual + this.recW_manual) {
          x1 = this.recX_manual + this.recW_manual
        }
        var y1 = this.recY_manual
        if (this.recY_manual > this.recY_manual + this.recH_manual) {
          y1 = this.recY_manual + this.recH_manual
        }

        //   var bpp = rec_ww/imgOrignalW;

        // if(rorateAngleType===1 || rorateAngleType===3){
        //   bpp = rec_hh/imgOrignalH;
        // }

        // var w1 = Math.abs(recW_manual/bpp);
        //  var h1 = Math.abs(recH_manual/bpp);
        var xsend = x1 - (this.canvas.width / 2 - this.rec_ww / 2)
        var ysend = y1 - (this.canvas.height / 2 - this.rec_hh / 2)

        if (xsend < 0) xsend = 0
        if (ysend < 0) ysend = 0
        let aDataArray = new Uint8Array(11)
        aDataArray[0] = 0xef
        // aDataArray[1] = 0x0f;
        aDataArray[1] = 0x4b
        aDataArray[2] = 0x08
        aDataArray[3] = xsend / 256
        aDataArray[4] = xsend % 256
        aDataArray[5] = ysend / 256
        aDataArray[6] = ysend % 256
        aDataArray[7] = this.cutXCaibian / 256
        aDataArray[8] = this.cutXCaibian % 256
        aDataArray[9] = this.cutYCaibian / 256
        aDataArray[10] = this.cutYCaibian % 256
        // aDataArray[7] = recW_manual/256;
        // aDataArray[8] = recW_manual%256;
        // aDataArray[9] = recH_manual/256;
        // aDataArray[10] = recH_manual%256;
        this.ws.send(aDataArray.buffer)
      }
    },

    sendMsgCaptureSecond () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x29
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgCaptureSecondCaibian () {
      var x1 = this.recX_manual2
      if (this.recX_manual2 > this.recX_manual2 + this.recW_manual2) {
        x1 = this.recX_manual2 + this.recW_manual2
      }
      var y1 = this.recY_manual2
      if (this.recY_manual2 > this.recY_manual2 + this.recH_manual2) {
        y1 = this.recY_manual2 + this.recH_manual2
      }

      var xsend = x1 - (this.canvasSecond.width / 2 - this.rec_ww2 / 2)
      var ysend = y1 - (this.canvasSecond.height / 2 - this.rec_hh2 / 2)

      if (xsend < 0) xsend = 0
      if (ysend < 0) ysend = 0
      var aDataArray = new Uint8Array(11)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x4c
      aDataArray[2] = 0x08
      aDataArray[3] = xsend / 256
      aDataArray[4] = xsend % 256
      aDataArray[5] = ysend / 256
      aDataArray[6] = ysend % 256
      aDataArray[7] = this.cutXCaibian2 / 256
      aDataArray[8] = this.cutXCaibian2 % 256
      aDataArray[9] = this.cutYCaibian2 / 256
      aDataArray[10] = this.cutYCaibian2 % 256

      this.ws.send(aDataArray.buffer)
    },

    sendMsgShowImageSettingWindow () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x0b
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgShowImageSettingWindowB () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x45
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgZoom (type) {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x0d
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

    sendMsgSetJiubianModel (type) {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x10
      aDataArray[2] = 0x01
      aDataArray[3] = type
      this.ws.send(aDataArray.buffer)
    },

    sendMsgGetCamNum () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x16
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgGetResolution (camid) {
      var aDataArray = new Uint8Array(5)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x18
      aDataArray[2] = 0x02
      aDataArray[3] = 0x00
      aDataArray[4] = camid
      this.ws.send(aDataArray.buffer)
    },

    sendMsgGetResolutionSecond (camid) {
      var aDataArray = new Uint8Array(5)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x18
      aDataArray[2] = 0x02
      aDataArray[3] = 0x01
      aDataArray[4] = camid
      this.ws.send(aDataArray.buffer)
    },

    sednMsgSavePDF (pathUnicode) {
      var path = encodeURI(pathUnicode)
      var pathdata = this.stringToByte(path)
      var len = path.length
      var aDataArray = new Uint8Array(3 + len)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x11
      aDataArray[2] = len
      for (var i = 0; i < len; i++) {
        aDataArray[3 + i] = pathdata[i]
      }
      this.ws.send(aDataArray.buffer)
    },

    sednMsgAddPDF (pathUnicode) {
      var path = encodeURI(pathUnicode)
      var pathdata = this.stringToByte(path)
      var len = path.length
      var aDataArray = new Uint8Array(3 + len)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x12
      aDataArray[2] = len
      for (var i = 0; i < len; i++) {
        aDataArray[3 + i] = pathdata[i]
      }
      this.ws.send(aDataArray.buffer)
    },

    sednMsgWaterMarkOpen (pathUnicode, fontSize, fontStyleIndex, r, g, b, xoffset, yoffset) {
      var path = encodeURI(pathUnicode)
      var pathdata = this.stringToByte(path)
      var len = path.length

      var aDataArray = new Uint8Array(11 + len)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x1a
      aDataArray[2] = 8 + len
      aDataArray[3] = fontSize
      aDataArray[4] = fontStyleIndex
      aDataArray[5] = r
      aDataArray[6] = g
      aDataArray[7] = b
      aDataArray[8] = xoffset
      aDataArray[9] = yoffset
      aDataArray[10] = len
      for (var i = 0; i < len; i++) {
        aDataArray[11 + i] = pathdata[i]
      }
      this.ws.send(aDataArray.buffer)
    },

    sednMsgWaterMarkClose () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x1b
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sednMsgBubaiType (type) {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x2c
      aDataArray[2] = 0x01
      aDataArray[3] = type
      this.ws.send(aDataArray.buffer)
    },

    sednMsgQuqudiseType (type) {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x34
      aDataArray[2] = 0x01
      aDataArray[3] = type
      this.ws.send(aDataArray.buffer)
    },

    sendMsgCombineTwoImage (path1Unicode, path2Unicode, path3Unicode, type) {
      var path1 = encodeURI(path1Unicode)
      var pathdata1 = this.stringToByte(path1)
      var len1 = path1.length

      var path2 = encodeURI(path2Unicode)
      var pathdata2 = this.stringToByte(path2)
      var len2 = path2.length

      var path3 = encodeURI(path3Unicode)
      var pathdata3 = this.stringToByte(path3)
      var len3 = path3.length

      var aDataArray = new Uint8Array(7 + len1 + len2 + len3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x13
      aDataArray[2] = len1 + len2 + len3 + 4
      aDataArray[3] = type
      aDataArray[4] = len1
      for (var i = 0; i < len1; i++) {
        aDataArray[5 + i] = pathdata1[i]
      }
      aDataArray[5 + len1] = len2
      for (let i = 0; i < len2; i++) {
        aDataArray[6 + len1 + i] = pathdata2[i]
      }

      aDataArray[6 + len1 + len2] = len3
      for (let i = 0; i < len3; i++) {
        aDataArray[7 + len1 + len2 + i] = pathdata3[i]
      }
      this.ws.send(aDataArray.buffer)
    },

    sendMsgCombineTwoImageBase64 (path1Unicode, path2Unicode, type) {
      var path1 = encodeURI(path1Unicode)
      var pathdata1 = this.stringToByte(path1)
      var len1 = path1.length

      var path2 = encodeURI(path2Unicode)
      var pathdata2 = this.stringToByte(path2)
      var len2 = path2.length

      var aDataArray = new Uint8Array(7 + len1 + len2)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x85
      aDataArray[2] = len1 + len2 + 3
      aDataArray[3] = type
      aDataArray[4] = len1
      for (var i = 0; i < len1; i++) {
        aDataArray[5 + i] = pathdata1[i]
      }
      aDataArray[5 + len1] = len2
      for (let i = 0; i < len2; i++) {
        aDataArray[6 + len1 + i] = pathdata2[i]
      }

      this.ws.send(aDataArray.buffer)
    },
    sendMsgCombineTwoImageInside (path1Unicode, path2Unicode, path3Unicode, xoff, yoff) {
      var path1 = encodeURI(path1Unicode)
      var pathdata1 = this.stringToByte(path1)
      var len1 = path1.length

      var path2 = encodeURI(path2Unicode)
      var pathdata2 = this.stringToByte(path2)
      var len2 = path2.length

      var path3 = encodeURI(path3Unicode)
      var pathdata3 = this.stringToByte(path3)
      var len3 = path3.length

      var aDataArray = new Uint8Array(11 + len1 + len2 + len3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x86
      aDataArray[2] = len1 + len2 + len3 + 7
      aDataArray[3] = xoff / 256
      aDataArray[4] = xoff % 256
      aDataArray[5] = yoff / 256
      aDataArray[6] = yoff % 256
      aDataArray[7] = len1
      for (var i = 0; i < len1; i++) {
        aDataArray[8 + i] = pathdata1[i]
      }
      aDataArray[8 + len1] = len2
      for (let i = 0; i < len2; i++) {
        aDataArray[9 + len1 + i] = pathdata2[i]
      }

      aDataArray[9 + len1 + len2] = len3
      for (let i = 0; i < len3; i++) {
        aDataArray[10 + len1 + len2 + i] = pathdata3[i]
      }
      this.ws.send(aDataArray.buffer)
    },

    sendMsgCombineTwoImageInsideBase64 (path1Unicode, path2Unicode, xoff, yoff) {
      var path1 = encodeURI(path1Unicode)
      var pathdata1 = this.stringToByte(path1)
      var len1 = path1.length

      var path2 = encodeURI(path2Unicode)
      var pathdata2 = this.stringToByte(path2)
      var len2 = path2.length

      var aDataArray = new Uint8Array(10 + len1 + len2)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x87
      aDataArray[2] = len1 + len2 + 6
      aDataArray[3] = xoff / 256
      aDataArray[4] = xoff % 256
      aDataArray[5] = yoff / 256
      aDataArray[6] = yoff % 256
      aDataArray[7] = len1
      for (var i = 0; i < len1; i++) {
        aDataArray[8 + i] = pathdata1[i]
      }
      aDataArray[8 + len1] = len2
      for (let i = 0; i < len2; i++) {
        aDataArray[9 + len1 + i] = pathdata2[i]
      }

      this.ws.send(aDataArray.buffer)
    },

    sendMsgSetAutoExposure (type) {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x2d
      aDataArray[2] = 0x01
      aDataArray[3] = type
      this.ws.send(aDataArray.buffer)
    },

    sendMsgGetExposureRange () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x31
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgGetBrightnessRange () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x2e
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgSetBrightness (temp) {
      var type
      if (temp < 0) {
        type = 0
      } else {
        type = 1
      }
      temp = Math.abs(temp)
      var aDataArray = new Uint8Array(5)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x2f
      aDataArray[2] = 0x02
      aDataArray[3] = type
      aDataArray[4] = temp
      this.ws.send(aDataArray.buffer)
    },

    sendMsgSetExposure (temp) {
      var type
      if (temp < 0) {
        type = 0
      } else {
        type = 1
      }
      temp = Math.abs(temp)
      var aDataArray = new Uint8Array(5)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x33
      aDataArray[2] = 0x02
      aDataArray[3] = type
      aDataArray[4] = temp
      this.ws.send(aDataArray.buffer)
    },

    sednMsgGetBase64 (filename) {
      var path = encodeURI(filename)
      var pathdata = this.stringToByte(path)
      var len = path.length
      var aDataArray = new Uint8Array(3 + len)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x35
      aDataArray[2] = len
      for (var i = 0; i < len; i++) {
        aDataArray[3 + i] = pathdata[i]
      }
      this.ws.send(aDataArray.buffer)
    },

    sendMsgDeleteFile (pathUnicode) {
      var path = encodeURI(pathUnicode)
      var pathdata = this.stringToByte(path)
      var len = path.length
      var aDataArray = new Uint8Array(3 + len)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x38
      aDataArray[2] = len
      for (var i = 0; i < len; i++) {
        aDataArray[3 + i] = pathdata[i]
      }
      this.ws.send(aDataArray.buffer)
    },

    sendMsgQrcode (pathUnicode) {
      var path = encodeURI(pathUnicode)
      var pathdata = this.stringToByte(path)
      var len = path.length
      var aDataArray = new Uint8Array(3 + len)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x39
      aDataArray[2] = len
      for (var i = 0; i < len; i++) {
        aDataArray[3 + i] = pathdata[i]
      }
      this.ws.send(aDataArray.buffer)
    },

    sendMsgBarcode (pathUnicode) {
      var path = encodeURI(pathUnicode)
      var pathdata = this.stringToByte(path)
      var len = path.length
      var aDataArray = new Uint8Array(3 + len)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x44
      aDataArray[2] = len
      for (var i = 0; i < len; i++) {
        aDataArray[3 + i] = pathdata[i]
      }
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

    sendMsgStartIDCard () {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x3c
      aDataArray[2] = 0x01
      aDataArray[3] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgGetOneIC () {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x3c
      aDataArray[2] = 0x01
      aDataArray[3] = 0x01
      this.ws.send(aDataArray.buffer)
    },

    sendMsgGetICValues (type) {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x3d
      aDataArray[2] = 0x01
      aDataArray[3] = type
      this.ws.send(aDataArray.buffer)
    },

    sendMsgRotateL () {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x40
      aDataArray[2] = 0x01
      aDataArray[3] = 0
      this.ws.send(aDataArray.buffer)
    },

    sendMsgRotateR () {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x40
      aDataArray[2] = 0x01
      aDataArray[3] = 1
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

    sendMsgTrueSize () {
      this.canvasX = 0
      this.canvasY = 0
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x0d
      aDataArray[2] = 0x01
      aDataArray[3] = 3
      this.ws.send(aDataArray.buffer)
    },

    sendMsgWorkIDCard () {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x41
      aDataArray[2] = 0x01
      aDataArray[3] = 0x01
      this.ws.send(aDataArray.buffer)
    },

    sendMsgStopWorkIDCard () {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x41
      aDataArray[2] = 0x01
      aDataArray[3] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgShotBase64 (type) {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x42
      aDataArray[2] = 0x01
      aDataArray[3] = type
      this.ws.send(aDataArray.buffer)
    },

    sendMsgSetJpgQuanlity (value) {
      var aDataArray2 = new Uint8Array(4)
      aDataArray2[0] = 0xef
      aDataArray2[1] = 0x49
      aDataArray2[2] = 0x01
      aDataArray2[3] = value
      this.ws.send(aDataArray2.buffer)
    },

    sendMsgGetICPictureAll () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x4d
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgInitFinger () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x4f
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgStartFinger () {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x50
      aDataArray[2] = 0x01
      aDataArray[3] = 0x01
      this.ws.send(aDataArray.buffer)
    },

    sendMsgCloseFinger () {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x50
      aDataArray[2] = 0x01
      aDataArray[3] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgBeginVideo (pathUnicode, id, frame) {
      var path = encodeURI(pathUnicode)
      var pathdata = this.stringToByte(path)
      var len = path.length
      var aDataArray = new Uint8Array(6 + len)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x51
      aDataArray[2] = len + 3
      aDataArray[3] = id
      aDataArray[4] = frame
      aDataArray[5] = len
      for (var i = 0; i < len; i++) {
        aDataArray[6 + i] = pathdata[i]
      }
      this.ws.send(aDataArray.buffer)
    },

    sendMsgStopVideo () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x52
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgBeginVideoSecond (pathUnicode, id, frame) {
      var path = encodeURI(pathUnicode)
      var pathdata = this.stringToByte(path)
      var len = path.length
      var aDataArray = new Uint8Array(6 + len)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x53
      aDataArray[2] = len + 3
      aDataArray[3] = id
      aDataArray[4] = frame
      aDataArray[5] = len
      for (var i = 0; i < len; i++) {
        aDataArray[6 + i] = pathdata[i]
      }
      this.ws.send(aDataArray.buffer)
    },

    sendMsgStopVideoSecond () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x54
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgGetAudioName () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x55
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sednMsgBarQrcode (type) {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x59
      aDataArray[2] = 0x01
      aDataArray[3] = type
      this.ws.send(aDataArray.buffer)
    },

    sendMsgMakeDir (pathUnicode) {
      var path = encodeURI(pathUnicode)
      var pathdata = this.stringToByte(path)
      var len = path.length
      var aDataArray = new Uint8Array(3 + len)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x5a
      aDataArray[2] = len
      for (var i = 0; i < len; i++) {
        aDataArray[3 + i] = pathdata[i]
      }
      this.ws.send(aDataArray.buffer)
    },

    sendMsgAutoFoucs () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x5b
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },

    sednMsgFaceCheckInit () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x5c
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sednMsgFaceCheckUninit () {
      this.isFaceOpen = false
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x5d
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sednMsgStartFaceCheck () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x5e
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sednMsgStopFaceCheck () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x61
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sednMsgFaceCheckInitSecond () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x63
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sednMsgFaceCheckUninitSecond () {
      this.isFaceOpenSecond = false
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x64
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sednMsgStartFaceCheckSecond () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x65
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sednMsgStopFaceCheckSecond () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x66
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sednMsgBankCardFun (type) {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x6b
      aDataArray[2] = 0x01
      aDataArray[3] = type
      this.ws.send(aDataArray.buffer)
    },

    sendMsgInitFingerFunOrCloase (type) {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x6c
      aDataArray[2] = 0x01
      aDataArray[3] = type
      this.ws.send(aDataArray.buffer)
    },

    sendMsgRegisterFinger () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x6d
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sednMsgStopRegisterFinger () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x6e
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgVerifyFinger (pathUnicode) {
      var path = encodeURI(pathUnicode)
      var pathdata = this.stringToByte(path)
      var len = path.length
      var aDataArray = new Uint8Array(3 + len)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x6f
      aDataArray[2] = len
      for (var i = 0; i < len; i++) {
        aDataArray[3 + i] = pathdata[i]
      }
      this.ws.send(aDataArray.buffer)
    },

    sednMsgStopVerifyFinger () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x70
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sednMsgQFaceStratDoubleOrClose (type) {
      var aDataArray = new Uint8Array(4)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x74
      aDataArray[2] = 0x01
      aDataArray[3] = type
      this.ws.send(aDataArray.buffer)
    },

    sednMsgFaceCheckInitDouble () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x75
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgSetDpi (x, y) {
      var aDataArray = new Uint8Array(7)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x76
      aDataArray[2] = 0x04
      aDataArray[3] = x / 256
      aDataArray[4] = x % 256
      aDataArray[5] = y / 256
      aDataArray[6] = y % 256
      this.ws.send(aDataArray.buffer)
    },

    sednMsgReleaseAll () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x77
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgFaceCheck (type) {
      if (type === 0) {
        this.isFaceOpen = false
      }
      var aDataArray2 = new Uint8Array(4)
      aDataArray2[0] = 0xef
      aDataArray2[1] = 0x78
      aDataArray2[2] = 0x01
      aDataArray2[3] = type
      this.ws.send(aDataArray2.buffer)
    },

    sendMsgCaptureFace () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x79
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgFaceCheckSecond (type) {
      if (type === 0) {
        this.isFaceOpenSecond = false
      }
      var aDataArray2 = new Uint8Array(4)
      aDataArray2[0] = 0xef
      aDataArray2[1] = 0x7a
      aDataArray2[2] = 0x01
      aDataArray2[3] = type
      this.ws.send(aDataArray2.buffer)
    },

    sendMsgCaptureFaceSecond () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x7b
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgGetFinger (type) {
      var aDataArray2 = new Uint8Array(4)
      aDataArray2[0] = 0xef
      aDataArray2[1] = 0x7f
      aDataArray2[2] = 0x01
      aDataArray2[3] = type
      this.ws.send(aDataArray2.buffer)
    },

    sendMsgVerifyFingerBase64 (datalen, pathUnicode) {
      var path = encodeURI(pathUnicode)
      var pathdata = this.stringToByte(path)
      var len = path.length
      var aDataArray = new Uint8Array(7 + len)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x81
      aDataArray[2] = 0x00
      aDataArray[3] = datalen / 256
      aDataArray[4] = datalen % 256
      aDataArray[5] = len / 256
      aDataArray[6] = len % 256
      for (var i = 0; i < len; i++) {
        aDataArray[7 + i] = pathdata[i]
      }
      this.ws.send(aDataArray.buffer)
    },

    sendMsgAddFingerBase64 (datalen, pathUnicode) {
      var path = encodeURI(pathUnicode)
      var pathdata = this.stringToByte(path)
      var len = path.length
      var aDataArray = new Uint8Array(7 + len)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x94
      aDataArray[2] = 0x00
      aDataArray[3] = datalen / 256
      aDataArray[4] = datalen % 256
      aDataArray[5] = len / 256
      aDataArray[6] = len % 256
      for (var i = 0; i < len; i++) {
        aDataArray[7 + i] = pathdata[i]
      }
      this.ws.send(aDataArray.buffer)
    },

    sendMsgClearAllFingerBase64 () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x95
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgVerifyFingerAllBase64 () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x96
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgCheckCamDev () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x89
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    sendMsgSetFoucs (value) {
      var aDataArray = new Uint8Array(5)
      aDataArray[0] = 0xef
      aDataArray[1] = 0x8c
      aDataArray[2] = 0x02
      aDataArray[3] = value / 256
      aDataArray[4] = value % 256
      this.ws.send(aDataArray.buffer)
    },

    sendMsgSetDebugModel () {
      var aDataArray = new Uint8Array(3)
      aDataArray[0] = 0xef
      aDataArray[1] = 0xa3
      aDataArray[2] = 0x00
      this.ws.send(aDataArray.buffer)
    },

    GetFaceZuobiao (Xdis, Ydis) {
      if (this.isFaceOpen) {
        for (var j = 0; j < this.faceNum; j++) {
          for (var i = 0; i < 3; i++) {
            this.context.moveTo(this.faceZuobiao[2 * i + j * 8] + Xdis, this.faceZuobiao[2 * i + j * 8 + 1] + Ydis)
            this.context.lineTo(this.faceZuobiao[2 * i + j * 8 + 2] + Xdis, this.faceZuobiao[2 * i + j * 8 + 3] + Ydis)
            this.context.stroke()
          }

          this.context.moveTo(this.faceZuobiao[6 * i + j * 8] + Xdis, this.faceZuobiao[6 * i + j * 8 + 1] + Ydis)
          this.context.lineTo(this.faceZuobiao[0 + j * 8] + Xdis, this.faceZuobiao[1 + j * 8] + Ydis)
          this.context.stroke()
        }
      }
    },

    GetFaceZuobiaoSecond (Xdis, Ydis) {
      if (this.isFaceOpenSecond) {
        this.contextSecond.beginPath()
        this.contextSecond.strokeStyle = 'rgb(0,255,0)'
        this.contextSecond.lineWidth = 2
        for (var j = 0; j < this.faceNumSecond; j++) {
          for (var i = 0; i < 3; i++) {
            this.contextSecond.moveTo(this.faceZuobiaoSecond[2 * i + j * 8] + Xdis, this.faceZuobiaoSecond[2 * i + j * 8 + 1] + Ydis)
            this.contextSecond.lineTo(this.faceZuobiaoSecond[2 * i + j * 8 + 2] + Xdis, this.faceZuobiaoSecond[2 * i + j * 8 + 3] + Ydis)
            this.contextSecond.stroke()
          }

          this.contextSecond.moveTo(this.faceZuobiaoSecond[6 * i + j * 8] + Xdis, this.faceZuobiaoSecond[6 * i + j * 8 + 1] + Ydis)
          this.contextSecond.lineTo(this.faceZuobiaoSecond[0 + j * 8] + Xdis, this.faceZuobiaoSecond[1 + j * 8] + Ydis)
          this.contextSecond.stroke()
        }
      }
    },

    SetCusCropPlaceWs (cutX, cutY, cutW, cutH) {
      var bpp = this.rec_ww / this.imgOrignalW
      if (this.rorateAngleType === 1 || this.rorateAngleType === 3) {
        bpp = this.rec_ww / this.imgOrignalH
      }
      this.recX_manual = cutX * bpp + (this.canvas.width / 2 - this.rec_ww / 2)
      this.recY_manual = cutY * bpp + (this.canvas.height / 2 - this.rec_hh / 2)
      this.recW_manual = cutW * bpp
      this.recH_manual = cutH * bpp
      this.cutXCaibian = cutW
      this.cutYCaibian = cutH
    },

    SetCusCropPlaceWs2 (cutX, cutY, cutW, cutH) {
      var bpp = this.rec_ww2 / this.imgOrignalW2
      this.recX_manual2 = cutX * bpp + (this.canvasSecond.width / 2 - this.rec_ww2 / 2)
      this.recY_manual2 = cutY * bpp + (this.canvasSecond.height / 2 - this.rec_hh2 / 2)
      this.recW_manual2 = cutW * bpp
      this.recH_manual2 = cutH * bpp
      this.cutXCaibian2 = cutW
      this.cutYCaibian2 = cutH
    },

    // 手动裁边时的长方形
    refreshRect () {
      this.context.beginPath()
      this.context.rect(this.recX_manual, this.recY_manual, this.recW_manual, this.recH_manual)
      this.context.lineWidth = 2
      this.context.strokeStyle = '#0000ff'
      this.context.stroke()
    },

    refreshRect2 () {
      this.contextSecond.beginPath()
      this.contextSecond.rect(this.recX_manual2, this.recY_manual2, this.recW_manual2, this.recH_manual2)
      this.contextSecond.lineWidth = 2
      this.contextSecond.strokeStyle = '#0000ff'
      this.contextSecond.stroke()
    },

    stringToByte (str) {
      var bytes = []
      var len, c
      len = str.length
      for (var i = 0; i < len; i++) {
        c = str.charCodeAt(i)
        if (c >= 0x010000 && c <= 0x10FFFF) {
          bytes.push(((c >> 18) & 0x07) | 0xF0)
          bytes.push(((c >> 12) & 0x3F) | 0x80)
          bytes.push(((c >> 6) & 0x3F) | 0x80)
          bytes.push((c & 0x3F) | 0x80)
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
          bytes.push(((c >> 12) & 0x0F) | 0xE0)
          bytes.push(((c >> 6) & 0x3F) | 0x80)
          bytes.push((c & 0x3F) | 0x80)
        } else if (c >= 0x000080 && c <= 0x0007FF) {
          bytes.push(((c >> 6) & 0x1F) | 0xC0)
          bytes.push((c & 0x3F) | 0x80)
        } else {
          bytes.push(c & 0xFF)
        }
      }
      return bytes
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

    base64Encode (input) {
      var rv
      rv = encodeURIComponent(input)
      rv = unescape(rv)
      rv = window.btoa(rv)
      return rv
    },

    // 加载控件
    loadActiveX () {
      // if (navigator.userAgent.indexOf('MSIE') >= 0) {
      if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        this.isIE = true
        // IE浏览器加载控件
        document.getElementById('ActiveXDivOne').innerHTML = '<OBJECT id="axCam_Ocx"  classid="clsid:D5BD5B4A-4FC0-4869-880B-27EE9869D706" width="500px" height="400px" ></OBJECT>'
        document.getElementById('ActiveXDivTwo').innerHTML = '<OBJECT id="axCam_Ocx2"  classid="clsid:341014BA-CD4A-4918-A11F-8A33B152915A" width="500px" height="400px" ></OBJECT>'
        this.OcxInit()
      } else {
        this.isIE = false
        if (!window.WebSocket) {
          alert('WebSocket not supported by this browser!')
        }
        // 其他浏览器加载控件
        document.getElementById('ActiveXDivOne').innerHTML = ' <canvas id="cameraCanvas" width="500px" height="400px" style="border:1px solid #d3d3d3;">'
        document.getElementById('ActiveXDivTwo').innerHTML = ' <canvas id="cameraCanvasSecond" width="500px" height="400px" style="border:1px solid #d3d3d3;">'
        this.WsInit(500, 400, 500, 400, true)
      }

      if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', this.scrollFunc, false)
      }// W3C
      window.onmousewheel = document.onmousewheel = this.scrollFunc
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
            // }
          }
        }
      }
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

    // 必需重写---获取分辨率副头(data为分辨率数组,每2个为一组,宽高)
    GetDeviceResolutionSecond (data) {
      var obj = document.getElementById('Resolution2')
      var max = 0
      var maxIndex = 0
      obj.options.length = 0
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
    },

    // 设备1初始化完成,可以进行相关操作
    LoadOver () {
      this.StartVideo()
    },

    // 设备2初始化完成,可以进行相关操作
    LoadOver2 () {
      this.StartVideo2()
    },

    // 开启摄像头
    StartVideo () {
      var obj = document.getElementById('Resolution')
      var restr = obj[obj.selectedIndex].text
      var pos = restr.lastIndexOf('*')
      var width = parseInt(restr.substring(0, pos))
      var height = parseInt(restr.substring(pos + 1, restr.length))
      console.log(this.camidMain)
      this.StartCam(this.camidMain, width, height)
    },

    // 关闭摄像头
    CloseVideo () {
      this.CloseCam()
    },

    // 抓图拍照
    Capture () {
      var type = 0
      if (document.getElementById('Radio1').checked) {
        // 不裁边
        type = 0
      } else if (document.getElementById('Radio2').checked) {
        // 自动裁边
        type = 1
      } else if (document.getElementById('Radio3').checked) {
        // 手动裁边
        type = 2
      }
      this.CaptureImage(type)
    },
    // 切换摄像头
    ChangeDevice () {
      this.CloseCam()
      var devObj = document.getElementById('DeviceName')
      this.camidMain = devObj.selectedIndex
      this.ChangeCamDevice(this.camidMain)
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

    // 设置图片类型
    SetFileType () {
      var type = document.getElementById('FileType').selectedIndex
      this.SetImageType(type)
    },

    // 设置图片颜色格式
    SetImageColorMode () {
      var type = document.getElementById('ColourMode').selectedIndex
      this.SetColorMode(type)
    },

    // 图像设置窗口
    ShowImageSettingWindow () {
      this.ShowSettingWindow()
    },

    // 设置是否裁剪
    SetCutType () {
      var type = 0

      if (document.getElementById('Radio1').checked) {
        type = 0
      }
      if (document.getElementById('Radio2').checked) {
        type = 1
      }
      if (document.getElementById('Radio3').checked) {
        type = 2
      }
      this.SetCamCutType(type)
      this.SetCamCutType2(type)
    },

    // 设置智能连拍模式
    SetCaptureModel () {
      if (document.getElementById('Radio10').checked) {
        this.SetWiseCapture(0)
      }
      if (document.getElementById('Radio11').checked) {
        this.SetWiseCapture(1)
      }
      if (document.getElementById('Radio12').checked) {
        this.SetTimeCapture(1, 5000)
      }
    },

    // 设置保存的文件路径
    SetFilePath () {
      // var path = "C:\\Users\\Administrator\\Desktop"
      var path = 'E:\\img'
      this.SetImagePath(path)
      this.SetImagePath2(path)
    },

    // 设置拍照时是否只返回base64
    funSetImagebase64 () {
      var isCheck = document.getElementById('checkboxBase').checked
      if (isCheck) {
        this.SetImagebase64(1)
      } else {
        this.SetImagebase64(0)
      }
    },

    // 启动身份证模块
    funStartIC () {
      this.StartIC()
    },

    // 启动身份证自动读卡
    funStartICWork () {
      this.StartICWork()
    },

    // 关闭身份证自动读卡
    funStopICWork () {
      this.StopICWork()
    },

    funGetOneIC () {
      this.GetOneIC()
    },

    funGetICValues () {
      this.GetICValues()
    },

    // 条码识别
    funReadBarCode (type) {
      if (type === 0) {
        var imgPath = 'D:\\barcode.jpg'
        this.ReadBarCode(imgPath)
      } else if (type === 1) {
        this.ReadBarQrcodeD(1)
      }
    },

    // 二维码识别
    funReadQrCode (type) {
      if (type === 0) {
        var imgPath = 'D:\\qrcode.jpg'
        this.ReadQrCode(imgPath)
      } else if (type === 1) {
        this.ReadBarQrcodeD(2)
      }
    },

    // 合并PDF
    funConvertToPDF () {
      var pat1 = 'D:\\add1.jpg'
      var pat2 = 'D:\\add2.jpg'
      var pat3 = 'D:\\add3.jpg'
      var pdfpath = 'D:\\Convert.pdf'
      this.AddPDFImageFile(pat1)
      this.AddPDFImageFile(pat2)
      this.AddPDFImageFile(pat3)
      this.SavePDF(pdfpath)
    },

    // 图片合并
    funCombineTwoImage () {
      var dir = 1 // 1->垂直合并  2->水平合并
      if (document.getElementById('Radio4').checked) { dir = 1 }
      if (document.getElementById('Radio5').checked) { dir = 2 }

      var combinePath = 'D:\\CombineImg.jpg'
      var ImgPath1 = 'D:\\add1.jpg'
      var ImgPath2 = 'D:\\add2.jpg'
      this.CombineTwoImage(combinePath, ImgPath1, ImgPath2, dir)
      // CombineTwoImageBase64(ImgPath1, ImgPath2, dir);
      // CombineTwoImageInside(combinePath,ImgPath1,ImgPath2,1500,300);
      // CombineTwoImageInsideBase64(ImgPath1,ImgPath2,1500,300);
    },

    // 上传图片
    funUpdataFile () {
      this.UpdataFile('127.0.0.1', 8080, '/FileStreamDemo/servlet/FileSteamUpload?', 'D:\\add1.jpg')
      // UpdataFile("127.0.0.1", 19890, "/WebSite1/WebService.asmx/HelloWorld?cmd1=cmd1","D:\\add1.jpg");
    },

    // 上传Base64(js自带功能)
    funUpdataBase64 () {
      var strImgBase64 = document.getElementById('img1').src.split(',')[1]
      var $Blob = this.getBlobBydataURI(strImgBase64, 'image/jpeg')
      var formData = new FormData()
      formData.append('files', $Blob, 'file_' + Date.parse(new Date()) + '.jpeg')
      // 组建XMLHttpRequest 上传文件
      var request = new XMLHttpRequest()
      // 上传连接地址
      request.open('POST', 'http://127.0.0.1:8080/FileStreamDemo/servlet/FileSteamUpload')
      request.onreadystatechange = () => {
        if (request.readyState === 4) {
          if (request.status === 200) {
            console.log('上传成功')
            alert('上传成功')
          } else {
            console.log('上传失败,检查上传地址是否正确')
            alert('上传失败,检查上传地址是否正确')
          }
        }
      }
      request.send(formData)
    },

    // 刷新设备
    RefreshDev () {
      this.CloseCam()
      this.CloseCam2()
      this.RefreshDevice()
    },

    // 根据文件路径获取base64
    fungetBase64 () {
      var strpath = 'D:\\1.jpg'
      this.GetBase64FromFile(strpath)
    },

    // 设置水印
    SetWaterType () {
      if (document.getElementById('Radio6').checked) {
        this.CloseWaterMark()
      }
      if (document.getElementById('Radio7').checked) {
        var waterinfo = '我的水印'
        var FontSize = 50
        var FontSytle = 0
        var xOff = 100
        let yOff = 100
        this.OpenWaterMark(waterinfo, FontSize, FontSytle, 255, 0, 0, xOff, yOff)
      }
    },

    // 设置自动裁边单图与多图
    funsetJiubianModel () {
      if (document.getElementById('Radio13').checked) {
        this.SetJiubianModel(0)
        // axCam_Ocx.CusCrop(0);
      } else if (document.getElementById('Radio14').checked) {
        this.SetJiubianModel(1)
      }
    },

    // 设置四周补白
    funsetBuBai () {
      var isCheck = document.getElementById('checkbox2').checked
      if (isCheck) {
        this.SetBuBai(1)
      } else this.SetBuBai(0)
    },

    // 设置去灰
    funsetQudise () {
      var isCheck = document.getElementById('checkbox1').checked
      if (isCheck) {
        this.SetQudise(1)
      } else this.SetQudise(0)
    },

    funSetFileNameModel () {
      if (document.getElementById('Radio19').checked) {
        // 自定义
        var num = 1
        var name = 'IMGAAA'
        this.SetFileNameCustom(name, num)

        var num2 = 10
        var name2 = 'IMGAAAsub'
        this.SetFileNameCustom2(name2, num2)
      } else if (document.getElementById('Radio20').checked) {
        // 时间
        this.SetFileNameTime()
        this.SetFileNameTime2()
      } else if (document.getElementById('Radio21').checked) {
        // 固定
        let name = '固定'
        this.SetFileNameFixed(name)

        let name2 = '固定ssss'
        this.SetFileNameFixed2(name2)
      }
    },

    funSetAutoExposure () {
      if (document.getElementById('RadioExopen').checked) {
        this.SetAutoExposure(1)
      } else if (document.getElementById('RadioExclose').checked) {
        this.SetAutoExposure(0)
      }
    },

    funGetCamParameter () {
      this.GetCamParameter()
    },

    funSetExposure () {
      this.SetExposure(0)
    },

    funSetBrightness () {
      this.SetBrightness(0)
    },

    funGetCamNum () {
      this.GetCamNum()
    },

    funDeleteFile () {
      var filename = 'D:\\1.jpg'
      this.DeleteFile(filename)
    },

    funSetJpgQuanlity () {
      this.SetJpgQuanlity(100)
    },
    funGetICPictureAll () {
      this.GetICPictureAll()
    },

    funSetCusCropPlace () {
      var cutX = 800
      var cutY = 600
      var cutW = 800
      var cutH = 600

      this.SetCusCropPlace(cutX, cutY, cutW, cutH)
    },

    funSetCusCropPlace2 () {
      var cutX = 100
      var cutY = 100
      var cutW = 400
      var cutH = 300

      this.SetCusCropPlace2(cutX, cutY, cutW, cutH)
    },

    funBeginVideo () {
      var filename = 'D:\\videoOne.avi'
      this.BeginVideo(filename, 0, 1)
    },

    funStopVideo () {
      this.StopVideo()
    },

    funBeginVideo2 () {
      var filename = 'D:\\videoTwo.avi'
      this.BeginVideoSecond(filename, 0, 1)
    },

    funStopVideo2 () {
      this.StopVideoSecond()
    },

    funGetAudioName () {
      this.GetAudioName()
    },

    funMakeDir () {
      var filename = 'D:\\ceshi'
      this.MakeDir(filename)
    },

    funAutoFoucs () {
      this.AutoFoucs()
    },

    funSetFoucs () {
      this.SetFoucs(440)
    },

    funRegisterFinger () {
      this.RegisterFinger()
    },

    funVerifyFinger () {
      this.VerifyFinger(this.fingerLen, this.fingerBase64)
      // ClearAllFingerBase64();
      // AddFingerBase64(512,fpdata1);
      // AddFingerBase64(512,fpdata2);
      // AddFingerBase64(512,fpdata3);
      // VerifyFingerAllBase64();
    },
    ShowHide () {
      if (this.hide_show === 0) {
        this.hide_show = 1
        if (this.isIE) {
          document.getElementById('axCam_Ocx').style.visibility = 'hidden'
        } else document.getElementById('cameraCanvas').style.visibility = 'hidden'
      } else {
        this.hide_show = 0
        if (this.isIE) {
          document.getElementById('axCam_Ocx').style.visibility = 'visible'
        } else document.getElementById('cameraCanvas').style.visibility = 'visible'
      }
    },

    ShowInfo (op) {
      var obj = document.getElementById('TextArea1')
      obj.value = op + obj.value
    },
    /** ***************************副摄像头操作部分*******************************************

*****************************************************************************************/

    // 打开副摄像头
    StartVideo2 () {
      if (this.camidSub >= 0) {
        var obj = document.getElementById('Resolution2')
        var restr = obj[obj.selectedIndex].text
        var pos = restr.lastIndexOf('*')
        var width = parseInt(restr.substring(0, pos))
        var height = parseInt(restr.substring(pos + 1, restr.length))
        this.StartCam2(this.camidSub, width, height)
        // StartCam2YUV(camidSub,width,height);
      }
    },

    // 关闭副摄像头
    CloseVideo2 () {
      this.CloseCam2()
    },

    // 切换摄像头
    ChangeDevice2 () {
      this.CloseCam2()
      var devObj = document.getElementById('DeviceName2')
      this.camidSub = devObj.selectedIndex
      this.ChangeCamDevice2(this.camidSub)
    },

    // 切换分辨率
    ChangeResolution2 () {
      this.CloseCam2()
      var obj = document.getElementById('Resolution2')
      var restr = obj[obj.selectedIndex].text
      var pos = restr.lastIndexOf('*')
      var width = parseInt(restr.substring(0, pos))
      var height = parseInt(restr.substring(pos + 1, restr.length))
      this.StartCam2(this.camidSub, width, height)
    },

    // 副头拍照
    Capture2 () {
      var type = 0
      if (document.getElementById('Radio1').checked) {
        // 不裁边
        type = 0
      } else if (document.getElementById('Radio2').checked) {
        // 自动裁边
        type = 1
      } else if (document.getElementById('Radio3').checked) {
        // 手动裁边
        type = 2
      }
      this.CaptureImage2(type)
    },

    FaceCheckInitCamera () {
      this.FaceCheckInitDouble()
    },

    FaceCheckUninitCamera () {
      this.FaceCheckUninit()
      this.FaceCheckUninitSecond()
    },

    StartFaceCameraCheck () {
      this.FaceStratDouble()
    },

    CloseFaceCameraCheck () {
      this.FaceCloseDouble()
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
      console.log(text)
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

    getBlobBydataURI (dataURI, type) {
      // var binary = atob(dataURI.split(',')[1]);
      var binary = this.base64decode(dataURI)
      var array = []
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i))
      }
      return new Blob([new Uint8Array(array)], { type: type })
    },

    OcxInit () {
      var strUsbNamr = []
      var numCam = this.axCam_Ocx.GetDevCount()
      for (var i = 0; i < numCam; i++) {
        strUsbNamr[i] = this.axCam_Ocx.GetDevFriendName(i)
      }
      this.camidMain = this.axCam_Ocx.GetMainCameraID(1)
      this.camidSub = this.axCam_Ocx.GetSecondCameraID()
      this.GetDevName(numCam, strUsbNamr)

      var FormatSum = this.axCam_Ocx.GetFormatCount(this.camidMain)
      switch (FormatSum) {
        case 1: // （设备只支持MJPG格式）
          this.OpenFormat = 1 // 打开格式为MJPG
          this.SupportFormat = 1
          break
        case 2: // （设备只支持YUY2格式）
          this.OpenFormat = 0 // 打开格式为YUY
          this.SupportFormat = 2
          break
        case 3: // （设备支持MJPG与YUY2两种格式）
          this.OpenFormat = 1 // 默认打开格式为MJPG
          this.SupportFormat = 1
          break
      }

      this.OcxGetDeviceResolution()
    },

    // 获取分辨率
    OcxGetDeviceResolution () {
      var resCount = this.axCam_Ocx.GetResolutionCount(this.camidMain, this.SupportFormat)
      var dataResolution = []
      var num = 0
      for (var i = 0; i < resCount; i++) {
        var restr = this.axCam_Ocx.GetResolution(i)
        var pos = restr.lastIndexOf('*')
        var width = parseInt(restr.substring(0, pos))
        var height = parseInt(restr.substring(pos + 1, restr.length))
        dataResolution[num] = width
        num++
        dataResolution[num] = height
        num++
      }
      this.GetDeviceResolution(dataResolution)
    },

    OcxGetDeviceResolutionSecond () {
      if (this.isIE) {
        // camidSub = axCam_Ocx.GetSecondCameraID();
        if (this.camidSub >= 0) {
          var FormatSum = this.axCam_Ocx2.GetFormatCount(this.camidSub)
          switch (FormatSum) {
            case 1: // （设备只支持MJPG格式）
              this.OpenFormat2 = 1 // 打开格式为MJPG
              this.SupportFormat2 = 1
              break
            case 2: // （设备只支持YUY2格式）
              this.OpenFormat2 = 0 // 打开格式为YUY
              this.SupportFormat2 = 2
              break
            case 3: // （设备支持MJPG与YUY2两种格式）
              this.OpenFormat2 = 1 // 默认打开格式为MJPG
              this.SupportFormat2 = 1
              break
          }

          var resCount = this.axCam_Ocx2.GetResolutionCount(this.camidSub, this.SupportFormat2)
          var dataResolution = []
          var num = 0
          for (var i = 0; i < resCount; i++) {
            var restr = this.axCam_Ocx2.GetResolution(i)
            var pos = restr.lastIndexOf('*')
            var width = parseInt(restr.substring(0, pos))
            var height = parseInt(restr.substring(pos + 1, restr.length))
            dataResolution[num] = width
            num++
            dataResolution[num] = height
            num++
          }
          this.GetDeviceResolutionSecond(dataResolution)
        }
      } else {
        this.sendMsgGetResolutionSecond(this.camidSub)
      }
    },

    //
    StartCam (CamID, width, height) {
      if (this.isIE) {
        var i = this.axCam_Ocx.CAM_Open(CamID, this.OpenFormat, width, height)
        if (i === 0) this.InfoCallback(0x00)
        else if (i === -1) this.InfoCallback(0x16)
        else this.InfoCallback(0x02)
      } else {
        this.sendMsgStartVideo(CamID, width, height)
      }
    },

    StartCamYUV (CamID, width, height) {
      if (this.isIE) {
        var i = this.axCam_Ocx.CAM_Open(CamID, 0, width, height)
        if (i === 0) this.InfoCallback(0x00)
        else if (i === -1) this.InfoCallback(0x16)
        else this.InfoCallback(0x02)
      } else {
        this.sendMsgStartVideoYUV(CamID, width, height)
      }
    },

    StartCam2 (CamID, width, height) {
      if (this.isIE) {
        var i = this.axCam_Ocx2.CAM_Open(CamID, this.OpenFormat2, width, height)
        if (i === 0) this.InfoCallback(0x00)
        else if (i === -1) this.InfoCallback(0x16)
        else this.InfoCallback(0x02)
      } else {
        this.sendMsgStartVideo2(CamID, width, height)
      }
    },

    StartCam2YUV (CamID, width, height) {
      if (this.isIE) {
        var i = this.axCam_Ocx2.CAM_Open(CamID, 0, width, height)
        if (i === 0) this.InfoCallback(0x00)
        else if (i === -1) this.InfoCallback(0x16)
        else this.InfoCallback(0x02)
      } else {
        this.sendMsgStartVideo2YUV(CamID, width, height)
      }
    },

    CloseCam () {
      if (this.isIE) {
        this.axCam_Ocx.CAM_Close()
        this.InfoCallback(0x01)
      } else this.sendMsgCloseVideo()
    },

    CloseCam2 () {
      if (this.isSecondDev) {
        if (this.isIE) {
          this.axCam_Ocx2.CAM_Close()
          this.InfoCallback(0x01)
        } else this.sendMsgCloseVideoSecond()
      }
    },

    CaptureImage (type) {
      if (this.isIE) {
        this.axCam_Ocx.CaptureImage()
      } else {
        this.sendMsgCapture(type)
      }
    },

    CaptureImage2 (type) {
      if (this.isIE) {
        this.axCam_Ocx2.CaptureImage()
      } else {
        if (type !== 2) {
          this.sendMsgCaptureSecond()
        } else this.sendMsgCaptureSecondCaibian()
      }
    },

    ChangeCamDevice (CamID) {
      if (this.isIE) {
        var FormatSum = this.axCam_Ocx.GetFormatCount(CamID)
        switch (FormatSum) {
          case 1: // （设备只支持MJPG格式）
            this.OpenFormat = 1 // 打开格式为MJPG
            this.SupportFormat = 1
            break
          case 2: // （设备只支持YUY2格式）
            this.OpenFormat = 0 // 打开格式为YUY
            this.SupportFormat = 2
            break
          case 3: // （设备支持MJPG与YUY2两种格式）
            this.OpenFormat = 1 // 默认打开格式为MJPG
            this.SupportFormat = 1
            break
        }
        this.OcxGetDeviceResolution()
      } else {
        this.sendMsgGetResolution(CamID)
      }
    },

    ChangeCamDevice2 (CamID) {
      if (this.isIE) {
        var FormatSum = this.axCam_Ocx2.GetFormatCount(CamID)
        switch (FormatSum) {
          case 1: // （设备只支持MJPG格式）
            this.OpenFormat = 1 // 打开格式为MJPG
            this.SupportFormat = 1
            break
          case 2: // （设备只支持YUY2格式）
            this.OpenFormat = 0 // 打开格式为YUY
            this.SupportFormat = 2
            break
          case 3: // （设备支持MJPG与YUY2两种格式）
            this.OpenFormat = 1 // 默认打开格式为MJPG
            this.SupportFormat = 1
            break
        }
        this.OcxGetDeviceResolutionSecond()
      } else {
        this.sendMsgGetResolutionSecond(CamID)
      }
    },

    SetColorMode (type) {
      if (this.isIE) {
        this.axCam_Ocx.SetImageColorMode(type)
      } else {
        this.sendMsgSetImageColorMode(type)
      }
    },

    ShowSettingWindow () {
      if (this.isIE) {
        this.axCam_Ocx.ShowImageSettingWindow()
      } else {
        this.sendMsgShowImageSettingWindow()
      }
    },

    SetCamCutType (type) {
      if (this.isIE) {
        if (type === 2) {
          this.axCam_Ocx.CusCrop(1)
        } else this.axCam_Ocx.SetAutoCut(type)
      } else this.sendMsgSetCutType(type)
    },

    SetCamCutType2 (type) {
      if (this.isIE) {
        if (type === 2) {
          this.axCam_Ocx2.CusCrop(1)
        } else this.axCam_Ocx2.SetAutoCut(0)
      }
    },

    SetImageType (type) {
      if (this.isIE) {
        this.axCam_Ocx.SetFileType(type)
      } else {
        if (type > 2) type++
        this.sendMsgSetFileType(type)
      }
    },

    // 放大
    ZoomOut () {
      if (this.isIE) {
        this.axCam_Ocx.CAM_ZoomOut()
      } else this.sendMsgZoom(1)
    },

    // 缩小
    ZoomIn () {
      if (this.isIE) {
        this.axCam_Ocx.CAM_ZoomIn()
      } this.sendMsgZoom(0)
    },

    // 左旋
    RoateL () {
      if (this.isIE) {
        this.axCam_Ocx.CAM_RotateL()
      } else this.sendMsgRotateL()
    },

    // 右旋
    RoateR () {
      if (this.isIE) {
        this.axCam_Ocx.CAM_RotateR()
      } else this.sendMsgRotateR()
    },

    // 适合大小
    BestSize () {
      if (this.isIE) {
        this.axCam_Ocx.BestSize()
      } else {
        this.sendMsgBestSize()
      }
    },

    // 实际大小
    TrueSize () {
      if (this.isIE) {
        this.axCam_Ocx.TrueSize()
      } else {
        this.sendMsgTrueSize()
      }
    },

    SetWiseCapture (type) {
      if (this.isIE) {
        this.axCam_Ocx.WiseCapture(type)
      } else {
        this.sendMsgSetConntinousShotModel(type)
      }
    },

    SetTimeCapture (type, time) {
      if (this.isIE) {
        this.axCam_Ocx.TimeCapture(type, time)
      } else {
        time = time / 10
        this.sendMsgSetConntinousShotModelTime(time)
      }
    },

    SetImagePath (path) {
      if (this.isIE) {
        var ret = this.axCam_Ocx.setFilePath(path)
        if (ret === 0) {
          this.InfoTextCallback(1, path)
        } else this.InfoCallback(0xae)
      } else {
        this.sendMsgSetFilePath(path)
      }
    },

    SetImagePath2 (path) {
      if (this.isIE) {
        var ret = this.axCam_Ocx2.setFilePath(path)
        if (ret === 0) {
          this.InfoTextCallback(1, path)
        } else this.InfoCallback(0xae)
      }
    },

    RefreshDevice () {
      if (this.isIE) {
        this.OcxInit()
      } else {
        this.sendMsgRefreshDev()
      }
    },

    SetImagebase64 (type) {
      if (this.isIE) {
        this.axCam_Ocx.IsImageBase64(type)
        if (this.isSecondDev) {
          this.axCam_Ocx2.IsImageBase64(type)
        }
      } else {
        this.sendMsgShotBase64(type)
      }
    },

    StartIC () {
      if (this.isIE) {
        this.axCam_Ocx.StartIDCard()
        this.InfoCallback(0x19)
      } else {
        this.sendMsgStartIDCard()
      }
    },

    StartICWork () {
      if (this.isIE) {
        var ret = this.axCam_Ocx.WorkIDCard(1)
        if (ret === 0) {
          this.InfoCallback(0x20)
        } else if (ret === -2) {
          this.InfoCallback(0x1f)
        } else if (ret === -3) {
          this.InfoCallback(0x1e)
        }
      } else {
        this.sendMsgWorkIDCard()
      }
    },

    StopICWork () {
      if (this.isIE) {
        var ret = this.axCam_Ocx.WorkIDCard(0)
        if (ret === 0) {
          this.InfoCallback(0x21)
        } else if (ret === -2) {
          this.InfoCallback(0x1f)
        } else if (ret === -3) {
          this.InfoCallback(0x1e)
        }
      } else {
        this.sendMsgStopWorkIDCard()
      }
    },

    GetOneIC () {
      if (this.isIE) {
        var ret = this.axCam_Ocx.GetOneIC()
        if (ret === 0) {
          this.InfoCallback(0x1b)
        } else if (ret === -1) {
          this.InfoCallback(0x1d)
        } else if (ret === -2) {
          this.InfoCallback(0x1c)
        } else if (ret === -3) {
          this.InfoCallback(0x1e)
        } else if (ret === -4) {
          this.InfoCallback(0x1f)
        }
      } else {
        this.sendMsgGetOneIC()
      }
    },

    GetICValues () {
      if (this.isIE) {
        var name = this.axCam_Ocx.GetICValues('NAME')
        if (name.length > 0) {
          this.InfoTextCallback(9, name)

          var IC = this.axCam_Ocx.GetICValues('IC')
          this.InfoTextCallback(10, IC)

          var SEX = this.axCam_Ocx.GetICValues('SEX')
          this.InfoTextCallback(11, SEX)

          var NATION = this.axCam_Ocx.GetICValues('NATION')
          this.InfoTextCallback(12, NATION)

          var BIRTHDAY = this.axCam_Ocx.GetICValues('BIRTHDAY')
          this.InfoTextCallback(13, BIRTHDAY)

          var ADDRESS = this.axCam_Ocx.GetICValues('ADDRESS')
          this.InfoTextCallback(14, ADDRESS)

          var SIGNDEPT = this.axCam_Ocx.GetICValues('SIGNDEPT')
          this.InfoTextCallback(15, SIGNDEPT)

          var VALIDSTARTDATE = this.axCam_Ocx.GetICValues('VALIDSTARTDATE')
          this.InfoTextCallback(16, VALIDSTARTDATE)

          var VALIDENDDATE = this.axCam_Ocx.GetICValues('VALIDENDDATE')
          this.InfoTextCallback(17, VALIDENDDATE)

          var SAMID = this.axCam_Ocx.GetICValues('SAMID')
          this.InfoTextCallback(18, SAMID)

          var picBase64 = this.axCam_Ocx.GetICPicture()
          this.InfoTextCallback(19, picBase64)
        }
      } else {
        for (var i = 0; i < 11; i++) {
          this.sendMsgGetICValues(i)
        }
      }
    },

    ReadBarCode (imgPath) {
      if (this.isIE) {
        var CodeStr = this.axCam_Ocx.GetBarcodeContent(imgPath)
        if (CodeStr.length > 0) {
          this.InfoTextCallback(2, CodeStr)
        } else {
          this.InfoCallback(0xab)
        }
      } else {
        this.sendMsgBarcode(imgPath)
      }
    },

    ReadQrCode (imgPath) {
      if (this.isIE) {
        var CodeStr = this.axCam_Ocx.GetQRcodeContent(imgPath)
        this.InfoTextCallback(7, CodeStr)
      } else {
        this.sendMsgQrcode(imgPath)
      }
    },

    AddPDFImageFile (imgPath) {
      if (this.isIE) {
        var ret = this.axCam_Ocx.AddPDFImageFile(imgPath, '', 0)
        if (ret === 0) {
          this.InfoCallback(0x05)
        } else if (ret === -1) {
          this.InfoCallback(0xa5)
        }
      } else {
        this.sednMsgAddPDF(imgPath)
      }
    },

    SavePDF (path) {
      if (this.isIE) {
        var ret = this.axCam_Ocx.Convert2PDF(path)
        if (ret === 0) {
          this.InfoCallback(0x06)
        } else if (ret === -1) {
          this.InfoCallback(0xa1)
        }
      } else {
        this.sednMsgSavePDF(path)
      }
    },

    CombineTwoImage (combinePath, ImgPath1, ImgPath2, dir) {
      if (this.isIE) {
        var ret = this.axCam_Ocx.CombineTwoImage(combinePath, ImgPath1, ImgPath2, dir)
        if (ret === 0) {
          this.InfoCallback(0x07)
        } else {
          this.InfoCallback(0xad)
        }
      } else {
        if (dir !== 1) dir = 0
        this.sendMsgCombineTwoImage(ImgPath1, ImgPath2, combinePath, dir)
      }
    },

    CombineTwoImageBase64 (ImgPath1, ImgPath2, dir) {
      if (this.isIE) {
        var ret = this.axCam_Ocx.CombineTwoImageBase64(ImgPath1, ImgPath2, dir)
        if (ret.length > 0) {
          this.InfoTextCallback(5, ret)
        } else {
          this.InfoCallback(0xad)
        }
      } else {
        if (dir !== 1) dir = 0
        this.sendMsgCombineTwoImageBase64(ImgPath1, ImgPath2, dir)
      }
    },

    CombineTwoImageInside (combinePath, ImgPath1, ImgPath2, xoff, yoff) {
      if (this.isIE) {
        var ret = this.axCam_Ocx.CombineTwoImageInside(combinePath, ImgPath1, ImgPath2, xoff, yoff)
        if (ret === 0) {
          this.InfoCallback(0x07)
        } else {
          this.InfoCallback(0xad)
        }
      } else {
        this.sendMsgCombineTwoImageInside(ImgPath1, ImgPath2, combinePath, xoff, yoff)
      }
    },

    CombineTwoImageInsideBase64 (ImgPath1, ImgPath2, xoff, yoff) {
      if (this.isIE) {
        var ret = this.axCam_Ocx.CombineTwoImageInsideBase64(ImgPath1, ImgPath2, xoff, yoff)
        if (ret.length > 0) {
          this.InfoTextCallback(5, ret)
        } else {
          this.InfoCallback(0xad)
        }
      } else {
        this.sendMsgCombineTwoImageInsideBase64(ImgPath1, ImgPath2, xoff, yoff)
      }
    },

    UpdataFile (ip, port, method, imgPath) {
      if (this.isIE) {
        var ret = this.axCam_Ocx.UpdataFile(ip, port, method, imgPath)
        if (ret === 0) {
          this.InfoCallback(0x12)
        } else {
          this.InfoCallback(0xa9)
        }
      } else {
        this.sendMsgUploadFilePort(port, ip, method, imgPath)
      }
    },

    GetBase64FromFile (path) {
      if (this.isIE) {
        var basestr = this.axCam_Ocx.GetBase64FromFile(path)
        this.InfoTextCallback(5, basestr)
      } else {
        this.sednMsgGetBase64(path)
      }
    },

    CloseWaterMark () {
      if (this.isIE) {
        this.axCam_Ocx.SetAddMark(0)
      } else {
        this.sednMsgWaterMarkClose()
      }
    },

    OpenWaterMark (waterinfo, FontSize, FontSytle, r, g, b, xOff, yOff) {
      if (this.isIE) {
        this.axCam_Ocx.SetAddMark(1)
        this.axCam_Ocx.SetWaterMark(waterinfo, FontSize, FontSytle, r, g, b, xOff, yOff)
      } else {
        this.sednMsgWaterMarkOpen(waterinfo, FontSize, FontSytle, r, g, b, xOff, yOff)
      }
    },

    SetJiubianModel (type) {
      if (this.isIE) {
        this.axCam_Ocx.setJiubianModel(type)
      } else {
        this.sendMsgSetJiubianModel(type)
      }
    },

    SetBuBai (type) {
      if (this.isIE) {
        this.axCam_Ocx.setBuBai(type)
      } else {
        this.sednMsgBubaiType(type)
      }
    },

    SetQudise (type) {
      if (this.isIE) {
        this.axCam_Ocx.setQudise(type)
      } else {
        this.sednMsgQuqudiseType(type)
      }
    },

    SetFileNameCustom (str, index) {
      if (this.isIE) {
        this.axCam_Ocx.setFileNameCustom(str, index)
      } else {
        this.sendMsgSetFileNameModelCustom(index, str)
      }
    },

    SetFileNameCustom2 (str, index) {
      if (this.isIE) {
        this.axCam_Ocx2.setFileNameCustom(str, index)
      } else {
        this.sendMsgSetFileNameModelCustomSecond(index, str)
      }
    },

    SetFileNameFixed (str) {
      if (this.isIE) {
        this.axCam_Ocx.setFileNameFixed(str)
      } else {
        this.sendMsgSetFileNameModelFixed(str)
      }
    },

    SetFileNameFixed2 (str) {
      if (this.isIE) {
        this.axCam_Ocx2.setFileNameFixed(str)
      } else {
        this.sendMsgSetFileNameModelFixedSecond(str)
      }
    },

    SetFileNameTime () {
      if (this.isIE) {
        this.axCam_Ocx.setFileNameTime()
      } else {
        this.sendMsgSetFileNameModelTime()
      }
    },

    SetFileNameTime2 () {
      if (this.isIE) {
        this.axCam_Ocx2.setFileNameTime()
      } else {
        this.sendMsgSetFileNameModelTimeSecond()
      }
    },

    SetAutoExposure (type) {
      if (this.isIE) {
        this.axCam_Ocx.SetAutoExposure(type)
        if (type === 1) {
          this.InfoCallback(0x17)
        } else if (type === 0) {
          this.InfoCallback(0x18)
        }
      } else {
        this.sendMsgSetAutoExposure(type)
      }
    },

    GetCamParameter () {
      if (this.isIE) {
        var brightnessValue = this.axCam_Ocx.GetBrightnessRange()
        this.InfoTextCallback(23, brightnessValue)
        var exposureValue = this.axCam_Ocx.GetExposureRange()
        this.InfoTextCallback(22, exposureValue)
      } else {
        this.sendMsgGetExposureRange()
        this.sendMsgGetBrightnessRange()
      }
    },

    SetExposure (value) {
      if (this.isIE) {
        this.axCam_Ocx.SetExposure(value)
      } else {
        this.sendMsgSetExposure(value)
      }
    },

    SetBrightness (value) {
      if (this.isIE) {
        this.axCam_Ocx.SetBrightness(value)
      } else {
        this.sendMsgSetBrightness(value)
      }
    },

    GetCamNum () {
      if (this.isIE) {
        var num = this.axCam_Ocx.GetDevCount()
        // GetDevCount(num);
        this.InfoTextCallback(26, num)
      } else {
        this.sendMsgGetCamNum()
      }
    },

    DeleteFile (path) {
      if (this.isIE) {
        var ret = this.axCam_Ocx.DeleteFileImage(path)
        if (ret === 1) {
          this.InfoTextCallback(6, path)
        } else {
          this.InfoCallback(0xa2)
        }
      } else {
        this.sendMsgDeleteFile(path)
      }
    },

    SetJpgQuanlity (value) {
      if (this.isIE) {
        this.axCam_Ocx.SetJpgQuanlity(value)
      } else {
        this.sendMsgSetJpgQuanlity(value)
      }
    },

    SetJpgQuanlity2 (value) {
      if (this.isIE) {
        this.axCam_Ocx2.SetJpgQuanlity(value)
      } else {

      }
    },

    SetCusCropPlace (cutX, cutY, cutW, cutH) {
      if (this.isIE) {
        this.axCam_Ocx.SetCusCropPlace(cutX, cutY, cutW, cutH)
      } else {
        this.SetCusCropPlaceWs(cutX, cutY, cutW, cutH)
      }
    },

    SetCusCropPlace2 (cutX, cutY, cutW, cutH) {
      if (this.isIE) {
        this.axCam_Ocx2.SetCusCropPlace(cutX, cutY, cutW, cutH)
      } else {
        this.SetCusCropPlaceWs2(cutX, cutY, cutW, cutH)
      }
    },

    GetICPictureAll () {
      if (this.isIE) {
        var picBase64 = this.axCam_Ocx.GetICPictureAll()
        this.InfoTextCallback(25, picBase64)
      } else {
        this.sendMsgGetICPictureAll()
      }
    },

    InitFinger () {
      if (this.isIE) {
        var ret = this.axCam_Ocx.InitFinger()
        if (ret === 1) {
          this.InfoCallback(0x25)
        } else this.InfoCallback(0x26)
      } else {
        this.sendMsgInitFinger()
      }
    },

    StartFinger () {
      if (this.isIE) {
        var ret = this.axCam_Ocx.StartFinger()
        if (ret === 1) {
          this.InfoCallback(0x30)
        } else if (ret === -1) {
          this.InfoCallback(0x27)
        } else if (ret === -2) {
          this.InfoCallback(0x28)
        } else if (ret === -3) {
          this.InfoCallback(0xb1)
        } else if (ret === -4) {
          this.InfoCallback(0x31)
        }
      } else {
        this.sendMsgStartFinger()
      }
    },

    CloseFinger () {
      if (this.isIE) {
        this.axCam_Ocx.CloseFinger()
        this.InfoCallback(0x32)
      } else {
        this.sendMsgCloseFinger()
      }
    },

    BeginVideo (filename, id, frameModel) {
      var frame = 4
      if (frameModel === 1) {
        frame = 8
      } else if (frameModel === 2) {
        frame = 12
      }
      if (this.isIE) {
        var ret = this.axCam_Ocx.BeginVideoID(filename, id, frame)
        if (ret === 1) {
          this.InfoCallback(0x34)
        } else if (ret === -1) {
          this.InfoCallback(0xb2)
        } else if (ret === -2) {
          this.InfoCallback(0x36)
        }
      } else {
        this.sendMsgBeginVideo(filename, id, frame)
      }
    },

    StopVideo () {
      if (this.isIE) {
        this.axCam_Ocx.StopVideo()
      } else {
        this.sendMsgStopVideo()
      }
    },

    BeginVideoSecond (filename, id, frameModel) {
      var frame = 4
      if (frameModel === 1) {
        frame = 8
      } else if (frameModel === 2) {
        frame = 12
      }
      if (this.isIE) {
        var ret = this.axCam_Ocx2.BeginVideoID(filename, id, frame)
        if (ret === 1) {
          this.InfoCallback(0x37)
        } else if (ret === -1) {
          this.InfoCallback(0xb3)
        } else if (ret === -2) {
          this.InfoCallback(0x39)
        }
      } else {
        this.sendMsgBeginVideoSecond(filename, id, frame)
      }
    },

    StopVideoSecond () {
      if (this.isIE) {
        this.axCam_Ocx2.StopVideo()
      } else {
        this.sendMsgStopVideoSecond()
      }
    },

    GetAudioName () {
      if (this.isIE) {
        var str = this.axCam_Ocx.GetAudioName()
        if (str === '-1') {
          this.InfoCallback(0x36)
        } else if (str === '0') {
          this.InfoCallback(0xb4)
        } else this.InfoTextCallback(27, str)
      } else {
        this.sendMsgGetAudioName()
      }
    },

    ReadBarQrcodeD (type) {
      if (this.isIE) {
        var code = this.axCam_Ocx.ReadBarQrcodeD(type)
        if (type === 1) {
          this.InfoTextCallback(2, code)
        } else if (type === 2) {
          this.InfoTextCallback(7, code)
        }
      } else {
        this.sednMsgBarQrcode(type)
      }
    },

    MakeDir (path) {
      if (this.isIE) {
        var ret = this.axCam_Ocx.MakeDir(path)
        if (ret === 1) {
          this.InfoCallback(0x44)
        } else this.InfoCallback(0x45)
      } else {
        this.sendMsgMakeDir(path)
      }
    },

    AutoFoucs () {
      if (this.isIE) {
        this.axCam_Ocx.AutoFoucs()
      } else {
        this.sendMsgAutoFoucs()
      }
    },

    FaceCheckInit () {
      if (this.isIE) {
        var ret = this.axCam_Ocx.FaceCheckInit()
        if (ret === 1) {
          this.InfoCallback(0x46)
        } else this.InfoCallback(0xb8)
      } else {
        this.sednMsgFaceCheckInit()
      }
    },

    FaceCheckUninit () {
      if (this.isIE) {
        this.axCam_Ocx.FaceCheckUninit()
      } else {
        this.sednMsgFaceCheckUninit()
      }
    },

    StartFaceCheck () {
      if (this.isIE) {
        var ret = this.axCam_Ocx.StartFaceCheck()
        if (ret === 1) {
          this.InfoCallback(0x47)
        } else if (ret === -1) {
          this.InfoCallback(0xb9)
        } else if (ret === -2) {
          this.InfoCallback(0xba)
        }
      } else {
        this.sednMsgStartFaceCheck()
      }
    },

    StopFaceCheck () {
      if (this.isIE) {
        this.axCam_Ocx.StopFaceCheck()
      } else {
        this.sednMsgStopFaceCheck()
      }
    },

    FaceCheckInitSecond () {
      if (this.isIE) {
        var ret = this.axCam_Ocx2.FaceCheckInit()
        if (ret === 1) {
          this.InfoCallback(0x46)
        } else this.InfoCallback(0xb8)
      } else {
        this.sednMsgFaceCheckInitSecond()
      }
    },

    FaceCheckUninitSecond () {
      if (this.isIE) {
        this.axCam_Ocx2.FaceCheckUninit()
      } else {
        this.sednMsgFaceCheckUninitSecond()
      }
    },

    StartFaceCheckSecond () {
      if (this.isIE) {
        var ret = this.axCam_Ocx2.StartFaceCheck()
        if (ret === 1) {
          this.InfoCallback(0x47)
        } else if (ret === -1) {
          this.InfoCallback(0xb9)
        } else if (ret === -2) {
          this.InfoCallback(0xba)
        }
      } else {
        this.sednMsgStartFaceCheckSecond()
      }
    },

    StopFaceCheckSecond () {
      if (this.isIE) {
        this.axCam_Ocx2.StopFaceCheck()
      } else {
        this.sednMsgStopFaceCheckSecond()
      }
    },

    UninitBankCard () {
      if (this.isIE) {
        this.axCam_Ocx.UninitBankCard()
      } else {
        this.sednMsgBankCardFun(0)
      }
    },

    InitBankCard () {
      if (this.isIE) {
        var ret = this.axCam_Ocx.InitBankCard()
        if (ret === 1) {
          this.InfoCallback(0x4d)
        } else {
          this.InfoCallback(0xbc)
        }
      } else {
        this.sednMsgBankCardFun(1)
      }
    },

    GetBankCardNo () {
      if (this.isIE) {
        var ret = this.axCam_Ocx.GetBankCardNo()
        if (ret.length > 10) {
          this.InfoTextCallback(29, ret)
        } else if (ret === '-1') {
          this.InfoCallback(0xbd)
        } else if (ret === '-2') {
          this.InfoCallback(0xbe)
        } else if (ret === '-3') {
          this.InfoCallback(0xbf)
        } else if (ret === '-5') {
          this.InfoCallback(0xc0)
        } else {
          this.InfoCallback(0xc1)
        }
      } else {
        this.sednMsgBankCardFun(2)
      }
    },

    InitFingerFun () {
      if (this.isIE) {
        var ret = this.axCam_Ocx.InitFingerFun()
        if (ret === 1) {
          this.InfoCallback(0x4e)
        } else {
          this.InfoCallback(0x4f)
        }
      } else {
        this.sendMsgInitFingerFunOrCloase(1)
      }
    },

    CloseFingerFun () {
      if (this.isIE) {
        this.axCam_Ocx.CloseFingerFun()
      } else {
        this.sendMsgInitFingerFunOrCloase(0)
      }
    },

    RegisterFinger () {
      if (this.isIE) {
        var ret = this.axCam_Ocx.RegisterFingerData()
        if (ret === 1) {
          this.InfoCallback(0x56)
        } else if (ret === -1) {
          this.InfoCallback(0x57)
        } else if (ret === -2) {
          this.InfoCallback(0x58)
        } else if (ret === -3) {
          this.InfoCallback(0x59)
        }
      } else {
        this.sendMsgRegisterFinger()
      }
    },

    StopRegisterFinger () {
      if (this.isIE) {
        this.axCam_Ocx.StopRegisterFinger()
      } else {
        this.sednMsgStopRegisterFinger()
      }
    },

    VerifyFinger (fingerLen, fingerBase64) {
      if (this.isIE) {
        var ret = this.axCam_Ocx.VerifyFingerBase64(fingerBase64, fingerLen)
        if (ret === 1) {
          this.InfoCallback(0x5d)
        } else if (ret === -1) {
          this.InfoCallback(0x57)
        } else if (ret === -2) {
          this.InfoCallback(0x5a)
        } else if (ret === -3) {
          this.InfoCallback(0x5b)
        } else if (ret === -4) {
          this.InfoCallback(0x5c)
        }
      } else {
        this.sendMsgVerifyFingerBase64(fingerLen, fingerBase64)
      }
    },

    StopVerifyFinger () {
      if (this.isIE) {
        this.axCam_Ocx.StopVerifyFinger()
      } else {
        this.sednMsgStopVerifyFinger()
      }
    },

    GetFingerDataLen () {
      if (this.isIE) {
        var len = this.axCam_Ocx.GetFingerDataLen()
        this.InfoTextCallback(34, len)
      } else {
        this.sendMsgGetFinger(0)
      }
    },

    GetFingerBase64 () {
      if (this.isIE) {
        var str = this.axCam_Ocx.GetFingerBase64()
        this.InfoTextCallback(33, str)
      } else {
        this.sendMsgGetFinger(1)
      }
    },

    GetFingerImgBase64 () {
      if (this.isIE) {
        var str = this.axCam_Ocx.GetFingerImgBase64()
        if (str.length > 0) {
          this.InfoTextCallback(36, str)
        } else this.InfoCallback(0x66)
      } else {
        this.sendMsgGetFinger(2)
      }
    },

    FaceStratDouble () {
      if (this.isIE) {
        this.axCam_Ocx.FaceStratDouble()
        this.axCam_Ocx2.FaceStratDouble()
      } else {
        this.sednMsgQFaceStratDoubleOrClose(1)
      }
    },

    FaceCloseDouble () {
      if (this.isIE) {
        this.axCam_Ocx.FaceCloseDouble()
        this.axCam_Ocx2.FaceCloseDouble()
      } else {
        this.sednMsgQFaceStratDoubleOrClose(0)
      }
    },

    FaceCheckInitDouble () {
      if (this.isIE) {
        this.FaceCheckInit()
        this.FaceCheckInitSecond()
      } else {
        this.sednMsgFaceCheckInitDouble()
      }
    },

    SetDpi (xdpi, ydpi) {
      if (this.isIE) {
        this.axCam_Ocx.SetDpi(xdpi, ydpi)
      } else {
        this.sendMsgSetDpi(xdpi, ydpi)
      }
    },

    ReleaseAll () {
      if (this.isIE) {

      } else {
        this.sednMsgReleaseAll()
      }
    },

    SetDebugModel () {
      if (this.isIE) {

      } else {
        this.sendMsgSetDebugModel()
      }
    },

    InitFaceCheck () {
      if (this.isIE) {
        var ret = this.axCam_Ocx.InitFaceCheck()
        if (ret === 1) {
          this.InfoCallback(0x5f)
        } else {
          this.InfoCallback(0x60)
        }
      } else {
        this.sendMsgFaceCheck(1)
      }
    },

    DeInitFaceCheck () {
      if (this.isIE) {
        this.axCam_Ocx.DeInitFaceCheck()
      } else {
        this.sendMsgFaceCheck(0)
      }
    },

    CaptureFace () {
      if (this.isIE) {
        this.axCam_Ocx.CaptureFace()
      } else {
        this.sendMsgCaptureFace()
      }
    },

    CaptureFaceStr () {
      if (this.isIE) {
        this.axCam_Ocx.CaptureFaceStr()
      } else {

      }
    },

    InitFaceCheckSecond () {
      if (this.isIE) {
        var ret = this.axCam_Ocx2.InitFaceCheck()
        if (ret === 1) {
          this.InfoCallback(0x61)
        } else {
          this.InfoCallback(0x62)
        }
      } else {
        this.sendMsgFaceCheckSecond(1)
      }
    },

    DeInitFaceCheckSecond () {
      if (this.isIE) {
        this.axCam_Ocx2.DeInitFaceCheck()
      } else {
        this.sendMsgFaceCheckSecond(0)
      }
    },

    CaptureFaceSecond () {
      if (this.isIE) {
        this.axCam_Ocx2.CaptureFace()
      } else {
        this.sendMsgCaptureFaceSecond()
      }
    },

    CaptureFaceStrSecond () {
      if (this.isIE) {
        this.axCam_Ocx2.CaptureFaceStr()
      } else {

      }
    },

    AddFingerBase64 (fingerLen, fingerBase64) {
      if (this.isIE) {
        var ret = this.axCam_Ocx.AddFingerBase64(fingerBase64, fingerLen)
        if (ret === 1) {
          this.InfoCallback(0x6e)
        } else {
          this.InfoCallback(0x6f)
        }
      } else {
        this.sendMsgAddFingerBase64(fingerLen, fingerBase64)
        // sendMsgVerifyFingerBase64(fingerLen,fingerBase64);
      }
    },

    ClearAllFingerBase64 () {
      if (this.isIE) {
        this.axCam_Ocx.ClearAllFingerBase64()
      } else {
        this.sendMsgClearAllFingerBase64()
      }
    },

    VerifyFingerAllBase64 () {
      if (this.isIE) {
        var ret = this.axCam_Ocx.VerifyFingerAllBase64()
        if (ret === 1) {
          this.InfoCallback(0x5d)
        } else if (ret === -1) {
          this.InfoCallback(0x57)
        } else if (ret === -2) {
          this.InfoCallback(0x5a)
        } else if (ret === -3) {
          this.InfoCallback(0x5b)
        } else if (ret === -4) {
          this.InfoCallback(0x5c)
        }
      } else {
        this.sendMsgVerifyFingerAllBase64()
      }
    },

    CheckCamDev () {
      if (this.isIE) {
        var ret = this.axCam_Ocx.CheckCamDev()
        if (ret === 1) {
          this.InfoCallback(0x67)
        } else {
          this.InfoCallback(0x68)
        }
      } else {
        this.sendMsgCheckCamDev()
      }
    },

    SetFoucs (value) {
      if (this.isIE) {
        this.axCam_Ocx.SetFoucs(0, value)
      } else {
        this.sendMsgSetFoucs(value)
      }
    },

    getCanvasPos (canvas, e) { // 获取鼠标在canvas上的坐标
      var rect = canvas.getBoundingClientRect()

      if (e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom) {
        return true
      } else return false
    },

    scrollFunc (e) {
      e = e || window.event

      var ret = false
      if (this.isIE) {
        ret = this.getCanvasPos(this.axCam_Ocx, e)
      } else ret = this.getCanvasPos(this.canvas, e)

      // console.log("测试测试测试y:"+yyyy);
      if (ret) {
        if (e.wheelDelta) { // IE/Opera/Chrome
          if (e.wheelDelta > 100) {
            this.ZoomOut()
          } else if (e.wheelDelta < -100) {
            this.ZoomIn()
            if (!this.isIE) {
              this.canvasX = 0
              this.canvasY = 0
            }
          }
        } else if (e.detail) { // Firefox
          // t2.value=e.detail;
          if (e.detail >= 3) {
            this.ZoomIn()
            if (!this.isIE) {
              this.canvasX = 0
              this.canvasY = 0
            }
          } else if (e.detail <= -3) {
            this.ZoomOut()
          }
        }
        if (e.stopPropagation) e.stopPropagation()
        else e.cancelBubble = true

        if (e.preventDefault) e.preventDefault()
        else e.returnValue = false
        return false
      } else return true
    }
  },
  mounted () {
    if (this.type === 0) {
      // 视频开始显示
    } else if (this.type === 1) {
      // 拍照的路径
      this.InfoTextCallback(0, this.str)
    } else if (this.type === 4) {
      // 摄像头数量变化时
      // var camNum = parseInt(str);
      // GetDevCount(camNum);
      this.InfoTextCallback(26, this.str)
    } else if (this.type === 2) {

      // ShowInfo("智能连拍数量 = "+str+"\r\n");
    } else if (this.type === 3) {
      // ShowInfo("定时连拍数量 = "+str+"\r\n");
    } else if (this.type === 5) {
      // 图片保存失败
      this.InfoTextCallback(8, this.str)
    } else if (this.type === 6) {
      var strsMessage = []
      strsMessage = this.str.split('**')
      for (var i = 0; i < strsMessage.length - 1; i++) {
        this.InfoTextCallback(9 + i, strsMessage[i])
      }
      var picBase64 = this.axCam_Ocx.GetICPicture()
      this.InfoTextCallback(19, picBase64)
    } else if (this.type === 7) {
      // 未发现身份证模块
      this.InfoCallback(0x1e)
    } else if (this.type === 8) {
      // base64
      this.InfoTextCallback(5, this.str)
    } else if (this.type === 9) {
      // base64
      this.LoadOver()
    } else if (this.type === 10) {
      // base64
      this.InfoTextCallback(24, this.str)
    } else if (this.type === 11) {
      var value = parseInt(this.str)
      if (value === 0) {
        this.InfoCallback(0x33)
      } else if (value === 1) {
        this.InfoCallback(0x29)
      }
    } else if (this.type === 12) {
      // base64
      this.InfoCallback(0x35)
    } else if (this.type === 13) {
      // base64
      this.InfoTextCallback(28, this.str)
    } else if (this.type === 14) {
      // base64
      this.InfoCallback(0xbb)
    } else if (this.type === 15) {
      let value = parseInt(this.str)
      if (value === 1) {
        this.InfoCallback(0x50)
      } else this.InfoCallback(0x51)
    } else if (this.type === 16) {
      this.InfoCallback(0x52)
    } else if (this.type === 17) {
      this.InfoCallback(0x53)
    } else if (this.type === 18) {
      let value = parseInt(this.str)
      if (value !== 0) {
        // InfoCallback(0x54);
        this.InfoTextCallback(37, value)
      } else this.InfoCallback(0x55)
    } else if (this.type === 19) {
      this.InfoTextCallback(28, this.str)

      this.axCam_Ocx2.FaceDoubleOK()
    }

    this.loadActiveX()
  }
}
</script>

<style>
</style>
