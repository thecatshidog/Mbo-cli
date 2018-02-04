const Metalsmith = require('metalsmith');
const Handlebars = require('handlebars');
const rm = require('rimraf').sync;
const chalk = require('chalk');

module.exports = function (metadata = {}, src, dest = '.') {
  Metalsmith(process.cwd())
    .metadata(metadata)
    .clean(false)
    .source(src)
    .destination(dest)
    .use((files, metalsmith, done) => {
      const meta = metalsmith.metadata();
      Object.keys(files).forEach((fileName) => {
        if (fileName.indexOf('DS_Store') === -1) {
          const t = files[fileName].contents.toString();
          files[fileName].contents = new Buffer(Handlebars.compile(t)(meta));
        }
      })
      done();
    }).build((err) => {
      rm(src);
      rm('./cache');
      if (err) {
        console.log(`${chalk.red(err)}`)
        return err;
      }
    })
}
