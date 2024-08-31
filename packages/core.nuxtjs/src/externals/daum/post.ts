/**
 * Daum 우편번호 연동 모듈
 * @packageDocumentation
 */

export interface DaumPostResult {
  /**
   * 국가기초구역번호. 2015년 8월 1일부터 시행될 새 우편번호.
   * @example 13494
   */
  zonecode?: string

  /**
   * 기본 주소
   * @example 경기 성남시 분당구 판교역로 235
   */
  address?: string

  /**
   * 기본 영문 주소
   * @example 235 Pangyoyeok-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, korea
   */
  addressEnglish?: string

  /**
   * 검색된 기본 주소 타입: R(도로명), J(지번)
   * - R: 도로명
   * - J: 지번
   */
  addressType?: 'R' | 'J'

  /**
   * 검색 결과에서 사용자가 선택한 주소의 타입
   * - R: 도로명
   * - J: 지번
   */
  userSelectedType?: 'R' | 'J'

  /**
   * 연관 주소에서 "선택 안함" 부분을 선택했을때를 구분할 수 있는 상태변수
   */
  noSelected?: 'Y' | 'N'

  /**
   * 검색 결과에서 사용자가 선택한 주소의 언어 타입
   * - K(한글주소)
   * - E(영문주소)
   */
  userLanguageType?: 'Y' | 'N'

  /**
   * 도로명 주소 (지번:도로명 주소가 1:N인 경우에는 데이터가 공백으로 들어갈 수 있습니다. - 아래 autoRoadAddress의 자세한 설명 참고)
   * @example 경기 성남시 분당구 판교역로 235
   */
  roadAddress?: string

  /**
   * 영문 도로명 주소
   * @example 235, Pangyoyeok-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, Korea
   */
  roadAddressEnglish?: string

  /**
   * 지번 주소 (도로명:지번 주소가 1:N인 경우에는 데이터가 공백으로 들어갈 수 있습니다. - 아래 autoJibunAddress의 자세한 설명 참고)
   * @example 235, Pangyoyeok-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, Korea
   */
  jibunAddress?: string

  /**
   * 영문 지번 주소
   * @example 681, Sampyeong-dong, Bundang-gu, Seongnam-si, Gyeonggi-do, Korea
   */
  jibunAddressEnglish?: string

  /**
   * '지번주소'에 매핑된 '도로명주소'가 여러개인 경우, 사용자가 '선택안함' 또는 '지번주소'를 클릭했을 때 연관된 도로명 주소 중 임의로 첫번째 매핑 주소를 넣어서 반환합니다.
   * @example 경기 성남시 분당구 판교역로 235
   */
  autoRoadAddress?: string

  /**
   * autoRoadAddress의 영문 도로명 주소
   * @example 235, Pangyoyeok-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, Korea
   */
  autoRoadAddressEnglish?: string

  /**
   * '도로명주소'에 매핑된 '지번주소'가 여러개인 경우, 사용자가 '선택안함' 또는 '도로명주소'를 클릭했을 때 연관된 지번 주소 중 임의로 첫번째 매핑 주소를 넣어서 반환합니다.
   * @example 경기 성남시 분당구 삼평동 681
   */
  autoJibunAddress?: string

  /**
   * autoJibunAddress의 영문 지번 주소
   * @example 681, Sampyeong-dong, Bundang-gu, Seongnam-si, Gyeonggi-do, Korea
   */
  autoJibunAddressEnglish?: string

  /**
   * 건물관리번호
   * @example 4113510900106810000000001
   */
  buildingCode?: string

  /**
   * 건물명
   * @example 에이치스퀘어 엔동
   */
  buildingName?: string

  /**
   * 공동주택 여부 (아파트,연립주택,다세대주택 등)
   */
  apartment?: 'Y' | 'N'

  /**
   * 도/시 이름
   * @example 경기
   */
  sido?: string

  /**
   * 도/시 이름의 영문
   * @example Gyeonggi-do
   */
  sidoEnglish?: string

  /**
   * 시/군/구 이름
   * @example 성남시 분당구
   */
  sigungu?: string

  /**
   * 시/군/구 이름의 영문
   * @example Bundang-gu Seongnam-si
   */
  sigunguEnglish?: string

  /**
   * 시/군/구 코드
   * @example 41135
   */
  sigunguCode?: string

