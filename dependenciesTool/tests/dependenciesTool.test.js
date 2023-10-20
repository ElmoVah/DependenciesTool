const { searchFileDependencies, findAllDependencies } = require("../dependenciesTool");

describe("searchFileDependencies", () => {
  it("Tunnistaa oikein kielletyt riippuvuudet", () => {
    const filePath = "dependenciesTool/tests/testFiles/test1.txt";
    const forbiddenDependencies = ["Testi1", "Testi2", "Testi3", "Testi4"];
    const whitelist = [];

    const { dependencies, forbidden } = searchFileDependencies(filePath, forbiddenDependencies, whitelist);

    expect(dependencies).toEqual(["shared/components/Testi1", "./Testi2", "../Testi3", "../Testi4"]);
    expect(forbidden).toEqual(["Testi1", "Testi2", "Testi3", "Testi4"]);
  });

  it("Jättää huomiotta virheelliset riippvuudet", () => {
    const filePath = "dependenciesTool/tests/testFiles/test1.txt";
    const forbiddenDependencies = ["Testi21", "Testi22", "Testi23"];
    const whitelist = [];

    const { dependencies, forbidden } = searchFileDependencies(filePath, forbiddenDependencies, whitelist);

    expect(dependencies).toEqual(["shared/components/Testi1", "./Testi2", "../Testi3", "../Testi4"]);
    expect(forbidden).toEqual([]);
  });

  it("Whitelistaus toimii", () => {
    const filePath = "dependenciesTool/tests/testFiles/test1.txt";
    const forbiddenDependencies = ["Testi1", "Testi2", "Testi3"];
    const whitelist = ["dependenciesTool/tests/testFiles/test1.txt"];

    const { dependencies, forbidden } = searchFileDependencies(filePath, forbiddenDependencies, whitelist);

    expect(dependencies).toEqual(["shared/components/Testi1", "./Testi2", "../Testi3", "../Testi4"]);
    expect(forbidden).toEqual([]);
  });

  it("Ei palauta kiellettynä, jos kielletty on osa tiedostopolkua", () => {
    const filePath = "dependenciesTool/tests/testFiles/test1.txt";
    const forbiddenDependencies = ["testFiles"];
    const whitelist = [];

    const { dependencies, forbidden } = searchFileDependencies(filePath, forbiddenDependencies, whitelist);

    expect(dependencies).toEqual(["shared/components/Testi1", "./Testi2", "../Testi3", "../Testi4"]);
    expect(forbidden).toEqual([]);
  });
});

describe("searchAllDependencies", () => {
  it("Löytää kielletyt riippuvuudet kansion tiedostoista", () => {
    const entryFilePath = "dependenciesTool/tests/testFiles/";
    const forbiddenDependencies = ["Testi1", "Testi2", "Testi3", "Testi4", "Testaus1", "Testaus2"];
    const whitelist = [];

    const response = findAllDependencies(entryFilePath, forbiddenDependencies, whitelist);

    expect(response).toEqual({
      Riippuvuudet: [
        "shared/components/Testi1",
        "./Testi2",
        "../Testi3",
        "../Testi4",
        "shared/components/Testaus1",
        "./Testaus2",
      ],
      Kielletyt: [
        {
          Tiedostopolku: "dependenciesTool/tests/testFiles/test1.txt",
          KielletytRiippuvuudet: ["Testi1", "Testi2", "Testi3", "Testi4"],
        },
        {
          Tiedostopolku: "dependenciesTool/tests/testFiles/testaus.txt",
          KielletytRiippuvuudet: ["Testaus1", "Testaus2"],
        },
      ],
    });
  });

  it("Whitelistaus toimii", () => {
    const entryFilePath = "dependenciesTool/tests/testFiles/";
    const forbiddenDependencies = ["Testi1", "Testi2", "Testi3", "Testi4", "Testaus1", "Testaus2"];
    const whitelist = [
      "dependenciesTool/tests/testFiles/test1.txt",
      "dependenciesTool/tests/testFiles/testaus.txt",
    ].map((file) => file.replace(/\//g, "\\"));

    const response = findAllDependencies(entryFilePath, forbiddenDependencies, whitelist);

    expect(response).toEqual({
      Riippuvuudet: [
        "shared/components/Testi1",
        "./Testi2",
        "../Testi3",
        "../Testi4",
        "shared/components/Testaus1",
        "./Testaus2",
      ],
      Kielletyt: [],
    });
  });
});
