import styled from "@emotion/styled";

interface WebSocketMessage {
  message: {
    id: number;
    text: string;
    timestamp: string;
    type: "sent" | "received";
  };
}

const Message = ({ message }: WebSocketMessage) => {
  return (
    <MessageItem key={message.id} type={message.type}>
      <MessageContent>
        <MessageText>{message.text}</MessageText>
        <MessageTime>{message.timestamp}</MessageTime>
      </MessageContent>
    </MessageItem>
  );
};

export default Message;

const MessageItem = styled.div<{ type: "sent" | "received" }>`
  display: flex;
  justify-content: ${(props) => (props.type === "sent" ? "flex-end" : "flex-start")};
  margin-bottom: ${(props) => props.theme.spaces.md}px;
`;

const MessageContent = styled.div`
  width: 100%;
  padding: ${(props) => props.theme.spaces.sm}px ${(props) => props.theme.spaces.md}px;
  border-radius: 12px;
  background: ${(props) => props.theme.colors.white};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${(props) => props.theme.colors.light};
`;

const MessageText = styled.div`
  font-size: ${(props) => props.theme.fontSizes.sm}px;
  color: ${(props) => props.theme.colors.main};
  margin-bottom: ${(props) => props.theme.spaces.xxs}px;
  word-break: break-word;
`;

const MessageTime = styled.div`
  font-size: ${(props) => props.theme.fontSizes.xxs}px;
  color: ${(props) => props.theme.colors.secondary}80;
  text-align: right;
`;
