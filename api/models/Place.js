/**
 * Created by Andy on 7/6/2015
 * As part of applicatplatform
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Andy Yoon Yong Shin - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Andy Yoon Yong Shin <andy.shin@applicat.co.kr>, 7/6/2015
 *
 */
module.exports = {
  attributes: {


    name: { // searchable
      type: 'STRING',
    },

    tagString: { //searchable
      type: 'STRING'
    },

    tags: {
      type: 'ARRAY'
    },

    category: { // PREMIUM, SPECIAL, NORMAL
      type: 'STRING'
    },

    province: { // search using contains
      type: 'STRING'
    },
    // '헌팅', '데이트', '단체', '술마시기좋은', '안주가맛있는'
    theme: { // search using contains
      type: 'ARRAY'
    },
    // '포차/호프', 'Pub', 'Bar/라운지', '이자카야'
    // 'Beer', '와인', '전통주점', '퓨전주점', 
    // '룸식', '24시', '조용한', '편한의자',
    // '내부화장실', '좌식', '흡연가능', '싸다'
    keywords: { // search using contains
      type: 'ARRAY'
    },

    averageRating: {
      type: 'FLOAT',
      defaultsTo: 0
    },

    viewCount: {
      type: 'INTEGER',
      defaultsTo: 0
    },

    favoriteCount: {
      type: 'INTEGER',
      defaultsTo: 0
    },

    // 주소
    address: {
      type: 'STRING'
    },

    geoJSON: {
      type: 'JSON'
    },

    // 영업시간
    hours: {
      type: 'STRING'
    },

    // 규모
    size: {
      type: 'STRING'
    },

    // 한줄소개
    summary: {
      type: 'STRING'
    },

    showDiscountTag: {
      type: 'BOOLEAN'
    },
    // 회원해택
    discountTitle: {
      type: 'STRING'
    },
    discountContent: {
      type: 'STRING'
    },

    // local Event
    showEventTag: {
      type: 'BOOLEAN'
    },

    eventContent: {
      type: 'STRING'
    },
    // events: { // Array<{eventTitle: String, eventContent: string}>
    //   type: 'ARRAY'
    // },

    reviewCount: {
      type: 'INTEGER',
      defaultsTo: 0
    },

    // 전화
    phone: {
      type: 'STRING'
    },

    //====================================================
    //  Association
    //====================================================
    photos: {
      collection: 'Photo',
      via: 'place'
    },
    // 메뉴
    products: {
      collection: 'Product',
      via: 'place'
    },

    reviews: {
      collection: 'Review',
      via: 'place'
    },

    // Not used but just incase

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

// let place = {
//   photos:[{
//     id: 12,
//     url: ''
//   }, {
//     id: 21,
//     url: ''
//   }]

// }
