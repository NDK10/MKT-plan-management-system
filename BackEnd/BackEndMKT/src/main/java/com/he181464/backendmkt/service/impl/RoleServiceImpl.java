package com.he181464.backendmkt.service.impl;

import com.he181464.backendmkt.dto.RoleDto;
import com.he181464.backendmkt.entity.Role;
import com.he181464.backendmkt.repository.RoleRepository;
import com.he181464.backendmkt.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoleServiceImpl implements RoleService {


    private final RoleRepository roleRepository;

    @Override
    public List<RoleDto> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        List<RoleDto> roleDtos = roles.stream()
                .map(role -> new RoleDto(role.getId(), role.getName()))
                .toList();
        return roleDtos;

    }
}
