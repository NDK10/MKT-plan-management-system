package com.he181464.backendmkt.service;

import com.he181464.backendmkt.dto.DetailPlanDto;
import com.he181464.backendmkt.model.request.DetailPlanCalendarRequest;
import com.he181464.backendmkt.model.request.DetailPlanRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface DetailPlanService {

    DetailPlanDto create(DetailPlanDto dto);

    DetailPlanDto update(DetailPlanDto dto);

    void delete(Long id);

    DetailPlanDto getById(Long id);

    Page<DetailPlanDto> search(DetailPlanRequest detailPlanRequest);

    List<DetailPlanDto> searchByCalendar(DetailPlanCalendarRequest detailPlanCalendarRequest);

}
