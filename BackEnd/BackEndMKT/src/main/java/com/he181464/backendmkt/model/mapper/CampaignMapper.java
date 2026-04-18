package com.he181464.backendmkt.model.mapper;

import com.he181464.backendmkt.dto.CampaignDTO;
import com.he181464.backendmkt.entity.Campaign;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(config = MapstructConfig.class)
public interface CampaignMapper {


    // Entity -> DTO
    CampaignDTO toDTO(Campaign entity);

    // DTO -> Entity
    Campaign toEntity(CampaignDTO dto);

    // List mapping
    List<CampaignDTO> toDTOList(List<Campaign> entities);

    // Update entity từ DTO (quan trọng)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(CampaignDTO dto, @MappingTarget Campaign entity);

}
