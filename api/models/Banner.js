module.exports = {
  attributes: {
    phone: {
      type: 'String'
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
