# pathlint
[![Build Status][ci-badge]][ci-badge-link]
[![Dependency Status][david-badge]][david-badge-link]
[![devDependency Status][david-dev-badge]][david-dev-badge-link]

Enforces specific file/directory name patterns for uniformity. It matches file/directory names in the current working directory. Great for projects involving several developers.

#### Usage example
```javascript
var pathLint = require( 'pathlint' );

var config = {
    'nodir'         : true,
    'removeFileExt' : true,
    'globRegexp'    : {
        'lib/**/*'  : 'CAMEL_CASE',
        'test/*.js' : 'HYPHEN_CASE'
    }
}

pathLint( config, function ( err, results ) {
    if ( err ) {
        console.log( err );
    }
    console.log( results );
} );
```

Parameters:
- `nodir` subdirectories are ignored in checking when set to `true`, not when `false`, defaults to `true` when not explicitly set
- `removeFileExt` file extensions are ignored in checking when set to `true`. This is useful when you have a custom `RegExp` for a set of files and you decide to include the file extensions in checking. Defaults to `true` when not explicitly set.

> *Warning:*
> If you have `foo.test.js` with `removeFileExt` enabled, `.js` will be ignored and only `foo.test` will be checked.

- `globRegexp` accepts a set of globs and their corresponding `RegExp` patterns. Patterns could be one of the presets or custom RegExp object you can define. In the example above, `'test/*.js' : 'HYPHEN_CASE'` means all files that have the `.js` file extension will have their filenames checked whether they satify the `HYPHEN_CASE` pattern or not.

> Read more [here](https://github.com/isaacs/node-glob) to know more how globbing works.
> Presets assume `removeFileExt` is `true`. You need to create your own `RegExp` pattern if you want file extensions to be included in checking. To see the list of presets, go [here](https://github.com/School-Improvement-Network/pathlint/blob/master/lib/presets.js).

Returns:
- `err` if an error occurs. Errors will be either the number of mismatches in the file/directory names after checking them with the defined patterns or other errors that may occur during the checking (e.g. during globbing). Otherwise, this returns `null`.
- `results` shows the results of the checking in `JSON` format. File/directory names that pass the checking are paired with `true`, otherwise `false`. For example, if we assume that we input a `globRegexp` value similar to the usage example above, the `results` could return:
```javascript
{
    'lib/**/*': {
        'lib/pathlint.js' : true,
        'lib/presets.js'   : true
    },
    'test/*.js' : {
        'test/pathlint.js' : true
    }
}
```
Where `'lib/**/*'` and `'test/*.js'` are the globs, and their children values are the matched files based on the respective glob (includes the full path relative to the current working directory) and their corresponding `true/false` values, whether they pass the checking or not.

#### Using a custom pattern
If you want to use a pattern that is not available in the presets (well, at least not available yet, or is just unique for your organization), you can create a new `RegExp` object with a your custom pattern defined as its argument. Let's say we just use the same example above and replace the preset patterns defined with your own custom-made one:
```javascript
'globRegexp' : {
    'lib/**/*'  : new RegExp( /[a-z]/ ),
    'test/*.js' : new RegExp( /[A-Z]/ )
}
```
This is useful when you decide to include the file extension in your checking, provided that `removeFileExt` is `false`, since the presets only assume that file extensions are ignored.

#### As a Command-Line Tool
```bash
pathlint --config .yourconfigfile
```
Returns a prettified version of the linting results on the command line. Using the example results above, its command line version result would look like this:
```bash
lib/**/*:
  lib/pathlint.js: true
  lib/presets.js:  true
test/*.js:
  test/pathlint.js: true
```
It receives only one argument (as of the moment) which is `--config .yourconfigfile`, where `.yourconfigfile` contains the configuration values in linting. Using the example above, `.yourconfigfile` would contain:
```JSON
{
	"globRegexp" : {
		"lib/**/*"  : "HYPHEN_CASE",
		"test/*.js" : "HYPHEN_CASE",
		"bin/*"     : "HYPHEN_CASE"
	}
}
```
> *Important:* Always use double-quotes in object literals, or else parsing this file will not work.

If no `--config` is passed, the `pathlint` command will automatically look for a `.pathlintrc` file in the current working directory. If the specified file or `.pathlintrc` is not found, `pathlint` will return an error.

## Unit Testing
To run the unit tests, do `gulp test` in your terminal. If nothing complains, congrats!

###### Coverage
We strive for 100% coverage in all categories (Statements, Branches, Functions, Lines) to make sure the code is working as intended. If you have problems reaching 100%, review your code or unit test, or contact us, we might be able to help you. :-)

## Contributing
This project abides to the [Open Code of Conduct](http://todogroup.org/opencodeofconduct/#pathlint/opensource@github.com). By participating, you will honor this code.

1. Fork
2. Create a branch and commit your changes
3. Run `npm run lint` to check for linting, `npm test` for unit tests, if there are any errors, fix them, then push
4. Open a pull request
5. While waiting, enjoy yourself walking your pet dog, or go to the gym.


[david-badge]: https://david-dm.org/School-Improvement-Network/pathlint.svg
[david-badge-link]: https://david-dm.org/School-Improvement-Network/pathlint
[david-dev-badge]: https://david-dm.org/School-Improvement-Network/pathlint/dev-status.svg
[david-dev-badge-link]: https://david-dm.org/School-Improvement-Network/pathlint
[david-dev-badge-link]: https://david-dm.org/School-Improvement-Network/pathlint#info=devDependencies
[ci-badge]: https://circleci.com/gh/School-Improvement-Network/pathlint.svg?style=shield
[ci-badge-link]: https://circleci.com/gh/School-Improvement-Network/pathlint
