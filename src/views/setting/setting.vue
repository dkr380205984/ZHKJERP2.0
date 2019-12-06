<template>
  <div id="setting"
    class="indexMain">
    <div class="module">
      <div class="titleCtn">
        <div class="title">系统设置</div>
      </div>
      <div class="settingCtn">
        <div class="navFather">
          <div class="list"
            :class="{'active':pName===key}"
            v-for="(item,key,index) in nav"
            :key="index"
            @click="pName=key">{{key}}</div>
        </div>
        <div class="navSon">
          <div class="list"
            :class="{'active':cName===item}"
            v-for="(item,index) in nav[pName]"
            :key="index"
            @click="cName=item">{{item}}</div>
        </div>
        <div class="mainCtn">
          <template v-if="cName==='产品分类'">
            <div class="productTypeCtn">
              <div class="treeMain">
                <el-tree ref="tree"
                  :key="tree_key"
                  :data="productTypeArr"
                  node-key="id"
                  :render-content="renderContent"
                  :expand-on-click-node="false"
                  :default-expand-all="false"
                  :default-expanded-keys="defaultExpand">
                </el-tree>
              </div>
            </div>
          </template>
          <template v-if="cName==='产品花型'">
            <div class="flowerCtn">
              <div class="addBtn"
                @click="showPopup=true">添加花型</div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">花型</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in flowerArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteFlower(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="flowerTotal"
                  :current-page.sync="flowerPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='产品成分'">
            <div class="ingredientCtn">
              <div class="addBtn"
                @click="showPopup=true">添加成分</div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">成分</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in ingredientArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteIngredient(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="ingredientTotal"
                  :current-page.sync="ingredientPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='产品配色'">
            <div class="ingredientCtn">
              <div class="addBtn"
                @click="showPopup=true">添加配色</div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">配色名称</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in colourArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteColour(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="colourTotal"
                  :current-page.sync="colourPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='产品尺码'">
            <div class="normalTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn padding40">大类名称</div>
                  <div class="tcolumn padding40"
                    style="flex:3">尺码信息</div>
                  <div class="tcolumn right padding40">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in sizeArr"
                  :key="index">
                  <div class="tcolumn padding40">{{item.name}}</div>
                  <div class="tcolumn padding40 flexRow"
                    style="flex:3">
                    <span v-for="(itemSize,indexSize) in item.child_size"
                      :key="indexSize">{{indexSize>0?'/' + itemSize.name:itemSize.name}}</span>
                  </div>
                  <div class="tcolumn right padding40 flexRow"
                    style="justify-content:flex-end">
                    <span class="blue"
                      @click="addSize(item.id)">新增</span>
                    <span class="border"></span>
                    <span class="red"
                      @click="delSize(item.child_size)">删除</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="pageCtn">
              <el-pagination background
                :page-size="5"
                layout="prev, pager, next"
                :total="colourTotal"
                :current-page.sync="colourPage">
              </el-pagination>
            </div>
          </template>
          <template v-if="cName==='产品规格'">
            <div class="normalTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn padding40">大类名称</div>
                  <div class="tcolumn padding40"
                    style="flex:3">规格信息</div>
                  <div class="tcolumn right padding40">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in measurementArr"
                  :key="index">
                  <div class="tcolumn padding40">{{item.name}}</div>
                  <div class="tcolumn padding40 flexRow"
                    style="flex:3">
                    <span v-for="(itemMeasurement,indexMeasurement) in item.child_measurement"
                      :key="indexMeasurement">{{indexMeasurement>0?'/' + itemMeasurement.name:itemMeasurement.name}}</span>
                  </div>
                  <div class="tcolumn right padding40 flexRow"
                    style="justify-content:flex-end">
                    <span class="blue"
                      @click="addMeasurement(item.id)">新增</span>
                    <span class="border"></span>
                    <span class="red"
                      @click="delMeasurement(item.child_measurement)">删除</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="pageCtn">
              <el-pagination background
                :page-size="5"
                layout="prev, pager, next"
                :total="colourTotal"
                :current-page.sync="colourPage">
              </el-pagination>
            </div>
          </template>
          <template v-if="cName==='边型'">
            <div class="flowerCtn">
              <div class="addBtn"
                @click="showPopup=true">添加边型</div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">边型</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in sideArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteSide(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="sideTotal"
                  :current-page.sync="sidePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='机型'">
            <div class="flowerCtn">
              <div class="addBtn"
                @click="showPopup=true">添加机型</div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">机型</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in machineArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteMachine(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="machineTotal"
                  :current-page.sync="machinePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='组织法'">
            <div class="flowerCtn">
              <div class="addBtn"
                @click="showPopup=true"
                style="width:6em">添加组织法</div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">组织法</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in methodsArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteMethods(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="methodsTotal"
                  :current-page.sync="methodsPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='纱线名称'">
            <div class="flowerCtn">
              <div class="addBtn"
                @click="showPopup=true"
                style="width:6em">添加纱线</div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">纱线名称</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in yarnNameArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteYarnName(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="yarnNameTotal"
                  :current-page.sync="yarnNamePage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='纱线颜色'">
            <div class="flowerCtn">
              <div class="addBtn"
                @click="showPopup=true"
                style="width:7em">添加纱线颜色</div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">纱线颜色</div>
                    <div class="tcolumn padding40">色块</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in yarnColorArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn padding40">
                      <div class="rect"
                        :style="{'background':item.color_code}"></div>
                    </div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteYarnColor(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="yarnColorTotal"
                  :current-page.sync="yarnColorPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='原料工序'">
            <div class="flowerCtn">
              <div class="addBtn"
                @click="showPopup=true">添加工序</div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">工序名称</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in materialProcessArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteMaterialProcess(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="materialProcessTotal"
                  :current-page.sync="materialProcessPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='半成品加工'">
            <div class="flowerCtn">
              <div class="addBtn"
                @click="showPopup=true">添加工序</div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">工序名称</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in halfProcessArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteHalfProcess(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="halfProcessTotal"
                  :current-page.sync="halfProcessPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='员工帐号管理'">
            <div class="flowerCtn">
              <div class="addBtn"
                @click="showPopup=true">添加员工</div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn">姓名</div>
                    <div class="tcolumn">手机号</div>
                    <div class="tcolumn">分组</div>
                    <div class="tcolumn">岗位</div>
                    <div class="tcolumn">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="item in authList"
                    :key="item.id">
                    <div class="tcolumn">{{item.name}}</div>
                    <div class="tcolumn">{{item.telephone}}</div>
                    <div class="tcolumn">{{item.group}}</div>
                    <div class="tcolumn">{{item.station_name}}</div>
                    <div class="tcolumn flexRow">
                      <span class="blue">修改</span>
                      <span class="border"></span>
                      <span class="red">禁用</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="authTotal"
                  :current-page.sync="authPage"
                  @current-change="getAuth">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='工厂小组管理'">
            <div class="flowerCtn">
              <div class="addBtn"
                @click="showPopup=true">添加小组</div>
              <div class="normalTb">
                <div class="thead">
                  <div class="trow">
                    <div class="tcolumn padding40">小组名称</div>
                    <div class="tcolumn right padding40">操作</div>
                  </div>
                </div>
                <div class="tbody">
                  <div class="trow"
                    v-for="(item,index) in groupArr"
                    :key="index">
                    <div class="tcolumn padding40">{{item.name}}</div>
                    <div class="tcolumn right padding40">
                      <span class="red"
                        @click="deleteGroup(item.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pageCtn">
                <el-pagination background
                  :page-size="5"
                  layout="prev, pager, next"
                  :total="groupTotal"
                  :current-page.sync="groupPage">
                </el-pagination>
              </div>
            </div>
          </template>
          <template v-if="cName==='工厂信息设置'">
            <div class="companySetting">
              <div class="row">
                <div class="label">企业LOGO：</div>
                <div class="imgCtn">
                  <el-upload class="avatar-uploader"
                    drag
                    action="https://upload.qiniup.com/"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeUpload"
                    :data="postData"
                    :file-list="companyInfo.file_logo"
                    ref="uploada_logo">
                    <img v-if="companyInfo.logoUrl"
                      :src="companyInfo.logoUrl"
                      class="logo-img">
                    <i v-else
                      class="el-icon-plus logo-icon"></i>
                  </el-upload>
                  <div class="prompt">点击或拖拽图片至上传框,只能上传jpg/png文件，且不超过6MB</div>
                </div>
              </div>
              <div class="row">
                <div class="label">公司名称：</div>
                <div class="content">
                  <el-input placeholder="请输入公司名称"
                    class="input-item"
                    v-model="companyInfo.client_name"
                    disabled
                    clearable>
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">公司简介:</span>
                <div class="content">
                  <el-input class="input-item"
                    style="width:600px;"
                    type="textarea"
                    placeholder="公司简介在200字以内..."
                    v-model="companyInfo.client_about"
                    :rows="7">
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">公司图片：</span>
                <div class="content">

                </div>
              </div>
              <div class="row">
                <span class="label">公司电话:</span>
                <div class="content">
                  <el-input placeholder="请输入公司电话"
                    class="input-item"
                    v-model="companyInfo.client_tel">
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">公司邮箱：</span>
                <div class="content">
                  <el-input placeholder="请输入公司邮箱"
                    class="input-item"
                    v-model="companyInfo.client_email">
                  </el-input>
                </div>
              </div>
              <div class="row">
                <span class="label">公司地址：</span>
                <div class="content">
                  <el-input placeholder="请输入公司地址"
                    class="input-item"
                    v-model="companyInfo.client_address">
                  </el-input>
                </div>
              </div>
              <div class="btnCtn">
                <div class="btn btnGray">取消</div>
                <div class="btn btnBlue"
                  @click="saveCompany">完成</div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="showPopup">
      <template v-if="cName==='产品花型'">
        <div class="main">
          <div class="title">
            <div class="text">新增花型</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">花型名称：</div>
              <div class="info">
                <el-input placeholder="请输入花型名称"
                  v-model="flower"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveFlower">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='产品成分'">
        <div class="main">
          <div class="title">
            <div class="text">新增成分</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">成分名称：</div>
              <div class="info">
                <el-input placeholder="请输入成分名称"
                  v-model="ingredient"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveIngredient">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='产品配色'">
        <div class="main">
          <div class="title">
            <div class="text">新增配色</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">配色名称：</div>
              <div class="info">
                <el-input placeholder="请输入配色名称"
                  v-model="colour"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveColour">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='产品尺码'">
        <div class="main">
          <div class="title">
            <div class="text">新增尺码</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">尺码名称：</div>
              <div class="info">
                <el-input placeholder="请输入尺码名称"
                  v-model="size"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveSize">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='产品规格'">
        <div class="main">
          <div class="title">
            <div class="text">新增规格</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">规格名称：</div>
              <div class="info">
                <el-input placeholder="请输入规格名称"
                  v-model="measurement"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveMeasurement">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='边型'">
        <div class="main">
          <div class="title">
            <div class="text">新增边型</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">边型名称：</div>
              <div class="info">
                <el-input placeholder="请输入边型名称"
                  v-model="side"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveSide">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='机型'">
        <div class="main">
          <div class="title">
            <div class="text">新增机型</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">机型名称：</div>
              <div class="info">
                <el-input placeholder="请输入机型名称"
                  v-model="machine"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveMachine">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='组织法'">
        <div class="main">
          <div class="title">
            <div class="text">新增组织法</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">组织法名称：</div>
              <div class="info">
                <el-input placeholder="请输入组织法名称"
                  v-model="methods"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveMethods">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='纱线名称'">
        <div class="main">
          <div class="title">
            <div class="text">添加纱线名称</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">纱线名称：</div>
              <div class="info">
                <el-input placeholder="请输入纱线名称"
                  v-model="yarnName"></el-input>
              </div>
            </div>
            <div class="row"
              v-for="(item,index) in yarnPriceArr"
              :key="index">
              <div class="label">报价信息：</div>
              <div class="info flex">
                <el-select v-model="item.company"
                  style="margin-right:16px"
                  filterable
                  placeholder="请选择公司">
                  <el-option v-for="item in clientList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
                <el-input v-model="item.price"
                  placeholder="请输入报价">
                  <template slot="append">元</template>
                </el-input>
              </div>
              <div class="editBtn blue"
                @click="addClient"
                v-if="index===0">添加</div>
              <div class="editBtn red"
                @click="deleteClient(index)"
                v-if="index>0">删除</div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveYarnName">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='纱线颜色'">
        <div class="main">
          <div class="title">
            <div class="text">添加纱线颜色</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">颜色名称：</div>
              <div class="info">
                <el-input placeholder="请输入颜色名称"
                  v-model="yarnColor"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">选择色块：</div>
              <div class="info">
                <el-color-picker v-model="yarnColorCode"></el-color-picker>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveYarnColor">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='原料工序'">
        <div class="main">
          <div class="title">
            <div class="text">添加工序</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">工序名称：</div>
              <div class="info">
                <el-input placeholder="请输入工序名称"
                  v-model="materialProcess"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveMaterialProcess">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='半成品加工'">
        <div class="main">
          <div class="title">
            <div class="text">添加工序</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">工序名称：</div>
              <div class="info">
                <el-input placeholder="请输入工序名称"
                  v-model="halfProcess"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveHalfProcess">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='工厂小组管理'">
        <div class="main">
          <div class="title">
            <div class="text">添加小组</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">小组名称：</div>
              <div class="info">
                <el-input placeholder="请输入小组名称"
                  v-model="group"></el-input>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveGroup">确定</div>
          </div>
        </div>
      </template>
      <template v-if="cName==='员工帐号管理'">
        <div class="main">
          <div class="title">
            <div class="text">添加员工</div>
            <i class="el-icon-close"
              @click="showPopup=false"></i>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">员工姓名：</div>
              <div class="info">
                <el-input placeholder="请输入员工姓名"
                  v-model="authInfo.name"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">联系方式：</div>
              <div class="info">
                <zh-input placeholder="请输入手机号"
                  type="mobile"
                  v-model="authInfo.telephone"></zh-input>
              </div>
            </div>
            <div class="row">
              <div class="label">隶属小组：</div>
              <div class="info">
                <el-select v-model="authInfo.group_id"
                  placeholder="请选择小组">
                  <el-option v-for="(item,index) in groupList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
              </div>
            </div>
            <div class="row">
              <div class="label">岗位名称：</div>
              <div class="info">
                <el-input placeholder="请输入岗位名称"
                  v-model="authInfo.station_name"></el-input>
              </div>
            </div>
            <div class="row">
              <div class="label">管理模块：</div>
              <div class="info">
                <el-checkbox-group v-model="authInfo.module_id">
                  <el-checkbox v-for="item in permissions"
                    :key="item.id"
                    :label="item.id"
                    :value="item.id">
                    {{item.module}}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
          <div class="opr">
            <div class="btn btnGray"
              @click="showPopup=false">取消</div>
            <div class="btn btnBlue"
              @click="saveAuth">确定</div>
          </div>
        </div>
      </template>
    </div>
    <!-- 删除尺码 -->
    <div class="popup"
      v-show="sizeFLag">
      <div class="main">
        <div class="title">
          <div class="text">删除尺码</div>
          <i class="el-icon-close"
            @click="sizeFLag=false"></i>
        </div>
        <div class="content">
          <div class="row">
            <div class="label">选择尺码：</div>
            <div class="info">
              <el-select v-model="deleteSizeId"
                placeholder="请选择删除尺码">
                <el-option v-for="item in sizeIdArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="sizeFLag=false">取消</div>
          <div class="btn btnBlue"
            @click="deleteSize">确定</div>
        </div>
      </div>
    </div>
    <!-- 删除规格 -->
    <div class="popup"
      v-show="measurementFlag">
      <div class="main">
        <div class="title">
          <div class="text">删除规格</div>
          <i class="el-icon-close"
            @click="measurementFlag=false"></i>
        </div>
        <div class="content">
          <div class="row">
            <div class="label">选择尺码：</div>
            <div class="info">
              <el-select v-model="deleteMeasurementId"
                placeholder="请选择删除尺码">
                <el-option v-for="item in measurementIdArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="measurementFlag=false">取消</div>
          <div class="btn btnBlue"
            @click="deleteMeasurement">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { permissions } from '@/assets/js/dictionary.js'
import { productType, flower, ingredient, colour, productSize, measurement, craftSetting, yarn, yarnColor, process, group, company, auth, client } from '@/assets/js/api.js'
export default {
  data () {
    return {
      showPopup: false,
      nav: {
        '产品设置': ['产品分类', '产品花型', '产品成分', '产品配色', '产品尺码'],
        '工艺单设置': ['边型', '机型', '组织法'],
        '物料设置': ['纱线名称', '纱线颜色', '装饰辅料', '包装辅料'],
        '加工工序设置': ['原料工序', '半成品加工'],
        '工厂信息设置': ['工厂信息设置', '工厂小组管理'],
        '员工管理': ['员工帐号管理']
      },
      pName: '',
      cName: '',
      productTypeArr: [],
      tree_key: 0,
      productTypeId: 0,
      defaultExpand: [],
      flowerList: [],
      flowerTotal: 1,
      flowerPage: 1,
      flower: '',
      ingredientList: [],
      ingredientTotal: 1,
      ingredientPage: 1,
      ingredient: '',
      colourList: [],
      colourTotal: 1,
      colourPage: 1,
      colour: '',
      sizeList: [],
      sizeTotal: 1,
      sizePage: 1,
      size: '',
      sizeId: '',
      sizeIdArr: [],
      deleteSizeId: '',
      sizeFLag: false, // 删除尺码
      measurementList: [],
      measurementTotal: 1,
      measurementPage: 1,
      measurement: '',
      measurementId: '',
      measurementIdArr: [],
      measurementFlag: false,
      deleteMeasurementId: '',
      sideList: [],
      side: '',
      sideTotal: 1,
      sidePage: 1,
      machineList: [],
      machine: '',
      machineTotal: 1,
      machinePage: 1,
      methodsList: [],
      methods: '',
      methodsTotal: 1,
      methodsPage: 1,
      yarnNameList: [],
      yarnName: '',
      yarnNameTotal: 1,
      yarnNamePage: 1,
      yarnPriceArr: [{
        price: '',
        company: ''
      }],
      clientList: [],
      yarnColorList: [],
      yarnColor: '',
      yarnColorCode: '',
      yarnColorTotal: 1,
      yarnColorPage: 1,
      materialProcessList: [],
      materialProcess: '',
      materialProcessTotal: 1,
      materialProcessPage: 1,
      halfProcessList: [],
      halfProcess: '',
      halfProcessTotal: 1,
      halfProcessPage: 1,
      groupList: [],
      group: '',
      groupTotal: 1,
      groupPage: 1,
      companyInfo: {
        logoUrl: '',
        client_name: '',
        client_about: '',
        client_tel: '',
        client_email: '',
        client_address: '',
        file_logo: [],
        file_image: []
      },
      postData: { token: '' },
      authList: [],
      authInfo: {
        id: null,
        status: 1,
        telephone: '',
        group_id: '',
        station_name: '',
        name: '',
        mobile: '',
        module_id: []// 权限字段
      },
      permissions: permissions,
      authPage: 1,
      authTotal: 1
    }
  },
  watch: {
    cName (val) {
      if (val === '产品分类') {
        this.getProductType()
      } else if (val === '产品花型') {
        this.getFlower()
      } else if (val === '产品成分') {
        this.getIngredient()
      } else if (val === '产品配色') {
        this.getColour()
      } else if (val === '产品尺码') {
        this.getSize()
      } else if (val === '产品规格') {
        this.getMeasurement()
      } else if (val === '边型') {
        this.getSide()
      } else if (val === '机型') {
        this.getMachine()
      } else if (val === '组织法') {
        this.getMethods()
      } else if (val === '纱线名称') {
        this.getYarnName()
      } else if (val === '纱线颜色') {
        this.getYarnColor()
      } else if (val === '原料工序') {
        this.getMaterialProcess()
      } else if (val === '半成品加工') {
        this.getHalfProcess()
      } else if (val === '工厂小组管理') {
        this.getGroup()
      } else if (val === '工厂信息设置') {
        this.getCompany()
      } else if (val === '员工帐号管理') {
        this.getAuth()
      }
    }
  },
  computed: {
    flowerArr () {
      return this.flowerList.slice((this.flowerPage - 1) * 5, this.flowerPage * 5)
    },
    ingredientArr () {
      return this.ingredientList.slice((this.ingredientPage - 1) * 5, this.ingredientPage * 5)
    },
    colourArr () {
      return this.colourList.slice((this.colourPage - 1) * 5, this.colourPage * 5)
    },
    sizeArr () {
      return this.sizeList.slice((this.sizePage - 1) * 5, this.sizePage * 5)
    },
    measurementArr () {
      return this.measurementList.slice((this.measurementPage - 1) * 5, this.measurementPage * 5)
    },
    sideArr () {
      return this.sideList.slice((this.sidePage - 1) * 5, this.sidePage * 5)
    },
    machineArr () {
      return this.machineList.slice((this.machinePage - 1) * 5, this.machinePage * 5)
    },
    methodsArr () {
      return this.methodsList.slice((this.methodsPage - 1) * 5, this.methodsPage * 5)
    },
    yarnNameArr () {
      return this.yarnNameList.slice((this.yarnNamePage - 1) * 5, this.yarnNamePage * 5)
    },
    yarnColorArr () {
      return this.yarnColorList.slice((this.yarnColorPage - 1) * 5, this.yarnColorPage * 5)
    },
    materialProcessArr () {
      return this.materialProcessList.slice((this.materialProcessPage - 1) * 5, this.materialProcessPage * 5)
    },
    halfProcessArr () {
      return this.halfProcessList.slice((this.halfProcessPage - 1) * 5, this.halfProcessPage * 5)
    },
    groupArr () {
      return this.groupList.slice((this.groupPage - 1) * 5, this.groupPage * 5)
    }
  },
  methods: {
    getProductType () {
      productType.list().then((res) => {
        this.productTypeArr = res.data.data.map((item) => {
          return {
            pid: item.pid,
            id: item.id,
            label: item.name,
            level: 1,
            children: item.child.map((item) => {
              return {
                pid: item.pid,
                id: item.id,
                label: item.name,
                level: 2,
                children: item.child.map((item) => {
                  return {
                    pid: item.pid,
                    id: item.id,
                    label: item.name,
                    children: item.child,
                    isEdit: false,
                    level: 3
                  }
                }),
                isEdit: false
              }
            }),
            isEdit: false
          }
        })
      })
    },
    // 产品类型添加
    renderContent (h, { node, data, store }) {
      if (data.level < 3) {
        return (
          <span class="tree_node_Ctn">
            <span>
              {this.showOrEdit(data, node)}
            </span>
            <div class="tree_node_op">
              <i class="el-icon-plus" on-click={(ev) => this.nodeAppend(ev, data)}></i>
              <i class="el-icon-edit" on-click={(ev) => this.nodeEdit(ev, store, data)}></i>
              <i class="el-icon-delete" on-click={() => this.nodeDelete(node, data)}></i>
            </div>
          </span>)
      } else {
        return (
          <span class="tree_node_Ctn">
            <span>
              {this.showOrEdit(data, node)}
            </span>
            <div class="tree_node_op">
              <i class="el-icon-edit" on-click={(ev) => this.nodeEdit(ev, store, data)}></i>
              <i class="el-icon-delete" on-click={() => this.nodeDelete(node, data)}></i>
            </div>
          </span>)
      }
    },
    // 编辑节点
    nodeEdit (ev, store, data) {
      data.isEdit = true
      this.$nextTick(() => {
        let $input = ev.target.parentNode.parentNode.querySelector('input') || ev.target.parentElement.parentElement.querySelector('input')
        if (!$input) {
          $input = ''
        } else {
          $input = $input.focus()
        }
      })
    },
    // 节点删除
    nodeDelete (node, data) {
      this.$confirm('是否要删除该产品，这可能会影响包含该产品的订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        productType.delete({
          id: data.id
        }).then((res) => {
          if (res.data.status) {
            this.$message.success({
              message: '删除成功'
            })
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex(d => d.id === data.id)
            children.splice(index, 1)
          } else {
            this.$message.error({
              message: res.data.message
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 新增节点
    nodeAppend (ev, data) {
      const newChild = { id: this.productTypeId--, label: '新增产品', isEdit: true, pid: data.id }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
      // 新增节点后展开当前节点
      this.$refs.tree.store.nodesMap[data.id].expanded = true
      // 新增节点focus
      this.$nextTick(() => {
        let $input = ev.target.offsetParent.querySelector('input')
        if (!$input) {
          $input = ''
        } else {
          $input = $input.focus()
        }
      })
    },
    // 是否展示操作框
    showOrEdit (data, node) {
      if (data.isEdit) {
        return <input class="tree_edit_input" type="text" value={data.label} on-blur={ev => this.edit_sure(ev, data, node)} />
      } else {
        return <span className="node_labe">{data.label}</span>
      }
    },
    // 完成编辑
    edit_sure (ev, data, node) {
      let realId = null
      // <0说明是添加操作,>0则是编辑操作
      if (data.id > 0) {
        realId = data.id
      }
      const $input = ev.target.parentNode.parentNode.querySelector('input') || ev.target.parentElement.parentElement.querySelector('input')
      if (!$input) {
        return false
      } else {
        data.label = $input.value
        data.isEdit = false
        productType.create({
          company_id: window.sessionStorage.getItem('company_id'),
          id: realId,
          pid: data.pid,
          name: $input.value
        }).then((res) => {
          if (res.data.status) {
            productType.list().then((res) => {
            })
          }
        })
      }
    },
    getFlower () {
      flower.list().then((res) => {
        this.flowerList = res.data.data
        this.flowerTotal = this.flowerList.length
      })
    },
    saveFlower () {
      if (this.flower) {
        flower.create({
          name: this.flower
        }).then((res) => {
          if (res.data.status) {
            this.$message.success({
              message: '添加花型成功'
            })
            this.flower = ''
            this.getFlower()
          }
        })
      } else {
        this.$message.error({
          message: '花型名称不能为空'
        })
      }
    },
    deleteFlower (id) {
      this.$confirm('是否删除该花型?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        flower.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getFlower()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getIngredient () {
      ingredient.list().then((res) => {
        if (res.data.status) {
          this.ingredientList = res.data.data
          this.ingredientTotal = this.ingredientList.length
        }
      })
    },
    saveIngredient () {
      if (this.ingredient) {
        ingredient.create({
          name: this.ingredient
        }).then((res) => {
          if (res.data.status) {
            this.$message.success({
              message: '添加成分成功'
            })
            this.ingredient = ''
            this.getIngredient()
          }
        })
      } else {
        this.$message.error({
          message: '花型名称不能为空'
        })
      }
    },
    deleteIngredient (id) {
      this.$confirm('是否删除该成分?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ingredient.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getIngredient()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getColour () {
      colour.list().then((res) => {
        if (res.data.status) {
          this.colourList = res.data.data
          this.colourTotal = this.colourList.length
        }
      })
    },
    saveColour () {
      if (this.colour) {
        colour.create({
          name: this.colour,
          color_code: ''
        }).then((res) => {
          if (res.data.status) {
            this.$message.success({
              message: '添加配色成功'
            })
            this.colour = ''
            this.getColour()
          }
        })
      } else {
        this.$message.error('配色名称或色块未填写')
      }
    },
    deleteColour (id) {
      this.$confirm('是否删除该配色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        colour.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getColour()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getSize () {
      productType.list().then((res) => {
        this.sizeList = res.data.data
        this.sizeTotal = this.sizeList.length
      })
    },
    addSize (id) {
      this.sizeId = id
      this.showPopup = true
    },
    delSize (item) {
      this.sizeIdArr = item
      this.sizeFLag = true
    },
    saveSize () {
      if (this.size) {
        productSize.create({
          name: this.size,
          category_id: this.sizeId
        }).then((res) => {
          if (res.data.status) {
            this.$message.success({
              message: '添加尺码成功'
            })
            this.size = ''
            this.getSize()
          }
        })
      } else {
        this.$message.error('请填写尺码名称')
      }
    },
    deleteSize () {
      productSize.delete({
        id: this.deleteSizeId
      }).then((res) => {
        if (res.data.status) {
          this.$message.success({
            message: '删除成功'
          })
          this.deleteSizeId = ''
          this.getSize()
        }
      })
    },
    getMeasurement () {
      productType.list().then((res) => {
        this.measurementList = res.data.data
        this.measurementTotal = this.measurementList.length
      })
    },
    addMeasurement (id) {
      this.measurementId = id
      this.showPopup = true
    },
    delMeasurement (item) {
      this.measurementIdArr = item
      this.measurementFlag = true
    },
    saveMeasurement () {
      if (this.measurement) {
        measurement.create({
          name: this.measurement,
          category_id: this.measurementId
        }).then((res) => {
          if (res.data.status) {
            this.$message.success({
              message: '添加规格成功'
            })
            this.measurement = ''
            this.getMeasurement()
          }
        })
      } else {
        this.$message.error('请填写规格名称')
      }
    },
    deleteMeasurement () {
      measurement.delete({
        id: this.deleteMeasurementId
      }).then((res) => {
        if (res.data.status) {
          this.$message.success({
            message: '删除成功'
          })
          this.deleteMeasurementId = ''
          this.getMeasurement()
        }
      })
    },
    getSide () {
      craftSetting.list().then((res) => {
        this.sideList = res.data.data.side
        this.sideTotal = this.sideList.length
      })
    },
    saveSide () {
      if (this.side) {
        craftSetting.createSide({
          name: this.side
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.side = ''
            this.getSide()
          }
        })
      } else {
        this.$message.error('请输入边型')
      }
    },
    deleteSide (id) {
      this.$confirm('是否删除该边型?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        craftSetting.deleteSide({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getSide()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getMachine () {
      craftSetting.list().then((res) => {
        this.machineList = res.data.data.type
        this.machineTotal = this.machineList.length
      })
    },
    saveMachine () {
      if (this.machine) {
        craftSetting.createMachine({
          name: this.machine
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.machine = ''
            this.getMachine()
          }
        })
      } else {
        this.$message.error('请输入机型')
      }
    },
    deleteMachine (id) {
      this.$confirm('是否删除该机型?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        craftSetting.deleteMachine({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getMachine()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getMethods () {
      craftSetting.list().then((res) => {
        this.methodsList = res.data.data.method
        this.methodsTotal = this.methodsList.length
      })
    },
    saveMethods () {
      if (this.methods) {
        craftSetting.createMethods({
          name: this.methods
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.methods = ''
            this.getMethods()
          }
        })
      } else {
        this.$message.error('请输入组织法')
      }
    },
    deleteMethods (id) {
      this.$confirm('是否删除该组织法?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        craftSetting.deleteMethods({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getMethods()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getYarnName () {
      if (this.clientList.length === 0) {
        client.list().then((res) => {
          this.clientList = res.data.data
        })
      }
      yarn.list().then((res) => {
        this.yarnNameList = res.data.data
        this.yarnNameTotal = this.yarnNameList.length
      })
    },
    saveYarnName () {
      if (this.yarnName) {
        yarn.create({
          name: this.yarnName
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.yarnName = ''
            this.getYarnName()
          }
        })
      } else {
        this.$message.error('请输入纱线名称')
      }
    },
    deleteYarnName (id) {
      this.$confirm('是否删除该纱线?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        yarn.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getYarnName()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addClient () {
      this.yarnPriceArr.push({
        price: '',
        company: ''
      })
    },
    deleteClient (index) {
      this.yarnPriceArr.splice(index, 1)
    },
    getYarnColor () {
      yarnColor.list().then((res) => {
        this.yarnColorList = res.data.data
        this.yarnColorTotal = this.yarnColorList.length
      })
    },
    saveYarnColor () {
      if (this.yarnColor && this.yarnColorCode) {
        yarnColor.create({
          name: this.yarnColor,
          color_code: this.yarnColorCode
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.yarnColor = ''
            this.yarnColorCode = ''
            this.getYarnColor()
          }
        })
      } else {
        this.$message.error('请检查纱线颜色和色块是否填写完整')
      }
    },
    deleteYarnColor (id) {
      this.$confirm('是否删除该纱线颜色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        yarnColor.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getYarnColor()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getMaterialProcess () {
      process.list({
        type: 1
      }).then((res) => {
        this.materialProcessList = res.data.data
        this.materialProcessTotal = this.materialProcessList.length
      })
    },
    saveMaterialProcess () {
      if (this.materialProcess) {
        process.create({
          type: 1,
          name: this.materialProcess
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.materialProcess = ''
            this.getMaterialProcess()
          }
        })
      } else {
        this.$message.error('请输入工序名称')
      }
    },
    deleteMaterialProcess (id) {
      this.$confirm('是否删除该工序?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        process.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getMaterialProcess()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getHalfProcess () {
      process.list({
        type: 2
      }).then((res) => {
        this.halfProcessList = res.data.data
        this.halfProcessTotal = this.halfProcessList.length
      })
    },
    saveHalfProcess () {
      if (this.halfProcess) {
        process.create({
          type: 2,
          name: this.halfProcess
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.halfProcess = ''
            this.getHalfProcess()
          }
        })
      } else {
        this.$message.error('请输入工序名称')
      }
    },
    deleteHalfProcess (id) {
      this.$confirm('是否删除该工序?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        process.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getHalfProcess()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getGroup () {
      group.list().then((res) => {
        this.groupList = res.data.data
        this.groupTotal = this.groupList.length
      })
    },
    saveGroup () {
      if (this.group) {
        group.create({
          name: this.group
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.group = ''
            this.getGroup()
          }
        })
      } else {
        this.$message.error('请输入小组名称')
      }
    },
    deleteGroup (id) {
      this.$confirm('是否删除该小组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        group.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getGroup()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getCompany () {
      company.detail().then((res) => {
        let companyInfo = res.data.data
        this.companyInfo.logoUrl = companyInfo.logo
        this.companyInfo.client_name = companyInfo.company_name
        this.companyInfo.client_about = companyInfo.introduce
        this.companyInfo.client_tel = companyInfo.phone
        this.companyInfo.client_email = companyInfo.email
        this.companyInfo.client_address = companyInfo.address
      })
    },
    handleAvatarSuccess (res, file) {
      this.logoUrl = URL.createObjectURL(file.raw)
    },
    beforeUpload: function (file) {
      let fileName = file.name.lastIndexOf('.')// 取到文件名开始到最后一个点的长度
      let fileNameLength = file.name.length// 取到文件名长度
      let fileFormat = file.name.substring(fileName + 1, fileNameLength)// 截
      this.postData.key = Date.parse(new Date()) + '.' + fileFormat
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 6
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 6MB!')
        return false
      }
    },
    saveCompany () {

    },
    getAuth () {
      if (this.groupList.length === 0) {
        this.getGroup()
      }
      auth.list({
        page: this.authPage,
        limit: 5
      }).then((res) => {
        this.authList = res.data.data
        this.authTotal = res.data.meta.total
      })
    },
    saveAuth () {
      if (this.authInfo.telephone === '') {
        this.$message({
          type: 'error',
          message: '手机号码不能为空'
        })
      } else if (this.authInfo.name === '') {
        this.$message({
          type: 'error',
          message: '姓名不能为空'
        })
      } else if (this.authInfo.group_id === '') {
        this.$message({
          type: 'error',
          message: '小组不能为空'
        })
      } else if (this.authInfo.module_id.length === 0) {
        this.$message({
          type: 'error',
          message: '管理模块不能为空'
        })
      } else {
        auth.create(this.authInfo).then((res) => {
          if (res.data.status) {
            this.$message.success('添加成功')
            this.authInfo = {
              id: null,
              status: 1,
              telephone: '',
              group_id: '',
              station_name: '',
              name: '',
              mobile: '',
              module_id: []
            }
          }
        })
      }
    }
  },
  created () {
    this.pName = '物料设置'
    this.cName = '纱线名称'
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/setting/setting.less";
</style>
<style lang="less">
.tree_node_Ctn {
  display: flex;
  width: 300px;
  justify-content: space-between;
  align-items: center;
  &:hover {
    .tree_node_op {
      display: block;
    }
  }
  .tree_edit_input {
    color: #666;
    font-size: 12px;
  }
  .tree_node_op {
    display: none;
    margin-left: 30px;
    color: #666;
    i {
      margin: 0 5px;
      &:hover {
        color: #1a95ff;
      }
    }
  }
}
.imgCtn {
  .el-upload-dragger {
    width: 100px !important;
    height: 100px !important;
    img {
      width: 100px !important;
      height: 100px !important;
    }
  }
  .el-upload {
    line-height: 100px;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.65);
  }
}
#setting {
  .el-checkbox {
    margin-right: 12px;
  }
}
</style>
