module.exports = {
	//preset: "@shelf/jest-mongodb",
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.json'
		}
	},
	setupFiles: ["jest-date-mock"],
	moduleFileExtensions: [
		'ts',
		'js'
	],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest'
	},
	testMatch: [
		'**/test/**/*.test.(ts|js)'
	],
	coveragePathIgnorePatterns: [
		'test'
	],
	testEnvironment: 'node'
};