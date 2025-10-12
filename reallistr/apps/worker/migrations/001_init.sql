PRAGMA foreign_keys=ON;

CREATE TABLE agencies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  abn TEXT,
  logo_url TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE agency_users (
  agency_id TEXT NOT NULL REFERENCES agencies(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK(role IN ('owner','admin','agent','marketing','viewer')),
  PRIMARY KEY (agency_id, user_id)
);

CREATE TABLE listings (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES agencies(id),
  code TEXT,
  listing_number INTEGER,
  listing_ref TEXT UNIQUE,
  status TEXT NOT NULL CHECK(status IN ('draft','review','vendor_approved','live','under_offer','sold','leased','archived')),
  sale_or_lease TEXT CHECK(sale_or_lease IN ('sale','lease')),
  property_type TEXT,
  headline TEXT,
  summary TEXT,
  description TEXT,
  price_guide_cents INTEGER,
  method_of_sale TEXT,
  auction_at INTEGER,
  bedrooms REAL, bathrooms REAL, car_spaces REAL,
  land_area REAL, land_area_unit TEXT, building_area REAL, building_area_unit TEXT,
  year_built INTEGER, energy_rating REAL,
  latitude REAL, longitude REAL,
  created_by TEXT REFERENCES users(id),
  created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);

CREATE TABLE listing_addresses (
  listing_id TEXT PRIMARY KEY REFERENCES listings(id),
  line1 TEXT, line2 TEXT, suburb TEXT, state TEXT, postcode TEXT, country TEXT,
  display_address BOOLEAN DEFAULT 1
);

CREATE TABLE listing_settings (
  listing_id TEXT PRIMARY KEY REFERENCES listings(id),
  show_price BOOLEAN DEFAULT 1,
  allow_offers BOOLEAN DEFAULT 1,
  allow_private_inspections BOOLEAN DEFAULT 1,
  lead_routing_email TEXT,
  watermark TEXT,
  privacy_flags TEXT
);

CREATE TABLE media (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES listings(id),
  type TEXT CHECK(type IN ('image','floorplan','document','video','tour','audio')),
  url TEXT NOT NULL,
  sort_order INTEGER,
  alt_text TEXT,
  is_hero BOOLEAN DEFAULT 0,
  width INTEGER, height INTEGER, size_bytes INTEGER,
  uploaded_by TEXT REFERENCES users(id),
  approved BOOLEAN DEFAULT 1,
  created_at INTEGER NOT NULL
);

CREATE TABLE marketing_copy (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES listings(id),
  section TEXT CHECK(section IN ('headline','short','long','features','instagram','adwords')),
  body TEXT,
  ai_source TEXT,
  locked_by TEXT REFERENCES users(id),
  updated_at INTEGER NOT NULL
);

CREATE TABLE campaigns (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES listings(id),
  start_date INTEGER, end_date INTEGER,
  budget_cents INTEGER,
  portal_targets TEXT,
  social_targets TEXT,
  brochure_template TEXT,
  status TEXT CHECK(status IN ('planned','live','paused','completed')),
  created_at INTEGER NOT NULL
);

CREATE TABLE open_homes (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES listings(id),
  starts_at INTEGER NOT NULL,
  ends_at INTEGER NOT NULL,
  notes TEXT,
  published BOOLEAN DEFAULT 1
);

CREATE TABLE offers (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES listings(id),
  buyer_name TEXT,
  amount_cents INTEGER,
  conditions TEXT,
  status TEXT CHECK(status IN ('received','accepted','declined','withdrawn')),
  created_at INTEGER NOT NULL
);

CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES agencies(id),
  listing_id TEXT REFERENCES listings(id),
  source TEXT,
  name TEXT, email TEXT, phone TEXT,
  message TEXT,
  stage TEXT NOT NULL CHECK(stage IN ('new','qualified','inspection_booked','offer_made','won','lost')),
  owner_user_id TEXT REFERENCES users(id),
  score INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);

CREATE TABLE lead_activities (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id),
  actor_user_id TEXT REFERENCES users(id),
  action TEXT,
  meta TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE lead_routing_rules (
  agency_id TEXT NOT NULL REFERENCES agencies(id),
  rule_id TEXT PRIMARY KEY,
  rule JSON
);

CREATE TABLE external_upload_links (
  id TEXT PRIMARY KEY,
  agency_id TEXT NOT NULL REFERENCES agencies(id),
  listing_id TEXT NOT NULL REFERENCES listings(id),
  token TEXT UNIQUE NOT NULL,
  allowed_types TEXT,
  max_files INTEGER DEFAULT 50,
  expires_at INTEGER NOT NULL,
  created_by TEXT REFERENCES users(id),
  created_at INTEGER NOT NULL,
  revoked BOOLEAN DEFAULT 0
);

CREATE TABLE incoming_uploads (
  id TEXT PRIMARY KEY,
  link_id TEXT NOT NULL REFERENCES external_upload_links(id),
  type TEXT CHECK(type IN ('image','video','audio','document')),
  r2_key TEXT NOT NULL,
  original_name TEXT,
  size_bytes INTEGER,
  checksum TEXT,
  virus_scan_status TEXT CHECK(virus_scan_status IN ('pending','clean','flagged')) DEFAULT 'pending',
  transcode_status TEXT CHECK(transcode_status IN ('n/a','queued','processing','ready','failed')) DEFAULT 'n/a',
  created_at INTEGER NOT NULL
);

CREATE TABLE files (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES listings(id),
  name TEXT, url TEXT,
  category TEXT CHECK(category IN ('contract','section32','certificate','other')),
  signed BOOLEAN DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE TABLE activity_logs (
  id TEXT PRIMARY KEY,
  listing_id TEXT,
  actor_user_id TEXT,
  action TEXT,
  meta TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE daily_analytics (
  listing_id TEXT NOT NULL REFERENCES listings(id),
  day TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  enquiries INTEGER DEFAULT 0,
  PRIMARY KEY (listing_id, day)
);

CREATE INDEX idx_listings_agency_status ON listings(agency_id, status);
CREATE INDEX idx_media_listing_sort ON media(listing_id, sort_order);
CREATE INDEX idx_openhomes_listing_start ON open_homes(listing_id, starts_at);
CREATE INDEX idx_leads_agency_stage_owner ON leads(agency_id, stage, owner_user_id, created_at);
CREATE INDEX idx_listings_agency_number ON listings(agency_id, listing_number);
CREATE INDEX idx_listings_ref ON listings(listing_ref);
