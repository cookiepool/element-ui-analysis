/***
 * 自动在 /packages/theme-chalk/src/index.scss|css 中引入各个组件包的样式
 * 在全量注册组件库时需要用到该样式文件，即 import 'packages/theme-chalk/src/index.scss。
 * ***/
var fs = require('fs');
var path = require('path');
var Components = require('../../components.json');
var themes = [
  'theme-chalk'
];
Components = Object.keys(Components);
var basepath = path.resolve(__dirname, '../../packages/');

// 判断这个样式文件是否存在
function fileExists(filePath) {
  try {
    // statSync获取文件状态（判断是否存在）
    // isFile()判断是否是一个普通的文件
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

themes.forEach((theme) => {
  var isSCSS = theme !== 'theme-default';
  var indexContent = isSCSS ? '@import "./base.scss";\n' : '@import "./base.css";\n';
  Components.forEach(function(key) {
    if (['icon', 'option', 'option-group'].indexOf(key) > -1) return;
    var fileName = key + (isSCSS ? '.scss' : '.css');
    indexContent += '@import "./' + fileName + '";\n';
    var filePath = path.resolve(basepath, theme, 'src', fileName);
    // 如果theme-chalk/src下没有指定的文件，则创建一个同名的文件
    if (!fileExists(filePath)) {
      fs.writeFileSync(filePath, '', 'utf8');
      console.log(theme, ' 创建遗漏的 ', fileName, ' 文件');
    }
  });
  // 将内容写入指定文件
  fs.writeFileSync(path.resolve(basepath, theme, 'src', isSCSS ? 'index.scss' : 'index.css'), indexContent);
});
