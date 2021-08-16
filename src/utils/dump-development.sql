--
-- PostgreSQL database dump
--

-- Dumped from database version 12.7 (Ubuntu 12.7-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.7 (Ubuntu 12.7-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    token text NOT NULL
);


--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    date date NOT NULL,
    description text NOT NULL,
    value integer NOT NULL,
    "userId" integer NOT NULL
);


--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text,
    email text,
    password text
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sessions VALUES (7, 411, '9b4ba8fd-1318-4782-854c-d82b7edcf571');


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.transactions VALUES (1, '2021-08-11', 'sjdjsa', 20, 406);
INSERT INTO public.transactions VALUES (2, '2021-08-11', 'fksjhf', -5, 406);
INSERT INTO public.transactions VALUES (3, '2021-08-11', 'lala', -10000, 408);
INSERT INTO public.transactions VALUES (4, '2021-08-11', 'lala', 10000, 408);
INSERT INTO public.transactions VALUES (5, '2021-08-11', 'sdha', 10000, 406);
INSERT INTO public.transactions VALUES (6, '2021-08-11', 'dshdfik', -10000, 406);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (400, 'Gio', 'gio@email.com', '$2b$10$UcSmmvocB/1tSaoRV6aSN.4pEtCzge1Azbui/Ly1JXTXfxWRs2BYa');
INSERT INTO public.users VALUES (401, 'gio', 'giovanna@email.com', '$2b$10$Hi0LcHup8wNROvNkA9C5FewF3Wck.2628T8rS4zsINDvVAghXX9Rm');
INSERT INTO public.users VALUES (402, 'usuario', 'email@email.com', '$2b$10$8Cmo5VZUoFkSUuh3RYJ4dOwupofngXlU8veJqhvR8OnI.ge.lRDEW');
INSERT INTO public.users VALUES (403, 'Luiz', 'luiz@email.com', '$2b$10$OWM0ierUyUcmvCR8fdaPyO1NK33e8T13.go7vC.PGnGbPJ9eDkXdC');
INSERT INTO public.users VALUES (404, 'gio', 'g@email.com', '$2b$10$4cZHSNhBAW0dBBDTFaShi.f/qU0nSA9dg9464woLfK.fN5bk.GHZC');
INSERT INTO public.users VALUES (405, 'gio', 'giov@email.com', '$2b$10$8Tszt2KV8cNi67JsDULJXep6zhDYMz8qgaI2JdXSpCt1TMy.6PvX2');
INSERT INTO public.users VALUES (406, 'oi', 'g@io.com', '$2b$10$qaVSCdvky.2Xwn8X9bycAeoTACI9y4XDU9LZvmZ8d2nsoRMrKaTae');
INSERT INTO public.users VALUES (407, 'gio', 'g@gh.com', '$2b$10$y39QTfxPmUtmBhRBveE1TOlPJD8BpzpNrb4BDXKfm6pofQtXO1lkC');
INSERT INTO public.users VALUES (408, 'tester', 'teste@dev.com', '$2b$10$XPLCfmHPsfJ.89lRR7Bs0udTr7sz7KX8ELf/wqnBsQWsJnBl/AlcW');
INSERT INTO public.users VALUES (409, 'vamo', 'vamo@123.com', '$2b$10$tSLLt/ZF.f2DAeHL36g2UeOwG8ILpaAa1MO56Ao.1bGak2pqHErRi');
INSERT INTO public.users VALUES (410, 'ggg', 'ggg@gg.com', '$2b$10$DqldFw58KbDTy2eLwFAhlOfJ86uinYBEFUDwNRmgQ60SECiEpbjAe');
INSERT INTO public.users VALUES (411, 'teste', 'te@te.com', '$2b$10$5zvtCn43wYhiFvpre2.tFuRz9gtmzuR1gW716yOqzzq6RUZh8i8cC');


--
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sessions_id_seq', 7, true);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.transactions_id_seq', 6, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 411, true);


--
-- PostgreSQL database dump complete
--

