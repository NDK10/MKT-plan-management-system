package com.he181464.backendmkt.repository;

import com.he181464.backendmkt.entity.CampaignAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignAccountRepository extends JpaRepository<CampaignAccount, Long> {

    List<CampaignAccount> findByCampaignId(Long campaignId);

    void deleteByCampaignId(Long campaignId);

    boolean existsByCampaignIdAndAccountId(Long campaignId, Long accountId);
}
