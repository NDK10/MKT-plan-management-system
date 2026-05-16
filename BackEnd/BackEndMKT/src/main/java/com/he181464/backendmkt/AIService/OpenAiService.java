package com.he181464.backendmkt.AIService;

import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.tika.Tika;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OpenAiService {

    private final OpenAiKeyService keyService;

    private final RestTemplate restTemplate = new RestTemplate();

    public String callOpenAi(String prompt) {


        int retry = 0;

        while (retry < 5) {

            OpenAiApiKey key = keyService.getFirstKey();

            try {

                HttpHeaders headers = new HttpHeaders();
                headers.setBearerAuth(key.getApiKey());
                headers.setContentType(MediaType.APPLICATION_JSON);

                Map<String, Object> body = new HashMap<>();

                body.put("model", "gpt-4o-mini");

                body.put("messages", List.of(

                        Map.of(
                                "role", "system",
                                "content",
                                """
                                        Bạn là AI chuyên về marketing.
                                        
                                        Chỉ trả lời:
                                        - SEO
                                        - Branding
                                        - Facebook Ads
                                        - Google Ads
                                        - Social Ads
                                        - Content Marketing
                                        - Social Media
                                        
                                        Nếu câu hỏi ngoài marketing:
                                        hãy trả lời:
                                        'Tôi chỉ hỗ trợ nghiệp vụ marketing.'
                                        """
                        ),

                        Map.of(
                                "role", "user",
                                "content", prompt
                        )
                ));

                HttpEntity<?> entity =
                        new HttpEntity<>(body, headers);

                ResponseEntity<String> response =
                        restTemplate.postForEntity(
                                "https://api.openai.com/v1/chat/completions",
                                entity,
                                String.class
                        );

                return response.getBody();

            } catch (HttpClientErrorException.TooManyRequests e) {

                keyService.markRateLimited(key);

                retry++;

            } catch (Exception e) {

                retry++;
            }
        }

        throw new RuntimeException("All API keys exhausted");
    }


    public String chat(
            String message,
            MultipartFile[] files
    ) {

        StringBuilder extractedText =
                new StringBuilder();

        try {

            if (files != null) {

                for (MultipartFile file : files) {

                    String fileName =
                            file.getOriginalFilename();

                    String text =
                            extractText(file);

                    extractedText.append("""
                            
                            ====================
                            FILE: %s
                            ====================
                            
                            %s
                            
                            """
                            .formatted(fileName, text));
                }
            }

        } catch (Exception e) {

            throw new RuntimeException(e);
        }

        String finalPrompt = """
                
                USER QUESTION:
                %s
                
                FILE CONTENT:
                %s
                
                """
                .formatted(
                        message,
                        extractedText
                );

        return callOpenAi(finalPrompt);
    }


    private String extractText(
            MultipartFile file
    ) throws Exception {

        String fileName =
                file.getOriginalFilename()
                        .toLowerCase();

        if (fileName.endsWith(".pdf")) {

            return extractPdf(file);

        } else if (
                fileName.endsWith(".docx")
        ) {

            return extractWord(file);

        } else if (
                fileName.endsWith(".xlsx")
        ) {

            return extractExcel(file);

        } else if (
                fileName.endsWith(".txt")
        ) {

            return new String(
                    file.getBytes(),
                    StandardCharsets.UTF_8
            );
        }

        return "Unsupported file";
    }


    private String extractPdf(MultipartFile file) throws Exception {

        Tika tika = new Tika();

        return tika.parseToString(
                file.getInputStream()
        );
    }


    private String extractWord(
            MultipartFile file
    ) throws Exception {

        XWPFDocument document =
                new XWPFDocument(
                        file.getInputStream()
                );

        XWPFWordExtractor extractor =
                new XWPFWordExtractor(
                        document
                );

        String text = extractor.getText();

        extractor.close();
        document.close();

        return text;
    }


    private String extractExcel(
            MultipartFile file
    ) throws Exception {

        StringBuilder result =
                new StringBuilder();

        Workbook workbook =
                WorkbookFactory.create(
                        file.getInputStream()
                );

        for (Sheet sheet : workbook) {

            result.append("\n");
            result.append("SHEET: ")
                    .append(sheet.getSheetName());
            result.append("\n");

            for (Row row : sheet) {

                for (Cell cell : row) {

                    result.append(
                            cell.toString()
                    );

                    result.append(" | ");
                }

                result.append("\n");
            }
        }

        workbook.close();

        return result.toString();
    }
}
