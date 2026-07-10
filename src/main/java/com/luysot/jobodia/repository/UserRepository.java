package com.luysot.jobodia.repository;

import com.luysot.jobodia.model.Users;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByEmail(String email);
    @Query("select u from Users u where u.email = :email and (u.isDeleted = false or u.isDeleted is null)")
    Optional<Users> findActiveByEmail(@Param("email") String email);

    Optional<Users> findByEmailAndIsDeletedTrue(String email);

    Optional<Users> findByUsername(@Size(min = 3, max = 500) String username);
    @Query("select u from Users u where u.username = :username and (u.isDeleted = false or u.isDeleted is null)")
    Optional<Users> findActiveByUsername(@Param("username") @Size(min = 3, max = 500) String username);
}
