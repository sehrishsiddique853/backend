const http = require('http');
const fs = require('fs');
const url = require('url');

let serialNumber = 1;

const logRequest = (reqUrl, queryCount) => {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0];
  const logEntry = `${serialNumber++}, ${timeStr}, ${dateStr}, ${reqUrl}, ${queryCount}\n`;
  fs.appendFile('log.txt', logEntry, (err) => {
    if (err) console.error('Logging failed:', err);
  });
};

const appendToFile = (filename, data) => {
  fs.appendFile(filename, data + '\n', (err) => {
    if (err) console.error(`Failed to append to ${filename}:`, err);
  });
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  const queryCount = Object.keys(query).length;

  // Log every request
  logRequest(req.url, queryCount);

  if (pathname === '/') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Welcome to the Home Page!');
  } else if (pathname === '/users') {
    // Expected query: id, name, age, city, uni
    const {id, name, age, city, uni} = query;
    if (id && name && age && city && uni) {
      const line = `${id}, ${name}, ${age}, ${city}, ${uni}`;
      appendToFile('users.txt', line);
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('User info appended.');
    } else {
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.end('Missing user query parameters.');
    }
  } else if (pathname === '/products') {
    // Expected query: id, title, price
    const {id, title, price} = query;
    if (id && title && price) {
      const line = `${id}, ${title}, ${price}`;
      appendToFile('products.txt', line);
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Product info appended.');
    } else {
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.end('Missing product query parameters.');
    }
  } else if (pathname === '/books') {
    // Expected query: id, title, edition, year, press
    const {id, title, edition, year, press} = query;
    if (id && title && edition && year && press) {
      const line = `${id}, ${title}, ${edition}, ${year}, ${press}`;
      appendToFile('books.txt', line);
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Book info appended.');
    } else {
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.end('Missing book query parameters.');
    }
  } else if (pathname === '/display') {
    // Show contents of all three files in plain text
    res.writeHead(200, {'Content-Type': 'text/plain'});
    
    // Read all files asynchronously
    fs.readFile('users.txt', 'utf8', (errUsers, usersData) => {
      if (errUsers) usersData = 'users.txt not found or empty.\n';
      
      fs.readFile('products.txt', 'utf8', (errProd, prodData) => {
        if (errProd) prodData = 'products.txt not found or empty.\n';
        
        fs.readFile('books.txt', 'utf8', (errBooks, booksData) => {
          if (errBooks) booksData = 'books.txt not found or empty.\n';
          
          res.end(
            'Users:\n' + usersData + '\n' +
            'Products:\n' + prodData + '\n' +
            'Books:\n' + booksData + '\n'
          );
        });
      });
    });
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Route not found');
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
