package com.he181464.backendmkt.service.impl;

import com.he181464.backendmkt.dto.DetailPlanDto;
import com.he181464.backendmkt.emailService.EmailService;
import com.he181464.backendmkt.entity.Account;
import com.he181464.backendmkt.entity.DetailPlan;
import com.he181464.backendmkt.model.mapper.DetailPlanMapper;
import com.he181464.backendmkt.model.request.DetailPlanCalendarRequest;
import com.he181464.backendmkt.model.request.DetailPlanRequest;
import com.he181464.backendmkt.repository.AccountRepository;
import com.he181464.backendmkt.repository.DetailPlanRepository;
import com.he181464.backendmkt.service.AccountService;
import com.he181464.backendmkt.service.DetailPlanService;
import com.he181464.backendmkt.specification.DetailPlanSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class DetailPlanServiceImpl implements DetailPlanService {

    private final DetailPlanRepository detailPlanRepository;

    private final DetailPlanMapper detailPlanMapper;

    private final EmailService emailService;

    private final AccountRepository accountRepository;

    @Override
    public DetailPlanDto create(DetailPlanDto dto) {
        try {
            DetailPlan detailPlan = detailPlanMapper.toEntity(dto);
            detailPlan.setId(null);
            detailPlan.setContent(null);
            detailPlan.setLinkDrive(null);
            detailPlan.setStatus("ASSIGNED");
            detailPlan.setCreatedAt(LocalDateTime.now());
            detailPlanRepository.save(detailPlan);
            Account account = accountRepository.findById(dto.getPerformerId().longValue()).orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));
            emailService.sendMailResetPass(account.getEmail());
            return detailPlanMapper.toDTO(detailPlan);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo kế hoạch chi tiết: " + e.getMessage());
        }

    }

    @Override
    public DetailPlanDto update(DetailPlanDto dto) {
        DetailPlan detailPlan = detailPlanRepository.findById(dto.getId()).orElseThrow(() -> new RuntimeException("Không tìm thấy kế hoạch chi tiết"));
        detailPlan = detailPlanMapper.toEntity(dto);
        detailPlan.setContent(dto.getContent());
        detailPlan.setLinkDrive(dto.getLinkDrive());
        detailPlan.setUpdatedAt(LocalDateTime.now());
        detailPlanRepository.save(detailPlan);
        return detailPlanMapper.toDTO(detailPlan);
    }

    @Override
    public void delete(Long id) {
        DetailPlan detailPlan = detailPlanRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy kế hoạch chi tiết"));
        detailPlan.setStatus("CANCELED");
        detailPlanRepository.save(detailPlan);
    }

    @Override
    public DetailPlanDto getById(Long id) {
        return detailPlanRepository.findById(id).map(detailPlanMapper::toDTO).orElseThrow(() -> new RuntimeException("Không tìm thấy kế hoạch chi tiết"));
    }

    @Override
    public Page<DetailPlanDto> search(DetailPlanRequest detailPlanRequest) {
        Specification<DetailPlan> specification = DetailPlanSpecification.hasPerformer(detailPlanRequest.getPerformerId())
                .and(DetailPlanSpecification.hasCampaignId(detailPlanRequest.getCampaignId()))
                .and(DetailPlanSpecification.hasStatus(detailPlanRequest.getStatus()))
                .and(DetailPlanSpecification.hasTitle(detailPlanRequest.getTitle()));

        Pageable pageable = PageRequest.of(
                detailPlanRequest.getPage(),
                detailPlanRequest.getSize()
        );

        Page<DetailPlan> detailPlanPage = detailPlanRepository.findAll(specification, pageable);


        return detailPlanPage.map(detailPlanMapper::toDTO);
    }

    @Override
    public List<DetailPlanDto> searchByCalendar(DetailPlanCalendarRequest detailPlanCalendarRequest) {
        Specification<DetailPlan> specification = DetailPlanSpecification.hasPerformer(detailPlanCalendarRequest.getPerformerId())
                .and(DetailPlanSpecification.hasMonthYear(detailPlanCalendarRequest.getMonth(), detailPlanCalendarRequest.getYear()));


        List<DetailPlan> detailPlanPage = detailPlanRepository.findAll(specification);

        return detailPlanPage.stream().map(detailPlanMapper::toDTO).toList();
    }
}
