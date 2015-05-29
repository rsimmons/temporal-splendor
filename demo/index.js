'use strict';

var fs = require('fs'); // for loading demos
var Runtime = require('../runtime');
var Compiler = require('../compiler');

var demoProgsMap = {};
var demoProgsList = [];

var demoProgsData = fs.readFileSync(__dirname + '/progs.txt', 'utf8');

var demoProgsDataList = demoProgsData.split('\n=====\n');
for (var i = 0; i < demoProgsDataList.length; i++) {
  var progFields = demoProgsDataList[i].split('\n---\n');
  if (progFields.length !== 3) {
    throw new Error('Problem loading demo programs');
  }
  var title = progFields[0].trim();
  var source = progFields[1].trim();
  var commentary = progFields[2].trim();

  var progInfo = {
    title: title,
    source: source,
    commentary: commentary,
  };

  demoProgsMap[title] = progInfo;
  demoProgsList.push(progInfo);
}

var initialDateNow = Date.now();
var runtime;
var rootLexEnv;
var timeoutID;
var currentResult;
var inputValues = {
  mouseX: 0,
  mouseY: 0,
  mouseDown: false,
}
var internals;

function getMasterTime() {
  return 0.001*(Date.now() - initialDateNow);
}

// "run" the runtime as necessary
function tryRunning() {
  if (!runtime.isRunnable()) {
    return;
  }

  var t = getMasterTime();
  var nextTime = runtime.runToTime(t);

  if (nextTime && !timeoutID) {
    timeoutID = window.setTimeout(function() {
      timeoutID = null;
      updateInternalsDisplay();
      tryRunning();
    }, 1000*(nextTime-t));
    updateInternalsDisplay();
  }
}

document.addEventListener('mousemove', function(e) {
  var t = getMasterTime();
  inputValues.mouseX = e.clientX||e.pageX;
  inputValues.mouseY = e.clientY||e.pageY;
  // console.log('mouse', t, mouseX, mouseY);
  rootLexEnv.mouseX.changeValue(inputValues.mouseX, t);
  rootLexEnv.mouseY.changeValue(inputValues.mouseY, t);
  rootLexEnv.mousePos.changeValue({x: inputValues.mouseX, y: inputValues.mouseY}, t);

  tryRunning();
}, false);

document.addEventListener('mousedown', function(e) {
  if (e.button === 0) {
    var t = getMasterTime();
    inputValues.mouseDown = true;
    rootLexEnv.mouseDown.changeValue(inputValues.mouseDown, t);
    tryRunning();
  }
}, false);

document.addEventListener('mouseup', function(e) {
  if (e.button === 0) {
    var t = getMasterTime();
    inputValues.mouseDown = false;
    rootLexEnv.mouseDown.changeValue(inputValues.mouseDown, t);
    tryRunning();
  }
}, false);

function updateInternalsDisplay() {
  var internalsText = [];
  internalsText.push('Output changes: ' + internals.outputChanges);
  internalsText.push('JS timeout outstanding: ' + !!timeoutID);

  document.getElementById('internals-notes').innerHTML = internalsText.join('<br>');
}

function witnessOutput(atTime) {
  var value = currentResult.outputStream.value;

  internals.outputChanges += 1;
  updateInternalsDisplay();

  // console.log('output is', value, 'at master time', atTime);

  var squareElem = document.getElementById('square');
  // squareElem.style.left = (value - 17) + 'px';
  // squareElem.style.top = '100px';
  squareElem.style.left = (value.x + 1) + 'px';
  squareElem.style.top = (value.y + 1) + 'px';
}

function startCompiledProgram(mainFunc) {
  if (currentResult) {
    // deactivate current running program
    currentResult.deactivator();

    // remove trigger on output
    runtime.removeTrigger(currentResult.outputStream, witnessOutput);

    // remove any timeout that's set
    if (timeoutID) {
      window.clearTimeout(timeoutID);
      timeoutID = null;

      updateInternalsDisplay();
    }

    // begin sanity checking

    // make sure its not runnable
    if (runtime.isRunnable()) {
      throw new Error('something went wrong');
    }

    // make sure there are no triggers on global streams
    for (var k in rootLexEnv) {
      if (rootLexEnv[k].triggers.length > 0) {
        throw new Error('something went wrong');
      }
    }

    // end sanity checking
  }

  runtime = new Runtime();

  // add some "global" inputs to root lexical environment
  rootLexEnv = runtime.createLexEnv({
    mouseX: runtime.createStepStream(inputValues.mouseX, 0),
    mouseY: runtime.createStepStream(inputValues.mouseY, 0),
    mousePos: runtime.createStepStream({x: inputValues.mouseX, y: inputValues.mouseY}, 0),
    mouseDown: runtime.createStepStream(inputValues.mouseDown, 0),
  });

  // add all builtins to root lexical environment
  for (var k in runtime.builtins) {
    rootLexEnv[k] = runtime.createConstStream(runtime.builtins[k], 0);
  }

  // initialize internals
  internals = {
    outputChanges: 0,
  };
  updateInternalsDisplay();

  // assume main activator definition has been generated by compiler
  currentResult = mainFunc(runtime, 0, [], null, '', rootLexEnv);

  witnessOutput(0);

  runtime.addTrigger(currentResult.outputStream, witnessOutput);

  tryRunning();
}

function compileAndStartProgram(code) {
  var mainFuncSrc = Compiler.compile(code);
  console.log('compiled to JS:');
  console.log(mainFuncSrc);
  var mainFunc = eval(mainFuncSrc);
  startCompiledProgram(mainFunc);
}

function startDemoProg(progInfo) {
  document.getElementById('code-column-editor').value = progInfo.source;
  document.getElementById('code-column-commentary').innerHTML = progInfo.commentary || '';
  compileAndStartProgram(progInfo.source);
}

function createDemoControls() {
  var demosListElem = document.getElementById('demos-list');

  for (var i = 0; i < demoProgsList.length; i++) {
    var info = demoProgsList[i];
    var li = document.createElement('LI');
    li.setAttribute('class', 'demo-choice');
    li.appendChild(document.createTextNode(info.title));
    demosListElem.appendChild(li);
  }
  demosListElem.firstChild.classList.add('demo-active');

  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('demo-choice')) {
      // update UI
      for (var i = 0; i < demosListElem.childNodes.length; i++) {
        demosListElem.childNodes[i].classList.remove('demo-active');
      }
      e.target.classList.add('demo-active');

      // run program
      var title = e.target.textContent;
      var progInfo = demoProgsMap[title];
      startDemoProg(progInfo);
    }
  }, false);

  document.getElementById('compile-button').addEventListener('click', function(e) {
    compileAndStartProgram(document.getElementById('code-column-editor').value);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  createDemoControls();

  startDemoProg(demoProgsList[0]);
});
