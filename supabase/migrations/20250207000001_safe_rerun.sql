-- Safe to re-run: drops policies first if they exist, then recreates.
-- Use this only if you need to reset policies. Otherwise ignore.

drop policy if exists "Allow read games" on games;
drop policy if exists "Allow insert games" on games;
drop policy if exists "Allow read scores" on scores;
drop policy if exists "Allow insert scores" on scores;

create policy "Allow read games" on games for select using (true);
create policy "Allow insert games" on games for insert with check (true);
create policy "Allow read scores" on scores for select using (true);
create policy "Allow insert scores" on scores for insert with check (true);
