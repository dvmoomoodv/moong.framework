import { defineNuxtPlugin } from '#app'
import RealGrid from 'realgrid'
import JSZip from 'jszip'
export default defineNuxtPlugin(nuxtApp => {
  RealGrid.setLicenseKey('upVcPE+wPOmtLjqyBIh9RkM/nBOseBrflwxYpzGZyYm9cY8amGDkiHqyYT2U1Yh3Dufv8SUhNy5u3KSTmkeZuQ==')

  // Excel Export시 사용
  window.JSZip = window.JSZip || JSZip

  // Test용도 default옵션
  RealGrid.setDefault({
    editor: {
      dateCellEditor: {
        viewMode: 'month',
        editFormat: 'yyyy-MM',
      },
      numberCellEditor: {
        showStepButton: true,
      },
    },
    edit: {
      editable: false,
      commitByCell: true,
      commitWhenLeave: true,
      columnEditableFirst: true,
    },
    rowIndicator: {
      visible: true,
    },
    stateBar: {
      visible: true,
    },
    header: {
      height: 40,
    },
    footer: {
      visible: false,
    },
    display: {
      rowHeight: 30,
      rowResizable: true,
      eachRowResizable: true,
    },
  })
})
