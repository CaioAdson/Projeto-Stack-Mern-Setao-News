import styled, { css } from "styled-components";

const variants = {
  primary: css`
    background-color: ${({ theme }) => theme.primary};
    color: #fff;
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.primaryDark};
    }
  `,
  outline: css`
    background-color: transparent;
    color: ${({ theme }) => theme.primaryDark};
    border-color: ${({ theme }) => theme.primary};
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.primary};
      color: #fff;
    }
  `,
  danger: css`
    background-color: ${({ theme }) => theme.danger};
    color: #fff;
    &:hover:not(:disabled) {
      filter: brightness(0.9);
    }
  `,
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border: 2px solid transparent;
  border-radius: ${({ theme }) => theme.radius};
  padding: 0.5rem 1.1rem;
  font-family: Roboto, Arial, sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.06rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  ${({ $variant }) => variants[$variant] || variants.primary}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/** Botão reutilizável com variações visuais (primary, outline, danger). */
export function Button({ variant = "primary", loading = false, children, ...props }) {
  return (
    <StyledButton $variant={variant} disabled={loading || props.disabled} {...props}>
      {loading ? "Aguarde..." : children}
    </StyledButton>
  );
}
