'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.text('profile_image').nullable()
      table.string('first_name', 80).notNullable()
      table.string('last_name', 80).nullable()
      table.string('email', 254).notNullable().unique()
      table.string('phone', 50).nullable()
      table.string('password', 60).notNullable()
      table.string('language', 10).notNullable()
      table
        .boolean('status')
        .notNullable()
        .defaultTo(true)
      table.timestamps()
      table.date('deleted_at').nullable()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
