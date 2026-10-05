// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    // react-three-fiber code: three.js objects (camera, scene, materials) are meant to be changed in place, and its JSX
    // uses 3D-specific props such as `args`, `position` and `attach` that the DOM-oriented rules do not know.
    files: ["src/components/car3d/**"],
    rules: {
      "react-hooks/immutability": "off",
      "react/no-unknown-property": "off",
    },
  },
]);
