package com.he181464.backendmkt.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

        // Số thread chạy thường xuyên
        executor.setCorePoolSize(5);

        // Số thread tối đa
        executor.setMaxPoolSize(10);

        // Queue chứa task khi full core threads
        executor.setQueueCapacity(50);

        // Prefix để dễ debug log
        executor.setThreadNamePrefix("Async-Email-");

        // Cách xử lý khi queue full
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());

        executor.initialize();
        return executor;
    }
}
