-- 0003_floor_level.sql
ALTER TABLE listings ADD COLUMN floor_level INTEGER;
ALTER TABLE listings ADD COLUMN floor_height_m REAL DEFAULT 3.2;
