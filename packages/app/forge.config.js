const path = require("path");
const fs = require("fs");
const rimraf = require("rimraf");
const webpackMainSettings = require("./webpack.main.config");
const rootDir = process.cwd();

function copyFileSync(source, target) {
  var targetFile = target;

  // If target is a directory, a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
  var files = [];

  // Check if folder needs to be created or integrated
  var targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      var curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}

module.exports = {
  packagerConfig: {
    asar: true,
    icon: "assets/icon.ico",
    extraResource: [".resources/node_modules", "assets"],
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "coh2-game-stats",
        setupIcon: "assets/icon.ico",
        loadingGif: "assets/installSplash.gif",
      },
    },
  ],
  hooks: {
    prePackage: () => {
      // make sure all external libraries are packaged
      const libDest = path.join(rootDir, ".resources", "node_modules");
      if (!fs.existsSync(libDest)) {
        fs.mkdirSync(libDest, { recursive: true });
      }
      const modules = path.join(rootDir, "..", "..", "node_modules");
      const externalEntries = Object.entries(webpackMainSettings.externals);
      // append antd to have access to the newest css minified files for the stream overlay
      externalEntries.push(["antd", "antd"]);
      for (const [key, value] of externalEntries) {
        const libPath = path.join(modules, key);
        if (fs.existsSync(libPath)) {
          copyFolderRecursiveSync(libPath, libDest);
          // remove node_modules in lib folder
          const libModules = path.join(libDest, key, "node_modules");
          rimraf.sync(libModules);
        } else {
          throw new Error("Cannot find library " + key + " in ./node_modules folder");
        }
      }
    },
  },
  plugins: [
    [
      "@electron-forge/plugin-webpack",
      {
        mainConfig: "./webpack.main.config.js",
        // This allows us to connect to the firebase from the render process
        // It's a security risk, but also only way to make it work?
        // More info here https://github.com/electron-userland/electron-forge/issues/2331
        devContentSecurityPolicy: `default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;`,
        renderer: {
          config: "./webpack.renderer.config.js",
          entryPoints: [
            {
              html: "./src/renderer/windows/main/index.html",
              js: "./src/renderer/windows/main/index.tsx",
              name: "main_window",
              preload: {
                js: "./src/renderer/windows/preload.tsx",
              },
            },
            {
              html: "./src/renderer/windows/settings/index.html",
              js: "./src/renderer/windows/settings/index.tsx",
              name: "settings_window",
              preload: {
                js: "./src/renderer/windows/preload.tsx",
              },
            },
            {
              html: "./src/renderer/windows/about/index.html",
              js: "./src/renderer/windows/about/index.tsx",
              name: "about_window",
              preload: {
                js: "./src/renderer/windows/preload.tsx",
              },
            },
          ],
        },
      },
    ],
  ],
};
