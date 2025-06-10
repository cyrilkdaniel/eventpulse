export default {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: ["**/__tests__/**/*.test.js"],
  verbose: true,
  transformIgnorePatterns: [],
  moduleFileExtensions: ["js", "json"],
  testEnvironmentOptions: {
    url: "http://localhost",
  },
};
