# Kuroko

Kuroko is a small tool to convert from EMF to PDF. 

* You can download a pre-compiled package (kuroko-win32-x64.zip) for Windows (10/11) from [here](https://github.com/shioyadan/kuroko/releases).
* A typical use of this tool is to create PDF files from PowerPoint/Excel for use in LaTeX.
* It captures EMF data from a clipboard and converts it to PDF.
* In a similar way as [MetafileToEPSConverter](https://wiki.lyx.org/Windows/MetafileToEPSConverter), which makes EPS files, you can make PDF files from figures on PowerPoint/Excel and can use them in LaTeX.
* Kuroko can run only on Windows 10/11, because it relies on "Microsoft Print to PDF" printer.
* It relies on a small command line tool [Kuroko-CLI](https://github.com/shioyadan/kuroko-cli).

![demo](kuroko.gif)


## Known issues

* Translucent objects are not converted correctly.
* Mixing raster and vector images in PowerPoint may lead to incorrect results.


## How to build

Non-developer users are recommended to use a pre-compiled binary available [here](https://github.com/shioyadan/kuroko/releases).

* Install the following:
    * Cygwin & GNU Make
    * node.js
    * Visual Studio Build Tools 2019 - C++ Build Tools 
* Run these commands in Cygwin.
    ```
    npm install electron electron-packager -g
    make init 
    make run   # Launch kuroko directly 
    make pack  # Build a release binary
    ```


## License

Copyright (C) 2020-2023 Ryota Shioya <shioya@ci.i.u-tokyo.ac.jp>
This application is released under the 3-Clause BSD License, see LICENSE.md. This application bundles Kuroko-CLI (https://github.com/shioyadan/kuroko-cli).
This application also bundles ELECTRON and many third-party packages in accordance with the licenses presented in THIRD-PARTY-LICENSES.md.
