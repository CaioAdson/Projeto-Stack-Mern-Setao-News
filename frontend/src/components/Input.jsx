import { forwardRef, useId } from "react";
import styled, { css } from "styled-components";

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  width: 100%;

  label {
    font-family: Roboto, Arial, sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
  }
`;

const control = css`
  width: 100%;
  padding: 0.75rem 0.9rem;
  border-radius: ${({ theme }) => theme.radius};
  border: 1px solid ${({ $invalid, theme }) => ($invalid ? theme.danger : "#c9c9c9")};
  background: #fff;
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px rgba(196, 87, 42, 0.2);
  }

  &:disabled {
    background: #f3f3f3;
  }
`;

const StyledInput = styled.input`
  ${control}
`;

const StyledTextarea = styled.textarea`
  ${control}
  min-height: 220px;
  resize: vertical;
`;

const ErrorText = styled.span`
  color: ${({ theme }) => theme.danger};
  font-family: Roboto, Arial, sans-serif;
  font-size: 0.8rem;
`;

/**
 * Campo de formulário com rótulo e mensagem de erro.
 * Compatível com o register() do react-hook-form (repassa a ref).
 */
export const Input = forwardRef(function Input({ label, error, multiline = false, ...props }, ref) {
  const id = useId();
  const Control = multiline ? StyledTextarea : StyledInput;

  return (
    <Field>
      {label && <label htmlFor={id}>{label}</label>}
      <Control
        id={id}
        ref={ref}
        $invalid={Boolean(error)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <ErrorText id={`${id}-error`} role="alert">
          {error}
        </ErrorText>
      )}
    </Field>
  );
});
