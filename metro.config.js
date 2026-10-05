// Metro (the bundler) settings. https://docs.expo.dev/guides/customizing-metro/
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// `three` ships a CommonJS file (build/three.cjs) that Metro picks for require() on phones. Since three 0.18x that file
// calls process.emitWarning, which only exists in Node.js, so on a phone the whole 3D library crashes while loading
// ("undefined is not a function"). Send every `three` import straight to its real ES module build instead. All
// imports (ours and react-three-fiber's) end up on the same file, so there is still only one copy of three.
const THREE_MODULE = path.resolve(__dirname, 'node_modules/three/build/three.module.js');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'three') {
    return { type: 'sourceFile', filePath: THREE_MODULE };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
