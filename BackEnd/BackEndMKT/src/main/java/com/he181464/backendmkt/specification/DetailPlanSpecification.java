package com.he181464.backendmkt.specification;


import com.he181464.backendmkt.entity.DetailPlan;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DetailPlanSpecification {
    public static Specification<DetailPlan> hasPerformer(Integer performerId) {
        return (root, query, criteriaBuilder) -> {
            if (performerId == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("performerId"), performerId);
        };
    }

    public static Specification<DetailPlan> hasCampaignId(Long campaignId) {
        return (root, query, criteriaBuilder) -> {
            if (campaignId == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("campaignId"), campaignId);
        };
    }


    public static Specification<DetailPlan> hasStatus(String status) {
        return (root, query, criteriaBuilder) -> {
            if (status == null || status.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("status"), status);
        };
    }

    public static Specification<DetailPlan> hasTitle(String title) {
        return (root, query, criteriaBuilder) -> {
            if (title == null || title.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + title.toLowerCase() + "%");
        };
    }

    public static Specification<DetailPlan> hasMonthYear(Integer month, Integer year) {
        return (root, query, cb) -> {
            if (month == null || year == null) {
                return cb.conjunction();
            }

            // đầu tháng
            LocalDateTime start = LocalDate.of(year, month, 1).atStartOfDay();

            // cuối tháng
            LocalDateTime end = start.plusMonths(1).minusSeconds(1);

            return cb.between(root.get("timelineUp"), start, end);
        };
    }

}
