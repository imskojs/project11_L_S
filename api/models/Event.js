module.exports = {

  attributes: {


    title: {
      type: 'STRING'
    },

    category: { // JOODANG-EVENT, BAR-EVENT
      type: 'STRING'
    },
    // 버튼 보이기
    showLinkButton: {
      type: 'Boolean'
    },

    homepage: {
      type: 'STRING'
    },
    //기간
    duration: {
      type: 'String'
    },
    //장소
    location: {
      type: 'String'
    },
    // 이벤트 상세내용
    content: {
      type: 'String'
    },
    // 주의사항
    warning: {
      type: 'String'
    },

    photos: {
      collection: 'Photo',
      via: 'event'
    },

    banner: {
      model: 'Banner'
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
