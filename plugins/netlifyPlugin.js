const { registerPlugin } = require('@scullyio/scully');
const { writeFileSync } = require('fs');
const { join } = require('path');
function netlifyPlugin() {
    const redirectsContent = '/* /404/index.html 404';
    console.log(typeof redirectsContent);
    const outputPath = join('./dist/static', '_redirects');
    writeFileSync(outputPath, redirectsContent);
    return Promise.resolve([]);
}
registerPlugin('postProcessByHtml', 'netlifyPlugin', netlifyPlugin);
//# sourceMappingURL=netlifyPlugin.js.map