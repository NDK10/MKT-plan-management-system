package com.he181464.backendmkt.service;

import com.he181464.backendmkt.dto.CampaignDTO;

import java.util.List;

public interface CampaignService {

    CampaignDTO create(CampaignDTO dto);

    CampaignDTO update(Long id, CampaignDTO dto);

    void delete(Long id);

    CampaignDTO getById(Long id);

    List<CampaignDTO> getAll();

}
