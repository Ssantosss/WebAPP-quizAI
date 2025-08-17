-- Abilita RLS e consenti SELECT a anon+authenticated su subjects
alter table public.subjects enable row level security;

drop policy if exists "read subjects" on public.subjects;

create policy "read subjects"
on public.subjects
for select
to anon, authenticated
using (true);

