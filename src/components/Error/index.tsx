import styled from "@emotion/styled";
import { themeUtils } from "styles/theme";

interface ErrorProps {
  text: string;
}

const Error = ({ text }: ErrorProps) => {
  return (
    <ErrorContainer>
      <ErrorState>
        <ErrorMessage>{text}</ErrorMessage>
      </ErrorState>
    </ErrorContainer>
  );
};

const { tablet } = themeUtils.mediaQueries;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 300px;
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 600px;
  padding: ${(props) => props.theme.spaces.lg}px;
`;

const ErrorMessage = styled.p`
  font-size: ${(props) => props.theme.fontSizes.xs}px;
  color: ${(props) => props.theme.colors.danger};
  font-weight: 500;
  line-height: 1.5;

  ${tablet} {
    font-size: ${(props) => props.theme.fontSizes.xxs}px;
  }
`;

export default Error;
