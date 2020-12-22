export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ["<rootDir>/lib/", "/node_modules/"],
  "setupFilesAfterEnv": ['./src/setupTests.js'],
};
