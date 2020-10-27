<template>
  <div class='printHtml'
    id="craftTable">
    <div class="printTable">
      <div class="print_head">
        <div class="left">
          <span class="title">{{companyName}}工艺单</span>
          <span class="item">
            <span class="label">工艺单编号：</span>
            {{craftDetail.craft_code}}
          </span>
          <span class="item">
            <span class="label">创建人：</span>
            {{craftDetail.user_name}}
          </span>
          <span class="item">
            <span class="label">创建日期：</span>
            {{craftDetail.create_time}}
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
          <span class="row_item w100 center">{{$route.params.type==='1'?'产':'样'}}品品类</span>
          <span class="row_item left">{{craftDetail.product_info|filterType}}</span>
          <span class="row_item w100 center">{{$route.params.type==='1'?'产':'样'}}品编号</span>
          <span class="row_item left">{{craftDetail.product_info.product_code||'/'}}</span>
        </div>
        <div class="print_row">
          <span class="row_item w100 center">工艺单名称</span>
          <!-- <span class="row_item left"></span> -->
          <span class="row_item left">{{craftDetail.title || ''}}</span>
          <span class="row_item w100 center">大身规格</span>
          <!-- <span class="row_item left"></span> -->
          <span class="row_item left">{{craftDetail.size ? craftDetail.size + 'cm' : ''}}</span>
          <span class="row_item w100 center">大身克重</span>
          <span class="row_item left">{{craftDetail.weight ? craftDetail.weight + 'g' : ''}}</span>
        </div>
        <!-- 经向 -->
        <div class="print_row h261">
          <span class="w50 col_title">原料经向</span>
          <span class="row_item col">
            <span class="print_row h35 noBorder">
              <span class="row_item w180 center">主要原料(经)</span>
              <span class="row_item left">
                <template v-for="item in warp_data.material_data.filter(vals=>vals.type_material === 1)">
                  {{item.apply|filterMaterialClass}}
                  {{':' + item.material_name }}
                  ({{yarn_coefficient.find(itemFind=>itemFind.name===item.material_name).chuankou || warp_data.reed_method}}根/筘)
                </template>
              </span>
            </span>
            <span class="print_row h35">
              <span class="row_item w180 center">次要原料(经)</span>
              <span class="row_item left">
                <template v-for="item in warp_data.material_data.filter(vals=>vals.type_material === 2)">
                  {{item.apply|filterMaterialClass}}
                  {{':' + item.material_name }}
                  ({{yarn_coefficient.find(itemFind=>itemFind.name===item.material_name).chuankou || warp_data.reed_method}}根/筘)
                </template>
              </span>
            </span>
            <span class="print_row h35">
              <span class="row_item w180 center">次要辅料(经)</span>
              <span class="row_item left">
                <template v-for="item in warp_data.assist_material">
                  {{item.apply|filterMaterialClass}}
                  {{':' + item.material_name }}
                </template>
              </span>
            </span>
            <span class="print_row maxHeight">
              <span class="col_title">经向排列</span>
              <span class="row_item col">
                <template v-if="warp_data.length_is < 17 && weft_data.length_is < 17  && !warp_data.back_status && !weft_data.back_status">
                  <span class="print_row h31 noBorder">
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
                      {{item.value}}
                      <span style="font-size:12px;color:rgba(0,0,0,1)"
                        v-if="item.value && (item.isSplit || item.colspan > 1)">遍</span>
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
                      {{item.value}}
                      <span style="font-size:12px;color:rgba(0,0,0,1)"
                        v-if="item.value && (item.isSplit || item.colspan > 1)">遍</span>
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
                      <span style="font-size:12px;color:rgba(0,0,0,1)"
                        v-if="item.value && (item.isSplit || item.colspan > 1)">遍</span>
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
              <span class="row_item w180 center">整经总头纹</span>
              <span class="row_item left">{{warp_data.weft}}</span>
              <span class="row_item w180 center">边型</span>
              <span class="row_item left">{{warp_data.side_name}}</span>
            </span>
            <span class="print_row h40">
              <span class="row_item w180 center">整经门幅</span>
              <span class="row_item left unit">
                {{warp_data.width ? warp_data.width : ''}}
                <span class="text">根</span>
              </span>
              <span class="row_item w180 center">机型</span>
              <span class="row_item left">{{warp_data.machine_name}}</span>
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
              <span class="col_title">穿综法</span>
              <span class="row_item col">
                <span class="print_row noBorder h40">
                  <span class="row_item w130 center noBorder">穿综法循环：</span>
                  <span class="row_item left">{{craftDetail.draft_method|filterThroughMethod}}</span>
                </span>
                <span class="print_row maxHeight">
                  <template v-if="craftDetail.draft_method.GLFlag === 'normal' && 6 > craftDetail.draft_method.GL[0].length ">
                    <span class="row_item noBorder center"
                      v-for="(item,index) in craftDetail.draft_method.GL[0]"
                      :key="index">
                      <span class="index">{{index+1}}</span>
                      <span class="detail">
                        <span class="item">{{item[0]}}</span>
                        <span class="item">{{item[1]}}</span>
                        <span class="item">{{item[2]}}</span>
                      </span>
                    </span>
                  </template>
                  <template v-else>
                    <span class="row_item center">见附件</span>
                  </template>
                </span>
                <span class="print_row h40">
                  <span class="row_item w100 center noBorder">穿综备注：</span>
                  <span class="row_item left">{{craftDetail.draft_method.desc}}</span>
                </span>
              </span>
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
            <span class="print_row h35">
              <span class="row_item w180 center">主要原料(纬)</span>
              <span class="row_item left">
                <template v-for="item in weft_data.material_data.filter(vals=>vals.type_material === 1)">
                  {{item.apply|filterMaterialClass}}
                  {{':' + item.material_name }}
                </template>
              </span>
            </span>
            <span class="print_row h35">
              <span class="row_item w180 center">次要原料(纬)</span>
              <span class="row_item left">
                <template v-for="item in weft_data.material_data.filter(vals=>vals.type_material === 2)">
                  {{item.apply|filterMaterialClass}}
                  {{':' + item.material_name }}
                </template>
              </span>
            </span>
            <span class="print_row h35">
              <span class="row_item w180 center">次要辅料(纬)</span>
              <span class="row_item left">
                <template v-for="item in weft_data.assist_material">
                  {{item.apply|filterMaterialClass}}
                  {{':' + item.material_name }}
                </template>
              </span>
            </span>
            <span class="print_row maxHeight">
              <span class="col_title">纬向排列</span>
              <span class="row_item col">
                <template v-if="warp_data.length_is < 17 && weft_data.length_is < 17  && !warp_data.back_status && !weft_data.back_status">
                  <span class="print_row h31 noBorder">
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
                      {{item.value}}
                      <span style="font-size:12px;color:rgba(0,0,0,1)"
                        v-if="item.value && (item.isSplit || item.colspan > 1)">遍</span>
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
                      {{item.value}}
                      <span style="font-size:12px;color:rgba(0,0,0,1)"
                        v-if="item.value && (item.isSplit || item.colspan > 1)">遍</span>
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
                      <span style="font-size:12px;color:rgba(0,0,0,1)"
                        v-if="item.value && (item.isSplit || item.colspan > 1)">遍</span>
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
        <div class="print_row h261">
          <span class="col_title">配色工艺</span>
          <span class="row_item col"
            v-if="zhujia_info.length < 7 && color_data.length < 4">
            <span class="print_row h60 noBorder bgGray">
              <span class="row_item w140 special_title">
                <span class="top_right">具体配色</span>
                <span class="bottom_left">颜色组</span>
              </span>
              <span class="row_item col"
                v-for="item in 6"
                :key="item">
                <span class="print_row h31 noBorder">
                  <span class="row_item center">{{item === 1 ? '主' : ('夹' + (item - 1))}}</span>
                </span>
                <span class="print_row h31">
                  <span class="row_item center">经</span>
                  <span class="row_item center">纬</span>
                </span>
              </span>
            </span>
            <span class="print_row h40">
              <span class="row_item bgGray w140 center">根数</span>
              <span class="row_item center"
                v-for="item in 6"
                :key="item">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    :style="{'font-size':returnSize(colorWeight.warp[item - 1] && colorWeight.warp[item - 1].number)}">{{(colorWeight.warp[item - 1] && colorWeight.warp[item - 1].number) ? colorWeight.warp[item - 1].number : ''}}</span>
                  <span class="row_item center"
                    :style="{'font-size':returnSize(colorWeight.weft[item - 1] && colorWeight.weft[item - 1].number)}">{{(colorWeight.weft[item - 1]&& colorWeight.weft[item - 1].number) ? colorWeight.weft[item - 1].number : ''}}</span>
                </div>
              </span>
            </span>
            <span class="print_row h40">
              <span class="row_item bgGray w140 center">克重</span>
              <span class="row_item center"
                v-for="item in 6"
                :key="item">
                <div class="print_row h40 noBorder">
                  <span class="row_item center"
                    :style="{'font-size':returnSize((colorWeight.warp[item-1] && colorWeight.warp[item-1].weight) + 'g')}">{{(colorWeight.warp[item-1] && colorWeight.warp[item-1].weight) ? colorWeight.warp[item-1].weight + 'g' : ''}}</span>
                  <span class="row_item center"
                    :style="{'font-size':returnSize((colorWeight.weft[item-1] && colorWeight.weft[item-1].weight) + 'g')}">{{(colorWeight.weft[item-1] && colorWeight.weft[item-1].weight) ? colorWeight.weft[item-1].weight + 'g' : ''}}</span>
                </div>
              </span>
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
                    :style="{'font-size':returnSize(item.color_scheme.warp[key-1] ? item.color_scheme.warp[key-1].name : '')}">{{item.color_scheme.warp[key-1] ? item.color_scheme.warp[key-1].name : ''}}</span>
                  <span class="row_item center"
                    :style="{'font-size':returnSize(item.color_scheme.weft[key-1] ? item.color_scheme.weft[key-1].name : '')}"
                    v-if="!(item.color_scheme.warp[key-1] && item.color_scheme.weft[key-1] && (item.color_scheme.warp[key-1].name === item.color_scheme.weft[key-1].name))">{{item.color_scheme.weft[key-1] ? item.color_scheme.weft[key-1].name : ''}}</span>
                </span>
              </span>
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
              </span>
            </template>
          </span>
          <span class="row_item col"
            v-else>见附件</span>
        </div>
        <div class="print_row">
          <span class="row_item w140 center">工序与备注：</span>
          <span class="row_item left noBorder">后道工序：{{warp_data.additional_data}}</span>
          <span class="row_item left">其它备注：{{craftDetail.desc}}</span>
        </div>
      </div>
    </div>
    <!-- 经纬向数据超出时 -->
    <div class="printTable outTable"
      v-if="warp_data.length_is >= 17 || weft_data.length_is >= 17  || warp_data.back_status || weft_data.back_status">
      <div class="outItem">
        <span class="label">工艺单编号：</span>
        {{craftDetail.product_info.product_code}}
      </div>
      <div class="outItem">
        <span class="label">经向排列-正：</span>
        <span class="print_body"
          v-for="(items,indexs) in Math.ceil(warp_data.warp_rank[0].length / 16)"
          :key="indexs">
          <span class="print_row h31 noBorder">
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
              {{item.value}}
              <span style="font-size:12px;color:rgba(0,0,0,1)"
                v-if="item.value && (item.isSplit || item.colspan > 1)">遍</span>
              <!-- 箭头标识 -->
              <span :class="['jiantou','left',(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ?'hiddle':'']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">→</span>
              <span :class="['jiantou','right',(item.isSplit && (item.noRightJianTou || item.noJianTou))?'hiddle':'']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">←</span>
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
              {{item.value}}
              <span style="font-size:12px;color:rgba(0,0,0,1)"
                v-if="item.value && (item.isSplit || item.colspan > 1)">遍</span>
              <!-- 箭头标识 -->
              <span :class="['jiantou','left',(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ?'hiddle':'']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">→</span>
              <span :class="['jiantou','right',(item.isSplit && (item.noRightJianTou || item.noJianTou))?'hiddle':'']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">←</span>
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
              {{item.value}}
              <span style="font-size:12px;color:rgba(0,0,0,1)"
                v-if="item.value && (item.isSplit || item.colspan > 1)">遍</span>
              <!-- 箭头标识 -->
              <span :class="['jiantou','left',(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ?'hiddle':'']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">→</span>
              <span :class="['jiantou','right',(item.isSplit && (item.noRightJianTou || item.noJianTou))?'hiddle':'']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">←</span>
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
          :key="indexs">
          <span class="print_row h31 noBorder">
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
              {{item.value}}
              <span style="font-size:12px;color:rgba(0,0,0,1)"
                v-if="item.value && (item.isSplit || item.colspan > 1)">遍</span>
              <!-- 箭头标识 -->
              <span :class="['jiantou','left',(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ?'hiddle':'']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">→</span>
              <span :class="['jiantou','right',(item.isSplit && (item.noRightJianTou || item.noJianTou))?'hiddle':'']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">←</span>
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
              {{item.value}}
              <span style="font-size:12px;color:rgba(0,0,0,1)"
                v-if="item.value && (item.isSplit || item.colspan > 1)">遍</span>
              <!-- 箭头标识 -->
              <span :class="['jiantou','left',(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ?'hiddle':'']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">→</span>
              <span :class="['jiantou','right',(item.isSplit && (item.noRightJianTou || item.noJianTou))?'hiddle':'']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">←</span>
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
              {{item.value}}
              <span style="font-size:12px;color:rgba(0,0,0,1)"
                v-if="item.value && (item.isSplit || item.colspan > 1)">遍</span>
              <!-- 箭头标识 -->
              <span :class="['jiantou','left',(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ?'hiddle':'']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">→</span>
              <span :class="['jiantou','right',(item.isSplit && (item.noRightJianTou || item.noJianTou))?'hiddle':'']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">←</span>
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
          :key="indexs">
          <span class="print_row h31 noBorder">
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
              {{item.value}}
              <span style="font-size:12px;color:rgba(0,0,0,1)"
                v-if="item.value && (item.isSplit || item.colspan > 1)">遍</span>
              <!-- 箭头标识 -->
              <span :class="['jiantou','left',(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ? 'hiddle' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">→</span>
              <span :class="['jiantou','right',(item.isSplit && (item.noRightJianTou || item.noJianTou)) ? 'hiddle' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">←</span>
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
              {{item.value}}
              <span style="font-size:12px;color:rgba(0,0,0,1)"
                v-if="item.value && (item.isSplit || item.colspan > 1)">遍</span>
              <!-- 箭头标识 -->
              <span :class="['jiantou','left',(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ? 'hiddle' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">→</span>
              <span :class="['jiantou','right',(item.isSplit && (item.noRightJianTou || item.noJianTou)) ? 'hiddle' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">←</span>
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
              {{item.value}}
              <span style="font-size:12px;color:rgba(0,0,0,1)"
                v-if="item.value && (item.isSplit || item.colspan > 1)">遍</span>
              <!-- 箭头标识 -->
              <span :class="['jiantou','left',(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ? 'hiddle' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">→</span>
              <span :class="['jiantou','right',(item.isSplit && (item.noRightJianTou || item.noJianTou)) ? 'hiddle' : '']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">←</span>
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
          :key="indexs">
          <span class="print_row h31 noBorder">
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
              {{item.value}}
              <span style="font-size:12px;color:rgba(0,0,0,1)"
                v-if="item.value && (item.isSplit || item.colspan > 1)">遍</span>
              <!-- 箭头标识 -->
              <span :class="['jiantou','left',(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ?'hiddle':'']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">→</span>
              <span :class="['jiantou','right',(item.isSplit && (item.noRightJianTou || item.noJianTou))?'hiddle':'']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">←</span>
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
              {{item.value}}
              <span style="font-size:12px;color:rgba(0,0,0,1)"
                v-if="item.value && (item.isSplit || item.colspan > 1)">遍</span>
              <!-- 箭头标识 -->
              <span :class="['jiantou','left',(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ?'hiddle':'']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">→</span>
              <span :class="['jiantou','right',(item.isSplit && (item.noRightJianTou || item.noJianTou))?'hiddle':'']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">←</span>
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
              {{item.value}}
              <span style="font-size:12px;color:rgba(0,0,0,1)"
                v-if="item.value && (item.isSplit || item.colspan > 1)">遍</span>
              <!-- 箭头标识 -->
              <span :class="['jiantou','left',(item.isSplit && (item.noLeftJianTou || item.noJianTou)) ?'hiddle':'']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">→</span>
              <span :class="['jiantou','right',(item.isSplit && (item.noRightJianTou || item.noJianTou))?'hiddle':'']"
                v-if="item.isSplit || (item.colspan && item.colspan > 1)">←</span>
            </span>
            <span class="row_item_span"
              v-for="item in 16 - splitData(weft_data.weft_rank_back[2],indexs).length"
              :key="item + 'false'"></span>
          </span>
        </span>
      </div>
    </div>
    <!-- 配色超出时 -->
    <div class="printTable outTable"
      v-if="zhujia_info.length >= 7 || color_data.length >= 4">
      <div class="outItem">
        <span class="label">工艺单编号：</span>
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
            </span>
          </template>
        </div>
      </div>
    </div>
    <!-- 穿综法超出时 -->
    <div class="printTable outTable"
      v-if="craftDetail.draft_method.GLFlag !== 'normal' || 5 < craftDetail.draft_method.GL[0].length">
      <div class="outItem">
        <span class="label">工艺单编号：</span>
        {{craftDetail.product_info.product_code}}
      </div>
      <div class="outItem">
        <span class="label">穿综法循环：</span>
        {{craftDetail.draft_method|filterThroughMethod}}
      </div>
      <div class="outItem"
        v-for="(items,indexs) in craftDetail.draft_method.GLShow"
        :key="indexs">
        <span class="label">纹版图{{letterArr[indexs]}}：</span>
        <div class="print_body noBorder">
          <span class="print_row maxHeight noBorder canWarp">
            <span class="row_item noBorder"
              style="flex:auto"
              v-for="(item,index) in craftDetail.draft_method.GLShow[indexs]"
              :key="index">
              <span class="index">{{craftDetail.draft_method.GLXuhao[indexs] ? craftDetail.draft_method.GLXuhao[indexs][index] : ''}}</span>
              <span class="detail">
                <span class="item">{{item[0]}}</span>
                <span class="item">{{item[1]}}</span>
                <span class="item">{{item[2]}}</span>
              </span>
            </span>
          </span>
        </div>
      </div>
      <div class="outItem"
        v-for="(item,index) in craftDetail.draft_method.GLRepeat"
        :key="'xunhuan-' + index">
        <span class="label">纹版图{{letterArr[index]}}：</span>
        <div style="display:block;padding-left:32px;margin:12px 0"
          v-for="(itemChild,indexChild) in item"
          :key="indexChild">
          <span style="margin:0 20px;color:#666">{{itemChild.start}}到{{itemChild.end}}<span style="margin:0 5px"></span>✖{{itemChild.repeat}}遍</span>
          <span style="margin:0 20px;color:#666"></span>
        </div>
      </div>
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
      companyName: window.sessionStorage.getItem('company_name'),
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
      letterArr: letterArr
    }
  },
  methods: {
    // 给合并规则里添加value
    pushValue (item, key, index) {
      let valueArr = item[key] // value来源数组
      item[index].forEach(val => {
        val.value = this.$clone(valueArr[val.row]).splice(val.col, val.colspan).filter(num => num)[0]
      })
      this.changeMergeMethod(item[index], Math.ceil(item[key][0].length / 16)) // 处理合并规则
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
              value: val.value
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
          // console.log(JSON.stringify(val))
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
          // console.log(JSON.stringify(mergeItem))
          mergeData.push({ value: mergeItem.value, colspan: mergeItem.colspan, isSplit: mergeItem.split, noLeftJianTou: mergeItem.noLeftJianTou, noRightJianTou: mergeItem.noRightJianTou, noJianTou: mergeItem.noJianTou })
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
    getFlatTable (table, type, merge) {
      let tableArr = table
      let mergeTable = this[type][merge]
      let firstMerge = this.getMergeInfo(mergeTable, 3, tableArr[0].length)
      let secondMerge = this.getMergeInfo(mergeTable, 4, tableArr[0].length)
      // 处理合并项的合并信息
      let firstArr = []
      firstMerge.forEach((item) => {
        let temporaryStorage = [] // 临时存储合并项
        for (let i = item.col; i < (item.col + item.colspan); i++) {
          temporaryStorage.push({
            order: tableArr[0][i],
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
      // 只解析上列字符串，别的不管
      let arr = info.split(']')
      return {
        number: arr[0].split('[')[1],
        start: arr[1].split('[')[1],
        end: arr[2].split('[')[1]
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
        if (this.$route.params.type === '1') {
          data = res.data.data
        } else {
          data = res.data.data.find(item => item.id === this.$route.params.craftId)
        }
        if (!data) {
          this.$message('未找到工艺单ID为' + this.$route.params.craftId + '的工艺单')
          return
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
        GLRepeatComplete.forEach((item, index) => {
          this.craftDetail.draft_method.GL[index] = []
          item.forEach((itemChild) => {
            for (let j = 0; j < itemChild.repeat; j++) {
              for (let i = itemChild.start; i <= itemChild.end; i++) {
                this.craftDetail.draft_method.GL[index].push(this.craftDetail.draft_method.GLShow[index][i - 1])
              }
            }
          })
        })
        console.log(this.craftDetail.draft_method)
        let reedWidthData = data.warp_data.reed_width_data && JSON.parse(data.warp_data.reed_width_data)
        this.warp_data = this.$clone(data.warp_data)
        this.warp_data.length_is = this.warp_data.warp_rank[0].length
        this.warp_data.length_back = this.warp_data.warp_rank_back[0].length
        this.warp_data.reed_width_data = Array.isArray(reedWidthData) ? reedWidthData.join('+') : (reedWidthData || '')
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
        // let arrWarp = data.warp_data.warp_rank.slice(1, 5)
        // data.warp_data.merge_data.forEach((item) => {
        //   if (item.row === 3 || item.row === 4) {
        //     for (let i = (item.col + 1); i < (item.col + item.colspan); i++) {
        //       arrWarp[item.row - 1][i] = arrWarp[item.row - 1][item.col]
        //     }
        //   }
        // })
        // let arrWeft = data.weft_data.weft_rank.slice(1, 5)
        // data.weft_data.merge_data.forEach((item) => {
        //   if (item.row === 3 || item.row === 4) {
        //     for (let i = (item.col + 1); i < (item.col + item.colspan); i++) {
        //       arrWeft[item.row - 1][i] = arrWeft[item.row - 1][item.col]
        //     }
        //   }
        // })
        // let arrWarpBack = data.warp_data.warp_rank_back.slice(1, 5)
        // data.warp_data.merge_data_back.forEach((item) => {
        //   if (item.row === 3 || item.row === 4) {
        //     for (let i = (item.col + 1); i < (item.col + item.colspan); i++) {
        //       arrWarpBack[item.row - 1][i] = arrWarpBack[item.row - 1][item.col]
        //     }
        //   }
        // })
        // let arrWeftBack = data.weft_data.weft_rank_back.slice(1, 5)
        // data.weft_data.merge_data_back.forEach((item) => {
        //   if (item.row === 3 || item.row === 4) {
        //     for (let i = (item.col + 1); i < (item.col + item.colspan); i++) {
        //       arrWeftBack[item.row - 1][i] = arrWeftBack[item.row - 1][item.col]
        //     }
        //   }
        // })
        // for (let i = 0; i < arrWarp[0].length; i++) {
        //   const x = arrWarp[1][i] ? arrWarp[1][i] : 1
        //   const y = arrWarp[2][i] ? arrWarp[2][i] : 1
        //   const z = arrWarp[3][i] ? arrWarp[3][i] : 1
        //   colorNumber.warp[arrWarp[0][i]] = colorNumber.warp[arrWarp[0][i]] ? colorNumber.warp[arrWarp[0][i]] : 0
        //   colorNumber.warp[arrWarp[0][i]] += x * y * z
        // }
        // for (let i = 0; i < arrWeft[0].length; i++) {
        //   const x = arrWeft[1][i] ? arrWeft[1][i] : 1
        //   const y = arrWeft[2][i] ? arrWeft[2][i] : 1
        //   const z = arrWeft[3][i] ? arrWeft[3][i] : 1
        //   colorNumber.weft[arrWeft[0][i]] = colorNumber.weft[arrWeft[0][i]] ? colorNumber.weft[arrWeft[0][i]] : 0
        //   colorNumber.weft[arrWeft[0][i]] += x * y * z
        // }
        // for (let i = 0; i < arrWarpBack[0].length; i++) {
        //   const x = arrWarpBack[1][i] ? arrWarpBack[1][i] : 1
        //   const y = arrWarpBack[2][i] ? arrWarpBack[2][i] : 1
        //   const z = arrWarpBack[3][i] ? arrWarpBack[3][i] : 1
        //   colorNumber.warp[arrWarpBack[0][i]] = colorNumber.warp[arrWarpBack[0][i]] ? colorNumber.warp[arrWarpBack[0][i]] : 0
        //   colorNumber.warp[arrWarpBack[0][i]] += x * y * z
        // }
        // for (let i = 0; i < arrWeftBack[0].length; i++) {
        //   const x = arrWeftBack[1][i] ? arrWeftBack[1][i] : 1
        //   const y = arrWeftBack[2][i] ? arrWeftBack[2][i] : 1
        //   const z = arrWeftBack[3][i] ? arrWeftBack[3][i] : 1
        //   colorNumber.weft[arrWeftBack[0][i]] = colorNumber.weft[arrWeftBack[0][i]] ? colorNumber.weft[arrWeftBack[0][i]] : 0
        //   colorNumber.weft[arrWeftBack[0][i]] += x * y * z
        // }
        // this.yarn_coefficient = data.yarn_coefficient
        // 展平合并信息
        let warpTable = this.getFlatTable(this.warp_data.warp_rank, 'warp_data', 'merge_data').map((item) => {
          if (!item.GLorPM) {
            item.GLorPM = 'Ⅰ'
          }
          return item
        })
        let weftTable = this.getFlatTable(this.weft_data.weft_rank, 'weft_data', 'merge_data').map((item) => {
          if (!item.GLorPM) {
            item.GLorPM = 'A'
          }
          return item
        })
        let warpTableBack = this.getFlatTable(this.warp_data.warp_rank_back, 'warp_data', 'merge_data_back').map((item) => {
          if (!item.GLorPM) {
            item.GLorPM = 'Ⅰ'
          }
          return item
        })
        let weftTableBack = this.getFlatTable(this.weft_data.weft_rank_back, 'weft_data', 'merge_data_back').map((item) => {
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
              number: colorNumber.warp[itemChild],
              weight: this.$toFixed(colorNumber.warp[itemChild] * (this.weft_data.neichang + this.weft_data.rangwei) * data.yarn_coefficient.find((itemFind) => itemFind.name === item.material_name).value / 100)
            }
          })
        })
        this.weft_data.material_data.forEach((item) => {
          item.apply.forEach((itemChild) => {
            this.colorWeight.weft[itemChild] = {
              number: colorNumber.weft[itemChild],
              weight: this.$toFixed(colorNumber.weft[itemChild] * this.warp_data.reed_width * data.yarn_coefficient.find((itemFind) => itemFind.name === item.material_name).value / 100)
            }
          })
        })
        this.yarn_coefficient = data.yarn_coefficient
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
          str += romanNum[key] + '【' + item.number + '根（' + item.value + '）' + '】' + (item.repeat && item.repeat !== 1 ? 'x' + item.repeat + '遍' : '') + (key !== items.PM.length - 1 ? '。' : '')
        })
      } else if (items.PMFlag === 'complex') {
        items.PM.forEach((item, key) => {
          str += romanNum[key]
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
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/craft/craftTable.less";
</style>
