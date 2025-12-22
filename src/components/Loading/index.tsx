import styled from "@emotion/styled";

interface LoadingProps {
  text: string;
}
const Loading = ({ text }: LoadingProps) => {
  return (
    <LoadingState>
      <Spinner />
      <LoadingText>{text}</LoadingText>
    </LoadingState>
  );
};

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spaces.xxxl}px;
  gap: ${(props) => props.theme.spaces.lg}px;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid ${(props) => props.theme.colors.light};
  border-top: 4px solid ${(props) => props.theme.colors.main};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: ${(props) => props.theme.fontSizes.xs}px;
  color: ${(props) => props.theme.colors.secondary};
  font-weight: 500;
`;

export default Loading;
