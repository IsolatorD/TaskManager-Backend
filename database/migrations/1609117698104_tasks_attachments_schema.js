'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TasksAttachmentsSchema extends Schema {
  up () {
    this.create('tasks_attachments', (table) => {
      table.increments()
      table.string('type', 50).notNullable()
      table.text('url').notNullable()
      table
        .integer('task_id')
        .unsigned().references('id')
        .inTable('tasks')
      table
        .boolean('status')
        .notNullable()
        .defaultTo(true)
      table.timestamps()
      table.date('deleted_at').nullable()
    })
  }

  down () {
    this.drop('tasks_attachments')
  }
}

module.exports = TasksAttachmentsSchema
