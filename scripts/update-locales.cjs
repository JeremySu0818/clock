const fs = require('fs');
const path = require('path');
const localesDir = 'd:/TypeScript/clock/src/renderer/src/i18n/locales';
const files = fs.readdirSync(localesDir).filter((f) => f.endsWith('.ts'));
files.forEach((file) => {
  const filePath = path.join(localesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let timeFormatLabel = 'Time format';
  let h12 = '12-hour';
  let h24 = '24-hour';
  if (file === 'zh-TW.ts') {
    timeFormatLabel = '時間格式';
    h12 = '12 小時制';
    h24 = '24 小時制';
  } else if (file === 'zh-CN.ts') {
    timeFormatLabel = '时间格式';
    h12 = '12 小时制';
    h24 = '24 小时制';
  }
  const replacement =
    "    timeFormatLabel: '" +
    timeFormatLabel +
    "',\n    timeFormatOptions: {\n      h12: '" +
    h12 +
    "',\n      h24: '" +
    h24 +
    "',\n    },\n    launchAtLogin:";
  content = content.replace('    launchAtLogin:', replacement);
  fs.writeFileSync(filePath, content);
});
console.log('done');
