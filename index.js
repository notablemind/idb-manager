
var _ = require('lodash')
  , BaseManager = require('manager')

  , bongo = require('bongo.js')

module.exports = Manager

function Manager(collection, options) {
  this.collection = collection
  BaseManager.call(this, options)
  this.loadInitial()
}

Manager.prototype = _.extend({}, BaseManager.prototype, {
  loadInitial: function () {
    this.collection.find({}).toArray(function(err, items) {
      if (err) return console.warn('no initial things found')
      for (var i=0; i<items.length; i++) {
        this._map[items[i]._id] = items[i]
      }
    }.bind(this))
  },
  setAttr: function (id, attr, data, done) {
    var that = this
    that.collection.get(id, function (err, obj) {
      if (err) return done(err)
      // if (!obj) return console.warn('obj not created', id, attr, data)
      obj = obj || {_id: id}
      obj[attr] = data
      that.collection.save(obj, function (err, more) {
        that.collection.get(id, done)
      })
    })
  },
  newNode: function (data, done) {
    var id = this.genId()
    data._id = id
    this.collection.save(data)
    /*, function (err, id) {
      done(id)
    })*/
    done(id)
  },
  setter: function (id, data, done) {
    var that = this
    data._id = id
    that.collection.save(data, function (err, more) {
      that.collection.get(id, done)
    })
  },
  getter: function (id, done) {
    this.collection.get(id, done)
  }
})

