// nameValidation.js
const prompt = require("prompt");
const chalk = require("chalk");

prompt.start();

prompt.get(["name"], function (err, result) {
  if (err) return console.error(err);

  const name = result.name;
  const firstLetter = name.charAt(0);

  if (firstLetter !== firstLetter.toUpperCase()) {
    console.log(chalk.red("Error: First letter must be uppercase!"));
  } else {
    console.log(chalk.bgBlue.white(`Hello, ${name}!`));
  }
});
