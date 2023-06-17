require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let bodyParser = require('body-parser');
const dns = require('dns');



// Basic Configuration
const port = process.env.PORT || 3000;
//store tiny
var storeWeb=[];

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  console.log("que traes");
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});




/*pa recibir datos */

app.get('/api/shorturl/:shorturl', function(req, res) {
  
  var toLongHtml = req.params.shorturl*1;
  //var toLongHtml = req.params
  //console.log("1: "+toLongHtml); 
 //  console.log(typeof toLongHtml);
  //res.redirect(toLongHtml);
  /*res.json({
       saludo: 'que' 
      });*/
  res.redirect(storeWeb[toLongHtml-1])
});

/*post*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function checkURL(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname;

    dns.lookup(host, (err, address, family) => {
      if (err) {
        console.error('Error al realizar la consulta DNS:', err);
        resolve(false); // La consulta DNS falló, se resuelve con false
      } else {
        console.log('Dirección IP:', address);
        console.log('Familia de direcciones:', family);
        resolve(true); // La consulta DNS fue exitosa, se resuelve con true
      }
    });
  });
}


function shortenUrl(url) {
  storeWeb.push(url);
  return storeWeb.length
}

app.post('/api/shorturl', async function(req, res) {
  const longUrl = req.body.url;
  console.log(longUrl);

  if (await checkURL(longUrl)) {
    res.json({
      original_url: longUrl,
      short_url: shortenUrl(longUrl)
    });
  } else {
    res.json({
      error: 'invalid url'
    });
  }
});
  

