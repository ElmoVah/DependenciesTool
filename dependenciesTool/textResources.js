const eng = {
  argumetnError: " is not a proper argument.",
  preCommitErrorMsg:
    'Project contains forbidden dependencies! Use "npm run dependencies:forbidden" to list all forbidden dependencies in the project.',
};

const fi = {
  argumetnError: " on virheellinen argumentti.",
  preCommitErrorMsg:
    'Projekti sisältää kiellettyjä riippuvuuksia! Käytä komentoa "npm run dependencies:forbidden" listataksesi kaikki kielletyt riippuvuudet projektissa.',
};

module.exports = { fi, eng };
