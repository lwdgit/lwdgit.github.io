<template>
  <section class="admin">
    <template v-if="!$route.meta.hidden">
      <!-- header start  -->
      <header class="admin-header">
        <router-link class="logo" :to="{path: '/'}">极简博客后台管理</router-link>
        <div class="user-info" v-if="user.name">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <span>{{ user.name }}</span><i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="gotoHome">返回首页</el-dropdown-item>
              <el-dropdown-item @click.native="logout">注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </header>
      <!-- header end  -->

      <!-- body start  -->
      <div class="admin-body" :class="globalClass">

        <!-- menu start -->
        <aside class="admin-menu-wrapper" ref="aside" :style="{ width: sideBarWidth }">
          <el-menu :default-active="activeMenu" class="admin-menu-bar" router>
            <template v-for="(route, index) in $router.options.routes[$router.options.routes.length - 2].children">
              <template v-if="route.children && route.name">
                <el-submenu :index="route.name">
                  <template slot="title"><i :class="route.iconClass"></i>{{route.name}}</template>
                  <el-menu-item :index="cRoute.name" v-for="(cRoute, cIndex) in route.children" :route="cRoute" :key="cRoute.name">{{cRoute.name}}</el-menu-item>
                </el-submenu>
              </template>

              <template v-if="!route.children && route.name">
                <el-menu-item :index="route.name" :route="route"><i :class="route.iconClass"></i>{{route.name}}</el-menu-item>
              </template>
              <template v-if="route.type === 'filelist'">
                <filelist />
              </template>
            </template>
          </el-menu>
        </aside>
        <!-- menu end -->
        <div class="admin-content-resizer" ref="resizer"></div>
        <!-- content start -->
        <div class="admin-content-wrapper">
          <section class="admin-content">
            <router-view></router-view>
          </section>
        </div>
        <!-- content end -->
      </div>
      <!-- body end  -->
    </template>
    <template v-else>
      <router-view></router-view>
    </template>
  </section>
</template>

<script>
import Filelist from './pages/common/filelist';
export default {
  data() {
    return {
      user: {
        name: '',
        avatar: ''
      },
      globalClass: '',
      sideBarWidth: '16%',
      openSideBar: true,
      activeMenu: ''
    };
  },
  components: { Filelist },
  created() {
    this.activeMenu = this.$route.name;
    this.setUser();
    this.$nextTick(this.initSidebar);
  },
  watch: {
    '$route'(to, from) {
      this.activeMenu = this.$route.name;
      this.setUser();
    }
  },
  methods: {
    initSidebar() {
      const aside = this.$refs['aside'];
      const resizer = this.$refs['resizer'];
      let currentWidth = aside.offsetWidth;
      const position = {
        startX: 0,
        endX: 0,
        release: true
      };
      this.sideBarWidth = currentWidth + 'px';
      resizer.addEventListener('mousedown', (e) => {
        position.release = false;
        position.startX = e.clientX;
        this.globalClass = 'no-select';
      });
      window.addEventListener('mousemove', (e) => {
        if (position.release) return;
        position.endX = e.clientX;
        this.sideBarWidth = currentWidth + (position.endX - position.startX) + 'px';
      });
      window.addEventListener('mouseup', (e) => {
        position.release = true;
        currentWidth = parseInt(this.sideBarWidth, 10);
        this.globalClass = '';
      });
    },
    setUser() {
      try {
        this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user')) || {};
      } catch (e) {
        this.user = {};
      }
    },
    gotoHome() {
      location.href = '../';
    },
    logout() {
      this.$confirm('确定要注销吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        localStorage.removeItem('user');
        this.$router.push({ path: '/login' });
      }).catch(() => {});
    }
  }
};
</script>

<style lang="scss">
@import './styles/_variables.scss';
.el-message-box {
  max-width: 100%;
}
.no-select {
  user-select: none;
}
.admin {
  display: flex;
  flex-direction: column;
  height: 100%;
  .admin-header {
    width: 100%;
    height: 60px;
    background: #20A0FF;
    padding: 12px 20px;
    box-sizing: border-box;
    color: #ffffff;
    display: flex;
    align-items: center;

    .logo{
      font-size: 2.4rem;
      flex: 1;
    }
    .el-dropdown-link {
      color: #fff;
    }
  }

  // body
  .admin-body {
    // menu
    display: flex;
    flex: 1;
    width: 100%;
    overflow-x: auto;
    .admin-menu-wrapper {
      overflow: auto;
      min-width: 240px;
      width: 20%;
      display: flex;
      flex-direction: column;
      .admin-menu-bar {
        flex: 1;
        width: 100%;
        min-width: 240px;
        display: flex;
        flex-direction: column;
      }
    }

    .admin-content-resizer {
      min-width: 6px;
      cursor: col-resize;
    }

    // content
    .admin-content-wrapper {
      flex: 1;
      max-width: 100%;
      min-width: 320px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      .admin-content {
        padding: 16px;
        display: flex;
        flex-direction: column;
        max-width: 100%;
        box-sizing: border-box;
        flex: 1;
      }
    }
  }
}
</style>
