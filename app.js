// required modules and declare express variable
var express               = require('express');
var bodyParser            = require('body-parser');
var app                   = express();
var colors                = require('colors');
var http                  = require('http');
var fs                    = require('fs-extra');
var WebSocketServer       = require("ws").Server
var gulp                  = require('gulp')
var watch                 = require('node-watch');
var exec                  = require('child_process').exec;
var mongodb               = require('mongodb');
var MongoClient           = mongodb.MongoClient;
var os                    = require('os');

// set express render engine
app.set('view engine', 'pug');
app.set('views', './app/Front');

app.use(express.static('./app/Front'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var server = http.createServer(app);
var url = 'mongodb://localhost:27017/E2E';

function timeConversion(seconds) {
        var minutes = (seconds / 60).toFixed(1);
        var hours = (seconds / (60 * 60)).toFixed(1);
        var days = (seconds / (60 * 60 * 24)).toFixed(1);
        if (seconds < 60) {
            return seconds + " Sec";
        } else if (minutes < 60) {
            return minutes + " Min";
        } else if (hours < 24) {
            return hours + " Hrs";
        } else {
            return days + " Days"
        }
};

function previousTime(program, id) {
    var dir = './app/results/'+program+'/'+id+'/jasmine-test-results.json'
    var previousTime = 0;
    var date = new Date();
    var finalDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear();
    var finalTime = date.getHours() + 'hr' + date.getMinutes();
    if(fs.existsSync(dir)){
      var results = fs.readJSONSync(dir);
    if (results) {
        for (var suite in results) {
            if (results[suite].specs[0].duration != undefined)
                {
                        for (var i = results[suite].specs.length - 1; i >= 0; i--) {
                            // Attention les yeux!!!
                            previousTime += parseInt(results[suite].specs[i].duration.split(' ')[0], 10);
                        };
            }
        }
    };
      fs.writeFileSync('./app/results/'+program+'/'+id+'/previous.json', '{"time":"'+timeConversion(previousTime)+'","date":"'+finalDate+'","minutes":"'+finalTime+'"}');
    } else {
      fs.writeFileSync('./app/results/'+program+'/'+id+'/previous.json', '{"time":"First run","date":"'+finalDate+'","minutes":"'+finalTime+'"}');
    }
};


MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);
    var port = process.env.PORT || 3030;
    var resultCol = db.collection('results');


  server.listen(port, function() {
    console.log(colors.green("## End2End testing server launched on port "+port+" ##" ));
  });

  app.get('/', function (req, res) {
    res.render('landing', {
      pagetitle: 'E2E | Home'
    });
  });


  app.get('/results/:program', function (req, res) {
    //  read this from DB add error if program does not exist in db
    resultCol.find({program: req.params.program}).sort({testDate: -1}).toArray(function (err, result) {
      if (err){
        res.render('results', {
          state: 'error',
          results : '',
          prevTime : '',
          user : '',
          pagetitle: 'E2E | Result error'
        });
        console.log(err);
      } else if (result.length) {
        res.render('results', {
          state: 'results',
          results : result[0].results,
          prevTime : result[0].time,
          user : result[0].user,
          pagetitle: 'E2E | '+req.params.program+' results'

        });
        console.log('results found');
      } else {
        res.render('results', {
          state: 'noResults',
          results : '',
          prevTime : '',
          user : '',
          program : req.params.program,
          pagetitle: 'E2E | '+req.params.program+' results'
        });
        console.log('no results found');
      }
    })

  });

  var storeResults =  function (program, id) {
    console.log('put into results');
    var results = fs.readJSONSync('./app/results/'+program+'/'+id+'/jasmine-test-results.json');
    previousTime(program,id);
    var time = fs.readJSONSync('./app/results/'+program+'/'+id+'/previous.json');
    // console.log(program,id,results);
    var testresult = {
      user: id,
      program: program,
      results: results,
      time: time,
      testing: 'done',
      testDate: new Date()
    };
    resultCol.insert(testresult, function(err, inserted) {
          if(err) {
            console.error(err);
          } else {
            console.error('inserted');
          }
    })

  };



  app.post('/results', function (req, res) {
    if (req.body.test === 'start') {
      console.log('start test');
      var dir = './app/results/'+req.body.program+'/'+req.body.id;
       if(!fs.existsSync(dir)){
          var date = new Date();
          var finalDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear();
          var finalTime = date.getHours() + 'hr' + date.getMinutes();
          console.error('directory does not exist');
          fs.mkdirp(dir, function(err) {
           fs.outputJson('./app/results/'+req.body.program+'/'+req.body.id+'/progress.json',{}, function(){
              fs.outputJson('./app/results/'+req.body.program+'/'+req.body.id+'/previous.json',{"time":"First run","date":finalDate,"minutes":finalTime}, function(){
                socket(req.body.program, req.body.id);
                var previousTestTime = fs.readJSONSync('./app/results/'+req.body.program+'/'+req.body.id+'/previous.json');
                res.render('results', {
                  state: 'inProgress',
                  results : '',
                  prevTime : previousTestTime,
                  program : req.body.program,
                  pagetitle: 'E2E | Tests in progress'
                });
              });
           });

          });
        } else {
          socket(req.body.program, req.body.id);
          var previousTestTime = fs.readJSONSync('./app/results/'+req.body.program+'/'+req.body.id+'/previous.json');
            res.render('results', {
              state: 'inProgress',
              results : '',
              prevTime : previousTestTime,
              program : req.body.program,
              pagetitle: 'E2E | Tests in progress'
            });
          console.log('directory exist');
        }

      var child = exec('gulp protractor --program '+req.body.program+' --id '+req.body.id+' --angular '+req.body.angular,
      (error, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        if (error !== null) {
          console.log(`exec error: ${error}`);
        }
      });

  }

  });




var wss = new WebSocketServer({server: server});
var ws;
console.log("websocket server created");

var socket = function(program, id) {
  wss.on("connection", function(_ws) {
    ws = _ws;
    console.log('connection opened for '+program);
      watch('./app/results/'+program+'/'+id+'/progress.json', function(filename) {
        var progressfile = fs.readJSONSync('./app/results/'+program+'/'+id+'/progress.json');
        if (progressfile.status == 'passed') {
          storeResults(program, id);
          if (ws.readyState === 1) {
              ws.send(JSON.stringify({
                "id":id,
                "program":program,
                "progress": progressfile
              }));
          }
        } else {
          if (ws.readyState === 1){
              ws.send(JSON.stringify({
                "id":id,
                "program":program,
                "progress": progressfile
              }));
          }
        }
      });




   _ws.on("close", function() {
      console.log("websocket connection close");
    })
  })
}

app.get('*', function (req, res, next) {
      var err = new Error();
      err.status = 404;
      next(err);
    });

// handling Errors
app.use(function (err, req, res, next) {
  if (err.status !== 404) {
    return next();
  }
});


}});
