'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TasksSchema extends Schema {
  up () {
    this.create('tasks', (table) => {
      table.increments()
      table.string('name', 80).notNullable()
      table.text('description').nullable()
      table.date('deadline').nullable()
      table
        .integer('creator_user_id')
        .unsigned().references('id')
        .inTable('users')
      table
        .integer('project_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .nullable()
      table
        .boolean('status')
        .notNullable()
        .defaultTo(true)
      table.timestamps()
      table.date('deleted_at').nullable()
    })
  }

  down () {
    this.drop('tasks')
  }
}

module.exports = TasksSchema
