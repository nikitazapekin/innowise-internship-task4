import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import Layout from "components/Layout";
import Message from "components/Message";

interface WebSocketMessage {
  id: number;
  text: string;
  timestamp: string;
  type: "sent" | "received";
}

const Chat = () => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [connectionStatus, setConnectionStatus] = useState<string>("Отключено");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);
  const messageIdRef = useRef<number>(1);

  const connectWebSocket = () => {
    try {
      setConnectionStatus("Подключаемся...");
      setIsConnected(false);

      const socket = new WebSocket("wss://ws.ifelse.io");

      socket.onopen = () => {
        setConnectionStatus("Подключено");
        setIsConnected(true);
        addMessage("Соединение установлено с сервером", "received");
      };

      socket.onmessage = (event) => {
        addMessage(`${event.data}`, "received");
      };

      socket.onerror = () => {
        setConnectionStatus("Ошибка соединения");
        setIsConnected(false);
        addMessage("Произошла ошибка соединения", "received");
      };

      socket.onclose = (event) => {
        setConnectionStatus("Отключено");
        setIsConnected(false);

        addMessage(`Соединение закрыто. Код: ${event.code}`, "received");
      };

      socketRef.current = socket;
    } catch (error) {
      setConnectionStatus("Ошибка при подключении");
      setIsConnected(false);
      addMessage(`Не удалось подключиться: ${error}`, "received");
    }
  };

  const sendMessage = () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      addMessage("Не подключено к серверу", "received");

      return;
    }

    if (inputValue.trim()) {
      socketRef.current.send(inputValue);
      addMessage(inputValue, "sent");
      setInputValue("");
    }
  };

  const addMessage = (text: string, type: "sent" | "received") => {
    const newMessage: WebSocketMessage = {
      id: messageIdRef.current++,
      text,
      timestamp: new Date().toLocaleTimeString(),
      type,
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  const disconnectWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      disconnectWebSocket();
    };
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <Layout>
      <ChatContainer>
        <ChatHeader>
          <ChatTitle>WebSocket Chat</ChatTitle>
          <ConnectionStatus>{connectionStatus}</ConnectionStatus>
        </ChatHeader>

        <ConnectionControls>
          <ConnectButton onClick={connectWebSocket}>Подключиться</ConnectButton>
          <DisconnectButton onClick={disconnectWebSocket}>Отключиться</DisconnectButton>
          <ClearButton onClick={clearMessages}>Очистить историю</ClearButton>
        </ConnectionControls>

        <MessageInputSection>
          <MessageInput
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введите сообщение..."
            disabled={!isConnected}
          />
          <SendButton onClick={sendMessage} disabled={!isConnected}>
            Отправить
          </SendButton>
        </MessageInputSection>

        <MessagesContainer>
          {messages.length === 0 ? (
            <EmptyState>Сообщений пока нет</EmptyState>
          ) : (
            messages.map((message) => <Message message={message} key={message.id} />)
          )}
        </MessagesContainer>

        <ConnectionInfo>
          <InfoText>Сервер: wss://ws.ifelse.io</InfoText>
          <InfoText>Сообщений: {messages.length}</InfoText>
        </ConnectionInfo>
      </ChatContainer>
    </Layout>
  );
};

const ChatContainer = styled.div`
  max-width: ${(props) => props.theme.containers.lg}px;
  width: 100%;
  margin: 0 auto;
  padding: ${(props) => props.theme.spaces.lg}px;
  font-family: ${(props) => props.theme.fontFamilies.primary};
  background: ${(props) => props.theme.colors.white};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spaces.sm}px;
  padding-bottom: ${(props) => props.theme.spaces.md}px;
  border-bottom: 2px solid ${(props) => props.theme.colors.light};
`;

const ChatTitle = styled.h2`
  font-family: ${(props) => props.theme.fontFamilies.secondary};
  font-size: ${(props) => props.theme.fontSizes.lg}px;
  color: ${(props) => props.theme.colors.primary};
  margin: 0;
`;

const ConnectionStatus = styled.div`
  padding: ${(props) => props.theme.spaces.xxs}px ${(props) => props.theme.spaces.sm}px;
  border-radius: 20px;
  font-size: ${(props) => props.theme.fontSizes.xs}px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.success};
  border: 1px solid ${(props) => props.theme.colors.success};
`;

const ConnectionControls = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spaces.sm}px;
  margin-bottom: ${(props) => props.theme.spaces.sm}px;
  flex-wrap: wrap;
`;

const BaseButton = styled.button`
  padding: ${(props) => props.theme.spaces.xxs}px ${(props) => props.theme.spaces.sm}px;
  border: none;
  border-radius: 8px;
  font-family: ${(props) => props.theme.fontFamilies.primary};
  font-size: ${(props) => props.theme.fontSizes.xs}px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ConnectButton = styled(BaseButton)`
  background: ${(props) => props.theme.colors.success};
  color: ${(props) => props.theme.colors.white};
`;

const DisconnectButton = styled(BaseButton)`
  background: ${(props) => props.theme.colors.dark};
  color: ${(props) => props.theme.colors.white};
`;

const ClearButton = styled(BaseButton)`
  background: ${(props) => props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.white};
`;

const MessageInputSection = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spaces.sm}px;
  margin-bottom: ${(props) => props.theme.spaces.sm}px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: ${(props) => props.theme.spaces.xxs}px;
  border: 2px solid ${(props) => props.theme.colors.light};
  border-radius: 8px;
  font-family: ${(props) => props.theme.fontFamilies.primary};
  font-size: ${(props) => props.theme.fontSizes.sm}px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const SendButton = styled(BaseButton)`
  background: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.white};
  min-width: 100px;
`;

const MessagesContainer = styled.div`
  height: 400px;
  border: 2px solid ${(props) => props.theme.colors.light};
  border-radius: 8px;
  padding: ${(props) => props.theme.spaces.md}px;
  overflow-y: auto;
  background: ${(props) => props.theme.colors.light}10;
  margin-bottom: ${(props) => props.theme.spaces.lg}px;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${(props) => props.theme.colors.secondary};
  font-size: ${(props) => props.theme.fontSizes.sm}px;
`;

const ConnectionInfo = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: ${(props) => props.theme.spaces.md}px;
  border-top: 1px solid ${(props) => props.theme.colors.light};
`;

const InfoText = styled.span`
  font-size: ${(props) => props.theme.fontSizes.xs}px;
  color: ${(props) => props.theme.colors.secondary};
`;

export default Chat;
