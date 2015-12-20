SRC = $(wildcard js/src/*.js)
LIB = $(SRC:js/src/%.js=js/lib/%.js)
BIN = ./node_modules/.bin

develop: ./js/src
	@$(BIN)/watch "make assets" $<

assets: lib browserify

lib: $(LIB)

js/lib/%.js: js/src/%.js
	@mkdir -p $(@D)
	@$(BIN)/babel $< -o $@

browserify: js/lib/main.js
	@$(BIN)/browserify $< -o js/bundle.js
