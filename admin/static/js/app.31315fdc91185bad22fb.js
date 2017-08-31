webpackJsonp([7,5],{0:function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.router=void 0;var r=n(3),a=i(r),o=n(294),s=i(o),l=n(228),u=i(l);n(242);var c=n(278),d=i(c),f=n(169),h=i(f);n(243),a.default.use(s.default),a.default.use(u.default);var p=t.router=new s.default({routes:h.default,mode:"hash",linkActiveClass:"active"});p.beforeEach(function(e,t,n){if(e.matched.some(function(e){return e.meta.requiresAuth})){var i=localStorage.getItem("user")||sessionStorage.getItem("user");if(!i)return n({path:"/login",query:{redirect:e.fullPath}})}n()}),window.$bus=new a.default({render:function(e){return e(d.default)},router:p}).$mount("#app")},36:function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function r(){localStorage.clear(),sessionStorage.clear()}function a(){try{t.user=u=JSON.parse(localStorage.getItem("user")||sessionStorage.getItem("user"))}catch(e){r()}t.user=u=u||{},u.name?(t.octo=c=new l.default({username:u.name,password:o.Base64.decode(u.password)}),t.repo=d=c.repos(u.name,"blog"),t.base=f=c.repos(u.name,window.location.host)):r()}Object.defineProperty(t,"__esModule",{value:!0}),t.getUser=t.user=t.base=t.repo=t.octo=void 0;var o=n(17),s=n(145),l=i(s),u={},c=null,d=null,f=null;t.octo=c,t.repo=d,t.base=f,t.user=u,t.getUser=a},119:function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(3),a=i(r),o=new a.default;t.default=o},169:function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(3),a=i(r),o=a.default.component("root",{template:"<router-view></router-view>"}),s=[{path:"/login",component:function(e){return n.e(3,function(t){var n=[t(283)];e.apply(null,n)}.bind(this))},name:"login",meta:{hidden:!0}},{path:"/",name:"Home",component:o,meta:{requiresAuth:!0},children:[{path:"_settings",iconClass:"el-icon-setting",name:"站点设置",component:o,children:[{path:"_basic",name:"基本设置",component:function(e){return n.e(2,function(t){var n=[t(285)];e.apply(null,n)}.bind(this))}},{path:"_about",name:"关于我",component:function(e){return n.e(0,function(t){var n=[t(284)];e.apply(null,n)}.bind(this))}}]},{path:"/",component:function(e){return n.e(1,function(t){var n=[t(282)];e.apply(null,n)}.bind(this))}},{path:"*",iconClass:"el-icon-document",type:"filelist"}]},{path:"/*",component:function(e){return n.e(4,function(t){var n=[t(280)];e.apply(null,n)}.bind(this))},name:"404",meta:{requiresAuth:!0}}],l=s.length;s[l-2].children.forEach(function(e){e.children&&(e.meta||(e.meta={}),e.meta.children=e.children)}),t.default=s},170:function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(281),a=i(r);t.default={data:function(){return{user:{name:"",avatar:""},globalClass:"",sideBarWidth:"16%",openSideBar:!0,activeMenu:""}},components:{Filelist:a.default},created:function(){this.activeMenu=this.$route.name,this.setUser(),this.$nextTick(this.initSidebar)},watch:{$route:function(e,t){this.activeMenu=this.$route.name,this.setUser()}},methods:{initSidebar:function(){var e=this,t=this.$refs.aside,n=this.$refs.resizer,i=t.offsetWidth,r={startX:0,endX:0,release:!0};this.sideBarWidth=i+"px",n.addEventListener("mousedown",function(t){r.release=!1,r.startX=t.clientX,e.globalClass="no-select"}),window.addEventListener("mousemove",function(t){r.release||(r.endX=t.clientX,e.sideBarWidth=i+(r.endX-r.startX)+"px")}),window.addEventListener("mouseup",function(t){r.release=!0,i=parseInt(e.sideBarWidth,10),e.globalClass=""})},setUser:function(){try{this.user=JSON.parse(localStorage.getItem("user")||sessionStorage.getItem("user"))||{}}catch(e){this.user={}}},gotoHome:function(){location.href="../"},logout:function(){var e=this;this.$confirm("确定要注销吗?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"info"}).then(function(){localStorage.removeItem("user"),e.$router.push({path:"/login"})}).catch(function(){})}}}},172:function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function r(e,t,n){for(var i=e.split("/"),r=n,a=0,o=i.length;a<o&&void 0!==r;a++){var s=i[a];a===o-1?r[s]=t:r=r[s]||{}}}function a(e,t){for(var n in e){var i=e[n],r=i._id,o=i._path,s=i._type,l=(0,u.default)(i,["_id","_path","_type"]),c={label:n,_id:r,_path:o,_type:s};for(var d in l){c.children=[],a(l,c.children);break}t.unshift(c)}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(48),s=i(o),l=n(178),u=i(l),c=n(36),d=n(119),f=i(d);t.default={data:function(){return{filterText:"",filelist:[],loading:!1,fileTree:[],branches:""}},watch:{filterText:function(e){this.$refs.filelist.filter(e)}},mounted:function(){var e=this;f.default.$on("updateFiles",function(){e.loading=!0,setTimeout(function(){e.fetchFiles()},1e3)})},created:function(){(0,c.getUser)(),this.fetchFiles()},methods:{filterNode:function(e,t){return!e||t.label.indexOf(e)!==-1&&t.label.endsWith(".md")},fetchFiles:function(){var e=this;if(c.octo)return this.loading=!0,new s.default(function(t){e.branches?t(e.branches):c.repo.fetch().then(function(n){var i=n.defaultBranch;e.branches=i,t(e.branches)})}).then(function(e){return c.repo.git.trees(e+"?recursive=1&rd="+Math.random()).fetch()}).then(function(e){return e.tree.filter(function(e){return 0===e.path.indexOf("_posts")||0===e.path.indexOf("media")})}).then(function(t){e.loading=!1,e.filelist=t;var n={};t.forEach(function(e){r(e.path,{_id:e.sha,_path:e.path,_type:e.type},n)});var i=[];a(n,i),i.forEach(function(e){"_posts"===e.label?e.label="我的文档":e.label="我的图片"}),e.fileTree=i}).catch(function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};e.loading=!1,e.$message.error(/"message": "([^"]+)/m.test(t.message)&&RegExp.$1||t.toString())})},removeFile:function(e){var t=this;return this.$confirm("是否要删除此文章？").then(function(){return t.loading=!0,c.repo.contents(e._path).remove({message:"remove file",sha:e.sha})}).then(function(){return t.loading=!1,t.fetchFiles()}).catch(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};t.loading=!1,t.$message.error(/"message": "([^"]+)/m.test(e.message)&&RegExp.$1||e.toString())})},editFile:function(e){"tree"!==e._type&&this.$router.push({path:"/",query:{path:e._path}})},renderContent:function(e,t){var n=t.node,i=(t.data,t.store,[e("span",{class:"flex-1"},n.label)]);return e("span",{class:"flex flex-1"},i)}}}},242:function(e,t){},243:function(e,t){},244:function(e,t){},248:function(e,t){},278:function(e,t,n){n(248);var i=n(8)(n(170),n(290),null,null);e.exports=i.exports},281:function(e,t,n){n(244);var i=n(8)(n(172),n(286),null,null);e.exports=i.exports},286:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("el-input",{attrs:{placeholder:"搜索我的文档"},model:{value:e.filterText,callback:function(t){e.filterText=t},expression:"filterText"}}),e._v(" "),n("el-tree",{directives:[{name:"loading",rawName:"v-loading.body",value:e.loading,expression:"loading",modifiers:{body:!0}}],ref:"filelist",attrs:{data:e.fileTree,"node-key":"_path","filter-node-method":e.filterNode,"render-content":e.renderContent,"default-expanded-keys":["_posts"]},on:{"node-click":e.editFile}})],1)},staticRenderFns:[]}},290:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("section",{staticClass:"admin"},[e.$route.meta.hidden?[n("router-view")]:[n("header",{staticClass:"admin-header"},[n("router-link",{staticClass:"logo",attrs:{to:{path:"/"}}},[e._v("极简博客后台管理")]),e._v(" "),e.user.name?n("div",{staticClass:"user-info"},[n("el-dropdown",{attrs:{trigger:"click"}},[n("span",{staticClass:"el-dropdown-link"},[n("span",[e._v(e._s(e.user.name))]),n("i",{staticClass:"el-icon-caret-bottom el-icon--right"})]),e._v(" "),n("el-dropdown-menu",{slot:"dropdown"},[n("el-dropdown-item",{nativeOn:{click:function(t){e.gotoHome(t)}}},[e._v("返回首页")]),e._v(" "),n("el-dropdown-item",{nativeOn:{click:function(t){e.logout(t)}}},[e._v("注销")])],1)],1)],1):e._e()],1),e._v(" "),n("div",{staticClass:"admin-body",class:e.globalClass},[n("aside",{ref:"aside",staticClass:"admin-menu-wrapper",style:{width:e.sideBarWidth}},[n("el-menu",{staticClass:"admin-menu-bar",attrs:{"default-active":e.activeMenu,router:""}},[e._l(e.$router.options.routes[e.$router.options.routes.length-2].children,function(t,i){return[t.children&&t.name?[n("el-submenu",{attrs:{index:t.name}},[n("template",{slot:"title"},[n("i",{class:t.iconClass}),e._v(e._s(t.name))]),e._v(" "),e._l(t.children,function(t,i){return n("el-menu-item",{key:t.name,attrs:{index:t.name,route:t}},[e._v(e._s(t.name))])})],2)]:e._e(),e._v(" "),!t.children&&t.name?[n("el-menu-item",{attrs:{index:t.name,route:t}},[n("i",{class:t.iconClass}),e._v(e._s(t.name))])]:e._e(),e._v(" "),"filelist"===t.type?[n("filelist")]:e._e()]})],2)],1),e._v(" "),n("div",{ref:"resizer",staticClass:"admin-content-resizer"}),e._v(" "),n("div",{staticClass:"admin-content-wrapper"},[n("section",{staticClass:"admin-content"},[n("router-view")],1)])])]],2)},staticRenderFns:[]}}});
//# sourceMappingURL=app.31315fdc91185bad22fb.js.map