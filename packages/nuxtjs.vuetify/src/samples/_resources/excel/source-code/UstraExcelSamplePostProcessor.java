package com.gsitm.ustra.java.management.samples.excel;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import com.gsitm.ustra.java.core.utils.UstraJsonUtils;
import com.gsitm.ustra.java.data.file.processor.convert.ExcelDataPostProcessor;
import com.gsitm.ustra.java.data.file.processor.convert.ExcelFileToDataProcessConverter.Option;
import com.gsitm.ustra.java.data.poi.UstraExcelUtils.RowInfo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component("ustraExcelSamplePostProcessor")
public class UstraExcelSamplePostProcessor implements ExcelDataPostProcessor<UstraExcelSampleUploadModel> {

	@Autowired
	@Qualifier("ustraExcelUploadTaskExecutor")
	private Executor excelUploadTaskExecutor;

	@Override
	public Object doProcess(Option<UstraExcelSampleUploadModel> option, List<UstraExcelSampleUploadModel> excelReadDatas,
			List<RowInfo> rowInfos) {

		try {
			Map<String, Object> parameterMap = UstraJsonUtils.deserialize((String)option.getExcelDataPostProcessorParameter());
			log.info("parameterMap : {}", parameterMap);


			CompletableFuture.runAsync(() -> {
				for(final UstraExcelSampleUploadModel row : excelReadDatas) {
					log.info("excel row data: {}", row);
					try {
						Thread.sleep(100);
					} catch (InterruptedException e) {
					}
				}
			}, excelUploadTaskExecutor);

		} catch(Exception e) {
			log.error(e.getMessage(), e);
		}

		return new UploadResult(true, "OK!");

	}

	@Data
	@AllArgsConstructor
	public static class UploadResult {
		private Boolean success;
		private String message;
	}

}
