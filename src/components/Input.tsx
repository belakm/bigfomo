import styled from "styled-components";

const Input = styled.input<{ maxWidth?: number }>`
  display: inline-block;
  color: #002b3f;
  font-weight: 500;
  margin: 0;
  font-size: 1.2em;
  line-height: 1;
  max-width: ${({ maxWidth }) => (maxWidth ? maxWidth : 4)}em;
  border: 0;
  border-bottom: 1px solid #002b3f;
`;

export default Input;
