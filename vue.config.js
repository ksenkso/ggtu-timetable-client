module.exports = {
  pages: {
    index: {
      // точка входа для страницы
      entry: 'src/main.ts',
      // исходный шаблон
      template: 'public/index.html',
      // в результате будет dist/index.html
      filename: 'index.html',
      // когда используется опция title, то <title> в шаблоне
      // должен быть <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Расписание ГГТУ'
    }
  }
};
