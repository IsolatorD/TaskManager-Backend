'use strict'
const { validateAll, validate } = use('Validator')
const Hash = use('Hash')
const Env = use('Env')
const Helpers = use('Helpers')

const JsonException = use('App/Exceptions/JsonException')
const ValidationException = use('App/Exceptions/ValidationException')

const User = use('App/Models/User')

class AuthController {
  async login ({ request, auth, response}) {
    const rules = {
      email: 'required|email',
      password: 'required|string'
    }
    
    const {
      email,
      password
    } = request.only([
      'email',
      'password'
    ])

    const validation = await validateAll({ email, password }, rules)
    if (validation.fails()) {
      throw new ValidationException(validation.messages())
    }

    try {
      const token = await auth
        .withRefreshToken()
        .query(builder => {
          builder.where('status', true)
        })
        .attempt(email, password)

      const user = await User.query()
        .where('email', email)
        .first()

      return response.json({ token, uid: user.id })
    } catch (error) {
      throw new JsonException({ error })
    }
  }

  async register ({ request, response }) {
    const rules = {
      first_name: 'required|string',
      last_name: 'string',
      email: 'required|email',
      phone: 'string',
      password: 'required|string|confirmed', // enviar campo password_confirmation para ejecutar esta regla
      language: 'string'
    }
    const {
      first_name,
      last_name,
      email,
      phone,
      password,
      language
    } = request.all()

    const emailNotAvailable = await User.findBy('email', email)

    if (emailNotAvailable) {
      return response.status(400).send([
        {
          message: 'email already taken',
          field: 'email',
          validation: 'unique'
        }
      ])
    }

    const validation = await validate(request.all(), rules)
    if (validation.fails()) {
      throw new ValidationException(validation.messages())
    }

    try {
      const user = await User.create({
        first_name,
        last_name,
        email,
        phone,
        password,
        language
      })

      return { success: true, user }
    } catch (error) {
      throw new JsonException({ error })
    }
  }

  async profile ({ request, auth, response }) {
    const { user } = auth
    if (user.profile_image) {
      user.profile_image = `${Helpers.tmpPath()}/users/${user.profile_image}`
      // user.profile_image = `${Env.get('APP_URL')}/users/${
      //   user.profile_image
      // }`
    }

    return response.json({ success: true, user })
  }

  async update ({ request, auth, response }) {
    const { user } = auth

    const rules = {
      first_name: 'string',
      last_name: 'string',
      language: 'string',
      profile_image: 'file_ext:png,jpg|file_size:2mb|file_types:image'
    }

    const validation = await validateAll(request.all(), rules)
    if (validation.fails()) {
      throw new ValidationException(validation.messages())
    }

    const {
      first_name,
      last_name,
      language
    } = request.all()

    try {

      const profileFile = request.file('profile_image', {
        types: ['image'],
        size: '2mb'
      })
      let profile_image_src = null
      if (profileFile) {
        profile_image_src = `profile-${user.id}.${profileFile.extname}`
        await profileFile.move(Helpers.tmpPath('users'), {
          name: profile_image_src,
          overwrite: true
        })

        if (!profileFile.moved()) {
          throw 'upload_image_error'
        }
      }

      user.merge({
        first_name,
        last_name,
        language,
        profile_image: profile_image_src
      })
      await user.save()

      return { success: true, user }
    } catch (error) {
      throw new JsonException({ error })
    }
  }

  async updatePassword({ request, auth, response }) {
    const rules = {
      currentPassword: 'required|string',
      newPassword: 'required|string|confirmed' // enviar campo newPassword_confirmation para ejecutar esta regla
    }
    const { newPassword, currentPassword } = request.all()

    const validation = await validateAll(request.all(), rules)
    if (validation.fails()) {
      throw new ValidationException(validation.messages())
    }
    const { user } = auth
    try {
      const isSame = await Hash.verify(currentPassword, user.password)
      if (!isSame) {
        return response.status(401).send([
          {
            message: 'user_password_not_match',
            field: 'currentPassword',
            validation: 'match'
          }
        ])
      }
      user.password = newPassword
      await user.save()

      return response.json({ success: true })
    } catch (error) {
      throw new JsonException({ error })
    }
  }

}

module.exports = AuthController
