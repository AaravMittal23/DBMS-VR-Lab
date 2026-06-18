const { JSDOM } = require("jsdom");
const fs = require("fs");

const html = fs.readFileSync("index.html", "utf8");
const routerJs = fs.readFileSync("router.js", "utf8");
const appJs = fs.readFileSync("app.js", "utf8");
const stateJs = fs.readFileSync("js/state.js", "utf8");
const rendererJs = fs.readFileSync("renderer.js", "utf8");

const dom = new JSDOM(html, { runScripts: "dangerously" });
const window = dom.window;

window.eval(`
  window.CodeMirror = {
    fromTextArea: function() { return { on: function(){}, setOption: function(){} }; }
  };
`);

window.eval(stateJs);
window.eval(routerJs);
window.eval(rendererJs);
window.eval(appJs);

setTimeout(() => {
  const headerBtn = window.document.getElementById('theme-toggle');
  console.log("Is toggle visible in header?", !!headerBtn, headerBtn ? headerBtn.outerHTML : '');
  
  // Navigate to experiment 1 simulation
  window.location.hash = "#/experiment/1/simulation";
  
  setTimeout(() => {
    console.log("SQL Input found?", !!window.document.getElementById('terminal-input'));
    console.log("SQL Editor initialized?", !!window.sqlEditor);
  }, 500);

}, 500);
