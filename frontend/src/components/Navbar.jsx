import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo-sertaonews.svg";
import { useAuth } from "../context/AuthContext";
import { searchSchema } from "../schemas";
import { Button } from "./Button";

const Nav = styled.nav`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #fff;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px;
  position: sticky;
  top: 0;
  z-index: 10;

  @media (max-width: 640px) {
    grid-template-columns: auto 1fr;
    padding: 0.75rem 1rem;

    form {
      grid-column: 1 / -1;
      order: 3;
    }
  }
`;

const SearchBox = styled.form`
  position: relative;
  max-width: 260px;
  width: 100%;

  input {
    width: 100%;
    padding: 0.6rem 2.6rem 0.6rem 0.8rem;
    border-radius: ${({ theme }) => theme.radius};
    border: 1px solid transparent;
    background-color: #f2f2f2;
    font-size: 1rem;
    outline: none;
  }

  input:focus {
    border-color: ${({ theme }) => theme.primary};
  }

  button {
    position: absolute;
    right: 0.3rem;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: transparent;
    color: #757575;
    padding: 0.35rem 0.5rem;
    cursor: pointer;
  }

  @media (max-width: 640px) {
    max-width: none;
  }
`;

const Logo = styled.img`
  width: auto;
  height: 3rem;
  display: block;
`;

const UserArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.9rem;
  font-family: Roboto, Arial, sans-serif;

  a.user {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: ${({ theme }) => theme.primaryDark};
    font-weight: 500;
  }

  a.user img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    object-fit: cover;
  }

  button.icon {
    border: none;
    background: none;
    font-size: 1.4rem;
    color: ${({ theme }) => theme.primary};
    cursor: pointer;
  }

  @media (max-width: 640px) {
    a.user span {
      display: none;
    }
  }
`;

const Main = styled.main`
  width: min(1100px, 100% - 2rem);
  margin: 1.5rem auto 3rem;
`;

/** Barra superior + área de conteúdo das páginas (layout principal). */
export function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(searchSchema) });

  function onSearch({ title }) {
    navigate(`/search?title=${encodeURIComponent(title)}`);
    reset();
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <>
      <Nav>
        <SearchBox onSubmit={handleSubmit(onSearch)} role="search">
          <input
            {...register("title")}
            type="search"
            placeholder={errors.title ? errors.title.message : "Pesquise por um título"}
            aria-label="Pesquisar notícias"
          />
          <button type="submit" aria-label="Pesquisar">
            <i className="bi bi-search" />
          </button>
        </SearchBox>

        <Link to="/" aria-label="Página inicial">
          <Logo src={logo} alt="SertãoNews" />
        </Link>

        <UserArea>
          {user ? (
            <>
              <Link to="/profile" className="user">
                <img src={user.avatar} alt="" referrerPolicy="no-referrer" />
                <span>{user.name}</span>
              </Link>
              <button type="button" className="icon" onClick={handleLogout} aria-label="Sair">
                <i className="bi bi-box-arrow-right" />
              </button>
            </>
          ) : (
            <Link to="/auth">
              <Button type="button">Entrar</Button>
            </Link>
          )}
        </UserArea>
      </Nav>

      <Main>
        <Outlet />
      </Main>
    </>
  );
}
