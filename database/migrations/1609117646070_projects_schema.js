'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProjectsSchema extends Schema {
  up () {
    this.create('projects', (table) => {
      table.increments()
      table.string('name', 80).notNullable()
      table.integer('creator_user_id').unsigned().references('id').inTable('users')
      table
        .boolean('status')
        .notNullable()
        .defaultTo(true)
      table.timestamps()
      table.date('deleted_at').nullable()
    })
  }

  down () {
    this.drop('projects')
  }
}

module.exports = ProjectsSchema
