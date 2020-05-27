PACKAGER = electron-packager
#PACKAGER = ./node_modules/electron-packager/bin/electron-packager.js
LICENSE_CHECKER = ./node_modules/license-checker/bin/license-checker

run:
	electron --debug=5858 .

init:
	npm install
	chmod 755 $(LICENSE_CHECKER)
	chmod 755 $(PACKAGER)
	

#darwin,win32,linux
build: clean
	$(LICENSE_CHECKER) --production --relativeLicensePath > THIRD-PARTY-LICENSES.md
	$(PACKAGER) . kuroko \
		--out=packaging-work \
		--platform=win32 \
		--arch=x64  \
		--electron-version=9.0.0 \
		--ignore "^/work" \
		--ignore "^/packaging-work" \
		--ignore "^.\\.vscode" \
		--ignore "\\.pdf$$" \
		--ignore "^/node_modules/bootstrap-vue/src" \
		--ignore "^/node_modules/bootstrap-vue/esm" \
		--prune=true	# Exclude devDependencies

DOCUMENTS = README.md LICENSE.md THIRD-PARTY-LICENSES.md
pack: build
	cp $(DOCUMENTS) -t ./packaging-work/
	cd packaging-work/; zip -r kuroko-win32-x64.zip kuroko-win32-x64 $(DOCUMENTS)

	#cd packaging-work/; tar -cvzf kuroko-linux-x64.tar.gz kuroko-linux-x64 $(DOCUMENTS)
	#cd packaging-work/; tar -cvzf kuroko-darwin-x64.tar.gz kuroko-darwin-x64 $(DOCUMENTS)

clean:
	rm packaging-work -r -f

distclean: clean
	rm node_modules -r -f
