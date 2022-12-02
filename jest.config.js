module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  preset: "ts-jest",
  testPathIgnorePatterns: ["/node_modules/", "/__tests__/sets"],
  coveragePathIgnorePatterns: ["/node_modules/", "/__tests__/sets"],
};
