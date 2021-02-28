MAKEFLAGS += --silent

build:
	zip -r build.zip index.html index.js index.css manifest.json icons >/dev/null && echo "Build available in build.zip"
clean:
	rm build.zip 2>/dev/null || echo "No build exists"
