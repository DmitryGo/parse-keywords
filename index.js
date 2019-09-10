require('babel-core/register')({
	cache: false,
});

require('babel-polyfill');


require('./src/app.js');
