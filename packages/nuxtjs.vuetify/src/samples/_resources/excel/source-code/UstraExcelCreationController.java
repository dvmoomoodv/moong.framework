package com.gsitm.ustra.java.management.samples.excel;

import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.gsitm.ustra.java.data.domains.PaginationRequest;
import com.gsitm.ustra.java.data.file.FileOperationManager;
import com.gsitm.ustra.java.management.data.mapper.UstraCommonCodeDataMapper;
import com.gsitm.ustra.java.management.models.UstraMenuModel;
import com.gsitm.ustra.java.mvc.data.file.DataToExcelWebResourceConverter;
import com.gsitm.ustra.java.mvc.rest.utils.UstraRestUtils;

@RestController
public class UstraExcelCreationController {

	@Autowired private UstraExcelCreationMapper excelCreationMapper;
	@Autowired(required = false) private FileOperationManager fileOperationManager;
	@Autowired private UstraCommonCodeDataMapper codeDataMapper;

	@PostMapping("/api/ustra/sample/excel/creation/list")
	Object loadData(@RequestBody UstraExcelCreationModel.Criteria criteria) {
		return excelCreationMapper.select(UstraRestUtils.getCurrentApiHeader(), criteria);
	}


	@PostMapping("/api/ustra/sample/excel/creation/download")
	Object downloadExcel(@RequestBody UstraExcelCreationModel creationInfo, HttpServletRequest request, HttpServletResponse response) {

		// 데이터를 모두 조회한 후, 엑셀로 변환
		List<UstraMenuModel> menus = excelCreationMapper.select(PaginationRequest.allRequest(), creationInfo.getCriteria())
					.stream()
					.peek(menu -> {
						menu.setSysCd(codeDataMapper.map("SYS_CD", menu.getSysCd()).map(c -> c.getCdNm()).orElse(null));
						menu.setMnuTyCd(codeDataMapper.map("MNU_TY_CD", menu.getMnuTyCd()).map(c -> c.getCdNm()).orElse(null));
						menu.setUseYn("Y".equals(menu.getUseYn()) ? "사용" : "미사용");
					})
					.collect(Collectors.toList());

		return fileOperationManager
				.convert(DataToExcelWebResourceConverter
						.builder(
								menus,
								UstraMenuModel.class,
								"export4.xlsx",
								request,
								response)
						.option((option)->{
							option.setCells(creationInfo.getCellInfos());
						})
						.build());

	}

	@PostMapping("/api/ustra/sample/excel/creation/provider/download")
	Object downloadExcelWithProvider(@RequestBody UstraExcelCreationModel creationInfo, HttpServletRequest request, HttpServletResponse response) {

		// 데이터를 순차적으로 조회하여 엑셀 변환
		return fileOperationManager
				.convert(DataToExcelWebResourceConverter
						.builder(
								(index) -> {
									return excelCreationMapper.select(PaginationRequest.pageRequest(10, index), creationInfo.getCriteria())
											.stream()
											.peek(menu -> {
												menu.setSysCd(codeDataMapper.map("SYS_CD", menu.getSysCd()).map(c -> c.getCdNm()).orElse(null));
												menu.setMnuTyCd(codeDataMapper.map("MNU_TY_CD", menu.getMnuTyCd()).map(c -> c.getCdNm()).orElse(null));
												menu.setUseYn("Y".equals(menu.getUseYn()) ? "사용" : "미사용");
											})
											.collect(Collectors.toList());
								},
								UstraMenuModel.class,
								"export5.xlsx",
								request,
								response)
						.option((option)->{
							option.setCells(creationInfo.getCellInfos());
						})
						.build());

	}

}
