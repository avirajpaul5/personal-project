// Simple script to check for build warnings
const { execSync } = require("child_process");

try {
  console.log("Running Vite build...");
  const output = execSync("npx vite build", { encoding: "utf8" });
  console.log("Build output:");
  console.log(output);

  // Check for the specific warning
  if (output.includes("splitVendorChunk")) {
    console.log("\nWARNING: The splitVendorChunk warning is still present!");
  } else {
    console.log("\nSUCCESS: No splitVendorChunk warning found!");
  }
} catch (error) {
  console.error("Build failed:", error.message);
  if (error.stdout) {
    console.log("Output:", error.stdout);
  }
  if (error.stderr) {
    console.log("Error output:", error.stderr);
  }
}
