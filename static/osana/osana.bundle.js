/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = (Array(19).concat([
/* 19 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rewriteCSS)
/* harmony export */ });
/* harmony import */ var _url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);
// import { parse, walk, generate } from "css-tree";

function rewriteCSS(css, origin) {
    // const ast = parse(css);
    // walk(ast, (node) => {
    //   if (node.type === "Url") {
    //     node.value = rewriteURL(node.value as any, origin) as any;
    //   }
    // });
    // return generate(ast);
    return css = css.replace(/(?<=url\("?'?)[^"'][\S]*[^"'](?="?'?\);?)/g, (0,_url__WEBPACK_IMPORTED_MODULE_0__["default"])('$&', origin));
}


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rewriteURL),
/* harmony export */   "unwriteURL": () => (/* binding */ unwriteURL)
/* harmony export */ });
/* harmony import */ var _js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(21);

function combine(url, path) {
    if (!url.pathname)
        return path;
    url.pathname = url.pathname.replace(/[^/]+?\.[^/]+?$/, "");
    if (/^\//.test(path)) {
        return url.origin + path;
    }
    else if (/^\.\//.test(path)) {
        return url.href.replace(/\/$/, "") + path.replace(/^\./, "");
    }
    else if (/^\.\.\//.test(path)) {
        return url.href.replace(/\/[^/]+?\/?$/, "") + path.replace(/^\.\./, "");
    }
    else {
        return url.href.replace(/\/?$/, "/") + path;
    }
}
function rewriteURL(url, origin) {
    const config = self.__osana$config;
    if (new RegExp(`^${config.prefix}`).test(url))
        return url;
    let fakeLocation;
    if ("window" in self) {
        fakeLocation = new URL(config.codec.decode(location.pathname.replace(new RegExp(`^${config.prefix}`), "")));
    }
    if (origin) {
        fakeLocation = new URL(origin);
    }
    if (/^(#|about|data|mailto):/.test(url)) {
        return url;
    }
    else if (/^javascript:/.test(url)) {
        return `javascript:${(0,_js__WEBPACK_IMPORTED_MODULE_0__["default"])(url.slice('javascript:'.length))}`;
    }
    else {
        if (!fakeLocation)
            return url;
        try {
            return `${config.prefix}${config.codec.encode(new URL(url, fakeLocation.href).href)}`;
        }
        catch (_a) {
            return `${config.prefix}${config.codec.encode(url)}`;
        }
    }
}
function unwriteURL(url) {
    const config = self.__osana$config;
    if (!url)
        return url;
    let newURL;
    if (/^https?:\/\//.test(url)) {
        newURL = new URL(config.codec.decode(new URL(url).pathname.replace(new RegExp(`^${config.prefix}`), "")));
    }
    else {
        newURL = new URL(config.codec.decode(url.replace(new RegExp(`^${config.prefix}`), "")));
    }
    return newURL.href;
}


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rewriteJS)
/* harmony export */ });
/* harmony import */ var meriyah__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);
/* harmony import */ var esotope_hammerhead__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(23);


function rewriteJS(js) {
    let AST = getAST(js);
    AST = walkAST(AST, null, (node, parent) => {
        if (node.type === "MemberExpression") {
            if (parent.type !== "CallExpression") {
                node.object = rewriteNode(node.object);
            }
            else if (node.object.type === "Identifier") {
                if (["location", "localStorage", "sessionStorage"].includes(node.object.name)) {
                    node.object = rewriteNode(node.object);
                }
            }
        }
        // if (node.type === "Identifier") {
        //   if (node.name !== "window") {
        //     if (parent.type !== "MemberExpression") {
        //       node = rewriteNode(node);
        //     }
        //   }
        // }
        return node;
    });
    return (0,esotope_hammerhead__WEBPACK_IMPORTED_MODULE_1__.generate)(AST, {
        format: {
            quotes: 'double'
        }
    });
}
function rewriteNode(node) {
    if (node.type === "Identifier") {
        switch (node.name) {
            case "self":
                node.name = "__self";
                break;
            case "window":
                node.name = "__window";
                break;
            case "parent":
                node.name = "__parent";
                break;
            case "location":
                node.name = "__location";
                break;
            case "localStorage":
                node.name = "__localStorage";
                break;
            case "sessionStorage":
                node.name = "__sessionStorage";
                break;
            case "top":
                node.name = "__top";
                break;
        }
    }
    return node;
}
function walkAST(AST, parent, handler) {
    if (!AST || typeof AST !== "object")
        return AST;
    AST = handler(AST, parent);
    for (let node in AST) {
        if (Array.isArray(AST[node])) {
            for (let n in AST[node]) {
                AST[node][n] = walkAST(AST[node][n], AST[node], handler);
            }
        }
        else {
            AST[node] = walkAST(AST[node], AST, handler);
        }
    }
    return AST;
}
function getAST(js) {
    try {
        return (0,meriyah__WEBPACK_IMPORTED_MODULE_0__.parseScript)(js, {
            module: true
        });
    }
    catch (error) {
        console.log(error);
        return (0,meriyah__WEBPACK_IMPORTED_MODULE_0__.parseScript)("");
    }
}


/***/ }),
/* 22 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESTree": () => (/* binding */ estree),
/* harmony export */   "parse": () => (/* binding */ parse),
/* harmony export */   "parseModule": () => (/* binding */ parseModule),
/* harmony export */   "parseScript": () => (/* binding */ parseScript),
/* harmony export */   "version": () => (/* binding */ version)
/* harmony export */ });
const errorMessages = {
    [0]: 'Unexpected token',
    [28]: "Unexpected token: '%0'",
    [1]: 'Octal escape sequences are not allowed in strict mode',
    [2]: 'Octal escape sequences are not allowed in template strings',
    [3]: 'Unexpected token `#`',
    [4]: 'Illegal Unicode escape sequence',
    [5]: 'Invalid code point %0',
    [6]: 'Invalid hexadecimal escape sequence',
    [8]: 'Octal literals are not allowed in strict mode',
    [7]: 'Decimal integer literals with a leading zero are forbidden in strict mode',
    [9]: 'Expected number in radix %0',
    [145]: 'Invalid left-hand side assignment to a destructible right-hand side',
    [10]: 'Non-number found after exponent indicator',
    [11]: 'Invalid BigIntLiteral',
    [12]: 'No identifiers allowed directly after numeric literal',
    [13]: 'Escapes \\8 or \\9 are not syntactically valid escapes',
    [14]: 'Unterminated string literal',
    [15]: 'Unterminated template literal',
    [16]: 'Multiline comment was not closed properly',
    [17]: 'The identifier contained dynamic unicode escape that was not closed',
    [18]: "Illegal character '%0'",
    [19]: 'Missing hexadecimal digits',
    [20]: 'Invalid implicit octal',
    [21]: 'Invalid line break in string literal',
    [22]: 'Only unicode escapes are legal in identifier names',
    [23]: "Expected '%0'",
    [24]: 'Invalid left-hand side in assignment',
    [25]: 'Invalid left-hand side in async arrow',
    [26]: 'Calls to super must be in the "constructor" method of a class expression or class declaration that has a superclass',
    [27]: 'Member access on super must be in a method',
    [29]: 'Await expression not allowed in formal parameter',
    [30]: 'Yield expression not allowed in formal parameter',
    [92]: "Unexpected token: 'escaped keyword'",
    [31]: 'Unary expressions as the left operand of an exponentiation expression must be disambiguated with parentheses',
    [119]: 'Async functions can only be declared at the top level or inside a block',
    [32]: 'Unterminated regular expression',
    [33]: 'Unexpected regular expression flag',
    [34]: "Duplicate regular expression flag '%0'",
    [35]: '%0 functions must have exactly %1 argument%2',
    [36]: 'Setter function argument must not be a rest parameter',
    [37]: '%0 declaration must have a name in this context',
    [38]: 'Function name may not contain any reserved words or be eval or arguments in strict mode',
    [39]: 'The rest operator is missing an argument',
    [40]: 'A getter cannot be a generator',
    [41]: 'A computed property name must be followed by a colon or paren',
    [130]: 'Object literal keys that are strings or numbers must be a method or have a colon',
    [43]: 'Found `* async x(){}` but this should be `async * x(){}`',
    [42]: 'Getters and setters can not be generators',
    [44]: "'%0' can not be generator method",
    [45]: "No line break is allowed after '=>'",
    [46]: 'The left-hand side of the arrow can only be destructed through assignment',
    [47]: 'The binding declaration is not destructible',
    [48]: 'Async arrow can not be followed by new expression',
    [49]: "Classes may not have a static property named 'prototype'",
    [50]: 'Class constructor may not be a %0',
    [51]: 'Duplicate constructor method in class',
    [52]: 'Invalid increment/decrement operand',
    [53]: 'Invalid use of `new` keyword on an increment/decrement expression',
    [54]: '`=>` is an invalid assignment target',
    [55]: 'Rest element may not have a trailing comma',
    [56]: 'Missing initializer in %0 declaration',
    [57]: "'for-%0' loop head declarations can not have an initializer",
    [58]: 'Invalid left-hand side in for-%0 loop: Must have a single binding',
    [59]: 'Invalid shorthand property initializer',
    [60]: 'Property name __proto__ appears more than once in object literal',
    [61]: 'Let is disallowed as a lexically bound name',
    [62]: "Invalid use of '%0' inside new expression",
    [63]: "Illegal 'use strict' directive in function with non-simple parameter list",
    [64]: 'Identifier "let" disallowed as left-hand side expression in strict mode',
    [65]: 'Illegal continue statement',
    [66]: 'Illegal break statement',
    [67]: 'Cannot have `let[...]` as a var name in strict mode',
    [68]: 'Invalid destructuring assignment target',
    [69]: 'Rest parameter may not have a default initializer',
    [70]: 'The rest argument must the be last parameter',
    [71]: 'Invalid rest argument',
    [73]: 'In strict mode code, functions can only be declared at top level or inside a block',
    [74]: 'In non-strict mode code, functions can only be declared at top level, inside a block, or as the body of an if statement',
    [75]: 'Without web compatibility enabled functions can not be declared at top level, inside a block, or as the body of an if statement',
    [76]: "Class declaration can't appear in single-statement context",
    [77]: 'Invalid left-hand side in for-%0',
    [78]: 'Invalid assignment in for-%0',
    [79]: 'for await (... of ...) is only valid in async functions and async generators',
    [80]: 'The first token after the template expression should be a continuation of the template',
    [82]: '`let` declaration not allowed here and `let` cannot be a regular var name in strict mode',
    [81]: '`let \n [` is a restricted production at the start of a statement',
    [83]: 'Catch clause requires exactly one parameter, not more (and no trailing comma)',
    [84]: 'Catch clause parameter does not support default values',
    [85]: 'Missing catch or finally after try',
    [86]: 'More than one default clause in switch statement',
    [87]: 'Illegal newline after throw',
    [88]: 'Strict mode code may not include a with statement',
    [89]: 'Illegal return statement',
    [90]: 'The left hand side of the for-header binding declaration is not destructible',
    [91]: 'new.target only allowed within functions',
    [93]: "'#' not followed by identifier",
    [99]: 'Invalid keyword',
    [98]: "Can not use 'let' as a class name",
    [97]: "'A lexical declaration can't define a 'let' binding",
    [96]: 'Can not use `let` as variable name in strict mode',
    [94]: "'%0' may not be used as an identifier in this context",
    [95]: 'Await is only valid in async functions',
    [100]: 'The %0 keyword can only be used with the module goal',
    [101]: 'Unicode codepoint must not be greater than 0x10FFFF',
    [102]: '%0 source must be string',
    [103]: 'Only a identifier can be used to indicate alias',
    [104]: "Only '*' or '{...}' can be imported after default",
    [105]: 'Trailing decorator may be followed by method',
    [106]: "Decorators can't be used with a constructor",
    [108]: 'HTML comments are only allowed with web compatibility (Annex B)',
    [109]: "The identifier 'let' must not be in expression position in strict mode",
    [110]: 'Cannot assign to `eval` and `arguments` in strict mode',
    [111]: "The left-hand side of a for-of loop may not start with 'let'",
    [112]: 'Block body arrows can not be immediately invoked without a group',
    [113]: 'Block body arrows can not be immediately accessed without a group',
    [114]: 'Unexpected strict mode reserved word',
    [115]: 'Unexpected eval or arguments in strict mode',
    [116]: 'Decorators must not be followed by a semicolon',
    [117]: 'Calling delete on expression not allowed in strict mode',
    [118]: 'Pattern can not have a tail',
    [120]: 'Can not have a `yield` expression on the left side of a ternary',
    [121]: 'An arrow function can not have a postfix update operator',
    [122]: 'Invalid object literal key character after generator star',
    [123]: 'Private fields can not be deleted',
    [125]: 'Classes may not have a field called constructor',
    [124]: 'Classes may not have a private element named constructor',
    [126]: 'A class field initializer may not contain arguments',
    [127]: 'Generators can only be declared at the top level or inside a block',
    [128]: 'Async methods are a restricted production and cannot have a newline following it',
    [129]: 'Unexpected character after object literal property name',
    [131]: 'Invalid key token',
    [132]: "Label '%0' has already been declared",
    [133]: 'continue statement must be nested within an iteration statement',
    [134]: "Undefined label '%0'",
    [135]: 'Trailing comma is disallowed inside import(...) arguments',
    [136]: 'import() requires exactly one argument',
    [137]: 'Cannot use new with import(...)',
    [138]: '... is not allowed in import()',
    [139]: "Expected '=>'",
    [140]: "Duplicate binding '%0'",
    [141]: "Cannot export a duplicate name '%0'",
    [144]: 'Duplicate %0 for-binding',
    [142]: "Exported binding '%0' needs to refer to a top-level declared variable",
    [143]: 'Unexpected private field',
    [147]: 'Numeric separators are not allowed at the end of numeric literals',
    [146]: 'Only one underscore is allowed as numeric separator',
    [148]: 'JSX value should be either an expression or a quoted JSX text',
    [149]: 'Expected corresponding JSX closing tag for %0',
    [150]: 'Adjacent JSX elements must be wrapped in an enclosing tag',
    [151]: "JSX attributes must only be assigned a non-empty 'expression'",
    [152]: "'%0' has already been declared",
    [153]: "'%0' shadowed a catch clause binding",
    [154]: 'Dot property must be an identifier',
    [155]: 'Encountered invalid input after spread/rest argument',
    [156]: 'Catch without try',
    [157]: 'Finally without try',
    [158]: 'Expected corresponding closing tag for JSX fragment',
    [159]: 'Coalescing and logical operators used together in the same expression must be disambiguated with parentheses',
    [160]: 'Invalid tagged template on optional chain',
    [161]: 'Invalid optional chain from super property',
    [162]: 'Invalid optional chain from new expression',
    [163]: 'Cannot use "import.meta" outside a module',
    [164]: 'Leading decorators must be attached to a class declaration'
};
class ParseError extends SyntaxError {
    constructor(startindex, line, column, type, ...params) {
        const message = '[' + line + ':' + column + ']: ' + errorMessages[type].replace(/%(\d+)/g, (_, i) => params[i]);
        super(`${message}`);
        this.index = startindex;
        this.line = line;
        this.column = column;
        this.description = message;
        this.loc = {
            line,
            column
        };
    }
}
function report(parser, type, ...params) {
    throw new ParseError(parser.index, parser.line, parser.column, type, ...params);
}
function reportScopeError(scope) {
    throw new ParseError(scope.index, scope.line, scope.column, scope.type, scope.params);
}
function reportMessageAt(index, line, column, type, ...params) {
    throw new ParseError(index, line, column, type, ...params);
}
function reportScannerError(index, line, column, type) {
    throw new ParseError(index, line, column, type);
}

const unicodeLookup = ((compressed, lookup) => {
    const result = new Uint32Array(104448);
    let index = 0;
    let subIndex = 0;
    while (index < 3540) {
        const inst = compressed[index++];
        if (inst < 0) {
            subIndex -= inst;
        }
        else {
            let code = compressed[index++];
            if (inst & 2)
                code = lookup[code];
            if (inst & 1) {
                result.fill(code, subIndex, subIndex += compressed[index++]);
            }
            else {
                result[subIndex++] = code;
            }
        }
    }
    return result;
})([-1, 2, 24, 2, 25, 2, 5, -1, 0, 77595648, 3, 44, 2, 3, 0, 14, 2, 57, 2, 58, 3, 0, 3, 0, 3168796671, 0, 4294956992, 2, 1, 2, 0, 2, 59, 3, 0, 4, 0, 4294966523, 3, 0, 4, 2, 16, 2, 60, 2, 0, 0, 4294836735, 0, 3221225471, 0, 4294901942, 2, 61, 0, 134152192, 3, 0, 2, 0, 4294951935, 3, 0, 2, 0, 2683305983, 0, 2684354047, 2, 17, 2, 0, 0, 4294961151, 3, 0, 2, 2, 19, 2, 0, 0, 608174079, 2, 0, 2, 131, 2, 6, 2, 56, -1, 2, 37, 0, 4294443263, 2, 1, 3, 0, 3, 0, 4294901711, 2, 39, 0, 4089839103, 0, 2961209759, 0, 1342439375, 0, 4294543342, 0, 3547201023, 0, 1577204103, 0, 4194240, 0, 4294688750, 2, 2, 0, 80831, 0, 4261478351, 0, 4294549486, 2, 2, 0, 2967484831, 0, 196559, 0, 3594373100, 0, 3288319768, 0, 8469959, 2, 194, 2, 3, 0, 3825204735, 0, 123747807, 0, 65487, 0, 4294828015, 0, 4092591615, 0, 1080049119, 0, 458703, 2, 3, 2, 0, 0, 2163244511, 0, 4227923919, 0, 4236247022, 2, 66, 0, 4284449919, 0, 851904, 2, 4, 2, 11, 0, 67076095, -1, 2, 67, 0, 1073741743, 0, 4093591391, -1, 0, 50331649, 0, 3265266687, 2, 32, 0, 4294844415, 0, 4278190047, 2, 18, 2, 129, -1, 3, 0, 2, 2, 21, 2, 0, 2, 9, 2, 0, 2, 14, 2, 15, 3, 0, 10, 2, 69, 2, 0, 2, 70, 2, 71, 2, 72, 2, 0, 2, 73, 2, 0, 2, 10, 0, 261632, 2, 23, 3, 0, 2, 2, 12, 2, 4, 3, 0, 18, 2, 74, 2, 5, 3, 0, 2, 2, 75, 0, 2088959, 2, 27, 2, 8, 0, 909311, 3, 0, 2, 0, 814743551, 2, 41, 0, 67057664, 3, 0, 2, 2, 40, 2, 0, 2, 28, 2, 0, 2, 29, 2, 7, 0, 268374015, 2, 26, 2, 49, 2, 0, 2, 76, 0, 134153215, -1, 2, 6, 2, 0, 2, 7, 0, 2684354559, 0, 67044351, 0, 3221160064, 0, 1, -1, 3, 0, 2, 2, 42, 0, 1046528, 3, 0, 3, 2, 8, 2, 0, 2, 51, 0, 4294960127, 2, 9, 2, 38, 2, 10, 0, 4294377472, 2, 11, 3, 0, 7, 0, 4227858431, 3, 0, 8, 2, 12, 2, 0, 2, 78, 2, 9, 2, 0, 2, 79, 2, 80, 2, 81, -1, 2, 124, 0, 1048577, 2, 82, 2, 13, -1, 2, 13, 0, 131042, 2, 83, 2, 84, 2, 85, 2, 0, 2, 33, -83, 2, 0, 2, 53, 2, 7, 3, 0, 4, 0, 1046559, 2, 0, 2, 14, 2, 0, 0, 2147516671, 2, 20, 3, 86, 2, 2, 0, -16, 2, 87, 0, 524222462, 2, 4, 2, 0, 0, 4269801471, 2, 4, 2, 0, 2, 15, 2, 77, 2, 16, 3, 0, 2, 2, 47, 2, 0, -1, 2, 17, -16, 3, 0, 206, -2, 3, 0, 655, 2, 18, 3, 0, 36, 2, 68, -1, 2, 17, 2, 9, 3, 0, 8, 2, 89, 2, 121, 2, 0, 0, 3220242431, 3, 0, 3, 2, 19, 2, 90, 2, 91, 3, 0, 2, 2, 92, 2, 0, 2, 93, 2, 94, 2, 0, 0, 4351, 2, 0, 2, 8, 3, 0, 2, 0, 67043391, 0, 3909091327, 2, 0, 2, 22, 2, 8, 2, 18, 3, 0, 2, 0, 67076097, 2, 7, 2, 0, 2, 20, 0, 67059711, 0, 4236247039, 3, 0, 2, 0, 939524103, 0, 8191999, 2, 97, 2, 98, 2, 15, 2, 21, 3, 0, 3, 0, 67057663, 3, 0, 349, 2, 99, 2, 100, 2, 6, -264, 3, 0, 11, 2, 22, 3, 0, 2, 2, 31, -1, 0, 3774349439, 2, 101, 2, 102, 3, 0, 2, 2, 19, 2, 103, 3, 0, 10, 2, 9, 2, 17, 2, 0, 2, 45, 2, 0, 2, 30, 2, 104, 2, 23, 0, 1638399, 2, 172, 2, 105, 3, 0, 3, 2, 18, 2, 24, 2, 25, 2, 5, 2, 26, 2, 0, 2, 7, 2, 106, -1, 2, 107, 2, 108, 2, 109, -1, 3, 0, 3, 2, 11, -2, 2, 0, 2, 27, -3, 2, 150, -4, 2, 18, 2, 0, 2, 35, 0, 1, 2, 0, 2, 62, 2, 28, 2, 11, 2, 9, 2, 0, 2, 110, -1, 3, 0, 4, 2, 9, 2, 21, 2, 111, 2, 6, 2, 0, 2, 112, 2, 0, 2, 48, -4, 3, 0, 9, 2, 20, 2, 29, 2, 30, -4, 2, 113, 2, 114, 2, 29, 2, 20, 2, 7, -2, 2, 115, 2, 29, 2, 31, -2, 2, 0, 2, 116, -2, 0, 4277137519, 0, 2269118463, -1, 3, 18, 2, -1, 2, 32, 2, 36, 2, 0, 3, 29, 2, 2, 34, 2, 19, -3, 3, 0, 2, 2, 33, -1, 2, 0, 2, 34, 2, 0, 2, 34, 2, 0, 2, 46, -10, 2, 0, 0, 203775, -2, 2, 18, 2, 43, 2, 35, -2, 2, 17, 2, 117, 2, 20, 3, 0, 2, 2, 36, 0, 2147549120, 2, 0, 2, 11, 2, 17, 2, 135, 2, 0, 2, 37, 2, 52, 0, 5242879, 3, 0, 2, 0, 402644511, -1, 2, 120, 0, 1090519039, -2, 2, 122, 2, 38, 2, 0, 0, 67045375, 2, 39, 0, 4226678271, 0, 3766565279, 0, 2039759, -4, 3, 0, 2, 0, 3288270847, 0, 3, 3, 0, 2, 0, 67043519, -5, 2, 0, 0, 4282384383, 0, 1056964609, -1, 3, 0, 2, 0, 67043345, -1, 2, 0, 2, 40, 2, 41, -1, 2, 10, 2, 42, -6, 2, 0, 2, 11, -3, 3, 0, 2, 0, 2147484671, 2, 125, 0, 4190109695, 2, 50, -2, 2, 126, 0, 4244635647, 0, 27, 2, 0, 2, 7, 2, 43, 2, 0, 2, 63, -1, 2, 0, 2, 40, -8, 2, 54, 2, 44, 0, 67043329, 2, 127, 2, 45, 0, 8388351, -2, 2, 128, 0, 3028287487, 2, 46, 2, 130, 0, 33259519, 2, 41, -9, 2, 20, -5, 2, 64, -2, 3, 0, 28, 2, 31, -3, 3, 0, 3, 2, 47, 3, 0, 6, 2, 48, -85, 3, 0, 33, 2, 47, -126, 3, 0, 18, 2, 36, -269, 3, 0, 17, 2, 40, 2, 7, 2, 41, -2, 2, 17, 2, 49, 2, 0, 2, 20, 2, 50, 2, 132, 2, 23, -21, 3, 0, 2, -4, 3, 0, 2, 0, 4294936575, 2, 0, 0, 4294934783, -2, 0, 196635, 3, 0, 191, 2, 51, 3, 0, 38, 2, 29, -1, 2, 33, -279, 3, 0, 8, 2, 7, -1, 2, 133, 2, 52, 3, 0, 11, 2, 6, -72, 3, 0, 3, 2, 134, 0, 1677656575, -166, 0, 4161266656, 0, 4071, 0, 15360, -4, 0, 28, -13, 3, 0, 2, 2, 37, 2, 0, 2, 136, 2, 137, 2, 55, 2, 0, 2, 138, 2, 139, 2, 140, 3, 0, 10, 2, 141, 2, 142, 2, 15, 3, 37, 2, 3, 53, 2, 3, 54, 2, 0, 4294954999, 2, 0, -16, 2, 0, 2, 88, 2, 0, 0, 2105343, 0, 4160749584, 0, 65534, -42, 0, 4194303871, 0, 2011, -6, 2, 0, 0, 1073684479, 0, 17407, -11, 2, 0, 2, 31, -40, 3, 0, 6, 0, 8323103, -1, 3, 0, 2, 2, 42, -37, 2, 55, 2, 144, 2, 145, 2, 146, 2, 147, 2, 148, -105, 2, 24, -32, 3, 0, 1334, 2, 9, -1, 3, 0, 129, 2, 27, 3, 0, 6, 2, 9, 3, 0, 180, 2, 149, 3, 0, 233, 0, 1, -96, 3, 0, 16, 2, 9, -47, 3, 0, 154, 2, 56, -22381, 3, 0, 7, 2, 23, -6130, 3, 5, 2, -1, 0, 69207040, 3, 44, 2, 3, 0, 14, 2, 57, 2, 58, -3, 0, 3168731136, 0, 4294956864, 2, 1, 2, 0, 2, 59, 3, 0, 4, 0, 4294966275, 3, 0, 4, 2, 16, 2, 60, 2, 0, 2, 33, -1, 2, 17, 2, 61, -1, 2, 0, 2, 56, 0, 4294885376, 3, 0, 2, 0, 3145727, 0, 2617294944, 0, 4294770688, 2, 23, 2, 62, 3, 0, 2, 0, 131135, 2, 95, 0, 70256639, 0, 71303167, 0, 272, 2, 40, 2, 56, -1, 2, 37, 2, 30, -1, 2, 96, 2, 63, 0, 4278255616, 0, 4294836227, 0, 4294549473, 0, 600178175, 0, 2952806400, 0, 268632067, 0, 4294543328, 0, 57540095, 0, 1577058304, 0, 1835008, 0, 4294688736, 2, 65, 2, 64, 0, 33554435, 2, 123, 2, 65, 2, 151, 0, 131075, 0, 3594373096, 0, 67094296, 2, 64, -1, 0, 4294828000, 0, 603979263, 2, 160, 0, 3, 0, 4294828001, 0, 602930687, 2, 183, 0, 393219, 0, 4294828016, 0, 671088639, 0, 2154840064, 0, 4227858435, 0, 4236247008, 2, 66, 2, 36, -1, 2, 4, 0, 917503, 2, 36, -1, 2, 67, 0, 537788335, 0, 4026531935, -1, 0, 1, -1, 2, 32, 2, 68, 0, 7936, -3, 2, 0, 0, 2147485695, 0, 1010761728, 0, 4292984930, 0, 16387, 2, 0, 2, 14, 2, 15, 3, 0, 10, 2, 69, 2, 0, 2, 70, 2, 71, 2, 72, 2, 0, 2, 73, 2, 0, 2, 11, -1, 2, 23, 3, 0, 2, 2, 12, 2, 4, 3, 0, 18, 2, 74, 2, 5, 3, 0, 2, 2, 75, 0, 253951, 3, 19, 2, 0, 122879, 2, 0, 2, 8, 0, 276824064, -2, 3, 0, 2, 2, 40, 2, 0, 0, 4294903295, 2, 0, 2, 29, 2, 7, -1, 2, 17, 2, 49, 2, 0, 2, 76, 2, 41, -1, 2, 20, 2, 0, 2, 27, -2, 0, 128, -2, 2, 77, 2, 8, 0, 4064, -1, 2, 119, 0, 4227907585, 2, 0, 2, 118, 2, 0, 2, 48, 2, 173, 2, 9, 2, 38, 2, 10, -1, 0, 74440192, 3, 0, 6, -2, 3, 0, 8, 2, 12, 2, 0, 2, 78, 2, 9, 2, 0, 2, 79, 2, 80, 2, 81, -3, 2, 82, 2, 13, -3, 2, 83, 2, 84, 2, 85, 2, 0, 2, 33, -83, 2, 0, 2, 53, 2, 7, 3, 0, 4, 0, 817183, 2, 0, 2, 14, 2, 0, 0, 33023, 2, 20, 3, 86, 2, -17, 2, 87, 0, 524157950, 2, 4, 2, 0, 2, 88, 2, 4, 2, 0, 2, 15, 2, 77, 2, 16, 3, 0, 2, 2, 47, 2, 0, -1, 2, 17, -16, 3, 0, 206, -2, 3, 0, 655, 2, 18, 3, 0, 36, 2, 68, -1, 2, 17, 2, 9, 3, 0, 8, 2, 89, 0, 3072, 2, 0, 0, 2147516415, 2, 9, 3, 0, 2, 2, 23, 2, 90, 2, 91, 3, 0, 2, 2, 92, 2, 0, 2, 93, 2, 94, 0, 4294965179, 0, 7, 2, 0, 2, 8, 2, 91, 2, 8, -1, 0, 1761345536, 2, 95, 0, 4294901823, 2, 36, 2, 18, 2, 96, 2, 34, 2, 166, 0, 2080440287, 2, 0, 2, 33, 2, 143, 0, 3296722943, 2, 0, 0, 1046675455, 0, 939524101, 0, 1837055, 2, 97, 2, 98, 2, 15, 2, 21, 3, 0, 3, 0, 7, 3, 0, 349, 2, 99, 2, 100, 2, 6, -264, 3, 0, 11, 2, 22, 3, 0, 2, 2, 31, -1, 0, 2700607615, 2, 101, 2, 102, 3, 0, 2, 2, 19, 2, 103, 3, 0, 10, 2, 9, 2, 17, 2, 0, 2, 45, 2, 0, 2, 30, 2, 104, -3, 2, 105, 3, 0, 3, 2, 18, -1, 3, 5, 2, 2, 26, 2, 0, 2, 7, 2, 106, -1, 2, 107, 2, 108, 2, 109, -1, 3, 0, 3, 2, 11, -2, 2, 0, 2, 27, -8, 2, 18, 2, 0, 2, 35, -1, 2, 0, 2, 62, 2, 28, 2, 29, 2, 9, 2, 0, 2, 110, -1, 3, 0, 4, 2, 9, 2, 17, 2, 111, 2, 6, 2, 0, 2, 112, 2, 0, 2, 48, -4, 3, 0, 9, 2, 20, 2, 29, 2, 30, -4, 2, 113, 2, 114, 2, 29, 2, 20, 2, 7, -2, 2, 115, 2, 29, 2, 31, -2, 2, 0, 2, 116, -2, 0, 4277075969, 2, 29, -1, 3, 18, 2, -1, 2, 32, 2, 117, 2, 0, 3, 29, 2, 2, 34, 2, 19, -3, 3, 0, 2, 2, 33, -1, 2, 0, 2, 34, 2, 0, 2, 34, 2, 0, 2, 48, -10, 2, 0, 0, 197631, -2, 2, 18, 2, 43, 2, 118, -2, 2, 17, 2, 117, 2, 20, 2, 119, 2, 51, -2, 2, 119, 2, 23, 2, 17, 2, 33, 2, 119, 2, 36, 0, 4294901904, 0, 4718591, 2, 119, 2, 34, 0, 335544350, -1, 2, 120, 2, 121, -2, 2, 122, 2, 38, 2, 7, -1, 2, 123, 2, 65, 0, 3758161920, 0, 3, -4, 2, 0, 2, 27, 0, 2147485568, 0, 3, 2, 0, 2, 23, 0, 176, -5, 2, 0, 2, 47, 2, 186, -1, 2, 0, 2, 23, 2, 197, -1, 2, 0, 0, 16779263, -2, 2, 11, -7, 2, 0, 2, 121, -3, 3, 0, 2, 2, 124, 2, 125, 0, 2147549183, 0, 2, -2, 2, 126, 2, 35, 0, 10, 0, 4294965249, 0, 67633151, 0, 4026597376, 2, 0, 0, 536871935, -1, 2, 0, 2, 40, -8, 2, 54, 2, 47, 0, 1, 2, 127, 2, 23, -3, 2, 128, 2, 35, 2, 129, 2, 130, 0, 16778239, -10, 2, 34, -5, 2, 64, -2, 3, 0, 28, 2, 31, -3, 3, 0, 3, 2, 47, 3, 0, 6, 2, 48, -85, 3, 0, 33, 2, 47, -126, 3, 0, 18, 2, 36, -269, 3, 0, 17, 2, 40, 2, 7, -3, 2, 17, 2, 131, 2, 0, 2, 23, 2, 48, 2, 132, 2, 23, -21, 3, 0, 2, -4, 3, 0, 2, 0, 67583, -1, 2, 103, -2, 0, 11, 3, 0, 191, 2, 51, 3, 0, 38, 2, 29, -1, 2, 33, -279, 3, 0, 8, 2, 7, -1, 2, 133, 2, 52, 3, 0, 11, 2, 6, -72, 3, 0, 3, 2, 134, 2, 135, -187, 3, 0, 2, 2, 37, 2, 0, 2, 136, 2, 137, 2, 55, 2, 0, 2, 138, 2, 139, 2, 140, 3, 0, 10, 2, 141, 2, 142, 2, 15, 3, 37, 2, 3, 53, 2, 3, 54, 2, 2, 143, -73, 2, 0, 0, 1065361407, 0, 16384, -11, 2, 0, 2, 121, -40, 3, 0, 6, 2, 117, -1, 3, 0, 2, 0, 2063, -37, 2, 55, 2, 144, 2, 145, 2, 146, 2, 147, 2, 148, -138, 3, 0, 1334, 2, 9, -1, 3, 0, 129, 2, 27, 3, 0, 6, 2, 9, 3, 0, 180, 2, 149, 3, 0, 233, 0, 1, -96, 3, 0, 16, 2, 9, -47, 3, 0, 154, 2, 56, -28517, 2, 0, 0, 1, -1, 2, 124, 2, 0, 0, 8193, -21, 2, 193, 0, 10255, 0, 4, -11, 2, 64, 2, 171, -1, 0, 71680, -1, 2, 161, 0, 4292900864, 0, 805306431, -5, 2, 150, -1, 2, 157, -1, 0, 6144, -2, 2, 127, -1, 2, 154, -1, 0, 2147532800, 2, 151, 2, 165, 2, 0, 2, 164, 0, 524032, 0, 4, -4, 2, 190, 0, 205128192, 0, 1333757536, 0, 2147483696, 0, 423953, 0, 747766272, 0, 2717763192, 0, 4286578751, 0, 278545, 2, 152, 0, 4294886464, 0, 33292336, 0, 417809, 2, 152, 0, 1327482464, 0, 4278190128, 0, 700594195, 0, 1006647527, 0, 4286497336, 0, 4160749631, 2, 153, 0, 469762560, 0, 4171219488, 0, 8323120, 2, 153, 0, 202375680, 0, 3214918176, 0, 4294508592, 2, 153, -1, 0, 983584, 0, 48, 0, 58720273, 0, 3489923072, 0, 10517376, 0, 4293066815, 0, 1, 0, 2013265920, 2, 177, 2, 0, 0, 2089, 0, 3221225552, 0, 201375904, 2, 0, -2, 0, 256, 0, 122880, 0, 16777216, 2, 150, 0, 4160757760, 2, 0, -6, 2, 167, -11, 0, 3263218176, -1, 0, 49664, 0, 2160197632, 0, 8388802, -1, 0, 12713984, -1, 2, 154, 2, 159, 2, 178, -2, 2, 162, -20, 0, 3758096385, -2, 2, 155, 0, 4292878336, 2, 90, 2, 169, 0, 4294057984, -2, 2, 163, 2, 156, 2, 175, -2, 2, 155, -1, 2, 182, -1, 2, 170, 2, 124, 0, 4026593280, 0, 14, 0, 4292919296, -1, 2, 158, 0, 939588608, -1, 0, 805306368, -1, 2, 124, 0, 1610612736, 2, 156, 2, 157, 2, 4, 2, 0, -2, 2, 158, 2, 159, -3, 0, 267386880, -1, 2, 160, 0, 7168, -1, 0, 65024, 2, 154, 2, 161, 2, 179, -7, 2, 168, -8, 2, 162, -1, 0, 1426112704, 2, 163, -1, 2, 164, 0, 271581216, 0, 2149777408, 2, 23, 2, 161, 2, 124, 0, 851967, 2, 180, -1, 2, 23, 2, 181, -4, 2, 158, -20, 2, 195, 2, 165, -56, 0, 3145728, 2, 185, -4, 2, 166, 2, 124, -4, 0, 32505856, -1, 2, 167, -1, 0, 2147385088, 2, 90, 1, 2155905152, 2, -3, 2, 103, 2, 0, 2, 168, -2, 2, 169, -6, 2, 170, 0, 4026597375, 0, 1, -1, 0, 1, -1, 2, 171, -3, 2, 117, 2, 64, -2, 2, 166, -2, 2, 176, 2, 124, -878, 2, 159, -36, 2, 172, -1, 2, 201, -10, 2, 188, -5, 2, 174, -6, 0, 4294965251, 2, 27, -1, 2, 173, -1, 2, 174, -2, 0, 4227874752, -3, 0, 2146435072, 2, 159, -2, 0, 1006649344, 2, 124, -1, 2, 90, 0, 201375744, -3, 0, 134217720, 2, 90, 0, 4286677377, 0, 32896, -1, 2, 158, -3, 2, 175, -349, 2, 176, 0, 1920, 2, 177, 3, 0, 264, -11, 2, 157, -2, 2, 178, 2, 0, 0, 520617856, 0, 2692743168, 0, 36, -3, 0, 524284, -11, 2, 23, -1, 2, 187, -1, 2, 184, 0, 3221291007, 2, 178, -1, 2, 202, 0, 2158720, -3, 2, 159, 0, 1, -4, 2, 124, 0, 3808625411, 0, 3489628288, 2, 200, 0, 1207959680, 0, 3221274624, 2, 0, -3, 2, 179, 0, 120, 0, 7340032, -2, 2, 180, 2, 4, 2, 23, 2, 163, 3, 0, 4, 2, 159, -1, 2, 181, 2, 177, -1, 0, 8176, 2, 182, 2, 179, 2, 183, -1, 0, 4290773232, 2, 0, -4, 2, 163, 2, 189, 0, 15728640, 2, 177, -1, 2, 161, -1, 0, 4294934512, 3, 0, 4, -9, 2, 90, 2, 170, 2, 184, 3, 0, 4, 0, 704, 0, 1849688064, 2, 185, -1, 2, 124, 0, 4294901887, 2, 0, 0, 130547712, 0, 1879048192, 2, 199, 3, 0, 2, -1, 2, 186, 2, 187, -1, 0, 17829776, 0, 2025848832, 0, 4261477888, -2, 2, 0, -1, 0, 4286580608, -1, 0, 29360128, 2, 192, 0, 16252928, 0, 3791388672, 2, 38, 3, 0, 2, -2, 2, 196, 2, 0, -1, 2, 103, -1, 0, 66584576, -1, 2, 191, 3, 0, 9, 2, 124, -1, 0, 4294755328, 3, 0, 2, -1, 2, 161, 2, 178, 3, 0, 2, 2, 23, 2, 188, 2, 90, -2, 0, 245760, 0, 2147418112, -1, 2, 150, 2, 203, 0, 4227923456, -1, 2, 164, 2, 161, 2, 90, -3, 0, 4292870145, 0, 262144, 2, 124, 3, 0, 2, 0, 1073758848, 2, 189, -1, 0, 4227921920, 2, 190, 0, 68289024, 0, 528402016, 0, 4292927536, 3, 0, 4, -2, 0, 268435456, 2, 91, -2, 2, 191, 3, 0, 5, -1, 2, 192, 2, 163, 2, 0, -2, 0, 4227923936, 2, 62, -1, 2, 155, 2, 95, 2, 0, 2, 154, 2, 158, 3, 0, 6, -1, 2, 177, 3, 0, 3, -2, 0, 2146959360, 0, 9440640, 0, 104857600, 0, 4227923840, 3, 0, 2, 0, 768, 2, 193, 2, 77, -2, 2, 161, -2, 2, 119, -1, 2, 155, 3, 0, 8, 0, 512, 0, 8388608, 2, 194, 2, 172, 2, 187, 0, 4286578944, 3, 0, 2, 0, 1152, 0, 1266679808, 2, 191, 0, 576, 0, 4261707776, 2, 95, 3, 0, 9, 2, 155, 3, 0, 5, 2, 16, -1, 0, 2147221504, -28, 2, 178, 3, 0, 3, -3, 0, 4292902912, -6, 2, 96, 3, 0, 85, -33, 0, 4294934528, 3, 0, 126, -18, 2, 195, 3, 0, 269, -17, 2, 155, 2, 124, 2, 198, 3, 0, 2, 2, 23, 0, 4290822144, -2, 0, 67174336, 0, 520093700, 2, 17, 3, 0, 21, -2, 2, 179, 3, 0, 3, -2, 0, 30720, -1, 0, 32512, 3, 0, 2, 0, 4294770656, -191, 2, 174, -38, 2, 170, 2, 0, 2, 196, 3, 0, 279, -8, 2, 124, 2, 0, 0, 4294508543, 0, 65295, -11, 2, 177, 3, 0, 72, -3, 0, 3758159872, 0, 201391616, 3, 0, 155, -7, 2, 170, -1, 0, 384, -1, 0, 133693440, -3, 2, 196, -2, 2, 26, 3, 0, 4, 2, 169, -2, 2, 90, 2, 155, 3, 0, 4, -2, 2, 164, -1, 2, 150, 0, 335552923, 2, 197, -1, 0, 538974272, 0, 2214592512, 0, 132000, -10, 0, 192, -8, 0, 12288, -21, 0, 134213632, 0, 4294901761, 3, 0, 42, 0, 100663424, 0, 4294965284, 3, 0, 6, -1, 0, 3221282816, 2, 198, 3, 0, 11, -1, 2, 199, 3, 0, 40, -6, 0, 4286578784, 2, 0, -2, 0, 1006694400, 3, 0, 24, 2, 35, -1, 2, 94, 3, 0, 2, 0, 1, 2, 163, 3, 0, 6, 2, 197, 0, 4110942569, 0, 1432950139, 0, 2701658217, 0, 4026532864, 0, 4026532881, 2, 0, 2, 45, 3, 0, 8, -1, 2, 158, -2, 2, 169, 0, 98304, 0, 65537, 2, 170, -5, 0, 4294950912, 2, 0, 2, 118, 0, 65528, 2, 177, 0, 4294770176, 2, 26, 3, 0, 4, -30, 2, 174, 0, 3758153728, -3, 2, 169, -2, 2, 155, 2, 188, 2, 158, -1, 2, 191, -1, 2, 161, 0, 4294754304, 3, 0, 2, -3, 0, 33554432, -2, 2, 200, -3, 2, 169, 0, 4175478784, 2, 201, 0, 4286643712, 0, 4286644216, 2, 0, -4, 2, 202, -1, 2, 165, 0, 4227923967, 3, 0, 32, -1334, 2, 163, 2, 0, -129, 2, 94, -6, 2, 163, -180, 2, 203, -233, 2, 4, 3, 0, 96, -16, 2, 163, 3, 0, 47, -154, 2, 165, 3, 0, 22381, -7, 2, 17, 3, 0, 6128], [4294967295, 4294967291, 4092460543, 4294828031, 4294967294, 134217726, 268435455, 2147483647, 1048575, 1073741823, 3892314111, 134217727, 1061158911, 536805376, 4294910143, 4160749567, 4294901759, 4294901760, 536870911, 262143, 8388607, 4294902783, 4294918143, 65535, 67043328, 2281701374, 4294967232, 2097151, 4294903807, 4194303, 255, 67108863, 4294967039, 511, 524287, 131071, 127, 4292870143, 4294902271, 4294549487, 33554431, 1023, 67047423, 4294901888, 4286578687, 4294770687, 67043583, 32767, 15, 2047999, 67043343, 16777215, 4294902000, 4294934527, 4294966783, 4294967279, 2047, 262083, 20511, 4290772991, 41943039, 493567, 4294959104, 603979775, 65536, 602799615, 805044223, 4294965206, 8191, 1031749119, 4294917631, 2134769663, 4286578493, 4282253311, 4294942719, 33540095, 4294905855, 4294967264, 2868854591, 1608515583, 265232348, 534519807, 2147614720, 1060109444, 4093640016, 17376, 2139062143, 224, 4169138175, 4294909951, 4286578688, 4294967292, 4294965759, 2044, 4292870144, 4294966272, 4294967280, 8289918, 4294934399, 4294901775, 4294965375, 1602223615, 4294967259, 4294443008, 268369920, 4292804608, 486341884, 4294963199, 3087007615, 1073692671, 4128527, 4279238655, 4294902015, 4294966591, 2445279231, 3670015, 3238002687, 31, 63, 4294967288, 4294705151, 4095, 3221208447, 4294549472, 2147483648, 4285526655, 4294966527, 4294705152, 4294966143, 64, 4294966719, 16383, 3774873592, 458752, 536807423, 67043839, 3758096383, 3959414372, 3755993023, 2080374783, 4294835295, 4294967103, 4160749565, 4087, 184024726, 2862017156, 1593309078, 268434431, 268434414, 4294901763, 536870912, 2952790016, 202506752, 139264, 402653184, 4261412864, 4227922944, 49152, 61440, 3758096384, 117440512, 65280, 3233808384, 3221225472, 2097152, 4294965248, 32768, 57152, 67108864, 4293918720, 4290772992, 25165824, 57344, 4227915776, 4278190080, 4227907584, 65520, 4026531840, 4227858432, 4160749568, 3758129152, 4294836224, 63488, 1073741824, 4294967040, 4194304, 251658240, 196608, 4294963200, 64512, 417808, 4227923712, 12582912, 50331648, 65472, 4294967168, 4294966784, 16, 4294917120, 2080374784, 4096, 65408, 524288, 65532]);

function advanceChar(parser) {
    parser.column++;
    return (parser.currentChar = parser.source.charCodeAt(++parser.index));
}
function consumeMultiUnitCodePoint(parser, hi) {
    if ((hi & 0xfc00) !== 55296)
        return 0;
    const lo = parser.source.charCodeAt(parser.index + 1);
    if ((lo & 0xfc00) !== 0xdc00)
        return 0;
    hi = parser.currentChar = 65536 + ((hi & 0x3ff) << 10) + (lo & 0x3ff);
    if (((unicodeLookup[(hi >>> 5) + 0] >>> hi) & 31 & 1) === 0) {
        report(parser, 18, fromCodePoint(hi));
    }
    parser.index++;
    parser.column++;
    return 1;
}
function consumeLineFeed(parser, state) {
    parser.currentChar = parser.source.charCodeAt(++parser.index);
    parser.flags |= 1;
    if ((state & 4) === 0) {
        parser.column = 0;
        parser.line++;
    }
}
function scanNewLine(parser) {
    parser.flags |= 1;
    parser.currentChar = parser.source.charCodeAt(++parser.index);
    parser.column = 0;
    parser.line++;
}
function isExoticECMAScriptWhitespace(ch) {
    return (ch === 160 ||
        ch === 65279 ||
        ch === 133 ||
        ch === 5760 ||
        (ch >= 8192 && ch <= 8203) ||
        ch === 8239 ||
        ch === 8287 ||
        ch === 12288 ||
        ch === 8201 ||
        ch === 65519);
}
function fromCodePoint(codePoint) {
    return codePoint <= 65535
        ? String.fromCharCode(codePoint)
        : String.fromCharCode(codePoint >>> 10) + String.fromCharCode(codePoint & 0x3ff);
}
function toHex(code) {
    return code < 65 ? code - 48 : (code - 65 + 10) & 0xf;
}
function convertTokenType(t) {
    switch (t) {
        case 134283266:
            return 'NumericLiteral';
        case 134283267:
            return 'StringLiteral';
        case 86021:
        case 86022:
            return 'BooleanLiteral';
        case 86023:
            return 'NullLiteral';
        case 65540:
            return 'RegularExpression';
        case 67174408:
        case 67174409:
        case 132:
            return 'TemplateLiteral';
        default:
            if ((t & 143360) === 143360)
                return 'Identifier';
            if ((t & 4096) === 4096)
                return 'Keyword';
            return 'Punctuator';
    }
}

const CharTypes = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    8 | 1024,
    0,
    0,
    8 | 2048,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    8192,
    0,
    1 | 2,
    0,
    0,
    8192,
    0,
    0,
    0,
    256,
    0,
    256 | 32768,
    0,
    0,
    2 | 16 | 128 | 32 | 64,
    2 | 16 | 128 | 32 | 64,
    2 | 16 | 32 | 64,
    2 | 16 | 32 | 64,
    2 | 16 | 32 | 64,
    2 | 16 | 32 | 64,
    2 | 16 | 32 | 64,
    2 | 16 | 32 | 64,
    2 | 16 | 512 | 64,
    2 | 16 | 512 | 64,
    0,
    0,
    16384,
    0,
    0,
    0,
    0,
    1 | 2 | 64,
    1 | 2 | 64,
    1 | 2 | 64,
    1 | 2 | 64,
    1 | 2 | 64,
    1 | 2 | 64,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    0,
    1,
    0,
    0,
    1 | 2 | 4096,
    0,
    1 | 2 | 4 | 64,
    1 | 2 | 4 | 64,
    1 | 2 | 4 | 64,
    1 | 2 | 4 | 64,
    1 | 2 | 4 | 64,
    1 | 2 | 4 | 64,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    16384,
    0,
    0,
    0,
    0
];
const isIdStart = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0
];
const isIdPart = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0
];
function isIdentifierStart(code) {
    return code <= 0x7F
        ? isIdStart[code]
        : (unicodeLookup[(code >>> 5) + 34816] >>> code) & 31 & 1;
}
function isIdentifierPart(code) {
    return code <= 0x7F
        ? isIdPart[code]
        : (unicodeLookup[(code >>> 5) + 0] >>> code) & 31 & 1 || (code === 8204 || code === 8205);
}

const CommentTypes = ['SingleLine', 'MultiLine', 'HTMLOpen', 'HTMLClose', 'HashbangComment'];
function skipHashBang(parser) {
    const source = parser.source;
    if (parser.currentChar === 35 && source.charCodeAt(parser.index + 1) === 33) {
        advanceChar(parser);
        advanceChar(parser);
        skipSingleLineComment(parser, source, 0, 4, parser.tokenPos, parser.linePos, parser.colPos);
    }
}
function skipSingleHTMLComment(parser, source, state, context, type, start, line, column) {
    if (context & 2048)
        report(parser, 0);
    return skipSingleLineComment(parser, source, state, type, start, line, column);
}
function skipSingleLineComment(parser, source, state, type, start, line, column) {
    const { index } = parser;
    parser.tokenPos = parser.index;
    parser.linePos = parser.line;
    parser.colPos = parser.column;
    while (parser.index < parser.end) {
        if (CharTypes[parser.currentChar] & 8) {
            const isCR = parser.currentChar === 13;
            scanNewLine(parser);
            if (isCR && parser.index < parser.end && parser.currentChar === 10)
                parser.currentChar = source.charCodeAt(++parser.index);
            break;
        }
        else if ((parser.currentChar ^ 8232) <= 1) {
            scanNewLine(parser);
            break;
        }
        advanceChar(parser);
        parser.tokenPos = parser.index;
        parser.linePos = parser.line;
        parser.colPos = parser.column;
    }
    if (parser.onComment) {
        const loc = {
            start: {
                line,
                column
            },
            end: {
                line: parser.linePos,
                column: parser.colPos
            }
        };
        parser.onComment(CommentTypes[type & 0xff], source.slice(index, parser.tokenPos), start, parser.tokenPos, loc);
    }
    return state | 1;
}
function skipMultiLineComment(parser, source, state) {
    const { index } = parser;
    while (parser.index < parser.end) {
        if (parser.currentChar < 0x2b) {
            let skippedOneAsterisk = false;
            while (parser.currentChar === 42) {
                if (!skippedOneAsterisk) {
                    state &= ~4;
                    skippedOneAsterisk = true;
                }
                if (advanceChar(parser) === 47) {
                    advanceChar(parser);
                    if (parser.onComment) {
                        const loc = {
                            start: {
                                line: parser.linePos,
                                column: parser.colPos
                            },
                            end: {
                                line: parser.line,
                                column: parser.column
                            }
                        };
                        parser.onComment(CommentTypes[1 & 0xff], source.slice(index, parser.index - 2), index - 2, parser.index, loc);
                    }
                    parser.tokenPos = parser.index;
                    parser.linePos = parser.line;
                    parser.colPos = parser.column;
                    return state;
                }
            }
            if (skippedOneAsterisk) {
                continue;
            }
            if (CharTypes[parser.currentChar] & 8) {
                if (parser.currentChar === 13) {
                    state |= 1 | 4;
                    scanNewLine(parser);
                }
                else {
                    consumeLineFeed(parser, state);
                    state = (state & ~4) | 1;
                }
            }
            else {
                advanceChar(parser);
            }
        }
        else if ((parser.currentChar ^ 8232) <= 1) {
            state = (state & ~4) | 1;
            scanNewLine(parser);
        }
        else {
            state &= ~4;
            advanceChar(parser);
        }
    }
    report(parser, 16);
}

function scanRegularExpression(parser, context) {
    const bodyStart = parser.index;
    let preparseState = 0;
    loop: while (true) {
        const ch = parser.currentChar;
        advanceChar(parser);
        if (preparseState & 1) {
            preparseState &= ~1;
        }
        else {
            switch (ch) {
                case 47:
                    if (!preparseState)
                        break loop;
                    else
                        break;
                case 92:
                    preparseState |= 1;
                    break;
                case 91:
                    preparseState |= 2;
                    break;
                case 93:
                    preparseState &= 1;
                    break;
                case 13:
                case 10:
                case 8232:
                case 8233:
                    report(parser, 32);
            }
        }
        if (parser.index >= parser.source.length) {
            return report(parser, 32);
        }
    }
    const bodyEnd = parser.index - 1;
    let mask = 0;
    let char = parser.currentChar;
    const { index: flagStart } = parser;
    while (isIdentifierPart(char)) {
        switch (char) {
            case 103:
                if (mask & 2)
                    report(parser, 34, 'g');
                mask |= 2;
                break;
            case 105:
                if (mask & 1)
                    report(parser, 34, 'i');
                mask |= 1;
                break;
            case 109:
                if (mask & 4)
                    report(parser, 34, 'm');
                mask |= 4;
                break;
            case 117:
                if (mask & 16)
                    report(parser, 34, 'u');
                mask |= 16;
                break;
            case 121:
                if (mask & 8)
                    report(parser, 34, 'y');
                mask |= 8;
                break;
            case 115:
                if (mask & 32)
                    report(parser, 34, 's');
                mask |= 32;
                break;
            case 100:
                if (mask & 64)
                    report(parser, 34, 'd');
                mask |= 64;
                break;
            default:
                report(parser, 33);
        }
        char = advanceChar(parser);
    }
    const flags = parser.source.slice(flagStart, parser.index);
    const pattern = parser.source.slice(bodyStart, bodyEnd);
    parser.tokenRegExp = { pattern, flags };
    if (context & 512)
        parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
    parser.tokenValue = validate(parser, pattern, flags);
    return 65540;
}
function validate(parser, pattern, flags) {
    try {
        return new RegExp(pattern, flags);
    }
    catch (e) {
        try {
            new RegExp(pattern, flags.replace('d', ''));
            return null;
        }
        catch (e) {
            report(parser, 32);
        }
    }
}

function scanString(parser, context, quote) {
    const { index: start } = parser;
    let ret = '';
    let char = advanceChar(parser);
    let marker = parser.index;
    while ((CharTypes[char] & 8) === 0) {
        if (char === quote) {
            ret += parser.source.slice(marker, parser.index);
            advanceChar(parser);
            if (context & 512)
                parser.tokenRaw = parser.source.slice(start, parser.index);
            parser.tokenValue = ret;
            return 134283267;
        }
        if ((char & 8) === 8 && char === 92) {
            ret += parser.source.slice(marker, parser.index);
            char = advanceChar(parser);
            if (char < 0x7f || char === 8232 || char === 8233) {
                const code = parseEscape(parser, context, char);
                if (code >= 0)
                    ret += fromCodePoint(code);
                else
                    handleStringError(parser, code, 0);
            }
            else {
                ret += fromCodePoint(char);
            }
            marker = parser.index + 1;
        }
        if (parser.index >= parser.end)
            report(parser, 14);
        char = advanceChar(parser);
    }
    report(parser, 14);
}
function parseEscape(parser, context, first) {
    switch (first) {
        case 98:
            return 8;
        case 102:
            return 12;
        case 114:
            return 13;
        case 110:
            return 10;
        case 116:
            return 9;
        case 118:
            return 11;
        case 13: {
            if (parser.index < parser.end) {
                const nextChar = parser.source.charCodeAt(parser.index + 1);
                if (nextChar === 10) {
                    parser.index = parser.index + 1;
                    parser.currentChar = nextChar;
                }
            }
        }
        case 10:
        case 8232:
        case 8233:
            parser.column = -1;
            parser.line++;
            return -1;
        case 48:
        case 49:
        case 50:
        case 51: {
            let code = first - 48;
            let index = parser.index + 1;
            let column = parser.column + 1;
            if (index < parser.end) {
                const next = parser.source.charCodeAt(index);
                if ((CharTypes[next] & 32) === 0) {
                    if ((code !== 0 || CharTypes[next] & 512) && context & 1024)
                        return -2;
                }
                else if (context & 1024) {
                    return -2;
                }
                else {
                    parser.currentChar = next;
                    code = (code << 3) | (next - 48);
                    index++;
                    column++;
                    if (index < parser.end) {
                        const next = parser.source.charCodeAt(index);
                        if (CharTypes[next] & 32) {
                            parser.currentChar = next;
                            code = (code << 3) | (next - 48);
                            index++;
                            column++;
                        }
                    }
                    parser.flags |= 64;
                    parser.index = index - 1;
                    parser.column = column - 1;
                }
            }
            return code;
        }
        case 52:
        case 53:
        case 54:
        case 55: {
            if (context & 1024)
                return -2;
            let code = first - 48;
            const index = parser.index + 1;
            const column = parser.column + 1;
            if (index < parser.end) {
                const next = parser.source.charCodeAt(index);
                if (CharTypes[next] & 32) {
                    code = (code << 3) | (next - 48);
                    parser.currentChar = next;
                    parser.index = index;
                    parser.column = column;
                }
            }
            parser.flags |= 64;
            return code;
        }
        case 120: {
            const ch1 = advanceChar(parser);
            if ((CharTypes[ch1] & 64) === 0)
                return -4;
            const hi = toHex(ch1);
            const ch2 = advanceChar(parser);
            if ((CharTypes[ch2] & 64) === 0)
                return -4;
            const lo = toHex(ch2);
            return (hi << 4) | lo;
        }
        case 117: {
            const ch = advanceChar(parser);
            if (parser.currentChar === 123) {
                let code = 0;
                while ((CharTypes[advanceChar(parser)] & 64) !== 0) {
                    code = (code << 4) | toHex(parser.currentChar);
                    if (code > 1114111)
                        return -5;
                }
                if (parser.currentChar < 1 || parser.currentChar !== 125) {
                    return -4;
                }
                return code;
            }
            else {
                if ((CharTypes[ch] & 64) === 0)
                    return -4;
                const ch2 = parser.source.charCodeAt(parser.index + 1);
                if ((CharTypes[ch2] & 64) === 0)
                    return -4;
                const ch3 = parser.source.charCodeAt(parser.index + 2);
                if ((CharTypes[ch3] & 64) === 0)
                    return -4;
                const ch4 = parser.source.charCodeAt(parser.index + 3);
                if ((CharTypes[ch4] & 64) === 0)
                    return -4;
                parser.index += 3;
                parser.column += 3;
                parser.currentChar = parser.source.charCodeAt(parser.index);
                return (toHex(ch) << 12) | (toHex(ch2) << 8) | (toHex(ch3) << 4) | toHex(ch4);
            }
        }
        case 56:
        case 57:
            if ((context & 256) === 0)
                return -3;
        default:
            return first;
    }
}
function handleStringError(state, code, isTemplate) {
    switch (code) {
        case -1:
            return;
        case -2:
            report(state, isTemplate ? 2 : 1);
        case -3:
            report(state, 13);
        case -4:
            report(state, 6);
        case -5:
            report(state, 101);
    }
}

function scanTemplate(parser, context) {
    const { index: start } = parser;
    let token = 67174409;
    let ret = '';
    let char = advanceChar(parser);
    while (char !== 96) {
        if (char === 36 && parser.source.charCodeAt(parser.index + 1) === 123) {
            advanceChar(parser);
            token = 67174408;
            break;
        }
        else if ((char & 8) === 8 && char === 92) {
            char = advanceChar(parser);
            if (char > 0x7e) {
                ret += fromCodePoint(char);
            }
            else {
                const code = parseEscape(parser, context | 1024, char);
                if (code >= 0) {
                    ret += fromCodePoint(code);
                }
                else if (code !== -1 && context & 65536) {
                    ret = undefined;
                    char = scanBadTemplate(parser, char);
                    if (char < 0)
                        token = 67174408;
                    break;
                }
                else {
                    handleStringError(parser, code, 1);
                }
            }
        }
        else {
            if (parser.index < parser.end &&
                char === 13 &&
                parser.source.charCodeAt(parser.index) === 10) {
                ret += fromCodePoint(char);
                parser.currentChar = parser.source.charCodeAt(++parser.index);
            }
            if (((char & 83) < 3 && char === 10) || (char ^ 8232) <= 1) {
                parser.column = -1;
                parser.line++;
            }
            ret += fromCodePoint(char);
        }
        if (parser.index >= parser.end)
            report(parser, 15);
        char = advanceChar(parser);
    }
    advanceChar(parser);
    parser.tokenValue = ret;
    parser.tokenRaw = parser.source.slice(start + 1, parser.index - (token === 67174409 ? 1 : 2));
    return token;
}
function scanBadTemplate(parser, ch) {
    while (ch !== 96) {
        switch (ch) {
            case 36: {
                const index = parser.index + 1;
                if (index < parser.end && parser.source.charCodeAt(index) === 123) {
                    parser.index = index;
                    parser.column++;
                    return -ch;
                }
                break;
            }
            case 10:
            case 8232:
            case 8233:
                parser.column = -1;
                parser.line++;
        }
        if (parser.index >= parser.end)
            report(parser, 15);
        ch = advanceChar(parser);
    }
    return ch;
}
function scanTemplateTail(parser, context) {
    if (parser.index >= parser.end)
        report(parser, 0);
    parser.index--;
    parser.column--;
    return scanTemplate(parser, context);
}

function scanNumber(parser, context, kind) {
    let char = parser.currentChar;
    let value = 0;
    let digit = 9;
    let atStart = kind & 64 ? 0 : 1;
    let digits = 0;
    let allowSeparator = 0;
    if (kind & 64) {
        value = '.' + scanDecimalDigitsOrSeparator(parser, char);
        char = parser.currentChar;
        if (char === 110)
            report(parser, 11);
    }
    else {
        if (char === 48) {
            char = advanceChar(parser);
            if ((char | 32) === 120) {
                kind = 8 | 128;
                char = advanceChar(parser);
                while (CharTypes[char] & (64 | 4096)) {
                    if (char === 95) {
                        if (!allowSeparator)
                            report(parser, 146);
                        allowSeparator = 0;
                        char = advanceChar(parser);
                        continue;
                    }
                    allowSeparator = 1;
                    value = value * 0x10 + toHex(char);
                    digits++;
                    char = advanceChar(parser);
                }
                if (digits === 0 || !allowSeparator) {
                    report(parser, digits === 0 ? 19 : 147);
                }
            }
            else if ((char | 32) === 111) {
                kind = 4 | 128;
                char = advanceChar(parser);
                while (CharTypes[char] & (32 | 4096)) {
                    if (char === 95) {
                        if (!allowSeparator) {
                            report(parser, 146);
                        }
                        allowSeparator = 0;
                        char = advanceChar(parser);
                        continue;
                    }
                    allowSeparator = 1;
                    value = value * 8 + (char - 48);
                    digits++;
                    char = advanceChar(parser);
                }
                if (digits === 0 || !allowSeparator) {
                    report(parser, digits === 0 ? 0 : 147);
                }
            }
            else if ((char | 32) === 98) {
                kind = 2 | 128;
                char = advanceChar(parser);
                while (CharTypes[char] & (128 | 4096)) {
                    if (char === 95) {
                        if (!allowSeparator) {
                            report(parser, 146);
                        }
                        allowSeparator = 0;
                        char = advanceChar(parser);
                        continue;
                    }
                    allowSeparator = 1;
                    value = value * 2 + (char - 48);
                    digits++;
                    char = advanceChar(parser);
                }
                if (digits === 0 || !allowSeparator) {
                    report(parser, digits === 0 ? 0 : 147);
                }
            }
            else if (CharTypes[char] & 32) {
                if (context & 1024)
                    report(parser, 1);
                kind = 1;
                while (CharTypes[char] & 16) {
                    if (CharTypes[char] & 512) {
                        kind = 32;
                        atStart = 0;
                        break;
                    }
                    value = value * 8 + (char - 48);
                    char = advanceChar(parser);
                }
            }
            else if (CharTypes[char] & 512) {
                if (context & 1024)
                    report(parser, 1);
                parser.flags |= 64;
                kind = 32;
            }
            else if (char === 95) {
                report(parser, 0);
            }
        }
        if (kind & 48) {
            if (atStart) {
                while (digit >= 0 && CharTypes[char] & (16 | 4096)) {
                    if (char === 95) {
                        char = advanceChar(parser);
                        if (char === 95 || kind & 32) {
                            reportScannerError(parser.index, parser.line, parser.index + 1, 146);
                        }
                        allowSeparator = 1;
                        continue;
                    }
                    allowSeparator = 0;
                    value = 10 * value + (char - 48);
                    char = advanceChar(parser);
                    --digit;
                }
                if (allowSeparator) {
                    reportScannerError(parser.index, parser.line, parser.index + 1, 147);
                }
                if (digit >= 0 && !isIdentifierStart(char) && char !== 46) {
                    parser.tokenValue = value;
                    if (context & 512)
                        parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
                    return 134283266;
                }
            }
            value += scanDecimalDigitsOrSeparator(parser, char);
            char = parser.currentChar;
            if (char === 46) {
                if (advanceChar(parser) === 95)
                    report(parser, 0);
                kind = 64;
                value += '.' + scanDecimalDigitsOrSeparator(parser, parser.currentChar);
                char = parser.currentChar;
            }
        }
    }
    const end = parser.index;
    let isBigInt = 0;
    if (char === 110 && kind & 128) {
        isBigInt = 1;
        char = advanceChar(parser);
    }
    else {
        if ((char | 32) === 101) {
            char = advanceChar(parser);
            if (CharTypes[char] & 256)
                char = advanceChar(parser);
            const { index } = parser;
            if ((CharTypes[char] & 16) === 0)
                report(parser, 10);
            value += parser.source.substring(end, index) + scanDecimalDigitsOrSeparator(parser, char);
            char = parser.currentChar;
        }
    }
    if ((parser.index < parser.end && CharTypes[char] & 16) || isIdentifierStart(char)) {
        report(parser, 12);
    }
    if (isBigInt) {
        parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
        parser.tokenValue = BigInt(value);
        return 134283389;
    }
    parser.tokenValue =
        kind & (1 | 2 | 8 | 4)
            ? value
            : kind & 32
                ? parseFloat(parser.source.substring(parser.tokenPos, parser.index))
                : +value;
    if (context & 512)
        parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
    return 134283266;
}
function scanDecimalDigitsOrSeparator(parser, char) {
    let allowSeparator = 0;
    let start = parser.index;
    let ret = '';
    while (CharTypes[char] & (16 | 4096)) {
        if (char === 95) {
            const { index } = parser;
            char = advanceChar(parser);
            if (char === 95) {
                reportScannerError(parser.index, parser.line, parser.index + 1, 146);
            }
            allowSeparator = 1;
            ret += parser.source.substring(start, index);
            start = parser.index;
            continue;
        }
        allowSeparator = 0;
        char = advanceChar(parser);
    }
    if (allowSeparator) {
        reportScannerError(parser.index, parser.line, parser.index + 1, 147);
    }
    return ret + parser.source.substring(start, parser.index);
}

const KeywordDescTable = [
    'end of source',
    'identifier', 'number', 'string', 'regular expression',
    'false', 'true', 'null',
    'template continuation', 'template tail',
    '=>', '(', '{', '.', '...', '}', ')', ';', ',', '[', ']', ':', '?', '\'', '"', '</', '/>',
    '++', '--',
    '=', '<<=', '>>=', '>>>=', '**=', '+=', '-=', '*=', '/=', '%=', '^=', '|=',
    '&=', '||=', '&&=', '??=',
    'typeof', 'delete', 'void', '!', '~', '+', '-', 'in', 'instanceof', '*', '%', '/', '**', '&&',
    '||', '===', '!==', '==', '!=', '<=', '>=', '<', '>', '<<', '>>', '>>>', '&', '|', '^',
    'var', 'let', 'const',
    'break', 'case', 'catch', 'class', 'continue', 'debugger', 'default', 'do', 'else', 'export',
    'extends', 'finally', 'for', 'function', 'if', 'import', 'new', 'return', 'super', 'switch',
    'this', 'throw', 'try', 'while', 'with',
    'implements', 'interface', 'package', 'private', 'protected', 'public', 'static', 'yield',
    'as', 'async', 'await', 'constructor', 'get', 'set', 'from', 'of',
    'enum', 'eval', 'arguments', 'escaped keyword', 'escaped future reserved keyword', 'reserved if strict', '#',
    'BigIntLiteral', '??', '?.', 'WhiteSpace', 'Illegal', 'LineTerminator', 'PrivateField',
    'Template', '@', 'target', 'meta', 'LineFeed', 'Escaped', 'JSXText'
];
const descKeywordTable = Object.create(null, {
    this: { value: 86113 },
    function: { value: 86106 },
    if: { value: 20571 },
    return: { value: 20574 },
    var: { value: 86090 },
    else: { value: 20565 },
    for: { value: 20569 },
    new: { value: 86109 },
    in: { value: 8738868 },
    typeof: { value: 16863277 },
    while: { value: 20580 },
    case: { value: 20558 },
    break: { value: 20557 },
    try: { value: 20579 },
    catch: { value: 20559 },
    delete: { value: 16863278 },
    throw: { value: 86114 },
    switch: { value: 86112 },
    continue: { value: 20561 },
    default: { value: 20563 },
    instanceof: { value: 8476725 },
    do: { value: 20564 },
    void: { value: 16863279 },
    finally: { value: 20568 },
    async: { value: 209007 },
    await: { value: 209008 },
    class: { value: 86096 },
    const: { value: 86092 },
    constructor: { value: 12401 },
    debugger: { value: 20562 },
    export: { value: 20566 },
    extends: { value: 20567 },
    false: { value: 86021 },
    from: { value: 12404 },
    get: { value: 12402 },
    implements: { value: 36966 },
    import: { value: 86108 },
    interface: { value: 36967 },
    let: { value: 241739 },
    null: { value: 86023 },
    of: { value: 274549 },
    package: { value: 36968 },
    private: { value: 36969 },
    protected: { value: 36970 },
    public: { value: 36971 },
    set: { value: 12403 },
    static: { value: 36972 },
    super: { value: 86111 },
    true: { value: 86022 },
    with: { value: 20581 },
    yield: { value: 241773 },
    enum: { value: 86134 },
    eval: { value: 537079927 },
    as: { value: 77934 },
    arguments: { value: 537079928 },
    target: { value: 143494 },
    meta: { value: 143495 },
});

function scanIdentifier(parser, context, isValidAsKeyword) {
    while (isIdPart[advanceChar(parser)]) { }
    parser.tokenValue = parser.source.slice(parser.tokenPos, parser.index);
    return parser.currentChar !== 92 && parser.currentChar < 0x7e
        ? descKeywordTable[parser.tokenValue] || 208897
        : scanIdentifierSlowCase(parser, context, 0, isValidAsKeyword);
}
function scanUnicodeIdentifier(parser, context) {
    const cookedChar = scanIdentifierUnicodeEscape(parser);
    if (!isIdentifierPart(cookedChar))
        report(parser, 4);
    parser.tokenValue = fromCodePoint(cookedChar);
    return scanIdentifierSlowCase(parser, context, 1, CharTypes[cookedChar] & 4);
}
function scanIdentifierSlowCase(parser, context, hasEscape, isValidAsKeyword) {
    let start = parser.index;
    while (parser.index < parser.end) {
        if (parser.currentChar === 92) {
            parser.tokenValue += parser.source.slice(start, parser.index);
            hasEscape = 1;
            const code = scanIdentifierUnicodeEscape(parser);
            if (!isIdentifierPart(code))
                report(parser, 4);
            isValidAsKeyword = isValidAsKeyword && CharTypes[code] & 4;
            parser.tokenValue += fromCodePoint(code);
            start = parser.index;
        }
        else if (isIdentifierPart(parser.currentChar) || consumeMultiUnitCodePoint(parser, parser.currentChar)) {
            advanceChar(parser);
        }
        else {
            break;
        }
    }
    if (parser.index <= parser.end) {
        parser.tokenValue += parser.source.slice(start, parser.index);
    }
    const length = parser.tokenValue.length;
    if (isValidAsKeyword && length >= 2 && length <= 11) {
        const token = descKeywordTable[parser.tokenValue];
        if (token === void 0)
            return 208897;
        if (!hasEscape)
            return token;
        if (context & 1024) {
            return token === 209008 && (context & (2048 | 4194304)) === 0
                ? token
                : token === 36972
                    ? 122
                    : (token & 36864) === 36864
                        ? 122
                        : 121;
        }
        if (context & 1073741824 &&
            (context & 8192) === 0 &&
            (token & 20480) === 20480)
            return token;
        if (token === 241773) {
            return context & 1073741824
                ? 143483
                : context & 2097152
                    ? 121
                    : token;
        }
        return token === 209007 && context & 1073741824
            ? 143483
            : (token & 36864) === 36864
                ? token
                : token === 209008 && (context & 4194304) === 0
                    ? token
                    : 121;
    }
    return 208897;
}
function scanPrivateIdentifier(parser) {
    if (!isIdentifierStart(advanceChar(parser)))
        report(parser, 93);
    return 131;
}
function scanIdentifierUnicodeEscape(parser) {
    if (parser.source.charCodeAt(parser.index + 1) !== 117) {
        report(parser, 4);
    }
    parser.currentChar = parser.source.charCodeAt((parser.index += 2));
    return scanUnicodeEscape(parser);
}
function scanUnicodeEscape(parser) {
    let codePoint = 0;
    const char = parser.currentChar;
    if (char === 123) {
        const begin = parser.index - 2;
        while (CharTypes[advanceChar(parser)] & 64) {
            codePoint = (codePoint << 4) | toHex(parser.currentChar);
            if (codePoint > 1114111)
                reportScannerError(begin, parser.line, parser.index + 1, 101);
        }
        if (parser.currentChar !== 125) {
            reportScannerError(begin, parser.line, parser.index - 1, 6);
        }
        advanceChar(parser);
        return codePoint;
    }
    if ((CharTypes[char] & 64) === 0)
        report(parser, 6);
    const char2 = parser.source.charCodeAt(parser.index + 1);
    if ((CharTypes[char2] & 64) === 0)
        report(parser, 6);
    const char3 = parser.source.charCodeAt(parser.index + 2);
    if ((CharTypes[char3] & 64) === 0)
        report(parser, 6);
    const char4 = parser.source.charCodeAt(parser.index + 3);
    if ((CharTypes[char4] & 64) === 0)
        report(parser, 6);
    codePoint = (toHex(char) << 12) | (toHex(char2) << 8) | (toHex(char3) << 4) | toHex(char4);
    parser.currentChar = parser.source.charCodeAt((parser.index += 4));
    return codePoint;
}

const TokenLookup = [
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    128,
    136,
    128,
    128,
    130,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    128,
    16842800,
    134283267,
    131,
    208897,
    8457015,
    8455751,
    134283267,
    67174411,
    16,
    8457014,
    25233970,
    18,
    25233971,
    67108877,
    8457016,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    21,
    1074790417,
    8456258,
    1077936157,
    8456259,
    22,
    133,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    69271571,
    137,
    20,
    8455497,
    208897,
    132,
    4096,
    4096,
    4096,
    4096,
    4096,
    4096,
    4096,
    208897,
    4096,
    208897,
    208897,
    4096,
    208897,
    4096,
    208897,
    4096,
    208897,
    4096,
    4096,
    4096,
    208897,
    4096,
    4096,
    208897,
    4096,
    4096,
    2162700,
    8455240,
    1074790415,
    16842801,
    129
];
function nextToken(parser, context) {
    parser.flags = (parser.flags | 1) ^ 1;
    parser.startPos = parser.index;
    parser.startColumn = parser.column;
    parser.startLine = parser.line;
    parser.token = scanSingleToken(parser, context, 0);
    if (parser.onToken && parser.token !== 1048576) {
        const loc = {
            start: {
                line: parser.linePos,
                column: parser.colPos
            },
            end: {
                line: parser.line,
                column: parser.column
            }
        };
        parser.onToken(convertTokenType(parser.token), parser.tokenPos, parser.index, loc);
    }
}
function scanSingleToken(parser, context, state) {
    const isStartOfLine = parser.index === 0;
    const source = parser.source;
    let startPos = parser.index;
    let startLine = parser.line;
    let startColumn = parser.column;
    while (parser.index < parser.end) {
        parser.tokenPos = parser.index;
        parser.colPos = parser.column;
        parser.linePos = parser.line;
        let char = parser.currentChar;
        if (char <= 0x7e) {
            const token = TokenLookup[char];
            switch (token) {
                case 67174411:
                case 16:
                case 2162700:
                case 1074790415:
                case 69271571:
                case 20:
                case 21:
                case 1074790417:
                case 18:
                case 16842801:
                case 133:
                case 129:
                    advanceChar(parser);
                    return token;
                case 208897:
                    return scanIdentifier(parser, context, 0);
                case 4096:
                    return scanIdentifier(parser, context, 1);
                case 134283266:
                    return scanNumber(parser, context, 16 | 128);
                case 134283267:
                    return scanString(parser, context, char);
                case 132:
                    return scanTemplate(parser, context);
                case 137:
                    return scanUnicodeIdentifier(parser, context);
                case 131:
                    return scanPrivateIdentifier(parser);
                case 128:
                    advanceChar(parser);
                    break;
                case 130:
                    state |= 1 | 4;
                    scanNewLine(parser);
                    break;
                case 136:
                    consumeLineFeed(parser, state);
                    state = (state & ~4) | 1;
                    break;
                case 8456258:
                    let ch = advanceChar(parser);
                    if (parser.index < parser.end) {
                        if (ch === 60) {
                            if (parser.index < parser.end && advanceChar(parser) === 61) {
                                advanceChar(parser);
                                return 4194334;
                            }
                            return 8456516;
                        }
                        else if (ch === 61) {
                            advanceChar(parser);
                            return 8456256;
                        }
                        if (ch === 33) {
                            const index = parser.index + 1;
                            if (index + 1 < parser.end &&
                                source.charCodeAt(index) === 45 &&
                                source.charCodeAt(index + 1) == 45) {
                                parser.column += 3;
                                parser.currentChar = source.charCodeAt((parser.index += 3));
                                state = skipSingleHTMLComment(parser, source, state, context, 2, parser.tokenPos, parser.linePos, parser.colPos);
                                startPos = parser.tokenPos;
                                startLine = parser.linePos;
                                startColumn = parser.colPos;
                                continue;
                            }
                            return 8456258;
                        }
                        if (ch === 47) {
                            if ((context & 16) === 0)
                                return 8456258;
                            const index = parser.index + 1;
                            if (index < parser.end) {
                                ch = source.charCodeAt(index);
                                if (ch === 42 || ch === 47)
                                    break;
                            }
                            advanceChar(parser);
                            return 25;
                        }
                    }
                    return 8456258;
                case 1077936157: {
                    advanceChar(parser);
                    const ch = parser.currentChar;
                    if (ch === 61) {
                        if (advanceChar(parser) === 61) {
                            advanceChar(parser);
                            return 8455996;
                        }
                        return 8455998;
                    }
                    if (ch === 62) {
                        advanceChar(parser);
                        return 10;
                    }
                    return 1077936157;
                }
                case 16842800:
                    if (advanceChar(parser) !== 61) {
                        return 16842800;
                    }
                    if (advanceChar(parser) !== 61) {
                        return 8455999;
                    }
                    advanceChar(parser);
                    return 8455997;
                case 8457015:
                    if (advanceChar(parser) !== 61)
                        return 8457015;
                    advanceChar(parser);
                    return 4194342;
                case 8457014: {
                    advanceChar(parser);
                    if (parser.index >= parser.end)
                        return 8457014;
                    const ch = parser.currentChar;
                    if (ch === 61) {
                        advanceChar(parser);
                        return 4194340;
                    }
                    if (ch !== 42)
                        return 8457014;
                    if (advanceChar(parser) !== 61)
                        return 8457273;
                    advanceChar(parser);
                    return 4194337;
                }
                case 8455497:
                    if (advanceChar(parser) !== 61)
                        return 8455497;
                    advanceChar(parser);
                    return 4194343;
                case 25233970: {
                    advanceChar(parser);
                    const ch = parser.currentChar;
                    if (ch === 43) {
                        advanceChar(parser);
                        return 33619995;
                    }
                    if (ch === 61) {
                        advanceChar(parser);
                        return 4194338;
                    }
                    return 25233970;
                }
                case 25233971: {
                    advanceChar(parser);
                    const ch = parser.currentChar;
                    if (ch === 45) {
                        advanceChar(parser);
                        if ((state & 1 || isStartOfLine) && parser.currentChar === 62) {
                            if ((context & 256) === 0)
                                report(parser, 108);
                            advanceChar(parser);
                            state = skipSingleHTMLComment(parser, source, state, context, 3, startPos, startLine, startColumn);
                            startPos = parser.tokenPos;
                            startLine = parser.linePos;
                            startColumn = parser.colPos;
                            continue;
                        }
                        return 33619996;
                    }
                    if (ch === 61) {
                        advanceChar(parser);
                        return 4194339;
                    }
                    return 25233971;
                }
                case 8457016: {
                    advanceChar(parser);
                    if (parser.index < parser.end) {
                        const ch = parser.currentChar;
                        if (ch === 47) {
                            advanceChar(parser);
                            state = skipSingleLineComment(parser, source, state, 0, parser.tokenPos, parser.linePos, parser.colPos);
                            startPos = parser.tokenPos;
                            startLine = parser.linePos;
                            startColumn = parser.colPos;
                            continue;
                        }
                        if (ch === 42) {
                            advanceChar(parser);
                            state = skipMultiLineComment(parser, source, state);
                            startPos = parser.tokenPos;
                            startLine = parser.linePos;
                            startColumn = parser.colPos;
                            continue;
                        }
                        if (context & 32768) {
                            return scanRegularExpression(parser, context);
                        }
                        if (ch === 61) {
                            advanceChar(parser);
                            return 4259877;
                        }
                    }
                    return 8457016;
                }
                case 67108877:
                    const next = advanceChar(parser);
                    if (next >= 48 && next <= 57)
                        return scanNumber(parser, context, 64 | 16);
                    if (next === 46) {
                        const index = parser.index + 1;
                        if (index < parser.end && source.charCodeAt(index) === 46) {
                            parser.column += 2;
                            parser.currentChar = source.charCodeAt((parser.index += 2));
                            return 14;
                        }
                    }
                    return 67108877;
                case 8455240: {
                    advanceChar(parser);
                    const ch = parser.currentChar;
                    if (ch === 124) {
                        advanceChar(parser);
                        if (parser.currentChar === 61) {
                            advanceChar(parser);
                            return 4194346;
                        }
                        return 8979003;
                    }
                    if (ch === 61) {
                        advanceChar(parser);
                        return 4194344;
                    }
                    return 8455240;
                }
                case 8456259: {
                    advanceChar(parser);
                    const ch = parser.currentChar;
                    if (ch === 61) {
                        advanceChar(parser);
                        return 8456257;
                    }
                    if (ch !== 62)
                        return 8456259;
                    advanceChar(parser);
                    if (parser.index < parser.end) {
                        const ch = parser.currentChar;
                        if (ch === 62) {
                            if (advanceChar(parser) === 61) {
                                advanceChar(parser);
                                return 4194336;
                            }
                            return 8456518;
                        }
                        if (ch === 61) {
                            advanceChar(parser);
                            return 4194335;
                        }
                    }
                    return 8456517;
                }
                case 8455751: {
                    advanceChar(parser);
                    const ch = parser.currentChar;
                    if (ch === 38) {
                        advanceChar(parser);
                        if (parser.currentChar === 61) {
                            advanceChar(parser);
                            return 4194347;
                        }
                        return 8979258;
                    }
                    if (ch === 61) {
                        advanceChar(parser);
                        return 4194345;
                    }
                    return 8455751;
                }
                case 22: {
                    let ch = advanceChar(parser);
                    if (ch === 63) {
                        advanceChar(parser);
                        if (parser.currentChar === 61) {
                            advanceChar(parser);
                            return 4194348;
                        }
                        return 276889982;
                    }
                    if (ch === 46) {
                        const index = parser.index + 1;
                        if (index < parser.end) {
                            ch = source.charCodeAt(index);
                            if (!(ch >= 48 && ch <= 57)) {
                                advanceChar(parser);
                                return 67108991;
                            }
                        }
                    }
                    return 22;
                }
            }
        }
        else {
            if ((char ^ 8232) <= 1) {
                state = (state & ~4) | 1;
                scanNewLine(parser);
                continue;
            }
            if ((char & 0xfc00) === 0xd800 || ((unicodeLookup[(char >>> 5) + 34816] >>> char) & 31 & 1) !== 0) {
                if ((char & 0xfc00) === 0xdc00) {
                    char = ((char & 0x3ff) << 10) | (char & 0x3ff) | 0x10000;
                    if (((unicodeLookup[(char >>> 5) + 0] >>> char) & 31 & 1) === 0) {
                        report(parser, 18, fromCodePoint(char));
                    }
                    parser.index++;
                    parser.currentChar = char;
                }
                parser.column++;
                parser.tokenValue = '';
                return scanIdentifierSlowCase(parser, context, 0, 0);
            }
            if (isExoticECMAScriptWhitespace(char)) {
                advanceChar(parser);
                continue;
            }
            report(parser, 18, fromCodePoint(char));
        }
    }
    return 1048576;
}

const entities = {
    AElig: '\u00C6',
    AMP: '\u0026',
    Aacute: '\u00C1',
    Abreve: '\u0102',
    Acirc: '\u00C2',
    Acy: '\u0410',
    Afr: '\uD835\uDD04',
    Agrave: '\u00C0',
    Alpha: '\u0391',
    Amacr: '\u0100',
    And: '\u2A53',
    Aogon: '\u0104',
    Aopf: '\uD835\uDD38',
    ApplyFunction: '\u2061',
    Aring: '\u00C5',
    Ascr: '\uD835\uDC9C',
    Assign: '\u2254',
    Atilde: '\u00C3',
    Auml: '\u00C4',
    Backslash: '\u2216',
    Barv: '\u2AE7',
    Barwed: '\u2306',
    Bcy: '\u0411',
    Because: '\u2235',
    Bernoullis: '\u212C',
    Beta: '\u0392',
    Bfr: '\uD835\uDD05',
    Bopf: '\uD835\uDD39',
    Breve: '\u02D8',
    Bscr: '\u212C',
    Bumpeq: '\u224E',
    CHcy: '\u0427',
    COPY: '\u00A9',
    Cacute: '\u0106',
    Cap: '\u22D2',
    CapitalDifferentialD: '\u2145',
    Cayleys: '\u212D',
    Ccaron: '\u010C',
    Ccedil: '\u00C7',
    Ccirc: '\u0108',
    Cconint: '\u2230',
    Cdot: '\u010A',
    Cedilla: '\u00B8',
    CenterDot: '\u00B7',
    Cfr: '\u212D',
    Chi: '\u03A7',
    CircleDot: '\u2299',
    CircleMinus: '\u2296',
    CirclePlus: '\u2295',
    CircleTimes: '\u2297',
    ClockwiseContourIntegral: '\u2232',
    CloseCurlyDoubleQuote: '\u201D',
    CloseCurlyQuote: '\u2019',
    Colon: '\u2237',
    Colone: '\u2A74',
    Congruent: '\u2261',
    Conint: '\u222F',
    ContourIntegral: '\u222E',
    Copf: '\u2102',
    Coproduct: '\u2210',
    CounterClockwiseContourIntegral: '\u2233',
    Cross: '\u2A2F',
    Cscr: '\uD835\uDC9E',
    Cup: '\u22D3',
    CupCap: '\u224D',
    DD: '\u2145',
    DDotrahd: '\u2911',
    DJcy: '\u0402',
    DScy: '\u0405',
    DZcy: '\u040F',
    Dagger: '\u2021',
    Darr: '\u21A1',
    Dashv: '\u2AE4',
    Dcaron: '\u010E',
    Dcy: '\u0414',
    Del: '\u2207',
    Delta: '\u0394',
    Dfr: '\uD835\uDD07',
    DiacriticalAcute: '\u00B4',
    DiacriticalDot: '\u02D9',
    DiacriticalDoubleAcute: '\u02DD',
    DiacriticalGrave: '\u0060',
    DiacriticalTilde: '\u02DC',
    Diamond: '\u22C4',
    DifferentialD: '\u2146',
    Dopf: '\uD835\uDD3B',
    Dot: '\u00A8',
    DotDot: '\u20DC',
    DotEqual: '\u2250',
    DoubleContourIntegral: '\u222F',
    DoubleDot: '\u00A8',
    DoubleDownArrow: '\u21D3',
    DoubleLeftArrow: '\u21D0',
    DoubleLeftRightArrow: '\u21D4',
    DoubleLeftTee: '\u2AE4',
    DoubleLongLeftArrow: '\u27F8',
    DoubleLongLeftRightArrow: '\u27FA',
    DoubleLongRightArrow: '\u27F9',
    DoubleRightArrow: '\u21D2',
    DoubleRightTee: '\u22A8',
    DoubleUpArrow: '\u21D1',
    DoubleUpDownArrow: '\u21D5',
    DoubleVerticalBar: '\u2225',
    DownArrow: '\u2193',
    DownArrowBar: '\u2913',
    DownArrowUpArrow: '\u21F5',
    DownBreve: '\u0311',
    DownLeftRightVector: '\u2950',
    DownLeftTeeVector: '\u295E',
    DownLeftVector: '\u21BD',
    DownLeftVectorBar: '\u2956',
    DownRightTeeVector: '\u295F',
    DownRightVector: '\u21C1',
    DownRightVectorBar: '\u2957',
    DownTee: '\u22A4',
    DownTeeArrow: '\u21A7',
    Downarrow: '\u21D3',
    Dscr: '\uD835\uDC9F',
    Dstrok: '\u0110',
    ENG: '\u014A',
    ETH: '\u00D0',
    Eacute: '\u00C9',
    Ecaron: '\u011A',
    Ecirc: '\u00CA',
    Ecy: '\u042D',
    Edot: '\u0116',
    Efr: '\uD835\uDD08',
    Egrave: '\u00C8',
    Element: '\u2208',
    Emacr: '\u0112',
    EmptySmallSquare: '\u25FB',
    EmptyVerySmallSquare: '\u25AB',
    Eogon: '\u0118',
    Eopf: '\uD835\uDD3C',
    Epsilon: '\u0395',
    Equal: '\u2A75',
    EqualTilde: '\u2242',
    Equilibrium: '\u21CC',
    Escr: '\u2130',
    Esim: '\u2A73',
    Eta: '\u0397',
    Euml: '\u00CB',
    Exists: '\u2203',
    ExponentialE: '\u2147',
    Fcy: '\u0424',
    Ffr: '\uD835\uDD09',
    FilledSmallSquare: '\u25FC',
    FilledVerySmallSquare: '\u25AA',
    Fopf: '\uD835\uDD3D',
    ForAll: '\u2200',
    Fouriertrf: '\u2131',
    Fscr: '\u2131',
    GJcy: '\u0403',
    GT: '\u003E',
    Gamma: '\u0393',
    Gammad: '\u03DC',
    Gbreve: '\u011E',
    Gcedil: '\u0122',
    Gcirc: '\u011C',
    Gcy: '\u0413',
    Gdot: '\u0120',
    Gfr: '\uD835\uDD0A',
    Gg: '\u22D9',
    Gopf: '\uD835\uDD3E',
    GreaterEqual: '\u2265',
    GreaterEqualLess: '\u22DB',
    GreaterFullEqual: '\u2267',
    GreaterGreater: '\u2AA2',
    GreaterLess: '\u2277',
    GreaterSlantEqual: '\u2A7E',
    GreaterTilde: '\u2273',
    Gscr: '\uD835\uDCA2',
    Gt: '\u226B',
    HARDcy: '\u042A',
    Hacek: '\u02C7',
    Hat: '\u005E',
    Hcirc: '\u0124',
    Hfr: '\u210C',
    HilbertSpace: '\u210B',
    Hopf: '\u210D',
    HorizontalLine: '\u2500',
    Hscr: '\u210B',
    Hstrok: '\u0126',
    HumpDownHump: '\u224E',
    HumpEqual: '\u224F',
    IEcy: '\u0415',
    IJlig: '\u0132',
    IOcy: '\u0401',
    Iacute: '\u00CD',
    Icirc: '\u00CE',
    Icy: '\u0418',
    Idot: '\u0130',
    Ifr: '\u2111',
    Igrave: '\u00CC',
    Im: '\u2111',
    Imacr: '\u012A',
    ImaginaryI: '\u2148',
    Implies: '\u21D2',
    Int: '\u222C',
    Integral: '\u222B',
    Intersection: '\u22C2',
    InvisibleComma: '\u2063',
    InvisibleTimes: '\u2062',
    Iogon: '\u012E',
    Iopf: '\uD835\uDD40',
    Iota: '\u0399',
    Iscr: '\u2110',
    Itilde: '\u0128',
    Iukcy: '\u0406',
    Iuml: '\u00CF',
    Jcirc: '\u0134',
    Jcy: '\u0419',
    Jfr: '\uD835\uDD0D',
    Jopf: '\uD835\uDD41',
    Jscr: '\uD835\uDCA5',
    Jsercy: '\u0408',
    Jukcy: '\u0404',
    KHcy: '\u0425',
    KJcy: '\u040C',
    Kappa: '\u039A',
    Kcedil: '\u0136',
    Kcy: '\u041A',
    Kfr: '\uD835\uDD0E',
    Kopf: '\uD835\uDD42',
    Kscr: '\uD835\uDCA6',
    LJcy: '\u0409',
    LT: '\u003C',
    Lacute: '\u0139',
    Lambda: '\u039B',
    Lang: '\u27EA',
    Laplacetrf: '\u2112',
    Larr: '\u219E',
    Lcaron: '\u013D',
    Lcedil: '\u013B',
    Lcy: '\u041B',
    LeftAngleBracket: '\u27E8',
    LeftArrow: '\u2190',
    LeftArrowBar: '\u21E4',
    LeftArrowRightArrow: '\u21C6',
    LeftCeiling: '\u2308',
    LeftDoubleBracket: '\u27E6',
    LeftDownTeeVector: '\u2961',
    LeftDownVector: '\u21C3',
    LeftDownVectorBar: '\u2959',
    LeftFloor: '\u230A',
    LeftRightArrow: '\u2194',
    LeftRightVector: '\u294E',
    LeftTee: '\u22A3',
    LeftTeeArrow: '\u21A4',
    LeftTeeVector: '\u295A',
    LeftTriangle: '\u22B2',
    LeftTriangleBar: '\u29CF',
    LeftTriangleEqual: '\u22B4',
    LeftUpDownVector: '\u2951',
    LeftUpTeeVector: '\u2960',
    LeftUpVector: '\u21BF',
    LeftUpVectorBar: '\u2958',
    LeftVector: '\u21BC',
    LeftVectorBar: '\u2952',
    Leftarrow: '\u21D0',
    Leftrightarrow: '\u21D4',
    LessEqualGreater: '\u22DA',
    LessFullEqual: '\u2266',
    LessGreater: '\u2276',
    LessLess: '\u2AA1',
    LessSlantEqual: '\u2A7D',
    LessTilde: '\u2272',
    Lfr: '\uD835\uDD0F',
    Ll: '\u22D8',
    Lleftarrow: '\u21DA',
    Lmidot: '\u013F',
    LongLeftArrow: '\u27F5',
    LongLeftRightArrow: '\u27F7',
    LongRightArrow: '\u27F6',
    Longleftarrow: '\u27F8',
    Longleftrightarrow: '\u27FA',
    Longrightarrow: '\u27F9',
    Lopf: '\uD835\uDD43',
    LowerLeftArrow: '\u2199',
    LowerRightArrow: '\u2198',
    Lscr: '\u2112',
    Lsh: '\u21B0',
    Lstrok: '\u0141',
    Lt: '\u226A',
    Map: '\u2905',
    Mcy: '\u041C',
    MediumSpace: '\u205F',
    Mellintrf: '\u2133',
    Mfr: '\uD835\uDD10',
    MinusPlus: '\u2213',
    Mopf: '\uD835\uDD44',
    Mscr: '\u2133',
    Mu: '\u039C',
    NJcy: '\u040A',
    Nacute: '\u0143',
    Ncaron: '\u0147',
    Ncedil: '\u0145',
    Ncy: '\u041D',
    NegativeMediumSpace: '\u200B',
    NegativeThickSpace: '\u200B',
    NegativeThinSpace: '\u200B',
    NegativeVeryThinSpace: '\u200B',
    NestedGreaterGreater: '\u226B',
    NestedLessLess: '\u226A',
    NewLine: '\u000A',
    Nfr: '\uD835\uDD11',
    NoBreak: '\u2060',
    NonBreakingSpace: '\u00A0',
    Nopf: '\u2115',
    Not: '\u2AEC',
    NotCongruent: '\u2262',
    NotCupCap: '\u226D',
    NotDoubleVerticalBar: '\u2226',
    NotElement: '\u2209',
    NotEqual: '\u2260',
    NotEqualTilde: '\u2242\u0338',
    NotExists: '\u2204',
    NotGreater: '\u226F',
    NotGreaterEqual: '\u2271',
    NotGreaterFullEqual: '\u2267\u0338',
    NotGreaterGreater: '\u226B\u0338',
    NotGreaterLess: '\u2279',
    NotGreaterSlantEqual: '\u2A7E\u0338',
    NotGreaterTilde: '\u2275',
    NotHumpDownHump: '\u224E\u0338',
    NotHumpEqual: '\u224F\u0338',
    NotLeftTriangle: '\u22EA',
    NotLeftTriangleBar: '\u29CF\u0338',
    NotLeftTriangleEqual: '\u22EC',
    NotLess: '\u226E',
    NotLessEqual: '\u2270',
    NotLessGreater: '\u2278',
    NotLessLess: '\u226A\u0338',
    NotLessSlantEqual: '\u2A7D\u0338',
    NotLessTilde: '\u2274',
    NotNestedGreaterGreater: '\u2AA2\u0338',
    NotNestedLessLess: '\u2AA1\u0338',
    NotPrecedes: '\u2280',
    NotPrecedesEqual: '\u2AAF\u0338',
    NotPrecedesSlantEqual: '\u22E0',
    NotReverseElement: '\u220C',
    NotRightTriangle: '\u22EB',
    NotRightTriangleBar: '\u29D0\u0338',
    NotRightTriangleEqual: '\u22ED',
    NotSquareSubset: '\u228F\u0338',
    NotSquareSubsetEqual: '\u22E2',
    NotSquareSuperset: '\u2290\u0338',
    NotSquareSupersetEqual: '\u22E3',
    NotSubset: '\u2282\u20D2',
    NotSubsetEqual: '\u2288',
    NotSucceeds: '\u2281',
    NotSucceedsEqual: '\u2AB0\u0338',
    NotSucceedsSlantEqual: '\u22E1',
    NotSucceedsTilde: '\u227F\u0338',
    NotSuperset: '\u2283\u20D2',
    NotSupersetEqual: '\u2289',
    NotTilde: '\u2241',
    NotTildeEqual: '\u2244',
    NotTildeFullEqual: '\u2247',
    NotTildeTilde: '\u2249',
    NotVerticalBar: '\u2224',
    Nscr: '\uD835\uDCA9',
    Ntilde: '\u00D1',
    Nu: '\u039D',
    OElig: '\u0152',
    Oacute: '\u00D3',
    Ocirc: '\u00D4',
    Ocy: '\u041E',
    Odblac: '\u0150',
    Ofr: '\uD835\uDD12',
    Ograve: '\u00D2',
    Omacr: '\u014C',
    Omega: '\u03A9',
    Omicron: '\u039F',
    Oopf: '\uD835\uDD46',
    OpenCurlyDoubleQuote: '\u201C',
    OpenCurlyQuote: '\u2018',
    Or: '\u2A54',
    Oscr: '\uD835\uDCAA',
    Oslash: '\u00D8',
    Otilde: '\u00D5',
    Otimes: '\u2A37',
    Ouml: '\u00D6',
    OverBar: '\u203E',
    OverBrace: '\u23DE',
    OverBracket: '\u23B4',
    OverParenthesis: '\u23DC',
    PartialD: '\u2202',
    Pcy: '\u041F',
    Pfr: '\uD835\uDD13',
    Phi: '\u03A6',
    Pi: '\u03A0',
    PlusMinus: '\u00B1',
    Poincareplane: '\u210C',
    Popf: '\u2119',
    Pr: '\u2ABB',
    Precedes: '\u227A',
    PrecedesEqual: '\u2AAF',
    PrecedesSlantEqual: '\u227C',
    PrecedesTilde: '\u227E',
    Prime: '\u2033',
    Product: '\u220F',
    Proportion: '\u2237',
    Proportional: '\u221D',
    Pscr: '\uD835\uDCAB',
    Psi: '\u03A8',
    QUOT: '\u0022',
    Qfr: '\uD835\uDD14',
    Qopf: '\u211A',
    Qscr: '\uD835\uDCAC',
    RBarr: '\u2910',
    REG: '\u00AE',
    Racute: '\u0154',
    Rang: '\u27EB',
    Rarr: '\u21A0',
    Rarrtl: '\u2916',
    Rcaron: '\u0158',
    Rcedil: '\u0156',
    Rcy: '\u0420',
    Re: '\u211C',
    ReverseElement: '\u220B',
    ReverseEquilibrium: '\u21CB',
    ReverseUpEquilibrium: '\u296F',
    Rfr: '\u211C',
    Rho: '\u03A1',
    RightAngleBracket: '\u27E9',
    RightArrow: '\u2192',
    RightArrowBar: '\u21E5',
    RightArrowLeftArrow: '\u21C4',
    RightCeiling: '\u2309',
    RightDoubleBracket: '\u27E7',
    RightDownTeeVector: '\u295D',
    RightDownVector: '\u21C2',
    RightDownVectorBar: '\u2955',
    RightFloor: '\u230B',
    RightTee: '\u22A2',
    RightTeeArrow: '\u21A6',
    RightTeeVector: '\u295B',
    RightTriangle: '\u22B3',
    RightTriangleBar: '\u29D0',
    RightTriangleEqual: '\u22B5',
    RightUpDownVector: '\u294F',
    RightUpTeeVector: '\u295C',
    RightUpVector: '\u21BE',
    RightUpVectorBar: '\u2954',
    RightVector: '\u21C0',
    RightVectorBar: '\u2953',
    Rightarrow: '\u21D2',
    Ropf: '\u211D',
    RoundImplies: '\u2970',
    Rrightarrow: '\u21DB',
    Rscr: '\u211B',
    Rsh: '\u21B1',
    RuleDelayed: '\u29F4',
    SHCHcy: '\u0429',
    SHcy: '\u0428',
    SOFTcy: '\u042C',
    Sacute: '\u015A',
    Sc: '\u2ABC',
    Scaron: '\u0160',
    Scedil: '\u015E',
    Scirc: '\u015C',
    Scy: '\u0421',
    Sfr: '\uD835\uDD16',
    ShortDownArrow: '\u2193',
    ShortLeftArrow: '\u2190',
    ShortRightArrow: '\u2192',
    ShortUpArrow: '\u2191',
    Sigma: '\u03A3',
    SmallCircle: '\u2218',
    Sopf: '\uD835\uDD4A',
    Sqrt: '\u221A',
    Square: '\u25A1',
    SquareIntersection: '\u2293',
    SquareSubset: '\u228F',
    SquareSubsetEqual: '\u2291',
    SquareSuperset: '\u2290',
    SquareSupersetEqual: '\u2292',
    SquareUnion: '\u2294',
    Sscr: '\uD835\uDCAE',
    Star: '\u22C6',
    Sub: '\u22D0',
    Subset: '\u22D0',
    SubsetEqual: '\u2286',
    Succeeds: '\u227B',
    SucceedsEqual: '\u2AB0',
    SucceedsSlantEqual: '\u227D',
    SucceedsTilde: '\u227F',
    SuchThat: '\u220B',
    Sum: '\u2211',
    Sup: '\u22D1',
    Superset: '\u2283',
    SupersetEqual: '\u2287',
    Supset: '\u22D1',
    THORN: '\u00DE',
    TRADE: '\u2122',
    TSHcy: '\u040B',
    TScy: '\u0426',
    Tab: '\u0009',
    Tau: '\u03A4',
    Tcaron: '\u0164',
    Tcedil: '\u0162',
    Tcy: '\u0422',
    Tfr: '\uD835\uDD17',
    Therefore: '\u2234',
    Theta: '\u0398',
    ThickSpace: '\u205F\u200A',
    ThinSpace: '\u2009',
    Tilde: '\u223C',
    TildeEqual: '\u2243',
    TildeFullEqual: '\u2245',
    TildeTilde: '\u2248',
    Topf: '\uD835\uDD4B',
    TripleDot: '\u20DB',
    Tscr: '\uD835\uDCAF',
    Tstrok: '\u0166',
    Uacute: '\u00DA',
    Uarr: '\u219F',
    Uarrocir: '\u2949',
    Ubrcy: '\u040E',
    Ubreve: '\u016C',
    Ucirc: '\u00DB',
    Ucy: '\u0423',
    Udblac: '\u0170',
    Ufr: '\uD835\uDD18',
    Ugrave: '\u00D9',
    Umacr: '\u016A',
    UnderBar: '\u005F',
    UnderBrace: '\u23DF',
    UnderBracket: '\u23B5',
    UnderParenthesis: '\u23DD',
    Union: '\u22C3',
    UnionPlus: '\u228E',
    Uogon: '\u0172',
    Uopf: '\uD835\uDD4C',
    UpArrow: '\u2191',
    UpArrowBar: '\u2912',
    UpArrowDownArrow: '\u21C5',
    UpDownArrow: '\u2195',
    UpEquilibrium: '\u296E',
    UpTee: '\u22A5',
    UpTeeArrow: '\u21A5',
    Uparrow: '\u21D1',
    Updownarrow: '\u21D5',
    UpperLeftArrow: '\u2196',
    UpperRightArrow: '\u2197',
    Upsi: '\u03D2',
    Upsilon: '\u03A5',
    Uring: '\u016E',
    Uscr: '\uD835\uDCB0',
    Utilde: '\u0168',
    Uuml: '\u00DC',
    VDash: '\u22AB',
    Vbar: '\u2AEB',
    Vcy: '\u0412',
    Vdash: '\u22A9',
    Vdashl: '\u2AE6',
    Vee: '\u22C1',
    Verbar: '\u2016',
    Vert: '\u2016',
    VerticalBar: '\u2223',
    VerticalLine: '\u007C',
    VerticalSeparator: '\u2758',
    VerticalTilde: '\u2240',
    VeryThinSpace: '\u200A',
    Vfr: '\uD835\uDD19',
    Vopf: '\uD835\uDD4D',
    Vscr: '\uD835\uDCB1',
    Vvdash: '\u22AA',
    Wcirc: '\u0174',
    Wedge: '\u22C0',
    Wfr: '\uD835\uDD1A',
    Wopf: '\uD835\uDD4E',
    Wscr: '\uD835\uDCB2',
    Xfr: '\uD835\uDD1B',
    Xi: '\u039E',
    Xopf: '\uD835\uDD4F',
    Xscr: '\uD835\uDCB3',
    YAcy: '\u042F',
    YIcy: '\u0407',
    YUcy: '\u042E',
    Yacute: '\u00DD',
    Ycirc: '\u0176',
    Ycy: '\u042B',
    Yfr: '\uD835\uDD1C',
    Yopf: '\uD835\uDD50',
    Yscr: '\uD835\uDCB4',
    Yuml: '\u0178',
    ZHcy: '\u0416',
    Zacute: '\u0179',
    Zcaron: '\u017D',
    Zcy: '\u0417',
    Zdot: '\u017B',
    ZeroWidthSpace: '\u200B',
    Zeta: '\u0396',
    Zfr: '\u2128',
    Zopf: '\u2124',
    Zscr: '\uD835\uDCB5',
    aacute: '\u00E1',
    abreve: '\u0103',
    ac: '\u223E',
    acE: '\u223E\u0333',
    acd: '\u223F',
    acirc: '\u00E2',
    acute: '\u00B4',
    acy: '\u0430',
    aelig: '\u00E6',
    af: '\u2061',
    afr: '\uD835\uDD1E',
    agrave: '\u00E0',
    alefsym: '\u2135',
    aleph: '\u2135',
    alpha: '\u03B1',
    amacr: '\u0101',
    amalg: '\u2A3F',
    amp: '\u0026',
    and: '\u2227',
    andand: '\u2A55',
    andd: '\u2A5C',
    andslope: '\u2A58',
    andv: '\u2A5A',
    ang: '\u2220',
    ange: '\u29A4',
    angle: '\u2220',
    angmsd: '\u2221',
    angmsdaa: '\u29A8',
    angmsdab: '\u29A9',
    angmsdac: '\u29AA',
    angmsdad: '\u29AB',
    angmsdae: '\u29AC',
    angmsdaf: '\u29AD',
    angmsdag: '\u29AE',
    angmsdah: '\u29AF',
    angrt: '\u221F',
    angrtvb: '\u22BE',
    angrtvbd: '\u299D',
    angsph: '\u2222',
    angst: '\u00C5',
    angzarr: '\u237C',
    aogon: '\u0105',
    aopf: '\uD835\uDD52',
    ap: '\u2248',
    apE: '\u2A70',
    apacir: '\u2A6F',
    ape: '\u224A',
    apid: '\u224B',
    apos: '\u0027',
    approx: '\u2248',
    approxeq: '\u224A',
    aring: '\u00E5',
    ascr: '\uD835\uDCB6',
    ast: '\u002A',
    asymp: '\u2248',
    asympeq: '\u224D',
    atilde: '\u00E3',
    auml: '\u00E4',
    awconint: '\u2233',
    awint: '\u2A11',
    bNot: '\u2AED',
    backcong: '\u224C',
    backepsilon: '\u03F6',
    backprime: '\u2035',
    backsim: '\u223D',
    backsimeq: '\u22CD',
    barvee: '\u22BD',
    barwed: '\u2305',
    barwedge: '\u2305',
    bbrk: '\u23B5',
    bbrktbrk: '\u23B6',
    bcong: '\u224C',
    bcy: '\u0431',
    bdquo: '\u201E',
    becaus: '\u2235',
    because: '\u2235',
    bemptyv: '\u29B0',
    bepsi: '\u03F6',
    bernou: '\u212C',
    beta: '\u03B2',
    beth: '\u2136',
    between: '\u226C',
    bfr: '\uD835\uDD1F',
    bigcap: '\u22C2',
    bigcirc: '\u25EF',
    bigcup: '\u22C3',
    bigodot: '\u2A00',
    bigoplus: '\u2A01',
    bigotimes: '\u2A02',
    bigsqcup: '\u2A06',
    bigstar: '\u2605',
    bigtriangledown: '\u25BD',
    bigtriangleup: '\u25B3',
    biguplus: '\u2A04',
    bigvee: '\u22C1',
    bigwedge: '\u22C0',
    bkarow: '\u290D',
    blacklozenge: '\u29EB',
    blacksquare: '\u25AA',
    blacktriangle: '\u25B4',
    blacktriangledown: '\u25BE',
    blacktriangleleft: '\u25C2',
    blacktriangleright: '\u25B8',
    blank: '\u2423',
    blk12: '\u2592',
    blk14: '\u2591',
    blk34: '\u2593',
    block: '\u2588',
    bne: '\u003D\u20E5',
    bnequiv: '\u2261\u20E5',
    bnot: '\u2310',
    bopf: '\uD835\uDD53',
    bot: '\u22A5',
    bottom: '\u22A5',
    bowtie: '\u22C8',
    boxDL: '\u2557',
    boxDR: '\u2554',
    boxDl: '\u2556',
    boxDr: '\u2553',
    boxH: '\u2550',
    boxHD: '\u2566',
    boxHU: '\u2569',
    boxHd: '\u2564',
    boxHu: '\u2567',
    boxUL: '\u255D',
    boxUR: '\u255A',
    boxUl: '\u255C',
    boxUr: '\u2559',
    boxV: '\u2551',
    boxVH: '\u256C',
    boxVL: '\u2563',
    boxVR: '\u2560',
    boxVh: '\u256B',
    boxVl: '\u2562',
    boxVr: '\u255F',
    boxbox: '\u29C9',
    boxdL: '\u2555',
    boxdR: '\u2552',
    boxdl: '\u2510',
    boxdr: '\u250C',
    boxh: '\u2500',
    boxhD: '\u2565',
    boxhU: '\u2568',
    boxhd: '\u252C',
    boxhu: '\u2534',
    boxminus: '\u229F',
    boxplus: '\u229E',
    boxtimes: '\u22A0',
    boxuL: '\u255B',
    boxuR: '\u2558',
    boxul: '\u2518',
    boxur: '\u2514',
    boxv: '\u2502',
    boxvH: '\u256A',
    boxvL: '\u2561',
    boxvR: '\u255E',
    boxvh: '\u253C',
    boxvl: '\u2524',
    boxvr: '\u251C',
    bprime: '\u2035',
    breve: '\u02D8',
    brvbar: '\u00A6',
    bscr: '\uD835\uDCB7',
    bsemi: '\u204F',
    bsim: '\u223D',
    bsime: '\u22CD',
    bsol: '\u005C',
    bsolb: '\u29C5',
    bsolhsub: '\u27C8',
    bull: '\u2022',
    bullet: '\u2022',
    bump: '\u224E',
    bumpE: '\u2AAE',
    bumpe: '\u224F',
    bumpeq: '\u224F',
    cacute: '\u0107',
    cap: '\u2229',
    capand: '\u2A44',
    capbrcup: '\u2A49',
    capcap: '\u2A4B',
    capcup: '\u2A47',
    capdot: '\u2A40',
    caps: '\u2229\uFE00',
    caret: '\u2041',
    caron: '\u02C7',
    ccaps: '\u2A4D',
    ccaron: '\u010D',
    ccedil: '\u00E7',
    ccirc: '\u0109',
    ccups: '\u2A4C',
    ccupssm: '\u2A50',
    cdot: '\u010B',
    cedil: '\u00B8',
    cemptyv: '\u29B2',
    cent: '\u00A2',
    centerdot: '\u00B7',
    cfr: '\uD835\uDD20',
    chcy: '\u0447',
    check: '\u2713',
    checkmark: '\u2713',
    chi: '\u03C7',
    cir: '\u25CB',
    cirE: '\u29C3',
    circ: '\u02C6',
    circeq: '\u2257',
    circlearrowleft: '\u21BA',
    circlearrowright: '\u21BB',
    circledR: '\u00AE',
    circledS: '\u24C8',
    circledast: '\u229B',
    circledcirc: '\u229A',
    circleddash: '\u229D',
    cire: '\u2257',
    cirfnint: '\u2A10',
    cirmid: '\u2AEF',
    cirscir: '\u29C2',
    clubs: '\u2663',
    clubsuit: '\u2663',
    colon: '\u003A',
    colone: '\u2254',
    coloneq: '\u2254',
    comma: '\u002C',
    commat: '\u0040',
    comp: '\u2201',
    compfn: '\u2218',
    complement: '\u2201',
    complexes: '\u2102',
    cong: '\u2245',
    congdot: '\u2A6D',
    conint: '\u222E',
    copf: '\uD835\uDD54',
    coprod: '\u2210',
    copy: '\u00A9',
    copysr: '\u2117',
    crarr: '\u21B5',
    cross: '\u2717',
    cscr: '\uD835\uDCB8',
    csub: '\u2ACF',
    csube: '\u2AD1',
    csup: '\u2AD0',
    csupe: '\u2AD2',
    ctdot: '\u22EF',
    cudarrl: '\u2938',
    cudarrr: '\u2935',
    cuepr: '\u22DE',
    cuesc: '\u22DF',
    cularr: '\u21B6',
    cularrp: '\u293D',
    cup: '\u222A',
    cupbrcap: '\u2A48',
    cupcap: '\u2A46',
    cupcup: '\u2A4A',
    cupdot: '\u228D',
    cupor: '\u2A45',
    cups: '\u222A\uFE00',
    curarr: '\u21B7',
    curarrm: '\u293C',
    curlyeqprec: '\u22DE',
    curlyeqsucc: '\u22DF',
    curlyvee: '\u22CE',
    curlywedge: '\u22CF',
    curren: '\u00A4',
    curvearrowleft: '\u21B6',
    curvearrowright: '\u21B7',
    cuvee: '\u22CE',
    cuwed: '\u22CF',
    cwconint: '\u2232',
    cwint: '\u2231',
    cylcty: '\u232D',
    dArr: '\u21D3',
    dHar: '\u2965',
    dagger: '\u2020',
    daleth: '\u2138',
    darr: '\u2193',
    dash: '\u2010',
    dashv: '\u22A3',
    dbkarow: '\u290F',
    dblac: '\u02DD',
    dcaron: '\u010F',
    dcy: '\u0434',
    dd: '\u2146',
    ddagger: '\u2021',
    ddarr: '\u21CA',
    ddotseq: '\u2A77',
    deg: '\u00B0',
    delta: '\u03B4',
    demptyv: '\u29B1',
    dfisht: '\u297F',
    dfr: '\uD835\uDD21',
    dharl: '\u21C3',
    dharr: '\u21C2',
    diam: '\u22C4',
    diamond: '\u22C4',
    diamondsuit: '\u2666',
    diams: '\u2666',
    die: '\u00A8',
    digamma: '\u03DD',
    disin: '\u22F2',
    div: '\u00F7',
    divide: '\u00F7',
    divideontimes: '\u22C7',
    divonx: '\u22C7',
    djcy: '\u0452',
    dlcorn: '\u231E',
    dlcrop: '\u230D',
    dollar: '\u0024',
    dopf: '\uD835\uDD55',
    dot: '\u02D9',
    doteq: '\u2250',
    doteqdot: '\u2251',
    dotminus: '\u2238',
    dotplus: '\u2214',
    dotsquare: '\u22A1',
    doublebarwedge: '\u2306',
    downarrow: '\u2193',
    downdownarrows: '\u21CA',
    downharpoonleft: '\u21C3',
    downharpoonright: '\u21C2',
    drbkarow: '\u2910',
    drcorn: '\u231F',
    drcrop: '\u230C',
    dscr: '\uD835\uDCB9',
    dscy: '\u0455',
    dsol: '\u29F6',
    dstrok: '\u0111',
    dtdot: '\u22F1',
    dtri: '\u25BF',
    dtrif: '\u25BE',
    duarr: '\u21F5',
    duhar: '\u296F',
    dwangle: '\u29A6',
    dzcy: '\u045F',
    dzigrarr: '\u27FF',
    eDDot: '\u2A77',
    eDot: '\u2251',
    eacute: '\u00E9',
    easter: '\u2A6E',
    ecaron: '\u011B',
    ecir: '\u2256',
    ecirc: '\u00EA',
    ecolon: '\u2255',
    ecy: '\u044D',
    edot: '\u0117',
    ee: '\u2147',
    efDot: '\u2252',
    efr: '\uD835\uDD22',
    eg: '\u2A9A',
    egrave: '\u00E8',
    egs: '\u2A96',
    egsdot: '\u2A98',
    el: '\u2A99',
    elinters: '\u23E7',
    ell: '\u2113',
    els: '\u2A95',
    elsdot: '\u2A97',
    emacr: '\u0113',
    empty: '\u2205',
    emptyset: '\u2205',
    emptyv: '\u2205',
    emsp13: '\u2004',
    emsp14: '\u2005',
    emsp: '\u2003',
    eng: '\u014B',
    ensp: '\u2002',
    eogon: '\u0119',
    eopf: '\uD835\uDD56',
    epar: '\u22D5',
    eparsl: '\u29E3',
    eplus: '\u2A71',
    epsi: '\u03B5',
    epsilon: '\u03B5',
    epsiv: '\u03F5',
    eqcirc: '\u2256',
    eqcolon: '\u2255',
    eqsim: '\u2242',
    eqslantgtr: '\u2A96',
    eqslantless: '\u2A95',
    equals: '\u003D',
    equest: '\u225F',
    equiv: '\u2261',
    equivDD: '\u2A78',
    eqvparsl: '\u29E5',
    erDot: '\u2253',
    erarr: '\u2971',
    escr: '\u212F',
    esdot: '\u2250',
    esim: '\u2242',
    eta: '\u03B7',
    eth: '\u00F0',
    euml: '\u00EB',
    euro: '\u20AC',
    excl: '\u0021',
    exist: '\u2203',
    expectation: '\u2130',
    exponentiale: '\u2147',
    fallingdotseq: '\u2252',
    fcy: '\u0444',
    female: '\u2640',
    ffilig: '\uFB03',
    fflig: '\uFB00',
    ffllig: '\uFB04',
    ffr: '\uD835\uDD23',
    filig: '\uFB01',
    fjlig: '\u0066\u006A',
    flat: '\u266D',
    fllig: '\uFB02',
    fltns: '\u25B1',
    fnof: '\u0192',
    fopf: '\uD835\uDD57',
    forall: '\u2200',
    fork: '\u22D4',
    forkv: '\u2AD9',
    fpartint: '\u2A0D',
    frac12: '\u00BD',
    frac13: '\u2153',
    frac14: '\u00BC',
    frac15: '\u2155',
    frac16: '\u2159',
    frac18: '\u215B',
    frac23: '\u2154',
    frac25: '\u2156',
    frac34: '\u00BE',
    frac35: '\u2157',
    frac38: '\u215C',
    frac45: '\u2158',
    frac56: '\u215A',
    frac58: '\u215D',
    frac78: '\u215E',
    frasl: '\u2044',
    frown: '\u2322',
    fscr: '\uD835\uDCBB',
    gE: '\u2267',
    gEl: '\u2A8C',
    gacute: '\u01F5',
    gamma: '\u03B3',
    gammad: '\u03DD',
    gap: '\u2A86',
    gbreve: '\u011F',
    gcirc: '\u011D',
    gcy: '\u0433',
    gdot: '\u0121',
    ge: '\u2265',
    gel: '\u22DB',
    geq: '\u2265',
    geqq: '\u2267',
    geqslant: '\u2A7E',
    ges: '\u2A7E',
    gescc: '\u2AA9',
    gesdot: '\u2A80',
    gesdoto: '\u2A82',
    gesdotol: '\u2A84',
    gesl: '\u22DB\uFE00',
    gesles: '\u2A94',
    gfr: '\uD835\uDD24',
    gg: '\u226B',
    ggg: '\u22D9',
    gimel: '\u2137',
    gjcy: '\u0453',
    gl: '\u2277',
    glE: '\u2A92',
    gla: '\u2AA5',
    glj: '\u2AA4',
    gnE: '\u2269',
    gnap: '\u2A8A',
    gnapprox: '\u2A8A',
    gne: '\u2A88',
    gneq: '\u2A88',
    gneqq: '\u2269',
    gnsim: '\u22E7',
    gopf: '\uD835\uDD58',
    grave: '\u0060',
    gscr: '\u210A',
    gsim: '\u2273',
    gsime: '\u2A8E',
    gsiml: '\u2A90',
    gt: '\u003E',
    gtcc: '\u2AA7',
    gtcir: '\u2A7A',
    gtdot: '\u22D7',
    gtlPar: '\u2995',
    gtquest: '\u2A7C',
    gtrapprox: '\u2A86',
    gtrarr: '\u2978',
    gtrdot: '\u22D7',
    gtreqless: '\u22DB',
    gtreqqless: '\u2A8C',
    gtrless: '\u2277',
    gtrsim: '\u2273',
    gvertneqq: '\u2269\uFE00',
    gvnE: '\u2269\uFE00',
    hArr: '\u21D4',
    hairsp: '\u200A',
    half: '\u00BD',
    hamilt: '\u210B',
    hardcy: '\u044A',
    harr: '\u2194',
    harrcir: '\u2948',
    harrw: '\u21AD',
    hbar: '\u210F',
    hcirc: '\u0125',
    hearts: '\u2665',
    heartsuit: '\u2665',
    hellip: '\u2026',
    hercon: '\u22B9',
    hfr: '\uD835\uDD25',
    hksearow: '\u2925',
    hkswarow: '\u2926',
    hoarr: '\u21FF',
    homtht: '\u223B',
    hookleftarrow: '\u21A9',
    hookrightarrow: '\u21AA',
    hopf: '\uD835\uDD59',
    horbar: '\u2015',
    hscr: '\uD835\uDCBD',
    hslash: '\u210F',
    hstrok: '\u0127',
    hybull: '\u2043',
    hyphen: '\u2010',
    iacute: '\u00ED',
    ic: '\u2063',
    icirc: '\u00EE',
    icy: '\u0438',
    iecy: '\u0435',
    iexcl: '\u00A1',
    iff: '\u21D4',
    ifr: '\uD835\uDD26',
    igrave: '\u00EC',
    ii: '\u2148',
    iiiint: '\u2A0C',
    iiint: '\u222D',
    iinfin: '\u29DC',
    iiota: '\u2129',
    ijlig: '\u0133',
    imacr: '\u012B',
    image: '\u2111',
    imagline: '\u2110',
    imagpart: '\u2111',
    imath: '\u0131',
    imof: '\u22B7',
    imped: '\u01B5',
    in: '\u2208',
    incare: '\u2105',
    infin: '\u221E',
    infintie: '\u29DD',
    inodot: '\u0131',
    int: '\u222B',
    intcal: '\u22BA',
    integers: '\u2124',
    intercal: '\u22BA',
    intlarhk: '\u2A17',
    intprod: '\u2A3C',
    iocy: '\u0451',
    iogon: '\u012F',
    iopf: '\uD835\uDD5A',
    iota: '\u03B9',
    iprod: '\u2A3C',
    iquest: '\u00BF',
    iscr: '\uD835\uDCBE',
    isin: '\u2208',
    isinE: '\u22F9',
    isindot: '\u22F5',
    isins: '\u22F4',
    isinsv: '\u22F3',
    isinv: '\u2208',
    it: '\u2062',
    itilde: '\u0129',
    iukcy: '\u0456',
    iuml: '\u00EF',
    jcirc: '\u0135',
    jcy: '\u0439',
    jfr: '\uD835\uDD27',
    jmath: '\u0237',
    jopf: '\uD835\uDD5B',
    jscr: '\uD835\uDCBF',
    jsercy: '\u0458',
    jukcy: '\u0454',
    kappa: '\u03BA',
    kappav: '\u03F0',
    kcedil: '\u0137',
    kcy: '\u043A',
    kfr: '\uD835\uDD28',
    kgreen: '\u0138',
    khcy: '\u0445',
    kjcy: '\u045C',
    kopf: '\uD835\uDD5C',
    kscr: '\uD835\uDCC0',
    lAarr: '\u21DA',
    lArr: '\u21D0',
    lAtail: '\u291B',
    lBarr: '\u290E',
    lE: '\u2266',
    lEg: '\u2A8B',
    lHar: '\u2962',
    lacute: '\u013A',
    laemptyv: '\u29B4',
    lagran: '\u2112',
    lambda: '\u03BB',
    lang: '\u27E8',
    langd: '\u2991',
    langle: '\u27E8',
    lap: '\u2A85',
    laquo: '\u00AB',
    larr: '\u2190',
    larrb: '\u21E4',
    larrbfs: '\u291F',
    larrfs: '\u291D',
    larrhk: '\u21A9',
    larrlp: '\u21AB',
    larrpl: '\u2939',
    larrsim: '\u2973',
    larrtl: '\u21A2',
    lat: '\u2AAB',
    latail: '\u2919',
    late: '\u2AAD',
    lates: '\u2AAD\uFE00',
    lbarr: '\u290C',
    lbbrk: '\u2772',
    lbrace: '\u007B',
    lbrack: '\u005B',
    lbrke: '\u298B',
    lbrksld: '\u298F',
    lbrkslu: '\u298D',
    lcaron: '\u013E',
    lcedil: '\u013C',
    lceil: '\u2308',
    lcub: '\u007B',
    lcy: '\u043B',
    ldca: '\u2936',
    ldquo: '\u201C',
    ldquor: '\u201E',
    ldrdhar: '\u2967',
    ldrushar: '\u294B',
    ldsh: '\u21B2',
    le: '\u2264',
    leftarrow: '\u2190',
    leftarrowtail: '\u21A2',
    leftharpoondown: '\u21BD',
    leftharpoonup: '\u21BC',
    leftleftarrows: '\u21C7',
    leftrightarrow: '\u2194',
    leftrightarrows: '\u21C6',
    leftrightharpoons: '\u21CB',
    leftrightsquigarrow: '\u21AD',
    leftthreetimes: '\u22CB',
    leg: '\u22DA',
    leq: '\u2264',
    leqq: '\u2266',
    leqslant: '\u2A7D',
    les: '\u2A7D',
    lescc: '\u2AA8',
    lesdot: '\u2A7F',
    lesdoto: '\u2A81',
    lesdotor: '\u2A83',
    lesg: '\u22DA\uFE00',
    lesges: '\u2A93',
    lessapprox: '\u2A85',
    lessdot: '\u22D6',
    lesseqgtr: '\u22DA',
    lesseqqgtr: '\u2A8B',
    lessgtr: '\u2276',
    lesssim: '\u2272',
    lfisht: '\u297C',
    lfloor: '\u230A',
    lfr: '\uD835\uDD29',
    lg: '\u2276',
    lgE: '\u2A91',
    lhard: '\u21BD',
    lharu: '\u21BC',
    lharul: '\u296A',
    lhblk: '\u2584',
    ljcy: '\u0459',
    ll: '\u226A',
    llarr: '\u21C7',
    llcorner: '\u231E',
    llhard: '\u296B',
    lltri: '\u25FA',
    lmidot: '\u0140',
    lmoust: '\u23B0',
    lmoustache: '\u23B0',
    lnE: '\u2268',
    lnap: '\u2A89',
    lnapprox: '\u2A89',
    lne: '\u2A87',
    lneq: '\u2A87',
    lneqq: '\u2268',
    lnsim: '\u22E6',
    loang: '\u27EC',
    loarr: '\u21FD',
    lobrk: '\u27E6',
    longleftarrow: '\u27F5',
    longleftrightarrow: '\u27F7',
    longmapsto: '\u27FC',
    longrightarrow: '\u27F6',
    looparrowleft: '\u21AB',
    looparrowright: '\u21AC',
    lopar: '\u2985',
    lopf: '\uD835\uDD5D',
    loplus: '\u2A2D',
    lotimes: '\u2A34',
    lowast: '\u2217',
    lowbar: '\u005F',
    loz: '\u25CA',
    lozenge: '\u25CA',
    lozf: '\u29EB',
    lpar: '\u0028',
    lparlt: '\u2993',
    lrarr: '\u21C6',
    lrcorner: '\u231F',
    lrhar: '\u21CB',
    lrhard: '\u296D',
    lrm: '\u200E',
    lrtri: '\u22BF',
    lsaquo: '\u2039',
    lscr: '\uD835\uDCC1',
    lsh: '\u21B0',
    lsim: '\u2272',
    lsime: '\u2A8D',
    lsimg: '\u2A8F',
    lsqb: '\u005B',
    lsquo: '\u2018',
    lsquor: '\u201A',
    lstrok: '\u0142',
    lt: '\u003C',
    ltcc: '\u2AA6',
    ltcir: '\u2A79',
    ltdot: '\u22D6',
    lthree: '\u22CB',
    ltimes: '\u22C9',
    ltlarr: '\u2976',
    ltquest: '\u2A7B',
    ltrPar: '\u2996',
    ltri: '\u25C3',
    ltrie: '\u22B4',
    ltrif: '\u25C2',
    lurdshar: '\u294A',
    luruhar: '\u2966',
    lvertneqq: '\u2268\uFE00',
    lvnE: '\u2268\uFE00',
    mDDot: '\u223A',
    macr: '\u00AF',
    male: '\u2642',
    malt: '\u2720',
    maltese: '\u2720',
    map: '\u21A6',
    mapsto: '\u21A6',
    mapstodown: '\u21A7',
    mapstoleft: '\u21A4',
    mapstoup: '\u21A5',
    marker: '\u25AE',
    mcomma: '\u2A29',
    mcy: '\u043C',
    mdash: '\u2014',
    measuredangle: '\u2221',
    mfr: '\uD835\uDD2A',
    mho: '\u2127',
    micro: '\u00B5',
    mid: '\u2223',
    midast: '\u002A',
    midcir: '\u2AF0',
    middot: '\u00B7',
    minus: '\u2212',
    minusb: '\u229F',
    minusd: '\u2238',
    minusdu: '\u2A2A',
    mlcp: '\u2ADB',
    mldr: '\u2026',
    mnplus: '\u2213',
    models: '\u22A7',
    mopf: '\uD835\uDD5E',
    mp: '\u2213',
    mscr: '\uD835\uDCC2',
    mstpos: '\u223E',
    mu: '\u03BC',
    multimap: '\u22B8',
    mumap: '\u22B8',
    nGg: '\u22D9\u0338',
    nGt: '\u226B\u20D2',
    nGtv: '\u226B\u0338',
    nLeftarrow: '\u21CD',
    nLeftrightarrow: '\u21CE',
    nLl: '\u22D8\u0338',
    nLt: '\u226A\u20D2',
    nLtv: '\u226A\u0338',
    nRightarrow: '\u21CF',
    nVDash: '\u22AF',
    nVdash: '\u22AE',
    nabla: '\u2207',
    nacute: '\u0144',
    nang: '\u2220\u20D2',
    nap: '\u2249',
    napE: '\u2A70\u0338',
    napid: '\u224B\u0338',
    napos: '\u0149',
    napprox: '\u2249',
    natur: '\u266E',
    natural: '\u266E',
    naturals: '\u2115',
    nbsp: '\u00A0',
    nbump: '\u224E\u0338',
    nbumpe: '\u224F\u0338',
    ncap: '\u2A43',
    ncaron: '\u0148',
    ncedil: '\u0146',
    ncong: '\u2247',
    ncongdot: '\u2A6D\u0338',
    ncup: '\u2A42',
    ncy: '\u043D',
    ndash: '\u2013',
    ne: '\u2260',
    neArr: '\u21D7',
    nearhk: '\u2924',
    nearr: '\u2197',
    nearrow: '\u2197',
    nedot: '\u2250\u0338',
    nequiv: '\u2262',
    nesear: '\u2928',
    nesim: '\u2242\u0338',
    nexist: '\u2204',
    nexists: '\u2204',
    nfr: '\uD835\uDD2B',
    ngE: '\u2267\u0338',
    nge: '\u2271',
    ngeq: '\u2271',
    ngeqq: '\u2267\u0338',
    ngeqslant: '\u2A7E\u0338',
    nges: '\u2A7E\u0338',
    ngsim: '\u2275',
    ngt: '\u226F',
    ngtr: '\u226F',
    nhArr: '\u21CE',
    nharr: '\u21AE',
    nhpar: '\u2AF2',
    ni: '\u220B',
    nis: '\u22FC',
    nisd: '\u22FA',
    niv: '\u220B',
    njcy: '\u045A',
    nlArr: '\u21CD',
    nlE: '\u2266\u0338',
    nlarr: '\u219A',
    nldr: '\u2025',
    nle: '\u2270',
    nleftarrow: '\u219A',
    nleftrightarrow: '\u21AE',
    nleq: '\u2270',
    nleqq: '\u2266\u0338',
    nleqslant: '\u2A7D\u0338',
    nles: '\u2A7D\u0338',
    nless: '\u226E',
    nlsim: '\u2274',
    nlt: '\u226E',
    nltri: '\u22EA',
    nltrie: '\u22EC',
    nmid: '\u2224',
    nopf: '\uD835\uDD5F',
    not: '\u00AC',
    notin: '\u2209',
    notinE: '\u22F9\u0338',
    notindot: '\u22F5\u0338',
    notinva: '\u2209',
    notinvb: '\u22F7',
    notinvc: '\u22F6',
    notni: '\u220C',
    notniva: '\u220C',
    notnivb: '\u22FE',
    notnivc: '\u22FD',
    npar: '\u2226',
    nparallel: '\u2226',
    nparsl: '\u2AFD\u20E5',
    npart: '\u2202\u0338',
    npolint: '\u2A14',
    npr: '\u2280',
    nprcue: '\u22E0',
    npre: '\u2AAF\u0338',
    nprec: '\u2280',
    npreceq: '\u2AAF\u0338',
    nrArr: '\u21CF',
    nrarr: '\u219B',
    nrarrc: '\u2933\u0338',
    nrarrw: '\u219D\u0338',
    nrightarrow: '\u219B',
    nrtri: '\u22EB',
    nrtrie: '\u22ED',
    nsc: '\u2281',
    nsccue: '\u22E1',
    nsce: '\u2AB0\u0338',
    nscr: '\uD835\uDCC3',
    nshortmid: '\u2224',
    nshortparallel: '\u2226',
    nsim: '\u2241',
    nsime: '\u2244',
    nsimeq: '\u2244',
    nsmid: '\u2224',
    nspar: '\u2226',
    nsqsube: '\u22E2',
    nsqsupe: '\u22E3',
    nsub: '\u2284',
    nsubE: '\u2AC5\u0338',
    nsube: '\u2288',
    nsubset: '\u2282\u20D2',
    nsubseteq: '\u2288',
    nsubseteqq: '\u2AC5\u0338',
    nsucc: '\u2281',
    nsucceq: '\u2AB0\u0338',
    nsup: '\u2285',
    nsupE: '\u2AC6\u0338',
    nsupe: '\u2289',
    nsupset: '\u2283\u20D2',
    nsupseteq: '\u2289',
    nsupseteqq: '\u2AC6\u0338',
    ntgl: '\u2279',
    ntilde: '\u00F1',
    ntlg: '\u2278',
    ntriangleleft: '\u22EA',
    ntrianglelefteq: '\u22EC',
    ntriangleright: '\u22EB',
    ntrianglerighteq: '\u22ED',
    nu: '\u03BD',
    num: '\u0023',
    numero: '\u2116',
    numsp: '\u2007',
    nvDash: '\u22AD',
    nvHarr: '\u2904',
    nvap: '\u224D\u20D2',
    nvdash: '\u22AC',
    nvge: '\u2265\u20D2',
    nvgt: '\u003E\u20D2',
    nvinfin: '\u29DE',
    nvlArr: '\u2902',
    nvle: '\u2264\u20D2',
    nvlt: '\u003C\u20D2',
    nvltrie: '\u22B4\u20D2',
    nvrArr: '\u2903',
    nvrtrie: '\u22B5\u20D2',
    nvsim: '\u223C\u20D2',
    nwArr: '\u21D6',
    nwarhk: '\u2923',
    nwarr: '\u2196',
    nwarrow: '\u2196',
    nwnear: '\u2927',
    oS: '\u24C8',
    oacute: '\u00F3',
    oast: '\u229B',
    ocir: '\u229A',
    ocirc: '\u00F4',
    ocy: '\u043E',
    odash: '\u229D',
    odblac: '\u0151',
    odiv: '\u2A38',
    odot: '\u2299',
    odsold: '\u29BC',
    oelig: '\u0153',
    ofcir: '\u29BF',
    ofr: '\uD835\uDD2C',
    ogon: '\u02DB',
    ograve: '\u00F2',
    ogt: '\u29C1',
    ohbar: '\u29B5',
    ohm: '\u03A9',
    oint: '\u222E',
    olarr: '\u21BA',
    olcir: '\u29BE',
    olcross: '\u29BB',
    oline: '\u203E',
    olt: '\u29C0',
    omacr: '\u014D',
    omega: '\u03C9',
    omicron: '\u03BF',
    omid: '\u29B6',
    ominus: '\u2296',
    oopf: '\uD835\uDD60',
    opar: '\u29B7',
    operp: '\u29B9',
    oplus: '\u2295',
    or: '\u2228',
    orarr: '\u21BB',
    ord: '\u2A5D',
    order: '\u2134',
    orderof: '\u2134',
    ordf: '\u00AA',
    ordm: '\u00BA',
    origof: '\u22B6',
    oror: '\u2A56',
    orslope: '\u2A57',
    orv: '\u2A5B',
    oscr: '\u2134',
    oslash: '\u00F8',
    osol: '\u2298',
    otilde: '\u00F5',
    otimes: '\u2297',
    otimesas: '\u2A36',
    ouml: '\u00F6',
    ovbar: '\u233D',
    par: '\u2225',
    para: '\u00B6',
    parallel: '\u2225',
    parsim: '\u2AF3',
    parsl: '\u2AFD',
    part: '\u2202',
    pcy: '\u043F',
    percnt: '\u0025',
    period: '\u002E',
    permil: '\u2030',
    perp: '\u22A5',
    pertenk: '\u2031',
    pfr: '\uD835\uDD2D',
    phi: '\u03C6',
    phiv: '\u03D5',
    phmmat: '\u2133',
    phone: '\u260E',
    pi: '\u03C0',
    pitchfork: '\u22D4',
    piv: '\u03D6',
    planck: '\u210F',
    planckh: '\u210E',
    plankv: '\u210F',
    plus: '\u002B',
    plusacir: '\u2A23',
    plusb: '\u229E',
    pluscir: '\u2A22',
    plusdo: '\u2214',
    plusdu: '\u2A25',
    pluse: '\u2A72',
    plusmn: '\u00B1',
    plussim: '\u2A26',
    plustwo: '\u2A27',
    pm: '\u00B1',
    pointint: '\u2A15',
    popf: '\uD835\uDD61',
    pound: '\u00A3',
    pr: '\u227A',
    prE: '\u2AB3',
    prap: '\u2AB7',
    prcue: '\u227C',
    pre: '\u2AAF',
    prec: '\u227A',
    precapprox: '\u2AB7',
    preccurlyeq: '\u227C',
    preceq: '\u2AAF',
    precnapprox: '\u2AB9',
    precneqq: '\u2AB5',
    precnsim: '\u22E8',
    precsim: '\u227E',
    prime: '\u2032',
    primes: '\u2119',
    prnE: '\u2AB5',
    prnap: '\u2AB9',
    prnsim: '\u22E8',
    prod: '\u220F',
    profalar: '\u232E',
    profline: '\u2312',
    profsurf: '\u2313',
    prop: '\u221D',
    propto: '\u221D',
    prsim: '\u227E',
    prurel: '\u22B0',
    pscr: '\uD835\uDCC5',
    psi: '\u03C8',
    puncsp: '\u2008',
    qfr: '\uD835\uDD2E',
    qint: '\u2A0C',
    qopf: '\uD835\uDD62',
    qprime: '\u2057',
    qscr: '\uD835\uDCC6',
    quaternions: '\u210D',
    quatint: '\u2A16',
    quest: '\u003F',
    questeq: '\u225F',
    quot: '\u0022',
    rAarr: '\u21DB',
    rArr: '\u21D2',
    rAtail: '\u291C',
    rBarr: '\u290F',
    rHar: '\u2964',
    race: '\u223D\u0331',
    racute: '\u0155',
    radic: '\u221A',
    raemptyv: '\u29B3',
    rang: '\u27E9',
    rangd: '\u2992',
    range: '\u29A5',
    rangle: '\u27E9',
    raquo: '\u00BB',
    rarr: '\u2192',
    rarrap: '\u2975',
    rarrb: '\u21E5',
    rarrbfs: '\u2920',
    rarrc: '\u2933',
    rarrfs: '\u291E',
    rarrhk: '\u21AA',
    rarrlp: '\u21AC',
    rarrpl: '\u2945',
    rarrsim: '\u2974',
    rarrtl: '\u21A3',
    rarrw: '\u219D',
    ratail: '\u291A',
    ratio: '\u2236',
    rationals: '\u211A',
    rbarr: '\u290D',
    rbbrk: '\u2773',
    rbrace: '\u007D',
    rbrack: '\u005D',
    rbrke: '\u298C',
    rbrksld: '\u298E',
    rbrkslu: '\u2990',
    rcaron: '\u0159',
    rcedil: '\u0157',
    rceil: '\u2309',
    rcub: '\u007D',
    rcy: '\u0440',
    rdca: '\u2937',
    rdldhar: '\u2969',
    rdquo: '\u201D',
    rdquor: '\u201D',
    rdsh: '\u21B3',
    real: '\u211C',
    realine: '\u211B',
    realpart: '\u211C',
    reals: '\u211D',
    rect: '\u25AD',
    reg: '\u00AE',
    rfisht: '\u297D',
    rfloor: '\u230B',
    rfr: '\uD835\uDD2F',
    rhard: '\u21C1',
    rharu: '\u21C0',
    rharul: '\u296C',
    rho: '\u03C1',
    rhov: '\u03F1',
    rightarrow: '\u2192',
    rightarrowtail: '\u21A3',
    rightharpoondown: '\u21C1',
    rightharpoonup: '\u21C0',
    rightleftarrows: '\u21C4',
    rightleftharpoons: '\u21CC',
    rightrightarrows: '\u21C9',
    rightsquigarrow: '\u219D',
    rightthreetimes: '\u22CC',
    ring: '\u02DA',
    risingdotseq: '\u2253',
    rlarr: '\u21C4',
    rlhar: '\u21CC',
    rlm: '\u200F',
    rmoust: '\u23B1',
    rmoustache: '\u23B1',
    rnmid: '\u2AEE',
    roang: '\u27ED',
    roarr: '\u21FE',
    robrk: '\u27E7',
    ropar: '\u2986',
    ropf: '\uD835\uDD63',
    roplus: '\u2A2E',
    rotimes: '\u2A35',
    rpar: '\u0029',
    rpargt: '\u2994',
    rppolint: '\u2A12',
    rrarr: '\u21C9',
    rsaquo: '\u203A',
    rscr: '\uD835\uDCC7',
    rsh: '\u21B1',
    rsqb: '\u005D',
    rsquo: '\u2019',
    rsquor: '\u2019',
    rthree: '\u22CC',
    rtimes: '\u22CA',
    rtri: '\u25B9',
    rtrie: '\u22B5',
    rtrif: '\u25B8',
    rtriltri: '\u29CE',
    ruluhar: '\u2968',
    rx: '\u211E',
    sacute: '\u015B',
    sbquo: '\u201A',
    sc: '\u227B',
    scE: '\u2AB4',
    scap: '\u2AB8',
    scaron: '\u0161',
    sccue: '\u227D',
    sce: '\u2AB0',
    scedil: '\u015F',
    scirc: '\u015D',
    scnE: '\u2AB6',
    scnap: '\u2ABA',
    scnsim: '\u22E9',
    scpolint: '\u2A13',
    scsim: '\u227F',
    scy: '\u0441',
    sdot: '\u22C5',
    sdotb: '\u22A1',
    sdote: '\u2A66',
    seArr: '\u21D8',
    searhk: '\u2925',
    searr: '\u2198',
    searrow: '\u2198',
    sect: '\u00A7',
    semi: '\u003B',
    seswar: '\u2929',
    setminus: '\u2216',
    setmn: '\u2216',
    sext: '\u2736',
    sfr: '\uD835\uDD30',
    sfrown: '\u2322',
    sharp: '\u266F',
    shchcy: '\u0449',
    shcy: '\u0448',
    shortmid: '\u2223',
    shortparallel: '\u2225',
    shy: '\u00AD',
    sigma: '\u03C3',
    sigmaf: '\u03C2',
    sigmav: '\u03C2',
    sim: '\u223C',
    simdot: '\u2A6A',
    sime: '\u2243',
    simeq: '\u2243',
    simg: '\u2A9E',
    simgE: '\u2AA0',
    siml: '\u2A9D',
    simlE: '\u2A9F',
    simne: '\u2246',
    simplus: '\u2A24',
    simrarr: '\u2972',
    slarr: '\u2190',
    smallsetminus: '\u2216',
    smashp: '\u2A33',
    smeparsl: '\u29E4',
    smid: '\u2223',
    smile: '\u2323',
    smt: '\u2AAA',
    smte: '\u2AAC',
    smtes: '\u2AAC\uFE00',
    softcy: '\u044C',
    sol: '\u002F',
    solb: '\u29C4',
    solbar: '\u233F',
    sopf: '\uD835\uDD64',
    spades: '\u2660',
    spadesuit: '\u2660',
    spar: '\u2225',
    sqcap: '\u2293',
    sqcaps: '\u2293\uFE00',
    sqcup: '\u2294',
    sqcups: '\u2294\uFE00',
    sqsub: '\u228F',
    sqsube: '\u2291',
    sqsubset: '\u228F',
    sqsubseteq: '\u2291',
    sqsup: '\u2290',
    sqsupe: '\u2292',
    sqsupset: '\u2290',
    sqsupseteq: '\u2292',
    squ: '\u25A1',
    square: '\u25A1',
    squarf: '\u25AA',
    squf: '\u25AA',
    srarr: '\u2192',
    sscr: '\uD835\uDCC8',
    ssetmn: '\u2216',
    ssmile: '\u2323',
    sstarf: '\u22C6',
    star: '\u2606',
    starf: '\u2605',
    straightepsilon: '\u03F5',
    straightphi: '\u03D5',
    strns: '\u00AF',
    sub: '\u2282',
    subE: '\u2AC5',
    subdot: '\u2ABD',
    sube: '\u2286',
    subedot: '\u2AC3',
    submult: '\u2AC1',
    subnE: '\u2ACB',
    subne: '\u228A',
    subplus: '\u2ABF',
    subrarr: '\u2979',
    subset: '\u2282',
    subseteq: '\u2286',
    subseteqq: '\u2AC5',
    subsetneq: '\u228A',
    subsetneqq: '\u2ACB',
    subsim: '\u2AC7',
    subsub: '\u2AD5',
    subsup: '\u2AD3',
    succ: '\u227B',
    succapprox: '\u2AB8',
    succcurlyeq: '\u227D',
    succeq: '\u2AB0',
    succnapprox: '\u2ABA',
    succneqq: '\u2AB6',
    succnsim: '\u22E9',
    succsim: '\u227F',
    sum: '\u2211',
    sung: '\u266A',
    sup1: '\u00B9',
    sup2: '\u00B2',
    sup3: '\u00B3',
    sup: '\u2283',
    supE: '\u2AC6',
    supdot: '\u2ABE',
    supdsub: '\u2AD8',
    supe: '\u2287',
    supedot: '\u2AC4',
    suphsol: '\u27C9',
    suphsub: '\u2AD7',
    suplarr: '\u297B',
    supmult: '\u2AC2',
    supnE: '\u2ACC',
    supne: '\u228B',
    supplus: '\u2AC0',
    supset: '\u2283',
    supseteq: '\u2287',
    supseteqq: '\u2AC6',
    supsetneq: '\u228B',
    supsetneqq: '\u2ACC',
    supsim: '\u2AC8',
    supsub: '\u2AD4',
    supsup: '\u2AD6',
    swArr: '\u21D9',
    swarhk: '\u2926',
    swarr: '\u2199',
    swarrow: '\u2199',
    swnwar: '\u292A',
    szlig: '\u00DF',
    target: '\u2316',
    tau: '\u03C4',
    tbrk: '\u23B4',
    tcaron: '\u0165',
    tcedil: '\u0163',
    tcy: '\u0442',
    tdot: '\u20DB',
    telrec: '\u2315',
    tfr: '\uD835\uDD31',
    there4: '\u2234',
    therefore: '\u2234',
    theta: '\u03B8',
    thetasym: '\u03D1',
    thetav: '\u03D1',
    thickapprox: '\u2248',
    thicksim: '\u223C',
    thinsp: '\u2009',
    thkap: '\u2248',
    thksim: '\u223C',
    thorn: '\u00FE',
    tilde: '\u02DC',
    times: '\u00D7',
    timesb: '\u22A0',
    timesbar: '\u2A31',
    timesd: '\u2A30',
    tint: '\u222D',
    toea: '\u2928',
    top: '\u22A4',
    topbot: '\u2336',
    topcir: '\u2AF1',
    topf: '\uD835\uDD65',
    topfork: '\u2ADA',
    tosa: '\u2929',
    tprime: '\u2034',
    trade: '\u2122',
    triangle: '\u25B5',
    triangledown: '\u25BF',
    triangleleft: '\u25C3',
    trianglelefteq: '\u22B4',
    triangleq: '\u225C',
    triangleright: '\u25B9',
    trianglerighteq: '\u22B5',
    tridot: '\u25EC',
    trie: '\u225C',
    triminus: '\u2A3A',
    triplus: '\u2A39',
    trisb: '\u29CD',
    tritime: '\u2A3B',
    trpezium: '\u23E2',
    tscr: '\uD835\uDCC9',
    tscy: '\u0446',
    tshcy: '\u045B',
    tstrok: '\u0167',
    twixt: '\u226C',
    twoheadleftarrow: '\u219E',
    twoheadrightarrow: '\u21A0',
    uArr: '\u21D1',
    uHar: '\u2963',
    uacute: '\u00FA',
    uarr: '\u2191',
    ubrcy: '\u045E',
    ubreve: '\u016D',
    ucirc: '\u00FB',
    ucy: '\u0443',
    udarr: '\u21C5',
    udblac: '\u0171',
    udhar: '\u296E',
    ufisht: '\u297E',
    ufr: '\uD835\uDD32',
    ugrave: '\u00F9',
    uharl: '\u21BF',
    uharr: '\u21BE',
    uhblk: '\u2580',
    ulcorn: '\u231C',
    ulcorner: '\u231C',
    ulcrop: '\u230F',
    ultri: '\u25F8',
    umacr: '\u016B',
    uml: '\u00A8',
    uogon: '\u0173',
    uopf: '\uD835\uDD66',
    uparrow: '\u2191',
    updownarrow: '\u2195',
    upharpoonleft: '\u21BF',
    upharpoonright: '\u21BE',
    uplus: '\u228E',
    upsi: '\u03C5',
    upsih: '\u03D2',
    upsilon: '\u03C5',
    upuparrows: '\u21C8',
    urcorn: '\u231D',
    urcorner: '\u231D',
    urcrop: '\u230E',
    uring: '\u016F',
    urtri: '\u25F9',
    uscr: '\uD835\uDCCA',
    utdot: '\u22F0',
    utilde: '\u0169',
    utri: '\u25B5',
    utrif: '\u25B4',
    uuarr: '\u21C8',
    uuml: '\u00FC',
    uwangle: '\u29A7',
    vArr: '\u21D5',
    vBar: '\u2AE8',
    vBarv: '\u2AE9',
    vDash: '\u22A8',
    vangrt: '\u299C',
    varepsilon: '\u03F5',
    varkappa: '\u03F0',
    varnothing: '\u2205',
    varphi: '\u03D5',
    varpi: '\u03D6',
    varpropto: '\u221D',
    varr: '\u2195',
    varrho: '\u03F1',
    varsigma: '\u03C2',
    varsubsetneq: '\u228A\uFE00',
    varsubsetneqq: '\u2ACB\uFE00',
    varsupsetneq: '\u228B\uFE00',
    varsupsetneqq: '\u2ACC\uFE00',
    vartheta: '\u03D1',
    vartriangleleft: '\u22B2',
    vartriangleright: '\u22B3',
    vcy: '\u0432',
    vdash: '\u22A2',
    vee: '\u2228',
    veebar: '\u22BB',
    veeeq: '\u225A',
    vellip: '\u22EE',
    verbar: '\u007C',
    vert: '\u007C',
    vfr: '\uD835\uDD33',
    vltri: '\u22B2',
    vnsub: '\u2282\u20D2',
    vnsup: '\u2283\u20D2',
    vopf: '\uD835\uDD67',
    vprop: '\u221D',
    vrtri: '\u22B3',
    vscr: '\uD835\uDCCB',
    vsubnE: '\u2ACB\uFE00',
    vsubne: '\u228A\uFE00',
    vsupnE: '\u2ACC\uFE00',
    vsupne: '\u228B\uFE00',
    vzigzag: '\u299A',
    wcirc: '\u0175',
    wedbar: '\u2A5F',
    wedge: '\u2227',
    wedgeq: '\u2259',
    weierp: '\u2118',
    wfr: '\uD835\uDD34',
    wopf: '\uD835\uDD68',
    wp: '\u2118',
    wr: '\u2240',
    wreath: '\u2240',
    wscr: '\uD835\uDCCC',
    xcap: '\u22C2',
    xcirc: '\u25EF',
    xcup: '\u22C3',
    xdtri: '\u25BD',
    xfr: '\uD835\uDD35',
    xhArr: '\u27FA',
    xharr: '\u27F7',
    xi: '\u03BE',
    xlArr: '\u27F8',
    xlarr: '\u27F5',
    xmap: '\u27FC',
    xnis: '\u22FB',
    xodot: '\u2A00',
    xopf: '\uD835\uDD69',
    xoplus: '\u2A01',
    xotime: '\u2A02',
    xrArr: '\u27F9',
    xrarr: '\u27F6',
    xscr: '\uD835\uDCCD',
    xsqcup: '\u2A06',
    xuplus: '\u2A04',
    xutri: '\u25B3',
    xvee: '\u22C1',
    xwedge: '\u22C0',
    yacute: '\u00FD',
    yacy: '\u044F',
    ycirc: '\u0177',
    ycy: '\u044B',
    yen: '\u00A5',
    yfr: '\uD835\uDD36',
    yicy: '\u0457',
    yopf: '\uD835\uDD6A',
    yscr: '\uD835\uDCCE',
    yucy: '\u044E',
    yuml: '\u00FF',
    zacute: '\u017A',
    zcaron: '\u017E',
    zcy: '\u0437',
    zdot: '\u017C',
    zeetrf: '\u2128',
    zeta: '\u03B6',
    zfr: '\uD835\uDD37',
    zhcy: '\u0436',
    zigrarr: '\u21DD',
    zopf: '\uD835\uDD6B',
    zscr: '\uD835\uDCCF',
    zwj: '\u200D',
    zwnj: '\u200C'
};
const decodeMap = {
    '0': 65533,
    '128': 8364,
    '130': 8218,
    '131': 402,
    '132': 8222,
    '133': 8230,
    '134': 8224,
    '135': 8225,
    '136': 710,
    '137': 8240,
    '138': 352,
    '139': 8249,
    '140': 338,
    '142': 381,
    '145': 8216,
    '146': 8217,
    '147': 8220,
    '148': 8221,
    '149': 8226,
    '150': 8211,
    '151': 8212,
    '152': 732,
    '153': 8482,
    '154': 353,
    '155': 8250,
    '156': 339,
    '158': 382,
    '159': 376
};
function decodeHTMLStrict(text) {
    return text.replace(/&(?:[a-zA-Z]+|#[xX][\da-fA-F]+|#\d+);/g, (key) => {
        if (key.charAt(1) === '#') {
            const secondChar = key.charAt(2);
            const codePoint = secondChar === 'X' || secondChar === 'x'
                ? parseInt(key.slice(3), 16)
                : parseInt(key.slice(2), 10);
            return decodeCodePoint(codePoint);
        }
        return entities[key.slice(1, -1)] || key;
    });
}
function decodeCodePoint(codePoint) {
    if ((codePoint >= 0xd800 && codePoint <= 0xdfff) || codePoint > 0x10ffff) {
        return '\uFFFD';
    }
    if (codePoint in decodeMap) {
        codePoint = decodeMap[codePoint];
    }
    return String.fromCodePoint(codePoint);
}

function scanJSXAttributeValue(parser, context) {
    parser.startPos = parser.tokenPos = parser.index;
    parser.startColumn = parser.colPos = parser.column;
    parser.startLine = parser.linePos = parser.line;
    parser.token =
        CharTypes[parser.currentChar] & 8192
            ? scanJSXString(parser, context)
            : scanSingleToken(parser, context, 0);
    return parser.token;
}
function scanJSXString(parser, context) {
    const quote = parser.currentChar;
    let char = advanceChar(parser);
    const start = parser.index;
    while (char !== quote) {
        if (parser.index >= parser.end)
            report(parser, 14);
        char = advanceChar(parser);
    }
    if (char !== quote)
        report(parser, 14);
    parser.tokenValue = parser.source.slice(start, parser.index);
    advanceChar(parser);
    if (context & 512)
        parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
    return 134283267;
}
function scanJSXToken(parser, context) {
    parser.startPos = parser.tokenPos = parser.index;
    parser.startColumn = parser.colPos = parser.column;
    parser.startLine = parser.linePos = parser.line;
    if (parser.index >= parser.end)
        return (parser.token = 1048576);
    const token = TokenLookup[parser.source.charCodeAt(parser.index)];
    switch (token) {
        case 8456258: {
            advanceChar(parser);
            if (parser.currentChar === 47) {
                advanceChar(parser);
                parser.token = 25;
            }
            else {
                parser.token = 8456258;
            }
            break;
        }
        case 2162700: {
            advanceChar(parser);
            parser.token = 2162700;
            break;
        }
        default: {
            let state = 0;
            while (parser.index < parser.end) {
                const type = CharTypes[parser.source.charCodeAt(parser.index)];
                if (type & 1024) {
                    state |= 1 | 4;
                    scanNewLine(parser);
                }
                else if (type & 2048) {
                    consumeLineFeed(parser, state);
                    state = (state & ~4) | 1;
                }
                else {
                    advanceChar(parser);
                }
                if (CharTypes[parser.currentChar] & 16384)
                    break;
            }
            const raw = parser.source.slice(parser.tokenPos, parser.index);
            if (context & 512)
                parser.tokenRaw = raw;
            parser.tokenValue = decodeHTMLStrict(raw);
            parser.token = 138;
        }
    }
    return parser.token;
}
function scanJSXIdentifier(parser) {
    if ((parser.token & 143360) === 143360) {
        const { index } = parser;
        let char = parser.currentChar;
        while (CharTypes[char] & (32768 | 2)) {
            char = advanceChar(parser);
        }
        parser.tokenValue += parser.source.slice(index, parser.index);
    }
    parser.token = 208897;
    return parser.token;
}

function matchOrInsertSemicolon(parser, context, specDeviation) {
    if ((parser.flags & 1) === 0 &&
        (parser.token & 1048576) !== 1048576 &&
        !specDeviation) {
        report(parser, 28, KeywordDescTable[parser.token & 255]);
    }
    consumeOpt(parser, context, 1074790417);
}
function isValidStrictMode(parser, index, tokenPos, tokenValue) {
    if (index - tokenPos < 13 && tokenValue === 'use strict') {
        if ((parser.token & 1048576) === 1048576 || parser.flags & 1) {
            return 1;
        }
    }
    return 0;
}
function optionalBit(parser, context, t) {
    if (parser.token !== t)
        return 0;
    nextToken(parser, context);
    return 1;
}
function consumeOpt(parser, context, t) {
    if (parser.token !== t)
        return false;
    nextToken(parser, context);
    return true;
}
function consume(parser, context, t) {
    if (parser.token !== t)
        report(parser, 23, KeywordDescTable[t & 255]);
    nextToken(parser, context);
}
function reinterpretToPattern(state, node) {
    switch (node.type) {
        case 'ArrayExpression':
            node.type = 'ArrayPattern';
            const elements = node.elements;
            for (let i = 0, n = elements.length; i < n; ++i) {
                const element = elements[i];
                if (element)
                    reinterpretToPattern(state, element);
            }
            return;
        case 'ObjectExpression':
            node.type = 'ObjectPattern';
            const properties = node.properties;
            for (let i = 0, n = properties.length; i < n; ++i) {
                reinterpretToPattern(state, properties[i]);
            }
            return;
        case 'AssignmentExpression':
            node.type = 'AssignmentPattern';
            if (node.operator !== '=')
                report(state, 68);
            delete node.operator;
            reinterpretToPattern(state, node.left);
            return;
        case 'Property':
            reinterpretToPattern(state, node.value);
            return;
        case 'SpreadElement':
            node.type = 'RestElement';
            reinterpretToPattern(state, node.argument);
    }
}
function validateBindingIdentifier(parser, context, kind, t, skipEvalArgCheck) {
    if (context & 1024) {
        if ((t & 36864) === 36864) {
            report(parser, 114);
        }
        if (!skipEvalArgCheck && (t & 537079808) === 537079808) {
            report(parser, 115);
        }
    }
    if ((t & 20480) === 20480) {
        report(parser, 99);
    }
    if (kind & (8 | 16) && t === 241739) {
        report(parser, 97);
    }
    if (context & (4194304 | 2048) && t === 209008) {
        report(parser, 95);
    }
    if (context & (2097152 | 1024) && t === 241773) {
        report(parser, 94, 'yield');
    }
}
function validateFunctionName(parser, context, t) {
    if (context & 1024) {
        if ((t & 36864) === 36864) {
            report(parser, 114);
        }
        if ((t & 537079808) === 537079808) {
            report(parser, 115);
        }
        if (t === 122) {
            report(parser, 92);
        }
        if (t === 121) {
            report(parser, 92);
        }
    }
    if ((t & 20480) === 20480) {
        report(parser, 99);
    }
    if (context & (4194304 | 2048) && t === 209008) {
        report(parser, 95);
    }
    if (context & (2097152 | 1024) && t === 241773) {
        report(parser, 94, 'yield');
    }
}
function isStrictReservedWord(parser, context, t) {
    if (t === 209008) {
        if (context & (4194304 | 2048))
            report(parser, 95);
        parser.destructible |= 128;
    }
    if (t === 241773 && context & 2097152)
        report(parser, 94, 'yield');
    return ((t & 20480) === 20480 ||
        (t & 36864) === 36864 ||
        t == 122);
}
function isPropertyWithPrivateFieldKey(expr) {
    return !expr.property ? false : expr.property.type === 'PrivateIdentifier';
}
function isValidLabel(parser, labels, name, isIterationStatement) {
    while (labels) {
        if (labels['$' + name]) {
            if (isIterationStatement)
                report(parser, 133);
            return 1;
        }
        if (isIterationStatement && labels.loop)
            isIterationStatement = 0;
        labels = labels['$'];
    }
    return 0;
}
function validateAndDeclareLabel(parser, labels, name) {
    let set = labels;
    while (set) {
        if (set['$' + name])
            report(parser, 132, name);
        set = set['$'];
    }
    labels['$' + name] = 1;
}
function finishNode(parser, context, start, line, column, node) {
    if (context & 2) {
        node.start = start;
        node.end = parser.startPos;
        node.range = [start, parser.startPos];
    }
    if (context & 4) {
        node.loc = {
            start: {
                line,
                column
            },
            end: {
                line: parser.startLine,
                column: parser.startColumn
            }
        };
        if (parser.sourceFile) {
            node.loc.source = parser.sourceFile;
        }
    }
    return node;
}
function isEqualTagName(elementName) {
    switch (elementName.type) {
        case 'JSXIdentifier':
            return elementName.name;
        case 'JSXNamespacedName':
            return elementName.namespace + ':' + elementName.name;
        case 'JSXMemberExpression':
            return isEqualTagName(elementName.object) + '.' + isEqualTagName(elementName.property);
    }
}
function createArrowHeadParsingScope(parser, context, value) {
    const scope = addChildScope(createScope(), 1024);
    addBlockName(parser, context, scope, value, 1, 0);
    return scope;
}
function recordScopeError(parser, type, ...params) {
    const { index, line, column } = parser;
    return {
        type,
        params,
        index,
        line,
        column
    };
}
function createScope() {
    return {
        parent: void 0,
        type: 2
    };
}
function addChildScope(parent, type) {
    return {
        parent,
        type,
        scopeError: void 0
    };
}
function addVarOrBlock(parser, context, scope, name, kind, origin) {
    if (kind & 4) {
        addVarName(parser, context, scope, name, kind);
    }
    else {
        addBlockName(parser, context, scope, name, kind, origin);
    }
    if (origin & 64) {
        declareUnboundVariable(parser, name);
    }
}
function addBlockName(parser, context, scope, name, kind, origin) {
    const value = scope['#' + name];
    if (value && (value & 2) === 0) {
        if (kind & 1) {
            scope.scopeError = recordScopeError(parser, 140, name);
        }
        else if (context & 256 &&
            value & 64 &&
            origin & 2) ;
        else {
            report(parser, 140, name);
        }
    }
    if (scope.type & 128 &&
        (scope.parent['#' + name] && (scope.parent['#' + name] & 2) === 0)) {
        report(parser, 140, name);
    }
    if (scope.type & 1024 && value && (value & 2) === 0) {
        if (kind & 1) {
            scope.scopeError = recordScopeError(parser, 140, name);
        }
    }
    if (scope.type & 64) {
        if (scope.parent['#' + name] & 768)
            report(parser, 153, name);
    }
    scope['#' + name] = kind;
}
function addVarName(parser, context, scope, name, kind) {
    let currentScope = scope;
    while (currentScope && (currentScope.type & 256) === 0) {
        const value = currentScope['#' + name];
        if (value & 248) {
            if (context & 256 &&
                (context & 1024) === 0 &&
                ((kind & 128 && value & 68) ||
                    (value & 128 && kind & 68))) ;
            else {
                report(parser, 140, name);
            }
        }
        if (currentScope === scope) {
            if (value & 1 && kind & 1) {
                currentScope.scopeError = recordScopeError(parser, 140, name);
            }
        }
        if (value & (512 | 256)) {
            if ((value & 512) === 0 ||
                (context & 256) === 0 ||
                context & 1024) {
                report(parser, 140, name);
            }
        }
        currentScope['#' + name] = kind;
        currentScope = currentScope.parent;
    }
}
function declareUnboundVariable(parser, name) {
    if (parser.exportedNames !== void 0 && name !== '') {
        if (parser.exportedNames['#' + name]) {
            report(parser, 141, name);
        }
        parser.exportedNames['#' + name] = 1;
    }
}
function addBindingToExports(parser, name) {
    if (parser.exportedBindings !== void 0 && name !== '') {
        parser.exportedBindings['#' + name] = 1;
    }
}
function pushComment(context, array) {
    return function (type, value, start, end, loc) {
        const comment = {
            type,
            value
        };
        if (context & 2) {
            comment.start = start;
            comment.end = end;
            comment.range = [start, end];
        }
        if (context & 4) {
            comment.loc = loc;
        }
        array.push(comment);
    };
}
function pushToken(context, array) {
    return function (token, start, end, loc) {
        const tokens = {
            token
        };
        if (context & 2) {
            tokens.start = start;
            tokens.end = end;
            tokens.range = [start, end];
        }
        if (context & 4) {
            tokens.loc = loc;
        }
        array.push(tokens);
    };
}
function isValidIdentifier(context, t) {
    if (context & (1024 | 2097152)) {
        if (context & 2048 && t === 209008)
            return false;
        if (context & 2097152 && t === 241773)
            return false;
        return (t & 143360) === 143360 || (t & 12288) === 12288;
    }
    return ((t & 143360) === 143360 ||
        (t & 12288) === 12288 ||
        (t & 36864) === 36864);
}
function classifyIdentifier(parser, context, t, isArrow) {
    if ((t & 537079808) === 537079808) {
        if (context & 1024)
            report(parser, 115);
        if (isArrow)
            parser.flags |= 512;
    }
    if (!isValidIdentifier(context, t))
        report(parser, 0);
}

function create(source, sourceFile, onComment, onToken) {
    return {
        source,
        flags: 0,
        index: 0,
        line: 1,
        column: 0,
        startPos: 0,
        end: source.length,
        tokenPos: 0,
        startColumn: 0,
        colPos: 0,
        linePos: 1,
        startLine: 1,
        sourceFile,
        tokenValue: '',
        token: 1048576,
        tokenRaw: '',
        tokenRegExp: void 0,
        currentChar: source.charCodeAt(0),
        exportedNames: [],
        exportedBindings: [],
        assignable: 1,
        destructible: 0,
        onComment,
        onToken,
        leadingDecorators: []
    };
}
function parseSource(source, options, context) {
    let sourceFile = '';
    let onComment;
    let onToken;
    if (options != null) {
        if (options.module)
            context |= 2048 | 1024;
        if (options.next)
            context |= 1;
        if (options.loc)
            context |= 4;
        if (options.ranges)
            context |= 2;
        if (options.uniqueKeyInPattern)
            context |= -2147483648;
        if (options.lexical)
            context |= 64;
        if (options.webcompat)
            context |= 256;
        if (options.directives)
            context |= 8 | 512;
        if (options.globalReturn)
            context |= 32;
        if (options.raw)
            context |= 512;
        if (options.preserveParens)
            context |= 128;
        if (options.impliedStrict)
            context |= 1024;
        if (options.jsx)
            context |= 16;
        if (options.identifierPattern)
            context |= 268435456;
        if (options.specDeviation)
            context |= 536870912;
        if (options.source)
            sourceFile = options.source;
        if (options.onComment != null) {
            onComment = Array.isArray(options.onComment) ? pushComment(context, options.onComment) : options.onComment;
        }
        if (options.onToken != null) {
            onToken = Array.isArray(options.onToken) ? pushToken(context, options.onToken) : options.onToken;
        }
    }
    const parser = create(source, sourceFile, onComment, onToken);
    if (context & 1)
        skipHashBang(parser);
    const scope = context & 64 ? createScope() : void 0;
    let body = [];
    let sourceType = 'script';
    if (context & 2048) {
        sourceType = 'module';
        body = parseModuleItemList(parser, context | 8192, scope);
        if (scope) {
            for (const key in parser.exportedBindings) {
                if (key[0] === '#' && !scope[key])
                    report(parser, 142, key.slice(1));
            }
        }
    }
    else {
        body = parseStatementList(parser, context | 8192, scope);
    }
    const node = {
        type: 'Program',
        sourceType,
        body
    };
    if (context & 2) {
        node.start = 0;
        node.end = source.length;
        node.range = [0, source.length];
    }
    if (context & 4) {
        node.loc = {
            start: { line: 1, column: 0 },
            end: { line: parser.line, column: parser.column }
        };
        if (parser.sourceFile)
            node.loc.source = sourceFile;
    }
    return node;
}
function parseStatementList(parser, context, scope) {
    nextToken(parser, context | 32768 | 1073741824);
    const statements = [];
    while (parser.token === 134283267) {
        const { index, tokenPos, tokenValue, linePos, colPos, token } = parser;
        const expr = parseLiteral(parser, context);
        if (isValidStrictMode(parser, index, tokenPos, tokenValue))
            context |= 1024;
        statements.push(parseDirective(parser, context, expr, token, tokenPos, linePos, colPos));
    }
    while (parser.token !== 1048576) {
        statements.push(parseStatementListItem(parser, context, scope, 4, {}));
    }
    return statements;
}
function parseModuleItemList(parser, context, scope) {
    nextToken(parser, context | 32768);
    const statements = [];
    if (context & 8) {
        while (parser.token === 134283267) {
            const { tokenPos, linePos, colPos, token } = parser;
            statements.push(parseDirective(parser, context, parseLiteral(parser, context), token, tokenPos, linePos, colPos));
        }
    }
    while (parser.token !== 1048576) {
        statements.push(parseModuleItem(parser, context, scope));
    }
    return statements;
}
function parseModuleItem(parser, context, scope) {
    parser.leadingDecorators = parseDecorators(parser, context);
    let moduleItem;
    switch (parser.token) {
        case 20566:
            moduleItem = parseExportDeclaration(parser, context, scope);
            break;
        case 86108:
            moduleItem = parseImportDeclaration(parser, context, scope);
            break;
        default:
            moduleItem = parseStatementListItem(parser, context, scope, 4, {});
    }
    if (parser.leadingDecorators.length) {
        report(parser, 164);
    }
    return moduleItem;
}
function parseStatementListItem(parser, context, scope, origin, labels) {
    const start = parser.tokenPos;
    const line = parser.linePos;
    const column = parser.colPos;
    switch (parser.token) {
        case 86106:
            return parseFunctionDeclaration(parser, context, scope, origin, 1, 0, 0, start, line, column);
        case 133:
        case 86096:
            return parseClassDeclaration(parser, context, scope, 0, start, line, column);
        case 86092:
            return parseLexicalDeclaration(parser, context, scope, 16, 0, start, line, column);
        case 241739:
            return parseLetIdentOrVarDeclarationStatement(parser, context, scope, origin, start, line, column);
        case 20566:
            report(parser, 100, 'export');
        case 86108:
            nextToken(parser, context);
            switch (parser.token) {
                case 67174411:
                    return parseImportCallDeclaration(parser, context, start, line, column);
                case 67108877:
                    return parseImportMetaDeclaration(parser, context, start, line, column);
                default:
                    report(parser, 100, 'import');
            }
        case 209007:
            return parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, scope, origin, labels, 1, start, line, column);
        default:
            return parseStatement(parser, context, scope, origin, labels, 1, start, line, column);
    }
}
function parseStatement(parser, context, scope, origin, labels, allowFuncDecl, start, line, column) {
    switch (parser.token) {
        case 86090:
            return parseVariableStatement(parser, context, scope, 0, start, line, column);
        case 20574:
            return parseReturnStatement(parser, context, start, line, column);
        case 20571:
            return parseIfStatement(parser, context, scope, labels, start, line, column);
        case 20569:
            return parseForStatement(parser, context, scope, labels, start, line, column);
        case 20564:
            return parseDoWhileStatement(parser, context, scope, labels, start, line, column);
        case 20580:
            return parseWhileStatement(parser, context, scope, labels, start, line, column);
        case 86112:
            return parseSwitchStatement(parser, context, scope, labels, start, line, column);
        case 1074790417:
            return parseEmptyStatement(parser, context, start, line, column);
        case 2162700:
            return parseBlock(parser, context, scope ? addChildScope(scope, 2) : scope, labels, start, line, column);
        case 86114:
            return parseThrowStatement(parser, context, start, line, column);
        case 20557:
            return parseBreakStatement(parser, context, labels, start, line, column);
        case 20561:
            return parseContinueStatement(parser, context, labels, start, line, column);
        case 20579:
            return parseTryStatement(parser, context, scope, labels, start, line, column);
        case 20581:
            return parseWithStatement(parser, context, scope, labels, start, line, column);
        case 20562:
            return parseDebuggerStatement(parser, context, start, line, column);
        case 209007:
            return parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, scope, origin, labels, 0, start, line, column);
        case 20559:
            report(parser, 156);
        case 20568:
            report(parser, 157);
        case 86106:
            report(parser, context & 1024
                ? 73
                : (context & 256) === 0
                    ? 75
                    : 74);
        case 86096:
            report(parser, 76);
        default:
            return parseExpressionOrLabelledStatement(parser, context, scope, origin, labels, allowFuncDecl, start, line, column);
    }
}
function parseExpressionOrLabelledStatement(parser, context, scope, origin, labels, allowFuncDecl, start, line, column) {
    const { tokenValue, token } = parser;
    let expr;
    switch (token) {
        case 241739:
            expr = parseIdentifier(parser, context, 0);
            if (context & 1024)
                report(parser, 82);
            if (parser.token === 69271571)
                report(parser, 81);
            break;
        default:
            expr = parsePrimaryExpression(parser, context, 2, 0, 1, 0, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    }
    if (token & 143360 && parser.token === 21) {
        return parseLabelledStatement(parser, context, scope, origin, labels, tokenValue, expr, token, allowFuncDecl, start, line, column);
    }
    expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
    expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr);
    if (parser.token === 18) {
        expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
    }
    return parseExpressionStatement(parser, context, expr, start, line, column);
}
function parseBlock(parser, context, scope, labels, start, line, column) {
    const body = [];
    consume(parser, context | 32768, 2162700);
    while (parser.token !== 1074790415) {
        body.push(parseStatementListItem(parser, context, scope, 2, { $: labels }));
    }
    consume(parser, context | 32768, 1074790415);
    return finishNode(parser, context, start, line, column, {
        type: 'BlockStatement',
        body
    });
}
function parseReturnStatement(parser, context, start, line, column) {
    if ((context & 32) === 0 && context & 8192)
        report(parser, 89);
    nextToken(parser, context | 32768);
    const argument = parser.flags & 1 || parser.token & 1048576
        ? null
        : parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'ReturnStatement',
        argument
    });
}
function parseExpressionStatement(parser, context, expression, start, line, column) {
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'ExpressionStatement',
        expression
    });
}
function parseLabelledStatement(parser, context, scope, origin, labels, value, expr, token, allowFuncDecl, start, line, column) {
    validateBindingIdentifier(parser, context, 0, token, 1);
    validateAndDeclareLabel(parser, labels, value);
    nextToken(parser, context | 32768);
    const body = allowFuncDecl &&
        (context & 1024) === 0 &&
        context & 256 &&
        parser.token === 86106
        ? parseFunctionDeclaration(parser, context, addChildScope(scope, 2), origin, 0, 0, 0, parser.tokenPos, parser.linePos, parser.colPos)
        : parseStatement(parser, context, scope, origin, labels, allowFuncDecl, parser.tokenPos, parser.linePos, parser.colPos);
    return finishNode(parser, context, start, line, column, {
        type: 'LabeledStatement',
        label: expr,
        body
    });
}
function parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, scope, origin, labels, allowFuncDecl, start, line, column) {
    const { token, tokenValue } = parser;
    let expr = parseIdentifier(parser, context, 0);
    if (parser.token === 21) {
        return parseLabelledStatement(parser, context, scope, origin, labels, tokenValue, expr, token, 1, start, line, column);
    }
    const asyncNewLine = parser.flags & 1;
    if (!asyncNewLine) {
        if (parser.token === 86106) {
            if (!allowFuncDecl)
                report(parser, 119);
            return parseFunctionDeclaration(parser, context, scope, origin, 1, 0, 1, start, line, column);
        }
        if ((parser.token & 143360) === 143360) {
            expr = parseAsyncArrowAfterIdent(parser, context, 1, start, line, column);
            if (parser.token === 18)
                expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
            return parseExpressionStatement(parser, context, expr, start, line, column);
        }
    }
    if (parser.token === 67174411) {
        expr = parseAsyncArrowOrCallExpression(parser, context, expr, 1, 1, 0, asyncNewLine, start, line, column);
    }
    else {
        if (parser.token === 10) {
            classifyIdentifier(parser, context, token, 1);
            expr = parseArrowFromIdentifier(parser, context, parser.tokenValue, expr, 0, 1, 0, start, line, column);
        }
        parser.assignable = 1;
    }
    expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
    if (parser.token === 18)
        expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
    expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr);
    parser.assignable = 1;
    return parseExpressionStatement(parser, context, expr, start, line, column);
}
function parseDirective(parser, context, expression, token, start, line, column) {
    if (token !== 1074790417) {
        parser.assignable = 2;
        expression = parseMemberOrUpdateExpression(parser, context, expression, 0, 0, start, line, column);
        if (parser.token !== 1074790417) {
            expression = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expression);
            if (parser.token === 18) {
                expression = parseSequenceExpression(parser, context, 0, start, line, column, expression);
            }
        }
        matchOrInsertSemicolon(parser, context | 32768);
    }
    return context & 8 && expression.type === 'Literal' && typeof expression.value === 'string'
        ? finishNode(parser, context, start, line, column, {
            type: 'ExpressionStatement',
            expression,
            directive: expression.raw.slice(1, -1)
        })
        : finishNode(parser, context, start, line, column, {
            type: 'ExpressionStatement',
            expression
        });
}
function parseEmptyStatement(parser, context, start, line, column) {
    nextToken(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'EmptyStatement'
    });
}
function parseThrowStatement(parser, context, start, line, column) {
    nextToken(parser, context | 32768);
    if (parser.flags & 1)
        report(parser, 87);
    const argument = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'ThrowStatement',
        argument
    });
}
function parseIfStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context);
    consume(parser, context | 32768, 67174411);
    parser.assignable = 1;
    const test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.line, parser.colPos);
    consume(parser, context | 32768, 16);
    const consequent = parseConsequentOrAlternative(parser, context, scope, labels, parser.tokenPos, parser.linePos, parser.colPos);
    let alternate = null;
    if (parser.token === 20565) {
        nextToken(parser, context | 32768);
        alternate = parseConsequentOrAlternative(parser, context, scope, labels, parser.tokenPos, parser.linePos, parser.colPos);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'IfStatement',
        test,
        consequent,
        alternate
    });
}
function parseConsequentOrAlternative(parser, context, scope, labels, start, line, column) {
    return context & 1024 ||
        (context & 256) === 0 ||
        parser.token !== 86106
        ? parseStatement(parser, context, scope, 0, { $: labels }, 0, parser.tokenPos, parser.linePos, parser.colPos)
        : parseFunctionDeclaration(parser, context, addChildScope(scope, 2), 0, 0, 0, 0, start, line, column);
}
function parseSwitchStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context);
    consume(parser, context | 32768, 67174411);
    const discriminant = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context, 16);
    consume(parser, context, 2162700);
    const cases = [];
    let seenDefault = 0;
    if (scope)
        scope = addChildScope(scope, 8);
    while (parser.token !== 1074790415) {
        const { tokenPos, linePos, colPos } = parser;
        let test = null;
        const consequent = [];
        if (consumeOpt(parser, context | 32768, 20558)) {
            test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
        }
        else {
            consume(parser, context | 32768, 20563);
            if (seenDefault)
                report(parser, 86);
            seenDefault = 1;
        }
        consume(parser, context | 32768, 21);
        while (parser.token !== 20558 &&
            parser.token !== 1074790415 &&
            parser.token !== 20563) {
            consequent.push(parseStatementListItem(parser, context | 4096, scope, 2, {
                $: labels
            }));
        }
        cases.push(finishNode(parser, context, tokenPos, linePos, colPos, {
            type: 'SwitchCase',
            test,
            consequent
        }));
    }
    consume(parser, context | 32768, 1074790415);
    return finishNode(parser, context, start, line, column, {
        type: 'SwitchStatement',
        discriminant,
        cases
    });
}
function parseWhileStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context);
    consume(parser, context | 32768, 67174411);
    const test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context | 32768, 16);
    const body = parseIterationStatementBody(parser, context, scope, labels);
    return finishNode(parser, context, start, line, column, {
        type: 'WhileStatement',
        test,
        body
    });
}
function parseIterationStatementBody(parser, context, scope, labels) {
    return parseStatement(parser, ((context | 134217728) ^ 134217728) | 131072, scope, 0, { loop: 1, $: labels }, 0, parser.tokenPos, parser.linePos, parser.colPos);
}
function parseContinueStatement(parser, context, labels, start, line, column) {
    if ((context & 131072) === 0)
        report(parser, 65);
    nextToken(parser, context);
    let label = null;
    if ((parser.flags & 1) === 0 && parser.token & 143360) {
        const { tokenValue } = parser;
        label = parseIdentifier(parser, context | 32768, 0);
        if (!isValidLabel(parser, labels, tokenValue, 1))
            report(parser, 134, tokenValue);
    }
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'ContinueStatement',
        label
    });
}
function parseBreakStatement(parser, context, labels, start, line, column) {
    nextToken(parser, context | 32768);
    let label = null;
    if ((parser.flags & 1) === 0 && parser.token & 143360) {
        const { tokenValue } = parser;
        label = parseIdentifier(parser, context | 32768, 0);
        if (!isValidLabel(parser, labels, tokenValue, 0))
            report(parser, 134, tokenValue);
    }
    else if ((context & (4096 | 131072)) === 0) {
        report(parser, 66);
    }
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'BreakStatement',
        label
    });
}
function parseWithStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context);
    if (context & 1024)
        report(parser, 88);
    consume(parser, context | 32768, 67174411);
    const object = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context | 32768, 16);
    const body = parseStatement(parser, context, scope, 2, labels, 0, parser.tokenPos, parser.linePos, parser.colPos);
    return finishNode(parser, context, start, line, column, {
        type: 'WithStatement',
        object,
        body
    });
}
function parseDebuggerStatement(parser, context, start, line, column) {
    nextToken(parser, context | 32768);
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'DebuggerStatement'
    });
}
function parseTryStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context | 32768);
    const firstScope = scope ? addChildScope(scope, 32) : void 0;
    const block = parseBlock(parser, context, firstScope, { $: labels }, parser.tokenPos, parser.linePos, parser.colPos);
    const { tokenPos, linePos, colPos } = parser;
    const handler = consumeOpt(parser, context | 32768, 20559)
        ? parseCatchBlock(parser, context, scope, labels, tokenPos, linePos, colPos)
        : null;
    let finalizer = null;
    if (parser.token === 20568) {
        nextToken(parser, context | 32768);
        const finalizerScope = firstScope ? addChildScope(scope, 4) : void 0;
        finalizer = parseBlock(parser, context, finalizerScope, { $: labels }, parser.tokenPos, parser.linePos, parser.colPos);
    }
    if (!handler && !finalizer) {
        report(parser, 85);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'TryStatement',
        block,
        handler,
        finalizer
    });
}
function parseCatchBlock(parser, context, scope, labels, start, line, column) {
    let param = null;
    let additionalScope = scope;
    if (consumeOpt(parser, context, 67174411)) {
        if (scope)
            scope = addChildScope(scope, 4);
        param = parseBindingPattern(parser, context, scope, (parser.token & 2097152) === 2097152
            ? 256
            : 512, 0, parser.tokenPos, parser.linePos, parser.colPos);
        if (parser.token === 18) {
            report(parser, 83);
        }
        else if (parser.token === 1077936157) {
            report(parser, 84);
        }
        consume(parser, context | 32768, 16);
        if (scope)
            additionalScope = addChildScope(scope, 64);
    }
    const body = parseBlock(parser, context, additionalScope, { $: labels }, parser.tokenPos, parser.linePos, parser.colPos);
    return finishNode(parser, context, start, line, column, {
        type: 'CatchClause',
        param,
        body
    });
}
function parseStaticBlock(parser, context, scope, start, line, column) {
    if (scope)
        scope = addChildScope(scope, 2);
    const ctorContext = 16384 | 524288;
    context = ((context | ctorContext) ^ ctorContext) | 262144;
    const { body } = parseBlock(parser, context, scope, {}, start, line, column);
    return finishNode(parser, context, start, line, column, {
        type: 'StaticBlock',
        body
    });
}
function parseDoWhileStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context | 32768);
    const body = parseIterationStatementBody(parser, context, scope, labels);
    consume(parser, context, 20580);
    consume(parser, context | 32768, 67174411);
    const test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context | 32768, 16);
    consumeOpt(parser, context, 1074790417);
    return finishNode(parser, context, start, line, column, {
        type: 'DoWhileStatement',
        body,
        test
    });
}
function parseLetIdentOrVarDeclarationStatement(parser, context, scope, origin, start, line, column) {
    const { token, tokenValue } = parser;
    let expr = parseIdentifier(parser, context, 0);
    if (parser.token & (143360 | 2097152)) {
        const declarations = parseVariableDeclarationList(parser, context, scope, 8, 0);
        matchOrInsertSemicolon(parser, context | 32768);
        return finishNode(parser, context, start, line, column, {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations
        });
    }
    parser.assignable = 1;
    if (context & 1024)
        report(parser, 82);
    if (parser.token === 21) {
        return parseLabelledStatement(parser, context, scope, origin, {}, tokenValue, expr, token, 0, start, line, column);
    }
    if (parser.token === 10) {
        let scope = void 0;
        if (context & 64)
            scope = createArrowHeadParsingScope(parser, context, tokenValue);
        parser.flags = (parser.flags | 128) ^ 128;
        expr = parseArrowFunctionExpression(parser, context, scope, [expr], 0, start, line, column);
    }
    else {
        expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
        expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr);
    }
    if (parser.token === 18) {
        expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
    }
    return parseExpressionStatement(parser, context, expr, start, line, column);
}
function parseLexicalDeclaration(parser, context, scope, kind, origin, start, line, column) {
    nextToken(parser, context);
    const declarations = parseVariableDeclarationList(parser, context, scope, kind, origin);
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'VariableDeclaration',
        kind: kind & 8 ? 'let' : 'const',
        declarations
    });
}
function parseVariableStatement(parser, context, scope, origin, start, line, column) {
    nextToken(parser, context);
    const declarations = parseVariableDeclarationList(parser, context, scope, 4, origin);
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'VariableDeclaration',
        kind: 'var',
        declarations
    });
}
function parseVariableDeclarationList(parser, context, scope, kind, origin) {
    let bindingCount = 1;
    const list = [parseVariableDeclaration(parser, context, scope, kind, origin)];
    while (consumeOpt(parser, context, 18)) {
        bindingCount++;
        list.push(parseVariableDeclaration(parser, context, scope, kind, origin));
    }
    if (bindingCount > 1 && origin & 32 && parser.token & 262144) {
        report(parser, 58, KeywordDescTable[parser.token & 255]);
    }
    return list;
}
function parseVariableDeclaration(parser, context, scope, kind, origin) {
    const { token, tokenPos, linePos, colPos } = parser;
    let init = null;
    const id = parseBindingPattern(parser, context, scope, kind, origin, tokenPos, linePos, colPos);
    if (parser.token === 1077936157) {
        nextToken(parser, context | 32768);
        init = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
        if (origin & 32 || (token & 2097152) === 0) {
            if (parser.token === 274549 ||
                (parser.token === 8738868 &&
                    (token & 2097152 || (kind & 4) === 0 || context & 1024))) {
                reportMessageAt(tokenPos, parser.line, parser.index - 3, 57, parser.token === 274549 ? 'of' : 'in');
            }
        }
    }
    else if ((kind & 16 || (token & 2097152) > 0) &&
        (parser.token & 262144) !== 262144) {
        report(parser, 56, kind & 16 ? 'const' : 'destructuring');
    }
    return finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'VariableDeclarator',
        id,
        init
    });
}
function parseForStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context);
    const forAwait = ((context & 4194304) > 0 || ((context & 2048) > 0 && (context & 8192) > 0)) &&
        consumeOpt(parser, context, 209008);
    consume(parser, context | 32768, 67174411);
    if (scope)
        scope = addChildScope(scope, 1);
    let test = null;
    let update = null;
    let destructible = 0;
    let init = null;
    let isVarDecl = parser.token === 86090 || parser.token === 241739 || parser.token === 86092;
    let right;
    const { token, tokenPos, linePos, colPos } = parser;
    if (isVarDecl) {
        if (token === 241739) {
            init = parseIdentifier(parser, context, 0);
            if (parser.token & (143360 | 2097152)) {
                if (parser.token === 8738868) {
                    if (context & 1024)
                        report(parser, 64);
                }
                else {
                    init = finishNode(parser, context, tokenPos, linePos, colPos, {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: parseVariableDeclarationList(parser, context | 134217728, scope, 8, 32)
                    });
                }
                parser.assignable = 1;
            }
            else if (context & 1024) {
                report(parser, 64);
            }
            else {
                isVarDecl = false;
                parser.assignable = 1;
                init = parseMemberOrUpdateExpression(parser, context, init, 0, 0, tokenPos, linePos, colPos);
                if (parser.token === 274549)
                    report(parser, 111);
            }
        }
        else {
            nextToken(parser, context);
            init = finishNode(parser, context, tokenPos, linePos, colPos, token === 86090
                ? {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: parseVariableDeclarationList(parser, context | 134217728, scope, 4, 32)
                }
                : {
                    type: 'VariableDeclaration',
                    kind: 'const',
                    declarations: parseVariableDeclarationList(parser, context | 134217728, scope, 16, 32)
                });
            parser.assignable = 1;
        }
    }
    else if (token === 1074790417) {
        if (forAwait)
            report(parser, 79);
    }
    else if ((token & 2097152) === 2097152) {
        init =
            token === 2162700
                ? parseObjectLiteralOrPattern(parser, context, void 0, 1, 0, 0, 2, 32, tokenPos, linePos, colPos)
                : parseArrayExpressionOrPattern(parser, context, void 0, 1, 0, 0, 2, 32, tokenPos, linePos, colPos);
        destructible = parser.destructible;
        if (context & 256 && destructible & 64) {
            report(parser, 60);
        }
        parser.assignable =
            destructible & 16 ? 2 : 1;
        init = parseMemberOrUpdateExpression(parser, context | 134217728, init, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
    }
    else {
        init = parseLeftHandSideExpression(parser, context | 134217728, 1, 0, 1, tokenPos, linePos, colPos);
    }
    if ((parser.token & 262144) === 262144) {
        if (parser.token === 274549) {
            if (parser.assignable & 2)
                report(parser, 77, forAwait ? 'await' : 'of');
            reinterpretToPattern(parser, init);
            nextToken(parser, context | 32768);
            right = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
            consume(parser, context | 32768, 16);
            const body = parseIterationStatementBody(parser, context, scope, labels);
            return finishNode(parser, context, start, line, column, {
                type: 'ForOfStatement',
                left: init,
                right,
                body,
                await: forAwait
            });
        }
        if (parser.assignable & 2)
            report(parser, 77, 'in');
        reinterpretToPattern(parser, init);
        nextToken(parser, context | 32768);
        if (forAwait)
            report(parser, 79);
        right = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
        consume(parser, context | 32768, 16);
        const body = parseIterationStatementBody(parser, context, scope, labels);
        return finishNode(parser, context, start, line, column, {
            type: 'ForInStatement',
            body,
            left: init,
            right
        });
    }
    if (forAwait)
        report(parser, 79);
    if (!isVarDecl) {
        if (destructible & 8 && parser.token !== 1077936157) {
            report(parser, 77, 'loop');
        }
        init = parseAssignmentExpression(parser, context | 134217728, 0, 0, tokenPos, linePos, colPos, init);
    }
    if (parser.token === 18)
        init = parseSequenceExpression(parser, context, 0, parser.tokenPos, parser.linePos, parser.colPos, init);
    consume(parser, context | 32768, 1074790417);
    if (parser.token !== 1074790417)
        test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context | 32768, 1074790417);
    if (parser.token !== 16)
        update = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context | 32768, 16);
    const body = parseIterationStatementBody(parser, context, scope, labels);
    return finishNode(parser, context, start, line, column, {
        type: 'ForStatement',
        init,
        test,
        update,
        body
    });
}
function parseRestrictedIdentifier(parser, context, scope) {
    if (!isValidIdentifier(context, parser.token))
        report(parser, 114);
    if ((parser.token & 537079808) === 537079808)
        report(parser, 115);
    if (scope)
        addBlockName(parser, context, scope, parser.tokenValue, 8, 0);
    return parseIdentifier(parser, context, 0);
}
function parseImportDeclaration(parser, context, scope) {
    const start = parser.tokenPos;
    const line = parser.linePos;
    const column = parser.colPos;
    nextToken(parser, context);
    let source = null;
    const { tokenPos, linePos, colPos } = parser;
    let specifiers = [];
    if (parser.token === 134283267) {
        source = parseLiteral(parser, context);
    }
    else {
        if (parser.token & 143360) {
            const local = parseRestrictedIdentifier(parser, context, scope);
            specifiers = [
                finishNode(parser, context, tokenPos, linePos, colPos, {
                    type: 'ImportDefaultSpecifier',
                    local
                })
            ];
            if (consumeOpt(parser, context, 18)) {
                switch (parser.token) {
                    case 8457014:
                        specifiers.push(parseImportNamespaceSpecifier(parser, context, scope));
                        break;
                    case 2162700:
                        parseImportSpecifierOrNamedImports(parser, context, scope, specifiers);
                        break;
                    default:
                        report(parser, 104);
                }
            }
        }
        else {
            switch (parser.token) {
                case 8457014:
                    specifiers = [parseImportNamespaceSpecifier(parser, context, scope)];
                    break;
                case 2162700:
                    parseImportSpecifierOrNamedImports(parser, context, scope, specifiers);
                    break;
                case 67174411:
                    return parseImportCallDeclaration(parser, context, start, line, column);
                case 67108877:
                    return parseImportMetaDeclaration(parser, context, start, line, column);
                default:
                    report(parser, 28, KeywordDescTable[parser.token & 255]);
            }
        }
        source = parseModuleSpecifier(parser, context);
    }
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'ImportDeclaration',
        specifiers,
        source
    });
}
function parseImportNamespaceSpecifier(parser, context, scope) {
    const { tokenPos, linePos, colPos } = parser;
    nextToken(parser, context);
    consume(parser, context, 77934);
    if ((parser.token & 134217728) === 134217728) {
        reportMessageAt(tokenPos, parser.line, parser.index, 28, KeywordDescTable[parser.token & 255]);
    }
    return finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'ImportNamespaceSpecifier',
        local: parseRestrictedIdentifier(parser, context, scope)
    });
}
function parseModuleSpecifier(parser, context) {
    consumeOpt(parser, context, 12404);
    if (parser.token !== 134283267)
        report(parser, 102, 'Import');
    return parseLiteral(parser, context);
}
function parseImportSpecifierOrNamedImports(parser, context, scope, specifiers) {
    nextToken(parser, context);
    while (parser.token & 143360) {
        let { token, tokenValue, tokenPos, linePos, colPos } = parser;
        const imported = parseIdentifier(parser, context, 0);
        let local;
        if (consumeOpt(parser, context, 77934)) {
            if ((parser.token & 134217728) === 134217728 || parser.token === 18) {
                report(parser, 103);
            }
            else {
                validateBindingIdentifier(parser, context, 16, parser.token, 0);
            }
            tokenValue = parser.tokenValue;
            local = parseIdentifier(parser, context, 0);
        }
        else {
            validateBindingIdentifier(parser, context, 16, token, 0);
            local = imported;
        }
        if (scope)
            addBlockName(parser, context, scope, tokenValue, 8, 0);
        specifiers.push(finishNode(parser, context, tokenPos, linePos, colPos, {
            type: 'ImportSpecifier',
            local,
            imported
        }));
        if (parser.token !== 1074790415)
            consume(parser, context, 18);
    }
    consume(parser, context, 1074790415);
    return specifiers;
}
function parseImportMetaDeclaration(parser, context, start, line, column) {
    let expr = parseImportMetaExpression(parser, context, finishNode(parser, context, start, line, column, {
        type: 'Identifier',
        name: 'import'
    }), start, line, column);
    expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
    expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr);
    return parseExpressionStatement(parser, context, expr, start, line, column);
}
function parseImportCallDeclaration(parser, context, start, line, column) {
    let expr = parseImportExpression(parser, context, 0, start, line, column);
    expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
    return parseExpressionStatement(parser, context, expr, start, line, column);
}
function parseExportDeclaration(parser, context, scope) {
    const start = parser.tokenPos;
    const line = parser.linePos;
    const column = parser.colPos;
    nextToken(parser, context | 32768);
    const specifiers = [];
    let declaration = null;
    let source = null;
    let key;
    if (consumeOpt(parser, context | 32768, 20563)) {
        switch (parser.token) {
            case 86106: {
                declaration = parseFunctionDeclaration(parser, context, scope, 4, 1, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
                break;
            }
            case 133:
            case 86096:
                declaration = parseClassDeclaration(parser, context, scope, 1, parser.tokenPos, parser.linePos, parser.colPos);
                break;
            case 209007:
                const { tokenPos, linePos, colPos } = parser;
                declaration = parseIdentifier(parser, context, 0);
                const { flags } = parser;
                if ((flags & 1) === 0) {
                    if (parser.token === 86106) {
                        declaration = parseFunctionDeclaration(parser, context, scope, 4, 1, 1, 1, tokenPos, linePos, colPos);
                    }
                    else {
                        if (parser.token === 67174411) {
                            declaration = parseAsyncArrowOrCallExpression(parser, context, declaration, 1, 1, 0, flags, tokenPos, linePos, colPos);
                            declaration = parseMemberOrUpdateExpression(parser, context, declaration, 0, 0, tokenPos, linePos, colPos);
                            declaration = parseAssignmentExpression(parser, context, 0, 0, tokenPos, linePos, colPos, declaration);
                        }
                        else if (parser.token & 143360) {
                            if (scope)
                                scope = createArrowHeadParsingScope(parser, context, parser.tokenValue);
                            declaration = parseIdentifier(parser, context, 0);
                            declaration = parseArrowFunctionExpression(parser, context, scope, [declaration], 1, tokenPos, linePos, colPos);
                        }
                    }
                }
                break;
            default:
                declaration = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
                matchOrInsertSemicolon(parser, context | 32768);
        }
        if (scope)
            declareUnboundVariable(parser, 'default');
        return finishNode(parser, context, start, line, column, {
            type: 'ExportDefaultDeclaration',
            declaration
        });
    }
    switch (parser.token) {
        case 8457014: {
            nextToken(parser, context);
            let exported = null;
            const isNamedDeclaration = consumeOpt(parser, context, 77934);
            if (isNamedDeclaration) {
                if (scope)
                    declareUnboundVariable(parser, parser.tokenValue);
                exported = parseIdentifier(parser, context, 0);
            }
            consume(parser, context, 12404);
            if (parser.token !== 134283267)
                report(parser, 102, 'Export');
            source = parseLiteral(parser, context);
            matchOrInsertSemicolon(parser, context | 32768);
            return finishNode(parser, context, start, line, column, {
                type: 'ExportAllDeclaration',
                source,
                exported
            });
        }
        case 2162700: {
            nextToken(parser, context);
            const tmpExportedNames = [];
            const tmpExportedBindings = [];
            while (parser.token & 143360) {
                const { tokenPos, tokenValue, linePos, colPos } = parser;
                const local = parseIdentifier(parser, context, 0);
                let exported;
                if (parser.token === 77934) {
                    nextToken(parser, context);
                    if ((parser.token & 134217728) === 134217728) {
                        report(parser, 103);
                    }
                    if (scope) {
                        tmpExportedNames.push(parser.tokenValue);
                        tmpExportedBindings.push(tokenValue);
                    }
                    exported = parseIdentifier(parser, context, 0);
                }
                else {
                    if (scope) {
                        tmpExportedNames.push(parser.tokenValue);
                        tmpExportedBindings.push(parser.tokenValue);
                    }
                    exported = local;
                }
                specifiers.push(finishNode(parser, context, tokenPos, linePos, colPos, {
                    type: 'ExportSpecifier',
                    local,
                    exported
                }));
                if (parser.token !== 1074790415)
                    consume(parser, context, 18);
            }
            consume(parser, context, 1074790415);
            if (consumeOpt(parser, context, 12404)) {
                if (parser.token !== 134283267)
                    report(parser, 102, 'Export');
                source = parseLiteral(parser, context);
            }
            else if (scope) {
                let i = 0;
                let iMax = tmpExportedNames.length;
                for (; i < iMax; i++) {
                    declareUnboundVariable(parser, tmpExportedNames[i]);
                }
                i = 0;
                iMax = tmpExportedBindings.length;
                for (; i < iMax; i++) {
                    addBindingToExports(parser, tmpExportedBindings[i]);
                }
            }
            matchOrInsertSemicolon(parser, context | 32768);
            break;
        }
        case 86096:
            declaration = parseClassDeclaration(parser, context, scope, 2, parser.tokenPos, parser.linePos, parser.colPos);
            break;
        case 86106:
            declaration = parseFunctionDeclaration(parser, context, scope, 4, 1, 2, 0, parser.tokenPos, parser.linePos, parser.colPos);
            break;
        case 241739:
            declaration = parseLexicalDeclaration(parser, context, scope, 8, 64, parser.tokenPos, parser.linePos, parser.colPos);
            break;
        case 86092:
            declaration = parseLexicalDeclaration(parser, context, scope, 16, 64, parser.tokenPos, parser.linePos, parser.colPos);
            break;
        case 86090:
            declaration = parseVariableStatement(parser, context, scope, 64, parser.tokenPos, parser.linePos, parser.colPos);
            break;
        case 209007:
            const { tokenPos, linePos, colPos } = parser;
            nextToken(parser, context);
            if ((parser.flags & 1) === 0 && parser.token === 86106) {
                declaration = parseFunctionDeclaration(parser, context, scope, 4, 1, 2, 1, tokenPos, linePos, colPos);
                if (scope) {
                    key = declaration.id ? declaration.id.name : '';
                    declareUnboundVariable(parser, key);
                }
                break;
            }
        default:
            report(parser, 28, KeywordDescTable[parser.token & 255]);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'ExportNamedDeclaration',
        declaration,
        specifiers,
        source
    });
}
function parseExpression(parser, context, canAssign, isPattern, inGroup, start, line, column) {
    let expr = parsePrimaryExpression(parser, context, 2, 0, canAssign, isPattern, inGroup, 1, start, line, column);
    expr = parseMemberOrUpdateExpression(parser, context, expr, inGroup, 0, start, line, column);
    return parseAssignmentExpression(parser, context, inGroup, 0, start, line, column, expr);
}
function parseSequenceExpression(parser, context, inGroup, start, line, column, expr) {
    const expressions = [expr];
    while (consumeOpt(parser, context | 32768, 18)) {
        expressions.push(parseExpression(parser, context, 1, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos));
    }
    return finishNode(parser, context, start, line, column, {
        type: 'SequenceExpression',
        expressions
    });
}
function parseExpressions(parser, context, inGroup, canAssign, start, line, column) {
    const expr = parseExpression(parser, context, canAssign, 0, inGroup, start, line, column);
    return parser.token === 18
        ? parseSequenceExpression(parser, context, inGroup, start, line, column, expr)
        : expr;
}
function parseAssignmentExpression(parser, context, inGroup, isPattern, start, line, column, left) {
    const { token } = parser;
    if ((token & 4194304) === 4194304) {
        if (parser.assignable & 2)
            report(parser, 24);
        if ((!isPattern && token === 1077936157 && left.type === 'ArrayExpression') ||
            left.type === 'ObjectExpression') {
            reinterpretToPattern(parser, left);
        }
        nextToken(parser, context | 32768);
        const right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
        parser.assignable = 2;
        return finishNode(parser, context, start, line, column, isPattern
            ? {
                type: 'AssignmentPattern',
                left,
                right
            }
            : {
                type: 'AssignmentExpression',
                left,
                operator: KeywordDescTable[token & 255],
                right
            });
    }
    if ((token & 8454144) === 8454144) {
        left = parseBinaryExpression(parser, context, inGroup, start, line, column, 4, token, left);
    }
    if (consumeOpt(parser, context | 32768, 22)) {
        left = parseConditionalExpression(parser, context, left, start, line, column);
    }
    return left;
}
function parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, start, line, column, left) {
    const { token } = parser;
    nextToken(parser, context | 32768);
    const right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
    left = finishNode(parser, context, start, line, column, isPattern
        ? {
            type: 'AssignmentPattern',
            left,
            right
        }
        : {
            type: 'AssignmentExpression',
            left,
            operator: KeywordDescTable[token & 255],
            right
        });
    parser.assignable = 2;
    return left;
}
function parseConditionalExpression(parser, context, test, start, line, column) {
    const consequent = parseExpression(parser, (context | 134217728) ^ 134217728, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context | 32768, 21);
    parser.assignable = 1;
    const alternate = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'ConditionalExpression',
        test,
        consequent,
        alternate
    });
}
function parseBinaryExpression(parser, context, inGroup, start, line, column, minPrec, operator, left) {
    const bit = -((context & 134217728) > 0) & 8738868;
    let t;
    let prec;
    parser.assignable = 2;
    while (parser.token & 8454144) {
        t = parser.token;
        prec = t & 3840;
        if ((t & 524288 && operator & 268435456) || (operator & 524288 && t & 268435456)) {
            report(parser, 159);
        }
        if (prec + ((t === 8457273) << 8) - ((bit === t) << 12) <= minPrec)
            break;
        nextToken(parser, context | 32768);
        left = finishNode(parser, context, start, line, column, {
            type: t & 524288 || t & 268435456 ? 'LogicalExpression' : 'BinaryExpression',
            left,
            right: parseBinaryExpression(parser, context, inGroup, parser.tokenPos, parser.linePos, parser.colPos, prec, t, parseLeftHandSideExpression(parser, context, 0, inGroup, 1, parser.tokenPos, parser.linePos, parser.colPos)),
            operator: KeywordDescTable[t & 255]
        });
    }
    if (parser.token === 1077936157)
        report(parser, 24);
    return left;
}
function parseUnaryExpression(parser, context, isLHS, start, line, column, inGroup) {
    if (!isLHS)
        report(parser, 0);
    const unaryOperator = parser.token;
    nextToken(parser, context | 32768);
    const arg = parseLeftHandSideExpression(parser, context, 0, inGroup, 1, parser.tokenPos, parser.linePos, parser.colPos);
    if (parser.token === 8457273)
        report(parser, 31);
    if (context & 1024 && unaryOperator === 16863278) {
        if (arg.type === 'Identifier') {
            report(parser, 117);
        }
        else if (isPropertyWithPrivateFieldKey(arg)) {
            report(parser, 123);
        }
    }
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'UnaryExpression',
        operator: KeywordDescTable[unaryOperator & 255],
        argument: arg,
        prefix: true
    });
}
function parseAsyncExpression(parser, context, inGroup, isLHS, canAssign, isPattern, inNew, start, line, column) {
    const { token } = parser;
    const expr = parseIdentifier(parser, context, isPattern);
    const { flags } = parser;
    if ((flags & 1) === 0) {
        if (parser.token === 86106) {
            return parseFunctionExpression(parser, context, 1, inGroup, start, line, column);
        }
        if ((parser.token & 143360) === 143360) {
            if (!isLHS)
                report(parser, 0);
            return parseAsyncArrowAfterIdent(parser, context, canAssign, start, line, column);
        }
    }
    if (!inNew && parser.token === 67174411) {
        return parseAsyncArrowOrCallExpression(parser, context, expr, canAssign, 1, 0, flags, start, line, column);
    }
    if (parser.token === 10) {
        classifyIdentifier(parser, context, token, 1);
        if (inNew)
            report(parser, 48);
        return parseArrowFromIdentifier(parser, context, parser.tokenValue, expr, inNew, canAssign, 0, start, line, column);
    }
    return expr;
}
function parseYieldExpression(parser, context, inGroup, canAssign, start, line, column) {
    if (inGroup)
        parser.destructible |= 256;
    if (context & 2097152) {
        nextToken(parser, context | 32768);
        if (context & 8388608)
            report(parser, 30);
        if (!canAssign)
            report(parser, 24);
        if (parser.token === 22)
            report(parser, 120);
        let argument = null;
        let delegate = false;
        if ((parser.flags & 1) === 0) {
            delegate = consumeOpt(parser, context | 32768, 8457014);
            if (parser.token & (12288 | 65536) || delegate) {
                argument = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
            }
        }
        parser.assignable = 2;
        return finishNode(parser, context, start, line, column, {
            type: 'YieldExpression',
            argument,
            delegate
        });
    }
    if (context & 1024)
        report(parser, 94, 'yield');
    return parseIdentifierOrArrow(parser, context, start, line, column);
}
function parseAwaitExpression(parser, context, inNew, inGroup, start, line, column) {
    if (inGroup)
        parser.destructible |= 128;
    if (context & 4194304 || (context & 2048 && context & 8192)) {
        if (inNew)
            report(parser, 0);
        if (context & 8388608) {
            reportMessageAt(parser.index, parser.line, parser.index, 29);
        }
        nextToken(parser, context | 32768);
        const argument = parseLeftHandSideExpression(parser, context, 0, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
        if (parser.token === 8457273)
            report(parser, 31);
        parser.assignable = 2;
        return finishNode(parser, context, start, line, column, {
            type: 'AwaitExpression',
            argument
        });
    }
    if (context & 2048)
        report(parser, 95);
    return parseIdentifierOrArrow(parser, context, start, line, column);
}
function parseFunctionBody(parser, context, scope, origin, firstRestricted, scopeError) {
    const { tokenPos, linePos, colPos } = parser;
    consume(parser, context | 32768, 2162700);
    const body = [];
    const prevContext = context;
    if (parser.token !== 1074790415) {
        while (parser.token === 134283267) {
            const { index, tokenPos, tokenValue, token } = parser;
            const expr = parseLiteral(parser, context);
            if (isValidStrictMode(parser, index, tokenPos, tokenValue)) {
                context |= 1024;
                if (parser.flags & 128) {
                    reportMessageAt(parser.index, parser.line, parser.tokenPos, 63);
                }
                if (parser.flags & 64) {
                    reportMessageAt(parser.index, parser.line, parser.tokenPos, 8);
                }
            }
            body.push(parseDirective(parser, context, expr, token, tokenPos, parser.linePos, parser.colPos));
        }
        if (context & 1024) {
            if (firstRestricted) {
                if ((firstRestricted & 537079808) === 537079808) {
                    report(parser, 115);
                }
                if ((firstRestricted & 36864) === 36864) {
                    report(parser, 38);
                }
            }
            if (parser.flags & 512)
                report(parser, 115);
            if (parser.flags & 256)
                report(parser, 114);
        }
        if (context & 64 &&
            scope &&
            scopeError !== void 0 &&
            (prevContext & 1024) === 0 &&
            (context & 8192) === 0) {
            reportScopeError(scopeError);
        }
    }
    parser.flags =
        (parser.flags | 512 | 256 | 64) ^
            (512 | 256 | 64);
    parser.destructible = (parser.destructible | 256) ^ 256;
    while (parser.token !== 1074790415) {
        body.push(parseStatementListItem(parser, context, scope, 4, {}));
    }
    consume(parser, origin & (16 | 8) ? context | 32768 : context, 1074790415);
    parser.flags &= ~(128 | 64);
    if (parser.token === 1077936157)
        report(parser, 24);
    return finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'BlockStatement',
        body
    });
}
function parseSuperExpression(parser, context, start, line, column) {
    nextToken(parser, context);
    switch (parser.token) {
        case 67108991:
            report(parser, 161);
        case 67174411: {
            if ((context & 524288) === 0)
                report(parser, 26);
            if (context & 16384)
                report(parser, 27);
            parser.assignable = 2;
            break;
        }
        case 69271571:
        case 67108877: {
            if ((context & 262144) === 0)
                report(parser, 27);
            if (context & 16384)
                report(parser, 27);
            parser.assignable = 1;
            break;
        }
        default:
            report(parser, 28, 'super');
    }
    return finishNode(parser, context, start, line, column, { type: 'Super' });
}
function parseLeftHandSideExpression(parser, context, canAssign, inGroup, isLHS, start, line, column) {
    const expression = parsePrimaryExpression(parser, context, 2, 0, canAssign, 0, inGroup, isLHS, start, line, column);
    return parseMemberOrUpdateExpression(parser, context, expression, inGroup, 0, start, line, column);
}
function parseUpdateExpression(parser, context, expr, start, line, column) {
    if (parser.assignable & 2)
        report(parser, 52);
    const { token } = parser;
    nextToken(parser, context);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'UpdateExpression',
        argument: expr,
        operator: KeywordDescTable[token & 255],
        prefix: false
    });
}
function parseMemberOrUpdateExpression(parser, context, expr, inGroup, inChain, start, line, column) {
    if ((parser.token & 33619968) === 33619968 && (parser.flags & 1) === 0) {
        expr = parseUpdateExpression(parser, context, expr, start, line, column);
    }
    else if ((parser.token & 67108864) === 67108864) {
        context = (context | 134217728) ^ 134217728;
        switch (parser.token) {
            case 67108877: {
                nextToken(parser, (context | 1073741824 | 8192) ^ 8192);
                parser.assignable = 1;
                const property = parsePropertyOrPrivatePropertyName(parser, context);
                expr = finishNode(parser, context, start, line, column, {
                    type: 'MemberExpression',
                    object: expr,
                    computed: false,
                    property
                });
                break;
            }
            case 69271571: {
                let restoreHasOptionalChaining = false;
                if ((parser.flags & 2048) === 2048) {
                    restoreHasOptionalChaining = true;
                    parser.flags = (parser.flags | 2048) ^ 2048;
                }
                nextToken(parser, context | 32768);
                const { tokenPos, linePos, colPos } = parser;
                const property = parseExpressions(parser, context, inGroup, 1, tokenPos, linePos, colPos);
                consume(parser, context, 20);
                parser.assignable = 1;
                expr = finishNode(parser, context, start, line, column, {
                    type: 'MemberExpression',
                    object: expr,
                    computed: true,
                    property
                });
                if (restoreHasOptionalChaining) {
                    parser.flags |= 2048;
                }
                break;
            }
            case 67174411: {
                if ((parser.flags & 1024) === 1024) {
                    parser.flags = (parser.flags | 1024) ^ 1024;
                    return expr;
                }
                let restoreHasOptionalChaining = false;
                if ((parser.flags & 2048) === 2048) {
                    restoreHasOptionalChaining = true;
                    parser.flags = (parser.flags | 2048) ^ 2048;
                }
                const args = parseArguments(parser, context, inGroup);
                parser.assignable = 2;
                expr = finishNode(parser, context, start, line, column, {
                    type: 'CallExpression',
                    callee: expr,
                    arguments: args
                });
                if (restoreHasOptionalChaining) {
                    parser.flags |= 2048;
                }
                break;
            }
            case 67108991: {
                nextToken(parser, (context | 1073741824 | 8192) ^ 8192);
                parser.flags |= 2048;
                parser.assignable = 2;
                expr = parseOptionalChain(parser, context, expr, start, line, column);
                break;
            }
            default:
                if ((parser.flags & 2048) === 2048) {
                    report(parser, 160);
                }
                parser.assignable = 2;
                expr = finishNode(parser, context, start, line, column, {
                    type: 'TaggedTemplateExpression',
                    tag: expr,
                    quasi: parser.token === 67174408
                        ? parseTemplate(parser, context | 65536)
                        : parseTemplateLiteral(parser, context, parser.tokenPos, parser.linePos, parser.colPos)
                });
        }
        expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 1, start, line, column);
    }
    if (inChain === 0 && (parser.flags & 2048) === 2048) {
        parser.flags = (parser.flags | 2048) ^ 2048;
        expr = finishNode(parser, context, start, line, column, {
            type: 'ChainExpression',
            expression: expr
        });
    }
    return expr;
}
function parseOptionalChain(parser, context, expr, start, line, column) {
    let restoreHasOptionalChaining = false;
    let node;
    if (parser.token === 69271571 || parser.token === 67174411) {
        if ((parser.flags & 2048) === 2048) {
            restoreHasOptionalChaining = true;
            parser.flags = (parser.flags | 2048) ^ 2048;
        }
    }
    if (parser.token === 69271571) {
        nextToken(parser, context | 32768);
        const { tokenPos, linePos, colPos } = parser;
        const property = parseExpressions(parser, context, 0, 1, tokenPos, linePos, colPos);
        consume(parser, context, 20);
        parser.assignable = 2;
        node = finishNode(parser, context, start, line, column, {
            type: 'MemberExpression',
            object: expr,
            computed: true,
            optional: true,
            property
        });
    }
    else if (parser.token === 67174411) {
        const args = parseArguments(parser, context, 0);
        parser.assignable = 2;
        node = finishNode(parser, context, start, line, column, {
            type: 'CallExpression',
            callee: expr,
            arguments: args,
            optional: true
        });
    }
    else {
        if ((parser.token & (143360 | 4096)) === 0)
            report(parser, 154);
        const property = parseIdentifier(parser, context, 0);
        parser.assignable = 2;
        node = finishNode(parser, context, start, line, column, {
            type: 'MemberExpression',
            object: expr,
            computed: false,
            optional: true,
            property
        });
    }
    if (restoreHasOptionalChaining) {
        parser.flags |= 2048;
    }
    return node;
}
function parsePropertyOrPrivatePropertyName(parser, context) {
    if ((parser.token & (143360 | 4096)) === 0 && parser.token !== 131) {
        report(parser, 154);
    }
    return context & 1 && parser.token === 131
        ? parsePrivateIdentifier(parser, context, parser.tokenPos, parser.linePos, parser.colPos)
        : parseIdentifier(parser, context, 0);
}
function parseUpdateExpressionPrefixed(parser, context, inNew, isLHS, start, line, column) {
    if (inNew)
        report(parser, 53);
    if (!isLHS)
        report(parser, 0);
    const { token } = parser;
    nextToken(parser, context | 32768);
    const arg = parseLeftHandSideExpression(parser, context, 0, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    if (parser.assignable & 2) {
        report(parser, 52);
    }
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'UpdateExpression',
        argument: arg,
        operator: KeywordDescTable[token & 255],
        prefix: true
    });
}
function parsePrimaryExpression(parser, context, kind, inNew, canAssign, isPattern, inGroup, isLHS, start, line, column) {
    if ((parser.token & 143360) === 143360) {
        switch (parser.token) {
            case 209008:
                return parseAwaitExpression(parser, context, inNew, inGroup, start, line, column);
            case 241773:
                return parseYieldExpression(parser, context, inGroup, canAssign, start, line, column);
            case 209007:
                return parseAsyncExpression(parser, context, inGroup, isLHS, canAssign, isPattern, inNew, start, line, column);
        }
        const { token, tokenValue } = parser;
        const expr = parseIdentifier(parser, context | 65536, isPattern);
        if (parser.token === 10) {
            if (!isLHS)
                report(parser, 0);
            classifyIdentifier(parser, context, token, 1);
            return parseArrowFromIdentifier(parser, context, tokenValue, expr, inNew, canAssign, 0, start, line, column);
        }
        if (context & 16384 && token === 537079928)
            report(parser, 126);
        if (token === 241739) {
            if (context & 1024)
                report(parser, 109);
            if (kind & (8 | 16))
                report(parser, 97);
        }
        parser.assignable =
            context & 1024 && (token & 537079808) === 537079808
                ? 2
                : 1;
        return expr;
    }
    if ((parser.token & 134217728) === 134217728) {
        return parseLiteral(parser, context);
    }
    switch (parser.token) {
        case 33619995:
        case 33619996:
            return parseUpdateExpressionPrefixed(parser, context, inNew, isLHS, start, line, column);
        case 16863278:
        case 16842800:
        case 16842801:
        case 25233970:
        case 25233971:
        case 16863277:
        case 16863279:
            return parseUnaryExpression(parser, context, isLHS, start, line, column, inGroup);
        case 86106:
            return parseFunctionExpression(parser, context, 0, inGroup, start, line, column);
        case 2162700:
            return parseObjectLiteral(parser, context, canAssign ? 0 : 1, inGroup, start, line, column);
        case 69271571:
            return parseArrayLiteral(parser, context, canAssign ? 0 : 1, inGroup, start, line, column);
        case 67174411:
            return parseParenthesizedExpression(parser, context, canAssign, 1, 0, start, line, column);
        case 86021:
        case 86022:
        case 86023:
            return parseNullOrTrueOrFalseLiteral(parser, context, start, line, column);
        case 86113:
            return parseThisExpression(parser, context);
        case 65540:
            return parseRegExpLiteral(parser, context, start, line, column);
        case 133:
        case 86096:
            return parseClassExpression(parser, context, inGroup, start, line, column);
        case 86111:
            return parseSuperExpression(parser, context, start, line, column);
        case 67174409:
            return parseTemplateLiteral(parser, context, start, line, column);
        case 67174408:
            return parseTemplate(parser, context);
        case 86109:
            return parseNewExpression(parser, context, inGroup, start, line, column);
        case 134283389:
            return parseBigIntLiteral(parser, context, start, line, column);
        case 131:
            return parsePrivateIdentifier(parser, context, start, line, column);
        case 86108:
            return parseImportCallOrMetaExpression(parser, context, inNew, inGroup, start, line, column);
        case 8456258:
            if (context & 16)
                return parseJSXRootElementOrFragment(parser, context, 1, start, line, column);
        default:
            if (isValidIdentifier(context, parser.token))
                return parseIdentifierOrArrow(parser, context, start, line, column);
            report(parser, 28, KeywordDescTable[parser.token & 255]);
    }
}
function parseImportCallOrMetaExpression(parser, context, inNew, inGroup, start, line, column) {
    let expr = parseIdentifier(parser, context, 0);
    if (parser.token === 67108877) {
        return parseImportMetaExpression(parser, context, expr, start, line, column);
    }
    if (inNew)
        report(parser, 137);
    expr = parseImportExpression(parser, context, inGroup, start, line, column);
    parser.assignable = 2;
    return parseMemberOrUpdateExpression(parser, context, expr, inGroup, 0, start, line, column);
}
function parseImportMetaExpression(parser, context, meta, start, line, column) {
    if ((context & 2048) === 0)
        report(parser, 163);
    nextToken(parser, context);
    if (parser.token !== 143495 && parser.tokenValue !== 'meta')
        report(parser, 28, KeywordDescTable[parser.token & 255]);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'MetaProperty',
        meta,
        property: parseIdentifier(parser, context, 0)
    });
}
function parseImportExpression(parser, context, inGroup, start, line, column) {
    consume(parser, context | 32768, 67174411);
    if (parser.token === 14)
        report(parser, 138);
    const source = parseExpression(parser, context, 1, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context, 16);
    return finishNode(parser, context, start, line, column, {
        type: 'ImportExpression',
        source
    });
}
function parseBigIntLiteral(parser, context, start, line, column) {
    const { tokenRaw, tokenValue } = parser;
    nextToken(parser, context);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, context & 512
        ? {
            type: 'Literal',
            value: tokenValue,
            bigint: tokenRaw.slice(0, -1),
            raw: tokenRaw
        }
        : {
            type: 'Literal',
            value: tokenValue,
            bigint: tokenRaw.slice(0, -1)
        });
}
function parseTemplateLiteral(parser, context, start, line, column) {
    parser.assignable = 2;
    const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
    consume(parser, context, 67174409);
    const quasis = [parseTemplateElement(parser, context, tokenValue, tokenRaw, tokenPos, linePos, colPos, true)];
    return finishNode(parser, context, start, line, column, {
        type: 'TemplateLiteral',
        expressions: [],
        quasis
    });
}
function parseTemplate(parser, context) {
    context = (context | 134217728) ^ 134217728;
    const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
    consume(parser, context | 32768, 67174408);
    const quasis = [
        parseTemplateElement(parser, context, tokenValue, tokenRaw, tokenPos, linePos, colPos, false)
    ];
    const expressions = [parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos)];
    if (parser.token !== 1074790415)
        report(parser, 80);
    while ((parser.token = scanTemplateTail(parser, context)) !== 67174409) {
        const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
        consume(parser, context | 32768, 67174408);
        quasis.push(parseTemplateElement(parser, context, tokenValue, tokenRaw, tokenPos, linePos, colPos, false));
        expressions.push(parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos));
        if (parser.token !== 1074790415)
            report(parser, 80);
    }
    {
        const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
        consume(parser, context, 67174409);
        quasis.push(parseTemplateElement(parser, context, tokenValue, tokenRaw, tokenPos, linePos, colPos, true));
    }
    return finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'TemplateLiteral',
        expressions,
        quasis
    });
}
function parseTemplateElement(parser, context, cooked, raw, start, line, col, tail) {
    const node = finishNode(parser, context, start, line, col, {
        type: 'TemplateElement',
        value: {
            cooked,
            raw
        },
        tail
    });
    const tailSize = tail ? 1 : 2;
    if (context & 2) {
        node.start += 1;
        node.range[0] += 1;
        node.end -= tailSize;
        node.range[1] -= tailSize;
    }
    if (context & 4) {
        node.loc.start.column += 1;
        node.loc.end.column -= tailSize;
    }
    return node;
}
function parseSpreadElement(parser, context, start, line, column) {
    context = (context | 134217728) ^ 134217728;
    consume(parser, context | 32768, 14);
    const argument = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
    parser.assignable = 1;
    return finishNode(parser, context, start, line, column, {
        type: 'SpreadElement',
        argument
    });
}
function parseArguments(parser, context, inGroup) {
    nextToken(parser, context | 32768);
    const args = [];
    if (parser.token === 16) {
        nextToken(parser, context);
        return args;
    }
    while (parser.token !== 16) {
        if (parser.token === 14) {
            args.push(parseSpreadElement(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
        }
        else {
            args.push(parseExpression(parser, context, 1, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos));
        }
        if (parser.token !== 18)
            break;
        nextToken(parser, context | 32768);
        if (parser.token === 16)
            break;
    }
    consume(parser, context, 16);
    return args;
}
function parseIdentifier(parser, context, isPattern) {
    const { tokenValue, tokenPos, linePos, colPos } = parser;
    nextToken(parser, context);
    return finishNode(parser, context, tokenPos, linePos, colPos, context & 268435456
        ? {
            type: 'Identifier',
            name: tokenValue,
            pattern: isPattern === 1
        }
        : {
            type: 'Identifier',
            name: tokenValue
        });
}
function parseLiteral(parser, context) {
    const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
    if (parser.token === 134283389) {
        return parseBigIntLiteral(parser, context, tokenPos, linePos, colPos);
    }
    nextToken(parser, context);
    parser.assignable = 2;
    return finishNode(parser, context, tokenPos, linePos, colPos, context & 512
        ? {
            type: 'Literal',
            value: tokenValue,
            raw: tokenRaw
        }
        : {
            type: 'Literal',
            value: tokenValue
        });
}
function parseNullOrTrueOrFalseLiteral(parser, context, start, line, column) {
    const raw = KeywordDescTable[parser.token & 255];
    const value = parser.token === 86023 ? null : raw === 'true';
    nextToken(parser, context);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, context & 512
        ? {
            type: 'Literal',
            value,
            raw
        }
        : {
            type: 'Literal',
            value
        });
}
function parseThisExpression(parser, context) {
    const { tokenPos, linePos, colPos } = parser;
    nextToken(parser, context);
    parser.assignable = 2;
    return finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'ThisExpression'
    });
}
function parseFunctionDeclaration(parser, context, scope, origin, allowGen, flags, isAsync, start, line, column) {
    nextToken(parser, context | 32768);
    const isGenerator = allowGen ? optionalBit(parser, context, 8457014) : 0;
    let id = null;
    let firstRestricted;
    let functionScope = scope ? createScope() : void 0;
    if (parser.token === 67174411) {
        if ((flags & 1) === 0)
            report(parser, 37, 'Function');
    }
    else {
        const kind = origin & 4 && ((context & 8192) === 0 || (context & 2048) === 0)
            ? 4
            : 64;
        validateFunctionName(parser, context | ((context & 3072) << 11), parser.token);
        if (scope) {
            if (kind & 4) {
                addVarName(parser, context, scope, parser.tokenValue, kind);
            }
            else {
                addBlockName(parser, context, scope, parser.tokenValue, kind, origin);
            }
            functionScope = addChildScope(functionScope, 256);
            if (flags) {
                if (flags & 2) {
                    declareUnboundVariable(parser, parser.tokenValue);
                }
            }
        }
        firstRestricted = parser.token;
        if (parser.token & 143360) {
            id = parseIdentifier(parser, context, 0);
        }
        else {
            report(parser, 28, KeywordDescTable[parser.token & 255]);
        }
    }
    context =
        ((context | 32243712) ^ 32243712) |
            67108864 |
            ((isAsync * 2 + isGenerator) << 21) |
            (isGenerator ? 0 : 1073741824);
    if (scope)
        functionScope = addChildScope(functionScope, 512);
    const params = parseFormalParametersOrFormalList(parser, context | 8388608, functionScope, 0, 1);
    const body = parseFunctionBody(parser, (context | 8192 | 4096 | 131072) ^
        (8192 | 4096 | 131072), scope ? addChildScope(functionScope, 128) : functionScope, 8, firstRestricted, scope ? functionScope.scopeError : void 0);
    return finishNode(parser, context, start, line, column, {
        type: 'FunctionDeclaration',
        id,
        params,
        body,
        async: isAsync === 1,
        generator: isGenerator === 1
    });
}
function parseFunctionExpression(parser, context, isAsync, inGroup, start, line, column) {
    nextToken(parser, context | 32768);
    const isGenerator = optionalBit(parser, context, 8457014);
    const generatorAndAsyncFlags = (isAsync * 2 + isGenerator) << 21;
    let id = null;
    let firstRestricted;
    let scope = context & 64 ? createScope() : void 0;
    if ((parser.token & (143360 | 4096 | 36864)) > 0) {
        validateFunctionName(parser, ((context | 0x1ec0000) ^ 0x1ec0000) | generatorAndAsyncFlags, parser.token);
        if (scope)
            scope = addChildScope(scope, 256);
        firstRestricted = parser.token;
        id = parseIdentifier(parser, context, 0);
    }
    context =
        ((context | 32243712) ^ 32243712) |
            67108864 |
            generatorAndAsyncFlags |
            (isGenerator ? 0 : 1073741824);
    if (scope)
        scope = addChildScope(scope, 512);
    const params = parseFormalParametersOrFormalList(parser, context | 8388608, scope, inGroup, 1);
    const body = parseFunctionBody(parser, context & ~(0x8001000 | 8192 | 4096 | 131072 | 16384), scope ? addChildScope(scope, 128) : scope, 0, firstRestricted, void 0);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'FunctionExpression',
        id,
        params,
        body,
        async: isAsync === 1,
        generator: isGenerator === 1
    });
}
function parseArrayLiteral(parser, context, skipInitializer, inGroup, start, line, column) {
    const expr = parseArrayExpressionOrPattern(parser, context, void 0, skipInitializer, inGroup, 0, 2, 0, start, line, column);
    if (context & 256 && parser.destructible & 64) {
        report(parser, 60);
    }
    if (parser.destructible & 8) {
        report(parser, 59);
    }
    return expr;
}
function parseArrayExpressionOrPattern(parser, context, scope, skipInitializer, inGroup, isPattern, kind, origin, start, line, column) {
    nextToken(parser, context | 32768);
    const elements = [];
    let destructible = 0;
    context = (context | 134217728) ^ 134217728;
    while (parser.token !== 20) {
        if (consumeOpt(parser, context | 32768, 18)) {
            elements.push(null);
        }
        else {
            let left;
            const { token, tokenPos, linePos, colPos, tokenValue } = parser;
            if (token & 143360) {
                left = parsePrimaryExpression(parser, context, kind, 0, 1, 0, inGroup, 1, tokenPos, linePos, colPos);
                if (parser.token === 1077936157) {
                    if (parser.assignable & 2)
                        report(parser, 24);
                    nextToken(parser, context | 32768);
                    if (scope)
                        addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
                    const right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                    left = finishNode(parser, context, tokenPos, linePos, colPos, isPattern
                        ? {
                            type: 'AssignmentPattern',
                            left,
                            right
                        }
                        : {
                            type: 'AssignmentExpression',
                            operator: '=',
                            left,
                            right
                        });
                    destructible |=
                        parser.destructible & 256
                            ? 256
                            : 0 | (parser.destructible & 128)
                                ? 128
                                : 0;
                }
                else if (parser.token === 18 || parser.token === 20) {
                    if (parser.assignable & 2) {
                        destructible |= 16;
                    }
                    else if (scope) {
                        addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
                    }
                    destructible |=
                        parser.destructible & 256
                            ? 256
                            : 0 | (parser.destructible & 128)
                                ? 128
                                : 0;
                }
                else {
                    destructible |=
                        kind & 1
                            ? 32
                            : (kind & 2) === 0
                                ? 16
                                : 0;
                    left = parseMemberOrUpdateExpression(parser, context, left, inGroup, 0, tokenPos, linePos, colPos);
                    if (parser.token !== 18 && parser.token !== 20) {
                        if (parser.token !== 1077936157)
                            destructible |= 16;
                        left = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, left);
                    }
                    else if (parser.token !== 1077936157) {
                        destructible |=
                            parser.assignable & 2
                                ? 16
                                : 32;
                    }
                }
            }
            else if (token & 2097152) {
                left =
                    parser.token === 2162700
                        ? parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos)
                        : parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos);
                destructible |= parser.destructible;
                parser.assignable =
                    parser.destructible & 16
                        ? 2
                        : 1;
                if (parser.token === 18 || parser.token === 20) {
                    if (parser.assignable & 2) {
                        destructible |= 16;
                    }
                }
                else if (parser.destructible & 8) {
                    report(parser, 68);
                }
                else {
                    left = parseMemberOrUpdateExpression(parser, context, left, inGroup, 0, tokenPos, linePos, colPos);
                    destructible = parser.assignable & 2 ? 16 : 0;
                    if (parser.token !== 18 && parser.token !== 20) {
                        left = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, left);
                    }
                    else if (parser.token !== 1077936157) {
                        destructible |=
                            parser.assignable & 2
                                ? 16
                                : 32;
                    }
                }
            }
            else if (token === 14) {
                left = parseSpreadOrRestElement(parser, context, scope, 20, kind, origin, 0, inGroup, isPattern, tokenPos, linePos, colPos);
                destructible |= parser.destructible;
                if (parser.token !== 18 && parser.token !== 20)
                    report(parser, 28, KeywordDescTable[parser.token & 255]);
            }
            else {
                left = parseLeftHandSideExpression(parser, context, 1, 0, 1, tokenPos, linePos, colPos);
                if (parser.token !== 18 && parser.token !== 20) {
                    left = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, left);
                    if ((kind & (2 | 1)) === 0 && token === 67174411)
                        destructible |= 16;
                }
                else if (parser.assignable & 2) {
                    destructible |= 16;
                }
                else if (token === 67174411) {
                    destructible |=
                        parser.assignable & 1 && kind & (2 | 1)
                            ? 32
                            : 16;
                }
            }
            elements.push(left);
            if (consumeOpt(parser, context | 32768, 18)) {
                if (parser.token === 20)
                    break;
            }
            else
                break;
        }
    }
    consume(parser, context, 20);
    const node = finishNode(parser, context, start, line, column, {
        type: isPattern ? 'ArrayPattern' : 'ArrayExpression',
        elements
    });
    if (!skipInitializer && parser.token & 4194304) {
        return parseArrayOrObjectAssignmentPattern(parser, context, destructible, inGroup, isPattern, start, line, column, node);
    }
    parser.destructible = destructible;
    return node;
}
function parseArrayOrObjectAssignmentPattern(parser, context, destructible, inGroup, isPattern, start, line, column, node) {
    if (parser.token !== 1077936157)
        report(parser, 24);
    nextToken(parser, context | 32768);
    if (destructible & 16)
        report(parser, 24);
    if (!isPattern)
        reinterpretToPattern(parser, node);
    const { tokenPos, linePos, colPos } = parser;
    const right = parseExpression(parser, context, 1, 1, inGroup, tokenPos, linePos, colPos);
    parser.destructible =
        ((destructible | 64 | 8) ^
            (8 | 64)) |
            (parser.destructible & 128 ? 128 : 0) |
            (parser.destructible & 256 ? 256 : 0);
    return finishNode(parser, context, start, line, column, isPattern
        ? {
            type: 'AssignmentPattern',
            left: node,
            right
        }
        : {
            type: 'AssignmentExpression',
            left: node,
            operator: '=',
            right
        });
}
function parseSpreadOrRestElement(parser, context, scope, closingToken, kind, origin, isAsync, inGroup, isPattern, start, line, column) {
    nextToken(parser, context | 32768);
    let argument = null;
    let destructible = 0;
    let { token, tokenValue, tokenPos, linePos, colPos } = parser;
    if (token & (4096 | 143360)) {
        parser.assignable = 1;
        argument = parsePrimaryExpression(parser, context, kind, 0, 1, 0, inGroup, 1, tokenPos, linePos, colPos);
        token = parser.token;
        argument = parseMemberOrUpdateExpression(parser, context, argument, inGroup, 0, tokenPos, linePos, colPos);
        if (parser.token !== 18 && parser.token !== closingToken) {
            if (parser.assignable & 2 && parser.token === 1077936157)
                report(parser, 68);
            destructible |= 16;
            argument = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, argument);
        }
        if (parser.assignable & 2) {
            destructible |= 16;
        }
        else if (token === closingToken || token === 18) {
            if (scope)
                addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
        }
        else {
            destructible |= 32;
        }
        destructible |= parser.destructible & 128 ? 128 : 0;
    }
    else if (token === closingToken) {
        report(parser, 39);
    }
    else if (token & 2097152) {
        argument =
            parser.token === 2162700
                ? parseObjectLiteralOrPattern(parser, context, scope, 1, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos)
                : parseArrayExpressionOrPattern(parser, context, scope, 1, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos);
        token = parser.token;
        if (token !== 1077936157 && token !== closingToken && token !== 18) {
            if (parser.destructible & 8)
                report(parser, 68);
            argument = parseMemberOrUpdateExpression(parser, context, argument, inGroup, 0, tokenPos, linePos, colPos);
            destructible |= parser.assignable & 2 ? 16 : 0;
            if ((parser.token & 4194304) === 4194304) {
                if (parser.token !== 1077936157)
                    destructible |= 16;
                argument = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, argument);
            }
            else {
                if ((parser.token & 8454144) === 8454144) {
                    argument = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, argument);
                }
                if (consumeOpt(parser, context | 32768, 22)) {
                    argument = parseConditionalExpression(parser, context, argument, tokenPos, linePos, colPos);
                }
                destructible |=
                    parser.assignable & 2
                        ? 16
                        : 32;
            }
        }
        else {
            destructible |=
                closingToken === 1074790415 && token !== 1077936157
                    ? 16
                    : parser.destructible;
        }
    }
    else {
        destructible |= 32;
        argument = parseLeftHandSideExpression(parser, context, 1, inGroup, 1, parser.tokenPos, parser.linePos, parser.colPos);
        const { token, tokenPos, linePos, colPos } = parser;
        if (token === 1077936157 && token !== closingToken && token !== 18) {
            if (parser.assignable & 2)
                report(parser, 24);
            argument = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, argument);
            destructible |= 16;
        }
        else {
            if (token === 18) {
                destructible |= 16;
            }
            else if (token !== closingToken) {
                argument = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, argument);
            }
            destructible |=
                parser.assignable & 1 ? 32 : 16;
        }
        parser.destructible = destructible;
        if (parser.token !== closingToken && parser.token !== 18)
            report(parser, 155);
        return finishNode(parser, context, start, line, column, {
            type: isPattern ? 'RestElement' : 'SpreadElement',
            argument: argument
        });
    }
    if (parser.token !== closingToken) {
        if (kind & 1)
            destructible |= isAsync ? 16 : 32;
        if (consumeOpt(parser, context | 32768, 1077936157)) {
            if (destructible & 16)
                report(parser, 24);
            reinterpretToPattern(parser, argument);
            const right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
            argument = finishNode(parser, context, tokenPos, linePos, colPos, isPattern
                ? {
                    type: 'AssignmentPattern',
                    left: argument,
                    right
                }
                : {
                    type: 'AssignmentExpression',
                    left: argument,
                    operator: '=',
                    right
                });
            destructible = 16;
        }
        else {
            destructible |= 16;
        }
    }
    parser.destructible = destructible;
    return finishNode(parser, context, start, line, column, {
        type: isPattern ? 'RestElement' : 'SpreadElement',
        argument: argument
    });
}
function parseMethodDefinition(parser, context, kind, inGroup, start, line, column) {
    const modifierFlags = (kind & 64) === 0 ? 31981568 : 14680064;
    context =
        ((context | modifierFlags) ^ modifierFlags) |
            ((kind & 88) << 18) |
            100925440;
    let scope = context & 64 ? addChildScope(createScope(), 512) : void 0;
    const params = parseMethodFormals(parser, context | 8388608, scope, kind, 1, inGroup);
    if (scope)
        scope = addChildScope(scope, 128);
    const body = parseFunctionBody(parser, context & ~(0x8001000 | 8192), scope, 0, void 0, void 0);
    return finishNode(parser, context, start, line, column, {
        type: 'FunctionExpression',
        params,
        body,
        async: (kind & 16) > 0,
        generator: (kind & 8) > 0,
        id: null
    });
}
function parseObjectLiteral(parser, context, skipInitializer, inGroup, start, line, column) {
    const expr = parseObjectLiteralOrPattern(parser, context, void 0, skipInitializer, inGroup, 0, 2, 0, start, line, column);
    if (context & 256 && parser.destructible & 64) {
        report(parser, 60);
    }
    if (parser.destructible & 8) {
        report(parser, 59);
    }
    return expr;
}
function parseObjectLiteralOrPattern(parser, context, scope, skipInitializer, inGroup, isPattern, kind, origin, start, line, column) {
    nextToken(parser, context);
    const properties = [];
    let destructible = 0;
    let prototypeCount = 0;
    context = (context | 134217728) ^ 134217728;
    while (parser.token !== 1074790415) {
        const { token, tokenValue, linePos, colPos, tokenPos } = parser;
        if (token === 14) {
            properties.push(parseSpreadOrRestElement(parser, context, scope, 1074790415, kind, origin, 0, inGroup, isPattern, tokenPos, linePos, colPos));
        }
        else {
            let state = 0;
            let key = null;
            let value;
            const t = parser.token;
            if (parser.token & (143360 | 4096) || parser.token === 121) {
                key = parseIdentifier(parser, context, 0);
                if (parser.token === 18 || parser.token === 1074790415 || parser.token === 1077936157) {
                    state |= 4;
                    if (context & 1024 && (token & 537079808) === 537079808) {
                        destructible |= 16;
                    }
                    else {
                        validateBindingIdentifier(parser, context, kind, token, 0);
                    }
                    if (scope)
                        addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
                    if (consumeOpt(parser, context | 32768, 1077936157)) {
                        destructible |= 8;
                        const right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                        destructible |=
                            parser.destructible & 256
                                ? 256
                                : 0 | (parser.destructible & 128)
                                    ? 128
                                    : 0;
                        value = finishNode(parser, context, tokenPos, linePos, colPos, {
                            type: 'AssignmentPattern',
                            left: context & -2147483648 ? Object.assign({}, key) : key,
                            right
                        });
                    }
                    else {
                        destructible |=
                            (token === 209008 ? 128 : 0) |
                                (token === 121 ? 16 : 0);
                        value = context & -2147483648 ? Object.assign({}, key) : key;
                    }
                }
                else if (consumeOpt(parser, context | 32768, 21)) {
                    const { tokenPos, linePos, colPos } = parser;
                    if (tokenValue === '__proto__')
                        prototypeCount++;
                    if (parser.token & 143360) {
                        const tokenAfterColon = parser.token;
                        const valueAfterColon = parser.tokenValue;
                        destructible |= t === 121 ? 16 : 0;
                        value = parsePrimaryExpression(parser, context, kind, 0, 1, 0, inGroup, 1, tokenPos, linePos, colPos);
                        const { token } = parser;
                        value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (token === 1077936157 || token === 1074790415 || token === 18) {
                                destructible |= parser.destructible & 128 ? 128 : 0;
                                if (parser.assignable & 2) {
                                    destructible |= 16;
                                }
                                else if (scope && (tokenAfterColon & 143360) === 143360) {
                                    addVarOrBlock(parser, context, scope, valueAfterColon, kind, origin);
                                }
                            }
                            else {
                                destructible |=
                                    parser.assignable & 1
                                        ? 32
                                        : 16;
                            }
                        }
                        else if ((parser.token & 4194304) === 4194304) {
                            if (parser.assignable & 2) {
                                destructible |= 16;
                            }
                            else if (token !== 1077936157) {
                                destructible |= 32;
                            }
                            else if (scope) {
                                addVarOrBlock(parser, context, scope, valueAfterColon, kind, origin);
                            }
                            value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                        }
                        else {
                            destructible |= 16;
                            if ((parser.token & 8454144) === 8454144) {
                                value = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, value);
                            }
                            if (consumeOpt(parser, context | 32768, 22)) {
                                value = parseConditionalExpression(parser, context, value, tokenPos, linePos, colPos);
                            }
                        }
                    }
                    else if ((parser.token & 2097152) === 2097152) {
                        value =
                            parser.token === 69271571
                                ? parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos)
                                : parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos);
                        destructible = parser.destructible;
                        parser.assignable =
                            destructible & 16 ? 2 : 1;
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (parser.assignable & 2)
                                destructible |= 16;
                        }
                        else if (parser.destructible & 8) {
                            report(parser, 68);
                        }
                        else {
                            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                            destructible = parser.assignable & 2 ? 16 : 0;
                            if ((parser.token & 4194304) === 4194304) {
                                value = parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                            }
                            else {
                                if ((parser.token & 8454144) === 8454144) {
                                    value = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, value);
                                }
                                if (consumeOpt(parser, context | 32768, 22)) {
                                    value = parseConditionalExpression(parser, context, value, tokenPos, linePos, colPos);
                                }
                                destructible |=
                                    parser.assignable & 2
                                        ? 16
                                        : 32;
                            }
                        }
                    }
                    else {
                        value = parseLeftHandSideExpression(parser, context, 1, inGroup, 1, tokenPos, linePos, colPos);
                        destructible |=
                            parser.assignable & 1
                                ? 32
                                : 16;
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (parser.assignable & 2)
                                destructible |= 16;
                        }
                        else {
                            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                            destructible = parser.assignable & 2 ? 16 : 0;
                            if (parser.token !== 18 && token !== 1074790415) {
                                if (parser.token !== 1077936157)
                                    destructible |= 16;
                                value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                            }
                        }
                    }
                }
                else if (parser.token === 69271571) {
                    destructible |= 16;
                    if (token === 209007)
                        state |= 16;
                    state |=
                        (token === 12402
                            ? 256
                            : token === 12403
                                ? 512
                                : 1) | 2;
                    key = parseComputedPropertyName(parser, context, inGroup);
                    destructible |= parser.assignable;
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                }
                else if (parser.token & (143360 | 4096)) {
                    destructible |= 16;
                    if (token === 121)
                        report(parser, 92);
                    if (token === 209007) {
                        if (parser.flags & 1)
                            report(parser, 128);
                        state |= 16;
                    }
                    key = parseIdentifier(parser, context, 0);
                    state |=
                        token === 12402
                            ? 256
                            : token === 12403
                                ? 512
                                : 1;
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                }
                else if (parser.token === 67174411) {
                    destructible |= 16;
                    state |= 1;
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                }
                else if (parser.token === 8457014) {
                    destructible |= 16;
                    if (token === 12402 || token === 12403) {
                        report(parser, 40);
                    }
                    else if (token === 143483) {
                        report(parser, 92);
                    }
                    nextToken(parser, context);
                    state |=
                        8 | 1 | (token === 209007 ? 16 : 0);
                    if (parser.token & 143360) {
                        key = parseIdentifier(parser, context, 0);
                    }
                    else if ((parser.token & 134217728) === 134217728) {
                        key = parseLiteral(parser, context);
                    }
                    else if (parser.token === 69271571) {
                        state |= 2;
                        key = parseComputedPropertyName(parser, context, inGroup);
                        destructible |= parser.assignable;
                    }
                    else {
                        report(parser, 28, KeywordDescTable[parser.token & 255]);
                    }
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                }
                else if ((parser.token & 134217728) === 134217728) {
                    if (token === 209007)
                        state |= 16;
                    state |=
                        token === 12402
                            ? 256
                            : token === 12403
                                ? 512
                                : 1;
                    destructible |= 16;
                    key = parseLiteral(parser, context);
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                }
                else {
                    report(parser, 129);
                }
            }
            else if ((parser.token & 134217728) === 134217728) {
                key = parseLiteral(parser, context);
                if (parser.token === 21) {
                    consume(parser, context | 32768, 21);
                    const { tokenPos, linePos, colPos } = parser;
                    if (tokenValue === '__proto__')
                        prototypeCount++;
                    if (parser.token & 143360) {
                        value = parsePrimaryExpression(parser, context, kind, 0, 1, 0, inGroup, 1, tokenPos, linePos, colPos);
                        const { token, tokenValue: valueAfterColon } = parser;
                        value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (token === 1077936157 || token === 1074790415 || token === 18) {
                                if (parser.assignable & 2) {
                                    destructible |= 16;
                                }
                                else if (scope) {
                                    addVarOrBlock(parser, context, scope, valueAfterColon, kind, origin);
                                }
                            }
                            else {
                                destructible |=
                                    parser.assignable & 1
                                        ? 32
                                        : 16;
                            }
                        }
                        else if (parser.token === 1077936157) {
                            if (parser.assignable & 2)
                                destructible |= 16;
                            value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                        }
                        else {
                            destructible |= 16;
                            value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                        }
                    }
                    else if ((parser.token & 2097152) === 2097152) {
                        value =
                            parser.token === 69271571
                                ? parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos)
                                : parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos);
                        destructible = parser.destructible;
                        parser.assignable =
                            destructible & 16 ? 2 : 1;
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (parser.assignable & 2) {
                                destructible |= 16;
                            }
                        }
                        else if ((parser.destructible & 8) !== 8) {
                            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                            destructible = parser.assignable & 2 ? 16 : 0;
                            if ((parser.token & 4194304) === 4194304) {
                                value = parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                            }
                            else {
                                if ((parser.token & 8454144) === 8454144) {
                                    value = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, value);
                                }
                                if (consumeOpt(parser, context | 32768, 22)) {
                                    value = parseConditionalExpression(parser, context, value, tokenPos, linePos, colPos);
                                }
                                destructible |=
                                    parser.assignable & 2
                                        ? 16
                                        : 32;
                            }
                        }
                    }
                    else {
                        value = parseLeftHandSideExpression(parser, context, 1, 0, 1, tokenPos, linePos, colPos);
                        destructible |=
                            parser.assignable & 1
                                ? 32
                                : 16;
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (parser.assignable & 2) {
                                destructible |= 16;
                            }
                        }
                        else {
                            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                            destructible = parser.assignable & 1 ? 0 : 16;
                            if (parser.token !== 18 && parser.token !== 1074790415) {
                                if (parser.token !== 1077936157)
                                    destructible |= 16;
                                value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                            }
                        }
                    }
                }
                else if (parser.token === 67174411) {
                    state |= 1;
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                    destructible = parser.assignable | 16;
                }
                else {
                    report(parser, 130);
                }
            }
            else if (parser.token === 69271571) {
                key = parseComputedPropertyName(parser, context, inGroup);
                destructible |= parser.destructible & 256 ? 256 : 0;
                state |= 2;
                if (parser.token === 21) {
                    nextToken(parser, context | 32768);
                    const { tokenPos, linePos, colPos, tokenValue, token: tokenAfterColon } = parser;
                    if (parser.token & 143360) {
                        value = parsePrimaryExpression(parser, context, kind, 0, 1, 0, inGroup, 1, tokenPos, linePos, colPos);
                        const { token } = parser;
                        value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                        if ((parser.token & 4194304) === 4194304) {
                            destructible |=
                                parser.assignable & 2
                                    ? 16
                                    : token === 1077936157
                                        ? 0
                                        : 32;
                            value = parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                        }
                        else if (parser.token === 18 || parser.token === 1074790415) {
                            if (token === 1077936157 || token === 1074790415 || token === 18) {
                                if (parser.assignable & 2) {
                                    destructible |= 16;
                                }
                                else if (scope && (tokenAfterColon & 143360) === 143360) {
                                    addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
                                }
                            }
                            else {
                                destructible |=
                                    parser.assignable & 1
                                        ? 32
                                        : 16;
                            }
                        }
                        else {
                            destructible |= 16;
                            value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                        }
                    }
                    else if ((parser.token & 2097152) === 2097152) {
                        value =
                            parser.token === 69271571
                                ? parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos)
                                : parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos);
                        destructible = parser.destructible;
                        parser.assignable =
                            destructible & 16 ? 2 : 1;
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (parser.assignable & 2)
                                destructible |= 16;
                        }
                        else if (destructible & 8) {
                            report(parser, 59);
                        }
                        else {
                            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                            destructible =
                                parser.assignable & 2 ? destructible | 16 : 0;
                            if ((parser.token & 4194304) === 4194304) {
                                if (parser.token !== 1077936157)
                                    destructible |= 16;
                                value = parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                            }
                            else {
                                if ((parser.token & 8454144) === 8454144) {
                                    value = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, value);
                                }
                                if (consumeOpt(parser, context | 32768, 22)) {
                                    value = parseConditionalExpression(parser, context, value, tokenPos, linePos, colPos);
                                }
                                destructible |=
                                    parser.assignable & 2
                                        ? 16
                                        : 32;
                            }
                        }
                    }
                    else {
                        value = parseLeftHandSideExpression(parser, context, 1, 0, 1, tokenPos, linePos, colPos);
                        destructible |=
                            parser.assignable & 1
                                ? 32
                                : 16;
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (parser.assignable & 2)
                                destructible |= 16;
                        }
                        else {
                            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                            destructible = parser.assignable & 1 ? 0 : 16;
                            if (parser.token !== 18 && parser.token !== 1074790415) {
                                if (parser.token !== 1077936157)
                                    destructible |= 16;
                                value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                            }
                        }
                    }
                }
                else if (parser.token === 67174411) {
                    state |= 1;
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, linePos, colPos);
                    destructible = 16;
                }
                else {
                    report(parser, 41);
                }
            }
            else if (token === 8457014) {
                consume(parser, context | 32768, 8457014);
                state |= 8;
                if (parser.token & 143360) {
                    const { token, line, index } = parser;
                    key = parseIdentifier(parser, context, 0);
                    state |= 1;
                    if (parser.token === 67174411) {
                        destructible |= 16;
                        value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                    }
                    else {
                        reportMessageAt(index, line, index, token === 209007
                            ? 43
                            : token === 12402 || parser.token === 12403
                                ? 42
                                : 44, KeywordDescTable[token & 255]);
                    }
                }
                else if ((parser.token & 134217728) === 134217728) {
                    destructible |= 16;
                    key = parseLiteral(parser, context);
                    state |= 1;
                    value = parseMethodDefinition(parser, context, state, inGroup, tokenPos, linePos, colPos);
                }
                else if (parser.token === 69271571) {
                    destructible |= 16;
                    state |= 2 | 1;
                    key = parseComputedPropertyName(parser, context, inGroup);
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                }
                else {
                    report(parser, 122);
                }
            }
            else {
                report(parser, 28, KeywordDescTable[token & 255]);
            }
            destructible |= parser.destructible & 128 ? 128 : 0;
            parser.destructible = destructible;
            properties.push(finishNode(parser, context, tokenPos, linePos, colPos, {
                type: 'Property',
                key: key,
                value,
                kind: !(state & 768) ? 'init' : state & 512 ? 'set' : 'get',
                computed: (state & 2) > 0,
                method: (state & 1) > 0,
                shorthand: (state & 4) > 0
            }));
        }
        destructible |= parser.destructible;
        if (parser.token !== 18)
            break;
        nextToken(parser, context);
    }
    consume(parser, context, 1074790415);
    if (prototypeCount > 1)
        destructible |= 64;
    const node = finishNode(parser, context, start, line, column, {
        type: isPattern ? 'ObjectPattern' : 'ObjectExpression',
        properties
    });
    if (!skipInitializer && parser.token & 4194304) {
        return parseArrayOrObjectAssignmentPattern(parser, context, destructible, inGroup, isPattern, start, line, column, node);
    }
    parser.destructible = destructible;
    return node;
}
function parseMethodFormals(parser, context, scope, kind, type, inGroup) {
    consume(parser, context, 67174411);
    const params = [];
    parser.flags = (parser.flags | 128) ^ 128;
    if (parser.token === 16) {
        if (kind & 512) {
            report(parser, 35, 'Setter', 'one', '');
        }
        nextToken(parser, context);
        return params;
    }
    if (kind & 256) {
        report(parser, 35, 'Getter', 'no', 's');
    }
    if (kind & 512 && parser.token === 14) {
        report(parser, 36);
    }
    context = (context | 134217728) ^ 134217728;
    let setterArgs = 0;
    let isSimpleParameterList = 0;
    while (parser.token !== 18) {
        let left = null;
        const { tokenPos, linePos, colPos } = parser;
        if (parser.token & 143360) {
            if ((context & 1024) === 0) {
                if ((parser.token & 36864) === 36864) {
                    parser.flags |= 256;
                }
                if ((parser.token & 537079808) === 537079808) {
                    parser.flags |= 512;
                }
            }
            left = parseAndClassifyIdentifier(parser, context, scope, kind | 1, 0, tokenPos, linePos, colPos);
        }
        else {
            if (parser.token === 2162700) {
                left = parseObjectLiteralOrPattern(parser, context, scope, 1, inGroup, 1, type, 0, tokenPos, linePos, colPos);
            }
            else if (parser.token === 69271571) {
                left = parseArrayExpressionOrPattern(parser, context, scope, 1, inGroup, 1, type, 0, tokenPos, linePos, colPos);
            }
            else if (parser.token === 14) {
                left = parseSpreadOrRestElement(parser, context, scope, 16, type, 0, 0, inGroup, 1, tokenPos, linePos, colPos);
            }
            isSimpleParameterList = 1;
            if (parser.destructible & (32 | 16))
                report(parser, 47);
        }
        if (parser.token === 1077936157) {
            nextToken(parser, context | 32768);
            isSimpleParameterList = 1;
            const right = parseExpression(parser, context, 1, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
            left = finishNode(parser, context, tokenPos, linePos, colPos, {
                type: 'AssignmentPattern',
                left: left,
                right
            });
        }
        setterArgs++;
        params.push(left);
        if (!consumeOpt(parser, context, 18))
            break;
        if (parser.token === 16) {
            break;
        }
    }
    if (kind & 512 && setterArgs !== 1) {
        report(parser, 35, 'Setter', 'one', '');
    }
    if (scope && scope.scopeError !== void 0)
        reportScopeError(scope.scopeError);
    if (isSimpleParameterList)
        parser.flags |= 128;
    consume(parser, context, 16);
    return params;
}
function parseComputedPropertyName(parser, context, inGroup) {
    nextToken(parser, context | 32768);
    const key = parseExpression(parser, (context | 134217728) ^ 134217728, 1, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context, 20);
    return key;
}
function parseParenthesizedExpression(parser, context, canAssign, kind, origin, start, line, column) {
    parser.flags = (parser.flags | 128) ^ 128;
    const { tokenPos: piStart, linePos: plStart, colPos: pcStart } = parser;
    nextToken(parser, context | 32768 | 1073741824);
    const scope = context & 64 ? addChildScope(createScope(), 1024) : void 0;
    context = (context | 134217728) ^ 134217728;
    if (consumeOpt(parser, context, 16)) {
        return parseParenthesizedArrow(parser, context, scope, [], canAssign, 0, start, line, column);
    }
    let destructible = 0;
    parser.destructible &= ~(256 | 128);
    let expr;
    let expressions = [];
    let isSequence = 0;
    let isSimpleParameterList = 0;
    const { tokenPos: iStart, linePos: lStart, colPos: cStart } = parser;
    parser.assignable = 1;
    while (parser.token !== 16) {
        const { token, tokenPos, linePos, colPos } = parser;
        if (token & (143360 | 4096)) {
            if (scope)
                addBlockName(parser, context, scope, parser.tokenValue, 1, 0);
            expr = parsePrimaryExpression(parser, context, kind, 0, 1, 0, 1, 1, tokenPos, linePos, colPos);
            if (parser.token === 16 || parser.token === 18) {
                if (parser.assignable & 2) {
                    destructible |= 16;
                    isSimpleParameterList = 1;
                }
                else if ((token & 537079808) === 537079808 ||
                    (token & 36864) === 36864) {
                    isSimpleParameterList = 1;
                }
            }
            else {
                if (parser.token === 1077936157) {
                    isSimpleParameterList = 1;
                }
                else {
                    destructible |= 16;
                }
                expr = parseMemberOrUpdateExpression(parser, context, expr, 1, 0, tokenPos, linePos, colPos);
                if (parser.token !== 16 && parser.token !== 18) {
                    expr = parseAssignmentExpression(parser, context, 1, 0, tokenPos, linePos, colPos, expr);
                }
            }
        }
        else if ((token & 2097152) === 2097152) {
            expr =
                token === 2162700
                    ? parseObjectLiteralOrPattern(parser, context | 1073741824, scope, 0, 1, 0, kind, origin, tokenPos, linePos, colPos)
                    : parseArrayExpressionOrPattern(parser, context | 1073741824, scope, 0, 1, 0, kind, origin, tokenPos, linePos, colPos);
            destructible |= parser.destructible;
            isSimpleParameterList = 1;
            parser.assignable = 2;
            if (parser.token !== 16 && parser.token !== 18) {
                if (destructible & 8)
                    report(parser, 118);
                expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, tokenPos, linePos, colPos);
                destructible |= 16;
                if (parser.token !== 16 && parser.token !== 18) {
                    expr = parseAssignmentExpression(parser, context, 0, 0, tokenPos, linePos, colPos, expr);
                }
            }
        }
        else if (token === 14) {
            expr = parseSpreadOrRestElement(parser, context, scope, 16, kind, origin, 0, 1, 0, tokenPos, linePos, colPos);
            if (parser.destructible & 16)
                report(parser, 71);
            isSimpleParameterList = 1;
            if (isSequence && (parser.token === 16 || parser.token === 18)) {
                expressions.push(expr);
            }
            destructible |= 8;
            break;
        }
        else {
            destructible |= 16;
            expr = parseExpression(parser, context, 1, 0, 1, tokenPos, linePos, colPos);
            if (isSequence && (parser.token === 16 || parser.token === 18)) {
                expressions.push(expr);
            }
            if (parser.token === 18) {
                if (!isSequence) {
                    isSequence = 1;
                    expressions = [expr];
                }
            }
            if (isSequence) {
                while (consumeOpt(parser, context | 32768, 18)) {
                    expressions.push(parseExpression(parser, context, 1, 0, 1, parser.tokenPos, parser.linePos, parser.colPos));
                }
                parser.assignable = 2;
                expr = finishNode(parser, context, iStart, lStart, cStart, {
                    type: 'SequenceExpression',
                    expressions
                });
            }
            consume(parser, context, 16);
            parser.destructible = destructible;
            return expr;
        }
        if (isSequence && (parser.token === 16 || parser.token === 18)) {
            expressions.push(expr);
        }
        if (!consumeOpt(parser, context | 32768, 18))
            break;
        if (!isSequence) {
            isSequence = 1;
            expressions = [expr];
        }
        if (parser.token === 16) {
            destructible |= 8;
            break;
        }
    }
    if (isSequence) {
        parser.assignable = 2;
        expr = finishNode(parser, context, iStart, lStart, cStart, {
            type: 'SequenceExpression',
            expressions
        });
    }
    consume(parser, context, 16);
    if (destructible & 16 && destructible & 8)
        report(parser, 145);
    destructible |=
        parser.destructible & 256
            ? 256
            : 0 | (parser.destructible & 128)
                ? 128
                : 0;
    if (parser.token === 10) {
        if (destructible & (32 | 16))
            report(parser, 46);
        if (context & (4194304 | 2048) && destructible & 128)
            report(parser, 29);
        if (context & (1024 | 2097152) && destructible & 256) {
            report(parser, 30);
        }
        if (isSimpleParameterList)
            parser.flags |= 128;
        return parseParenthesizedArrow(parser, context, scope, isSequence ? expressions : [expr], canAssign, 0, start, line, column);
    }
    else if (destructible & 8) {
        report(parser, 139);
    }
    parser.destructible = ((parser.destructible | 256) ^ 256) | destructible;
    return context & 128
        ? finishNode(parser, context, piStart, plStart, pcStart, {
            type: 'ParenthesizedExpression',
            expression: expr
        })
        : expr;
}
function parseIdentifierOrArrow(parser, context, start, line, column) {
    const { tokenValue } = parser;
    const expr = parseIdentifier(parser, context, 0);
    parser.assignable = 1;
    if (parser.token === 10) {
        let scope = void 0;
        if (context & 64)
            scope = createArrowHeadParsingScope(parser, context, tokenValue);
        parser.flags = (parser.flags | 128) ^ 128;
        return parseArrowFunctionExpression(parser, context, scope, [expr], 0, start, line, column);
    }
    return expr;
}
function parseArrowFromIdentifier(parser, context, value, expr, inNew, canAssign, isAsync, start, line, column) {
    if (!canAssign)
        report(parser, 54);
    if (inNew)
        report(parser, 48);
    parser.flags &= ~128;
    const scope = context & 64 ? createArrowHeadParsingScope(parser, context, value) : void 0;
    return parseArrowFunctionExpression(parser, context, scope, [expr], isAsync, start, line, column);
}
function parseParenthesizedArrow(parser, context, scope, params, canAssign, isAsync, start, line, column) {
    if (!canAssign)
        report(parser, 54);
    for (let i = 0; i < params.length; ++i)
        reinterpretToPattern(parser, params[i]);
    return parseArrowFunctionExpression(parser, context, scope, params, isAsync, start, line, column);
}
function parseArrowFunctionExpression(parser, context, scope, params, isAsync, start, line, column) {
    if (parser.flags & 1)
        report(parser, 45);
    consume(parser, context | 32768, 10);
    context = ((context | 15728640) ^ 15728640) | (isAsync << 22);
    const expression = parser.token !== 2162700;
    let body;
    if (scope && scope.scopeError !== void 0) {
        reportScopeError(scope.scopeError);
    }
    if (expression) {
        body = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
    }
    else {
        if (scope)
            scope = addChildScope(scope, 128);
        body = parseFunctionBody(parser, (context | 134221824 | 8192 | 16384) ^
            (134221824 | 8192 | 16384), scope, 16, void 0, void 0);
        switch (parser.token) {
            case 69271571:
                if ((parser.flags & 1) === 0) {
                    report(parser, 112);
                }
                break;
            case 67108877:
            case 67174409:
            case 22:
                report(parser, 113);
            case 67174411:
                if ((parser.flags & 1) === 0) {
                    report(parser, 112);
                }
                parser.flags |= 1024;
                break;
        }
        if ((parser.token & 8454144) === 8454144 && (parser.flags & 1) === 0)
            report(parser, 28, KeywordDescTable[parser.token & 255]);
        if ((parser.token & 33619968) === 33619968)
            report(parser, 121);
    }
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'ArrowFunctionExpression',
        params,
        body,
        async: isAsync === 1,
        expression
    });
}
function parseFormalParametersOrFormalList(parser, context, scope, inGroup, kind) {
    consume(parser, context, 67174411);
    parser.flags = (parser.flags | 128) ^ 128;
    const params = [];
    if (consumeOpt(parser, context, 16))
        return params;
    context = (context | 134217728) ^ 134217728;
    let isSimpleParameterList = 0;
    while (parser.token !== 18) {
        let left;
        const { tokenPos, linePos, colPos } = parser;
        if (parser.token & 143360) {
            if ((context & 1024) === 0) {
                if ((parser.token & 36864) === 36864) {
                    parser.flags |= 256;
                }
                if ((parser.token & 537079808) === 537079808) {
                    parser.flags |= 512;
                }
            }
            left = parseAndClassifyIdentifier(parser, context, scope, kind | 1, 0, tokenPos, linePos, colPos);
        }
        else {
            if (parser.token === 2162700) {
                left = parseObjectLiteralOrPattern(parser, context, scope, 1, inGroup, 1, kind, 0, tokenPos, linePos, colPos);
            }
            else if (parser.token === 69271571) {
                left = parseArrayExpressionOrPattern(parser, context, scope, 1, inGroup, 1, kind, 0, tokenPos, linePos, colPos);
            }
            else if (parser.token === 14) {
                left = parseSpreadOrRestElement(parser, context, scope, 16, kind, 0, 0, inGroup, 1, tokenPos, linePos, colPos);
            }
            else {
                report(parser, 28, KeywordDescTable[parser.token & 255]);
            }
            isSimpleParameterList = 1;
            if (parser.destructible & (32 | 16)) {
                report(parser, 47);
            }
        }
        if (parser.token === 1077936157) {
            nextToken(parser, context | 32768);
            isSimpleParameterList = 1;
            const right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
            left = finishNode(parser, context, tokenPos, linePos, colPos, {
                type: 'AssignmentPattern',
                left,
                right
            });
        }
        params.push(left);
        if (!consumeOpt(parser, context, 18))
            break;
        if (parser.token === 16) {
            break;
        }
    }
    if (isSimpleParameterList)
        parser.flags |= 128;
    if (scope && (isSimpleParameterList || context & 1024) && scope.scopeError !== void 0) {
        reportScopeError(scope.scopeError);
    }
    consume(parser, context, 16);
    return params;
}
function parseMembeExpressionNoCall(parser, context, expr, inGroup, start, line, column) {
    const { token } = parser;
    if (token & 67108864) {
        if (token === 67108877) {
            nextToken(parser, context | 1073741824);
            parser.assignable = 1;
            const property = parsePropertyOrPrivatePropertyName(parser, context);
            return parseMembeExpressionNoCall(parser, context, finishNode(parser, context, start, line, column, {
                type: 'MemberExpression',
                object: expr,
                computed: false,
                property
            }), 0, start, line, column);
        }
        else if (token === 69271571) {
            nextToken(parser, context | 32768);
            const { tokenPos, linePos, colPos } = parser;
            const property = parseExpressions(parser, context, inGroup, 1, tokenPos, linePos, colPos);
            consume(parser, context, 20);
            parser.assignable = 1;
            return parseMembeExpressionNoCall(parser, context, finishNode(parser, context, start, line, column, {
                type: 'MemberExpression',
                object: expr,
                computed: true,
                property
            }), 0, start, line, column);
        }
        else if (token === 67174408 || token === 67174409) {
            parser.assignable = 2;
            return parseMembeExpressionNoCall(parser, context, finishNode(parser, context, start, line, column, {
                type: 'TaggedTemplateExpression',
                tag: expr,
                quasi: parser.token === 67174408
                    ? parseTemplate(parser, context | 65536)
                    : parseTemplateLiteral(parser, context, parser.tokenPos, parser.linePos, parser.colPos)
            }), 0, start, line, column);
        }
    }
    return expr;
}
function parseNewExpression(parser, context, inGroup, start, line, column) {
    const id = parseIdentifier(parser, context | 32768, 0);
    const { tokenPos, linePos, colPos } = parser;
    if (consumeOpt(parser, context, 67108877)) {
        if (context & 67108864 && parser.token === 143494) {
            parser.assignable = 2;
            return parseMetaProperty(parser, context, id, start, line, column);
        }
        report(parser, 91);
    }
    parser.assignable = 2;
    if ((parser.token & 16842752) === 16842752) {
        report(parser, 62, KeywordDescTable[parser.token & 255]);
    }
    const expr = parsePrimaryExpression(parser, context, 2, 1, 0, 0, inGroup, 1, tokenPos, linePos, colPos);
    context = (context | 134217728) ^ 134217728;
    if (parser.token === 67108991)
        report(parser, 162);
    const callee = parseMembeExpressionNoCall(parser, context, expr, inGroup, tokenPos, linePos, colPos);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'NewExpression',
        callee,
        arguments: parser.token === 67174411 ? parseArguments(parser, context, inGroup) : []
    });
}
function parseMetaProperty(parser, context, meta, start, line, column) {
    const property = parseIdentifier(parser, context, 0);
    return finishNode(parser, context, start, line, column, {
        type: 'MetaProperty',
        meta,
        property
    });
}
function parseAsyncArrowAfterIdent(parser, context, canAssign, start, line, column) {
    if (parser.token === 209008)
        report(parser, 29);
    if (context & (1024 | 2097152) && parser.token === 241773) {
        report(parser, 30);
    }
    if ((parser.token & 537079808) === 537079808) {
        parser.flags |= 512;
    }
    return parseArrowFromIdentifier(parser, context, parser.tokenValue, parseIdentifier(parser, context, 0), 0, canAssign, 1, start, line, column);
}
function parseAsyncArrowOrCallExpression(parser, context, callee, canAssign, kind, origin, flags, start, line, column) {
    nextToken(parser, context | 32768);
    const scope = context & 64 ? addChildScope(createScope(), 1024) : void 0;
    context = (context | 134217728) ^ 134217728;
    if (consumeOpt(parser, context, 16)) {
        if (parser.token === 10) {
            if (flags & 1)
                report(parser, 45);
            return parseParenthesizedArrow(parser, context, scope, [], canAssign, 1, start, line, column);
        }
        return finishNode(parser, context, start, line, column, {
            type: 'CallExpression',
            callee,
            arguments: []
        });
    }
    let destructible = 0;
    let expr = null;
    let isSimpleParameterList = 0;
    parser.destructible =
        (parser.destructible | 256 | 128) ^
            (256 | 128);
    const params = [];
    while (parser.token !== 16) {
        const { token, tokenPos, linePos, colPos } = parser;
        if (token & (143360 | 4096)) {
            if (scope)
                addBlockName(parser, context, scope, parser.tokenValue, kind, 0);
            expr = parsePrimaryExpression(parser, context, kind, 0, 1, 0, 1, 1, tokenPos, linePos, colPos);
            if (parser.token === 16 || parser.token === 18) {
                if (parser.assignable & 2) {
                    destructible |= 16;
                    isSimpleParameterList = 1;
                }
                else if ((token & 537079808) === 537079808) {
                    parser.flags |= 512;
                }
                else if ((token & 36864) === 36864) {
                    parser.flags |= 256;
                }
            }
            else {
                if (parser.token === 1077936157) {
                    isSimpleParameterList = 1;
                }
                else {
                    destructible |= 16;
                }
                expr = parseMemberOrUpdateExpression(parser, context, expr, 1, 0, tokenPos, linePos, colPos);
                if (parser.token !== 16 && parser.token !== 18) {
                    expr = parseAssignmentExpression(parser, context, 1, 0, tokenPos, linePos, colPos, expr);
                }
            }
        }
        else if (token & 2097152) {
            expr =
                token === 2162700
                    ? parseObjectLiteralOrPattern(parser, context, scope, 0, 1, 0, kind, origin, tokenPos, linePos, colPos)
                    : parseArrayExpressionOrPattern(parser, context, scope, 0, 1, 0, kind, origin, tokenPos, linePos, colPos);
            destructible |= parser.destructible;
            isSimpleParameterList = 1;
            if (parser.token !== 16 && parser.token !== 18) {
                if (destructible & 8)
                    report(parser, 118);
                expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, tokenPos, linePos, colPos);
                destructible |= 16;
                if ((parser.token & 8454144) === 8454144) {
                    expr = parseBinaryExpression(parser, context, 1, start, line, column, 4, token, expr);
                }
                if (consumeOpt(parser, context | 32768, 22)) {
                    expr = parseConditionalExpression(parser, context, expr, start, line, column);
                }
            }
        }
        else if (token === 14) {
            expr = parseSpreadOrRestElement(parser, context, scope, 16, kind, origin, 1, 1, 0, tokenPos, linePos, colPos);
            destructible |= (parser.token === 16 ? 0 : 16) | parser.destructible;
            isSimpleParameterList = 1;
        }
        else {
            expr = parseExpression(parser, context, 1, 0, 0, tokenPos, linePos, colPos);
            destructible = parser.assignable;
            params.push(expr);
            while (consumeOpt(parser, context | 32768, 18)) {
                params.push(parseExpression(parser, context, 1, 0, 0, tokenPos, linePos, colPos));
            }
            destructible |= parser.assignable;
            consume(parser, context, 16);
            parser.destructible = destructible | 16;
            parser.assignable = 2;
            return finishNode(parser, context, start, line, column, {
                type: 'CallExpression',
                callee,
                arguments: params
            });
        }
        params.push(expr);
        if (!consumeOpt(parser, context | 32768, 18))
            break;
    }
    consume(parser, context, 16);
    destructible |=
        parser.destructible & 256
            ? 256
            : 0 | (parser.destructible & 128)
                ? 128
                : 0;
    if (parser.token === 10) {
        if (destructible & (32 | 16))
            report(parser, 25);
        if (parser.flags & 1 || flags & 1)
            report(parser, 45);
        if (destructible & 128)
            report(parser, 29);
        if (context & (1024 | 2097152) && destructible & 256)
            report(parser, 30);
        if (isSimpleParameterList)
            parser.flags |= 128;
        return parseParenthesizedArrow(parser, context, scope, params, canAssign, 1, start, line, column);
    }
    else if (destructible & 8) {
        report(parser, 59);
    }
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'CallExpression',
        callee,
        arguments: params
    });
}
function parseRegExpLiteral(parser, context, start, line, column) {
    const { tokenRaw, tokenRegExp, tokenValue } = parser;
    nextToken(parser, context);
    parser.assignable = 2;
    return context & 512
        ? finishNode(parser, context, start, line, column, {
            type: 'Literal',
            value: tokenValue,
            regex: tokenRegExp,
            raw: tokenRaw
        })
        : finishNode(parser, context, start, line, column, {
            type: 'Literal',
            value: tokenValue,
            regex: tokenRegExp
        });
}
function parseClassDeclaration(parser, context, scope, flags, start, line, column) {
    context = (context | 16777216 | 1024) ^ 16777216;
    let decorators = parseDecorators(parser, context);
    if (decorators.length) {
        start = parser.tokenPos;
        line = parser.linePos;
        column = parser.colPos;
    }
    if (parser.leadingDecorators.length) {
        parser.leadingDecorators.push(...decorators);
        decorators = parser.leadingDecorators;
        parser.leadingDecorators = [];
    }
    nextToken(parser, context);
    let id = null;
    let superClass = null;
    const { tokenValue } = parser;
    if (parser.token & 4096 && parser.token !== 20567) {
        if (isStrictReservedWord(parser, context, parser.token)) {
            report(parser, 114);
        }
        if ((parser.token & 537079808) === 537079808) {
            report(parser, 115);
        }
        if (scope) {
            addBlockName(parser, context, scope, tokenValue, 32, 0);
            if (flags) {
                if (flags & 2) {
                    declareUnboundVariable(parser, tokenValue);
                }
            }
        }
        id = parseIdentifier(parser, context, 0);
    }
    else {
        if ((flags & 1) === 0)
            report(parser, 37, 'Class');
    }
    let inheritedContext = context;
    if (consumeOpt(parser, context | 32768, 20567)) {
        superClass = parseLeftHandSideExpression(parser, context, 0, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
        inheritedContext |= 524288;
    }
    else {
        inheritedContext = (inheritedContext | 524288) ^ 524288;
    }
    const body = parseClassBody(parser, inheritedContext, context, scope, 2, 8, 0);
    return finishNode(parser, context, start, line, column, context & 1
        ? {
            type: 'ClassDeclaration',
            id,
            superClass,
            decorators,
            body
        }
        : {
            type: 'ClassDeclaration',
            id,
            superClass,
            body
        });
}
function parseClassExpression(parser, context, inGroup, start, line, column) {
    let id = null;
    let superClass = null;
    context = (context | 1024 | 16777216) ^ 16777216;
    const decorators = parseDecorators(parser, context);
    if (decorators.length) {
        start = parser.tokenPos;
        line = parser.linePos;
        column = parser.colPos;
    }
    nextToken(parser, context);
    if (parser.token & 4096 && parser.token !== 20567) {
        if (isStrictReservedWord(parser, context, parser.token))
            report(parser, 114);
        if ((parser.token & 537079808) === 537079808) {
            report(parser, 115);
        }
        id = parseIdentifier(parser, context, 0);
    }
    let inheritedContext = context;
    if (consumeOpt(parser, context | 32768, 20567)) {
        superClass = parseLeftHandSideExpression(parser, context, 0, inGroup, 0, parser.tokenPos, parser.linePos, parser.colPos);
        inheritedContext |= 524288;
    }
    else {
        inheritedContext = (inheritedContext | 524288) ^ 524288;
    }
    const body = parseClassBody(parser, inheritedContext, context, void 0, 2, 0, inGroup);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, context & 1
        ? {
            type: 'ClassExpression',
            id,
            superClass,
            decorators,
            body
        }
        : {
            type: 'ClassExpression',
            id,
            superClass,
            body
        });
}
function parseDecorators(parser, context) {
    const list = [];
    if (context & 1) {
        while (parser.token === 133) {
            list.push(parseDecoratorList(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
        }
    }
    return list;
}
function parseDecoratorList(parser, context, start, line, column) {
    nextToken(parser, context | 32768);
    let expression = parsePrimaryExpression(parser, context, 2, 0, 1, 0, 0, 1, start, line, column);
    expression = parseMemberOrUpdateExpression(parser, context, expression, 0, 0, start, line, column);
    return finishNode(parser, context, start, line, column, {
        type: 'Decorator',
        expression
    });
}
function parseClassBody(parser, context, inheritedContext, scope, kind, origin, inGroup) {
    const { tokenPos, linePos, colPos } = parser;
    consume(parser, context | 32768, 2162700);
    context = (context | 134217728) ^ 134217728;
    parser.flags = (parser.flags | 32) ^ 32;
    const body = [];
    let decorators;
    while (parser.token !== 1074790415) {
        let length = 0;
        decorators = parseDecorators(parser, context);
        length = decorators.length;
        if (length > 0 && parser.tokenValue === 'constructor') {
            report(parser, 106);
        }
        if (parser.token === 1074790415)
            report(parser, 105);
        if (consumeOpt(parser, context, 1074790417)) {
            if (length > 0)
                report(parser, 116);
            continue;
        }
        body.push(parseClassElementList(parser, context, scope, inheritedContext, kind, decorators, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos));
    }
    consume(parser, origin & 8 ? context | 32768 : context, 1074790415);
    return finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'ClassBody',
        body
    });
}
function parseClassElementList(parser, context, scope, inheritedContext, type, decorators, isStatic, inGroup, start, line, column) {
    let kind = isStatic ? 32 : 0;
    let key = null;
    const { token, tokenPos, linePos, colPos } = parser;
    if (token & (143360 | 36864)) {
        key = parseIdentifier(parser, context, 0);
        switch (token) {
            case 36972:
                if (!isStatic && parser.token !== 67174411) {
                    return parseClassElementList(parser, context, scope, inheritedContext, type, decorators, 1, inGroup, start, line, column);
                }
                break;
            case 209007:
                if (parser.token !== 67174411 && (parser.flags & 1) === 0) {
                    if (context & 1 && (parser.token & 1073741824) === 1073741824) {
                        return parsePropertyDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
                    }
                    kind |= 16 | (optionalBit(parser, context, 8457014) ? 8 : 0);
                }
                break;
            case 12402:
                if (parser.token !== 67174411) {
                    if (context & 1 && (parser.token & 1073741824) === 1073741824) {
                        return parsePropertyDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
                    }
                    kind |= 256;
                }
                break;
            case 12403:
                if (parser.token !== 67174411) {
                    if (context & 1 && (parser.token & 1073741824) === 1073741824) {
                        return parsePropertyDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
                    }
                    kind |= 512;
                }
                break;
        }
    }
    else if (token === 69271571) {
        kind |= 2;
        key = parseComputedPropertyName(parser, inheritedContext, inGroup);
    }
    else if ((token & 134217728) === 134217728) {
        key = parseLiteral(parser, context);
    }
    else if (token === 8457014) {
        kind |= 8;
        nextToken(parser, context);
    }
    else if (context & 1 && parser.token === 131) {
        kind |= 4096;
        key = parsePrivateIdentifier(parser, context | 16384, tokenPos, linePos, colPos);
    }
    else if (context & 1 && (parser.token & 1073741824) === 1073741824) {
        kind |= 128;
    }
    else if (isStatic && token === 2162700) {
        return parseStaticBlock(parser, context, scope, tokenPos, linePos, colPos);
    }
    else if (token === 122) {
        key = parseIdentifier(parser, context, 0);
        if (parser.token !== 67174411)
            report(parser, 28, KeywordDescTable[parser.token & 255]);
    }
    else {
        report(parser, 28, KeywordDescTable[parser.token & 255]);
    }
    if (kind & (8 | 16 | 768)) {
        if (parser.token & 143360) {
            key = parseIdentifier(parser, context, 0);
        }
        else if ((parser.token & 134217728) === 134217728) {
            key = parseLiteral(parser, context);
        }
        else if (parser.token === 69271571) {
            kind |= 2;
            key = parseComputedPropertyName(parser, context, 0);
        }
        else if (parser.token === 122) {
            key = parseIdentifier(parser, context, 0);
        }
        else if (context & 1 && parser.token === 131) {
            kind |= 4096;
            key = parsePrivateIdentifier(parser, context, tokenPos, linePos, colPos);
        }
        else
            report(parser, 131);
    }
    if ((kind & 2) === 0) {
        if (parser.tokenValue === 'constructor') {
            if ((parser.token & 1073741824) === 1073741824) {
                report(parser, 125);
            }
            else if ((kind & 32) === 0 && parser.token === 67174411) {
                if (kind & (768 | 16 | 128 | 8)) {
                    report(parser, 50, 'accessor');
                }
                else if ((context & 524288) === 0) {
                    if (parser.flags & 32)
                        report(parser, 51);
                    else
                        parser.flags |= 32;
                }
            }
            kind |= 64;
        }
        else if ((kind & 4096) === 0 &&
            kind & (32 | 768 | 8 | 16) &&
            parser.tokenValue === 'prototype') {
            report(parser, 49);
        }
    }
    if (context & 1 && parser.token !== 67174411) {
        return parsePropertyDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
    }
    const value = parseMethodDefinition(parser, context, kind, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
    return finishNode(parser, context, start, line, column, context & 1
        ? {
            type: 'MethodDefinition',
            kind: (kind & 32) === 0 && kind & 64
                ? 'constructor'
                : kind & 256
                    ? 'get'
                    : kind & 512
                        ? 'set'
                        : 'method',
            static: (kind & 32) > 0,
            computed: (kind & 2) > 0,
            key,
            decorators,
            value
        }
        : {
            type: 'MethodDefinition',
            kind: (kind & 32) === 0 && kind & 64
                ? 'constructor'
                : kind & 256
                    ? 'get'
                    : kind & 512
                        ? 'set'
                        : 'method',
            static: (kind & 32) > 0,
            computed: (kind & 2) > 0,
            key,
            value
        });
}
function parsePrivateIdentifier(parser, context, start, line, column) {
    nextToken(parser, context);
    const { tokenValue } = parser;
    if (tokenValue === 'constructor')
        report(parser, 124);
    nextToken(parser, context);
    return finishNode(parser, context, start, line, column, {
        type: 'PrivateIdentifier',
        name: tokenValue
    });
}
function parsePropertyDefinition(parser, context, key, state, decorators, start, line, column) {
    let value = null;
    if (state & 8)
        report(parser, 0);
    if (parser.token === 1077936157) {
        nextToken(parser, context | 32768);
        const { tokenPos, linePos, colPos } = parser;
        if (parser.token === 537079928)
            report(parser, 115);
        value = parsePrimaryExpression(parser, context | 16384, 2, 0, 1, 0, 0, 1, tokenPos, linePos, colPos);
        if ((parser.token & 1073741824) !== 1073741824) {
            value = parseMemberOrUpdateExpression(parser, context | 16384, value, 0, 0, tokenPos, linePos, colPos);
            value = parseAssignmentExpression(parser, context | 16384, 0, 0, tokenPos, linePos, colPos, value);
            if (parser.token === 18) {
                value = parseSequenceExpression(parser, context, 0, start, line, column, value);
            }
        }
    }
    return finishNode(parser, context, start, line, column, {
        type: 'PropertyDefinition',
        key,
        value,
        static: (state & 32) > 0,
        computed: (state & 2) > 0,
        decorators
    });
}
function parseBindingPattern(parser, context, scope, type, origin, start, line, column) {
    if (parser.token & 143360)
        return parseAndClassifyIdentifier(parser, context, scope, type, origin, start, line, column);
    if ((parser.token & 2097152) !== 2097152)
        report(parser, 28, KeywordDescTable[parser.token & 255]);
    const left = parser.token === 69271571
        ? parseArrayExpressionOrPattern(parser, context, scope, 1, 0, 1, type, origin, start, line, column)
        : parseObjectLiteralOrPattern(parser, context, scope, 1, 0, 1, type, origin, start, line, column);
    if (parser.destructible & 16)
        report(parser, 47);
    if (parser.destructible & 32)
        report(parser, 47);
    return left;
}
function parseAndClassifyIdentifier(parser, context, scope, kind, origin, start, line, column) {
    const { tokenValue, token } = parser;
    if (context & 1024) {
        if ((token & 537079808) === 537079808) {
            report(parser, 115);
        }
        else if ((token & 36864) === 36864) {
            report(parser, 114);
        }
    }
    if ((token & 20480) === 20480) {
        report(parser, 99);
    }
    if (context & (2048 | 2097152) && token === 241773) {
        report(parser, 30);
    }
    if (token === 241739) {
        if (kind & (8 | 16))
            report(parser, 97);
    }
    if (context & (4194304 | 2048) && token === 209008) {
        report(parser, 95);
    }
    nextToken(parser, context);
    if (scope)
        addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
    return finishNode(parser, context, start, line, column, {
        type: 'Identifier',
        name: tokenValue
    });
}
function parseJSXRootElementOrFragment(parser, context, inJSXChild, start, line, column) {
    nextToken(parser, context);
    if (parser.token === 8456259) {
        return finishNode(parser, context, start, line, column, {
            type: 'JSXFragment',
            openingFragment: parseOpeningFragment(parser, context, start, line, column),
            children: parseJSXChildren(parser, context),
            closingFragment: parseJSXClosingFragment(parser, context, inJSXChild, parser.tokenPos, parser.linePos, parser.colPos)
        });
    }
    let closingElement = null;
    let children = [];
    const openingElement = parseJSXOpeningFragmentOrSelfCloseElement(parser, context, inJSXChild, start, line, column);
    if (!openingElement.selfClosing) {
        children = parseJSXChildren(parser, context);
        closingElement = parseJSXClosingElement(parser, context, inJSXChild, parser.tokenPos, parser.linePos, parser.colPos);
        const close = isEqualTagName(closingElement.name);
        if (isEqualTagName(openingElement.name) !== close)
            report(parser, 149, close);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'JSXElement',
        children,
        openingElement,
        closingElement
    });
}
function parseOpeningFragment(parser, context, start, line, column) {
    scanJSXToken(parser, context);
    return finishNode(parser, context, start, line, column, {
        type: 'JSXOpeningFragment'
    });
}
function parseJSXClosingElement(parser, context, inJSXChild, start, line, column) {
    consume(parser, context, 25);
    const name = parseJSXElementName(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
    if (inJSXChild) {
        consume(parser, context, 8456259);
    }
    else {
        parser.token = scanJSXToken(parser, context);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'JSXClosingElement',
        name
    });
}
function parseJSXClosingFragment(parser, context, inJSXChild, start, line, column) {
    consume(parser, context, 25);
    if (inJSXChild) {
        consume(parser, context, 8456259);
    }
    else {
        consume(parser, context, 8456259);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'JSXClosingFragment'
    });
}
function parseJSXChildren(parser, context) {
    const children = [];
    while (parser.token !== 25) {
        parser.index = parser.tokenPos = parser.startPos;
        parser.column = parser.colPos = parser.startColumn;
        parser.line = parser.linePos = parser.startLine;
        scanJSXToken(parser, context);
        children.push(parseJSXChild(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
    }
    return children;
}
function parseJSXChild(parser, context, start, line, column) {
    if (parser.token === 138)
        return parseJSXText(parser, context, start, line, column);
    if (parser.token === 2162700)
        return parseJSXExpressionContainer(parser, context, 0, 0, start, line, column);
    if (parser.token === 8456258)
        return parseJSXRootElementOrFragment(parser, context, 0, start, line, column);
    report(parser, 0);
}
function parseJSXText(parser, context, start, line, column) {
    scanJSXToken(parser, context);
    const node = {
        type: 'JSXText',
        value: parser.tokenValue
    };
    if (context & 512) {
        node.raw = parser.tokenRaw;
    }
    return finishNode(parser, context, start, line, column, node);
}
function parseJSXOpeningFragmentOrSelfCloseElement(parser, context, inJSXChild, start, line, column) {
    if ((parser.token & 143360) !== 143360 && (parser.token & 4096) !== 4096)
        report(parser, 0);
    const tagName = parseJSXElementName(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
    const attributes = parseJSXAttributes(parser, context);
    const selfClosing = parser.token === 8457016;
    if (parser.token === 8456259) {
        scanJSXToken(parser, context);
    }
    else {
        consume(parser, context, 8457016);
        if (inJSXChild) {
            consume(parser, context, 8456259);
        }
        else {
            scanJSXToken(parser, context);
        }
    }
    return finishNode(parser, context, start, line, column, {
        type: 'JSXOpeningElement',
        name: tagName,
        attributes,
        selfClosing
    });
}
function parseJSXElementName(parser, context, start, line, column) {
    scanJSXIdentifier(parser);
    let key = parseJSXIdentifier(parser, context, start, line, column);
    if (parser.token === 21)
        return parseJSXNamespacedName(parser, context, key, start, line, column);
    while (consumeOpt(parser, context, 67108877)) {
        scanJSXIdentifier(parser);
        key = parseJSXMemberExpression(parser, context, key, start, line, column);
    }
    return key;
}
function parseJSXMemberExpression(parser, context, object, start, line, column) {
    const property = parseJSXIdentifier(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
    return finishNode(parser, context, start, line, column, {
        type: 'JSXMemberExpression',
        object,
        property
    });
}
function parseJSXAttributes(parser, context) {
    const attributes = [];
    while (parser.token !== 8457016 && parser.token !== 8456259 && parser.token !== 1048576) {
        attributes.push(parseJsxAttribute(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
    }
    return attributes;
}
function parseJSXSpreadAttribute(parser, context, start, line, column) {
    nextToken(parser, context);
    consume(parser, context, 14);
    const expression = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context, 1074790415);
    return finishNode(parser, context, start, line, column, {
        type: 'JSXSpreadAttribute',
        argument: expression
    });
}
function parseJsxAttribute(parser, context, start, line, column) {
    if (parser.token === 2162700)
        return parseJSXSpreadAttribute(parser, context, start, line, column);
    scanJSXIdentifier(parser);
    let value = null;
    let name = parseJSXIdentifier(parser, context, start, line, column);
    if (parser.token === 21) {
        name = parseJSXNamespacedName(parser, context, name, start, line, column);
    }
    if (parser.token === 1077936157) {
        const token = scanJSXAttributeValue(parser, context);
        const { tokenPos, linePos, colPos } = parser;
        switch (token) {
            case 134283267:
                value = parseLiteral(parser, context);
                break;
            case 8456258:
                value = parseJSXRootElementOrFragment(parser, context, 1, tokenPos, linePos, colPos);
                break;
            case 2162700:
                value = parseJSXExpressionContainer(parser, context, 1, 1, tokenPos, linePos, colPos);
                break;
            default:
                report(parser, 148);
        }
    }
    return finishNode(parser, context, start, line, column, {
        type: 'JSXAttribute',
        value,
        name
    });
}
function parseJSXNamespacedName(parser, context, namespace, start, line, column) {
    consume(parser, context, 21);
    const name = parseJSXIdentifier(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
    return finishNode(parser, context, start, line, column, {
        type: 'JSXNamespacedName',
        namespace,
        name
    });
}
function parseJSXExpressionContainer(parser, context, inJSXChild, isAttr, start, line, column) {
    nextToken(parser, context | 32768);
    const { tokenPos, linePos, colPos } = parser;
    if (parser.token === 14)
        return parseJSXSpreadChild(parser, context, tokenPos, linePos, colPos);
    let expression = null;
    if (parser.token === 1074790415) {
        if (isAttr)
            report(parser, 151);
        expression = parseJSXEmptyExpression(parser, context, parser.startPos, parser.startLine, parser.startColumn);
    }
    else {
        expression = parseExpression(parser, context, 1, 0, 0, tokenPos, linePos, colPos);
    }
    if (inJSXChild) {
        consume(parser, context, 1074790415);
    }
    else {
        scanJSXToken(parser, context);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'JSXExpressionContainer',
        expression
    });
}
function parseJSXSpreadChild(parser, context, start, line, column) {
    consume(parser, context, 14);
    const expression = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context, 1074790415);
    return finishNode(parser, context, start, line, column, {
        type: 'JSXSpreadChild',
        expression
    });
}
function parseJSXEmptyExpression(parser, context, start, line, column) {
    parser.startPos = parser.tokenPos;
    parser.startLine = parser.linePos;
    parser.startColumn = parser.colPos;
    return finishNode(parser, context, start, line, column, {
        type: 'JSXEmptyExpression'
    });
}
function parseJSXIdentifier(parser, context, start, line, column) {
    const { tokenValue } = parser;
    nextToken(parser, context);
    return finishNode(parser, context, start, line, column, {
        type: 'JSXIdentifier',
        name: tokenValue
    });
}

var estree = /*#__PURE__*/Object.freeze({
  __proto__: null
});

var version$1 = "4.3.0";

const version = version$1;
function parseScript(source, options) {
    return parseSource(source, options, 0);
}
function parseModule(source, options) {
    return parseSource(source, options, 1024 | 2048);
}
function parse(source, options) {
    return parseSource(source, options, 0);
}




/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports) => {

// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

/*
 Copyright (C) 2014 Ivan Nikulin <ifaaan@gmail.com>
 Copyright (C) 2012-2014 Yusuke Suzuki <utatane.tea@gmail.com>
 Copyright (C) 2012-2013 Michael Ficarra <escodegen.copyright@michael.ficarra.me>
 Copyright (C) 2012-2013 Mathias Bynens <mathias@qiwi.be>
 Copyright (C) 2013 Irakli Gozalishvili <rfobic@gmail.com>
 Copyright (C) 2012 Robert Gust-Bardon <donate@robert.gust-bardon.org>
 Copyright (C) 2012 John Freeman <jfreeman08@gmail.com>
 Copyright (C) 2011-2012 Ariya Hidayat <ariya.hidayat@gmail.com>
 Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
 Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
 Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */



var isArray,
    json,
    renumber,
    hexadecimal,
    quotes,
    escapeless,
    parentheses,
    semicolons,
    safeConcatenation,
    directive,
    extra,
    parse;

var Syntax = {
    AssignmentExpression:     'AssignmentExpression',
    AssignmentPattern:        'AssignmentPattern',
    ArrayExpression:          'ArrayExpression',
    ArrayPattern:             'ArrayPattern',
    ArrowFunctionExpression:  'ArrowFunctionExpression',
    AwaitExpression:          'AwaitExpression',
    BlockStatement:           'BlockStatement',
    BinaryExpression:         'BinaryExpression',
    BreakStatement:           'BreakStatement',
    CallExpression:           'CallExpression',
    CatchClause:              'CatchClause',
    ClassBody:                'ClassBody',
    ClassDeclaration:         'ClassDeclaration',
    ClassExpression:          'ClassExpression',
    ComprehensionBlock:       'ComprehensionBlock',
    ComprehensionExpression:  'ComprehensionExpression',
    ConditionalExpression:    'ConditionalExpression',
    ContinueStatement:        'ContinueStatement',
    DirectiveStatement:       'DirectiveStatement',
    DoWhileStatement:         'DoWhileStatement',
    DebuggerStatement:        'DebuggerStatement',
    EmptyStatement:           'EmptyStatement',
    ExportAllDeclaration:     'ExportAllDeclaration',
    ExportBatchSpecifier:     'ExportBatchSpecifier',
    ExportDeclaration:        'ExportDeclaration',
    ExportNamedDeclaration:   'ExportNamedDeclaration',
    ExportSpecifier:          'ExportSpecifier',
    ExpressionStatement:      'ExpressionStatement',
    ForStatement:             'ForStatement',
    ForInStatement:           'ForInStatement',
    ForOfStatement:           'ForOfStatement',
    FunctionDeclaration:      'FunctionDeclaration',
    FunctionExpression:       'FunctionExpression',
    GeneratorExpression:      'GeneratorExpression',
    Identifier:               'Identifier',
    IfStatement:              'IfStatement',
    ImportExpression:         'ImportExpression',
    ImportSpecifier:          'ImportSpecifier',
    ImportDeclaration:        'ImportDeclaration',
    ChainExpression:          'ChainExpression',
    Literal:                  'Literal',
    LabeledStatement:         'LabeledStatement',
    LogicalExpression:        'LogicalExpression',
    MemberExpression:         'MemberExpression',
    MetaProperty:             'MetaProperty',
    MethodDefinition:         'MethodDefinition',
    ModuleDeclaration:        'ModuleDeclaration',
    NewExpression:            'NewExpression',
    ObjectExpression:         'ObjectExpression',
    ObjectPattern:            'ObjectPattern',
    Program:                  'Program',
    Property:                 'Property',
    RestElement:              'RestElement',
    ReturnStatement:          'ReturnStatement',
    SequenceExpression:       'SequenceExpression',
    SpreadElement:            'SpreadElement',
    Super:                    'Super',
    SwitchStatement:          'SwitchStatement',
    SwitchCase:               'SwitchCase',
    TaggedTemplateExpression: 'TaggedTemplateExpression',
    TemplateElement:          'TemplateElement',
    TemplateLiteral:          'TemplateLiteral',
    ThisExpression:           'ThisExpression',
    ThrowStatement:           'ThrowStatement',
    TryStatement:             'TryStatement',
    UnaryExpression:          'UnaryExpression',
    UpdateExpression:         'UpdateExpression',
    VariableDeclaration:      'VariableDeclaration',
    VariableDeclarator:       'VariableDeclarator',
    WhileStatement:           'WhileStatement',
    WithStatement:            'WithStatement',
    YieldExpression:          'YieldExpression'
};

exports.Syntax = Syntax;

var Precedence = {
    Sequence:         0,
    Yield:            1,
    Assignment:       1,
    Conditional:      2,
    ArrowFunction:    2,
    Coalesce:         3,
    LogicalOR:        3,
    LogicalAND:       4,
    BitwiseOR:        5,
    BitwiseXOR:       6,
    BitwiseAND:       7,
    Equality:         8,
    Relational:       9,
    BitwiseSHIFT:     10,
    Additive:         11,
    Multiplicative:   12,
    Unary:            13,
    Exponentiation:   14,
    Postfix:          14,
    Await:            14,
    Call:             15,
    New:              16,
    TaggedTemplate:   17,
    OptionalChaining: 17,
    Member:           18,
    Primary:          19
};

var BinaryPrecedence = {
    '||':         Precedence.LogicalOR,
    '&&':         Precedence.LogicalAND,
    '|':          Precedence.BitwiseOR,
    '^':          Precedence.BitwiseXOR,
    '&':          Precedence.BitwiseAND,
    '==':         Precedence.Equality,
    '!=':         Precedence.Equality,
    '===':        Precedence.Equality,
    '!==':        Precedence.Equality,
    'is':         Precedence.Equality,
    'isnt':       Precedence.Equality,
    '<':          Precedence.Relational,
    '>':          Precedence.Relational,
    '<=':         Precedence.Relational,
    '>=':         Precedence.Relational,
    'in':         Precedence.Relational,
    'instanceof': Precedence.Relational,
    '<<':         Precedence.BitwiseSHIFT,
    '>>':         Precedence.BitwiseSHIFT,
    '>>>':        Precedence.BitwiseSHIFT,
    '+':          Precedence.Additive,
    '-':          Precedence.Additive,
    '*':          Precedence.Multiplicative,
    '%':          Precedence.Multiplicative,
    '/':          Precedence.Multiplicative,
    '??':         Precedence.Coalesce,
    '**':         Precedence.Exponentiation
};

function getDefaultOptions () {
    // default options
    return {
        indent:    null,
        base:      null,
        parse:     null,
        format:    {
            indent:            {
                style: '    ',
                base:  0
            },
            newline:           '\n',
            space:             ' ',
            json:              false,
            renumber:          false,
            hexadecimal:       false,
            quotes:            'single',
            escapeless:        false,
            compact:           false,
            parentheses:       true,
            semicolons:        true,
            safeConcatenation: false
        },
        directive: false,
        raw:       true,
        verbatim:  null
    };
}

//-------------------------------------------------===------------------------------------------------------
//                                            Lexical utils
//-------------------------------------------------===------------------------------------------------------

//Const
var NON_ASCII_WHITESPACES = [
    0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005,
    0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000,
    0xFEFF
];

//Regular expressions
var NON_ASCII_IDENTIFIER_CHARACTERS_REGEXP = new RegExp(
    '[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376' +
    '\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-' +
    '\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA' +
    '\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-' +
    '\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0\u08A2-\u08AC\u08E4-\u08FE\u0900-' +
    '\u0963\u0966-\u096F\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-' +
    '\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-' +
    '\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38' +
    '\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83' +
    '\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9' +
    '\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-' +
    '\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-' +
    '\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E' +
    '\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-' +
    '\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-' +
    '\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0C85-\u0C8C\u0C8E-' +
    '\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE' +
    '\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44' +
    '\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-' +
    '\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A' +
    '\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-' +
    '\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9' +
    '\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84' +
    '\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-' +
    '\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5' +
    '\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-' +
    '\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-' +
    '\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD' +
    '\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B' +
    '\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E' +
    '\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-' +
    '\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1D00-\u1DE6\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-' +
    '\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-' +
    '\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F' +
    '\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115' +
    '\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188' +
    '\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-' +
    '\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-' +
    '\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A' +
    '\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5' +
    '\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA697' +
    '\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA827\uA840-\uA873' +
    '\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-' +
    '\uA9D9\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7B\uAA80-\uAAC2\uAADB-\uAADD\uAAE0-' +
    '\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABEA\uABEC' +
    '\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-' +
    '\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D' +
    '\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74' +
    '\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-' +
    '\uFFD7\uFFDA-\uFFDC]'
);


//Methods
function isIdentifierCh (cp) {
    if (cp < 0x80) {
        return cp >= 97 && cp <= 122 ||      // a..z
               cp >= 65 && cp <= 90 ||       // A..Z
               cp >= 48 && cp <= 57 ||       // 0..9
               cp === 36 || cp === 95 ||     // $ (dollar) and _ (underscore)
               cp === 92;                    // \ (backslash)
    }

    var ch = String.fromCharCode(cp);

    return NON_ASCII_IDENTIFIER_CHARACTERS_REGEXP.test(ch);
}

function isLineTerminator (cp) {
    return cp === 0x0A || cp === 0x0D || cp === 0x2028 || cp === 0x2029;
}

function isWhitespace (cp) {
    return cp === 0x20 || cp === 0x09 || isLineTerminator(cp) || cp === 0x0B || cp === 0x0C || cp === 0xA0 ||
           (cp >= 0x1680 && NON_ASCII_WHITESPACES.indexOf(cp) >= 0);
}

function isDecimalDigit (cp) {
    return cp >= 48 && cp <= 57;
}

function stringRepeat (str, num) {
    var result = '';

    for (num |= 0; num > 0; num >>>= 1, str += str) {
        if (num & 1) {
            result += str;
        }
    }

    return result;
}

isArray = Array.isArray;
if (!isArray) {
    isArray = function isArray (array) {
        return Object.prototype.toString.call(array) === '[object Array]';
    };
}


function updateDeeply (target, override) {
    var key, val;

    function isHashObject (target) {
        return typeof target === 'object' && target instanceof Object && !(target instanceof RegExp);
    }

    for (key in override) {
        if (override.hasOwnProperty(key)) {
            val = override[key];
            if (isHashObject(val)) {
                if (isHashObject(target[key])) {
                    updateDeeply(target[key], val);
                }
                else {
                    target[key] = updateDeeply({}, val);
                }
            }
            else {
                target[key] = val;
            }
        }
    }
    return target;
}

function generateNumber (value) {
    var result, point, temp, exponent, pos;

    if (value === 1 / 0) {
        return json ? 'null' : renumber ? '1e400' : '1e+400';
    }

    result = '' + value;
    if (!renumber || result.length < 3) {
        return result;
    }

    point = result.indexOf('.');
    //NOTE: 0x30 == '0'
    if (!json && result.charCodeAt(0) === 0x30 && point === 1) {
        point  = 0;
        result = result.slice(1);
    }
    temp     = result;
    result   = result.replace('e+', 'e');
    exponent = 0;
    if ((pos = temp.indexOf('e')) > 0) {
        exponent = +temp.slice(pos + 1);
        temp     = temp.slice(0, pos);
    }
    if (point >= 0) {
        exponent -= temp.length - point - 1;
        temp = +(temp.slice(0, point) + temp.slice(point + 1)) + '';
    }
    pos = 0;

    //NOTE: 0x30 == '0'
    while (temp.charCodeAt(temp.length + pos - 1) === 0x30) {
        --pos;
    }
    if (pos !== 0) {
        exponent -= pos;
        temp = temp.slice(0, pos);
    }
    if (exponent !== 0) {
        temp += 'e' + exponent;
    }
    if ((temp.length < result.length ||
         (hexadecimal && value > 1e12 && Math.floor(value) === value &&
          (temp = '0x' + value.toString(16)).length
          < result.length)) &&
        +temp === value) {
        result = temp;
    }

    return result;
}

// Generate valid RegExp expression.
// This function is based on https://github.com/Constellation/iv Engine

function escapeRegExpCharacter (ch, previousIsBackslash) {
    // not handling '\' and handling \u2028 or \u2029 to unicode escape sequence
    if ((ch & ~1) === 0x2028) {
        return (previousIsBackslash ? 'u' : '\\u') + ((ch === 0x2028) ? '2028' : '2029');
    }
    else if (ch === 10 || ch === 13) {  // \n, \r
        return (previousIsBackslash ? '' : '\\') + ((ch === 10) ? 'n' : 'r');
    }
    return String.fromCharCode(ch);
}

function generateRegExp (reg) {
    var match, result, flags, i, iz, ch, characterInBrack, previousIsBackslash;

    result = reg.toString();

    if (reg.source) {
        // extract flag from toString result
        match = result.match(/\/([^/]*)$/);
        if (!match) {
            return result;
        }

        flags  = match[1];
        result = '';

        characterInBrack    = false;
        previousIsBackslash = false;
        for (i = 0, iz = reg.source.length; i < iz; ++i) {
            ch = reg.source.charCodeAt(i);

            if (!previousIsBackslash) {
                if (characterInBrack) {
                    if (ch === 93) {  // ]
                        characterInBrack = false;
                    }
                }
                else {
                    if (ch === 47) {  // /
                        result += '\\';
                    }
                    else if (ch === 91) {  // [
                        characterInBrack = true;
                    }
                }
                result += escapeRegExpCharacter(ch, previousIsBackslash);
                previousIsBackslash = ch === 92;  // \
            }
            else {
                // if new RegExp("\\\n') is provided, create /\n/
                result += escapeRegExpCharacter(ch, previousIsBackslash);
                // prevent like /\\[/]/
                previousIsBackslash = false;
            }
        }

        return '/' + result + '/' + flags;
    }

    return result;
}

function escapeAllowedCharacter (code, next) {
    var hex, result = '\\';

    switch (code) {
        case 0x08:          // \b
            result += 'b';
            break;
        case 0x0C:          // \f
            result += 'f';
            break;
        case 0x09:          // \t
            result += 't';
            break;
        default:
            hex = code.toString(16).toUpperCase();
            if (json || code > 0xFF) {
                result += 'u' + '0000'.slice(hex.length) + hex;
            }

            else if (code === 0x0000 && !isDecimalDigit(next)) {
                result += '0';
            }

            else if (code === 0x000B) {     // \v
                result += 'x0B';
            }

            else {
                result += 'x' + '00'.slice(hex.length) + hex;
            }
            break;
    }

    return result;
}

function escapeDisallowedCharacter (code) {
    var result = '\\';
    switch (code) {
        case 0x5C       // \
        :
            result += '\\';
            break;
        case 0x0A       // \n
        :
            result += 'n';
            break;
        case 0x0D       // \r
        :
            result += 'r';
            break;
        case 0x2028:
            result += 'u2028';
            break;
        case 0x2029:
            result += 'u2029';
            break;
    }

    return result;
}

function escapeDirective (str) {
    var i, iz, code, quote;

    quote = quotes === 'double' ? '"' : '\'';
    for (i = 0, iz = str.length; i < iz; ++i) {
        code = str.charCodeAt(i);
        if (code === 0x27) {            // '
            quote = '"';
            break;
        }
        else if (code === 0x22) {     // "
            quote = '\'';
            break;
        }
        else if (code === 0x5C) {     // \
            ++i;
        }
    }

    return quote + str + quote;
}

function escapeString (str) {
    var result = '', i, len, code, singleQuotes = 0, doubleQuotes = 0, single, quote;
    //TODO http://jsperf.com/character-counting/8
    for (i = 0, len = str.length; i < len; ++i) {
        code = str.charCodeAt(i);
        if (code === 0x27) {           // '
            ++singleQuotes;
        }
        else if (code === 0x22) { // "
            ++doubleQuotes;
        }
        else if (code === 0x2F && json) { // /
            result += '\\';
        }
        else if (isLineTerminator(code) || code === 0x5C) { // \
            result += escapeDisallowedCharacter(code);
            continue;
        }
        else if ((json && code < 0x20) ||                                     // SP
                 !(json || escapeless || (code >= 0x20 && code <= 0x7E))) {   // SP, ~
            result += escapeAllowedCharacter(code, str.charCodeAt(i + 1));
            continue;
        }
        result += String.fromCharCode(code);
    }

    single = !(quotes === 'double' || (quotes === 'auto' && doubleQuotes < singleQuotes));
    quote  = single ? '\'' : '"';

    if (!(single ? singleQuotes : doubleQuotes)) {
        return quote + result + quote;
    }

    str    = result;
    result = quote;

    for (i = 0, len = str.length; i < len; ++i) {
        code = str.charCodeAt(i);
        if ((code === 0x27 && single) || (code === 0x22 && !single)) {    // ', "
            result += '\\';
        }
        result += String.fromCharCode(code);
    }

    return result + quote;
}


function join (l, r) {
    if (!l.length)
        return r;

    if (!r.length)
        return l;

    var lCp = l.charCodeAt(l.length - 1),
        rCp = r.charCodeAt(0);

    if (isIdentifierCh(lCp) && isIdentifierCh(rCp) ||
        lCp === rCp && (lCp === 0x2B || lCp === 0x2D) ||   // + +, - -
        lCp === 0x2F && rCp === 0x69) {                    // /re/ instanceof foo
        return l + _.space + r;
    }

    else if (isWhitespace(lCp) || isWhitespace(rCp))
        return l + r;

    return l + _.optSpace + r;
}

function shiftIndent () {
    var prevIndent = _.indent;

    _.indent += _.indentUnit;
    return prevIndent;
}

function adoptionPrefix ($stmt) {
    if ($stmt.type === Syntax.BlockStatement)
        return _.optSpace;

    if ($stmt.type === Syntax.EmptyStatement)
        return '';

    return _.newline + _.indent + _.indentUnit;
}

function adoptionSuffix ($stmt) {
    if ($stmt.type === Syntax.BlockStatement)
        return _.optSpace;

    return _.newline + _.indent;
}

//Subentities generators
function generateVerbatim ($expr, settings) {
    var verbatim     = $expr[extra.verbatim],
        strVerbatim  = typeof verbatim === 'string',
        precedence   = !strVerbatim &&
                       verbatim.precedence !== void 0 ? verbatim.precedence : Precedence.Sequence,
        parenthesize = precedence < settings.precedence,
        content      = strVerbatim ? verbatim : verbatim.content,
        chunks       = content.split(/\r\n|\n/),
        chunkCount   = chunks.length;

    if (parenthesize)
        _.js += '(';

    _.js += chunks[0];

    for (var i = 1; i < chunkCount; i++)
        _.js += _.newline + _.indent + chunks[i];

    if (parenthesize)
        _.js += ')';
}

function generateFunctionParams ($node) {
    var $params                     = $node.params,
        paramCount                  = $params.length,
        lastParamIdx                = paramCount - 1,
        arrowFuncWithoutParentheses = $node.type === Syntax.ArrowFunctionExpression && paramCount === 1 &&
                                      $params[0].type === Syntax.Identifier;

    //NOTE: arg => { } case
    if (arrowFuncWithoutParentheses)
        _.js += $params[0].name;

    else {
        _.js += '(';

        for (var i = 0; i < paramCount; ++i) {
            var $param = $params[i];

            if ($params[i].type === Syntax.Identifier)
                _.js += $param.name;

            else
                ExprGen[$param.type]($param, Preset.e4);

            if (i !== lastParamIdx)
                _.js += ',' + _.optSpace;
        }

        _.js += ')';
    }
}

function generateFunctionBody ($node) {
    var $body = $node.body;

    generateFunctionParams($node);

    if ($node.type === Syntax.ArrowFunctionExpression)
        _.js += _.optSpace + '=>';

    if ($node.expression) {
        _.js += _.optSpace;

        var exprJs = exprToJs($body, Preset.e4);

        if (exprJs.charAt(0) === '{')
            exprJs = '(' + exprJs + ')';

        _.js += exprJs;
    }

    else {
        _.js += adoptionPrefix($body);
        StmtGen[$body.type]($body, Preset.s8);
    }
}


//-------------------------------------------------===------------------------------------------------------
//                                Syntactic entities generation presets
//-------------------------------------------------===------------------------------------------------------

var Preset = {
    e1: function (allowIn) {
        return {
            precedence:              Precedence.Assignment,
            allowIn:                 allowIn,
            allowCall:               true,
            allowUnparenthesizedNew: true
        };
    },

    e2: function (allowIn) {
        return {
            precedence:              Precedence.LogicalOR,
            allowIn:                 allowIn,
            allowCall:               true,
            allowUnparenthesizedNew: true
        };
    },

    e3: {
        precedence:              Precedence.Call,
        allowIn:                 true,
        allowCall:               true,
        allowUnparenthesizedNew: false
    },

    e4: {
        precedence:              Precedence.Assignment,
        allowIn:                 true,
        allowCall:               true,
        allowUnparenthesizedNew: true
    },

    e5: {
        precedence:              Precedence.Sequence,
        allowIn:                 true,
        allowCall:               true,
        allowUnparenthesizedNew: true
    },

    e6: function (allowUnparenthesizedNew) {
        return {
            precedence:              Precedence.New,
            allowIn:                 true,
            allowCall:               false,
            allowUnparenthesizedNew: allowUnparenthesizedNew
        };
    },

    e7: {
        precedence:              Precedence.Unary,
        allowIn:                 true,
        allowCall:               true,
        allowUnparenthesizedNew: true
    },

    e8: {
        precedence:              Precedence.Postfix,
        allowIn:                 true,
        allowCall:               true,
        allowUnparenthesizedNew: true
    },

    e9: {
        precedence:              void 0,
        allowIn:                 true,
        allowCall:               true,
        allowUnparenthesizedNew: true
    },

    e10: {
        precedence:              Precedence.Call,
        allowIn:                 true,
        allowCall:               true,
        allowUnparenthesizedNew: true
    },

    e11: function (allowCall) {
        return {
            precedence:              Precedence.Call,
            allowIn:                 true,
            allowCall:               allowCall,
            allowUnparenthesizedNew: false
        };
    },

    e12: {
        precedence:              Precedence.Primary,
        allowIn:                 false,
        allowCall:               false,
        allowUnparenthesizedNew: true
    },

    e13: {
        precedence:              Precedence.Primary,
        allowIn:                 true,
        allowCall:               true,
        allowUnparenthesizedNew: true
    },


    e14: {
        precedence:              Precedence.Sequence,
        allowIn:                 false,
        allowCall:               true,
        allowUnparenthesizedNew: true
    },


    e15: function (allowCall) {
        return {
            precedence:              Precedence.Sequence,
            allowIn:                 true,
            allowCall:               allowCall,
            allowUnparenthesizedNew: true
        };
    },

    e16: function (precedence, allowIn) {
        return {
            precedence:              precedence,
            allowIn:                 allowIn,
            allowCall:               true,
            allowUnparenthesizedNew: true
        };
    },

    e17: function (allowIn) {
        return {
            precedence:              Precedence.Call,
            allowIn:                 allowIn,
            allowCall:               true,
            allowUnparenthesizedNew: true
        }
    },

    e18: function (allowIn) {
        return {
            precedence:              Precedence.Assignment,
            allowIn:                 allowIn,
            allowCall:               true,
            allowUnparenthesizedNew: true
        }
    },

    e19: {
        precedence:        Precedence.Sequence,
        allowIn:           true,
        allowCall:         true,
        semicolonOptional: false
    },

    e20: {
        precedence: Precedence.Await,
        allowCall:  true
    },

    s1: function (functionBody, semicolonOptional) {
        return {
            allowIn:           true,
            functionBody:      false,
            directiveContext:  functionBody,
            semicolonOptional: semicolonOptional
        };
    },

    s2: {
        allowIn:           true,
        functionBody:      false,
        directiveContext:  false,
        semicolonOptional: true
    },

    s3: function (allowIn) {
        return {
            allowIn:           allowIn,
            functionBody:      false,
            directiveContext:  false,
            semicolonOptional: false
        };
    },

    s4: function (semicolonOptional) {
        return {
            allowIn:           true,
            functionBody:      false,
            directiveContext:  false,
            semicolonOptional: semicolonOptional
        };
    },

    s5: function (semicolonOptional) {
        return {
            allowIn:           true,
            functionBody:      false,
            directiveContext:  true,
            semicolonOptional: semicolonOptional,
        };
    },

    s6: {
        allowIn:           false,
        functionBody:      false,
        directiveContext:  false,
        semicolonOptional: false
    },

    s7: {
        allowIn:           true,
        functionBody:      false,
        directiveContext:  false,
        semicolonOptional: false
    },

    s8: {
        allowIn:           true,
        functionBody:      true,
        directiveContext:  false,
        semicolonOptional: false
    }
};


//-------------------------------------------------===-------------------------------------------------------
//                                             Expressions
//-------------------------------------------------===-------------------------------------------------------

//Regular expressions
var FLOATING_OR_OCTAL_REGEXP  = /[.eExX]|^0[0-9]+/,
    LAST_DECIMAL_DIGIT_REGEXP = /[0-9]$/;


//Common expression generators
function isLogicalExpression(node) {
    if (!node)
        return false;

    return node.type === Syntax.LogicalExpression;
}

function needParensForLogicalExpression (node, parent) {
    switch (node.operator) {
        case "||":
            if (!isLogicalExpression(parent)) return false;
            return parent.operator === "??" || parent.operator === "&&";

        case "&&":
            return isLogicalExpression(parent, {
                operator: "??"
            });

        case "??":
            return isLogicalExpression(parent) && parent.operator !== "??";
    }
}

function generateLogicalOrBinaryExpression ($expr, settings, $parent) {
    var op                 = $expr.operator,
        precedence         = BinaryPrecedence[$expr.operator],
        parenthesize       = precedence < settings.precedence,
        allowIn            = settings.allowIn || parenthesize,
        operandGenSettings = Preset.e16(precedence, allowIn),
        exprJs             = exprToJs($expr.left, operandGenSettings, $expr);

    parenthesize |= op === 'in' && !allowIn;

    var needParens = needParensForLogicalExpression($expr, $parent);

    if (parenthesize || needParens)
        _.js += '(';

    // 0x2F = '/'
    if (exprJs.charCodeAt(exprJs.length - 1) === 0x2F && isIdentifierCh(op.charCodeAt(0)))
        exprJs = exprJs + _.space + op;

    else
        exprJs = join(exprJs, op);

    operandGenSettings.precedence++;

    var rightJs = exprToJs($expr.right, operandGenSettings);

    //NOTE: If '/' concats with '/' or `<` concats with `!--`, it is interpreted as comment start
    if (op === '/' && rightJs.charAt(0) === '/' || op.slice(-1) === '<' && rightJs.slice(0, 3) === '!--')
        exprJs += _.space + rightJs;

    else
        exprJs = join(exprJs, rightJs);

    _.js += exprJs;

    if (parenthesize || needParens)
        _.js += ')';
}

function generateArrayPatternOrExpression ($expr) {
    var $elems    = $expr.elements,
        elemCount = $elems.length;

    if (elemCount) {
        var lastElemIdx = elemCount - 1,
            multiline   = elemCount > 1,
            prevIndent  = shiftIndent(),
            itemPrefix  = _.newline + _.indent;

        _.js += '[';

        for (var i = 0; i < elemCount; i++) {
            var $elem = $elems[i];

            if (multiline)
                _.js += itemPrefix;

            if ($elem)
                ExprGen[$elem.type]($elem, Preset.e4);

            if (i !== lastElemIdx || !$elem)
                _.js += ',';
        }

        _.indent = prevIndent;

        if (multiline)
            _.js += _.newline + _.indent;

        _.js += ']';
    }

    else
        _.js += '[]';
}

function generateGeneratorOrComprehensionExpression ($expr) {
    //NOTE: GeneratorExpression should be parenthesized with (...), ComprehensionExpression with [...]
    var $blocks     = $expr.blocks,
        $filter     = $expr.filter,
        isGenerator = $expr.type === Syntax.GeneratorExpression,
        exprJs      = isGenerator ? '(' : '[',
        bodyJs      = exprToJs($expr.body, Preset.e4);

    if ($blocks) {
        var prevIndent = shiftIndent(),
            blockCount = $blocks.length;

        for (var i = 0; i < blockCount; ++i) {
            var blockJs = exprToJs($blocks[i], Preset.e5);

            exprJs = i > 0 ? join(exprJs, blockJs) : (exprJs + blockJs);
        }

        _.indent = prevIndent;
    }

    if ($filter) {
        var filterJs = exprToJs($filter, Preset.e5);

        exprJs = join(exprJs, 'if' + _.optSpace);
        exprJs = join(exprJs, '(' + filterJs + ')');
    }

    exprJs = join(exprJs, bodyJs);
    exprJs += isGenerator ? ')' : ']';

    _.js += exprJs;
}


//Expression raw generator dictionary
var ExprRawGen = {
    SequenceExpression: function generateSequenceExpression ($expr, settings) {
        var $children       = $expr.expressions,
            childrenCount   = $children.length,
            lastChildIdx    = childrenCount - 1,
            parenthesize    = Precedence.Sequence < settings.precedence,
            exprGenSettings = Preset.e1(settings.allowIn || parenthesize);

        if (parenthesize)
            _.js += '(';

        for (var i = 0; i < childrenCount; i++) {
            var $child = $children[i];

            ExprGen[$child.type]($child, exprGenSettings);

            if (i !== lastChildIdx)
                _.js += ',' + _.optSpace;
        }

        if (parenthesize)
            _.js += ')';
    },

    AssignmentExpression: function generateAssignmentExpression ($expr, settings) {
        var $left        = $expr.left,
            $right       = $expr.right,
            parenthesize = Precedence.Assignment < settings.precedence,
            allowIn      = settings.allowIn || parenthesize;

        if (parenthesize)
            _.js += '(';

        ExprGen[$left.type]($left, Preset.e17(allowIn));
        _.js += _.optSpace + $expr.operator + _.optSpace;
        ExprGen[$right.type]($right, Preset.e18(allowIn));

        if (parenthesize)
            _.js += ')';
    },

    AssignmentPattern: function generateAssignmentPattern ($node) {
        var $fakeAssign = {
            left:     $node.left,
            right:    $node.right,
            operator: '='
        };

        ExprGen.AssignmentExpression($fakeAssign, Preset.e4);
    },

    ArrowFunctionExpression: function generateArrowFunctionExpression ($expr, settings) {
        var parenthesize = Precedence.ArrowFunction < settings.precedence;

        if (parenthesize)
            _.js += '(';

        if ($expr.async)
            _.js += 'async ';

        generateFunctionBody($expr);

        if (parenthesize)
            _.js += ')';
    },

    AwaitExpression: function generateAwaitExpression ($expr, settings) {
        var parenthesize = Precedence.Await < settings.precedence;

        if (parenthesize)
            _.js += '(';

        _.js += $expr.all ? 'await* ' : 'await ';

        ExprGen[$expr.argument.type]($expr.argument, Preset.e20);

        if (parenthesize)
            _.js += ')';
    },

    ConditionalExpression: function generateConditionalExpression ($expr, settings) {
        var $test             = $expr.test,
            $conseq           = $expr.consequent,
            $alt              = $expr.alternate,
            parenthesize      = Precedence.Conditional < settings.precedence,
            allowIn           = settings.allowIn || parenthesize,
            testGenSettings   = Preset.e2(allowIn),
            branchGenSettings = Preset.e1(allowIn);

        if (parenthesize)
            _.js += '(';

        ExprGen[$test.type]($test, testGenSettings);
        _.js += _.optSpace + '?' + _.optSpace;
        ExprGen[$conseq.type]($conseq, branchGenSettings);
        _.js += _.optSpace + ':' + _.optSpace;
        ExprGen[$alt.type]($alt, branchGenSettings);

        if (parenthesize)
            _.js += ')';
    },

    LogicalExpression: generateLogicalOrBinaryExpression,

    BinaryExpression: generateLogicalOrBinaryExpression,

    CallExpression: function generateCallExpression ($expr, settings) {
        var $callee      = $expr.callee,
            $args        = $expr['arguments'],
            argCount     = $args.length,
            lastArgIdx   = argCount - 1,
            parenthesize = !settings.allowCall || Precedence.Call < settings.precedence;

        if (parenthesize)
            _.js += '(';

        ExprGen[$callee.type]($callee, Preset.e3);

        if ($expr.optional)
            _.js += '?.';

        _.js += '(';

        for (var i = 0; i < argCount; ++i) {
            var $arg = $args[i];

            ExprGen[$arg.type]($arg, Preset.e4);

            if (i !== lastArgIdx)
                _.js += ',' + _.optSpace;
        }

        _.js += ')';

        if (parenthesize)
            _.js += ')';
    },

    NewExpression: function generateNewExpression ($expr, settings) {
        var $args        = $expr['arguments'],
            parenthesize = Precedence.New < settings.precedence,
            argCount     = $args.length,
            lastArgIdx   = argCount - 1,
            withCall     = !settings.allowUnparenthesizedNew || parentheses || argCount > 0,
            calleeJs     = exprToJs($expr.callee, Preset.e6(!withCall));

        if (parenthesize)
            _.js += '(';

        _.js += join('new', calleeJs);

        if (withCall) {
            _.js += '(';

            for (var i = 0; i < argCount; ++i) {
                var $arg = $args[i];

                ExprGen[$arg.type]($arg, Preset.e4);

                if (i !== lastArgIdx)
                    _.js += ',' + _.optSpace;
            }

            _.js += ')';
        }

        if (parenthesize)
            _.js += ')';
    },

    MemberExpression: function generateMemberExpression ($expr, settings) {
        var $obj         = $expr.object,
            $prop        = $expr.property,
            parenthesize = Precedence.Member < settings.precedence,
            isNumObj     = !$expr.computed && $obj.type === Syntax.Literal && typeof $obj.value === 'number';

        if (parenthesize)
            _.js += '(';

        if (isNumObj) {

            //NOTE: When the following conditions are all true:
            //   1. No floating point
            //   2. Don't have exponents
            //   3. The last character is a decimal digit
            //   4. Not hexadecimal OR octal number literal
            // then we should add a floating point.

            var numJs     = exprToJs($obj, Preset.e11(settings.allowCall)),
                withPoint = LAST_DECIMAL_DIGIT_REGEXP.test(numJs) && !FLOATING_OR_OCTAL_REGEXP.test(numJs);

            _.js += withPoint ? (numJs + '.') : numJs;
        }

        else
            ExprGen[$obj.type]($obj, Preset.e11(settings.allowCall));

        if ($expr.computed) {
            if ($expr.optional)
                _.js += '?.';

            _.js += '[';
            ExprGen[$prop.type]($prop, Preset.e15(settings.allowCall));
            _.js += ']';
        }

        else
            _.js += ($expr.optional ? '?.' : '.') + $prop.name;

        if (parenthesize)
            _.js += ')';
    },

    UnaryExpression: function generateUnaryExpression ($expr, settings) {
        var parenthesize = Precedence.Unary < settings.precedence,
            op           = $expr.operator,
            argJs        = exprToJs($expr.argument, Preset.e7);

        if (parenthesize)
            _.js += '(';

        //NOTE: delete, void, typeof
        // get `typeof []`, not `typeof[]`
        if (_.optSpace === '' || op.length > 2)
            _.js += join(op, argJs);

        else {
            _.js += op;

            //NOTE: Prevent inserting spaces between operator and argument if it is unnecessary
            // like, `!cond`
            var leftCp  = op.charCodeAt(op.length - 1),
                rightCp = argJs.charCodeAt(0);

            // 0x2B = '+', 0x2D =  '-'
            if (leftCp === rightCp && (leftCp === 0x2B || leftCp === 0x2D) ||
                isIdentifierCh(leftCp) && isIdentifierCh(rightCp)) {
                _.js += _.space;
            }

            _.js += argJs;
        }

        if (parenthesize)
            _.js += ')';
    },

    YieldExpression: function generateYieldExpression ($expr, settings) {
        var $arg         = $expr.argument,
            js           = $expr.delegate ? 'yield*' : 'yield',
            parenthesize = Precedence.Yield < settings.precedence;

        if (parenthesize)
            _.js += '(';

        if ($arg) {
            var argJs = exprToJs($arg, Preset.e4);

            js = join(js, argJs);
        }

        _.js += js;

        if (parenthesize)
            _.js += ')';
    },

    UpdateExpression: function generateUpdateExpression ($expr, settings) {
        var $arg         = $expr.argument,
            $op          = $expr.operator,
            prefix       = $expr.prefix,
            precedence   = prefix ? Precedence.Unary : Precedence.Postfix,
            parenthesize = precedence < settings.precedence;

        if (parenthesize)
            _.js += '(';

        if (prefix) {
            _.js += $op;
            ExprGen[$arg.type]($arg, Preset.e8);

        }

        else {
            ExprGen[$arg.type]($arg, Preset.e8);
            _.js += $op;
        }

        if (parenthesize)
            _.js += ')';
    },

    FunctionExpression: function generateFunctionExpression ($expr) {
        var isGenerator = !!$expr.generator;

        if ($expr.async)
            _.js += 'async ';

        _.js += isGenerator ? 'function*' : 'function';

        if ($expr.id) {
            _.js += isGenerator ? _.optSpace : _.space;
            _.js += $expr.id.name;
        }
        else
            _.js += _.optSpace;

        generateFunctionBody($expr);
    },

    ExportBatchSpecifier: function generateExportBatchSpecifier () {
        _.js += '*';
    },

    ArrayPattern: generateArrayPatternOrExpression,

    ArrayExpression: generateArrayPatternOrExpression,

    ClassExpression: function generateClassExpression ($expr) {
        var $id    = $expr.id,
            $super = $expr.superClass,
            $body  = $expr.body,
            exprJs = 'class';

        if ($id) {
            var idJs = exprToJs($id, Preset.e9);

            exprJs = join(exprJs, idJs);
        }

        if ($super) {
            var superJs = exprToJs($super, Preset.e4);

            superJs = join('extends', superJs);
            exprJs  = join(exprJs, superJs);
        }

        _.js += exprJs + _.optSpace;
        StmtGen[$body.type]($body, Preset.s2);
    },

    MetaProperty: function generateMetaProperty ($expr, settings) {
        var $meta        = $expr.meta,
            $property    = $expr.property,
            parenthesize = Precedence.Member < settings.precedence;

        if (parenthesize)
            _.js += '(';

        _.js += (typeof $meta === "string" ? $meta : $meta.name) +
            '.' + (typeof $property === "string" ? $property : $property.name);

        if (parenthesize)
            _.js += ')';
    },

    MethodDefinition: function generateMethodDefinition ($expr) {
        var exprJs = $expr['static'] ? 'static' + _.optSpace : '',
            keyJs  = exprToJs($expr.key, Preset.e5);

        if ($expr.computed)
            keyJs = '[' + keyJs + ']';

        if ($expr.kind === 'get' || $expr.kind === 'set') {
            keyJs = join($expr.kind, keyJs);
            _.js += join(exprJs, keyJs);
        }

        else {
            if ($expr.value.generator)
                _.js += exprJs + '*' + keyJs;
            else if ($expr.value.async)
                _.js += exprJs + 'async ' + keyJs;
            else
                _.js += join(exprJs, keyJs);
        }

        generateFunctionBody($expr.value);
    },

    Property: function generateProperty ($expr) {
        var $val  = $expr.value,
            $kind = $expr.kind,
            keyJs = exprToJs($expr.key, Preset.e4);

        if ($expr.computed)
            keyJs = '[' + keyJs + ']';

        if ($kind === 'get' || $kind === 'set') {
            _.js += $kind + _.space + keyJs;
            generateFunctionBody($val);
        }

        else {
            if ($expr.shorthand)
                _.js += keyJs;

            else if ($expr.method) {
                if ($val.generator)
                    keyJs = '*' + keyJs;
                else if ($val.async)
                    keyJs = 'async ' + keyJs;

                _.js += keyJs;
                generateFunctionBody($val)
            }

            else {
                _.js += keyJs + ':' + _.optSpace;
                ExprGen[$val.type]($val, Preset.e4);
            }
        }
    },

    ObjectExpression: function generateObjectExpression ($expr) {
        var $props    = $expr.properties,
            propCount = $props.length;

        if (propCount) {
            var lastPropIdx = propCount - 1,
                prevIndent  = shiftIndent();

            _.js += '{';

            for (var i = 0; i < propCount; i++) {
                var $prop    = $props[i],
                    propType = $prop.type || Syntax.Property;

                _.js += _.newline + _.indent;
                ExprGen[propType]($prop, Preset.e5);

                if (i !== lastPropIdx)
                    _.js += ',';
            }

            _.indent = prevIndent;
            _.js += _.newline + _.indent + '}';
        }

        else
            _.js += '{}';
    },

    ObjectPattern: function generateObjectPattern ($expr) {
        var $props    = $expr.properties,
            propCount = $props.length;

        if (propCount) {
            var lastPropIdx = propCount - 1,
                multiline   = false;

            if (propCount === 1)
                multiline = $props[0].value.type !== Syntax.Identifier;

            else {
                for (var i = 0; i < propCount; i++) {
                    if (!$props[i].shorthand) {
                        multiline = true;
                        break;
                    }
                }
            }

            _.js += multiline ? ('{' + _.newline) : '{';

            var prevIndent = shiftIndent(),
                propSuffix = ',' + (multiline ? _.newline : _.optSpace);

            for (var i = 0; i < propCount; i++) {
                var $prop = $props[i];

                if (multiline)
                    _.js += _.indent;

                ExprGen[$prop.type]($prop, Preset.e5);

                if (i !== lastPropIdx)
                    _.js += propSuffix;
            }

            _.indent = prevIndent;
            _.js += multiline ? (_.newline + _.indent + '}') : '}';
        }
        else
            _.js += '{}';
    },

    ThisExpression: function generateThisExpression () {
        _.js += 'this';
    },

    Identifier: function generateIdentifier ($expr, precedence, flag) {
        _.js += $expr.name;
    },

    ImportExpression: function generateImportExpression ($expr, settings) {
        var parenthesize = Precedence.Call < settings.precedence;
        var $source      = $expr.source;

        if (parenthesize)
            _.js += '(';

        _.js += 'import(';

        ExprGen[$source.type]($source, Preset.e4);

        _.js += ')';

        if (parenthesize)
            _.js += ')';
    },

    ImportSpecifier: function generateImportSpecifier ($expr) {
        _.js += $expr.imported.name;

        if ($expr.local)
            _.js += _.space + 'as' + _.space + $expr.local.name;
    },

    ExportSpecifier: function generateImportOrExportSpecifier ($expr) {
        _.js += $expr.local.name;

        if ($expr.exported)
            _.js += _.space + 'as' + _.space + $expr.exported.name;
    },

    ChainExpression: function generateChainExpression ($expr, settings) {
        var parenthesize = Precedence.OptionalChaining < settings.precedence;
        var $expression  = $expr.expression;

        settings = settings || {};

        var newSettings  = {
            precedence: Precedence.OptionalChaining,
            allowIn:    settings.allowIn ,
            allowCall:  settings.allowCall,

            allowUnparenthesizedNew: settings.allowUnparenthesizedNew
        }

        if (parenthesize) {
            newSettings.allowCall = true;
            _.js += '(';
        }

        ExprGen[$expression.type]($expression, newSettings);

        if (parenthesize)
            _.js += ')';
    },

    Literal: function generateLiteral ($expr) {
        if (extra.raw && $expr.raw !== void 0)
            _.js += $expr.raw;

        else if ($expr.value === null)
            _.js += 'null';

        else {
            var valueType = typeof $expr.value;

            if (valueType === 'string')
                _.js += escapeString($expr.value);

            else if (valueType === 'number')
                _.js += generateNumber($expr.value);

            else if (valueType === 'boolean')
                _.js += $expr.value ? 'true' : 'false';

            else
                _.js += generateRegExp($expr.value);
        }
    },

    GeneratorExpression: generateGeneratorOrComprehensionExpression,

    ComprehensionExpression: generateGeneratorOrComprehensionExpression,

    ComprehensionBlock: function generateComprehensionBlock ($expr) {
        var $left   = $expr.left,
            leftJs  = void 0,
            rightJs = exprToJs($expr.right, Preset.e5);

        if ($left.type === Syntax.VariableDeclaration)
            leftJs = $left.kind + _.space + stmtToJs($left.declarations[0], Preset.s6);

        else
            leftJs = exprToJs($left, Preset.e10);

        leftJs = join(leftJs, $expr.of ? 'of' : 'in');

        _.js += 'for' + _.optSpace + '(' + join(leftJs, rightJs) + ')';
    },

    RestElement: function generateRestElement ($node) {
        _.js += '...' + $node.argument.name;
    },

    SpreadElement: function generateSpreadElement ($expr) {
        var $arg = $expr.argument;

        _.js += '...';
        ExprGen[$arg.type]($arg, Preset.e4);
    },

    TaggedTemplateExpression: function generateTaggedTemplateExpression ($expr, settings) {
        var $tag         = $expr.tag,
            $quasi       = $expr.quasi,
            parenthesize = Precedence.TaggedTemplate < settings.precedence;

        if (parenthesize)
            _.js += '(';

        ExprGen[$tag.type]($tag, Preset.e11(settings.allowCall));
        ExprGen[$quasi.type]($quasi, Preset.e12);

        if (parenthesize)
            _.js += ')';
    },

    TemplateElement: function generateTemplateElement ($expr) {
        //NOTE: Don't use "cooked". Since tagged template can use raw template
        // representation. So if we do so, it breaks the script semantics.
        _.js += $expr.value.raw;
    },

    TemplateLiteral: function generateTemplateLiteral ($expr) {
        var $quasis      = $expr.quasis,
            $childExprs  = $expr.expressions,
            quasiCount   = $quasis.length,
            lastQuasiIdx = quasiCount - 1;

        _.js += '`';

        for (var i = 0; i < quasiCount; ++i) {
            var $quasi = $quasis[i];

            ExprGen[$quasi.type]($quasi, Preset.e13);

            if (i !== lastQuasiIdx) {
                var $childExpr = $childExprs[i];

                _.js += '${' + _.optSpace;
                ExprGen[$childExpr.type]($childExpr, Preset.e5);
                _.js += _.optSpace + '}';
            }
        }

        _.js += '`';
    },

    Super: function generateSuper () {
        _.js += 'super';
    }
};


//-------------------------------------------------===------------------------------------------------------
//                                              Statements
//-------------------------------------------------===------------------------------------------------------


//Regular expressions
var EXPR_STMT_UNALLOWED_EXPR_REGEXP = /^{|^class(?:\s|{)|^(async )?function(?:\s|\*|\()/;


//Common statement generators
function generateTryStatementHandlers (stmtJs, $finalizer, handlers) {
    var handlerCount   = handlers.length,
        lastHandlerIdx = handlerCount - 1;

    for (var i = 0; i < handlerCount; ++i) {
        var handlerJs = stmtToJs(handlers[i], Preset.s7);

        stmtJs = join(stmtJs, handlerJs);

        if ($finalizer || i !== lastHandlerIdx)
            stmtJs += adoptionSuffix(handlers[i].body);
    }

    return stmtJs;
}

function generateForStatementIterator ($op, $stmt, settings) {
    var $body                 = $stmt.body,
        $left                 = $stmt.left,
        bodySemicolonOptional = !semicolons && settings.semicolonOptional,
        prevIndent1           = shiftIndent(),
        awaitStr              = $stmt.await ? ' await' : '',
        stmtJs                = 'for' + awaitStr + _.optSpace + '(';

    if ($left.type === Syntax.VariableDeclaration) {
        var prevIndent2 = shiftIndent();

        stmtJs += $left.kind + _.space + stmtToJs($left.declarations[0], Preset.s6);
        _.indent = prevIndent2;
    }

    else
        stmtJs += exprToJs($left, Preset.e10);

    stmtJs = join(stmtJs, $op);

    var rightJs = exprToJs($stmt.right, Preset.e4);

    stmtJs = join(stmtJs, rightJs) + ')';

    _.indent = prevIndent1;

    _.js += stmtJs + adoptionPrefix($body);
    StmtGen[$body.type]($body, Preset.s4(bodySemicolonOptional));
}


//Statement generator dictionary
var StmtRawGen = {
    BlockStatement: function generateBlockStatement ($stmt, settings) {
        var $body      = $stmt.body,
            len        = $body.length,
            lastIdx    = len - 1,
            prevIndent = shiftIndent();

        _.js += '{' + _.newline;

        for (var i = 0; i < len; i++) {
            var $item = $body[i];

            _.js += _.indent;
            StmtGen[$item.type]($item, Preset.s1(settings.functionBody, i === lastIdx));
            _.js += _.newline;
        }

        _.indent = prevIndent;
        _.js += _.indent + '}';
    },

    BreakStatement: function generateBreakStatement ($stmt, settings) {
        if ($stmt.label)
            _.js += 'break ' + $stmt.label.name;

        else
            _.js += 'break';

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';
    },

    ContinueStatement: function generateContinueStatement ($stmt, settings) {
        if ($stmt.label)
            _.js += 'continue ' + $stmt.label.name;

        else
            _.js += 'continue';

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';
    },

    ClassBody: function generateClassBody ($stmt) {
        var $body       = $stmt.body,
            itemCount   = $body.length,
            lastItemIdx = itemCount - 1,
            prevIndent  = shiftIndent();

        _.js += '{' + _.newline;

        for (var i = 0; i < itemCount; i++) {
            var $item    = $body[i],
                itemType = $item.type || Syntax.Property;

            _.js += _.indent;
            ExprGen[itemType]($item, Preset.e5);

            if (i !== lastItemIdx)
                _.js += _.newline;
        }

        _.indent = prevIndent;
        _.js += _.newline + _.indent + '}';
    },

    ClassDeclaration: function generateClassDeclaration ($stmt) {
        var $body  = $stmt.body,
            $super = $stmt.superClass,
            js     = 'class ' + $stmt.id.name;

        if ($super) {
            var superJs = exprToJs($super, Preset.e4);

            js += _.space + join('extends', superJs);
        }

        _.js += js + _.optSpace;
        StmtGen[$body.type]($body, Preset.s2);
    },

    DirectiveStatement: function generateDirectiveStatement ($stmt, settings) {
        if (extra.raw && $stmt.raw)
            _.js += $stmt.raw;

        else
            _.js += escapeDirective($stmt.directive);

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';
    },

    DoWhileStatement: function generateDoWhileStatement ($stmt, settings) {
        var $body  = $stmt.body,
            $test  = $stmt.test,
            bodyJs = adoptionPrefix($body) +
                     stmtToJs($body, Preset.s7) +
                     adoptionSuffix($body);

        //NOTE: Because `do 42 while (cond)` is Syntax Error. We need semicolon.
        var stmtJs = join('do', bodyJs);

        _.js += join(stmtJs, 'while' + _.optSpace + '(');
        ExprGen[$test.type]($test, Preset.e5);
        _.js += ')';

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';
    },

    CatchClause: function generateCatchClause ($stmt) {
        var $param     = $stmt.param,
            $guard     = $stmt.guard,
            $body      = $stmt.body,
            prevIndent = shiftIndent();

        _.js += 'catch' + _.optSpace;

        if ($param) {
           _.js += '(';
           ExprGen[$param.type]($param, Preset.e5);
        }

        if ($guard) {
            _.js += ' if ';
            ExprGen[$guard.type]($guard, Preset.e5);
        }

        _.indent = prevIndent;
        if ($param) {
           _.js += ')';
        }

        _.js += adoptionPrefix($body);
        StmtGen[$body.type]($body, Preset.s7);
    },

    DebuggerStatement: function generateDebuggerStatement ($stmt, settings) {
        _.js += 'debugger';

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';
    },

    EmptyStatement: function generateEmptyStatement () {
        _.js += ';';
    },

    ExportAllDeclaration: function ($stmt, settings) {
        StmtRawGen.ExportDeclaration($stmt, settings, true);
    },

    ExportDeclaration: function generateExportDeclaration ($stmt, settings, exportAll) {
        var $specs        = $stmt.specifiers,
            $decl         = $stmt.declaration,
            withSemicolon = semicolons || !settings.semicolonOptional;

        // export default AssignmentExpression[In] ;
        if ($stmt['default']) {
            var declJs = exprToJs($decl, Preset.e4);

            _.js += join('export default', declJs);

            if (withSemicolon)
                _.js += ';';
        }

        // export * FromClause ;
        // export ExportClause[NoReference] FromClause ;
        // export ExportClause ;
        else if ($specs || exportAll) {
            var stmtJs = 'export';

            if (exportAll)
                stmtJs += _.optSpace + '*';

            else if ($specs.length === 0)
                stmtJs += _.optSpace + '{' + _.optSpace + '}';

            else if ($specs[0].type === Syntax.ExportBatchSpecifier) {
                var specJs = exprToJs($specs[0], Preset.e5);

                stmtJs = join(stmtJs, specJs);
            }

            else {
                var prevIndent  = shiftIndent(),
                    specCount   = $specs.length,
                    lastSpecIdx = specCount - 1;

                stmtJs += _.optSpace + '{';

                for (var i = 0; i < specCount; ++i) {
                    stmtJs += _.newline + _.indent;
                    stmtJs += exprToJs($specs[i], Preset.e5);

                    if (i !== lastSpecIdx)
                        stmtJs += ',';
                }

                _.indent = prevIndent;
                stmtJs += _.newline + _.indent + '}';
            }

            if ($stmt.source) {
                _.js += join(stmtJs, 'from' + _.optSpace);
                ExprGen.Literal($stmt.source);
            }

            else
                _.js += stmtJs;

            if (withSemicolon)
                _.js += ';';
        }

        // export VariableStatement
        // export Declaration[Default]
        else if ($decl) {
            var declJs = stmtToJs($decl, Preset.s4(!withSemicolon));

            _.js += join('export', declJs);
        }
    },

    ExportNamedDeclaration: function ($stmt, settings) {
        StmtRawGen.ExportDeclaration($stmt, settings);
    },

    ExpressionStatement: function generateExpressionStatement ($stmt, settings) {
        var exprJs       = exprToJs($stmt.expression, Preset.e5),
            parenthesize = EXPR_STMT_UNALLOWED_EXPR_REGEXP.test(exprJs) ||
                           (directive &&
                            settings.directiveContext &&
                            $stmt.expression.type === Syntax.Literal &&
                            typeof $stmt.expression.value === 'string');

        //NOTE: '{', 'function', 'class' are not allowed in expression statement.
        // Therefore, they should be parenthesized.
        if (parenthesize)
            _.js += '(' + exprJs + ')';

        else
            _.js += exprJs;

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';
    },

    ImportDeclaration: function generateImportDeclaration ($stmt, settings) {
        var $specs    = $stmt.specifiers,
            stmtJs    = 'import',
            specCount = $specs.length;

        //NOTE: If no ImportClause is present,
        // this should be `import ModuleSpecifier` so skip `from`
        // ModuleSpecifier is StringLiteral.
        if (specCount) {
            var hasBinding    = !!$specs[0]['default'],
                firstNamedIdx = hasBinding ? 1 : 0,
                lastSpecIdx   = specCount - 1;

            // ImportedBinding
            if (hasBinding)
                stmtJs = join(stmtJs, $specs[0].id.name);

            // NamedImports
            if (firstNamedIdx < specCount) {
                if (hasBinding)
                    stmtJs += ',';

                stmtJs += _.optSpace + '{';

                // import { ... } from "...";
                if (firstNamedIdx === lastSpecIdx)
                    stmtJs += _.optSpace + exprToJs($specs[firstNamedIdx], Preset.e5) + _.optSpace;

                else {
                    var prevIndent = shiftIndent();

                    // import {
                    //    ...,
                    //    ...,
                    // } from "...";
                    for (var i = firstNamedIdx; i < specCount; i++) {
                        stmtJs += _.newline + _.indent + exprToJs($specs[i], Preset.e5);

                        if (i !== lastSpecIdx)
                            stmtJs += ',';
                    }

                    _.indent = prevIndent;
                    stmtJs += _.newline + _.indent;
                }

                stmtJs += '}' + _.optSpace;
            }

            stmtJs = join(stmtJs, 'from')
        }

        _.js += stmtJs + _.optSpace;
        ExprGen.Literal($stmt.source);

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';
    },

    VariableDeclarator: function generateVariableDeclarator ($stmt, settings) {
        var $id         = $stmt.id,
            $init       = $stmt.init,
            genSettings = Preset.e1(settings.allowIn);

        if ($init) {
            ExprGen[$id.type]($id, genSettings);
            _.js += _.optSpace + '=' + _.optSpace;
            ExprGen[$init.type]($init, genSettings, $stmt);
        }

        else {
            if ($id.type === Syntax.Identifier)
                _.js += $id.name;

            else
                ExprGen[$id.type]($id, genSettings);
        }
    },

    VariableDeclaration: function generateVariableDeclaration ($stmt, settings) {
        var $decls          = $stmt.declarations,
            len             = $decls.length,
            prevIndent      = len > 1 ? shiftIndent() : _.indent,
            declGenSettings = Preset.s3(settings.allowIn);

        _.js += $stmt.kind;

        for (var i = 0; i < len; i++) {
            var $decl = $decls[i];

            _.js += i === 0 ? _.space : (',' + _.optSpace);
            StmtGen[$decl.type]($decl, declGenSettings);
        }

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';

        _.indent = prevIndent;
    },

    ThrowStatement: function generateThrowStatement ($stmt, settings) {
        var argJs = exprToJs($stmt.argument, Preset.e5);

        _.js += join('throw', argJs);

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';
    },

    TryStatement: function generateTryStatement ($stmt) {
        var $block     = $stmt.block,
            $finalizer = $stmt.finalizer,
            stmtJs     = 'try' +
                         adoptionPrefix($block) +
                         stmtToJs($block, Preset.s7) +
                         adoptionSuffix($block);

        var $handlers = $stmt.handlers || $stmt.guardedHandlers;

        if ($handlers)
            stmtJs = generateTryStatementHandlers(stmtJs, $finalizer, $handlers);

        if ($stmt.handler) {
            $handlers = isArray($stmt.handler) ? $stmt.handler : [$stmt.handler];
            stmtJs    = generateTryStatementHandlers(stmtJs, $finalizer, $handlers);
        }

        if ($finalizer) {
            stmtJs = join(stmtJs, 'finally' + adoptionPrefix($finalizer));
            stmtJs += stmtToJs($finalizer, Preset.s7);
        }

        _.js += stmtJs;
    },

    SwitchStatement: function generateSwitchStatement ($stmt) {
        var $cases     = $stmt.cases,
            $discr     = $stmt.discriminant,
            prevIndent = shiftIndent();

        _.js += 'switch' + _.optSpace + '(';
        ExprGen[$discr.type]($discr, Preset.e5);
        _.js += ')' + _.optSpace + '{' + _.newline;
        _.indent = prevIndent;

        if ($cases) {
            var caseCount   = $cases.length,
                lastCaseIdx = caseCount - 1;

            for (var i = 0; i < caseCount; i++) {
                var $case = $cases[i];

                _.js += _.indent;
                StmtGen[$case.type]($case, Preset.s4(i === lastCaseIdx));
                _.js += _.newline;
            }
        }

        _.js += _.indent + '}';
    },

    SwitchCase: function generateSwitchCase ($stmt, settings) {
        var $conseqs                = $stmt.consequent,
            $firstConseq            = $conseqs[0],
            $test                   = $stmt.test,
            i                       = 0,
            conseqSemicolonOptional = !semicolons && settings.semicolonOptional,
            conseqCount             = $conseqs.length,
            lastConseqIdx           = conseqCount - 1,
            prevIndent              = shiftIndent();

        if ($test) {
            var testJs = exprToJs($test, Preset.e5);

            _.js += join('case', testJs) + ':';
        }

        else
            _.js += 'default:';


        if (conseqCount && $firstConseq.type === Syntax.BlockStatement) {
            i++;
            _.js += adoptionPrefix($firstConseq);
            StmtGen[$firstConseq.type]($firstConseq, Preset.s7);
        }

        for (; i < conseqCount; i++) {
            var $conseq           = $conseqs[i],
                semicolonOptional = i === lastConseqIdx && conseqSemicolonOptional;

            _.js += _.newline + _.indent;
            StmtGen[$conseq.type]($conseq, Preset.s4(semicolonOptional));
        }

        _.indent = prevIndent;
    },

    IfStatement: function generateIfStatement ($stmt, settings) {
        var $conseq           = $stmt.consequent,
            $test             = $stmt.test,
            prevIndent        = shiftIndent(),
            semicolonOptional = !semicolons && settings.semicolonOptional;

        _.js += 'if' + _.optSpace + '(';
        ExprGen[$test.type]($test, Preset.e5);
        _.js += ')';
        _.indent = prevIndent;
        _.js += adoptionPrefix($conseq);

        if ($stmt.alternate) {
            var conseq = stmtToJs($conseq, Preset.s7) + adoptionSuffix($conseq),
                alt    = stmtToJs($stmt.alternate, Preset.s4(semicolonOptional));

            if ($stmt.alternate.type === Syntax.IfStatement)
                alt = 'else ' + alt;

            else
                alt = join('else', adoptionPrefix($stmt.alternate) + alt);

            _.js += join(conseq, alt);
        }

        else
            StmtGen[$conseq.type]($conseq, Preset.s4(semicolonOptional));
    },

    ForStatement: function generateForStatement ($stmt, settings) {
        var $init                 = $stmt.init,
            $test                 = $stmt.test,
            $body                 = $stmt.body,
            $update               = $stmt.update,
            bodySemicolonOptional = !semicolons && settings.semicolonOptional,
            prevIndent            = shiftIndent();

        _.js += 'for' + _.optSpace + '(';

        if ($init) {
            if ($init.type === Syntax.VariableDeclaration)
                StmtGen[$init.type]($init, Preset.s6);

            else {
                ExprGen[$init.type]($init, Preset.e14);
                _.js += ';';
            }
        }

        else
            _.js += ';';

        if ($test) {
            _.js += _.optSpace;
            ExprGen[$test.type]($test, Preset.e5);
        }

        _.js += ';';

        if ($update) {
            _.js += _.optSpace;
            ExprGen[$update.type]($update, Preset.e5);
        }

        _.js += ')';
        _.indent = prevIndent;
        _.js += adoptionPrefix($body);
        StmtGen[$body.type]($body, Preset.s4(bodySemicolonOptional));
    },

    ForInStatement: function generateForInStatement ($stmt, settings) {
        generateForStatementIterator('in', $stmt, settings);
    },

    ForOfStatement: function generateForOfStatement ($stmt, settings) {
        generateForStatementIterator('of', $stmt, settings);
    },

    LabeledStatement: function generateLabeledStatement ($stmt, settings) {
        var $body                 = $stmt.body,
            bodySemicolonOptional = !semicolons && settings.semicolonOptional,
            prevIndent            = _.indent;

        _.js += $stmt.label.name + ':' + adoptionPrefix($body);

        if ($body.type !== Syntax.BlockStatement)
            prevIndent = shiftIndent();

        StmtGen[$body.type]($body, Preset.s4(bodySemicolonOptional));
        _.indent       = prevIndent;
    },

    ModuleDeclaration: function generateModuleDeclaration ($stmt, settings) {
        _.js += 'module' + _.space + $stmt.id.name + _.space + 'from' + _.optSpace;

        ExprGen.Literal($stmt.source);

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';
    },

    Program: function generateProgram ($stmt) {
        var $body   = $stmt.body,
            len     = $body.length,
            lastIdx = len - 1;

        if (safeConcatenation && len > 0)
            _.js += '\n';

        for (var i = 0; i < len; i++) {
            var $item = $body[i];

            _.js += _.indent;
            StmtGen[$item.type]($item, Preset.s5(!safeConcatenation && i === lastIdx));

            if (i !== lastIdx)
                _.js += _.newline;
        }
    },

    FunctionDeclaration: function generateFunctionDeclaration ($stmt) {
        var isGenerator = !!$stmt.generator;

        if ($stmt.async)
            _.js += 'async ';

        _.js += isGenerator ? ('function*' + _.optSpace) : ('function' + _.space );
        _.js += $stmt.id.name;
        generateFunctionBody($stmt);
    },

    ReturnStatement: function generateReturnStatement ($stmt, settings) {
        var $arg = $stmt.argument;

        if ($arg) {
            var argJs = exprToJs($arg, Preset.e5);

            _.js += join('return', argJs);
        }

        else
            _.js += 'return';

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';
    },

    WhileStatement: function generateWhileStatement ($stmt, settings) {
        var $body                 = $stmt.body,
            $test                 = $stmt.test,
            bodySemicolonOptional = !semicolons && settings.semicolonOptional,
            prevIndent            = shiftIndent();

        _.js += 'while' + _.optSpace + '(';
        ExprGen[$test.type]($test, Preset.e5);
        _.js += ')';
        _.indent = prevIndent;

        _.js += adoptionPrefix($body);
        StmtGen[$body.type]($body, Preset.s4(bodySemicolonOptional));
    },

    WithStatement: function generateWithStatement ($stmt, settings) {
        var $body                 = $stmt.body,
            $obj                  = $stmt.object,
            bodySemicolonOptional = !semicolons && settings.semicolonOptional,
            prevIndent            = shiftIndent();

        _.js += 'with' + _.optSpace + '(';
        ExprGen[$obj.type]($obj, Preset.e5);
        _.js += ')';
        _.indent = prevIndent;
        _.js += adoptionPrefix($body);
        StmtGen[$body.type]($body, Preset.s4(bodySemicolonOptional));
    }
};

function generateStatement ($stmt, option) {
    StmtGen[$stmt.type]($stmt, option);
}

//CodeGen
//-----------------------------------------------------------------------------------
function exprToJs ($expr, settings, $parent) {
    var savedJs = _.js;
    _.js        = '';

    ExprGen[$expr.type]($expr, settings, $parent);

    var src = _.js;
    _.js    = savedJs;

    return src;
}

function stmtToJs ($stmt, settings) {
    var savedJs = _.js;
    _.js        = '';

    StmtGen[$stmt.type]($stmt, settings);

    var src = _.js;
    _.js    = savedJs;

    return src;
}

function run ($node) {
    _.js = '';

    if (StmtGen[$node.type])
        StmtGen[$node.type]($node, Preset.s7);

    else
        ExprGen[$node.type]($node, Preset.e19);

    return _.js;
}

function wrapExprGen (gen) {
    return function ($expr, settings) {
        if (extra.verbatim && $expr.hasOwnProperty(extra.verbatim))
            generateVerbatim($expr, settings);

        else
            gen($expr, settings);
    }
}

function createExprGenWithExtras () {
    var gens = {};

    for (var key in ExprRawGen) {
        if (ExprRawGen.hasOwnProperty(key))
            gens[key] = wrapExprGen(ExprRawGen[key]);
    }

    return gens;
}


//Strings
var _ = {
    js:         '',
    newline:    '\n',
    optSpace:   ' ',
    space:      ' ',
    indentUnit: '    ',
    indent:     ''
};


//Generators
var ExprGen = void 0,
    StmtGen = StmtRawGen;


exports.generate = function ($node, options) {
    var defaultOptions = getDefaultOptions(), result, pair;

    if (options != null) {
        //NOTE: Obsolete options
        //
        //   `options.indent`
        //   `options.base`
        //
        // Instead of them, we can use `option.format.indent`.
        if (typeof options.indent === 'string') {
            defaultOptions.format.indent.style = options.indent;
        }
        if (typeof options.base === 'number') {
            defaultOptions.format.indent.base = options.base;
        }
        options      = updateDeeply(defaultOptions, options);
        _.indentUnit = options.format.indent.style;
        if (typeof options.base === 'string') {
            _.indent = options.base;
        }
        else {
            _.indent = stringRepeat(_.indentUnit, options.format.indent.base);
        }
    }
    else {
        options      = defaultOptions;
        _.indentUnit = options.format.indent.style;
        _.indent     = stringRepeat(_.indentUnit, options.format.indent.base);
    }
    json        = options.format.json;
    renumber    = options.format.renumber;
    hexadecimal = json ? false : options.format.hexadecimal;
    quotes      = json ? 'double' : options.format.quotes;
    escapeless  = options.format.escapeless;

    _.newline  = options.format.newline;
    _.optSpace = options.format.space;

    if (options.format.compact)
        _.newline = _.optSpace = _.indentUnit = _.indent = '';

    _.space           = _.optSpace ? _.optSpace : ' ';
    parentheses       = options.format.parentheses;
    semicolons        = options.format.semicolons;
    safeConcatenation = options.format.safeConcatenation;
    directive         = options.directive;
    parse             = json ? null : options.parse;
    extra             = options;

    if (extra.verbatim)
        ExprGen = createExprGenWithExtras();

    else
        ExprGen = ExprRawGen;

    return run($node);
};


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "request": () => (/* binding */ request),
/* harmony export */   "response": () => (/* binding */ response)
/* harmony export */ });
/* harmony import */ var _url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);

function request(headers, requestURL) {
    headers["host"] = requestURL.host;
    return headers;
}
function response(headers, requestURL) {
    ["Cache-Control", "Content-Security-Policy", "Content-Security-Policy-Report-Only", /* "Content-Encoding", "Content-Length", */ "Cross-Origin-Opener-Policy", "Cross-Origin-Opener-Policy-Report-Only", "Report-To", "Strict-Transport-Security", "X-Content-Type-Options", "X-Frame-Options", "Access-Control-Allow-Origin"].forEach((header) => {
        delete headers[header];
        delete headers[header.toLowerCase()];
    });
    headers["Location"] = (0,_url__WEBPACK_IMPORTED_MODULE_0__["default"])(headers["Location"] || headers["location"]);
    return headers;
}


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rewriteHTML),
/* harmony export */   "rewriteSrcset": () => (/* binding */ rewriteSrcset)
/* harmony export */ });
/* harmony import */ var parse5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(26);
/* harmony import */ var _url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(20);
/* harmony import */ var _css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(19);
/* harmony import */ var _js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(21);




function rewriteHTML(html, origin) {
    return (0,parse5__WEBPACK_IMPORTED_MODULE_0__.serialize)(rewriteNode((0,parse5__WEBPACK_IMPORTED_MODULE_0__.parse)(html), origin));
}
function rewriteNode(node, origin) {
    if (node.tagName) {
        switch (node.tagName.toLowerCase()) {
            case "a":
                for (let i in node.attrs) {
                    if (node.attrs[i].name === "href") {
                        node.attrs.push({ name: "data-href", value: node.attrs[i].value });
                        node.attrs[i].value = (0,_url__WEBPACK_IMPORTED_MODULE_1__["default"])(node.attrs[i].value, origin);
                    }
                }
                break;
            case "script":
                let src = false;
                for (let i in node.attrs) {
                    if (node.attrs[i].name === "src") {
                        node.attrs.push({ name: "data-src", value: node.attrs[i].value });
                        node.attrs[i].value = (0,_url__WEBPACK_IMPORTED_MODULE_1__["default"])(node.attrs[i].value, origin);
                        src = true;
                    }
                    else if (node.attrs[i].name === "integrity") {
                        node.attrs.push({ name: "data-integrity", value: node.attrs[i].value });
                        node.attrs[i].value = "";
                    }
                    else if (node.attrs[i].name === "nonce") {
                        node.attrs.push({ name: "data-nonce", value: node.attrs[i].value });
                        node.attrs[i].value = "";
                    }
                }
                if (!src) {
                    for (let i in node.childNodes) {
                        node.childNodes[i].value = (0,_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node.childNodes[i].value);
                    }
                }
                break;
            case "style":
                for (let i in node.attrs) {
                    if (node.attrs[i].name === "integrity") {
                        node.attrs.push({ name: "data-integrity", value: node.attrs[i].value });
                        node.attrs[i].value = "";
                    }
                    else if (node.attrs[i].name === "nonce") {
                        node.attrs.push({ name: "data-nonce", value: node.attrs[i].value });
                        node.attrs[i].value = "";
                    }
                }
                for (let i in node.childNodes) {
                    node.childNodes[i].value = (0,_css__WEBPACK_IMPORTED_MODULE_2__["default"])(node.childNodes[i].value, origin);
                }
                break;
            case "link":
                for (let i in node.attrs) {
                    if (node.attrs[i].name === "href") {
                        node.attrs.push({ name: "data-href", value: node.attrs[i].value });
                        node.attrs[i].value = (0,_url__WEBPACK_IMPORTED_MODULE_1__["default"])(node.attrs[i].value, origin);
                    }
                    else if (node.attrs[i].name === "integrity") {
                        node.attrs.push({ name: "data-integrity", value: node.attrs[i].value });
                        node.attrs[i].value = "";
                    }
                    else if (node.attrs[i].name === "nonce") {
                        node.attrs.push({ name: "data-nonce", value: node.attrs[i].value });
                        node.attrs[i].value = "";
                    }
                }
                break;
            case "img":
                for (let i in node.attrs) {
                    if (node.attrs[i].name === "src") {
                        node.attrs.push({ name: "data-src", value: node.attrs[i].value });
                        node.attrs[i].value = (0,_url__WEBPACK_IMPORTED_MODULE_1__["default"])(node.attrs[i].value, origin);
                    }
                    else if (node.attrs[i].name === "srcset") {
                        node.attrs.push({ name: "data-srcset", value: node.attrs[i].value });
                        node.attrs[i].value = rewriteSrcset(node.attrs[i].value, origin);
                    }
                }
                break;
            case "source":
                for (let i in node.attrs) {
                    if (node.attrs[i].name === "src") {
                        node.attrs.push({ name: "data-src", value: node.attrs[i].value });
                        node.attrs[i].value = (0,_url__WEBPACK_IMPORTED_MODULE_1__["default"])(node.attrs[i].value, origin);
                    }
                    else if (node.attrs[i].name === "srcset") {
                        node.attrs.push({ name: "data-srcset", value: node.attrs[i].value });
                        node.attrs[i].value = rewriteSrcset(node.attrs[i].value, origin);
                    }
                }
                break;
            case "form":
                for (let i in node.attrs) {
                    if (node.attrs[i].name === "action") {
                        node.attrs.push({ name: "data-action", value: node.attrs[i].value });
                        node.attrs[i].value = (0,_url__WEBPACK_IMPORTED_MODULE_1__["default"])(node.attrs[i].value, origin);
                    }
                }
                break;
            case "iframe":
                for (let i in node.attrs) {
                    if (node.attrs[i].name === "src") {
                        node.attrs.push({ name: "data-src", value: node.attrs[i].value });
                        node.attrs[i].value = (0,_url__WEBPACK_IMPORTED_MODULE_1__["default"])(node.attrs[i].value, origin);
                    }
                }
                break;
            case "meta":
                for (let i in node.attrs) {
                    if (node.attrs[i].name === "http-equiv") {
                        if (node.attrs[i].value === "Content-Security-Policy") {
                            node.attrs.push({ name: "data-Content-Security-Policy", value: node.attrs[i].value });
                            node.attrs[i].value = "*";
                        }
                        for (let i in node.attrs) {
                            if (node.attrs[i].name === "content") {
                                node.attrs.push({ name: "data-content", value: node.attrs[i].value });
                                node.attrs[i].value = "";
                            }
                        }
                    }
                }
        }
    }
    if (node.childNodes) {
        for (let childNode in node.childNodes) {
            childNode = rewriteNode(node.childNodes[childNode], origin);
        }
    }
    return node;
}
function rewriteSrcset(value, origin) {
    const urls = value.split(/ [0-9]+x,? ?/g);
    if (!urls)
        return "";
    const sufixes = value.match(/ [0-9]+x,? ?/g);
    if (!sufixes)
        return "";
    const rewrittenUrls = urls.map((url, i) => {
        if (url && sufixes[i])
            return (0,_url__WEBPACK_IMPORTED_MODULE_1__["default"])(url, origin) + sufixes[i];
    });
    return rewrittenUrls.join("");
}


/***/ }),
/* 26 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Parser": () => (/* reexport safe */ _parser_index_js__WEBPACK_IMPORTED_MODULE_0__.Parser),
/* harmony export */   "Token": () => (/* reexport module object */ _common_token_js__WEBPACK_IMPORTED_MODULE_5__),
/* harmony export */   "Tokenizer": () => (/* reexport safe */ _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_6__.Tokenizer),
/* harmony export */   "TokenizerMode": () => (/* reexport safe */ _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_6__.TokenizerMode),
/* harmony export */   "defaultTreeAdapter": () => (/* reexport safe */ _tree_adapters_default_js__WEBPACK_IMPORTED_MODULE_1__.defaultTreeAdapter),
/* harmony export */   "foreignContent": () => (/* reexport module object */ _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_3__),
/* harmony export */   "html": () => (/* reexport module object */ _common_html_js__WEBPACK_IMPORTED_MODULE_4__),
/* harmony export */   "parse": () => (/* binding */ parse),
/* harmony export */   "parseFragment": () => (/* binding */ parseFragment),
/* harmony export */   "serialize": () => (/* reexport safe */ _serializer_index_js__WEBPACK_IMPORTED_MODULE_2__.serialize),
/* harmony export */   "serializeOuter": () => (/* reexport safe */ _serializer_index_js__WEBPACK_IMPORTED_MODULE_2__.serializeOuter)
/* harmony export */ });
/* harmony import */ var _parser_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(27);
/* harmony import */ var _tree_adapters_default_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(40);
/* harmony import */ var _serializer_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43);
/* harmony import */ var _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(42);
/* harmony import */ var _common_html_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(37);
/* harmony import */ var _common_token_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(32);
/* harmony import */ var _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(28);




/** @internal */

/** @internal */

/** @internal */

/** @internal */

// Shorthands
/**
 * Parses an HTML string.
 *
 * @param html Input HTML string.
 * @param options Parsing options.
 * @returns Document
 *
 * @example
 *
 * ```js
 * const parse5 = require('parse5');
 *
 * const document = parse5.parse('<!DOCTYPE html><html><head></head><body>Hi there!</body></html>');
 *
 * console.log(document.childNodes[1].tagName); //> 'html'
 *```
 */
function parse(html, options) {
    return _parser_index_js__WEBPACK_IMPORTED_MODULE_0__.Parser.parse(html, options);
}
function parseFragment(fragmentContext, html, options) {
    if (typeof fragmentContext === 'string') {
        options = html;
        html = fragmentContext;
        fragmentContext = null;
    }
    const parser = _parser_index_js__WEBPACK_IMPORTED_MODULE_0__.Parser.getFragmentParser(fragmentContext, options);
    parser.tokenizer.write(html, true);
    return parser.getFragment();
}
//# sourceMappingURL=index.js.map

/***/ }),
/* 27 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Parser": () => (/* binding */ Parser)
/* harmony export */ });
/* harmony import */ var _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(28);
/* harmony import */ var _open_element_stack_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(38);
/* harmony import */ var _formatting_element_list_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(39);
/* harmony import */ var _tree_adapters_default_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(40);
/* harmony import */ var _common_doctype_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(41);
/* harmony import */ var _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(42);
/* harmony import */ var _common_error_codes_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(31);
/* harmony import */ var _common_unicode_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(30);
/* harmony import */ var _common_html_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(37);
/* harmony import */ var _common_token_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(32);










//Misc constants
const HIDDEN_INPUT_TYPE = 'hidden';
//Adoption agency loops iteration count
const AA_OUTER_LOOP_ITER = 8;
const AA_INNER_LOOP_ITER = 3;
//Insertion modes
var InsertionMode;
(function (InsertionMode) {
    InsertionMode[InsertionMode["INITIAL"] = 0] = "INITIAL";
    InsertionMode[InsertionMode["BEFORE_HTML"] = 1] = "BEFORE_HTML";
    InsertionMode[InsertionMode["BEFORE_HEAD"] = 2] = "BEFORE_HEAD";
    InsertionMode[InsertionMode["IN_HEAD"] = 3] = "IN_HEAD";
    InsertionMode[InsertionMode["IN_HEAD_NO_SCRIPT"] = 4] = "IN_HEAD_NO_SCRIPT";
    InsertionMode[InsertionMode["AFTER_HEAD"] = 5] = "AFTER_HEAD";
    InsertionMode[InsertionMode["IN_BODY"] = 6] = "IN_BODY";
    InsertionMode[InsertionMode["TEXT"] = 7] = "TEXT";
    InsertionMode[InsertionMode["IN_TABLE"] = 8] = "IN_TABLE";
    InsertionMode[InsertionMode["IN_TABLE_TEXT"] = 9] = "IN_TABLE_TEXT";
    InsertionMode[InsertionMode["IN_CAPTION"] = 10] = "IN_CAPTION";
    InsertionMode[InsertionMode["IN_COLUMN_GROUP"] = 11] = "IN_COLUMN_GROUP";
    InsertionMode[InsertionMode["IN_TABLE_BODY"] = 12] = "IN_TABLE_BODY";
    InsertionMode[InsertionMode["IN_ROW"] = 13] = "IN_ROW";
    InsertionMode[InsertionMode["IN_CELL"] = 14] = "IN_CELL";
    InsertionMode[InsertionMode["IN_SELECT"] = 15] = "IN_SELECT";
    InsertionMode[InsertionMode["IN_SELECT_IN_TABLE"] = 16] = "IN_SELECT_IN_TABLE";
    InsertionMode[InsertionMode["IN_TEMPLATE"] = 17] = "IN_TEMPLATE";
    InsertionMode[InsertionMode["AFTER_BODY"] = 18] = "AFTER_BODY";
    InsertionMode[InsertionMode["IN_FRAMESET"] = 19] = "IN_FRAMESET";
    InsertionMode[InsertionMode["AFTER_FRAMESET"] = 20] = "AFTER_FRAMESET";
    InsertionMode[InsertionMode["AFTER_AFTER_BODY"] = 21] = "AFTER_AFTER_BODY";
    InsertionMode[InsertionMode["AFTER_AFTER_FRAMESET"] = 22] = "AFTER_AFTER_FRAMESET";
})(InsertionMode || (InsertionMode = {}));
const BASE_LOC = {
    startLine: -1,
    startCol: -1,
    startOffset: -1,
    endLine: -1,
    endCol: -1,
    endOffset: -1,
};
const TABLE_STRUCTURE_TAGS = new Set([_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TABLE, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TBODY, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TFOOT, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.THEAD, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TR]);
const defaultParserOptions = {
    scriptingEnabled: true,
    sourceCodeLocationInfo: false,
    treeAdapter: _tree_adapters_default_js__WEBPACK_IMPORTED_MODULE_3__.defaultTreeAdapter,
    onParseError: null,
};
//Parser
class Parser {
    constructor(options, document, fragmentContext = null, scriptHandler = null) {
        this.fragmentContext = fragmentContext;
        this.scriptHandler = scriptHandler;
        this.currentToken = null;
        this.stopped = false;
        this.insertionMode = InsertionMode.INITIAL;
        this.originalInsertionMode = InsertionMode.INITIAL;
        this.headElement = null;
        this.formElement = null;
        /** Indicates that the current node is not an element in the HTML namespace */
        this.currentNotInHTML = false;
        /**
         * The template insertion mode stack is maintained from the left.
         * Ie. the topmost element will always have index 0.
         */
        this.tmplInsertionModeStack = [];
        this.pendingCharacterTokens = [];
        this.hasNonWhitespacePendingCharacterToken = false;
        this.framesetOk = true;
        this.skipNextNewLine = false;
        this.fosterParentingEnabled = false;
        this.options = {
            ...defaultParserOptions,
            ...options,
        };
        this.treeAdapter = this.options.treeAdapter;
        this.onParseError = this.options.onParseError;
        // Always enable location info if we report parse errors.
        if (this.onParseError) {
            this.options.sourceCodeLocationInfo = true;
        }
        this.document = document !== null && document !== void 0 ? document : this.treeAdapter.createDocument();
        this.tokenizer = new _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Tokenizer(this.options, this);
        this.activeFormattingElements = new _formatting_element_list_js__WEBPACK_IMPORTED_MODULE_2__.FormattingElementList(this.treeAdapter);
        this.fragmentContextID = fragmentContext ? (0,_common_html_js__WEBPACK_IMPORTED_MODULE_8__.getTagID)(this.treeAdapter.getTagName(fragmentContext)) : _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.UNKNOWN;
        this._setContextModes(fragmentContext !== null && fragmentContext !== void 0 ? fragmentContext : this.document, this.fragmentContextID);
        this.openElements = new _open_element_stack_js__WEBPACK_IMPORTED_MODULE_1__.OpenElementStack(this.document, this.treeAdapter, this);
    }
    // API
    static parse(html, options) {
        const parser = new this(options);
        parser.tokenizer.write(html, true);
        return parser.document;
    }
    static getFragmentParser(fragmentContext, options) {
        const opts = {
            ...defaultParserOptions,
            ...options,
        };
        //NOTE: use a <template> element as the fragment context if no context element was provided,
        //so we will parse in a "forgiving" manner
        fragmentContext !== null && fragmentContext !== void 0 ? fragmentContext : (fragmentContext = opts.treeAdapter.createElement(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_NAMES.TEMPLATE, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML, []));
        //NOTE: create a fake element which will be used as the `document` for fragment parsing.
        //This is important for jsdom, where a new `document` cannot be created. This led to
        //fragment parsing messing with the main `document`.
        const documentMock = opts.treeAdapter.createElement('documentmock', _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML, []);
        const parser = new this(opts, documentMock, fragmentContext);
        if (parser.fragmentContextID === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEMPLATE) {
            parser.tmplInsertionModeStack.unshift(InsertionMode.IN_TEMPLATE);
        }
        parser._initTokenizerForFragmentParsing();
        parser._insertFakeRootElement();
        parser._resetInsertionMode();
        parser._findFormInFragmentContext();
        return parser;
    }
    getFragment() {
        const rootElement = this.treeAdapter.getFirstChild(this.document);
        const fragment = this.treeAdapter.createDocumentFragment();
        this._adoptNodes(rootElement, fragment);
        return fragment;
    }
    //Errors
    _err(token, code, beforeToken) {
        var _a;
        if (!this.onParseError)
            return;
        const loc = (_a = token.location) !== null && _a !== void 0 ? _a : BASE_LOC;
        const err = {
            code,
            startLine: loc.startLine,
            startCol: loc.startCol,
            startOffset: loc.startOffset,
            endLine: beforeToken ? loc.startLine : loc.endLine,
            endCol: beforeToken ? loc.startCol : loc.endCol,
            endOffset: beforeToken ? loc.startOffset : loc.endOffset,
        };
        this.onParseError(err);
    }
    //Stack events
    onItemPush(node, tid, isTop) {
        var _a, _b;
        (_b = (_a = this.treeAdapter).onItemPush) === null || _b === void 0 ? void 0 : _b.call(_a, node);
        if (isTop && this.openElements.stackTop > 0)
            this._setContextModes(node, tid);
    }
    onItemPop(node, isTop) {
        var _a, _b;
        if (this.options.sourceCodeLocationInfo) {
            this._setEndLocation(node, this.currentToken);
        }
        (_b = (_a = this.treeAdapter).onItemPop) === null || _b === void 0 ? void 0 : _b.call(_a, node, this.openElements.current);
        if (isTop) {
            let current;
            let currentTagId;
            if (this.openElements.stackTop === 0 && this.fragmentContext) {
                current = this.fragmentContext;
                currentTagId = this.fragmentContextID;
            }
            else {
                ({ current, currentTagId } = this.openElements);
            }
            this._setContextModes(current, currentTagId);
        }
    }
    _setContextModes(current, tid) {
        const isHTML = current === this.document || this.treeAdapter.getNamespaceURI(current) === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML;
        this.currentNotInHTML = !isHTML;
        this.tokenizer.inForeignNode = !isHTML && !this._isIntegrationPoint(tid, current);
    }
    _switchToTextParsing(currentToken, nextTokenizerState) {
        this._insertElement(currentToken, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
        this.tokenizer.state = nextTokenizerState;
        this.originalInsertionMode = this.insertionMode;
        this.insertionMode = InsertionMode.TEXT;
    }
    switchToPlaintextParsing() {
        this.insertionMode = InsertionMode.TEXT;
        this.originalInsertionMode = InsertionMode.IN_BODY;
        this.tokenizer.state = _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.TokenizerMode.PLAINTEXT;
    }
    //Fragment parsing
    _getAdjustedCurrentElement() {
        return this.openElements.stackTop === 0 && this.fragmentContext
            ? this.fragmentContext
            : this.openElements.current;
    }
    _findFormInFragmentContext() {
        let node = this.fragmentContext;
        while (node) {
            if (this.treeAdapter.getTagName(node) === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_NAMES.FORM) {
                this.formElement = node;
                break;
            }
            node = this.treeAdapter.getParentNode(node);
        }
    }
    _initTokenizerForFragmentParsing() {
        if (!this.fragmentContext || this.treeAdapter.getNamespaceURI(this.fragmentContext) !== _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML) {
            return;
        }
        switch (this.fragmentContextID) {
            case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TITLE:
            case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEXTAREA: {
                this.tokenizer.state = _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.TokenizerMode.RCDATA;
                break;
            }
            case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.STYLE:
            case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.XMP:
            case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.IFRAME:
            case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.NOEMBED:
            case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.NOFRAMES:
            case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.NOSCRIPT: {
                this.tokenizer.state = _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.TokenizerMode.RAWTEXT;
                break;
            }
            case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SCRIPT: {
                this.tokenizer.state = _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.TokenizerMode.SCRIPT_DATA;
                break;
            }
            case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.PLAINTEXT: {
                this.tokenizer.state = _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.TokenizerMode.PLAINTEXT;
                break;
            }
            default:
            // Do nothing
        }
    }
    //Tree mutation
    _setDocumentType(token) {
        const name = token.name || '';
        const publicId = token.publicId || '';
        const systemId = token.systemId || '';
        this.treeAdapter.setDocumentType(this.document, name, publicId, systemId);
        if (token.location) {
            const documentChildren = this.treeAdapter.getChildNodes(this.document);
            const docTypeNode = documentChildren.find((node) => this.treeAdapter.isDocumentTypeNode(node));
            if (docTypeNode) {
                this.treeAdapter.setNodeSourceCodeLocation(docTypeNode, token.location);
            }
        }
    }
    _attachElementToTree(element, location) {
        if (this.options.sourceCodeLocationInfo) {
            const loc = location && {
                ...location,
                startTag: location,
            };
            this.treeAdapter.setNodeSourceCodeLocation(element, loc);
        }
        if (this._shouldFosterParentOnInsertion()) {
            this._fosterParentElement(element);
        }
        else {
            const parent = this.openElements.currentTmplContentOrNode;
            this.treeAdapter.appendChild(parent, element);
        }
    }
    _appendElement(token, namespaceURI) {
        const element = this.treeAdapter.createElement(token.tagName, namespaceURI, token.attrs);
        this._attachElementToTree(element, token.location);
    }
    _insertElement(token, namespaceURI) {
        const element = this.treeAdapter.createElement(token.tagName, namespaceURI, token.attrs);
        this._attachElementToTree(element, token.location);
        this.openElements.push(element, token.tagID);
    }
    _insertFakeElement(tagName, tagID) {
        const element = this.treeAdapter.createElement(tagName, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML, []);
        this._attachElementToTree(element, null);
        this.openElements.push(element, tagID);
    }
    _insertTemplate(token) {
        const tmpl = this.treeAdapter.createElement(token.tagName, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML, token.attrs);
        const content = this.treeAdapter.createDocumentFragment();
        this.treeAdapter.setTemplateContent(tmpl, content);
        this._attachElementToTree(tmpl, token.location);
        this.openElements.push(tmpl, token.tagID);
        if (this.options.sourceCodeLocationInfo)
            this.treeAdapter.setNodeSourceCodeLocation(content, null);
    }
    _insertFakeRootElement() {
        const element = this.treeAdapter.createElement(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_NAMES.HTML, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML, []);
        if (this.options.sourceCodeLocationInfo)
            this.treeAdapter.setNodeSourceCodeLocation(element, null);
        this.treeAdapter.appendChild(this.openElements.current, element);
        this.openElements.push(element, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML);
    }
    _appendCommentNode(token, parent) {
        const commentNode = this.treeAdapter.createCommentNode(token.data);
        this.treeAdapter.appendChild(parent, commentNode);
        if (this.options.sourceCodeLocationInfo) {
            this.treeAdapter.setNodeSourceCodeLocation(commentNode, token.location);
        }
    }
    _insertCharacters(token) {
        let parent;
        let beforeElement;
        if (this._shouldFosterParentOnInsertion()) {
            ({ parent, beforeElement } = this._findFosterParentingLocation());
            if (beforeElement) {
                this.treeAdapter.insertTextBefore(parent, token.chars, beforeElement);
            }
            else {
                this.treeAdapter.insertText(parent, token.chars);
            }
        }
        else {
            parent = this.openElements.currentTmplContentOrNode;
            this.treeAdapter.insertText(parent, token.chars);
        }
        if (!token.location)
            return;
        const siblings = this.treeAdapter.getChildNodes(parent);
        const textNodeIdx = beforeElement ? siblings.lastIndexOf(beforeElement) : siblings.length;
        const textNode = siblings[textNodeIdx - 1];
        //NOTE: if we have a location assigned by another token, then just update the end position
        const tnLoc = this.treeAdapter.getNodeSourceCodeLocation(textNode);
        if (tnLoc) {
            const { endLine, endCol, endOffset } = token.location;
            this.treeAdapter.updateNodeSourceCodeLocation(textNode, { endLine, endCol, endOffset });
        }
        else if (this.options.sourceCodeLocationInfo) {
            this.treeAdapter.setNodeSourceCodeLocation(textNode, token.location);
        }
    }
    _adoptNodes(donor, recipient) {
        for (let child = this.treeAdapter.getFirstChild(donor); child; child = this.treeAdapter.getFirstChild(donor)) {
            this.treeAdapter.detachNode(child);
            this.treeAdapter.appendChild(recipient, child);
        }
    }
    _setEndLocation(element, closingToken) {
        if (this.treeAdapter.getNodeSourceCodeLocation(element) && closingToken.location) {
            const ctLoc = closingToken.location;
            const tn = this.treeAdapter.getTagName(element);
            const endLoc = 
            // NOTE: For cases like <p> <p> </p> - First 'p' closes without a closing
            // tag and for cases like <td> <p> </td> - 'p' closes without a closing tag.
            closingToken.type === _common_token_js__WEBPACK_IMPORTED_MODULE_9__.TokenType.END_TAG && tn === closingToken.tagName
                ? {
                    endTag: { ...ctLoc },
                    endLine: ctLoc.endLine,
                    endCol: ctLoc.endCol,
                    endOffset: ctLoc.endOffset,
                }
                : {
                    endLine: ctLoc.startLine,
                    endCol: ctLoc.startCol,
                    endOffset: ctLoc.startOffset,
                };
            this.treeAdapter.updateNodeSourceCodeLocation(element, endLoc);
        }
    }
    //Token processing
    shouldProcessStartTagTokenInForeignContent(token) {
        // Check that neither current === document, or ns === NS.HTML
        if (!this.currentNotInHTML)
            return false;
        let current;
        let currentTagId;
        if (this.openElements.stackTop === 0 && this.fragmentContext) {
            current = this.fragmentContext;
            currentTagId = this.fragmentContextID;
        }
        else {
            ({ current, currentTagId } = this.openElements);
        }
        if (token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SVG &&
            this.treeAdapter.getTagName(current) === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_NAMES.ANNOTATION_XML &&
            this.treeAdapter.getNamespaceURI(current) === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.MATHML) {
            return false;
        }
        return (
        // Check that `current` is not an integration point for HTML or MathML elements.
        this.tokenizer.inForeignNode ||
            // If it _is_ an integration point, then we might have to check that it is not an HTML
            // integration point.
            ((token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.MGLYPH || token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.MALIGNMARK) &&
                !this._isIntegrationPoint(currentTagId, current, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML)));
    }
    _processToken(token) {
        switch (token.type) {
            case _common_token_js__WEBPACK_IMPORTED_MODULE_9__.TokenType.CHARACTER: {
                this.onCharacter(token);
                break;
            }
            case _common_token_js__WEBPACK_IMPORTED_MODULE_9__.TokenType.NULL_CHARACTER: {
                this.onNullCharacter(token);
                break;
            }
            case _common_token_js__WEBPACK_IMPORTED_MODULE_9__.TokenType.COMMENT: {
                this.onComment(token);
                break;
            }
            case _common_token_js__WEBPACK_IMPORTED_MODULE_9__.TokenType.DOCTYPE: {
                this.onDoctype(token);
                break;
            }
            case _common_token_js__WEBPACK_IMPORTED_MODULE_9__.TokenType.START_TAG: {
                this._processStartTag(token);
                break;
            }
            case _common_token_js__WEBPACK_IMPORTED_MODULE_9__.TokenType.END_TAG: {
                this.onEndTag(token);
                break;
            }
            case _common_token_js__WEBPACK_IMPORTED_MODULE_9__.TokenType.EOF: {
                this.onEof(token);
                break;
            }
            case _common_token_js__WEBPACK_IMPORTED_MODULE_9__.TokenType.WHITESPACE_CHARACTER: {
                this.onWhitespaceCharacter(token);
                break;
            }
        }
    }
    //Integration points
    _isIntegrationPoint(tid, element, foreignNS) {
        const ns = this.treeAdapter.getNamespaceURI(element);
        const attrs = this.treeAdapter.getAttrList(element);
        return _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_5__.isIntegrationPoint(tid, ns, attrs, foreignNS);
    }
    //Active formatting elements reconstruction
    _reconstructActiveFormattingElements() {
        const listLength = this.activeFormattingElements.entries.length;
        if (listLength) {
            const endIndex = this.activeFormattingElements.entries.findIndex((entry) => entry.type === _formatting_element_list_js__WEBPACK_IMPORTED_MODULE_2__.EntryType.Marker || this.openElements.contains(entry.element));
            const unopenIdx = endIndex < 0 ? listLength - 1 : endIndex - 1;
            for (let i = unopenIdx; i >= 0; i--) {
                const entry = this.activeFormattingElements.entries[i];
                this._insertElement(entry.token, this.treeAdapter.getNamespaceURI(entry.element));
                entry.element = this.openElements.current;
            }
        }
    }
    //Close elements
    _closeTableCell() {
        this.openElements.generateImpliedEndTags();
        this.openElements.popUntilTableCellPopped();
        this.activeFormattingElements.clearToLastMarker();
        this.insertionMode = InsertionMode.IN_ROW;
    }
    _closePElement() {
        this.openElements.generateImpliedEndTagsWithExclusion(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.P);
        this.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.P);
    }
    //Insertion modes
    _resetInsertionMode() {
        for (let i = this.openElements.stackTop; i >= 0; i--) {
            //Insertion mode reset map
            switch (i === 0 && this.fragmentContext ? this.fragmentContextID : this.openElements.tagIDs[i]) {
                case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TR:
                    this.insertionMode = InsertionMode.IN_ROW;
                    return;
                case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TBODY:
                case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.THEAD:
                case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TFOOT:
                    this.insertionMode = InsertionMode.IN_TABLE_BODY;
                    return;
                case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.CAPTION:
                    this.insertionMode = InsertionMode.IN_CAPTION;
                    return;
                case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COLGROUP:
                    this.insertionMode = InsertionMode.IN_COLUMN_GROUP;
                    return;
                case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TABLE:
                    this.insertionMode = InsertionMode.IN_TABLE;
                    return;
                case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BODY:
                    this.insertionMode = InsertionMode.IN_BODY;
                    return;
                case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.FRAMESET:
                    this.insertionMode = InsertionMode.IN_FRAMESET;
                    return;
                case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SELECT:
                    this._resetInsertionModeForSelect(i);
                    return;
                case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEMPLATE:
                    this.insertionMode = this.tmplInsertionModeStack[0];
                    return;
                case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML:
                    this.insertionMode = this.headElement ? InsertionMode.AFTER_HEAD : InsertionMode.BEFORE_HEAD;
                    return;
                case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TD:
                case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TH:
                    if (i > 0) {
                        this.insertionMode = InsertionMode.IN_CELL;
                        return;
                    }
                    break;
                case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HEAD:
                    if (i > 0) {
                        this.insertionMode = InsertionMode.IN_HEAD;
                        return;
                    }
                    break;
            }
        }
        this.insertionMode = InsertionMode.IN_BODY;
    }
    _resetInsertionModeForSelect(selectIdx) {
        if (selectIdx > 0) {
            for (let i = selectIdx - 1; i > 0; i--) {
                const tn = this.openElements.tagIDs[i];
                if (tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEMPLATE) {
                    break;
                }
                else if (tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TABLE) {
                    this.insertionMode = InsertionMode.IN_SELECT_IN_TABLE;
                    return;
                }
            }
        }
        this.insertionMode = InsertionMode.IN_SELECT;
    }
    //Foster parenting
    _isElementCausesFosterParenting(tn) {
        return TABLE_STRUCTURE_TAGS.has(tn);
    }
    _shouldFosterParentOnInsertion() {
        return this.fosterParentingEnabled && this._isElementCausesFosterParenting(this.openElements.currentTagId);
    }
    _findFosterParentingLocation() {
        for (let i = this.openElements.stackTop; i >= 0; i--) {
            const openElement = this.openElements.items[i];
            switch (this.openElements.tagIDs[i]) {
                case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEMPLATE:
                    if (this.treeAdapter.getNamespaceURI(openElement) === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML) {
                        return { parent: this.treeAdapter.getTemplateContent(openElement), beforeElement: null };
                    }
                    break;
                case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TABLE: {
                    const parent = this.treeAdapter.getParentNode(openElement);
                    if (parent) {
                        return { parent, beforeElement: openElement };
                    }
                    return { parent: this.openElements.items[i - 1], beforeElement: null };
                }
                default:
                // Do nothing
            }
        }
        return { parent: this.openElements.items[0], beforeElement: null };
    }
    _fosterParentElement(element) {
        const location = this._findFosterParentingLocation();
        if (location.beforeElement) {
            this.treeAdapter.insertBefore(location.parent, element, location.beforeElement);
        }
        else {
            this.treeAdapter.appendChild(location.parent, element);
        }
    }
    //Special elements
    _isSpecialElement(element, id) {
        const ns = this.treeAdapter.getNamespaceURI(element);
        return _common_html_js__WEBPACK_IMPORTED_MODULE_8__.SPECIAL_ELEMENTS[ns].has(id);
    }
    onCharacter(token) {
        this.skipNextNewLine = false;
        if (this.tokenizer.inForeignNode) {
            characterInForeignContent(this, token);
            return;
        }
        switch (this.insertionMode) {
            case InsertionMode.INITIAL:
                tokenInInitialMode(this, token);
                break;
            case InsertionMode.BEFORE_HTML:
                tokenBeforeHtml(this, token);
                break;
            case InsertionMode.BEFORE_HEAD:
                tokenBeforeHead(this, token);
                break;
            case InsertionMode.IN_HEAD:
                tokenInHead(this, token);
                break;
            case InsertionMode.IN_HEAD_NO_SCRIPT:
                tokenInHeadNoScript(this, token);
                break;
            case InsertionMode.AFTER_HEAD:
                tokenAfterHead(this, token);
                break;
            case InsertionMode.IN_BODY:
            case InsertionMode.IN_CAPTION:
            case InsertionMode.IN_CELL:
            case InsertionMode.IN_TEMPLATE:
                characterInBody(this, token);
                break;
            case InsertionMode.TEXT:
            case InsertionMode.IN_SELECT:
            case InsertionMode.IN_SELECT_IN_TABLE:
                this._insertCharacters(token);
                break;
            case InsertionMode.IN_TABLE:
            case InsertionMode.IN_TABLE_BODY:
            case InsertionMode.IN_ROW:
                characterInTable(this, token);
                break;
            case InsertionMode.IN_TABLE_TEXT:
                characterInTableText(this, token);
                break;
            case InsertionMode.IN_COLUMN_GROUP:
                tokenInColumnGroup(this, token);
                break;
            case InsertionMode.AFTER_BODY:
                tokenAfterBody(this, token);
                break;
            case InsertionMode.AFTER_AFTER_BODY:
                tokenAfterAfterBody(this, token);
                break;
            default:
            // Do nothing
        }
    }
    onNullCharacter(token) {
        this.skipNextNewLine = false;
        if (this.tokenizer.inForeignNode) {
            nullCharacterInForeignContent(this, token);
            return;
        }
        switch (this.insertionMode) {
            case InsertionMode.INITIAL:
                tokenInInitialMode(this, token);
                break;
            case InsertionMode.BEFORE_HTML:
                tokenBeforeHtml(this, token);
                break;
            case InsertionMode.BEFORE_HEAD:
                tokenBeforeHead(this, token);
                break;
            case InsertionMode.IN_HEAD:
                tokenInHead(this, token);
                break;
            case InsertionMode.IN_HEAD_NO_SCRIPT:
                tokenInHeadNoScript(this, token);
                break;
            case InsertionMode.AFTER_HEAD:
                tokenAfterHead(this, token);
                break;
            case InsertionMode.TEXT:
                this._insertCharacters(token);
                break;
            case InsertionMode.IN_TABLE:
            case InsertionMode.IN_TABLE_BODY:
            case InsertionMode.IN_ROW:
                characterInTable(this, token);
                break;
            case InsertionMode.IN_COLUMN_GROUP:
                tokenInColumnGroup(this, token);
                break;
            case InsertionMode.AFTER_BODY:
                tokenAfterBody(this, token);
                break;
            case InsertionMode.AFTER_AFTER_BODY:
                tokenAfterAfterBody(this, token);
                break;
            default:
            // Do nothing
        }
    }
    onComment(token) {
        this.skipNextNewLine = false;
        if (this.currentNotInHTML) {
            appendComment(this, token);
            return;
        }
        switch (this.insertionMode) {
            case InsertionMode.INITIAL:
            case InsertionMode.BEFORE_HTML:
            case InsertionMode.BEFORE_HEAD:
            case InsertionMode.IN_HEAD:
            case InsertionMode.IN_HEAD_NO_SCRIPT:
            case InsertionMode.AFTER_HEAD:
            case InsertionMode.IN_BODY:
            case InsertionMode.IN_TABLE:
            case InsertionMode.IN_CAPTION:
            case InsertionMode.IN_COLUMN_GROUP:
            case InsertionMode.IN_TABLE_BODY:
            case InsertionMode.IN_ROW:
            case InsertionMode.IN_CELL:
            case InsertionMode.IN_SELECT:
            case InsertionMode.IN_SELECT_IN_TABLE:
            case InsertionMode.IN_TEMPLATE:
            case InsertionMode.IN_FRAMESET:
            case InsertionMode.AFTER_FRAMESET:
                appendComment(this, token);
                break;
            case InsertionMode.IN_TABLE_TEXT:
                tokenInTableText(this, token);
                break;
            case InsertionMode.AFTER_BODY:
                appendCommentToRootHtmlElement(this, token);
                break;
            case InsertionMode.AFTER_AFTER_BODY:
            case InsertionMode.AFTER_AFTER_FRAMESET:
                appendCommentToDocument(this, token);
                break;
            default:
            // Do nothing
        }
    }
    onDoctype(token) {
        this.skipNextNewLine = false;
        switch (this.insertionMode) {
            case InsertionMode.INITIAL:
                doctypeInInitialMode(this, token);
                break;
            case InsertionMode.BEFORE_HEAD:
            case InsertionMode.IN_HEAD:
            case InsertionMode.IN_HEAD_NO_SCRIPT:
            case InsertionMode.AFTER_HEAD:
                this._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_6__.ERR.misplacedDoctype);
                break;
            case InsertionMode.IN_TABLE_TEXT:
                tokenInTableText(this, token);
                break;
            default:
            // Do nothing
        }
    }
    onStartTag(token) {
        this.skipNextNewLine = false;
        this.currentToken = token;
        this._processStartTag(token);
        if (token.selfClosing && !token.ackSelfClosing) {
            this._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_6__.ERR.nonVoidHtmlElementStartTagWithTrailingSolidus);
        }
    }
    /**
     * Processes a given start tag.
     *
     * `onStartTag` checks if a self-closing tag was recognized. When a token
     * is moved inbetween multiple insertion modes, this check for self-closing
     * could lead to false positives. To avoid this, `_processStartTag` is used
     * for nested calls.
     *
     * @param token The token to process.
     */
    _processStartTag(token) {
        if (this.shouldProcessStartTagTokenInForeignContent(token)) {
            startTagInForeignContent(this, token);
        }
        else {
            this._startTagOutsideForeignContent(token);
        }
    }
    _startTagOutsideForeignContent(token) {
        switch (this.insertionMode) {
            case InsertionMode.INITIAL:
                tokenInInitialMode(this, token);
                break;
            case InsertionMode.BEFORE_HTML:
                startTagBeforeHtml(this, token);
                break;
            case InsertionMode.BEFORE_HEAD:
                startTagBeforeHead(this, token);
                break;
            case InsertionMode.IN_HEAD:
                startTagInHead(this, token);
                break;
            case InsertionMode.IN_HEAD_NO_SCRIPT:
                startTagInHeadNoScript(this, token);
                break;
            case InsertionMode.AFTER_HEAD:
                startTagAfterHead(this, token);
                break;
            case InsertionMode.IN_BODY:
                startTagInBody(this, token);
                break;
            case InsertionMode.IN_TABLE:
                startTagInTable(this, token);
                break;
            case InsertionMode.IN_TABLE_TEXT:
                tokenInTableText(this, token);
                break;
            case InsertionMode.IN_CAPTION:
                startTagInCaption(this, token);
                break;
            case InsertionMode.IN_COLUMN_GROUP:
                startTagInColumnGroup(this, token);
                break;
            case InsertionMode.IN_TABLE_BODY:
                startTagInTableBody(this, token);
                break;
            case InsertionMode.IN_ROW:
                startTagInRow(this, token);
                break;
            case InsertionMode.IN_CELL:
                startTagInCell(this, token);
                break;
            case InsertionMode.IN_SELECT:
                startTagInSelect(this, token);
                break;
            case InsertionMode.IN_SELECT_IN_TABLE:
                startTagInSelectInTable(this, token);
                break;
            case InsertionMode.IN_TEMPLATE:
                startTagInTemplate(this, token);
                break;
            case InsertionMode.AFTER_BODY:
                startTagAfterBody(this, token);
                break;
            case InsertionMode.IN_FRAMESET:
                startTagInFrameset(this, token);
                break;
            case InsertionMode.AFTER_FRAMESET:
                startTagAfterFrameset(this, token);
                break;
            case InsertionMode.AFTER_AFTER_BODY:
                startTagAfterAfterBody(this, token);
                break;
            case InsertionMode.AFTER_AFTER_FRAMESET:
                startTagAfterAfterFrameset(this, token);
                break;
            default:
            // Do nothing
        }
    }
    onEndTag(token) {
        this.skipNextNewLine = false;
        this.currentToken = token;
        if (this.currentNotInHTML) {
            endTagInForeignContent(this, token);
        }
        else {
            this._endTagOutsideForeignContent(token);
        }
    }
    _endTagOutsideForeignContent(token) {
        switch (this.insertionMode) {
            case InsertionMode.INITIAL:
                tokenInInitialMode(this, token);
                break;
            case InsertionMode.BEFORE_HTML:
                endTagBeforeHtml(this, token);
                break;
            case InsertionMode.BEFORE_HEAD:
                endTagBeforeHead(this, token);
                break;
            case InsertionMode.IN_HEAD:
                endTagInHead(this, token);
                break;
            case InsertionMode.IN_HEAD_NO_SCRIPT:
                endTagInHeadNoScript(this, token);
                break;
            case InsertionMode.AFTER_HEAD:
                endTagAfterHead(this, token);
                break;
            case InsertionMode.IN_BODY:
                endTagInBody(this, token);
                break;
            case InsertionMode.TEXT:
                endTagInText(this, token);
                break;
            case InsertionMode.IN_TABLE:
                endTagInTable(this, token);
                break;
            case InsertionMode.IN_TABLE_TEXT:
                tokenInTableText(this, token);
                break;
            case InsertionMode.IN_CAPTION:
                endTagInCaption(this, token);
                break;
            case InsertionMode.IN_COLUMN_GROUP:
                endTagInColumnGroup(this, token);
                break;
            case InsertionMode.IN_TABLE_BODY:
                endTagInTableBody(this, token);
                break;
            case InsertionMode.IN_ROW:
                endTagInRow(this, token);
                break;
            case InsertionMode.IN_CELL:
                endTagInCell(this, token);
                break;
            case InsertionMode.IN_SELECT:
                endTagInSelect(this, token);
                break;
            case InsertionMode.IN_SELECT_IN_TABLE:
                endTagInSelectInTable(this, token);
                break;
            case InsertionMode.IN_TEMPLATE:
                endTagInTemplate(this, token);
                break;
            case InsertionMode.AFTER_BODY:
                endTagAfterBody(this, token);
                break;
            case InsertionMode.IN_FRAMESET:
                endTagInFrameset(this, token);
                break;
            case InsertionMode.AFTER_FRAMESET:
                endTagAfterFrameset(this, token);
                break;
            case InsertionMode.AFTER_AFTER_BODY:
                tokenAfterAfterBody(this, token);
                break;
            default:
            // Do nothing
        }
    }
    onEof(token) {
        switch (this.insertionMode) {
            case InsertionMode.INITIAL:
                tokenInInitialMode(this, token);
                break;
            case InsertionMode.BEFORE_HTML:
                tokenBeforeHtml(this, token);
                break;
            case InsertionMode.BEFORE_HEAD:
                tokenBeforeHead(this, token);
                break;
            case InsertionMode.IN_HEAD:
                tokenInHead(this, token);
                break;
            case InsertionMode.IN_HEAD_NO_SCRIPT:
                tokenInHeadNoScript(this, token);
                break;
            case InsertionMode.AFTER_HEAD:
                tokenAfterHead(this, token);
                break;
            case InsertionMode.IN_BODY:
            case InsertionMode.IN_TABLE:
            case InsertionMode.IN_CAPTION:
            case InsertionMode.IN_COLUMN_GROUP:
            case InsertionMode.IN_TABLE_BODY:
            case InsertionMode.IN_ROW:
            case InsertionMode.IN_CELL:
            case InsertionMode.IN_SELECT:
            case InsertionMode.IN_SELECT_IN_TABLE:
                eofInBody(this, token);
                break;
            case InsertionMode.TEXT:
                eofInText(this, token);
                break;
            case InsertionMode.IN_TABLE_TEXT:
                tokenInTableText(this, token);
                break;
            case InsertionMode.IN_TEMPLATE:
                eofInTemplate(this, token);
                break;
            case InsertionMode.AFTER_BODY:
            case InsertionMode.IN_FRAMESET:
            case InsertionMode.AFTER_FRAMESET:
            case InsertionMode.AFTER_AFTER_BODY:
            case InsertionMode.AFTER_AFTER_FRAMESET:
                stopParsing(this, token);
                break;
            default:
            // Do nothing
        }
    }
    onWhitespaceCharacter(token) {
        if (this.skipNextNewLine) {
            this.skipNextNewLine = false;
            if (token.chars.charCodeAt(0) === _common_unicode_js__WEBPACK_IMPORTED_MODULE_7__.CODE_POINTS.LINE_FEED) {
                if (token.chars.length === 1) {
                    return;
                }
                token.chars = token.chars.substr(1);
            }
        }
        if (this.tokenizer.inForeignNode) {
            this._insertCharacters(token);
            return;
        }
        switch (this.insertionMode) {
            case InsertionMode.IN_HEAD:
            case InsertionMode.IN_HEAD_NO_SCRIPT:
            case InsertionMode.AFTER_HEAD:
            case InsertionMode.TEXT:
            case InsertionMode.IN_COLUMN_GROUP:
            case InsertionMode.IN_SELECT:
            case InsertionMode.IN_SELECT_IN_TABLE:
            case InsertionMode.IN_FRAMESET:
            case InsertionMode.AFTER_FRAMESET:
                this._insertCharacters(token);
                break;
            case InsertionMode.IN_BODY:
            case InsertionMode.IN_CAPTION:
            case InsertionMode.IN_CELL:
            case InsertionMode.IN_TEMPLATE:
            case InsertionMode.AFTER_BODY:
            case InsertionMode.AFTER_AFTER_BODY:
            case InsertionMode.AFTER_AFTER_FRAMESET:
                whitespaceCharacterInBody(this, token);
                break;
            case InsertionMode.IN_TABLE:
            case InsertionMode.IN_TABLE_BODY:
            case InsertionMode.IN_ROW:
                characterInTable(this, token);
                break;
            case InsertionMode.IN_TABLE_TEXT:
                whitespaceCharacterInTableText(this, token);
                break;
            default:
            // Do nothing
        }
    }
}
//Adoption agency algorithm
//(see: http://www.whatwg.org/specs/web-apps/current-work/multipage/tree-construction.html#adoptionAgency)
//------------------------------------------------------------------
//Steps 5-8 of the algorithm
function aaObtainFormattingElementEntry(p, token) {
    let formattingElementEntry = p.activeFormattingElements.getElementEntryInScopeWithTagName(token.tagName);
    if (formattingElementEntry) {
        if (!p.openElements.contains(formattingElementEntry.element)) {
            p.activeFormattingElements.removeEntry(formattingElementEntry);
            formattingElementEntry = null;
        }
        else if (!p.openElements.hasInScope(token.tagID)) {
            formattingElementEntry = null;
        }
    }
    else {
        genericEndTagInBody(p, token);
    }
    return formattingElementEntry;
}
//Steps 9 and 10 of the algorithm
function aaObtainFurthestBlock(p, formattingElementEntry) {
    let furthestBlock = null;
    let idx = p.openElements.stackTop;
    for (; idx >= 0; idx--) {
        const element = p.openElements.items[idx];
        if (element === formattingElementEntry.element) {
            break;
        }
        if (p._isSpecialElement(element, p.openElements.tagIDs[idx])) {
            furthestBlock = element;
        }
    }
    if (!furthestBlock) {
        p.openElements.shortenToLength(idx < 0 ? 0 : idx);
        p.activeFormattingElements.removeEntry(formattingElementEntry);
    }
    return furthestBlock;
}
//Step 13 of the algorithm
function aaInnerLoop(p, furthestBlock, formattingElement) {
    let lastElement = furthestBlock;
    let nextElement = p.openElements.getCommonAncestor(furthestBlock);
    for (let i = 0, element = nextElement; element !== formattingElement; i++, element = nextElement) {
        //NOTE: store the next element for the next loop iteration (it may be deleted from the stack by step 9.5)
        nextElement = p.openElements.getCommonAncestor(element);
        const elementEntry = p.activeFormattingElements.getElementEntry(element);
        const counterOverflow = elementEntry && i >= AA_INNER_LOOP_ITER;
        const shouldRemoveFromOpenElements = !elementEntry || counterOverflow;
        if (shouldRemoveFromOpenElements) {
            if (counterOverflow) {
                p.activeFormattingElements.removeEntry(elementEntry);
            }
            p.openElements.remove(element);
        }
        else {
            element = aaRecreateElementFromEntry(p, elementEntry);
            if (lastElement === furthestBlock) {
                p.activeFormattingElements.bookmark = elementEntry;
            }
            p.treeAdapter.detachNode(lastElement);
            p.treeAdapter.appendChild(element, lastElement);
            lastElement = element;
        }
    }
    return lastElement;
}
//Step 13.7 of the algorithm
function aaRecreateElementFromEntry(p, elementEntry) {
    const ns = p.treeAdapter.getNamespaceURI(elementEntry.element);
    const newElement = p.treeAdapter.createElement(elementEntry.token.tagName, ns, elementEntry.token.attrs);
    p.openElements.replace(elementEntry.element, newElement);
    elementEntry.element = newElement;
    return newElement;
}
//Step 14 of the algorithm
function aaInsertLastNodeInCommonAncestor(p, commonAncestor, lastElement) {
    const tn = p.treeAdapter.getTagName(commonAncestor);
    const tid = (0,_common_html_js__WEBPACK_IMPORTED_MODULE_8__.getTagID)(tn);
    if (p._isElementCausesFosterParenting(tid)) {
        p._fosterParentElement(lastElement);
    }
    else {
        const ns = p.treeAdapter.getNamespaceURI(commonAncestor);
        if (tid === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEMPLATE && ns === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML) {
            commonAncestor = p.treeAdapter.getTemplateContent(commonAncestor);
        }
        p.treeAdapter.appendChild(commonAncestor, lastElement);
    }
}
//Steps 15-19 of the algorithm
function aaReplaceFormattingElement(p, furthestBlock, formattingElementEntry) {
    const ns = p.treeAdapter.getNamespaceURI(formattingElementEntry.element);
    const { token } = formattingElementEntry;
    const newElement = p.treeAdapter.createElement(token.tagName, ns, token.attrs);
    p._adoptNodes(furthestBlock, newElement);
    p.treeAdapter.appendChild(furthestBlock, newElement);
    p.activeFormattingElements.insertElementAfterBookmark(newElement, token);
    p.activeFormattingElements.removeEntry(formattingElementEntry);
    p.openElements.remove(formattingElementEntry.element);
    p.openElements.insertAfter(furthestBlock, newElement, token.tagID);
}
//Algorithm entry point
function callAdoptionAgency(p, token) {
    for (let i = 0; i < AA_OUTER_LOOP_ITER; i++) {
        const formattingElementEntry = aaObtainFormattingElementEntry(p, token);
        if (!formattingElementEntry) {
            break;
        }
        const furthestBlock = aaObtainFurthestBlock(p, formattingElementEntry);
        if (!furthestBlock) {
            break;
        }
        p.activeFormattingElements.bookmark = formattingElementEntry;
        const lastElement = aaInnerLoop(p, furthestBlock, formattingElementEntry.element);
        const commonAncestor = p.openElements.getCommonAncestor(formattingElementEntry.element);
        p.treeAdapter.detachNode(lastElement);
        if (commonAncestor)
            aaInsertLastNodeInCommonAncestor(p, commonAncestor, lastElement);
        aaReplaceFormattingElement(p, furthestBlock, formattingElementEntry);
    }
}
//Generic token handlers
//------------------------------------------------------------------
function appendComment(p, token) {
    p._appendCommentNode(token, p.openElements.currentTmplContentOrNode);
}
function appendCommentToRootHtmlElement(p, token) {
    p._appendCommentNode(token, p.openElements.items[0]);
}
function appendCommentToDocument(p, token) {
    p._appendCommentNode(token, p.document);
}
function stopParsing(p, token) {
    p.stopped = true;
    // NOTE: Set end locations for elements that remain on the open element stack.
    if (token.location) {
        // NOTE: If we are not in a fragment, `html` and `body` will stay on the stack.
        // This is a problem, as we might overwrite their end position here.
        const target = p.fragmentContext ? 0 : 2;
        for (let i = p.openElements.stackTop; i >= target; i--) {
            p._setEndLocation(p.openElements.items[i], token);
        }
        // Handle `html` and `body`
        if (!p.fragmentContext && p.openElements.stackTop >= 0) {
            const htmlElement = p.openElements.items[0];
            const htmlLocation = p.treeAdapter.getNodeSourceCodeLocation(htmlElement);
            if (htmlLocation && !htmlLocation.endTag) {
                p._setEndLocation(htmlElement, token);
                if (p.openElements.stackTop >= 1) {
                    const bodyElement = p.openElements.items[1];
                    const bodyLocation = p.treeAdapter.getNodeSourceCodeLocation(bodyElement);
                    if (bodyLocation && !bodyLocation.endTag) {
                        p._setEndLocation(bodyElement, token);
                    }
                }
            }
        }
    }
}
// The "initial" insertion mode
//------------------------------------------------------------------
function doctypeInInitialMode(p, token) {
    p._setDocumentType(token);
    const mode = token.forceQuirks ? _common_html_js__WEBPACK_IMPORTED_MODULE_8__.DOCUMENT_MODE.QUIRKS : _common_doctype_js__WEBPACK_IMPORTED_MODULE_4__.getDocumentMode(token);
    if (!_common_doctype_js__WEBPACK_IMPORTED_MODULE_4__.isConforming(token)) {
        p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_6__.ERR.nonConformingDoctype);
    }
    p.treeAdapter.setDocumentMode(p.document, mode);
    p.insertionMode = InsertionMode.BEFORE_HTML;
}
function tokenInInitialMode(p, token) {
    p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_6__.ERR.missingDoctype, true);
    p.treeAdapter.setDocumentMode(p.document, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.DOCUMENT_MODE.QUIRKS);
    p.insertionMode = InsertionMode.BEFORE_HTML;
    p._processToken(token);
}
// The "before html" insertion mode
//------------------------------------------------------------------
function startTagBeforeHtml(p, token) {
    if (token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML) {
        p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
        p.insertionMode = InsertionMode.BEFORE_HEAD;
    }
    else {
        tokenBeforeHtml(p, token);
    }
}
function endTagBeforeHtml(p, token) {
    const tn = token.tagID;
    if (tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HEAD || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BODY || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BR) {
        tokenBeforeHtml(p, token);
    }
}
function tokenBeforeHtml(p, token) {
    p._insertFakeRootElement();
    p.insertionMode = InsertionMode.BEFORE_HEAD;
    p._processToken(token);
}
// The "before head" insertion mode
//------------------------------------------------------------------
function startTagBeforeHead(p, token) {
    switch (token.tagID) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML: {
            startTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HEAD: {
            p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
            p.headElement = p.openElements.current;
            p.insertionMode = InsertionMode.IN_HEAD;
            break;
        }
        default: {
            tokenBeforeHead(p, token);
        }
    }
}
function endTagBeforeHead(p, token) {
    const tn = token.tagID;
    if (tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HEAD || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BODY || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BR) {
        tokenBeforeHead(p, token);
    }
    else {
        p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_6__.ERR.endTagWithoutMatchingOpenElement);
    }
}
function tokenBeforeHead(p, token) {
    p._insertFakeElement(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_NAMES.HEAD, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HEAD);
    p.headElement = p.openElements.current;
    p.insertionMode = InsertionMode.IN_HEAD;
    p._processToken(token);
}
// The "in head" insertion mode
//------------------------------------------------------------------
function startTagInHead(p, token) {
    switch (token.tagID) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML: {
            startTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BASE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BASEFONT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BGSOUND:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.LINK:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.META: {
            p._appendElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
            token.ackSelfClosing = true;
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TITLE: {
            p._switchToTextParsing(token, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.TokenizerMode.RCDATA);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.NOSCRIPT: {
            if (p.options.scriptingEnabled) {
                p._switchToTextParsing(token, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.TokenizerMode.RAWTEXT);
            }
            else {
                p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
                p.insertionMode = InsertionMode.IN_HEAD_NO_SCRIPT;
            }
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.NOFRAMES:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.STYLE: {
            p._switchToTextParsing(token, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.TokenizerMode.RAWTEXT);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SCRIPT: {
            p._switchToTextParsing(token, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.TokenizerMode.SCRIPT_DATA);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEMPLATE: {
            p._insertTemplate(token);
            p.activeFormattingElements.insertMarker();
            p.framesetOk = false;
            p.insertionMode = InsertionMode.IN_TEMPLATE;
            p.tmplInsertionModeStack.unshift(InsertionMode.IN_TEMPLATE);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HEAD: {
            p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_6__.ERR.misplacedStartTagForHeadElement);
            break;
        }
        default: {
            tokenInHead(p, token);
        }
    }
}
function endTagInHead(p, token) {
    switch (token.tagID) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HEAD: {
            p.openElements.pop();
            p.insertionMode = InsertionMode.AFTER_HEAD;
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BODY:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BR:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML: {
            tokenInHead(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEMPLATE: {
            if (p.openElements.tmplCount > 0) {
                p.openElements.generateImpliedEndTagsThoroughly();
                if (p.openElements.currentTagId !== _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEMPLATE) {
                    p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_6__.ERR.closingOfElementWithOpenChildElements);
                }
                p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEMPLATE);
                p.activeFormattingElements.clearToLastMarker();
                p.tmplInsertionModeStack.shift();
                p._resetInsertionMode();
            }
            else {
                p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_6__.ERR.endTagWithoutMatchingOpenElement);
            }
            break;
        }
        default: {
            p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_6__.ERR.endTagWithoutMatchingOpenElement);
        }
    }
}
function tokenInHead(p, token) {
    p.openElements.pop();
    p.insertionMode = InsertionMode.AFTER_HEAD;
    p._processToken(token);
}
// The "in head no script" insertion mode
//------------------------------------------------------------------
function startTagInHeadNoScript(p, token) {
    switch (token.tagID) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML: {
            startTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BASEFONT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BGSOUND:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HEAD:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.LINK:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.META:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.NOFRAMES:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.STYLE: {
            startTagInHead(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.NOSCRIPT: {
            p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_6__.ERR.nestedNoscriptInHead);
            break;
        }
        default: {
            tokenInHeadNoScript(p, token);
        }
    }
}
function endTagInHeadNoScript(p, token) {
    switch (token.tagID) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.NOSCRIPT: {
            p.openElements.pop();
            p.insertionMode = InsertionMode.IN_HEAD;
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BR: {
            tokenInHeadNoScript(p, token);
            break;
        }
        default: {
            p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_6__.ERR.endTagWithoutMatchingOpenElement);
        }
    }
}
function tokenInHeadNoScript(p, token) {
    const errCode = token.type === _common_token_js__WEBPACK_IMPORTED_MODULE_9__.TokenType.EOF ? _common_error_codes_js__WEBPACK_IMPORTED_MODULE_6__.ERR.openElementsLeftAfterEof : _common_error_codes_js__WEBPACK_IMPORTED_MODULE_6__.ERR.disallowedContentInNoscriptInHead;
    p._err(token, errCode);
    p.openElements.pop();
    p.insertionMode = InsertionMode.IN_HEAD;
    p._processToken(token);
}
// The "after head" insertion mode
//------------------------------------------------------------------
function startTagAfterHead(p, token) {
    switch (token.tagID) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML: {
            startTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BODY: {
            p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
            p.framesetOk = false;
            p.insertionMode = InsertionMode.IN_BODY;
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.FRAMESET: {
            p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
            p.insertionMode = InsertionMode.IN_FRAMESET;
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BASE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BASEFONT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BGSOUND:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.LINK:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.META:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.NOFRAMES:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SCRIPT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.STYLE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEMPLATE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TITLE: {
            p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_6__.ERR.abandonedHeadElementChild);
            p.openElements.push(p.headElement, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HEAD);
            startTagInHead(p, token);
            p.openElements.remove(p.headElement);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HEAD: {
            p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_6__.ERR.misplacedStartTagForHeadElement);
            break;
        }
        default: {
            tokenAfterHead(p, token);
        }
    }
}
function endTagAfterHead(p, token) {
    switch (token.tagID) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BODY:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BR: {
            tokenAfterHead(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEMPLATE: {
            endTagInHead(p, token);
            break;
        }
        default: {
            p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_6__.ERR.endTagWithoutMatchingOpenElement);
        }
    }
}
function tokenAfterHead(p, token) {
    p._insertFakeElement(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_NAMES.BODY, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BODY);
    p.insertionMode = InsertionMode.IN_BODY;
    modeInBody(p, token);
}
// The "in body" insertion mode
//------------------------------------------------------------------
function modeInBody(p, token) {
    switch (token.type) {
        case _common_token_js__WEBPACK_IMPORTED_MODULE_9__.TokenType.CHARACTER: {
            characterInBody(p, token);
            break;
        }
        case _common_token_js__WEBPACK_IMPORTED_MODULE_9__.TokenType.WHITESPACE_CHARACTER: {
            whitespaceCharacterInBody(p, token);
            break;
        }
        case _common_token_js__WEBPACK_IMPORTED_MODULE_9__.TokenType.COMMENT: {
            appendComment(p, token);
            break;
        }
        case _common_token_js__WEBPACK_IMPORTED_MODULE_9__.TokenType.START_TAG: {
            startTagInBody(p, token);
            break;
        }
        case _common_token_js__WEBPACK_IMPORTED_MODULE_9__.TokenType.END_TAG: {
            endTagInBody(p, token);
            break;
        }
        case _common_token_js__WEBPACK_IMPORTED_MODULE_9__.TokenType.EOF: {
            eofInBody(p, token);
            break;
        }
        default:
        // Do nothing
    }
}
function whitespaceCharacterInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertCharacters(token);
}
function characterInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertCharacters(token);
    p.framesetOk = false;
}
function htmlStartTagInBody(p, token) {
    if (p.openElements.tmplCount === 0) {
        p.treeAdapter.adoptAttributes(p.openElements.items[0], token.attrs);
    }
}
function bodyStartTagInBody(p, token) {
    const bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
    if (bodyElement && p.openElements.tmplCount === 0) {
        p.framesetOk = false;
        p.treeAdapter.adoptAttributes(bodyElement, token.attrs);
    }
}
function framesetStartTagInBody(p, token) {
    const bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
    if (p.framesetOk && bodyElement) {
        p.treeAdapter.detachNode(bodyElement);
        p.openElements.popAllUpToHtmlElement();
        p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
        p.insertionMode = InsertionMode.IN_FRAMESET;
    }
}
function addressStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.P)) {
        p._closePElement();
    }
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
}
function numberedHeaderStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.P)) {
        p._closePElement();
    }
    if ((0,_common_html_js__WEBPACK_IMPORTED_MODULE_8__.isNumberedHeader)(p.openElements.currentTagId)) {
        p.openElements.pop();
    }
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
}
function preStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.P)) {
        p._closePElement();
    }
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
    //NOTE: If the next token is a U+000A LINE FEED (LF) character token, then ignore that token and move
    //on to the next one. (Newlines at the start of pre blocks are ignored as an authoring convenience.)
    p.skipNextNewLine = true;
    p.framesetOk = false;
}
function formStartTagInBody(p, token) {
    const inTemplate = p.openElements.tmplCount > 0;
    if (!p.formElement || inTemplate) {
        if (p.openElements.hasInButtonScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.P)) {
            p._closePElement();
        }
        p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
        if (!inTemplate) {
            p.formElement = p.openElements.current;
        }
    }
}
function listItemStartTagInBody(p, token) {
    p.framesetOk = false;
    const tn = token.tagID;
    for (let i = p.openElements.stackTop; i >= 0; i--) {
        const elementId = p.openElements.tagIDs[i];
        if ((tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.LI && elementId === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.LI) ||
            ((tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.DD || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.DT) && (elementId === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.DD || elementId === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.DT))) {
            p.openElements.generateImpliedEndTagsWithExclusion(elementId);
            p.openElements.popUntilTagNamePopped(elementId);
            break;
        }
        if (elementId !== _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.ADDRESS &&
            elementId !== _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.DIV &&
            elementId !== _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.P &&
            p._isSpecialElement(p.openElements.items[i], elementId)) {
            break;
        }
    }
    if (p.openElements.hasInButtonScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.P)) {
        p._closePElement();
    }
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
}
function plaintextStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.P)) {
        p._closePElement();
    }
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
    p.tokenizer.state = _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.TokenizerMode.PLAINTEXT;
}
function buttonStartTagInBody(p, token) {
    if (p.openElements.hasInScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BUTTON)) {
        p.openElements.generateImpliedEndTags();
        p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BUTTON);
    }
    p._reconstructActiveFormattingElements();
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
    p.framesetOk = false;
}
function aStartTagInBody(p, token) {
    const activeElementEntry = p.activeFormattingElements.getElementEntryInScopeWithTagName(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_NAMES.A);
    if (activeElementEntry) {
        callAdoptionAgency(p, token);
        p.openElements.remove(activeElementEntry.element);
        p.activeFormattingElements.removeEntry(activeElementEntry);
    }
    p._reconstructActiveFormattingElements();
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
    p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function bStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
    p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function nobrStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    if (p.openElements.hasInScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.NOBR)) {
        callAdoptionAgency(p, token);
        p._reconstructActiveFormattingElements();
    }
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
    p.activeFormattingElements.pushElement(p.openElements.current, token);
}
function appletStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
    p.activeFormattingElements.insertMarker();
    p.framesetOk = false;
}
function tableStartTagInBody(p, token) {
    if (p.treeAdapter.getDocumentMode(p.document) !== _common_html_js__WEBPACK_IMPORTED_MODULE_8__.DOCUMENT_MODE.QUIRKS && p.openElements.hasInButtonScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.P)) {
        p._closePElement();
    }
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
    p.framesetOk = false;
    p.insertionMode = InsertionMode.IN_TABLE;
}
function areaStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._appendElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
    p.framesetOk = false;
    token.ackSelfClosing = true;
}
function isHiddenInput(token) {
    const inputType = (0,_common_token_js__WEBPACK_IMPORTED_MODULE_9__.getTokenAttr)(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.ATTRS.TYPE);
    return inputType != null && inputType.toLowerCase() === HIDDEN_INPUT_TYPE;
}
function inputStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._appendElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
    if (!isHiddenInput(token)) {
        p.framesetOk = false;
    }
    token.ackSelfClosing = true;
}
function paramStartTagInBody(p, token) {
    p._appendElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
    token.ackSelfClosing = true;
}
function hrStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.P)) {
        p._closePElement();
    }
    p._appendElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
    p.framesetOk = false;
    token.ackSelfClosing = true;
}
function imageStartTagInBody(p, token) {
    token.tagName = _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_NAMES.IMG;
    token.tagID = _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.IMG;
    areaStartTagInBody(p, token);
}
function textareaStartTagInBody(p, token) {
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
    //NOTE: If the next token is a U+000A LINE FEED (LF) character token, then ignore that token and move
    //on to the next one. (Newlines at the start of textarea elements are ignored as an authoring convenience.)
    p.skipNextNewLine = true;
    p.tokenizer.state = _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.TokenizerMode.RCDATA;
    p.originalInsertionMode = p.insertionMode;
    p.framesetOk = false;
    p.insertionMode = InsertionMode.TEXT;
}
function xmpStartTagInBody(p, token) {
    if (p.openElements.hasInButtonScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.P)) {
        p._closePElement();
    }
    p._reconstructActiveFormattingElements();
    p.framesetOk = false;
    p._switchToTextParsing(token, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.TokenizerMode.RAWTEXT);
}
function iframeStartTagInBody(p, token) {
    p.framesetOk = false;
    p._switchToTextParsing(token, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.TokenizerMode.RAWTEXT);
}
//NOTE: here we assume that we always act as an user agent with enabled plugins, so we parse
//<noembed> as rawtext.
function noembedStartTagInBody(p, token) {
    p._switchToTextParsing(token, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.TokenizerMode.RAWTEXT);
}
function selectStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
    p.framesetOk = false;
    p.insertionMode =
        p.insertionMode === InsertionMode.IN_TABLE ||
            p.insertionMode === InsertionMode.IN_CAPTION ||
            p.insertionMode === InsertionMode.IN_TABLE_BODY ||
            p.insertionMode === InsertionMode.IN_ROW ||
            p.insertionMode === InsertionMode.IN_CELL
            ? InsertionMode.IN_SELECT_IN_TABLE
            : InsertionMode.IN_SELECT;
}
function optgroupStartTagInBody(p, token) {
    if (p.openElements.currentTagId === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.OPTION) {
        p.openElements.pop();
    }
    p._reconstructActiveFormattingElements();
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
}
function rbStartTagInBody(p, token) {
    if (p.openElements.hasInScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.RUBY)) {
        p.openElements.generateImpliedEndTags();
    }
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
}
function rtStartTagInBody(p, token) {
    if (p.openElements.hasInScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.RUBY)) {
        p.openElements.generateImpliedEndTagsWithExclusion(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.RTC);
    }
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
}
function mathStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_5__.adjustTokenMathMLAttrs(token);
    _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_5__.adjustTokenXMLAttrs(token);
    if (token.selfClosing) {
        p._appendElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.MATHML);
    }
    else {
        p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.MATHML);
    }
    token.ackSelfClosing = true;
}
function svgStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_5__.adjustTokenSVGAttrs(token);
    _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_5__.adjustTokenXMLAttrs(token);
    if (token.selfClosing) {
        p._appendElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.SVG);
    }
    else {
        p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.SVG);
    }
    token.ackSelfClosing = true;
}
function genericStartTagInBody(p, token) {
    p._reconstructActiveFormattingElements();
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
}
function startTagInBody(p, token) {
    switch (token.tagID) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.I:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.S:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.B:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.U:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.EM:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BIG:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.CODE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.FONT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SMALL:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.STRIKE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.STRONG: {
            bStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.A: {
            aStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.H1:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.H2:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.H3:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.H4:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.H5:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.H6: {
            numberedHeaderStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.P:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.DL:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.OL:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.UL:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.DIV:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.DIR:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.NAV:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.MAIN:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.MENU:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.ASIDE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.CENTER:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.FIGURE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.FOOTER:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HEADER:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HGROUP:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.DIALOG:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.DETAILS:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.ADDRESS:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.ARTICLE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SECTION:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SUMMARY:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.FIELDSET:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BLOCKQUOTE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.FIGCAPTION: {
            addressStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.LI:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.DD:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.DT: {
            listItemStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BR:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.IMG:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.WBR:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.AREA:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.EMBED:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.KEYGEN: {
            areaStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HR: {
            hrStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.RB:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.RTC: {
            rbStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.RT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.RP: {
            rtStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.PRE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.LISTING: {
            preStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.XMP: {
            xmpStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SVG: {
            svgStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML: {
            htmlStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BASE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.LINK:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.META:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.STYLE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TITLE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SCRIPT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BGSOUND:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BASEFONT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEMPLATE: {
            startTagInHead(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BODY: {
            bodyStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.FORM: {
            formStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.NOBR: {
            nobrStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.MATH: {
            mathStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TABLE: {
            tableStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.INPUT: {
            inputStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.PARAM:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TRACK:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SOURCE: {
            paramStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.IMAGE: {
            imageStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BUTTON: {
            buttonStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.APPLET:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.OBJECT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.MARQUEE: {
            appletStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.IFRAME: {
            iframeStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SELECT: {
            selectStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.OPTION:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.OPTGROUP: {
            optgroupStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.NOEMBED: {
            noembedStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.FRAMESET: {
            framesetStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEXTAREA: {
            textareaStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.NOSCRIPT: {
            if (p.options.scriptingEnabled) {
                noembedStartTagInBody(p, token);
            }
            else {
                genericStartTagInBody(p, token);
            }
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.PLAINTEXT: {
            plaintextStartTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COL:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TH:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TD:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TR:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HEAD:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.FRAME:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TBODY:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TFOOT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.THEAD:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.CAPTION:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COLGROUP: {
            // Ignore token
            break;
        }
        default: {
            genericStartTagInBody(p, token);
        }
    }
}
function bodyEndTagInBody(p, token) {
    if (p.openElements.hasInScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BODY)) {
        p.insertionMode = InsertionMode.AFTER_BODY;
        //NOTE: <body> is never popped from the stack, so we need to updated
        //the end location explicitly.
        if (p.options.sourceCodeLocationInfo) {
            const bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
            if (bodyElement) {
                p._setEndLocation(bodyElement, token);
            }
        }
    }
}
function htmlEndTagInBody(p, token) {
    if (p.openElements.hasInScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BODY)) {
        p.insertionMode = InsertionMode.AFTER_BODY;
        endTagAfterBody(p, token);
    }
}
function addressEndTagInBody(p, token) {
    const tn = token.tagID;
    if (p.openElements.hasInScope(tn)) {
        p.openElements.generateImpliedEndTags();
        p.openElements.popUntilTagNamePopped(tn);
    }
}
function formEndTagInBody(p) {
    const inTemplate = p.openElements.tmplCount > 0;
    const { formElement } = p;
    if (!inTemplate) {
        p.formElement = null;
    }
    if ((formElement || inTemplate) && p.openElements.hasInScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.FORM)) {
        p.openElements.generateImpliedEndTags();
        if (inTemplate) {
            p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.FORM);
        }
        else if (formElement) {
            p.openElements.remove(formElement);
        }
    }
}
function pEndTagInBody(p) {
    if (!p.openElements.hasInButtonScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.P)) {
        p._insertFakeElement(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_NAMES.P, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.P);
    }
    p._closePElement();
}
function liEndTagInBody(p) {
    if (p.openElements.hasInListItemScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.LI)) {
        p.openElements.generateImpliedEndTagsWithExclusion(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.LI);
        p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.LI);
    }
}
function ddEndTagInBody(p, token) {
    const tn = token.tagID;
    if (p.openElements.hasInScope(tn)) {
        p.openElements.generateImpliedEndTagsWithExclusion(tn);
        p.openElements.popUntilTagNamePopped(tn);
    }
}
function numberedHeaderEndTagInBody(p) {
    if (p.openElements.hasNumberedHeaderInScope()) {
        p.openElements.generateImpliedEndTags();
        p.openElements.popUntilNumberedHeaderPopped();
    }
}
function appletEndTagInBody(p, token) {
    const tn = token.tagID;
    if (p.openElements.hasInScope(tn)) {
        p.openElements.generateImpliedEndTags();
        p.openElements.popUntilTagNamePopped(tn);
        p.activeFormattingElements.clearToLastMarker();
    }
}
function brEndTagInBody(p) {
    p._reconstructActiveFormattingElements();
    p._insertFakeElement(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_NAMES.BR, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BR);
    p.openElements.pop();
    p.framesetOk = false;
}
function genericEndTagInBody(p, token) {
    const tn = token.tagName;
    const tid = token.tagID;
    for (let i = p.openElements.stackTop; i > 0; i--) {
        const element = p.openElements.items[i];
        const elementId = p.openElements.tagIDs[i];
        // Compare the tag name here, as the tag might not be a known tag with an ID.
        if (tid === elementId && (tid !== _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.UNKNOWN || p.treeAdapter.getTagName(element) === tn)) {
            p.openElements.generateImpliedEndTagsWithExclusion(tid);
            if (p.openElements.stackTop >= i)
                p.openElements.shortenToLength(i);
            break;
        }
        if (p._isSpecialElement(element, elementId)) {
            break;
        }
    }
}
function endTagInBody(p, token) {
    switch (token.tagID) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.A:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.B:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.I:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.S:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.U:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.EM:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BIG:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.CODE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.FONT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.NOBR:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SMALL:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.STRIKE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.STRONG: {
            callAdoptionAgency(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.P: {
            pEndTagInBody(p);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.DL:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.UL:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.OL:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.DIR:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.DIV:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.NAV:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.PRE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.MAIN:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.MENU:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.ASIDE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.CENTER:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.FIGURE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.FOOTER:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HEADER:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HGROUP:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.DIALOG:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.ADDRESS:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.ARTICLE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.DETAILS:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SECTION:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SUMMARY:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.LISTING:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.FIELDSET:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BLOCKQUOTE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.FIGCAPTION: {
            addressEndTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.LI: {
            liEndTagInBody(p);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.DD:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.DT: {
            ddEndTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.H1:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.H2:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.H3:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.H4:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.H5:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.H6: {
            numberedHeaderEndTagInBody(p);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BR: {
            brEndTagInBody(p);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BODY: {
            bodyEndTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML: {
            htmlEndTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.FORM: {
            formEndTagInBody(p);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.APPLET:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.OBJECT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.MARQUEE: {
            appletEndTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEMPLATE: {
            endTagInHead(p, token);
            break;
        }
        default: {
            genericEndTagInBody(p, token);
        }
    }
}
function eofInBody(p, token) {
    if (p.tmplInsertionModeStack.length > 0) {
        eofInTemplate(p, token);
    }
    else {
        stopParsing(p, token);
    }
}
// The "text" insertion mode
//------------------------------------------------------------------
function endTagInText(p, token) {
    var _a;
    if (token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SCRIPT) {
        (_a = p.scriptHandler) === null || _a === void 0 ? void 0 : _a.call(p, p.openElements.current);
    }
    p.openElements.pop();
    p.insertionMode = p.originalInsertionMode;
}
function eofInText(p, token) {
    p._err(token, _common_error_codes_js__WEBPACK_IMPORTED_MODULE_6__.ERR.eofInElementThatCanContainOnlyText);
    p.openElements.pop();
    p.insertionMode = p.originalInsertionMode;
    p.onEof(token);
}
// The "in table" insertion mode
//------------------------------------------------------------------
function characterInTable(p, token) {
    if (TABLE_STRUCTURE_TAGS.has(p.openElements.currentTagId)) {
        p.pendingCharacterTokens.length = 0;
        p.hasNonWhitespacePendingCharacterToken = false;
        p.originalInsertionMode = p.insertionMode;
        p.insertionMode = InsertionMode.IN_TABLE_TEXT;
        switch (token.type) {
            case _common_token_js__WEBPACK_IMPORTED_MODULE_9__.TokenType.CHARACTER: {
                characterInTableText(p, token);
                break;
            }
            case _common_token_js__WEBPACK_IMPORTED_MODULE_9__.TokenType.WHITESPACE_CHARACTER: {
                whitespaceCharacterInTableText(p, token);
                break;
            }
            // Ignore null
        }
    }
    else {
        tokenInTable(p, token);
    }
}
function captionStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p.activeFormattingElements.insertMarker();
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
    p.insertionMode = InsertionMode.IN_CAPTION;
}
function colgroupStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
    p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
}
function colStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p._insertFakeElement(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_NAMES.COLGROUP, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COLGROUP);
    p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
    startTagInColumnGroup(p, token);
}
function tbodyStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
    p.insertionMode = InsertionMode.IN_TABLE_BODY;
}
function tdStartTagInTable(p, token) {
    p.openElements.clearBackToTableContext();
    p._insertFakeElement(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_NAMES.TBODY, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TBODY);
    p.insertionMode = InsertionMode.IN_TABLE_BODY;
    startTagInTableBody(p, token);
}
function tableStartTagInTable(p, token) {
    if (p.openElements.hasInTableScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TABLE)) {
        p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TABLE);
        p._resetInsertionMode();
        p._processStartTag(token);
    }
}
function inputStartTagInTable(p, token) {
    if (isHiddenInput(token)) {
        p._appendElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
    }
    else {
        tokenInTable(p, token);
    }
    token.ackSelfClosing = true;
}
function formStartTagInTable(p, token) {
    if (!p.formElement && p.openElements.tmplCount === 0) {
        p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
        p.formElement = p.openElements.current;
        p.openElements.pop();
    }
}
function startTagInTable(p, token) {
    switch (token.tagID) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TD:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TH:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TR: {
            tdStartTagInTable(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.STYLE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SCRIPT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEMPLATE: {
            startTagInHead(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COL: {
            colStartTagInTable(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.FORM: {
            formStartTagInTable(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TABLE: {
            tableStartTagInTable(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TBODY:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TFOOT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.THEAD: {
            tbodyStartTagInTable(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.INPUT: {
            inputStartTagInTable(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.CAPTION: {
            captionStartTagInTable(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COLGROUP: {
            colgroupStartTagInTable(p, token);
            break;
        }
        default: {
            tokenInTable(p, token);
        }
    }
}
function endTagInTable(p, token) {
    switch (token.tagID) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TABLE: {
            if (p.openElements.hasInTableScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TABLE)) {
                p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TABLE);
                p._resetInsertionMode();
            }
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEMPLATE: {
            endTagInHead(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BODY:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.CAPTION:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COL:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COLGROUP:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TBODY:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TD:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TFOOT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TH:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.THEAD:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TR: {
            // Ignore token
            break;
        }
        default: {
            tokenInTable(p, token);
        }
    }
}
function tokenInTable(p, token) {
    const savedFosterParentingState = p.fosterParentingEnabled;
    p.fosterParentingEnabled = true;
    // Process token in `In Body` mode
    modeInBody(p, token);
    p.fosterParentingEnabled = savedFosterParentingState;
}
// The "in table text" insertion mode
//------------------------------------------------------------------
function whitespaceCharacterInTableText(p, token) {
    p.pendingCharacterTokens.push(token);
}
function characterInTableText(p, token) {
    p.pendingCharacterTokens.push(token);
    p.hasNonWhitespacePendingCharacterToken = true;
}
function tokenInTableText(p, token) {
    let i = 0;
    if (p.hasNonWhitespacePendingCharacterToken) {
        for (; i < p.pendingCharacterTokens.length; i++) {
            tokenInTable(p, p.pendingCharacterTokens[i]);
        }
    }
    else {
        for (; i < p.pendingCharacterTokens.length; i++) {
            p._insertCharacters(p.pendingCharacterTokens[i]);
        }
    }
    p.insertionMode = p.originalInsertionMode;
    p._processToken(token);
}
// The "in caption" insertion mode
//------------------------------------------------------------------
const TABLE_VOID_ELEMENTS = new Set([_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.CAPTION, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COL, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COLGROUP, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TBODY, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TD, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TFOOT, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TH, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.THEAD, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TR]);
function startTagInCaption(p, token) {
    const tn = token.tagID;
    if (TABLE_VOID_ELEMENTS.has(tn)) {
        if (p.openElements.hasInTableScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.CAPTION)) {
            p.openElements.generateImpliedEndTags();
            p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.CAPTION);
            p.activeFormattingElements.clearToLastMarker();
            p.insertionMode = InsertionMode.IN_TABLE;
            startTagInTable(p, token);
        }
    }
    else {
        startTagInBody(p, token);
    }
}
function endTagInCaption(p, token) {
    const tn = token.tagID;
    switch (tn) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.CAPTION:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TABLE: {
            if (p.openElements.hasInTableScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.CAPTION)) {
                p.openElements.generateImpliedEndTags();
                p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.CAPTION);
                p.activeFormattingElements.clearToLastMarker();
                p.insertionMode = InsertionMode.IN_TABLE;
                if (tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TABLE) {
                    endTagInTable(p, token);
                }
            }
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BODY:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COL:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COLGROUP:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TBODY:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TD:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TFOOT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TH:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.THEAD:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TR: {
            // Ignore token
            break;
        }
        default: {
            endTagInBody(p, token);
        }
    }
}
// The "in column group" insertion mode
//------------------------------------------------------------------
function startTagInColumnGroup(p, token) {
    switch (token.tagID) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML: {
            startTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COL: {
            p._appendElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
            token.ackSelfClosing = true;
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEMPLATE: {
            startTagInHead(p, token);
            break;
        }
        default: {
            tokenInColumnGroup(p, token);
        }
    }
}
function endTagInColumnGroup(p, token) {
    switch (token.tagID) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COLGROUP: {
            if (p.openElements.currentTagId === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COLGROUP) {
                p.openElements.pop();
                p.insertionMode = InsertionMode.IN_TABLE;
            }
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEMPLATE: {
            endTagInHead(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COL: {
            // Ignore token
            break;
        }
        default: {
            tokenInColumnGroup(p, token);
        }
    }
}
function tokenInColumnGroup(p, token) {
    if (p.openElements.currentTagId === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COLGROUP) {
        p.openElements.pop();
        p.insertionMode = InsertionMode.IN_TABLE;
        p._processToken(token);
    }
}
// The "in table body" insertion mode
//------------------------------------------------------------------
function startTagInTableBody(p, token) {
    switch (token.tagID) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TR: {
            p.openElements.clearBackToTableBodyContext();
            p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
            p.insertionMode = InsertionMode.IN_ROW;
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TH:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TD: {
            p.openElements.clearBackToTableBodyContext();
            p._insertFakeElement(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_NAMES.TR, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TR);
            p.insertionMode = InsertionMode.IN_ROW;
            startTagInRow(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.CAPTION:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COL:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COLGROUP:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TBODY:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TFOOT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.THEAD: {
            if (p.openElements.hasTableBodyContextInTableScope()) {
                p.openElements.clearBackToTableBodyContext();
                p.openElements.pop();
                p.insertionMode = InsertionMode.IN_TABLE;
                startTagInTable(p, token);
            }
            break;
        }
        default: {
            startTagInTable(p, token);
        }
    }
}
function endTagInTableBody(p, token) {
    const tn = token.tagID;
    switch (token.tagID) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TBODY:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TFOOT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.THEAD: {
            if (p.openElements.hasInTableScope(tn)) {
                p.openElements.clearBackToTableBodyContext();
                p.openElements.pop();
                p.insertionMode = InsertionMode.IN_TABLE;
            }
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TABLE: {
            if (p.openElements.hasTableBodyContextInTableScope()) {
                p.openElements.clearBackToTableBodyContext();
                p.openElements.pop();
                p.insertionMode = InsertionMode.IN_TABLE;
                endTagInTable(p, token);
            }
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BODY:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.CAPTION:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COL:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COLGROUP:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TD:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TH:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TR: {
            // Ignore token
            break;
        }
        default: {
            endTagInTable(p, token);
        }
    }
}
// The "in row" insertion mode
//------------------------------------------------------------------
function startTagInRow(p, token) {
    switch (token.tagID) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TH:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TD: {
            p.openElements.clearBackToTableRowContext();
            p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
            p.insertionMode = InsertionMode.IN_CELL;
            p.activeFormattingElements.insertMarker();
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.CAPTION:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COL:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COLGROUP:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TBODY:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TFOOT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.THEAD:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TR: {
            if (p.openElements.hasInTableScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TR)) {
                p.openElements.clearBackToTableRowContext();
                p.openElements.pop();
                p.insertionMode = InsertionMode.IN_TABLE_BODY;
                startTagInTableBody(p, token);
            }
            break;
        }
        default: {
            startTagInTable(p, token);
        }
    }
}
function endTagInRow(p, token) {
    switch (token.tagID) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TR: {
            if (p.openElements.hasInTableScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TR)) {
                p.openElements.clearBackToTableRowContext();
                p.openElements.pop();
                p.insertionMode = InsertionMode.IN_TABLE_BODY;
            }
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TABLE: {
            if (p.openElements.hasInTableScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TR)) {
                p.openElements.clearBackToTableRowContext();
                p.openElements.pop();
                p.insertionMode = InsertionMode.IN_TABLE_BODY;
                endTagInTableBody(p, token);
            }
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TBODY:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TFOOT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.THEAD: {
            if (p.openElements.hasInTableScope(token.tagID) || p.openElements.hasInTableScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TR)) {
                p.openElements.clearBackToTableRowContext();
                p.openElements.pop();
                p.insertionMode = InsertionMode.IN_TABLE_BODY;
                endTagInTableBody(p, token);
            }
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BODY:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.CAPTION:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COL:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COLGROUP:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TD:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TH: {
            // Ignore end tag
            break;
        }
        default:
            endTagInTable(p, token);
    }
}
// The "in cell" insertion mode
//------------------------------------------------------------------
function startTagInCell(p, token) {
    const tn = token.tagID;
    if (TABLE_VOID_ELEMENTS.has(tn)) {
        if (p.openElements.hasInTableScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TD) || p.openElements.hasInTableScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TH)) {
            p._closeTableCell();
            startTagInRow(p, token);
        }
    }
    else {
        startTagInBody(p, token);
    }
}
function endTagInCell(p, token) {
    const tn = token.tagID;
    switch (tn) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TD:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TH: {
            if (p.openElements.hasInTableScope(tn)) {
                p.openElements.generateImpliedEndTags();
                p.openElements.popUntilTagNamePopped(tn);
                p.activeFormattingElements.clearToLastMarker();
                p.insertionMode = InsertionMode.IN_ROW;
            }
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TABLE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TBODY:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TFOOT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.THEAD:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TR: {
            if (p.openElements.hasInTableScope(tn)) {
                p._closeTableCell();
                endTagInRow(p, token);
            }
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BODY:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.CAPTION:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COL:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COLGROUP:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML: {
            // Ignore token
            break;
        }
        default: {
            endTagInBody(p, token);
        }
    }
}
// The "in select" insertion mode
//------------------------------------------------------------------
function startTagInSelect(p, token) {
    switch (token.tagID) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML: {
            startTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.OPTION: {
            if (p.openElements.currentTagId === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.OPTION) {
                p.openElements.pop();
            }
            p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.OPTGROUP: {
            if (p.openElements.currentTagId === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.OPTION) {
                p.openElements.pop();
            }
            if (p.openElements.currentTagId === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.OPTGROUP) {
                p.openElements.pop();
            }
            p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.INPUT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.KEYGEN:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEXTAREA:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SELECT: {
            if (p.openElements.hasInSelectScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SELECT)) {
                p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SELECT);
                p._resetInsertionMode();
                if (token.tagID !== _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SELECT) {
                    p._processStartTag(token);
                }
            }
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SCRIPT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEMPLATE: {
            startTagInHead(p, token);
            break;
        }
        default:
        // Do nothing
    }
}
function endTagInSelect(p, token) {
    switch (token.tagID) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.OPTGROUP: {
            if (p.openElements.stackTop > 0 &&
                p.openElements.currentTagId === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.OPTION &&
                p.openElements.tagIDs[p.openElements.stackTop - 1] === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.OPTGROUP) {
                p.openElements.pop();
            }
            if (p.openElements.currentTagId === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.OPTGROUP) {
                p.openElements.pop();
            }
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.OPTION: {
            if (p.openElements.currentTagId === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.OPTION) {
                p.openElements.pop();
            }
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SELECT: {
            if (p.openElements.hasInSelectScope(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SELECT)) {
                p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SELECT);
                p._resetInsertionMode();
            }
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEMPLATE: {
            endTagInHead(p, token);
            break;
        }
        default:
        // Do nothing
    }
}
// The "in select in table" insertion mode
//------------------------------------------------------------------
function startTagInSelectInTable(p, token) {
    const tn = token.tagID;
    if (tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.CAPTION ||
        tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TABLE ||
        tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TBODY ||
        tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TFOOT ||
        tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.THEAD ||
        tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TR ||
        tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TD ||
        tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TH) {
        p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SELECT);
        p._resetInsertionMode();
        p._processStartTag(token);
    }
    else {
        startTagInSelect(p, token);
    }
}
function endTagInSelectInTable(p, token) {
    const tn = token.tagID;
    if (tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.CAPTION ||
        tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TABLE ||
        tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TBODY ||
        tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TFOOT ||
        tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.THEAD ||
        tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TR ||
        tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TD ||
        tn === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TH) {
        if (p.openElements.hasInTableScope(tn)) {
            p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SELECT);
            p._resetInsertionMode();
            p.onEndTag(token);
        }
    }
    else {
        endTagInSelect(p, token);
    }
}
// The "in template" insertion mode
//------------------------------------------------------------------
function startTagInTemplate(p, token) {
    switch (token.tagID) {
        // First, handle tags that can start without a mode change
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BASE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BASEFONT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BGSOUND:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.LINK:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.META:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.NOFRAMES:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.SCRIPT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.STYLE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEMPLATE:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TITLE:
            startTagInHead(p, token);
            break;
        // Re-process the token in the appropriate mode
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.CAPTION:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COLGROUP:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TBODY:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TFOOT:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.THEAD:
            p.tmplInsertionModeStack[0] = InsertionMode.IN_TABLE;
            p.insertionMode = InsertionMode.IN_TABLE;
            startTagInTable(p, token);
            break;
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.COL:
            p.tmplInsertionModeStack[0] = InsertionMode.IN_COLUMN_GROUP;
            p.insertionMode = InsertionMode.IN_COLUMN_GROUP;
            startTagInColumnGroup(p, token);
            break;
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TR:
            p.tmplInsertionModeStack[0] = InsertionMode.IN_TABLE_BODY;
            p.insertionMode = InsertionMode.IN_TABLE_BODY;
            startTagInTableBody(p, token);
            break;
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TD:
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TH:
            p.tmplInsertionModeStack[0] = InsertionMode.IN_ROW;
            p.insertionMode = InsertionMode.IN_ROW;
            startTagInRow(p, token);
            break;
        default:
            p.tmplInsertionModeStack[0] = InsertionMode.IN_BODY;
            p.insertionMode = InsertionMode.IN_BODY;
            startTagInBody(p, token);
    }
}
function endTagInTemplate(p, token) {
    if (token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEMPLATE) {
        endTagInHead(p, token);
    }
}
function eofInTemplate(p, token) {
    if (p.openElements.tmplCount > 0) {
        p.openElements.popUntilTagNamePopped(_common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.TEMPLATE);
        p.activeFormattingElements.clearToLastMarker();
        p.tmplInsertionModeStack.shift();
        p._resetInsertionMode();
        p.onEof(token);
    }
    else {
        stopParsing(p, token);
    }
}
// The "after body" insertion mode
//------------------------------------------------------------------
function startTagAfterBody(p, token) {
    if (token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML) {
        startTagInBody(p, token);
    }
    else {
        tokenAfterBody(p, token);
    }
}
function endTagAfterBody(p, token) {
    var _a;
    if (token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML) {
        if (!p.fragmentContext) {
            p.insertionMode = InsertionMode.AFTER_AFTER_BODY;
        }
        //NOTE: <html> is never popped from the stack, so we need to updated
        //the end location explicitly.
        if (p.options.sourceCodeLocationInfo && p.openElements.tagIDs[0] === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML) {
            p._setEndLocation(p.openElements.items[0], token);
            // Update the body element, if it doesn't have an end tag
            const bodyElement = p.openElements.items[1];
            if (bodyElement && !((_a = p.treeAdapter.getNodeSourceCodeLocation(bodyElement)) === null || _a === void 0 ? void 0 : _a.endTag)) {
                p._setEndLocation(bodyElement, token);
            }
        }
    }
    else {
        tokenAfterBody(p, token);
    }
}
function tokenAfterBody(p, token) {
    p.insertionMode = InsertionMode.IN_BODY;
    modeInBody(p, token);
}
// The "in frameset" insertion mode
//------------------------------------------------------------------
function startTagInFrameset(p, token) {
    switch (token.tagID) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML: {
            startTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.FRAMESET: {
            p._insertElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.FRAME: {
            p._appendElement(token, _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML);
            token.ackSelfClosing = true;
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.NOFRAMES: {
            startTagInHead(p, token);
            break;
        }
        default:
        // Do nothing
    }
}
function endTagInFrameset(p, token) {
    if (token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.FRAMESET && !p.openElements.isRootHtmlElementCurrent()) {
        p.openElements.pop();
        if (!p.fragmentContext && p.openElements.currentTagId !== _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.FRAMESET) {
            p.insertionMode = InsertionMode.AFTER_FRAMESET;
        }
    }
}
// The "after frameset" insertion mode
//------------------------------------------------------------------
function startTagAfterFrameset(p, token) {
    switch (token.tagID) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML: {
            startTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.NOFRAMES: {
            startTagInHead(p, token);
            break;
        }
        default:
        // Do nothing
    }
}
function endTagAfterFrameset(p, token) {
    if (token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML) {
        p.insertionMode = InsertionMode.AFTER_AFTER_FRAMESET;
    }
}
// The "after after body" insertion mode
//------------------------------------------------------------------
function startTagAfterAfterBody(p, token) {
    if (token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML) {
        startTagInBody(p, token);
    }
    else {
        tokenAfterAfterBody(p, token);
    }
}
function tokenAfterAfterBody(p, token) {
    p.insertionMode = InsertionMode.IN_BODY;
    modeInBody(p, token);
}
// The "after after frameset" insertion mode
//------------------------------------------------------------------
function startTagAfterAfterFrameset(p, token) {
    switch (token.tagID) {
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.HTML: {
            startTagInBody(p, token);
            break;
        }
        case _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.NOFRAMES: {
            startTagInHead(p, token);
            break;
        }
        default:
        // Do nothing
    }
}
// The rules for parsing tokens in foreign content
//------------------------------------------------------------------
function nullCharacterInForeignContent(p, token) {
    token.chars = _common_unicode_js__WEBPACK_IMPORTED_MODULE_7__.REPLACEMENT_CHARACTER;
    p._insertCharacters(token);
}
function characterInForeignContent(p, token) {
    p._insertCharacters(token);
    p.framesetOk = false;
}
function popUntilHtmlOrIntegrationPoint(p) {
    while (p.treeAdapter.getNamespaceURI(p.openElements.current) !== _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML &&
        !p._isIntegrationPoint(p.openElements.currentTagId, p.openElements.current)) {
        p.openElements.pop();
    }
}
function startTagInForeignContent(p, token) {
    if (_common_foreign_content_js__WEBPACK_IMPORTED_MODULE_5__.causesExit(token)) {
        popUntilHtmlOrIntegrationPoint(p);
        p._startTagOutsideForeignContent(token);
    }
    else {
        const current = p._getAdjustedCurrentElement();
        const currentNs = p.treeAdapter.getNamespaceURI(current);
        if (currentNs === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.MATHML) {
            _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_5__.adjustTokenMathMLAttrs(token);
        }
        else if (currentNs === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.SVG) {
            _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_5__.adjustTokenSVGTagName(token);
            _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_5__.adjustTokenSVGAttrs(token);
        }
        _common_foreign_content_js__WEBPACK_IMPORTED_MODULE_5__.adjustTokenXMLAttrs(token);
        if (token.selfClosing) {
            p._appendElement(token, currentNs);
        }
        else {
            p._insertElement(token, currentNs);
        }
        token.ackSelfClosing = true;
    }
}
function endTagInForeignContent(p, token) {
    if (token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.P || token.tagID === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.TAG_ID.BR) {
        popUntilHtmlOrIntegrationPoint(p);
        p._endTagOutsideForeignContent(token);
        return;
    }
    for (let i = p.openElements.stackTop; i > 0; i--) {
        const element = p.openElements.items[i];
        if (p.treeAdapter.getNamespaceURI(element) === _common_html_js__WEBPACK_IMPORTED_MODULE_8__.NS.HTML) {
            p._endTagOutsideForeignContent(token);
            break;
        }
        const tagName = p.treeAdapter.getTagName(element);
        if (tagName.toLowerCase() === token.tagName) {
            //NOTE: update the token tag name for `_setEndLocation`.
            token.tagName = tagName;
            p.openElements.shortenToLength(i);
            break;
        }
    }
}
//# sourceMappingURL=index.js.map

/***/ }),
/* 28 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Tokenizer": () => (/* binding */ Tokenizer),
/* harmony export */   "TokenizerMode": () => (/* binding */ TokenizerMode)
/* harmony export */ });
/* harmony import */ var _preprocessor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(29);
/* harmony import */ var _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(30);
/* harmony import */ var _common_token_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(32);
/* harmony import */ var entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(33);
/* harmony import */ var _common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(31);
/* harmony import */ var _common_html_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(37);






//C1 Unicode control character reference replacements
const C1_CONTROLS_REFERENCE_REPLACEMENTS = new Map([
    [0x80, 8364],
    [0x82, 8218],
    [0x83, 402],
    [0x84, 8222],
    [0x85, 8230],
    [0x86, 8224],
    [0x87, 8225],
    [0x88, 710],
    [0x89, 8240],
    [0x8a, 352],
    [0x8b, 8249],
    [0x8c, 338],
    [0x8e, 381],
    [0x91, 8216],
    [0x92, 8217],
    [0x93, 8220],
    [0x94, 8221],
    [0x95, 8226],
    [0x96, 8211],
    [0x97, 8212],
    [0x98, 732],
    [0x99, 8482],
    [0x9a, 353],
    [0x9b, 8250],
    [0x9c, 339],
    [0x9e, 382],
    [0x9f, 376],
]);
//States
var State;
(function (State) {
    State[State["DATA"] = 0] = "DATA";
    State[State["RCDATA"] = 1] = "RCDATA";
    State[State["RAWTEXT"] = 2] = "RAWTEXT";
    State[State["SCRIPT_DATA"] = 3] = "SCRIPT_DATA";
    State[State["PLAINTEXT"] = 4] = "PLAINTEXT";
    State[State["TAG_OPEN"] = 5] = "TAG_OPEN";
    State[State["END_TAG_OPEN"] = 6] = "END_TAG_OPEN";
    State[State["TAG_NAME"] = 7] = "TAG_NAME";
    State[State["RCDATA_LESS_THAN_SIGN"] = 8] = "RCDATA_LESS_THAN_SIGN";
    State[State["RCDATA_END_TAG_OPEN"] = 9] = "RCDATA_END_TAG_OPEN";
    State[State["RCDATA_END_TAG_NAME"] = 10] = "RCDATA_END_TAG_NAME";
    State[State["RAWTEXT_LESS_THAN_SIGN"] = 11] = "RAWTEXT_LESS_THAN_SIGN";
    State[State["RAWTEXT_END_TAG_OPEN"] = 12] = "RAWTEXT_END_TAG_OPEN";
    State[State["RAWTEXT_END_TAG_NAME"] = 13] = "RAWTEXT_END_TAG_NAME";
    State[State["SCRIPT_DATA_LESS_THAN_SIGN"] = 14] = "SCRIPT_DATA_LESS_THAN_SIGN";
    State[State["SCRIPT_DATA_END_TAG_OPEN"] = 15] = "SCRIPT_DATA_END_TAG_OPEN";
    State[State["SCRIPT_DATA_END_TAG_NAME"] = 16] = "SCRIPT_DATA_END_TAG_NAME";
    State[State["SCRIPT_DATA_ESCAPE_START"] = 17] = "SCRIPT_DATA_ESCAPE_START";
    State[State["SCRIPT_DATA_ESCAPE_START_DASH"] = 18] = "SCRIPT_DATA_ESCAPE_START_DASH";
    State[State["SCRIPT_DATA_ESCAPED"] = 19] = "SCRIPT_DATA_ESCAPED";
    State[State["SCRIPT_DATA_ESCAPED_DASH"] = 20] = "SCRIPT_DATA_ESCAPED_DASH";
    State[State["SCRIPT_DATA_ESCAPED_DASH_DASH"] = 21] = "SCRIPT_DATA_ESCAPED_DASH_DASH";
    State[State["SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN"] = 22] = "SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN";
    State[State["SCRIPT_DATA_ESCAPED_END_TAG_OPEN"] = 23] = "SCRIPT_DATA_ESCAPED_END_TAG_OPEN";
    State[State["SCRIPT_DATA_ESCAPED_END_TAG_NAME"] = 24] = "SCRIPT_DATA_ESCAPED_END_TAG_NAME";
    State[State["SCRIPT_DATA_DOUBLE_ESCAPE_START"] = 25] = "SCRIPT_DATA_DOUBLE_ESCAPE_START";
    State[State["SCRIPT_DATA_DOUBLE_ESCAPED"] = 26] = "SCRIPT_DATA_DOUBLE_ESCAPED";
    State[State["SCRIPT_DATA_DOUBLE_ESCAPED_DASH"] = 27] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH";
    State[State["SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH"] = 28] = "SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH";
    State[State["SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN"] = 29] = "SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN";
    State[State["SCRIPT_DATA_DOUBLE_ESCAPE_END"] = 30] = "SCRIPT_DATA_DOUBLE_ESCAPE_END";
    State[State["BEFORE_ATTRIBUTE_NAME"] = 31] = "BEFORE_ATTRIBUTE_NAME";
    State[State["ATTRIBUTE_NAME"] = 32] = "ATTRIBUTE_NAME";
    State[State["AFTER_ATTRIBUTE_NAME"] = 33] = "AFTER_ATTRIBUTE_NAME";
    State[State["BEFORE_ATTRIBUTE_VALUE"] = 34] = "BEFORE_ATTRIBUTE_VALUE";
    State[State["ATTRIBUTE_VALUE_DOUBLE_QUOTED"] = 35] = "ATTRIBUTE_VALUE_DOUBLE_QUOTED";
    State[State["ATTRIBUTE_VALUE_SINGLE_QUOTED"] = 36] = "ATTRIBUTE_VALUE_SINGLE_QUOTED";
    State[State["ATTRIBUTE_VALUE_UNQUOTED"] = 37] = "ATTRIBUTE_VALUE_UNQUOTED";
    State[State["AFTER_ATTRIBUTE_VALUE_QUOTED"] = 38] = "AFTER_ATTRIBUTE_VALUE_QUOTED";
    State[State["SELF_CLOSING_START_TAG"] = 39] = "SELF_CLOSING_START_TAG";
    State[State["BOGUS_COMMENT"] = 40] = "BOGUS_COMMENT";
    State[State["MARKUP_DECLARATION_OPEN"] = 41] = "MARKUP_DECLARATION_OPEN";
    State[State["COMMENT_START"] = 42] = "COMMENT_START";
    State[State["COMMENT_START_DASH"] = 43] = "COMMENT_START_DASH";
    State[State["COMMENT"] = 44] = "COMMENT";
    State[State["COMMENT_LESS_THAN_SIGN"] = 45] = "COMMENT_LESS_THAN_SIGN";
    State[State["COMMENT_LESS_THAN_SIGN_BANG"] = 46] = "COMMENT_LESS_THAN_SIGN_BANG";
    State[State["COMMENT_LESS_THAN_SIGN_BANG_DASH"] = 47] = "COMMENT_LESS_THAN_SIGN_BANG_DASH";
    State[State["COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH"] = 48] = "COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH";
    State[State["COMMENT_END_DASH"] = 49] = "COMMENT_END_DASH";
    State[State["COMMENT_END"] = 50] = "COMMENT_END";
    State[State["COMMENT_END_BANG"] = 51] = "COMMENT_END_BANG";
    State[State["DOCTYPE"] = 52] = "DOCTYPE";
    State[State["BEFORE_DOCTYPE_NAME"] = 53] = "BEFORE_DOCTYPE_NAME";
    State[State["DOCTYPE_NAME"] = 54] = "DOCTYPE_NAME";
    State[State["AFTER_DOCTYPE_NAME"] = 55] = "AFTER_DOCTYPE_NAME";
    State[State["AFTER_DOCTYPE_PUBLIC_KEYWORD"] = 56] = "AFTER_DOCTYPE_PUBLIC_KEYWORD";
    State[State["BEFORE_DOCTYPE_PUBLIC_IDENTIFIER"] = 57] = "BEFORE_DOCTYPE_PUBLIC_IDENTIFIER";
    State[State["DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED"] = 58] = "DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED";
    State[State["DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED"] = 59] = "DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED";
    State[State["AFTER_DOCTYPE_PUBLIC_IDENTIFIER"] = 60] = "AFTER_DOCTYPE_PUBLIC_IDENTIFIER";
    State[State["BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS"] = 61] = "BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS";
    State[State["AFTER_DOCTYPE_SYSTEM_KEYWORD"] = 62] = "AFTER_DOCTYPE_SYSTEM_KEYWORD";
    State[State["BEFORE_DOCTYPE_SYSTEM_IDENTIFIER"] = 63] = "BEFORE_DOCTYPE_SYSTEM_IDENTIFIER";
    State[State["DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED"] = 64] = "DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED";
    State[State["DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED"] = 65] = "DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED";
    State[State["AFTER_DOCTYPE_SYSTEM_IDENTIFIER"] = 66] = "AFTER_DOCTYPE_SYSTEM_IDENTIFIER";
    State[State["BOGUS_DOCTYPE"] = 67] = "BOGUS_DOCTYPE";
    State[State["CDATA_SECTION"] = 68] = "CDATA_SECTION";
    State[State["CDATA_SECTION_BRACKET"] = 69] = "CDATA_SECTION_BRACKET";
    State[State["CDATA_SECTION_END"] = 70] = "CDATA_SECTION_END";
    State[State["CHARACTER_REFERENCE"] = 71] = "CHARACTER_REFERENCE";
    State[State["NAMED_CHARACTER_REFERENCE"] = 72] = "NAMED_CHARACTER_REFERENCE";
    State[State["AMBIGUOUS_AMPERSAND"] = 73] = "AMBIGUOUS_AMPERSAND";
    State[State["NUMERIC_CHARACTER_REFERENCE"] = 74] = "NUMERIC_CHARACTER_REFERENCE";
    State[State["HEXADEMICAL_CHARACTER_REFERENCE_START"] = 75] = "HEXADEMICAL_CHARACTER_REFERENCE_START";
    State[State["DECIMAL_CHARACTER_REFERENCE_START"] = 76] = "DECIMAL_CHARACTER_REFERENCE_START";
    State[State["HEXADEMICAL_CHARACTER_REFERENCE"] = 77] = "HEXADEMICAL_CHARACTER_REFERENCE";
    State[State["DECIMAL_CHARACTER_REFERENCE"] = 78] = "DECIMAL_CHARACTER_REFERENCE";
    State[State["NUMERIC_CHARACTER_REFERENCE_END"] = 79] = "NUMERIC_CHARACTER_REFERENCE_END";
})(State || (State = {}));
//Tokenizer initial states for different modes
const TokenizerMode = {
    DATA: State.DATA,
    RCDATA: State.RCDATA,
    RAWTEXT: State.RAWTEXT,
    SCRIPT_DATA: State.SCRIPT_DATA,
    PLAINTEXT: State.PLAINTEXT,
    CDATA_SECTION: State.CDATA_SECTION,
};
//Utils
//OPTIMIZATION: these utility functions should not be moved out of this module. V8 Crankshaft will not inline
//this functions if they will be situated in another module due to context switch.
//Always perform inlining check before modifying this functions ('node --trace-inlining').
function isAsciiDigit(cp) {
    return cp >= _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.DIGIT_0 && cp <= _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.DIGIT_9;
}
function isAsciiUpper(cp) {
    return cp >= _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LATIN_CAPITAL_A && cp <= _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LATIN_CAPITAL_Z;
}
function isAsciiLower(cp) {
    return cp >= _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LATIN_SMALL_A && cp <= _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LATIN_SMALL_Z;
}
function isAsciiLetter(cp) {
    return isAsciiLower(cp) || isAsciiUpper(cp);
}
function isAsciiAlphaNumeric(cp) {
    return isAsciiLetter(cp) || isAsciiDigit(cp);
}
function isAsciiUpperHexDigit(cp) {
    return cp >= _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LATIN_CAPITAL_A && cp <= _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LATIN_CAPITAL_F;
}
function isAsciiLowerHexDigit(cp) {
    return cp >= _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LATIN_SMALL_A && cp <= _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LATIN_SMALL_F;
}
function isAsciiHexDigit(cp) {
    return isAsciiDigit(cp) || isAsciiUpperHexDigit(cp) || isAsciiLowerHexDigit(cp);
}
function toAsciiLower(cp) {
    return cp + 32;
}
function isWhitespace(cp) {
    return cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE || cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED || cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION || cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED;
}
function isEntityInAttributeInvalidEnd(nextCp) {
    return nextCp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EQUALS_SIGN || isAsciiAlphaNumeric(nextCp);
}
function isScriptDataDoubleEscapeSequenceEnd(cp) {
    return isWhitespace(cp) || cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS || cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN;
}
//Tokenizer
class Tokenizer {
    constructor(options, handler) {
        this.options = options;
        this.handler = handler;
        this.paused = false;
        /** Ensures that the parsing loop isn't run multiple times at once. */
        this.inLoop = false;
        /**
         * Indicates that the current adjusted node exists, is not an element in the HTML namespace,
         * and that it is not an integration point for either MathML or HTML.
         *
         * @see {@link https://html.spec.whatwg.org/multipage/parsing.html#tree-construction}
         */
        this.inForeignNode = false;
        this.lastStartTagName = '';
        this.active = false;
        this.state = State.DATA;
        this.returnState = State.DATA;
        this.charRefCode = -1;
        this.consumedAfterSnapshot = -1;
        this.currentCharacterToken = null;
        this.currentToken = null;
        this.currentAttr = { name: '', value: '' };
        this.preprocessor = new _preprocessor_js__WEBPACK_IMPORTED_MODULE_0__.Preprocessor(handler);
        this.currentLocation = this.getCurrentLocation(-1);
    }
    //Errors
    _err(code) {
        var _a, _b;
        (_b = (_a = this.handler).onParseError) === null || _b === void 0 ? void 0 : _b.call(_a, this.preprocessor.getError(code));
    }
    // NOTE: `offset` may never run across line boundaries.
    getCurrentLocation(offset) {
        if (!this.options.sourceCodeLocationInfo) {
            return null;
        }
        return {
            startLine: this.preprocessor.line,
            startCol: this.preprocessor.col - offset,
            startOffset: this.preprocessor.offset - offset,
            endLine: -1,
            endCol: -1,
            endOffset: -1,
        };
    }
    _runParsingLoop() {
        if (this.inLoop)
            return;
        this.inLoop = true;
        while (this.active && !this.paused) {
            this.consumedAfterSnapshot = 0;
            const cp = this._consume();
            if (!this._ensureHibernation()) {
                this._callState(cp);
            }
        }
        this.inLoop = false;
    }
    //API
    pause() {
        this.paused = true;
    }
    resume(writeCallback) {
        if (!this.paused) {
            throw new Error('Parser was already resumed');
        }
        this.paused = false;
        // Necessary for synchronous resume.
        if (this.inLoop)
            return;
        this._runParsingLoop();
        if (!this.paused) {
            writeCallback === null || writeCallback === void 0 ? void 0 : writeCallback();
        }
    }
    write(chunk, isLastChunk, writeCallback) {
        this.active = true;
        this.preprocessor.write(chunk, isLastChunk);
        this._runParsingLoop();
        if (!this.paused) {
            writeCallback === null || writeCallback === void 0 ? void 0 : writeCallback();
        }
    }
    insertHtmlAtCurrentPos(chunk) {
        this.active = true;
        this.preprocessor.insertHtmlAtCurrentPos(chunk);
        this._runParsingLoop();
    }
    //Hibernation
    _ensureHibernation() {
        if (this.preprocessor.endOfChunkHit) {
            this._unconsume(this.consumedAfterSnapshot);
            this.active = false;
            return true;
        }
        return false;
    }
    //Consumption
    _consume() {
        this.consumedAfterSnapshot++;
        return this.preprocessor.advance();
    }
    _unconsume(count) {
        this.consumedAfterSnapshot -= count;
        this.preprocessor.retreat(count);
    }
    _reconsumeInState(state) {
        this.state = state;
        this._unconsume(1);
    }
    _advanceBy(count) {
        this.consumedAfterSnapshot += count;
        for (let i = 0; i < count; i++) {
            this.preprocessor.advance();
        }
    }
    _consumeSequenceIfMatch(pattern, caseSensitive) {
        if (this.preprocessor.startsWith(pattern, caseSensitive)) {
            // We will already have consumed one character before calling this method.
            this._advanceBy(pattern.length - 1);
            return true;
        }
        return false;
    }
    //Token creation
    _createStartTagToken() {
        this.currentToken = {
            type: _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.START_TAG,
            tagName: '',
            tagID: _common_html_js__WEBPACK_IMPORTED_MODULE_5__.TAG_ID.UNKNOWN,
            selfClosing: false,
            ackSelfClosing: false,
            attrs: [],
            location: this.getCurrentLocation(1),
        };
    }
    _createEndTagToken() {
        this.currentToken = {
            type: _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.END_TAG,
            tagName: '',
            tagID: _common_html_js__WEBPACK_IMPORTED_MODULE_5__.TAG_ID.UNKNOWN,
            selfClosing: false,
            ackSelfClosing: false,
            attrs: [],
            location: this.getCurrentLocation(2),
        };
    }
    _createCommentToken(offset) {
        this.currentToken = {
            type: _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.COMMENT,
            data: '',
            location: this.getCurrentLocation(offset),
        };
    }
    _createDoctypeToken(initialName) {
        this.currentToken = {
            type: _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.DOCTYPE,
            name: initialName,
            forceQuirks: false,
            publicId: null,
            systemId: null,
            location: this.currentLocation,
        };
    }
    _createCharacterToken(type, chars) {
        this.currentCharacterToken = {
            type,
            chars,
            location: this.currentLocation,
        };
    }
    //Tag attributes
    _createAttr(attrNameFirstCh) {
        this.currentAttr = {
            name: attrNameFirstCh,
            value: '',
        };
        this.currentLocation = this.getCurrentLocation(0);
    }
    _leaveAttrName() {
        var _a;
        var _b;
        const token = this.currentToken;
        if ((0,_common_token_js__WEBPACK_IMPORTED_MODULE_2__.getTokenAttr)(token, this.currentAttr.name) === null) {
            token.attrs.push(this.currentAttr);
            if (token.location && this.currentLocation) {
                const attrLocations = ((_a = (_b = token.location).attrs) !== null && _a !== void 0 ? _a : (_b.attrs = Object.create(null)));
                attrLocations[this.currentAttr.name] = this.currentLocation;
                // Set end location
                this._leaveAttrValue();
            }
        }
        else {
            this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.duplicateAttribute);
        }
    }
    _leaveAttrValue() {
        if (this.currentLocation) {
            this.currentLocation.endLine = this.preprocessor.line;
            this.currentLocation.endCol = this.preprocessor.col;
            this.currentLocation.endOffset = this.preprocessor.offset;
        }
    }
    //Token emission
    prepareToken(ct) {
        this._emitCurrentCharacterToken(ct.location);
        this.currentToken = null;
        if (ct.location) {
            ct.location.endLine = this.preprocessor.line;
            ct.location.endCol = this.preprocessor.col + 1;
            ct.location.endOffset = this.preprocessor.offset + 1;
        }
        this.currentLocation = this.getCurrentLocation(-1);
    }
    emitCurrentTagToken() {
        const ct = this.currentToken;
        this.prepareToken(ct);
        ct.tagID = (0,_common_html_js__WEBPACK_IMPORTED_MODULE_5__.getTagID)(ct.tagName);
        if (ct.type === _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.START_TAG) {
            this.lastStartTagName = ct.tagName;
            this.handler.onStartTag(ct);
        }
        else {
            if (ct.attrs.length > 0) {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.endTagWithAttributes);
            }
            if (ct.selfClosing) {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.endTagWithTrailingSolidus);
            }
            this.handler.onEndTag(ct);
        }
        this.preprocessor.dropParsedChunk();
    }
    emitCurrentComment(ct) {
        this.prepareToken(ct);
        this.handler.onComment(ct);
        this.preprocessor.dropParsedChunk();
    }
    emitCurrentDoctype(ct) {
        this.prepareToken(ct);
        this.handler.onDoctype(ct);
        this.preprocessor.dropParsedChunk();
    }
    _emitCurrentCharacterToken(nextLocation) {
        if (this.currentCharacterToken) {
            //NOTE: if we have a pending character token, make it's end location equal to the
            //current token's start location.
            if (nextLocation && this.currentCharacterToken.location) {
                this.currentCharacterToken.location.endLine = nextLocation.startLine;
                this.currentCharacterToken.location.endCol = nextLocation.startCol;
                this.currentCharacterToken.location.endOffset = nextLocation.startOffset;
            }
            switch (this.currentCharacterToken.type) {
                case _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.CHARACTER: {
                    this.handler.onCharacter(this.currentCharacterToken);
                    break;
                }
                case _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.NULL_CHARACTER: {
                    this.handler.onNullCharacter(this.currentCharacterToken);
                    break;
                }
                case _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.WHITESPACE_CHARACTER: {
                    this.handler.onWhitespaceCharacter(this.currentCharacterToken);
                    break;
                }
            }
            this.currentCharacterToken = null;
        }
    }
    _emitEOFToken() {
        const location = this.getCurrentLocation(0);
        if (location) {
            location.endLine = location.startLine;
            location.endCol = location.startCol;
            location.endOffset = location.startOffset;
        }
        this._emitCurrentCharacterToken(location);
        this.handler.onEof({ type: _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.EOF, location });
        this.active = false;
    }
    //Characters emission
    //OPTIMIZATION: specification uses only one type of character tokens (one token per character).
    //This causes a huge memory overhead and a lot of unnecessary parser loops. parse5 uses 3 groups of characters.
    //If we have a sequence of characters that belong to the same group, the parser can process it
    //as a single solid character token.
    //So, there are 3 types of character tokens in parse5:
    //1)TokenType.NULL_CHARACTER - \u0000-character sequences (e.g. '\u0000\u0000\u0000')
    //2)TokenType.WHITESPACE_CHARACTER - any whitespace/new-line character sequences (e.g. '\n  \r\t   \f')
    //3)TokenType.CHARACTER - any character sequence which don't belong to groups 1 and 2 (e.g. 'abcdef1234@@#$%^')
    _appendCharToCurrentCharacterToken(type, ch) {
        if (this.currentCharacterToken) {
            if (this.currentCharacterToken.type !== type) {
                this.currentLocation = this.getCurrentLocation(0);
                this._emitCurrentCharacterToken(this.currentLocation);
                this.preprocessor.dropParsedChunk();
            }
            else {
                this.currentCharacterToken.chars += ch;
                return;
            }
        }
        this._createCharacterToken(type, ch);
    }
    _emitCodePoint(cp) {
        let type = _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.CHARACTER;
        if (isWhitespace(cp)) {
            type = _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.WHITESPACE_CHARACTER;
        }
        else if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL) {
            type = _common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.NULL_CHARACTER;
        }
        this._appendCharToCurrentCharacterToken(type, String.fromCodePoint(cp));
    }
    //NOTE: used when we emit characters explicitly.
    //This is always for non-whitespace and non-null characters, which allows us to avoid additional checks.
    _emitChars(ch) {
        this._appendCharToCurrentCharacterToken(_common_token_js__WEBPACK_IMPORTED_MODULE_2__.TokenType.CHARACTER, ch);
    }
    // Character reference helpers
    _matchNamedCharacterReference(cp) {
        let result = null;
        let excess = 0;
        let withoutSemicolon = false;
        for (let i = 0, current = entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_3__.htmlDecodeTree[0]; i >= 0; cp = this._consume()) {
            i = (0,entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_3__.determineBranch)(entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_3__.htmlDecodeTree, current, i + 1, cp);
            if (i < 0)
                break;
            excess += 1;
            current = entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_3__.htmlDecodeTree[i];
            const masked = current & entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_3__.BinTrieFlags.VALUE_LENGTH;
            // If the branch is a value, store it and continue
            if (masked) {
                // The mask is the number of bytes of the value, including the current byte.
                const valueLength = (masked >> 14) - 1;
                // Attribute values that aren't terminated properly aren't parsed, and shouldn't lead to a parser error.
                // See the example in https://html.spec.whatwg.org/multipage/parsing.html#named-character-reference-state
                if (cp !== _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SEMICOLON &&
                    this._isCharacterReferenceInAttribute() &&
                    isEntityInAttributeInvalidEnd(this.preprocessor.peek(1))) {
                    //NOTE: we don't flush all consumed code points here, and instead switch back to the original state after
                    //emitting an ampersand. This is fine, as alphanumeric characters won't be parsed differently in attributes.
                    result = [_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.AMPERSAND];
                    // Skip over the value.
                    i += valueLength;
                }
                else {
                    // If this is a surrogate pair, consume the next two bytes.
                    result =
                        valueLength === 0
                            ? [entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_3__.htmlDecodeTree[i] & ~entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_3__.BinTrieFlags.VALUE_LENGTH]
                            : valueLength === 1
                                ? [entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_3__.htmlDecodeTree[++i]]
                                : [entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_3__.htmlDecodeTree[++i], entities_lib_decode_js__WEBPACK_IMPORTED_MODULE_3__.htmlDecodeTree[++i]];
                    excess = 0;
                    withoutSemicolon = cp !== _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SEMICOLON;
                }
                if (valueLength === 0) {
                    // If the value is zero-length, we're done.
                    this._consume();
                    break;
                }
            }
        }
        this._unconsume(excess);
        if (withoutSemicolon && !this.preprocessor.endOfChunkHit) {
            this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingSemicolonAfterCharacterReference);
        }
        // We want to emit the error above on the code point after the entity.
        // We always consume one code point too many in the loop, and we wait to
        // unconsume it until after the error is emitted.
        this._unconsume(1);
        return result;
    }
    _isCharacterReferenceInAttribute() {
        return (this.returnState === State.ATTRIBUTE_VALUE_DOUBLE_QUOTED ||
            this.returnState === State.ATTRIBUTE_VALUE_SINGLE_QUOTED ||
            this.returnState === State.ATTRIBUTE_VALUE_UNQUOTED);
    }
    _flushCodePointConsumedAsCharacterReference(cp) {
        if (this._isCharacterReferenceInAttribute()) {
            this.currentAttr.value += String.fromCodePoint(cp);
        }
        else {
            this._emitCodePoint(cp);
        }
    }
    // Calling states this way turns out to be much faster than any other approach.
    _callState(cp) {
        switch (this.state) {
            case State.DATA: {
                this._stateData(cp);
                break;
            }
            case State.RCDATA: {
                this._stateRcdata(cp);
                break;
            }
            case State.RAWTEXT: {
                this._stateRawtext(cp);
                break;
            }
            case State.SCRIPT_DATA: {
                this._stateScriptData(cp);
                break;
            }
            case State.PLAINTEXT: {
                this._statePlaintext(cp);
                break;
            }
            case State.TAG_OPEN: {
                this._stateTagOpen(cp);
                break;
            }
            case State.END_TAG_OPEN: {
                this._stateEndTagOpen(cp);
                break;
            }
            case State.TAG_NAME: {
                this._stateTagName(cp);
                break;
            }
            case State.RCDATA_LESS_THAN_SIGN: {
                this._stateRcdataLessThanSign(cp);
                break;
            }
            case State.RCDATA_END_TAG_OPEN: {
                this._stateRcdataEndTagOpen(cp);
                break;
            }
            case State.RCDATA_END_TAG_NAME: {
                this._stateRcdataEndTagName(cp);
                break;
            }
            case State.RAWTEXT_LESS_THAN_SIGN: {
                this._stateRawtextLessThanSign(cp);
                break;
            }
            case State.RAWTEXT_END_TAG_OPEN: {
                this._stateRawtextEndTagOpen(cp);
                break;
            }
            case State.RAWTEXT_END_TAG_NAME: {
                this._stateRawtextEndTagName(cp);
                break;
            }
            case State.SCRIPT_DATA_LESS_THAN_SIGN: {
                this._stateScriptDataLessThanSign(cp);
                break;
            }
            case State.SCRIPT_DATA_END_TAG_OPEN: {
                this._stateScriptDataEndTagOpen(cp);
                break;
            }
            case State.SCRIPT_DATA_END_TAG_NAME: {
                this._stateScriptDataEndTagName(cp);
                break;
            }
            case State.SCRIPT_DATA_ESCAPE_START: {
                this._stateScriptDataEscapeStart(cp);
                break;
            }
            case State.SCRIPT_DATA_ESCAPE_START_DASH: {
                this._stateScriptDataEscapeStartDash(cp);
                break;
            }
            case State.SCRIPT_DATA_ESCAPED: {
                this._stateScriptDataEscaped(cp);
                break;
            }
            case State.SCRIPT_DATA_ESCAPED_DASH: {
                this._stateScriptDataEscapedDash(cp);
                break;
            }
            case State.SCRIPT_DATA_ESCAPED_DASH_DASH: {
                this._stateScriptDataEscapedDashDash(cp);
                break;
            }
            case State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN: {
                this._stateScriptDataEscapedLessThanSign(cp);
                break;
            }
            case State.SCRIPT_DATA_ESCAPED_END_TAG_OPEN: {
                this._stateScriptDataEscapedEndTagOpen(cp);
                break;
            }
            case State.SCRIPT_DATA_ESCAPED_END_TAG_NAME: {
                this._stateScriptDataEscapedEndTagName(cp);
                break;
            }
            case State.SCRIPT_DATA_DOUBLE_ESCAPE_START: {
                this._stateScriptDataDoubleEscapeStart(cp);
                break;
            }
            case State.SCRIPT_DATA_DOUBLE_ESCAPED: {
                this._stateScriptDataDoubleEscaped(cp);
                break;
            }
            case State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH: {
                this._stateScriptDataDoubleEscapedDash(cp);
                break;
            }
            case State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH: {
                this._stateScriptDataDoubleEscapedDashDash(cp);
                break;
            }
            case State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN: {
                this._stateScriptDataDoubleEscapedLessThanSign(cp);
                break;
            }
            case State.SCRIPT_DATA_DOUBLE_ESCAPE_END: {
                this._stateScriptDataDoubleEscapeEnd(cp);
                break;
            }
            case State.BEFORE_ATTRIBUTE_NAME: {
                this._stateBeforeAttributeName(cp);
                break;
            }
            case State.ATTRIBUTE_NAME: {
                this._stateAttributeName(cp);
                break;
            }
            case State.AFTER_ATTRIBUTE_NAME: {
                this._stateAfterAttributeName(cp);
                break;
            }
            case State.BEFORE_ATTRIBUTE_VALUE: {
                this._stateBeforeAttributeValue(cp);
                break;
            }
            case State.ATTRIBUTE_VALUE_DOUBLE_QUOTED: {
                this._stateAttributeValueDoubleQuoted(cp);
                break;
            }
            case State.ATTRIBUTE_VALUE_SINGLE_QUOTED: {
                this._stateAttributeValueSingleQuoted(cp);
                break;
            }
            case State.ATTRIBUTE_VALUE_UNQUOTED: {
                this._stateAttributeValueUnquoted(cp);
                break;
            }
            case State.AFTER_ATTRIBUTE_VALUE_QUOTED: {
                this._stateAfterAttributeValueQuoted(cp);
                break;
            }
            case State.SELF_CLOSING_START_TAG: {
                this._stateSelfClosingStartTag(cp);
                break;
            }
            case State.BOGUS_COMMENT: {
                this._stateBogusComment(cp);
                break;
            }
            case State.MARKUP_DECLARATION_OPEN: {
                this._stateMarkupDeclarationOpen(cp);
                break;
            }
            case State.COMMENT_START: {
                this._stateCommentStart(cp);
                break;
            }
            case State.COMMENT_START_DASH: {
                this._stateCommentStartDash(cp);
                break;
            }
            case State.COMMENT: {
                this._stateComment(cp);
                break;
            }
            case State.COMMENT_LESS_THAN_SIGN: {
                this._stateCommentLessThanSign(cp);
                break;
            }
            case State.COMMENT_LESS_THAN_SIGN_BANG: {
                this._stateCommentLessThanSignBang(cp);
                break;
            }
            case State.COMMENT_LESS_THAN_SIGN_BANG_DASH: {
                this._stateCommentLessThanSignBangDash(cp);
                break;
            }
            case State.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH: {
                this._stateCommentLessThanSignBangDashDash(cp);
                break;
            }
            case State.COMMENT_END_DASH: {
                this._stateCommentEndDash(cp);
                break;
            }
            case State.COMMENT_END: {
                this._stateCommentEnd(cp);
                break;
            }
            case State.COMMENT_END_BANG: {
                this._stateCommentEndBang(cp);
                break;
            }
            case State.DOCTYPE: {
                this._stateDoctype(cp);
                break;
            }
            case State.BEFORE_DOCTYPE_NAME: {
                this._stateBeforeDoctypeName(cp);
                break;
            }
            case State.DOCTYPE_NAME: {
                this._stateDoctypeName(cp);
                break;
            }
            case State.AFTER_DOCTYPE_NAME: {
                this._stateAfterDoctypeName(cp);
                break;
            }
            case State.AFTER_DOCTYPE_PUBLIC_KEYWORD: {
                this._stateAfterDoctypePublicKeyword(cp);
                break;
            }
            case State.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER: {
                this._stateBeforeDoctypePublicIdentifier(cp);
                break;
            }
            case State.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED: {
                this._stateDoctypePublicIdentifierDoubleQuoted(cp);
                break;
            }
            case State.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED: {
                this._stateDoctypePublicIdentifierSingleQuoted(cp);
                break;
            }
            case State.AFTER_DOCTYPE_PUBLIC_IDENTIFIER: {
                this._stateAfterDoctypePublicIdentifier(cp);
                break;
            }
            case State.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS: {
                this._stateBetweenDoctypePublicAndSystemIdentifiers(cp);
                break;
            }
            case State.AFTER_DOCTYPE_SYSTEM_KEYWORD: {
                this._stateAfterDoctypeSystemKeyword(cp);
                break;
            }
            case State.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER: {
                this._stateBeforeDoctypeSystemIdentifier(cp);
                break;
            }
            case State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED: {
                this._stateDoctypeSystemIdentifierDoubleQuoted(cp);
                break;
            }
            case State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED: {
                this._stateDoctypeSystemIdentifierSingleQuoted(cp);
                break;
            }
            case State.AFTER_DOCTYPE_SYSTEM_IDENTIFIER: {
                this._stateAfterDoctypeSystemIdentifier(cp);
                break;
            }
            case State.BOGUS_DOCTYPE: {
                this._stateBogusDoctype(cp);
                break;
            }
            case State.CDATA_SECTION: {
                this._stateCdataSection(cp);
                break;
            }
            case State.CDATA_SECTION_BRACKET: {
                this._stateCdataSectionBracket(cp);
                break;
            }
            case State.CDATA_SECTION_END: {
                this._stateCdataSectionEnd(cp);
                break;
            }
            case State.CHARACTER_REFERENCE: {
                this._stateCharacterReference(cp);
                break;
            }
            case State.NAMED_CHARACTER_REFERENCE: {
                this._stateNamedCharacterReference(cp);
                break;
            }
            case State.AMBIGUOUS_AMPERSAND: {
                this._stateAmbiguousAmpersand(cp);
                break;
            }
            case State.NUMERIC_CHARACTER_REFERENCE: {
                this._stateNumericCharacterReference(cp);
                break;
            }
            case State.HEXADEMICAL_CHARACTER_REFERENCE_START: {
                this._stateHexademicalCharacterReferenceStart(cp);
                break;
            }
            case State.DECIMAL_CHARACTER_REFERENCE_START: {
                this._stateDecimalCharacterReferenceStart(cp);
                break;
            }
            case State.HEXADEMICAL_CHARACTER_REFERENCE: {
                this._stateHexademicalCharacterReference(cp);
                break;
            }
            case State.DECIMAL_CHARACTER_REFERENCE: {
                this._stateDecimalCharacterReference(cp);
                break;
            }
            case State.NUMERIC_CHARACTER_REFERENCE_END: {
                this._stateNumericCharacterReferenceEnd();
                break;
            }
            default: {
                throw new Error('Unknown state');
            }
        }
    }
    // State machine
    // Data state
    //------------------------------------------------------------------
    _stateData(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN: {
                this.state = State.TAG_OPEN;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.AMPERSAND: {
                this.returnState = State.DATA;
                this.state = State.CHARACTER_REFERENCE;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                this._emitCodePoint(cp);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._emitEOFToken();
                break;
            }
            default: {
                this._emitCodePoint(cp);
            }
        }
    }
    //  RCDATA state
    //------------------------------------------------------------------
    _stateRcdata(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.AMPERSAND: {
                this.returnState = State.RCDATA;
                this.state = State.CHARACTER_REFERENCE;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN: {
                this.state = State.RCDATA_LESS_THAN_SIGN;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                this._emitChars(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._emitEOFToken();
                break;
            }
            default: {
                this._emitCodePoint(cp);
            }
        }
    }
    // RAWTEXT state
    //------------------------------------------------------------------
    _stateRawtext(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN: {
                this.state = State.RAWTEXT_LESS_THAN_SIGN;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                this._emitChars(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._emitEOFToken();
                break;
            }
            default: {
                this._emitCodePoint(cp);
            }
        }
    }
    // Script data state
    //------------------------------------------------------------------
    _stateScriptData(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN: {
                this.state = State.SCRIPT_DATA_LESS_THAN_SIGN;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                this._emitChars(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._emitEOFToken();
                break;
            }
            default: {
                this._emitCodePoint(cp);
            }
        }
    }
    // PLAINTEXT state
    //------------------------------------------------------------------
    _statePlaintext(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                this._emitChars(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._emitEOFToken();
                break;
            }
            default: {
                this._emitCodePoint(cp);
            }
        }
    }
    // Tag open state
    //------------------------------------------------------------------
    _stateTagOpen(cp) {
        if (isAsciiLetter(cp)) {
            this._createStartTagToken();
            this.state = State.TAG_NAME;
            this._stateTagName(cp);
        }
        else
            switch (cp) {
                case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EXCLAMATION_MARK: {
                    this.state = State.MARKUP_DECLARATION_OPEN;
                    break;
                }
                case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS: {
                    this.state = State.END_TAG_OPEN;
                    break;
                }
                case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUESTION_MARK: {
                    this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedQuestionMarkInsteadOfTagName);
                    this._createCommentToken(1);
                    this.state = State.BOGUS_COMMENT;
                    this._stateBogusComment(cp);
                    break;
                }
                case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                    this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofBeforeTagName);
                    this._emitChars('<');
                    this._emitEOFToken();
                    break;
                }
                default: {
                    this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.invalidFirstCharacterOfTagName);
                    this._emitChars('<');
                    this.state = State.DATA;
                    this._stateData(cp);
                }
            }
    }
    // End tag open state
    //------------------------------------------------------------------
    _stateEndTagOpen(cp) {
        if (isAsciiLetter(cp)) {
            this._createEndTagToken();
            this.state = State.TAG_NAME;
            this._stateTagName(cp);
        }
        else
            switch (cp) {
                case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                    this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingEndTagName);
                    this.state = State.DATA;
                    break;
                }
                case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                    this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofBeforeTagName);
                    this._emitChars('</');
                    this._emitEOFToken();
                    break;
                }
                default: {
                    this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.invalidFirstCharacterOfTagName);
                    this._createCommentToken(2);
                    this.state = State.BOGUS_COMMENT;
                    this._stateBogusComment(cp);
                }
            }
    }
    // Tag name state
    //------------------------------------------------------------------
    _stateTagName(cp) {
        const token = this.currentToken;
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED: {
                this.state = State.BEFORE_ATTRIBUTE_NAME;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS: {
                this.state = State.SELF_CLOSING_START_TAG;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this.state = State.DATA;
                this.emitCurrentTagToken();
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                token.tagName += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInTag);
                this._emitEOFToken();
                break;
            }
            default: {
                token.tagName += String.fromCodePoint(isAsciiUpper(cp) ? toAsciiLower(cp) : cp);
            }
        }
    }
    // RCDATA less-than sign state
    //------------------------------------------------------------------
    _stateRcdataLessThanSign(cp) {
        if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS) {
            this.state = State.RCDATA_END_TAG_OPEN;
        }
        else {
            this._emitChars('<');
            this.state = State.RCDATA;
            this._stateRcdata(cp);
        }
    }
    // RCDATA end tag open state
    //------------------------------------------------------------------
    _stateRcdataEndTagOpen(cp) {
        if (isAsciiLetter(cp)) {
            this.state = State.RCDATA_END_TAG_NAME;
            this._stateRcdataEndTagName(cp);
        }
        else {
            this._emitChars('</');
            this.state = State.RCDATA;
            this._stateRcdata(cp);
        }
    }
    handleSpecialEndTag(_cp) {
        if (!this.preprocessor.startsWith(this.lastStartTagName, false)) {
            return !this._ensureHibernation();
        }
        this._createEndTagToken();
        const token = this.currentToken;
        token.tagName = this.lastStartTagName;
        const cp = this.preprocessor.peek(this.lastStartTagName.length);
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED: {
                this._advanceBy(this.lastStartTagName.length);
                this.state = State.BEFORE_ATTRIBUTE_NAME;
                return false;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS: {
                this._advanceBy(this.lastStartTagName.length);
                this.state = State.SELF_CLOSING_START_TAG;
                return false;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this._advanceBy(this.lastStartTagName.length);
                this.emitCurrentTagToken();
                this.state = State.DATA;
                return false;
            }
            default: {
                return !this._ensureHibernation();
            }
        }
    }
    // RCDATA end tag name state
    //------------------------------------------------------------------
    _stateRcdataEndTagName(cp) {
        if (this.handleSpecialEndTag(cp)) {
            this._emitChars('</');
            this.state = State.RCDATA;
            this._stateRcdata(cp);
        }
    }
    // RAWTEXT less-than sign state
    //------------------------------------------------------------------
    _stateRawtextLessThanSign(cp) {
        if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS) {
            this.state = State.RAWTEXT_END_TAG_OPEN;
        }
        else {
            this._emitChars('<');
            this.state = State.RAWTEXT;
            this._stateRawtext(cp);
        }
    }
    // RAWTEXT end tag open state
    //------------------------------------------------------------------
    _stateRawtextEndTagOpen(cp) {
        if (isAsciiLetter(cp)) {
            this.state = State.RAWTEXT_END_TAG_NAME;
            this._stateRawtextEndTagName(cp);
        }
        else {
            this._emitChars('</');
            this.state = State.RAWTEXT;
            this._stateRawtext(cp);
        }
    }
    // RAWTEXT end tag name state
    //------------------------------------------------------------------
    _stateRawtextEndTagName(cp) {
        if (this.handleSpecialEndTag(cp)) {
            this._emitChars('</');
            this.state = State.RAWTEXT;
            this._stateRawtext(cp);
        }
    }
    // Script data less-than sign state
    //------------------------------------------------------------------
    _stateScriptDataLessThanSign(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS: {
                this.state = State.SCRIPT_DATA_END_TAG_OPEN;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EXCLAMATION_MARK: {
                this.state = State.SCRIPT_DATA_ESCAPE_START;
                this._emitChars('<!');
                break;
            }
            default: {
                this._emitChars('<');
                this.state = State.SCRIPT_DATA;
                this._stateScriptData(cp);
            }
        }
    }
    // Script data end tag open state
    //------------------------------------------------------------------
    _stateScriptDataEndTagOpen(cp) {
        if (isAsciiLetter(cp)) {
            this.state = State.SCRIPT_DATA_END_TAG_NAME;
            this._stateScriptDataEndTagName(cp);
        }
        else {
            this._emitChars('</');
            this.state = State.SCRIPT_DATA;
            this._stateScriptData(cp);
        }
    }
    // Script data end tag name state
    //------------------------------------------------------------------
    _stateScriptDataEndTagName(cp) {
        if (this.handleSpecialEndTag(cp)) {
            this._emitChars('</');
            this.state = State.SCRIPT_DATA;
            this._stateScriptData(cp);
        }
    }
    // Script data escape start state
    //------------------------------------------------------------------
    _stateScriptDataEscapeStart(cp) {
        if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS) {
            this.state = State.SCRIPT_DATA_ESCAPE_START_DASH;
            this._emitChars('-');
        }
        else {
            this.state = State.SCRIPT_DATA;
            this._stateScriptData(cp);
        }
    }
    // Script data escape start dash state
    //------------------------------------------------------------------
    _stateScriptDataEscapeStartDash(cp) {
        if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS) {
            this.state = State.SCRIPT_DATA_ESCAPED_DASH_DASH;
            this._emitChars('-');
        }
        else {
            this.state = State.SCRIPT_DATA;
            this._stateScriptData(cp);
        }
    }
    // Script data escaped state
    //------------------------------------------------------------------
    _stateScriptDataEscaped(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS: {
                this.state = State.SCRIPT_DATA_ESCAPED_DASH;
                this._emitChars('-');
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN: {
                this.state = State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                this._emitChars(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInScriptHtmlCommentLikeText);
                this._emitEOFToken();
                break;
            }
            default: {
                this._emitCodePoint(cp);
            }
        }
    }
    // Script data escaped dash state
    //------------------------------------------------------------------
    _stateScriptDataEscapedDash(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS: {
                this.state = State.SCRIPT_DATA_ESCAPED_DASH_DASH;
                this._emitChars('-');
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN: {
                this.state = State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                this.state = State.SCRIPT_DATA_ESCAPED;
                this._emitChars(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInScriptHtmlCommentLikeText);
                this._emitEOFToken();
                break;
            }
            default: {
                this.state = State.SCRIPT_DATA_ESCAPED;
                this._emitCodePoint(cp);
            }
        }
    }
    // Script data escaped dash dash state
    //------------------------------------------------------------------
    _stateScriptDataEscapedDashDash(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS: {
                this._emitChars('-');
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN: {
                this.state = State.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this.state = State.SCRIPT_DATA;
                this._emitChars('>');
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                this.state = State.SCRIPT_DATA_ESCAPED;
                this._emitChars(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInScriptHtmlCommentLikeText);
                this._emitEOFToken();
                break;
            }
            default: {
                this.state = State.SCRIPT_DATA_ESCAPED;
                this._emitCodePoint(cp);
            }
        }
    }
    // Script data escaped less-than sign state
    //------------------------------------------------------------------
    _stateScriptDataEscapedLessThanSign(cp) {
        if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS) {
            this.state = State.SCRIPT_DATA_ESCAPED_END_TAG_OPEN;
        }
        else if (isAsciiLetter(cp)) {
            this._emitChars('<');
            this.state = State.SCRIPT_DATA_DOUBLE_ESCAPE_START;
            this._stateScriptDataDoubleEscapeStart(cp);
        }
        else {
            this._emitChars('<');
            this.state = State.SCRIPT_DATA_ESCAPED;
            this._stateScriptDataEscaped(cp);
        }
    }
    // Script data escaped end tag open state
    //------------------------------------------------------------------
    _stateScriptDataEscapedEndTagOpen(cp) {
        if (isAsciiLetter(cp)) {
            this.state = State.SCRIPT_DATA_ESCAPED_END_TAG_NAME;
            this._stateScriptDataEscapedEndTagName(cp);
        }
        else {
            this._emitChars('</');
            this.state = State.SCRIPT_DATA_ESCAPED;
            this._stateScriptDataEscaped(cp);
        }
    }
    // Script data escaped end tag name state
    //------------------------------------------------------------------
    _stateScriptDataEscapedEndTagName(cp) {
        if (this.handleSpecialEndTag(cp)) {
            this._emitChars('</');
            this.state = State.SCRIPT_DATA_ESCAPED;
            this._stateScriptDataEscaped(cp);
        }
    }
    // Script data double escape start state
    //------------------------------------------------------------------
    _stateScriptDataDoubleEscapeStart(cp) {
        if (this.preprocessor.startsWith(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.SCRIPT, false) &&
            isScriptDataDoubleEscapeSequenceEnd(this.preprocessor.peek(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.SCRIPT.length))) {
            this._emitCodePoint(cp);
            for (let i = 0; i < _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.SCRIPT.length; i++) {
                this._emitCodePoint(this._consume());
            }
            this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
        }
        else if (!this._ensureHibernation()) {
            this.state = State.SCRIPT_DATA_ESCAPED;
            this._stateScriptDataEscaped(cp);
        }
    }
    // Script data double escaped state
    //------------------------------------------------------------------
    _stateScriptDataDoubleEscaped(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS: {
                this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH;
                this._emitChars('-');
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN: {
                this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;
                this._emitChars('<');
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                this._emitChars(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInScriptHtmlCommentLikeText);
                this._emitEOFToken();
                break;
            }
            default: {
                this._emitCodePoint(cp);
            }
        }
    }
    // Script data double escaped dash state
    //------------------------------------------------------------------
    _stateScriptDataDoubleEscapedDash(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS: {
                this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH;
                this._emitChars('-');
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN: {
                this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;
                this._emitChars('<');
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
                this._emitChars(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInScriptHtmlCommentLikeText);
                this._emitEOFToken();
                break;
            }
            default: {
                this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
                this._emitCodePoint(cp);
            }
        }
    }
    // Script data double escaped dash dash state
    //------------------------------------------------------------------
    _stateScriptDataDoubleEscapedDashDash(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS: {
                this._emitChars('-');
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN: {
                this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN;
                this._emitChars('<');
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this.state = State.SCRIPT_DATA;
                this._emitChars('>');
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
                this._emitChars(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInScriptHtmlCommentLikeText);
                this._emitEOFToken();
                break;
            }
            default: {
                this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
                this._emitCodePoint(cp);
            }
        }
    }
    // Script data double escaped less-than sign state
    //------------------------------------------------------------------
    _stateScriptDataDoubleEscapedLessThanSign(cp) {
        if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS) {
            this.state = State.SCRIPT_DATA_DOUBLE_ESCAPE_END;
            this._emitChars('/');
        }
        else {
            this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
            this._stateScriptDataDoubleEscaped(cp);
        }
    }
    // Script data double escape end state
    //------------------------------------------------------------------
    _stateScriptDataDoubleEscapeEnd(cp) {
        if (this.preprocessor.startsWith(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.SCRIPT, false) &&
            isScriptDataDoubleEscapeSequenceEnd(this.preprocessor.peek(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.SCRIPT.length))) {
            this._emitCodePoint(cp);
            for (let i = 0; i < _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.SCRIPT.length; i++) {
                this._emitCodePoint(this._consume());
            }
            this.state = State.SCRIPT_DATA_ESCAPED;
        }
        else if (!this._ensureHibernation()) {
            this.state = State.SCRIPT_DATA_DOUBLE_ESCAPED;
            this._stateScriptDataDoubleEscaped(cp);
        }
    }
    // Before attribute name state
    //------------------------------------------------------------------
    _stateBeforeAttributeName(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED: {
                // Ignore whitespace
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this.state = State.AFTER_ATTRIBUTE_NAME;
                this._stateAfterAttributeName(cp);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EQUALS_SIGN: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedEqualsSignBeforeAttributeName);
                this._createAttr('=');
                this.state = State.ATTRIBUTE_NAME;
                break;
            }
            default: {
                this._createAttr('');
                this.state = State.ATTRIBUTE_NAME;
                this._stateAttributeName(cp);
            }
        }
    }
    // Attribute name state
    //------------------------------------------------------------------
    _stateAttributeName(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._leaveAttrName();
                this.state = State.AFTER_ATTRIBUTE_NAME;
                this._stateAfterAttributeName(cp);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EQUALS_SIGN: {
                this._leaveAttrName();
                this.state = State.BEFORE_ATTRIBUTE_VALUE;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedCharacterInAttributeName);
                this.currentAttr.name += String.fromCodePoint(cp);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                this.currentAttr.name += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
                break;
            }
            default: {
                this.currentAttr.name += String.fromCodePoint(isAsciiUpper(cp) ? toAsciiLower(cp) : cp);
            }
        }
    }
    // After attribute name state
    //------------------------------------------------------------------
    _stateAfterAttributeName(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED: {
                // Ignore whitespace
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS: {
                this.state = State.SELF_CLOSING_START_TAG;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EQUALS_SIGN: {
                this.state = State.BEFORE_ATTRIBUTE_VALUE;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this.state = State.DATA;
                this.emitCurrentTagToken();
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInTag);
                this._emitEOFToken();
                break;
            }
            default: {
                this._createAttr('');
                this.state = State.ATTRIBUTE_NAME;
                this._stateAttributeName(cp);
            }
        }
    }
    // Before attribute value state
    //------------------------------------------------------------------
    _stateBeforeAttributeValue(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED: {
                // Ignore whitespace
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK: {
                this.state = State.ATTRIBUTE_VALUE_DOUBLE_QUOTED;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE: {
                this.state = State.ATTRIBUTE_VALUE_SINGLE_QUOTED;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingAttributeValue);
                this.state = State.DATA;
                this.emitCurrentTagToken();
                break;
            }
            default: {
                this.state = State.ATTRIBUTE_VALUE_UNQUOTED;
                this._stateAttributeValueUnquoted(cp);
            }
        }
    }
    // Attribute value (double-quoted) state
    //------------------------------------------------------------------
    _stateAttributeValueDoubleQuoted(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK: {
                this.state = State.AFTER_ATTRIBUTE_VALUE_QUOTED;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.AMPERSAND: {
                this.returnState = State.ATTRIBUTE_VALUE_DOUBLE_QUOTED;
                this.state = State.CHARACTER_REFERENCE;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                this.currentAttr.value += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInTag);
                this._emitEOFToken();
                break;
            }
            default: {
                this.currentAttr.value += String.fromCodePoint(cp);
            }
        }
    }
    // Attribute value (single-quoted) state
    //------------------------------------------------------------------
    _stateAttributeValueSingleQuoted(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE: {
                this.state = State.AFTER_ATTRIBUTE_VALUE_QUOTED;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.AMPERSAND: {
                this.returnState = State.ATTRIBUTE_VALUE_SINGLE_QUOTED;
                this.state = State.CHARACTER_REFERENCE;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                this.currentAttr.value += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInTag);
                this._emitEOFToken();
                break;
            }
            default: {
                this.currentAttr.value += String.fromCodePoint(cp);
            }
        }
    }
    // Attribute value (unquoted) state
    //------------------------------------------------------------------
    _stateAttributeValueUnquoted(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED: {
                this._leaveAttrValue();
                this.state = State.BEFORE_ATTRIBUTE_NAME;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.AMPERSAND: {
                this.returnState = State.ATTRIBUTE_VALUE_UNQUOTED;
                this.state = State.CHARACTER_REFERENCE;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this._leaveAttrValue();
                this.state = State.DATA;
                this.emitCurrentTagToken();
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                this.currentAttr.value += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EQUALS_SIGN:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GRAVE_ACCENT: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedCharacterInUnquotedAttributeValue);
                this.currentAttr.value += String.fromCodePoint(cp);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInTag);
                this._emitEOFToken();
                break;
            }
            default: {
                this.currentAttr.value += String.fromCodePoint(cp);
            }
        }
    }
    // After attribute value (quoted) state
    //------------------------------------------------------------------
    _stateAfterAttributeValueQuoted(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED: {
                this._leaveAttrValue();
                this.state = State.BEFORE_ATTRIBUTE_NAME;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SOLIDUS: {
                this._leaveAttrValue();
                this.state = State.SELF_CLOSING_START_TAG;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this._leaveAttrValue();
                this.state = State.DATA;
                this.emitCurrentTagToken();
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInTag);
                this._emitEOFToken();
                break;
            }
            default: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingWhitespaceBetweenAttributes);
                this.state = State.BEFORE_ATTRIBUTE_NAME;
                this._stateBeforeAttributeName(cp);
            }
        }
    }
    // Self-closing start tag state
    //------------------------------------------------------------------
    _stateSelfClosingStartTag(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                const token = this.currentToken;
                token.selfClosing = true;
                this.state = State.DATA;
                this.emitCurrentTagToken();
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInTag);
                this._emitEOFToken();
                break;
            }
            default: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedSolidusInTag);
                this.state = State.BEFORE_ATTRIBUTE_NAME;
                this._stateBeforeAttributeName(cp);
            }
        }
    }
    // Bogus comment state
    //------------------------------------------------------------------
    _stateBogusComment(cp) {
        const token = this.currentToken;
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this.state = State.DATA;
                this.emitCurrentComment(token);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this.emitCurrentComment(token);
                this._emitEOFToken();
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                token.data += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
                break;
            }
            default: {
                token.data += String.fromCodePoint(cp);
            }
        }
    }
    // Markup declaration open state
    //------------------------------------------------------------------
    _stateMarkupDeclarationOpen(cp) {
        if (this._consumeSequenceIfMatch(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.DASH_DASH, true)) {
            this._createCommentToken(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.DASH_DASH.length + 1);
            this.state = State.COMMENT_START;
        }
        else if (this._consumeSequenceIfMatch(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.DOCTYPE, false)) {
            // NOTE: Doctypes tokens are created without fixed offsets. We keep track of the moment a doctype *might* start here.
            this.currentLocation = this.getCurrentLocation(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.DOCTYPE.length + 1);
            this.state = State.DOCTYPE;
        }
        else if (this._consumeSequenceIfMatch(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.CDATA_START, true)) {
            if (this.inForeignNode) {
                this.state = State.CDATA_SECTION;
            }
            else {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.cdataInHtmlContent);
                this._createCommentToken(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.CDATA_START.length + 1);
                this.currentToken.data = '[CDATA[';
                this.state = State.BOGUS_COMMENT;
            }
        }
        //NOTE: Sequence lookups can be abrupted by hibernation. In that case, lookup
        //results are no longer valid and we will need to start over.
        else if (!this._ensureHibernation()) {
            this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.incorrectlyOpenedComment);
            this._createCommentToken(2);
            this.state = State.BOGUS_COMMENT;
            this._stateBogusComment(cp);
        }
    }
    // Comment start state
    //------------------------------------------------------------------
    _stateCommentStart(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS: {
                this.state = State.COMMENT_START_DASH;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.abruptClosingOfEmptyComment);
                this.state = State.DATA;
                const token = this.currentToken;
                this.emitCurrentComment(token);
                break;
            }
            default: {
                this.state = State.COMMENT;
                this._stateComment(cp);
            }
        }
    }
    // Comment start dash state
    //------------------------------------------------------------------
    _stateCommentStartDash(cp) {
        const token = this.currentToken;
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS: {
                this.state = State.COMMENT_END;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.abruptClosingOfEmptyComment);
                this.state = State.DATA;
                this.emitCurrentComment(token);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInComment);
                this.emitCurrentComment(token);
                this._emitEOFToken();
                break;
            }
            default: {
                token.data += '-';
                this.state = State.COMMENT;
                this._stateComment(cp);
            }
        }
    }
    // Comment state
    //------------------------------------------------------------------
    _stateComment(cp) {
        const token = this.currentToken;
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS: {
                this.state = State.COMMENT_END_DASH;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN: {
                token.data += '<';
                this.state = State.COMMENT_LESS_THAN_SIGN;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                token.data += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInComment);
                this.emitCurrentComment(token);
                this._emitEOFToken();
                break;
            }
            default: {
                token.data += String.fromCodePoint(cp);
            }
        }
    }
    // Comment less-than sign state
    //------------------------------------------------------------------
    _stateCommentLessThanSign(cp) {
        const token = this.currentToken;
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EXCLAMATION_MARK: {
                token.data += '!';
                this.state = State.COMMENT_LESS_THAN_SIGN_BANG;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LESS_THAN_SIGN: {
                token.data += '<';
                break;
            }
            default: {
                this.state = State.COMMENT;
                this._stateComment(cp);
            }
        }
    }
    // Comment less-than sign bang state
    //------------------------------------------------------------------
    _stateCommentLessThanSignBang(cp) {
        if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS) {
            this.state = State.COMMENT_LESS_THAN_SIGN_BANG_DASH;
        }
        else {
            this.state = State.COMMENT;
            this._stateComment(cp);
        }
    }
    // Comment less-than sign bang dash state
    //------------------------------------------------------------------
    _stateCommentLessThanSignBangDash(cp) {
        if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS) {
            this.state = State.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH;
        }
        else {
            this.state = State.COMMENT_END_DASH;
            this._stateCommentEndDash(cp);
        }
    }
    // Comment less-than sign bang dash dash state
    //------------------------------------------------------------------
    _stateCommentLessThanSignBangDashDash(cp) {
        if (cp !== _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN && cp !== _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF) {
            this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.nestedComment);
        }
        this.state = State.COMMENT_END;
        this._stateCommentEnd(cp);
    }
    // Comment end dash state
    //------------------------------------------------------------------
    _stateCommentEndDash(cp) {
        const token = this.currentToken;
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS: {
                this.state = State.COMMENT_END;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInComment);
                this.emitCurrentComment(token);
                this._emitEOFToken();
                break;
            }
            default: {
                token.data += '-';
                this.state = State.COMMENT;
                this._stateComment(cp);
            }
        }
    }
    // Comment end state
    //------------------------------------------------------------------
    _stateCommentEnd(cp) {
        const token = this.currentToken;
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this.state = State.DATA;
                this.emitCurrentComment(token);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EXCLAMATION_MARK: {
                this.state = State.COMMENT_END_BANG;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS: {
                token.data += '-';
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInComment);
                this.emitCurrentComment(token);
                this._emitEOFToken();
                break;
            }
            default: {
                token.data += '--';
                this.state = State.COMMENT;
                this._stateComment(cp);
            }
        }
    }
    // Comment end bang state
    //------------------------------------------------------------------
    _stateCommentEndBang(cp) {
        const token = this.currentToken;
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.HYPHEN_MINUS: {
                token.data += '--!';
                this.state = State.COMMENT_END_DASH;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.incorrectlyClosedComment);
                this.state = State.DATA;
                this.emitCurrentComment(token);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInComment);
                this.emitCurrentComment(token);
                this._emitEOFToken();
                break;
            }
            default: {
                token.data += '--!';
                this.state = State.COMMENT;
                this._stateComment(cp);
            }
        }
    }
    // DOCTYPE state
    //------------------------------------------------------------------
    _stateDoctype(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED: {
                this.state = State.BEFORE_DOCTYPE_NAME;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this.state = State.BEFORE_DOCTYPE_NAME;
                this._stateBeforeDoctypeName(cp);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);
                this._createDoctypeToken(null);
                const token = this.currentToken;
                token.forceQuirks = true;
                this.emitCurrentDoctype(token);
                this._emitEOFToken();
                break;
            }
            default: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingWhitespaceBeforeDoctypeName);
                this.state = State.BEFORE_DOCTYPE_NAME;
                this._stateBeforeDoctypeName(cp);
            }
        }
    }
    // Before DOCTYPE name state
    //------------------------------------------------------------------
    _stateBeforeDoctypeName(cp) {
        if (isAsciiUpper(cp)) {
            this._createDoctypeToken(String.fromCharCode(toAsciiLower(cp)));
            this.state = State.DOCTYPE_NAME;
        }
        else
            switch (cp) {
                case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
                case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
                case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
                case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED: {
                    // Ignore whitespace
                    break;
                }
                case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                    this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                    this._createDoctypeToken(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER);
                    this.state = State.DOCTYPE_NAME;
                    break;
                }
                case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                    this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingDoctypeName);
                    this._createDoctypeToken(null);
                    const token = this.currentToken;
                    token.forceQuirks = true;
                    this.emitCurrentDoctype(token);
                    this.state = State.DATA;
                    break;
                }
                case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                    this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);
                    this._createDoctypeToken(null);
                    const token = this.currentToken;
                    token.forceQuirks = true;
                    this.emitCurrentDoctype(token);
                    this._emitEOFToken();
                    break;
                }
                default: {
                    this._createDoctypeToken(String.fromCodePoint(cp));
                    this.state = State.DOCTYPE_NAME;
                }
            }
    }
    // DOCTYPE name state
    //------------------------------------------------------------------
    _stateDoctypeName(cp) {
        const token = this.currentToken;
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED: {
                this.state = State.AFTER_DOCTYPE_NAME;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this.state = State.DATA;
                this.emitCurrentDoctype(token);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                token.name += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);
                token.forceQuirks = true;
                this.emitCurrentDoctype(token);
                this._emitEOFToken();
                break;
            }
            default: {
                token.name += String.fromCodePoint(isAsciiUpper(cp) ? toAsciiLower(cp) : cp);
            }
        }
    }
    // After DOCTYPE name state
    //------------------------------------------------------------------
    _stateAfterDoctypeName(cp) {
        const token = this.currentToken;
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED: {
                // Ignore whitespace
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this.state = State.DATA;
                this.emitCurrentDoctype(token);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);
                token.forceQuirks = true;
                this.emitCurrentDoctype(token);
                this._emitEOFToken();
                break;
            }
            default:
                if (this._consumeSequenceIfMatch(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.PUBLIC, false)) {
                    this.state = State.AFTER_DOCTYPE_PUBLIC_KEYWORD;
                }
                else if (this._consumeSequenceIfMatch(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.SEQUENCES.SYSTEM, false)) {
                    this.state = State.AFTER_DOCTYPE_SYSTEM_KEYWORD;
                }
                //NOTE: sequence lookup can be abrupted by hibernation. In that case lookup
                //results are no longer valid and we will need to start over.
                else if (!this._ensureHibernation()) {
                    this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.invalidCharacterSequenceAfterDoctypeName);
                    token.forceQuirks = true;
                    this.state = State.BOGUS_DOCTYPE;
                    this._stateBogusDoctype(cp);
                }
        }
    }
    // After DOCTYPE public keyword state
    //------------------------------------------------------------------
    _stateAfterDoctypePublicKeyword(cp) {
        const token = this.currentToken;
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED: {
                this.state = State.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingWhitespaceAfterDoctypePublicKeyword);
                token.publicId = '';
                this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingWhitespaceAfterDoctypePublicKeyword);
                token.publicId = '';
                this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingDoctypePublicIdentifier);
                token.forceQuirks = true;
                this.state = State.DATA;
                this.emitCurrentDoctype(token);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);
                token.forceQuirks = true;
                this.emitCurrentDoctype(token);
                this._emitEOFToken();
                break;
            }
            default: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingQuoteBeforeDoctypePublicIdentifier);
                token.forceQuirks = true;
                this.state = State.BOGUS_DOCTYPE;
                this._stateBogusDoctype(cp);
            }
        }
    }
    // Before DOCTYPE public identifier state
    //------------------------------------------------------------------
    _stateBeforeDoctypePublicIdentifier(cp) {
        const token = this.currentToken;
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED: {
                // Ignore whitespace
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK: {
                token.publicId = '';
                this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE: {
                token.publicId = '';
                this.state = State.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingDoctypePublicIdentifier);
                token.forceQuirks = true;
                this.state = State.DATA;
                this.emitCurrentDoctype(token);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);
                token.forceQuirks = true;
                this.emitCurrentDoctype(token);
                this._emitEOFToken();
                break;
            }
            default: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingQuoteBeforeDoctypePublicIdentifier);
                token.forceQuirks = true;
                this.state = State.BOGUS_DOCTYPE;
                this._stateBogusDoctype(cp);
            }
        }
    }
    // DOCTYPE public identifier (double-quoted) state
    //------------------------------------------------------------------
    _stateDoctypePublicIdentifierDoubleQuoted(cp) {
        const token = this.currentToken;
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK: {
                this.state = State.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                token.publicId += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.abruptDoctypePublicIdentifier);
                token.forceQuirks = true;
                this.emitCurrentDoctype(token);
                this.state = State.DATA;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);
                token.forceQuirks = true;
                this.emitCurrentDoctype(token);
                this._emitEOFToken();
                break;
            }
            default: {
                token.publicId += String.fromCodePoint(cp);
            }
        }
    }
    // DOCTYPE public identifier (single-quoted) state
    //------------------------------------------------------------------
    _stateDoctypePublicIdentifierSingleQuoted(cp) {
        const token = this.currentToken;
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE: {
                this.state = State.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                token.publicId += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.abruptDoctypePublicIdentifier);
                token.forceQuirks = true;
                this.emitCurrentDoctype(token);
                this.state = State.DATA;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);
                token.forceQuirks = true;
                this.emitCurrentDoctype(token);
                this._emitEOFToken();
                break;
            }
            default: {
                token.publicId += String.fromCodePoint(cp);
            }
        }
    }
    // After DOCTYPE public identifier state
    //------------------------------------------------------------------
    _stateAfterDoctypePublicIdentifier(cp) {
        const token = this.currentToken;
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED: {
                this.state = State.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this.state = State.DATA;
                this.emitCurrentDoctype(token);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers);
                token.systemId = '';
                this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers);
                token.systemId = '';
                this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);
                token.forceQuirks = true;
                this.emitCurrentDoctype(token);
                this._emitEOFToken();
                break;
            }
            default: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingQuoteBeforeDoctypeSystemIdentifier);
                token.forceQuirks = true;
                this.state = State.BOGUS_DOCTYPE;
                this._stateBogusDoctype(cp);
            }
        }
    }
    // Between DOCTYPE public and system identifiers state
    //------------------------------------------------------------------
    _stateBetweenDoctypePublicAndSystemIdentifiers(cp) {
        const token = this.currentToken;
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED: {
                // Ignore whitespace
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this.emitCurrentDoctype(token);
                this.state = State.DATA;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK: {
                token.systemId = '';
                this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE: {
                token.systemId = '';
                this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);
                token.forceQuirks = true;
                this.emitCurrentDoctype(token);
                this._emitEOFToken();
                break;
            }
            default: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingQuoteBeforeDoctypeSystemIdentifier);
                token.forceQuirks = true;
                this.state = State.BOGUS_DOCTYPE;
                this._stateBogusDoctype(cp);
            }
        }
    }
    // After DOCTYPE system keyword state
    //------------------------------------------------------------------
    _stateAfterDoctypeSystemKeyword(cp) {
        const token = this.currentToken;
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED: {
                this.state = State.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingWhitespaceAfterDoctypeSystemKeyword);
                token.systemId = '';
                this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingWhitespaceAfterDoctypeSystemKeyword);
                token.systemId = '';
                this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingDoctypeSystemIdentifier);
                token.forceQuirks = true;
                this.state = State.DATA;
                this.emitCurrentDoctype(token);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);
                token.forceQuirks = true;
                this.emitCurrentDoctype(token);
                this._emitEOFToken();
                break;
            }
            default: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingQuoteBeforeDoctypeSystemIdentifier);
                token.forceQuirks = true;
                this.state = State.BOGUS_DOCTYPE;
                this._stateBogusDoctype(cp);
            }
        }
    }
    // Before DOCTYPE system identifier state
    //------------------------------------------------------------------
    _stateBeforeDoctypeSystemIdentifier(cp) {
        const token = this.currentToken;
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED: {
                // Ignore whitespace
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK: {
                token.systemId = '';
                this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE: {
                token.systemId = '';
                this.state = State.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingDoctypeSystemIdentifier);
                token.forceQuirks = true;
                this.state = State.DATA;
                this.emitCurrentDoctype(token);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);
                token.forceQuirks = true;
                this.emitCurrentDoctype(token);
                this._emitEOFToken();
                break;
            }
            default: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingQuoteBeforeDoctypeSystemIdentifier);
                token.forceQuirks = true;
                this.state = State.BOGUS_DOCTYPE;
                this._stateBogusDoctype(cp);
            }
        }
    }
    // DOCTYPE system identifier (double-quoted) state
    //------------------------------------------------------------------
    _stateDoctypeSystemIdentifierDoubleQuoted(cp) {
        const token = this.currentToken;
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.QUOTATION_MARK: {
                this.state = State.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                token.systemId += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.abruptDoctypeSystemIdentifier);
                token.forceQuirks = true;
                this.emitCurrentDoctype(token);
                this.state = State.DATA;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);
                token.forceQuirks = true;
                this.emitCurrentDoctype(token);
                this._emitEOFToken();
                break;
            }
            default: {
                token.systemId += String.fromCodePoint(cp);
            }
        }
    }
    // DOCTYPE system identifier (single-quoted) state
    //------------------------------------------------------------------
    _stateDoctypeSystemIdentifierSingleQuoted(cp) {
        const token = this.currentToken;
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.APOSTROPHE: {
                this.state = State.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                token.systemId += _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.REPLACEMENT_CHARACTER;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.abruptDoctypeSystemIdentifier);
                token.forceQuirks = true;
                this.emitCurrentDoctype(token);
                this.state = State.DATA;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);
                token.forceQuirks = true;
                this.emitCurrentDoctype(token);
                this._emitEOFToken();
                break;
            }
            default: {
                token.systemId += String.fromCodePoint(cp);
            }
        }
    }
    // After DOCTYPE system identifier state
    //------------------------------------------------------------------
    _stateAfterDoctypeSystemIdentifier(cp) {
        const token = this.currentToken;
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SPACE:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LINE_FEED:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.TABULATION:
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.FORM_FEED: {
                // Ignore whitespace
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this.emitCurrentDoctype(token);
                this.state = State.DATA;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInDoctype);
                token.forceQuirks = true;
                this.emitCurrentDoctype(token);
                this._emitEOFToken();
                break;
            }
            default: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedCharacterAfterDoctypeSystemIdentifier);
                this.state = State.BOGUS_DOCTYPE;
                this._stateBogusDoctype(cp);
            }
        }
    }
    // Bogus DOCTYPE state
    //------------------------------------------------------------------
    _stateBogusDoctype(cp) {
        const token = this.currentToken;
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this.emitCurrentDoctype(token);
                this.state = State.DATA;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unexpectedNullCharacter);
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this.emitCurrentDoctype(token);
                this._emitEOFToken();
                break;
            }
            default:
            // Do nothing
        }
    }
    // CDATA section state
    //------------------------------------------------------------------
    _stateCdataSection(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.RIGHT_SQUARE_BRACKET: {
                this.state = State.CDATA_SECTION_BRACKET;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.EOF: {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.eofInCdata);
                this._emitEOFToken();
                break;
            }
            default: {
                this._emitCodePoint(cp);
            }
        }
    }
    // CDATA section bracket state
    //------------------------------------------------------------------
    _stateCdataSectionBracket(cp) {
        if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.RIGHT_SQUARE_BRACKET) {
            this.state = State.CDATA_SECTION_END;
        }
        else {
            this._emitChars(']');
            this.state = State.CDATA_SECTION;
            this._stateCdataSection(cp);
        }
    }
    // CDATA section end state
    //------------------------------------------------------------------
    _stateCdataSectionEnd(cp) {
        switch (cp) {
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.GREATER_THAN_SIGN: {
                this.state = State.DATA;
                break;
            }
            case _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.RIGHT_SQUARE_BRACKET: {
                this._emitChars(']');
                break;
            }
            default: {
                this._emitChars(']]');
                this.state = State.CDATA_SECTION;
                this._stateCdataSection(cp);
            }
        }
    }
    // Character reference state
    //------------------------------------------------------------------
    _stateCharacterReference(cp) {
        if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NUMBER_SIGN) {
            this.state = State.NUMERIC_CHARACTER_REFERENCE;
        }
        else if (isAsciiAlphaNumeric(cp)) {
            this.state = State.NAMED_CHARACTER_REFERENCE;
            this._stateNamedCharacterReference(cp);
        }
        else {
            this._flushCodePointConsumedAsCharacterReference(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.AMPERSAND);
            this._reconsumeInState(this.returnState);
        }
    }
    // Named character reference state
    //------------------------------------------------------------------
    _stateNamedCharacterReference(cp) {
        const matchResult = this._matchNamedCharacterReference(cp);
        //NOTE: Matching can be abrupted by hibernation. In that case, match
        //results are no longer valid and we will need to start over.
        if (this._ensureHibernation()) {
            // Stay in the state, try again.
        }
        else if (matchResult) {
            for (let i = 0; i < matchResult.length; i++) {
                this._flushCodePointConsumedAsCharacterReference(matchResult[i]);
            }
            this.state = this.returnState;
        }
        else {
            this._flushCodePointConsumedAsCharacterReference(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.AMPERSAND);
            this.state = State.AMBIGUOUS_AMPERSAND;
        }
    }
    // Ambiguos ampersand state
    //------------------------------------------------------------------
    _stateAmbiguousAmpersand(cp) {
        if (isAsciiAlphaNumeric(cp)) {
            this._flushCodePointConsumedAsCharacterReference(cp);
        }
        else {
            if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SEMICOLON) {
                this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.unknownNamedCharacterReference);
            }
            this._reconsumeInState(this.returnState);
        }
    }
    // Numeric character reference state
    //------------------------------------------------------------------
    _stateNumericCharacterReference(cp) {
        this.charRefCode = 0;
        if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LATIN_SMALL_X || cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.LATIN_CAPITAL_X) {
            this.state = State.HEXADEMICAL_CHARACTER_REFERENCE_START;
        }
        else {
            this.state = State.DECIMAL_CHARACTER_REFERENCE_START;
            this._stateDecimalCharacterReferenceStart(cp);
        }
    }
    // Hexademical character reference start state
    //------------------------------------------------------------------
    _stateHexademicalCharacterReferenceStart(cp) {
        if (isAsciiHexDigit(cp)) {
            this.state = State.HEXADEMICAL_CHARACTER_REFERENCE;
            this._stateHexademicalCharacterReference(cp);
        }
        else {
            this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.absenceOfDigitsInNumericCharacterReference);
            this._flushCodePointConsumedAsCharacterReference(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.AMPERSAND);
            this._flushCodePointConsumedAsCharacterReference(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NUMBER_SIGN);
            this._unconsume(2);
            this.state = this.returnState;
        }
    }
    // Decimal character reference start state
    //------------------------------------------------------------------
    _stateDecimalCharacterReferenceStart(cp) {
        if (isAsciiDigit(cp)) {
            this.state = State.DECIMAL_CHARACTER_REFERENCE;
            this._stateDecimalCharacterReference(cp);
        }
        else {
            this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.absenceOfDigitsInNumericCharacterReference);
            this._flushCodePointConsumedAsCharacterReference(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.AMPERSAND);
            this._flushCodePointConsumedAsCharacterReference(_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NUMBER_SIGN);
            this._reconsumeInState(this.returnState);
        }
    }
    // Hexademical character reference state
    //------------------------------------------------------------------
    _stateHexademicalCharacterReference(cp) {
        if (isAsciiUpperHexDigit(cp)) {
            this.charRefCode = this.charRefCode * 16 + cp - 0x37;
        }
        else if (isAsciiLowerHexDigit(cp)) {
            this.charRefCode = this.charRefCode * 16 + cp - 0x57;
        }
        else if (isAsciiDigit(cp)) {
            this.charRefCode = this.charRefCode * 16 + cp - 0x30;
        }
        else if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SEMICOLON) {
            this.state = State.NUMERIC_CHARACTER_REFERENCE_END;
        }
        else {
            this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingSemicolonAfterCharacterReference);
            this.state = State.NUMERIC_CHARACTER_REFERENCE_END;
            this._stateNumericCharacterReferenceEnd();
        }
    }
    // Decimal character reference state
    //------------------------------------------------------------------
    _stateDecimalCharacterReference(cp) {
        if (isAsciiDigit(cp)) {
            this.charRefCode = this.charRefCode * 10 + cp - 0x30;
        }
        else if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.SEMICOLON) {
            this.state = State.NUMERIC_CHARACTER_REFERENCE_END;
        }
        else {
            this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.missingSemicolonAfterCharacterReference);
            this.state = State.NUMERIC_CHARACTER_REFERENCE_END;
            this._stateNumericCharacterReferenceEnd();
        }
    }
    // Numeric character reference end state
    //------------------------------------------------------------------
    _stateNumericCharacterReferenceEnd() {
        if (this.charRefCode === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.NULL) {
            this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.nullCharacterReference);
            this.charRefCode = _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.REPLACEMENT_CHARACTER;
        }
        else if (this.charRefCode > 1114111) {
            this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.characterReferenceOutsideUnicodeRange);
            this.charRefCode = _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.REPLACEMENT_CHARACTER;
        }
        else if ((0,_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.isSurrogate)(this.charRefCode)) {
            this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.surrogateCharacterReference);
            this.charRefCode = _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.REPLACEMENT_CHARACTER;
        }
        else if ((0,_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.isUndefinedCodePoint)(this.charRefCode)) {
            this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.noncharacterCharacterReference);
        }
        else if ((0,_common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.isControlCodePoint)(this.charRefCode) || this.charRefCode === _common_unicode_js__WEBPACK_IMPORTED_MODULE_1__.CODE_POINTS.CARRIAGE_RETURN) {
            this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_4__.ERR.controlCharacterReference);
            const replacement = C1_CONTROLS_REFERENCE_REPLACEMENTS.get(this.charRefCode);
            if (replacement !== undefined) {
                this.charRefCode = replacement;
            }
        }
        this._flushCodePointConsumedAsCharacterReference(this.charRefCode);
        this._reconsumeInState(this.returnState);
    }
}
//# sourceMappingURL=index.js.map

/***/ }),
/* 29 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Preprocessor": () => (/* binding */ Preprocessor)
/* harmony export */ });
/* harmony import */ var _common_unicode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(30);
/* harmony import */ var _common_error_codes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(31);


//Const
const DEFAULT_BUFFER_WATERLINE = 1 << 16;
//Preprocessor
//NOTE: HTML input preprocessing
//(see: http://www.whatwg.org/specs/web-apps/current-work/multipage/parsing.html#preprocessing-the-input-stream)
class Preprocessor {
    constructor(handler) {
        this.handler = handler;
        this.html = '';
        this.pos = -1;
        // NOTE: Initial `lastGapPos` is -2, to ensure `col` on initialisation is 0
        this.lastGapPos = -2;
        this.gapStack = [];
        this.skipNextNewLine = false;
        this.lastChunkWritten = false;
        this.endOfChunkHit = false;
        this.bufferWaterline = DEFAULT_BUFFER_WATERLINE;
        this.isEol = false;
        this.lineStartPos = 0;
        this.droppedBufferSize = 0;
        this.line = 1;
        //NOTE: avoid reporting errors twice on advance/retreat
        this.lastErrOffset = -1;
    }
    /** The column on the current line. If we just saw a gap (eg. a surrogate pair), return the index before. */
    get col() {
        return this.pos - this.lineStartPos + Number(this.lastGapPos !== this.pos);
    }
    get offset() {
        return this.droppedBufferSize + this.pos;
    }
    getError(code) {
        const { line, col, offset } = this;
        return {
            code,
            startLine: line,
            endLine: line,
            startCol: col,
            endCol: col,
            startOffset: offset,
            endOffset: offset,
        };
    }
    _err(code) {
        if (this.handler.onParseError && this.lastErrOffset !== this.offset) {
            this.lastErrOffset = this.offset;
            this.handler.onParseError(this.getError(code));
        }
    }
    _addGap() {
        this.gapStack.push(this.lastGapPos);
        this.lastGapPos = this.pos;
    }
    _processSurrogate(cp) {
        //NOTE: try to peek a surrogate pair
        if (this.pos !== this.html.length - 1) {
            const nextCp = this.html.charCodeAt(this.pos + 1);
            if ((0,_common_unicode_js__WEBPACK_IMPORTED_MODULE_0__.isSurrogatePair)(nextCp)) {
                //NOTE: we have a surrogate pair. Peek pair character and recalculate code point.
                this.pos++;
                //NOTE: add a gap that should be avoided during retreat
                this._addGap();
                return (0,_common_unicode_js__WEBPACK_IMPORTED_MODULE_0__.getSurrogatePairCodePoint)(cp, nextCp);
            }
        }
        //NOTE: we are at the end of a chunk, therefore we can't infer the surrogate pair yet.
        else if (!this.lastChunkWritten) {
            this.endOfChunkHit = true;
            return _common_unicode_js__WEBPACK_IMPORTED_MODULE_0__.CODE_POINTS.EOF;
        }
        //NOTE: isolated surrogate
        this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_1__.ERR.surrogateInInputStream);
        return cp;
    }
    willDropParsedChunk() {
        return this.pos > this.bufferWaterline;
    }
    dropParsedChunk() {
        if (this.willDropParsedChunk()) {
            this.html = this.html.substring(this.pos);
            this.lineStartPos -= this.pos;
            this.droppedBufferSize += this.pos;
            this.pos = 0;
            this.lastGapPos = -2;
            this.gapStack.length = 0;
        }
    }
    write(chunk, isLastChunk) {
        if (this.html.length > 0) {
            this.html += chunk;
        }
        else {
            this.html = chunk;
        }
        this.endOfChunkHit = false;
        this.lastChunkWritten = isLastChunk;
    }
    insertHtmlAtCurrentPos(chunk) {
        this.html = this.html.substring(0, this.pos + 1) + chunk + this.html.substring(this.pos + 1);
        this.endOfChunkHit = false;
    }
    startsWith(pattern, caseSensitive) {
        // Check if our buffer has enough characters
        if (this.pos + pattern.length > this.html.length) {
            this.endOfChunkHit = !this.lastChunkWritten;
            return false;
        }
        if (caseSensitive) {
            return this.html.startsWith(pattern, this.pos);
        }
        for (let i = 0; i < pattern.length; i++) {
            const cp = this.html.charCodeAt(this.pos + i) | 0x20;
            if (cp !== pattern.charCodeAt(i)) {
                return false;
            }
        }
        return true;
    }
    peek(offset) {
        const pos = this.pos + offset;
        if (pos >= this.html.length) {
            this.endOfChunkHit = !this.lastChunkWritten;
            return _common_unicode_js__WEBPACK_IMPORTED_MODULE_0__.CODE_POINTS.EOF;
        }
        return this.html.charCodeAt(pos);
    }
    advance() {
        this.pos++;
        //NOTE: LF should be in the last column of the line
        if (this.isEol) {
            this.isEol = false;
            this.line++;
            this.lineStartPos = this.pos;
        }
        if (this.pos >= this.html.length) {
            this.endOfChunkHit = !this.lastChunkWritten;
            return _common_unicode_js__WEBPACK_IMPORTED_MODULE_0__.CODE_POINTS.EOF;
        }
        let cp = this.html.charCodeAt(this.pos);
        //NOTE: all U+000D CARRIAGE RETURN (CR) characters must be converted to U+000A LINE FEED (LF) characters
        if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_0__.CODE_POINTS.CARRIAGE_RETURN) {
            this.isEol = true;
            this.skipNextNewLine = true;
            return _common_unicode_js__WEBPACK_IMPORTED_MODULE_0__.CODE_POINTS.LINE_FEED;
        }
        //NOTE: any U+000A LINE FEED (LF) characters that immediately follow a U+000D CARRIAGE RETURN (CR) character
        //must be ignored.
        if (cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_0__.CODE_POINTS.LINE_FEED) {
            this.isEol = true;
            if (this.skipNextNewLine) {
                // `line` will be bumped again in the recursive call.
                this.line--;
                this.skipNextNewLine = false;
                this._addGap();
                return this.advance();
            }
        }
        this.skipNextNewLine = false;
        if ((0,_common_unicode_js__WEBPACK_IMPORTED_MODULE_0__.isSurrogate)(cp)) {
            cp = this._processSurrogate(cp);
        }
        //OPTIMIZATION: first check if code point is in the common allowed
        //range (ASCII alphanumeric, whitespaces, big chunk of BMP)
        //before going into detailed performance cost validation.
        const isCommonValidRange = this.handler.onParseError === null ||
            (cp > 0x1f && cp < 0x7f) ||
            cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_0__.CODE_POINTS.LINE_FEED ||
            cp === _common_unicode_js__WEBPACK_IMPORTED_MODULE_0__.CODE_POINTS.CARRIAGE_RETURN ||
            (cp > 0x9f && cp < 64976);
        if (!isCommonValidRange) {
            this._checkForProblematicCharacters(cp);
        }
        return cp;
    }
    _checkForProblematicCharacters(cp) {
        if ((0,_common_unicode_js__WEBPACK_IMPORTED_MODULE_0__.isControlCodePoint)(cp)) {
            this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_1__.ERR.controlCharacterInInputStream);
        }
        else if ((0,_common_unicode_js__WEBPACK_IMPORTED_MODULE_0__.isUndefinedCodePoint)(cp)) {
            this._err(_common_error_codes_js__WEBPACK_IMPORTED_MODULE_1__.ERR.noncharacterInInputStream);
        }
    }
    retreat(count) {
        this.pos -= count;
        while (this.pos < this.lastGapPos) {
            this.lastGapPos = this.gapStack.pop();
            this.pos--;
        }
        this.isEol = false;
    }
}
//# sourceMappingURL=preprocessor.js.map

/***/ }),
/* 30 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CODE_POINTS": () => (/* binding */ CODE_POINTS),
/* harmony export */   "REPLACEMENT_CHARACTER": () => (/* binding */ REPLACEMENT_CHARACTER),
/* harmony export */   "SEQUENCES": () => (/* binding */ SEQUENCES),
/* harmony export */   "getSurrogatePairCodePoint": () => (/* binding */ getSurrogatePairCodePoint),
/* harmony export */   "isControlCodePoint": () => (/* binding */ isControlCodePoint),
/* harmony export */   "isSurrogate": () => (/* binding */ isSurrogate),
/* harmony export */   "isSurrogatePair": () => (/* binding */ isSurrogatePair),
/* harmony export */   "isUndefinedCodePoint": () => (/* binding */ isUndefinedCodePoint)
/* harmony export */ });
const UNDEFINED_CODE_POINTS = new Set([
    65534, 65535, 131070, 131071, 196606, 196607, 262142, 262143, 327678, 327679, 393214,
    393215, 458750, 458751, 524286, 524287, 589822, 589823, 655358, 655359, 720894,
    720895, 786430, 786431, 851966, 851967, 917502, 917503, 983038, 983039, 1048574,
    1048575, 1114110, 1114111,
]);
const REPLACEMENT_CHARACTER = '\uFFFD';
var CODE_POINTS;
(function (CODE_POINTS) {
    CODE_POINTS[CODE_POINTS["EOF"] = -1] = "EOF";
    CODE_POINTS[CODE_POINTS["NULL"] = 0] = "NULL";
    CODE_POINTS[CODE_POINTS["TABULATION"] = 9] = "TABULATION";
    CODE_POINTS[CODE_POINTS["CARRIAGE_RETURN"] = 13] = "CARRIAGE_RETURN";
    CODE_POINTS[CODE_POINTS["LINE_FEED"] = 10] = "LINE_FEED";
    CODE_POINTS[CODE_POINTS["FORM_FEED"] = 12] = "FORM_FEED";
    CODE_POINTS[CODE_POINTS["SPACE"] = 32] = "SPACE";
    CODE_POINTS[CODE_POINTS["EXCLAMATION_MARK"] = 33] = "EXCLAMATION_MARK";
    CODE_POINTS[CODE_POINTS["QUOTATION_MARK"] = 34] = "QUOTATION_MARK";
    CODE_POINTS[CODE_POINTS["NUMBER_SIGN"] = 35] = "NUMBER_SIGN";
    CODE_POINTS[CODE_POINTS["AMPERSAND"] = 38] = "AMPERSAND";
    CODE_POINTS[CODE_POINTS["APOSTROPHE"] = 39] = "APOSTROPHE";
    CODE_POINTS[CODE_POINTS["HYPHEN_MINUS"] = 45] = "HYPHEN_MINUS";
    CODE_POINTS[CODE_POINTS["SOLIDUS"] = 47] = "SOLIDUS";
    CODE_POINTS[CODE_POINTS["DIGIT_0"] = 48] = "DIGIT_0";
    CODE_POINTS[CODE_POINTS["DIGIT_9"] = 57] = "DIGIT_9";
    CODE_POINTS[CODE_POINTS["SEMICOLON"] = 59] = "SEMICOLON";
    CODE_POINTS[CODE_POINTS["LESS_THAN_SIGN"] = 60] = "LESS_THAN_SIGN";
    CODE_POINTS[CODE_POINTS["EQUALS_SIGN"] = 61] = "EQUALS_SIGN";
    CODE_POINTS[CODE_POINTS["GREATER_THAN_SIGN"] = 62] = "GREATER_THAN_SIGN";
    CODE_POINTS[CODE_POINTS["QUESTION_MARK"] = 63] = "QUESTION_MARK";
    CODE_POINTS[CODE_POINTS["LATIN_CAPITAL_A"] = 65] = "LATIN_CAPITAL_A";
    CODE_POINTS[CODE_POINTS["LATIN_CAPITAL_F"] = 70] = "LATIN_CAPITAL_F";
    CODE_POINTS[CODE_POINTS["LATIN_CAPITAL_X"] = 88] = "LATIN_CAPITAL_X";
    CODE_POINTS[CODE_POINTS["LATIN_CAPITAL_Z"] = 90] = "LATIN_CAPITAL_Z";
    CODE_POINTS[CODE_POINTS["RIGHT_SQUARE_BRACKET"] = 93] = "RIGHT_SQUARE_BRACKET";
    CODE_POINTS[CODE_POINTS["GRAVE_ACCENT"] = 96] = "GRAVE_ACCENT";
    CODE_POINTS[CODE_POINTS["LATIN_SMALL_A"] = 97] = "LATIN_SMALL_A";
    CODE_POINTS[CODE_POINTS["LATIN_SMALL_F"] = 102] = "LATIN_SMALL_F";
    CODE_POINTS[CODE_POINTS["LATIN_SMALL_X"] = 120] = "LATIN_SMALL_X";
    CODE_POINTS[CODE_POINTS["LATIN_SMALL_Z"] = 122] = "LATIN_SMALL_Z";
    CODE_POINTS[CODE_POINTS["REPLACEMENT_CHARACTER"] = 65533] = "REPLACEMENT_CHARACTER";
})(CODE_POINTS || (CODE_POINTS = {}));
const SEQUENCES = {
    DASH_DASH: '--',
    CDATA_START: '[CDATA[',
    DOCTYPE: 'doctype',
    SCRIPT: 'script',
    PUBLIC: 'public',
    SYSTEM: 'system',
};
//Surrogates
function isSurrogate(cp) {
    return cp >= 55296 && cp <= 57343;
}
function isSurrogatePair(cp) {
    return cp >= 56320 && cp <= 57343;
}
function getSurrogatePairCodePoint(cp1, cp2) {
    return (cp1 - 55296) * 1024 + 9216 + cp2;
}
//NOTE: excluding NULL and ASCII whitespace
function isControlCodePoint(cp) {
    return ((cp !== 0x20 && cp !== 0x0a && cp !== 0x0d && cp !== 0x09 && cp !== 0x0c && cp >= 0x01 && cp <= 0x1f) ||
        (cp >= 0x7f && cp <= 0x9f));
}
function isUndefinedCodePoint(cp) {
    return (cp >= 64976 && cp <= 65007) || UNDEFINED_CODE_POINTS.has(cp);
}
//# sourceMappingURL=unicode.js.map

/***/ }),
/* 31 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ERR": () => (/* binding */ ERR)
/* harmony export */ });
var ERR;
(function (ERR) {
    ERR["controlCharacterInInputStream"] = "control-character-in-input-stream";
    ERR["noncharacterInInputStream"] = "noncharacter-in-input-stream";
    ERR["surrogateInInputStream"] = "surrogate-in-input-stream";
    ERR["nonVoidHtmlElementStartTagWithTrailingSolidus"] = "non-void-html-element-start-tag-with-trailing-solidus";
    ERR["endTagWithAttributes"] = "end-tag-with-attributes";
    ERR["endTagWithTrailingSolidus"] = "end-tag-with-trailing-solidus";
    ERR["unexpectedSolidusInTag"] = "unexpected-solidus-in-tag";
    ERR["unexpectedNullCharacter"] = "unexpected-null-character";
    ERR["unexpectedQuestionMarkInsteadOfTagName"] = "unexpected-question-mark-instead-of-tag-name";
    ERR["invalidFirstCharacterOfTagName"] = "invalid-first-character-of-tag-name";
    ERR["unexpectedEqualsSignBeforeAttributeName"] = "unexpected-equals-sign-before-attribute-name";
    ERR["missingEndTagName"] = "missing-end-tag-name";
    ERR["unexpectedCharacterInAttributeName"] = "unexpected-character-in-attribute-name";
    ERR["unknownNamedCharacterReference"] = "unknown-named-character-reference";
    ERR["missingSemicolonAfterCharacterReference"] = "missing-semicolon-after-character-reference";
    ERR["unexpectedCharacterAfterDoctypeSystemIdentifier"] = "unexpected-character-after-doctype-system-identifier";
    ERR["unexpectedCharacterInUnquotedAttributeValue"] = "unexpected-character-in-unquoted-attribute-value";
    ERR["eofBeforeTagName"] = "eof-before-tag-name";
    ERR["eofInTag"] = "eof-in-tag";
    ERR["missingAttributeValue"] = "missing-attribute-value";
    ERR["missingWhitespaceBetweenAttributes"] = "missing-whitespace-between-attributes";
    ERR["missingWhitespaceAfterDoctypePublicKeyword"] = "missing-whitespace-after-doctype-public-keyword";
    ERR["missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers"] = "missing-whitespace-between-doctype-public-and-system-identifiers";
    ERR["missingWhitespaceAfterDoctypeSystemKeyword"] = "missing-whitespace-after-doctype-system-keyword";
    ERR["missingQuoteBeforeDoctypePublicIdentifier"] = "missing-quote-before-doctype-public-identifier";
    ERR["missingQuoteBeforeDoctypeSystemIdentifier"] = "missing-quote-before-doctype-system-identifier";
    ERR["missingDoctypePublicIdentifier"] = "missing-doctype-public-identifier";
    ERR["missingDoctypeSystemIdentifier"] = "missing-doctype-system-identifier";
    ERR["abruptDoctypePublicIdentifier"] = "abrupt-doctype-public-identifier";
    ERR["abruptDoctypeSystemIdentifier"] = "abrupt-doctype-system-identifier";
    ERR["cdataInHtmlContent"] = "cdata-in-html-content";
    ERR["incorrectlyOpenedComment"] = "incorrectly-opened-comment";
    ERR["eofInScriptHtmlCommentLikeText"] = "eof-in-script-html-comment-like-text";
    ERR["eofInDoctype"] = "eof-in-doctype";
    ERR["nestedComment"] = "nested-comment";
    ERR["abruptClosingOfEmptyComment"] = "abrupt-closing-of-empty-comment";
    ERR["eofInComment"] = "eof-in-comment";
    ERR["incorrectlyClosedComment"] = "incorrectly-closed-comment";
    ERR["eofInCdata"] = "eof-in-cdata";
    ERR["absenceOfDigitsInNumericCharacterReference"] = "absence-of-digits-in-numeric-character-reference";
    ERR["nullCharacterReference"] = "null-character-reference";
    ERR["surrogateCharacterReference"] = "surrogate-character-reference";
    ERR["characterReferenceOutsideUnicodeRange"] = "character-reference-outside-unicode-range";
    ERR["controlCharacterReference"] = "control-character-reference";
    ERR["noncharacterCharacterReference"] = "noncharacter-character-reference";
    ERR["missingWhitespaceBeforeDoctypeName"] = "missing-whitespace-before-doctype-name";
    ERR["missingDoctypeName"] = "missing-doctype-name";
    ERR["invalidCharacterSequenceAfterDoctypeName"] = "invalid-character-sequence-after-doctype-name";
    ERR["duplicateAttribute"] = "duplicate-attribute";
    ERR["nonConformingDoctype"] = "non-conforming-doctype";
    ERR["missingDoctype"] = "missing-doctype";
    ERR["misplacedDoctype"] = "misplaced-doctype";
    ERR["endTagWithoutMatchingOpenElement"] = "end-tag-without-matching-open-element";
    ERR["closingOfElementWithOpenChildElements"] = "closing-of-element-with-open-child-elements";
    ERR["disallowedContentInNoscriptInHead"] = "disallowed-content-in-noscript-in-head";
    ERR["openElementsLeftAfterEof"] = "open-elements-left-after-eof";
    ERR["abandonedHeadElementChild"] = "abandoned-head-element-child";
    ERR["misplacedStartTagForHeadElement"] = "misplaced-start-tag-for-head-element";
    ERR["nestedNoscriptInHead"] = "nested-noscript-in-head";
    ERR["eofInElementThatCanContainOnlyText"] = "eof-in-element-that-can-contain-only-text";
})(ERR || (ERR = {}));
//# sourceMappingURL=error-codes.js.map

/***/ }),
/* 32 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TokenType": () => (/* binding */ TokenType),
/* harmony export */   "getTokenAttr": () => (/* binding */ getTokenAttr)
/* harmony export */ });
var TokenType;
(function (TokenType) {
    TokenType[TokenType["CHARACTER"] = 0] = "CHARACTER";
    TokenType[TokenType["NULL_CHARACTER"] = 1] = "NULL_CHARACTER";
    TokenType[TokenType["WHITESPACE_CHARACTER"] = 2] = "WHITESPACE_CHARACTER";
    TokenType[TokenType["START_TAG"] = 3] = "START_TAG";
    TokenType[TokenType["END_TAG"] = 4] = "END_TAG";
    TokenType[TokenType["COMMENT"] = 5] = "COMMENT";
    TokenType[TokenType["DOCTYPE"] = 6] = "DOCTYPE";
    TokenType[TokenType["EOF"] = 7] = "EOF";
    TokenType[TokenType["HIBERNATION"] = 8] = "HIBERNATION";
})(TokenType || (TokenType = {}));
function getTokenAttr(token, attrName) {
    for (let i = token.attrs.length - 1; i >= 0; i--) {
        if (token.attrs[i].name === attrName) {
            return token.attrs[i].value;
        }
    }
    return null;
}
//# sourceMappingURL=token.js.map

/***/ }),
/* 33 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BinTrieFlags": () => (/* binding */ BinTrieFlags),
/* harmony export */   "decodeCodePoint": () => (/* reexport safe */ _decode_codepoint_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "decodeHTML": () => (/* binding */ decodeHTML),
/* harmony export */   "decodeHTMLStrict": () => (/* binding */ decodeHTMLStrict),
/* harmony export */   "decodeXML": () => (/* binding */ decodeXML),
/* harmony export */   "determineBranch": () => (/* binding */ determineBranch),
/* harmony export */   "fromCodePoint": () => (/* reexport safe */ _decode_codepoint_js__WEBPACK_IMPORTED_MODULE_2__.fromCodePoint),
/* harmony export */   "htmlDecodeTree": () => (/* reexport safe */ _generated_decode_data_html_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "replaceCodePoint": () => (/* reexport safe */ _decode_codepoint_js__WEBPACK_IMPORTED_MODULE_2__.replaceCodePoint),
/* harmony export */   "xmlDecodeTree": () => (/* reexport safe */ _generated_decode_data_xml_js__WEBPACK_IMPORTED_MODULE_1__["default"])
/* harmony export */ });
/* harmony import */ var _generated_decode_data_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(34);
/* harmony import */ var _generated_decode_data_xml_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(35);
/* harmony import */ var _decode_codepoint_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(36);



// Re-export for use by eg. htmlparser2


var CharCodes;
(function (CharCodes) {
    CharCodes[CharCodes["NUM"] = 35] = "NUM";
    CharCodes[CharCodes["SEMI"] = 59] = "SEMI";
    CharCodes[CharCodes["ZERO"] = 48] = "ZERO";
    CharCodes[CharCodes["NINE"] = 57] = "NINE";
    CharCodes[CharCodes["LOWER_A"] = 97] = "LOWER_A";
    CharCodes[CharCodes["LOWER_F"] = 102] = "LOWER_F";
    CharCodes[CharCodes["LOWER_X"] = 120] = "LOWER_X";
    /** Bit that needs to be set to convert an upper case ASCII character to lower case */
    CharCodes[CharCodes["To_LOWER_BIT"] = 32] = "To_LOWER_BIT";
})(CharCodes || (CharCodes = {}));
var BinTrieFlags;
(function (BinTrieFlags) {
    BinTrieFlags[BinTrieFlags["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
    BinTrieFlags[BinTrieFlags["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
    BinTrieFlags[BinTrieFlags["JUMP_TABLE"] = 127] = "JUMP_TABLE";
})(BinTrieFlags || (BinTrieFlags = {}));
function getDecoder(decodeTree) {
    return function decodeHTMLBinary(str, strict) {
        let ret = "";
        let lastIdx = 0;
        let strIdx = 0;
        while ((strIdx = str.indexOf("&", strIdx)) >= 0) {
            ret += str.slice(lastIdx, strIdx);
            lastIdx = strIdx;
            // Skip the "&"
            strIdx += 1;
            // If we have a numeric entity, handle this separately.
            if (str.charCodeAt(strIdx) === CharCodes.NUM) {
                // Skip the leading "&#". For hex entities, also skip the leading "x".
                let start = strIdx + 1;
                let base = 10;
                let cp = str.charCodeAt(start);
                if ((cp | CharCodes.To_LOWER_BIT) === CharCodes.LOWER_X) {
                    base = 16;
                    strIdx += 1;
                    start += 1;
                }
                do
                    cp = str.charCodeAt(++strIdx);
                while ((cp >= CharCodes.ZERO && cp <= CharCodes.NINE) ||
                    (base === 16 &&
                        (cp | CharCodes.To_LOWER_BIT) >= CharCodes.LOWER_A &&
                        (cp | CharCodes.To_LOWER_BIT) <= CharCodes.LOWER_F));
                if (start !== strIdx) {
                    const entity = str.substring(start, strIdx);
                    const parsed = parseInt(entity, base);
                    if (str.charCodeAt(strIdx) === CharCodes.SEMI) {
                        strIdx += 1;
                    }
                    else if (strict) {
                        continue;
                    }
                    ret += (0,_decode_codepoint_js__WEBPACK_IMPORTED_MODULE_2__["default"])(parsed);
                    lastIdx = strIdx;
                }
                continue;
            }
            let resultIdx = 0;
            let excess = 1;
            let treeIdx = 0;
            let current = decodeTree[treeIdx];
            for (; strIdx < str.length; strIdx++, excess++) {
                treeIdx = determineBranch(decodeTree, current, treeIdx + 1, str.charCodeAt(strIdx));
                if (treeIdx < 0)
                    break;
                current = decodeTree[treeIdx];
                const masked = current & BinTrieFlags.VALUE_LENGTH;
                // If the branch is a value, store it and continue
                if (masked) {
                    // If we have a legacy entity while parsing strictly, just skip the number of bytes
                    if (!strict || str.charCodeAt(strIdx) === CharCodes.SEMI) {
                        resultIdx = treeIdx;
                        excess = 0;
                    }
                    // The mask is the number of bytes of the value, including the current byte.
                    const valueLength = (masked >> 14) - 1;
                    if (valueLength === 0)
                        break;
                    treeIdx += valueLength;
                }
            }
            if (resultIdx !== 0) {
                const valueLength = (decodeTree[resultIdx] & BinTrieFlags.VALUE_LENGTH) >> 14;
                ret +=
                    valueLength === 1
                        ? String.fromCharCode(decodeTree[resultIdx] & ~BinTrieFlags.VALUE_LENGTH)
                        : valueLength === 2
                            ? String.fromCharCode(decodeTree[resultIdx + 1])
                            : String.fromCharCode(decodeTree[resultIdx + 1], decodeTree[resultIdx + 2]);
                lastIdx = strIdx - excess + 1;
            }
        }
        return ret + str.slice(lastIdx);
    };
}
function determineBranch(decodeTree, current, nodeIdx, char) {
    const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
    const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
    // Case 1: Single branch encoded in jump offset
    if (branchCount === 0) {
        return jumpOffset !== 0 && char === jumpOffset ? nodeIdx : -1;
    }
    // Case 2: Multiple branches encoded in jump table
    if (jumpOffset) {
        const value = char - jumpOffset;
        return value < 0 || value >= branchCount
            ? -1
            : decodeTree[nodeIdx + value] - 1;
    }
    // Case 3: Multiple branches encoded in dictionary
    // Binary search for the character.
    let lo = nodeIdx;
    let hi = lo + branchCount - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >>> 1;
        const midVal = decodeTree[mid];
        if (midVal < char) {
            lo = mid + 1;
        }
        else if (midVal > char) {
            hi = mid - 1;
        }
        else {
            return decodeTree[mid + branchCount];
        }
    }
    return -1;
}
const htmlDecoder = getDecoder(_generated_decode_data_html_js__WEBPACK_IMPORTED_MODULE_0__["default"]);
const xmlDecoder = getDecoder(_generated_decode_data_xml_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
/**
 * Decodes an HTML string, allowing for entities not terminated by a semi-colon.
 *
 * @param str The string to decode.
 * @returns The decoded string.
 */
function decodeHTML(str) {
    return htmlDecoder(str, false);
}
/**
 * Decodes an HTML string, requiring all entities to be terminated by a semi-colon.
 *
 * @param str The string to decode.
 * @returns The decoded string.
 */
function decodeHTMLStrict(str) {
    return htmlDecoder(str, true);
}
/**
 * Decodes an XML string, requiring all entities to be terminated by a semi-colon.
 *
 * @param str The string to decode.
 * @returns The decoded string.
 */
function decodeXML(str) {
    return xmlDecoder(str, true);
}
//# sourceMappingURL=decode.js.map

/***/ }),
/* 34 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Generated using scripts/write-decode-map.ts
// prettier-ignore
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Uint16Array([7489, 60, 213, 305, 650, 1181, 1403, 1488, 1653, 1758, 1954, 2006, 2063, 2634, 2705, 3489, 3693, 3849, 3878, 4298, 4648, 4833, 5141, 5277, 5315, 5343, 5413, 0, 0, 0, 0, 0, 0, 5483, 5837, 6541, 7186, 7645, 8062, 8288, 8624, 8845, 9152, 9211, 9282, 10276, 10514, 11528, 11848, 12238, 12310, 12986, 13881, 14252, 14590, 14888, 14961, 15072, 15150, 2048, 69, 77, 97, 98, 99, 102, 103, 108, 109, 110, 111, 112, 114, 115, 116, 117, 92, 98, 102, 109, 115, 127, 132, 139, 144, 149, 152, 166, 179, 185, 200, 207, 108, 105, 103, 32827, 198, 16582, 80, 32827, 38, 16422, 99, 117, 116, 101, 32827, 193, 16577, 114, 101, 118, 101, 59, 16642, 256, 105, 121, 120, 125, 114, 99, 32827, 194, 16578, 59, 17424, 114, 59, 49152, 55349, 56580, 114, 97, 118, 101, 32827, 192, 16576, 112, 104, 97, 59, 17297, 97, 99, 114, 59, 16640, 100, 59, 27219, 256, 103, 112, 157, 161, 111, 110, 59, 16644, 102, 59, 49152, 55349, 56632, 112, 108, 121, 70, 117, 110, 99, 116, 105, 111, 110, 59, 24673, 105, 110, 103, 32827, 197, 16581, 256, 99, 115, 190, 195, 114, 59, 49152, 55349, 56476, 105, 103, 110, 59, 25172, 105, 108, 100, 101, 32827, 195, 16579, 109, 108, 32827, 196, 16580, 1024, 97, 99, 101, 102, 111, 114, 115, 117, 229, 251, 254, 279, 284, 290, 295, 298, 256, 99, 114, 234, 242, 107, 115, 108, 97, 115, 104, 59, 25110, 374, 246, 248, 59, 27367, 101, 100, 59, 25350, 121, 59, 17425, 384, 99, 114, 116, 261, 267, 276, 97, 117, 115, 101, 59, 25141, 110, 111, 117, 108, 108, 105, 115, 59, 24876, 97, 59, 17298, 114, 59, 49152, 55349, 56581, 112, 102, 59, 49152, 55349, 56633, 101, 118, 101, 59, 17112, 99, 242, 275, 109, 112, 101, 113, 59, 25166, 1792, 72, 79, 97, 99, 100, 101, 102, 104, 105, 108, 111, 114, 115, 117, 333, 337, 342, 384, 414, 418, 437, 439, 442, 476, 533, 627, 632, 638, 99, 121, 59, 17447, 80, 89, 32827, 169, 16553, 384, 99, 112, 121, 349, 354, 378, 117, 116, 101, 59, 16646, 256, 59, 105, 359, 360, 25298, 116, 97, 108, 68, 105, 102, 102, 101, 114, 101, 110, 116, 105, 97, 108, 68, 59, 24901, 108, 101, 121, 115, 59, 24877, 512, 97, 101, 105, 111, 393, 398, 404, 408, 114, 111, 110, 59, 16652, 100, 105, 108, 32827, 199, 16583, 114, 99, 59, 16648, 110, 105, 110, 116, 59, 25136, 111, 116, 59, 16650, 256, 100, 110, 423, 429, 105, 108, 108, 97, 59, 16568, 116, 101, 114, 68, 111, 116, 59, 16567, 242, 383, 105, 59, 17319, 114, 99, 108, 101, 512, 68, 77, 80, 84, 455, 459, 465, 470, 111, 116, 59, 25241, 105, 110, 117, 115, 59, 25238, 108, 117, 115, 59, 25237, 105, 109, 101, 115, 59, 25239, 111, 256, 99, 115, 482, 504, 107, 119, 105, 115, 101, 67, 111, 110, 116, 111, 117, 114, 73, 110, 116, 101, 103, 114, 97, 108, 59, 25138, 101, 67, 117, 114, 108, 121, 256, 68, 81, 515, 527, 111, 117, 98, 108, 101, 81, 117, 111, 116, 101, 59, 24605, 117, 111, 116, 101, 59, 24601, 512, 108, 110, 112, 117, 542, 552, 583, 597, 111, 110, 256, 59, 101, 549, 550, 25143, 59, 27252, 384, 103, 105, 116, 559, 566, 570, 114, 117, 101, 110, 116, 59, 25185, 110, 116, 59, 25135, 111, 117, 114, 73, 110, 116, 101, 103, 114, 97, 108, 59, 25134, 256, 102, 114, 588, 590, 59, 24834, 111, 100, 117, 99, 116, 59, 25104, 110, 116, 101, 114, 67, 108, 111, 99, 107, 119, 105, 115, 101, 67, 111, 110, 116, 111, 117, 114, 73, 110, 116, 101, 103, 114, 97, 108, 59, 25139, 111, 115, 115, 59, 27183, 99, 114, 59, 49152, 55349, 56478, 112, 256, 59, 67, 644, 645, 25299, 97, 112, 59, 25165, 1408, 68, 74, 83, 90, 97, 99, 101, 102, 105, 111, 115, 672, 684, 688, 692, 696, 715, 727, 737, 742, 819, 1165, 256, 59, 111, 377, 677, 116, 114, 97, 104, 100, 59, 26897, 99, 121, 59, 17410, 99, 121, 59, 17413, 99, 121, 59, 17423, 384, 103, 114, 115, 703, 708, 711, 103, 101, 114, 59, 24609, 114, 59, 24993, 104, 118, 59, 27364, 256, 97, 121, 720, 725, 114, 111, 110, 59, 16654, 59, 17428, 108, 256, 59, 116, 733, 734, 25095, 97, 59, 17300, 114, 59, 49152, 55349, 56583, 256, 97, 102, 747, 807, 256, 99, 109, 752, 802, 114, 105, 116, 105, 99, 97, 108, 512, 65, 68, 71, 84, 768, 774, 790, 796, 99, 117, 116, 101, 59, 16564, 111, 372, 779, 781, 59, 17113, 98, 108, 101, 65, 99, 117, 116, 101, 59, 17117, 114, 97, 118, 101, 59, 16480, 105, 108, 100, 101, 59, 17116, 111, 110, 100, 59, 25284, 102, 101, 114, 101, 110, 116, 105, 97, 108, 68, 59, 24902, 1136, 829, 0, 0, 0, 834, 852, 0, 1029, 102, 59, 49152, 55349, 56635, 384, 59, 68, 69, 840, 841, 845, 16552, 111, 116, 59, 24796, 113, 117, 97, 108, 59, 25168, 98, 108, 101, 768, 67, 68, 76, 82, 85, 86, 867, 882, 898, 975, 994, 1016, 111, 110, 116, 111, 117, 114, 73, 110, 116, 101, 103, 114, 97, 236, 569, 111, 628, 889, 0, 0, 891, 187, 841, 110, 65, 114, 114, 111, 119, 59, 25043, 256, 101, 111, 903, 932, 102, 116, 384, 65, 82, 84, 912, 918, 929, 114, 114, 111, 119, 59, 25040, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 25044, 101, 229, 714, 110, 103, 256, 76, 82, 939, 964, 101, 102, 116, 256, 65, 82, 947, 953, 114, 114, 111, 119, 59, 26616, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 26618, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 26617, 105, 103, 104, 116, 256, 65, 84, 984, 990, 114, 114, 111, 119, 59, 25042, 101, 101, 59, 25256, 112, 577, 1001, 0, 0, 1007, 114, 114, 111, 119, 59, 25041, 111, 119, 110, 65, 114, 114, 111, 119, 59, 25045, 101, 114, 116, 105, 99, 97, 108, 66, 97, 114, 59, 25125, 110, 768, 65, 66, 76, 82, 84, 97, 1042, 1066, 1072, 1118, 1151, 892, 114, 114, 111, 119, 384, 59, 66, 85, 1053, 1054, 1058, 24979, 97, 114, 59, 26899, 112, 65, 114, 114, 111, 119, 59, 25077, 114, 101, 118, 101, 59, 17169, 101, 102, 116, 722, 1082, 0, 1094, 0, 1104, 105, 103, 104, 116, 86, 101, 99, 116, 111, 114, 59, 26960, 101, 101, 86, 101, 99, 116, 111, 114, 59, 26974, 101, 99, 116, 111, 114, 256, 59, 66, 1113, 1114, 25021, 97, 114, 59, 26966, 105, 103, 104, 116, 468, 1127, 0, 1137, 101, 101, 86, 101, 99, 116, 111, 114, 59, 26975, 101, 99, 116, 111, 114, 256, 59, 66, 1146, 1147, 25025, 97, 114, 59, 26967, 101, 101, 256, 59, 65, 1158, 1159, 25252, 114, 114, 111, 119, 59, 24999, 256, 99, 116, 1170, 1175, 114, 59, 49152, 55349, 56479, 114, 111, 107, 59, 16656, 2048, 78, 84, 97, 99, 100, 102, 103, 108, 109, 111, 112, 113, 115, 116, 117, 120, 1213, 1216, 1220, 1227, 1246, 1250, 1255, 1262, 1269, 1313, 1327, 1334, 1362, 1373, 1376, 1381, 71, 59, 16714, 72, 32827, 208, 16592, 99, 117, 116, 101, 32827, 201, 16585, 384, 97, 105, 121, 1234, 1239, 1244, 114, 111, 110, 59, 16666, 114, 99, 32827, 202, 16586, 59, 17453, 111, 116, 59, 16662, 114, 59, 49152, 55349, 56584, 114, 97, 118, 101, 32827, 200, 16584, 101, 109, 101, 110, 116, 59, 25096, 256, 97, 112, 1274, 1278, 99, 114, 59, 16658, 116, 121, 595, 1286, 0, 0, 1298, 109, 97, 108, 108, 83, 113, 117, 97, 114, 101, 59, 26107, 101, 114, 121, 83, 109, 97, 108, 108, 83, 113, 117, 97, 114, 101, 59, 26027, 256, 103, 112, 1318, 1322, 111, 110, 59, 16664, 102, 59, 49152, 55349, 56636, 115, 105, 108, 111, 110, 59, 17301, 117, 256, 97, 105, 1340, 1353, 108, 256, 59, 84, 1346, 1347, 27253, 105, 108, 100, 101, 59, 25154, 108, 105, 98, 114, 105, 117, 109, 59, 25036, 256, 99, 105, 1367, 1370, 114, 59, 24880, 109, 59, 27251, 97, 59, 17303, 109, 108, 32827, 203, 16587, 256, 105, 112, 1386, 1391, 115, 116, 115, 59, 25091, 111, 110, 101, 110, 116, 105, 97, 108, 69, 59, 24903, 640, 99, 102, 105, 111, 115, 1413, 1416, 1421, 1458, 1484, 121, 59, 17444, 114, 59, 49152, 55349, 56585, 108, 108, 101, 100, 595, 1431, 0, 0, 1443, 109, 97, 108, 108, 83, 113, 117, 97, 114, 101, 59, 26108, 101, 114, 121, 83, 109, 97, 108, 108, 83, 113, 117, 97, 114, 101, 59, 26026, 880, 1466, 0, 1471, 0, 0, 1476, 102, 59, 49152, 55349, 56637, 65, 108, 108, 59, 25088, 114, 105, 101, 114, 116, 114, 102, 59, 24881, 99, 242, 1483, 1536, 74, 84, 97, 98, 99, 100, 102, 103, 111, 114, 115, 116, 1512, 1516, 1519, 1530, 1536, 1554, 1558, 1563, 1565, 1571, 1644, 1650, 99, 121, 59, 17411, 32827, 62, 16446, 109, 109, 97, 256, 59, 100, 1527, 1528, 17299, 59, 17372, 114, 101, 118, 101, 59, 16670, 384, 101, 105, 121, 1543, 1548, 1552, 100, 105, 108, 59, 16674, 114, 99, 59, 16668, 59, 17427, 111, 116, 59, 16672, 114, 59, 49152, 55349, 56586, 59, 25305, 112, 102, 59, 49152, 55349, 56638, 101, 97, 116, 101, 114, 768, 69, 70, 71, 76, 83, 84, 1589, 1604, 1614, 1622, 1627, 1638, 113, 117, 97, 108, 256, 59, 76, 1598, 1599, 25189, 101, 115, 115, 59, 25307, 117, 108, 108, 69, 113, 117, 97, 108, 59, 25191, 114, 101, 97, 116, 101, 114, 59, 27298, 101, 115, 115, 59, 25207, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 27262, 105, 108, 100, 101, 59, 25203, 99, 114, 59, 49152, 55349, 56482, 59, 25195, 1024, 65, 97, 99, 102, 105, 111, 115, 117, 1669, 1675, 1686, 1691, 1694, 1706, 1726, 1738, 82, 68, 99, 121, 59, 17450, 256, 99, 116, 1680, 1684, 101, 107, 59, 17095, 59, 16478, 105, 114, 99, 59, 16676, 114, 59, 24844, 108, 98, 101, 114, 116, 83, 112, 97, 99, 101, 59, 24843, 496, 1711, 0, 1714, 102, 59, 24845, 105, 122, 111, 110, 116, 97, 108, 76, 105, 110, 101, 59, 25856, 256, 99, 116, 1731, 1733, 242, 1705, 114, 111, 107, 59, 16678, 109, 112, 324, 1744, 1752, 111, 119, 110, 72, 117, 109, 240, 303, 113, 117, 97, 108, 59, 25167, 1792, 69, 74, 79, 97, 99, 100, 102, 103, 109, 110, 111, 115, 116, 117, 1786, 1790, 1795, 1799, 1806, 1818, 1822, 1825, 1832, 1860, 1912, 1931, 1935, 1941, 99, 121, 59, 17429, 108, 105, 103, 59, 16690, 99, 121, 59, 17409, 99, 117, 116, 101, 32827, 205, 16589, 256, 105, 121, 1811, 1816, 114, 99, 32827, 206, 16590, 59, 17432, 111, 116, 59, 16688, 114, 59, 24849, 114, 97, 118, 101, 32827, 204, 16588, 384, 59, 97, 112, 1824, 1839, 1855, 256, 99, 103, 1844, 1847, 114, 59, 16682, 105, 110, 97, 114, 121, 73, 59, 24904, 108, 105, 101, 243, 989, 500, 1865, 0, 1890, 256, 59, 101, 1869, 1870, 25132, 256, 103, 114, 1875, 1880, 114, 97, 108, 59, 25131, 115, 101, 99, 116, 105, 111, 110, 59, 25282, 105, 115, 105, 98, 108, 101, 256, 67, 84, 1900, 1906, 111, 109, 109, 97, 59, 24675, 105, 109, 101, 115, 59, 24674, 384, 103, 112, 116, 1919, 1923, 1928, 111, 110, 59, 16686, 102, 59, 49152, 55349, 56640, 97, 59, 17305, 99, 114, 59, 24848, 105, 108, 100, 101, 59, 16680, 491, 1946, 0, 1950, 99, 121, 59, 17414, 108, 32827, 207, 16591, 640, 99, 102, 111, 115, 117, 1964, 1975, 1980, 1986, 2000, 256, 105, 121, 1969, 1973, 114, 99, 59, 16692, 59, 17433, 114, 59, 49152, 55349, 56589, 112, 102, 59, 49152, 55349, 56641, 483, 1991, 0, 1996, 114, 59, 49152, 55349, 56485, 114, 99, 121, 59, 17416, 107, 99, 121, 59, 17412, 896, 72, 74, 97, 99, 102, 111, 115, 2020, 2024, 2028, 2033, 2045, 2050, 2056, 99, 121, 59, 17445, 99, 121, 59, 17420, 112, 112, 97, 59, 17306, 256, 101, 121, 2038, 2043, 100, 105, 108, 59, 16694, 59, 17434, 114, 59, 49152, 55349, 56590, 112, 102, 59, 49152, 55349, 56642, 99, 114, 59, 49152, 55349, 56486, 1408, 74, 84, 97, 99, 101, 102, 108, 109, 111, 115, 116, 2085, 2089, 2092, 2128, 2147, 2483, 2488, 2503, 2509, 2615, 2631, 99, 121, 59, 17417, 32827, 60, 16444, 640, 99, 109, 110, 112, 114, 2103, 2108, 2113, 2116, 2125, 117, 116, 101, 59, 16697, 98, 100, 97, 59, 17307, 103, 59, 26602, 108, 97, 99, 101, 116, 114, 102, 59, 24850, 114, 59, 24990, 384, 97, 101, 121, 2135, 2140, 2145, 114, 111, 110, 59, 16701, 100, 105, 108, 59, 16699, 59, 17435, 256, 102, 115, 2152, 2416, 116, 1280, 65, 67, 68, 70, 82, 84, 85, 86, 97, 114, 2174, 2217, 2225, 2272, 2278, 2300, 2351, 2395, 912, 2410, 256, 110, 114, 2179, 2191, 103, 108, 101, 66, 114, 97, 99, 107, 101, 116, 59, 26600, 114, 111, 119, 384, 59, 66, 82, 2201, 2202, 2206, 24976, 97, 114, 59, 25060, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 25030, 101, 105, 108, 105, 110, 103, 59, 25352, 111, 501, 2231, 0, 2243, 98, 108, 101, 66, 114, 97, 99, 107, 101, 116, 59, 26598, 110, 468, 2248, 0, 2258, 101, 101, 86, 101, 99, 116, 111, 114, 59, 26977, 101, 99, 116, 111, 114, 256, 59, 66, 2267, 2268, 25027, 97, 114, 59, 26969, 108, 111, 111, 114, 59, 25354, 105, 103, 104, 116, 256, 65, 86, 2287, 2293, 114, 114, 111, 119, 59, 24980, 101, 99, 116, 111, 114, 59, 26958, 256, 101, 114, 2305, 2327, 101, 384, 59, 65, 86, 2313, 2314, 2320, 25251, 114, 114, 111, 119, 59, 24996, 101, 99, 116, 111, 114, 59, 26970, 105, 97, 110, 103, 108, 101, 384, 59, 66, 69, 2340, 2341, 2345, 25266, 97, 114, 59, 27087, 113, 117, 97, 108, 59, 25268, 112, 384, 68, 84, 86, 2359, 2370, 2380, 111, 119, 110, 86, 101, 99, 116, 111, 114, 59, 26961, 101, 101, 86, 101, 99, 116, 111, 114, 59, 26976, 101, 99, 116, 111, 114, 256, 59, 66, 2390, 2391, 25023, 97, 114, 59, 26968, 101, 99, 116, 111, 114, 256, 59, 66, 2405, 2406, 25020, 97, 114, 59, 26962, 105, 103, 104, 116, 225, 924, 115, 768, 69, 70, 71, 76, 83, 84, 2430, 2443, 2453, 2461, 2466, 2477, 113, 117, 97, 108, 71, 114, 101, 97, 116, 101, 114, 59, 25306, 117, 108, 108, 69, 113, 117, 97, 108, 59, 25190, 114, 101, 97, 116, 101, 114, 59, 25206, 101, 115, 115, 59, 27297, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 27261, 105, 108, 100, 101, 59, 25202, 114, 59, 49152, 55349, 56591, 256, 59, 101, 2493, 2494, 25304, 102, 116, 97, 114, 114, 111, 119, 59, 25050, 105, 100, 111, 116, 59, 16703, 384, 110, 112, 119, 2516, 2582, 2587, 103, 512, 76, 82, 108, 114, 2526, 2551, 2562, 2576, 101, 102, 116, 256, 65, 82, 2534, 2540, 114, 114, 111, 119, 59, 26613, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 26615, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 26614, 101, 102, 116, 256, 97, 114, 947, 2570, 105, 103, 104, 116, 225, 959, 105, 103, 104, 116, 225, 970, 102, 59, 49152, 55349, 56643, 101, 114, 256, 76, 82, 2594, 2604, 101, 102, 116, 65, 114, 114, 111, 119, 59, 24985, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 24984, 384, 99, 104, 116, 2622, 2624, 2626, 242, 2124, 59, 25008, 114, 111, 107, 59, 16705, 59, 25194, 1024, 97, 99, 101, 102, 105, 111, 115, 117, 2650, 2653, 2656, 2679, 2684, 2693, 2699, 2702, 112, 59, 26885, 121, 59, 17436, 256, 100, 108, 2661, 2671, 105, 117, 109, 83, 112, 97, 99, 101, 59, 24671, 108, 105, 110, 116, 114, 102, 59, 24883, 114, 59, 49152, 55349, 56592, 110, 117, 115, 80, 108, 117, 115, 59, 25107, 112, 102, 59, 49152, 55349, 56644, 99, 242, 2678, 59, 17308, 1152, 74, 97, 99, 101, 102, 111, 115, 116, 117, 2723, 2727, 2733, 2752, 2836, 2841, 3473, 3479, 3486, 99, 121, 59, 17418, 99, 117, 116, 101, 59, 16707, 384, 97, 101, 121, 2740, 2745, 2750, 114, 111, 110, 59, 16711, 100, 105, 108, 59, 16709, 59, 17437, 384, 103, 115, 119, 2759, 2800, 2830, 97, 116, 105, 118, 101, 384, 77, 84, 86, 2771, 2783, 2792, 101, 100, 105, 117, 109, 83, 112, 97, 99, 101, 59, 24587, 104, 105, 256, 99, 110, 2790, 2776, 235, 2777, 101, 114, 121, 84, 104, 105, 238, 2777, 116, 101, 100, 256, 71, 76, 2808, 2822, 114, 101, 97, 116, 101, 114, 71, 114, 101, 97, 116, 101, 242, 1651, 101, 115, 115, 76, 101, 115, 243, 2632, 76, 105, 110, 101, 59, 16394, 114, 59, 49152, 55349, 56593, 512, 66, 110, 112, 116, 2850, 2856, 2871, 2874, 114, 101, 97, 107, 59, 24672, 66, 114, 101, 97, 107, 105, 110, 103, 83, 112, 97, 99, 101, 59, 16544, 102, 59, 24853, 1664, 59, 67, 68, 69, 71, 72, 76, 78, 80, 82, 83, 84, 86, 2901, 2902, 2922, 2940, 2977, 3051, 3076, 3166, 3204, 3238, 3288, 3425, 3461, 27372, 256, 111, 117, 2907, 2916, 110, 103, 114, 117, 101, 110, 116, 59, 25186, 112, 67, 97, 112, 59, 25197, 111, 117, 98, 108, 101, 86, 101, 114, 116, 105, 99, 97, 108, 66, 97, 114, 59, 25126, 384, 108, 113, 120, 2947, 2954, 2971, 101, 109, 101, 110, 116, 59, 25097, 117, 97, 108, 256, 59, 84, 2962, 2963, 25184, 105, 108, 100, 101, 59, 49152, 8770, 824, 105, 115, 116, 115, 59, 25092, 114, 101, 97, 116, 101, 114, 896, 59, 69, 70, 71, 76, 83, 84, 2998, 2999, 3005, 3017, 3027, 3032, 3045, 25199, 113, 117, 97, 108, 59, 25201, 117, 108, 108, 69, 113, 117, 97, 108, 59, 49152, 8807, 824, 114, 101, 97, 116, 101, 114, 59, 49152, 8811, 824, 101, 115, 115, 59, 25209, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 49152, 10878, 824, 105, 108, 100, 101, 59, 25205, 117, 109, 112, 324, 3058, 3069, 111, 119, 110, 72, 117, 109, 112, 59, 49152, 8782, 824, 113, 117, 97, 108, 59, 49152, 8783, 824, 101, 256, 102, 115, 3082, 3111, 116, 84, 114, 105, 97, 110, 103, 108, 101, 384, 59, 66, 69, 3098, 3099, 3105, 25322, 97, 114, 59, 49152, 10703, 824, 113, 117, 97, 108, 59, 25324, 115, 768, 59, 69, 71, 76, 83, 84, 3125, 3126, 3132, 3140, 3147, 3160, 25198, 113, 117, 97, 108, 59, 25200, 114, 101, 97, 116, 101, 114, 59, 25208, 101, 115, 115, 59, 49152, 8810, 824, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 49152, 10877, 824, 105, 108, 100, 101, 59, 25204, 101, 115, 116, 101, 100, 256, 71, 76, 3176, 3193, 114, 101, 97, 116, 101, 114, 71, 114, 101, 97, 116, 101, 114, 59, 49152, 10914, 824, 101, 115, 115, 76, 101, 115, 115, 59, 49152, 10913, 824, 114, 101, 99, 101, 100, 101, 115, 384, 59, 69, 83, 3218, 3219, 3227, 25216, 113, 117, 97, 108, 59, 49152, 10927, 824, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 25312, 256, 101, 105, 3243, 3257, 118, 101, 114, 115, 101, 69, 108, 101, 109, 101, 110, 116, 59, 25100, 103, 104, 116, 84, 114, 105, 97, 110, 103, 108, 101, 384, 59, 66, 69, 3275, 3276, 3282, 25323, 97, 114, 59, 49152, 10704, 824, 113, 117, 97, 108, 59, 25325, 256, 113, 117, 3293, 3340, 117, 97, 114, 101, 83, 117, 256, 98, 112, 3304, 3321, 115, 101, 116, 256, 59, 69, 3312, 3315, 49152, 8847, 824, 113, 117, 97, 108, 59, 25314, 101, 114, 115, 101, 116, 256, 59, 69, 3331, 3334, 49152, 8848, 824, 113, 117, 97, 108, 59, 25315, 384, 98, 99, 112, 3347, 3364, 3406, 115, 101, 116, 256, 59, 69, 3355, 3358, 49152, 8834, 8402, 113, 117, 97, 108, 59, 25224, 99, 101, 101, 100, 115, 512, 59, 69, 83, 84, 3378, 3379, 3387, 3398, 25217, 113, 117, 97, 108, 59, 49152, 10928, 824, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 25313, 105, 108, 100, 101, 59, 49152, 8831, 824, 101, 114, 115, 101, 116, 256, 59, 69, 3416, 3419, 49152, 8835, 8402, 113, 117, 97, 108, 59, 25225, 105, 108, 100, 101, 512, 59, 69, 70, 84, 3438, 3439, 3445, 3455, 25153, 113, 117, 97, 108, 59, 25156, 117, 108, 108, 69, 113, 117, 97, 108, 59, 25159, 105, 108, 100, 101, 59, 25161, 101, 114, 116, 105, 99, 97, 108, 66, 97, 114, 59, 25124, 99, 114, 59, 49152, 55349, 56489, 105, 108, 100, 101, 32827, 209, 16593, 59, 17309, 1792, 69, 97, 99, 100, 102, 103, 109, 111, 112, 114, 115, 116, 117, 118, 3517, 3522, 3529, 3541, 3547, 3552, 3559, 3580, 3586, 3616, 3618, 3634, 3647, 3652, 108, 105, 103, 59, 16722, 99, 117, 116, 101, 32827, 211, 16595, 256, 105, 121, 3534, 3539, 114, 99, 32827, 212, 16596, 59, 17438, 98, 108, 97, 99, 59, 16720, 114, 59, 49152, 55349, 56594, 114, 97, 118, 101, 32827, 210, 16594, 384, 97, 101, 105, 3566, 3570, 3574, 99, 114, 59, 16716, 103, 97, 59, 17321, 99, 114, 111, 110, 59, 17311, 112, 102, 59, 49152, 55349, 56646, 101, 110, 67, 117, 114, 108, 121, 256, 68, 81, 3598, 3610, 111, 117, 98, 108, 101, 81, 117, 111, 116, 101, 59, 24604, 117, 111, 116, 101, 59, 24600, 59, 27220, 256, 99, 108, 3623, 3628, 114, 59, 49152, 55349, 56490, 97, 115, 104, 32827, 216, 16600, 105, 364, 3639, 3644, 100, 101, 32827, 213, 16597, 101, 115, 59, 27191, 109, 108, 32827, 214, 16598, 101, 114, 256, 66, 80, 3659, 3680, 256, 97, 114, 3664, 3667, 114, 59, 24638, 97, 99, 256, 101, 107, 3674, 3676, 59, 25566, 101, 116, 59, 25524, 97, 114, 101, 110, 116, 104, 101, 115, 105, 115, 59, 25564, 1152, 97, 99, 102, 104, 105, 108, 111, 114, 115, 3711, 3719, 3722, 3727, 3730, 3732, 3741, 3760, 3836, 114, 116, 105, 97, 108, 68, 59, 25090, 121, 59, 17439, 114, 59, 49152, 55349, 56595, 105, 59, 17318, 59, 17312, 117, 115, 77, 105, 110, 117, 115, 59, 16561, 256, 105, 112, 3746, 3757, 110, 99, 97, 114, 101, 112, 108, 97, 110, 229, 1693, 102, 59, 24857, 512, 59, 101, 105, 111, 3769, 3770, 3808, 3812, 27323, 99, 101, 100, 101, 115, 512, 59, 69, 83, 84, 3784, 3785, 3791, 3802, 25210, 113, 117, 97, 108, 59, 27311, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 25212, 105, 108, 100, 101, 59, 25214, 109, 101, 59, 24627, 256, 100, 112, 3817, 3822, 117, 99, 116, 59, 25103, 111, 114, 116, 105, 111, 110, 256, 59, 97, 549, 3833, 108, 59, 25117, 256, 99, 105, 3841, 3846, 114, 59, 49152, 55349, 56491, 59, 17320, 512, 85, 102, 111, 115, 3857, 3862, 3867, 3871, 79, 84, 32827, 34, 16418, 114, 59, 49152, 55349, 56596, 112, 102, 59, 24858, 99, 114, 59, 49152, 55349, 56492, 1536, 66, 69, 97, 99, 101, 102, 104, 105, 111, 114, 115, 117, 3902, 3907, 3911, 3936, 3955, 4007, 4010, 4013, 4246, 4265, 4276, 4286, 97, 114, 114, 59, 26896, 71, 32827, 174, 16558, 384, 99, 110, 114, 3918, 3923, 3926, 117, 116, 101, 59, 16724, 103, 59, 26603, 114, 256, 59, 116, 3932, 3933, 24992, 108, 59, 26902, 384, 97, 101, 121, 3943, 3948, 3953, 114, 111, 110, 59, 16728, 100, 105, 108, 59, 16726, 59, 17440, 256, 59, 118, 3960, 3961, 24860, 101, 114, 115, 101, 256, 69, 85, 3970, 3993, 256, 108, 113, 3975, 3982, 101, 109, 101, 110, 116, 59, 25099, 117, 105, 108, 105, 98, 114, 105, 117, 109, 59, 25035, 112, 69, 113, 117, 105, 108, 105, 98, 114, 105, 117, 109, 59, 26991, 114, 187, 3961, 111, 59, 17313, 103, 104, 116, 1024, 65, 67, 68, 70, 84, 85, 86, 97, 4033, 4075, 4083, 4130, 4136, 4187, 4231, 984, 256, 110, 114, 4038, 4050, 103, 108, 101, 66, 114, 97, 99, 107, 101, 116, 59, 26601, 114, 111, 119, 384, 59, 66, 76, 4060, 4061, 4065, 24978, 97, 114, 59, 25061, 101, 102, 116, 65, 114, 114, 111, 119, 59, 25028, 101, 105, 108, 105, 110, 103, 59, 25353, 111, 501, 4089, 0, 4101, 98, 108, 101, 66, 114, 97, 99, 107, 101, 116, 59, 26599, 110, 468, 4106, 0, 4116, 101, 101, 86, 101, 99, 116, 111, 114, 59, 26973, 101, 99, 116, 111, 114, 256, 59, 66, 4125, 4126, 25026, 97, 114, 59, 26965, 108, 111, 111, 114, 59, 25355, 256, 101, 114, 4141, 4163, 101, 384, 59, 65, 86, 4149, 4150, 4156, 25250, 114, 114, 111, 119, 59, 24998, 101, 99, 116, 111, 114, 59, 26971, 105, 97, 110, 103, 108, 101, 384, 59, 66, 69, 4176, 4177, 4181, 25267, 97, 114, 59, 27088, 113, 117, 97, 108, 59, 25269, 112, 384, 68, 84, 86, 4195, 4206, 4216, 111, 119, 110, 86, 101, 99, 116, 111, 114, 59, 26959, 101, 101, 86, 101, 99, 116, 111, 114, 59, 26972, 101, 99, 116, 111, 114, 256, 59, 66, 4226, 4227, 25022, 97, 114, 59, 26964, 101, 99, 116, 111, 114, 256, 59, 66, 4241, 4242, 25024, 97, 114, 59, 26963, 256, 112, 117, 4251, 4254, 102, 59, 24861, 110, 100, 73, 109, 112, 108, 105, 101, 115, 59, 26992, 105, 103, 104, 116, 97, 114, 114, 111, 119, 59, 25051, 256, 99, 104, 4281, 4284, 114, 59, 24859, 59, 25009, 108, 101, 68, 101, 108, 97, 121, 101, 100, 59, 27124, 1664, 72, 79, 97, 99, 102, 104, 105, 109, 111, 113, 115, 116, 117, 4324, 4337, 4343, 4349, 4377, 4382, 4433, 4438, 4449, 4455, 4533, 4539, 4543, 256, 67, 99, 4329, 4334, 72, 99, 121, 59, 17449, 121, 59, 17448, 70, 84, 99, 121, 59, 17452, 99, 117, 116, 101, 59, 16730, 640, 59, 97, 101, 105, 121, 4360, 4361, 4366, 4371, 4375, 27324, 114, 111, 110, 59, 16736, 100, 105, 108, 59, 16734, 114, 99, 59, 16732, 59, 17441, 114, 59, 49152, 55349, 56598, 111, 114, 116, 512, 68, 76, 82, 85, 4394, 4404, 4414, 4425, 111, 119, 110, 65, 114, 114, 111, 119, 187, 1054, 101, 102, 116, 65, 114, 114, 111, 119, 187, 2202, 105, 103, 104, 116, 65, 114, 114, 111, 119, 187, 4061, 112, 65, 114, 114, 111, 119, 59, 24977, 103, 109, 97, 59, 17315, 97, 108, 108, 67, 105, 114, 99, 108, 101, 59, 25112, 112, 102, 59, 49152, 55349, 56650, 626, 4461, 0, 0, 4464, 116, 59, 25114, 97, 114, 101, 512, 59, 73, 83, 85, 4475, 4476, 4489, 4527, 26017, 110, 116, 101, 114, 115, 101, 99, 116, 105, 111, 110, 59, 25235, 117, 256, 98, 112, 4495, 4510, 115, 101, 116, 256, 59, 69, 4503, 4504, 25231, 113, 117, 97, 108, 59, 25233, 101, 114, 115, 101, 116, 256, 59, 69, 4520, 4521, 25232, 113, 117, 97, 108, 59, 25234, 110, 105, 111, 110, 59, 25236, 99, 114, 59, 49152, 55349, 56494, 97, 114, 59, 25286, 512, 98, 99, 109, 112, 4552, 4571, 4617, 4619, 256, 59, 115, 4557, 4558, 25296, 101, 116, 256, 59, 69, 4557, 4565, 113, 117, 97, 108, 59, 25222, 256, 99, 104, 4576, 4613, 101, 101, 100, 115, 512, 59, 69, 83, 84, 4589, 4590, 4596, 4607, 25211, 113, 117, 97, 108, 59, 27312, 108, 97, 110, 116, 69, 113, 117, 97, 108, 59, 25213, 105, 108, 100, 101, 59, 25215, 84, 104, 225, 3980, 59, 25105, 384, 59, 101, 115, 4626, 4627, 4643, 25297, 114, 115, 101, 116, 256, 59, 69, 4636, 4637, 25219, 113, 117, 97, 108, 59, 25223, 101, 116, 187, 4627, 1408, 72, 82, 83, 97, 99, 102, 104, 105, 111, 114, 115, 4670, 4676, 4681, 4693, 4702, 4721, 4726, 4767, 4802, 4808, 4817, 79, 82, 78, 32827, 222, 16606, 65, 68, 69, 59, 24866, 256, 72, 99, 4686, 4690, 99, 121, 59, 17419, 121, 59, 17446, 256, 98, 117, 4698, 4700, 59, 16393, 59, 17316, 384, 97, 101, 121, 4709, 4714, 4719, 114, 111, 110, 59, 16740, 100, 105, 108, 59, 16738, 59, 17442, 114, 59, 49152, 55349, 56599, 256, 101, 105, 4731, 4745, 498, 4736, 0, 4743, 101, 102, 111, 114, 101, 59, 25140, 97, 59, 17304, 256, 99, 110, 4750, 4760, 107, 83, 112, 97, 99, 101, 59, 49152, 8287, 8202, 83, 112, 97, 99, 101, 59, 24585, 108, 100, 101, 512, 59, 69, 70, 84, 4779, 4780, 4786, 4796, 25148, 113, 117, 97, 108, 59, 25155, 117, 108, 108, 69, 113, 117, 97, 108, 59, 25157, 105, 108, 100, 101, 59, 25160, 112, 102, 59, 49152, 55349, 56651, 105, 112, 108, 101, 68, 111, 116, 59, 24795, 256, 99, 116, 4822, 4827, 114, 59, 49152, 55349, 56495, 114, 111, 107, 59, 16742, 2785, 4855, 4878, 4890, 4902, 0, 4908, 4913, 0, 0, 0, 0, 0, 4920, 4925, 4983, 4997, 0, 5119, 5124, 5130, 5136, 256, 99, 114, 4859, 4865, 117, 116, 101, 32827, 218, 16602, 114, 256, 59, 111, 4871, 4872, 24991, 99, 105, 114, 59, 26953, 114, 483, 4883, 0, 4886, 121, 59, 17422, 118, 101, 59, 16748, 256, 105, 121, 4894, 4899, 114, 99, 32827, 219, 16603, 59, 17443, 98, 108, 97, 99, 59, 16752, 114, 59, 49152, 55349, 56600, 114, 97, 118, 101, 32827, 217, 16601, 97, 99, 114, 59, 16746, 256, 100, 105, 4929, 4969, 101, 114, 256, 66, 80, 4936, 4957, 256, 97, 114, 4941, 4944, 114, 59, 16479, 97, 99, 256, 101, 107, 4951, 4953, 59, 25567, 101, 116, 59, 25525, 97, 114, 101, 110, 116, 104, 101, 115, 105, 115, 59, 25565, 111, 110, 256, 59, 80, 4976, 4977, 25283, 108, 117, 115, 59, 25230, 256, 103, 112, 4987, 4991, 111, 110, 59, 16754, 102, 59, 49152, 55349, 56652, 1024, 65, 68, 69, 84, 97, 100, 112, 115, 5013, 5038, 5048, 5060, 1000, 5074, 5079, 5107, 114, 114, 111, 119, 384, 59, 66, 68, 4432, 5024, 5028, 97, 114, 59, 26898, 111, 119, 110, 65, 114, 114, 111, 119, 59, 25029, 111, 119, 110, 65, 114, 114, 111, 119, 59, 24981, 113, 117, 105, 108, 105, 98, 114, 105, 117, 109, 59, 26990, 101, 101, 256, 59, 65, 5067, 5068, 25253, 114, 114, 111, 119, 59, 24997, 111, 119, 110, 225, 1011, 101, 114, 256, 76, 82, 5086, 5096, 101, 102, 116, 65, 114, 114, 111, 119, 59, 24982, 105, 103, 104, 116, 65, 114, 114, 111, 119, 59, 24983, 105, 256, 59, 108, 5113, 5114, 17362, 111, 110, 59, 17317, 105, 110, 103, 59, 16750, 99, 114, 59, 49152, 55349, 56496, 105, 108, 100, 101, 59, 16744, 109, 108, 32827, 220, 16604, 1152, 68, 98, 99, 100, 101, 102, 111, 115, 118, 5159, 5164, 5168, 5171, 5182, 5253, 5258, 5264, 5270, 97, 115, 104, 59, 25259, 97, 114, 59, 27371, 121, 59, 17426, 97, 115, 104, 256, 59, 108, 5179, 5180, 25257, 59, 27366, 256, 101, 114, 5187, 5189, 59, 25281, 384, 98, 116, 121, 5196, 5200, 5242, 97, 114, 59, 24598, 256, 59, 105, 5199, 5205, 99, 97, 108, 512, 66, 76, 83, 84, 5217, 5221, 5226, 5236, 97, 114, 59, 25123, 105, 110, 101, 59, 16508, 101, 112, 97, 114, 97, 116, 111, 114, 59, 26456, 105, 108, 100, 101, 59, 25152, 84, 104, 105, 110, 83, 112, 97, 99, 101, 59, 24586, 114, 59, 49152, 55349, 56601, 112, 102, 59, 49152, 55349, 56653, 99, 114, 59, 49152, 55349, 56497, 100, 97, 115, 104, 59, 25258, 640, 99, 101, 102, 111, 115, 5287, 5292, 5297, 5302, 5308, 105, 114, 99, 59, 16756, 100, 103, 101, 59, 25280, 114, 59, 49152, 55349, 56602, 112, 102, 59, 49152, 55349, 56654, 99, 114, 59, 49152, 55349, 56498, 512, 102, 105, 111, 115, 5323, 5328, 5330, 5336, 114, 59, 49152, 55349, 56603, 59, 17310, 112, 102, 59, 49152, 55349, 56655, 99, 114, 59, 49152, 55349, 56499, 1152, 65, 73, 85, 97, 99, 102, 111, 115, 117, 5361, 5365, 5369, 5373, 5380, 5391, 5396, 5402, 5408, 99, 121, 59, 17455, 99, 121, 59, 17415, 99, 121, 59, 17454, 99, 117, 116, 101, 32827, 221, 16605, 256, 105, 121, 5385, 5389, 114, 99, 59, 16758, 59, 17451, 114, 59, 49152, 55349, 56604, 112, 102, 59, 49152, 55349, 56656, 99, 114, 59, 49152, 55349, 56500, 109, 108, 59, 16760, 1024, 72, 97, 99, 100, 101, 102, 111, 115, 5429, 5433, 5439, 5451, 5455, 5469, 5472, 5476, 99, 121, 59, 17430, 99, 117, 116, 101, 59, 16761, 256, 97, 121, 5444, 5449, 114, 111, 110, 59, 16765, 59, 17431, 111, 116, 59, 16763, 498, 5460, 0, 5467, 111, 87, 105, 100, 116, 232, 2777, 97, 59, 17302, 114, 59, 24872, 112, 102, 59, 24868, 99, 114, 59, 49152, 55349, 56501, 3041, 5507, 5514, 5520, 0, 5552, 5558, 5567, 0, 0, 0, 0, 5574, 5595, 5611, 5727, 5741, 0, 5781, 5787, 5810, 5817, 0, 5822, 99, 117, 116, 101, 32827, 225, 16609, 114, 101, 118, 101, 59, 16643, 768, 59, 69, 100, 105, 117, 121, 5532, 5533, 5537, 5539, 5544, 5549, 25150, 59, 49152, 8766, 819, 59, 25151, 114, 99, 32827, 226, 16610, 116, 101, 32955, 180, 774, 59, 17456, 108, 105, 103, 32827, 230, 16614, 256, 59, 114, 178, 5562, 59, 49152, 55349, 56606, 114, 97, 118, 101, 32827, 224, 16608, 256, 101, 112, 5578, 5590, 256, 102, 112, 5583, 5588, 115, 121, 109, 59, 24885, 232, 5587, 104, 97, 59, 17329, 256, 97, 112, 5599, 99, 256, 99, 108, 5604, 5607, 114, 59, 16641, 103, 59, 27199, 612, 5616, 0, 0, 5642, 640, 59, 97, 100, 115, 118, 5626, 5627, 5631, 5633, 5639, 25127, 110, 100, 59, 27221, 59, 27228, 108, 111, 112, 101, 59, 27224, 59, 27226, 896, 59, 101, 108, 109, 114, 115, 122, 5656, 5657, 5659, 5662, 5695, 5711, 5721, 25120, 59, 27044, 101, 187, 5657, 115, 100, 256, 59, 97, 5669, 5670, 25121, 1121, 5680, 5682, 5684, 5686, 5688, 5690, 5692, 5694, 59, 27048, 59, 27049, 59, 27050, 59, 27051, 59, 27052, 59, 27053, 59, 27054, 59, 27055, 116, 256, 59, 118, 5701, 5702, 25119, 98, 256, 59, 100, 5708, 5709, 25278, 59, 27037, 256, 112, 116, 5716, 5719, 104, 59, 25122, 187, 185, 97, 114, 114, 59, 25468, 256, 103, 112, 5731, 5735, 111, 110, 59, 16645, 102, 59, 49152, 55349, 56658, 896, 59, 69, 97, 101, 105, 111, 112, 4801, 5755, 5757, 5762, 5764, 5767, 5770, 59, 27248, 99, 105, 114, 59, 27247, 59, 25162, 100, 59, 25163, 115, 59, 16423, 114, 111, 120, 256, 59, 101, 4801, 5778, 241, 5763, 105, 110, 103, 32827, 229, 16613, 384, 99, 116, 121, 5793, 5798, 5800, 114, 59, 49152, 55349, 56502, 59, 16426, 109, 112, 256, 59, 101, 4801, 5807, 241, 648, 105, 108, 100, 101, 32827, 227, 16611, 109, 108, 32827, 228, 16612, 256, 99, 105, 5826, 5832, 111, 110, 105, 110, 244, 626, 110, 116, 59, 27153, 2048, 78, 97, 98, 99, 100, 101, 102, 105, 107, 108, 110, 111, 112, 114, 115, 117, 5869, 5873, 5936, 5948, 5955, 5960, 6008, 6013, 6112, 6118, 6201, 6224, 5901, 6461, 6472, 6512, 111, 116, 59, 27373, 256, 99, 114, 5878, 5918, 107, 512, 99, 101, 112, 115, 5888, 5893, 5901, 5907, 111, 110, 103, 59, 25164, 112, 115, 105, 108, 111, 110, 59, 17398, 114, 105, 109, 101, 59, 24629, 105, 109, 256, 59, 101, 5914, 5915, 25149, 113, 59, 25293, 374, 5922, 5926, 101, 101, 59, 25277, 101, 100, 256, 59, 103, 5932, 5933, 25349, 101, 187, 5933, 114, 107, 256, 59, 116, 4956, 5943, 98, 114, 107, 59, 25526, 256, 111, 121, 5889, 5953, 59, 17457, 113, 117, 111, 59, 24606, 640, 99, 109, 112, 114, 116, 5971, 5979, 5985, 5988, 5992, 97, 117, 115, 256, 59, 101, 266, 265, 112, 116, 121, 118, 59, 27056, 115, 233, 5900, 110, 111, 245, 275, 384, 97, 104, 119, 5999, 6001, 6003, 59, 17330, 59, 24886, 101, 101, 110, 59, 25196, 114, 59, 49152, 55349, 56607, 103, 896, 99, 111, 115, 116, 117, 118, 119, 6029, 6045, 6067, 6081, 6101, 6107, 6110, 384, 97, 105, 117, 6036, 6038, 6042, 240, 1888, 114, 99, 59, 26095, 112, 187, 4977, 384, 100, 112, 116, 6052, 6056, 6061, 111, 116, 59, 27136, 108, 117, 115, 59, 27137, 105, 109, 101, 115, 59, 27138, 625, 6073, 0, 0, 6078, 99, 117, 112, 59, 27142, 97, 114, 59, 26117, 114, 105, 97, 110, 103, 108, 101, 256, 100, 117, 6093, 6098, 111, 119, 110, 59, 26045, 112, 59, 26035, 112, 108, 117, 115, 59, 27140, 101, 229, 5188, 229, 5293, 97, 114, 111, 119, 59, 26893, 384, 97, 107, 111, 6125, 6182, 6197, 256, 99, 110, 6130, 6179, 107, 384, 108, 115, 116, 6138, 1451, 6146, 111, 122, 101, 110, 103, 101, 59, 27115, 114, 105, 97, 110, 103, 108, 101, 512, 59, 100, 108, 114, 6162, 6163, 6168, 6173, 26036, 111, 119, 110, 59, 26046, 101, 102, 116, 59, 26050, 105, 103, 104, 116, 59, 26040, 107, 59, 25635, 433, 6187, 0, 6195, 434, 6191, 0, 6193, 59, 26002, 59, 26001, 52, 59, 26003, 99, 107, 59, 25992, 256, 101, 111, 6206, 6221, 256, 59, 113, 6211, 6214, 49152, 61, 8421, 117, 105, 118, 59, 49152, 8801, 8421, 116, 59, 25360, 512, 112, 116, 119, 120, 6233, 6238, 6247, 6252, 102, 59, 49152, 55349, 56659, 256, 59, 116, 5067, 6243, 111, 109, 187, 5068, 116, 105, 101, 59, 25288, 1536, 68, 72, 85, 86, 98, 100, 104, 109, 112, 116, 117, 118, 6277, 6294, 6314, 6331, 6359, 6363, 6380, 6399, 6405, 6410, 6416, 6433, 512, 76, 82, 108, 114, 6286, 6288, 6290, 6292, 59, 25943, 59, 25940, 59, 25942, 59, 25939, 640, 59, 68, 85, 100, 117, 6305, 6306, 6308, 6310, 6312, 25936, 59, 25958, 59, 25961, 59, 25956, 59, 25959, 512, 76, 82, 108, 114, 6323, 6325, 6327, 6329, 59, 25949, 59, 25946, 59, 25948, 59, 25945, 896, 59, 72, 76, 82, 104, 108, 114, 6346, 6347, 6349, 6351, 6353, 6355, 6357, 25937, 59, 25964, 59, 25955, 59, 25952, 59, 25963, 59, 25954, 59, 25951, 111, 120, 59, 27081, 512, 76, 82, 108, 114, 6372, 6374, 6376, 6378, 59, 25941, 59, 25938, 59, 25872, 59, 25868, 640, 59, 68, 85, 100, 117, 1725, 6391, 6393, 6395, 6397, 59, 25957, 59, 25960, 59, 25900, 59, 25908, 105, 110, 117, 115, 59, 25247, 108, 117, 115, 59, 25246, 105, 109, 101, 115, 59, 25248, 512, 76, 82, 108, 114, 6425, 6427, 6429, 6431, 59, 25947, 59, 25944, 59, 25880, 59, 25876, 896, 59, 72, 76, 82, 104, 108, 114, 6448, 6449, 6451, 6453, 6455, 6457, 6459, 25858, 59, 25962, 59, 25953, 59, 25950, 59, 25916, 59, 25892, 59, 25884, 256, 101, 118, 291, 6466, 98, 97, 114, 32827, 166, 16550, 512, 99, 101, 105, 111, 6481, 6486, 6490, 6496, 114, 59, 49152, 55349, 56503, 109, 105, 59, 24655, 109, 256, 59, 101, 5914, 5916, 108, 384, 59, 98, 104, 6504, 6505, 6507, 16476, 59, 27077, 115, 117, 98, 59, 26568, 364, 6516, 6526, 108, 256, 59, 101, 6521, 6522, 24610, 116, 187, 6522, 112, 384, 59, 69, 101, 303, 6533, 6535, 59, 27310, 256, 59, 113, 1756, 1755, 3297, 6567, 0, 6632, 6673, 6677, 6706, 0, 6711, 6736, 0, 0, 6836, 0, 0, 6849, 0, 0, 6945, 6958, 6989, 6994, 0, 7165, 0, 7180, 384, 99, 112, 114, 6573, 6578, 6621, 117, 116, 101, 59, 16647, 768, 59, 97, 98, 99, 100, 115, 6591, 6592, 6596, 6602, 6613, 6617, 25129, 110, 100, 59, 27204, 114, 99, 117, 112, 59, 27209, 256, 97, 117, 6607, 6610, 112, 59, 27211, 112, 59, 27207, 111, 116, 59, 27200, 59, 49152, 8745, 65024, 256, 101, 111, 6626, 6629, 116, 59, 24641, 238, 1683, 512, 97, 101, 105, 117, 6640, 6651, 6657, 6661, 496, 6645, 0, 6648, 115, 59, 27213, 111, 110, 59, 16653, 100, 105, 108, 32827, 231, 16615, 114, 99, 59, 16649, 112, 115, 256, 59, 115, 6668, 6669, 27212, 109, 59, 27216, 111, 116, 59, 16651, 384, 100, 109, 110, 6683, 6688, 6694, 105, 108, 32955, 184, 429, 112, 116, 121, 118, 59, 27058, 116, 33024, 162, 59, 101, 6701, 6702, 16546, 114, 228, 434, 114, 59, 49152, 55349, 56608, 384, 99, 101, 105, 6717, 6720, 6733, 121, 59, 17479, 99, 107, 256, 59, 109, 6727, 6728, 26387, 97, 114, 107, 187, 6728, 59, 17351, 114, 896, 59, 69, 99, 101, 102, 109, 115, 6751, 6752, 6754, 6763, 6820, 6826, 6830, 26059, 59, 27075, 384, 59, 101, 108, 6761, 6762, 6765, 17094, 113, 59, 25175, 101, 609, 6772, 0, 0, 6792, 114, 114, 111, 119, 256, 108, 114, 6780, 6785, 101, 102, 116, 59, 25018, 105, 103, 104, 116, 59, 25019, 640, 82, 83, 97, 99, 100, 6802, 6804, 6806, 6810, 6815, 187, 3911, 59, 25800, 115, 116, 59, 25243, 105, 114, 99, 59, 25242, 97, 115, 104, 59, 25245, 110, 105, 110, 116, 59, 27152, 105, 100, 59, 27375, 99, 105, 114, 59, 27074, 117, 98, 115, 256, 59, 117, 6843, 6844, 26211, 105, 116, 187, 6844, 748, 6855, 6868, 6906, 0, 6922, 111, 110, 256, 59, 101, 6861, 6862, 16442, 256, 59, 113, 199, 198, 621, 6873, 0, 0, 6882, 97, 256, 59, 116, 6878, 6879, 16428, 59, 16448, 384, 59, 102, 108, 6888, 6889, 6891, 25089, 238, 4448, 101, 256, 109, 120, 6897, 6902, 101, 110, 116, 187, 6889, 101, 243, 589, 487, 6910, 0, 6919, 256, 59, 100, 4795, 6914, 111, 116, 59, 27245, 110, 244, 582, 384, 102, 114, 121, 6928, 6932, 6935, 59, 49152, 55349, 56660, 111, 228, 596, 33024, 169, 59, 115, 341, 6941, 114, 59, 24855, 256, 97, 111, 6949, 6953, 114, 114, 59, 25013, 115, 115, 59, 26391, 256, 99, 117, 6962, 6967, 114, 59, 49152, 55349, 56504, 256, 98, 112, 6972, 6980, 256, 59, 101, 6977, 6978, 27343, 59, 27345, 256, 59, 101, 6985, 6986, 27344, 59, 27346, 100, 111, 116, 59, 25327, 896, 100, 101, 108, 112, 114, 118, 119, 7008, 7020, 7031, 7042, 7084, 7124, 7161, 97, 114, 114, 256, 108, 114, 7016, 7018, 59, 26936, 59, 26933, 624, 7026, 0, 0, 7029, 114, 59, 25310, 99, 59, 25311, 97, 114, 114, 256, 59, 112, 7039, 7040, 25014, 59, 26941, 768, 59, 98, 99, 100, 111, 115, 7055, 7056, 7062, 7073, 7077, 7080, 25130, 114, 99, 97, 112, 59, 27208, 256, 97, 117, 7067, 7070, 112, 59, 27206, 112, 59, 27210, 111, 116, 59, 25229, 114, 59, 27205, 59, 49152, 8746, 65024, 512, 97, 108, 114, 118, 7093, 7103, 7134, 7139, 114, 114, 256, 59, 109, 7100, 7101, 25015, 59, 26940, 121, 384, 101, 118, 119, 7111, 7124, 7128, 113, 624, 7118, 0, 0, 7122, 114, 101, 227, 7027, 117, 227, 7029, 101, 101, 59, 25294, 101, 100, 103, 101, 59, 25295, 101, 110, 32827, 164, 16548, 101, 97, 114, 114, 111, 119, 256, 108, 114, 7150, 7155, 101, 102, 116, 187, 7040, 105, 103, 104, 116, 187, 7101, 101, 228, 7133, 256, 99, 105, 7169, 7175, 111, 110, 105, 110, 244, 503, 110, 116, 59, 25137, 108, 99, 116, 121, 59, 25389, 2432, 65, 72, 97, 98, 99, 100, 101, 102, 104, 105, 106, 108, 111, 114, 115, 116, 117, 119, 122, 7224, 7227, 7231, 7261, 7273, 7285, 7306, 7326, 7340, 7351, 7419, 7423, 7437, 7547, 7569, 7595, 7611, 7622, 7629, 114, 242, 897, 97, 114, 59, 26981, 512, 103, 108, 114, 115, 7240, 7245, 7250, 7252, 103, 101, 114, 59, 24608, 101, 116, 104, 59, 24888, 242, 4403, 104, 256, 59, 118, 7258, 7259, 24592, 187, 2314, 363, 7265, 7271, 97, 114, 111, 119, 59, 26895, 97, 227, 789, 256, 97, 121, 7278, 7283, 114, 111, 110, 59, 16655, 59, 17460, 384, 59, 97, 111, 818, 7292, 7300, 256, 103, 114, 703, 7297, 114, 59, 25034, 116, 115, 101, 113, 59, 27255, 384, 103, 108, 109, 7313, 7316, 7320, 32827, 176, 16560, 116, 97, 59, 17332, 112, 116, 121, 118, 59, 27057, 256, 105, 114, 7331, 7336, 115, 104, 116, 59, 27007, 59, 49152, 55349, 56609, 97, 114, 256, 108, 114, 7347, 7349, 187, 2268, 187, 4126, 640, 97, 101, 103, 115, 118, 7362, 888, 7382, 7388, 7392, 109, 384, 59, 111, 115, 806, 7370, 7380, 110, 100, 256, 59, 115, 806, 7377, 117, 105, 116, 59, 26214, 97, 109, 109, 97, 59, 17373, 105, 110, 59, 25330, 384, 59, 105, 111, 7399, 7400, 7416, 16631, 100, 101, 33024, 247, 59, 111, 7399, 7408, 110, 116, 105, 109, 101, 115, 59, 25287, 110, 248, 7415, 99, 121, 59, 17490, 99, 623, 7430, 0, 0, 7434, 114, 110, 59, 25374, 111, 112, 59, 25357, 640, 108, 112, 116, 117, 119, 7448, 7453, 7458, 7497, 7509, 108, 97, 114, 59, 16420, 102, 59, 49152, 55349, 56661, 640, 59, 101, 109, 112, 115, 779, 7469, 7479, 7485, 7490, 113, 256, 59, 100, 850, 7475, 111, 116, 59, 25169, 105, 110, 117, 115, 59, 25144, 108, 117, 115, 59, 25108, 113, 117, 97, 114, 101, 59, 25249, 98, 108, 101, 98, 97, 114, 119, 101, 100, 103, 229, 250, 110, 384, 97, 100, 104, 4398, 7517, 7527, 111, 119, 110, 97, 114, 114, 111, 119, 243, 7299, 97, 114, 112, 111, 111, 110, 256, 108, 114, 7538, 7542, 101, 102, 244, 7348, 105, 103, 104, 244, 7350, 354, 7551, 7557, 107, 97, 114, 111, 247, 3906, 623, 7562, 0, 0, 7566, 114, 110, 59, 25375, 111, 112, 59, 25356, 384, 99, 111, 116, 7576, 7587, 7590, 256, 114, 121, 7581, 7585, 59, 49152, 55349, 56505, 59, 17493, 108, 59, 27126, 114, 111, 107, 59, 16657, 256, 100, 114, 7600, 7604, 111, 116, 59, 25329, 105, 256, 59, 102, 7610, 6166, 26047, 256, 97, 104, 7616, 7619, 114, 242, 1065, 97, 242, 4006, 97, 110, 103, 108, 101, 59, 27046, 256, 99, 105, 7634, 7637, 121, 59, 17503, 103, 114, 97, 114, 114, 59, 26623, 2304, 68, 97, 99, 100, 101, 102, 103, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 120, 7681, 7689, 7705, 7736, 1400, 7740, 7753, 7777, 7806, 7845, 7855, 7869, 7905, 7978, 7991, 8004, 8014, 8026, 256, 68, 111, 7686, 7476, 111, 244, 7305, 256, 99, 115, 7694, 7700, 117, 116, 101, 32827, 233, 16617, 116, 101, 114, 59, 27246, 512, 97, 105, 111, 121, 7714, 7719, 7729, 7734, 114, 111, 110, 59, 16667, 114, 256, 59, 99, 7725, 7726, 25174, 32827, 234, 16618, 108, 111, 110, 59, 25173, 59, 17485, 111, 116, 59, 16663, 256, 68, 114, 7745, 7749, 111, 116, 59, 25170, 59, 49152, 55349, 56610, 384, 59, 114, 115, 7760, 7761, 7767, 27290, 97, 118, 101, 32827, 232, 16616, 256, 59, 100, 7772, 7773, 27286, 111, 116, 59, 27288, 512, 59, 105, 108, 115, 7786, 7787, 7794, 7796, 27289, 110, 116, 101, 114, 115, 59, 25575, 59, 24851, 256, 59, 100, 7801, 7802, 27285, 111, 116, 59, 27287, 384, 97, 112, 115, 7813, 7817, 7831, 99, 114, 59, 16659, 116, 121, 384, 59, 115, 118, 7826, 7827, 7829, 25093, 101, 116, 187, 7827, 112, 256, 49, 59, 7837, 7844, 307, 7841, 7843, 59, 24580, 59, 24581, 24579, 256, 103, 115, 7850, 7852, 59, 16715, 112, 59, 24578, 256, 103, 112, 7860, 7864, 111, 110, 59, 16665, 102, 59, 49152, 55349, 56662, 384, 97, 108, 115, 7876, 7886, 7890, 114, 256, 59, 115, 7882, 7883, 25301, 108, 59, 27107, 117, 115, 59, 27249, 105, 384, 59, 108, 118, 7898, 7899, 7903, 17333, 111, 110, 187, 7899, 59, 17397, 512, 99, 115, 117, 118, 7914, 7923, 7947, 7971, 256, 105, 111, 7919, 7729, 114, 99, 187, 7726, 617, 7929, 0, 0, 7931, 237, 1352, 97, 110, 116, 256, 103, 108, 7938, 7942, 116, 114, 187, 7773, 101, 115, 115, 187, 7802, 384, 97, 101, 105, 7954, 7958, 7962, 108, 115, 59, 16445, 115, 116, 59, 25183, 118, 256, 59, 68, 565, 7968, 68, 59, 27256, 112, 97, 114, 115, 108, 59, 27109, 256, 68, 97, 7983, 7987, 111, 116, 59, 25171, 114, 114, 59, 26993, 384, 99, 100, 105, 7998, 8001, 7928, 114, 59, 24879, 111, 244, 850, 256, 97, 104, 8009, 8011, 59, 17335, 32827, 240, 16624, 256, 109, 114, 8019, 8023, 108, 32827, 235, 16619, 111, 59, 24748, 384, 99, 105, 112, 8033, 8036, 8039, 108, 59, 16417, 115, 244, 1390, 256, 101, 111, 8044, 8052, 99, 116, 97, 116, 105, 111, 238, 1369, 110, 101, 110, 116, 105, 97, 108, 229, 1401, 2529, 8082, 0, 8094, 0, 8097, 8103, 0, 0, 8134, 8140, 0, 8147, 0, 8166, 8170, 8192, 0, 8200, 8282, 108, 108, 105, 110, 103, 100, 111, 116, 115, 101, 241, 7748, 121, 59, 17476, 109, 97, 108, 101, 59, 26176, 384, 105, 108, 114, 8109, 8115, 8129, 108, 105, 103, 59, 32768, 64259, 617, 8121, 0, 0, 8125, 103, 59, 32768, 64256, 105, 103, 59, 32768, 64260, 59, 49152, 55349, 56611, 108, 105, 103, 59, 32768, 64257, 108, 105, 103, 59, 49152, 102, 106, 384, 97, 108, 116, 8153, 8156, 8161, 116, 59, 26221, 105, 103, 59, 32768, 64258, 110, 115, 59, 26033, 111, 102, 59, 16786, 496, 8174, 0, 8179, 102, 59, 49152, 55349, 56663, 256, 97, 107, 1471, 8183, 256, 59, 118, 8188, 8189, 25300, 59, 27353, 97, 114, 116, 105, 110, 116, 59, 27149, 256, 97, 111, 8204, 8277, 256, 99, 115, 8209, 8274, 945, 8218, 8240, 8248, 8261, 8264, 0, 8272, 946, 8226, 8229, 8231, 8234, 8236, 0, 8238, 32827, 189, 16573, 59, 24915, 32827, 188, 16572, 59, 24917, 59, 24921, 59, 24923, 435, 8244, 0, 8246, 59, 24916, 59, 24918, 692, 8254, 8257, 0, 0, 8259, 32827, 190, 16574, 59, 24919, 59, 24924, 53, 59, 24920, 438, 8268, 0, 8270, 59, 24922, 59, 24925, 56, 59, 24926, 108, 59, 24644, 119, 110, 59, 25378, 99, 114, 59, 49152, 55349, 56507, 2176, 69, 97, 98, 99, 100, 101, 102, 103, 105, 106, 108, 110, 111, 114, 115, 116, 118, 8322, 8329, 8351, 8357, 8368, 8372, 8432, 8437, 8442, 8447, 8451, 8466, 8504, 791, 8510, 8530, 8606, 256, 59, 108, 1613, 8327, 59, 27276, 384, 99, 109, 112, 8336, 8341, 8349, 117, 116, 101, 59, 16885, 109, 97, 256, 59, 100, 8348, 7386, 17331, 59, 27270, 114, 101, 118, 101, 59, 16671, 256, 105, 121, 8362, 8366, 114, 99, 59, 16669, 59, 17459, 111, 116, 59, 16673, 512, 59, 108, 113, 115, 1598, 1602, 8381, 8393, 384, 59, 113, 115, 1598, 1612, 8388, 108, 97, 110, 244, 1637, 512, 59, 99, 100, 108, 1637, 8402, 8405, 8421, 99, 59, 27305, 111, 116, 256, 59, 111, 8412, 8413, 27264, 256, 59, 108, 8418, 8419, 27266, 59, 27268, 256, 59, 101, 8426, 8429, 49152, 8923, 65024, 115, 59, 27284, 114, 59, 49152, 55349, 56612, 256, 59, 103, 1651, 1563, 109, 101, 108, 59, 24887, 99, 121, 59, 17491, 512, 59, 69, 97, 106, 1626, 8460, 8462, 8464, 59, 27282, 59, 27301, 59, 27300, 512, 69, 97, 101, 115, 8475, 8477, 8489, 8500, 59, 25193, 112, 256, 59, 112, 8483, 8484, 27274, 114, 111, 120, 187, 8484, 256, 59, 113, 8494, 8495, 27272, 256, 59, 113, 8494, 8475, 105, 109, 59, 25319, 112, 102, 59, 49152, 55349, 56664, 256, 99, 105, 8515, 8518, 114, 59, 24842, 109, 384, 59, 101, 108, 1643, 8526, 8528, 59, 27278, 59, 27280, 33536, 62, 59, 99, 100, 108, 113, 114, 1518, 8544, 8554, 8558, 8563, 8569, 256, 99, 105, 8549, 8551, 59, 27303, 114, 59, 27258, 111, 116, 59, 25303, 80, 97, 114, 59, 27029, 117, 101, 115, 116, 59, 27260, 640, 97, 100, 101, 108, 115, 8580, 8554, 8592, 1622, 8603, 496, 8585, 0, 8590, 112, 114, 111, 248, 8350, 114, 59, 27000, 113, 256, 108, 113, 1599, 8598, 108, 101, 115, 243, 8328, 105, 237, 1643, 256, 101, 110, 8611, 8621, 114, 116, 110, 101, 113, 113, 59, 49152, 8809, 65024, 197, 8618, 1280, 65, 97, 98, 99, 101, 102, 107, 111, 115, 121, 8644, 8647, 8689, 8693, 8698, 8728, 8733, 8751, 8808, 8829, 114, 242, 928, 512, 105, 108, 109, 114, 8656, 8660, 8663, 8667, 114, 115, 240, 5252, 102, 187, 8228, 105, 108, 244, 1705, 256, 100, 114, 8672, 8676, 99, 121, 59, 17482, 384, 59, 99, 119, 2292, 8683, 8687, 105, 114, 59, 26952, 59, 25005, 97, 114, 59, 24847, 105, 114, 99, 59, 16677, 384, 97, 108, 114, 8705, 8718, 8723, 114, 116, 115, 256, 59, 117, 8713, 8714, 26213, 105, 116, 187, 8714, 108, 105, 112, 59, 24614, 99, 111, 110, 59, 25273, 114, 59, 49152, 55349, 56613, 115, 256, 101, 119, 8739, 8745, 97, 114, 111, 119, 59, 26917, 97, 114, 111, 119, 59, 26918, 640, 97, 109, 111, 112, 114, 8762, 8766, 8771, 8798, 8803, 114, 114, 59, 25087, 116, 104, 116, 59, 25147, 107, 256, 108, 114, 8777, 8787, 101, 102, 116, 97, 114, 114, 111, 119, 59, 25001, 105, 103, 104, 116, 97, 114, 114, 111, 119, 59, 25002, 102, 59, 49152, 55349, 56665, 98, 97, 114, 59, 24597, 384, 99, 108, 116, 8815, 8820, 8824, 114, 59, 49152, 55349, 56509, 97, 115, 232, 8692, 114, 111, 107, 59, 16679, 256, 98, 112, 8834, 8839, 117, 108, 108, 59, 24643, 104, 101, 110, 187, 7259, 2785, 8867, 0, 8874, 0, 8888, 8901, 8910, 0, 8917, 8947, 0, 0, 8952, 8994, 9063, 9058, 9087, 0, 9094, 9130, 9140, 99, 117, 116, 101, 32827, 237, 16621, 384, 59, 105, 121, 1905, 8880, 8885, 114, 99, 32827, 238, 16622, 59, 17464, 256, 99, 120, 8892, 8895, 121, 59, 17461, 99, 108, 32827, 161, 16545, 256, 102, 114, 927, 8905, 59, 49152, 55349, 56614, 114, 97, 118, 101, 32827, 236, 16620, 512, 59, 105, 110, 111, 1854, 8925, 8937, 8942, 256, 105, 110, 8930, 8934, 110, 116, 59, 27148, 116, 59, 25133, 102, 105, 110, 59, 27100, 116, 97, 59, 24873, 108, 105, 103, 59, 16691, 384, 97, 111, 112, 8958, 8986, 8989, 384, 99, 103, 116, 8965, 8968, 8983, 114, 59, 16683, 384, 101, 108, 112, 1823, 8975, 8979, 105, 110, 229, 1934, 97, 114, 244, 1824, 104, 59, 16689, 102, 59, 25271, 101, 100, 59, 16821, 640, 59, 99, 102, 111, 116, 1268, 9004, 9009, 9021, 9025, 97, 114, 101, 59, 24837, 105, 110, 256, 59, 116, 9016, 9017, 25118, 105, 101, 59, 27101, 100, 111, 244, 8985, 640, 59, 99, 101, 108, 112, 1879, 9036, 9040, 9051, 9057, 97, 108, 59, 25274, 256, 103, 114, 9045, 9049, 101, 114, 243, 5475, 227, 9037, 97, 114, 104, 107, 59, 27159, 114, 111, 100, 59, 27196, 512, 99, 103, 112, 116, 9071, 9074, 9078, 9083, 121, 59, 17489, 111, 110, 59, 16687, 102, 59, 49152, 55349, 56666, 97, 59, 17337, 117, 101, 115, 116, 32827, 191, 16575, 256, 99, 105, 9098, 9103, 114, 59, 49152, 55349, 56510, 110, 640, 59, 69, 100, 115, 118, 1268, 9115, 9117, 9121, 1267, 59, 25337, 111, 116, 59, 25333, 256, 59, 118, 9126, 9127, 25332, 59, 25331, 256, 59, 105, 1911, 9134, 108, 100, 101, 59, 16681, 491, 9144, 0, 9148, 99, 121, 59, 17494, 108, 32827, 239, 16623, 768, 99, 102, 109, 111, 115, 117, 9164, 9175, 9180, 9185, 9191, 9205, 256, 105, 121, 9169, 9173, 114, 99, 59, 16693, 59, 17465, 114, 59, 49152, 55349, 56615, 97, 116, 104, 59, 16951, 112, 102, 59, 49152, 55349, 56667, 483, 9196, 0, 9201, 114, 59, 49152, 55349, 56511, 114, 99, 121, 59, 17496, 107, 99, 121, 59, 17492, 1024, 97, 99, 102, 103, 104, 106, 111, 115, 9227, 9238, 9250, 9255, 9261, 9265, 9269, 9275, 112, 112, 97, 256, 59, 118, 9235, 9236, 17338, 59, 17392, 256, 101, 121, 9243, 9248, 100, 105, 108, 59, 16695, 59, 17466, 114, 59, 49152, 55349, 56616, 114, 101, 101, 110, 59, 16696, 99, 121, 59, 17477, 99, 121, 59, 17500, 112, 102, 59, 49152, 55349, 56668, 99, 114, 59, 49152, 55349, 56512, 2944, 65, 66, 69, 72, 97, 98, 99, 100, 101, 102, 103, 104, 106, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 9328, 9345, 9350, 9357, 9361, 9486, 9533, 9562, 9600, 9806, 9822, 9829, 9849, 9853, 9882, 9906, 9944, 10077, 10088, 10123, 10176, 10241, 10258, 384, 97, 114, 116, 9335, 9338, 9340, 114, 242, 2502, 242, 917, 97, 105, 108, 59, 26907, 97, 114, 114, 59, 26894, 256, 59, 103, 2452, 9355, 59, 27275, 97, 114, 59, 26978, 2403, 9381, 0, 9386, 0, 9393, 0, 0, 0, 0, 0, 9397, 9402, 0, 9414, 9416, 9421, 0, 9465, 117, 116, 101, 59, 16698, 109, 112, 116, 121, 118, 59, 27060, 114, 97, 238, 2124, 98, 100, 97, 59, 17339, 103, 384, 59, 100, 108, 2190, 9409, 9411, 59, 27025, 229, 2190, 59, 27269, 117, 111, 32827, 171, 16555, 114, 1024, 59, 98, 102, 104, 108, 112, 115, 116, 2201, 9438, 9446, 9449, 9451, 9454, 9457, 9461, 256, 59, 102, 2205, 9443, 115, 59, 26911, 115, 59, 26909, 235, 8786, 112, 59, 25003, 108, 59, 26937, 105, 109, 59, 26995, 108, 59, 24994, 384, 59, 97, 101, 9471, 9472, 9476, 27307, 105, 108, 59, 26905, 256, 59, 115, 9481, 9482, 27309, 59, 49152, 10925, 65024, 384, 97, 98, 114, 9493, 9497, 9501, 114, 114, 59, 26892, 114, 107, 59, 26482, 256, 97, 107, 9506, 9516, 99, 256, 101, 107, 9512, 9514, 59, 16507, 59, 16475, 256, 101, 115, 9521, 9523, 59, 27019, 108, 256, 100, 117, 9529, 9531, 59, 27023, 59, 27021, 512, 97, 101, 117, 121, 9542, 9547, 9558, 9560, 114, 111, 110, 59, 16702, 256, 100, 105, 9552, 9556, 105, 108, 59, 16700, 236, 2224, 226, 9513, 59, 17467, 512, 99, 113, 114, 115, 9571, 9574, 9581, 9597, 97, 59, 26934, 117, 111, 256, 59, 114, 3609, 5958, 256, 100, 117, 9586, 9591, 104, 97, 114, 59, 26983, 115, 104, 97, 114, 59, 26955, 104, 59, 25010, 640, 59, 102, 103, 113, 115, 9611, 9612, 2441, 9715, 9727, 25188, 116, 640, 97, 104, 108, 114, 116, 9624, 9636, 9655, 9666, 9704, 114, 114, 111, 119, 256, 59, 116, 2201, 9633, 97, 233, 9462, 97, 114, 112, 111, 111, 110, 256, 100, 117, 9647, 9652, 111, 119, 110, 187, 1114, 112, 187, 2406, 101, 102, 116, 97, 114, 114, 111, 119, 115, 59, 25031, 105, 103, 104, 116, 384, 97, 104, 115, 9677, 9686, 9694, 114, 114, 111, 119, 256, 59, 115, 2292, 2215, 97, 114, 112, 111, 111, 110, 243, 3992, 113, 117, 105, 103, 97, 114, 114, 111, 247, 8688, 104, 114, 101, 101, 116, 105, 109, 101, 115, 59, 25291, 384, 59, 113, 115, 9611, 2451, 9722, 108, 97, 110, 244, 2476, 640, 59, 99, 100, 103, 115, 2476, 9738, 9741, 9757, 9768, 99, 59, 27304, 111, 116, 256, 59, 111, 9748, 9749, 27263, 256, 59, 114, 9754, 9755, 27265, 59, 27267, 256, 59, 101, 9762, 9765, 49152, 8922, 65024, 115, 59, 27283, 640, 97, 100, 101, 103, 115, 9779, 9785, 9789, 9801, 9803, 112, 112, 114, 111, 248, 9414, 111, 116, 59, 25302, 113, 256, 103, 113, 9795, 9797, 244, 2441, 103, 116, 242, 9356, 244, 2459, 105, 237, 2482, 384, 105, 108, 114, 9813, 2273, 9818, 115, 104, 116, 59, 27004, 59, 49152, 55349, 56617, 256, 59, 69, 2460, 9827, 59, 27281, 353, 9833, 9846, 114, 256, 100, 117, 9650, 9838, 256, 59, 108, 2405, 9843, 59, 26986, 108, 107, 59, 25988, 99, 121, 59, 17497, 640, 59, 97, 99, 104, 116, 2632, 9864, 9867, 9873, 9878, 114, 242, 9665, 111, 114, 110, 101, 242, 7432, 97, 114, 100, 59, 26987, 114, 105, 59, 26106, 256, 105, 111, 9887, 9892, 100, 111, 116, 59, 16704, 117, 115, 116, 256, 59, 97, 9900, 9901, 25520, 99, 104, 101, 187, 9901, 512, 69, 97, 101, 115, 9915, 9917, 9929, 9940, 59, 25192, 112, 256, 59, 112, 9923, 9924, 27273, 114, 111, 120, 187, 9924, 256, 59, 113, 9934, 9935, 27271, 256, 59, 113, 9934, 9915, 105, 109, 59, 25318, 1024, 97, 98, 110, 111, 112, 116, 119, 122, 9961, 9972, 9975, 10010, 10031, 10049, 10055, 10064, 256, 110, 114, 9966, 9969, 103, 59, 26604, 114, 59, 25085, 114, 235, 2241, 103, 384, 108, 109, 114, 9983, 9997, 10004, 101, 102, 116, 256, 97, 114, 2534, 9991, 105, 103, 104, 116, 225, 2546, 97, 112, 115, 116, 111, 59, 26620, 105, 103, 104, 116, 225, 2557, 112, 97, 114, 114, 111, 119, 256, 108, 114, 10021, 10025, 101, 102, 244, 9453, 105, 103, 104, 116, 59, 25004, 384, 97, 102, 108, 10038, 10041, 10045, 114, 59, 27013, 59, 49152, 55349, 56669, 117, 115, 59, 27181, 105, 109, 101, 115, 59, 27188, 353, 10059, 10063, 115, 116, 59, 25111, 225, 4942, 384, 59, 101, 102, 10071, 10072, 6144, 26058, 110, 103, 101, 187, 10072, 97, 114, 256, 59, 108, 10084, 10085, 16424, 116, 59, 27027, 640, 97, 99, 104, 109, 116, 10099, 10102, 10108, 10117, 10119, 114, 242, 2216, 111, 114, 110, 101, 242, 7564, 97, 114, 256, 59, 100, 3992, 10115, 59, 26989, 59, 24590, 114, 105, 59, 25279, 768, 97, 99, 104, 105, 113, 116, 10136, 10141, 2624, 10146, 10158, 10171, 113, 117, 111, 59, 24633, 114, 59, 49152, 55349, 56513, 109, 384, 59, 101, 103, 2482, 10154, 10156, 59, 27277, 59, 27279, 256, 98, 117, 9514, 10163, 111, 256, 59, 114, 3615, 10169, 59, 24602, 114, 111, 107, 59, 16706, 33792, 60, 59, 99, 100, 104, 105, 108, 113, 114, 2091, 10194, 9785, 10204, 10208, 10213, 10218, 10224, 256, 99, 105, 10199, 10201, 59, 27302, 114, 59, 27257, 114, 101, 229, 9714, 109, 101, 115, 59, 25289, 97, 114, 114, 59, 26998, 117, 101, 115, 116, 59, 27259, 256, 80, 105, 10229, 10233, 97, 114, 59, 27030, 384, 59, 101, 102, 10240, 2349, 6171, 26051, 114, 256, 100, 117, 10247, 10253, 115, 104, 97, 114, 59, 26954, 104, 97, 114, 59, 26982, 256, 101, 110, 10263, 10273, 114, 116, 110, 101, 113, 113, 59, 49152, 8808, 65024, 197, 10270, 1792, 68, 97, 99, 100, 101, 102, 104, 105, 108, 110, 111, 112, 115, 117, 10304, 10309, 10370, 10382, 10387, 10400, 10405, 10408, 10458, 10466, 10468, 2691, 10483, 10498, 68, 111, 116, 59, 25146, 512, 99, 108, 112, 114, 10318, 10322, 10339, 10365, 114, 32827, 175, 16559, 256, 101, 116, 10327, 10329, 59, 26178, 256, 59, 101, 10334, 10335, 26400, 115, 101, 187, 10335, 256, 59, 115, 4155, 10344, 116, 111, 512, 59, 100, 108, 117, 4155, 10355, 10359, 10363, 111, 119, 238, 1164, 101, 102, 244, 2319, 240, 5073, 107, 101, 114, 59, 26030, 256, 111, 121, 10375, 10380, 109, 109, 97, 59, 27177, 59, 17468, 97, 115, 104, 59, 24596, 97, 115, 117, 114, 101, 100, 97, 110, 103, 108, 101, 187, 5670, 114, 59, 49152, 55349, 56618, 111, 59, 24871, 384, 99, 100, 110, 10415, 10420, 10441, 114, 111, 32827, 181, 16565, 512, 59, 97, 99, 100, 5220, 10429, 10432, 10436, 115, 244, 5799, 105, 114, 59, 27376, 111, 116, 32955, 183, 437, 117, 115, 384, 59, 98, 100, 10450, 6403, 10451, 25106, 256, 59, 117, 7484, 10456, 59, 27178, 355, 10462, 10465, 112, 59, 27355, 242, 8722, 240, 2689, 256, 100, 112, 10473, 10478, 101, 108, 115, 59, 25255, 102, 59, 49152, 55349, 56670, 256, 99, 116, 10488, 10493, 114, 59, 49152, 55349, 56514, 112, 111, 115, 187, 5533, 384, 59, 108, 109, 10505, 10506, 10509, 17340, 116, 105, 109, 97, 112, 59, 25272, 3072, 71, 76, 82, 86, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 108, 109, 111, 112, 114, 115, 116, 117, 118, 119, 10562, 10579, 10622, 10633, 10648, 10714, 10729, 10773, 10778, 10840, 10845, 10883, 10901, 10916, 10920, 11012, 11015, 11076, 11135, 11182, 11316, 11367, 11388, 11497, 256, 103, 116, 10567, 10571, 59, 49152, 8921, 824, 256, 59, 118, 10576, 3023, 49152, 8811, 8402, 384, 101, 108, 116, 10586, 10610, 10614, 102, 116, 256, 97, 114, 10593, 10599, 114, 114, 111, 119, 59, 25037, 105, 103, 104, 116, 97, 114, 114, 111, 119, 59, 25038, 59, 49152, 8920, 824, 256, 59, 118, 10619, 3143, 49152, 8810, 8402, 105, 103, 104, 116, 97, 114, 114, 111, 119, 59, 25039, 256, 68, 100, 10638, 10643, 97, 115, 104, 59, 25263, 97, 115, 104, 59, 25262, 640, 98, 99, 110, 112, 116, 10659, 10663, 10668, 10673, 10700, 108, 97, 187, 734, 117, 116, 101, 59, 16708, 103, 59, 49152, 8736, 8402, 640, 59, 69, 105, 111, 112, 3460, 10684, 10688, 10693, 10696, 59, 49152, 10864, 824, 100, 59, 49152, 8779, 824, 115, 59, 16713, 114, 111, 248, 3460, 117, 114, 256, 59, 97, 10707, 10708, 26222, 108, 256, 59, 115, 10707, 2872, 499, 10719, 0, 10723, 112, 32955, 160, 2871, 109, 112, 256, 59, 101, 3065, 3072, 640, 97, 101, 111, 117, 121, 10740, 10750, 10755, 10768, 10771, 496, 10745, 0, 10747, 59, 27203, 111, 110, 59, 16712, 100, 105, 108, 59, 16710, 110, 103, 256, 59, 100, 3454, 10762, 111, 116, 59, 49152, 10861, 824, 112, 59, 27202, 59, 17469, 97, 115, 104, 59, 24595, 896, 59, 65, 97, 100, 113, 115, 120, 2962, 10793, 10797, 10811, 10817, 10821, 10832, 114, 114, 59, 25047, 114, 256, 104, 114, 10803, 10806, 107, 59, 26916, 256, 59, 111, 5106, 5104, 111, 116, 59, 49152, 8784, 824, 117, 105, 246, 2915, 256, 101, 105, 10826, 10830, 97, 114, 59, 26920, 237, 2968, 105, 115, 116, 256, 59, 115, 2976, 2975, 114, 59, 49152, 55349, 56619, 512, 69, 101, 115, 116, 3013, 10854, 10873, 10876, 384, 59, 113, 115, 3004, 10861, 3041, 384, 59, 113, 115, 3004, 3013, 10868, 108, 97, 110, 244, 3042, 105, 237, 3050, 256, 59, 114, 2998, 10881, 187, 2999, 384, 65, 97, 112, 10890, 10893, 10897, 114, 242, 10609, 114, 114, 59, 25006, 97, 114, 59, 27378, 384, 59, 115, 118, 3981, 10908, 3980, 256, 59, 100, 10913, 10914, 25340, 59, 25338, 99, 121, 59, 17498, 896, 65, 69, 97, 100, 101, 115, 116, 10935, 10938, 10942, 10946, 10949, 10998, 11001, 114, 242, 10598, 59, 49152, 8806, 824, 114, 114, 59, 24986, 114, 59, 24613, 512, 59, 102, 113, 115, 3131, 10958, 10979, 10991, 116, 256, 97, 114, 10964, 10969, 114, 114, 111, 247, 10945, 105, 103, 104, 116, 97, 114, 114, 111, 247, 10896, 384, 59, 113, 115, 3131, 10938, 10986, 108, 97, 110, 244, 3157, 256, 59, 115, 3157, 10996, 187, 3126, 105, 237, 3165, 256, 59, 114, 3125, 11006, 105, 256, 59, 101, 3098, 3109, 105, 228, 3472, 256, 112, 116, 11020, 11025, 102, 59, 49152, 55349, 56671, 33152, 172, 59, 105, 110, 11033, 11034, 11062, 16556, 110, 512, 59, 69, 100, 118, 2953, 11044, 11048, 11054, 59, 49152, 8953, 824, 111, 116, 59, 49152, 8949, 824, 481, 2953, 11059, 11061, 59, 25335, 59, 25334, 105, 256, 59, 118, 3256, 11068, 481, 3256, 11073, 11075, 59, 25342, 59, 25341, 384, 97, 111, 114, 11083, 11107, 11113, 114, 512, 59, 97, 115, 116, 2939, 11093, 11098, 11103, 108, 108, 101, 236, 2939, 108, 59, 49152, 11005, 8421, 59, 49152, 8706, 824, 108, 105, 110, 116, 59, 27156, 384, 59, 99, 101, 3218, 11120, 11123, 117, 229, 3237, 256, 59, 99, 3224, 11128, 256, 59, 101, 3218, 11133, 241, 3224, 512, 65, 97, 105, 116, 11144, 11147, 11165, 11175, 114, 242, 10632, 114, 114, 384, 59, 99, 119, 11156, 11157, 11161, 24987, 59, 49152, 10547, 824, 59, 49152, 8605, 824, 103, 104, 116, 97, 114, 114, 111, 119, 187, 11157, 114, 105, 256, 59, 101, 3275, 3286, 896, 99, 104, 105, 109, 112, 113, 117, 11197, 11213, 11225, 11012, 2936, 11236, 11247, 512, 59, 99, 101, 114, 3378, 11206, 3383, 11209, 117, 229, 3397, 59, 49152, 55349, 56515, 111, 114, 116, 621, 11013, 0, 0, 11222, 97, 114, 225, 11094, 109, 256, 59, 101, 3438, 11231, 256, 59, 113, 3444, 3443, 115, 117, 256, 98, 112, 11243, 11245, 229, 3320, 229, 3339, 384, 98, 99, 112, 11254, 11281, 11289, 512, 59, 69, 101, 115, 11263, 11264, 3362, 11268, 25220, 59, 49152, 10949, 824, 101, 116, 256, 59, 101, 3355, 11275, 113, 256, 59, 113, 3363, 11264, 99, 256, 59, 101, 3378, 11287, 241, 3384, 512, 59, 69, 101, 115, 11298, 11299, 3423, 11303, 25221, 59, 49152, 10950, 824, 101, 116, 256, 59, 101, 3416, 11310, 113, 256, 59, 113, 3424, 11299, 512, 103, 105, 108, 114, 11325, 11327, 11333, 11335, 236, 3031, 108, 100, 101, 32827, 241, 16625, 231, 3139, 105, 97, 110, 103, 108, 101, 256, 108, 114, 11346, 11356, 101, 102, 116, 256, 59, 101, 3098, 11354, 241, 3110, 105, 103, 104, 116, 256, 59, 101, 3275, 11365, 241, 3287, 256, 59, 109, 11372, 11373, 17341, 384, 59, 101, 115, 11380, 11381, 11385, 16419, 114, 111, 59, 24854, 112, 59, 24583, 1152, 68, 72, 97, 100, 103, 105, 108, 114, 115, 11407, 11412, 11417, 11422, 11427, 11440, 11446, 11475, 11491, 97, 115, 104, 59, 25261, 97, 114, 114, 59, 26884, 112, 59, 49152, 8781, 8402, 97, 115, 104, 59, 25260, 256, 101, 116, 11432, 11436, 59, 49152, 8805, 8402, 59, 49152, 62, 8402, 110, 102, 105, 110, 59, 27102, 384, 65, 101, 116, 11453, 11457, 11461, 114, 114, 59, 26882, 59, 49152, 8804, 8402, 256, 59, 114, 11466, 11469, 49152, 60, 8402, 105, 101, 59, 49152, 8884, 8402, 256, 65, 116, 11480, 11484, 114, 114, 59, 26883, 114, 105, 101, 59, 49152, 8885, 8402, 105, 109, 59, 49152, 8764, 8402, 384, 65, 97, 110, 11504, 11508, 11522, 114, 114, 59, 25046, 114, 256, 104, 114, 11514, 11517, 107, 59, 26915, 256, 59, 111, 5095, 5093, 101, 97, 114, 59, 26919, 4691, 6805, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11565, 0, 11576, 11592, 11616, 11621, 11634, 11652, 6919, 0, 0, 11661, 11691, 0, 11720, 11726, 0, 11740, 11801, 11819, 11838, 11843, 256, 99, 115, 11569, 6807, 117, 116, 101, 32827, 243, 16627, 256, 105, 121, 11580, 11589, 114, 256, 59, 99, 6814, 11586, 32827, 244, 16628, 59, 17470, 640, 97, 98, 105, 111, 115, 6816, 11602, 11607, 456, 11610, 108, 97, 99, 59, 16721, 118, 59, 27192, 111, 108, 100, 59, 27068, 108, 105, 103, 59, 16723, 256, 99, 114, 11625, 11629, 105, 114, 59, 27071, 59, 49152, 55349, 56620, 879, 11641, 0, 0, 11644, 0, 11650, 110, 59, 17115, 97, 118, 101, 32827, 242, 16626, 59, 27073, 256, 98, 109, 11656, 3572, 97, 114, 59, 27061, 512, 97, 99, 105, 116, 11669, 11672, 11685, 11688, 114, 242, 6784, 256, 105, 114, 11677, 11680, 114, 59, 27070, 111, 115, 115, 59, 27067, 110, 229, 3666, 59, 27072, 384, 97, 101, 105, 11697, 11701, 11705, 99, 114, 59, 16717, 103, 97, 59, 17353, 384, 99, 100, 110, 11712, 11717, 461, 114, 111, 110, 59, 17343, 59, 27062, 112, 102, 59, 49152, 55349, 56672, 384, 97, 101, 108, 11732, 11735, 466, 114, 59, 27063, 114, 112, 59, 27065, 896, 59, 97, 100, 105, 111, 115, 118, 11754, 11755, 11758, 11784, 11789, 11792, 11798, 25128, 114, 242, 6790, 512, 59, 101, 102, 109, 11767, 11768, 11778, 11781, 27229, 114, 256, 59, 111, 11774, 11775, 24884, 102, 187, 11775, 32827, 170, 16554, 32827, 186, 16570, 103, 111, 102, 59, 25270, 114, 59, 27222, 108, 111, 112, 101, 59, 27223, 59, 27227, 384, 99, 108, 111, 11807, 11809, 11815, 242, 11777, 97, 115, 104, 32827, 248, 16632, 108, 59, 25240, 105, 364, 11823, 11828, 100, 101, 32827, 245, 16629, 101, 115, 256, 59, 97, 475, 11834, 115, 59, 27190, 109, 108, 32827, 246, 16630, 98, 97, 114, 59, 25405, 2785, 11870, 0, 11901, 0, 11904, 11933, 0, 11938, 11961, 0, 0, 11979, 3740, 0, 12051, 0, 0, 12075, 12220, 0, 12232, 114, 512, 59, 97, 115, 116, 1027, 11879, 11890, 3717, 33024, 182, 59, 108, 11885, 11886, 16566, 108, 101, 236, 1027, 617, 11896, 0, 0, 11899, 109, 59, 27379, 59, 27389, 121, 59, 17471, 114, 640, 99, 105, 109, 112, 116, 11915, 11919, 11923, 6245, 11927, 110, 116, 59, 16421, 111, 100, 59, 16430, 105, 108, 59, 24624, 101, 110, 107, 59, 24625, 114, 59, 49152, 55349, 56621, 384, 105, 109, 111, 11944, 11952, 11956, 256, 59, 118, 11949, 11950, 17350, 59, 17365, 109, 97, 244, 2678, 110, 101, 59, 26126, 384, 59, 116, 118, 11967, 11968, 11976, 17344, 99, 104, 102, 111, 114, 107, 187, 8189, 59, 17366, 256, 97, 117, 11983, 11999, 110, 256, 99, 107, 11989, 11997, 107, 256, 59, 104, 8692, 11995, 59, 24846, 246, 8692, 115, 1152, 59, 97, 98, 99, 100, 101, 109, 115, 116, 12019, 12020, 6408, 12025, 12029, 12036, 12038, 12042, 12046, 16427, 99, 105, 114, 59, 27171, 105, 114, 59, 27170, 256, 111, 117, 7488, 12034, 59, 27173, 59, 27250, 110, 32955, 177, 3741, 105, 109, 59, 27174, 119, 111, 59, 27175, 384, 105, 112, 117, 12057, 12064, 12069, 110, 116, 105, 110, 116, 59, 27157, 102, 59, 49152, 55349, 56673, 110, 100, 32827, 163, 16547, 1280, 59, 69, 97, 99, 101, 105, 110, 111, 115, 117, 3784, 12095, 12097, 12100, 12103, 12161, 12169, 12178, 12158, 12214, 59, 27315, 112, 59, 27319, 117, 229, 3801, 256, 59, 99, 3790, 12108, 768, 59, 97, 99, 101, 110, 115, 3784, 12121, 12127, 12134, 12136, 12158, 112, 112, 114, 111, 248, 12099, 117, 114, 108, 121, 101, 241, 3801, 241, 3790, 384, 97, 101, 115, 12143, 12150, 12154, 112, 112, 114, 111, 120, 59, 27321, 113, 113, 59, 27317, 105, 109, 59, 25320, 105, 237, 3807, 109, 101, 256, 59, 115, 12168, 3758, 24626, 384, 69, 97, 115, 12152, 12176, 12154, 240, 12149, 384, 100, 102, 112, 3820, 12185, 12207, 384, 97, 108, 115, 12192, 12197, 12202, 108, 97, 114, 59, 25390, 105, 110, 101, 59, 25362, 117, 114, 102, 59, 25363, 256, 59, 116, 3835, 12212, 239, 3835, 114, 101, 108, 59, 25264, 256, 99, 105, 12224, 12229, 114, 59, 49152, 55349, 56517, 59, 17352, 110, 99, 115, 112, 59, 24584, 768, 102, 105, 111, 112, 115, 117, 12250, 8930, 12255, 12261, 12267, 12273, 114, 59, 49152, 55349, 56622, 112, 102, 59, 49152, 55349, 56674, 114, 105, 109, 101, 59, 24663, 99, 114, 59, 49152, 55349, 56518, 384, 97, 101, 111, 12280, 12297, 12307, 116, 256, 101, 105, 12286, 12293, 114, 110, 105, 111, 110, 243, 1712, 110, 116, 59, 27158, 115, 116, 256, 59, 101, 12304, 12305, 16447, 241, 7961, 244, 3860, 2688, 65, 66, 72, 97, 98, 99, 100, 101, 102, 104, 105, 108, 109, 110, 111, 112, 114, 115, 116, 117, 120, 12352, 12369, 12373, 12377, 12512, 12558, 12587, 12615, 12642, 12658, 12686, 12806, 12821, 12836, 12841, 12888, 12910, 12914, 12944, 12976, 12983, 384, 97, 114, 116, 12359, 12362, 12364, 114, 242, 4275, 242, 989, 97, 105, 108, 59, 26908, 97, 114, 242, 7269, 97, 114, 59, 26980, 896, 99, 100, 101, 110, 113, 114, 116, 12392, 12405, 12408, 12415, 12431, 12436, 12492, 256, 101, 117, 12397, 12401, 59, 49152, 8765, 817, 116, 101, 59, 16725, 105, 227, 4462, 109, 112, 116, 121, 118, 59, 27059, 103, 512, 59, 100, 101, 108, 4049, 12425, 12427, 12429, 59, 27026, 59, 27045, 229, 4049, 117, 111, 32827, 187, 16571, 114, 1408, 59, 97, 98, 99, 102, 104, 108, 112, 115, 116, 119, 4060, 12460, 12463, 12471, 12473, 12476, 12478, 12480, 12483, 12487, 12490, 112, 59, 26997, 256, 59, 102, 4064, 12468, 115, 59, 26912, 59, 26931, 115, 59, 26910, 235, 8797, 240, 10030, 108, 59, 26949, 105, 109, 59, 26996, 108, 59, 24995, 59, 24989, 256, 97, 105, 12497, 12501, 105, 108, 59, 26906, 111, 256, 59, 110, 12507, 12508, 25142, 97, 108, 243, 3870, 384, 97, 98, 114, 12519, 12522, 12526, 114, 242, 6117, 114, 107, 59, 26483, 256, 97, 107, 12531, 12541, 99, 256, 101, 107, 12537, 12539, 59, 16509, 59, 16477, 256, 101, 115, 12546, 12548, 59, 27020, 108, 256, 100, 117, 12554, 12556, 59, 27022, 59, 27024, 512, 97, 101, 117, 121, 12567, 12572, 12583, 12585, 114, 111, 110, 59, 16729, 256, 100, 105, 12577, 12581, 105, 108, 59, 16727, 236, 4082, 226, 12538, 59, 17472, 512, 99, 108, 113, 115, 12596, 12599, 12605, 12612, 97, 59, 26935, 100, 104, 97, 114, 59, 26985, 117, 111, 256, 59, 114, 526, 525, 104, 59, 25011, 384, 97, 99, 103, 12622, 12639, 3908, 108, 512, 59, 105, 112, 115, 3960, 12632, 12635, 4252, 110, 229, 4283, 97, 114, 244, 4009, 116, 59, 26029, 384, 105, 108, 114, 12649, 4131, 12654, 115, 104, 116, 59, 27005, 59, 49152, 55349, 56623, 256, 97, 111, 12663, 12678, 114, 256, 100, 117, 12669, 12671, 187, 1147, 256, 59, 108, 4241, 12676, 59, 26988, 256, 59, 118, 12683, 12684, 17345, 59, 17393, 384, 103, 110, 115, 12693, 12793, 12796, 104, 116, 768, 97, 104, 108, 114, 115, 116, 12708, 12720, 12738, 12760, 12772, 12782, 114, 114, 111, 119, 256, 59, 116, 4060, 12717, 97, 233, 12488, 97, 114, 112, 111, 111, 110, 256, 100, 117, 12731, 12735, 111, 119, 238, 12670, 112, 187, 4242, 101, 102, 116, 256, 97, 104, 12746, 12752, 114, 114, 111, 119, 243, 4074, 97, 114, 112, 111, 111, 110, 243, 1361, 105, 103, 104, 116, 97, 114, 114, 111, 119, 115, 59, 25033, 113, 117, 105, 103, 97, 114, 114, 111, 247, 12491, 104, 114, 101, 101, 116, 105, 109, 101, 115, 59, 25292, 103, 59, 17114, 105, 110, 103, 100, 111, 116, 115, 101, 241, 7986, 384, 97, 104, 109, 12813, 12816, 12819, 114, 242, 4074, 97, 242, 1361, 59, 24591, 111, 117, 115, 116, 256, 59, 97, 12830, 12831, 25521, 99, 104, 101, 187, 12831, 109, 105, 100, 59, 27374, 512, 97, 98, 112, 116, 12850, 12861, 12864, 12882, 256, 110, 114, 12855, 12858, 103, 59, 26605, 114, 59, 25086, 114, 235, 4099, 384, 97, 102, 108, 12871, 12874, 12878, 114, 59, 27014, 59, 49152, 55349, 56675, 117, 115, 59, 27182, 105, 109, 101, 115, 59, 27189, 256, 97, 112, 12893, 12903, 114, 256, 59, 103, 12899, 12900, 16425, 116, 59, 27028, 111, 108, 105, 110, 116, 59, 27154, 97, 114, 242, 12771, 512, 97, 99, 104, 113, 12923, 12928, 4284, 12933, 113, 117, 111, 59, 24634, 114, 59, 49152, 55349, 56519, 256, 98, 117, 12539, 12938, 111, 256, 59, 114, 532, 531, 384, 104, 105, 114, 12951, 12955, 12960, 114, 101, 229, 12792, 109, 101, 115, 59, 25290, 105, 512, 59, 101, 102, 108, 12970, 4185, 6177, 12971, 26041, 116, 114, 105, 59, 27086, 108, 117, 104, 97, 114, 59, 26984, 59, 24862, 3425, 13013, 13019, 13023, 13100, 13112, 13169, 0, 13178, 13220, 0, 0, 13292, 13296, 0, 13352, 13384, 13402, 13485, 13489, 13514, 13553, 0, 13846, 0, 0, 13875, 99, 117, 116, 101, 59, 16731, 113, 117, 239, 10170, 1280, 59, 69, 97, 99, 101, 105, 110, 112, 115, 121, 4589, 13043, 13045, 13055, 13058, 13067, 13071, 13087, 13094, 13097, 59, 27316, 496, 13050, 0, 13052, 59, 27320, 111, 110, 59, 16737, 117, 229, 4606, 256, 59, 100, 4595, 13063, 105, 108, 59, 16735, 114, 99, 59, 16733, 384, 69, 97, 115, 13078, 13080, 13083, 59, 27318, 112, 59, 27322, 105, 109, 59, 25321, 111, 108, 105, 110, 116, 59, 27155, 105, 237, 4612, 59, 17473, 111, 116, 384, 59, 98, 101, 13108, 7495, 13109, 25285, 59, 27238, 896, 65, 97, 99, 109, 115, 116, 120, 13126, 13130, 13143, 13147, 13150, 13155, 13165, 114, 114, 59, 25048, 114, 256, 104, 114, 13136, 13138, 235, 8744, 256, 59, 111, 2614, 2612, 116, 32827, 167, 16551, 105, 59, 16443, 119, 97, 114, 59, 26921, 109, 256, 105, 110, 13161, 240, 110, 117, 243, 241, 116, 59, 26422, 114, 256, 59, 111, 13174, 8277, 49152, 55349, 56624, 512, 97, 99, 111, 121, 13186, 13190, 13201, 13216, 114, 112, 59, 26223, 256, 104, 121, 13195, 13199, 99, 121, 59, 17481, 59, 17480, 114, 116, 621, 13209, 0, 0, 13212, 105, 228, 5220, 97, 114, 97, 236, 11887, 32827, 173, 16557, 256, 103, 109, 13224, 13236, 109, 97, 384, 59, 102, 118, 13233, 13234, 13234, 17347, 59, 17346, 1024, 59, 100, 101, 103, 108, 110, 112, 114, 4779, 13253, 13257, 13262, 13270, 13278, 13281, 13286, 111, 116, 59, 27242, 256, 59, 113, 4785, 4784, 256, 59, 69, 13267, 13268, 27294, 59, 27296, 256, 59, 69, 13275, 13276, 27293, 59, 27295, 101, 59, 25158, 108, 117, 115, 59, 27172, 97, 114, 114, 59, 26994, 97, 114, 242, 4413, 512, 97, 101, 105, 116, 13304, 13320, 13327, 13335, 256, 108, 115, 13309, 13316, 108, 115, 101, 116, 109, 233, 13162, 104, 112, 59, 27187, 112, 97, 114, 115, 108, 59, 27108, 256, 100, 108, 5219, 13332, 101, 59, 25379, 256, 59, 101, 13340, 13341, 27306, 256, 59, 115, 13346, 13347, 27308, 59, 49152, 10924, 65024, 384, 102, 108, 112, 13358, 13363, 13378, 116, 99, 121, 59, 17484, 256, 59, 98, 13368, 13369, 16431, 256, 59, 97, 13374, 13375, 27076, 114, 59, 25407, 102, 59, 49152, 55349, 56676, 97, 256, 100, 114, 13389, 1026, 101, 115, 256, 59, 117, 13396, 13397, 26208, 105, 116, 187, 13397, 384, 99, 115, 117, 13408, 13433, 13471, 256, 97, 117, 13413, 13423, 112, 256, 59, 115, 4488, 13419, 59, 49152, 8851, 65024, 112, 256, 59, 115, 4532, 13429, 59, 49152, 8852, 65024, 117, 256, 98, 112, 13439, 13455, 384, 59, 101, 115, 4503, 4508, 13446, 101, 116, 256, 59, 101, 4503, 13453, 241, 4509, 384, 59, 101, 115, 4520, 4525, 13462, 101, 116, 256, 59, 101, 4520, 13469, 241, 4526, 384, 59, 97, 102, 4475, 13478, 1456, 114, 357, 13483, 1457, 187, 4476, 97, 114, 242, 4424, 512, 99, 101, 109, 116, 13497, 13502, 13506, 13509, 114, 59, 49152, 55349, 56520, 116, 109, 238, 241, 105, 236, 13333, 97, 114, 230, 4542, 256, 97, 114, 13518, 13525, 114, 256, 59, 102, 13524, 6079, 26118, 256, 97, 110, 13530, 13549, 105, 103, 104, 116, 256, 101, 112, 13539, 13546, 112, 115, 105, 108, 111, 238, 7904, 104, 233, 11951, 115, 187, 10322, 640, 98, 99, 109, 110, 112, 13563, 13662, 4617, 13707, 13710, 1152, 59, 69, 100, 101, 109, 110, 112, 114, 115, 13582, 13583, 13585, 13589, 13598, 13603, 13612, 13617, 13622, 25218, 59, 27333, 111, 116, 59, 27325, 256, 59, 100, 4570, 13594, 111, 116, 59, 27331, 117, 108, 116, 59, 27329, 256, 69, 101, 13608, 13610, 59, 27339, 59, 25226, 108, 117, 115, 59, 27327, 97, 114, 114, 59, 27001, 384, 101, 105, 117, 13629, 13650, 13653, 116, 384, 59, 101, 110, 13582, 13637, 13643, 113, 256, 59, 113, 4570, 13583, 101, 113, 256, 59, 113, 13611, 13608, 109, 59, 27335, 256, 98, 112, 13658, 13660, 59, 27349, 59, 27347, 99, 768, 59, 97, 99, 101, 110, 115, 4589, 13676, 13682, 13689, 13691, 13094, 112, 112, 114, 111, 248, 13050, 117, 114, 108, 121, 101, 241, 4606, 241, 4595, 384, 97, 101, 115, 13698, 13704, 13083, 112, 112, 114, 111, 248, 13082, 113, 241, 13079, 103, 59, 26218, 1664, 49, 50, 51, 59, 69, 100, 101, 104, 108, 109, 110, 112, 115, 13737, 13740, 13743, 4636, 13746, 13748, 13760, 13769, 13781, 13786, 13791, 13800, 13805, 32827, 185, 16569, 32827, 178, 16562, 32827, 179, 16563, 59, 27334, 256, 111, 115, 13753, 13756, 116, 59, 27326, 117, 98, 59, 27352, 256, 59, 100, 4642, 13765, 111, 116, 59, 27332, 115, 256, 111, 117, 13775, 13778, 108, 59, 26569, 98, 59, 27351, 97, 114, 114, 59, 27003, 117, 108, 116, 59, 27330, 256, 69, 101, 13796, 13798, 59, 27340, 59, 25227, 108, 117, 115, 59, 27328, 384, 101, 105, 117, 13812, 13833, 13836, 116, 384, 59, 101, 110, 4636, 13820, 13826, 113, 256, 59, 113, 4642, 13746, 101, 113, 256, 59, 113, 13799, 13796, 109, 59, 27336, 256, 98, 112, 13841, 13843, 59, 27348, 59, 27350, 384, 65, 97, 110, 13852, 13856, 13869, 114, 114, 59, 25049, 114, 256, 104, 114, 13862, 13864, 235, 8750, 256, 59, 111, 2603, 2601, 119, 97, 114, 59, 26922, 108, 105, 103, 32827, 223, 16607, 3041, 13905, 13917, 13920, 4814, 13939, 13945, 0, 13950, 14018, 0, 0, 0, 0, 0, 14043, 14083, 0, 14089, 14188, 0, 0, 0, 14215, 626, 13910, 0, 0, 13915, 103, 101, 116, 59, 25366, 59, 17348, 114, 235, 3679, 384, 97, 101, 121, 13926, 13931, 13936, 114, 111, 110, 59, 16741, 100, 105, 108, 59, 16739, 59, 17474, 108, 114, 101, 99, 59, 25365, 114, 59, 49152, 55349, 56625, 512, 101, 105, 107, 111, 13958, 13981, 14005, 14012, 498, 13963, 0, 13969, 101, 256, 52, 102, 4740, 4737, 97, 384, 59, 115, 118, 13976, 13977, 13979, 17336, 121, 109, 59, 17361, 256, 99, 110, 13986, 14002, 107, 256, 97, 115, 13992, 13998, 112, 112, 114, 111, 248, 4801, 105, 109, 187, 4780, 115, 240, 4766, 256, 97, 115, 14010, 13998, 240, 4801, 114, 110, 32827, 254, 16638, 492, 799, 14022, 8935, 101, 115, 33152, 215, 59, 98, 100, 14031, 14032, 14040, 16599, 256, 59, 97, 6415, 14037, 114, 59, 27185, 59, 27184, 384, 101, 112, 115, 14049, 14051, 14080, 225, 10829, 512, 59, 98, 99, 102, 1158, 14060, 14064, 14068, 111, 116, 59, 25398, 105, 114, 59, 27377, 256, 59, 111, 14073, 14076, 49152, 55349, 56677, 114, 107, 59, 27354, 225, 13154, 114, 105, 109, 101, 59, 24628, 384, 97, 105, 112, 14095, 14098, 14180, 100, 229, 4680, 896, 97, 100, 101, 109, 112, 115, 116, 14113, 14157, 14144, 14161, 14167, 14172, 14175, 110, 103, 108, 101, 640, 59, 100, 108, 113, 114, 14128, 14129, 14134, 14144, 14146, 26037, 111, 119, 110, 187, 7611, 101, 102, 116, 256, 59, 101, 10240, 14142, 241, 2350, 59, 25180, 105, 103, 104, 116, 256, 59, 101, 12970, 14155, 241, 4186, 111, 116, 59, 26092, 105, 110, 117, 115, 59, 27194, 108, 117, 115, 59, 27193, 98, 59, 27085, 105, 109, 101, 59, 27195, 101, 122, 105, 117, 109, 59, 25570, 384, 99, 104, 116, 14194, 14205, 14209, 256, 114, 121, 14199, 14203, 59, 49152, 55349, 56521, 59, 17478, 99, 121, 59, 17499, 114, 111, 107, 59, 16743, 256, 105, 111, 14219, 14222, 120, 244, 6007, 104, 101, 97, 100, 256, 108, 114, 14231, 14240, 101, 102, 116, 97, 114, 114, 111, 247, 2127, 105, 103, 104, 116, 97, 114, 114, 111, 119, 187, 3933, 2304, 65, 72, 97, 98, 99, 100, 102, 103, 104, 108, 109, 111, 112, 114, 115, 116, 117, 119, 14288, 14291, 14295, 14308, 14320, 14332, 14350, 14364, 14371, 14388, 14417, 14429, 14443, 14505, 14540, 14546, 14570, 14582, 114, 242, 1005, 97, 114, 59, 26979, 256, 99, 114, 14300, 14306, 117, 116, 101, 32827, 250, 16634, 242, 4432, 114, 483, 14314, 0, 14317, 121, 59, 17502, 118, 101, 59, 16749, 256, 105, 121, 14325, 14330, 114, 99, 32827, 251, 16635, 59, 17475, 384, 97, 98, 104, 14339, 14342, 14347, 114, 242, 5037, 108, 97, 99, 59, 16753, 97, 242, 5059, 256, 105, 114, 14355, 14360, 115, 104, 116, 59, 27006, 59, 49152, 55349, 56626, 114, 97, 118, 101, 32827, 249, 16633, 353, 14375, 14385, 114, 256, 108, 114, 14380, 14382, 187, 2391, 187, 4227, 108, 107, 59, 25984, 256, 99, 116, 14393, 14413, 623, 14399, 0, 0, 14410, 114, 110, 256, 59, 101, 14405, 14406, 25372, 114, 187, 14406, 111, 112, 59, 25359, 114, 105, 59, 26104, 256, 97, 108, 14422, 14426, 99, 114, 59, 16747, 32955, 168, 841, 256, 103, 112, 14434, 14438, 111, 110, 59, 16755, 102, 59, 49152, 55349, 56678, 768, 97, 100, 104, 108, 115, 117, 4427, 14456, 14461, 4978, 14481, 14496, 111, 119, 110, 225, 5043, 97, 114, 112, 111, 111, 110, 256, 108, 114, 14472, 14476, 101, 102, 244, 14381, 105, 103, 104, 244, 14383, 105, 384, 59, 104, 108, 14489, 14490, 14492, 17349, 187, 5114, 111, 110, 187, 14490, 112, 97, 114, 114, 111, 119, 115, 59, 25032, 384, 99, 105, 116, 14512, 14532, 14536, 623, 14518, 0, 0, 14529, 114, 110, 256, 59, 101, 14524, 14525, 25373, 114, 187, 14525, 111, 112, 59, 25358, 110, 103, 59, 16751, 114, 105, 59, 26105, 99, 114, 59, 49152, 55349, 56522, 384, 100, 105, 114, 14553, 14557, 14562, 111, 116, 59, 25328, 108, 100, 101, 59, 16745, 105, 256, 59, 102, 14128, 14568, 187, 6163, 256, 97, 109, 14575, 14578, 114, 242, 14504, 108, 32827, 252, 16636, 97, 110, 103, 108, 101, 59, 27047, 1920, 65, 66, 68, 97, 99, 100, 101, 102, 108, 110, 111, 112, 114, 115, 122, 14620, 14623, 14633, 14637, 14773, 14776, 14781, 14815, 14820, 14824, 14835, 14841, 14845, 14849, 14880, 114, 242, 1015, 97, 114, 256, 59, 118, 14630, 14631, 27368, 59, 27369, 97, 115, 232, 993, 256, 110, 114, 14642, 14647, 103, 114, 116, 59, 27036, 896, 101, 107, 110, 112, 114, 115, 116, 13539, 14662, 14667, 14674, 14685, 14692, 14742, 97, 112, 112, 225, 9237, 111, 116, 104, 105, 110, 231, 7830, 384, 104, 105, 114, 13547, 11976, 14681, 111, 112, 244, 12213, 256, 59, 104, 5047, 14690, 239, 12685, 256, 105, 117, 14697, 14701, 103, 109, 225, 13235, 256, 98, 112, 14706, 14724, 115, 101, 116, 110, 101, 113, 256, 59, 113, 14717, 14720, 49152, 8842, 65024, 59, 49152, 10955, 65024, 115, 101, 116, 110, 101, 113, 256, 59, 113, 14735, 14738, 49152, 8843, 65024, 59, 49152, 10956, 65024, 256, 104, 114, 14747, 14751, 101, 116, 225, 13980, 105, 97, 110, 103, 108, 101, 256, 108, 114, 14762, 14767, 101, 102, 116, 187, 2341, 105, 103, 104, 116, 187, 4177, 121, 59, 17458, 97, 115, 104, 187, 4150, 384, 101, 108, 114, 14788, 14802, 14807, 384, 59, 98, 101, 11754, 14795, 14799, 97, 114, 59, 25275, 113, 59, 25178, 108, 105, 112, 59, 25326, 256, 98, 116, 14812, 5224, 97, 242, 5225, 114, 59, 49152, 55349, 56627, 116, 114, 233, 14766, 115, 117, 256, 98, 112, 14831, 14833, 187, 3356, 187, 3417, 112, 102, 59, 49152, 55349, 56679, 114, 111, 240, 3835, 116, 114, 233, 14772, 256, 99, 117, 14854, 14859, 114, 59, 49152, 55349, 56523, 256, 98, 112, 14864, 14872, 110, 256, 69, 101, 14720, 14870, 187, 14718, 110, 256, 69, 101, 14738, 14878, 187, 14736, 105, 103, 122, 97, 103, 59, 27034, 896, 99, 101, 102, 111, 112, 114, 115, 14902, 14907, 14934, 14939, 14932, 14945, 14954, 105, 114, 99, 59, 16757, 256, 100, 105, 14912, 14929, 256, 98, 103, 14917, 14921, 97, 114, 59, 27231, 101, 256, 59, 113, 5626, 14927, 59, 25177, 101, 114, 112, 59, 24856, 114, 59, 49152, 55349, 56628, 112, 102, 59, 49152, 55349, 56680, 256, 59, 101, 5241, 14950, 97, 116, 232, 5241, 99, 114, 59, 49152, 55349, 56524, 2787, 6030, 14983, 0, 14987, 0, 14992, 15003, 0, 0, 15005, 15016, 15019, 15023, 0, 0, 15043, 15054, 0, 15064, 6108, 6111, 116, 114, 233, 6097, 114, 59, 49152, 55349, 56629, 256, 65, 97, 14996, 14999, 114, 242, 963, 114, 242, 2550, 59, 17342, 256, 65, 97, 15009, 15012, 114, 242, 952, 114, 242, 2539, 97, 240, 10003, 105, 115, 59, 25339, 384, 100, 112, 116, 6052, 15029, 15038, 256, 102, 108, 15034, 6057, 59, 49152, 55349, 56681, 105, 109, 229, 6066, 256, 65, 97, 15047, 15050, 114, 242, 974, 114, 242, 2561, 256, 99, 113, 15058, 6072, 114, 59, 49152, 55349, 56525, 256, 112, 116, 6102, 15068, 114, 233, 6100, 1024, 97, 99, 101, 102, 105, 111, 115, 117, 15088, 15101, 15112, 15116, 15121, 15125, 15131, 15137, 99, 256, 117, 121, 15094, 15099, 116, 101, 32827, 253, 16637, 59, 17487, 256, 105, 121, 15106, 15110, 114, 99, 59, 16759, 59, 17483, 110, 32827, 165, 16549, 114, 59, 49152, 55349, 56630, 99, 121, 59, 17495, 112, 102, 59, 49152, 55349, 56682, 99, 114, 59, 49152, 55349, 56526, 256, 99, 109, 15142, 15145, 121, 59, 17486, 108, 32827, 255, 16639, 1280, 97, 99, 100, 101, 102, 104, 105, 111, 115, 119, 15170, 15176, 15188, 15192, 15204, 15209, 15213, 15220, 15226, 15232, 99, 117, 116, 101, 59, 16762, 256, 97, 121, 15181, 15186, 114, 111, 110, 59, 16766, 59, 17463, 111, 116, 59, 16764, 256, 101, 116, 15197, 15201, 116, 114, 230, 5471, 97, 59, 17334, 114, 59, 49152, 55349, 56631, 99, 121, 59, 17462, 103, 114, 97, 114, 114, 59, 25053, 112, 102, 59, 49152, 55349, 56683, 99, 114, 59, 49152, 55349, 56527, 256, 106, 110, 15237, 15239, 59, 24589, 106, 59, 24588]));
//# sourceMappingURL=decode-data-html.js.map

/***/ }),
/* 35 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Generated using scripts/write-decode-map.ts
// prettier-ignore
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Uint16Array([512, 97, 103, 108, 113, 9, 21, 24, 27, 621, 15, 0, 0, 18, 112, 59, 16422, 111, 115, 59, 16423, 116, 59, 16446, 116, 59, 16444, 117, 111, 116, 59, 16418]));
//# sourceMappingURL=decode-data-xml.js.map

/***/ }),
/* 36 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ decodeCodePoint),
/* harmony export */   "fromCodePoint": () => (/* binding */ fromCodePoint),
/* harmony export */   "replaceCodePoint": () => (/* binding */ replaceCodePoint)
/* harmony export */ });
// Adapted from https://github.com/mathiasbynens/he/blob/36afe179392226cf1b6ccdb16ebbb7a5a844d93a/src/he.js#L106-L134
var _a;
const decodeMap = new Map([
    [0, 65533],
    [128, 8364],
    [130, 8218],
    [131, 402],
    [132, 8222],
    [133, 8230],
    [134, 8224],
    [135, 8225],
    [136, 710],
    [137, 8240],
    [138, 352],
    [139, 8249],
    [140, 338],
    [142, 381],
    [145, 8216],
    [146, 8217],
    [147, 8220],
    [148, 8221],
    [149, 8226],
    [150, 8211],
    [151, 8212],
    [152, 732],
    [153, 8482],
    [154, 353],
    [155, 8250],
    [156, 339],
    [158, 382],
    [159, 376],
]);
const fromCodePoint = 
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
(_a = String.fromCodePoint) !== null && _a !== void 0 ? _a : function (codePoint) {
    let output = "";
    if (codePoint > 0xffff) {
        codePoint -= 0x10000;
        output += String.fromCharCode(((codePoint >>> 10) & 0x3ff) | 0xd800);
        codePoint = 0xdc00 | (codePoint & 0x3ff);
    }
    output += String.fromCharCode(codePoint);
    return output;
};
function replaceCodePoint(codePoint) {
    var _a;
    if ((codePoint >= 0xd800 && codePoint <= 0xdfff) || codePoint > 0x10ffff) {
        return 0xfffd;
    }
    return (_a = decodeMap.get(codePoint)) !== null && _a !== void 0 ? _a : codePoint;
}
function decodeCodePoint(codePoint) {
    return fromCodePoint(replaceCodePoint(codePoint));
}
//# sourceMappingURL=decode_codepoint.js.map

/***/ }),
/* 37 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ATTRS": () => (/* binding */ ATTRS),
/* harmony export */   "DOCUMENT_MODE": () => (/* binding */ DOCUMENT_MODE),
/* harmony export */   "NS": () => (/* binding */ NS),
/* harmony export */   "SPECIAL_ELEMENTS": () => (/* binding */ SPECIAL_ELEMENTS),
/* harmony export */   "TAG_ID": () => (/* binding */ TAG_ID),
/* harmony export */   "TAG_NAMES": () => (/* binding */ TAG_NAMES),
/* harmony export */   "getTagID": () => (/* binding */ getTagID),
/* harmony export */   "hasUnescapedText": () => (/* binding */ hasUnescapedText),
/* harmony export */   "isNumberedHeader": () => (/* binding */ isNumberedHeader)
/* harmony export */ });
/** All valid namespaces in HTML. */
var NS;
(function (NS) {
    NS["HTML"] = "http://www.w3.org/1999/xhtml";
    NS["MATHML"] = "http://www.w3.org/1998/Math/MathML";
    NS["SVG"] = "http://www.w3.org/2000/svg";
    NS["XLINK"] = "http://www.w3.org/1999/xlink";
    NS["XML"] = "http://www.w3.org/XML/1998/namespace";
    NS["XMLNS"] = "http://www.w3.org/2000/xmlns/";
})(NS || (NS = {}));
var ATTRS;
(function (ATTRS) {
    ATTRS["TYPE"] = "type";
    ATTRS["ACTION"] = "action";
    ATTRS["ENCODING"] = "encoding";
    ATTRS["PROMPT"] = "prompt";
    ATTRS["NAME"] = "name";
    ATTRS["COLOR"] = "color";
    ATTRS["FACE"] = "face";
    ATTRS["SIZE"] = "size";
})(ATTRS || (ATTRS = {}));
/**
 * The mode of the document.
 *
 * @see {@link https://dom.spec.whatwg.org/#concept-document-limited-quirks}
 */
var DOCUMENT_MODE;
(function (DOCUMENT_MODE) {
    DOCUMENT_MODE["NO_QUIRKS"] = "no-quirks";
    DOCUMENT_MODE["QUIRKS"] = "quirks";
    DOCUMENT_MODE["LIMITED_QUIRKS"] = "limited-quirks";
})(DOCUMENT_MODE || (DOCUMENT_MODE = {}));
var TAG_NAMES;
(function (TAG_NAMES) {
    TAG_NAMES["A"] = "a";
    TAG_NAMES["ADDRESS"] = "address";
    TAG_NAMES["ANNOTATION_XML"] = "annotation-xml";
    TAG_NAMES["APPLET"] = "applet";
    TAG_NAMES["AREA"] = "area";
    TAG_NAMES["ARTICLE"] = "article";
    TAG_NAMES["ASIDE"] = "aside";
    TAG_NAMES["B"] = "b";
    TAG_NAMES["BASE"] = "base";
    TAG_NAMES["BASEFONT"] = "basefont";
    TAG_NAMES["BGSOUND"] = "bgsound";
    TAG_NAMES["BIG"] = "big";
    TAG_NAMES["BLOCKQUOTE"] = "blockquote";
    TAG_NAMES["BODY"] = "body";
    TAG_NAMES["BR"] = "br";
    TAG_NAMES["BUTTON"] = "button";
    TAG_NAMES["CAPTION"] = "caption";
    TAG_NAMES["CENTER"] = "center";
    TAG_NAMES["CODE"] = "code";
    TAG_NAMES["COL"] = "col";
    TAG_NAMES["COLGROUP"] = "colgroup";
    TAG_NAMES["DD"] = "dd";
    TAG_NAMES["DESC"] = "desc";
    TAG_NAMES["DETAILS"] = "details";
    TAG_NAMES["DIALOG"] = "dialog";
    TAG_NAMES["DIR"] = "dir";
    TAG_NAMES["DIV"] = "div";
    TAG_NAMES["DL"] = "dl";
    TAG_NAMES["DT"] = "dt";
    TAG_NAMES["EM"] = "em";
    TAG_NAMES["EMBED"] = "embed";
    TAG_NAMES["FIELDSET"] = "fieldset";
    TAG_NAMES["FIGCAPTION"] = "figcaption";
    TAG_NAMES["FIGURE"] = "figure";
    TAG_NAMES["FONT"] = "font";
    TAG_NAMES["FOOTER"] = "footer";
    TAG_NAMES["FOREIGN_OBJECT"] = "foreignObject";
    TAG_NAMES["FORM"] = "form";
    TAG_NAMES["FRAME"] = "frame";
    TAG_NAMES["FRAMESET"] = "frameset";
    TAG_NAMES["H1"] = "h1";
    TAG_NAMES["H2"] = "h2";
    TAG_NAMES["H3"] = "h3";
    TAG_NAMES["H4"] = "h4";
    TAG_NAMES["H5"] = "h5";
    TAG_NAMES["H6"] = "h6";
    TAG_NAMES["HEAD"] = "head";
    TAG_NAMES["HEADER"] = "header";
    TAG_NAMES["HGROUP"] = "hgroup";
    TAG_NAMES["HR"] = "hr";
    TAG_NAMES["HTML"] = "html";
    TAG_NAMES["I"] = "i";
    TAG_NAMES["IMG"] = "img";
    TAG_NAMES["IMAGE"] = "image";
    TAG_NAMES["INPUT"] = "input";
    TAG_NAMES["IFRAME"] = "iframe";
    TAG_NAMES["KEYGEN"] = "keygen";
    TAG_NAMES["LABEL"] = "label";
    TAG_NAMES["LI"] = "li";
    TAG_NAMES["LINK"] = "link";
    TAG_NAMES["LISTING"] = "listing";
    TAG_NAMES["MAIN"] = "main";
    TAG_NAMES["MALIGNMARK"] = "malignmark";
    TAG_NAMES["MARQUEE"] = "marquee";
    TAG_NAMES["MATH"] = "math";
    TAG_NAMES["MENU"] = "menu";
    TAG_NAMES["META"] = "meta";
    TAG_NAMES["MGLYPH"] = "mglyph";
    TAG_NAMES["MI"] = "mi";
    TAG_NAMES["MO"] = "mo";
    TAG_NAMES["MN"] = "mn";
    TAG_NAMES["MS"] = "ms";
    TAG_NAMES["MTEXT"] = "mtext";
    TAG_NAMES["NAV"] = "nav";
    TAG_NAMES["NOBR"] = "nobr";
    TAG_NAMES["NOFRAMES"] = "noframes";
    TAG_NAMES["NOEMBED"] = "noembed";
    TAG_NAMES["NOSCRIPT"] = "noscript";
    TAG_NAMES["OBJECT"] = "object";
    TAG_NAMES["OL"] = "ol";
    TAG_NAMES["OPTGROUP"] = "optgroup";
    TAG_NAMES["OPTION"] = "option";
    TAG_NAMES["P"] = "p";
    TAG_NAMES["PARAM"] = "param";
    TAG_NAMES["PLAINTEXT"] = "plaintext";
    TAG_NAMES["PRE"] = "pre";
    TAG_NAMES["RB"] = "rb";
    TAG_NAMES["RP"] = "rp";
    TAG_NAMES["RT"] = "rt";
    TAG_NAMES["RTC"] = "rtc";
    TAG_NAMES["RUBY"] = "ruby";
    TAG_NAMES["S"] = "s";
    TAG_NAMES["SCRIPT"] = "script";
    TAG_NAMES["SECTION"] = "section";
    TAG_NAMES["SELECT"] = "select";
    TAG_NAMES["SOURCE"] = "source";
    TAG_NAMES["SMALL"] = "small";
    TAG_NAMES["SPAN"] = "span";
    TAG_NAMES["STRIKE"] = "strike";
    TAG_NAMES["STRONG"] = "strong";
    TAG_NAMES["STYLE"] = "style";
    TAG_NAMES["SUB"] = "sub";
    TAG_NAMES["SUMMARY"] = "summary";
    TAG_NAMES["SUP"] = "sup";
    TAG_NAMES["TABLE"] = "table";
    TAG_NAMES["TBODY"] = "tbody";
    TAG_NAMES["TEMPLATE"] = "template";
    TAG_NAMES["TEXTAREA"] = "textarea";
    TAG_NAMES["TFOOT"] = "tfoot";
    TAG_NAMES["TD"] = "td";
    TAG_NAMES["TH"] = "th";
    TAG_NAMES["THEAD"] = "thead";
    TAG_NAMES["TITLE"] = "title";
    TAG_NAMES["TR"] = "tr";
    TAG_NAMES["TRACK"] = "track";
    TAG_NAMES["TT"] = "tt";
    TAG_NAMES["U"] = "u";
    TAG_NAMES["UL"] = "ul";
    TAG_NAMES["SVG"] = "svg";
    TAG_NAMES["VAR"] = "var";
    TAG_NAMES["WBR"] = "wbr";
    TAG_NAMES["XMP"] = "xmp";
})(TAG_NAMES || (TAG_NAMES = {}));
/**
 * Tag IDs are numeric IDs for known tag names.
 *
 * We use tag IDs to improve the performance of tag name comparisons.
 */
var TAG_ID;
(function (TAG_ID) {
    TAG_ID[TAG_ID["UNKNOWN"] = 0] = "UNKNOWN";
    TAG_ID[TAG_ID["A"] = 1] = "A";
    TAG_ID[TAG_ID["ADDRESS"] = 2] = "ADDRESS";
    TAG_ID[TAG_ID["ANNOTATION_XML"] = 3] = "ANNOTATION_XML";
    TAG_ID[TAG_ID["APPLET"] = 4] = "APPLET";
    TAG_ID[TAG_ID["AREA"] = 5] = "AREA";
    TAG_ID[TAG_ID["ARTICLE"] = 6] = "ARTICLE";
    TAG_ID[TAG_ID["ASIDE"] = 7] = "ASIDE";
    TAG_ID[TAG_ID["B"] = 8] = "B";
    TAG_ID[TAG_ID["BASE"] = 9] = "BASE";
    TAG_ID[TAG_ID["BASEFONT"] = 10] = "BASEFONT";
    TAG_ID[TAG_ID["BGSOUND"] = 11] = "BGSOUND";
    TAG_ID[TAG_ID["BIG"] = 12] = "BIG";
    TAG_ID[TAG_ID["BLOCKQUOTE"] = 13] = "BLOCKQUOTE";
    TAG_ID[TAG_ID["BODY"] = 14] = "BODY";
    TAG_ID[TAG_ID["BR"] = 15] = "BR";
    TAG_ID[TAG_ID["BUTTON"] = 16] = "BUTTON";
    TAG_ID[TAG_ID["CAPTION"] = 17] = "CAPTION";
    TAG_ID[TAG_ID["CENTER"] = 18] = "CENTER";
    TAG_ID[TAG_ID["CODE"] = 19] = "CODE";
    TAG_ID[TAG_ID["COL"] = 20] = "COL";
    TAG_ID[TAG_ID["COLGROUP"] = 21] = "COLGROUP";
    TAG_ID[TAG_ID["DD"] = 22] = "DD";
    TAG_ID[TAG_ID["DESC"] = 23] = "DESC";
    TAG_ID[TAG_ID["DETAILS"] = 24] = "DETAILS";
    TAG_ID[TAG_ID["DIALOG"] = 25] = "DIALOG";
    TAG_ID[TAG_ID["DIR"] = 26] = "DIR";
    TAG_ID[TAG_ID["DIV"] = 27] = "DIV";
    TAG_ID[TAG_ID["DL"] = 28] = "DL";
    TAG_ID[TAG_ID["DT"] = 29] = "DT";
    TAG_ID[TAG_ID["EM"] = 30] = "EM";
    TAG_ID[TAG_ID["EMBED"] = 31] = "EMBED";
    TAG_ID[TAG_ID["FIELDSET"] = 32] = "FIELDSET";
    TAG_ID[TAG_ID["FIGCAPTION"] = 33] = "FIGCAPTION";
    TAG_ID[TAG_ID["FIGURE"] = 34] = "FIGURE";
    TAG_ID[TAG_ID["FONT"] = 35] = "FONT";
    TAG_ID[TAG_ID["FOOTER"] = 36] = "FOOTER";
    TAG_ID[TAG_ID["FOREIGN_OBJECT"] = 37] = "FOREIGN_OBJECT";
    TAG_ID[TAG_ID["FORM"] = 38] = "FORM";
    TAG_ID[TAG_ID["FRAME"] = 39] = "FRAME";
    TAG_ID[TAG_ID["FRAMESET"] = 40] = "FRAMESET";
    TAG_ID[TAG_ID["H1"] = 41] = "H1";
    TAG_ID[TAG_ID["H2"] = 42] = "H2";
    TAG_ID[TAG_ID["H3"] = 43] = "H3";
    TAG_ID[TAG_ID["H4"] = 44] = "H4";
    TAG_ID[TAG_ID["H5"] = 45] = "H5";
    TAG_ID[TAG_ID["H6"] = 46] = "H6";
    TAG_ID[TAG_ID["HEAD"] = 47] = "HEAD";
    TAG_ID[TAG_ID["HEADER"] = 48] = "HEADER";
    TAG_ID[TAG_ID["HGROUP"] = 49] = "HGROUP";
    TAG_ID[TAG_ID["HR"] = 50] = "HR";
    TAG_ID[TAG_ID["HTML"] = 51] = "HTML";
    TAG_ID[TAG_ID["I"] = 52] = "I";
    TAG_ID[TAG_ID["IMG"] = 53] = "IMG";
    TAG_ID[TAG_ID["IMAGE"] = 54] = "IMAGE";
    TAG_ID[TAG_ID["INPUT"] = 55] = "INPUT";
    TAG_ID[TAG_ID["IFRAME"] = 56] = "IFRAME";
    TAG_ID[TAG_ID["KEYGEN"] = 57] = "KEYGEN";
    TAG_ID[TAG_ID["LABEL"] = 58] = "LABEL";
    TAG_ID[TAG_ID["LI"] = 59] = "LI";
    TAG_ID[TAG_ID["LINK"] = 60] = "LINK";
    TAG_ID[TAG_ID["LISTING"] = 61] = "LISTING";
    TAG_ID[TAG_ID["MAIN"] = 62] = "MAIN";
    TAG_ID[TAG_ID["MALIGNMARK"] = 63] = "MALIGNMARK";
    TAG_ID[TAG_ID["MARQUEE"] = 64] = "MARQUEE";
    TAG_ID[TAG_ID["MATH"] = 65] = "MATH";
    TAG_ID[TAG_ID["MENU"] = 66] = "MENU";
    TAG_ID[TAG_ID["META"] = 67] = "META";
    TAG_ID[TAG_ID["MGLYPH"] = 68] = "MGLYPH";
    TAG_ID[TAG_ID["MI"] = 69] = "MI";
    TAG_ID[TAG_ID["MO"] = 70] = "MO";
    TAG_ID[TAG_ID["MN"] = 71] = "MN";
    TAG_ID[TAG_ID["MS"] = 72] = "MS";
    TAG_ID[TAG_ID["MTEXT"] = 73] = "MTEXT";
    TAG_ID[TAG_ID["NAV"] = 74] = "NAV";
    TAG_ID[TAG_ID["NOBR"] = 75] = "NOBR";
    TAG_ID[TAG_ID["NOFRAMES"] = 76] = "NOFRAMES";
    TAG_ID[TAG_ID["NOEMBED"] = 77] = "NOEMBED";
    TAG_ID[TAG_ID["NOSCRIPT"] = 78] = "NOSCRIPT";
    TAG_ID[TAG_ID["OBJECT"] = 79] = "OBJECT";
    TAG_ID[TAG_ID["OL"] = 80] = "OL";
    TAG_ID[TAG_ID["OPTGROUP"] = 81] = "OPTGROUP";
    TAG_ID[TAG_ID["OPTION"] = 82] = "OPTION";
    TAG_ID[TAG_ID["P"] = 83] = "P";
    TAG_ID[TAG_ID["PARAM"] = 84] = "PARAM";
    TAG_ID[TAG_ID["PLAINTEXT"] = 85] = "PLAINTEXT";
    TAG_ID[TAG_ID["PRE"] = 86] = "PRE";
    TAG_ID[TAG_ID["RB"] = 87] = "RB";
    TAG_ID[TAG_ID["RP"] = 88] = "RP";
    TAG_ID[TAG_ID["RT"] = 89] = "RT";
    TAG_ID[TAG_ID["RTC"] = 90] = "RTC";
    TAG_ID[TAG_ID["RUBY"] = 91] = "RUBY";
    TAG_ID[TAG_ID["S"] = 92] = "S";
    TAG_ID[TAG_ID["SCRIPT"] = 93] = "SCRIPT";
    TAG_ID[TAG_ID["SECTION"] = 94] = "SECTION";
    TAG_ID[TAG_ID["SELECT"] = 95] = "SELECT";
    TAG_ID[TAG_ID["SOURCE"] = 96] = "SOURCE";
    TAG_ID[TAG_ID["SMALL"] = 97] = "SMALL";
    TAG_ID[TAG_ID["SPAN"] = 98] = "SPAN";
    TAG_ID[TAG_ID["STRIKE"] = 99] = "STRIKE";
    TAG_ID[TAG_ID["STRONG"] = 100] = "STRONG";
    TAG_ID[TAG_ID["STYLE"] = 101] = "STYLE";
    TAG_ID[TAG_ID["SUB"] = 102] = "SUB";
    TAG_ID[TAG_ID["SUMMARY"] = 103] = "SUMMARY";
    TAG_ID[TAG_ID["SUP"] = 104] = "SUP";
    TAG_ID[TAG_ID["TABLE"] = 105] = "TABLE";
    TAG_ID[TAG_ID["TBODY"] = 106] = "TBODY";
    TAG_ID[TAG_ID["TEMPLATE"] = 107] = "TEMPLATE";
    TAG_ID[TAG_ID["TEXTAREA"] = 108] = "TEXTAREA";
    TAG_ID[TAG_ID["TFOOT"] = 109] = "TFOOT";
    TAG_ID[TAG_ID["TD"] = 110] = "TD";
    TAG_ID[TAG_ID["TH"] = 111] = "TH";
    TAG_ID[TAG_ID["THEAD"] = 112] = "THEAD";
    TAG_ID[TAG_ID["TITLE"] = 113] = "TITLE";
    TAG_ID[TAG_ID["TR"] = 114] = "TR";
    TAG_ID[TAG_ID["TRACK"] = 115] = "TRACK";
    TAG_ID[TAG_ID["TT"] = 116] = "TT";
    TAG_ID[TAG_ID["U"] = 117] = "U";
    TAG_ID[TAG_ID["UL"] = 118] = "UL";
    TAG_ID[TAG_ID["SVG"] = 119] = "SVG";
    TAG_ID[TAG_ID["VAR"] = 120] = "VAR";
    TAG_ID[TAG_ID["WBR"] = 121] = "WBR";
    TAG_ID[TAG_ID["XMP"] = 122] = "XMP";
})(TAG_ID || (TAG_ID = {}));
const TAG_NAME_TO_ID = new Map([
    [TAG_NAMES.A, TAG_ID.A],
    [TAG_NAMES.ADDRESS, TAG_ID.ADDRESS],
    [TAG_NAMES.ANNOTATION_XML, TAG_ID.ANNOTATION_XML],
    [TAG_NAMES.APPLET, TAG_ID.APPLET],
    [TAG_NAMES.AREA, TAG_ID.AREA],
    [TAG_NAMES.ARTICLE, TAG_ID.ARTICLE],
    [TAG_NAMES.ASIDE, TAG_ID.ASIDE],
    [TAG_NAMES.B, TAG_ID.B],
    [TAG_NAMES.BASE, TAG_ID.BASE],
    [TAG_NAMES.BASEFONT, TAG_ID.BASEFONT],
    [TAG_NAMES.BGSOUND, TAG_ID.BGSOUND],
    [TAG_NAMES.BIG, TAG_ID.BIG],
    [TAG_NAMES.BLOCKQUOTE, TAG_ID.BLOCKQUOTE],
    [TAG_NAMES.BODY, TAG_ID.BODY],
    [TAG_NAMES.BR, TAG_ID.BR],
    [TAG_NAMES.BUTTON, TAG_ID.BUTTON],
    [TAG_NAMES.CAPTION, TAG_ID.CAPTION],
    [TAG_NAMES.CENTER, TAG_ID.CENTER],
    [TAG_NAMES.CODE, TAG_ID.CODE],
    [TAG_NAMES.COL, TAG_ID.COL],
    [TAG_NAMES.COLGROUP, TAG_ID.COLGROUP],
    [TAG_NAMES.DD, TAG_ID.DD],
    [TAG_NAMES.DESC, TAG_ID.DESC],
    [TAG_NAMES.DETAILS, TAG_ID.DETAILS],
    [TAG_NAMES.DIALOG, TAG_ID.DIALOG],
    [TAG_NAMES.DIR, TAG_ID.DIR],
    [TAG_NAMES.DIV, TAG_ID.DIV],
    [TAG_NAMES.DL, TAG_ID.DL],
    [TAG_NAMES.DT, TAG_ID.DT],
    [TAG_NAMES.EM, TAG_ID.EM],
    [TAG_NAMES.EMBED, TAG_ID.EMBED],
    [TAG_NAMES.FIELDSET, TAG_ID.FIELDSET],
    [TAG_NAMES.FIGCAPTION, TAG_ID.FIGCAPTION],
    [TAG_NAMES.FIGURE, TAG_ID.FIGURE],
    [TAG_NAMES.FONT, TAG_ID.FONT],
    [TAG_NAMES.FOOTER, TAG_ID.FOOTER],
    [TAG_NAMES.FOREIGN_OBJECT, TAG_ID.FOREIGN_OBJECT],
    [TAG_NAMES.FORM, TAG_ID.FORM],
    [TAG_NAMES.FRAME, TAG_ID.FRAME],
    [TAG_NAMES.FRAMESET, TAG_ID.FRAMESET],
    [TAG_NAMES.H1, TAG_ID.H1],
    [TAG_NAMES.H2, TAG_ID.H2],
    [TAG_NAMES.H3, TAG_ID.H3],
    [TAG_NAMES.H4, TAG_ID.H4],
    [TAG_NAMES.H5, TAG_ID.H5],
    [TAG_NAMES.H6, TAG_ID.H6],
    [TAG_NAMES.HEAD, TAG_ID.HEAD],
    [TAG_NAMES.HEADER, TAG_ID.HEADER],
    [TAG_NAMES.HGROUP, TAG_ID.HGROUP],
    [TAG_NAMES.HR, TAG_ID.HR],
    [TAG_NAMES.HTML, TAG_ID.HTML],
    [TAG_NAMES.I, TAG_ID.I],
    [TAG_NAMES.IMG, TAG_ID.IMG],
    [TAG_NAMES.IMAGE, TAG_ID.IMAGE],
    [TAG_NAMES.INPUT, TAG_ID.INPUT],
    [TAG_NAMES.IFRAME, TAG_ID.IFRAME],
    [TAG_NAMES.KEYGEN, TAG_ID.KEYGEN],
    [TAG_NAMES.LABEL, TAG_ID.LABEL],
    [TAG_NAMES.LI, TAG_ID.LI],
    [TAG_NAMES.LINK, TAG_ID.LINK],
    [TAG_NAMES.LISTING, TAG_ID.LISTING],
    [TAG_NAMES.MAIN, TAG_ID.MAIN],
    [TAG_NAMES.MALIGNMARK, TAG_ID.MALIGNMARK],
    [TAG_NAMES.MARQUEE, TAG_ID.MARQUEE],
    [TAG_NAMES.MATH, TAG_ID.MATH],
    [TAG_NAMES.MENU, TAG_ID.MENU],
    [TAG_NAMES.META, TAG_ID.META],
    [TAG_NAMES.MGLYPH, TAG_ID.MGLYPH],
    [TAG_NAMES.MI, TAG_ID.MI],
    [TAG_NAMES.MO, TAG_ID.MO],
    [TAG_NAMES.MN, TAG_ID.MN],
    [TAG_NAMES.MS, TAG_ID.MS],
    [TAG_NAMES.MTEXT, TAG_ID.MTEXT],
    [TAG_NAMES.NAV, TAG_ID.NAV],
    [TAG_NAMES.NOBR, TAG_ID.NOBR],
    [TAG_NAMES.NOFRAMES, TAG_ID.NOFRAMES],
    [TAG_NAMES.NOEMBED, TAG_ID.NOEMBED],
    [TAG_NAMES.NOSCRIPT, TAG_ID.NOSCRIPT],
    [TAG_NAMES.OBJECT, TAG_ID.OBJECT],
    [TAG_NAMES.OL, TAG_ID.OL],
    [TAG_NAMES.OPTGROUP, TAG_ID.OPTGROUP],
    [TAG_NAMES.OPTION, TAG_ID.OPTION],
    [TAG_NAMES.P, TAG_ID.P],
    [TAG_NAMES.PARAM, TAG_ID.PARAM],
    [TAG_NAMES.PLAINTEXT, TAG_ID.PLAINTEXT],
    [TAG_NAMES.PRE, TAG_ID.PRE],
    [TAG_NAMES.RB, TAG_ID.RB],
    [TAG_NAMES.RP, TAG_ID.RP],
    [TAG_NAMES.RT, TAG_ID.RT],
    [TAG_NAMES.RTC, TAG_ID.RTC],
    [TAG_NAMES.RUBY, TAG_ID.RUBY],
    [TAG_NAMES.S, TAG_ID.S],
    [TAG_NAMES.SCRIPT, TAG_ID.SCRIPT],
    [TAG_NAMES.SECTION, TAG_ID.SECTION],
    [TAG_NAMES.SELECT, TAG_ID.SELECT],
    [TAG_NAMES.SOURCE, TAG_ID.SOURCE],
    [TAG_NAMES.SMALL, TAG_ID.SMALL],
    [TAG_NAMES.SPAN, TAG_ID.SPAN],
    [TAG_NAMES.STRIKE, TAG_ID.STRIKE],
    [TAG_NAMES.STRONG, TAG_ID.STRONG],
    [TAG_NAMES.STYLE, TAG_ID.STYLE],
    [TAG_NAMES.SUB, TAG_ID.SUB],
    [TAG_NAMES.SUMMARY, TAG_ID.SUMMARY],
    [TAG_NAMES.SUP, TAG_ID.SUP],
    [TAG_NAMES.TABLE, TAG_ID.TABLE],
    [TAG_NAMES.TBODY, TAG_ID.TBODY],
    [TAG_NAMES.TEMPLATE, TAG_ID.TEMPLATE],
    [TAG_NAMES.TEXTAREA, TAG_ID.TEXTAREA],
    [TAG_NAMES.TFOOT, TAG_ID.TFOOT],
    [TAG_NAMES.TD, TAG_ID.TD],
    [TAG_NAMES.TH, TAG_ID.TH],
    [TAG_NAMES.THEAD, TAG_ID.THEAD],
    [TAG_NAMES.TITLE, TAG_ID.TITLE],
    [TAG_NAMES.TR, TAG_ID.TR],
    [TAG_NAMES.TRACK, TAG_ID.TRACK],
    [TAG_NAMES.TT, TAG_ID.TT],
    [TAG_NAMES.U, TAG_ID.U],
    [TAG_NAMES.UL, TAG_ID.UL],
    [TAG_NAMES.SVG, TAG_ID.SVG],
    [TAG_NAMES.VAR, TAG_ID.VAR],
    [TAG_NAMES.WBR, TAG_ID.WBR],
    [TAG_NAMES.XMP, TAG_ID.XMP],
]);
function getTagID(tagName) {
    var _a;
    return (_a = TAG_NAME_TO_ID.get(tagName)) !== null && _a !== void 0 ? _a : TAG_ID.UNKNOWN;
}
const $ = TAG_ID;
const SPECIAL_ELEMENTS = {
    [NS.HTML]: new Set([
        $.ADDRESS,
        $.APPLET,
        $.AREA,
        $.ARTICLE,
        $.ASIDE,
        $.BASE,
        $.BASEFONT,
        $.BGSOUND,
        $.BLOCKQUOTE,
        $.BODY,
        $.BR,
        $.BUTTON,
        $.CAPTION,
        $.CENTER,
        $.COL,
        $.COLGROUP,
        $.DD,
        $.DETAILS,
        $.DIR,
        $.DIV,
        $.DL,
        $.DT,
        $.EMBED,
        $.FIELDSET,
        $.FIGCAPTION,
        $.FIGURE,
        $.FOOTER,
        $.FORM,
        $.FRAME,
        $.FRAMESET,
        $.H1,
        $.H2,
        $.H3,
        $.H4,
        $.H5,
        $.H6,
        $.HEAD,
        $.HEADER,
        $.HGROUP,
        $.HR,
        $.HTML,
        $.IFRAME,
        $.IMG,
        $.INPUT,
        $.LI,
        $.LINK,
        $.LISTING,
        $.MAIN,
        $.MARQUEE,
        $.MENU,
        $.META,
        $.NAV,
        $.NOEMBED,
        $.NOFRAMES,
        $.NOSCRIPT,
        $.OBJECT,
        $.OL,
        $.P,
        $.PARAM,
        $.PLAINTEXT,
        $.PRE,
        $.SCRIPT,
        $.SECTION,
        $.SELECT,
        $.SOURCE,
        $.STYLE,
        $.SUMMARY,
        $.TABLE,
        $.TBODY,
        $.TD,
        $.TEMPLATE,
        $.TEXTAREA,
        $.TFOOT,
        $.TH,
        $.THEAD,
        $.TITLE,
        $.TR,
        $.TRACK,
        $.UL,
        $.WBR,
        $.XMP,
    ]),
    [NS.MATHML]: new Set([$.MI, $.MO, $.MN, $.MS, $.MTEXT, $.ANNOTATION_XML]),
    [NS.SVG]: new Set([$.TITLE, $.FOREIGN_OBJECT, $.DESC]),
    [NS.XLINK]: new Set(),
    [NS.XML]: new Set(),
    [NS.XMLNS]: new Set(),
};
function isNumberedHeader(tn) {
    return tn === $.H1 || tn === $.H2 || tn === $.H3 || tn === $.H4 || tn === $.H5 || tn === $.H6;
}
const UNESCAPED_TEXT = new Set([
    TAG_NAMES.STYLE,
    TAG_NAMES.SCRIPT,
    TAG_NAMES.XMP,
    TAG_NAMES.IFRAME,
    TAG_NAMES.NOEMBED,
    TAG_NAMES.NOFRAMES,
    TAG_NAMES.PLAINTEXT,
]);
function hasUnescapedText(tn, scriptingEnabled) {
    return UNESCAPED_TEXT.has(tn) || (scriptingEnabled && tn === TAG_NAMES.NOSCRIPT);
}
//# sourceMappingURL=html.js.map

/***/ }),
/* 38 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OpenElementStack": () => (/* binding */ OpenElementStack)
/* harmony export */ });
/* harmony import */ var _common_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(37);

//Element utils
const IMPLICIT_END_TAG_REQUIRED = new Set([_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.DD, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.DT, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.LI, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.OPTGROUP, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.OPTION, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.P, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.RB, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.RP, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.RT, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.RTC]);
const IMPLICIT_END_TAG_REQUIRED_THOROUGHLY = new Set([
    ...IMPLICIT_END_TAG_REQUIRED,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.CAPTION,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.COLGROUP,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TBODY,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TD,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TFOOT,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TH,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.THEAD,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TR,
]);
const SCOPING_ELEMENT_NS = new Map([
    [_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.APPLET, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML],
    [_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.CAPTION, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML],
    [_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.HTML, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML],
    [_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.MARQUEE, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML],
    [_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.OBJECT, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML],
    [_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TABLE, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML],
    [_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TD, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML],
    [_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TEMPLATE, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML],
    [_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TH, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML],
    [_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.ANNOTATION_XML, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.MATHML],
    [_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.MI, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.MATHML],
    [_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.MN, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.MATHML],
    [_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.MO, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.MATHML],
    [_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.MS, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.MATHML],
    [_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.MTEXT, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.MATHML],
    [_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.DESC, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.SVG],
    [_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.FOREIGN_OBJECT, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.SVG],
    [_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TITLE, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.SVG],
]);
const NAMED_HEADERS = [_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.H1, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.H2, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.H3, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.H4, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.H5, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.H6];
const TABLE_ROW_CONTEXT = [_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TR, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TEMPLATE, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.HTML];
const TABLE_BODY_CONTEXT = [_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TBODY, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TFOOT, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.THEAD, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TEMPLATE, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.HTML];
const TABLE_CONTEXT = [_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TABLE, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TEMPLATE, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.HTML];
const TABLE_CELLS = [_common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TD, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TH];
//Stack of open elements
class OpenElementStack {
    constructor(document, treeAdapter, handler) {
        this.treeAdapter = treeAdapter;
        this.handler = handler;
        this.items = [];
        this.tagIDs = [];
        this.stackTop = -1;
        this.tmplCount = 0;
        this.currentTagId = _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.UNKNOWN;
        this.current = document;
    }
    get currentTmplContentOrNode() {
        return this._isInTemplate() ? this.treeAdapter.getTemplateContent(this.current) : this.current;
    }
    //Index of element
    _indexOf(element) {
        return this.items.lastIndexOf(element, this.stackTop);
    }
    //Update current element
    _isInTemplate() {
        return this.currentTagId === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TEMPLATE && this.treeAdapter.getNamespaceURI(this.current) === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML;
    }
    _updateCurrentElement() {
        this.current = this.items[this.stackTop];
        this.currentTagId = this.tagIDs[this.stackTop];
    }
    //Mutations
    push(element, tagID) {
        this.stackTop++;
        this.items[this.stackTop] = element;
        this.current = element;
        this.tagIDs[this.stackTop] = tagID;
        this.currentTagId = tagID;
        if (this._isInTemplate()) {
            this.tmplCount++;
        }
        this.handler.onItemPush(element, tagID, true);
    }
    pop() {
        const popped = this.current;
        if (this.tmplCount > 0 && this._isInTemplate()) {
            this.tmplCount--;
        }
        this.stackTop--;
        this._updateCurrentElement();
        this.handler.onItemPop(popped, true);
    }
    replace(oldElement, newElement) {
        const idx = this._indexOf(oldElement);
        this.items[idx] = newElement;
        if (idx === this.stackTop) {
            this.current = newElement;
        }
    }
    insertAfter(referenceElement, newElement, newElementID) {
        const insertionIdx = this._indexOf(referenceElement) + 1;
        this.items.splice(insertionIdx, 0, newElement);
        this.tagIDs.splice(insertionIdx, 0, newElementID);
        this.stackTop++;
        if (insertionIdx === this.stackTop) {
            this._updateCurrentElement();
        }
        this.handler.onItemPush(this.current, this.currentTagId, insertionIdx === this.stackTop);
    }
    popUntilTagNamePopped(tagName) {
        let targetIdx = this.stackTop + 1;
        do {
            targetIdx = this.tagIDs.lastIndexOf(tagName, targetIdx - 1);
        } while (targetIdx > 0 && this.treeAdapter.getNamespaceURI(this.items[targetIdx]) !== _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML);
        this.shortenToLength(targetIdx < 0 ? 0 : targetIdx);
    }
    shortenToLength(idx) {
        while (this.stackTop >= idx) {
            const popped = this.current;
            if (this.tmplCount > 0 && this._isInTemplate()) {
                this.tmplCount -= 1;
            }
            this.stackTop--;
            this._updateCurrentElement();
            this.handler.onItemPop(popped, this.stackTop < idx);
        }
    }
    popUntilElementPopped(element) {
        const idx = this._indexOf(element);
        this.shortenToLength(idx < 0 ? 0 : idx);
    }
    popUntilPopped(tagNames, targetNS) {
        const idx = this._indexOfTagNames(tagNames, targetNS);
        this.shortenToLength(idx < 0 ? 0 : idx);
    }
    popUntilNumberedHeaderPopped() {
        this.popUntilPopped(NAMED_HEADERS, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML);
    }
    popUntilTableCellPopped() {
        this.popUntilPopped(TABLE_CELLS, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML);
    }
    popAllUpToHtmlElement() {
        //NOTE: here we assume that the root <html> element is always first in the open element stack, so
        //we perform this fast stack clean up.
        this.tmplCount = 0;
        this.shortenToLength(1);
    }
    _indexOfTagNames(tagNames, namespace) {
        for (let i = this.stackTop; i >= 0; i--) {
            if (tagNames.includes(this.tagIDs[i]) && this.treeAdapter.getNamespaceURI(this.items[i]) === namespace) {
                return i;
            }
        }
        return -1;
    }
    clearBackTo(tagNames, targetNS) {
        const idx = this._indexOfTagNames(tagNames, targetNS);
        this.shortenToLength(idx + 1);
    }
    clearBackToTableContext() {
        this.clearBackTo(TABLE_CONTEXT, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML);
    }
    clearBackToTableBodyContext() {
        this.clearBackTo(TABLE_BODY_CONTEXT, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML);
    }
    clearBackToTableRowContext() {
        this.clearBackTo(TABLE_ROW_CONTEXT, _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML);
    }
    remove(element) {
        const idx = this._indexOf(element);
        if (idx >= 0) {
            if (idx === this.stackTop) {
                this.pop();
            }
            else {
                this.items.splice(idx, 1);
                this.tagIDs.splice(idx, 1);
                this.stackTop--;
                this._updateCurrentElement();
                this.handler.onItemPop(element, false);
            }
        }
    }
    //Search
    tryPeekProperlyNestedBodyElement() {
        //Properly nested <body> element (should be second element in stack).
        return this.stackTop >= 1 && this.tagIDs[1] === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.BODY ? this.items[1] : null;
    }
    contains(element) {
        return this._indexOf(element) > -1;
    }
    getCommonAncestor(element) {
        const elementIdx = this._indexOf(element) - 1;
        return elementIdx >= 0 ? this.items[elementIdx] : null;
    }
    isRootHtmlElementCurrent() {
        return this.stackTop === 0 && this.tagIDs[0] === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.HTML;
    }
    //Element in scope
    hasInScope(tagName) {
        for (let i = this.stackTop; i >= 0; i--) {
            const tn = this.tagIDs[i];
            const ns = this.treeAdapter.getNamespaceURI(this.items[i]);
            if (tn === tagName && ns === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML) {
                return true;
            }
            if (SCOPING_ELEMENT_NS.get(tn) === ns) {
                return false;
            }
        }
        return true;
    }
    hasNumberedHeaderInScope() {
        for (let i = this.stackTop; i >= 0; i--) {
            const tn = this.tagIDs[i];
            const ns = this.treeAdapter.getNamespaceURI(this.items[i]);
            if ((0,_common_html_js__WEBPACK_IMPORTED_MODULE_0__.isNumberedHeader)(tn) && ns === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML) {
                return true;
            }
            if (SCOPING_ELEMENT_NS.get(tn) === ns) {
                return false;
            }
        }
        return true;
    }
    hasInListItemScope(tagName) {
        for (let i = this.stackTop; i >= 0; i--) {
            const tn = this.tagIDs[i];
            const ns = this.treeAdapter.getNamespaceURI(this.items[i]);
            if (tn === tagName && ns === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML) {
                return true;
            }
            if (((tn === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.UL || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.OL) && ns === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML) || SCOPING_ELEMENT_NS.get(tn) === ns) {
                return false;
            }
        }
        return true;
    }
    hasInButtonScope(tagName) {
        for (let i = this.stackTop; i >= 0; i--) {
            const tn = this.tagIDs[i];
            const ns = this.treeAdapter.getNamespaceURI(this.items[i]);
            if (tn === tagName && ns === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML) {
                return true;
            }
            if ((tn === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.BUTTON && ns === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML) || SCOPING_ELEMENT_NS.get(tn) === ns) {
                return false;
            }
        }
        return true;
    }
    hasInTableScope(tagName) {
        for (let i = this.stackTop; i >= 0; i--) {
            const tn = this.tagIDs[i];
            const ns = this.treeAdapter.getNamespaceURI(this.items[i]);
            if (ns !== _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML) {
                continue;
            }
            if (tn === tagName) {
                return true;
            }
            if (tn === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TABLE || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TEMPLATE || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.HTML) {
                return false;
            }
        }
        return true;
    }
    hasTableBodyContextInTableScope() {
        for (let i = this.stackTop; i >= 0; i--) {
            const tn = this.tagIDs[i];
            const ns = this.treeAdapter.getNamespaceURI(this.items[i]);
            if (ns !== _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML) {
                continue;
            }
            if (tn === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TBODY || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.THEAD || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TFOOT) {
                return true;
            }
            if (tn === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TABLE || tn === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.HTML) {
                return false;
            }
        }
        return true;
    }
    hasInSelectScope(tagName) {
        for (let i = this.stackTop; i >= 0; i--) {
            const tn = this.tagIDs[i];
            const ns = this.treeAdapter.getNamespaceURI(this.items[i]);
            if (ns !== _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML) {
                continue;
            }
            if (tn === tagName) {
                return true;
            }
            if (tn !== _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.OPTION && tn !== _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.OPTGROUP) {
                return false;
            }
        }
        return true;
    }
    //Implied end tags
    generateImpliedEndTags() {
        while (IMPLICIT_END_TAG_REQUIRED.has(this.currentTagId)) {
            this.pop();
        }
    }
    generateImpliedEndTagsThoroughly() {
        while (IMPLICIT_END_TAG_REQUIRED_THOROUGHLY.has(this.currentTagId)) {
            this.pop();
        }
    }
    generateImpliedEndTagsWithExclusion(exclusionId) {
        while (this.currentTagId !== exclusionId && IMPLICIT_END_TAG_REQUIRED_THOROUGHLY.has(this.currentTagId)) {
            this.pop();
        }
    }
}
//# sourceMappingURL=open-element-stack.js.map

/***/ }),
/* 39 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EntryType": () => (/* binding */ EntryType),
/* harmony export */   "FormattingElementList": () => (/* binding */ FormattingElementList)
/* harmony export */ });
//Const
const NOAH_ARK_CAPACITY = 3;
var EntryType;
(function (EntryType) {
    EntryType[EntryType["Marker"] = 0] = "Marker";
    EntryType[EntryType["Element"] = 1] = "Element";
})(EntryType || (EntryType = {}));
const MARKER = { type: EntryType.Marker };
//List of formatting elements
class FormattingElementList {
    constructor(treeAdapter) {
        this.treeAdapter = treeAdapter;
        this.entries = [];
        this.bookmark = null;
    }
    //Noah Ark's condition
    //OPTIMIZATION: at first we try to find possible candidates for exclusion using
    //lightweight heuristics without thorough attributes check.
    _getNoahArkConditionCandidates(newElement, neAttrs) {
        const candidates = [];
        const neAttrsLength = neAttrs.length;
        const neTagName = this.treeAdapter.getTagName(newElement);
        const neNamespaceURI = this.treeAdapter.getNamespaceURI(newElement);
        for (let i = 0; i < this.entries.length; i++) {
            const entry = this.entries[i];
            if (entry.type === EntryType.Marker) {
                break;
            }
            const { element } = entry;
            if (this.treeAdapter.getTagName(element) === neTagName &&
                this.treeAdapter.getNamespaceURI(element) === neNamespaceURI) {
                const elementAttrs = this.treeAdapter.getAttrList(element);
                if (elementAttrs.length === neAttrsLength) {
                    candidates.push({ idx: i, attrs: elementAttrs });
                }
            }
        }
        return candidates;
    }
    _ensureNoahArkCondition(newElement) {
        if (this.entries.length < NOAH_ARK_CAPACITY)
            return;
        const neAttrs = this.treeAdapter.getAttrList(newElement);
        const candidates = this._getNoahArkConditionCandidates(newElement, neAttrs);
        if (candidates.length < NOAH_ARK_CAPACITY)
            return;
        //NOTE: build attrs map for the new element, so we can perform fast lookups
        const neAttrsMap = new Map(neAttrs.map((neAttr) => [neAttr.name, neAttr.value]));
        let validCandidates = 0;
        //NOTE: remove bottommost candidates, until Noah's Ark condition will not be met
        for (let i = 0; i < candidates.length; i++) {
            const candidate = candidates[i];
            // We know that `candidate.attrs.length === neAttrs.length`
            if (candidate.attrs.every((cAttr) => neAttrsMap.get(cAttr.name) === cAttr.value)) {
                validCandidates += 1;
                if (validCandidates >= NOAH_ARK_CAPACITY) {
                    this.entries.splice(candidate.idx, 1);
                }
            }
        }
    }
    //Mutations
    insertMarker() {
        this.entries.unshift(MARKER);
    }
    pushElement(element, token) {
        this._ensureNoahArkCondition(element);
        this.entries.unshift({
            type: EntryType.Element,
            element,
            token,
        });
    }
    insertElementAfterBookmark(element, token) {
        const bookmarkIdx = this.entries.indexOf(this.bookmark);
        this.entries.splice(bookmarkIdx, 0, {
            type: EntryType.Element,
            element,
            token,
        });
    }
    removeEntry(entry) {
        const entryIndex = this.entries.indexOf(entry);
        if (entryIndex >= 0) {
            this.entries.splice(entryIndex, 1);
        }
    }
    clearToLastMarker() {
        const markerIdx = this.entries.indexOf(MARKER);
        if (markerIdx >= 0) {
            this.entries.splice(0, markerIdx + 1);
        }
        else {
            this.entries.length = 0;
        }
    }
    //Search
    getElementEntryInScopeWithTagName(tagName) {
        const entry = this.entries.find((entry) => entry.type === EntryType.Marker || this.treeAdapter.getTagName(entry.element) === tagName);
        return entry && entry.type === EntryType.Element ? entry : null;
    }
    getElementEntry(element) {
        return this.entries.find((entry) => entry.type === EntryType.Element && entry.element === element);
    }
}
//# sourceMappingURL=formatting-element-list.js.map

/***/ }),
/* 40 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NodeType": () => (/* binding */ NodeType),
/* harmony export */   "defaultTreeAdapter": () => (/* binding */ defaultTreeAdapter)
/* harmony export */ });
/* harmony import */ var _common_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(37);

var NodeType;
(function (NodeType) {
    NodeType["Document"] = "#document";
    NodeType["DocumentFragment"] = "#document-fragment";
    NodeType["Comment"] = "#comment";
    NodeType["Text"] = "#text";
    NodeType["DocumentType"] = "#documentType";
})(NodeType || (NodeType = {}));
function createTextNode(value) {
    return {
        nodeName: NodeType.Text,
        value,
        parentNode: null,
    };
}
const defaultTreeAdapter = {
    //Node construction
    createDocument() {
        return {
            nodeName: NodeType.Document,
            mode: _common_html_js__WEBPACK_IMPORTED_MODULE_0__.DOCUMENT_MODE.NO_QUIRKS,
            childNodes: [],
        };
    },
    createDocumentFragment() {
        return {
            nodeName: NodeType.DocumentFragment,
            childNodes: [],
        };
    },
    createElement(tagName, namespaceURI, attrs) {
        return {
            nodeName: tagName,
            tagName,
            attrs,
            namespaceURI,
            childNodes: [],
            parentNode: null,
        };
    },
    createCommentNode(data) {
        return {
            nodeName: NodeType.Comment,
            data,
            parentNode: null,
        };
    },
    //Tree mutation
    appendChild(parentNode, newNode) {
        parentNode.childNodes.push(newNode);
        newNode.parentNode = parentNode;
    },
    insertBefore(parentNode, newNode, referenceNode) {
        const insertionIdx = parentNode.childNodes.indexOf(referenceNode);
        parentNode.childNodes.splice(insertionIdx, 0, newNode);
        newNode.parentNode = parentNode;
    },
    setTemplateContent(templateElement, contentElement) {
        templateElement.content = contentElement;
    },
    getTemplateContent(templateElement) {
        return templateElement.content;
    },
    setDocumentType(document, name, publicId, systemId) {
        const doctypeNode = document.childNodes.find((node) => node.nodeName === NodeType.DocumentType);
        if (doctypeNode) {
            doctypeNode.name = name;
            doctypeNode.publicId = publicId;
            doctypeNode.systemId = systemId;
        }
        else {
            const node = {
                nodeName: NodeType.DocumentType,
                name,
                publicId,
                systemId,
                parentNode: null,
            };
            defaultTreeAdapter.appendChild(document, node);
        }
    },
    setDocumentMode(document, mode) {
        document.mode = mode;
    },
    getDocumentMode(document) {
        return document.mode;
    },
    detachNode(node) {
        if (node.parentNode) {
            const idx = node.parentNode.childNodes.indexOf(node);
            node.parentNode.childNodes.splice(idx, 1);
            node.parentNode = null;
        }
    },
    insertText(parentNode, text) {
        if (parentNode.childNodes.length > 0) {
            const prevNode = parentNode.childNodes[parentNode.childNodes.length - 1];
            if (defaultTreeAdapter.isTextNode(prevNode)) {
                prevNode.value += text;
                return;
            }
        }
        defaultTreeAdapter.appendChild(parentNode, createTextNode(text));
    },
    insertTextBefore(parentNode, text, referenceNode) {
        const prevNode = parentNode.childNodes[parentNode.childNodes.indexOf(referenceNode) - 1];
        if (prevNode && defaultTreeAdapter.isTextNode(prevNode)) {
            prevNode.value += text;
        }
        else {
            defaultTreeAdapter.insertBefore(parentNode, createTextNode(text), referenceNode);
        }
    },
    adoptAttributes(recipient, attrs) {
        const recipientAttrsMap = new Set(recipient.attrs.map((attr) => attr.name));
        for (let j = 0; j < attrs.length; j++) {
            if (!recipientAttrsMap.has(attrs[j].name)) {
                recipient.attrs.push(attrs[j]);
            }
        }
    },
    //Tree traversing
    getFirstChild(node) {
        return node.childNodes[0];
    },
    getChildNodes(node) {
        return node.childNodes;
    },
    getParentNode(node) {
        return node.parentNode;
    },
    getAttrList(element) {
        return element.attrs;
    },
    //Node data
    getTagName(element) {
        return element.tagName;
    },
    getNamespaceURI(element) {
        return element.namespaceURI;
    },
    getTextNodeContent(textNode) {
        return textNode.value;
    },
    getCommentNodeContent(commentNode) {
        return commentNode.data;
    },
    getDocumentTypeNodeName(doctypeNode) {
        return doctypeNode.name;
    },
    getDocumentTypeNodePublicId(doctypeNode) {
        return doctypeNode.publicId;
    },
    getDocumentTypeNodeSystemId(doctypeNode) {
        return doctypeNode.systemId;
    },
    //Node types
    isTextNode(node) {
        return node.nodeName === '#text';
    },
    isCommentNode(node) {
        return node.nodeName === '#comment';
    },
    isDocumentTypeNode(node) {
        return node.nodeName === NodeType.DocumentType;
    },
    isElementNode(node) {
        return Object.prototype.hasOwnProperty.call(node, 'tagName');
    },
    // Source code location
    setNodeSourceCodeLocation(node, location) {
        node.sourceCodeLocation = location;
    },
    getNodeSourceCodeLocation(node) {
        return node.sourceCodeLocation;
    },
    updateNodeSourceCodeLocation(node, endLocation) {
        node.sourceCodeLocation = { ...node.sourceCodeLocation, ...endLocation };
    },
};
//# sourceMappingURL=default.js.map

/***/ }),
/* 41 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getDocumentMode": () => (/* binding */ getDocumentMode),
/* harmony export */   "isConforming": () => (/* binding */ isConforming)
/* harmony export */ });
/* harmony import */ var _html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(37);

//Const
const VALID_DOCTYPE_NAME = 'html';
const VALID_SYSTEM_ID = 'about:legacy-compat';
const QUIRKS_MODE_SYSTEM_ID = 'http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd';
const QUIRKS_MODE_PUBLIC_ID_PREFIXES = [
    '+//silmaril//dtd html pro v0r11 19970101//',
    '-//as//dtd html 3.0 aswedit + extensions//',
    '-//advasoft ltd//dtd html 3.0 aswedit + extensions//',
    '-//ietf//dtd html 2.0 level 1//',
    '-//ietf//dtd html 2.0 level 2//',
    '-//ietf//dtd html 2.0 strict level 1//',
    '-//ietf//dtd html 2.0 strict level 2//',
    '-//ietf//dtd html 2.0 strict//',
    '-//ietf//dtd html 2.0//',
    '-//ietf//dtd html 2.1e//',
    '-//ietf//dtd html 3.0//',
    '-//ietf//dtd html 3.2 final//',
    '-//ietf//dtd html 3.2//',
    '-//ietf//dtd html 3//',
    '-//ietf//dtd html level 0//',
    '-//ietf//dtd html level 1//',
    '-//ietf//dtd html level 2//',
    '-//ietf//dtd html level 3//',
    '-//ietf//dtd html strict level 0//',
    '-//ietf//dtd html strict level 1//',
    '-//ietf//dtd html strict level 2//',
    '-//ietf//dtd html strict level 3//',
    '-//ietf//dtd html strict//',
    '-//ietf//dtd html//',
    '-//metrius//dtd metrius presentational//',
    '-//microsoft//dtd internet explorer 2.0 html strict//',
    '-//microsoft//dtd internet explorer 2.0 html//',
    '-//microsoft//dtd internet explorer 2.0 tables//',
    '-//microsoft//dtd internet explorer 3.0 html strict//',
    '-//microsoft//dtd internet explorer 3.0 html//',
    '-//microsoft//dtd internet explorer 3.0 tables//',
    '-//netscape comm. corp.//dtd html//',
    '-//netscape comm. corp.//dtd strict html//',
    "-//o'reilly and associates//dtd html 2.0//",
    "-//o'reilly and associates//dtd html extended 1.0//",
    "-//o'reilly and associates//dtd html extended relaxed 1.0//",
    '-//sq//dtd html 2.0 hotmetal + extensions//',
    '-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//',
    '-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//',
    '-//spyglass//dtd html 2.0 extended//',
    '-//sun microsystems corp.//dtd hotjava html//',
    '-//sun microsystems corp.//dtd hotjava strict html//',
    '-//w3c//dtd html 3 1995-03-24//',
    '-//w3c//dtd html 3.2 draft//',
    '-//w3c//dtd html 3.2 final//',
    '-//w3c//dtd html 3.2//',
    '-//w3c//dtd html 3.2s draft//',
    '-//w3c//dtd html 4.0 frameset//',
    '-//w3c//dtd html 4.0 transitional//',
    '-//w3c//dtd html experimental 19960712//',
    '-//w3c//dtd html experimental 970421//',
    '-//w3c//dtd w3 html//',
    '-//w3o//dtd w3 html 3.0//',
    '-//webtechs//dtd mozilla html 2.0//',
    '-//webtechs//dtd mozilla html//',
];
const QUIRKS_MODE_NO_SYSTEM_ID_PUBLIC_ID_PREFIXES = [
    ...QUIRKS_MODE_PUBLIC_ID_PREFIXES,
    '-//w3c//dtd html 4.01 frameset//',
    '-//w3c//dtd html 4.01 transitional//',
];
const QUIRKS_MODE_PUBLIC_IDS = new Set([
    '-//w3o//dtd w3 html strict 3.0//en//',
    '-/w3c/dtd html 4.0 transitional/en',
    'html',
]);
const LIMITED_QUIRKS_PUBLIC_ID_PREFIXES = ['-//w3c//dtd xhtml 1.0 frameset//', '-//w3c//dtd xhtml 1.0 transitional//'];
const LIMITED_QUIRKS_WITH_SYSTEM_ID_PUBLIC_ID_PREFIXES = [
    ...LIMITED_QUIRKS_PUBLIC_ID_PREFIXES,
    '-//w3c//dtd html 4.01 frameset//',
    '-//w3c//dtd html 4.01 transitional//',
];
//Utils
function hasPrefix(publicId, prefixes) {
    return prefixes.some((prefix) => publicId.startsWith(prefix));
}
//API
function isConforming(token) {
    return (token.name === VALID_DOCTYPE_NAME &&
        token.publicId === null &&
        (token.systemId === null || token.systemId === VALID_SYSTEM_ID));
}
function getDocumentMode(token) {
    if (token.name !== VALID_DOCTYPE_NAME) {
        return _html_js__WEBPACK_IMPORTED_MODULE_0__.DOCUMENT_MODE.QUIRKS;
    }
    const { systemId } = token;
    if (systemId && systemId.toLowerCase() === QUIRKS_MODE_SYSTEM_ID) {
        return _html_js__WEBPACK_IMPORTED_MODULE_0__.DOCUMENT_MODE.QUIRKS;
    }
    let { publicId } = token;
    if (publicId !== null) {
        publicId = publicId.toLowerCase();
        if (QUIRKS_MODE_PUBLIC_IDS.has(publicId)) {
            return _html_js__WEBPACK_IMPORTED_MODULE_0__.DOCUMENT_MODE.QUIRKS;
        }
        let prefixes = systemId === null ? QUIRKS_MODE_NO_SYSTEM_ID_PUBLIC_ID_PREFIXES : QUIRKS_MODE_PUBLIC_ID_PREFIXES;
        if (hasPrefix(publicId, prefixes)) {
            return _html_js__WEBPACK_IMPORTED_MODULE_0__.DOCUMENT_MODE.QUIRKS;
        }
        prefixes =
            systemId === null ? LIMITED_QUIRKS_PUBLIC_ID_PREFIXES : LIMITED_QUIRKS_WITH_SYSTEM_ID_PUBLIC_ID_PREFIXES;
        if (hasPrefix(publicId, prefixes)) {
            return _html_js__WEBPACK_IMPORTED_MODULE_0__.DOCUMENT_MODE.LIMITED_QUIRKS;
        }
    }
    return _html_js__WEBPACK_IMPORTED_MODULE_0__.DOCUMENT_MODE.NO_QUIRKS;
}
//# sourceMappingURL=doctype.js.map

/***/ }),
/* 42 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SVG_TAG_NAMES_ADJUSTMENT_MAP": () => (/* binding */ SVG_TAG_NAMES_ADJUSTMENT_MAP),
/* harmony export */   "adjustTokenMathMLAttrs": () => (/* binding */ adjustTokenMathMLAttrs),
/* harmony export */   "adjustTokenSVGAttrs": () => (/* binding */ adjustTokenSVGAttrs),
/* harmony export */   "adjustTokenSVGTagName": () => (/* binding */ adjustTokenSVGTagName),
/* harmony export */   "adjustTokenXMLAttrs": () => (/* binding */ adjustTokenXMLAttrs),
/* harmony export */   "causesExit": () => (/* binding */ causesExit),
/* harmony export */   "isIntegrationPoint": () => (/* binding */ isIntegrationPoint)
/* harmony export */ });
/* harmony import */ var _html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(37);

//MIME types
const MIME_TYPES = {
    TEXT_HTML: 'text/html',
    APPLICATION_XML: 'application/xhtml+xml',
};
//Attributes
const DEFINITION_URL_ATTR = 'definitionurl';
const ADJUSTED_DEFINITION_URL_ATTR = 'definitionURL';
const SVG_ATTRS_ADJUSTMENT_MAP = new Map([
    'attributeName',
    'attributeType',
    'baseFrequency',
    'baseProfile',
    'calcMode',
    'clipPathUnits',
    'diffuseConstant',
    'edgeMode',
    'filterUnits',
    'glyphRef',
    'gradientTransform',
    'gradientUnits',
    'kernelMatrix',
    'kernelUnitLength',
    'keyPoints',
    'keySplines',
    'keyTimes',
    'lengthAdjust',
    'limitingConeAngle',
    'markerHeight',
    'markerUnits',
    'markerWidth',
    'maskContentUnits',
    'maskUnits',
    'numOctaves',
    'pathLength',
    'patternContentUnits',
    'patternTransform',
    'patternUnits',
    'pointsAtX',
    'pointsAtY',
    'pointsAtZ',
    'preserveAlpha',
    'preserveAspectRatio',
    'primitiveUnits',
    'refX',
    'refY',
    'repeatCount',
    'repeatDur',
    'requiredExtensions',
    'requiredFeatures',
    'specularConstant',
    'specularExponent',
    'spreadMethod',
    'startOffset',
    'stdDeviation',
    'stitchTiles',
    'surfaceScale',
    'systemLanguage',
    'tableValues',
    'targetX',
    'targetY',
    'textLength',
    'viewBox',
    'viewTarget',
    'xChannelSelector',
    'yChannelSelector',
    'zoomAndPan',
].map((attr) => [attr.toLowerCase(), attr]));
const XML_ATTRS_ADJUSTMENT_MAP = new Map([
    ['xlink:actuate', { prefix: 'xlink', name: 'actuate', namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XLINK }],
    ['xlink:arcrole', { prefix: 'xlink', name: 'arcrole', namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XLINK }],
    ['xlink:href', { prefix: 'xlink', name: 'href', namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XLINK }],
    ['xlink:role', { prefix: 'xlink', name: 'role', namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XLINK }],
    ['xlink:show', { prefix: 'xlink', name: 'show', namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XLINK }],
    ['xlink:title', { prefix: 'xlink', name: 'title', namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XLINK }],
    ['xlink:type', { prefix: 'xlink', name: 'type', namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XLINK }],
    ['xml:base', { prefix: 'xml', name: 'base', namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XML }],
    ['xml:lang', { prefix: 'xml', name: 'lang', namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XML }],
    ['xml:space', { prefix: 'xml', name: 'space', namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XML }],
    ['xmlns', { prefix: '', name: 'xmlns', namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XMLNS }],
    ['xmlns:xlink', { prefix: 'xmlns', name: 'xlink', namespace: _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XMLNS }],
]);
//SVG tag names adjustment map
const SVG_TAG_NAMES_ADJUSTMENT_MAP = new Map([
    'altGlyph',
    'altGlyphDef',
    'altGlyphItem',
    'animateColor',
    'animateMotion',
    'animateTransform',
    'clipPath',
    'feBlend',
    'feColorMatrix',
    'feComponentTransfer',
    'feComposite',
    'feConvolveMatrix',
    'feDiffuseLighting',
    'feDisplacementMap',
    'feDistantLight',
    'feFlood',
    'feFuncA',
    'feFuncB',
    'feFuncG',
    'feFuncR',
    'feGaussianBlur',
    'feImage',
    'feMerge',
    'feMergeNode',
    'feMorphology',
    'feOffset',
    'fePointLight',
    'feSpecularLighting',
    'feSpotLight',
    'feTile',
    'feTurbulence',
    'foreignObject',
    'glyphRef',
    'linearGradient',
    'radialGradient',
    'textPath',
].map((tn) => [tn.toLowerCase(), tn]));
//Tags that causes exit from foreign content
const EXITS_FOREIGN_CONTENT = new Set([
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.B,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.BIG,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.BLOCKQUOTE,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.BODY,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.BR,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.CENTER,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.CODE,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.DD,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.DIV,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.DL,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.DT,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.EM,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.EMBED,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.H1,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.H2,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.H3,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.H4,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.H5,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.H6,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.HEAD,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.HR,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.I,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.IMG,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.LI,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.LISTING,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.MENU,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.META,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.NOBR,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.OL,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.P,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.PRE,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.RUBY,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.S,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.SMALL,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.SPAN,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.STRONG,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.STRIKE,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.SUB,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.SUP,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TABLE,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TT,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.U,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.UL,
    _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.VAR,
]);
//Check exit from foreign content
function causesExit(startTagToken) {
    const tn = startTagToken.tagID;
    const isFontWithAttrs = tn === _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.FONT &&
        startTagToken.attrs.some(({ name }) => name === _html_js__WEBPACK_IMPORTED_MODULE_0__.ATTRS.COLOR || name === _html_js__WEBPACK_IMPORTED_MODULE_0__.ATTRS.SIZE || name === _html_js__WEBPACK_IMPORTED_MODULE_0__.ATTRS.FACE);
    return isFontWithAttrs || EXITS_FOREIGN_CONTENT.has(tn);
}
//Token adjustments
function adjustTokenMathMLAttrs(token) {
    for (let i = 0; i < token.attrs.length; i++) {
        if (token.attrs[i].name === DEFINITION_URL_ATTR) {
            token.attrs[i].name = ADJUSTED_DEFINITION_URL_ATTR;
            break;
        }
    }
}
function adjustTokenSVGAttrs(token) {
    for (let i = 0; i < token.attrs.length; i++) {
        const adjustedAttrName = SVG_ATTRS_ADJUSTMENT_MAP.get(token.attrs[i].name);
        if (adjustedAttrName != null) {
            token.attrs[i].name = adjustedAttrName;
        }
    }
}
function adjustTokenXMLAttrs(token) {
    for (let i = 0; i < token.attrs.length; i++) {
        const adjustedAttrEntry = XML_ATTRS_ADJUSTMENT_MAP.get(token.attrs[i].name);
        if (adjustedAttrEntry) {
            token.attrs[i].prefix = adjustedAttrEntry.prefix;
            token.attrs[i].name = adjustedAttrEntry.name;
            token.attrs[i].namespace = adjustedAttrEntry.namespace;
        }
    }
}
function adjustTokenSVGTagName(token) {
    const adjustedTagName = SVG_TAG_NAMES_ADJUSTMENT_MAP.get(token.tagName);
    if (adjustedTagName != null) {
        token.tagName = adjustedTagName;
        token.tagID = (0,_html_js__WEBPACK_IMPORTED_MODULE_0__.getTagID)(token.tagName);
    }
}
//Integration points
function isMathMLTextIntegrationPoint(tn, ns) {
    return ns === _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.MATHML && (tn === _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.MI || tn === _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.MO || tn === _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.MN || tn === _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.MS || tn === _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.MTEXT);
}
function isHtmlIntegrationPoint(tn, ns, attrs) {
    if (ns === _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.MATHML && tn === _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.ANNOTATION_XML) {
        for (let i = 0; i < attrs.length; i++) {
            if (attrs[i].name === _html_js__WEBPACK_IMPORTED_MODULE_0__.ATTRS.ENCODING) {
                const value = attrs[i].value.toLowerCase();
                return value === MIME_TYPES.TEXT_HTML || value === MIME_TYPES.APPLICATION_XML;
            }
        }
    }
    return ns === _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.SVG && (tn === _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.FOREIGN_OBJECT || tn === _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.DESC || tn === _html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_ID.TITLE);
}
function isIntegrationPoint(tn, ns, attrs, foreignNS) {
    return (((!foreignNS || foreignNS === _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML) && isHtmlIntegrationPoint(tn, ns, attrs)) ||
        ((!foreignNS || foreignNS === _html_js__WEBPACK_IMPORTED_MODULE_0__.NS.MATHML) && isMathMLTextIntegrationPoint(tn, ns)));
}
//# sourceMappingURL=foreign-content.js.map

/***/ }),
/* 43 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "serialize": () => (/* binding */ serialize),
/* harmony export */   "serializeOuter": () => (/* binding */ serializeOuter)
/* harmony export */ });
/* harmony import */ var _common_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(37);
/* harmony import */ var entities_lib_escape_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(44);
/* harmony import */ var _tree_adapters_default_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(40);



// Sets
const VOID_ELEMENTS = new Set([
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_NAMES.AREA,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_NAMES.BASE,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_NAMES.BASEFONT,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_NAMES.BGSOUND,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_NAMES.BR,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_NAMES.COL,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_NAMES.EMBED,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_NAMES.FRAME,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_NAMES.HR,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_NAMES.IMG,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_NAMES.INPUT,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_NAMES.KEYGEN,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_NAMES.LINK,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_NAMES.META,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_NAMES.PARAM,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_NAMES.SOURCE,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_NAMES.TRACK,
    _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_NAMES.WBR,
]);
function isVoidElement(node, options) {
    return (options.treeAdapter.isElementNode(node) &&
        options.treeAdapter.getNamespaceURI(node) === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML &&
        VOID_ELEMENTS.has(options.treeAdapter.getTagName(node)));
}
const defaultOpts = { treeAdapter: _tree_adapters_default_js__WEBPACK_IMPORTED_MODULE_2__.defaultTreeAdapter, scriptingEnabled: true };
/**
 * Serializes an AST node to an HTML string.
 *
 * @example
 *
 * ```js
 * const parse5 = require('parse5');
 *
 * const document = parse5.parse('<!DOCTYPE html><html><head></head><body>Hi there!</body></html>');
 *
 * // Serializes a document.
 * const html = parse5.serialize(document);
 *
 * // Serializes the <html> element content.
 * const str = parse5.serialize(document.childNodes[1]);
 *
 * console.log(str); //> '<head></head><body>Hi there!</body>'
 * ```
 *
 * @param node Node to serialize.
 * @param options Serialization options.
 */
function serialize(node, options) {
    const opts = { ...defaultOpts, ...options };
    if (isVoidElement(node, opts)) {
        return '';
    }
    return serializeChildNodes(node, opts);
}
/**
 * Serializes an AST element node to an HTML string, including the element node.
 *
 * @example
 *
 * ```js
 * const parse5 = require('parse5');
 *
 * const document = parse5.parseFragment('<div>Hello, <b>world</b>!</div>');
 *
 * // Serializes the <div> element.
 * const html = parse5.serializeOuter(document.childNodes[0]);
 *
 * console.log(str); //> '<div>Hello, <b>world</b>!</div>'
 * ```
 *
 * @param node Node to serialize.
 * @param options Serialization options.
 */
function serializeOuter(node, options) {
    const opts = { ...defaultOpts, ...options };
    return serializeNode(node, opts);
}
function serializeChildNodes(parentNode, options) {
    let html = '';
    // Get container of the child nodes
    const container = options.treeAdapter.isElementNode(parentNode) &&
        options.treeAdapter.getTagName(parentNode) === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.TAG_NAMES.TEMPLATE &&
        options.treeAdapter.getNamespaceURI(parentNode) === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML
        ? options.treeAdapter.getTemplateContent(parentNode)
        : parentNode;
    const childNodes = options.treeAdapter.getChildNodes(container);
    if (childNodes) {
        for (const currentNode of childNodes) {
            html += serializeNode(currentNode, options);
        }
    }
    return html;
}
function serializeNode(node, options) {
    if (options.treeAdapter.isElementNode(node)) {
        return serializeElement(node, options);
    }
    if (options.treeAdapter.isTextNode(node)) {
        return serializeTextNode(node, options);
    }
    if (options.treeAdapter.isCommentNode(node)) {
        return serializeCommentNode(node, options);
    }
    if (options.treeAdapter.isDocumentTypeNode(node)) {
        return serializeDocumentTypeNode(node, options);
    }
    // Return an empty string for unknown nodes
    return '';
}
function serializeElement(node, options) {
    const tn = options.treeAdapter.getTagName(node);
    return `<${tn}${serializeAttributes(node, options)}>${isVoidElement(node, options) ? '' : `${serializeChildNodes(node, options)}</${tn}>`}`;
}
function serializeAttributes(node, { treeAdapter }) {
    let html = '';
    for (const attr of treeAdapter.getAttrList(node)) {
        html += ' ';
        if (!attr.namespace) {
            html += attr.name;
        }
        else
            switch (attr.namespace) {
                case _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XML: {
                    html += `xml:${attr.name}`;
                    break;
                }
                case _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XMLNS: {
                    if (attr.name !== 'xmlns') {
                        html += 'xmlns:';
                    }
                    html += attr.name;
                    break;
                }
                case _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.XLINK: {
                    html += `xlink:${attr.name}`;
                    break;
                }
                default: {
                    html += `${attr.prefix}:${attr.name}`;
                }
            }
        html += `="${(0,entities_lib_escape_js__WEBPACK_IMPORTED_MODULE_1__.escapeAttribute)(attr.value)}"`;
    }
    return html;
}
function serializeTextNode(node, options) {
    const { treeAdapter } = options;
    const content = treeAdapter.getTextNodeContent(node);
    const parent = treeAdapter.getParentNode(node);
    const parentTn = parent && treeAdapter.isElementNode(parent) && treeAdapter.getTagName(parent);
    return parentTn &&
        treeAdapter.getNamespaceURI(parent) === _common_html_js__WEBPACK_IMPORTED_MODULE_0__.NS.HTML &&
        (0,_common_html_js__WEBPACK_IMPORTED_MODULE_0__.hasUnescapedText)(parentTn, options.scriptingEnabled)
        ? content
        : (0,entities_lib_escape_js__WEBPACK_IMPORTED_MODULE_1__.escapeText)(content);
}
function serializeCommentNode(node, { treeAdapter }) {
    return `<!--${treeAdapter.getCommentNodeContent(node)}-->`;
}
function serializeDocumentTypeNode(node, { treeAdapter }) {
    return `<!DOCTYPE ${treeAdapter.getDocumentTypeNodeName(node)}>`;
}
//# sourceMappingURL=index.js.map

/***/ }),
/* 44 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "encodeXML": () => (/* binding */ encodeXML),
/* harmony export */   "escape": () => (/* binding */ escape),
/* harmony export */   "escapeAttribute": () => (/* binding */ escapeAttribute),
/* harmony export */   "escapeText": () => (/* binding */ escapeText),
/* harmony export */   "escapeUTF8": () => (/* binding */ escapeUTF8),
/* harmony export */   "getCodePoint": () => (/* binding */ getCodePoint),
/* harmony export */   "xmlReplacer": () => (/* binding */ xmlReplacer)
/* harmony export */ });
const xmlReplacer = /["&'<>$\x80-\uFFFF]/g;
const xmlCodeMap = new Map([
    [34, "&quot;"],
    [38, "&amp;"],
    [39, "&apos;"],
    [60, "&lt;"],
    [62, "&gt;"],
]);
// For compatibility with node < 4, we wrap `codePointAt`
const getCodePoint = 
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
String.prototype.codePointAt != null
    ? (str, index) => str.codePointAt(index)
    : // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        (c, index) => (c.charCodeAt(index) & 0xfc00) === 0xd800
            ? (c.charCodeAt(index) - 0xd800) * 0x400 +
                c.charCodeAt(index + 1) -
                0xdc00 +
                0x10000
            : c.charCodeAt(index);
/**
 * Encodes all non-ASCII characters, as well as characters not valid in XML
 * documents using XML entities.
 *
 * If a character has no equivalent entity, a
 * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
 */
function encodeXML(str) {
    let ret = "";
    let lastIdx = 0;
    let match;
    while ((match = xmlReplacer.exec(str)) !== null) {
        const i = match.index;
        const char = str.charCodeAt(i);
        const next = xmlCodeMap.get(char);
        if (next !== undefined) {
            ret += str.substring(lastIdx, i) + next;
            lastIdx = i + 1;
        }
        else {
            ret += `${str.substring(lastIdx, i)}&#x${getCodePoint(str, i).toString(16)};`;
            // Increase by 1 if we have a surrogate pair
            lastIdx = xmlReplacer.lastIndex += Number((char & 0xfc00) === 0xd800);
        }
    }
    return ret + str.substr(lastIdx);
}
/**
 * Encodes all non-ASCII characters, as well as characters not valid in XML
 * documents using numeric hexadecimal reference (eg. `&#xfc;`).
 *
 * Have a look at `escapeUTF8` if you want a more concise output at the expense
 * of reduced transportability.
 *
 * @param data String to escape.
 */
const escape = encodeXML;
function getEscaper(regex, map) {
    return function escape(data) {
        let match;
        let lastIdx = 0;
        let result = "";
        while ((match = regex.exec(data))) {
            if (lastIdx !== match.index) {
                result += data.substring(lastIdx, match.index);
            }
            // We know that this chararcter will be in the map.
            result += map.get(match[0].charCodeAt(0));
            // Every match will be of length 1
            lastIdx = match.index + 1;
        }
        return result + data.substring(lastIdx);
    };
}
/**
 * Encodes all characters not valid in XML documents using XML entities.
 *
 * Note that the output will be character-set dependent.
 *
 * @param data String to escape.
 */
const escapeUTF8 = getEscaper(/[&<>'"]/g, xmlCodeMap);
/**
 * Encodes all characters that have to be escaped in HTML attributes,
 * following {@link https://html.spec.whatwg.org/multipage/parsing.html#escapingString}.
 *
 * @param data String to escape.
 */
const escapeAttribute = getEscaper(/["&\u00A0]/g, new Map([
    [34, "&quot;"],
    [38, "&amp;"],
    [160, "&nbsp;"],
]));
/**
 * Encodes all characters that have to be escaped in HTML text,
 * following {@link https://html.spec.whatwg.org/multipage/parsing.html#escapingString}.
 *
 * @param data String to escape.
 */
const escapeText = getEscaper(/[&<>\u00A0]/g, new Map([
    [38, "&amp;"],
    [60, "&lt;"],
    [62, "&gt;"],
    [160, "&nbsp;"],
]));
//# sourceMappingURL=escape.js.map

/***/ }),
/* 45 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BareError": () => (/* binding */ BareError),
/* harmony export */   "default": () => (/* binding */ BareClient),
/* harmony export */   "maxRedirects": () => (/* binding */ maxRedirects),
/* harmony export */   "statusEmpty": () => (/* binding */ statusEmpty),
/* harmony export */   "statusRedirect": () => (/* binding */ statusRedirect)
/* harmony export */ });
// The user likely has overwritten all networking functions after importing bare-client
// It is our responsibility to make sure components of Bare-Client are using native networking functions
// These exports are provided to plugins by @rollup/plugin-inject
const global = globalThis;
const fetch = global.fetch;
const WebSocket = global.WebSocket;
const Request = global.Request;
const Response = global.Response;

const statusEmpty = [101, 204, 205, 304];
const statusRedirect = [301, 302, 303, 307, 308];
class BareError extends Error {
  status;
  body;

  constructor(status, body) {
    super(body.message || body.code);
    this.status = status;
    this.body = body;
  }

}
class Client {
  base;
  /**
   *
   * @param version Version provided by extension
   * @param server Bare Server URL provided by BareClient
   */

  constructor(version, server) {
    this.base = new URL(`./v${version}/`, server);
  }

}

const validChars = "!#$%&'*+-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ^_`abcdefghijklmnopqrstuvwxyz|~";
const reserveChar = '%';
function validProtocol(protocol) {
  for (let i = 0; i < protocol.length; i++) {
    const char = protocol[i];

    if (!validChars.includes(char)) {
      return false;
    }
  }

  return true;
}
function encodeProtocol(protocol) {
  let result = '';

  for (let i = 0; i < protocol.length; i++) {
    const char = protocol[i];

    if (validChars.includes(char) && char !== reserveChar) {
      result += char;
    } else {
      const code = char.charCodeAt(0);
      result += reserveChar + code.toString(16).padStart(2, '0');
    }
  }

  return result;
}

class ClientV1 extends Client {
  ws;
  http;
  newMeta;
  getMeta;

  constructor(server) {
    super(1, server);
    this.ws = new URL(this.base);
    this.http = new URL(this.base);
    this.newMeta = new URL('ws-new-meta', this.base);
    this.getMeta = new URL('ws-meta', this.base);

    if (this.ws.protocol === 'https:') {
      this.ws.protocol = 'wss:';
    } else {
      this.ws.protocol = 'ws:';
    }
  }

  async connect(requestHeaders, protocol, host, port, path) {
    const assignMeta = await fetch(this.newMeta, {
      method: 'GET'
    });

    if (!assignMeta.ok) {
      throw new BareError(assignMeta.status, await assignMeta.json());
    }

    const id = await assignMeta.text();
    const socket = new WebSocket(this.ws, ['bare', encodeProtocol(JSON.stringify({
      remote: {
        protocol,
        host,
        port,
        path
      },
      headers: requestHeaders,
      forward_headers: ['accept-encoding', 'accept-language', 'sec-websocket-extensions', 'sec-websocket-key', 'sec-websocket-version'],
      id
    }))]);
    socket.meta = new Promise((resolve, reject) => {
      socket.addEventListener('open', async () => {
        const outgoing = await fetch(this.getMeta, {
          headers: {
            'x-bare-id': id
          },
          method: 'GET'
        });

        if (!outgoing.ok) {
          reject(new BareError(outgoing.status, await outgoing.json()));
        }

        resolve(await outgoing.json());
      });
      socket.addEventListener('error', reject);
    });
    return socket;
  }

  async request(method, requestHeaders, body, protocol, host, port, path, cache, signal) {
    if (protocol.startsWith('blob:')) {
      const response = await fetch(`blob:${location.origin}${path}`);
      const result = new Response(response.body, response);
      result.rawHeaders = Object.fromEntries(response.headers);
      result.rawResponse = response;
      return result;
    }

    const bareHeaders = {};

    if (requestHeaders instanceof Headers) {
      for (const [header, value] of requestHeaders) {
        bareHeaders[header] = value;
      }
    } else {
      for (const header in requestHeaders) {
        bareHeaders[header] = requestHeaders[header];
      }
    }

    const forwardHeaders = ['accept-encoding', 'accept-language'];
    const options = {
      credentials: 'include',
      method: method,
      signal
    };

    if (body !== undefined) {
      options.body = body;
    } // bare can be an absolute path containing no origin, it becomes relative to the script


    const request = new Request(this.http, options);
    this.writeBareRequest(request, protocol, host, path, port, bareHeaders, forwardHeaders);
    const response = await fetch(request);
    const readResponse = await this.readBareResponse(response);
    const result = new Response(statusEmpty.includes(readResponse.status) ? undefined : response.body, {
      status: readResponse.status,
      statusText: readResponse.statusText ?? undefined,
      headers: readResponse.headers
    });
    result.rawHeaders = readResponse.rawHeaders;
    result.rawResponse = response;
    return result;
  }

  async readBareResponse(response) {
    if (!response.ok) {
      throw new BareError(response.status, await response.json());
    }

    const requiredHeaders = ['x-bare-status', 'x-bare-status-text', 'x-bare-headers'];

    for (const header of requiredHeaders) {
      if (!response.headers.has(header)) {
        throw new BareError(500, {
          code: 'IMPL_MISSING_BARE_HEADER',
          id: `response.headers.${header}`
        });
      }
    }

    const status = parseInt(response.headers.get('x-bare-status'));
    const statusText = response.headers.get('x-bare-status-text');
    const rawHeaders = JSON.parse(response.headers.get('x-bare-headers'));
    const headers = new Headers(rawHeaders);
    return {
      status,
      statusText,
      rawHeaders,
      headers
    };
  }

  writeBareRequest(request, protocol, host, path, port, bareHeaders, forwardHeaders) {
    request.headers.set('x-bare-protocol', protocol);
    request.headers.set('x-bare-host', host);
    request.headers.set('x-bare-path', path);
    request.headers.set('x-bare-port', port.toString());
    request.headers.set('x-bare-headers', JSON.stringify(bareHeaders));
    request.headers.set('x-bare-forward-headers', JSON.stringify(forwardHeaders));
  }

}

/*
 * JavaScript MD5
 * Adopted from https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/**
 * Add integers, wrapping at 2^32.
 * This uses 16-bit operations internally to work around bugs in interpreters.
 *
 * @param x First integer
 * @param y Second integer
 * @returns Sum
 */
function safeAdd(x, y) {
  const lsw = (x & 0xffff) + (y & 0xffff);
  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 0xffff;
}
/**
 * Bitwise rotate a 32-bit number to the left.
 *
 * @param num 32-bit number
 * @param cnt Rotation count
 * @returns  Rotated number
 */


function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
/**
 * Basic operation the algorithm uses.
 *
 * @param q q
 * @param a a
 * @param b b
 * @param x x
 * @param s s
 * @param t t
 * @returns Result
 */


function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}
/**
 * Basic operation the algorithm uses.
 *
 * @param a a
 * @param b b
 * @param c c
 * @param d d
 * @param x x
 * @param s s
 * @param t t
 * @returns Result
 */


function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}
/**
 * Basic operation the algorithm uses.
 *
 * @param a a
 * @param b b
 * @param c c
 * @param d d
 * @param x x
 * @param s s
 * @param t t
 * @returns Result
 */


function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}
/**
 * Basic operation the algorithm uses.
 *
 * @param a a
 * @param b b
 * @param c c
 * @param d d
 * @param x x
 * @param s s
 * @param t t
 * @returns Result
 */


function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}
/**
 * Basic operation the algorithm uses.
 *
 * @param a a
 * @param b b
 * @param c c
 * @param d d
 * @param x x
 * @param s s
 * @param t t
 * @returns Result
 */


function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}
/**
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 *
 * @param x Array of little-endian words
 * @param len Bit length
 * @returns MD5 Array
 */


function binlMD5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[(len + 64 >>> 9 << 4) + 14] = len;
  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (let i = 0; i < x.length; i += 16) {
    const olda = a;
    const oldb = b;
    const oldc = c;
    const oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  return [a, b, c, d];
}
/**
 * Convert an array of little-endian words to a string
 *
 * @param input MD5 Array
 * @returns MD5 string
 */


function binl2rstr(input) {
  let output = '';
  const length32 = input.length * 32;

  for (let i = 0; i < length32; i += 8) {
    output += String.fromCharCode(input[i >> 5] >>> i % 32 & 0xff);
  }

  return output;
}
/**
 * Convert a raw string to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 *
 * @param input Raw input string
 * @returns Array of little-endian words
 */


function rstr2binl(input) {
  const output = [];
  const outputLen = input.length >> 2;

  for (let i = 0; i < outputLen; i += 1) {
    output[i] = 0;
  }

  const length8 = input.length * 8;

  for (let i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
  }

  return output;
}
/**
 * Calculate the MD5 of a raw string
 *
 * @param s Input string
 * @returns Raw MD5 string
 */


function rstrMD5(s) {
  return binl2rstr(binlMD5(rstr2binl(s), s.length * 8));
}
/**
 * Calculates the HMAC-MD5 of a key and some data (raw strings)
 *
 * @param key HMAC key
 * @param data Raw input string
 * @returns Raw MD5 string
 */


function rstrHMACMD5(key, data) {
  let bkey = rstr2binl(key);
  const ipad = [];
  const opad = [];

  if (bkey.length > 16) {
    bkey = binlMD5(bkey, key.length * 8);
  }

  for (let i = 0; i < 16; i += 1) {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5c5c5c5c;
  }

  const hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
  return binl2rstr(binlMD5(opad.concat(hash), 512 + 128));
}
/**
 * Convert a raw string to a hex string
 *
 * @param input Raw input string
 * @returns Hex encoded string
 */


function rstr2hex(input) {
  const hexTab = '0123456789abcdef';
  let output = '';

  for (let i = 0; i < input.length; i += 1) {
    const x = input.charCodeAt(i);
    output += hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f);
  }

  return output;
}
/**
 * Encode a string as UTF-8
 *
 * @param input Input string
 * @returns UTF8 string
 */


function str2rstrUTF8(input) {
  return unescape(encodeURIComponent(input));
}
/**
 * Encodes input string as raw MD5 string
 *
 * @param s Input string
 * @returns Raw MD5 string
 */


function rawMD5(s) {
  return rstrMD5(str2rstrUTF8(s));
}
/**
 * Encodes input string as Hex encoded string
 *
 * @param s Input string
 * @returns Hex encoded string
 */


function hexMD5(s) {
  return rstr2hex(rawMD5(s));
}
/**
 * Calculates the raw HMAC-MD5 for the given key and data
 *
 * @param k HMAC key
 * @param d Input string
 * @returns Raw MD5 string
 */


function rawHMACMD5(k, d) {
  return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d));
}
/**
 * Calculates the Hex encoded HMAC-MD5 for the given key and data
 *
 * @param k HMAC key
 * @param d Input string
 * @returns Raw MD5 string
 */


function hexHMACMD5(k, d) {
  return rstr2hex(rawHMACMD5(k, d));
}
/**
 * Calculates MD5 value for a given string.
 * If a key is provided, calculates the HMAC-MD5 value.
 * Returns a Hex encoded string unless the raw argument is given.
 *
 * @param string Input string
 * @param key HMAC key
 * @param raw Raw output switch
 * @returns MD5 output
 */


function md5(string, key, raw) {
  if (!key) {
    if (!raw) {
      return hexMD5(string);
    }

    return rawMD5(string);
  }

  if (!raw) {
    return hexHMACMD5(key, string);
  }

  return rawHMACMD5(key, string);
}

const MAX_HEADER_VALUE = 3072;
/**
 *
 * Splits headers according to spec
 * @param headers
 * @returns Split headers
 */

function splitHeaders(headers) {
  const output = new Headers(headers);

  if (headers.has('x-bare-headers')) {
    const value = headers.get('x-bare-headers');

    if (value.length > MAX_HEADER_VALUE) {
      output.delete('x-bare-headers');
      let split = 0;

      for (let i = 0; i < value.length; i += MAX_HEADER_VALUE) {
        const part = value.slice(i, i + MAX_HEADER_VALUE);
        const id = split++;
        output.set(`x-bare-headers-${id}`, `;${part}`);
      }
    }
  }

  return output;
}
/**
 * Joins headers according to spec
 * @param headers
 * @returns Joined headers
 */

function joinHeaders(headers) {
  const output = new Headers(headers);
  const prefix = 'x-bare-headers';

  if (headers.has(`${prefix}-0`)) {
    const join = [];

    for (const [header, value] of headers) {
      if (!header.startsWith(prefix)) {
        continue;
      }

      if (!value.startsWith(';')) {
        throw new BareError(400, {
          code: 'INVALID_BARE_HEADER',
          id: `request.headers.${header}`,
          message: `Value didn't begin with semi-colon.`
        });
      }

      const id = parseInt(header.slice(prefix.length + 1));
      join[id] = value.slice(1);
      output.delete(header);
    }

    output.set(prefix, join.join(''));
  }

  return output;
}

class ClientV2 extends Client {
  ws;
  http;
  newMeta;
  getMeta;

  constructor(server) {
    super(2, server);
    this.ws = new URL(this.base);
    this.http = new URL(this.base);
    this.newMeta = new URL('./ws-new-meta', this.base);
    this.getMeta = new URL(`./ws-meta`, this.base);

    if (this.ws.protocol === 'https:') {
      this.ws.protocol = 'wss:';
    } else {
      this.ws.protocol = 'ws:';
    }
  }

  async connect(requestHeaders, protocol, host, port, path) {
    const request = new Request(this.newMeta, {
      headers: this.createBareHeaders(protocol, host, path, port, requestHeaders)
    });
    const assign_meta = await fetch(request);

    if (!assign_meta.ok) {
      throw new BareError(assign_meta.status, await assign_meta.json());
    }

    const id = await assign_meta.text();
    const socket = new WebSocket(this.ws, [id]);
    socket.meta = new Promise((resolve, reject) => {
      socket.addEventListener('open', async () => {
        const outgoing = await fetch(this.getMeta, {
          headers: {
            'x-bare-id': id
          },
          method: 'GET'
        });
        resolve(await await this.readBareResponse(outgoing));
      });
      socket.addEventListener('error', reject);
    });
    return socket;
  }

  async request(method, requestHeaders, body, protocol, host, port, path, cache, signal) {
    if (protocol.startsWith('blob:')) {
      const response = await fetch(`blob:${location.origin}${path}`);
      const result = new Response(response.body, response);
      result.rawHeaders = Object.fromEntries(response.headers);
      result.rawResponse = response;
      return result;
    }

    const bareHeaders = {};

    if (requestHeaders instanceof Headers) {
      for (const [header, value] of requestHeaders) {
        bareHeaders[header] = value;
      }
    } else {
      for (const header in requestHeaders) {
        bareHeaders[header] = requestHeaders[header];
      }
    }

    const options = {
      credentials: 'include',
      method: method,
      signal
    };

    if (cache !== 'only-if-cached') {
      options.cache = cache;
    }

    if (body !== undefined) {
      options.body = body;
    }

    options.headers = this.createBareHeaders(protocol, host, path, port, bareHeaders);
    const request = new Request(this.http + '?cache=' + md5(`${protocol}${host}${port}${path}`), options);
    const response = await fetch(request);
    const readResponse = await this.readBareResponse(response);
    const result = new Response(statusEmpty.includes(readResponse.status) ? undefined : response.body, {
      status: readResponse.status,
      statusText: readResponse.statusText ?? undefined,
      headers: readResponse.headers
    });
    result.rawHeaders = readResponse.rawHeaders;
    result.rawResponse = response;
    return result;
  }

  async readBareResponse(response) {
    if (!response.ok) {
      throw new BareError(response.status, await response.json());
    }

    const responseHeaders = joinHeaders(response.headers);
    const result = {};

    if (responseHeaders.has('x-bare-status')) {
      result.status = parseInt(responseHeaders.get('x-bare-status'));
    }

    if (responseHeaders.has('x-bare-status-text')) {
      result.statusText = responseHeaders.get('x-bare-status-text');
    }

    if (responseHeaders.has('x-bare-headers')) {
      result.rawHeaders = JSON.parse(responseHeaders.get('x-bare-headers'));
      result.headers = new Headers(result.rawHeaders);
    }

    return result;
  }

  createBareHeaders(protocol, host, path, port, bareHeaders, forwardHeaders = [], passHeaders = [], passStatus = []) {
    const headers = new Headers();
    headers.set('x-bare-protocol', protocol);
    headers.set('x-bare-host', host);
    headers.set('x-bare-path', path);
    headers.set('x-bare-port', port.toString());
    headers.set('x-bare-headers', JSON.stringify(bareHeaders));

    for (const header of forwardHeaders) {
      headers.append('x-bare-forward-headers', header);
    }

    for (const header of passHeaders) {
      headers.append('x-bare-pass-headers', header);
    }

    for (const status of passStatus) {
      headers.append('x-bare-pass-status', status.toString());
    }

    splitHeaders(headers);
    return headers;
  }

}

const clientCtors = [['v2', ClientV2], ['v1', ClientV1]];
const maxRedirects = 20;
class BareClient {
  data;
  client;
  server;
  ready;
  /**
   *
   * @param server A full URL to the bare server.
   * @param data The a copy of the Bare server data found in BareClient.data. If specified, this data will be loaded. Otherwise, a request will be made to the bare server (upon fetching or creating a WebSocket).
   */

  constructor(server, data) {
    this.server = new URL(server);
    this.ready = false;

    if (typeof data === 'object') {
      this.loadData(data);
    }
  }

  loadData(data) {
    let found = false; // newest-oldest

    for (const [version, ctor] of clientCtors) {
      if (data.versions.includes(version)) {
        this.client = new ctor(this.server);
        found = true;
        break;
      }
    }

    if (!found) {
      throw new Error(`Unable to find compatible client version.`);
    }

    this.data = data;
    this.ready = true;
  }

  async work() {
    if (this.ready === true) {
      return;
    }

    const outgoing = await fetch(this.server);

    if (!outgoing.ok) {
      throw new Error(`Unable to fetch Bare meta: ${outgoing.status} ${await outgoing.text()}`);
    }

    this.loadData(await outgoing.json());
  }

  async request(method, requestHeaders, body, protocol, host, port, path, cache, signal) {
    await this.work();
    return await this.client.request(method, requestHeaders, body, protocol, host, port, path, cache, signal);
  }

  async connect(requestHeaders, protocol, host, port, path) {
    await this.work();
    return this.client.connect(requestHeaders, protocol, host, port, path);
  }
  /**
   *
   * @param url
   * @param protocols
   * @param origin Location of client that created the WebSocket
   * @returns
   */


  async createWebSocket(url, headers = {}, protocols = []) {
    const requestHeaders = headers instanceof Headers ? Object.fromEntries(headers) : headers;
    url = new URL(url); // user is expected to specify user-agent and origin
    // both are in spec

    requestHeaders['Host'] = url.host; // requestHeaders['Origin'] = origin;

    requestHeaders['Pragma'] = 'no-cache';
    requestHeaders['Cache-Control'] = 'no-cache';
    requestHeaders['Upgrade'] = 'websocket'; // requestHeaders['User-Agent'] = navigator.userAgent;

    requestHeaders['Connection'] = 'Upgrade';

    if (typeof protocols === 'string') {
      protocols = [protocols];
    }

    for (const proto of protocols) {
      if (!validProtocol(proto)) {
        throw new DOMException(`Failed to construct 'WebSocket': The subprotocol '${proto}' is invalid.`);
      }
    }

    if (protocols.length) {
      headers['Sec-Websocket-Protocol'] = protocols.join(', ');
    }

    await this.work();
    return this.client.connect(headers, url.protocol, url.hostname, url.port, url.pathname + url.search);
  }

  async fetch(url, init = {}) {
    if (url instanceof Request) {
      // behave similar to the browser when fetch is called with (Request, Init)
      if (init) {
        url = new URL(url.url);
      } else {
        init = url;
        url = new URL(url.url);
      }
    } else {
      url = new URL(url);
    }

    let method;

    if (typeof init.method === 'string') {
      method = init.method;
    } else {
      method = 'GET';
    }

    let body;

    if (init.body !== undefined && init.body !== null) {
      body = init.body;
    }

    let headers;

    if (typeof init.headers === 'object' && init.headers !== null) {
      if (init.headers instanceof Headers) {
        headers = Object.fromEntries(init.headers);
      } else {
        headers = init.headers;
      }
    } else {
      headers = {};
    }

    let cache;

    if (typeof init.cache === 'string') {
      cache = init.cache;
    } else {
      cache = 'default';
    }

    let signal;

    if (init.signal instanceof AbortSignal) {
      signal = init.signal;
    }

    for (let i = 0;; i++) {
      let port;

      if (url.port === '') {
        if (url.protocol === 'https:') {
          port = '443';
        } else {
          port = '80';
        }
      } else {
        port = url.port;
      }

      headers.host = url.host;
      const response = await this.request(method, headers, body, url.protocol, url.hostname, port, url.pathname + url.search, cache, signal);
      response.finalURL = url.toString();

      if (statusRedirect.includes(response.status)) {
        switch (init.redirect) {
          default:
          case 'follow':
            if (maxRedirects > i && response.headers.has('location')) {
              url = new URL(response.headers.get('location'), url);
              continue;
            } else {
              throw new TypeError('Failed to fetch');
            }

          case 'error':
            throw new TypeError('Failed to fetch');

          case 'manual':
            return response;
        }
      } else {
        return response;
      }
    }
  }

}


//# sourceMappingURL=BareClient.esm.js.map


/***/ }),
/* 46 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "decodeProtocol": () => (/* binding */ decodeProtocol),
/* harmony export */   "encodeProtocol": () => (/* binding */ encodeProtocol),
/* harmony export */   "validProtocol": () => (/* binding */ validProtocol)
/* harmony export */ });
const validChars = "!#$%&'*+-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ^_`abcdefghijklmnopqrstuvwxyz|~";
const reserveChar = '%';
function validProtocol(protocol) {
    for (let i = 0; i < protocol.length; i++) {
        const char = protocol[i];
        if (!validChars.includes(char)) {
            return false;
        }
    }
    return true;
}
function encodeProtocol(protocol) {
    let result = '';
    for (let i = 0; i < protocol.length; i++) {
        const char = protocol[i];
        if (validChars.includes(char) && char !== reserveChar) {
            result += char;
        }
        else {
            const code = char.charCodeAt(0);
            result += reserveChar + code.toString(16).padStart(2, '0');
        }
    }
    return result;
}
function decodeProtocol(protocol) {
    let result = '';
    for (let i = 0; i < protocol.length; i++) {
        const char = protocol[i];
        if (char === reserveChar) {
            const code = parseInt(protocol.slice(i + 1, i + 3), 16);
            const decoded = String.fromCharCode(code);
            result += decoded;
            i += 2;
        }
        else {
            result += char;
        }
    }
    return result;
}


/***/ }),
/* 47 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "base64": () => (/* binding */ base64),
/* harmony export */   "none": () => (/* binding */ none),
/* harmony export */   "plain": () => (/* binding */ plain),
/* harmony export */   "whatTheFuck": () => (/* binding */ whatTheFuck),
/* harmony export */   "xor": () => (/* binding */ xor)
/* harmony export */ });
const none = {
    encode: (url = "") => url,
    decode: (url = "") => url
};
const plain = {
    encode: (url = "") => encodeURIComponent(url),
    decode: (url = "") => decodeURIComponent(url)
};
const xor = {
    encode: (url = "") => {
        return encodeURIComponent(url.toString().split("").map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char).join(""));
    },
    decode: (url = "") => {
        let [input, ...search] = url.split("?");
        return decodeURIComponent(input).split("").map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char).join("") + (search.length ? "?" + search.join("?") : "");
    }
};
const base64 = {
    encode: (url) => {
        const TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        url = String(url);
        if (/[^\0-\xFF]/.test(url))
            new DOMException("The string to be encoded contains characters outside of the Latin1 range.");
        let padding = url.length % 3, output = "", position = -1, a, b, c, buffer, length = url.length - padding;
        while (++position < length) {
            a = url.charCodeAt(position) << 16;
            b = url.charCodeAt(++position) << 8;
            c = url.charCodeAt(++position);
            buffer = a + b + c;
            output += (TABLE.charAt(buffer >> 18 & 0x3F) + TABLE.charAt(buffer >> 12 & 0x3F) + TABLE.charAt(buffer >> 6 & 0x3F) + TABLE.charAt(buffer & 0x3F));
        }
        if (padding == 2) {
            a = url.charCodeAt(position) << 8;
            b = url.charCodeAt(++position);
            buffer = a + b;
            output += (TABLE.charAt(buffer >> 10) + TABLE.charAt((buffer >> 4) & 0x3F) + TABLE.charAt((buffer << 2) & 0x3F) + "=");
        }
        else if (padding == 1) {
            buffer = url.charCodeAt(position);
            output += (TABLE.charAt(buffer >> 2) + TABLE.charAt((buffer << 4) & 0x3F) + "==");
        }
        return output;
    },
    decode: (url) => {
        const TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        url = String(url).replace(/[\t\n\f\r ]/g, "");
        var length = url.length;
        if (length % 4 == 0) {
            url = url.replace(/==?$/, "");
            length = url.length;
        }
        ;
        if (length % 4 == 1 || /[^+a-zA-Z0-9/]/.test(url))
            throw new DOMException("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
        let bitCounter = 0, bitStorage, buffer, output = "", position = -1;
        while (++position < length) {
            buffer = TABLE.indexOf(url.charAt(position));
            bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
            if (bitCounter++ % 4)
                output += String.fromCharCode(0xFF & bitStorage >> (-2 * bitCounter & 6));
        }
        return output;
    }
};
const whatTheFuck = {
    decode: (string) => {
        const charShiftLength = parseInt(string.substring(0, 2));
        const charShiftData = parseInt(string.substring(2, charShiftLength + 2));
        const str = decodeURIComponent(string.substring(charShiftLength + 2, string.length));
        const sections = str.match(new RegExp(`.{1,${charShiftLength}}`, "g"));
        let out = "";
        for (let i in sections)
            for (let j in sections[i].split(""))
                out += String.fromCharCode(sections[i][j].charCodeAt(0) - parseInt(charShiftData.toString()[j]));
        return decodeURIComponent(out);
    },
    encode: (string) => {
        const charShiftLength = Math.ceil(Math.random() * 10);
        const charShiftData = (n => { let out = ""; for (let i = 0; i < n; i++)
            out += Math.ceil(Math.random() * 9); return parseInt(out); })(charShiftLength);
        const str = encodeURIComponent(string);
        const sections = str.match(new RegExp(`.{1,${charShiftLength}}`, "g"));
        let out = "";
        for (let i in sections)
            for (let j in sections[i].split(""))
                out += String.fromCharCode(sections[i][j].charCodeAt(0) + parseInt(charShiftData.toString()[j]));
        return encodeURIComponent(`${charShiftLength < 10 ? `0${charShiftLength}` : charShiftLength}${charShiftData}${out}`);
    }
};


/***/ }),
/* 48 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(49);
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(50);



function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__["default"])(rnds);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);

/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rng)
/* harmony export */ });
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
    // find the complete implementation of crypto (msCrypto) on IE11.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }

  return getRandomValues(rnds8);
}

/***/ }),
/* 50 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(51);

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);

/***/ }),
/* 51 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(52);


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__["default"].test(uuid);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);

/***/ }),
/* 52 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ })
/******/ 	]));
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_rewrite_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19);
/* harmony import */ var _lib_rewrite_headers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(24);
/* harmony import */ var _lib_rewrite_html__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(25);
/* harmony import */ var _lib_rewrite_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(21);
/* harmony import */ var _lib_rewrite_url__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(20);
/* harmony import */ var _tomphttp_bare_client__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(45);
/* harmony import */ var _tomphttp_bare_server_node_dist_encodeProtocol__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(46);
/* harmony import */ var _lib_util_codecs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(47);
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(48);









self.__osana$bundle = {
    rewrite: {
        css: _lib_rewrite_css__WEBPACK_IMPORTED_MODULE_0__["default"],
        html: _lib_rewrite_html__WEBPACK_IMPORTED_MODULE_2__["default"],
        srcset: _lib_rewrite_html__WEBPACK_IMPORTED_MODULE_2__.rewriteSrcset,
        js: _lib_rewrite_js__WEBPACK_IMPORTED_MODULE_3__["default"],
        url: _lib_rewrite_url__WEBPACK_IMPORTED_MODULE_4__["default"],
        headers: _lib_rewrite_headers__WEBPACK_IMPORTED_MODULE_1__,
        protocol: _tomphttp_bare_server_node_dist_encodeProtocol__WEBPACK_IMPORTED_MODULE_6__.encodeProtocol
    },
    codecs: _lib_util_codecs__WEBPACK_IMPORTED_MODULE_7__,
    BareClient: _tomphttp_bare_client__WEBPACK_IMPORTED_MODULE_5__["default"],
    uuid: uuid__WEBPACK_IMPORTED_MODULE_8__["default"]
};

})();

/******/ })()
;
//# sourceMappingURL=osana.bundle.js.map