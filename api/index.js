const environment = process.env.NODE_ENV
	= (process.env.NODE_ENV || 'production');

if (environment === 'development') {
	require('./src').startDev();
}
else {
	require('./src').start();
}
