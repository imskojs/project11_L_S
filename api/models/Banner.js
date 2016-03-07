module.exports = {
  attributes: {

    isExternal: {
      type: 'BOOLEAN'
    },

    homepage: {
      type: 'STRING'
    },

    index: {
      type: 'INTEGER',
      required: true
    },

    event: {
      model: 'Event'
    },

    photo: {
      model: 'Photo'
    },

    owner: {
      model: 'User'
    },
    createdBy: {
      model: 'User'
    },
    updatedBy: {
      model: 'User'
    }
  }

};


// banner = {
//   isExternal: true,

//   homepage: 'http://www.naver.com',

//   index: 0,

//   event: 'sdasdfae1123cd12d',

//   photo: {

//   }
// }
