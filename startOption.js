const readline = require("readline");

const options = [
  { label: "projectPattasu FE+BE Dev", cmd: "npm run start:ProjectPattas" },
  { label: "projectPattasu FE+BE render", cmd: "npm run start:ProjectPattasOnrender" },
  { label: "projectPattasu FE+BE:Auto IP - Windows", cmd: "npm run start:windowsRes" },
  { label: "projectPattasu FE+BE:Auto IP - Linux", cmd: "npm run start:linuxRes" },
];

console.log("\nSelect which start command to run:\n");
options.forEach((opt, i) => console.log(`${i + 1}. ${opt.label}`));

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question("\nEnter choice (1-4): ", (input) => {
  const choice = options[parseInt(input) - 1];
  if (choice) {
    console.log(`\nRunning: ${choice.cmd}\n`);
    require("child_process").execSync(choice.cmd, { stdio: "inherit" });
  } else {
    console.log("Invalid choice.");
  }
  rl.close();
});