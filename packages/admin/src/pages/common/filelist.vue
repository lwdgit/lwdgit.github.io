<template>
  <el-table :data="filelist" class="table" v-loading.body="loading" height="100%">
    <el-table-column label="我的文件夹">
      <template scope="scope">
        <el-row type="flex" justify="space-between">
          <div @click="editFile(scope.row)">{{ scope.row.path.split('/').slice(1).join('/') }}</div>
          <el-button size="small" icon="delete" type="text" @click="removeFile(scope.row)"></el-button>
        </el-row>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { repo, octo, user } from '../../api';

export default {
  data() {
    return {
      filelist: [],
      loading: false
    };
  },
  created() {
    this.fetchFiles();
  },
  methods: {
    fetchFiles() {
      this.loading = true;
      octo.fromUrl(`https://api.github.com/repos/${user.name}/blog/git/trees/gh-pages?recursive=1`).fetch()
      .then((res) => {
        return res.tree.filter(item => /^_posts\/[^.].+\.md$/.test(item.path));
      })
      .then(filelist => {
        this.loading = false;
        this.filelist = filelist.reverse();
      })
      .catch((err = {}) => {
        this.loading = false;
        this.$message.error(/"message": "([^"]+)/m.test(err.message) && RegExp.$1 || err.toString());
      });
    },
    removeFile(data) {
      return this.$confirm('是否要删除此文章？')
      .then(() => {
        return repo.contents(data.path)
        .remove({
          message: 'remove file',
          sha: data.sha
        });
      })
      .then(() => {
        return this.fetchFiles();
      })
      .catch((err = {}) => {
        this.loading = false;
        this.$message.error(/"message": "([^"]+)/m.test(err.message) && RegExp.$1 || err.toString());
      });
    },
    editFile(data) {
      this.$router.push({
        path: '/',
        query: {
          path: data.path
        }
      });
    }
  },
  watch: {
    '$route.query'({ path, update }) {
      if (update) {
        setTimeout(() => this.fetchFiles(), 800);
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
<style>
.el-table {
  height: 100%;
}
</style>