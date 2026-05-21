package com.gym.userservice.dto;

import org.springframework.data.domain.Page;

public class PagedResponseUtil {

    public static <T> PagedResponse<T> of(Page<T> page) {
        return new PagedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                !page.isLast()
        );
    }
}