  /**
   * 도로명 코드, 7자리로 구성된 도로명 코드입니다. 추후 7자리 이상으로 늘어날 수 있습니다.
   * @example 3179025
   */
  roadnameCode?: string

  /**
   * 법정동/법정리 코드
   * @example 4113510900
   */
  bcode?: string

  /**
   * 도로명 값, 검색 결과 중 선택한 도로명주소의 "도로명" 값이 들어갑니다.(건물번호 제외)
   * @example 판교역로
   */
  roadname?: string

  /**
   * 도로명 값, 검색 결과 중 선택한 도로명주소의 "도로명의 영문" 값이 들어갑니다.(건물번호 제외)
   * @example Pangyoyeok-ro
   */
  roadnameEnglish?: string

  /**
   * 법정동/법정리 이름
   * @example 삼평동
   */
  bname?: string

  /**
   * 법정동/법정리 이름의 영문
   * @example Sampyeong-dong
   */
  bnameEnglish?: string

  /**
   * 법정리의 읍/면 이름
   * ("동"지역일 경우에는 공백, "리"지역일 경우에는 "읍" 또는 "면" 정보가 들어갑니다.)
   */
  bname1?: string

  /**
   * 법정리의 읍/면 이름의 영문
   * ("동"지역일 경우에는 공백, "리"지역일 경우에는 "읍" 또는 "면" 정보가 들어갑니다.)
   */
  bname1English?: string

  /**
   * 법정동/법정리 이름
   * @example 삼평동
   */
  bname2?: string

  /**
   * 법정동/법정리 이름의 영문
   * @example Sampyeong-dong
   */
  bname2English?: string

  /**
   * 행정동 이름, 검색어를 행정동으로 검색하고, 검색결과의 법정동과 검색어에 입력한 행정동과 다른 경우에 표시하고, 데이터를 내립니다.
   */
  hname?: string

  /**
   * 사용자가 입력한 검색어
   */
  query?: string

  /**
   * 사용자 주소
   */
  addr?: string

  /**
   * 참고 항목
   */
  extraAddr?: string

  /**
   * 위도
   */
  lat?: number

  /**
   * 경도
   */
  lng?: number
}

/**
 * Daum post screen option
 * @see https://postcode.map.daum.net/guide#attributes
 */
export interface DaumPostScreenOptions extends Record<string, any> {
  /**
   * 검색 결과로 인해 우편번호 서비스의 화면 크기가 변한 경우, 화면 크기 정보를 받아서 처리할 콜백 함수를 정의
   */
  onresize?: (size: { width: number; height: number }) => void

  /**
   * 주소를 검색할 경우에 실행되는 콜백함수
   */
  onsearch?: (data: { q: string; count: number }) => void

  /**
   * 넓이
   * @default 100%
   */
  width?: string | number

  /**
   * 넓이
   * @default 100%
   */
  height?: string | number

  /**
   * 애니메이션 효과 사용 여부
   * @default true
   */
  animation?: boolean

  /**
   * 우편번호 찾기가 실행된 후 입력 박스 focus 여부
   * @default true
   */
  focusInput?: boolean

  /**
   * 도로명 주소 자동 매핑 여부
   * @default true
   */
  autoMappingRoad?: boolean

  /**
   * 지번 주소 자동 매핑 여부
   * @default true
   */
  autoMappingJibun?: boolean

  /**
   * 검색된 주소와 내려가는 데이터의 '시','도' 부분을 축약 표시합니다(한글 주소만 해당).
   * @default true
   */
  shorthand?: boolean

  /**
   * 검색결과가 많을시 검색바 아래의 가이드 영역을 강조시켜 주는 기능입니다. 기본값은 0(비활성)입니다.
   * 가이드 문구는 첫화면의 가이드 문구와 동일하며, 조합방식과 예시를 설명하여 사용자에게 재검색을 유도할 수 있도록 하는 기능입니다.
   * 입력값으로는 페이지 넘버가 들어가게 되며, 3~20까지 입력 가능합니다.
   * @default 0
   */
  pleaseReadGuide?: number

  /**
   * pleaseReadGuide 옵션과 같이 사용되는 옵션으로 선택사항입니다. 기본값은 1.5(1.5초간 강조)이며 입력하지 않으면 기본값으로 동작합니다.
   * 입력값 설정 단위는 '초'단위로 설정할 수 있으며, 0.1~60까지 입력 가능합니다.
   * @default 1.5
   */
  pleaseReadGuideTimer?: number

