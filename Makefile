setup:
	npm install
lint:
	npm run eslint .
run:
	npm run babel-node src/index.js
test:
	npm test

.PHONY: test