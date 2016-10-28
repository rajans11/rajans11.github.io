const Handlebars = require('handlebars');

module.exports = {
  layout: (opts) => {
      if(opts.hash.columns > 4) throw new Handlebars.Exception('Max number of columns is 4');
      let alpha = opts.data.index % opts.hash.columns === 0 ? 'alpha' : '';
      let columns = `skycom-${12/opts.hash.columns}`;
      return new Handlebars.SafeString(
        `<li class="${columns} ${alpha}">${opts.hash.contents}</li>`
      );
  }
}
