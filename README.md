# 何思瑶化妆师作品集

这是网站的完整本地项目，包含可编辑源码、作品图片、背景视频以及 GitHub Pages 自动部署配置。

## 上传到 GitHub

1. 在 GitHub 新建一个空仓库。
2. 把本项目文件夹内的全部文件上传到仓库默认分支，通常是 `main`。
3. 打开仓库的 `Settings → Pages`。
4. 在 `Build and deployment` 的 `Source` 中选择 `GitHub Actions`。
5. 打开仓库的 `Actions` 页面，等待 `Deploy portfolio to GitHub Pages` 完成。
6. 部署成功后，GitHub 会显示可公开访问的网站链接。

每次向默认分支提交修改，网站都会自动重新部署。

## 本地预览

可以直接打开 `static-preview.html`，也可以在项目目录运行：

```bash
pnpm install
pnpm dev
```

## 更新静态成品

修改 `static-preview.html`、`src` 或 `public` 中的内容后，运行：

```bash
pnpm export:github
```

该命令会把最新静态内容同步到 `dist`。GitHub Pages 工作流也会在部署前自动执行一次。

## 当前作品分类

- 新娘妆
- 杂志风
- 亚裔妆（暂时保留空卡片）
- 韩系妆（包含韩系01、韩系02）
- 泰系妆
- 欧美妆
- 新中式

线上发布目录为 `dist`，其中的图片会保持原始宽高比例完整展示，不进行裁切。
