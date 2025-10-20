-- Extend listings with the fields the Media form + Map popup need
ALTER TABLE listings ADD COLUMN suburb TEXT;
ALTER TABLE listings ADD COLUMN price TEXT;
ALTER TABLE listings ADD COLUMN open_time TEXT;
ALTER TABLE listings ADD COLUMN beds INTEGER;
ALTER TABLE listings ADD COLUMN baths INTEGER;
ALTER TABLE listings ADD COLUMN cars INTEGER;
ALTER TABLE listings ADD COLUMN ev INTEGER;
ALTER TABLE listings ADD COLUMN solar INTEGER;
ALTER TABLE listings ADD COLUMN area TEXT;
ALTER TABLE listings ADD COLUMN cover_url TEXT;
ALTER TABLE listings ADD COLUMN agency_name TEXT;
ALTER TABLE listings ADD COLUMN agency_logo_url TEXT;
ALTER TABLE listings ADD COLUMN agents_json TEXT;

-- Optional seed (uncomment if you want a sample row)
-- INSERT INTO listings (title, description, suburb, lat, lng, price, open_time, beds, baths, cars, ev, solar, area, cover_url, agency_name, agents_json)
-- VALUES (
--   'Bondi Penthouse','Ocean views','Manly',-33.8908,151.2743,
--   '$1.35–$1.45m','Sat 11:15–11:45am',2,2,1,1,1,'120',
--   'https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1600&auto=format&fit=crop',
--   'Luxe Realty',
--   '[{"avatarUrl":"https://randomuser.me/api/portraits/women/65.jpg"},{"avatarUrl":"https://randomuser.me/api/portraits/men/44.jpg"}]'
-- );
