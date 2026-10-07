/**
 * YU LI — portfolio copy
 * -----------------------
 * This is the only file you need to edit for words on the site.
 * index.html, styles.css, and site.js read this object. They do not
 * contain sentences.
 *
 * The English intro is a direct translation of the GitHub profile
 * README (the "资深设计师 / Agent 体验" paragraph). It is not a
 * fictional biography. Replace it whenever you want different wording.
 *
 * Add Chinese (or any other language) without rewriting the page:
 *   1. Copy the whole `en` object.
 *   2. Paste it as a new key, for example `zh`, inside `locales`.
 *   3. Translate the string values. Keep every key the same.
 *   4. Set `htmlLang` (use "zh-Hans" for Simplified Chinese) and
 *      `switchLabel` (short text on the language button, e.g. "中文").
 * A language switch appears on its own once two locales exist.
 * Share a locale with ?lang=zh
 */
window.SITE = {
  defaultLocale: "en",
  locales: {
    en: {
      htmlLang: "en",
      switchLabel: "EN",
      meta: {
        title: "YU LI",
        description:
          "YU LI — senior designer making things with AI. Agent experience, complex products, and design engineering.",
      },
      skip: "Skip to content",
      navLabel: "Primary",
      langLabel: "Language",
      nav: [
        { href: "#about", label: "About" },
        { href: "#work", label: "Work" },
        { href: "#skills", label: "Skills" },
        { href: "#contact", label: "Contact" },
      ],
      hero: {
        index: "01",
        kicker: "Introduction",
        name: "YU LI",
        lede: "Senior designer, making things with AI.",
        summary:
          "Agent experience, complex products, and design engineering.",
        primaryCta: { href: "#work", label: "Selected work" },
        secondaryCta: { href: "#contact", label: "Contact" },
      },
      about: {
        index: "02",
        title: "About",
        paragraphs: [
          {
            text: "I am a senior designer, making things with AI. I focus on agent experience, complex products, and design engineering.",
            placeholder: false,
          },
          { text: "Add a short bio.", placeholder: true },
        ],
      },
      work: {
        index: "03",
        title: "Selected projects",
        intro: "Sample cards. Replace each one with a real project.",
        placeholderLabel: "Placeholder",
        linkFallback: "Add a link",
        newTab: "opens in a new tab",
        projects: [
          {
            placeholder: true,
            title: "Project title",
            summary:
              "Add one sentence: what it is, who it is for, and what you did.",
            tags: ["Add a tag"],
            href: "",
            linkLabel: "Add a link",
          },
          {
            placeholder: true,
            title: "Project title",
            summary: "Add an experiment, prototype, or product.",
            tags: ["Add a tag"],
            href: "",
            linkLabel: "Add a link",
          },
          {
            placeholder: true,
            title: "Project title",
            summary: "Add a case study, talk, or piece of writing.",
            tags: ["Add a tag"],
            href: "",
            linkLabel: "Add a link",
          },
        ],
      },
      skills: {
        index: "04",
        title: "Skills",
        groups: [
          {
            title: "Focus",
            note: "",
            placeholder: false,
            items: [
              "Agent experience",
              "Complex products",
              "Design engineering",
            ],
          },
          {
            title: "Add skills",
            note: "Placeholder. Replace these with practices and tools you want to show.",
            placeholder: true,
            items: ["Add a skill", "Add a skill", "Add a skill"],
          },
        ],
      },
      contact: {
        index: "05",
        title: "Contact",
        intro: "GitHub, Xiaohongshu, and WeChat are listed below.",
        placeholderLabel: "Placeholder",
        channels: [
          {
            label: "GitHub",
            text: "yulili-ai",
            href: "https://github.com/yulili-ai",
            placeholder: false,
          },
          {
            label: "Xiaohongshu",
            text: "Profile",
            href: "https://xhslink.cn/o/qqrzqPKUyk",
            placeholder: false,
          },
          {
            label: "WeChat",
            text: "YULi.AI产品与体验",
            href: "",
            note: "Search this account name in WeChat.",
            placeholder: false,
          },
          {
            label: "Email",
            text: "Add an email address",
            href: "",
            placeholder: true,
          },
        ],
      },
      footer: {
        note: "Words on this page live in content.js.",
      },
      missing: "Add copy in content.js, then reload.",
    },
  },
};
