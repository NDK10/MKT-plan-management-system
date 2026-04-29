package com.he181464.backendmkt.service.impl;

import com.he181464.backendmkt.dto.AccountResponseDto;
import com.he181464.backendmkt.dto.CampaignDTO;
import com.he181464.backendmkt.entity.Account;
import com.he181464.backendmkt.entity.Campaign;
import com.he181464.backendmkt.entity.CampaignAccount;
import com.he181464.backendmkt.exception.ObjectExistingException;
import com.he181464.backendmkt.model.mapper.AccountMapper;
import com.he181464.backendmkt.model.mapper.CampaignMapper;
import com.he181464.backendmkt.model.request.CampaignRequest;
import com.he181464.backendmkt.repository.AccountRepository;
import com.he181464.backendmkt.repository.CampaignAccountRepository;
import com.he181464.backendmkt.repository.CampaignRepository;
import com.he181464.backendmkt.service.CampaignService;
import com.he181464.backendmkt.specification.CampaignSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CampaignServiceImpl implements CampaignService {

    private final CampaignRepository campaignRepository;
    private final CampaignMapper campaignMapper;
    private final CampaignAccountRepository campaignAccountRepository;
    private final AccountRepository accountRepository;
    private final AccountMapper accountMapper;

    @Override
    public CampaignDTO create(CampaignDTO dto) {

        if (campaignRepository.findByCode(dto.getCode()).isPresent()) {
            throw new ObjectExistingException("Mã dự án đã tồn tại");
        }

        validate(dto, false);

        // 1. map campaign
        Campaign campaign = campaignMapper.toEntity(dto);

        campaign.setStatus("WAITING");
        campaign.setId(null);

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

        Account userResponsible = accountRepository.findById(campaign.getUserResponsible())
                .orElseThrow(() -> new RuntimeException("User responsible not found"));

        CampaignDTO dto = campaignMapper.toDTO(campaign);


        dto.setUserResponsibleName(userResponsible.getFullName());

        dto.setUserResponsibleEmail(userResponsible.getEmail());
        if (campaign.getCampaignAccounts() != null) {
            List<AccountResponseDto> accountList = campaign.getCampaignAccounts().stream()
                    .map(ca -> accountMapper.toDTO(ca.getAccount()))
                    .toList();

            dto.setAccountResponseDtoList(accountList);
        }
        return dto;
    }

    @Override
    public List<CampaignDTO> getAll() {
        return campaignMapper.toDTOList(campaignRepository.findAll());
    }

    @Override
    public CampaignDTO acceptCampaign(Long id) {
        Campaign existing = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
        existing.setStatus("INPROGRESS");
        Campaign updated = campaignRepository.save(existing);
        return campaignMapper.toDTO(updated);
    }

    @Override
    public CampaignDTO rejectCampaign(Long id) {
        Campaign existing = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
        existing.setStatus("CANCELED");
        Campaign updated = campaignRepository.save(existing);
        return campaignMapper.toDTO(updated);
    }

    @Override
    public Page<CampaignDTO> searchCampaigns(CampaignRequest campaignRequest) {

        Specification<Campaign> spec = CampaignSpecification.hasCode(campaignRequest.getCode())
                .and(CampaignSpecification.hasName(campaignRequest.getName()))
                .and(CampaignSpecification.hasStatus(campaignRequest.getStatus()))
                .and(CampaignSpecification.hasUserLeader(campaignRequest.getUserResponsible()))
                .and(CampaignSpecification.hasPriceGreaterThan(campaignRequest.getPrice()));

        Pageable pageable = PageRequest.of(
                campaignRequest.getPage(),
                campaignRequest.getSize()
        );

        Page<Campaign> page = campaignRepository.findAll(spec, pageable);
        List<Campaign> campaigns = page.getContent();

        List<Long> userIds = campaigns.stream()
                .map(Campaign::getUserResponsible)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        Map<Long, Account> userNameMap = accountRepository.findAllById(userIds)
                .stream()
                .collect(Collectors.toMap(
                        Account::getId,
                        account -> account
                ));


        List<CampaignDTO> dtoList = campaigns.stream().map(c -> {

            CampaignDTO dto = campaignMapper.toDTO(c);


            dto.setUserResponsibleName(userNameMap.get(c.getUserResponsible()).getFullName());

            dto.setUserResponsibleEmail(userNameMap.get(c.getUserResponsible()).getEmail());
            if (c.getCampaignAccounts() != null) {
                List<AccountResponseDto> accountList = c.getCampaignAccounts().stream()
                        .map(ca -> accountMapper.toDTO(ca.getAccount()))
                        .toList();

                dto.setAccountResponseDtoList(accountList);
            }

            return dto;

        }).toList();

        return new PageImpl<>(dtoList, pageable, page.getTotalElements());
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
                throw new ObjectExistingException("Ngày hoàn thành phải sau ngày bắt đầu");
            }
        }
    }
}
