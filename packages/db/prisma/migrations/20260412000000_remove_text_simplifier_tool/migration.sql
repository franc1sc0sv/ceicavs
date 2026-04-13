DELETE FROM favorites WHERE tool_id = (SELECT id FROM tools WHERE slug = 'text-simplifier');
DELETE FROM tools WHERE slug = 'text-simplifier';
1