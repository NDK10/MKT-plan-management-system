package com.he181464.backendmkt.service;


import com.he181464.backendmkt.dto.CampaignCostDTO;
import com.he181464.backendmkt.dto.CampaignDTO;
import com.he181464.backendmkt.dto.StatusCountDTO;
import com.he181464.backendmkt.model.request.AccountRequest;
import com.he181464.backendmkt.model.request.CampaignRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface CampaignService {

    CampaignDTO create(CampaignDTO dto);

    CampaignDTO update(Long id, CampaignDTO dto);

    void delete(Long id);

    CampaignDTO getById(Long id);

    List<CampaignDTO> getAll();

    CampaignDTO acceptCampaign(Long id);

    CampaignDTO rejectCampaign(Long id);

    Page<CampaignDTO> searchCampaigns(CampaignRequest campaignRequest);

    public List<StatusCountDTO> getCampaignStatusChart();

    public List<CampaignCostDTO> getCompletedCampaignCosts();

    void completeCampaign(Long campaignId);
}
