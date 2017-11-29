const dev = () => {
	return async function logger (ctx, next) {
		console.log('this is a middleware');
		try {
			await next();
		} catch(err) {
			throw err
		}
	}
}
module.exports = dev;