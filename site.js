(function () {
  var data = window.SITE;

  function el(tag, attrs) {
    var node = document.createElement(tag);
    if (!attrs) return node;
    Object.keys(attrs).forEach(function (key) {
      var value = attrs[key];
      if (value == null || value === false) return;
      if (key === "class") {
        if (value) node.className = value;
        return;
      }
      else if (key === "text") node.textContent = value;
      else node.setAttribute(key, value);
    });
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function appendChildren(node, children) {
    children.forEach(function (child) {
      if (child) node.appendChild(child);
    });
    return node;
  }

  function showMissing(message) {
    var main = document.getElementById("main");
    if (!main) return;
    clear(main);
    main.appendChild(el("p", { class: "missing", text: message || "Add copy in content.js." }));
  }

  if (!data || !data.locales) {
    document.addEventListener("DOMContentLoaded", function () {
      showMissing("Add copy in content.js.");
    });
    return;
  }

  var localeNames = Object.keys(data.locales);
  var current =
    data.defaultLocale && data.locales[data.defaultLocale]
      ? data.defaultLocale
      : localeNames[0];

  function localeFromQuery() {
    var requested = new URLSearchParams(window.location.search).get("lang");
    if (requested && data.locales[requested]) return requested;
    return current;
  }

  current = localeFromQuery();

  function copy() {
    return data.locales[current];
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function externalLink(href, text, newTabPhrase) {
    var link = el("a", { href: href, text: text });
    var url;
    try {
      url = new URL(href, window.location.href);
    } catch (error) {
      return link;
    }
    if (url.origin !== window.location.origin) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      link.appendChild(el("span", { class: "visually-hidden", text: " (" + newTabPhrase + ")" }));
    }
    return link;
  }

  function renderIndex(index, kicker) {
    var node = el("p", { class: "index" });
    node.appendChild(el("span", { class: "index-num", text: index }));
    if (kicker) {
      node.appendChild(document.createTextNode(" — "));
      node.appendChild(el("span", { text: kicker }));
    }
    return node;
  }

  function renderNav(c) {
    var nav = document.getElementById("nav");
    clear(nav);
    nav.setAttribute("aria-label", c.navLabel);
    var list = el("ul");
    c.nav.forEach(function (item) {
      var li = el("li");
      li.appendChild(el("a", { href: item.href, text: item.label }));
      list.appendChild(li);
    });
    nav.appendChild(list);

    var lang = document.getElementById("lang");
    clear(lang);
    if (localeNames.length < 2) {
      lang.hidden = true;
      return;
    }
    lang.hidden = false;
    lang.setAttribute("aria-label", c.langLabel);
    localeNames.forEach(function (name) {
      var locale = data.locales[name];
      var button = el("button", {
        type: "button",
        class: name === current ? "is-current" : "",
        text: locale.switchLabel || name,
      });
      button.setAttribute("aria-pressed", name === current ? "true" : "false");
      button.addEventListener("click", function () {
        if (name === current) return;
        current = name;
        var url = new URL(window.location.href);
        url.searchParams.set("lang", name);
        window.history.replaceState({}, "", url);
        render();
      });
      lang.appendChild(button);
    });
  }

  function renderHero(c) {
    var hero = document.getElementById("hero");
    clear(hero);
    var parts = c.hero.name.trim().split(/\s+/);
    var heading = el("h1", { id: "hero-heading" });
    parts.forEach(function (part, i) {
      heading.appendChild(
        el("span", { class: i === 0 ? "name-line is-first" : "name-line", text: part })
      );
    });

    var actions = el("div", { class: "hero-actions" });
    actions.appendChild(
      el("a", { class: "cta", href: c.hero.primaryCta.href, text: c.hero.primaryCta.label })
    );
    actions.appendChild(
      el("a", {
        class: "cta cta-quiet",
        href: c.hero.secondaryCta.href,
        text: c.hero.secondaryCta.label,
      })
    );

    appendChildren(hero, [
      renderIndex(c.hero.index, c.hero.kicker),
      heading,
      el("p", { class: "lede", text: c.hero.lede }),
      el("p", { class: "summary", text: c.hero.summary }),
      actions,
    ]);

    var wordmark = document.getElementById("wordmark");
    if (wordmark) wordmark.textContent = c.hero.name;
  }

  function renderAbout(c) {
    var section = document.getElementById("about");
    clear(section);
    var body = el("div", { class: "prose" });
    c.about.paragraphs.forEach(function (paragraph) {
      var text = typeof paragraph === "string" ? paragraph : paragraph.text;
      var placeholder = typeof paragraph === "object" && paragraph.placeholder;
      body.appendChild(el("p", { class: placeholder ? "is-placeholder-copy" : "", text: text }));
    });
    appendChildren(section, [
      renderIndex(c.about.index, c.about.title),
      el("h2", { id: "about-heading", text: c.about.title }),
      body,
    ]);
  }

  function renderWork(c) {
    var section = document.getElementById("work");
    clear(section);
    var list = el("div", { class: "project-list" });
    var projects = c.work.projects || [];

    if (!projects.length) {
      list.appendChild(el("p", { class: "is-placeholder-copy", text: c.missing }));
    }

    projects.forEach(function (project, i) {
      var card = el("article", { class: project.placeholder ? "project is-placeholder" : "project" });
      var top = el("div", { class: "project-top" });
      top.appendChild(el("span", { class: "project-num", text: pad(i + 1) }));
      if (project.placeholder) {
        top.appendChild(el("span", { class: "flag", text: c.work.placeholderLabel }));
      }
      card.appendChild(top);
      card.appendChild(el("h3", { text: project.title }));
      card.appendChild(el("p", { text: project.summary }));

      if (project.tags && project.tags.length) {
        var tags = el("ul", { class: "tags" });
        project.tags.forEach(function (tag) {
          tags.appendChild(el("li", { text: tag }));
        });
        card.appendChild(tags);
      }

      var linkRow = el("p", { class: "project-link" });
      if (project.href) {
        linkRow.appendChild(externalLink(project.href, project.linkLabel || project.href, c.work.newTab));
      } else {
        linkRow.appendChild(el("span", { class: "is-placeholder-copy", text: project.linkLabel || c.work.linkFallback }));
      }
      card.appendChild(linkRow);
      list.appendChild(card);
    });

    appendChildren(section, [
      renderIndex(c.work.index, c.work.title),
      el("h2", { id: "work-heading", text: c.work.title }),
      el("p", { class: "section-intro", text: c.work.intro }),
      list,
    ]);
  }

  function renderSkills(c) {
    var section = document.getElementById("skills");
    clear(section);
    var groups = el("div", { class: "skill-groups" });

    (c.skills.groups || []).forEach(function (group) {
      var block = el("section", {
        class: group.placeholder ? "skill-group is-placeholder" : "skill-group",
      });
      var heading = el("h3", { text: group.title });
      if (group.placeholder) {
        var row = el("div", { class: "project-top" });
        row.appendChild(heading);
        row.appendChild(el("span", { class: "flag", text: c.work.placeholderLabel }));
        block.appendChild(row);
      } else {
        block.appendChild(heading);
      }
      if (group.note) block.appendChild(el("p", { class: "note", text: group.note }));
      var items = el("ul");
      (group.items || []).forEach(function (item) {
        items.appendChild(el("li", { text: item }));
      });
      block.appendChild(items);
      groups.appendChild(block);
    });

    appendChildren(section, [
      renderIndex(c.skills.index, c.skills.title),
      el("h2", { id: "skills-heading", text: c.skills.title }),
      groups,
    ]);
  }

  function renderContact(c) {
    var section = document.getElementById("contact");
    clear(section);
    var list = el("ul", { class: "contact-list" });

    (c.contact.channels || []).forEach(function (channel) {
      var item = el("li");
      var label = el("span", { class: "contact-label", text: channel.label });
      var value = el("span", { class: "contact-value" });
      if (channel.placeholder) {
        value.appendChild(el("span", { class: "flag", text: c.contact.placeholderLabel }));
        value.appendChild(document.createTextNode(" "));
      }
      if (channel.href) {
        value.appendChild(externalLink(channel.href, channel.text, c.work.newTab));
      } else {
        value.appendChild(
          el("span", { class: channel.placeholder ? "is-placeholder-copy" : "", text: channel.text })
        );
      }
      if (channel.note) value.appendChild(el("span", { class: "note", text: channel.note }));
      item.appendChild(label);
      item.appendChild(value);
      list.appendChild(item);
    });

    appendChildren(section, [
      renderIndex(c.contact.index, c.contact.title),
      el("h2", { id: "contact-heading", text: c.contact.title }),
      el("p", { class: "section-intro", text: c.contact.intro }),
      list,
    ]);
  }

  function renderFooter(c) {
    var footer = document.getElementById("footer");
    clear(footer);
    footer.appendChild(el("p", { class: "footer-name", text: c.hero.name }));
    if (c.footer && c.footer.note) {
      footer.appendChild(el("p", { text: c.footer.note }));
    }
  }

  function render() {
    var c = copy();
    if (!c) {
      showMissing();
      return;
    }
    document.documentElement.lang = c.htmlLang || current;
    document.title = c.meta.title;
    var description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", c.meta.description);
    var skip = document.getElementById("skip");
    if (skip) skip.textContent = c.skip;
    renderNav(c);
    renderHero(c);
    renderAbout(c);
    renderWork(c);
    renderSkills(c);
    renderContact(c);
    renderFooter(c);
  }

  document.addEventListener("DOMContentLoaded", render);
})();
