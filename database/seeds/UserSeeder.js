'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
// const Factory = use('Factory')

const User = use('App/Models/User')

class UserSeeder {
  async run () {
    const user = await User.create({
      first_name: 'Daniel',
      last_name: 'Rodriguez',
      email: 'daniel@test.com',
      phone: '+584127550254',
      password: 'task_admin',
      language: 'es',
      status: true
    })
  }
}

module.exports = UserSeeder
