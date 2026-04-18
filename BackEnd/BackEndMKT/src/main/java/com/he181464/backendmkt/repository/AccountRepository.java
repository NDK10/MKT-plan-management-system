package com.he181464.backendmkt.repository;


import com.he181464.backendmkt.entity.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long>, JpaSpecificationExecutor<Account> {


    List<Account> findByStatusAndRoleId(Integer status, Long roleId);

    List<Account> findByIdIn(List<Long> ids);

    Optional<Account> findByEmail(String email);

    List<Account> findAllByStatusTrue();

    Optional<Account> findById(Long accountId);

    Account findAccountsById(Long accountId);

    @Query("select a from Account a where a.role.id = :roleId")
    Page<Account> findByRole(@Param("roleId") Integer roleId, Pageable pageable);

    boolean existsAccountByPhoneNumber(String phoneNumber);

    boolean existsAccountByEmailAndIdIsNot(String email, Long accountId);

    boolean existsAccountByPhoneNumberAndIdIsNot(String phoneNumber, Long accountId);

    boolean existsAccountByEmail(String email);

    @Query("select count(a) from Account a where a.role.name ='Student' and a.status = 1")
    Integer countActiveStudent();

    @Query("select count(a) from Account a where a.role.name ='Teacher' and a.status = 1")
    Integer countActiveTeacher();

    @Query("SELECT month(e.createdAt) as month, count(e) as total" +
            " from Account e " +
            "where year(e.createdAt) = :year " +
            "group by month(e.createdAt) " +
            "order by month(e.createdAt)")
    List<Object[]> getStudentByYear(@Param("year") int year);
}
