/*****************************************************************************
 * PARSER
 *
 * The parser returns a Javascript object that is the root node of the
 * abstract syntax tree (AST). That node will typically contain references
 * to other AST nodes. Each node has a "type" property that indicates what
 * type of node it is. The value of "type" indicates what other properties
 * are also present in the node. The valid types and the additional fields
 * they come with are:
 *
 * - varIdent: variable identifier. field "ident" is string
 * - literal: fields "kind" (e.g. number, string) and "value"
 * - binding: a binding of expression to name. fields "ident" string and
 *   "expr" expression
 * - op: application of operator. fields are "op" string and "args" array
 *   of expressions. interpretation of "args" depends on "op" value.
 *   importantly, function application is considered an operator
 * - yield: field "expr" is expression
 *
 * An "expression" or "expression tree" is an AST (sub)tree rooted with a
 * node of type varIdent, literal, or op.
 *
 * Leaf nodes of expression trees are either "varIdent" or "literal" nodes,
 * and internal nodes of expression trees are always "op" nodes. In other
 * words, operators are used to make new expressions out of other expressions.
 ****************************************************************************/

{

  // first is an expression. rest is an array of two-element [op, expr] arrays
  function nestBinOps(first, rest) {
    var result = first;

    for (var i = 0; i < rest.length; i++) {
      result = {
        type: 'op',
        op: rest[i][0],
        args: [result].concat(rest[i][1]),
      };
    }

    return result;
  }

  // ops is an array of ops in order of appearance, to be applied to expr
  function nestPrefixOps(ops, expr) {
    var result = expr;

    for (var i = ops.length-1; i >= 0; i--) {
      result = {
        type: 'op',
        op: ops[i],
        args: [result],
      };
    }

    return result;
  }
}

/*****************************************************************************
 * START RULE
 *
 * This must be the first rule in the file.
 ****************************************************************************/

start
  = program

/*****************************************************************************
 * WHITESPACE RULES
 ****************************************************************************/

whitechar
  = [ \t\n\r]

_ "whitespace"
  = whitechar*

/*****************************************************************************
 * MISC/UTILITY RULES
 *
 * These rules are not whitespace or lexemes but are used to build lexemes.
 ****************************************************************************/

decimal
  = [0-9]+

/*****************************************************************************
 * (WRAPPED) LEXEME RULES
 *
 * Rules starting here are lexemes wrapped in optional whitespace.
 * Rules in this section and before correspond to the lexical analysis stage.
 * Rules in this section don't return AST objects. They return nothing, or strings/numbers/etc.
 ****************************************************************************/

number
  = _ "-"? decimal? "." decimal _ { return parseFloat(text()); }
  / _ "-"? decimal _ { return parseFloat(text()); }

identifier
  = _ first:[_a-z]i rest:[_a-z0-9]i* _ { return first + rest.join(''); }

var_identifier
  = identifier

kw_yield
  = _ "yield" _

kw_if
  = _ "if" _

kw_then
  = _ "then" _

kw_else
  = _ "else" _

comma
  = _ "," _

equal
  = _ "=" _

open_paren
  = _ "(" _

close_paren
  = _ ")" _

dot
  = _ "." _

op_uplus
  = _ "+" _

op_uminus
  = _ "-" _

op_bitnot
  = _ "~" _

op_mul
  = _ "*" _

op_div
  = _ "/" _

op_add
  = _ "+" _

op_sub
  = _ "-" _

/*****************************************************************************
 * PHRASE RULES
 *
 * Rules starting here don't deal with tokenization/lexical analysis.
 * Whitespace is not considered, and there are no literals in parsing expressions.
 * Rules are only written in terms of (wrapped) lexeme rules or other phrase rules.
 ****************************************************************************/

/*************************************
 * HIGH LEVEL STRUCTURE
 ************************************/

program
  = topBody:function_body { return topBody; }

function_body
  = parts:function_body_part+ { return parts; }

function_body_part
  = kw_yield expr:expression { return {type: 'yield', expr: expr}; }
  / ident:var_identifier equal expr:expression { return {type: 'binding', ident: ident, expr: expr}; }

/*************************************
 * EXPRESSIONS
 *
 * From high precendence to low.
 * Rules tend to build on ones above.
 ************************************/

primary_expr
  = open_paren expr:expression close_paren { return expr; }
  // TODO: function definition
  / number:number { return {type: 'literal', kind: 'number', value: number}; }
  / kw_if condition:expression kw_then consequent:expression kw_else alternative:expression { return {type: 'op', op: 'ifte', args: [condition, consequent, alternative]}; }
  / ident:var_identifier { return {type: 'varIdent', ident: ident}; }

access_call_expr
  = first:primary_expr rest:(argList:parenth_arg_list { return {internal: 'app', argList: argList}; } / ident:dot_access { return {internal: 'dot', ident: ident}; })* {
    var result = first;

    for (var i = 0; i < rest.length; i++) {
      if (rest[i].internal === 'app') {
        result = {
          type: 'op',
          op: 'app',
          args: [result].concat(rest[i].argList),
        };
      } else if (rest[i].internal === 'dot') {
        result = {
          type: 'op',
          op: 'prop',
          args: [
            result,
            {type: 'literal', kind: 'string', value: rest[i].ident},
          ],
        };
      } else {
        throw new Error('internal error');
      }
    }

    return result;
  }

numeric_prefix_op
  = op_uplus { return 'uplus'; }
  / op_uminus { return 'uminus'; }
  / op_bitnot { return 'bitnot'; }

numeric_prefix_expr
  = ops:(numeric_prefix_op)* expr:access_call_expr { return nestPrefixOps(ops, expr); }

multiplicative_op
  = op_mul { return 'mul'; }
  / op_div { return 'div'; }

multiplicative_expr
  = first:numeric_prefix_expr rest:(multiplicative_op numeric_prefix_expr)* { return nestBinOps(first, rest); }

additive_op
  = op_add { return 'add'; }
  / op_sub { return 'sub'; }

additive_expr
  = first:multiplicative_expr rest:(additive_op multiplicative_expr)* { return nestBinOps(first, rest); }

expression = additive_expr

/*************************************
 * HELPERS
 ************************************/

// this the right hand of a property access via dot, e.g. ".length"
dot_access
  = dot ident:var_identifier { return ident; }

parenth_arg_list
  = open_paren argList:arg_list close_paren { return argList; }

// This returns an array of expression objects.
arg_list
  = first:expression comma rest:arg_list { return [first].concat(rest); }
  / expr:expression { return [expr]; }
