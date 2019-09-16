// Core modules
const fs = require('fs');
const http = require('http');
const url = require('url');

// Third party modules
const slugify = require('slugify');

// Own modules
const replaceTemplate = require('./modules/replaceTemplate');

// ************************ SERVER
// fs.readFile('./dev-data/data.json')
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);
const slugs = dataObject.map(element => slugify(element.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
    // ES6 Destructuring
    const { query, pathname } = url.parse(req.url, true);
    // const pathname = req.url;

    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        // array
        // const cardsHtml = dataObject.map(element => replaceTemplate(templateCard, element))
        // join all elements with string
        const cardsHtml = dataObject.map(element => replaceTemplate(templateCard, element)).join('');

        // replace the placeholder with cards
        const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.writeHead(200, { 'Content-type': 'text/html' });
        res.end(output);
    }

    // Product page
    else if (pathname === '/product') {
        // console.log(query);
        const product = dataObject[query.id];
        const output = replaceTemplate(templateProduct, product);
        res.writeHead(200, { 'Content-type': 'text/html' });
        res.end(output);
    }

    // API
    else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data);
    }

    // Not found
    else {
        // send headers always before the response
        res.writeHead(404, {
            // headers : piece of information about the response
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});
