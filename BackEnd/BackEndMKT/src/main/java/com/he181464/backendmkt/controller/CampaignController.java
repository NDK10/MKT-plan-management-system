package com.he181464.backendmkt.controller;

import com.he181464.backendmkt.dto.CampaignDTO;
import com.he181464.backendmkt.model.request.CampaignRequest;
import com.he181464.backendmkt.service.CampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('LEADER')")
    public ResponseEntity<Object> create(@RequestBody CampaignDTO dto) {

        return ResponseEntity.ok(campaignService.create(dto));

    }

    // ================= UPDATE =================
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('LEADER')")
    public ResponseEntity<Object> update(@PathVariable Long id,
                                         @RequestBody CampaignDTO dto) {
        return ResponseEntity.ok(campaignService.update(id, dto));
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        campaignService.delete(id);
        return ResponseEntity.ok("delete campaign successfully");
    }

    // ================= GET BY ID =================
    @GetMapping("/{id}")
    public ResponseEntity<Object> getById(@PathVariable Long id) {
        return ResponseEntity.ok(campaignService.getById(id));
    }

    // ================= GET ALL =================
    @GetMapping
    public ResponseEntity<Object> getAll() {
        return ResponseEntity.ok(campaignService.getAll());
    }

    @PostMapping("/accept/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> acceptCampaign(@PathVariable Long id) {
        return ResponseEntity.ok(campaignService.acceptCampaign(id));
    }

    @PostMapping("/reject/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Object> rejectCampaign(@PathVariable Long id) {
        return ResponseEntity.ok(campaignService.rejectCampaign(id));
    }

    @PostMapping("/search")
    public ResponseEntity<Object> searchCampaigns(@RequestBody CampaignRequest campaignRequest) {
        return ResponseEntity.ok(campaignService.searchCampaigns(campaignRequest));
    }


}
