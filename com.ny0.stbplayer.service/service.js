// Local header-injecting proxy (ES5 for old webOS Node). Port 8899 by default.
var http=require('http'),https=require('https'),url=require('url');
var PORT=+process.env.STB_PORT||8899,srv=null;
function up(u,h,res,n){
  var p=url.parse(u),m=p.protocol==='https:'?https:http;
  var r=m.request({hostname:p.hostname,port:p.port,path:p.path,method:'GET',headers:h,rejectUnauthorized:false},function(s){
    if(s.statusCode>300&&s.statusCode<400&&s.headers.location&&n<5){s.resume();return up(url.resolve(u,s.headers.location),h,res,n+1);}
    var o={'Access-Control-Allow-Origin':'*'};
    ['content-type','content-length','content-range','accept-ranges'].forEach(function(k){if(s.headers[k])o[k]=s.headers[k];});
    res.writeHead(s.statusCode,o);s.pipe(res);
  });
  res.on('close',function(){r.abort();});
  r.on('error',function(e){try{res.writeHead(502,{'Access-Control-Allow-Origin':'*'});res.end(String(e));}catch(x){}});
  r.end();
}
function start(){
  if(srv)return;
  srv=http.createServer(function(q,res){
    var p=url.parse(q.url,true).query;
    if(q.url.indexOf('/ping')===0){res.writeHead(200,{'Access-Control-Allow-Origin':'*'});return res.end('ok');}
    if(!p.u){res.writeHead(400);return res.end();}
    var h={'User-Agent':p.ua||'Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3 (KHTML, like Gecko) MAG200 stbapp ver: 2 rev: 250 Safari/533.3',
      'X-User-Agent':'Model: '+(p.model||'MAG250')+'; Link: Ethernet','Cookie':'mac='+p.mac+'; stb_lang=en; timezone='+(p.tz||'Europe/London'),
      'Accept':'*/*','Connection':'keep-alive'};
    if(p.tok)h.Authorization='Bearer '+p.tok;
    if(q.headers.range)h.Range=q.headers.range;
    up(p.u,h,res,0);
  }).listen(PORT,'127.0.0.1');
}
if(process.argv.indexOf('--standalone')>-1){start();}
else{
  var S=require('webos-service'),s=new S('com.ny0.stbplayer.service');
  s.register('start',function(m){start();m.respond({returnValue:true});});
  s.activityManager.create('keepAlive',function(){});
}
