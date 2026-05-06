package com.he181464.backendmkt.controller;

import com.he181464.backendmkt.dto.DetailPlanDto;
import com.he181464.backendmkt.model.request.DetailPlanCalendarRequest;
import com.he181464.backendmkt.model.request.DetailPlanRequest;
import com.he181464.backendmkt.service.DetailPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/detail-plans")
@RequiredArgsConstructor
public class DetailPlanController {

    private final DetailPlanService detailPlanService;

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('LEADER')")
    public ResponseEntity<Object> create(@RequestBody DetailPlanDto dto) {
        return ResponseEntity.ok(detailPlanService.create(dto));
    }

    @PutMapping("/update")
    @PreAuthorize("hasAuthority('LEADER')")
    public ResponseEntity<Object> update(@RequestBody DetailPlanDto dto) {
        return ResponseEntity.ok(detailPlanService.update(dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        detailPlanService.delete(id);
        return ResponseEntity.ok("delete detail plan successfully");
    }


    @PostMapping("/search")
    public ResponseEntity<Object> search(@RequestBody DetailPlanRequest dto) {
        return ResponseEntity.ok(detailPlanService.search(dto));
    }

    @PostMapping("/search-by-calendar")
    public ResponseEntity<Object> searchByCalendar(@RequestBody DetailPlanCalendarRequest dto) {
        return ResponseEntity.ok(detailPlanService.searchByCalendar(dto));
    }

    @PostMapping("/update-content")
    public ResponseEntity<Object> updateContent(@RequestBody DetailPlanDto dto) {
        return ResponseEntity.ok(detailPlanService.updateContent(dto));
    }

    @PostMapping("/approve-content")
    @PreAuthorize("hasAuthority('LEADER')")
    public ResponseEntity<Object> approveContent(@RequestBody DetailPlanDto dto) {
        return ResponseEntity.ok(detailPlanService.approveContent(dto));
    }

    @PostMapping("/update-status-complete/{id}")
    public ResponseEntity<Object> updateStatusComplete(@PathVariable Long id) {
        detailPlanService.updateStatusComplete(id);
        return ResponseEntity.ok("Đã cập nhật trạng thái hoàn thành");
    }


}
