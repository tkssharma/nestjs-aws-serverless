module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testEnvironment: "node",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  restoreMocks: true,
  moduleNameMapper: {
    "^@event-listener(.*)$": "<rootDir>/event-listener/$1",
    "^@lib/(.*)$": ["<rootDir>/lib/$1"],
    "^axios$": "axios/dist/node/axios.cjs",
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
};
