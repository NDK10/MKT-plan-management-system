package com.he181464.backendmkt.model.mapper;


import com.he181464.backendmkt.dto.AccountDto;
import com.he181464.backendmkt.dto.AccountResponseDto;
import com.he181464.backendmkt.entity.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(config = MapstructConfig.class)
public interface AccountMapper {

    @Mapping(source = "role.name", target = "roleName")
    AccountResponseDto toDTO(Account account);

    AccountDto toAccountDto(Account account);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "googleAccountId", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "roleId",ignore = true)
    Account toAccountEntity(AccountDto accountDto);

    Account toEntity(AccountDto accountDto);

    @Mapping(target = "password",ignore = true)
    @Mapping(target = "updatedAt",ignore = true)
    @Mapping(target = "role",ignore = true)
    @Mapping(target = "roleId",ignore = true)
    @Mapping(target = "status",ignore = true)
    void updateEntityFromDTO(AccountDto accountDto, @MappingTarget Account account);

}
