function args() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Missing server arguments");
    process.exit(1);
  }

  try {
    return JSON.parse(args[0].slice(1, -1));
  } catch (error) {
    console.error("Error parsing server arguments:", error);
    process.exit(1);
  }
}

export default { args };
