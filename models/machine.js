var mongoose = require('mongoose');

var machineSchema = mongoose.Schema({

    room: {
      type: String,
      default: ''
    },

    description: {
        type: String,
        required: true
    },

    public_ip: {
      type: String,
      default: ''
    },

    machine_user: {
      type: String,
      default: ''
    },

    processor: {
      type: String,
      default: ''
    },

    hd: {
      type: String,
      default: ''
    },

    ram_memory: {
      type: String,
      default: ''
    },

    number_Patrimony: {
      type: String,
      default: ''
    },

    inst_Patrimony: {
      type: String,
      default: ''
    },

    monitor: {
      type: String,
      default: ''
    },

    monitor_number_Patrimony: {
      type: String,
      default: ''
    },

    inst_monitor_Patrimony: {
      type: String,
      default: ''
    },

    situation: {
        type: String,
        default: ''
    },

    acquisition_date: {
        type: Date,
        default: ''
    },

    destination:{
        type: String,
        default: ''
    },

    image: {
      type: String,
      default: ''
    }
});

var Machine = mongoose.model('Machine', machineSchema);

module.exports = Machine;
