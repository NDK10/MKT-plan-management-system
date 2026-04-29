package com.he181464.backendmkt.specification;


import com.he181464.backendmkt.entity.Campaign;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class CampaignSpecification {


    public static Specification<Campaign> hasCode(String code) {
        return (root, query, criteriaBuilder) -> {
            if (code == null || code.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("code")), "%" + code.toLowerCase() + "%");
        };
    }

    public static Specification<Campaign> hasName(String name) {
        return (root, query, criteriaBuilder) -> {
            if (name == null || name.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
        };
    }

    public static Specification<Campaign> hasStatus(String status) {
        return (root, query, criteriaBuilder) -> {
            if (status == null || status.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("status")), "%" + status.toLowerCase() + "%");
        };
    }

    public static Specification<Campaign> hasUserLeader(Long userResponsible) {
        return (root, query, criteriaBuilder) -> {
            if (userResponsible == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("userResponsible"), userResponsible);
        };
    }

    public static Specification<Campaign> hasPriceGreaterThan(BigDecimal price) {
        return (root, query, cb) -> {
            if (price == null) {
                return cb.conjunction();
            }
            return cb.greaterThanOrEqualTo(root.get("price"), price);
        };
    }

}
