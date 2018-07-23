<template>
   <div>
        <!-- 面包屑 -->
        <div class="row wrapper border-bottom white-bg page-heading">
            <div class="col-lg-10">
                <h2>Ad Squad</h2>
                <ol class="breadcrumb">
                    <li>
                        <router-link to="/">Home</router-link>
                    </li>
                    <li>
                        <router-link to="/adSquad">Ad Squad</router-link>
                    </li>
                    <li class="active">
                        <strong>New Ad Squad</strong>
                    </li>
                </ol>
            </div>
        </div>

        <!-- Target -->
        <div class="ibox float-e-margins animated fadeInRight">
            <div class="ibox-title">
                <h5>Target</h5>
            </div>
            <div class="ibox-content">
                <div class="form-horizontal">
                    <!-- Campaign -->
                    <div class="form-group">
                        <label class="col-sm-2 control-label">
                            <i class="star">*</i>
                            Campaign
                            <el-tooltip placement="top">
                               <div slot="content" class="content">Give your campaign a name.</div>
                               <i class="el-icon-info hint"></i>
                           </el-tooltip>
                        </label>
                        <div class="col-sm-3">
                            <el-select
                                v-model="campaignID"
                                placeholder="Search.."
                                style="width: 100%"
                                v-validate="'required'"
                                name="vee-campaign"
                                @change="change_campaign()"
                                :remote-method="load_campaign"
                                filterable
                                remote>
                                <el-option
                                    width="100%"
                                    v-for="item in list_campaign"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                            <div v-if="errors.first('vee-campaign')" class="tip">{{ errors.first('vee-campaign') }}</div>
                        </div>
                        <button class="btn btn-primary" @click="toCampaign()">New Campaign</button>
                    </div>
                    <div class="hr-line-dashed"></div>

                    <!-- Name -->
                    <div class="form-group">
                        <label class="col-sm-2 control-label">
                            <i class="star">*</i>
                            Ad Squad Name
                           <el-tooltip placement="top">
                               <div slot="content" class="content">Give your ad Squad a name . If you're using an existing ad Squad, you can keep the same name.</div>
                               <i class="el-icon-info hint"></i>
                           </el-tooltip>
                        </label>
                        <div class="col-sm-9">
                            <input
                                type="text"
                                class="form-control"
                                v-model="name"
                                v-validate="'required|min:1|max:100'"
                                name="vee-name"
                                autocomplete="off">
                            <div v-if="errors.first('vee-name')" class="tip">{{ errors.first('vee-name') }}</div>
                        </div>
                    </div>
                    <div class="hr-line-dashed"></div>

                    <!-- Status -->
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Status</label>
                        <div class="col-sm-9">
                            <el-switch
                                class="switch"
                                v-model="status"
                                :active-value="1"
                                :inactive-value="0">
                            </el-switch>
                        </div>
                    </div>
                    
                    
                    <!-- Target -->
                    <div v-if="campaignID>0">
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label"><i class="star">*</i>Target</label>
                            <div class="col-sm-3">
                                <el-select
                                    v-model="targetID"
                                    placeholder="Select"
                                    style="width: 100%"
                                    @change="change_target()">
                                    <el-option
                                        width="100%"
                                        v-for="item in list_target"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>

                    <!-- 猎豹才看得到 -->
                    <div v-if="targetID == 1">
                        <!-- 账号 -->
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label"><i class="star">*</i>Account</label>
                            <div class="col-sm-3">
                                <el-select
                                    v-model="accountID"
                                    placeholder="Select"
                                    style="width: 100%"
                                    v-validate="'required'"
                                    name="vee-account">
                                    <el-option
                                        width="100%"
                                        v-for="item in list_account"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                                <div v-if="errors.first('vee-account')" class="tip">{{ errors.first('vee-account') }}</div>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <!-- Objective -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label"><i class="star">*</i>Objective</label>
                            <div class="col-sm-3">
                                <el-select
                                    v-model="objectiveID"
                                    placeholder="Select"
                                    style="width: 100%"
                                    v-validate="'required'"
                                    name="vee-Objective"
                                    @change="change_landPage()"
                                    :disabled="exist_campaign == 0">
                                    <el-option
                                        width="100%"
                                        v-for="item in list_objective"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                                <div v-if="errors.first('vee-Objective')" class="tip">{{ errors.first('vee-Objective') }}</div>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>

                        <!-- APP -->
                        <div v-if="objectiveID != 2">
                            <div class="form-group">
                                <label class="col-sm-2 control-label">
                                    <i class="star">*</i>
                                    App
                                    <el-tooltip placement="top">
                                       <div slot="content" class="content">Please input your App's package name or Google Play URL</div>
                                       <i class="el-icon-info hint"></i>
                                   </el-tooltip>
                                </label>
                                <div class="col-sm-9">
                                    <input
                                        type="text"
                                        class="form-control"
                                        v-model="app"
                                        v-validate="'required|max:100|url'"
                                        name="vee-APP"
                                        placeholder="Please input your App's package name or Google Play URL"
                                        :disabled="exist_campaign == 0">
                                    <div v-if="errors.first('vee-APP')" class="tip">{{ errors.first('vee-APP') }}</div>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                        </div>

                        <!-- Types Of App -->
                        <div v-if="objectiveID != 2">
                            <div class="form-group">
                                <label class="col-sm-2 control-label">
                                    <i class="star">*</i>
                                    Types Of App
                                    <el-tooltip placement="top">
                                       <div slot="content" class="content">Choose the type of your app in Google Play or App Store.</div>
                                       <i class="el-icon-info hint"></i>
                                   </el-tooltip>
                                </label>
                                <div class="col-sm-3">
                                    <el-select
                                        v-model="appTypeID"
                                        placeholder="Select"
                                        style="width: 100%"
                                        v-validate="'required'"
                                        name="vee-TypesOfApp"
                                        :disabled="exist_campaign == 0">
                                        <el-option
                                            width="100%"
                                            v-for="item in list_appType"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <div v-if="errors.first('vee-TypesOfApp')" class="tip">{{ errors.first('vee-TypesOfApp') }}</div>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                        </div>

                        <!-- Landing Page -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">
                                <i class="star">*</i>
                                Landing Page
                                <el-tooltip placement="top">
                                   <div slot="content" class="content">The way of opening landing page after users click ad.</div>
                                   <i class="el-icon-info hint"></i>
                               </el-tooltip>
                            </label>
                            <div class="col-sm-3">
                                <el-select
                                    v-model="landPageID"
                                    placeholder="Select"
                                    style="width: 100%"
                                    v-validate="'required'"
                                    name="vee-LandingPage"
                                    :disabled="objectiveID == 1">
                                    <el-option
                                        width="100%"
                                        v-for="item in list_landPage"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                                <div v-if="errors.first('vee-LandingPage')" class="tip">{{ errors.first('vee-LandingPage') }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 当选中目标平台才显示 -->
        <div v-show="targetID!=null">
            <!-- Audience -->
            <div class="ibox float-e-margins animated fadeInRight">
                <div class="ibox-title">
                    <h5>Audience</h5>
                </div>
                <div class="ibox-content">
                    <div class="form-horizontal">
                        <div v-if="targetID == 0">
                            <!-- Device Type -->
                            <div class="form-group">
                                <label class="col-sm-2 control-label"><i class="star">*</i>Device Type</label>
                                <div class="col-sm-9">
                                    <el-select
                                        v-model="deviceID"
                                        multiple
                                        filterable
                                        placeholder="Select"
                                        style="width: 100%"
                                        v-validate="'required'"
                                        name="vee-device">
                                        <el-option
                                            width="100%"
                                            v-for="item in list_device"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <div v-if="errors.first('vee-device')" class="tip">{{ errors.first('vee-device') }}</div>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                        </div>

                        <!-- 模板 -->
                        <div v-show="targetID == 1">
                            <div class="form-group">
                                <label class="col-sm-2 control-label">
                                    Template
                                    <el-tooltip placement="top">
                                       <div slot="content" class="content">Select a previously saved audience segment. <a href="http://ori.cmcm.com/help/search/?query=template&f=i" target="_blank">Learn More</a></div>
                                       <i class="el-icon-info hint"></i>
                                   </el-tooltip>
                                </label>
                                <div class="col-sm-9">
                                    <el-select
                                        v-model="templateID"
                                        placeholder="Choose a template to automatically fill"
                                        style="width: 100%"
                                        @change="change_template()">
                                        <el-option
                                            width="100%"
                                            v-for="item in list_template"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                        </div>

                        <!-- OS -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label"><i class="star">*</i>OS</label>
                            <div class="col-sm-3">
                                <el-select
                                    v-model="OSID"
                                    placeholder="Select"
                                    style="width: 100%"
                                    v-validate="'required'"
                                    name="vee-os"
                                    @change="change_loadVersion(list_OS)">
                                    <el-option
                                        width="100%"
                                        v-for="item in list_OS"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.name">
                                    </el-option>
                                </el-select>
                                <div v-if="errors.first('vee-os')" class="tip">{{ errors.first('vee-os') }}</div>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>

                        <!-- Version -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">
                                <i class="star">*</i>
                                OS Version
                                <el-tooltip placement="top">
                                    <div slot="content" class="content">You can target by mobile operating system.</div>
                                    <i class="el-icon-info hint"></i>
                                </el-tooltip>
                            </label>
                            <div class="col-sm-9">
                                <el-select
                                    v-model="versionID1"
                                    placeholder="Select"
                                    style="width: 25%"
                                    v-validate="'required'"
                                    name="vee-version">
                                    <el-option
                                        width="100%"
                                        v-for="item in list_version"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.name">
                                    </el-option>
                                </el-select>
                                <span>-</span>
                                <el-select
                                    v-model="versionID2"
                                    placeholder="Select"
                                    style="width: 25%">
                                    <el-option
                                        width="100%"
                                        v-for="item in list_version"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.name"
                                        v-if="item.name != versionID1">
                                    </el-option>
                                </el-select>
                                <div v-if="errors.first('vee-version')" class="tip">{{ errors.first('vee-version') }}</div>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>

                        <!-- NDSP language -->
                        <div v-show="targetID == 0">
                            <div class="form-group">
                                <label class="col-sm-2 control-label">
                                    Language
                                    <el-tooltip placement="top">
                                        <div slot="content" class="content">Leave this blank unless the audience you are targeting speaks a language that is not common to the location you have chosen.</div>
                                        <i class="el-icon-info hint"></i>
                                    </el-tooltip>
                                </label>
                                <div class="col-sm-9">
                                    <el-select v-model="languageID" multiple filterable placeholder="Select" style="width:100%">
                                        <el-option
                                            v-for="item in list_language"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.name">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                        </div>

                        <!-- 猎豹 language -->
                        <div v-show="targetID == 1">
                            <div class="form-group">
                                <label class="col-sm-2 control-label">
                                    Language
                                    <el-tooltip placement="top">
                                        <div slot="content" class="content">Leave this blank unless the audience you are targeting speaks a language that is not common to the location you have chosen.</div>
                                        <i class="el-icon-info hint"></i>
                                    </el-tooltip>
                                </label>
                                <div class="col-sm-9">
                                    <el-select v-model="languageID2" placeholder="Select" style="width:100%">
                                        <el-option
                                            v-for="item in list_language"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                        </div>

                        <!-- Location -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">
                                <i class="star">*</i>
                                Location
                                <el-tooltip placement="top">
                                    <div slot="content" class="content">Enter one or more locations to narrow your potential audience to the people in those locations.</div>
                                    <i class="el-icon-info hint"></i>
                                </el-tooltip>
                            </label>
                            <div class="col-sm-9">
                                <el-select
                                    v-model="countryID"
                                    multiple
                                    filterable
                                    placeholder="Country"
                                    style="width: 100%;margin-bottom:10px"
                                    v-validate="'required'"
                                    name="vee-country"
                                    @change="change_loadregion()">
                                    <el-option
                                        width="100%"
                                        v-for="item in list_country"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <div
                                    v-if="errors.first('vee-country')"
                                    class="tip"
                                    style="margin:0 0 10px 0">{{ errors.first('vee-country') }}</div>
                                <el-select
                                    v-model="regionID"
                                    multiple
                                    filterable
                                    placeholder="Region"
                                    style="width: 100%;margin-bottom:10px"
                                    @change="change_loadcity()">
                                    <el-option
                                        width="100%"
                                        v-for="item in list_region"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-model="cityID" multiple filterable placeholder="City" style="width: 100%">
                                    <el-option
                                        width="100%"
                                        v-for="item in list_city"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>

                        <!-- 猎豹可见 -->
                        <div v-show="targetID == 1">
                            <!-- 性别 -->
                            <div class="form-group">
                                <label class="col-sm-2 control-label">
                                    Gender
                                    <el-tooltip placement="top">
                                        <div slot="content" class="content">Choose All unless you only want your ads to be shown to either male or female.</div>
                                        <i class="el-icon-info hint"></i>
                                    </el-tooltip>
                                </label>
                                <div class="col-sm-9">
                                    <el-select
                                        v-model="genderID"
                                        placeholder="Select"
                                        style="width:100%">
                                        <el-option
                                            v-for="item in list_gender"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>

                            <!-- 年龄 -->
                            <div class="form-group">
                                <label class="col-sm-2 control-label">
                                    Age
                                    <el-tooltip placement="top">
                                        <div slot="content" class="content">Select the age of the people who will find your ad relevant. <a href="http://ori.cmcm.com/help/search/?query=age&f=i" target="_blank">Learn More</a></div>
                                        <i class="el-icon-info hint"></i>
                                    </el-tooltip>
                                </label>
                                <div class="col-sm-9">
                                    <el-select
                                        v-model="ageID"
                                        placeholder="Select"
                                        style="width:100%">
                                        <el-option
                                            v-for="item in list_age"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>

                            <!-- 机型 -->
                            <div class="form-group">
                                <label class="col-sm-2 control-label">
                                    Device Models
                                    <el-tooltip placement="top">
                                       <div slot="content" class="content">You can target by device models.</div>
                                       <i class="el-icon-info hint"></i>
                                    </el-tooltip>
                                </label>
                                <div class="col-sm-9 overAuto">
                                    <el-tree
                                        :data="list_deviceModels"
                                        show-checkbox
                                        node-key="id"
                                        ref="tree_deviceModels"
                                        :default-checked-keys="checked_deviceModels"
                                        :props="defaultProps">
                                    </el-tree>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>

                            <!-- Network -->
                            <div class="form-group">
                                <label class="col-sm-2 control-label">
                                    Network
                                    <el-tooltip placement="top">
                                       <div slot="content" class="content">You can target by wireless internet connection or by cellular connection.</div>
                                       <i class="el-icon-info hint"></i>
                                    </el-tooltip>
                                </label>
                                <div class="col-sm-9">
                                    <el-radio-group v-model="NetworkID" size="small">
                                        <el-radio-button label="0">All</el-radio-button>
                                        <el-radio-button label="1">Wifi</el-radio-button>
                                        <el-radio-button label="2">Mobile Network</el-radio-button>
                                    </el-radio-group>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                        </div>

                        <!-- 运营商 -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Carriers</label>
                            <div class="col-sm-9">
                                <el-select
                                    v-model="carriersID"
                                    multiple
                                    filterable
                                    placeholder="Select"
                                    style="width:100%">
                                    <el-option
                                        v-for="item in list_carriers"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>

                        <!-- 兴趣爱好 -->
                        <div v-show="targetID == 1">
                            <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">
                                    Interests
                                    <el-tooltip placement="top">
                                       <div slot="content" class="content">Reach users based on their specific interests. <a href="http://ori.cmcm.com/help/search/?query=interest&f=i" target="_blank"></a></div>
                                       <i class="el-icon-info hint"></i>
                                    </el-tooltip>
                                </label>
                                <div class="col-sm-9 overAuto">
                                    <el-tree
                                        :data="list_Interests"
                                        show-checkbox
                                        node-key="id"
                                        ref="tree_Interests"
                                        :default-checked-keys="checked_Interests"
                                        :props="defaultProps">
                                    </el-tree>
                                </div>
                            </div>
                        </div>

                        <!-- 是否保存模板 -->
                        <div class="form-grou col-sm-offset-2" v-show="targetID == 1">
                            <el-checkbox v-model="ifTemplate">Save this audience as template</el-checkbox>
                            <input
                                type="text"
                                class="form-control"
                                v-model="template_name"
                                placeholder="Template Name"
                                style="width:250px"
                                v-if="ifTemplate == true"
                                @blur="exist_template()">
                            <p class="tip" v-show="exist">already exist</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Schedule & Budget -->
            <div class="ibox float-e-margins animated fadeInRight">
                <div class="ibox-title">
                    <h5>Schedule & Budget</h5>
                </div>
                <div class="ibox-content">
                    <div class="form-horizontal">
                       <div v-if="targetID == 1">
                            <!-- 交易类型 -->
                            <div class="form-group">
                                <label class="col-sm-2 control-label">
                                    <i class="star">*</i>
                                    Delivery Type
                                    <el-tooltip placement="top">
                                       <div slot="content" class="content">You can choose standard or accelerated delivery. Standard delivery is recommended and the preferred option for most advertisers. Accelerated delivery can be useful for promoting time-sensitive events and quickly reaching a target audience. </div>
                                       <i class="el-icon-info hint"></i>
                                    </el-tooltip>
                                </label>
                                <div class="col-sm-3">
                                    <el-select
                                        v-model="deliveryID"
                                        placeholder="Select"
                                        style="width: 100%"
                                        v-validate="'required'"
                                        name="vee-delivery">
                                        <el-option
                                            width="100%"
                                            v-for="item in list_delivery"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <div v-if="errors.first('vee-delivery')" class="tip">{{ errors.first('vee-delivery') }}</div>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>

                            <!-- URL -->
                            <div class="form-group">
                                <label class="col-sm-2 control-label">
                                    <i class="star">*</i>
                                    URL
                                    <el-tooltip placement="top">
                                       <div slot="content" class="content">Please enter a valid URL. Protocol is required (http://, https://), if you want to track the ad conversions, click Learn More. <a href="http://ori.cmcm.com/help/search/?query=conversion&f=i" target="_blank">Learn More</a> </div>
                                       <i class="el-icon-info hint"></i>
                                    </el-tooltip>
                                </label>
                                <div class="col-sm-9">
                                    <input
                                        type="text"
                                        class="form-control"
                                        v-model="url"
                                        v-validate="'required|max:50|url:require_protocol'"
                                        name="vee-url"
                                        placeholder="Please input your App's Google Play URL">
                                    <div v-if="errors.first('vee-url')" class="tip">{{ errors.first('vee-url') }}</div>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                       </div>

                        <!-- Price Model -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">
                                <i class="star">*</i>
                                Pay For
                                <el-tooltip placement="top">
                                   <div slot="content" class="content">Please choose your bid type for your ad.</div>
                                   <i class="el-icon-info hint"></i>
                                </el-tooltip>
                            </label>
                            <div class="col-sm-3">
                                <el-select
                                    v-model="modelID"
                                    placeholder="Select"
                                    style="width: 100%"
                                    v-validate="'required'"
                                    name="vee-model">
                                    <el-option
                                        width="100%"
                                        v-for="item in list_model"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                                <div v-if="errors.first('vee-model')" class="tip">{{ errors.first('vee-model') }}</div>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>

                        <!-- NDSP BID -->
                        <div v-if="targetID==0">
                            <div class="form-group">
                                <label class="col-sm-2 control-label">
                                    <i class="star">*</i>
                                    Bid
                                    <el-tooltip placement="top">
                                       <div slot="content" class="content">You can set the amount you want to spend to your bid type for this set.<a href="http://ori.cmcm.com/help/search/?query=bid&f=i" target="_blank">Learn More </a></div>
                                       <i class="el-icon-info hint"></i>
                                    </el-tooltip>
                                </label>
                                <div class="col-sm-3">
                                    <input
                                        type="text"
                                        class="form-control"
                                        v-model="bid"
                                        v-validate="'required|number'"
                                        name="vee-bid"
                                        autocomplete="off"
                                        @blur="check_between()"
                                        id="bid">
                                    <div v-if="errors.first('vee-bid')" class="tip">{{ errors.first('vee-bid') }}</div>
                                    <div v-if="check_bid" class="tip">It must be less than Daliy Budget</div>
                                </div>
                                <span style="line-height:34px">$USD</span>
                            </div>
                            <div class="hr-line-dashed"></div>
                        </div>

                        <!-- Bid Percent -->
                        <div v-if="targetID == 0">
                            <div v-if="ifshow('adSquad:BidPercent')">
                                <div class="form-group">
                                    <label class="col-sm-2 control-label"><i class="star">*</i>Bid Percent</label>
                                    <div class="col-sm-3">
                                        <input
                                            type="text"
                                            class="form-control"
                                            v-model="bidp"
                                            v-validate="'required|number'"
                                            name="vee-bidp">
                                        <div v-if="errors.first('vee-bidp')" class="tip">{{ errors.first('vee-bidp') }}</div>
                                    </div>
                                </div>
                                <div class="hr-line-dashed"></div>
                            </div>
                        </div>

                        <!-- ndsp 预算 -->
                        <div v-if="targetID == 0">
                            <!-- Total Budget -->
                            <div class="form-group">
                                <label class="col-sm-2 control-label"><i class="star">*</i>Total Budget</label>
                                <div class="col-sm-3">
                                    <input
                                        type="text"
                                        class="form-control"
                                        v-model="TotalBudget"
                                        v-validate="'required|number|between:0,99999999'"
                                        name="vee-TotalBudget"
                                        id="totalBudget"
                                        @blur="check_between()"
                                        autocomplete="off">
                                    <div v-if="errors.first('vee-TotalBudget')" class="tip">{{ errors.first('vee-TotalBudget') }}</div>
                                    <div v-if="check_budget" class="tip">It must be more than Daliy Budget</div>
                                </div>
                                <span style="line-height:34px">$USD</span>
                            </div>
                            <div class="hr-line-dashed"></div>
                            <!-- Daliy Budget -->
                            <div class="form-group">
                                <label class="col-sm-2 control-label"><i class="star">*</i>Daliy Budget</label>
                                <div class="col-sm-3">
                                    <input
                                        type="text"
                                        class="form-control"
                                        v-model="DaliyBudget"
                                        v-validate="'required|number|between:0,99999999'"
                                        name="vee-DaliyBudget"
                                        @blur="check_between()"
                                        autocomplete="off">
                                    <div v-if="errors.first('vee-DaliyBudget')" class="tip">{{ errors.first('vee-DaliyBudget') }}</div>
                                </div>
                                <span style="line-height:34px">$USD</span>
                            </div>
                            <div class="hr-line-dashed"></div>
                        </div>

                        <!-- 猎豹 预算 -->
                        <div v-if="targetID == 1">
                            <!-- BID -->
                            <div class="form-group">
                                <label class="col-sm-2 control-label">
                                    <i class="star">*</i>
                                    Bid
                                    <el-tooltip placement="top">
                                       <div slot="content" class="content">You can set the amount you want to spend to your bid type for this set.<a href="http://ori.cmcm.com/help/search/?query=bid&f=i" target="_blank">Learn More </a></div>
                                       <i class="el-icon-info hint"></i>
                                    </el-tooltip>
                                </label>
                                <div class="col-sm-3">
                                    <input
                                        type="text"
                                        class="form-control"
                                        v-model="bid2"
                                        v-validate="'required|number'"
                                        name="vee-bid"
                                        autocomplete="off"
                                        @blur="check_between2()"
                                        id="bid2">
                                    <div v-if="errors.first('vee-bid')" class="tip">{{ errors.first('vee-bid') }}</div>
                                    <div v-if="check_bid2" class="tip">It must be less than Daliy Budget</div>
                                </div>
                                <span style="line-height:34px">$USD</span>
                            </div>
                            <div class="hr-line-dashed"></div>
                            <!-- Total Budget -->
                            <div class="form-group">
                                <label class="col-sm-2 control-label"><i class="star">*</i>Total Budget</label>
                                <div class="col-sm-3">
                                    <input
                                        type="text"
                                        class="form-control"
                                        v-model="TotalBudget2"
                                        v-validate="'required|number|between:50,99999999'"
                                        name="vee-TotalBudget2"
                                        autocomplete="off"
                                        id="totalBudget2"
                                        @blur="check_between2()">
                                    <div v-if="errors.first('vee-TotalBudget2')" class="tip">{{ errors.first('vee-TotalBudget2') }}</div>
                                    <div v-if="check_budget2" class="tip">It must be more than Daliy Budget</div>
                                </div>
                                <span style="line-height:34px">$USD</span>
                            </div>
                            <div class="hr-line-dashed"></div>
                            <!-- Daliy Budget -->
                            <div class="form-group">
                                <label class="col-sm-2 control-label"><i class="star">*</i>Daliy Budget</label>
                                <div class="col-sm-3">
                                    <input
                                        type="text"
                                        class="form-control"
                                        v-model="DaliyBudget2"
                                        v-validate="'required|number|between:50,99999999'"
                                        name="vee-DaliyBudget2"
                                        autocomplete="off"
                                        @blur="check_between2()">
                                    <div v-if="errors.first('vee-DaliyBudget2')" class="tip">{{ errors.first('vee-DaliyBudget2') }}</div>
                                </div>
                                <span style="line-height:34px">$USD</span>
                            </div>
                            <div class="hr-line-dashed"></div>
                        </div>

                        <!-- Schedule -->
                        <div class="form-group">
                          <label class="col-sm-2 control-label">
                            <i class="star">*</i>
                            Schedule
                            <el-tooltip placement="top">
                              <div slot="content" class="content">Your ad set will either run continuously starting today or within
                                a date range you select. <a href="http://ori.cmcm.com/help/search/?query=schedule&f=i"
                                                            target="_blank">Learn More</a></div>
                              <i class="el-icon-info hint"></i>
                            </el-tooltip>
                          </label>
                          <div class="col-sm-5">
                            <el-date-picker
                              v-model="date"
                              v-on:blur="onDateChangeListener"
                              type="datetimerange"
                              range-separator="-"
                              start-placeholder="StartTime"
                              end-placeholder="EndTime"
                              value-format="timestamp">
                            </el-date-picker>
                            <div v-if="checkDate" class="tip">The time should be one hour greater than the current time</div>
                          </div>
                          <input
                            type="text"
                            v-model="date"
                            v-validate="'required'"
                            name="vee-date"
                            style="width:1px;opacity:0">
                        </div>
                        <div class="hr-line-dashed"></div>

                        <!-- Impression Tracking -->
                        <div v-if="targetID == 1 && showhide">
                            <div class="form-group">
                                <label class="col-sm-2 control-label">
                                    Impression Tracking
                                    <el-tooltip placement="top">
                                       <div slot="content" class="content">An Impression tracking is an optional URL that allows you to track how many people viewed your ads through third-party tracking system, and our system supported macro is Gaid, e.g. http://host/imp?gaid={gaid}.<a href="http://ori.cmcm.com/help/search/?query=impression%20Tracking&f=i" target="_blank">Learn More </a></div>
                                       <i class="el-icon-info hint"></i>
                                    </el-tooltip>
                                </label>
                                <div class="col-sm-9">
                                    <el-input
                                        type="textarea"
                                        v-model="tracking"
                                        v-validate="'min:1|url:require_protocol'"
                                        name="vee-Tracking">
                                    </el-input>
                                    <div v-if="errors.first('vee-Tracking')" class="tip">{{ errors.first('vee-Tracking') }}</div>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                        </div>

                        <!-- 投放时间 -->
                        <div class="form-group" v-show="showhide">
                            <label class="col-sm-2 control-label">
                                Ad Scheduling
                                <el-tooltip placement="top">
                                   <div slot="content" class="content">Your ad set will either run continuously within some day or within some hours range you select.<a href="http://ori.cmcm.com/help/search/?query=Ad%20Scheduling&f=i" target="_blank">Learn More </a></div>
                                   <i class="el-icon-info hint"></i>
                                </el-tooltip>
                            </label>
                            <div class="col-sm-9">
                                <div>
                                    <!-- left -->
                                    <div class="time_left">
                                        <dd style="margin-top:22px">Mon.</dd>
                                        <dd>Tue.</dd>
                                        <dd>Wed.</dd>
                                        <dd>Thu.</dd>
                                        <dd>Fri.</dd>
                                        <dd>Sat.</dd>
                                        <dd>Sun.</dd>
                                    </div>
                                    <!-- right -->
                                    <div class="planDate">
                                        <div class="m_time">
                                            <i>00:00</i>
                                            <i>03:00</i>
                                            <i>06:00</i>
                                            <i>09:00</i>
                                            <i>12:00</i>
                                            <i>15:00</i>
                                            <i>18:00</i>
                                            <i>21:00</i>
                                        </div>
                                        <span v-for="(item,index) in planHour" @click="getPlanHourSpan(item,index)" :id="item"></span>
                                        <div style="clear: both"></div>
                                    </div>
                                    <div style="clear:both"></div>
                                </div>
                                <div>
                                    <!-- left -->
                                    <div class="time_left EveryDay">Every Day</div>
                                    <!-- right -->
                                    <div class="planDate" style="margin-top:10px">
                                        <span v-for="(item,index) in planDay" @click="getPlanDaySpan(item,index)" :id="'day-'+item"></span>
                                        <div style="clear: both"></div>
                                    </div>
                                    <div style="clear: both"></div>
                                </div>
                                <div class="state">
                                    <span></span>
                                    <p>Scheduled hours are blue</p>
                                    <div style="clear:both"></div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 显示隐藏按钮 -->
                        <div class="col-sm-offset-2 showbtn" @click="showhide = !showhide" v-if="targetID==1">
                            Hide Advanced Options
                            <i class="el-icon-caret-top" v-show="showhide"></i>
                            <i class="el-icon-caret-bottom" v-show="!showhide"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- IAB & Filter -->
            <div class="ibox float-e-margins animated fadeInRight" v-if="targetID == 0">
                <div class="ibox-title">
                    <h5>IAB & Filter</h5>
                </div>
                <div class="ibox-content">
                    <div class="form-horizontal">
                        <!-- iab -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label"><i class="star">*</i>IAB</label>
                            <div class="col-sm-9">
                                <!-- 第1个 -->
                                <div class="iab row">
                                    <div class="col-md-4">
                                        <el-select
                                            v-model="iab1_1"
                                            placeholder="Select"
                                            style="width: 100%"
                                            @change="iab2_1 = [],loadIAB2_1()">
                                            <el-option
                                                width="100%"
                                                v-for="item in list_iab1"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <div v-if="errors.first('vee-iab')" class="tip">{{ errors.first('vee-iab') }}</div>
                                    </div>
                                    <div class="col-md-7">
                                        <el-select v-model="iab2_1" multiple placeholder="Select" style="width: 100%" v-validate="'required'" name="vee-iab">
                                            <el-option
                                                width="100%"
                                                v-for="item in list_iab2_1"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <span class="input-group-btn">
                                        <button class="btn btn-white bootstrap-touchspin-up" @click="iabMax()">+</button>
                                    </span>
                                </div>

                                <!-- 第2个 -->
                                <div class="iab row" v-if="iabShow >= 2">
                                    <div class="col-md-4">
                                        <el-select
                                            v-model="iab1_2"
                                            placeholder="Select"
                                            style="width: 100%"
                                            @change="iab2_2 = [],loadIAB2_2()">
                                            <el-option
                                                width="100%"
                                                v-for="item in list_iab1"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.value"
                                                v-show="item.value != iab1_1">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div class="col-md-7">
                                        <el-select v-model="iab2_2" multiple placeholder="Select" style="width: 100%">
                                            <el-option
                                                width="100%"
                                                v-for="item in list_iab2_2"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <span class="input-group-btn">
                                        <button class="btn btn-white bootstrap-touchspin-up" @click="iabShow = 1,iab1_2='',iab2_2=''">-</button>
                                    </span>
                                </div>

                                <!-- 第3个 -->
                                <div class="iab row" v-if="iabShow >= 3">
                                    <div class="col-md-4">
                                        <select class="form-control" v-model="iab1_3" @change="iab2_3 = [],loadIAB2_3()" style="height:40px">
                                            <option value="">Select</option>
                                            <option v-for="item in list_iab1" :value=item.value v-show="item.value != iab1_1 && item.value != iab1_2">{{item.name}}</option>
                                        </select>
                                    </div>
                                    <div class="col-md-7">
                                        <el-select v-model="iab2_3" multiple placeholder="Select" style="width: 100%">
                                            <el-option
                                                width="100%"
                                                v-for="item in list_iab2_3"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <span class="input-group-btn">
                                        <button class="btn btn-white bootstrap-touchspin-up" @click="iabShow = 2,iab1_3='',iab2_3=''">-</button>
                                    </span>
                                </div>

                                <!-- 第4个 -->
                                <div class="iab row" v-if="iabShow >= 4">
                                    <div class="col-md-4">
                                        <select class="form-control" v-model="iab1_4" @change="iab2_4 = [],loadIAB2_4()" style="height:40px">
                                            <option value="">Select</option>
                                            <option v-for="item in list_iab1" :value=item.value v-show="item.value != iab1_1 && item.value != iab1_2 && item.value != iab1_3">{{item.name}}</option>
                                        </select>
                                    </div>
                                    <div class="col-md-7">
                                        <el-select v-model="iab2_4" multiple placeholder="Select" style="width: 100%">
                                            <el-option
                                                width="100%"
                                                v-for="item in list_iab2_4"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <span class="input-group-btn">
                                        <button class="btn btn-white bootstrap-touchspin-up" @click="iabShow = 3,iab1_4='',iab2_4=''">-</button>
                                    </span>
                                </div>

                                <!-- 第5个 -->
                                <div class="iab row" v-if="iabShow >= 5">
                                    <div class="col-md-4">
                                        <select class="form-control" v-model="iab1_5" @change="iab2_5 = [],loadIAB2_5()" style="height:40px">
                                            <option value="">Select</option>
                                            <option v-for="item in list_iab1" :value=item.value v-show="item.value != iab1_1 && item.value != iab1_2 && item.value != iab1_3 && item.value != iab1_4">{{item.name}}</option>
                                        </select>
                                    </div>
                                    <div class="col-md-7">
                                        <el-select v-model="iab2_5" multiple placeholder="Select" style="width: 100%">
                                            <el-option
                                                width="100%"
                                                v-for="item in list_iab2_5"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <span class="input-group-btn">
                                        <button class="btn btn-white bootstrap-touchspin-up" @click="iabShow = 4,iab1_5='',iab2_5=''">-</button>
                                    </span>
                                </div>

                                <!-- 第6个 -->
                                <div class="iab row" v-if="iabShow >= 6">
                                    <div class="col-md-4">
                                        <select class="form-control" v-model="iab1_6" @change="iab2_6 = [],loadIAB2_6()" style="height:40px">
                                            <option value="">Select</option>
                                            <option v-for="item in list_iab1" :value=item.value v-show="item.value != iab1_1 && item.value != iab1_2 && item.value != iab1_3 && item.value != iab1_4 && item.value != iab1_5">{{item.name}}</option>
                                        </select>
                                    </div>
                                    <div class="col-md-7">
                                        <el-select v-model="iab2_6" multiple placeholder="Select" style="width: 100%">
                                            <el-option
                                                width="100%"
                                                v-for="item in list_iab2_6"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <span class="input-group-btn">
                                        <button class="btn btn-white bootstrap-touchspin-up" @click="iabShow = 5,iab1_6='',iab2_6=''">-</button>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>

                        <!-- APP Filter -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">APP Filter</label>
                            <div class="col-sm-9">
                                <div class="row">
                                    <div class="col-md-4">
                                        <el-select
                                            v-model="APPIndex"
                                            placeholder="Select"
                                            style="width: 100%"
                                            @change="change_loadApps()">
                                            <el-option
                                                v-for="item in list_APPIndex"
                                                :key="item.name"
                                                :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div class="col-md-8">
                                        <el-select
                                            v-model="APP"
                                            multiple
                                            placeholder="Select"
                                            style="width: 100%">
                                            <el-option
                                                width="100%"
                                                v-for="item in list_apps"
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
                </div>
            </div>

            <!-- Ad Format -->
            <div class="ibox float-e-margins animated fadeInRight" v-if="targetID == 1">
                <div class="ibox-title">
                    <h5>Ad Format</h5>
                </div>
                <div class="ibox-content">
                    <div class="form-horizontal">
                        <!-- Ad Format -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label"><i class="star">*</i>Ad Format</label>
                            <div class="col-sm-3">
                                <el-select
                                    v-model="FormatID"
                                    placeholder="Select"
                                    style="width: 100%"
                                    v-validate="'required'"
                                    name="vee-Format">
                                    <el-option
                                        width="100%"
                                        v-for="item in list_Format"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                                <div v-if="errors.first('vee-Format')" class="tip">{{ errors.first('vee-Format') }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 提交 -->
            <div class="form-group" style="padding:0 0 40px 0">
                <div class="col-sm-4 col-sm-offset-1">
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">{{$t("m.Btn.Save")}}</button>
                    <button type="button" class="btn btn-default" style="margin-left:10px" @click="toadSquad()">{{$t("m.Btn.Back")}}</button>
                </div>
            </div>

            <!-- 你确定要提交吗 -->
            <div class="modal fade" id="myModal" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title" id="myModalLabel">Hint</h4>
                        </div>
                        <div class="modal-body">
                            Are you sure you want to submit it?
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" data-dismiss="modal" @click="new_submit()">Confirm</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 创建第三方账号 -->
            <div class="modal fade" id="myModal_account" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title" id="myModalLabel">You haven't added a cheetahaccount yet, please add</h4>
                        </div>
                        <div class="modal-body">
                            <form class="form-horizontal">
                                <!-- client id -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label"><i class="star">*</i>Client id</label>
                                    <div class="col-sm-10">
                                        <input
                                            v-model="clientID"
                                            type="text"
                                            class="form-control">
                                    </div>
                                </div>
                                <div class="hr-line-dashed"></div>
                                <!-- Client credential -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label"><i class="star">*</i>Client credential</label>
                                    <div class="col-sm-10">
                                        <input
                                            v-model="credentialID"
                                            type="text"
                                            class="form-control">
                                    </div>
                                </div>
                                <div class="hr-line-dashed"></div>
                                <!-- email -->
                                <div class="form-group">
                                    <label class="col-sm-2 control-label"><i class="star">*</i>Email</label>
                                    <div class="col-sm-10">
                                        <input
                                            v-model="email"
                                            type="text"
                                            class="form-control"
                                            v-validate="'email'"
                                            name="vee-email">
                                        <div class="tip" v-if="errors.first('vee-email')">{{ errors.first('vee-email') }}</div>
                                    </div>
                                </div>
                                <!-- mediabuyer -->
                                <div v-if="ifshow('adSquad:mediabuy')">
                                    <div class="hr-line-dashed"></div>
                                    <div class="form-group">
                                        <label class="col-sm-2 control-label"><i class="star">*</i>Mediabuyer</label>
                                        <div class="col-sm-10">
                                            <el-select
                                                v-model="mediabuyerID"
                                                placeholder="Select"
                                                style="width: 100%">
                                                <el-option
                                                    width="100%"
                                                    v-for="item in list_mediabuyer"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" data-dismiss="modal" @click="new_account()">Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
   </div>
</template>

<script>
import {formatDate} from '@/assets/js/date.js'
import {convert} from '@/assets/js/common.js'
import {objOfPropertyToArr} from '@/assets/js/common.js'
import {setCookie,getCookie,delCookie} from '@/assets/js/cookie.js'
import VeeValidate, {Validator} from 'vee-validate';
import axios from 'axios'
export default {
    data () {
        return {
            //公共
            list_target:[],targetID:null,
            name:"",
            status:1,
            list_campaign:[],campaignID:"",
            app:"",
            bidp:80,
            languageID2:"", //猎豹的语言是单选的
            list_device:[],deviceID:[],
            list_OS:[],OSID:"",temp_os:[],
            list_version:[],versionID1:"",versionID2:"",
            list_country:[],countryID:[],
            list_language:[],languageID:[],
            list_carriers:[],carriersID:[],
            list_region:[],regionID:[],

            //猎豹
            list_objective:[],objectiveID:"",
            list_appType:[],appTypeID:"",
            list_landPage:[],landPageID:"",
            list_gender:[],genderID:0,
            list_age:[],ageID:0,
            list_template:[],templateID:"",template_name:"",ifTemplate:false,
            NetworkID:0,
            bid2:"",
            list_deviceModels:[],
            checked_deviceModels:[], //机型默认选中
            list_Interests:[],
            checked_Interests:[],
            defaultProps: { //tree控件配置
                children: 'list',
                label: 'name'
            },
            pkgName:"",
            objective:"",
            list_delivery:[],deliveryID:"",
            url:"",
            tracking:"",
            list_Format:[],FormatID:"",
            exist_campaign:1, //查询campaign的时候用来控制是否可修改
            exist:"", //检验模板名是否存在
            list_account:[],accountID:"",
            clientID:"", //第三方账号
            credentialID:"", //第三方账号
            email:"", //第三方账号

            checkDate:true,
            //NDSP
            list_city:[],cityID:[],
            list_model:[
                {
                    id:3,
                    name:"CPC"
                },
                {
                    id:4,
                    name:"CPM"
                }
            ],
            modelID:"",
            bid:"",
            TotalBudget:"",TotalBudget2:"", //左是ndsp，右是猎豹
            DaliyBudget:"",DaliyBudget2:"",
            date:[],
            list_APPIndex:[
                {
                    id:1,
                    name:"Include APP"
                },
                {
                    id:2,
                    name:"Exclude APP"
                }
            ],
            Include_apps:[], //包含的APP
            Exclude_apps:[], //屏蔽的APP
            APPIndex:"",
            list_apps:[],APP:"",
            list_iab1:[], //获取iab1下拉菜单
            list_iab2_1:[], //iab2下拉列表，第1个
            list_iab2_2:[], //iab2下拉列表，第2个
            list_iab2_3:[], //iab2下拉列表，第3个
            list_iab2_4:[], //iab2下拉列表，第4个
            list_iab2_5:[], //iab2下拉列表，第5个
            list_iab2_6:[], //iab2下拉列表，第6个
            iab1_1:"", //iab1
            iab2_1:"", //iab2
            iab1_2:"", //iab1
            iab2_2:"", //iab2
            iab1_3:"", //iab1
            iab2_3:"", //iab2
            iab1_4:"", //iab1
            iab2_4:"", //iab2
            iab1_5:"", //iab1
            iab2_5:"", //iab2
            iab1_6:"", //iab1
            iab2_6:"", //iab2
            iabShow:1, //用来判断iab要显示第几个

            //时间投放插件
            planHour:[],
            planDay:[],
            selectHour:[],
            selectDay:[],
            hourJson: //传给后台的数据
            {
                '1':[],
                '2':[],
                '3':[],
                '4':[],
                '5':[],
                '6':[],
                '7':[]
            },

            //其他
            list_mediabuyer:[],mediabuyerID:"",
            check_bid:false, //NDSO,bid如果是日预算和总预算之间，就返回true
            check_budget:false, //NDSP,总预算必须大于日预算
            check_bid2:false, //猎豹，bid如果是日预算和总预算之间，就返回true
            check_budget2:false, //猎豹，总预算必须大于日预算
            showhide:true, //控制Ad Scheduling和Impression Tracking显示隐藏
        }
    },
    created:function(){
        //读取localStorage
        var storage = window.localStorage;
        this.permission = storage.getItem("ifshow");
    },
    mounted:function(){
        axios.get('/adSquad/create')
        .then( res =>{
            //公共
            this.list_target = res.data.data.target;
            this.list_language = res.data.data.languages; //语言
            this.list_country = res.data.data.countrys; //国家
            this.list_OS = res.data.data.os; //OS
            this.temp_os = res.data.data.os; //临时存储os，主要解决选中猎豹在切换回去后数据不显示的问题
        })
        //时间投放插件
        for(var i=1;i<=7;i++){
            for(var j=0;j<24;j++){
                this.planHour.push(i+'-'+j);
                this.selectHour.push(i+'-'+j);
            }
        }
        for(var i=0;i<24;i++){
                this.planDay.push(i);
                this.selectDay.push(i);
        }
		this.hourJson= {'1':[],
			 '2':[],
			 '3':[],
			 '4':[],
			 '5':[],
			 '6':[],
			 '7':[]};
		for(var i=0;i<this.selectHour.length;i++) {
			var dayHour = this.selectHour[i].split('-');
			this.hourJson[dayHour[0]].push(parseInt(dayHour[1]));
		}
    },
    methods:{
        onDateChangeListener: function () {
          var timestamp = Date.parse(new Date());
          if (this.date[1] - timestamp > 3600 * 1000) {
            this.checkDate=false;
          }else {
            this.checkDate=true;
          }
        },
        //猎豹，初始化添加
        cheetah_initialize:function(){
            axios.get('/adSquad/create')
            .then( res =>{
                this.list_objective = res.data.data.objective; //objective
                this.list_appType = res.data.data.appType; //游戏or应用？
                this.list_landPage = res.data.data.landingPage;
                this.list_gender = res.data.data.gender; //性别
                this.list_age = res.data.data.age; //年龄
                this.list_deviceModels = res.data.data.cheetahDevice; //机型
                this.list_Interests = res.data.data.interest; //兴趣爱好
                this.list_delivery = res.data.data.deliveryType; //交易类型
                this.list_Format = res.data.data.appShowType; //AD格式
                //模板
                if(res.data.data.template != null){
                    this.list_template = res.data.data.template;
                }
            })
        },
        //ndsp，初始化
        ndsp_initialize:function(){
            //debugger
            axios.get('/adSquad/create')
            .then( res =>{
                this.list_iab1 = res.data.data.iab1list; //IAB
                this.list_device = res.data.data.devices; //设备
            })
        },

        //objective改变时，如果为1，landPage不可修改
        change_landPage:function(){
            if(this.objectiveID == 1){
                this.landPageID = 1;
            }
            else if(this.objectiveID == 3 || this.objectiveID == 5){
                this.list_model = [
                    {
                        id:4,

                        name:"CPM"
                    }
                ]
            }
            else{
                this.list_model = [
                    {
                        id:3,
                        name:"CPC"
                    },
                    {
                        id:4,
                        name:"CPM"
                    }
                ]
            }
        },

        //campaign改变事件
        change_campaign:function(){
            //如果是猎豹才加载数据
            if(this.targetID == 1){
                if(this.campaignID != ""){
                    //加载账号下拉
                    this.load_account();

                    //自动填充值
                    axios.get('/adSquad/findByCampaignId',{
                        params:{
                            id:this.campaignID
                        }
                    })
                    .then(res=>{
                        //如果有数据
                        if(res.data.data){
                            this.exist_campaign = 0; //0为不可修改
                            this.status = res.data.status;
                            this.objectiveID = res.data.data.objective;
                            this.app = res.data.data.pkgName;
                            this.appTypeID = res.data.data.appType;
                            this.landPageID = res.data.data.landingPage;
                        }
                        else{
                            this.exist_campaign = 1; //1为可以修改
                            this.objectiveID = "";
                            this.app = "";
                            this.appTypeID = "";
                            this.landPageID = "";
                        }
                    })
                }
            }
        },

        //用来ndsp检验bid
        check_between:function(){
            var bidInt = parseInt(this.bid);
            var dailyBudget = parseInt(this.DaliyBudget);
            var totalBudget = parseInt(this.TotalBudget);
            if(isNaN(dailyBudget)||isNaN(bidInt)) {
                return;
            }
            if(bidInt<dailyBudget){
                this.check_bid = false;
            } else{
                this.check_bid = true;
                $('#bid').focus();

            }
            if(isNaN(totalBudget)||isNaN(dailyBudget)) {
                return;
            }
            if(totalBudget<dailyBudget) {
                //提示错误
                this.check_budget = true;
                $('#totalBudget').focus();
            } else {
                this.check_budget = false;
            }
        },

        //用来猎豹检验bid
        check_between2:function(){
            var bidInt = parseInt(this.bid2);
            var dailyBudget = parseInt(this.DaliyBudget2);
            var totalBudget = parseInt(this.TotalBudget2);
            if(isNaN(dailyBudget)||isNaN(bidInt)) {
                return;
            }
            if(bidInt<dailyBudget){
                this.check_bid2 = false;
            } else{
                this.check_bid2 = true;
                $('#bid2').focus();

            }
            if(isNaN(totalBudget)||isNaN(dailyBudget)) {
                return;
            }
            if(totalBudget<dailyBudget) {
                //提示错误
                this.check_budget2 = true;
                $('#totalBudget2').focus();
            } else {
                this.check_budget2 = false;
            }
        },

        //str数组转为int数组
        strToint:function(strArray){
            var intArray = new Array();
            for(var i=0;i<strArray.length;i++) {
                intArray.push(parseInt(strArray[i]));
            }
            return intArray;
        },

        //加载账号
        load_account:function(){
            this.list_account = []; //清空第三方账号
            axios.get('/targetAccount/select2',{
                params:{
                    tbCampaignId:this.campaignID,
                    targetPlatform:this.targetID, //dsp没有账号，只有猎豹有
                    status:1
                }
            })
            .then(res=>{
                //如果没账号提示要新建账号
                if(res.data.data.length == 0){
                    this.list_account = [];
                    $('#myModal_account').modal('toggle');
                    //非mb角色需要加载mb下拉
                    if(this.ifshow('adSquad:mediabuy')){
                        axios.get('/mediaBuy/select2')
                        .then(res=>{
                            this.list_mediabuyer = res.data.data;
                        })
                    }
                }
                else{
                    this.list_account = res.data.data;
                }
            })
        },

        //创建第三方账号
        new_account:function(){
            axios.post('/targetAccount/add',{
                clientId:this.clientID,
                clientSecret:this.credentialID,
                email:this.email,
                status:1,
                targetPlatform:this.targetID,
                tbMediaBuyId:this.mediabuyerID,
            })
            .then(res=>{
                if (res.data.status == 1){
                    this.$message({
                        message: this.$t("m.Msg.New_success"),
                        type: 'success',
                        duration: 1800
                    });
                    this.load_account(); //加载账号
                }
                else{
                    this.$message({
                    message: this.$t("m.Msg.Failed"),
                        type: 'error',
                        duration: 1800
                    });
                }
            })
        },

        //模板改变事件
        change_template:function(){
            axios.get('/audience/findById',{
                params:{
                    id:this.templateID
                }
            })
            .then(res=>{
                this.languageID2 = res.data.data.languages; //语言
                this.countryID = res.data.data.countryAlpha2Codes.split(','); //国家
                this.genderID = res.data.data.gender; //性别
                this.ageID = res.data.data.age; //年龄
                this.NetworkID = res.data.data.netType; //网络类型
                this.OSID = res.data.data.devices[0].os; //因为是单选的，所以只有[0]有数据
                this.versionID1 = res.data.data.devices[0].osVersion.split('-')[0];
                this.versionID2 = res.data.data.devices[0].osVersion.split('-')[1];
                //兴趣
                var interests = this.strToint(res.data.data.interest);
                this.$refs.tree_Interests.setCheckedKeys(interests);
                //机型
                var deviceBran = this.strToint(res.data.data.deviceBrandModel);
                this.$refs.tree_deviceModels.setCheckedKeys(deviceBran);
                //加载版本号
                // this.load_version(this.get_osID(this.OSID));
            })
        },

        //加载campaign
        load_campaign:function(query){
            if(query!=""){
                setTimeout(() => {
                    axios.get('/campaign/select2',{
                        params:{
                            keyword:query
                        }
                    })
                    .then( res =>{
                        this.list_campaign = res.data.data;
                    })
                },1000);
            }
            else{
                this.list_campaign = [];
            }
        },

        //跳转到创建campaign
        toCampaign:function(){
            this.$router.push({path:"/NewCampaign"});
        },

        //加载版本号
        load_version:function(id){
            axios.get('/option/select2OsVersion',{
                params:{
                    os:id
                }
            })
            .then( res =>{
                if( res.data.status == 1){
                    this.list_version = res.data.data;
                }
            })
        },

        //模板名是否存在
        exist_template:function(){
            axios.get('/audience/findByName',{
                params:{
                    name:this.template_name
                }
            })
            .then( res =>{
                //如果已存在
                if(res.data.status == 0){
                    this.exist = "SB";
                }
                else{
                    this.exist = "";
                }
            })
        },

        //根据os name获取对应id函数
        get_osID:function(name){
            var sel_osID = "";
            for(var i=0;i<this.list_OS.length;i++){
                if(name == this.list_OS[i].name){
                    sel_osID = this.list_OS[i].id;
                }
            }
            return sel_osID;
        },

        //OS改变时，加载版本号
        change_loadVersion:function(os){
            this.load_version(this.get_osID(this.OSID));
        },

        //国家改变时，加载州
        change_loadregion:function(){
            if(this.countryID.length == 0){
                this.list_region = [];
                this.regionID = [];
                this.list_city = [];
                this.cityID = [];
            }
            else{
                var countryCodes=this.countryID;
                if (this.isContain('UN',this.countryID)){
                  countryCodes=['UN'];
                }

                //州
                axios.get('/option/select2Region',{
                    params:{
                        countryCodes:countryCodes.join(',')
                    }
                })
                .then( res =>{
                    this.list_region = res.data.data;
                })

                //运营商
                axios.get('/option/select2Carrier',{
                    params:{
                        countryCodes:countryCodes.join(',')
                    }
                })
                .then( res =>{
                    this.list_carriers = res.data.data;
                })

            }
        },

        //州改变时，加载城市
        change_loadcity:function(){
            //如果国家、州为空
            if(this.regionID.length == 0 & this.countryID.length == 0){
                this.list_region = [];
                this.regionID = [];
                this.list_city = [];
                this.cityID = [];
            }
            //如果州为空
            else if(this.regionID.length == 0){
                this.list_city = [];
                this.cityID = [];
            }
            else{
                var toString = this.regionID.join(','); //转字符串
                axios.get('/option/select2City',{
                    params:{
                        regionCodes:toString
                    }
                })
                .then( res =>{
                    this.list_city = res.data.data;
                })
            }
        },

        //加载APP
        change_loadApps:function(){
            if(this.APPIndex){
                axios.get('/option/select2App')
                .then( res =>{
                    this.list_apps = res.data.data;
                })
            }
            else{
                this.APP = [];
            }

        },

        //返回
        toadSquad:function(){
            this.$router.push({path:"/adSquad"});
        },

        //跳到创建campaign页面
        newCampaign:function(){
            this.$router.push({path:"/newCampaign"});
        },

        //判断是否有权限
        ifshow:function(per){
            if(this.permission.indexOf(per)>0){
                return true;
            }else{
                return false;
            }
        },

        //获取iab2数据,第一个
        loadIAB2_1:function(){
            axios.get('/option/select2Iab2',{
                params:{
                    iab1:this.iab1_1
                }
            })
            .then( res =>{
                if( res.data.status == 1){
                    this.list_iab2_1 = res.data.data;
                }
            })
        },

        //获取iab2数据,第二个
        loadIAB2_2:function(){
            axios.get('/option/select2Iab2',{
                params:{
                    iab1:this.iab1_2
                }
            })
            .then( res =>{
                if( res.data.status == 1){
                    this.list_iab2_2 = res.data.data;
                }
            })
        },

        //获取iab2数据,第三个
        loadIAB2_3:function(){
            axios.get('/option/select2Iab2',{
                params:{
                    iab1:this.iab1_3
                }
            })
            .then( res =>{
                if( res.data.status == 1){
                    this.list_iab2_3 = res.data.data;
                }
            })
        },

        //获取iab2数据,第四个
        loadIAB2_4:function(){
            axios.get('/option/select2Iab2',{
                params:{
                    iab1:this.iab1_4
                }
            })
            .then( res =>{
                if( res.data.status == 1){
                    this.list_iab2_4 = res.data.data;
                }
            })
        },

        //获取iab2数据,第五个
        loadIAB2_5:function(){
            axios.get('/option/select2Iab2',{
                params:{
                    iab1:this.iab1_5
                }
            })
            .then( res =>{
                if( res.data.status == 1){
                    this.list_iab2_5 = res.data.data;
                }
            })
        },

        //获取iab2数据,第六个
        loadIAB2_6:function(){
            axios.get('/option/select2Iab2',{
                params:{
                    iab1:this.iab1_6
                }
            })
            .then( res =>{
                if( res.data.status == 1){
                    this.list_iab2_6 = res.data.data;
                }
            })
        },

        //最多显示6个，超出提示
        iabMax:function(){
            if(this.iabShow == 6){
                    this.$message({
                        message: 'No more than 6',
                        type: 'error',
                        duration:1800
                    });
            }
            else{
                this.iabShow = this.iabShow + 1;
            }
        },

        //时间投放插件
        getPlanHourSpan:function(n,index){
            $(".planDate span").eq(index).toggleClass("active");  //样式
            if(!$(".planDate span").eq(index).hasClass('active')) {
                //选中
                var flag = false;
                for(var i=0;i<this.selectHour.length;i++) {
                    if(this.selectHour[i] == n) {
                        flag = true;
                    }
                }
                if(!flag) {
                    this.selectHour.push(n);
                }
				var hourFlag = true;
				var hour = index%24 +'';
				for(var j=1;j<=7;j++) {
					if($('#'+j+'-'+hour).hasClass("active")) {
						hourFlag = false;
					}
				}
				if(hourFlag) {
					$('#day-'+ hour).removeClass("active");
				}
            } else {
                //未选中
                for(var i=0;i<this.selectHour.length;i++) {
                    if(this.selectHour[i] == n) {
                       this.selectHour.splice(i,1);
                    }
                }
                var hour = index%24 +'';
                if(!$('#day-'+ hour).hasClass('active')) {
					$('#day-'+ hour).addClass("active");
                }
            }
            this.hourJson= {'1':[],
                 '2':[],
                 '3':[],
                 '4':[],
                 '5':[],
                 '6':[],
                 '7':[]};
            for(var i=0;i<this.selectHour.length;i++) {
                var dayHour = this.selectHour[i].split('-');
                this.hourJson[dayHour[0]].push(parseInt(dayHour[1]));
            }
        },
        getPlanDaySpan:function(n,index) {
            $('#day-'+n).toggleClass("active");  //样式
            if($('#day-'+n).hasClass('active')) {// 不选中
                for(var i=1;i<=7;i++) {
					var hour_day = i+'-'+n;
                    $('#'+hour_day).addClass("active");  //样式
					for(var j=0;j<this.selectHour.length;j++) {
	                    if(this.selectHour[j] == hour_day) {
	                       this.selectHour.splice(j,1);
	                    }
	                }
                }
            } else {
                for(var i=1;i<=7;i++) {
					var hour_day = i+'-'+n;
                    $('#'+hour_day).removeClass("active");  //样式
					var flag = false;
	                for(var j=0;j<this.selectHour.length;j++) {
	                    if(this.selectHour[j] == hour_day) {
	                        flag = true;
	                    }
	                }
	                if(!flag) {
	                    this.selectHour.push(hour_day);
	                }
                }
            }
			this.hourJson= {'1':[],
                 '2':[],
                 '3':[],
                 '4':[],
                 '5':[],
                 '6':[],
                 '7':[]};
            for(var i=0;i<this.selectHour.length;i++) {
                var dayHour = this.selectHour[i].split('-');
                this.hourJson[dayHour[0]].push(parseInt(dayHour[1]));
            }
        },

        //判断是猎豹还是ndsp
        change_target:function(){
            //如果是猎豹
            if(this.targetID == 1){
                //加载一次就行了
                if(this.list_age.length == 0){
                    this.cheetah_initialize();
                }
                //加载第三方账号
                if(this.accountID == ""){
                    //如果有campaign才加载账号
                    if(this.campaignID != ""){
                        this.load_account();
                    }
                }
                //自动填充值
                axios.get('/adSquad/findByCampaignId',{
                    params:{
                        id:this.campaignID
                    }
                })
                .then(res=>{
                    //如果有数据
                    if(res.data.data){
                        this.exist_campaign = 0; //0为不可修改
                        this.status = res.data.status;
                        this.objectiveID = res.data.data.objective;
                        this.app = res.data.data.pkgName;
                        this.appTypeID = res.data.data.appType;
                        this.landPageID = res.data.data.landingPage;
                    }
                    else{
                        this.exist_campaign = 1; //1为可以修改
                        this.objectiveID = "";
                        this.app = "";
                        this.appTypeID = "";
                        this.landPageID = "";
                    }
                })
                //猎豹os只有安卓
                this.list_OS = [
                    {
                        id:1,
                        name:"Android"
                    }
                ]
            }
            else if(this.targetID == 0){
                //加载一次就行了
                if(this.list_device.length == 0){
                    this.ndsp_initialize();
                }
                this.list_OS = this.temp_os;
            }
        },

        //判断数组是否包含某个元素
        isContain: function (value, arr) {
          var i = arr.length;
          while (i--) {
            if (arr[i] === value) {
              return true;
            }
          }
          return false;
        },

        //提交
        new_submit:function(){
            this.$validator.validateAll().then((result) => {
                if (result) {
                    //如果模板名不重复
                    if(this.exist == ""){
                        if (this.isContain('UN',this.countryID)){
                          this.countryID=['UN'];
                        }
                         //去掉投放时间空数组
                        for(var i=1;i<=7;i++){
                            if(this.hourJson[i]==null||this.hourJson[i].length == 0){
                                delete this.hourJson[i];
                            }
                        }
                        //devices
                        var devices = [];
                        if (this.isContain(0,this.deviceID)){
                          this.deviceID=[0];
                        }
                        for(var i=0;i<this.deviceID.length;i++){
                            devices.push({
                                'deviceType':this.deviceID[i],
                                'os':this.OSID,
                                'osVersion':this.versionID1 + '-' + this.versionID2
                            })
                        }
                        //regions
                        var regions = [];
                        for(var i=0;i<this.regionID.length;i++){
                            regions.push({
                                'tbAdSquadId':'',
                                'countryAlpha3Code':'',
                                'regionCode':this.regionID[i]
                            })
                        }
                        //citys
                        var citys = [];
                        for(var i=0;i<this.cityID.length;i++){
                            citys.push({
                                'tbAdSquadId':'',
                                'countryAlpha3Code':'',
                                'regionCode':'',
                                'cityName':this.cityID[i]
                            })
                        }
                        //运营商
                        var carriers = [];
                        for(var i=0;i<this.carriersID.length;i++){
                            carriers.push({
                                'tbAdSquadId':'',
                                'countryAlpha3Code':'',
                                'carrierName':this.carriersID[i]
                            })
                        }
                        //iab2数组转字符串
                        var iab2_result = [];
                        for(var i=1;i<=6;i++){
                            if(this['iab2_' + i] != ""){
                                iab2_result.push(this['iab2_' + i]);
                            }
                        }
                        iab2_result = iab2_result.join(',');
                        //判断用户选的是包含APP还是屏蔽APP
                        var Exclude_apps = [];
                        var Include_apps = [];
                        if(this.APPIndex == ""){
                            Exclude_apps = [];
                            Include_apps = [];
                        }
                        else if(this.APPIndex == 1){  //包含APP
                            Include_apps = this.APP;
                            Exclude_apps = [];
                        }
                        else if(this.APPIndex == 2){  //屏蔽APP
                            Exclude_apps = this.APP;
                            Include_apps = [];
                        }
                        if (this.checkDate){
                          this.$message({
                            message: "The time should be one hour greater than the current time",
                            type: 'error',
                            duration: 1800
                          });
                          return;
                        }
                        //如果是NDSP
                        if(this.targetID == 0){
                            //如果bid、日预算、总预算符合规则
                            if(!this.check_bid && !this.check_budget){
                                axios.post('/adSquad/add',{
                                    //*********** 公共 ***********//
                                    targetPlatform:this.targetID,  //目标平台，0:NDSP,1:orion,2:facebook
                                    name:this.name, //名字
                                    status:this.status, //状态
                                    tbCampaignId:this.campaignID, //campaignID
                                    devices:devices, //已经包含了设备类型、os、版本号这些字段了
                                    languages:this.languageID.join(','), //语言
                                    countryAlpha2Codes:this.countryID.join(','), //国家
                                    regions:regions, //州
                                    citys:citys, //城市
                                    carriers:carriers , //运营商
                                    priceModel:this.modelID, //PCM、CPA？
                                    startTime:this.date[0]/1000, //开始时间
                                    endTime:this.date[1]/1000, //结束时间
                                    adScheduling:JSON.stringify(this.hourJson), //投放时间
                                    bidPrice:this.bid,
                                    budgetOverall:this.TotalBudget, //总预算
                                    budgetDaily:this.DaliyBudget, //日预算

                                    //*********** NDSP ***********//
                                    bidPercent:this.bidp, //默认80
                                    tbIabIds:iab2_result, //IAB
                                    excludeApps:Exclude_apps, //屏蔽APP
                                    includeApps:Include_apps, //包含APP

                                    //*********** 猎豹 ***********//
                                    objective:0,
                                    pkgName:"",
                                    appType:0,
                                    landingPage:0,
                                    targetCpi:0,
                                    netType:0,
                                    gender:0,
                                    age:0,
                                    interest:"",
                                    audienceCreateWay:0,
                                    audienceTemplateId:"",
                                    audienceName:"",
                                    audienceDesc:"",
                                    audienceDataType:0,
                                    audienceFile:"",
                                    deliveryType:0,
                                    appShowType:0,
                                    impUrl:"",
                                    clickUrl:"",
                                    deviceBrandModel:"",
                                    saveTemplete:false,
                                    tbTargetAccountId:0,
                                })
                                .then(res=>{
                                    if(res.data.status == 1){
                                        this.$message({
                                            message: this.$t("m.Msg.New_success"),
                                            type: 'success',
                                            duration:1800
                                        });
                                        setTimeout(()=>{
                                            this.$router.push({path:"/adSquad"});
                                        },1850)
                                    }
                                    else
                                    {
                                        this.$message({
                                            message: this.$t("m.Msg.Failed"),
                                            type: 'error',
                                            duration:1800
                                        });
                                    }
                                })
                            }
                        }
                        //如果是猎豹
                        else if(this.targetID == 1){
                            //dsp有deviceID，猎豹没有，所以这里做了特殊处理
                            devices.push({
                                'deviceType':0,
                                'os':this.OSID,
                                'osVersion':this.versionID1 + '-' + this.versionID2
                            })
                            //appType为空则传0
                            var appType = 0;
                            if(this.appTypeID){
                                appType = this.appTypeID;
                            }
                            //pkgName为空则传0
                            var pkgName = 0;
                            if(this.app){
                                pkgName = this.app;
                            }
                            //如果bid、日预算、总预算符合规则
                            if(!this.check_bid2 && !this.check_budget2){
                                axios.post('/adSquad/add',{
                                    //*********** 公共 ***********//
                                    targetPlatform:this.targetID,  //目标平台，0:NDSP,1:orion,2:facebook
                                    name:this.name, //名字
                                    status:this.status, //状态
                                    tbCampaignId:this.campaignID, //campaignID
                                    devices:devices, //已经包含了设备类型、os、版本号这些字段了
                                    //languages:this.languageID.join(','), //语言
                                    countryAlpha2Codes:this.countryID.join(','), //国家
                                    regions:regions, //州
                                    citys:citys, //城市
                                    carriers:carriers , //运营商
                                    priceModel:this.modelID, //PCM、CPA？
                                    budgetOverall:this.TotalBudget, //总预算
                                    budgetDaily:this.DaliyBudget, //日预算
                                    startTime:this.date[0]/1000, //开始时间
                                    endTime:this.date[1]/1000, //结束时间
                                    adScheduling:JSON.stringify(this.hourJson), //投放时间
                                    bidPrice:this.bid2,
                                    budgetOverall:this.TotalBudget2, //总预算
                                    budgetDaily:this.DaliyBudget2, //日预算

                                    //*********** NDSP ***********//
                                    bidPercent:0, //默认80
                                    tbIabIds:"", //IAB

                                    //*********** 猎豹 ***********//
                                    objective:this.objectiveID,
                                    pkgName:pkgName,
                                    appType:appType,
                                    landingPage:this.landPageID,
                                    targetCpi:0, //原型找不到，暂时设0
                                    netType:this.NetworkID,
                                    gender:this.genderID,
                                    age:this.ageID,
                                    interest:this.$refs.tree_Interests.getCheckedKeys().join(','), //兴趣
                                    audienceCreateWay:0, //原型找不到，暂时设0
                                    audienceTemplateId:"", //原型找不到，暂时设0
                                    audienceName:this.template_name,
                                    audienceDesc:"", //原型找不到，暂时设0
                                    audienceDataType:0, //原型找不到，暂时设0
                                    audienceFile:"", //原型找不到，暂时设0
                                    deliveryType:this.deliveryID, //产品要求不需要必选，后端要求必选
                                    appShowType:this.FormatID,
                                    impUrl:this.tracking,
                                    clickUrl:this.url,
                                    deviceBrandModel:this.$refs.tree_deviceModels.getCheckedKeys().join(','), //机型
                                    saveTemplete:this.ifTemplate, //是否保存模板
                                    description:"", //描述
                                    languages:this.languageID2,
                                    tbTargetAccountId:this.accountID,
                                })
                                .then(res=>{
                                    if(res.data.status == 1){
                                        this.$message({
                                            message: this.$t("m.Msg.New_success"),
                                            type: 'success',
                                            duration:1800
                                        });
                                        setTimeout(()=>{
                                            this.$router.push({path:"/adSquad"});
                                        },1850)
                                    }
                                    else
                                    {
                                        this.$message({
                                            message: this.$t("m.Msg.Failed"),
                                            type: 'error',
                                            duration:1800
                                        });
                                    }
                                })
                            }
                        }
                    }
                }
            })
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .ibox-title h5{
        line-height: 16px;
    }
    .float-e-margins .btn{
        margin-bottom: 0;
    }
    /* 弹出框按钮对齐 */
    .float-e-margins .btn{
        margin-bottom: 5px!important;
    }

    /* 面包屑 */
    .page-heading{
        margin-top: -20px;
        margin-left: -25px;
        margin-right: -25px;
        margin-bottom: 20px;
    }

    /* 开关 */
    .switch{
        margin-top: 6px;
    }

    /* 减号按钮 */
    .bootstrap-touchspin-up{
        width: 40px;
        height: 40px;
    }

    /* 投放时间 */
    .time_left{
		float: left;
		width: 72px;
		text-align: right;
		margin-right: 4px;
	}
	.time_left dd{
		margin-bottom: 5.4px;
	}
	.EveryDay{
		color: #666;
		margin-top: 10px;
		margin-right: 4px;
		font-weight: bold;
	}
    .planDate{
    	float: left;
        width: 480px;
    }
    .planDate span{
        float: left;
        display: block;
        font-size: 0;
        width: 20px;
        height: 25px;
        background-color: #5290f2;
        border-top: 1px solid #eee;
        border-right: 1px solid #eee;
        cursor: pointer;
    }
    .planDate .active{
        background-color: #f6f7f9;
    }
	.m_time i{
		margin-right: 20px;
	}
	.state{
		margin-top: 10px;
		margin-left: 76px;
	}
	.state span{
		float: left;
		width: 15px;
		height: 15px;
		background-color: #5290f2;
		margin-top: 2px;
	}
	.state p{
		float: left;
		margin-left: 4px;
		color: #666;
	}

    /* 机型溢出滚动 */
    .overAuto{
        max-height: 300px;
        overflow: auto;
    }

    /* 多选框高度 */
    .el-input__inner{
        height: 34px!important;
    }
</style>
