package com.luysot.jobodia.service.specification;

import com.luysot.jobodia.model.Jobs;
import com.luysot.jobodia.model.enums.JobLevel;
import com.luysot.jobodia.model.enums.JobSite;
import com.luysot.jobodia.model.enums.JobTime;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class JobSpecification {
    public static Specification<Jobs> hasTitle(String keyword){
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("title")
                        ), "%" + keyword.toLowerCase() + "%")
        );
    }

    public static Specification<Jobs> hasIndustry(String keyword){
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("industry").get("industryName")
                        ), "%" + keyword.toLowerCase() + "%")
        );
    }

    public static Specification<Jobs> hasCompany(String keyword){
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("employer").get("companyName")
                        ), "%" + keyword.toLowerCase() + "%")
        );
    }

    public static Specification<Jobs> hasCategory(String keyword){
        return ((root, query, criteriaBuilder) ->
                criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("categories").get("categoryName")
                        ), "%" + keyword.toLowerCase() + "%")
        );
    }

    public static Specification<Jobs> hasJobType(JobTime jobType) {

        return (root, query, cb) ->
                cb.equal(root.get("jobType"), jobType);
    }

    public static Specification<Jobs> hasJobLevel(JobLevel jobLevel) {

        return (root, query, cb) ->
                cb.equal(root.get("jobLevel"), jobLevel);
    }

    public static Specification<Jobs> hasJobSite(JobSite jobSite) {

        return (root, query, cb) ->
                cb.equal(root.get("jobSite"), jobSite);
    }

}
