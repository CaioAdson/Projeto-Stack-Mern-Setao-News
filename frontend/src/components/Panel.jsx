import styled from "styled-components";

/** Caixa branca usada como fundo de formulários e seções. */
export const Panel = styled.section`
  background-color: ${({ theme }) => theme.surface};
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 2rem;
  width: 100%;
  max-width: ${({ $narrow }) => ($narrow ? "720px" : "none")};
  margin: 0 auto;

  h1 {
    font-size: 2rem;
    margin-bottom: 1.2rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (max-width: 640px) {
    padding: 1.2rem;
  }
`;

export const FormActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  flex-wrap: wrap;
`;
