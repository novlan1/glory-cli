const axios = require("axios");

// 拦截全局请求响应
axios.interceptors.response.use((res) => {
  return res.data;
});

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
    }
  })
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
    }
  })
}

function getAuth() {
  let token = process.env.GLORY_CLI_GITHUB_API_TOKEN || '';
  const auth = token ? {
    Authorization: `token ${token}`
  } : {}
  return auth;
}

module.exports = {
  getTmpRepoList,
  getTagsByRepo,
};
