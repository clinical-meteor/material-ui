## Notes on Publishing the Material FHIR NPM Package Itself  

1.  Recursively clone the repo from Github with sub dependencies
```sh
git clone -R http://github.com/clinical-meteor/material-fhir-ui
cd material-fhir-ui
```

2.  Sync Submodules to Latest
```sh
? git submodule sync ?
? git init ?
? git update  ?
```

3.  Make edits to package
```sh
```

3.  Publish to NPM
```sh
npm publish .
```
