const http = require('http');

http.get('http://localhost:8080/?k=' + encodeURIComponent('장안구-창틀코킹'), (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    const lines = body.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('<!-- Card')) {
        console.log(lines[i].trim());
        console.log(lines[i+1].trim());
      }
    }
  });
});
