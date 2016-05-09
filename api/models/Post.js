module.exports = {
  attributes: {
    //====================================================
    //  Common
    //====================================================
    category: { // '화물', '공차', 'NOTICE'
      type: 'String'
    },
    //톤수
    vehicleWeight: {
      type: 'String'
    },
    //차량종류
    vehicleType: {
      type: 'String'
    },
    // 기타메모
    memo: {
      type: 'String'
    },
    //====================================================
    // 공차
    //====================================================
    // SERVER: parsed from departureAddress
    departureProvince: { //undefined(전체), 수도권, 강원, 충청, 전라, 경상, 제주 
      type: 'String'
    },
    departureAddressShort: { // 시군까지만 표시 get from geoJSON
      type: 'String'
    },
    geoJSON: { //departure geoJSON
      type: 'JSON'
    },
    destinationProvince: { //undefined(전체), 수도권, 강원, 충청, 전라, 경상, 제주
      type: 'String'
    },
    loadType: { // 적재형태: 전체, 독차, 혼적
      type: 'String'
    },
    //지금 공차, 내일 공차를 위한 데이트값
    date: {
      type: 'DATETIME'
    },
    // 공차시간
    time: { // 오전, 오후
      type: 'String'
    },
    //====================================================
    //  화물
    //====================================================
    loadProvince: { //undefined(전체), 수도권, 강원, 충청, 전라, 경상, 제주
      type: 'String'
    },
    loadAddressShort: { //전북 전주시 덕진구
      type: 'String'
    },
    // 상차주소
    loadAddress: { //전북 전주시 덕진구 124-345번지
      type: 'String'
    },
    // 상차일
    loadDate: {
      type: 'DATETIME'
    },
    // 상차 시간
    loadTime: {
      type: 'String'
    },
    // 하차주소
    unloadProvince: { //undefined(전체), 수도권, 강원, 충청, 전라, 경상, 제주
      type: 'String'
    },
    unloadAddressShort: { // 경기 수원시 영통구
      type: 'String'
    },
    // 하차주소
    unloadAddress: { // 경기 수원시 영통구 하늘 아파트 2동
      type: 'String'
    },
    // 하차일
    unloadDate: {
      type: 'DATETIME'
    },
    // 하차시간
    unloadTime: {
      type: 'String'
    },
    // 화물품목
    goodType: {
      type: 'String'
    },
    // 무게/수량
    goodWeight: {
      type: 'String'
    },
    // 상하차방법
    loadMethod: {
      type: 'String'
    },
    // 필요차량수
    requiredVehicles: {
      type: 'String'
    },
    detour: { // 혼적, 경유, 왕복
      type: 'String'
    },
    //회망운임료/운송료선택
    price: {
      type: 'String',
    },
    // 지불방법
    payMethod: {
      type: 'String'
    },
    //수수료
    tax: {
      type: 'String'
    },
    //화물사진
    photos: {
      collection: 'Photo',
      via: 'post'
    },
    //운송의뢰인 이름
    name: {
      type: 'String'
    },
    //운송의뢰인 휴대전화번호
    mobilePhone: {
      type: 'String'
    },
    //예약확정
    reservation: { // pending, confirmed
      type: 'String',
    },

    owner: {
      model: 'User' // {photos, profilePhoto}
    },

    createdBy: {
      model: 'User'
    }, 
    
    updatedBy: {
      model: 'User'
    }
  }
};
