'use strict'

const User = use('App/Models/User')
const { validate } = use('Validator')
const Logger = use('Logger')

class UserController {

  async login ({ request, auth }) {
    const { username, password } = request.all()
    const jwt = await auth.attempt(username, password)

    return {
      token: jwt.token
    }
  }

  async registration ({ request, auth, response }) {
    const { email, password, username } = request.all()
    Logger.info('auth', email);
    Logger.info('auth', password);
    Logger.info('auth', username);
    const rules = {
      email: 'required|email|unique:users,email',
      username: 'required|string|unique:users,username',
      password: 'required'
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      return response.status(400).send(validation.messages())
    }

    const user = new User()
    user.password = password
    user.email = email
    user.username = username
    await user.save()


    return await this.login({ request, auth })
  }
}

module.exports = UserController
