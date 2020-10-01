module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["node_modules", "test", "fiuba-laboral-v2"],
  globals: {
    "ts-jest": {
      isolatedModules: true
    }
  },
  watchPathIgnorePatterns: ["./node_modules/", "./fiuba-laboral-v2/**/*.ts"],
  testPathIgnorePatterns: [".d.ts", ".js"],
  setupFiles: ["core-js"]
};
