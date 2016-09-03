## Notes on Publishing the Material FHIR NPM Package Itself  

1.  Recursively clone the repo from Github with sub dependencies
```sh
git clone -R http://github.com/clinical-meteor/material-fhir-ui
```

2.  Publish to NPM
```sh
cd material-fhir-ui
npm publish .
```
