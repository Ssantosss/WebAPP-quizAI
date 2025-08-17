-- Seed materie per i corsi esistenti (idempotente)
with
  econ as (select id from public.courses where name = 'Economia' limit 1),
  info as (select id from public.courses where name = 'Informatica' limit 1),
  ing  as (select id from public.courses where name = 'Ingegneria' limit 1),
  nut  as (select id from public.courses where name = 'Scienze della Nutrizione' limit 1)
insert into public.subjects (course_id, name, slug)
select econ.id, 'Microeconomia', 'microeconomia' from econ
union all select econ.id, 'Macroeconomia', 'macroeconomia' from econ

union all select info.id, 'Algoritmi',    'algoritmi'     from info
union all select info.id, 'Basi di Dati', 'basi-di-dati'  from info

union all select ing.id,  'Analisi 1',    'analisi-1'     from ing
union all select ing.id,  'Fisica 1',     'fisica-1'      from ing

union all select nut.id,  'Biochimica',   'biochimica'    from nut
union all select nut.id,  'Fisiologia',   'fisiologia'    from nut
on conflict (course_id, name) do nothing;

-- Verifica rapida (facoltativa)
-- select c.name, count(s.id) as subjects_count
-- from public.courses c left join public.subjects s on s.course_id = c.id
-- group by c.id, c.name order by c.name;

