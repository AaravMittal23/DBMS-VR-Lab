const fs = require('fs');

// Patch app.js
let appJs = fs.readFileSync('app.js', 'utf8');
appJs = appJs.replace(
  "const sqlInput = document.getElementById('ddl-input') || document.getElementById('dml-input') || document.getElementById('terminal-input');",
  "const sqlInput = document.getElementById('ddl-input') || document.getElementById('dml-input') || document.getElementById('terminal-input') || document.getElementById('join-input') || document.getElementById('customQuery') || document.getElementById('vi-input');"
);
fs.writeFileSync('app.js', appJs);

// Patch Exp 4
let exp4 = fs.readFileSync('data/experiment-4/simulation.js', 'utf8');
exp4 = exp4.replace(
  "document.getElementById('join-input').value = joinExamples[index];",
  "document.getElementById('join-input').value = joinExamples[index];\n  if (window.sqlEditor) window.sqlEditor.setValue(joinExamples[index]);"
);
fs.writeFileSync('data/experiment-4/simulation.js', exp4);

// Patch Exp 5
let exp5 = fs.readFileSync('data/experiment-5/simulation.js', 'utf8');
exp5 = exp5.replace(
  "if (textarea) textarea.value = '';",
  "if (textarea) textarea.value = '';\n  if (window.sqlEditor) window.sqlEditor.setValue('');"
);
exp5 = exp5.replace(
  "textarea.value = query;",
  "textarea.value = query;\n  if (window.sqlEditor) window.sqlEditor.setValue(query);"
);
fs.writeFileSync('data/experiment-5/simulation.js', exp5);

// Patch Exp 8
let exp8 = fs.readFileSync('data/experiment-8/simulation.js', 'utf8');
exp8 = exp8.replace(
  "document.getElementById('vi-input').value = viExamples[index];",
  "document.getElementById('vi-input').value = viExamples[index];\n  if (window.sqlEditor) window.sqlEditor.setValue(viExamples[index]);"
);
exp8 = exp8.replace(
  "document.getElementById('vi-input').value = '';",
  "document.getElementById('vi-input').value = '';\n  if (window.sqlEditor) window.sqlEditor.setValue('');"
);
fs.writeFileSync('data/experiment-8/simulation.js', exp8);

console.log("Patched all simulation scripts successfully!");
