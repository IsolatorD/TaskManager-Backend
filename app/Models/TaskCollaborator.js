'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TaskCollaborator extends Model {
  static boot () {
    super.boot()
    this.addTrait('SoftDeletes')
  }
}

module.exports = TaskCollaborator