  /**
   * 검색어 입력시 검색바 아래에 뜨는 서제스트의 최대 검색 갯수를 조절할 수 있는 옵션입니다. 기본값은 10개이며 입력하지 않거나 1~10을 벗어나는 수를 입력시 기본값으로 셋팅됩니다.
   * @default 10
   */
  maxSuggestItems?: number

  /**
   * 기본값은 false이며 기존보다 행정동 정보를 좀 더 많이 보여주게 하는 옵션입니다.
   * 해당 기능을 활성화 하면 검색 결과의 행정동과 법정동이 다른 경우 무조건 표시를 하고 데이터를 내리게 됩니다. 그래서 법정동과 행정동이 같은 경우에는 표시하지 않으며, 데이터 또한 내리지 않습니다.
   * 추가적으로, 행정동 표시의 기본 로직은 "검색어를 행정동으로 검색하고, 검색결과의 법정동과 검색어에 입력한 행정동과 다른 경우에 표시하고, 데이터를 내립니다."
   * @default false
   */
  showMoreHName?: boolean

  /**
   * 지도 버튼을 숨길지 여부
   * @default false
   */
  hideMapBtn?: boolean

  /**
   * 영문보기 버튼을 숨길지 여부
   * @default false
   */
  hideEngBtn?: boolean

  /**
   * 검색 결과의 한글과 영문 주소를 동시에 볼 수 있게 해주는 기능
   * @default false
   */
  alwaysShowEngAddr?: boolean

  /**
   * 기본값은 true이며 "form submit" 방식을 사용합니다. false로 설정 시 "location replace" 방식을 사용하게 됩니다. 우편번호 서비스로 인해 history 관련 제어가 어려우실 경우 false로 설정하여 이용하시기 바랍니다.
   * @default true
   */
  submitMode?: boolean

  /**
   * 기본값은 true이며 하단 배너에 "가이드페이지"로 이동하는 링크를 활성화 시킵니다. 링크로 인해 사용성이 저하된다고 생각하신다면 false로 설정하여 이용하시기 바랍니다.
   * @default true
   */
  useBannerLink?: boolean

  /**
   * 테마 설정
   * @see https://postcode.map.daum.net/guide#themeWizard
   */
  theme?: Record<string, string>

  /**
   * 오픈할 시의 검색어
   */
  query?: string

  /**
   * 선택 이후 자동 비활성화 여부
   * @default true
   */
  autoClose?: boolean

  /**
   * 사용자가 주소 창을 선택했을 때 수신할 call back
   */
  onSelected?: (result: DaumPostResult) => void | Promise<void>
}

/**
 * Daum 주소 창 서비스를 오픈한다.
 * @param el 오픈할 Element
 * @param options 옵션
 */
export const openDaumPostScreen = (el: HTMLElement, options: DaumPostScreenOptions = {}) => {
  options = $ustra.utils.core.deepMerge(
    {
      width: '100%',
      height: '100%',
      animation: true,
      focusInput: true,
      autoMappingRoad: true,
      autoMappingJibun: true,
      shorthand: true,
      autoClose: true,
    },
    options,
  )

  options.oncomplete = function (data) {
    // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

    // 각 주소의 노출 규칙에 따라 주소를 조합한다.
    // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
    var addr = '' // 주소 변수
    var extraAddr = '' // 참고항목 변수

    //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
    if (data.userSelectedType === 'R') {
      // 사용자가 도로명 주소를 선택했을 경우
      addr = data.roadAddress
    } else {
      // 사용자가 지번 주소를 선택했을 경우(J)
      addr = data.jibunAddress
    }

    // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
    if (data.userSelectedType === 'R') {
      // 법정동명이 있을 경우 추가한다. (법정리는 제외)
      // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
      if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
        extraAddr += data.bname
      }
      // 건물명이 있고, 공동주택일 경우 추가한다.
      if (data.buildingName !== '' && data.apartment === 'Y') {
        extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName
      }
      // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
      if (extraAddr !== '') {
        extraAddr = ' (' + extraAddr + ')'
      }
    } else {
      extraAddr = ''
    }

    data.addr = addr
    data.extraAddr = extraAddr

    if (options.onSelected) {
      options.onSelected(data)
    }
  }
  $ustra.utils.core
    .getObjectAsync(() => $ustra.global.daum)
    .then(daum => {
      new daum.Postcode(options).embed(el, {
        q: options.query,
        autoClose: options.autoClose,
      })
    })
}
