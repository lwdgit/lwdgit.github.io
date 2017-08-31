<template>
  <div v-loading.body="saving">
    <!-- breadcrumb start  -->
    <breadcrumb></breadcrumb>
    <!-- breadcrumb end  -->
    <br />
    <div class="db-content-inner">
      <el-form ref="form" label-width="100px">
        <el-form-item v-for="item in this.settings" v-if="item.name" :label="item.name + ' :'" :prop="item.name" :key="item.name">
          <el-input placeholder="请输入" v-model="item.value"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import breadcrumb from '../../components/breadcrumb';
import { base } from '../../api';
import { Base64 } from 'js-base64';
export default {
  data() {
    return {
      saving: false,
      settings: []
    };
  },
  components: {
    breadcrumb
  },
  created() {
    // ^(?:([^:]+):)?\s*(.*)
    this.repo = base.contents('_config.yml');
    this.fetchSettings();
  },
  methods: {
    fetchSettings() {
      return this.repo.fetch()
      .then(({ content, sha }) => {
        this.originContent = Base64.decode(content);
        this.sha = sha;
        if (/#start([\w\W]*?)#end/m.test(this.originContent)) {
          this.content = RegExp.$1.trim();
          this.parseSettings();
        }
      })
      .catch((err) => {
        const message = /"message": "([^"]+)/m.test(err.message) && RegExp.$1 || err.toString();
        this.loading = false;
        this.$message.error(message.trim());
      });
    },
    parseSettings() {
      this.settings = [];
      this.content.replace(/^(?:([^:#\n]+):)?[ \t]*(.*)/mg, (all, name, value) => {
        if (name) {
          this.settings.push({
            name,
            value
          });
        }
      });
    },
    reset() {
      this.$refs.form.resetFields();
    },
    submit() {
      const content = this.originContent.replace(/#start([\w\W]*?)#end/m,
        '#start\n' +
        this.settings.map((item => `${item.name}: ${item.value}`)).join('\n') +
        '\n#end'
      );
      this.saving = true;
      this.repo.add({
        path: '_config.yml',
        message: 'update config',
        sha: this.sha,
        content: Base64.encode(content)
      }).then(() => {
        this.saving = false;
        this.$message('保存成功');
        return this.fetchSettings();
      })
      .catch((err) => {
        this.saving = false;
        const message = /"message": "([^"]+)/m.test(err.message) && RegExp.$1 || err.toString();
        this.loading = false;
        this.$message.error(message.trim());
      });
    }
  },
  computed: {
    majorList() {
    }
  }
};
</script>

<style lang="scss" scoped>
#big-form {
  .el-form {
    width: 600px;

    .skill-line {
      margin: 10px 0;
    }
  }
}
</style>