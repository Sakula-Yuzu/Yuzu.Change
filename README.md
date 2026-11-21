# 个性文字生成工具

纯静态页面，没有构建步骤，也没有服务器。把文件放到 GitHub 仓库里，用 GitHub Pages 就能公开访问。

## 部署到 GitHub Pages

1. 在 GitHub 新建一个空仓库，不要勾选 “Add a README”。
2. 把这个压缩包里的全部文件上传到仓库**根目录**。根目录里要直接看到 `index.html`，不要多包一层文件夹。
3. 打开仓库的 **Settings → Pages**。
4. **Build and deployment** 里，Source 选 **Deploy from a branch**。
5. Branch 选 `main`，文件夹选 **`/ (root)`**，保存。
6. 等一两分钟，页面会出现在 `https://你的用户名.github.io/仓库名/`。

如果仓库名就是 `你的用户名.github.io`，地址是 `https://你的用户名.github.io/`。

## 本地查看

解压后用浏览器打开 `index.html` 即可，不需要安装任何东西。
