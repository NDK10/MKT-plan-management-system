import React, { useEffect, useRef, useState } from "react";

import {
  Layout,
  Input,
  Button,
  Avatar,
  Typography,
  Upload,
  Spin,
  Tag,
} from "antd";

import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  PaperClipOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import AIService from "../service/AIService";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

export default function AIChatScreen() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Xin chào 👋",
    },
  ]);

  const [input, setInput] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);

  const [fileList, setFileList] = useState([]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() && fileList.length === 0) {
      return;
    }

    const userMessage = {
      role: "user",
      content: input,
      files: fileList,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentFiles = fileList;

    let updatedContext = context + `\n\nUser: ${input}\n`;

    // LIMIT CONTEXT
    const MAX_CONTEXT = 12000;

    if (updatedContext.length > MAX_CONTEXT) {
      updatedContext = updatedContext.slice(-MAX_CONTEXT);
    }

    setInput("");
    setFileList([]);
    setLoading(true);

    try {
      const response = await AIService.chatAI(updatedContext, currentFiles);

      const aiContent = response.data.choices[0].message.content;

      const aiMessage = {
        role: "assistant",
        content: aiContent,
      };

      setMessages((prev) => [...prev, aiMessage]);

      updatedContext += `\nAssistant: ${aiContent}\n`;

      setContext(updatedContext);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Có lỗi xảy ra.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (uid) => {
    setFileList((prev) => prev.filter((file) => file.uid !== uid));
  };

  return (
    <Layout style={{ height: "100vh" }}>
      {/* HEADER */}
      <Header
        style={{
          background: "#001529",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          fontSize: 20,
          fontWeight: 600,
        }}
      >
        AI Chat
      </Header>

      {/* CHAT */}
      <Content
        style={{
          padding: 16,
          overflowY: "auto",
          background: "#f5f5f5",
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {messages.map((msg, index) => {
            const isUser = msg.role === "user";

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: isUser ? "flex-end" : "flex-start",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    maxWidth: "75%",
                    flexDirection: isUser ? "row-reverse" : "row",
                  }}
                >
                  <Avatar
                    icon={isUser ? <UserOutlined /> : <RobotOutlined />}
                  />

                  <div>
                    {/* MESSAGE */}
                    <div
                      style={{
                        background: isUser ? "#1677ff" : "#fff",
                        color: isUser ? "#fff" : "#000",
                        padding: "12px 16px",
                        borderRadius: 16,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      }}
                    >
                      <Text
                        style={{
                          color: isUser ? "#fff" : "#000",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {msg.content}
                      </Text>

                      {/* FILES */}
                      {msg.files?.length > 0 && (
                        <div
                          style={{
                            marginTop: 10,
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 8,
                          }}
                        >
                          {msg.files.map((file) => (
                            <Tag key={file.uid}>📎 {file.name}</Tag>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Spin size="small" />
              <Text>AI đang trả lời...</Text>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </Content>

      {/* INPUT */}
      <Footer
        style={{
          background: "#fff",
          borderTop: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {/* FILE PREVIEW */}
          {fileList.length > 0 && (
            <div
              style={{
                marginBottom: 10,
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {fileList.map((file) => (
                <Tag
                  key={file.uid}
                  closable
                  onClose={() => removeFile(file.uid)}
                  closeIcon={<CloseOutlined />}
                >
                  📎 {file.name}
                </Tag>
              ))}
            </div>
          )}

          {/* INPUT + BUTTON */}
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-end",
            }}
          >
            {/* UPLOAD BUTTON */}
            <Upload
              multiple
              beforeUpload={() => false}
              showUploadList={false}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              <Button icon={<PaperClipOutlined />} />
            </Upload>

            {/* INPUT */}
            <Input.TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              autoSize={{
                minRows: 1,
                maxRows: 5,
              }}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            {/* SEND */}
            <Button
              type="primary"
              icon={<SendOutlined />}
              loading={loading}
              onClick={handleSend}
            >
              Gửi
            </Button>
          </div>
        </div>
      </Footer>
    </Layout>
  );
}
