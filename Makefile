# This file is assumed to be used with MAKE in cygwin

PACKAGER = electron-packager
#PACKAGER = ./node_modules/electron-packager/bin/electron-packager.js
LICENSE_CHECKER = npx license-checker

run: kuroko-cli/kuroko-cli.exe dist/external_modules.js
	electron --debug=5858 .

# Bundle external libraries into a single file (dist/external_modules.js)
dist/external_modules.js: external_modules_src.js webpack.config.js
	rm dist/*.js -f
	npx webpack --config=webpack.config.js

# Build kuroko-cli
kuroko-cli/kuroko-cli.exe:
	cd kuroko-cli; ./build_shell.bat nmake build_release


init:
	npm install

# Build a electron binary
build: clean kuroko-cli/kuroko-cli.exe dist/external_modules.js
	$(LICENSE_CHECKER) --production > THIRD-PARTY-LICENSES.md
	$(PACKAGER) . kuroko \
		--out=packaging-work \
		--platform=win32 \
		--arch=x64  \
		--electron-version=9.0.5 \
		--ignore "^/work" \
		--ignore "^/packaging-work" \
		--ignore "^/node_modules" \
		--ignore "^.\\.vscode" \
		--ignore "\\.pdf$$" \
		--ignore "^/kuroko-cli/(?!kuroko-cli.exe)" \
		--prune=true	# Exclude devDependencies

DOCUMENTS = README.md LICENSE.md THIRD-PARTY-LICENSES.md
pack: build
	cp $(DOCUMENTS) -t ./packaging-work/
	cd packaging-work/; zip -r kuroko-win32-x64.zip kuroko-win32-x64 $(DOCUMENTS)

	#cd packaging-work/; tar -cvzf kuroko-linux-x64.tar.gz kuroko-linux-x64 $(DOCUMENTS)
	#cd packaging-work/; tar -cvzf kuroko-darwin-x64.tar.gz kuroko-darwin-x64 $(DOCUMENTS)

clean:
	rm dist/*.js -f
	rm packaging-work -r -f
	cd kuroko-cli; ./build_shell.bat nmake clean

distclean: clean
	rm node_modules -r -f
