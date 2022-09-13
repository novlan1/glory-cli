const inquirer = require("inquirer");
const downloadGitRepo = require("download-git-repo");
const chalk = require("chalk");
const util = require("util");
const path = require("path");
const fs = require('fs')
const symbols = require('log-symbols')

const { loading } = require("./util");
const {
  getTmpRepoList,
  getTagsByRepo, 
  getTagsByRepoV2, 
  getTmpRepoListV2 
} = require("./api");

class Creator {
  constructor(name, target) {
    this.name = name;
    this.target = target;
    // 转化为 promise 方法
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  // 创建项目部分
  async create() {
    // 仓库信息 —— 模板信息
    let repo = await this.getRepoInfo();
    const descInfo = await this.getPkgInfo();

    // 标签信息 —— 版本信息
    let tag = await this.getTagInfo(repo);

    
    // 下载模板
    await this.download(repo, tag);
    
    await this.modifyPkg({
      projectName: this.name,
      author: descInfo.author,
      description: descInfo.description,
    });

    // 模板使用提示
    console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`);
    console.log(`\r\n  cd ${chalk.cyan(this.name)}`);
    console.log("  npm install");
    console.log("  npm run serve\r\n");
  }

  // 获取模板信息及用户选择的模板
  async getRepoInfo() {
    // 获取组织下的仓库信息
    let repoList = await loading(
      "waiting for fetching template",
      getTmpRepoListV2
    );
    if (!repoList) return;

    // 提取仓库名
    const repos = repoList.map((item) => item.name);
    // 选取模板信息
    let { repo } = await new inquirer.prompt([
      {
        name: "repo",
        type: "list",
        message: "Please choose a template to create project",
        choices: repos,
      },
    ]);

    return repo;
  }
  // 获取版本信息及用户选择的版本
  async getTagInfo(repo) {
    let tagList = await loading(
      "waiting for fetching version",
      getTagsByRepoV2,
      repo
    );

    
    if (!tagList || !tagList.length) {
      console.log(symbols.info, `没有tag～`)
      return;
    }

    const tags = tagList.map((item) => item.name);
    // 选取模板信息
    let { tag } = await new inquirer.prompt([
      {
        name: "tag",
        type: "list",
        message: "Please choose a version to create project",
        choices: tags,
      },
    ]);
    return tag;
  }

  async getPkgInfo() {
    const res = await new inquirer.prompt([
      {
        name: 'description',
        message: 'Please enter the project description: '
      },
      {
        name: 'author',
        message: 'Please enter the author name: '
      }
    ])
    return res;
  }

  async modifyPkg({projectName, author, description}) {
    const fileName = `${projectName}/package.json`;
    if(fs.existsSync(fileName)){
        const data = fs.readFileSync(fileName).toString();
        let json = JSON.parse(data);
        json.name = projectName;
        json.author = author;
        json.description = description;
        //修改项目文件夹中 package.json 文件
        fs.writeFileSync(fileName, JSON.stringify(json, null, '\t'), 'utf-8');
        // console.log(symbols.success, chalk.green('Project initialization finished!'));
    }
  }

  // 下载git仓库
  async download(repo, tag) {
    // 模板下载地址
    const templateUrl = `glory-cli/${repo}${tag ? "#" + tag : ""}`;
    
    // 调用 downloadGitRepo 方法将对应模板下载到指定目录
    await loading(
      "downloading template, please wait",
      this.downloadGitRepo,
      templateUrl,
      path.resolve(process.cwd(), this.target) // 项目创建位置
    );
  }
}

module.exports = Creator;
