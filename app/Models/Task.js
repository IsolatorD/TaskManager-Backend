'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Task extends Model {
  static boot () {
    super.boot()
    this.addTrait('SoftDeletes')
  }
  
  user () {
    return this.belongsTo('App/Models/User')
  }

  project () {
    return this.belongsTo('App/Models/Project')
  }

  attachments () {
    return this.hasMany('App/Models/TaskAttachment')
  }

  collaborators() {
    return this.belongsToMany('App/Models/User').pivotTable('tasks_collaborators')
  }
}

module.exports = Task
