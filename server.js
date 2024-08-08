/** Left hand-written server code here for now upon remembering that Vercel is serverless 🤦‍♂️ */

let http   = require('http'),
    fs 	   = require('fs'),
    path   = require('path'),
    config = require('./config.json'),
    jobs   = {
      GET:function(req, res, urlParts, next) {
        /** middlewares that respond to GET requests are called here */
        next&&next.call&&next(req, res)
      }
    },
    mime   = { js: 'application/javascript', css: 'text/css', html:'text/html' },
    cache  = {} /** to store the strings of data read from files */;

http.createServer((req, res, url, parts, data, verb)=>{
  ({ url } = parts =  urlParts(req.url)),
  /** data expected to be sent to the client, this approach does away with res.write */
  data = jobs[verb=req.method](req, res, parts),

  /** the code below could be moved to a job but it is left here to prioritize it */
  url = url==='/' ? 'index.html' : url,
  new Promise((resolve, rej, cached)=>{
    if (data) { resolve(/*dynamic data, exit*/); return; }

    /*(cached=cache[req.url])?resolve(cached):*/fs.readFile(path.join('./', url), (err, buf)=>{
      if(err) rej(err);
      else resolve(cache[req.url]=buf)
    })
  }).then(cached=>{
    
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Content-type': mime[url.split('.').pop()]||''
   }),
   /** return dynamic data or static file that was read */
    res.end(data||cached)
  }).catch((err, str)=>{
    console.log(str='::ERROR:: '+err, [url])
    res.end("An error occured, you may create and use an error page in lieu of this string")
  })
}).listen(config.PORT, _=>{
  console.log("Server listening on ::PORT:: "+ config.PORT)
})


function urlParts(url, params, query, is_html) {
    params = {}, query='',
    (url = decodeURIComponent(url)).replace(/\?[^]*/, e=>((query=e.replace('?', '')).split('&').forEach(e=>params[(e=e.split('='))[0]]=e[1]), '')),
    query &&= '?'+query,
    is_html = !/\.[^]+$/.test(is_html = (url = url.replace(query, '')).split('/').pop())||/\.html$/.test(is_html);
    return {
        params, query, url, is_html
    }
}