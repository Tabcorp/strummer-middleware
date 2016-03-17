BIN=./node_modules/.bin


# Ensure all npm deps are present
install:
	npm install ;

test: install
	NODE_ENV=test ${BIN}/mocha test
	@echo "Unit tests passed!";
