var PORT = 8000;
var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var mime = require("./mime").types;
var config = require("./config");
var zlib = require("zlib");
var argv = process.argv.splice(2);
var serverPath = "";
var spawn = require('child_process').spawn;

var server = http.createServer(function(request, response) {
    response.setHeader("Server", "SimpleHTTPServer");
    var pathname = url.parse(request.url).pathname;
    // console.log(pathname);
    if (pathname.slice(-1) === "/") {
        pathname = pathname + config.Welcome.file;
    }
    if(!serverPath){
        console.log("error!  have no server path!!");
        return;
    }
    var realPath = path.join(serverPath, path.normalize(pathname.replace(/\.\./g, "")));

    var pathHandle = function (realPath) {
        fs.stat(realPath, function (err, stats) {
            if (err) {
                response.writeHead(404, "Not Found", {'Content-Type': 'text/plain'});
                response.write("This request URL " + pathname + " was not found on this server.");
                response.end();
            } else {
                if (stats.isDirectory()) {
                    realPath = path.join(realPath, "/", config.Welcome.file);
                    pathHandle(realPath);
                } else {
                    var ext = path.extname(realPath);
                    ext = ext ? ext.slice(1) : 'unknown';
                    var contentType = mime[ext] || "text/plain";
                    response.setHeader("Content-Type", contentType);

                    var lastModified = stats.mtime.toUTCString();
                    var ifModifiedSince = "If-Modified-Since".toLowerCase();
                    response.setHeader("Last-Modified", lastModified);

                    if (ext.match(config.Expires.fileMatch)) {
                        var expires = new Date();
                        expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
                        response.setHeader("Expires", expires.toUTCString());
                        response.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);
                    }

                    if (request.headers[ifModifiedSince] && lastModified == request.headers[ifModifiedSince]) {
                        response.writeHead(304, "Not Modified");
                        response.end();
                    } else {
                        var raw = fs.createReadStream(realPath);
                        var acceptEncoding = request.headers['accept-encoding'] || "";
                        var matched = ext.match(config.Compress.match);

                        if (matched && acceptEncoding.match(/\bgzip\b/)) {
                            response.writeHead(200, "Ok", {'Content-Encoding': 'gzip'});
                            raw.pipe(zlib.createGzip()).pipe(response);
                        } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
                            response.writeHead(200, "Ok", {'Content-Encoding': 'deflate'});
                            raw.pipe(zlib.createDeflate()).pipe(response);
                        } else {
                            response.writeHead(200, "Ok");
                            raw.pipe(response);
                        }
                    }
                }
            }
        });
    };

    pathHandle(realPath);
});

function createBaseFiles(){
    //todo
    console.log("start create files");

    spawn("mkdir" , [serverPath + "/css"]);
    spawn("mkdir" , [serverPath + "/js"]);

    wget = spawn("wget" , [
        '-P'  //where to place
        , serverPath + "/js/"  //dir to place
        , "http://code.jquery.com/jquery.js"  // what file
    ]);

    wget.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });

    wget.stderr.on('data', function (data) {
      // console.log('stderr: ' + data);
    });

    wget.on('exit', function (code) {
        if (code === 0)
            console.log("download jquery last version success.");

            startServer();
    });

    spawn("touch" , [serverPath + "/css/test.css"]);
    spawn("touch" , [serverPath + "/js/test.js"]);

    //index.html
    var stream = fs.createWriteStream(serverPath + "/index.html");
    stream.once('open', function(fd) {
        stream.write("<html>\n");
        stream.write("<head>\n");
        stream.write("    <link rel='stylesheet' type='text/css' href='css/test.css'>\n");
        stream.write("    <script type='text/javascript' src='js/jquery.js'></script>\n");
        stream.write("    <script type='text/javascript' src='js/test.js'></script>\n");
        stream.write("</head>\n");
        stream.write("<body>\n");
        stream.write("    <h1>try your code!</h1>\n");
        stream.write("</body>\n");
        stream.write("</html>\n");
        stream.end();
    });
}

function startServer(){
    server.listen(PORT);
    console.log("Server runing at port: " + PORT + ".");
}

function rollback(){
    console.log('delete ' , serverPath );
    if(serverPath){
        spawn("rm" , ['-rf' , serverPath]);
    }
}

//create server dir
if(!argv[0]){
    console.log ("error! give me a path !!");
    return;
}else{

    serverPath = argv[0];
    fs.mkdir( serverPath , 0777 , function(err){

        if(err){
            if(err['code'] === 'EEXIST'){
                console.log('dir exist , pass create dir');
                //TODO exist
                startServer();
            }else{
                throw err;
            }
        }else{
            console.log (serverPath + " dir create success!");
            createBaseFiles();
        }
    });
}