import { Menu } from '../models/menu'

/**
 * 커스톰 Menu 기반의 IP Address Checker를 정의
 * @param setup ip address check logic 구현
 *  - menu : 현재 접근하려는 메뉴 정보
 *  - ipAddress : 사용자의 IP ADDRESS
 */
export const defineUstraManagementMenuIpAddressChecker = (setup: (menu: Menu, ipAddress: string) => boolean | Promise<boolean>) => {
  return setup
}
