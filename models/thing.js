var mongoose = require('mongoose');

//Schema para a planilha basica

var thingSchema = mongoose.Schema({

  //numero de patrimonio
    number_Patrimony: {
        type: String,
        default: ''
    },

    //origem do objeto
    origem: {
        type: String,
        default: ''
    },

    description: {
    	type: String,
      required: true
    },

    // marca / modelo
    brand_model: {
        type: String,
        default: ''
    },

    serie: {
        type: String,
        default: ''
    },

    situation: {
        type: String,
        default: ''
    },

    comments: {
        type: String,
        default: ''
    },

    room:{
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

var Thing = mongoose.model('Thing', thingSchema);

module.exports = Thing
