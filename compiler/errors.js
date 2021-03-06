'use strict';

function RindelError() {
  // not to be called directly, just base class for instanceof
}
RindelError.prototype = Object.create(Error.prototype);
RindelError.prototype.constructor = RindelError;

// based on http://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript
function deriveErrorClass(base, name, init) {
  function E(message) {
    this.name = name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error()).stack;
    }
    this.message = message;
    if (init) { init.apply(this, arguments); }
  }
  E.prototype = Object.create(base.prototype);
  E.prototype.name = name;
  E.prototype.constructor = E;
  return E;
}

var InternalError = deriveErrorClass(RindelError, 'InternalError');
var SyntaxError = deriveErrorClass(RindelError, 'SyntaxError');
var ParseError = deriveErrorClass(RindelError, 'ParseError');
var NameResolutionError = deriveErrorClass(RindelError, 'NameResolutionError');
var CycleError = deriveErrorClass(RindelError, 'CycleError');
var RebindingError = deriveErrorClass(RindelError, 'RebindingError');
var CircularBindingError = deriveErrorClass(RindelError, 'CircularBindingError');

module.exports = {
  RindelError: RindelError,
  deriveErrorClass: deriveErrorClass,

  SyntaxError: SyntaxError,
  InternalError: InternalError,
  ParseError: ParseError,
  NameResolutionError: NameResolutionError,
  CycleError: CycleError,
  RebindingError: RebindingError,
  CircularBindingError: CircularBindingError,
};
