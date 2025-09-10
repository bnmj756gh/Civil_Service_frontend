import * as path from 'path';

import * as express from 'express';
import * as nunjucks from 'nunjucks';

export class Nunjucks {
  constructor(public developmentMode: boolean) {
    this.developmentMode = developmentMode;
  }

  enableFor(app: express.Express): void {
    app.set('view engine', 'njk');
    const env = nunjucks.configure(path.join(__dirname, '..', '..', 'views'), {
      autoescape: true,
      watch: this.developmentMode,
      express: app,
    });

 // Add date filter
    env.addFilter('date', function(date: string | Date, format: string) {
      if (!date) return '';

      const d = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(d.getTime())) return '';

      // Simple date formatting - supports common PHP-like format tokens
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      let result = format;
      result = result.replace('j', d.getDate().toString());
      result = result.replace('M', months[d.getMonth()]);
      result = result.replace('Y', d.getFullYear().toString());
      result = result.replace('g', (d.getHours() % 12 || 12).toString());
      result = result.replace('i', d.getMinutes().toString().padStart(2, '0'));
      result = result.replace('a', d.getHours() >= 12 ? 'pm' : 'am');

      return result;
    });

    app.use((req, res, next) => {
      res.locals.pagePath = req.path;
      next();
    });
  }
}
