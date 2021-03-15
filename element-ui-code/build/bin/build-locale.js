/***
 * 通过babel将es module格式的多语言文件转换为umd格式
 * ***/
var fs = require('fs');
// 这个工具可以使用流式数据创建文件，https://www.npmjs.com/package/file-save
// github地址已经不可用了
var save = require('file-save');
var resolve = require('path').resolve;
// path.basename() 方法会返回 path 的最后一部分
var basename = require('path').basename;
var localePath = resolve(__dirname, '../../src/locale/lang');
// readdirSync方法将返回一个包含“指定目录下所有文件名称”的数组对象，因此readdir方法只读一层
// 这儿保存了lang文件夹下所有的文件名
var fileList = fs.readdirSync(localePath);

// 定义了一个转换函数
var transform = function(filename, name, cb) {
  // 使用babel的transformFile方法
  require('babel-core').transformFile(resolve(localePath, filename), {
    plugins: [
      'add-module-exports',
      ['transform-es2015-modules-umd', {loose: true}]
    ],
    moduleId: name
  }, cb);
};

// 遍历所有文件
fileList
  .filter(function(file) {
    return /\.js$/.test(file);
  })
  .forEach(function(file) {
    var name = basename(file, '.js');

     // 调用转换函数，将转换后的代码写入到 lib/umd/locale 目录下
    transform(file, name, function(err, result) {
      if (err) {
        console.error(err);
      } else {
        var code = result.code;

        code = code
          .replace('define(\'', 'define(\'element/locale/')
          .replace('global.', 'global.ELEMENT.lang = global.ELEMENT.lang || {}; \n    global.ELEMENT.lang.');
        save(resolve(__dirname, '../../lib/umd/locale', file)).write(code);

        console.log(file);
      }
    });
  });
