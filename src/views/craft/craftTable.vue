<template>
  <div class='printHtml'
    id="craftTable"
    @click="showRMeau = false"
    @click.right="showRMeau = false">
    <div class="printTable">
      <div class="print_head">
        <div class="left">
          <span class="title">{{companyName}}工艺单</span>
          <span class="item">
            <span class="label">工艺单编号</span>
            {{craftDetail.craft_code}}
          </span>
          <span class="item">
            <span class="label">产品编号</span>
            <span style="font-weight:bold">{{`${craftDetail.product_info.product_code}`}}</span>
          </span>
          <span class="item">
            <span class="label">创建信息</span>
            {{`${craftDetail.user_name}，${craftDetail.user_phone}，`}}
            <printTime :data-time='$getTime(craftDetail.create_time)' />
          </span>
        </div>
        <div class="right">
          <span class="qrCode_box"
            style="margin-right:16px"
            v-if="craftDetail.product_info.img.length>0">
            <img :src="craftDetail.product_info.img[0].image_url" />
          </span>
          <span class="text"
            v-else>
            扫一扫
            <br />
            更新生产进度
          </span>
          <span class="qrCode_box">
            <img :src="qrCodeUrl" />
          </span>
        </div>
      </div>
      <div class="print_body">
        <div class="print_row">
          <span class="row_item w100 center">{{$route.params.type==='1'?'产':'样'}}品名称</span>
          <span class="row_item left">{{craftDetail.product_info.title}}</span>
          <span class="row_item w100 center">客户款号</span>
          <span class="row_item left">{{craftDetail.product_info.style_code || ''}}</span>
          <span class="row_item w100 center">其它信息</span>
          <span class="row_item left">{{craftDetail.other_info}}</span>
        </div>
        <div class="print_row">
          <span class="row_item w100 center">工艺单名称</span>
          <span class="row_item left">{{craftDetail.title || ''}}</span>
          <span class="row_item w100 center">大身规格</span>
          <span class="row_item left">{{craftDetail.size ? craftDetail.size + 'cm' : ''}}</span>
          <span class="row_item w100 center">大身克重</span>
          <span class="row_item left">{{craftDetail.weight ? craftDetail.weight + 'g' : ''}}</span>
        </div>
        <!-- 经向 -->
        <div class="print_row h261">
          <span class="w50 col_title">原料经向</span>
          <span class="row_item col">
            <span class="print_row h70 noBorder">
              <span class="row_item w180 center">经向原料</span>
              <span class="row_item left">
                <template v-for="item in warp_data.material_data.filter(vals=>vals.type_material === 1)">
                  {{item.apply|filterMaterialClass}}
                  <!-- <span class="apply_item">{{item.apply|filterMaterialClass}}</span> -->
                  {{':' + item.material_name }}
                  ({{yarn_coefficient.find(itemFind=>itemFind.name===item.material_name)?yarn_coefficient.find(itemFind=>itemFind.name===item.material_name).chuankou: warp_data.reed_method}}根/筘)
                </template>
                <template v-for="item in warp_data.material_data.filter(vals=>vals.type_material === 2)">
                  {{item.apply|filterMaterialClass}}
                  {{':' + item.material_name }}
                  ({{yarn_coefficient.find(itemFind=>itemFind.name===item.material_name)?yarn_coefficient.find(itemFind=>itemFind.name===item.material_name).chuankou: warp_data.reed_method}}根/筘)
                </template>
                <template v-for="item in warp_data.assist_material">
                  {{item.apply.map(itemM=>itemM.value)|filterMaterialClass}}
                  {{':' + item.material_name }}
                  ({{item.apply.map(itemM=>+itemM.weight).reduce((total,current)=>total+current,0)}}g)
                </template>
              </span>
            </span>
            <span class="print_row maxHeight">
              <span class="col_title">经向排列</span>
              <span class="row_item col"
                @click.right="handleClickRight">
                <template v-if="warp_data.length_is < 17 && weft_data.length_is < 17  && !warp_data.back_status && !weft_data.back_status">
                  <span class="print_row h31 noBorder">
                    <span class="row_item_span"
                      v-for="(item,index) in warp_data.warp_rank[0]"
                      :key="index">{{item}}</span>
                    <span class="row_item_span"
                      v-for="item in (16 - warp_data.length_is > 0 ? 16 - warp_data.length_is : 0)"
                      :key="item + 'false'"></span>
                  </span>
                  <span class="print_row h31">
                    <span class="row_item_span"
                      v-for="(item,index) in warp_data.warp_rank[1]"
                      :key="index">{{item === 0 ? '主' : '夹' + item}}</span>
                    <span class="row_item_span"
                      v-for="item in (16 - warp_data.length_is > 0 ? 16 - warp_data.length_is : 0)"
                      :key="item + 'false'"></span>
                  </span>
                  <span class="print_row h31">
                    <span class="row_item_span"
                      v-for="(item,index) in warp_data.warp_rank[2]"
                      :key="index">{{item}}</span>
                    <span class="row_item_span"
                      v-for="item in (16 - warp_data.length_is > 0 ? 16 - warp_data.length_is : 0)"
                      :key="item + 'false'"></span>
                  </span>
                  <span class="print_row h31">
                    <span v-for="(item,index) in mergeSpan(warp_data,3,'warp_rank','merge_data')"
                      :class="{'row_item_span':true,'isMerge':item.colspan && item.colspan > 1}"
                      :key="index"
                      :style="{'min-width':item.colspan * (100 / 16) + '%'}">
                      <span class="value_span">
                        {{item|filterValue}}
                        <span style="font-size:16px;color:rgba(0,0,0,1)"
                          v-if="item.value && (item.isSplit || item.colspan > 1) && (item.value.indexOf('[') === -1)">遍</span>
                        <span style="font-size:12px;color:rgba(0,0,0,1)"
                          v-if="item.totalNumber && (item.isSplit || item.colspan > 1)">
                          {{item.totalNumber || ''}}梭
                        </span>
                      </span>
                      <!-- 标记 -->
                      <span class="sign left"
                        :class="[`style${signType || 1}`,(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ? 'hidden' : '']"
                        v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                        <span class="auto_long_arrow left_to_right"
                          v-if="signType === '3'"></span>
                      </span>
                      <span class="sign right"
                        :class="[`style${signType || 1}`,(item.isSplit && (item.noRightJianTou || item.noJianTou)) ? 'hidden' : '']"
                        v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                        <span class="auto_long_arrow right_to_left"
                          v-if="signType === '3'"></span>
                      </span>
                    </span>
                    <span class="row_item_span"
                      v-for="item in (16 - warp_data.length_is > 0 ? 16 - warp_data.length_is : 0)"
                      :key="item + 'false'"></span>
                  </span>
                  <span class="print_row h31">
                    <span v-for="(item,index) in mergeSpan(warp_data,4,'warp_rank','merge_data')"
                      :class="{'row_item_span':true,'isMerge':item.colspan && item.colspan > 1}"
                      :key="index"
                      :style="{'min-width':item.colspan * (100 / 16) + '%'}">
                      <span class="value_span">
                        {{item|filterValue}}
                        <span style="font-size:16px;color:rgba(0,0,0,1)"
                          v-if="item.value && (item.isSplit || item.colspan > 1) && (item.value.indexOf('[') === -1)">遍</span>
                        <span style="font-size:12px;color:rgba(0,0,0,1)"
                          v-if="item.totalNumber && (item.isSplit || item.colspan > 1)">
                          {{item.totalNumber || ''}}梭
                        </span>
                      </span>
                      <!-- 标记 -->
                      <span class="sign left"
                        :class="[`style${signType || 1}`,(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ? 'hidden' : '']"
                        v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                        <span class="auto_long_arrow left_to_right"
                          v-if="signType === '3'"></span>
                      </span>
                      <span class="sign right"
                        :class="[`style${signType || 1}`,(item.isSplit && (item.noRightJianTou || item.noJianTou)) ? 'hidden' : '']"
                        v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                        <span class="auto_long_arrow right_to_left"
                          v-if="signType === '3'"></span>
                      </span>
                    </span>
                    <span class="row_item_span"
                      v-for="item in (16 - warp_data.length_is > 0 ? 16 - warp_data.length_is : 0)"
                      :key="item + 'false'"></span>
                  </span>
                  <span class="print_row h31">
                    <span v-for="(item,index) in mergeSpan(warp_data,5,'warp_rank','merge_data')"
                      :class="{'row_item_span':true,'isMerge':item.colspan && item.colspan > 1}"
                      :key="index"
                      :style="{'min-width':item.colspan * (100 / 16) + '%'}">
                      {{item.value}}
                      <!-- <span style="font-size:12px;color:rgba(0,0,0,1)"
                        v-if="item.value && (item.isSplit || item.colspan > 1) && (item.value.indexOf('[') === -1)">遍</span> -->
                    </span>
                    <span class="
                      row_item_span"
                      v-for="item in (16 - warp_data.length_is > 0 ? 16 - warp_data.length_is : 0)"
                      :key="item + 'false'"></span>
                  </span>
                </template>
                <template v-else>见附件</template>
              </span>
            </span>
          </span>
        </div>
        <!-- 整经工艺 -->
        <div class="print_row h80">
          <span class="col_title noPadding"
            style="font-size:18px">整经工艺</span>
          <span class="row_item col">
            <span class="print_row h40 noBorder">
              <span class="row_item w140 center">整经总头纹</span>
              <span class="row_item left">{{warp_data.weft}}</span>
              <span class="row_item w140 center">边型</span>
              <span class="row_item left">{{warp_data.side_name}}</span>
              <span class="row_item w140 center">综页</span>
              <span class="row_item left unit">
                {{warp_data.sum_up || ''}}
                <span class="text">页</span></span>
            </span>
            <span class="print_row h40">
              <span class="row_item w140 center">整经门幅</span>
              <span class="row_item left unit">
                {{warp_data.width || ''}}
                <span class="text">根</span>
              </span>
              <span class="row_item w140 center">机型</span>
              <span class="row_item left">{{warp_data.machine_name}}</span>
              <span class="row_item w140 center">其它</span>
              <span class="row_item left"></span>
            </span>
          </span>
        </div>
        <!-- 穿筘法 -->
        <div class="print_row h252">
          <span class="col_title">穿综筘工艺</span>
          <span class="row_item col">
            <span class="print_row noBorder h35">
              <span class="row_item w180 center">筘号</span>
              <span class="row_item w100 left unit">
                {{warp_data.reed ? warp_data.reed : ''}}
                <span class="text">#</span>
              </span>
              <span class="row_item w140 center">穿筘法</span>
              <span class="row_item w100 left unit">
                {{warp_data.reed_method ? warp_data.reed_method : ''}}
                <span class="text">根/筘</span>
              </span>
              <span class="row_item w140 center">筘幅</span>
              <span class="row_item left unit">
                {{warp_data.reed_width_data ? warp_data.reed_width_data : warp_data.reed_width ? warp_data.reed_width : ''}}
                <span class="text">cm</span>
              </span>
            </span>
            <span class="print_row maxHeight">
              <span class="col_title"
                style="height:auto">穿综法</span>
              <span class="row_item col"
                v-if="(WBL || 5) >= craftDetail.draft_method.GLShow.map(itemG=>itemG.length).reduce((total,current)=>total+current,0)">
                <span class="print_row noBorder h40">
                  <span class="row_item w130 center noBorder">穿综法循环：</span>
                  <span class="row_item left">{{craftDetail.draft_method|filterThroughMethod}}</span>
                </span>
                <span class="print_row maxHeight"
                  @click.right="handleClickRight($event,2)">
                  <template v-for="(itemOut,indexOut) in craftDetail.draft_method.GLShow">
                    <span class="row_item noBorder center WBXHSIGN"
                      v-for="(item,index) in itemOut"
                      :key="`${indexOut}-${index}`">
                      <div :class="['WBXHSIGN__left',{'hidden':!findWBXHItem(indexOut,craftDetail.draft_method.GLXuhao[indexOut] && craftDetail.draft_method.GLXuhao[indexOut][index] || (index + 1)).left}]"></div>
                      <span class="index"
                        :class="GLMapArr[indexOut][index]"
                        :content="`${letterArr[indexOut]}${craftDetail.draft_method.GLXuhao[indexOut] && craftDetail.draft_method.GLXuhao[indexOut][index] || (index + 1)}`">{{`${letterArr[indexOut]}${craftDetail.draft_method.GLXuhao[indexOut] && craftDetail.draft_method.GLXuhao[indexOut][index] || (index + 1)}`}}</span>
                      <span class="detail">
                        <span class="item">{{item[0]}}</span>
                        <span class="item">{{item[1]}}</span>
                        <span class="item">{{item[2]}}</span>
                        <div class="WBXHSIGN__right"
                          v-if="findWBXHItem(indexOut,craftDetail.draft_method.GLXuhao[indexOut] && craftDetail.draft_method.GLXuhao[indexOut][index] || (index + 1)).right">
                          <span class="repeat">X{{findWBXHItem(indexOut,craftDetail.draft_method.GLXuhao[indexOut] && craftDetail.draft_method.GLXuhao[indexOut][index] || (index + 1)).value}}遍</span>
                        </div>
                      </span>
                    </span>
                  </template>
                </span>
                <span class="print_row h40">
                  <span class="row_item w130 center noBorder">穿综备注：</span>
                  <span class="row_item left">{{craftDetail.draft_method.desc}}</span>
                </span>
                <span class="print_row h40">
                  <span class="row_item w130 center noBorder">纹版备注：</span>
                  <span class="row_item left">{{weft_data.contract_ratio}}</span>
                </span>
              </span>
              <span class="row_item center"
                v-else
                @click.right="handleClickRight($event,2)">见附件</span>
            </span>
          </span>
        </div>
        <!-- 织造工艺 -->
        <div class="print_row h331">
          <span class="col_title">织造工艺</span>
          <span class="row_item col">
            <span class="print_row h35 noBorder">
              <span class="row_item center w100">组织法</span>
              <span class="row_item left">{{weft_data.organization_name}}</span>
              <span class="row_item center w100">机上坯幅</span>
              <span class="row_item left unit">
                {{weft_data.peifu}}
                <span class="text">cm</span>
              </span>
              <span class="row_item center w100">纬密</span>
              <span class="row_item left unit">
                {{$toFixed(weft_data.total / (weft_data.neichang))}}
                <span class="text">梭/cm</span>
              </span>
              <span class="row_item center w100">齿牙</span>
              <span class="row_item left unit two_line">
                <span class="top">{{weft_data.shangchiya?weft_data.shangchiya:''}}</span>
                <span class="bottom">{{weft_data.xiachiya?weft_data.xiachiya:''}}</span>
                <span class="text">牙</span>
              </span>
            </span>
            <span class="print_row h35">
              <span class="row_item center w100">让位要求</span>
              <span class="row_item center w100">内长</span>
              <span class="row_item left unit">
                {{weft_data.neichang}}
                <span class="text">cm</span>
              </span>
              <span class="row_item center w100">让位</span>
              <span class="row_item left unit">
                {{weft_data.rangwei}}
                <span class="text">cm</span>
              </span>
              <span class="row_item center w100">总计</span>
              <span class="row_item left unit">
                {{weft_data.total}}
                <span class="text">梭</span>
              </span>
            </span>
            <span class="print_row h70">
              <span class="row_item w180 center">纬向原料</span>
              <span class="row_item left">
                <template v-for="item in weft_data.material_data.filter(vals=>vals.type_material === 1)">
                  {{item.apply|filterMaterialClass}}
                  {{':' + item.material_name }}
                </template>
                <template v-for="item in weft_data.material_data.filter(vals=>vals.type_material === 2)">
                  {{item.apply|filterMaterialClass}}
                  {{':' + item.material_name }}
                </template>
                <template v-for="item in weft_data.assist_material">
                  {{item.apply.map(itemM=>itemM.value)|filterMaterialClass}}
                  {{':' + item.material_name }}
                  ({{item.apply.map(itemM=>+itemM.weight).reduce((total,current)=>total+current,0)}}g)
                </template>
              </span>
            </span>
            <span class="print_row maxHeight">
              <span class="col_title">纬向排列</span>
              <span class="row_item col"
                @click.right="handleClickRight">
                <template v-if="warp_data.length_is < 17 && weft_data.length_is < 17  && !warp_data.back_status && !weft_data.back_status">
                  <span class="print_row h31 noBorder">
                    <span class="row_item_span"
                      v-for="(item,index) in weft_data.weft_rank[0]"
                      :key="index">{{item}}</span>
                    <span class="row_item_span"
                      v-for="item in (16 - weft_data.length_is > 0 ? 16 - weft_data.length_is : 0)"
                      :key="item + 'false'"></span>
                  </span>
                  <span class="print_row h31">
                    <span class="row_item_span"
                      v-for="(item,index) in weft_data.weft_rank[1]"
                      :key="index">{{item === 0 ? '主' : '夹' + item}}</span>
                    <span class="row_item_span"
                      v-for="item in (16 - weft_data.length_is > 0 ? 16 - weft_data.length_is : 0)"
                      :key="item + 'false'"></span>
                  </span>
                  <span class="print_row h31">
                    <span class="row_item_span"
                      v-for="(item,index) in weft_data.weft_rank[2]"
                      :key="index">{{item}}</span>
                    <span class="row_item_span"
                      v-for="item in (16 - weft_data.length_is > 0 ? 16 - weft_data.length_is : 0)"
                      :key="item + 'false'"></span>
                  </span>
                  <span class="print_row h31">
                    <span v-for="(item,index) in mergeSpan(weft_data,3,'weft_rank','merge_data')"
                      :class="{'row_item_span':true,'isMerge':item.colspan && item.colspan > 1}"
                      :key="index"
                      :style="{'min-width':item.colspan * (100 / 16) + '%'}">
                      <span class="value_span">
                        {{item|filterValue}}
                        <span style="font-size:16px;color:rgba(0,0,0,1)"
                          v-if="item.value && (item.isSplit || item.colspan > 1) && (item.value.indexOf('[') === -1)">遍</span>
                        <span style="font-size:12px;color:rgba(0,0,0,1)"
                          v-if="item.totalNumber && (item.isSplit || item.colspan > 1)">
                          {{item.totalNumber || ''}}梭
                        </span>
                      </span>
                      <!-- 标记 -->
                      <span class="sign left"
                        :class="[`style${signType || 1}`,(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ? 'hidden' : '']"
                        v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                        <span class="auto_long_arrow left_to_right"
                          v-if="signType === '3'"></span>
                      </span>
                      <span class="sign right"
                        :class="[`style${signType || 1}`,(item.isSplit && (item.noRightJianTou || item.noJianTou)) ? 'hidden' : '']"
                        v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                        <span class="auto_long_arrow right_to_left"
                          v-if="signType === '3'"></span>
                      </span>
                    </span>
                    <span class="row_item_span"
                      v-for="item in (16 - weft_data.length_is > 0 ? 16 - weft_data.length_is : 0)"
                      :key="item + 'false'"></span>
                  </span>
                  <span class="print_row h31">
                    <span v-for="(item,index) in mergeSpan(weft_data,4,'weft_rank','merge_data')"
                      :class="{'row_item_span':true,'isMerge':item.colspan && item.colspan > 1}"
                      :key="index"
                      :style="{'min-width':item.colspan * (100 / 16) + '%'}">
                      <span class="value_span">
                        {{item|filterValue}}
                        <span style="font-size:16px;color:rgba(0,0,0,1)"
                          v-if="item.value && (item.isSplit || item.colspan > 1) && (item.value.indexOf('[') === -1)">遍</span>
                        <span style="font-size:12px;color:rgba(0,0,0,1)"
                          v-if="item.totalNumber && (item.isSplit || item.colspan > 1)">
                          {{item.totalNumber || ''}}梭
                        </span>
                      </span>
                      <!-- 标记 -->
                      <span class="sign left"
                        :class="[`style${signType || 1}`,(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ? 'hidden' : '']"
                        v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                        <span class="auto_long_arrow left_to_right"
                          v-if="signType === '3'"></span>
                      </span>
                      <span class="sign right"
                        :class="[`style${signType || 1}`,(item.isSplit && (item.noRightJianTou || item.noJianTou)) ? 'hidden' : '']"
                        v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                        <span class="auto_long_arrow right_to_left"
                          v-if="signType === '3'"></span>
                      </span>
                    </span>
                    <span class="row_item_span"
                      v-for="item in (16 - weft_data.length_is > 0 ? 16 - weft_data.length_is : 0)"
                      :key="item + 'false'"></span>
                  </span>
                  <span class="print_row h31">
                    <span v-for="(item,index) in mergeSpan(weft_data,5,'weft_rank','merge_data')"
                      :class="{'row_item_span':true,'isMerge':item.colspan && item.colspan > 1}"
                      :key="index"
                      :style="{'min-width':item.colspan * (100 / 16) + '%'}">
                      {{item.value}}
                      <!-- <span style="font-size:12px;color:rgba(0,0,0,1)"
                        v-if="item.value && (item.isSplit || item.colspan > 1) && (item.value.indexOf('[') === -1)">遍</span> -->
                    </span>
                    <span class="row_item_span"
                      v-for="item in (16 - weft_data.length_is > 0 ? 16 - weft_data.length_is : 0)"
                      :key="item + 'false'"></span>
                  </span>
                </template>
                <template v-else>见附件</template>
              </span>
            </span>
          </span>
        </div>
        <!-- 配色 -->
        <div class="print_row h261"
          v-if="colourInfoType === '1'"
          @click.right="handleClickRight($event,3)">
          <span class="col_title">配色工艺</span>
          <span class="row_item col"
            v-if="zhujia_info.length < 6 && color_data.length < 4">
            <span class="print_row h60 noBorder bgGray">
              <span class="row_item w140 special_title">
                <span class="top_right">具体配色</span>
                <span class="bottom_left">颜色组</span>
              </span>
              <span class="row_item col"
                v-for="item in 5"
                :key="item">
                <span class="print_row h31 noBorder">
                  <span class="row_item center">{{item === 1 ? '主' : ('夹' + (item - 1))}}</span>
                </span>
                <span class="print_row h31">
                  <span class="row_item center">经</span>
                  <span class="row_item center">纬</span>
                </span>
              </span>
              <span class="row_item col">下机时间</span>
            </span>
            <span class="print_row h40">
              <span class="row_item bgGray w140 center">根数</span>
              <span class="row_item center"
                v-for="item in 5"
                :key="item">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    :style="{'font-size':returnSize(colorWeight.warp[item - 1] && colorWeight.warp[item - 1].number)}">{{(colorWeight.warp[item - 1] && colorWeight.warp[item - 1].number) ? colorWeight.warp[item - 1].number : ''}}</span>
                  <span class="row_item center"
                    :style="{'font-size':returnSize(colorWeight.weft[item - 1] && colorWeight.weft[item - 1].number)}">{{(colorWeight.weft[item - 1]&& colorWeight.weft[item - 1].number) ? colorWeight.weft[item - 1].number : ''}}</span>
                </div>
              </span>
              <span class="row_item center">{{warp_data.contract_ratio === '100' ? '' : warp_data.contract_ratio}}</span>
            </span>
            <span class="print_row h40">
              <span class="row_item bgGray w140 center">克重</span>
              <span class="row_item center"
                v-for="item in 5"
                :key="item">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    :style="{'font-size':returnSize((colorWeight.warp[item-1] && colorWeight.warp[item-1].weight) + 'g')}">{{(colorWeight.warp[item-1] && colorWeight.warp[item-1].weight) ? colorWeight.warp[item-1].weight + 'g' : ''}}</span>
                  <span class="row_item center"
                    :style="{'font-size':returnSize((colorWeight.weft[item-1] && colorWeight.weft[item-1].weight) + 'g')}">{{(colorWeight.weft[item-1] && colorWeight.weft[item-1].weight) ? colorWeight.weft[item-1].weight + 'g' : ''}}</span>
                </div>
              </span>
              <span class="row_item center">织造数量</span>
            </span>
            <span class="print_row h40"
              v-for="(item,index) in color_data"
              :key="index">
              <span class="row_item bgGray w140 center">{{item.product_color}}</span>
              <span class="row_item center"
                v-for="key in 5"
                :key="key">
                <span class="print_row h40 noBorder">
                  <span class="row_item center"
                    :style="{'font-size':returnSize(item.color_scheme.warp[key-1] ? item.color_scheme.warp[key-1].name : '')}">{{item.color_scheme.warp[key-1] ? item.color_scheme.warp[key-1].name : ''}}</span>
                  <span class="row_item center"
                    :style="{'font-size':returnSize(item.color_scheme.weft[key-1] ? item.color_scheme.weft[key-1].name : '')}"
                    v-if="!(item.color_scheme.warp[key-1] && item.color_scheme.weft[key-1] && (item.color_scheme.warp[key-1].name === item.color_scheme.weft[key-1].name))">{{item.color_scheme.weft[key-1] ? item.color_scheme.weft[key-1].name : ''}}</span>
                </span>
              </span>
              <span class="row_item center">{{item.number || ''}}</span>
            </span>
            <template v-if="color_data.length < 4">
              <span class="print_row h40"
                v-for="item in 3-color_data.length"
                :key="item+'false'">
                <span class="row_item bgGray w140 center"></span>
                <span class="row_item center"
                  v-for="item in 5"
                  :key="item">
                  <span class="print_row h40 noBorder">
                    <span class="row_item"></span>
                    <span class="row_item"></span>
                  </span>
                </span>
                <span class="row_item center"></span>
              </span>
            </template>
          </span>
          <span class="row_item col"
            v-else>见附件</span>
        </div>
        <div class="print_row h261"
          v-else-if="colourInfoType === '2'"
          @click.right="handleClickRight($event,3)">
          <span class="col_title">配色工艺</span>
          <span class="row_item col"
            v-if="(zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length) <= 10 && color_data.length < 4">
            <span class="print_row h60 noBorder bgGray">
              <span class="row_item w140 special_title">
                <span class="top_right">具体配色</span>
                <span class="bottom_left">颜色组</span>
              </span>
              <span class="row_item col"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <span class="print_row h31 noBorder">
                  <span class="row_item center">经向</span>
                </span>
                <span class="print_row h31">
                  <span class="row_item center"
                    v-for="(itemWarp,indexWarp) in zhujiaInfoCom.warp"
                    :key="indexWarp">{{itemWarp.key === 0 ? '主' : `夹${itemWarp.key}`}}</span>
                </span>
              </span>
              <span class="row_item col"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <span class="print_row h31 noBorder">
                  <span class="row_item center">纬向</span>
                </span>
                <span class="print_row h31">
                  <span class="row_item center"
                    v-for="(itemWeft,indexWeft) in zhujiaInfoCom.weft"
                    :key="indexWeft">{{itemWeft.key === 0 ? '主' : `夹${itemWeft.key}`}}</span>
                </span>
              </span>
              <span class="row_item col"
                :style="`flex:${10 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)}`">
                <span class="print_row h31 noBorder">
                  <span class="row_item center"></span>
                </span>
                <span class="print_row h31">
                  <span class="row_item center"
                    v-for="itemB in 10 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)"
                    :key="itemB"></span>
                </span>
              </span>
              <span class="row_item col w140">下机时间</span>
            </span>
            <span class="print_row h40">
              <span class="row_item bgGray w140 center">根数</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWarp,indexWarp) in zhujiaInfoCom.warp"
                    :key="`warp-${indexWarp}`"
                    :style="{'font-size':returnSize(itemWarp.number)}">{{itemWarp.number || ''}}</span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWeft,indexWeft) in zhujiaInfoCom.weft"
                    :key="`weft-${indexWeft}`"
                    :style="{'font-size':returnSize(itemWeft.number)}">
                    {{itemWeft.number || ''}}
                  </span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${10 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemB in (10 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length))"
                    :key="`buchong-${itemB}`"></span>
                </div>
              </span>
              <span class="row_item center w140">{{warp_data.contract_ratio === '100' ? '' : warp_data.contract_ratio}}</span>
            </span>
            <span class="print_row h40">
              <span class="row_item bgGray w140 center">克重</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWarp,indexWarp) in zhujiaInfoCom.warp"
                    :key="`warp-${indexWarp}`"
                    :style="{'font-size':returnSize(itemWarp.weight && `${itemWarp.weight}g` || '')}">{{itemWarp.weight && `${itemWarp.weight}g` || ''}}</span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWeft,indexWeft) in zhujiaInfoCom.weft"
                    :key="`weft-${indexWeft}`"
                    :style="{'font-size':returnSize(itemWeft.weight && `${itemWeft.weight}g` || '')}">{{itemWeft.weight && `${itemWeft.weight}g` || ''}}</span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${10 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemB in (10 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length))"
                    :key="`buchong-${itemB}`"></span>
                </div>
              </span>
              <span class="row_item center w140">织造数量</span>
            </span>
            <span class="print_row h40"
              v-for="(item,index) in color_data"
              :key="index">
              <span class="row_item bgGray w140 center">{{item.product_color}}</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWarp,indexWarp) in zhujiaInfoCom.warp"
                    :key="`warp-${indexWarp}`"
                    :style="{'font-size':returnSize(item.color_scheme.warp[itemWarp.key] && item.color_scheme.warp[itemWarp.key].name || '')}">{{item.color_scheme.warp[itemWarp.key] && item.color_scheme.warp[itemWarp.key].name || ''}}</span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWeft,indexWeft) in zhujiaInfoCom.weft"
                    :key="`weft-${indexWeft}`"
                    :style="{'font-size':returnSize(item.color_scheme.weft[itemWeft.key] && item.color_scheme.weft[itemWeft.key].name || '')}">{{item.color_scheme.weft[itemWeft.key] && item.color_scheme.weft[itemWeft.key].name || ''}}</span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${10 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemB in (10 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length))"
                    :key="`buchong-${itemB}`"></span>
                </div>
              </span>
              <span class="row_item center w140">{{item.number || ''}}</span>
            </span>
            <template v-if="color_data.length < 4">
              <span class="print_row h40"
                v-for="item in 3-color_data.length"
                :key="item+'false'">
                <span class="row_item bgGray w140 center"></span>
                <span class="row_item center"
                  :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                  <div class="print_row h40 noBorder">
                    <span class="row_item center"
                      v-for="(itemWarp,indexWarp) in zhujiaInfoCom.warp"
                      :key="`warp-${indexWarp}`"></span>
                  </div>
                </span>
                <span class="row_item center"
                  :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                  <div class="print_row h40 noBorder">
                    <span class="row_item center"
                      v-for="(itemWeft,indexWeft) in zhujiaInfoCom.weft"
                      :key="`weft-${indexWeft}`"></span>
                  </div>
                </span>
                <span class="row_item center"
                  :style="`flex:${10 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)}`">
                  <div class="print_row h40 noBorder">
                    <span class="row_item center"
                      v-for="itemB in (10 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length))"
                      :key="`buchong-${itemB}`"></span>
                  </div>
                </span>
                <span class="row_item w140 center"></span>
              </span>
            </template>
          </span>
          <span class="row_item col"
            v-else>见附件</span>
        </div>
        <div class="print_row h261"
          v-else-if="colourInfoType === '3'"
          @click.right="handleClickRight($event,3)">
          <span class="col_title">配色工艺</span>
          <span class="row_item col"
            v-if="(zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length) <= 3 && color_data.length < 4">
            <span class="print_row h60 noBorder bgGray">
              <span class="row_item w140 special_title">
                <span class="top_right">具体配色</span>
                <span class="bottom_left">颜色组</span>
              </span>
              <span class="row_item col"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <span class="print_row h31 noBorder">
                  <span class="row_item center">经向</span>
                </span>
                <span class="print_row h31">
                  <span class="row_item center"
                    v-for="(itemWarp,indexWarp) in zhujiaInfoCom.warp"
                    :key="indexWarp">{{itemWarp.key === 0 ? '主' : `夹${itemWarp.key}`}}</span>
                </span>
              </span>
              <span class="row_item col"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <span class="print_row h31 noBorder">
                  <span class="row_item center">纬向</span>
                </span>
                <span class="print_row h31">
                  <span class="row_item center"
                    v-for="(itemWeft,indexWeft) in zhujiaInfoCom.weft"
                    :key="indexWeft">{{itemWeft.key === 0 ? '主' : `夹${itemWeft.key}`}}</span>
                </span>
              </span>
              <span class="row_item col"
                :style="`flex:${3 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)}`">
                <span class="print_row h31 noBorder">
                  <span class="row_item center"></span>
                </span>
                <span class="print_row h31">
                  <span class="row_item center"
                    v-for="itemB in 3 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)"
                    :key="itemB"></span>
                </span>
              </span>
              <span class="row_item col w140">下机时间</span>
            </span>
            <span class="print_row h40">
              <span class="row_item bgGray w140 center">根数</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWarp,indexWarp) in zhujiaInfoCom.warp"
                    :key="`warp-${indexWarp}`"
                    :style="{'font-size':returnSize(itemWarp.number)}">{{itemWarp.number || ''}}</span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWeft,indexWeft) in zhujiaInfoCom.weft"
                    :key="`weft-${indexWeft}`"
                    :style="{'font-size':returnSize(itemWeft.number)}">
                    {{itemWeft.number || ''}}
                  </span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${3 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemB in (3 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length))"
                    :key="`buchong-${itemB}`"></span>
                </div>
              </span>
              <span class="row_item center w140">{{warp_data.contract_ratio === '100' ? '' : warp_data.contract_ratio}}</span>
            </span>
            <span class="print_row h40">
              <span class="row_item bgGray w140 center">克重</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWarp,indexWarp) in zhujiaInfoCom.warp"
                    :key="`warp-${indexWarp}`">{{itemWarp.weight && `${itemWarp.weight}g` || ''}}</span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWeft,indexWeft) in zhujiaInfoCom.weft"
                    :key="`weft-${indexWeft}`">{{itemWeft.weight && `${itemWeft.weight}g` || ''}}</span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${3 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemB in (3 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length))"
                    :key="`buchong-${itemB}`"></span>
                </div>
              </span>
              <span class="row_item center w140">织造数量</span>
            </span>
            <span class="print_row h40"
              v-for="(item,index) in color_data"
              :key="index">
              <span class="row_item bgGray w140 center">{{item.product_color}}</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWarp,indexWarp) in zhujiaInfoCom.warp"
                    :key="`warp-${indexWarp}`">{{item.color_scheme.warp[itemWarp.key] && item.color_scheme.warp[itemWarp.key].name || ''}}</span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWeft,indexWeft) in zhujiaInfoCom.weft"
                    :key="`weft-${indexWeft}`">{{item.color_scheme.weft[itemWeft.key] && item.color_scheme.weft[itemWeft.key].name || ''}}</span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${3 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemB in (3 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length))"
                    :key="`buchong-${itemB}`"></span>
                </div>
              </span>
              <span class="row_item center w140">{{item.number || ''}}</span>
            </span>
            <template v-if="color_data.length < 4">
              <span class="print_row h40"
                v-for="item in 3-color_data.length"
                :key="item+'false'">
                <span class="row_item bgGray w140 center"></span>
                <span class="row_item center"
                  :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                  <div class="print_row h40 noBorder">
                    <span class="row_item center"
                      v-for="(itemWarp,indexWarp) in zhujiaInfoCom.warp"
                      :key="`warp-${indexWarp}`"></span>
                  </div>
                </span>
                <span class="row_item center"
                  :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                  <div class="print_row h40 noBorder">
                    <span class="row_item center"
                      v-for="(itemWeft,indexWeft) in zhujiaInfoCom.weft"
                      :key="`weft-${indexWeft}`"></span>
                  </div>
                </span>
                <span class="row_item center"
                  :style="`flex:${3 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)}`">
                  <div class="print_row h40 noBorder">
                    <span class="row_item center"
                      v-for="itemB in (3 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length))"
                      :key="`buchong-${itemB}`"></span>
                  </div>
                </span>
                <span class="row_item w140 center"></span>
              </span>
            </template>
          </span>
          <span class="row_item col"
            v-else>见附件</span>
        </div>
        <div class="print_row">
          <span class="row_item w140 center">工序与备注</span>
          <span class="row_item left noBorder">后道工序：{{warp_data.additional_data}}</span>
          <span class="row_item left">其它备注：{{craftDetail.desc}}</span>
        </div>
      </div>
    </div>
    <!-- 经纬向数据超出时 -->
    <div class="printTable outTable"
      v-if="warp_data.length_is >= 17 || weft_data.length_is >= 17  || warp_data.back_status || weft_data.back_status">
      <div class="outItem">
        <span class="label">{{$route.params.type==='1'?'产':'样'}}品编号：</span>
        {{craftDetail.product_info.product_code}}
      </div>
      <div class="outItem">
        <span class="label">经向排列-正：</span>
        <span class="print_body"
          v-for="(items,indexs) in Math.ceil(warp_data.warp_rank[0].length / 16)"
          :key="indexs"
          @click.right="handleClickRight">
          <span class="print_row h31 noBorder">
            <span class="row_item_span"
              v-for="(item,index) in splitData(warp_data.warp_rank[0],indexs)"
              :key="index">{{item}}</span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(warp_data.warp_rank[0],indexs).length"
              :key="item + 'false'"></span>
          </span>
          <span class="print_row h31">
            <span class="row_item_span"
              v-for="(item,index) in splitData(warp_data.warp_rank[1],indexs)"
              :key="index">{{item === 0 ? '主' : '夹' + item}}</span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(warp_data.warp_rank[1],indexs).length"
              :key="item + 'false'"></span>
          </span>
          <span class="print_row h31">
            <span class="row_item_span"
              v-for="(item,index) in splitData(warp_data.warp_rank[2],indexs)"
              :key="index">{{item}}</span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(warp_data.warp_rank[2],indexs).length"
              :key="item + 'false'"></span>
          </span>
          <span class="print_row h31">
            <span v-for="(item,index) in mergeSpan(warp_data,3,'warp_rank','merge_data',splitData,indexs)"
              :class="{'row_item_span':true,'bgGray':item.isSplit}"
              :key="index"
              :style="{'min-width':item.colspan * (100 / 16) + '%'}">
              <span class="value_span">
                {{item|filterValue}}
                <span style="font-size:16px;color:rgba(0,0,0,1)"
                  v-if="item.value && (item.isSplit || item.colspan > 1) && (item.value.indexOf('[') === -1)">遍</span>
                <span style="font-size:12px;color:rgba(0,0,0,1)"
                  v-if="item.totalNumber && (item.isSplit || item.colspan > 1)">
                  {{item.totalNumber || ''}}梭
                </span>
              </span>
              <!-- 标记 -->
              <span class="sign left"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow left_to_right"
                  v-if="signType === '3'"></span>
              </span>
              <span class="sign right"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noRightJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow right_to_left"
                  v-if="signType === '3'"></span>
              </span>
            </span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(warp_data.warp_rank[3],indexs).length"
              :key="item + 'false'"></span>
          </span>
          <span class="print_row h31">
            <span v-for="(item,index) in mergeSpan(warp_data,4,'warp_rank','merge_data',splitData,indexs)"
              :class="{'row_item_span':true,'bgGray':item.isSplit}"
              :key="index"
              :style="{'min-width':item.colspan * (100 / 16) + '%'}">
              <span class="value_span">
                {{item|filterValue}}
                <span style="font-size:16px;color:rgba(0,0,0,1)"
                  v-if="item.value && (item.isSplit || item.colspan > 1) && (item.value.indexOf('[') === -1)">遍</span>
                <span style="font-size:12px;color:rgba(0,0,0,1)"
                  v-if="item.totalNumber && (item.isSplit || item.colspan > 1)">
                  {{item.totalNumber || ''}}梭
                </span>
              </span>
              <!-- 标记 -->
              <span class="sign left"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow left_to_right"
                  v-if="signType === '3'"></span>
              </span>
              <span class="sign right"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noRightJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow right_to_left"
                  v-if="signType === '3'"></span>
              </span>
            </span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(warp_data.warp_rank[2],indexs).length"
              :key="item + 'false'"></span>
          </span>
          <span class="print_row h31">
            <span v-for="(item,index) in mergeSpan(warp_data,5,'warp_rank','merge_data',splitData,indexs)"
              :class="{'row_item_span':true,'bgGray':item.isSplit}"
              :key="index"
              :style="{'min-width':item.colspan * (100 / 16) + '%'}">
              <span class="value_span">
                {{item.value}}
              </span>
              <!-- 标记 -->
              <span class="sign left"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow left_to_right"
                  v-if="signType === '3'"></span>
              </span>
              <span class="sign right"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noRightJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow right_to_left"
                  v-if="signType === '3'"></span>
              </span>
            </span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(warp_data.warp_rank[2],indexs).length"
              :key="item + 'false'"></span>
          </span>
        </span>
      </div>
      <div class="outItem"
        v-if="warp_data.back_status">
        <span class="label">经向排列-反：</span>
        <span class="print_body"
          v-for="(items,indexs) in Math.ceil(warp_data.warp_rank_back[0].length / 16)"
          :key="indexs"
          @click.right="handleClickRight">
          <span class="print_row h31 noBorder">
            <span class="row_item_span"
              v-for="(item,index) in splitData(warp_data.warp_rank_back[0],indexs)"
              :key="index">{{item}}</span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(warp_data.warp_rank_back[0],indexs).length"
              :key="item + 'false'"></span>
          </span>
          <span class="print_row h31">
            <span class="row_item_span"
              v-for="(item,index) in splitData(warp_data.warp_rank_back[1],indexs)"
              :key="index">{{item === 0 ? '主' : '夹' + item}}</span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(warp_data.warp_rank_back[1],indexs).length"
              :key="item + 'false'"></span>
          </span>
          <span class="print_row h31">
            <span class="row_item_span"
              v-for="(item,index) in splitData(warp_data.warp_rank_back[2],indexs)"
              :key="index">{{item}}</span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(warp_data.warp_rank_back[2],indexs).length"
              :key="item + 'false'"></span>
          </span>
          <span class="print_row h31">
            <span v-for="(item,index) in mergeSpan(warp_data,3,'warp_rank_back','merge_data_back',splitData,indexs)"
              :class="{'row_item_span':true,'bgGray':item.isSplit}"
              :key="index"
              :style="{'min-width':item.colspan * (100 / 16) + '%'}">
              <span class="value_span">
                {{item|filterValue}}
                <span style="font-size:16px;color:rgba(0,0,0,1)"
                  v-if="item.value && (item.isSplit || item.colspan > 1) && (item.value.indexOf('[') === -1)">遍</span>
                <span style="font-size:12px;color:rgba(0,0,0,1)"
                  v-if="item.totalNumber && (item.isSplit || item.colspan > 1)">
                  {{item.totalNumber || ''}}梭
                </span>
              </span>
              <!-- 标记 -->
              <span class="sign left"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow left_to_right"
                  v-if="signType === '3'"></span>
              </span>
              <span class="sign right"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noRightJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow right_to_left"
                  v-if="signType === '3'"></span>
              </span>
            </span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(warp_data.warp_rank_back[3],indexs).length"
              :key="item + 'false'"></span>
          </span>
          <span class="print_row h31">
            <span v-for="(item,index) in mergeSpan(warp_data,4,'warp_rank_back','merge_data_back',splitData,indexs)"
              :class="{'row_item_span':true,'bgGray':item.isSplit}"
              :key="index"
              :style="{'min-width':item.colspan * (100 / 16) + '%'}">
              <span class="value_span">
                {{item|filterValue}}
                <span style="font-size:16px;color:rgba(0,0,0,1)"
                  v-if="item.value && (item.isSplit || item.colspan > 1) && (item.value.indexOf('[') === -1)">遍</span>
                <span style="font-size:12px;color:rgba(0,0,0,1)"
                  v-if="item.totalNumber && (item.isSplit || item.colspan > 1)">
                  {{item.totalNumber || ''}}梭
                </span>
              </span>
              <!-- 标记 -->
              <span class="sign left"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow left_to_right"
                  v-if="signType === '3'"></span>
              </span>
              <span class="sign right"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noRightJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow right_to_left"
                  v-if="signType === '3'"></span>
              </span>
            </span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(warp_data.warp_rank_back[2],indexs).length"
              :key="item + 'false'"></span>
          </span>
          <span class="print_row h31">
            <span v-for="(item,index) in mergeSpan(warp_data,5,'warp_rank_back','merge_data_back',splitData,indexs)"
              :class="{'row_item_span':true,'bgGray':item.isSplit}"
              :key="index"
              :style="{'min-width':item.colspan * (100 / 16) + '%'}">
              <span class="value_span">
                {{item.value}}
              </span>
              <!-- 标记 -->
              <span class="sign left"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow left_to_right"
                  v-if="signType === '3'"></span>
              </span>
              <span class="sign right"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noRightJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow right_to_left"
                  v-if="signType === '3'"></span>
              </span>
            </span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(warp_data.warp_rank_back[2],indexs).length"
              :key="item + 'false'"></span>
          </span>
        </span>
      </div>
      <div class="outItem">
        <span class="label">纬向排列-正：</span>
        <span class="print_body"
          v-for="(items,indexs) in Math.ceil(weft_data.weft_rank[0].length / 16)"
          :key="indexs"
          @click.right="handleClickRight">
          <span class="print_row h31 noBorder">
            <span class="row_item_span"
              v-for="(item,index) in splitData(weft_data.weft_rank[0],indexs)"
              :key="index">{{item}}</span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(weft_data.weft_rank[0],indexs).length"
              :key="item + 'false'"></span>
          </span>
          <span class="print_row h31">
            <span class="row_item_span"
              v-for="(item,index) in splitData(weft_data.weft_rank[1],indexs)"
              :key="index">{{item === 0 ? '主' : '夹' + item}}</span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(weft_data.weft_rank[1],indexs).length"
              :key="item + 'false'"></span>
          </span>
          <span class="print_row h31">
            <span class="row_item_span"
              v-for="(item,index) in splitData(weft_data.weft_rank[2],indexs)"
              :key="index">{{item}}</span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(weft_data.weft_rank[2],indexs).length"
              :key="item + 'false'"></span>
          </span>
          <span class="print_row h31">
            <span v-for="(item,index) in mergeSpan(weft_data,3,'weft_rank','merge_data',splitData,indexs)"
              :class="{'row_item_span':true,'bgGray':item.isSplit}"
              :key="index"
              :style="{'min-width':item.colspan * (100 / 16) + '%'}">
              <span class="value_span">
                {{item|filterValue}}
                <span style="font-size:16px;color:rgba(0,0,0,1)"
                  v-if="item.value && (item.isSplit || item.colspan > 1) && (item.value.indexOf('[') === -1)">遍</span>
                <span style="font-size:12px;color:rgba(0,0,0,1)"
                  v-if="item.totalNumber && (item.isSplit || item.colspan > 1)">
                  {{item.totalNumber || ''}}梭
                </span>
              </span>
              <!-- 标记 -->
              <span class="sign left"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow left_to_right"
                  v-if="signType === '3'"></span>
              </span>
              <span class="sign right"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noRightJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow right_to_left"
                  v-if="signType === '3'"></span>
              </span>
            </span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(weft_data.weft_rank[3],indexs).length"
              :key="item + 'false'"></span>
          </span>
          <span class="print_row h31">
            <span v-for="(item,index) in mergeSpan(weft_data,4,'weft_rank','merge_data',splitData,indexs)"
              :class="{'row_item_span':true,'bgGray':item.isSplit}"
              :key="index"
              :style="{'min-width':item.colspan * (100 / 16) + '%'}">
              <span class="value_span">
                {{item|filterValue}}
                <span style="font-size:16px;color:rgba(0,0,0,1)"
                  v-if="item.value && (item.isSplit || item.colspan > 1) && (item.value.indexOf('[') === -1)">遍</span>
                <span style="font-size:12px;color:rgba(0,0,0,1)"
                  v-if="item.totalNumber && (item.isSplit || item.colspan > 1)">
                  {{item.totalNumber || ''}}梭
                </span>
              </span>
              <!-- 标记 -->
              <span class="sign left"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow left_to_right"
                  v-if="signType === '3'"></span>
              </span>
              <span class="sign right"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noRightJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow right_to_left"
                  v-if="signType === '3'"></span>
              </span>
            </span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(weft_data.weft_rank[2],indexs).length"
              :key="item + 'false'"></span>
          </span>
          <span class="print_row h31">
            <span v-for="(item,index) in mergeSpan(weft_data,5,'weft_rank','merge_data',splitData,indexs)"
              :class="{'row_item_span':true,'bgGray':item.isSplit}"
              :key="index"
              :style="{'min-width':item.colspan * (100 / 16) + '%'}">
              <span class="value_span">
                {{item.value}}
              </span>
              <!-- 标记 -->
              <span class="sign left"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow left_to_right"
                  v-if="signType === '3'"></span>
              </span>
              <span class="sign right"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noRightJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow right_to_left"
                  v-if="signType === '3'"></span>
              </span>
            </span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(weft_data.weft_rank[2],indexs).length"
              :key="item + 'false'"></span>
          </span>
        </span>
      </div>
      <div class="outItem"
        v-if="weft_data.back_status">
        <span class="label">纬向排列-反：</span>
        <span class="print_body"
          v-for="(items,indexs) in Math.ceil(weft_data.weft_rank_back[0].length / 16)"
          :key="indexs"
          @click.right="handleClickRight">
          <span class="print_row h31 noBorder">
            <span class="row_item_span"
              v-for="(item,index) in splitData(weft_data.weft_rank_back[0],indexs)"
              :key="index">{{item}}</span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(weft_data.weft_rank_back[0],indexs).length"
              :key="item + 'false'"></span>
          </span>
          <span class="print_row h31">
            <span class="row_item_span"
              v-for="(item,index) in splitData(weft_data.weft_rank_back[1],indexs)"
              :key="index">{{item === 0 ? '主' : '夹' + item}}</span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(weft_data.weft_rank_back[1],indexs).length"
              :key="item + 'false'"></span>
          </span>
          <span class="print_row h31">
            <span class="row_item_span"
              v-for="(item,index) in splitData(weft_data.weft_rank_back[2],indexs)"
              :key="index">{{item}}</span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(weft_data.weft_rank_back[2],indexs).length"
              :key="item + 'false'"></span>
          </span>
          <span class="print_row h31">
            <span v-for="(item,index) in mergeSpan(weft_data,3,'weft_rank_back','merge_data_back',splitData,indexs)"
              :class="{'row_item_span':true,'bgGray':item.isSplit}"
              :key="index"
              :style="{'min-width':item.colspan * (100 / 16) + '%'}">
              <span class="value_span">
                {{item|filterValue}}
                <span style="font-size:16px;color:rgba(0,0,0,1)"
                  v-if="item.value && (item.isSplit || item.colspan > 1) && (item.value.indexOf('[') === -1)">遍</span>
                <span style="font-size:12px;color:rgba(0,0,0,1)"
                  v-if="item.totalNumber && (item.isSplit || item.colspan > 1)">
                  {{item.totalNumber || ''}}梭
                </span>
              </span>
              <!-- 标记 -->
              <span class="sign left"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow left_to_right"
                  v-if="signType === '3'"></span>
              </span>
              <span class="sign right"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noRightJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow right_to_left"
                  v-if="signType === '3'"></span>
              </span>
            </span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(weft_data.weft_rank_back[3],indexs).length"
              :key="item + 'false'"></span>
          </span>
          <span class="print_row h31">
            <span v-for="(item,index) in mergeSpan(weft_data,4,'weft_rank_back','merge_data_back',splitData,indexs)"
              :class="{'row_item_span':true,'bgGray':item.isSplit}"
              :key="index"
              :style="{'min-width':item.colspan * (100 / 16) + '%'}">
              <span class="value_span">
                {{item|filterValue}}
                <span style="font-size:16px;color:rgba(0,0,0,1)"
                  v-if="item.value && (item.isSplit || item.colspan > 1) && (item.value.indexOf('[') === -1)">遍</span>
                <span style="font-size:12px;color:rgba(0,0,0,1)"
                  v-if="item.totalNumber && (item.isSplit || item.colspan > 1)">
                  {{item.totalNumber || ''}}梭
                </span>
              </span>
              <!-- 标记 -->
              <span class="sign left"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow left_to_right"
                  v-if="signType === '3'"></span>
              </span>
              <span class="sign right"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noRightJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow right_to_left"
                  v-if="signType === '3'"></span>
              </span>
            </span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(weft_data.weft_rank_back[2],indexs).length"
              :key="item + 'false'"></span>
          </span>
          <span class="print_row h31">
            <span v-for="(item,index) in mergeSpan(weft_data,5,'weft_rank_back','merge_data_back',splitData,indexs)"
              :class="{'row_item_span':true,'bgGray':item.isSplit}"
              :key="index"
              :style="{'min-width':item.colspan * (100 / 16) + '%'}">
              <span class="value_span">
                {{item.value}}
              </span>
              <!-- 标记 -->
              <span class="sign left"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow left_to_right"
                  v-if="signType === '3'"></span>
              </span>
              <span class="sign right"
                :class="[`style${signType || 1}`,(item.isSplit && (item.noRightJianTou || item.noJianTou)) ? 'hidden' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">
                <span class="auto_long_arrow right_to_left"
                  v-if="signType === '3'"></span>
              </span>
            </span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(weft_data.weft_rank_back[2],indexs).length"
              :key="item + 'false'"></span>
          </span>
        </span>
      </div>
    </div>
    <!-- 配色超出时 -->
    <template v-if="colourInfoType === '1'">
      <div class="printTable outTable"
        style="break-inside: avoid;"
        v-if="warp_data.length_is >= 17 || weft_data.length_is >= 17  || warp_data.back_status || weft_data.back_status || zhujia_info.length >= 6 || color_data.length >= 4"
        @click.right="handleClickRight($event,3)">
        <div class="outItem">
          <span class="label">{{$route.params.type==='1'?'产':'样'}}品编号：</span>
          {{craftDetail.product_info.product_code}}
        </div>
        <div class="outItem">
          <span class="label">配色方案：</span>
          <div class="print_body"
            v-for="(items,indexs) in Math.ceil(zhujia_info.length / 6)"
            :key="indexs">
            <span class="print_row h60 noBorder bgGray">
              <span class="row_item w140 special_title">
                <span class="top_right">具体配色</span>
                <span class="bottom_left">颜色组</span>
              </span>
              <span class="row_item col"
                v-for="item in 6"
                :key="item">
                <span class="print_row h31 noBorder">
                  <span class="row_item center">{{(item + (indexs * 6)) === 1 ? '主' : ('夹' + (item - 1 + (indexs * 6)))}}</span>
                </span>
                <span class="print_row h31">
                  <span class="row_item center">经</span>
                  <span class="row_item center">纬</span>
                </span>
              </span>
              <span class="row_item col"
                v-if="indexs === (Math.ceil(zhujia_info.length / 6) - 1)">下机时间</span>
            </span>
            <span class="print_row h40">
              <span class="row_item bgGray w140 center">根数</span>
              <span class="row_item center"
                v-for="item in 6"
                :key="item">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    :style="{'font-size':returnSize(colorWeight.warp[item - 1 + (indexs * 6)] && colorWeight.warp[item - 1+ (indexs * 6)].number)}">{{(colorWeight.warp[item - 1 + (indexs * 6)] && colorWeight.warp[item - 1 + (indexs * 6)].number) ? colorWeight.warp[item - 1 + (indexs * 6)].number : ''}}</span>
                  <span class="row_item center"
                    :style="{'font-size':returnSize(colorWeight.weft[item - 1+ (indexs * 6)] && colorWeight.weft[item - 1 + (indexs * 6)].number)}">{{(colorWeight.weft[item - 1 + (indexs * 6)]&& colorWeight.weft[item - 1 + (indexs * 6)].number) ? colorWeight.weft[item - 1 + (indexs * 6)].number : ''}}</span>
                </div>
              </span>
              <span class="row_item center"
                v-if="indexs === (Math.ceil(zhujia_info.length / 6) - 1)">{{warp_data.contract_ratio === '100' ? '' : warp_data.contract_ratio}}</span>
            </span>
            <span class="print_row h40">
              <span class="row_item bgGray w140 center">克重</span>
              <span class="row_item center"
                v-for="item in 6"
                :key="item">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    :style="{'font-size':returnSize((colorWeight.warp[item - 1 + (indexs * 6)] && colorWeight.warp[item - 1+ (indexs * 6)].weight) + 'g')}">{{(colorWeight.warp[item - 1 + (indexs * 6)] && colorWeight.warp[item - 1 + (indexs * 6)].weight) ? colorWeight.warp[item - 1 + (indexs * 6)].weight + 'g' : ''}}</span>
                  <span class="row_item center"
                    :style="{'font-size':returnSize((colorWeight.weft[item - 1+ (indexs * 6)] && colorWeight.weft[item - 1 + (indexs * 6)].weight) + 'g')}">{{(colorWeight.weft[item - 1 + (indexs * 6)]&& colorWeight.weft[item - 1 + (indexs * 6)].weight) ? colorWeight.weft[item - 1 + (indexs * 6)].weight + 'g' : ''}}</span>
                </div>
              </span>
              <span class="row_item center"
                v-if="indexs === (Math.ceil(zhujia_info.length / 6) - 1)">织造数量</span>
            </span>
            <span class="print_row h40"
              v-for="(item,index) in color_data"
              :key="index">
              <span class="row_item bgGray w140 center">{{item.product_color}}</span>
              <span class="row_item center"
                v-for="key in 6"
                :key="key">
                <span class="print_row h40 noBorder">
                  <span class="row_item center"
                    :style="{'font-size':returnSize(item.color_scheme.warp[key - 1 + (indexs * 6)] ? item.color_scheme.warp[key - 1 + (indexs * 6)].name : '')}">{{item.color_scheme.warp[key - 1 + (indexs * 6)] ? item.color_scheme.warp[key - 1 + (indexs * 6)].name : ''}}</span>
                  <span class="row_item center"
                    :style="{'font-size':returnSize(item.color_scheme.weft[key - 1 + (indexs * 6)] ? item.color_scheme.weft[key - 1 + (indexs * 6)].name : '')}"
                    v-if="!(item.color_scheme.warp[key - 1 + (indexs * 6)] && item.color_scheme.weft[key - 1 + (indexs * 6)] && (item.color_scheme.warp[key - 1 + (indexs * 6)].name === item.color_scheme.weft[key - 1 + (indexs * 6)].name))">{{item.color_scheme.weft[key - 1 + (indexs * 6)] ? item.color_scheme.weft[key - 1 + (indexs * 6)].name : ''}}</span>
                </span>
              </span>
              <span class="row_item center"
                v-if="indexs === (Math.ceil(zhujia_info.length / 6) - 1)">{{item.number || ''}}</span>
            </span>
            <template v-if="color_data.length < 4">
              <span class="print_row h40"
                v-for="item in 3-color_data.length"
                :key="item+'false'">
                <span class="row_item bgGray w140 center"></span>
                <span class="row_item center"
                  v-for="item in 6"
                  :key="item">
                  <span class="print_row h40 noBorder">
                    <span class="row_item"></span>
                    <span class="row_item"></span>
                  </span>
                </span>
                <span class="row_item center"
                  v-if="indexs === (Math.ceil(zhujia_info.length / 6) - 1)"></span>
              </span>
            </template>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="colourInfoType === '2'">
      <div class="printTable outTable"
        style="break-inside: avoid;"
        v-if="warp_data.length_is >= 17 || weft_data.length_is >= 17  || warp_data.back_status || weft_data.back_status || (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length) > 10 || color_data.length >= 4"
        @click.right="handleClickRight($event,3)">
        <div class="outItem">
          <span class="label">{{$route.params.type==='1'?'产':'样'}}品编号：</span>
          {{craftDetail.product_info.product_code}}
        </div>
        <div class="outItem"
          v-if="(zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length) > 10">
          <span class="label">配色方案：</span>
          <div class="print_body"
            v-for="(items,indexs) in Math.ceil(zhujiaInfoCom.warp.length / 10)"
            :key="`warp-${indexs}`">
            <span class="print_row h60 noBorder bgGray">
              <span class="row_item w140 special_title">
                <span class="top_right">具体配色</span>
                <span class="bottom_left">颜色组</span>
              </span>
              <span class="row_item col"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <span class="print_row h31 noBorder">
                  <span class="row_item center">经向</span>
                </span>
                <span class="print_row h31">
                  <span class="row_item center"
                    v-for="itemWarp in 10"
                    :key="itemWarp">
                    {{ zhujiaInfoCom.warp[(items - 1) * 10 + itemWarp - 1]
                      &&
                      (zhujiaInfoCom.warp[(items - 1) * 10 + itemWarp - 1].key || zhujiaInfoCom.warp[(items - 1) * 10 + itemWarp - 1].key === 0)
                      &&
                      (zhujiaInfoCom.warp[(items - 1) * 10 + itemWarp - 1].key === 0 ? '主' : `夹${zhujiaInfoCom.warp[(items - 1) * 10 + itemWarp - 1].key}`)
                      ||
                      '' }}
                  </span>
                </span>
              </span>
              <span class="row_item col w140">下机时间</span>
            </span>
            <span class="print_row h40">
              <span class="row_item bgGray w140 center">根数</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemWarp in 10"
                    :key="`warp-${itemWarp}`"
                    :style="{'font-size':returnSize(
                    zhujiaInfoCom.warp[(items - 1) * 10 + itemWarp - 1]
                    &&
                    zhujiaInfoCom.warp[(items - 1) * 10 + itemWarp - 1].number
                    ||
                    ''
                    )}">
                    {{ zhujiaInfoCom.warp[(items - 1) * 10 + itemWarp - 1]
                      &&
                      zhujiaInfoCom.warp[(items - 1) * 10 + itemWarp - 1].number
                      ||
                      '' }}
                  </span>
                </div>
              </span>
              <span class="row_item center w140">{{warp_data.contract_ratio === '100' ? '' : warp_data.contract_ratio}}</span>
            </span>
            <span class="print_row h40">
              <span class="row_item bgGray w140 center">克重</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemWarp in 10"
                    :key="`warp-${itemWarp}`"
                    :style="{'font-size':returnSize(
                      zhujiaInfoCom.warp[(items - 1) * 10 + itemWarp - 1]
                      &&
                      zhujiaInfoCom.warp[(items - 1) * 10 + itemWarp - 1].weight
                      &&
                      `${zhujiaInfoCom.warp[(items - 1) * 10 + itemWarp - 1].weight}g`
                      ||
                      ''
                    )}">
                    {{ zhujiaInfoCom.warp[(items - 1) * 10 + itemWarp - 1]
                      &&
                      zhujiaInfoCom.warp[(items - 1) * 10 + itemWarp - 1].weight
                      &&
                      `${zhujiaInfoCom.warp[(items - 1) * 10 + itemWarp - 1].weight}g`
                      ||
                      '' }}
                  </span>
                </div>
              </span>
              <span class="row_item center w140">织造数量</span>
            </span>
            <span class="print_row h40"
              v-for="(item,index) in color_data"
              :key="index">
              <span class="row_item bgGray w140 center">{{item.product_color}}</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemWarp in 10"
                    :key="`warp-${itemWarp}`"
                    :style="{'font-size':returnSize(
                      item.color_scheme.warp[
                        zhujiaInfoCom.warp[(items - 1) * 10 + itemWarp - 1]
                        &&
                        zhujiaInfoCom.warp[(items - 1) * 10 + itemWarp - 1].key
                      ]
                      &&
                      item.color_scheme.warp[
                        zhujiaInfoCom.warp[(items - 1) * 10 + itemWarp - 1]
                        &&
                        zhujiaInfoCom.warp[(items - 1) * 10 + itemWarp - 1].key
                      ].name
                      ||
                      '' )}">
                    {{ item.color_scheme.warp[
                        zhujiaInfoCom.warp[(items - 1) * 10 + itemWarp - 1]
                        &&
                        zhujiaInfoCom.warp[(items - 1) * 10 + itemWarp - 1].key
                      ]
                      &&
                      item.color_scheme.warp[
                        zhujiaInfoCom.warp[(items - 1) * 10 + itemWarp - 1]
                        &&
                        zhujiaInfoCom.warp[(items - 1) * 10 + itemWarp - 1].key
                      ].name
                      ||
                      '' }}
                  </span>
                </div>
              </span>
              <span class="row_item center w140">{{item.number || ''}}</span>
            </span>
            <template v-if="color_data.length < 4">
              <span class="print_row h40"
                v-for="item in 3-color_data.length"
                :key="item+'false'">
                <span class="row_item bgGray w140 center"></span>
                <span class="row_item center"
                  :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                  <div class="print_row h40 noBorder">
                    <span class="row_item center"
                      v-for="(itemWarp,indexWarp) in 10"
                      :key="`warp-${indexWarp}`"></span>
                  </div>
                </span>
                <span class="row_item w140 center"></span>
              </span>
            </template>
          </div>
          <div class="print_body"
            v-for="(items,indexs) in Math.ceil(zhujiaInfoCom.weft.length / 10)"
            :key="`weft-${indexs}`">
            <span class="print_row h60 noBorder bgGray">
              <span class="row_item w140 special_title">
                <span class="top_right">具体配色</span>
                <span class="bottom_left">颜色组</span>
              </span>
              <span class="row_item col"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <span class="print_row h31 noBorder">
                  <span class="row_item center">纬向</span>
                </span>
                <span class="print_row h31">
                  <span class="row_item center"
                    v-for="itemWarp in 10"
                    :key="itemWarp">
                    {{ zhujiaInfoCom.weft[(items - 1) * 10 + itemWarp - 1]
                      &&
                      (zhujiaInfoCom.weft[(items - 1) * 10 + itemWarp - 1].key || zhujiaInfoCom.weft[(items - 1) * 10 + itemWarp - 1].key === 0)
                      &&
                      (zhujiaInfoCom.weft[(items - 1) * 10 + itemWarp - 1].key === 0 ? '主' : `夹${zhujiaInfoCom.weft[(items - 1) * 10 + itemWarp - 1].key}`)
                      ||
                      '' }}
                  </span>
                </span>
              </span>
              <span class="row_item col w140">下机时间</span>
            </span>
            <span class="print_row h40">
              <span class="row_item bgGray w140 center">根数</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemWarp in 10"
                    :key="`weft-${itemWarp}`"
                    :style="{'font-size':returnSize(
                      zhujiaInfoCom.weft[(items - 1) * 10 + itemWarp - 1]
                      &&
                      zhujiaInfoCom.weft[(items - 1) * 10 + itemWarp - 1].number
                      ||
                      ''
                    )}">
                    {{ zhujiaInfoCom.weft[(items - 1) * 10 + itemWarp - 1]
                      &&
                      zhujiaInfoCom.weft[(items - 1) * 10 + itemWarp - 1].number
                      ||
                      '' }}
                  </span>
                </div>
              </span>
              <span class="row_item center w140">{{warp_data.contract_ratio === '100' ? '' : warp_data.contract_ratio}}</span>
            </span>
            <span class="print_row h40">
              <span class="row_item bgGray w140 center">克重</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemWarp in 10"
                    :key="`weft-${itemWarp}`"
                    :style="{'font-size':returnSize(
                      zhujiaInfoCom.weft[(items - 1) * 10 + itemWarp - 1]
                      &&
                      zhujiaInfoCom.weft[(items - 1) * 10 + itemWarp - 1].weight
                      &&
                      `${zhujiaInfoCom.weft[(items - 1) * 10 + itemWarp - 1].weight}g`
                      ||
                      ''
                    )}">
                    {{ zhujiaInfoCom.weft[(items - 1) * 10 + itemWarp - 1]
                      &&
                      zhujiaInfoCom.weft[(items - 1) * 10 + itemWarp - 1].weight
                      &&
                      `${zhujiaInfoCom.weft[(items - 1) * 10 + itemWarp - 1].weight}g`
                      ||
                      '' }}
                  </span>
                </div>
              </span>
              <span class="row_item center w140">织造数量</span>
            </span>
            <span class="print_row h40"
              v-for="(item,index) in color_data"
              :key="index">
              <span class="row_item bgGray w140 center">{{item.product_color}}</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemWarp in 10"
                    :key="`weft-${itemWarp}`"
                    :style="{'font-size':returnSize(
                      item.color_scheme.weft[
                        zhujiaInfoCom.weft[(items - 1) * 10 + itemWarp - 1]
                        &&
                        zhujiaInfoCom.weft[(items - 1) * 10 + itemWarp - 1].key
                      ]
                      &&
                      item.color_scheme.weft[
                        zhujiaInfoCom.weft[(items - 1) * 10 + itemWarp - 1]
                        &&
                        zhujiaInfoCom.weft[(items - 1) * 10 + itemWarp - 1].key
                      ].name
                      ||
                      '' )}">
                    {{ item.color_scheme.weft[
                        zhujiaInfoCom.weft[(items - 1) * 10 + itemWarp - 1]
                        &&
                        zhujiaInfoCom.weft[(items - 1) * 10 + itemWarp - 1].key
                      ]
                      &&
                      item.color_scheme.weft[
                        zhujiaInfoCom.weft[(items - 1) * 10 + itemWarp - 1]
                        &&
                        zhujiaInfoCom.weft[(items - 1) * 10 + itemWarp - 1].key
                      ].name
                      ||
                      '' }}
                  </span>
                </div>
              </span>
              <span class="row_item center w140">{{item.number || ''}}</span>
            </span>
            <template v-if="color_data.length < 4">
              <span class="print_row h40"
                v-for="item in 3-color_data.length"
                :key="item+'false'">
                <span class="row_item bgGray w140 center"></span>
                <span class="row_item center"
                  :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                  <div class="print_row h40 noBorder">
                    <span class="row_item center"
                      v-for="(itemWarp,indexWarp) in 10"
                      :key="`warp-${indexWarp}`"></span>
                  </div>
                </span>
                <span class="row_item w140 center"></span>
              </span>
            </template>
          </div>
        </div>
        <div class="outItem"
          v-else>
          <span class="label">配色方案：</span>
          <div class="print_body">
            <span class="print_row h60 noBorder bgGray">
              <span class="row_item w140 special_title">
                <span class="top_right">具体配色</span>
                <span class="bottom_left">颜色组</span>
              </span>
              <span class="row_item col"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <span class="print_row h31 noBorder">
                  <span class="row_item center">经向</span>
                </span>
                <span class="print_row h31">
                  <span class="row_item center"
                    v-for="(itemWarp,indexWarp) in zhujiaInfoCom.warp"
                    :key="indexWarp">{{itemWarp.key === 0 ? '主' : `夹${itemWarp.key}`}}</span>
                </span>
              </span>
              <span class="row_item col"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <span class="print_row h31 noBorder">
                  <span class="row_item center">纬向</span>
                </span>
                <span class="print_row h31">
                  <span class="row_item center"
                    v-for="(itemWeft,indexWeft) in zhujiaInfoCom.weft"
                    :key="indexWeft">{{itemWeft.key === 0 ? '主' : `夹${itemWeft.key}`}}</span>
                </span>
              </span>
              <span class="row_item col"
                :style="`flex:${10 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)}`">
                <span class="print_row h31 noBorder">
                  <span class="row_item center"></span>
                </span>
                <span class="print_row h31">
                  <span class="row_item center"
                    v-for="itemB in 10 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)"
                    :key="itemB"></span>
                </span>
              </span>
              <span class="row_item col w140">下机时间</span>
            </span>
            <span class="print_row h40">
              <span class="row_item bgGray w140 center">根数</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWarp,indexWarp) in zhujiaInfoCom.warp"
                    :key="`warp-${indexWarp}`"
                    :style="{'font-size':returnSize(itemWarp.number)}">{{itemWarp.number || ''}}</span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWeft,indexWeft) in zhujiaInfoCom.weft"
                    :key="`weft-${indexWeft}`"
                    :style="{'font-size':returnSize(itemWeft.number)}">
                    {{itemWeft.number || ''}}
                  </span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${10 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemB in (10 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length))"
                    :key="`buchong-${itemB}`"></span>
                </div>
              </span>
              <span class="row_item center w140">{{warp_data.contract_ratio === '100' ? '' : warp_data.contract_ratio}}</span>
            </span>
            <span class="print_row h40">
              <span class="row_item bgGray w140 center">克重</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWarp,indexWarp) in zhujiaInfoCom.warp"
                    :key="`warp-${indexWarp}`"
                    :style="{'font-size':returnSize(itemWarp.weight && `${itemWarp.weight}g` || '')}">{{itemWarp.weight && `${itemWarp.weight}g` || ''}}</span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWeft,indexWeft) in zhujiaInfoCom.weft"
                    :key="`weft-${indexWeft}`"
                    :style="{'font-size':returnSize(itemWeft.weight && `${itemWeft.weight}g` || '')}">{{itemWeft.weight && `${itemWeft.weight}g` || ''}}</span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${10 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemB in (10 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length))"
                    :key="`buchong-${itemB}`"></span>
                </div>
              </span>
              <span class="row_item center w140">织造数量</span>
            </span>
            <span class="print_row h40"
              v-for="(item,index) in color_data"
              :key="index">
              <span class="row_item bgGray w140 center">{{item.product_color}}</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWarp,indexWarp) in zhujiaInfoCom.warp"
                    :key="`warp-${indexWarp}`"
                    :style="{'font-size':returnSize(item.color_scheme.warp[itemWarp.key] && item.color_scheme.warp[itemWarp.key].name || '')}">{{item.color_scheme.warp[itemWarp.key] && item.color_scheme.warp[itemWarp.key].name || ''}}</span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWeft,indexWeft) in zhujiaInfoCom.weft"
                    :key="`weft-${indexWeft}`"
                    :style="{'font-size':returnSize(item.color_scheme.weft[itemWeft.key] && item.color_scheme.weft[itemWeft.key].name || '')}">{{item.color_scheme.weft[itemWeft.key] && item.color_scheme.weft[itemWeft.key].name || ''}}</span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${10 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemB in (10 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length))"
                    :key="`buchong-${itemB}`"></span>
                </div>
              </span>
              <span class="row_item center w140">{{item.number || ''}}</span>
            </span>
            <template v-if="color_data.length < 4">
              <span class="print_row h40"
                v-for="item in 3-color_data.length"
                :key="item+'false'">
                <span class="row_item bgGray w140 center"></span>
                <span class="row_item center"
                  :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                  <div class="print_row h40 noBorder">
                    <span class="row_item center"
                      v-for="(itemWarp,indexWarp) in zhujiaInfoCom.warp"
                      :key="`warp-${indexWarp}`"></span>
                  </div>
                </span>
                <span class="row_item center"
                  :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                  <div class="print_row h40 noBorder">
                    <span class="row_item center"
                      v-for="(itemWeft,indexWeft) in zhujiaInfoCom.weft"
                      :key="`weft-${indexWeft}`"></span>
                  </div>
                </span>
                <span class="row_item center"
                  :style="`flex:${10 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)}`">
                  <div class="print_row h40 noBorder">
                    <span class="row_item center"
                      v-for="itemB in (10 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length))"
                      :key="`buchong-${itemB}`"></span>
                  </div>
                </span>
                <span class="row_item w140 center"></span>
              </span>
            </template>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="colourInfoType === '3'">
      <div class="printTable outTable"
        style="break-inside: avoid;"
        v-if="warp_data.length_is >= 17 || weft_data.length_is >= 17  || warp_data.back_status || weft_data.back_status || (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length) > 3 || color_data.length >= 4"
        @click.right="handleClickRight($event,3)">
        <div class="outItem">
          <span class="label">{{$route.params.type==='1'?'产':'样'}}品编号：</span>
          {{craftDetail.product_info.product_code}}
        </div>
        <div class="outItem"
          v-if="(zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length) > 3">
          <span class="label">配色方案：</span>
          <div class="print_body"
            v-for="(items,indexs) in Math.ceil(zhujiaInfoCom.warp.length / 3)"
            :key="`warp-${indexs}`">
            <span class="print_row h60 noBorder bgGray">
              <span class="row_item w140 special_title">
                <span class="top_right">具体配色</span>
                <span class="bottom_left">颜色组</span>
              </span>
              <span class="row_item col"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <span class="print_row h31 noBorder">
                  <span class="row_item center">经向</span>
                </span>
                <span class="print_row h31">
                  <span class="row_item center"
                    v-for="itemWarp in 3"
                    :key="itemWarp">
                    {{ zhujiaInfoCom.warp[(items - 1) * 3 + itemWarp - 1]
                      &&
                      (zhujiaInfoCom.warp[(items - 1) * 3 + itemWarp - 1].key || zhujiaInfoCom.warp[(items - 1) * 3 + itemWarp - 1].key === 0)
                      &&
                      (zhujiaInfoCom.warp[(items - 1) * 3 + itemWarp - 1].key === 0 ? '主' : `夹${zhujiaInfoCom.warp[(items - 1) * 3 + itemWarp - 1].key}`)
                      ||
                      '' }}
                  </span>
                </span>
              </span>
              <span class="row_item col w140">下机时间</span>
            </span>
            <span class="print_row h40">
              <span class="row_item bgGray w140 center">根数</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemWarp in 3"
                    :key="`warp-${itemWarp}`">
                    {{ zhujiaInfoCom.warp[(items - 1) * 3 + itemWarp - 1]
                      &&
                      zhujiaInfoCom.warp[(items - 1) * 3 + itemWarp - 1].number
                      ||
                      '' }}
                  </span>
                </div>
              </span>
              <span class="row_item center w140">{{warp_data.contract_ratio === '100' ? '' : warp_data.contract_ratio}}</span>
            </span>
            <span class="print_row h40">
              <span class="row_item bgGray w140 center">克重</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemWarp in 3"
                    :key="`warp-${itemWarp}`">
                    {{ zhujiaInfoCom.warp[(items - 1) * 3 + itemWarp - 1]
                      &&
                      zhujiaInfoCom.warp[(items - 1) * 3 + itemWarp - 1].weight
                      &&
                      `${zhujiaInfoCom.warp[(items - 1) * 3 + itemWarp - 1].weight}g`
                      ||
                      '' }}
                  </span>
                </div>
              </span>
              <span class="row_item center w140">织造数量</span>
            </span>
            <span class="print_row h40"
              v-for="(item,index) in color_data"
              :key="index">
              <span class="row_item bgGray w140 center">{{item.product_color}}</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemWarp in 3"
                    :key="`warp-${itemWarp}`">
                    {{ item.color_scheme.warp[
                        zhujiaInfoCom.warp[(items - 1) * 3 + itemWarp - 1]
                        &&
                        zhujiaInfoCom.warp[(items - 1) * 3 + itemWarp - 1].key
                      ]
                      &&
                      item.color_scheme.warp[
                        zhujiaInfoCom.warp[(items - 1) * 3 + itemWarp - 1]
                        &&
                        zhujiaInfoCom.warp[(items - 1) * 3 + itemWarp - 1].key
                      ].name
                      ||
                      '' }}
                  </span>
                </div>
              </span>
              <span class="row_item center w140">{{item.number || ''}}</span>
            </span>
            <template v-if="color_data.length < 4">
              <span class="print_row h40"
                v-for="item in 3-color_data.length"
                :key="item+'false'">
                <span class="row_item bgGray w140 center"></span>
                <span class="row_item center"
                  :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                  <div class="print_row h40 noBorder">
                    <span class="row_item center"
                      v-for="(itemWarp,indexWarp) in 3"
                      :key="`warp-${indexWarp}`"></span>
                  </div>
                </span>
                <span class="row_item w140 center"></span>
              </span>
            </template>
          </div>
          <div class="print_body"
            v-for="(items,indexs) in Math.ceil(zhujiaInfoCom.weft.length / 3)"
            :key="`weft-${indexs}`">
            <span class="print_row h60 noBorder bgGray">
              <span class="row_item w140 special_title">
                <span class="top_right">具体配色</span>
                <span class="bottom_left">颜色组</span>
              </span>
              <span class="row_item col"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <span class="print_row h31 noBorder">
                  <span class="row_item center">纬向</span>
                </span>
                <span class="print_row h31">
                  <span class="row_item center"
                    v-for="itemWarp in 3"
                    :key="itemWarp">
                    {{ zhujiaInfoCom.weft[(items - 1) * 3 + itemWarp - 1]
                      &&
                      (zhujiaInfoCom.weft[(items - 1) * 3 + itemWarp - 1].key || zhujiaInfoCom.weft[(items - 1) * 3 + itemWarp - 1].key === 0)
                      &&
                      (zhujiaInfoCom.weft[(items - 1) * 3 + itemWarp - 1].key === 0 ? '主' : `夹${zhujiaInfoCom.weft[(items - 1) * 3 + itemWarp - 1].key}`)
                      ||
                      '' }}
                  </span>
                </span>
              </span>
              <span class="row_item col w140">下机时间</span>
            </span>
            <span class="print_row h40">
              <span class="row_item bgGray w140 center">根数</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemWarp in 3"
                    :key="`weft-${itemWarp}`">
                    {{ zhujiaInfoCom.weft[(items - 1) * 3 + itemWarp - 1]
                      &&
                      zhujiaInfoCom.weft[(items - 1) * 3 + itemWarp - 1].number
                      ||
                      '' }}
                  </span>
                </div>
              </span>
              <span class="row_item center w140">{{warp_data.contract_ratio === '100' ? '' : warp_data.contract_ratio}}</span>
            </span>
            <span class="print_row h40">
              <span class="row_item bgGray w140 center">克重</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemWarp in 3"
                    :key="`weft-${itemWarp}`">
                    {{ zhujiaInfoCom.weft[(items - 1) * 3 + itemWarp - 1]
                      &&
                      zhujiaInfoCom.weft[(items - 1) * 3 + itemWarp - 1].weight
                      &&
                      `${zhujiaInfoCom.weft[(items - 1) * 3 + itemWarp - 1].weight}g`
                      ||
                      '' }}
                  </span>
                </div>
              </span>
              <span class="row_item center w140">织造数量</span>
            </span>
            <span class="print_row h40"
              v-for="(item,index) in color_data"
              :key="index">
              <span class="row_item bgGray w140 center">{{item.product_color}}</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemWarp in 3"
                    :key="`weft-${itemWarp}`">
                    {{ item.color_scheme.weft[
                        zhujiaInfoCom.weft[(items - 1) * 3 + itemWarp - 1]
                        &&
                        zhujiaInfoCom.weft[(items - 1) * 3 + itemWarp - 1].key
                      ]
                      &&
                      item.color_scheme.weft[
                        zhujiaInfoCom.weft[(items - 1) * 3 + itemWarp - 1]
                        &&
                        zhujiaInfoCom.weft[(items - 1) * 3 + itemWarp - 1].key
                      ].name
                      ||
                      '' }}
                  </span>
                </div>
              </span>
              <span class="row_item center w140">{{item.number || ''}}</span>
            </span>
            <template v-if="color_data.length < 4">
              <span class="print_row h40"
                v-for="item in 3-color_data.length"
                :key="item+'false'">
                <span class="row_item bgGray w140 center"></span>
                <span class="row_item center"
                  :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                  <div class="print_row h40 noBorder">
                    <span class="row_item center"
                      v-for="(itemWarp,indexWarp) in 3"
                      :key="`warp-${indexWarp}`"></span>
                  </div>
                </span>
                <span class="row_item w140 center"></span>
              </span>
            </template>
          </div>
        </div>
        <div class="outItem"
          v-else>
          <span class="label">配色方案：</span>
          <div class="print_body">
            <span class="print_row h60 noBorder bgGray">
              <span class="row_item w140 special_title">
                <span class="top_right">具体配色</span>
                <span class="bottom_left">颜色组</span>
              </span>
              <span class="row_item col"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <span class="print_row h31 noBorder">
                  <span class="row_item center">经向</span>
                </span>
                <span class="print_row h31">
                  <span class="row_item center"
                    v-for="(itemWarp,indexWarp) in zhujiaInfoCom.warp"
                    :key="indexWarp">{{itemWarp.key === 0 ? '主' : `夹${itemWarp.key}`}}</span>
                </span>
              </span>
              <span class="row_item col"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <span class="print_row h31 noBorder">
                  <span class="row_item center">纬向</span>
                </span>
                <span class="print_row h31">
                  <span class="row_item center"
                    v-for="(itemWeft,indexWeft) in zhujiaInfoCom.weft"
                    :key="indexWeft">{{itemWeft.key === 0 ? '主' : `夹${itemWeft.key}`}}</span>
                </span>
              </span>
              <span class="row_item col"
                :style="`flex:${3 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)}`">
                <span class="print_row h31 noBorder">
                  <span class="row_item center"></span>
                </span>
                <span class="print_row h31">
                  <span class="row_item center"
                    v-for="itemB in 3 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)"
                    :key="itemB"></span>
                </span>
              </span>
              <span class="row_item col w140">下机时间</span>
            </span>
            <span class="print_row h40">
              <span class="row_item bgGray w140 center">根数</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWarp,indexWarp) in zhujiaInfoCom.warp"
                    :key="`warp-${indexWarp}`">{{itemWarp.number || ''}}</span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWeft,indexWeft) in zhujiaInfoCom.weft"
                    :key="`weft-${indexWeft}`">
                    {{itemWeft.number || ''}}
                  </span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${3 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemB in (3 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length))"
                    :key="`buchong-${itemB}`"></span>
                </div>
              </span>
              <span class="row_item center w140">{{warp_data.contract_ratio === '100' ? '' : warp_data.contract_ratio}}</span>
            </span>
            <span class="print_row h40">
              <span class="row_item bgGray w140 center">克重</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWarp,indexWarp) in zhujiaInfoCom.warp"
                    :key="`warp-${indexWarp}`">{{itemWarp.weight && `${itemWarp.weight}g` || ''}}</span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWeft,indexWeft) in zhujiaInfoCom.weft"
                    :key="`weft-${indexWeft}`">{{itemWeft.weight && `${itemWeft.weight}g` || ''}}</span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${3 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemB in (3 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length))"
                    :key="`buchong-${itemB}`"></span>
                </div>
              </span>
              <span class="row_item center w140">织造数量</span>
            </span>
            <span class="print_row h40"
              v-for="(item,index) in color_data"
              :key="index">
              <span class="row_item bgGray w140 center">{{item.product_color}}</span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWarp,indexWarp) in zhujiaInfoCom.warp"
                    :key="`warp-${indexWarp}`">{{item.color_scheme.warp[itemWarp.key] && item.color_scheme.warp[itemWarp.key].name || ''}}</span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="(itemWeft,indexWeft) in zhujiaInfoCom.weft"
                    :key="`weft-${indexWeft}`">{{item.color_scheme.weft[itemWeft.key] && item.color_scheme.weft[itemWeft.key].name || ''}}</span>
                </div>
              </span>
              <span class="row_item center"
                :style="`flex:${3 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)}`">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    v-for="itemB in (3 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length))"
                    :key="`buchong-${itemB}`"></span>
                </div>
              </span>
              <span class="row_item center w140">{{item.number || ''}}</span>
            </span>
            <template v-if="color_data.length < 4">
              <span class="print_row h40"
                v-for="item in 3-color_data.length"
                :key="item+'false'">
                <span class="row_item bgGray w140 center"></span>
                <span class="row_item center"
                  :style="`flex:${zhujiaInfoCom.warp.length || 1}`">
                  <div class="print_row h40 noBorder">
                    <span class="row_item center"
                      v-for="(itemWarp,indexWarp) in zhujiaInfoCom.warp"
                      :key="`warp-${indexWarp}`"></span>
                  </div>
                </span>
                <span class="row_item center"
                  :style="`flex:${zhujiaInfoCom.weft.length || 1}`">
                  <div class="print_row h40 noBorder">
                    <span class="row_item center"
                      v-for="(itemWeft,indexWeft) in zhujiaInfoCom.weft"
                      :key="`weft-${indexWeft}`"></span>
                  </div>
                </span>
                <span class="row_item center"
                  :style="`flex:${3 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length)}`">
                  <div class="print_row h40 noBorder">
                    <span class="row_item center"
                      v-for="itemB in (3 - (zhujiaInfoCom.warp.length + zhujiaInfoCom.weft.length))"
                      :key="`buchong-${itemB}`"></span>
                  </div>
                </span>
                <span class="row_item w140 center"></span>
              </span>
            </template>
          </div>
        </div>
      </div>
    </template>
    <!-- 穿综法超出时 -->
    <div class="printTable outTable"
      style="break-inside: avoid;"
      @click.right="handleClickRight($event,2)"
      v-if="(WBL || 5) < craftDetail.draft_method.GLShow.map(itemG=>itemG.length).reduce((total,current)=>total+current,0)">
      <div class="outItem">
        <span class="label">{{$route.params.type==='1'?'产':'样'}}品编号：</span>
        {{craftDetail.product_info.product_code}}
      </div>
      <div class="outItem">
        <span class="label">穿综法循环：</span>
        <span :style="`font-size:${FONTSIZE}px;line-height: 1em;`">{{craftDetail.draft_method|filterThroughMethod}}</span>
      </div>
      <div class="outItem"
        v-for="(items,indexs) in craftDetail.draft_method.GLShow"
        :key="indexs">
        <span class="label">纹版图{{letterArr[indexs]}}：</span>
        <div class="print_body noBorder">
          <span class="print_row maxHeight noBorder canWarp">
            <span class="row_item noBorder WBXHSIGN"
              :style="`flex:auto;min-width:${(100 / WBL) || 20}%`"
              v-for="(item,index) in craftDetail.draft_method.GLShow[indexs]"
              :key="index">
              <div :class="['WBXHSIGN__left',{'hidden':!findWBXHItem(indexs,craftDetail.draft_method.GLXuhao[indexs] && craftDetail.draft_method.GLXuhao[indexs][index] || (index + 1)).left}]"></div>
              <span class="index"
                :class="GLMapArr[indexs][index]"
                :content="`${letterArr[indexs]}${craftDetail.draft_method.GLXuhao[indexs] && craftDetail.draft_method.GLXuhao[indexs][index] || (index + 1)}`">{{letterArr[indexs]}}{{craftDetail.draft_method.GLXuhao[indexs] && craftDetail.draft_method.GLXuhao[indexs][index] || (index + 1)}}</span>
              <span class="detail">
                <span class="item">{{item[0]}}</span>
                <span class="item">{{item[1]}}</span>
                <span class="item">{{item[2]}}</span>
                <div class="WBXHSIGN__right"
                  v-if="findWBXHItem(indexs,craftDetail.draft_method.GLXuhao[indexs] && craftDetail.draft_method.GLXuhao[indexs][index] || (index + 1)).right">
                  <span class="repeat">X{{findWBXHItem(indexs,craftDetail.draft_method.GLXuhao[indexs] && craftDetail.draft_method.GLXuhao[indexs][index] || (index + 1)).value}}遍</span>
                </div>
              </span>
            </span>
          </span>
        </div>
      </div>
      <!-- <div class="outItem"
        v-for="(item,index) in craftDetail.draft_method.GLRepeat"
        :key="'xunhuan-' + index">
        <span class="label">纹版图{{letterArr[index]}}：</span>
        <div style="display:block;padding-left:32px;margin:12px 0"
          v-for="(itemChild,indexChild) in item"
          :key="indexChild">
          <span style="margin:0 20px;color:#666">{{itemChild.start}}到{{itemChild.end}}<span style="margin:0 5px"></span>✖{{itemChild.repeat}}遍</span>
          <span style="margin:0 20px;color:#666"></span>
        </div>
      </div> -->
      <div class="outItem"
        style="word-break: break-all;">
        <span class="label">穿综备注：</span>
        <span :style="`font-size:${FONTSIZE}px;line-height: 1em;`">{{craftDetail.draft_method.desc}}</span>
      </div>
      <div class="outItem"
        style="word-break: break-all;">
        <span class="label">纹版备注：</span>
        <span :style="`font-size:${FONTSIZE}px;line-height: 1em;`">{{weft_data.contract_ratio}}</span>
      </div>
    </div>
    <div class="setting_sign_style"
      v-if="showRMeau"
      :style="`left:${X_position || 0}px;top:${Y_position}px`"
      @click="noCloseRMeau">
      <div class="setting_item"
        @click="windowMethod(1)">刷新</div>
      <div class="setting_item"
        @click="windowMethod(2)">打印</div>
      <template v-if="showRMeau === 1">
        <div class="setting_item"
          :class="{'checked':signType === '1'}"
          @click.stop="changeModeType('sign_type_craft_table_setting','signType','1')">模式一</div>
        <div class="setting_item"
          :class="{'checked':signType === '2'}"
          @click.stop="changeModeType('sign_type_craft_table_setting','signType','2')">模式二</div>
        <div class="setting_item"
          :class="{'checked':signType === '3'}"
          @click.stop="changeModeType('sign_type_craft_table_setting','signType','3')">模式三</div>
      </template>
      <template v-else-if="showRMeau === 2">
        <div class="setting_item">
          {{`设置列数(×${WBL})`}}
          <el-input-number v-model="WBL"
            size='small'
            :step="1"
            :min='1'
            :max="6"
            @change="changeWBL"></el-input-number>
        </div>
        <div class="setting_item">
          {{`字体大小(×${FONTSIZE})`}}
          <el-input-number v-model="FONTSIZE"
            size='small'
            :step="2"
            :min='18'
            :max="36"
            @change="changeFONTSIZE"></el-input-number>
        </div>
      </template>
      <template v-else-if="showRMeau === 3">
        <div class="setting_item"
          :class="{'checked':colourInfoType === '1'}"
          @click.stop="changeModeType('colour_info_craft_table_setting','colourInfoType','1')">模式一</div>
        <div class="setting_item"
          :class="{'checked':colourInfoType === '2'}"
          @click.stop="changeModeType('colour_info_craft_table_setting','colourInfoType','2')">模式二</div>
        <div class="setting_item"
          :class="{'checked':colourInfoType === '3'}"
          @click.stop="changeModeType('colour_info_craft_table_setting','colourInfoType','3')">模式三</div>
      </template>
    </div>
  </div>
