# react-cambrian-ui
Components for react front end

Developing and testing UI locally. Within third party project, create an npm link to this one. This will replace the node module already installed. 

Importantly, all development branches MUST have the same development version of react and react-dom. These projects can either sync using a script or in the case of this project be updated to "latest." Another option would be utilizing a global or a symbolic version.   

https://docs.npmjs.com/cli/link.html
```
cd ~/projects/node-redis    # go into the package directory
npm link                    # creates global link
cd ~/projects/node-bloggy   # go into some other package directory.
npm link redis              # link-install the package
```
