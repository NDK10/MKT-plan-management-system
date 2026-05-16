package com.he181464.backendmkt.controller;

import com.he181464.backendmkt.AIService.OpenAiService;
import com.he181464.backendmkt.dto.ChatRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/openai")
@RequiredArgsConstructor
public class OpenAiController {

    private final OpenAiService openAiService;

    @PostMapping("/chat")
    public ResponseEntity<?> chat(
            @RequestBody ChatRequest request
    ) {

        return ResponseEntity.ok(openAiService.callOpenAi(request.getMessage()));
    }


    @PostMapping(
            value = "/chat",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> chat(

            @RequestParam("message")
            String message,

            @RequestParam(value = "files",
                    required = false)
            MultipartFile[] files

    ) {

        return ResponseEntity.ok(
                openAiService.chat(message, files)
        );
    }
}