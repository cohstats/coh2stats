const path = require('path');
const fs = require("fs");
const rimraf = require("rimraf");
const webpackMainSettings = require("./webpack.main.config");
const rootDir = process.cwd();

function copyFileSync( source, target ) {

  var targetFile = target;

  // If target is a directory, a new file with the same name will be created
  if ( fs.existsSync( target ) ) {
      if ( fs.lstatSync( target ).isDirectory() ) {
          targetFile = path.join( target, path.basename( source ) );
      }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
  var files = [];

  // Check if folder needs to be created or integrated
  var targetFolder = path.join( target, path.basename( source ) );
  if ( !fs.existsSync( targetFolder ) ) {
      fs.mkdirSync( targetFolder );
  }

  // Copy
  if ( fs.lstatSync( source ).isDirectory() ) {
      files = fs.readdirSync( source );
      files.forEach( function ( file ) {
          var curSource = path.join( source, file );
          if ( fs.lstatSync( curSource ).isDirectory() ) {
              copyFolderRecursiveSync( curSource, targetFolder );
          } else {
              copyFileSync( curSource, targetFolder );
          }
      } );
  }
}



module.exports = {
  packagerConfig: {
    asar: true,
    icon: "assets/icon.ico",
    extraResource: [
      ".resources/node_modules",
      "assets"
    ]
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "app",
        setupIcon: "assets/icon.ico"
      }
    }
  ],
  hooks: {
    prePackage: () => {
      // make sure all external libraries are packaged
      console.log(rootDir);
      const libDest = path.join(rootDir, ".resources", "node_modules");
      if (!fs.existsSync(libDest)) {
        fs.mkdirSync(libDest, { recursive: true })
      }
      const modules = path.join(rootDir, "..", "..", "node_modules");
      for (const [key, value] of Object.entries(webpackMainSettings.externals)) {
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
    }
  },
  plugins: [
    [
      "@electron-forge/plugin-webpack",
      {
        mainConfig: "./webpack.main.config.js",
        renderer: {
          config: "./webpack.renderer.config.js",
          entryPoints: [
            {
              html: "./src/renderer/windows/match/index.html",
              js: "./src/renderer/windows/match/index.tsx",
              name: "match_window"
            },
            {
              html: "./src/renderer/windows/settings/index.html",
              js: "./src/renderer/windows/settings/index.tsx",
              name: "settings_window"
            }
          ]
        }
      }
    ]
  ]
}
