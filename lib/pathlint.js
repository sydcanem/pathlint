'use strict';

var glob    = require( 'glob' );
var path    = require( 'path' );
var fs      = require( 'fs' );
var presets = require( './presets' );

function extractBaseName ( osPath, removeFileExt ) {

	var basename = path.basename( osPath );

	if ( removeFileExt ) {

		// if it is a file, remove the file extension ( only the last part of the filename separated by a dot )
		// e.g. foo.bar.js -> foo.bar
		if ( !fs.lstatSync( osPath ).isDirectory() ) {

			basename = basename.replace( /\.[^/.]+$/, '' );

		}

	}

	return basename;
}

function pathLint ( config, callback ) {

	var nodir = true; // we exclude directories by default

	// we perform some checking on nodir
	// if we receive a non-boolean value or undefined, then ignore it use the default value
	if ( typeof config.nodir !== 'boolean' ) {
		nodir = true;
	} else {
		// if we receive a true/false, use it
		nodir = config.nodir;
	}

	// we remove file extensions by default
	// useful when using a custom regex
	var removeFileExt = true;

	// we perform some checking on removeFileExt
	// if we receive a non-boolean value or undefined, then ignore it use the default value
	if ( typeof config.removeFileExt !== 'boolean' ) {
		removeFileExt = true;
	} else {
		// if we receive a true/false, use it
		removeFileExt = config.removeFileExt;
	}

	var pathPatterns  = config.globRegexp || {};
	var globs         = Object.keys( pathPatterns ); // create an array of globs
	var results       = {};
	var counter       = 0;
	var errCounter    = 0;

	function getPathsAndCompare () {

		if ( counter < globs.length ) {

			var globStr       = globs[ counter ]; // get current glob
			var fileNameRegex = pathPatterns[ globStr ]; // get regex assigned to the current glob
			var regex;

			// If specified regex is one of the presets, use it. If not, then make a new RegExp object
			if ( presets[ fileNameRegex ] !== undefined && presets[ fileNameRegex ] !== null ) {

				regex = presets[ fileNameRegex ];

			} else {
				// check if it is a custom-made pattern
				if ( fileNameRegex instanceof RegExp ) {

					regex = fileNameRegex;

				} else {

					counter = globs.length - 1;
					callback( new Error( 'Invalid pattern for "' + globStr + '"' ), results );
					// stop execution right away
					return;

				}

			}

			glob( globStr, { 'nodir' : nodir }, function ( err, osPaths ) {

				if ( err ) {

					// if an error occurs while globbing, output it
					counter = globs.length - 1;
					callback( err, results );
					// then stop the linting right away
					return;

				}

				results[ globStr ] = {};

				// loop through osPaths return by the glob
				osPaths.forEach( function ( osPath ) {

					// get osPath's base name
					// e.g. test/foo.js -> foo.js (for files)
					// e.g. test/foo/bar -> bar (for directories)
					var basename       = extractBaseName( osPath, removeFileExt );
					var isBaseNameGood = regex.test( basename );

					if ( !isBaseNameGood ) {
						errCounter++;
					}

					results[ globStr ][ osPath ] = isBaseNameGood;

				} );

				counter++;
				getPathsAndCompare();

			} );

		} else {

			if ( errCounter > 0 ) {
				callback( new Error( 'pathLint: ' + errCounter + ' error/s found.' ), results );
			} else {
				callback( null, results );
			}

		}

	}

	getPathsAndCompare();

}

module.exports = pathLint;