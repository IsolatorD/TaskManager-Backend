'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TasksCollaboratorsSchema extends Schema {
  up () {
    this.create('tasks_collaborators', (table) => {
      table.increments()
      table.boolean('is_responsable').defaultTo(false)
      table
        .integer('task_id')
        .unsigned().references('id')
        .inTable('tasks')
      table
        .integer('user_id')
        .unsigned().references('id')
        .inTable('users')
      table.timestamps()
      table.date('deleted_at').nullable()
    })
  }

  down () {
    this.drop('tasks_collaborators')
  }
}

module.exports = TasksCollaboratorsSchema
