package com.gsitm.ustra.java.management.samples.excel;

import java.util.List;

import com.gsitm.ustra.java.data.poi.UstraExcelCellInfoModel;

import lombok.Data;

@Data
public class UstraExcelCreationModel {

	/**
	 * 셀 정보 모델
	 */
	private List<UstraExcelCellInfoModel> cellInfos;

	/**
	 * 검색 조건
	 */
	private Criteria criteria;

	/**
	 * 검색 조건
	 * @author RoyLee
	 */
	@Data
	public static class Criteria {
		private String sysCd;
	}

}
