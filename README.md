[from sefo/budget](https://github.com/sefo/budget)

DONE :

lier à la bdd

``` 
-- Table: public.ligne_budget

-- DROP TABLE public.ligne_budget;

CREATE TABLE public.ligne_budget
(
    date date,
    type integer,
    intitule text COLLATE pg_catalog."default",
    valeur integer,
    id integer NOT NULL DEFAULT nextval('ligne_budget_id_seq'::regclass),
    CONSTRAINT ligne_budget_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.ligne_budget
    OWNER to postgres;
```
=======
# budget
liaison avec BDD du projet sefo/budget
