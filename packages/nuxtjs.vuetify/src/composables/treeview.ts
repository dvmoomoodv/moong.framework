/**
 * data를 vue3-treeview에 맞게 변형
 * @param treeData
 * @returns
 */
interface TreeViewType {
  keyboardNavigation: Boolean
  dragAndDrop: Boolean
  checkboxes: Boolean
  editable: Boolean
  disabled: Boolean
  padding: Number
}
export const useBuildMenuTree = (treeData, options: TreeViewType) => {
  const nodes = {}
  const roots = []

  treeData.forEach(item => {
    const { mnuId, uprMnuId, mnuNm } = item
    if (!nodes[mnuId]) {
      nodes[mnuId] = { text: mnuNm }
      nodes[mnuId].children = []
      nodes[mnuId].state = {}
    } else {
      nodes[mnuId].text = mnuNm
    }

    if (uprMnuId) {
      if (!nodes[uprMnuId]) {
        nodes[uprMnuId] = { children: [mnuId] }
      } else {
        if (!nodes[uprMnuId].children) {
          nodes[uprMnuId].children = []
        }
        nodes[uprMnuId].children.push(mnuId)
      }
    } else {
      roots.push(mnuId)
    }
  })

  return {
    config: {
      roots,
      keyboardNavigation: options.keyboardNavigation,
      dragAndDrop: options.dragAndDrop,
      checkboxes: options.checkboxes,
      editable: options.editable,
      disabled: options.disabled,
      padding: options.padding,
    },
    nodes,
  }
}

export const useFilterStateChecked = data => {
  console.log('composable data start', data)
  if (!data) return
  let checkedNodes = []

  for (let key in data) {
    console.log('key = ', key)
    console.log('info = ', data[key].state.checked)
    if (data[key].state.checked === true) {
      checkedNodes.push(data[key])
    }
  }
  console.log('composable data end', checkedNodes)
  return checkedNodes
}
