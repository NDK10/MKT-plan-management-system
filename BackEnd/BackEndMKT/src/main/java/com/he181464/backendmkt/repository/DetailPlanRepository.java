package com.he181464.backendmkt.repository;


import com.he181464.backendmkt.entity.DetailPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetailPlanRepository extends JpaRepository<DetailPlan, Long>, JpaSpecificationExecutor<DetailPlan> {

    List<DetailPlan> findByCampaignId(Long campaignId);

}
