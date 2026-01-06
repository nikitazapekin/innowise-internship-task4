import styled from "@emotion/styled";
import { themeUtils } from "styles/theme";

interface LoadingProps {
  text: string;
}

const Loading = ({ text }: LoadingProps) => {
  return (
    <LoadingContainer>
      <LoadingState>
        <Spinner />
        <LoadingText>{text}</LoadingText>
      </LoadingState>
    </LoadingContainer>
  );
};

const { tablet } = themeUtils.mediaQueries;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 300px;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spaces.lg}px;
  text-align: center;
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

  ${tablet} {
    width: 50px;
    height: 50px;
    border-width: 3px;
  }
`;

const LoadingText = styled.p`
  font-size: ${(props) => props.theme.fontSizes.xs}px;
  color: ${(props) => props.theme.colors.secondary};
  font-weight: 500;

  ${tablet} {
    font-size: ${(props) => props.theme.fontSizes.xxs}px;
  }
`;

export default Loading;
