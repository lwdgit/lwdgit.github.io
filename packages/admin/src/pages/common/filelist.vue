<template>
  <div>
    <el-input
      placeholder="搜索我的文档"
      v-model="filterText">
    </el-input>
    <el-tree
      ref="filelist"
      v-loading.body="loading"
      :data="fileTree"
      node-key="_path"
      @node-click="editFile"
      :filter-node-method="filterNode"
      :render-content="renderContent"
      :default-expanded-keys="['_posts']"
    ></el-tree>
  </div>
</template>

<script>
import { repo, octo, getUser } from '../../api';
import EventBus from '../../event-bus';

function setValue(path, val, obj) {
  var fields = path.split('/');
  var result = obj;
  for (var i = 0, n = fields.length; i < n && result !== undefined; i++) {
    var field = fields[i];
    if (i === n - 1) {
      result[field] = val;
    } else {
      result = result[field] || {};
    }
  }
}

function objToMenu(obj, dataArray) {
  for (let p in obj) {
    const { _id, _path, _type, ...other } = obj[p];
    let data = {
      label: p,
      _id,
      _path,
      _type
    };

    for (let ip in other) { // eslint-disable-line
      data.children = [];
      objToMenu(other, data.children);
      break;
    }
    dataArray.unshift(data);
  }
}

export default {
  data() {
    return {
      filterText: '',
      filelist: [],
      loading: false,
      fileTree: [],
      branches: ''
    };
  },
  watch: {
    filterText(val) {
      this.$refs['filelist'].filter(val);
    }
  },
  mounted() {
    EventBus.$on('updateFiles', () => {
      this.loading = true;
      setTimeout(() => {
        this.fetchFiles();
      }, 1000);
    });
  },
  created() {
    getUser();
    this.fetchFiles();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1 && data.label.endsWith('.md');
    },
    fetchFiles() {
      if (!octo) {
        return;
      };
      this.loading = true;
      return new Promise((resolve) => {
        if (this.branches) {
          resolve(this.branches);
        } else {
          // 获取默认branch
          repo.fetch()
          .then(({ defaultBranch }) => {
            this.branches = defaultBranch;
            resolve(this.branches);
          });
        }
      })
      .then((branches) => {
        return repo.git.trees(`${branches}?recursive=1&rd=${Math.random()}`).fetch();
      })
      .then(filelist => {
        return filelist.tree.filter(item => item.path.indexOf('_posts') === 0 || item.path.indexOf('media') === 0 /* && !/(\/media|\/\.|\/_)/.test(item.path) */);
      })
      .then(tree => {
        this.loading = false;
        this.filelist = tree;

        let dataObj = {};
        tree.forEach(function(item) {
          setValue(item.path, { _id: item.sha, _path: item.path, _type: item.type }, dataObj);
        });
        const fileTree = [];
        objToMenu(dataObj, fileTree);
        fileTree.forEach(item => {
          if (item.label === '_posts') {
            item.label = '我的文档';
          } else {
            item.label = '我的图片';
          }
        });
        this.fileTree = fileTree;
      })
      .catch((err = {}) => {
        this.loading = false;
        this.$message.error(/"message": "([^"]+)/m.test(err.message) && RegExp.$1 || err.toString());
      });
    },
    removeFile(data) {
      return this.$confirm('是否要删除此文章？')
      .then(() => {
        this.loading = true;
        return repo.contents(data._path)
        .remove({
          message: 'remove file',
          sha: data.sha
        });
      })
      .then(() => {
        this.loading = false;
        return this.fetchFiles();
      })
      .catch((err = {}) => {
        this.loading = false;
        this.$message.error(/"message": "([^"]+)/m.test(err.message) && RegExp.$1 || err.toString());
      });
    },
    editFile(data) {
      if (data._type === 'tree') return;
      this.$router.push({
        path: '/',
        query: {
          path: data._path
        }
      });
    },
    renderContent(h, { node, data, store }) {
      const children = [
        h('span', { class: 'flex-1' }, node.label)
      ];
      return h('span', { class: 'flex flex-1' }, children);
    }
  }
};
</script>
<style lang="scss">
.el-table {
  height: auto;
}
.title {
  flex: 1;
}
.el-tree {
  height: auto;
  .el-tree-node__content, .flex {
    display: flex;
    align-items: center;
  }
  .flex-1 {
    flex: 1;
  }
  .el-button {
    width: 60px;
  }
}
</style>