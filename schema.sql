-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.bracket (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title character varying,
  current boolean DEFAULT true,
  user_id bigint,
  CONSTRAINT bracket_pkey PRIMARY KEY (id),
  CONSTRAINT bracket_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profile(id)
);
CREATE TABLE public.event (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title character varying,
  type character varying,
  description character varying,
  user_id bigint,
  date date,
  time time without time zone,
  location character varying,
  CONSTRAINT event_pkey PRIMARY KEY (id),
  CONSTRAINT event_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profile(id)
);
CREATE TABLE public.profile (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  brackets integer,
  courses integer,
  full_name character varying,
  email character varying,
  supabase_user_id uuid,
  CONSTRAINT profile_pkey PRIMARY KEY (id),
  CONSTRAINT profile_supabase_user_id_fkey FOREIGN KEY (supabase_user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.unit (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  items bigint,
  title character varying,
  bracket_id bigint,
  CONSTRAINT unit_pkey PRIMARY KEY (id),
  CONSTRAINT unit_bracket_id_fkey FOREIGN KEY (bracket_id) REFERENCES public.bracket(id)
);