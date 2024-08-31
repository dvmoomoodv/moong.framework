package com.gsitm.ustra.java.management.samples.excel;

import com.gsitm.ustra.java.data.poi.annotation.UstraExcelCellInfo;

import lombok.Data;

@Data
public class UstraExcelSampleUploadModel {
	@UstraExcelCellInfo(col = 0, required = true)
	private String mnuId;

	@UstraExcelCellInfo(col = 1)
	private String uprMnuId;

	@UstraExcelCellInfo(col = 2)
	private String sysCd;

	@UstraExcelCellInfo(col = 3)
	private String mnuNm;
}
