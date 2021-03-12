/***
 * 监听/examples/pages/template下的模板文件，当文件发生变化时，自动执行npm run i18n
 * 生成新的多语言.vue文件
 * ***/
const path = require('path');
// process.cwd() 方法会返回 Node.js 进程的当前工作目录。
const templates = path.resolve(process.cwd(), './examples/pages/template');

const chokidar = require('chokidar');
let watcher = chokidar.watch([templates]);

watcher.on('ready', function() {
  watcher
    .on('change', function() {
      exec('npm run i18n');
    });
});

function exec(cmd) {
  return require('child_process').execSync(cmd).toString().trim();
}
