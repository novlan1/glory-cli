const axios = require('axios');
const { tmpRepoList } = require('./config');

// 拦截全局请求响应
axios.interceptors.response.use(res => res.data);

/**
 * 获取模板
 * @returns Promise
 */
async function getTmpRepoList() {
  return axios({
    url: 'https://api.github.com/orgs/glory-cli/repos',
    method: 'GET',
    Headers: {
      ...getAuth(),
    },
  });
}

async function getTmpRepoListV2() {
  return tmpRepoList.map(item => ({
    name: item.name,
  }));
}

/**
 * 获取仓库下的版本
 * @param {string} repo 模板名称
 * @returns Promise
 */
async function getTagsByRepo(repo) {
  return axios({
    url: `https://api.github.com/repos/glory-cli/${repo}/tags`,
    method: 'GET',
    Headers: {
      ...getAuth(),
    },
  });
}

async function getTagsByRepoV2(repo) {
  const flattenRepo = tmpRepoList.reduce((acc, item) => {
    acc[item.name] = item;
    return acc;
  }, {});
  const tags = (flattenRepo[repo]?.tags || []).map(item => ({
    name: item,
  }));
  return tags;
}


function getAuth() {
  const token = process.env.GLORY_CLI_GITHUB_API_TOKEN || '';
  const auth = token ? {
    Authorization: `token ${token}`,
  } : {};
  return auth;
}

module.exports = {
  getTmpRepoList,
  getTagsByRepo,
  getTmpRepoListV2,
  getTagsByRepoV2,
};
