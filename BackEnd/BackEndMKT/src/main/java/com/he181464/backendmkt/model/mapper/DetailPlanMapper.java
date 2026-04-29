package com.he181464.backendmkt.model.mapper;

import com.he181464.backendmkt.dto.DetailPlanDto;
import com.he181464.backendmkt.entity.DetailPlan;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = MapstructConfig.class)
public interface DetailPlanMapper {

    @Mapping(source = "campaign.name", target = "campaignName")
    DetailPlanDto toDTO(DetailPlan entity);

    DetailPlan toEntity(DetailPlanDto dto);
}
