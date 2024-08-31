export class FileUtils {
  /**
   * 파일을 리딩하여 Data Url로 반환
   * @param file File 객체
   */
  readDataUrl(file: File) {
    return new Promise<string>(resolve => {
      const fileReader = new FileReader()
      fileReader.onload = () => {
        resolve(fileReader.result as string)
      }
      fileReader.readAsDataURL(file)
    })
  }

  /**
   * file의 accept 허용 여부를 확인
   * @param accept accept 문자열 (https://www.w3schools.com/tags/att_input_accept.asp)
   * @param files 파일 목록
   */
  validateFiiesAccepts(accept: string, files: File[]) {
    if (!accept || !files || files.length < 1) {
      return true
    }

    const accepts = accept.replace(/\s/g, '').split(',')

    for (const file of files) {
      for (let accept of accepts) {
        accept = accept.trim()
        if (accept.startsWith('.')) {
          if (file.name.toLowerCase().endsWith(accept.toLowerCase())) {
            return true
          }
        } else {
          if (new RegExp(accept.replace('*', '.*')).test(file.type)) {
            return true
          }
        }
      }
    }

    return false
  }
}

const instance = new FileUtils()
export default instance
