'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TaskAttachment extends Model {
  static boot () {
    super.boot()
    this.addTrait('SoftDeletes')
  }
  
  task () {
    return this.belongsTo('App/Models/Task')
  }
}

module.exports = TaskAttachment
