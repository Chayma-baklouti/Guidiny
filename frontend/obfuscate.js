const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const dir = path.join(__dirname, 'build', 'static', 'js');

fs.readdirSync(dir)
  .filter(f => f.endsWith('.js'))
  .forEach(file => {
    const full = path.join(dir, file);
    const code = fs.readFileSync(full, 'utf8');
    const result = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      identifierNamesGenerator: 'hexadecimal',
      stringArray: true,
      stringArrayThreshold: 0.5,
      controlFlowFlattening: false,  
      deadCodeInjection: false,     
      selfDefending: false,
      sourceMap: false,
    });
    fs.writeFileSync(full, result.getObfuscatedCode());
    console.log('Obfusqué :', file);
  });