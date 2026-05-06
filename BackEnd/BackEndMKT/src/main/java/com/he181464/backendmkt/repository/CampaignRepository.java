package com.he181464.backendmkt.repository;


import com.he181464.backendmkt.entity.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long>, JpaSpecificationExecutor<Campaign> {

    Optional<Campaign> findByCode(String code);


    @Query("""
                SELECT c.status, COUNT(c)
                FROM Campaign c
                GROUP BY c.status
            """)
    List<Object[]> countByStatus();


    @Query("""
                SELECT c.name, c.price, c.incurredCosts
                FROM Campaign c
                WHERE c.status = 'COMPLETED'
            """)
    List<Object[]> getCompletedCampaignCosts();


}
