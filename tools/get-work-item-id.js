const isoString = new Date().toISOString();
const id = isoString.replace(/[-T:Z.]/g, '').slice(0, 14);

process.stdout.write(`${id}\n`);
