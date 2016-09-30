
require('babel-register')({
	'plugins': [
    	[
      		'babel-plugin-transform-require-ignore',
      	{
	        extensions: ['.scss']
      	}
    	]
  	]
});

const environment = process.env.NODE_ENV
	= (process.env.NODE_ENV || 'production');

if (environment === 'development') {
	require('./src/server').startDev();
}
else {
	require('./src/server').start();
}
