package com.he181464.backendmkt.service.impl;

import com.he181464.backendmkt.dto.CampaignDTO;
import com.he181464.backendmkt.entity.Account;
import com.he181464.backendmkt.entity.Campaign;
import com.he181464.backendmkt.entity.CampaignAccount;
import com.he181464.backendmkt.exception.ObjectExistingException;
import com.he181464.backendmkt.model.mapper.CampaignMapper;
import com.he181464.backendmkt.repository.AccountRepository;
import com.he181464.backendmkt.repository.CampaignAccountRepository;
import com.he181464.backendmkt.repository.CampaignRepository;
import com.he181464.backendmkt.service.CampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CampaignServiceImpl implements CampaignService {

    private final CampaignRepository campaignRepository;
    private final CampaignMapper campaignMapper;
    private final CampaignAccountRepository campaignAccountRepository;
    private final AccountRepository accountRepository;

    @Override
    public CampaignDTO create(CampaignDTO dto) {

        validate(dto, false);

        // 1. map campaign
        Campaign campaign = campaignMapper.toEntity(dto);

        campaign = campaignRepository.save(campaign);

        // 2. xử lý gán user vào campaign
        if (dto.getAccountIds() != null && !dto.getAccountIds().isEmpty()) {

            List<Account> accounts = accountRepository.findByIdIn(dto.getAccountIds());

            List<CampaignAccount> campaignAccounts = new ArrayList<>();

            for (Account acc : accounts) {

                CampaignAccount ca = CampaignAccount.builder()
                        .campaign(campaign)
                        .account(acc)
                        .status("ACTIVE")
                        .build();

                campaignAccounts.add(ca);
            }

            campaignAccountRepository.saveAll(campaignAccounts);
        }

        return campaignMapper.toDTO(campaign);
    }

    @Override
    public CampaignDTO update(Long id, CampaignDTO dto) {
        Campaign existing = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
        validate(dto, true);
        // update bằng mapper (clean hơn rất nhiều)
        campaignMapper.updateEntityFromDTO(dto, existing);

        Campaign updated = campaignRepository.save(existing);
        return campaignMapper.toDTO(updated);
    }

    @Override
    public void delete(Long id) {
        Campaign existing = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
        existing.setStatus("CANCELED");
        campaignRepository.save(existing);
    }

    @Override
    public CampaignDTO getById(Long id) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
        return campaignMapper.toDTO(campaign);
    }

    @Override
    public List<CampaignDTO> getAll() {
        return campaignMapper.toDTOList(campaignRepository.findAll());
    }


    private void validate(CampaignDTO dto, boolean isUpdate) {

        if (!isUpdate) {
            if (dto.getCode() == null || dto.getCode().trim().isEmpty()) {
                throw new ObjectExistingException("Code không được để trống");
            }
        }

        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new ObjectExistingException("Name không được để trống");
        }

        if (dto.getPrice() != null && dto.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new ObjectExistingException("Price phải >= 0");
        }

        if (dto.getIncurredCosts() != null && dto.getIncurredCosts().compareTo(BigDecimal.ZERO) < 0) {
            throw new ObjectExistingException("Incurred costs phải >= 0");
        }

        if (dto.getPercentTarget() != null) {
            if (dto.getPercentTarget().compareTo(BigDecimal.ZERO) < 0 ||
                    dto.getPercentTarget().compareTo(new BigDecimal("100")) > 0) {
                throw new ObjectExistingException("Percent target phải từ 0 đến 100");
            }
        }

        if (dto.getDateStart() != null && dto.getDateComplete() != null) {
            if (dto.getDateComplete().isBefore(dto.getDateStart())) {
                throw new ObjectExistingException("dateComplete phải sau dateStart");
            }
        }
    }
}
