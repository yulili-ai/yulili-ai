<!-- ============================================================
  YULi 的 GitHub 个人主页（放在 yulili-ai/yulili-ai 仓库的 README.md）
  带 TODO 的地方需要你自己补充；HTML 注释里的内容不会显示在主页上。
============================================================= -->

### Hi，我是 YULi 👋

<a href="https://github.com/DenverCoder1/readme-typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Noto+Sans+SC&weight=400&size=15&duration=3200&pause=1600&color=8B949E&vCenter=true&width=460&height=26&lines=%E7%A0%94%E7%A9%B6%20Agent%20%E4%BD%93%E9%AA%8C;%E5%A4%8D%E6%9D%82%E4%BA%A7%E5%93%81%20%C2%B7%20%E8%AE%BE%E8%AE%A1%E5%B7%A5%E7%A8%8B%E5%8C%96;%E4%B8%80%E4%B8%AA%E8%B5%84%E6%B7%B1%E8%AE%BE%E8%AE%A1%E5%B8%88%E7%9A%84%20AI%20Builder%20%E5%AE%9E%E9%AA%8C" alt="研究 Agent 体验 · 复杂产品 · 设计工程化" /></a>

我是一名资深设计师，正在动手用 AI 做东西。主要关注 **Agent 体验**、**复杂产品**和**设计工程化**，这个主页用来记录我的 AI Builder 实验。

<a href="https://xhslink.cn/o/qqrzqPKUyk"><img src="https://img.shields.io/badge/%E5%B0%8F%E7%BA%A2%E4%B9%A6-FF2442?style=flat-square&logo=xiaohongshu&logoColor=white" alt="小红书" /></a>
<a href="#latest-posts" title="微信搜索：YULi.AI产品与体验"><img src="https://img.shields.io/badge/%E5%85%AC%E4%BC%97%E5%8F%B7-YULi.AI%E4%BA%A7%E5%93%81%E4%B8%8E%E4%BD%93%E9%AA%8C-07C160?style=flat-square&logo=wechat&logoColor=white" alt="微信公众号：YULi.AI产品与体验" /></a>
<!-- TODO(作品集)：在仓库 Settings → Pages 里用 main 分支 / 根目录发布后，删掉下一行的注释标记即可。地址是项目页，不是用户主页。
<a href="https://yulili-ai.github.io/yulili-ai/"><img src="https://img.shields.io/badge/%E4%BD%9C%E5%93%81%E9%9B%86-111111?style=flat-square&logo=About.me&logoColor=white" alt="作品集" /></a>
-->

<!-- 「正在做」先隐藏；有项目后，把下面这段注释里的内容挪到「最新文章」上面即可恢复
**正在做**

• [项目名](链接) · 一句话介绍<br>
• [项目名](链接) · 一句话介绍<br>
• [项目名](链接) · 一句话介绍
-->

<a id="latest-posts"></a>**最新文章** · 公众号「YULi.AI产品与体验」

<!-- 下面两行标记之间的内容会被 GitHub Actions 自动替换成最新文章，标记本身不要删 -->
<!-- BLOG-POST-LIST:START -->
• 在微信搜索「YULi.AI产品与体验」，阅读我最近的文章
<!-- BLOG-POST-LIST:END -->

<!-- 贡献图小蛇动画：由 .github/workflows/profile.yml 生成，并推送到 output 分支（第一次运行 workflow 之前图片会显示不出来） -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/yulili-ai/yulili-ai/output/github-snake-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/yulili-ai/yulili-ai/output/github-snake.svg" />
  <img alt="GitHub 贡献图小蛇动画" src="https://raw.githubusercontent.com/yulili-ai/yulili-ai/output/github-snake.svg" />
</picture>

<!-- 可选：GitHub 统计卡片。目前公开仓库不多，先不放，免得页面显得空；以后项目多了再取消注释
<img height="140" src="https://github-readme-stats.vercel.app/api?username=yulili-ai&hide_border=true&hide_title=true&show_icons=true&theme=transparent&count_private=true" alt="GitHub stats" />
-->

## 作品集网站 / Portfolio site

根目录的 `index.html` 是一个静态作品集，和上面这段 GitHub 个人主页互不替换。个人主页仍由本 README 展示；作品集页面由 GitHub Pages 提供。公众号文章列表和贡献图小蛇的 workflow 不用改。`output` 分支只放小蛇 SVG，不要把它设成 Pages 分支。

The portfolio is a static site in this repo (`index.html`). It does not replace this profile README. The WeChat post workflow and the contribution-snake workflow stay as they are. The `output` branch is only for the snake SVGs — do not publish Pages from it.

### Run locally

From the repository root:

```bash
python3 -m http.server 8080
```

Open http://localhost:8080

Opening `index.html` as a file still works, because the copy is loaded from `content.js` rather than `fetch`.

### Publish on GitHub Pages

This repository is `yulili-ai/yulili-ai`, so Pages serves a **project site**, not a user site:

`https://yulili-ai.github.io/yulili-ai/`

1. Settings → Pages
2. Build and deployment → **Deploy from a branch**
3. Branch: `main`, folder: **`/ (root)`**, then Save
4. After the first deploy, uncomment the 作品集 badge near the top of this README

`.nojekyll` is already in the root so GitHub Pages will not run the files through Jekyll.

A user site at `https://yulili-ai.github.io/` would need a separate repository named `yulili-ai.github.io`.

### Edit the words

All visitor-facing copy is in [`content.js`](content.js). English is `locales.en`.

To add Chinese, copy the `en` object to a `zh` key in `locales`, translate the strings, and set `htmlLang` to `zh-Hans`. The language switch shows up once a second locale exists. Nothing else has to change.

Placeholder project cards, the skills block marked Placeholder, and “Add a short bio” / “Add an email address” are blanks. Replace them in `content.js`. Do not add employers, titles, or case studies that are not yours.
