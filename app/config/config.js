var JSONReporter = require('jasmine-json-test-reporter');
var SpecReporter = require('jasmine-spec-reporter');
var fs = require('fs-extra');
var specNum = 0;
var testCases;

function myReporter(options){
  this.jasmineStarted = function(suiteInfo) {
    testCases = suiteInfo.totalSpecsDefined;
    fs.outputJson('./app/results/'+browser.params.program+'/'+browser.params.id+'/progress.json', {status:"pending", tests: testCases, passed: specNum}, function (err) {
      if (err) {
        console.log(err)
      }
    })
  },

  this.specDone = function(result) {
    specNum++
    fs.outputJson('./app/results/'+browser.params.program+'/'+browser.params.id+'/progress.json', {status:"pending", tests: testCases, passed: specNum}, function (err) {
      if (err) {
        console.log(err)
      }
    })
  },

  this.jasmineDone = function(result) {
    fs.outputJson('./app/results/'+browser.params.program+'/'+browser.params.id+'/progress.json', {status:"passed", tests: testCases, passed: specNum}, function (err) {
      if (err) {
        console.log(err)
      }
    })
  }

};

exports.config = {
  framework: 'jasmine',
  getPageTimeout: 120000,
  onPrepare: function(){
    global.isAngularSite = function(flag){
        browser.ignoreSynchronization = !flag;
    };
    // add jasmine spec reporter
    jasmine.getEnv().addReporter(new SpecReporter({
      displayStacktrace: 'none',    // display stacktrace for each failed assertion, values: (all|specs|summary|none)
      displayFailuresSummary: false // display summary of all failures after execution
    }));

    jasmine.getEnv().addReporter(new myReporter(
      browser.params
    ));

    jasmine.getEnv().addReporter(new JSONReporter({
        file: './app/results/'+browser.params.program+'/'+browser.params.id+'/jasmine-test-results.json',
        beautify: true,
        indentationLevel: 4 // used if beautify === true
    }));

    if (browser.params.angular == 'true') {
      isAngularSite(true);
    } else {
      isAngularSite(false);
    }

  },
  onCleanup: function(){

  }
}
