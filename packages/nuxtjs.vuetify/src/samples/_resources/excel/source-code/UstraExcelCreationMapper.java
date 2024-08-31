package com.gsitm.ustra.java.management.samples.excel;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.gsitm.ustra.java.data.domains.PaginationRequest;
import com.gsitm.ustra.java.management.models.UstraMenuModel;

@Mapper
public interface UstraExcelCreationMapper {
	List<UstraMenuModel> select(PaginationRequest pr, UstraExcelCreationModel.Criteria criteria);
}
