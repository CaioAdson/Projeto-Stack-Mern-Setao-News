import styled, { keyframes } from "styled-components";

const AlertBox = styled.div`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radius};
  font-family: Roboto, Arial, sans-serif;
  font-size: 0.9rem;
  color: ${({ $type, theme }) => ($type === "success" ? theme.success : theme.danger)};
  background-color: ${({ $type, theme }) => ($type === "success" ? theme.successBg : theme.dangerBg)};
`;

/** Mensagem de erro ou sucesso. Não renderiza nada se não houver mensagem. */
export function Alert({ type = "error", children }) {
  if (!children) return null;
  return (
    <AlertBox $type={type} role={type === "error" ? "alert" : "status"}>
      {children}
    </AlertBox>
  );
}

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem 0;

  span {
    width: 2.5rem;
    height: 2.5rem;
    border: 4px solid #d6d6d6;
    border-top-color: ${({ theme }) => theme.primary};
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
  }
`;

export function Spinner() {
  return (
    <SpinnerWrapper aria-label="Carregando">
      <span />
    </SpinnerWrapper>
  );
}

export const EmptyState = styled.p`
  grid-column: 1 / -1;
  text-align: center;
  font-size: 1.3rem;
  color: ${({ theme }) => theme.muted};
  padding: 2rem 0;
`;
