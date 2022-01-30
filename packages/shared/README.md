This is package to store the shared code between
other packages. This package should NEVER include
anything from other packages.

Other packages should NEVER include anything from each other
everything should be put into this package. This is to avoid
circular dependencies.

**Currently we are only able to share the code
between the functions package and app package.
The stupid react app doesn't support it**
https://github.com/facebook/create-react-app/issues/9127
