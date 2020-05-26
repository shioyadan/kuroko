PACKAGER = electron-packager
#PACKAGER = ./node_modules/electron-packager/cli.js 

run:
	electron --debug=5858 .

init:
	npm install
	chmod 755 ./node_modules/license-checker/bin/license-checker

build: clean
	./node_modules/license-checker/bin/license-checker --production --relativeLicensePath > THIRD-PARTY-LICENSES.md
	$(PACKAGER) . kuroko \
		--out=packaging-work \
		--platform=darwin,win32,linux \
		--arch=x64  \
		--electron-version=6.0.1 \
		--ignore work \
		--ignore packaging-work \
		--ignore .vscode \
		--prune=true	# Exclude devDependencies

DOCUMENTS = README.md LICENSE.md THIRD-PARTY-LICENSES.md
pack: build
	cp $(DOCUMENTS) -t ./packaging-work/
	cd packaging-work/; zip -r kuroko-win32-x64.zip kuroko-win32-x64 $(DOCUMENTS)
	cd packaging-work/; tar -cvzf kuroko-linux-x64.tar.gz kuroko-linux-x64 $(DOCUMENTS)
	cd packaging-work/; tar -cvzf kuroko-darwin-x64.tar.gz kuroko-darwin-x64 $(DOCUMENTS)

clean:
	rm packaging-work -r -f

distclean: clean
	rm node_modules -r -f