</template>

<script>
import { craft } from '@/assets/js/api.js'
import { letterArr } from '@/assets/js/dictionary.js'
export default {
  data () {
    return {
      loading: true,
      GLMapArr: [['']],
      companyName: window.sessionStorage.getItem('full_name'),
      qrCodeUrl: '',
      craftDetail: {
        product_info: {
          category_info: {},
          size: [],
          materials: [],
          img: []
        },
        draft_method: {
          GL: [],
          GLShow: [],
          GLFlag: '',
          GLRepeat: [],
          GLXuhao: []
        }
      },
      warp_data: {
        material_data: [],
        assist_material: [],
        warp_rank: [[], [], [], [], [], []],
        merge_data: [],
        warp_rank_back: [[], [], [], [], [], []],
        merge_data_back: [],
        length_is: 0,
        length_back: 0
      },
      weft_data: {
        material_data: [],
        assist_material: [],
        weft_rank: [[], [], [], [], [], []],
        merge_data: [],
        weft_rank_back: [[], [], [], [], [], []],
        merge_data_back: [],
        length_is: 0,
        length_back: 0
      },
      color_data: [],
      colorWeight: {
        warp: [],
        weft: []
      },
      yarn_coefficient: [],
      zhujia_info: [],
      // yarn_coefficient: [],
      letterArr: letterArr,
      showRMeau: false,
      X_position: 0,
      Y_position: 0,
      signType: window.localStorage.getItem('sign_type_craft_table_setting') || '1',
      WBL: window.localStorage.getItem('WBL_craft_table_setting') || 5,
      FONTSIZE: window.localStorage.getItem('FONTSIZE_craft_table_setting') || 18,
      colourInfoType: window.localStorage.getItem('colour_info_craft_table_setting') || '1',
      zhujiaInfoCom: {
        warp: [],
        weft: []
      }
    }
  },
  methods: {
    findWBXHItem (indexs, xuhao) {
      if (!this.craftDetail.draft_method.GLRepeat[indexs]) return {}
      const finded = this.craftDetail.draft_method.GLRepeat[indexs].find(itemF => +itemF.start === +xuhao || +itemF.end === +xuhao)
      if (!finded) return {}
      return {
        left: +finded.start === +xuhao,
        right: +finded.end === +xuhao,
        value: finded.repeat
      }
    },
    windowMethod (type) {
      this.showRMeau = false
      window.requestAnimationFrame(() => {
        if (type === 1) {
          window.location.reload()
        } else if (type === 2) {
          window.print()
        }
      })
    },
    handleClickRight (e, type = 1) {
      this.showRMeau = type
      this.X_position = e.clientX
      this.Y_position = e.clientY
      e.preventDefault()
      e.stopPropagation()
    },
    noCloseRMeau (e) {
      e.stopPropagation()
    },
    changeModeType (key, index, e) {
      window.localStorage.setItem(key, e)
      this[index] = window.localStorage.getItem(key) || '1'
      this.showRMeau = false
    },
    changeWBL (e) {
      window.localStorage.setItem('WBL_craft_table_setting', e)
    },
    changeFONTSIZE (e) {
      window.localStorage.setItem('FONTSIZE_craft_table_setting', e)
    },
    // 给合并规则里添加value
    pushValue (item, key, index) {
      let valueArr = item[key] // value来源数组
      item[index].forEach(val => {
        val.value = this.$clone(valueArr[val.row]).splice(val.col, val.colspan).filter(num => num)[0]
        if (val.row === 3) {
          val.totalNumber = this.getValue(val, valueArr[2])
        } else if (val.row === 4) {
          let data = this.getFlatTable(valueArr, item[index]).filter(itemF => (itemF.order > val.col) && (itemF.order <= (val.col + val.colspan)))
          val.totalNumber = data.map(itemM => (+itemM.number || 1)).reduce((total, current) => {
            return total + current
          }, 0)
        }
      })
      this.changeMergeMethod(item[index], Math.ceil(item[key][0].length / 16)) // 处理合并规则
    },
    // 计算梭数
    getValue (valueData, dataArr) {
      if (Number(valueData.value)) {
        return dataArr.slice(valueData.col, valueData.col + valueData.colspan).map(itemN => Number(itemN) || 1).reduce((total, current) => {
          return Number(total) + Number(current)
        }) * Number(valueData.value)
      } else {
        try {
          let arr = []
          let valueR = valueData.value.split(']')[0].split('[')[1]
          let start = valueData.value.split(']')[1].split('[')[1]
          let end = valueData.value.split(']')[2].split('[')[1]
          if (+start <= +end && +start > valueData.col && +end <= (valueData.col + valueData.colspan)) {
            // 此处循环一下
            for (let i = 1; i <= +valueR; i++) {
              if (i !== +valueR) {
                arr.push(...dataArr.slice(valueData.col, valueData.col + valueData.colspan))
              } else {
                arr.push(...dataArr.slice(valueData.col, +start - 1))
                if (+end !== valueData.col + valueData.colspan) {
                  arr.push(...dataArr.slice(+end - 1, valueData.col + valueData.colspan))
                }
              }
            }
            return arr.map(itemN => Number(itemN) || 1).reduce((total, current) => {
              return total + current
            })
          } else { // start不小于end、start不大于起始列、end不小于结束列直接视为参数错误返回null
            return null
          }
        } catch (e) {
          console.log(e)
          return null
        }
      }
    },
    // 对合并规则进行处理
    changeMergeMethod (item, key) {
      for (let i = 1; i < key; i++) {
        item.forEach(val => {
          if (i * 16 > val.col && (val.col + val.colspan - 1) >= i * 16) {
            item.push({
              col: i * 16,
              colspan: val.colspan - (i * 16 - val.col),
              removed: val.removed,
              row: val.row,
              rowspan: val.rowspan,
              split: true,
              noLeftJianTou: true,
              value: val.value,
              totalNumber: val.totalNumber
            })
            val.colspan = i * 16 - val.col
            val.split = true
            if (!val.noLeftJianTou) {
              val.noRightJianTou = true
            } else {
              val.noLeftJianTou = false
              val.noJianTou = true
            }
          }
        })
      }
    },
    // 合并单元格
    mergeSpan (item, index, key, mergeIndex, callBack, keys) {
      let mergeALLMathod = item[mergeIndex]
      let mergeMethod = mergeALLMathod.filter(val => Number(val.row) === Number(index)) // 合并规则
      let isMergeData = callBack ? callBack(item[key][index], keys, true) : item[key][index] // 需要合并的数据
      let mergeData = [] // 合并后的数据
      for (let ind = 0; ind < isMergeData.length; ind++) {
        let val = isMergeData[ind]
        let mergeItem = mergeMethod.find(mergeItem => ind >= (mergeItem.col - (keys || 0) * 16) && ((mergeItem.col - (keys || 0) * 16) + mergeItem.colspan - 1) >= ind)
        if (mergeItem) {
          mergeData.push({
            value: mergeItem.value,
            colspan: mergeItem.colspan,
            isSplit: mergeItem.split,
            noLeftJianTou: mergeItem.noLeftJianTou,
            noRightJianTou: mergeItem.noRightJianTou,
            noJianTou: mergeItem.noJianTou,
            totalNumber: mergeItem.totalNumber
          })
          ind += (mergeItem.colspan - 1)
        } else {
          mergeData.push({ value: val, colspan: 1 })
        }
      }
      return mergeData
    },
    // 返回字号
    returnSize (str) {
      str = `${str}`
      let num = 0
      str.split('').forEach(item => {
        num += (item.charCodeAt(0) > 255 ? 2 : 1)
      })
      if (num < 7) {
        return '18px'
      } else if (num < 9) {
        return '16px'
      } else if (num < 11) {
        return '14px'
      } else if (num < 13) {
        return '12px'
      } else {
        return '10px'
      }
    },
    // 拆分单元格
    splitData (item, index) {
      return this.$clone(item).splice(index * 16, 16)
    },
    // 展平合并信息
    getFlatTable (table, mergeData) {
      let tableArr = table
      let mergeTable = mergeData || []
      let firstMerge = this.getMergeInfo(mergeTable, 3, tableArr[0].length)
      let secondMerge = this.getMergeInfo(mergeTable, 4, tableArr[0].length)
      // 处理合并项的合并信息
      let firstArr = []
      firstMerge.forEach((item) => {
        let temporaryStorage = [] // 临时存储合并项
        for (let i = item.col; i < (item.col + item.colspan); i++) {
          temporaryStorage.push({
            order: parseInt(tableArr[0][i]),
            color: tableArr[1][i],
            number: tableArr[2][i]
            // GLorPM: tableArr[5][i]
          })
        }
        let forNum = this.getSpecial(tableArr[item.row][item.col] || 1)
        for (let i = 0; i < forNum.number; i++) {
          let realStorage = temporaryStorage
          if (forNum.start && i === (forNum.number - 1)) {
            realStorage = temporaryStorage.filter((item) => {
              return item.order < forNum.start || item.order > forNum.end
            })
          }
          firstArr.push(realStorage)
        }
      })
      let secondArr = []
      secondMerge.forEach((item) => {
        let temporaryStorage = firstArr.filter((itemFilter) => {
          return itemFilter[0].order > item.col && itemFilter[0].order <= (item.col + item.colspan)
        })
        let forNum = this.getSpecial(tableArr[item.row][item.col] || 1)
        for (let i = 0; i < forNum.number; i++) {
          let realStorage = temporaryStorage
          if (forNum.start && i === (forNum.number - 1)) {
            realStorage = temporaryStorage.filter((item) => {
              let flag = true
              item.forEach((itemChild) => {
                if (itemChild.order >= forNum.start && itemChild.order <= forNum.end) {
                  flag = false
                }
              })
              return flag
            })
          }
          secondArr.push(realStorage)
        }
      })
      // 多维数组展平
      let flattenArr = this.mergeArray(secondArr)
      return flattenArr
    },
    // 合并项信息处理
    getMergeInfo (mergeTable, row, length) {
      let mergeArr = mergeTable.filter(item => item.row === row).sort((a, b) => { return a.col - b.col })
      let saveMerge = []
      let col = 0
      let mergeIndex = 0
      while (col < length) {
        if (mergeArr[mergeIndex]) {
          if (col < mergeArr[mergeIndex].col) {
            for (let i = 0; i < mergeArr[mergeIndex].col - col; i++) {
              saveMerge.push({
                col: i + col,
                colspan: 1,
                row: row
              })
            }
            col = mergeArr[mergeIndex].col
          } else {
            saveMerge.push({
              col: mergeArr[mergeIndex].col,
              colspan: mergeArr[mergeIndex].colspan,
              row: row
            })
            col = mergeArr[mergeIndex].col + mergeArr[mergeIndex].colspan
            mergeIndex++
          }
        } else {
          for (let i = col; i < length; i++) {
            saveMerge.push({
              col: i,
              colspan: 1,
              row: row
            })
          }
          col = length
        }
      }
      return saveMerge
    },
    // 合并数组
    mergeArray (arr, saveArr) {
      let array = saveArr || []
      arr.forEach((item) => {
        if (Array.isArray(item)) {
          this.mergeArray(item, array)
        } else {
          array.push(item)
        }
      })
      return array
    },
    // 获取特殊数据,用于处理 乘以[n]遍，最后一遍去掉[x]列到[y]列
    getSpecial (info) {
      if (Number(info)) {
        return {
          number: Number(info)
        }
      }
      if (info === '顺一遍倒一遍') {
        return {
          number: 2
        }
      }
      // 只解析上列字符串，别的不管
      let arr = info.split(']')
      return {
        number: arr[0].split('[')[1],
        start: arr[1].split('[')[1],
        end: arr[2].split('[')[1]
      }
    },
    stringToJson (str) {
      try {
        var obj = JSON.parse(str)
        return obj.join('+')
      } catch (e) {
        return str || '无'
      }
    }
  },
  created () {
    craft.getByProduct({
      product_id: this.$route.params.id,
      product_type: this.$route.params.type
    }).then(res => {
      if (res.data.stauts !== false) {
        let data = null
        data = res.data.data.find(item => item.id === this.$route.params.craftId)
        if (!data) {
          this.$message('未找到工艺单ID为' + this.$route.params.craftId + '的工艺单')
          return
        }
        // 计算箭头的代码有问题，我自己计算根数保留一份合并项的原始数据
        let mergeNative = {
          warp_merge: this.$clone(JSON.parse(data.warp_data.merge_data)),
          warp_merge_back: this.$clone(JSON.parse(data.warp_data.merge_data_back)),
          weft_merge: this.$clone(JSON.parse(data.weft_data.merge_data)),
          weft_merge_back: this.$clone(JSON.parse(data.weft_data.merge_data_back))
        }
        data.warp_data.merge_data = JSON.parse(data.warp_data.merge_data)
        data.warp_data.merge_data_back = JSON.parse(data.warp_data.merge_data_back)
        data.warp_data.warp_rank = JSON.parse(data.warp_data.warp_rank)
        data.warp_data.warp_rank_back = JSON.parse(data.warp_data.warp_rank_back)
        data.weft_data.merge_data = JSON.parse(data.weft_data.merge_data)
        data.weft_data.merge_data_back = JSON.parse(data.weft_data.merge_data_back)
        data.weft_data.weft_rank = JSON.parse(data.weft_data.weft_rank)
        data.weft_data.weft_rank_back = JSON.parse(data.weft_data.weft_rank_back)
        this.craftDetail = this.$clone(data)
        this.craftDetail.draft_method.GLShow = this.$clone(data.draft_method.GL)
        this.craftDetail.draft_method.GLRepeat = this.$clone(data.draft_method.GLRepeat) || []
        this.craftDetail.draft_method.GLXuhao = []
        this.craftDetail.draft_method.GLRepeat.forEach((item) => {
          let addNum = 0
          item.forEach((itemChild) => {
            itemChild.start += addNum
            itemChild.end += addNum
            addNum += (itemChild.end - itemChild.start + 1) * (itemChild.repeat - 1)
          })
        })
        // 将纹版图循环补充完整
        // 例如1-2循环2次，5-6循环两次，补充3-4循环1次进去
        let GLRepeatComplete = []
        if (this.craftDetail.draft_method.GLRepeat.length > 0 && !this.craftDetail.draft_method.GLRepeat[0][0].start) {
          this.craftDetail.draft_method.GLRepeat = []
        }
        this.craftDetail.draft_method.GLRepeat.forEach((item, index) => {
          GLRepeatComplete.push([])
          let start = 1
          item.forEach((itemChild) => {
            if (itemChild.start - start > 0) {
              GLRepeatComplete[index].push({
                start: start,
                end: itemChild.start - 1,
                repeat: 1
              })
            }
            GLRepeatComplete[index].push(itemChild)
            start = itemChild.end + 1
          })
          if (this.craftDetail.draft_method.GLShow[index].length >= start) {
            GLRepeatComplete[index].push({
              start: start,
              end: this.craftDetail.draft_method.GLShow[index].length,
              repeat: 1
            })
          }
        })
        // 如果没有纹板图循环，直接生成一个GLRepeatComplete
        if (this.craftDetail.draft_method.GLRepeat.length === 0) {
          this.craftDetail.draft_method.GLShow.forEach((item) => {
            GLRepeatComplete.push([{
              start: 1,
              end: item.length,
              repeat: 1
            }])
          })
        }
        // 序号计算
        GLRepeatComplete.forEach((item, index) => {
          this.craftDetail.draft_method.GLXuhao.push([])
          let addNum = 0
          item.forEach((itemChild) => {
            for (let i = itemChild.start; i <= itemChild.end; i++) {
              this.craftDetail.draft_method.GLXuhao[index].push(i + addNum)
            }
            addNum += (itemChild.end - itemChild.start + 1) * (itemChild.repeat - 1)
          })
        })
        // GLRepeatComplete.forEach((item, index) => {
        //   this.craftDetail.draft_method.GL[index] = []
        //   item.forEach((itemChild) => {
        //     for (let j = 0; j < itemChild.repeat; j++) {
        //       for (let i = itemChild.start; i <= itemChild.end; i++) {
        //         this.craftDetail.draft_method.GL[index].push(this.craftDetail.draft_method.GLShow[index][i - 1])
        //       }
        //     }
        //   })
        // })
        this.GLMapArr = data.reserve_column ? JSON.parse(data.reserve_column) : this.craftDetail.draft_method.GLXuhao.map((item, index) => {
          return item.map((itemChild, indexChild) => {
            return this.craftDetail.draft_method.GLXuhao[index] ? (this.craftDetail.draft_method.GLXuhao[index][indexChild] || '') : ''
          })
        })
        this.warp_data = this.$clone(data.warp_data)
        this.warp_data.length_is = this.warp_data.warp_rank[0].length
        this.warp_data.length_back = this.warp_data.warp_rank_back[0].length
        this.warp_data.reed_width_data = this.stringToJson(this.warp_data.reed_width_data)
        this.weft_data = this.$clone(data.weft_data)
        this.weft_data.length_is = this.weft_data.weft_rank[0].length
        this.weft_data.length_back = this.weft_data.weft_rank_back[0].length
        this.pushValue(this.warp_data, 'warp_rank', 'merge_data') // 给合并规则里附上value
        this.pushValue(this.warp_data, 'warp_rank_back', 'merge_data_back')// 给合并规则里附上value
        this.pushValue(this.weft_data, 'weft_rank', 'merge_data')// 给合并规则里附上value
        this.pushValue(this.weft_data, 'weft_rank_back', 'merge_data_back')// 给合并规则里附上value
        let colorData = []
        this.warp_data.color_data.forEach(item => {
          let colorFlag = colorData.find(key => key.product_color === item.product_color)
          if (!colorFlag) {
            colorData.push({
              product_color: item.product_color,
              number: item.weave_number,
              color_scheme: {
                warp: item.color_scheme,
                weft: []
              }
            })
          } else {
            colorFlag.color_scheme.warp = item.color_scheme
          }
        })
        this.weft_data.color_data.forEach(item => {
          let colorFlag = colorData.find(key => key.product_color === item.product_color)
          if (!colorFlag) {
            colorData.push({
              product_color: item.product_color,
              number: item.weave_number,
              color_scheme: {
                warp: [],
                weft: item.color_scheme
              }
            })
          } else {
            colorFlag.color_scheme.weft = item.color_scheme
          }
        })
        this.color_data = colorData
        // 初始化主夹信息
        this.warp_data.material_data.forEach(item => {
          item.apply.forEach(val => {
            if (this.zhujia_info.indexOf(val) === -1) {
              this.zhujia_info.push(val)
            }
          })
        })
        this.weft_data.material_data.forEach(item => {
          item.apply.forEach(val => {
            if (this.zhujia_info.indexOf(val) === -1) {
              this.zhujia_info.push(val)
            }
          })
        })
        // 计算克重信息
        let colorNumber = {
          warp: [],
          weft: []
        }
        // 展平合并信息
        let warpTable = this.getFlatTable(this.warp_data.warp_rank, mergeNative.warp_merge).map((item) => {
          if (!item.GLorPM) {
            item.GLorPM = 'Ⅰ'
          }
          return item
        })
        let weftTable = this.getFlatTable(this.weft_data.weft_rank, mergeNative.weft_merge).map((item) => {
          if (!item.GLorPM) {
            item.GLorPM = 'A'
          }
          return item
        })
        let warpTableBack = this.getFlatTable(this.warp_data.warp_rank_back, mergeNative.warp_merge_back).map((item) => {
          if (!item.GLorPM) {
            item.GLorPM = 'Ⅰ'
          }
          return item
        })
        let weftTableBack = this.getFlatTable(this.weft_data.weft_rank_back, mergeNative.weft_merge_back).map((item) => {
          if (!item.GLorPM) {
            item.GLorPM = 'A'
          }
          return item
        })
        // 将展平的数据用于克重计算
        warpTable.forEach((item) => {
          colorNumber.warp[item.color] = colorNumber.warp[item.color] ? colorNumber.warp[item.color] : 0
          colorNumber.warp[item.color] += Number(item.number)
        })
        weftTable.forEach((item) => {
          colorNumber.weft[item.color] = colorNumber.weft[item.color] ? colorNumber.weft[item.color] : 0
          colorNumber.weft[item.color] += Number(item.number)
        })
        warpTableBack.forEach((item) => {
          colorNumber.warp[item.color] = colorNumber.warp[item.color] ? colorNumber.warp[item.color] : 0
          colorNumber.warp[item.color] += Number(item.number)
        })
        weftTableBack.forEach((item) => {
          colorNumber.weft[item.color] = colorNumber.weft[item.color] ? colorNumber.weft[item.color] : 0
          colorNumber.weft[item.color] += Number(item.number)
        })
        this.warp_data.material_data.forEach((item) => {
          item.apply.forEach((itemChild) => {
            this.colorWeight.warp[itemChild] = {
              key: itemChild,
              number: colorNumber.warp[itemChild],
              weight: this.$toFixed(colorNumber.warp[itemChild] * (this.weft_data.neichang + this.weft_data.rangwei) * data.yarn_coefficient.find((itemFind) => itemFind.name === item.material_name).value / 100)
            }
          })
        })
        this.weft_data.material_data.forEach((item) => {
          item.apply.forEach((itemChild) => {
            this.colorWeight.weft[itemChild] = {
              key: itemChild,
              number: colorNumber.weft[itemChild],
              weight: this.$toFixed(colorNumber.weft[itemChild] * (Number(this.warp_data.weight_calculate_formula) === 1 ? this.warp_data.reed_width : this.weft_data.peifu) * data.yarn_coefficient.find((itemFind) => itemFind.name === item.material_name).value / 100)
            }
          })
        })
        // 计算辅料
        this.warp_data.assist_material.forEach(item => {
          item.apply = item.apply.map(itemA => {
            return {
              value: itemA,
              weight: this.$toFixed(item.number * (colorNumber.warp[itemA] * (this.weft_data.neichang + this.weft_data.rangwei) * data.yarn_coefficient.find(itemF => itemF.name === item.material_name).value / 100))
            }
          })
        })
        this.weft_data.assist_material.forEach(item => {
          item.apply = item.apply.map(itemA => {
            return {
              value: itemA,
              weight: this.$toFixed(item.number * (colorNumber.weft[itemA] * (Number(this.warp_data.weight_calculate_formula) === 1 ? this.warp_data.reed_width : this.weft_data.peifu) * data.yarn_coefficient.find(itemF => itemF.name === item.material_name).value / 100))
            }
          })
        })
        this.yarn_coefficient = data.yarn_coefficient
        this.zhujiaInfoCom = {
          warp: this.colorWeight.warp.filter(itemF => itemF.number),
          weft: this.colorWeight.weft.filter(itemF => itemF.number)
        }
        setTimeout(() => {
          window.print()
        }, 1000)
      }
    })
  },
  mounted () {
    const QRCode = require('qrcode')
    QRCode.toDataURL(window.location.origin + '/craft/craftDetail/' + this.$route.params.id + '/' + this.$route.params.type, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (!err) {
        this.qrCodeUrl = url
      }
    })
  },
  filters: {
    filterType (item) {
      return item.category_info ? [item.category_info.product_category, item.type_name, item.style_name, item.flower_id].join('/') : '/'
    },
    filterMaterial (item) {
      return item.map(value => value.number + '%' + value.component_name).join('.')
    },
    filterMaterialClass (item) {
      let arr = []
      item.forEach(value => {
        if (value !== 0) {
          arr.push('夹' + value)
        } else {
          arr.push('主')
        }
      })
      return arr.join('/')
    },
    filterThroughMethod (items) {
      let str = ''
      let romanNum = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ', 'Ⅺ', 'Ⅻ']
      if (items.PMFlag === 'normal') {
        items.PM.forEach((item, key) => {
          str += (romanNum[key] || (key + 1)) + '【' + item.number + '根（' + item.value + '）' + '】' + (item.repeat && item.repeat !== 1 ? 'x' + item.repeat + '遍' : '') + (key !== items.PM.length - 1 ? '。' : '')
        })
      } else if (items.PMFlag === 'complex') {
        items.PM.forEach((item, key) => {
          str += (romanNum[key] || (key + 1))
          item.children.forEach((value, index) => {
            str += ('【' + value.number + '根')
            value.children.forEach((val, ind) => {
              str += '（' + val.value + '）' + (val.repeat && val.repeat !== 1 ? 'x' + val.repeat + '遍' : '') + (ind !== value.children.length - 1 ? '，' : '')
            })
            str += ('】' + (item.repeat && item.repeat !== 1 ? 'x' + item.repeat + '遍' : '') + (index !== item.children.length - 1 ? '。' : ''))
          })
        })
      }
      return str
    },
    filterValue (item) {
      if (item.value && item.value.indexOf('[') !== -1 && item.colspan < 6) {
        let valueR = item.value.split(']')[0].split('[')[1]
        let start = item.value.split(']')[1].split('[')[1]
        let end = item.value.split(']')[2].split('[')[1]
        return `x${valueR}去${start}-${end}列`
      } else if (item.value && item.value.indexOf('[') !== -1 && item.colspan >= 6) {
        let valueR = item.value.split(']')[0].split('[')[1]
        let start = item.value.split(']')[1].split('[')[1]
        let end = item.value.split(']')[2].split('[')[1]
        return `x[${valueR}]遍，最后去掉[${start}]-[${end}]列`
      } else {
        return item.value
      }
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/craft/craftTable.less";
</style>
