var PORT = 8000;
var http = require("http");
var fs = require('fs');
var express = require('express');
var argv = process.argv.splice(2);
var serverPath = "";
var spawn = require('child_process').spawn;

function createBaseFiles(){
    console.log("start create files");

    spawn("mkdir" , [serverPath + "/css"]);
    spawn("mkdir" , [serverPath + "/js"]);

    options = {
        host: 'code.jquery.com' ,
        port: 80 ,
        path: '/jquery.js'
    };

    var request = http.get(options, function(res){
        var imagedata = '';
        res.setEncoding('binary');

        res.on('data', function(chunk){
            imagedata += chunk;
        });

        res.on('end', function(){
            fs.writeFile( serverPath + "/js/jquery.js", imagedata, 'binary', function(err){
                if (err)
                    console.log ('download error: ' , err);
                    spawn("cp" , [ 'file/jquery.js' , serverPath + "/js"]);
                console.log("download jquery last version success.");
                startServer(serverPath);
            });
        });
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

function startServer(dir){
    var app = express();
    app.configure( function(){
        app.set('port', PORT);
        app.use(express.cookieParser());
        app.use(express.directory(dir));
        app.use(express.static(dir));
    });
    http.createServer(app).listen( PORT , function(){
        console.log( 'start server on :' + dir);
    });
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
                startServer(serverPath);
            }else{
                throw err;
            }
        }else{
            console.log (serverPath + " dir create success!");
            createBaseFiles();
        }
    });
}