const esprima = require('esprima');

const CYAN = '\u001B[36m';
const RESET = '\u001B[0m';

module.exports =
  function (source) {
    const tokens = esprima.tokenize(source, {range: true});
    const ids = tokens.filter(x => x.type === 'Identifier');
    const markers = ids.sort((a, b) => {
      return b.range[0] - a.range[0];
    });
    markers.forEach(t => {
      const id = CYAN + t.value + RESET;
      const start = t.range[0];
      const end = t.range[1];
      source = source.slice(0, start) + id + source.slice(end);
    });
    console.log(source);
  };
