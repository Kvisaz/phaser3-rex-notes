'use strict'

import Phaser from 'phaser';
import ArrCopy from './../utils/array/Copy.js';
import TypeConvert from './../utils/string/TypeConvert.js';

const GetValue = Phaser.Utils.Objects.GetValue;

var runCommands = function (queue, scope, config) {
    var reverse = GetValue(config, 'reverse', false);

    var retVal;
    if (typeof (queue[0]) === 'string') {
        retVal = runCommand(queue, scope, config);
    } else {
        if (!reverse) {
            for (var i = 0, len = queue.length; i < len; i++) {
                retVal = runCommands(queue[i], scope, config);
            }
        } else {
            for (var len = queue.length, i = len - 1; i >= 0; i--) {
                retVal = runCommands(queue[i], scope, config);
            }
        }
    }

    return retVal;
}

var ARGS = []; // reuse this array
var runCommand = function (cmd, scope, config) {
    var argsConvertCallback = GetValue(config, 'argsConvert', undefined);

    var fnName = cmd[0];

    ARGS = ArrCopy(ARGS, cmd, 1);
    if (argsConvertCallback !== undefined) {
        // convert string to floating number, boolean, null, or string        
        if (argsConvertCallback === true) {
            argsConvertCallback = defaultTypeConvert;
        }
        for (var i = 0, len = ARGS.length; i < len; i++) {
            ARGS[i] = argsConvertCallback.call(null, cmd, ARGS[i]);
        }
    }

    var fn = scope[fnName];
    if (fn == null) {
        fn = GetValue(scope, fnName, null);
    }
    return fn.apply(scope, ARGS);
}

const defaultTypeConvert = function (command, value) {
    return TypeConvert(value);
}

export default runCommands;