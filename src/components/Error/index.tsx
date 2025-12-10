import styled from "@emotion/styled";

interface ErrorProps {
  text: string;
}
const Error = ({ text }: ErrorProps) => {
  return (
    <ErrorState>
      <ErrorMessage>{text} </ErrorMessage>
    </ErrorState>
  );
};

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spaces.xxxl}px;
  gap: ${(props) => props.theme.spaces.lg}px;
  text-align: center;
`;

const ErrorMessage = styled.p`
  font-size: ${(props) => props.theme.fontSizes.xs}px;
  color: ${(props) => props.theme.colors.danger};
  font-weight: 500;
  max-width: 600px;
`;

export default Error;
