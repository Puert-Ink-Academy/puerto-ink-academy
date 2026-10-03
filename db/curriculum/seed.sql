-- Five styles and level 1 of each, authored by the seeded teacher.
-- Run db/users/seed.sql first. Safe to run again: existing ids are left as they are.
-- Lesson text matches the app's sample lessons. Reference rows have no file yet.
--   psql "$DATABASE_URL" -f db/curriculum/seed.sql

BEGIN;

INSERT INTO categories (id, name, slug, tagline, sequence_order, created_by)
SELECT id, name, slug, tagline, sequence_order, teacher.id
FROM (
  VALUES
    (
      '10000000-0000-4000-8000-000000000001'::uuid,
      'Fine Line',
      'fine-line',
      'Precision linework and delicate detail',
      1
    ),
    (
      '10000000-0000-4000-8000-000000000002'::uuid,
      'Realism',
      'realism',
      'Light, depth and lifelike texture',
      2
    ),
    (
      '10000000-0000-4000-8000-000000000003'::uuid,
      'Japanese',
      'japanese',
      'Bold waves, koi and flowing backgrounds',
      3
    ),
    (
      '10000000-0000-4000-8000-000000000004'::uuid,
      'Traditional',
      'traditional',
      'Bold lines and saturated color',
      4
    ),
    (
      '10000000-0000-4000-8000-000000000005'::uuid,
      'Watercolor',
      'watercolor',
      'Soft washes and painterly blends',
      5
    )
) AS styles (id, name, slug, tagline, sequence_order)
CROSS JOIN (
  SELECT id FROM users WHERE lower(email) = 'christoforosvradis@gmail.com'
) AS teacher
ON CONFLICT (id) DO NOTHING;

INSERT INTO levels (id, category_id, position, current_version_id)
VALUES
  (
    '11000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    1,
    '12000000-0000-4000-8000-000000000001'
  ),
  (
    '11000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000002',
    1,
    '12000000-0000-4000-8000-000000000002'
  ),
  (
    '11000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-8000-000000000003',
    1,
    '12000000-0000-4000-8000-000000000003'
  ),
  (
    '11000000-0000-4000-8000-000000000004',
    '10000000-0000-4000-8000-000000000004',
    1,
    '12000000-0000-4000-8000-000000000004'
  ),
  (
    '11000000-0000-4000-8000-000000000005',
    '10000000-0000-4000-8000-000000000005',
    1,
    '12000000-0000-4000-8000-000000000005'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO level_versions (
  id,
  level_id,
  version_number,
  title,
  objective,
  exercise,
  tips,
  created_by
)
SELECT version_id, level_id, 1, title, objective, exercise, tips, teacher.id
FROM (
  VALUES
    (
      '12000000-0000-4000-8000-000000000001'::uuid,
      '11000000-0000-4000-8000-000000000001'::uuid,
      'Studio Hygiene',
      'Set up and break down a clean, cross-contamination-free station',
      'Photograph your fully wrapped and prepared station before a session',
      'Wrap everything you will touch with gloves on, then don''t touch anything else'
    ),
    (
      '12000000-0000-4000-8000-000000000002'::uuid,
      '11000000-0000-4000-8000-000000000002'::uuid,
      'Value Scales',
      'Read and reproduce a full range of values from black to skin',
      'Shade a ten-step value scale with clean, even transitions',
      'Squint at your reference to see values instead of details'
    ),
    (
      '12000000-0000-4000-8000-000000000003'::uuid,
      '11000000-0000-4000-8000-000000000003'::uuid,
      'Wind Bars',
      'Lay down the bold black wind bars that frame Japanese work',
      'Fill a practice sheet with sweeping wind bars in solid black',
      'Follow the body''s flow: wind bars should curve with the muscle'
    ),
    (
      '12000000-0000-4000-8000-000000000004'::uuid,
      '11000000-0000-4000-8000-000000000004'::uuid,
      'Bold Outlines',
      'Pull thick, confident outlines in a single pass',
      'Outline a classic swallow with a 9 round liner',
      'Slow down. Bold lines need a steady, unhurried hand speed'
    ),
    (
      '12000000-0000-4000-8000-000000000005'::uuid,
      '11000000-0000-4000-8000-000000000005'::uuid,
      'Color Theory',
      'Choose harmonious palettes that heal well together',
      'Pack a color wheel with smooth transitions between hues',
      'Complementary colors make each other pop, but mix into mud'
    )
) AS lessons (version_id, level_id, title, objective, exercise, tips)
CROSS JOIN (
  SELECT id FROM users WHERE lower(email) = 'christoforosvradis@gmail.com'
) AS teacher
ON CONFLICT (id) DO NOTHING;

INSERT INTO level_references (id, level_version_id, label, sort_order)
VALUES
  ('13000000-0000-4000-8000-000000000001', '12000000-0000-4000-8000-000000000001', 'Station wrap', 0),
  ('13000000-0000-4000-8000-000000000002', '12000000-0000-4000-8000-000000000001', 'Glove changes', 1),
  ('13000000-0000-4000-8000-000000000003', '12000000-0000-4000-8000-000000000002', 'Value scale', 0),
  ('13000000-0000-4000-8000-000000000004', '12000000-0000-4000-8000-000000000002', 'Grey wash dilutions', 1),
  ('13000000-0000-4000-8000-000000000005', '12000000-0000-4000-8000-000000000003', 'Wind bar flow', 0),
  ('13000000-0000-4000-8000-000000000006', '12000000-0000-4000-8000-000000000004', 'Liner groupings', 0),
  ('13000000-0000-4000-8000-000000000007', '12000000-0000-4000-8000-000000000004', 'Single-pass lines', 1),
  ('13000000-0000-4000-8000-000000000008', '12000000-0000-4000-8000-000000000005', 'Color wheel', 0)
ON CONFLICT (id) DO NOTHING;

COMMIT;
