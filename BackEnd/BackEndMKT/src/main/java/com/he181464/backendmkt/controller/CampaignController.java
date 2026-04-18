package com.he181464.backendmkt.controller;

import com.he181464.backendmkt.dto.CampaignDTO;
import com.he181464.backendmkt.service.CampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;

    // ================= CREATE =================
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('LEADER')")
    public CampaignDTO create(@RequestBody CampaignDTO dto) {
        return campaignService.create(dto);
    }

    // ================= UPDATE =================
    @PutMapping("/{id}")
    public CampaignDTO update(@PathVariable Long id,
                              @RequestBody CampaignDTO dto) {
        return campaignService.update(id, dto);
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        campaignService.delete(id);
    }

    // ================= GET BY ID =================
    @GetMapping("/{id}")
    public CampaignDTO getById(@PathVariable Long id) {
        return campaignService.getById(id);
    }

    // ================= GET ALL =================
    @GetMapping
    public List<CampaignDTO> getAll() {
        return campaignService.getAll();
    }
}
