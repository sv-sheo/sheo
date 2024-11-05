

M.handlebars.registerHelper('if_cond', function (v1, operator, v2, options) {

  switch (operator) {
      case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
          return options.inverse(this);
  }
});

M.handlebars.registerHelper('red_header', (text) => {
    
    return '<h1 style="color:crimson;">' + text + '</h1>';
    
});

M.handlebars.registerHelper('table', function(data, id) {
  var str = '<table id="items">';
  for (var item in data ) {
    str += '<tr>';
    for (var key in data[item]) {
      if(key === 'my_key') str += '<td>' + data[item][key] + '</td>';
    };
    str += '</tr>';
  };
  str += '</table>';

  return new M.handlebars.SafeString (str);
});