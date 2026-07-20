// Usage: node scripts/hash-password.mjs "your-new-password"
// Copy the printed hash into the ADMIN_PASSWORD_HASH environment variable
// on the public-site Vercel project, then redeploy.
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password || password.length < 8) {
  console.error("Provide a password of at least 8 characters as the first argument.");
  console.error('Example: node scripts/hash-password.mjs "My-Str0ng-Password!"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log("\nADMIN_PASSWORD_HASH=" + hash + "\n");
console.log("Add this exact value as an environment variable named ADMIN_PASSWORD_HASH");
console.log("on the public-site Vercel project (Settings -> Environment Variables),");
console.log("then redeploy public-site for it to take effect.");
