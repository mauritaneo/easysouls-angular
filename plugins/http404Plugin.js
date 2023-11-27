"use strict";
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
exports.getHttp404Plugin = exports.http404Plugin = void 0;
const scully_1 = require("@scullyio/scully");
const path = require('path');
const fs = require('fs');
const http404Plugin = (html, route) => __awaiter(void 0, void 0, void 0, function* () {
    if (route.route === '/404') {
        const http404OutFile = path.join(scully_1.scullyConfig.outDir, '404.html');
        fs.writeFileSync(http404OutFile, html);
        console.log(`Started @gammastream/scully-plugin-http404 -- saved 404.html`);
        return Promise.resolve(html);
    }
    else {
        return Promise.resolve(html);
    }
});
exports.http404Plugin = http404Plugin;
const Http404Plugin = 'http404';
const validator = (conf) => __awaiter(void 0, void 0, void 0, function* () { return []; });
(0, scully_1.registerPlugin)('postProcessByHtml', Http404Plugin, exports.http404Plugin, validator);
const getHttp404Plugin = () => Http404Plugin;
exports.getHttp404Plugin = getHttp404Plugin;
/** Plugin by user msacket https://github.com/gammastream/scully-plugins/tree/master/projects/scully-plugin-http404 */ 
//# sourceMappingURL=http404Plugin.js.map