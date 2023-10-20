/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const { folders, forbiddenDependencies, whitelist } = require("./config");
const { fi: texts } = require("./textResources");

// Funktio, joka etsii tiedoston kaikki riippuvuudet ja kielletyt riippuvuudet
function searchFileDependencies(filePath, forbiddenDependencies, whitelist) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const dependencyRegex = /import\s+(?:[\w\s{},]+)\s+from\s+['"]([^'"]+)['"]/g;
  const dependencies = new Set();
  const forbiddenDeps = [];

  let match;
  while ((match = dependencyRegex.exec(fileContent))) {
    const dependency = match[1];
    if (dependency && dependency !== "") {
      const filteredForbids = forbiddenDependencies.filter(
        (forbid) => dependency.includes(forbid) && !filePath.includes(forbid) && !whitelist.includes(filePath)
      );

      forbiddenDeps.push(...filteredForbids);
      dependencies.add(dependency);
    }
  }

  return { dependencies: Array.from(dependencies), forbidden: forbiddenDeps };
}

// Funktio, joka etsii kaikki riippuvuudet tiedostopuusta
function findAllDependencies(entryFilePath, forbiddenDependencies, whitelist) {
  const allDependencies = new Set();
  const foundForbiddenDependencies = [];
  const queue = [entryFilePath];

  while (queue.length > 0) {
    const currentPath = queue.shift();
    const stats = fs.statSync(currentPath);

    if (stats.isDirectory()) {
      const files = fs.readdirSync(currentPath);
      queue.push(...files.map((file) => path.join(currentPath, file)));
    } else if (stats.isFile()) {
      const { dependencies, forbidden } = searchFileDependencies(currentPath, forbiddenDependencies, whitelist);

      dependencies.forEach((dep) => allDependencies.add(dep));

      if (forbidden.length > 0) {
        foundForbiddenDependencies.push({
          Tiedostopolku: currentPath.replace(/\\/g, "/"),
          KielletytRiippuvuudet: forbidden,
        });
      }
    }
  }

  return {
    Riippuvuudet: Array.from(allDependencies),
    Kielletyt: foundForbiddenDependencies,
  };
}

// Funktio, jolla poistetaan duplikaatit
function removeDuplicates(arr) {
  return Array.from(new Set(arr.map((json) => JSON.stringify(json)))).map((string) => JSON.parse(string));
}

// Taulukko, jossa whitelistattut polut on muutettu sopivaan muotoon.
const modifiedWhitelist = whitelist.map((file) => file.replace(/\//g, "\\"));

// Taulukko, jossa kaikki tarkasteltavien kansoiden riippuvuudet.
const dependencyList = folders.map((folder) => ({
  Kansio: folder,
  ...findAllDependencies(folder, forbiddenDependencies, modifiedWhitelist),
}));

// Funktio, jolla haetaan kaikki kielletyt riippuvuudet ja yhdistetään ne yhdeksi taulukoksi
function getForbiddenList() {
  const forbiddenList = dependencyList
    .map((listItem) => listItem.Kielletyt)
    .filter((forbid) => forbid.length !== 0)
    .flatMap((innerArr) => innerArr);

  return removeDuplicates(forbiddenList);
}

function dependenciesTool() {
  const args = process.argv;
  const red = "\x1b[31m%s\x1b[0m";

  if (args[2] === "printAll") {
    console.log(JSON.stringify(dependencyList, null, 2));
  } else if (args[2] === "printForbidden") {
    console.log(JSON.stringify(getForbiddenList(), null, 2));
  } else if (args[2] === "commitCheck") {
    if (getForbiddenList().length > 0) {
      console.log(red, texts.preCommitErrorMsg);
      return false;
    }
    return true;
  } else {
    console.log(red, "'" + args[2] + "'" + texts.argumetnError);
  }
}

dependenciesTool();

module.exports = { searchFileDependencies, findAllDependencies };
