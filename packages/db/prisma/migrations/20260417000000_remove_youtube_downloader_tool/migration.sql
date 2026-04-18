DELETE FROM favorites WHERE tool_id = (SELECT id FROM tools WHERE slug = 'youtube-downloader');
DELETE FROM tools WHERE slug = 'youtube-downloader';
