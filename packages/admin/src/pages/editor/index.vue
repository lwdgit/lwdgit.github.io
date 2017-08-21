<template>
  <article v-loading.full="loading">
    <el-form>
      <el-row :gutter="12">
        <el-col :md="14">
          <el-input placeholder="请输入文章标题" v-model="title"></el-input>
        </el-col>
        <el-col :xs="12" :sm="16" :md="4">
          <el-input placeholder="保存目录, 可以为空" v-model="path"></el-input>
        </el-col>
        <el-col :xs="12" :sm="8" :md="6"><el-button type="primary" @click="save">保存</el-button><el-button @click="newPost">新建</el-button></el-col>
      </el-row>
    </el-form>
    <br />
    <mavon-editor v-model="content" class="content" :default_open="defaultOpen" @save="save" />
  </article>
</template>
<script>
import { Base64 } from 'js-base64';
import { mavonEditor } from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import { repo } from '../../api';

export default {
  data() {
    return {
      title: this.initTitle(),
      content: '',
      path: '',
      sha: '',
      loading: false,
      defaultOpen: window.innerWidth > 1100 ? 'preview' : 'edit'
    };
  },
  created() {
    this.fetchFile();
    window.onpagehide = window.onunload = window.onbeforeunload = () => {
      try {
        localStorage.setItem(this.sha, this.content);
      } catch (e) {}
    };
  },
  components: { mavonEditor },
  methods: {
    fetchFile() {
      if (!this.$route.query.path) return;
      this.loading = true;
      return repo.contents(this.$route.query.path)
      .fetch()
      .then(({ path, content, sha }) => {
        path = path.replace(/^_posts\//, '').split('/');
        this.title = path.pop();
        this.path = path.join('/') || '';
        this.sha = sha;
        if ((this.content = localStorage.getItem(this.sha))) {
          try {
            localStorage.removeItem(this.sha);
          } catch (e) {}
          this.$nextTick(() => {
            document.querySelector('.admin-body').scrollLeft = 1000;
          });
        } else {
          this.content = Base64.decode(content);
        }
        this.originContent = this.content;
        this.loading = false;
      })
      .catch((err = {}) => {
        this.loading = false;
        this.$message.error(/"message": "([^"]+)/m.test(err.message) && RegExp.$1 || err.toString());
      });
    },
    save() {
      if (!this.title) {
        this.$message.error('请输入文件名');
        return;
      }
      this.title = this.title.replace(/\.md$/, '') + '.md';
      let path = '_posts/' + (this.path ? this.path + '/' : '') + this.title;;
      const config = {
        path,
        message: 'update file: ' + path,
        content: Base64.encode(this.content)
      };
      if (this.sha) {
        config.sha = this.sha;
      } else {
        config.message = 'create file: ' + path;
      }
      this.loading = true;
      return repo.contents(path).add(config)
      .then(() => {
        this.loading = false;
        this.$router.replace({
          path: '/',
          query: {
            path,
            update: 'success'
          }
        });
        this.$message({
          type: 'success',
          message: '保存成功'
        });
        this.originContent = this.content;
      })
      .catch((err = {}) => {
        this.loading = false;
        this.$message.error(/"message": "([^"]+)/m.test(err.message) && RegExp.$1 || err.toString());
      });
    },
    pad(num) {
      return num > 9 ? num : '0' + num;
    },
    initTitle() {
      const now = new Date();
      return `${now.getFullYear()}-${this.pad(now.getMonth() + 1)}-${this.pad(now.getDate())}-我是标题`;
    },
    reset() {
      this.title = this.initTitle();
      this.content = '';
      this.originContent = '';
      this.path = '';
      this.sha = null;
    },
    newPost() {
      if (this.originContent !== this.content) {
        return this.$confirm('是否放弃原有文章？').then(this.reset);
      } else {
        this.reset();
      }
    }
  },
  watch: {
    '$route.query'(val) {
      this.fetchFile();
    }
  }
};
</script>
<style scoped>
article {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.content {
  z-index: 10;
  flex: 1;
  min-width: 100%;
  max-width: 100%;
}
</style>
<style>
.mu-item-wrapper .mu-item {
  min-height: auto;
}
</style>