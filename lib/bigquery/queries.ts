export const TOTAL_REVENUE_24 = `SELECT CAST(SUM(CAST(c.amount AS BIGNUMERIC)) AS STRING) AS total_amount 
FROM lens-public-data.polygon.public_collect_post_nft_ownership p
JOIN lens-public-data.polygon.public_publication_collect_module_details c
  ON p.post_id = c.publication_id
WHERE c.block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 24 HOUR)`;

export const TOTAL_REVENUE_48 = `SELECT CAST(SUM(CAST(c.amount AS BIGNUMERIC)) AS STRING) AS total_amount 
FROM lens-public-data.polygon.public_collect_post_nft_ownership p
JOIN lens-public-data.polygon.public_publication_collect_module_details c
  ON p.post_id = c.publication_id
  WHERE c.block_timestamp BETWEEN TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 48 HOUR) AND TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 24 HOUR)`;

export const UNIQUE_COLLECTS_24 = `SELECT 
owner_address, 
COUNT(DISTINCT post_id) AS unique_collects_24h,
MAX(block_timestamp) AS latest_block_timestamp
FROM lens-public-data.polygon.public_collect_post_nft_ownership
WHERE block_timestamp BETWEEN TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 24 HOUR) AND CURRENT_TIMESTAMP()
GROUP BY owner_address
ORDER BY unique_collects_24h DESC
LIMIT 50`;

export const TOTAL_POST_W_REVENUE_24 = `SELECT 
p.post_id, 
CAST(SUM(CAST(c.amount AS BIGNUMERIC)) AS STRING) AS total_amount 
FROM lens-public-data.polygon.public_collect_post_nft_ownership p
JOIN lens-public-data.polygon.public_publication_collect_module_details c
ON p.post_id = c.publication_id
WHERE c.block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 24 HOUR)
GROUP BY p.post_id
HAVING total_amount IS NOT NULL`;

export const TOTAL_POST_W_REVENUE_48 = `SELECT 
p.post_id, 
CAST(SUM(CAST(c.amount AS BIGNUMERIC)) AS STRING) AS total_amount 
FROM lens-public-data.polygon.public_collect_post_nft_ownership p
JOIN lens-public-data.polygon.public_publication_collect_module_details c
ON p.post_id = c.publication_id
WHERE c.block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 48 HOUR)
GROUP BY p.post_id
HAVING total_amount IS NOT NULL`;

export const TOP_FOLLOWED_ACCOUNTS_48 = `SELECT 
f.giver_profile_id, 
COUNT(*) AS count,
MAX(f.block_timestamp) AS last_timestamp,
p.handle
FROM lens-public-data.polygon.public_follow_nft_ownership f
JOIN lens-public-data.polygon.public_profile p
ON f.giver_profile_id = p.profile_id
WHERE f.block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 48 HOUR)
GROUP BY f.giver_profile_id, p.handle
ORDER BY count DESC
LIMIT 12
`;
