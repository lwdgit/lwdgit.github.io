<template>
  <article v-loading.full="loading">
    <el-form label-width="50px">
      <el-row :gutter="12">
        <el-col :md="12">
          <el-input placeholder="请输入文章标题" v-model="title" :size="size"></el-input>
        </el-col>
        <el-col :xs="24" :sm="14" :md="4">
          <el-input placeholder="保存目录, 可以为空" v-model="path" :size="size"></el-input>
        </el-col>
        <el-col :xs="24" :sm="10" :md="8">
          <el-button type="primary" @click="save" :size="size">保存</el-button>
          <el-button @click="newPost" icon="plus" :size="size"></el-button>
          <el-button type="danger" icon="delete" @click="removeFile" :size="size"></el-button>
        </el-col>
        <el-col v-if="rawContent">
          <el-input readonly v-model="downloadUrl" ref="copyText" :size="size">
            <template slot="append"><el-button @click="copy" :size="size">复制</el-button></template>
          </el-input>
        </el-col>
      </el-row>
    </el-form>
    <mavon-editor v-show="isMarkdown()" v-model="content" class="content" :default_open="defaultOpen" @save="save" @imgAdd="imgAdd" :toolbars="toolbars" ref="editor" />
    <img v-show="!isMarkdown()" class="attachment" :src="rawContent" />
  </article>
</template>
<script>
import { Base64 } from 'js-base64';
import { mavonEditor } from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import { repo } from '../../api';
import EventBus from '../../event-bus';
import ImageCompressor from 'image-compressor';

export default {
  data() {
    return {
      title: this.initTitle(),
      content: '',
      path: '',
      rawContent: '',
      sha: '',
      downloadUrl: '',
      loading: false,
      defaultOpen: window.innerWidth > 1100 ? 'preview' : 'edit',
      size: window.innerWidth > 1100 ? 'large' : 'small',
      toolbars: window.innerWidth > 1100 ? undefined : {
        bold: true,
        italic: true,
        header: true,
        mark: true,
        undo: true,
        redo: true,
        code: true,
        quote: true,
        fullscreen: true,
        imagelink: true,
        preview: true,
        readmodel: true,
        save: true
      }
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
    getTime(time) {
      const date = new Date(time);
      return `${date.getFullYear()}${this.pad(date.getMonth() + 1)}${this.pad(date.getDate())}${this.pad(date.getHours())}${this.pad(date.getMinutes())}${this.pad(date.getMilliseconds())}`;
    },
    isMarkdown(path = this.title) {
      return /\.md$/.test(path) || path.trim() === '';
    },
    fetchFile() {
      if (!this.$route.query.path) return;
      this.loading = true;
      this.rawContent = '';
      repo.contents(this.$route.query.path + '?rd=' + Math.random())
      .fetch()
      .then(({ path, content, sha, name, downloadUrl }) => {
        path = path.split('/');
        this.title = path.pop();
        this.path = path.join('/') || '';
        this.sha = sha;
        if (this.isMarkdown(name)) {
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
        } else {
          this.rawContent = downloadUrl; // 'data:image/png;base64,' + content;
          this.content = content;
        }
        this.downloadUrl = downloadUrl;
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
      if (!/^(_posts|media)/.test(this.path)) {
        this.path = ('_posts/' + this.path.replace(/(^\/)/, '')).replace(/(\/$)/g, '');
      }
      let path = this.path + '/' + this.title;
      const config = {
        path,
        message: 'update file: ' + path,
        content: this.rawContent ? this.content : Base64.encode(this.content)
      };
      if (this.sha) {
        config.sha = this.sha;
      } else {
        config.message = 'create file: ' + path;
      }
      this.loading = true;
      return this.upload(config)
      .then(() => {
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
    upload(config) {
      return repo.contents(config.path).add(config)
      .then((response) => {
        this.loading = false;
        EventBus.$emit('updateFiles');
        return response;
      });
    },
    pad(num) {
      return num > 9 ? num : '0' + num;
    },
    initTitle() {
      const now = new Date();
      return `${now.getFullYear()}-${this.pad(now.getMonth() + 1)}-${this.pad(now.getDate())}-请修改标题.md`;
    },
    reset() {
      this.title = this.initTitle();
      this.content = '';
      this.rawContent = '';
      this.originContent = '';
      this.path = '';
      this.sha = null;
    },
    removeFile(data) {
      return this.$confirm('是否要删除此文章？')
      .then(() => {
        this.loading = true;
        return repo.contents(this.$route.query.path)
        .remove({
          message: 'remove file',
          sha: this.sha
        });
      })
      .then(() => {
        this.loading = false;
        this.$router.replace({
          path: '/'
        });
        EventBus.$emit('updateFiles');
      })
      .catch((err = {}) => {
        this.loading = false;
        this.$message.error(/"message": "([^"]+)/m.test(err.message) && RegExp.$1 || err.toString());
      });
    },
    newPost() {
      if (this.originContent !== this.content) {
        return this.$confirm('是否放弃原有文章？').then(this.reset);
      } else {
        this.$router.replace({
          path: '/'
        });
        this.reset();
      }
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        new ImageCompressor(file, { // eslint-disable-line
          quality: 0.6,
          success(result) {
            var reader = new FileReader();
            reader.readAsDataURL(result);
            reader.onload = resolve;
            reader.onerror = reject;
          },
          error(e) {
            reject(e);
          }
        });
      });
    },
    imgAdd(filename, file) {
      this.loading = true;
      const name = 'media/' + this.getTime(Date.now()) + '.' + file.type.split('/').pop();
      this.getBase64(file)
      .then((res) => {
        return this.upload({
          path: name,
          message: 'upload image: ' + file,
          content: res.target.result.slice(res.target.result.indexOf(',') + 1)
        });
      })
      .then(({ content }) => {
        this.$refs['editor'].$img2Url(filename, content.downloadUrl);
      })
      .catch((err = {}) => {
        this.loading = false;
        this.$message.error(/"message": "([^"]+)/m.test(err.message) && RegExp.$1 || err.toString());
      });
    },
    copy() {
      var copyTextarea = this.$refs['copyText'].$refs['input'];
      copyTextarea.select();
      try {
        var successful = document.execCommand('copy');
        var msg = successful ? '成功' : '失败';
        this.$message('复制' + msg);
      } catch (err) {
        this.$message.error('请手工复制链接');
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
<style lang="scss" scoped>
.el-col {
  margin-bottom: 8px;
}
.attachment {
  object-fit: contain;
  max-height: 80%;
}
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
<style lang="scss">
.mu-item-wrapper .mu-item {
  min-height: auto;
}
.el-message {
  max-width: 100%;
  .el-message__group {
    height: auto;
    p {
      white-space: pre-wrap;
      word-break: break-all;
    }
  }
}
</style>