const userService = require('../services/user.js')
module.exports = {
	async register(ctx) {
		try {
			let result = {
		      success: true,
		      message: '',
		      data: null,
		      code: 200
		    }
		    await userService.create({
		    	username: 'pcd333',
		    	password: '1234'
		    })
		    ctx.body = result
		} catch(err) {
		    console.log(err)
		}
	}
}