const MarkdownIt = require("markdown-it");
const highlightJs = require("highlight.js");

const utils = require("./utils");

const DEFAULT_MARKDOWN_OPTIONS = {
  html: true,
  highlight(str, lang) {
    if (lang && highlightJs.getLanguage(lang)) {
      try {
        return highlightJs.highlight(lang, str).value;
      } catch (err) {
        // ignore
      }
    }
    return ""; // use external default escaping
  }
};

// todo 支持inline import
module.exports = class Plugin {
  constructor(option) {
    const defaults = {
      live: true, // enable live
      preProcess: null,
      process: null,
      postProcess: null,
      markdownOptions: Object.assign({}, DEFAULT_MARKDOWN_OPTIONS) // Markdown-It options
    };

    //
    this.config = utils.deepExtend(defaults, option);
    this.markdown = new MarkdownIt(this.config.markdownOptions);

    this.ensureVPre();
  }

  ensureVPre() {
    const markdown = this.markdown;

    if (markdown && markdown.renderer && markdown.renderer.rules) {
      const rules = ["code_inline", "code_block", "fence"];
      const rendererRules = markdown.renderer.rules;
      rules.forEach(function(rule) {
        if (typeof rendererRules[rule] === "function") {
          const saved = rendererRules[rule];
          rendererRules[rule] = function() {
            return saved.apply(this, arguments).replace(/(<pre|<code)/g, "$1 v-pre");
          };
        }
      });
    }
  }

  parseCode(source) {
    const self = this;
    const CODE_REG = /```(.*)?[\n\r]([\S\s]+?)[\n\r]```/gim;

    const TMPL_REG = /<template>([\s\S]*)<\/template>/i;
    const SCPT_REG = /<script.*?>([\S\s]+?)<\/script>/i;
    const STLE_REG = /<style.*?>([\S\s]+?)<\/style>/i;

    const IMPORT_REG = /(?:import)(?:\s+((?:[\s\S](?!import))+?)\s+(?:from))?\s+["']([^"']+)["']/i;
    const EXPORT_REG = /export[\s]+?default[\s]*?{([\s\S]*)}/i;

    const LIVES_PREFIX = "privateDemo";
    const LIVES_LIST = [];
    const COMPS_LIST = [];

    let liveIndex = 1;

    const newSource = source.replace(CODE_REG, function(html, tag, content) {
      try {
        if (tag == "vue") {
          // 识别是否为内联
          let vueData = {};
          let _template = TMPL_REG.exec(content);

          if (_template) {
            _template = /^{([\s\S]*?)}$/.exec(JSON.stringify({ template: _template[1] }));
            if (_template) {
              vueData.template = _template[1];
            }
            // esm 解析
            let _script = SCPT_REG.exec(content);

            if (_script) {
              vueData.script = _script[1];

              let _component = EXPORT_REG.exec(vueData.script);

              if (_component) {
                vueData.component = _component[1];
              }
            }

            let _style = STLE_REG.exec(content);

            vueData.style = _style;

            let _compName = `${LIVES_PREFIX}${liveIndex++}`;

            vueData.compName = _compName;

            let _tmplName = utils.toLine(_compName);

            let _compTmpl = `<${_tmplName} ref="${_compName}"/>`;

            LIVES_LIST.push(vueData);

            return _compTmpl;
          }
        } else if (tag == "vue-compnent") {
          // 识别是否为模块
          let vueData = {};
          let _component = IMPORT_REG.exec(content);

          if (_component) {
            vueData.compName = _component[1];
            vueData.compImport = _component[0];

            let _tmplName = utils.toLine(vueData.compName);

            let _compTmpl = `<${_tmplName} ref="${vueData.compName}"/>`;

            COMPS_LIST.push(vueData);

            return _compTmpl;
          }
        }
      } catch (error) {
        console.log(error);
      }

      // 其他返回html
      return html;
    });

    let vueTemplate = this.markdown.render(newSource);
    let vueScript = "";
    let vueCompnent = "";
    let vueStyle = "";

    LIVES_LIST.forEach((vueData) => {
      vueCompnent += `'${vueData.compName}':{${vueData.template},${vueData.component || ""}},`;
      vueStyle += `${vueData.style || ""}`;
    });

    COMPS_LIST.forEach((vueData) => {
      vueCompnent += `'${vueData.compName}': ${vueData.compName}`;
      vueScript += `${vueData.compImport};`;
    });

    vueScript += `export default {components:{${vueCompnent || ""}}}`;

    return `<template><section>${vueTemplate || ""}</section></template>
    <script>${vueScript || ""}</script>
    <style>${vueStyle || ""}</style>
    `;
  }
};
