---
theme: vue-pro
---

「这是我参与 2022 首次更文挑战的第 3 天，活动详情查看：[2022 首次更文挑战](https://juejin.cn/post/7052884569032392740 "https://juejin.cn/post/7052884569032392740")」

本文是从我毕业开始工作以来，`git`使用过程中的一些总结， [`git`官方文档](https://git-scm.com/docs)，`git`是一个**快速管理版本工具**，有三个阶段：`Working Directory`（工作区），`Staging Area`（暂存区），`Repository`(Git 目录）

**Working Directory **------------------**Staging Area**--------------------**.git directory**

                                                               git checkout(切换本地分支)
    <-----------------------------------------------------------------------------------
    git commit(本地提交）
    --------------------------------------------->
                                                                     git push(提交到远程）
                                         ----------------------------------------------->

#### 一、git 指令

##### 1、常用指令

- `git fetch` 拉取远程最新内容，不合并到本地的工作分支
- `git pull origin <branchName>` 拉取远程最新内容，并合并到工作区
- `git commit -m ""` 提交代码到暂存区
- `git push` 从暂存区推送到远程
- `git branch <branchName>` 新建分支
- `git log` git 日志查看
- `git merge` 合并代码
- `git add` 本地内容添加到索引中（gitignore 中忽略内容除外）
- `git checkout` 切换分支
- `git reset HEAD~` `HEAD~`表示上一次，该命令用于撤销上一次的`commit`（当`commit`提交错误分支时）

##### 2、`rebase`和`merge`的区别：

**`rebase`**

1. **重新设置基线**，将你的当前分支重新设置开始点（无法查看这之前的历史提交记录）；
2. 会把你当前分支的`commit`放到公共分支的最后面，叫**变基**，在这种情况下，如果你在公共分支`commit`进来东西，别人从这个公共分支拉出去的人都需要在`rebase`,相当于你 rebase 东西进来的都是新的`commit`了。
   **`merge`**: 会把公共分支和你当前的`commit`合并在一起，形成一个新的 `commit` 提交

- 1-2-3 是`master`分支状态
- 从`master` `checkout`出来一个`prod`分支
- `master`提交了 4.5，`prod`提交了 6.7
- 这个时候`master`分支：1-2-3-4-5，`prod`：1-2-3-6-7
- 如果在`prod`上用`rebase master` ,`prod`分支状态就成了 1-2-3-4-5-6-7
- 如果是`merge`，`prod`分支为 1-2-3-6-7-8（........ |4-5|）
- 会出来一个 8，这个 8 的提交就是把 4-5 合进来的提交

#### 二、`git`工具包的使用：

> 先安装 `Git`，工具包只是一个程序壳，必须依赖一个 `Git Core`。

`tortoiseGit`是我刚工作时使用的第一个工具包。安装这个工具之后，就可以直接通过可视化按钮来克隆远程仓库、提交合并代码，该工具除了默认命令行，也可定制其它命令，常用的如下：

1. `Git Clone...`是获得远程的版本库;
2. `Git Create repository here`是将选定的文件夹作为要创建的版本库，会自动创建一个文件夹`.git`。
3. `Git Commit -> "master"` 提交代码
4. `Pull` `Push` `Revert` `clean up`…………
   当然，除了这个工具，现在很多`IDE`也都有集成`git`操作面板，如`webstorm`、微信开发者工具、`VScode`；没有`git`功能的也可以通过安装插件来支持，像`HBuilder`安装`easy-git`；觉得`IDE`上的`git`面板不够直观，还可以另外找插件来拓展功能：像`VScode`还可安装`Git History`来拓展。

#### 三、`gitignore`文件

> `gitignore`文件用于指定`git`忽略的文件和文件夹。**但已跟踪的文件不受影响!**

##### 1、如果 git 文件已建立跟踪,可以通过`git rm --cache -r .`和`git add .`清空缓存再重新提交一次

##### 2、 **`.gitignore`的格式要求**

1. 空行:无意义,可作为分隔符
2. 注释: 以`#`开头
3. 目录分隔符: `/`
4. 否定模式: `!`,被先前模式排除的文件 将会重新建立跟踪
5. 反斜杠: `\`,以文字开头的模式需加上反斜杠转义
6. `**`: `**/`表示再所有目录中都匹配; `/**`表示目录下的所有内容; `a/**/b`表示 a 目录中所有目录下的 b,`a/b`也能匹配到
