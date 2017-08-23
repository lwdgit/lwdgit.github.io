<template>
  <el-tree
    :data="fileTree"
    node-key="_path"
    @node-click="editFile"
    :render-content="renderContent"
    :default-expanded-keys="['_posts']"
  ></el-tree>
</template>

<script>
import { repo, octo, user, getUser } from '../../api';
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
      filelist: [],
      loading: false,
      fileTree: []
    };
  },
  mounted() {
    EventBus.$on('updateFiles', () => {
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
    fetchFiles() {
      if (!octo) {
        return;
      };
      this.loading = true;
      octo.fromUrl(`https://api.github.com/repos/${user.name}/blog/git/trees/gh-pages?recursive=1`).fetch()
      .then(filelist => {
        return filelist.tree.filter(item => item.path.indexOf('_posts') === 0 && !/(\/media|\/\.|\/_)/.test(item.path));
      })
      .then(tree => {
        this.loading = false;
        this.filelist = tree;

        let dataObj = {};
        tree.forEach(function(item) {
          setValue(item.path, { _id: item.sha, _path: item.path, _type: item.type }, dataObj);
        });
        this.fileTree = [];
        objToMenu(dataObj, this.fileTree);
        this.fileTree[0].label = '我的文件夹';
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
  },
  watch: {
    '$route.query'({ path, update }) {
      if (update) {
        setTimeout(() => this.fetchFiles(), 1500);
        this.$router.replace({
          path: '/',
          query: {
            path
          }
        });
      }
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