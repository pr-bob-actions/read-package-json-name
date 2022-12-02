"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputs = exports.extractName = exports.buildPath = exports.run = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const input_workingDir = process.env.INPUT_WORKINGDIR;
        const input_path = process.env.INPUT_PATH;
        const fullPath = buildPath(input_workingDir, input_path);
        const packageJson = yield (_a = fullPath, Promise.resolve().then(() => __importStar(require(_a))));
        const data = extractName(packageJson);
        outputs(data);
    });
}
exports.run = run;
function buildPath(wd, path) {
    const workingDir = (wd && (0, path_1.resolve)(wd)) || (0, path_1.resolve)('.');
    const fullPath = (path && (0, path_1.resolve)(path)) || (0, path_1.join)(workingDir, 'package.json');
    return fullPath;
}
exports.buildPath = buildPath;
function extractName(packageJson) {
    var _a, _b;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fullname = packageJson.name;
    if (!fullname) {
        throw 'File do not contain name field';
    }
    const match = /(?:@(?<namespace>.*)\/)?(?<name>.*)/.exec(fullname);
    return {
        fullname,
        name: (_a = match === null || match === void 0 ? void 0 : match.groups) === null || _a === void 0 ? void 0 : _a.name,
        namespace: (_b = match === null || match === void 0 ? void 0 : match.groups) === null || _b === void 0 ? void 0 : _b.namespace,
    };
}
exports.extractName = extractName;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function outputs(data) {
    const outputFile = process.env.GITHUB_OUTPUT;
    const outputs = Object.entries(data)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, value]) => value != undefined)
        .map(([key, value]) => `${key}=${value}`);
    if (!outputFile) {
        console.log('Your are not in a Github Action CI', 'Redirect output to stdout');
        console.log(outputs.join('\n') + '\n');
        return;
    }
    (0, fs_1.appendFileSync)(outputFile, outputs.join('\n') + '\n');
}
exports.outputs = outputs;
run();
