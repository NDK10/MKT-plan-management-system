package com.he181464.backendmkt.repository;


import com.he181464.backendmkt.entity.DetailPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface DetailPlanRepository extends JpaRepository<DetailPlan, Long>, JpaSpecificationExecutor<DetailPlan> {
}
